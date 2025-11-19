import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://pxzlivocnykjjikkjago.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4emxpdm9jbnlramppa2tqYWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0NTUwMDgsImV4cCI6MjA2MzAzMTAwOH0.l5yrgpfxJew3JxaihQB8Uu0a-sdI5pd2eR8cVGxrO1I";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    realtime: {
        params: {
            eventsPerSecond: 10
        }
    }
});
