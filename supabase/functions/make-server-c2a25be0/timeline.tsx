import { Hono } from "npm:hono";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

const app = new Hono();

// Get user timeline status
app.get("/timeline", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get timeline status from KV
    const timelineKey = `user:${user.id}:timeline`;
    const timeline = await kv.get(timelineKey) || { step: 1, updatedAt: new Date().toISOString() };

    return c.json({ timeline });
  } catch (error) {
    console.error('Get timeline error:', error);
    return c.json({ error: `Failed to get timeline: ${error}` }, 500);
  }
});

// Update user timeline status
app.put("/timeline", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { step } = await c.req.json();

    if (!step || step < 1 || step > 5) {
      return c.json({ error: 'Invalid step number' }, 400);
    }

    // Update timeline in KV
    const timelineKey = `user:${user.id}:timeline`;
    const timeline = { step, updatedAt: new Date().toISOString() };
    await kv.set(timelineKey, timeline);

    return c.json({ success: true, timeline });
  } catch (error) {
    console.error('Update timeline error:', error);
    return c.json({ error: `Failed to update timeline: ${error}` }, 500);
  }
});

export default app;
