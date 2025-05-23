
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const SUPABASE_URL = "https://bnhvxnoabedbsqharezp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuaHZ4bm9hYmVkYnNxaGFyZXpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MTEyNzIsImV4cCI6MjA2MzQ4NzI3Mn0.2tiewoleX10RPmGIAnAcM3ColRMIQgXToeboGfhnvJ4";

// Create and export a single Supabase client instance
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
