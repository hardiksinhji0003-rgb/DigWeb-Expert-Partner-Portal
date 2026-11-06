import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Provided Supabase credentials for DigWeb Expert project
const DEFAULT_SUPABASE_URL = 'https://serajsiipltxvjkmfkoe.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable__B_E1eJvKa14L3co2VaUBg_MCb6J3NB';

// Environment variables take precedence if set in Netlify or .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;

export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.trim() !== '' &&
    !supabaseUrl.includes('your-project') &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.trim() !== '' &&
    !supabaseAnonKey.includes('your-anon-public-key')
  );
};

// Create the real Supabase client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export { supabaseUrl, supabaseAnonKey };
