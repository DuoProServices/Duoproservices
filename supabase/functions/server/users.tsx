import { Hono } from "npm:hono";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

export const usersApp = new Hono();

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

export interface UserPermissions {
  userId: string;
  email: string;
  name: string;
  role: 'admin' | 'accountant' | 'viewer';
  modules: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Get user permissions
usersApp.get('/make-server-c2a25be0/users/permissions/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    
    const permissions = await kv.get(`user-permissions:${userId}`);
    
    if (!permissions) {
      // Return default admin permissions for first user or if not found
      const user = await kv.get(`user:${userId}`);
      if (!user) {
        return c.json({ error: 'User not found' }, 404);
      }
      
      const defaultPermissions: UserPermissions = {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: 'admin',
        modules: ['dashboard', 'bookkeeping', 'financial', 'customers', 'marketing', 'users'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Save default permissions
      await kv.set(`user-permissions:${userId}`, defaultPermissions);
      
      return c.json(defaultPermissions);
    }
    
    return c.json(permissions);
  } catch (error) {
    console.error('Error getting user permissions:', error);
    return c.json({ error: 'Failed to get user permissions' }, 500);
  }
});

// Update user permissions
usersApp.put('/make-server-c2a25be0/users/permissions/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const updates = await c.req.json();
    
    const existing = await kv.get(`user-permissions:${userId}`) || {};
    
    const updated: UserPermissions = {
      ...existing,
      ...updates,
      userId,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`user-permissions:${userId}`, updated);
    
    return c.json(updated);
  } catch (error) {
    console.error('Error updating user permissions:', error);
    return c.json({ error: 'Failed to update user permissions' }, 500);
  }
});

// Create new user
usersApp.post('/make-server-c2a25be0/users/create', async (c) => {
  try {
    const { email, password, name, role, modules, isActive } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    // Create user in Supabase Auth
    const { data: newUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name,
        role: role || 'viewer'
      },
      email_confirm: true // Auto-confirm email since we don't have email server configured
    });

    if (authError || !newUser.user) {
      console.error('Error creating user in Supabase Auth:', authError);
      return c.json({ 
        error: authError?.message || 'Failed to create user in authentication system' 
      }, 500);
    }

    const userId = newUser.user.id;

    // Create user profile in KV store
    const userProfile = {
      id: userId,
      email,
      name,
      createdAt: new Date().toISOString(),
      onboardingComplete: false,
      personalInfo: {},
      taxFilings: []
    };

    await kv.set(`user:${userId}`, userProfile);

    // Create user permissions
    const permissions: UserPermissions = {
      userId,
      email,
      name,
      role: role || 'viewer',
      modules: modules || ['dashboard'],
      isActive: isActive !== undefined ? isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`user-permissions:${userId}`, permissions);

    console.log(`✅ Successfully created user: ${email} (${userId})`);

    return c.json({ 
      success: true, 
      user: {
        ...permissions,
        casesCount: 0,
        pendingCases: 0,
        completedCases: 0
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return c.json({ 
      error: `Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, 500);
  }
});

// List all users with permissions and stats
usersApp.get('/make-server-c2a25be0/users/list', async (c) => {
  try {
    // Get all user profiles
    const userKeys = await kv.getByPrefix('user:');
    const users = [];
    
    for (const userKey of userKeys) {
      const user = userKey.value;
      if (!user || !user.id) continue;
      
      // Get permissions
      const permissions = await kv.get(`user-permissions:${user.id}`) || {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: 'admin',
        modules: ['dashboard', 'bookkeeping', 'financial', 'customers', 'marketing', 'users'],
        isActive: true,
        createdAt: user.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Get case stats
      const allClients = await kv.getByPrefix('client:');
      let casesCount = 0;
      let pendingCases = 0;
      let completedCases = 0;
      
      for (const clientKey of allClients) {
        const client = clientKey.value;
        if (!client.taxFilings) continue;
        
        for (const filing of client.taxFilings) {
          if (filing.assignedTo === user.id) {
            casesCount++;
            if (filing.status === 'completed') completedCases++;
            if (filing.status === 'pending' || filing.status === 'in-progress') pendingCases++;
          }
        }
      }
      
      users.push({
        ...permissions,
        casesCount,
        pendingCases,
        completedCases,
      });
    }
    
    return c.json(users);
  } catch (error) {
    console.error('Error listing users:', error);
    return c.json({ error: 'Failed to list users' }, 500);
  }
});

// Assign case to user
usersApp.post('/make-server-c2a25be0/cases/assign', async (c) => {
  try {
    const { clientId, year, assignedTo } = await c.req.json();
    
    if (!clientId || !year || !assignedTo) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    // Get client
    const client = await kv.get(`client:${clientId}`);
    if (!client) {
      return c.json({ error: 'Client not found' }, 404);
    }
    
    // Update tax filing
    const updatedFilings = client.taxFilings.map((filing: any) => {
      if (filing.year === year) {
        return {
          ...filing,
          assignedTo,
          assignedAt: new Date().toISOString(),
        };
      }
      return filing;
    });
    
    await kv.set(`client:${clientId}`, {
      ...client,
      taxFilings: updatedFilings,
    });
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error assigning case:', error);
    return c.json({ error: 'Failed to assign case' }, 500);
  }
});

// Transfer case to another user
usersApp.post('/make-server-c2a25be0/cases/transfer', async (c) => {
  try {
    const { clientId, year, fromUserId, toUserId, reason } = await c.req.json();
    
    if (!clientId || !year || !toUserId) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    // Get client
    const client = await kv.get(`client:${clientId}`);
    if (!client) {
      return c.json({ error: 'Client not found' }, 404);
    }
    
    // Update tax filing
    const updatedFilings = client.taxFilings.map((filing: any) => {
      if (filing.year === year) {
        // Add to transfer history
        const transferHistory = filing.transferHistory || [];
        transferHistory.push({
          from: fromUserId,
          to: toUserId,
          reason,
          date: new Date().toISOString(),
        });
        
        return {
          ...filing,
          assignedTo: toUserId,
          assignedAt: new Date().toISOString(),
          transferHistory,
        };
      }
      return filing;
    });
    
    await kv.set(`client:${clientId}`, {
      ...client,
      taxFilings: updatedFilings,
    });
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error transferring case:', error);
    return c.json({ error: 'Failed to transfer case' }, 500);
  }
});

// Get productivity stats
usersApp.get('/make-server-c2a25be0/productivity', async (c) => {
  try {
    const period = c.req.query('period') || 'month';
    
    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    
    // Get all users
    const userKeys = await kv.getByPrefix('user:');
    const productivity = [];
    
    for (const userKey of userKeys) {
      const user = userKey.value;
      if (!user || !user.id) continue;
      
      // Get all clients
      const allClients = await kv.getByPrefix('client:');
      
      let totalCases = 0;
      let completedCases = 0;
      let inProgressCases = 0;
      let pendingCases = 0;
      let revenue = 0;
      const recentCases = [];
      const completionTimes: number[] = [];
      
      for (const clientKey of allClients) {
        const client = clientKey.value;
        if (!client.taxFilings) continue;
        
        for (const filing of client.taxFilings) {
          if (filing.assignedTo !== user.id) continue;
          
          // Check if within period
          const assignedDate = filing.assignedAt ? new Date(filing.assignedAt) : new Date(filing.createdAt || 0);
          if (assignedDate < startDate) continue;
          
          totalCases++;
          
          if (filing.status === 'completed') {
            completedCases++;
            
            // Calculate completion time
            const completedDate = new Date(filing.completedAt || filing.updatedAt || new Date());
            const days = Math.floor((completedDate.getTime() - assignedDate.getTime()) / (1000 * 60 * 60 * 24));
            completionTimes.push(days);
            
            // Add revenue
            if (filing.payment?.finalPrice) {
              revenue += filing.payment.finalPrice;
            }
          }
          
          if (filing.status === 'in-progress' || filing.status === 'under-review') {
            inProgressCases++;
          }
          
          if (filing.status === 'pending' || filing.status === 'awaiting-documents') {
            pendingCases++;
          }
          
          // Add to recent cases
          recentCases.push({
            id: client.id,
            clientName: client.name,
            year: filing.year,
            status: filing.status,
            assignedDate: assignedDate.toISOString(),
          });
        }
      }
      
      // Sort recent cases by date
      recentCases.sort((a, b) => 
        new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime()
      );
      
      // Calculate average completion time
      const avgCompletionTime = completionTimes.length > 0
        ? Math.round(completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length)
        : 0;
      
      productivity.push({
        userId: user.id,
        name: user.name,
        email: user.email,
        totalCases,
        completedCases,
        inProgressCases,
        pendingCases,
        revenue,
        avgCompletionTime,
        recentCases: recentCases.slice(0, 5),
      });
    }
    
    // Sort by total cases (top performers first)
    productivity.sort((a, b) => b.completedCases - a.completedCases);
    
    return c.json(productivity);
  } catch (error) {
    console.error('Error getting productivity stats:', error);
    return c.json({ error: 'Failed to get productivity stats' }, 500);
  }
});

export default usersApp;