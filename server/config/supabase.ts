import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Missing Supabase URL or Service Role Key. Make sure to configure .env');
}

// Sessions acquired via auth calls (signUp / signInWithPassword) must NEVER be
// persisted server-side. If they were, the client would attach the user's
// (RLS-bound) token to subsequent requests on warm instances instead of the
// service role key, and service-side writes would fail RLS.
//
// NOTE: auth-js only honors a custom `storage` when `persistSession` is true —
// with persistSession:false it ignores the option and uses its own in-memory
// storage. So we keep persistSession:true but point it at a no-op storage:
// every auth response becomes one-shot (returned to the caller, never stored),
// getSession() always returns null, and requests always use the service key.
const voidStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

const clientOptions = {
  auth: {
    persistSession: true,
    autoRefreshToken: false,
    detectSessionInUrl: false,
    storage: voidStorage,
  },
};

// Use the service role key for backend operations so we can bypass RLS when necessary (e.g. admin actions)
export const supabase = createClient(supabaseUrl, supabaseServiceKey, clientOptions);

// Dedicated admin client for service-side writes that must never be affected by
// an authenticated session (e.g. creating a profile row right after signUp()).
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, clientOptions);