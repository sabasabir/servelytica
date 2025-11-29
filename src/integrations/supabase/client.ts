import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL || 'https://pxzlivocnykjjikkjago.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Create a safe Supabase client
// Use the actual key if provided, otherwise use a dummy key (but operations will fail gracefully)
const supabaseKey = SUPABASE_PUBLISHABLE_KEY || 'dummy-key-for-initialization';

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  supabaseKey, 
  {
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

// Check if Supabase is properly configured (has both URL and key, and key is not empty/dummy)
export const isSupabaseConfigured = !!(
  SUPABASE_PUBLISHABLE_KEY && 
  SUPABASE_URL && 
  SUPABASE_PUBLISHABLE_KEY !== 'dummy-key-for-initialization' &&
  SUPABASE_PUBLISHABLE_KEY.length > 20 // Valid keys are much longer
);
