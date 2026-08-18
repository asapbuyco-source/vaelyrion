import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Missing Supabase URL or Service Role Key. Make sure to configure .env');
}

// Use the service role key for backend operations so we can bypass RLS when necessary (e.g. admin actions)
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
