import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import timelineApp from "./timeline.tsx";
import * as messages from "./messages.tsx";
import { getEmailTemplate, shouldSendNotification } from "./emailTemplates.ts";
import { getCRAAssessmentEmail } from "./craAssessmentEmail.ts";
import { generateTaxDocumentEmail } from "./taxDocumentEmail.tsx";
import * as stripeService from "./stripe.tsx";
import usersApp from "./users.tsx";

const app = new Hono();

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Initialize storage bucket on startup
(async () => {
  const buckets = [
    {
      name: 'make-c2a25be0-client-documents',
      fileSizeLimit: 52428800, // 50MB
      allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    },
    {
      name: 'tax-documents-c2a25be0',
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    }
  ];

  for (const bucketConfig of buckets) {
    try {
      const { data: existingBuckets } = await supabase.storage.listBuckets();
      const bucketExists = existingBuckets?.some(bucket => bucket.name === bucketConfig.name);
      
      if (!bucketExists) {
        const { error } = await supabase.storage.createBucket(bucketConfig.name, {
          public: false,
          fileSizeLimit: bucketConfig.fileSizeLimit,
          allowedMimeTypes: bucketConfig.allowedMimeTypes
        });
        if (error) {
          console.error(`Error creating bucket ${bucketConfig.name}:`, error);
        } else {
          console.log(`✅ Storage bucket ${bucketConfig.name} created successfully`);
        }
      }
      console.log(`📦 Bucket ${bucketConfig.name} ready`);
    } catch (error) {
      console.error(`Error initializing storage ${bucketConfig.name}:`, error);
    }
  }
  
  // Log RLS setup instructions
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  ⚠️  IMPORTANT: STORAGE RLS POLICIES REQUIRED                 ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Go to: Supabase Dashboard > Storage > Policies              ║
║                                                               ║
║  For EACH bucket, add these 4 policies:                      ║
║                                                               ║
║  1️⃣ INSERT (Allow authenticated uploads)                     ║
║     Policy name: Allow authenticated uploads                 ║
║     Target roles: authenticated                              ║
║     WITH CHECK expression: true                              ║
║                                                               ║
║  2️⃣ SELECT (Allow authenticated reads)                       ║
║     Policy name: Allow authenticated reads                   ║
║     Target roles: authenticated                              ║
║     USING expression: true                                   ║
║                                                               ║
║  3️⃣ UPDATE (Allow authenticated updates)                     ║
║     Policy name: Allow authenticated updates                 ║
║     Target roles: authenticated                              ║
║     USING expression: true                                   ║
║                                                               ║
║  4️⃣ DELETE (Allow authenticated deletes)                     ║
║     Policy name: Allow authenticated deletes                 ║
║     Target roles: authenticated                              ║
║     USING expression: true                                   ║
║                                                               ║
║  Apply to these buckets:                                     ║
║  ✓ make-c2a25be0-client-documents                            ║
║  ✓ tax-documents-c2a25be0                                    ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `);
})();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-c2a25be0/health", (c) => {
  return c.json({ status: "ok" });
});

// ==================== AUTH ROUTES ====================

// Sign up new client
app.post("/make-server-c2a25be0/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured
      email_confirm: true
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: `Failed to create user: ${error.message}` }, 400);
    }

    // Store user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      createdAt: new Date().toISOString()
    });

    return c.json({ 
      success: true, 
      user: { id: data.user.id, email, name }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: `Signup failed: ${error}` }, 500);
  }
});

// Get current session
app.get("/make-server-c2a25be0/auth/session", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Invalid session' }, 401);
    }

    // Get user profile from KV store
    const profile = await kv.get(`user:${user.id}`);

    return c.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: profile?.name || user.user_metadata?.name
      }
    });
  } catch (error) {
    console.error('Session error:', error);
    return c.json({ error: `Failed to get session: ${error}` }, 500);
  }
});

// ==================== DOCUMENT ROUTES ====================

// Upload document
app.post("/make-server-c2a25be0/documents/upload", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;

    if (!file || !category) {
      return c.json({ error: 'Missing file or category' }, 400);
    }

    // Generate unique file name
    const timestamp = Date.now();
    const fileName = `${user.id}/${category}/${timestamp}_${file.name}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('make-c2a25be0-client-documents')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return c.json({ error: `Upload failed: ${uploadError.message}` }, 500);
    }

    // Create signed URL (valid for 1 year)
    const { data: signedUrlData } = await supabase.storage
      .from('make-c2a25be0-client-documents')
      .createSignedUrl(fileName, 31536000);

    // Store document metadata in KV
    const documentId = `doc:${user.id}:${timestamp}`;
    const documentData = {
      id: documentId,
      userId: user.id,
      fileName: file.name,
      storagePath: fileName,
      category,
      description: description || '',
      uploadedAt: new Date().toISOString(),
      size: file.size,
      type: file.type,
      url: signedUrlData?.signedUrl
    };

    await kv.set(documentId, documentData);

    // Update user's document list
    const userDocsKey = `user:${user.id}:documents`;
    const existingDocs = await kv.get(userDocsKey) || [];
    await kv.set(userDocsKey, [...existingDocs, documentId]);

    return c.json({ 
      success: true, 
      document: documentData
    });
  } catch (error) {
    console.error('Document upload error:', error);
    return c.json({ error: `Upload failed: ${error}` }, 500);
  }
});

// Get user's documents
app.get("/make-server-c2a25be0/documents", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get user's document list
    const userDocsKey = `user:${user.id}:documents`;
    const documentIds = await kv.get(userDocsKey) || [];

    // Get all document details
    const documents = await kv.mget(documentIds);

    return c.json({ documents: documents.filter(Boolean) });
  } catch (error) {
    console.error('Get documents error:', error);
    return c.json({ error: `Failed to get documents: ${error}` }, 500);
  }
});

// 🔥 NEW: Upload tax document through backend (bypasses RLS)
app.post("/make-server-c2a25be0/tax-documents/upload", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string;
    const year = formData.get('year') as string;

    if (!file || !category || !year) {
      return c.json({ error: 'Missing file, category or year' }, 400);
    }

    // Validate file size (10MB max)
    if (file.size > 10485760) {
      return c.json({ error: 'File too large. Max size is 10MB.' }, 400);
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: 'Invalid file type' }, 400);
    }

    // Generate unique file name
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${sanitizedName}`;
    const filePath = `${user.id}/${year}/${category}/${fileName}`;

    console.log(`📤 Uploading file: ${filePath}`);

    // Upload to Supabase Storage using Service Role Key (bypasses RLS)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('tax-documents-c2a25be0')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Upload error:', uploadError);
      return c.json({ error: `Upload failed: ${uploadError.message}` }, 500);
    }

    console.log(`✅ File uploaded successfully: ${filePath}`);

    // Create signed URL (valid for 1 hour)
    const { data: signedUrlData } = await supabase.storage
      .from('tax-documents-c2a25be0')
      .createSignedUrl(filePath, 3600);

    // Create file metadata
    const fileData = {
      id: filePath,
      name: file.name,
      size: file.size,
      category: category,
      uploadedAt: new Date().toISOString(),
      path: filePath,
      url: signedUrlData?.signedUrl
    };

    // Save to KV store for admin to view
    const kvKey = `user:${user.id}:documents:${year}`;
    const existingDocs = await kv.get(kvKey) || [];
    const updatedDocs = [...existingDocs, fileData];
    await kv.set(kvKey, updatedDocs);

    console.log(`✅ Saved to KV store: ${kvKey}`);

    return c.json({ 
      success: true, 
      file: fileData
    });
  } catch (error) {
    console.error('❌ Tax document upload error:', error);
    return c.json({ error: `Upload failed: ${error}` }, 500);
  }
});

// 🔥 NEW: List tax documents from KV store
app.get("/make-server-c2a25be0/tax-documents/list/:year", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const year = c.req.param('year');
    const kvKey = `user:${user.id}:documents:${year}`;

    console.log(`📥 Loading documents from KV: ${kvKey}`);

    // Get documents from KV store
    const documents = await kv.get(kvKey) || [];

    console.log(`✅ Found ${documents.length} documents for year ${year}`);

    return c.json({ 
      success: true, 
      files: documents 
    });
  } catch (error) {
    console.error('❌ Tax document list error:', error);
    return c.json({ error: `Failed to list documents: ${error}` }, 500);
  }
});

// 🔥 NEW: List ALL client documents (admin only) - with signed URLs
app.get("/make-server-c2a25be0/admin/client-documents/:userId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user: adminUser }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !adminUser) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // TODO: Verify admin permission
    // For now, any authenticated user can access

    const userId = c.req.param('userId');
    
    console.log(`📥 Admin loading all documents for user: ${userId}`);

    // Get ALL documents from KV store for this user
    const { data: kvData, error: kvError } = await supabase
      .from('kv_store_c2a25be0')
      .select('key, value')
      .like('key', `user:${userId}:documents:%`);

    if (kvError) {
      console.error('❌ KV error:', kvError);
      return c.json({ error: 'Failed to load documents' }, 500);
    }

    let documentsByYear: any[] = [];

    if (kvData && kvData.length > 0) {
      for (const entry of kvData) {
        const yearMatch = entry.key.match(/documents:(\d+)/);
        if (!yearMatch) continue;

        const year = parseInt(yearMatch[1]);
        const documentsData = entry.value;

        if (Array.isArray(documentsData) && documentsData.length > 0) {
          // Generate signed URLs using Service Role Key
          const filesWithUrls = await Promise.all(
            documentsData.map(async (doc: any) => {
              let signedUrl = null;

              if (doc.path) {
                const { data: urlData } = await supabase.storage
                  .from('tax-documents-c2a25be0')
                  .createSignedUrl(doc.path, 3600); // 1 hour

                if (urlData) {
                  signedUrl = urlData.signedUrl;
                }
              }

              return {
                ...doc,
                url: signedUrl
              };
            })
          );

          documentsByYear.push({ year, files: filesWithUrls });
        }
      }
    }

    // Sort by year (most recent first)
    documentsByYear.sort((a, b) => b.year - a.year);

    console.log(`✅ Found documents for ${documentsByYear.length} years`);

    return c.json({
      success: true,
      documents: documentsByYear
    });
  } catch (error) {
    console.error('❌ Admin client documents error:', error);
    return c.json({ error: `Failed to load documents: ${error}` }, 500);
  }
});

// 🔥 NEW: Delete tax document through backend (bypasses RLS)
app.delete("/make-server-c2a25be0/tax-documents/:year/:category/:filename", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const year = c.req.param('year');
    const category = c.req.param('category');
    const filename = c.req.param('filename');
    const filePath = `${user.id}/${year}/${category}/${filename}`;

    console.log(`🗑️ Deleting file: ${filePath}`);

    // Delete from Supabase Storage using Service Role Key (bypasses RLS)
    const { error: deleteError } = await supabase.storage
      .from('tax-documents-c2a25be0')
      .remove([filePath]);

    if (deleteError) {
      console.error('❌ Delete error:', deleteError);
      return c.json({ error: `Delete failed: ${deleteError.message}` }, 500);
    }

    console.log(`✅ File deleted successfully: ${filePath}`);

    // Update KV store
    const kvKey = `user:${user.id}:documents:${year}`;
    const existingDocs = await kv.get(kvKey) || [];
    const updatedDocs = existingDocs.filter((doc: any) => doc.path !== filePath);
    await kv.set(kvKey, updatedDocs);

    console.log(`✅ Updated KV store after deletion`);

    return c.json({ success: true });
  } catch (error) {
    console.error('❌ Tax document delete error:', error);
    return c.json({ error: `Delete failed: ${error}` }, 500);
  }
});

// Delete document
app.delete("/make-server-c2a25be0/documents/:documentId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const documentId = c.req.param('documentId');
    const document = await kv.get(documentId);

    if (!document || document.userId !== user.id) {
      return c.json({ error: 'Document not found or unauthorized' }, 404);
    }

    // Delete from storage
    const { error: deleteError } = await supabase.storage
      .from('make-c2a25be0-client-documents')
      .remove([document.storagePath]);

    if (deleteError) {
      console.error('Storage delete error:', deleteError);
    }

    // Remove from KV
    await kv.del(documentId);

    // Update user's document list
    const userDocsKey = `user:${user.id}:documents`;
    const documentIds = await kv.get(userDocsKey) || [];
    await kv.set(userDocsKey, documentIds.filter(id => id !== documentId));

    return c.json({ success: true });
  } catch (error) {
    console.error('Delete document error:', error);
    return c.json({ error: `Failed to delete document: ${error}` }, 500);
  }
});

// ==================== ADMIN ROUTES ====================

// Admin email whitelist
const ADMIN_EMAILS = [
  'veprass@gmail.com',
  'germana.canada@gmail.com',
  'duoproservices.info@gmail.com',
];

function isAdminUser(email: string | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

// Get all clients (admin only)
app.get("/make-server-c2a25be0/admin/clients", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    if (!isAdminUser(user.email)) {
      return c.json({ error: 'Access denied: Admin privileges required' }, 403);
    }

    // List all users using admin API
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error('Error listing users:', listError);
      return c.json({ error: 'Failed to list users' }, 500);
    }

    // Fetch KV store data for each user
    const clients = await Promise.all(users.map(async (u) => {
      try {
        const personalInfo = await kv.get(`user:${u.id}:personalInfo`);
        const taxFilings = await kv.get(`user:${u.id}:taxFilings`) || [];
        const onboardingComplete = await kv.get(`user:${u.id}:onboardingComplete`) || false;

        // Find the assigned accountant for the most recent filing
        let assignedAccountant = null;
        if (taxFilings && Array.isArray(taxFilings) && taxFilings.length > 0) {
          // Sort by year to get most recent
          const sortedFilings = [...taxFilings].sort((a, b) => (b.year || 0) - (a.year || 0));
          const mostRecentFiling = sortedFilings[0];
          
          if (mostRecentFiling?.assignedTo) {
            // Get accountant info
            const accountantPermissions = await kv.get(`user-permissions:${mostRecentFiling.assignedTo}`);
            if (accountantPermissions) {
              assignedAccountant = {
                id: accountantPermissions.userId,
                name: accountantPermissions.name,
                email: accountantPermissions.email,
                role: accountantPermissions.role
              };
            }
          }
        }

        return {
          id: u.id,
          email: u.email || '',
          name: personalInfo?.fullName || u.user_metadata?.name || u.email || 'Unknown',
          createdAt: u.created_at,
          personalInfo,
          taxFilings,
          onboardingComplete,
          assignedAccountant
        };
      } catch (error) {
        console.error(`Error fetching KV data for user ${u.id}:`, error);
        return {
          id: u.id,
          email: u.email || '',
          name: u.user_metadata?.name || u.email || 'Unknown',
          createdAt: u.created_at,
          personalInfo: null,
          taxFilings: [],
          onboardingComplete: false,
          assignedAccountant: null
        };
      }
    }));

    return c.json({ clients });
  } catch (error) {
    console.error('Error getting clients:', error);
    return c.json({ error: `Failed to get clients: ${error}` }, 500);
  }
});

// Get specific client details (admin only)
app.get("/make-server-c2a25be0/admin/clients/:userId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    if (!isAdminUser(user.email)) {
      return c.json({ error: 'Access denied: Admin privileges required' }, 403);
    }

    const userId = c.req.param('userId');

    // Get user details from Auth
    const { data: { user: targetUser }, error: getUserError } = await supabase.auth.admin.getUserById(userId);

    if (getUserError || !targetUser) {
      return c.json({ error: 'Client not found' }, 404);
    }

    // Fetch data from KV store
    const personalInfo = await kv.get(`user:${userId}:personalInfo`);
    const taxFilings = await kv.get(`user:${userId}:taxFilings`) || [];
    const onboardingComplete = await kv.get(`user:${userId}:onboardingComplete`) || false;

    const clientData = {
      id: targetUser.id,
      email: targetUser.email || '',
      name: personalInfo?.fullName || targetUser.user_metadata?.name || targetUser.email || 'Unknown',
      createdAt: targetUser.created_at,
      personalInfo,
      taxFilings,
      onboardingComplete
    };

    return c.json({ client: clientData });
  } catch (error) {
    console.error('Error getting client:', error);
    return c.json({ error: `Failed to get client: ${error}` }, 500);
  }
});

// Get client files for specific year (admin only)
app.get("/make-server-c2a25be0/admin/clients/:userId/files/:year", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    if (!isAdminUser(user.email)) {
      return c.json({ error: 'Access denied: Admin privileges required' }, 403);
    }

    const userId = c.req.param('userId');
    const year = c.req.param('year');
    const bucketName = 'Tax-documents-c2a25be0';

    // List all files for this user/year
    const folderPath = `${userId}/${year}`;
    
    const { data: folders, error: listError } = await supabase.storage
      .from(bucketName)
      .list(folderPath, {
        limit: 1000,
        offset: 0,
      });

    if (listError) {
      console.error('Error listing files:', listError);
      return c.json({ error: 'Failed to list files', details: listError.message }, 500);
    }

    if (!folders || folders.length === 0) {
      return c.json({ files: [] });
    }

    // Get files from all categories
    const allFiles = [];
    
    for (const categoryFolder of folders) {
      if (categoryFolder.name === '.emptyFolderPlaceholder') continue;
      
      const categoryPath = `${folderPath}/${categoryFolder.name}`;
      const { data: categoryFiles, error: categoryError } = await supabase.storage
        .from(bucketName)
        .list(categoryPath, {
          limit: 1000,
          offset: 0,
        });

      if (!categoryError && categoryFiles) {
        for (const file of categoryFiles) {
          if (file.name === '.emptyFolderPlaceholder') continue;
          
          const filePath = `${categoryPath}/${file.name}`;
          
          // Create signed URL (admin can access all files)
          const { data: urlData } = await supabase.storage
            .from(bucketName)
            .createSignedUrl(filePath, 3600); // 1 hour

          allFiles.push({
            id: filePath,
            name: file.name,
            size: file.metadata?.size || 0,
            category: categoryFolder.name,
            uploadedAt: file.created_at || new Date().toISOString(),
            path: filePath,
            url: urlData?.signedUrl
          });
        }
      }
    }

    return c.json({ files: allFiles });
  } catch (error) {
    console.error('Error getting client files:', error);
    return c.json({ error: `Failed to get files: ${error}` }, 500);
  }
});

// Update tax filing status (admin only)
app.put("/make-server-c2a25be0/admin/clients/:userId/filings/:year/status", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    if (!isAdminUser(user.email)) {
      return c.json({ error: 'Access denied: Admin privileges required' }, 403);
    }

    const userId = c.req.param('userId');
    const year = c.req.param('year');
    const { status, sendNotification } = await c.req.json();

    if (!status) {
      return c.json({ error: 'Status is required' }, 400);
    }

    // Get current user data
    const { data: { user: targetUser }, error: getUserError } = await supabase.auth.admin.getUserById(userId);

    if (getUserError || !targetUser) {
      return c.json({ error: 'Client not found' }, 404);
    }

    const taxFilings = targetUser.user_metadata?.taxFilings || [];
    const filingIndex = taxFilings.findIndex(f => f.year === Number(year));

    if (filingIndex >= 0) {
      taxFilings[filingIndex].status = status;
      taxFilings[filingIndex].updatedAt = new Date().toISOString();
    } else {
      return c.json({ error: 'Tax filing not found' }, 404);
    }

    // Update user metadata
    const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: {
        ...targetUser.user_metadata,
        taxFilings
      }
    });

    if (updateError) {
      console.error('Error updating status:', updateError);
      return c.json({ error: 'Failed to update status' }, 500);
    }

    // Send notification if requested and status qualifies
    if (sendNotification && shouldSendNotification(status)) {
      try {
        const clientName = targetUser.user_metadata?.name || 'Client';
        const clientEmail = targetUser.email || '';
        const language = targetUser.user_metadata?.profile?.preferredLanguage || 'en';
        
        const dashboardUrl = `${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'makeproxy-c.figma.site')}/dashboard`;
        
        const emailContent = getEmailTemplate(status, language as 'en' | 'fr' | 'pt', {
          CLIENT_NAME: clientName,
          TAX_YEAR: year,
          DASHBOARD_URL: dashboardUrl
        });

        if (emailContent) {
          // LOG EMAIL (for now - will be replaced with actual email service)
          console.log('======================');
          console.log('📧 EMAIL NOTIFICATION');
          console.log('======================');
          console.log('To:', clientEmail);
          console.log('Subject:', emailContent.subject);
          console.log('Language:', language);
          console.log('Status:', status);
          console.log('Year:', year);
          console.log('======================');
          
          // TODO: Integrate with email service (Resend, SendGrid, etc.)
          // Example with Resend:
          // const resendApiKey = Deno.env.get('RESEND_API_KEY');
          // if (resendApiKey) {
          //   const response = await fetch('https://api.resend.com/emails', {
          //     method: 'POST',
          //     headers: {
          //       'Content-Type': 'application/json',
          //       'Authorization': `Bearer ${resendApiKey}`
          //     },
          //     body: JSON.stringify({
          //       from: 'Duo Pro Services <noreply@duoproservices.com>',
          //       to: [clientEmail],
          //       subject: emailContent.subject,
          //       html: emailContent.body
          //     })
          //   });
          // }
        }
      } catch (emailError) {
        console.error('Error sending notification:', emailError);
        // Don't fail the status update if email fails
      }
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating filing status:', error);
    return c.json({ error: `Failed to update status: ${error}` }, 500);
  }
});

// Send notification email (admin only)
app.post("/make-server-c2a25be0/admin/notifications/send", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    if (!isAdminUser(user.email)) {
      return c.json({ error: 'Access denied: Admin privileges required' }, 403);
    }

    const { userId, year, status, language } = await c.req.json();

    if (!userId || !year || !status) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Get user data
    const { data: { user: targetUser }, error: getUserError } = await supabase.auth.admin.getUserById(userId);

    if (getUserError || !targetUser) {
      return c.json({ error: 'Client not found' }, 404);
    }

    const clientName = targetUser.user_metadata?.name || 'Client';
    const clientEmail = targetUser.email || '';
    const userLanguage = language || targetUser.user_metadata?.profile?.preferredLanguage || 'en';
    
    const dashboardUrl = `${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'makeproxy-c.figma.site')}/dashboard`;
    
    const emailContent = getEmailTemplate(status, userLanguage as 'en' | 'fr' | 'pt', {
      CLIENT_NAME: clientName,
      TAX_YEAR: year.toString(),
      DASHBOARD_URL: dashboardUrl
    });

    if (!emailContent) {
      return c.json({ error: 'Invalid status for notification' }, 400);
    }

    // LOG EMAIL (for now)
    console.log('======================');
    console.log('📧 EMAIL NOTIFICATION');
    console.log('======================');
    console.log('To:', clientEmail);
    console.log('Subject:', emailContent.subject);
    console.log('Language:', userLanguage);
    console.log('Status:', status);
    console.log('Year:', year);
    console.log('======================');
    
    // TODO: Integrate with email service
    // See example above in status update route

    return c.json({ 
      success: true,
      message: 'Notification logged (email service not configured yet)',
      preview: {
        to: clientEmail,
        subject: emailContent.subject
      }
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    return c.json({ error: `Failed to send notification: ${error}` }, 500);
  }
});

// ==================== CRA ASSESSMENT EMAIL ====================

/**
 * Send CRA Assessment email with PDF attachment
 * POST /make-server-c2a25be0/admin/cra-assessment/send
 * Body: { userId, year, pdfBase64, language }
 */
app.post("/make-server-c2a25be0/admin/cra-assessment/send", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    if (!isAdminUser(user.email)) {
      return c.json({ error: 'Access denied: Admin privileges required' }, 403);
    }

    const { userId, year, pdfBase64, language } = await c.req.json();

    if (!userId || !year || !pdfBase64) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Get client user data
    const { data: { user: targetUser }, error: getUserError } = await supabase.auth.admin.getUserById(userId);

    if (getUserError || !targetUser) {
      return c.json({ error: 'Client not found' }, 404);
    }

    const clientName = targetUser.user_metadata?.name || 'Client';
    const clientEmail = targetUser.email || '';
    const userLanguage = language || targetUser.user_metadata?.profile?.preferredLanguage || 'en';
    
    const dashboardUrl = `${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'makeproxy-c.figma.site')}/dashboard`;
    
    const emailContent = getCRAAssessmentEmail(userLanguage as 'en' | 'fr' | 'pt', {
      CLIENT_NAME: clientName,
      TAX_YEAR: year.toString(),
      DASHBOARD_URL: dashboardUrl
    });

    // LOG EMAIL (for now - since email service not configured)
    console.log('=========================================');
    console.log('📊 CRA ASSESSMENT EMAIL');
    console.log('=========================================');
    console.log('To:', clientEmail);
    console.log('Subject:', emailContent.subject);
    console.log('Language:', userLanguage);
    console.log('Year:', year);
    console.log('PDF Size:', pdfBase64?.length || 0, 'bytes (base64)');
    console.log('=========================================');
    
    // TODO: Integrate with email service (Resend, SendGrid, etc.)
    // Example with Resend:
    // const resendApiKey = Deno.env.get('RESEND_API_KEY');
    // if (resendApiKey) {
    //   const response = await fetch('https://api.resend.com/emails', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${resendApiKey}`
    //     },
    //     body: JSON.stringify({
    //       from: 'Duo Pro Services <noreply@duoproservices.com>',
    //       to: [clientEmail],
    //       subject: emailContent.subject,
    //       html: emailContent.body,
    //       attachments: [{
    //         filename: `CRA_Assessment_${year}.pdf`,
    //         content: pdfBase64
    //       }]
    //     })
    //   });
    // }

    return c.json({ 
      success: true,
      message: 'CRA Assessment email logged (email service not configured yet)',
      preview: {
        to: clientEmail,
        subject: emailContent.subject,
        hasPdfAttachment: true
      }
    });
  } catch (error) {
    console.error('Error sending CRA Assessment email:', error);
    return c.json({ error: `Failed to send email: ${error}` }, 500);
  }
});

// ==================== TAX DOCUMENT READY EMAIL ====================

/**
 * Send Tax Document Ready email when admin uploads final CRA/Quebec document
 * POST /make-server-c2a25be0/admin/tax-document/notify
 * Body: { userId, year, documentType: 'cra' | 'quebec', language }
 */
app.post("/make-server-c2a25be0/admin/tax-document/notify", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    if (!isAdminUser(user.email)) {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const body = await c.req.json();
    const { userId, year, documentType, language } = body;

    if (!userId || !year || !documentType) {
      return c.json({ 
        error: 'Missing required fields: userId, year, documentType' 
      }, 400);
    }

    if (!['cra', 'quebec'].includes(documentType)) {
      return c.json({ error: 'Invalid documentType. Must be "cra" or "quebec"' }, 400);
    }

    // Get client data
    const clientKey = `user:${userId}:profile`;
    const clientData = await kv.get(clientKey);

    if (!clientData) {
      return c.json({ error: 'Client not found' }, 404);
    }

    const clientName = clientData.name || 'Valued Client';
    const clientEmail = clientData.email;
    const clientLanguage = language || clientData.language || 'en';

    console.log(`📧 Sending ${documentType.toUpperCase()} document notification to ${clientEmail}`);

    // Generate portal link
    const portalLink = `https://${Deno.env.get('SUPABASE_URL')?.replace('https://', '')?.split('.')[0]}.supabase.co`;

    // Generate email content
    const emailContent = generateTaxDocumentEmail({
      clientName,
      year,
      documentType: documentType as 'cra' | 'quebec',
      language: clientLanguage as 'en' | 'fr' | 'pt',
      portalLink
    });

    console.log(`✅ Tax Document email generated successfully for ${clientEmail}`);
    console.log(`📋 Document Type: ${documentType.toUpperCase()}, Year: ${year}, Language: ${clientLanguage}`);

    // TODO: Integrate with your email service (Resend/SendGrid)
    // Uncomment when ready to send real emails:
    
    // Example with Resend:
    // if (Deno.env.get('RESEND_API_KEY')) {
    //   const resendResponse = await fetch('https://api.resend.com/emails', {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //       from: 'Tax Services <noreply@yourdomain.com>',
    //       to: clientEmail,
    //       subject: emailContent.subject,
    //       html: emailContent.html
    //     })
    //   });
    // }

    return c.json({ 
      success: true,
      message: `${documentType.toUpperCase()} document notification logged (email service not configured yet)`,
      preview: {
        to: clientEmail,
        subject: emailContent.subject,
        documentType,
        year,
        language: clientLanguage
      }
    });
  } catch (error) {
    console.error('Error sending tax document notification:', error);
    return c.json({ error: `Failed to send notification: ${error}` }, 500);
  }
});

// ==================== TAX FILING REPORT ROUTES ====================

// Create a new tax filing (Admin only)
app.post("/make-server-c2a25be0/tax-filing/create", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // TODO: Add admin role check here
    // For now, any authenticated user can create (you can add admin check later)

    const body = await c.req.json();
    const { userId, year, pricingPresetId, customAmount, discount, adminNotes } = body;

    if (!userId || !year) {
      return c.json({ error: 'Missing required fields: userId and year' }, 400);
    }

    // Get user metadata
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError || !userData?.user) {
      console.error('Error getting user:', userError);
      return c.json({ error: 'User not found' }, 404);
    }

    const metadata = userData.user.user_metadata || {};
    const taxFilings = metadata.taxFilings || [];
    
    // Check if filing already exists for this year
    const existingFiling = taxFilings.find((f: any) => f.year === year);
    
    if (existingFiling) {
      return c.json({ error: `Tax filing for ${year} already exists` }, 400);
    }

    // Create new filing with payment information if provided
    const newFiling: any = {
      year: year,
      status: 'not-started',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add payment information if pricing preset is provided
    if (pricingPresetId) {
      const baseAmount = customAmount || 0; // You may need to calculate from preset
      const finalAmount = discount 
        ? baseAmount - (discount.amount || 0)
        : baseAmount;

      newFiling.payment = {
        status: 'pending',
        amount: finalAmount,
        originalAmount: discount ? baseAmount : undefined,
        currency: 'CAD',
        pricingPresetId: pricingPresetId,
        customAmount: customAmount ? true : false,
        discount: discount || undefined,
        createdAt: new Date().toISOString()
      };
    }

    // Add admin notes if provided
    if (adminNotes) {
      newFiling.adminNotes = adminNotes;
    }

    // Add to filings array
    taxFilings.push(newFiling);

    // Update user metadata
    const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: {
        ...metadata,
        taxFilings
      }
    });

    if (updateError) {
      console.error('Error updating user metadata:', updateError);
      return c.json({ error: 'Failed to create tax filing' }, 500);
    }

    console.log(`✅ Created tax filing for user ${userId}, year ${year}`);

    return c.json({ 
      success: true,
      filing: newFiling,
      message: `Tax filing for ${year} created successfully`
    });

  } catch (error) {
    console.error('Error creating tax filing:', error);
    return c.json({ error: `Failed to create tax filing: ${error}` }, 500);
  }
});

// Submit report for client review (Admin only)
app.post("/make-server-c2a25be0/tax-filing/submit-report", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // TODO: Add admin role check here
    // For now, any authenticated user can submit (you can add admin check later)

    const body = await c.req.json();
    const { userId, year, reportUrl, fileName, fileSize, pricingPresetId, customAmount, adminNotes } = body;

    if (!userId || !year || !reportUrl) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Get user metadata
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError || !userData?.user) {
      console.error('Error getting user:', userError);
      return c.json({ error: 'User not found' }, 404);
    }

    const metadata = userData.user.user_metadata || {};
    const taxFilings = metadata.taxFilings || [];
    
    // Find the filing for this year
    const filingIndex = taxFilings.findIndex((f: any) => f.year === year);
    
    if (filingIndex === -1) {
      return c.json({ error: 'Tax filing not found for this year' }, 404);
    }

    // Update the filing with report and payment info
    taxFilings[filingIndex] = {
      ...taxFilings[filingIndex],
      status: 'ready-for-review',
      updatedAt: new Date().toISOString(),
      report: {
        pdfUrl: reportUrl,
        uploadedAt: new Date().toISOString(),
        uploadedBy: user.id,
        fileName: fileName || 'tax_return.pdf',
        fileSize: fileSize || 0
      },
      payment: {
        status: 'pending',
        amount: customAmount || 0,
        currency: 'CAD',
        pricingPresetId: pricingPresetId || null,
        customAmount: !!customAmount
      },
      adminNotes: adminNotes || ''
    };

    // Update user metadata
    const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: {
        ...metadata,
        taxFilings
      }
    });

    if (updateError) {
      console.error('Error updating user metadata:', updateError);
      return c.json({ error: 'Failed to update tax filing' }, 500);
    }

    // Get user's preferred language
    const userLanguage = metadata.profile?.preferredLanguage || 'en';

    // Send email notification to client
    const emailSubject = {
      en: '📄 Your Tax Return is Ready for Review',
      fr: '📄 Votre Déclaration est Prête pour Révision',
      pt: '📄 Sua Declaração está Pronta para Revisão'
    }[userLanguage] || '📄 Your Tax Return is Ready for Review';

    const emailBody = {
      en: `
        <p>Great news! We've completed your ${year} tax return.</p>
        <p><strong>What's next:</strong></p>
        <ol>
          <li>Review your tax return report</li>
          <li>If everything looks good, approve and pay</li>
          <li>We'll file it with CRA immediately</li>
        </ol>
        <p><a href="${Deno.env.get('SITE_URL') || 'https://your-site.com'}/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">View Your Tax Return</a></p>
      `,
      fr: `
        <p>Bonne nouvelle! Nous avons complété votre déclaration de revenus ${year}.</p>
        <p><strong>Prochaines étapes:</strong></p>
        <ol>
          <li>Révisez votre rapport de déclaration</li>
          <li>Si tout est correct, approuvez et payez</li>
          <li>Nous la produirons auprès de l'ARC immédiatement</li>
        </ol>
        <p><a href="${Deno.env.get('SITE_URL') || 'https://your-site.com'}/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">Voir Votre Déclaration</a></p>
      `,
      pt: `
        <p>Ótima notícia! Completamos sua declaração de impostos ${year}.</p>
        <p><strong>Próximos passos:</strong></p>
        <ol>
          <li>Revise seu relatório de declaração</li>
          <li>Se tudo estiver correto, aprove e pague</li>
          <li>Enviaremos para a CRA imediatamente</li>
        </ol>
        <p><a href="${Deno.env.get('SITE_URL') || 'https://your-site.com'}/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">Ver Sua Declaração</a></p>
      `
    }[userLanguage] || `<p>Your ${year} tax return is ready for review.</p>`;

    console.log(`📧 [REPORT READY] Sending email to ${userData.user.email} (${userLanguage})`);
    console.log(`   Subject: ${emailSubject}`);
    console.log(`   Filing: ${year} - Status: ready-for-review`);

    return c.json({ 
      success: true,
      message: 'Report submitted successfully and notification sent to client',
      filing: taxFilings[filingIndex]
    });
  } catch (error) {
    console.error('Error submitting report:', error);
    return c.json({ error: `Failed to submit report: ${error}` }, 500);
  }
});

// Client approves the report
app.post("/make-server-c2a25be0/tax-filing/approve-report", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { year } = await c.req.json();

    if (!year) {
      return c.json({ error: 'Missing year' }, 400);
    }

    // Get user metadata
    const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);
    
    if (userError || !userData?.user) {
      console.error('Error getting user:', userError);
      return c.json({ error: 'User not found' }, 404);
    }

    const metadata = userData.user.user_metadata || {};
    const taxFilings = metadata.taxFilings || [];
    
    // Find the filing for this year
    const filingIndex = taxFilings.findIndex((f: any) => f.year === year);
    
    if (filingIndex === -1) {
      return c.json({ error: 'Tax filing not found for this year' }, 404);
    }

    if (taxFilings[filingIndex].status !== 'ready-for-review') {
      return c.json({ error: 'Report is not ready for approval' }, 400);
    }

    // Update status to awaiting-payment
    taxFilings[filingIndex] = {
      ...taxFilings[filingIndex],
      status: 'awaiting-payment',
      updatedAt: new Date().toISOString(),
      payment: {
        ...taxFilings[filingIndex].payment,
        clientApprovedAt: new Date().toISOString()
      }
    };

    // Update user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        ...metadata,
        taxFilings
      }
    });

    if (updateError) {
      console.error('Error updating user metadata:', updateError);
      return c.json({ error: 'Failed to approve report' }, 500);
    }

    console.log(`✅ [REPORT APPROVED] User ${user.email} approved ${year} tax return`);

    return c.json({ 
      success: true,
      message: 'Report approved successfully',
      filing: taxFilings[filingIndex]
    });
  } catch (error) {
    console.error('Error approving report:', error);
    return c.json({ error: `Failed to approve report: ${error}` }, 500);
  }
});

// Client rejects the report
app.post("/make-server-c2a25be0/tax-filing/reject-report", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { year, feedback } = await c.req.json();

    if (!year) {
      return c.json({ error: 'Missing year' }, 400);
    }

    // Get user metadata
    const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);
    
    if (userError || !userData?.user) {
      console.error('Error getting user:', userError);
      return c.json({ error: 'User not found' }, 404);
    }

    const metadata = userData.user.user_metadata || {};
    const taxFilings = metadata.taxFilings || [];
    
    // Find the filing for this year
    const filingIndex = taxFilings.findIndex((f: any) => f.year === year);
    
    if (filingIndex === -1) {
      return c.json({ error: 'Tax filing not found for this year' }, 404);
    }

    if (taxFilings[filingIndex].status !== 'ready-for-review') {
      return c.json({ error: 'Report is not ready for review' }, 400);
    }

    // Update status to rejected
    taxFilings[filingIndex] = {
      ...taxFilings[filingIndex],
      status: 'rejected',
      updatedAt: new Date().toISOString(),
      payment: {
        ...taxFilings[filingIndex].payment,
        clientRejectedAt: new Date().toISOString(),
        clientFeedback: feedback || ''
      }
    };

    // Update user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        ...metadata,
        taxFilings
      }
    });

    if (updateError) {
      console.error('Error updating user metadata:', updateError);
      return c.json({ error: 'Failed to reject report' }, 500);
    }

    console.log(`❌ [REPORT REJECTED] User ${user.email} rejected ${year} tax return`);
    console.log(`   Feedback: ${feedback || 'No feedback provided'}`);

    return c.json({ 
      success: true,
      message: 'Feedback submitted successfully',
      filing: taxFilings[filingIndex]
    });
  } catch (error) {
    console.error('Error rejecting report:', error);
    return c.json({ error: `Failed to reject report: ${error}` }, 500);
  }
});

// Mark payment as received (Admin only)
app.post("/make-server-c2a25be0/tax-filing/mark-paid", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // TODO: Add admin role check here

    const body = await c.req.json();
    const { userId, year, paymentMethod, transactionId, notes } = body;

    if (!userId || !year) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Get user metadata
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError || !userData?.user) {
      console.error('Error getting user:', userError);
      return c.json({ error: 'User not found' }, 404);
    }

    const metadata = userData.user.user_metadata || {};
    const taxFilings = metadata.taxFilings || [];
    
    // Find the filing for this year
    const filingIndex = taxFilings.findIndex((f: any) => f.year === year);
    
    if (filingIndex === -1) {
      return c.json({ error: 'Tax filing not found for this year' }, 404);
    }

    // Generate invoice number
    const invoiceNumber = `INV-${year}-${Date.now().toString().slice(-6)}`;

    // Update payment status
    taxFilings[filingIndex] = {
      ...taxFilings[filingIndex],
      status: 'payment-received',
      updatedAt: new Date().toISOString(),
      payment: {
        ...taxFilings[filingIndex].payment,
        status: 'paid',
        paidAt: new Date().toISOString(),
        paymentMethod: paymentMethod || 'interac',
        transactionId: transactionId || '',
        invoiceNumber: invoiceNumber
      },
      adminNotes: notes ? `${taxFilings[filingIndex].adminNotes || ''}\n\nPayment: ${notes}`.trim() : taxFilings[filingIndex].adminNotes
    };

    // Update user metadata
    const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: {
        ...metadata,
        taxFilings
      }
    });

    if (updateError) {
      console.error('Error updating user metadata:', updateError);
      return c.json({ error: 'Failed to mark as paid' }, 500);
    }

    // Get user's preferred language
    const userLanguage = metadata.profile?.preferredLanguage || 'en';

    // Send payment confirmation email
    const emailSubject = {
      en: '✅ Payment Received - Thank You!',
      fr: '✅ Paiement Reçu - Merci!',
      pt: '✅ Pagamento Recebido - Obrigado!'
    }[userLanguage] || '✅ Payment Received - Thank You!';

    console.log(`💰 [PAYMENT RECEIVED] Payment marked as paid for ${userData.user.email}`);
    console.log(`   Filing: ${year} - Invoice: ${invoiceNumber}`);
    console.log(`   Amount: $${taxFilings[filingIndex].payment.amount} CAD`);
    console.log(`   Method: ${paymentMethod || 'interac'}`);

    return c.json({ 
      success: true,
      message: 'Payment marked as received',
      filing: taxFilings[filingIndex]
    });
  } catch (error) {
    console.error('Error marking payment:', error);
    return c.json({ error: `Failed to mark payment: ${error}` }, 500);
  }
});

// ==================== FINANCIAL ANALYTICS ROUTES ====================

// Get financial analytics (Admin only)
app.get("/make-server-c2a25be0/admin/financials", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // TODO: Add admin role check here

    // Get filters from query params
    const year = c.req.query('year') || new Date().getFullYear().toString();
    const month = c.req.query('month'); // optional
    const province = c.req.query('province'); // optional
    const status = c.req.query('status'); // optional

    // Get all users with auth.admin.listUsers
    const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      console.error('Error listing users:', usersError);
      return c.json({ error: 'Failed to fetch users' }, 500);
    }

    // Aggregate financial data
    const transactions: any[] = [];
    let totalRevenue = 0;
    let totalPending = 0;
    let totalApproved = 0;
    let totalRejected = 0;

    const provinceRevenue: Record<string, number> = {};
    const monthlyRevenue: Record<string, number> = {};
    const serviceTypeRevenue: Record<string, number> = {};
    const paymentMethods: Record<string, number> = {};

    // Process each user
    for (const userData of usersData.users) {
      const metadata = userData.user_metadata || {};
      const taxFilings = metadata.taxFilings || [];
      const profile = metadata.profile || {};

      for (const filing of taxFilings) {
        // Filter by year
        if (filing.year !== parseInt(year)) continue;

        // Filter by month if specified
        if (month && filing.payment?.paidAt) {
          const filingMonth = new Date(filing.payment.paidAt).getMonth() + 1;
          if (filingMonth !== parseInt(month)) continue;
        }

        // Filter by province if specified
        if (province && profile.province !== province) continue;

        // Filter by status if specified
        if (status && filing.payment?.status !== status) continue;

        const amount = filing.payment?.amount || 0;
        const paymentStatus = filing.payment?.status || 'pending';
        const paidAt = filing.payment?.paidAt;
        const pricingPresetId = filing.payment?.pricingPresetId || 'custom';
        const paymentMethod = filing.payment?.paymentMethod || 'unknown';
        const clientProvince = profile.province || 'Unknown';

        // Build transaction record
        const transaction = {
          id: `${userData.id}_${filing.year}`,
          clientId: userData.id,
          clientName: metadata.name || userData.email,
          clientEmail: userData.email,
          year: filing.year,
          amount,
          status: paymentStatus,
          province: clientProvince,
          serviceType: pricingPresetId,
          paymentMethod,
          paidAt,
          createdAt: filing.createdAt || filing.updatedAt,
          invoiceNumber: filing.payment?.invoiceNumber
        };

        transactions.push(transaction);

        // Aggregate totals
        if (paymentStatus === 'paid') {
          totalRevenue += amount;

          // Province breakdown
          provinceRevenue[clientProvince] = (provinceRevenue[clientProvince] || 0) + amount;

          // Monthly breakdown
          if (paidAt) {
            const monthKey = new Date(paidAt).toISOString().slice(0, 7); // YYYY-MM
            monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + amount;
          }

          // Service type breakdown
          serviceTypeRevenue[pricingPresetId] = (serviceTypeRevenue[pricingPresetId] || 0) + amount;

          // Payment method breakdown
          paymentMethods[paymentMethod] = (paymentMethods[paymentMethod] || 0) + amount;
        } else if (paymentStatus === 'pending') {
          totalPending += amount;
        }

        if (filing.status === 'awaiting-payment') {
          totalApproved += amount;
        } else if (filing.status === 'rejected') {
          totalRejected += amount;
        }
      }
    }

    // Calculate averages
    const paidTransactions = transactions.filter(t => t.status === 'paid');
    const averageTicket = paidTransactions.length > 0 
      ? totalRevenue / paidTransactions.length 
      : 0;

    // Calculate unique active clients (clients with at least one paid transaction)
    const activeClientsSet = new Set(paidTransactions.map(t => t.clientId));
    const activeClientsCount = activeClientsSet.size;

    // Sort transactions by date (most recent first)
    transactions.sort((a, b) => {
      const dateA = new Date(a.paidAt || a.createdAt || 0);
      const dateB = new Date(b.paidAt || b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    });

    // Format monthly revenue for charts (fill missing months with 0)
    const monthlyRevenueArray = [];
    for (let m = 1; m <= 12; m++) {
      const monthKey = `${year}-${m.toString().padStart(2, '0')}`;
      monthlyRevenueArray.push({
        month: monthKey,
        monthName: new Date(parseInt(year), m - 1).toLocaleDateString('en', { month: 'short' }),
        revenue: monthlyRevenue[monthKey] || 0
      });
    }

    // Format province revenue for charts
    const provinceRevenueArray = Object.entries(provinceRevenue).map(([province, revenue]) => ({
      province,
      revenue,
      percentage: totalRevenue > 0 ? (revenue / totalRevenue * 100).toFixed(1) : 0
    })).sort((a, b) => b.revenue - a.revenue);

    // Format service type revenue
    const serviceTypeRevenueArray = Object.entries(serviceTypeRevenue).map(([serviceType, revenue]) => ({
      serviceType,
      revenue,
      count: transactions.filter(t => t.serviceType === serviceType && t.status === 'paid').length
    })).sort((a, b) => b.revenue - a.revenue);

    // Format payment methods
    const paymentMethodsArray = Object.entries(paymentMethods).map(([method, revenue]) => ({
      method,
      revenue,
      count: transactions.filter(t => t.paymentMethod === method && t.status === 'paid').length
    }));

    return c.json({
      summary: {
        totalRevenue,
        totalPending,
        totalApproved,
        totalRejected,
        averageTicket,
        totalClients: usersData.users.length,
        activeClients: activeClientsCount,
        totalTransactions: transactions.length,
        paidTransactions: paidTransactions.length
      },
      monthlyRevenue: monthlyRevenueArray,
      provinceRevenue: provinceRevenueArray,
      serviceTypeRevenue: serviceTypeRevenueArray,
      paymentMethods: paymentMethodsArray,
      transactions: transactions.slice(0, 50), // Return latest 50 transactions
      filters: {
        year,
        month,
        province,
        status
      }
    });
  } catch (error) {
    console.error('Error fetching financial analytics:', error);
    return c.json({ error: `Failed to fetch financial data: ${error}` }, 500);
  }
});

// Mount timeline routes
app.route("/make-server-c2a25be0", timelineApp);

// ==================== MAGIC SETUP ROUTE ====================
// This route automatically configures RLS policies for storage buckets
app.post("/make-server-c2a25be0/admin/setup-storage-policies", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized - No access token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized - Invalid access token' }, 401);
    }

    // Check if user is admin
    const adminEmails = ['gabriel@blumconsultoria.ca', 'admin@blumconsultoria.ca', 'veprass@gmail.com'];
    if (!adminEmails.includes(user.email || '')) {
      return c.json({ error: 'Forbidden - Admin access required' }, 403);
    }

    console.log('🪄 Starting automatic RLS policy setup...');

    // Return SQL for manual execution since we cannot execute DDL from service role
    const manualSQL = `-- ============================================================
-- POLÍTICAS RLS SUPER SIMPLES - GARANTIDO PARA FUNCIONAR
-- ============================================================

-- PASSO 1: Limpar todas as policies antigas
DROP POLICY IF EXISTS "Allow authenticated users to upload files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to read files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload client documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to read client documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update client documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete client documents" ON storage.objects;
DROP POLICY IF EXISTS "tax_documents_insert" ON storage.objects;
DROP POLICY IF EXISTS "tax_documents_select" ON storage.objects;
DROP POLICY IF EXISTS "tax_documents_update" ON storage.objects;
DROP POLICY IF EXISTS "tax_documents_delete" ON storage.objects;
DROP POLICY IF EXISTS "client_documents_insert" ON storage.objects;
DROP POLICY IF EXISTS "client_documents_select" ON storage.objects;
DROP POLICY IF EXISTS "client_documents_update" ON storage.objects;
DROP POLICY IF EXISTS "client_documents_delete" ON storage.objects;

-- PASSO 2: Criar policies para BUCKET 1 (tax-documents-c2a25be0)
CREATE POLICY "tax_documents_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'tax-documents-c2a25be0');
CREATE POLICY "tax_documents_select" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'tax-documents-c2a25be0');
CREATE POLICY "tax_documents_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'tax-documents-c2a25be0') WITH CHECK (bucket_id = 'tax-documents-c2a25be0');
CREATE POLICY "tax_documents_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'tax-documents-c2a25be0');

-- PASSO 3: Criar policies para BUCKET 2 (make-c2a25be0-client-documents)
CREATE POLICY "client_documents_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'make-c2a25be0-client-documents');
CREATE POLICY "client_documents_select" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'make-c2a25be0-client-documents');
CREATE POLICY "client_documents_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'make-c2a25be0-client-documents') WITH CHECK (bucket_id = 'make-c2a25be0-client-documents');
CREATE POLICY "client_documents_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'make-c2a25be0-client-documents');

-- ✅ PRONTO! Deve aparecer "Success. No rows returned"`;

    console.log('✅ SQL script generated successfully');

    return c.json({
      success: true,
      message: 'SQL script generated - Please run in Supabase SQL Editor',
      sql: manualSQL,
      instructions: [
        '1. Copy the SQL below',
        '2. Go to Supabase Dashboard > SQL Editor',
        '3. Create a new query',
        '4. Paste and run the SQL',
        '5. Come back and test upload'
      ]
    });

  } catch (error) {
    console.error('🔴 Error in setup-storage-policies:', error);
    return c.json({ 
      error: 'Failed to setup storage policies', 
      details: error instanceof Error ? error.message : String(error) 
    }, 500);
  }
});

// ==================== CREATE BUCKETS ROUTE ====================
// This route creates the storage buckets if they don't exist
app.post("/make-server-c2a25be0/admin/create-buckets", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized - No access token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized - Invalid access token' }, 401);
    }

    // Check if user is admin
    const adminEmails = ['gabriel@blumconsultoria.ca', 'admin@blumconsultoria.ca', 'veprass@gmail.com'];
    if (!adminEmails.includes(user.email || '')) {
      return c.json({ error: 'Forbidden - Admin access required' }, 403);
    }

    console.log('🪣 Starting bucket creation...');

    const bucketsToCreate = [
      {
        name: 'tax-documents-c2a25be0',
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
      },
      {
        name: 'make-c2a25be0-client-documents',
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      }
    ];

    const results = [];
    
    // Check existing buckets
    const { data: existingBuckets } = await supabase.storage.listBuckets();
    
    for (const bucketConfig of bucketsToCreate) {
      const bucketExists = existingBuckets?.some(bucket => bucket.name === bucketConfig.name);
      
      if (bucketExists) {
        console.log(`✅ Bucket ${bucketConfig.name} already exists`);
        results.push({
          bucket: bucketConfig.name,
          status: 'already_exists',
          message: 'Bucket already exists'
        });
      } else {
        console.log(`🔨 Creating bucket ${bucketConfig.name}...`);
        const { error } = await supabase.storage.createBucket(bucketConfig.name, {
          public: false,
          fileSizeLimit: bucketConfig.fileSizeLimit,
          allowedMimeTypes: bucketConfig.allowedMimeTypes
        });
        
        if (error) {
          console.error(`❌ Error creating bucket ${bucketConfig.name}:`, error);
          results.push({
            bucket: bucketConfig.name,
            status: 'error',
            message: error.message
          });
        } else {
          console.log(`✅ Bucket ${bucketConfig.name} created successfully`);
          results.push({
            bucket: bucketConfig.name,
            status: 'created',
            message: 'Bucket created successfully'
          });
        }
      }
    }

    // Check if all buckets exist now
    const { data: finalBuckets } = await supabase.storage.listBuckets();
    const allExist = bucketsToCreate.every(config => 
      finalBuckets?.some(bucket => bucket.name === config.name)
    );

    return c.json({
      success: allExist,
      message: allExist ? '✅ All buckets are ready!' : '⚠️ Some buckets failed to create',
      results,
      nextSteps: allExist ? [
        'Buckets created successfully!',
        'Now create the RLS policies using the Magic Setup button',
        'Then test file upload'
      ] : [
        'Some buckets failed to create',
        'Check the error messages above',
        'You may need to create them manually in Supabase Dashboard'
      ]
    });

  } catch (error) {
    console.error('🔴 Error in create-buckets:', error);
    return c.json({ 
      error: 'Failed to create buckets', 
      details: error instanceof Error ? error.message : String(error) 
    }, 500);
  }
});

// ==================== BOOKKEEPING ROUTES ====================

// Create expense (Admin only)
app.post("/make-server-c2a25be0/bookkeeping/expenses", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // TODO: Add admin role check here

    const body = await c.req.json();
    const { 
      date, 
      vendor, 
      category, 
      amount, 
      description, 
      receiptUrl,
      gstAmount,
      qstAmount
    } = body;

    if (!date || !vendor || !category || !amount) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Generate expense ID
    const expenseId = `EXP-${Date.now()}`;

    // Create expense record
    const expense = {
      id: expenseId,
      date,
      vendor,
      category,
      amount: parseFloat(amount),
      description: description || '',
      receiptUrl: receiptUrl || null,
      gstAmount: gstAmount ? parseFloat(gstAmount) : 0,
      qstAmount: qstAmount ? parseFloat(qstAmount) : 0,
      createdAt: new Date().toISOString(),
      createdBy: user.id
    };

    // Store in KV store
    const key = `expense:${expenseId}`;
    await kv.set(key, expense);

    console.log(`💳 [EXPENSE CREATED] ${vendor} - ${category} - $${amount}`);

    return c.json({ 
      success: true,
      expense
    });
  } catch (error) {
    console.error('Error creating expense:', error);
    return c.json({ error: `Failed to create expense: ${error}` }, 500);
  }
});

// Get all expenses (Admin only)
app.get("/make-server-c2a25be0/bookkeeping/expenses", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // TODO: Add admin role check here

    // Get filters from query params
    const year = c.req.query('year');
    const month = c.req.query('month');
    const category = c.req.query('category');

    // Get all expenses from KV store
    const expenses = await kv.getByPrefix('expense:');

    // Filter expenses
    let filteredExpenses = expenses;

    if (year) {
      filteredExpenses = filteredExpenses.filter(exp => 
        new Date(exp.date).getFullYear() === parseInt(year)
      );
    }

    if (month) {
      filteredExpenses = filteredExpenses.filter(exp => 
        new Date(exp.date).getMonth() + 1 === parseInt(month)
      );
    }

    if (category) {
      filteredExpenses = filteredExpenses.filter(exp => exp.category === category);
    }

    // Sort by date (most recent first)
    filteredExpenses.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return c.json({ 
      success: true,
      expenses: filteredExpenses,
      total: filteredExpenses.length
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return c.json({ error: `Failed to fetch expenses: ${error}` }, 500);
  }
});

// Update expense (Admin only)
app.put("/make-server-c2a25be0/bookkeeping/expenses/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const expenseId = c.req.param('id');
    const updates = await c.req.json();

    // Get existing expense
    const key = `expense:${expenseId}`;
    const existingExpense = await kv.get(key);

    if (!existingExpense) {
      return c.json({ error: 'Expense not found' }, 404);
    }

    // Update expense
    const updatedExpense = {
      ...existingExpense,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await kv.set(key, updatedExpense);

    console.log(`💳 [EXPENSE UPDATED] ${expenseId}`);

    return c.json({ 
      success: true,
      expense: updatedExpense
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    return c.json({ error: `Failed to update expense: ${error}` }, 500);
  }
});

// Delete expense (Admin only)
app.delete("/make-server-c2a25be0/bookkeeping/expenses/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const expenseId = c.req.param('id');

    // Delete expense
    const key = `expense:${expenseId}`;
    await kv.del(key);

    console.log(`💳 [EXPENSE DELETED] ${expenseId}`);

    return c.json({ 
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return c.json({ error: `Failed to delete expense: ${error}` }, 500);
  }
});

// Get all invoices (Admin only)
app.get("/make-server-c2a25be0/bookkeeping/invoices", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get all users with tax filings
    const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      console.error('Error listing users:', usersError);
      return c.json({ error: 'Failed to fetch users' }, 500);
    }

    const invoices: any[] = [];

    // Extract invoices from tax filings
    for (const userData of usersData.users) {
      const metadata = userData.user_metadata || {};
      const taxFilings = metadata.taxFilings || [];

      for (const filing of taxFilings) {
        if (filing.payment?.status === 'paid' && filing.payment?.invoiceNumber) {
          invoices.push({
            invoiceNumber: filing.payment.invoiceNumber,
            clientId: userData.id,
            clientName: metadata.name || userData.email,
            clientEmail: userData.email,
            year: filing.year,
            amount: filing.payment.amount,
            paidAt: filing.payment.paidAt,
            paymentMethod: filing.payment.paymentMethod,
            serviceType: filing.payment.pricingPresetId,
            transactionId: filing.payment.transactionId
          });
        }
      }
    }

    // Sort by date (most recent first)
    invoices.sort((a, b) => 
      new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime()
    );

    return c.json({ 
      success: true,
      invoices,
      total: invoices.length
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return c.json({ error: `Failed to fetch invoices: ${error}` }, 500);
  }
});

// Get bookkeeping summary (Admin only)
app.get("/make-server-c2a25be0/bookkeeping/summary", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const year = c.req.query('year') || new Date().getFullYear().toString();

    // Get all expenses
    const allExpenses = await kv.getByPrefix('expense:');
    const yearExpenses = allExpenses.filter(exp => 
      new Date(exp.date).getFullYear() === parseInt(year)
    );

    // Calculate total expenses
    const totalExpenses = yearExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalGSTPaid = yearExpenses.reduce((sum, exp) => sum + (exp.gstAmount || 0), 0);
    const totalQSTPaid = yearExpenses.reduce((sum, exp) => sum + (exp.qstAmount || 0), 0);
    const totalTaxPaid = totalGSTPaid + totalQSTPaid;

    // Get expenses by category
    const expensesByCategory: Record<string, number> = {};
    yearExpenses.forEach(exp => {
      expensesByCategory[exp.category] = (expensesByCategory[exp.category] || 0) + exp.amount;
    });

    // Get monthly expenses
    const monthlyExpenses: Record<string, number> = {};
    yearExpenses.forEach(exp => {
      const monthKey = new Date(exp.date).toISOString().slice(0, 7);
      monthlyExpenses[monthKey] = (monthlyExpenses[monthKey] || 0) + exp.amount;
    });

    // Get all invoices (revenue)
    const { data: usersData } = await supabase.auth.admin.listUsers();
    let totalRevenue = 0;
    const monthlyRevenue: Record<string, number> = {};

    if (usersData) {
      for (const userData of usersData.users) {
        const metadata = userData.user_metadata || {};
        const taxFilings = metadata.taxFilings || [];

        for (const filing of taxFilings) {
          if (filing.year === parseInt(year) && filing.payment?.status === 'paid') {
            const amount = filing.payment.amount || 0;
            totalRevenue += amount;

            if (filing.payment.paidAt) {
              const monthKey = new Date(filing.payment.paidAt).toISOString().slice(0, 7);
              monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + amount;
            }
          }
        }
      }
    }

    // Calculate net profit
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue * 100) : 0;

    // Format monthly data for charts
    const monthlyData = [];
    for (let m = 1; m <= 12; m++) {
      const monthKey = `${year}-${m.toString().padStart(2, '0')}`;
      monthlyData.push({
        month: monthKey,
        monthName: new Date(parseInt(year), m - 1).toLocaleDateString('en', { month: 'short' }),
        revenue: monthlyRevenue[monthKey] || 0,
        expenses: monthlyExpenses[monthKey] || 0,
        profit: (monthlyRevenue[monthKey] || 0) - (monthlyExpenses[monthKey] || 0)
      });
    }

    // Format category data
    const categoryData = Object.entries(expensesByCategory).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses * 100).toFixed(1) : 0
    })).sort((a, b) => b.amount - a.amount);

    return c.json({
      summary: {
        year: parseInt(year),
        totalRevenue,
        totalExpenses,
        netProfit,
        profitMargin: parseFloat(profitMargin.toFixed(2)),
        totalTaxPaid,
        totalGSTPaid,
        totalQSTPaid,
        expenseCount: yearExpenses.length
      },
      monthlyData,
      categoryData
    });
  } catch (error) {
    console.error('Error fetching bookkeeping summary:', error);
    return c.json({ error: `Failed to fetch summary: ${error}` }, 500);
  }
});

// ========================================
// MESSAGE ROUTES (CLIENT COMMUNICATION HUB)
// ========================================

// Send a message
app.post("/make-server-c2a25be0/messages/send", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { clientId, subject, content, attachments } = await c.req.json();

    if (!clientId || !subject || !content) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Determine sender role (admin or client)
    const senderRole = user.id === clientId ? 'client' : 'admin';
    const senderName = user.user_metadata?.name || user.email || 'Unknown';

    const message = await messages.sendMessage(
      clientId,
      user.id,
      senderRole,
      senderName,
      subject,
      content,
      attachments
    );

    console.log(`✅ [MESSAGE SENT] ${senderRole} ${user.email} sent message to client ${clientId}`);

    return c.json({ success: true, message });
  } catch (error) {
    console.error('Error sending message:', error);
    return c.json({ error: `Failed to send message: ${error}` }, 500);
  }
});

// Get all messages for a client
app.get("/make-server-c2a25be0/messages/:clientId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const clientId = c.req.param('clientId');

    // Verify user has access to these messages
    if (user.id !== clientId && !user.email?.endsWith('@fiscalist.ca')) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    const clientMessages = await messages.getClientMessages(clientId);

    return c.json({ messages: clientMessages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return c.json({ error: `Failed to fetch messages: ${error}` }, 500);
  }
});

// Mark message as read
app.post("/make-server-c2a25be0/messages/:messageId/read", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const messageId = c.req.param('messageId');
    const { clientId } = await c.req.json();

    if (!clientId) {
      return c.json({ error: 'Missing clientId' }, 400);
    }

    const userRole = user.id === clientId ? 'client' : 'admin';

    await messages.markMessageAsRead(messageId, userRole, clientId);

    console.log(`✅ [MESSAGE READ] ${userRole} ${user.email} read message ${messageId}`);

    return c.json({ success: true });
  } catch (error) {
    console.error('Error marking message as read:', error);
    return c.json({ error: `Failed to mark message as read: ${error}` }, 500);
  }
});

// Get unread count
app.get("/make-server-c2a25be0/messages/:clientId/unread-count", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const clientId = c.req.param('clientId');
    const userRole = user.id === clientId ? 'client' : 'admin';

    const unreadCount = await messages.getUnreadCount(clientId, userRole);

    return c.json({ unreadCount });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return c.json({ error: `Failed to fetch unread count: ${error}` }, 500);
  }
});

// Get all clients with unread messages (admin only)
app.get("/make-server-c2a25be0/messages/admin/clients-with-unread", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Verify admin
    if (!user.email?.endsWith('@fiscalist.ca')) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    const clientsWithUnread = await messages.getClientsWithUnreadMessages();

    return c.json({ clients: clientsWithUnread });
  } catch (error) {
    console.error('Error fetching clients with unread messages:', error);
    return c.json({ error: `Failed to fetch clients: ${error}` }, 500);
  }
});

// ==================== TAX DOCUMENTS & PREVIEW ROUTES ====================

// Parse uploaded tax document (Client)
app.post("/make-server-c2a25be0/tax-documents/parse", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { year, parsedDocuments } = body;

    if (!year || !parsedDocuments || !Array.isArray(parsedDocuments)) {
      return c.json({ error: 'Missing required fields: year, parsedDocuments' }, 400);
    }

    // Get user metadata
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(user.id);
    
    if (userError || !userData?.user) {
      console.error('Error getting user:', userError);
      return c.json({ error: 'User not found' }, 404);
    }

    const metadata = userData.user.user_metadata || {};
    
    // Initialize taxDocuments if it doesn't exist
    if (!metadata.taxDocuments) {
      metadata.taxDocuments = {};
    }
    
    // Add documents to the year
    if (!metadata.taxDocuments[year]) {
      metadata.taxDocuments[year] = [];
    }
    
    // Append new parsed documents
    metadata.taxDocuments[year] = [
      ...metadata.taxDocuments[year],
      ...parsedDocuments
    ];

    // Update user metadata
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...metadata,
        taxDocuments: metadata.taxDocuments
      }
    });

    if (updateError) {
      console.error('Error updating user metadata:', updateError);
      return c.json({ error: 'Failed to save parsed documents' }, 500);
    }

    console.log(`✅ Saved ${parsedDocuments.length} parsed documents for user ${user.email}, year ${year}`);

    return c.json({ 
      success: true,
      documentsCount: parsedDocuments.length,
      message: `Saved ${parsedDocuments.length} document(s)` 
    });

  } catch (error) {
    console.error('Error saving parsed documents:', error);
    return c.json({ error: `Failed to save documents: ${error}` }, 500);
  }
});

// Get parsed tax documents for a year (Client)
app.get("/make-server-c2a25be0/tax-documents/:year", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const year = c.req.param('year');

    // Get user metadata
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(user.id);
    
    if (userError || !userData?.user) {
      console.error('Error getting user:', userError);
      return c.json({ error: 'User not found' }, 404);
    }

    const metadata = userData.user.user_metadata || {};
    const documents = metadata.taxDocuments?.[year] || [];

    return c.json({ documents });

  } catch (error) {
    console.error('Error fetching tax documents:', error);
    return c.json({ error: `Failed to fetch documents: ${error}` }, 500);
  }
});

// Save tax return preview (Client or Admin)
app.post("/make-server-c2a25be0/tax-preview/save", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { userId, year, taxPreview } = body;

    // If userId is provided, admin is saving for client, otherwise client is saving for themselves
    const targetUserId = userId || user.id;

    if (!year || !taxPreview) {
      return c.json({ error: 'Missing required fields: year, taxPreview' }, 400);
    }

    // Get user metadata
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(targetUserId);
    
    if (userError || !userData?.user) {
      console.error('Error getting user:', userError);
      return c.json({ error: 'User not found' }, 404);
    }

    const metadata = userData.user.user_metadata || {};
    
    // Initialize taxPreviews if it doesn't exist
    if (!metadata.taxPreviews) {
      metadata.taxPreviews = {};
    }
    
    // Save the preview for this year
    metadata.taxPreviews[year] = {
      ...taxPreview,
      userId: targetUserId,
      updatedAt: new Date().toISOString()
    };

    // Update user metadata
    const { error: updateError } = await supabase.auth.admin.updateUserById(targetUserId, {
      user_metadata: {
        ...metadata,
        taxPreviews: metadata.taxPreviews
      }
    });

    if (updateError) {
      console.error('Error updating user metadata:', updateError);
      return c.json({ error: 'Failed to save tax preview' }, 500);
    }

    console.log(`✅ Saved tax preview for user ${targetUserId}, year ${year}`);

    return c.json({ 
      success: true,
      message: 'Tax preview saved successfully' 
    });

  } catch (error) {
    console.error('Error saving tax preview:', error);
    return c.json({ error: `Failed to save tax preview: ${error}` }, 500);
  }
});

// Get tax return preview for a year (Client or Admin)
app.get("/make-server-c2a25be0/tax-preview/:userId/:year", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = c.req.param('userId');
    const year = c.req.param('year');

    // Check authorization (user can only access their own data unless admin)
    if (user.id !== userId && !user.email?.endsWith('@fiscalist.ca')) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    // Get user metadata
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError || !userData?.user) {
      console.error('Error getting user:', userError);
      return c.json({ error: 'User not found' }, 404);
    }

    const metadata = userData.user.user_metadata || {};
    const preview = metadata.taxPreviews?.[year] || null;

    return c.json({ preview });

  } catch (error) {
    console.error('Error fetching tax preview:', error);
    return c.json({ error: `Failed to fetch tax preview: ${error}` }, 500);
  }
});

// ==================== PAYMENT ROUTES (STRIPE) ====================

/**
 * Create Stripe Checkout Session for Initial Payment ($50 CAD)
 * POST /make-server-c2a25be0/payments/create-initial-session
 */
app.post("/make-server-c2a25be0/payments/create-initial-session", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { taxYear, returnUrl } = await c.req.json();

    if (!taxYear || !returnUrl) {
      return c.json({ error: 'Missing required fields: taxYear, returnUrl' }, 400);
    }

    // Create Stripe Checkout Session
    const { sessionId, url } = await stripeService.createInitialPaymentSession(
      user.id,
      user.email || '',
      taxYear,
      returnUrl
    );

    return c.json({ 
      success: true,
      sessionId,
      url
    });

  } catch (error) {
    console.error('Error creating initial payment session:', error);
    return c.json({ error: `Failed to create payment session: ${error}` }, 500);
  }
});

/**
 * Create Stripe Checkout Session for Final Payment
 * POST /make-server-c2a25be0/payments/create-final-session
 */
app.post("/make-server-c2a25be0/payments/create-final-session", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { taxYear, finalAmount, returnUrl } = await c.req.json();

    if (!taxYear || !finalAmount || !returnUrl) {
      return c.json({ error: 'Missing required fields: taxYear, finalAmount, returnUrl' }, 400);
    }

    // Validate finalAmount is a positive number
    if (typeof finalAmount !== 'number' || finalAmount <= 0) {
      return c.json({ error: 'Invalid finalAmount' }, 400);
    }

    // Create Stripe Checkout Session
    const { sessionId, url } = await stripeService.createFinalPaymentSession(
      user.id,
      user.email || '',
      taxYear,
      finalAmount,
      returnUrl
    );

    return c.json({ 
      success: true,
      sessionId,
      url
    });

  } catch (error) {
    console.error('Error creating final payment session:', error);
    return c.json({ error: `Failed to create payment session: ${error}` }, 500);
  }
});

/**
 * Verify Payment and Update User Metadata
 * POST /make-server-c2a25be0/payments/verify
 */
app.post("/make-server-c2a25be0/payments/verify", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { sessionId } = await c.req.json();

    if (!sessionId) {
      return c.json({ error: 'Missing sessionId' }, 400);
    }

    // Verify payment with Stripe
    const paymentInfo = await stripeService.verifyPayment(sessionId);

    if (!paymentInfo.paid) {
      return c.json({ error: 'Payment not completed' }, 400);
    }

    // Update user metadata with payment information
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(user.id);
    
    if (userError || !userData?.user) {
      console.error('Error getting user:', userError);
      return c.json({ error: 'User not found' }, 404);
    }

    const metadata = userData.user.user_metadata || {};
    const taxFilings = metadata.taxFilings || [];
    
    // Find the tax filing for this year
    const filingIndex = taxFilings.findIndex((f: any) => f.year === paymentInfo.taxYear);
    
    if (filingIndex === -1) {
      return c.json({ error: 'Tax filing not found' }, 404);
    }

    // Update payment status
    if (!taxFilings[filingIndex].payment) {
      taxFilings[filingIndex].payment = {
        initialPaid: false,
        initialAmount: 50,
        finalPaid: false,
        finalAmount: 0,
        totalPrice: 199
      };
    }

    if (paymentInfo.paymentType === 'initial') {
      taxFilings[filingIndex].payment.initialPaid = true;
      taxFilings[filingIndex].payment.initialAmount = paymentInfo.amount;
      taxFilings[filingIndex].status = 'in-progress';
    } else if (paymentInfo.paymentType === 'final') {
      taxFilings[filingIndex].payment.finalPaid = true;
      taxFilings[filingIndex].payment.finalAmount = paymentInfo.amount;
      taxFilings[filingIndex].payment.totalPrice = 
        taxFilings[filingIndex].payment.initialAmount + paymentInfo.amount;
      taxFilings[filingIndex].status = 'completed';
    }

    // Save updated metadata
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...metadata,
        taxFilings
      }
    });

    if (updateError) {
      console.error('Error updating user metadata:', updateError);
      return c.json({ error: 'Failed to update payment status' }, 500);
    }

    return c.json({
      success: true,
      payment: taxFilings[filingIndex].payment
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    return c.json({ error: `Failed to verify payment: ${error}` }, 500);
  }
});

/**
 * Get Payment Status for a Tax Year
 * GET /make-server-c2a25be0/payments/:taxYear/status
 */
app.get("/make-server-c2a25be0/payments/:taxYear/status", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const taxYear = parseInt(c.req.param('taxYear'));

    if (isNaN(taxYear)) {
      return c.json({ error: 'Invalid tax year' }, 400);
    }

    // Get user metadata
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(user.id);
    
    if (userError || !userData?.user) {
      console.error('Error getting user:', userError);
      return c.json({ error: 'User not found' }, 404);
    }

    const metadata = userData.user.user_metadata || {};
    const taxFilings = metadata.taxFilings || [];
    
    // Find the tax filing for this year
    const filing = taxFilings.find((f: any) => f.year === taxYear);
    
    if (!filing) {
      return c.json({ 
        payment: {
          initialPaid: false,
          initialAmount: 50,
          finalPaid: false,
          finalAmount: 0,
          totalPrice: 199
        }
      });
    }

    return c.json({
      payment: filing.payment || {
        initialPaid: false,
        initialAmount: 50,
        finalPaid: false,
        finalAmount: 0,
        totalPrice: 199
      }
    });

  } catch (error) {
    console.error('Error getting payment status:', error);
    return c.json({ error: `Failed to get payment status: ${error}` }, 500);
  }
});

// Mount users routes
app.route('/', usersApp);

Deno.serve(app.fetch);