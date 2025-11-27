import { supabase } from '@/integrations/supabase/client';

export const verifyUserSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('[SESSION] Error getting session:', error);
    throw new Error('Unable to verify session with Supabase');
  }
  
  if (!session || !session.user) {
    console.error('[SESSION] No active session found');
    throw new Error('You are not authenticated. Please log in.');
  }
  
  console.log('[SESSION] Session verified for user:', session.user.id);
  return session;
};

export const handleSupabaseError = (error: any, context: string) => {
  console.error(`[${context}] Supabase Error:`, {
    message: error?.message,
    code: error?.code,
    details: error?.details,
    hint: error?.hint,
  });

  const errorMessages: Record<string, string> = {
    'new row violates row-level security policy': '⚠️ RLS Configuration Issue - Please run DISABLE_ALL_RLS_FINAL.sql in Supabase SQL Editor. Go to: SQL Editor → New Query → Paste script → Run.',
    'permission denied': 'You do not have permission to perform this action. Please check your account settings.',
    'invalid input syntax': 'Invalid data format provided. Please check your input.',
    'relation does not exist': 'Database table not found. Please contact support.',
    'duplicate key value': 'This record already exists.',
  };

  for (const [key, message] of Object.entries(errorMessages)) {
    if (error?.message?.toLowerCase().includes(key)) {
      return message;
    }
  }

  return error?.message || 'An error occurred. Please try again.';
};
