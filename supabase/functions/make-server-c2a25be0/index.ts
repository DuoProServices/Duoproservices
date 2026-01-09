import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import timelineApp from "./timeline.tsx";

const app = new Hono();

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Initialize storage bucket on startup
(async () => {
  const bucketName = 'make-c2a25be0-client-documents';
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
      });
      if (error) {
        console.error('Error creating bucket:', error);
      } else {
        console.log('Storage bucket created successfully');
      }
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
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

// Mount timeline routes
app.route("/make-server-c2a25be0", timelineApp);

Deno.serve(app.fetch);
