import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL || 'https://pxzlivocnykjjikkjago.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY || '', {
    realtime: {
        params: {
            eventsPerSecond: 10
        }
    }
});

export const isSupabaseConfigured = !!(SUPABASE_PUBLISHABLE_KEY && SUPABASE_URL && SUPABASE_URL !== 'https://pxzlivocnykjjikkjago.supabase.co');
