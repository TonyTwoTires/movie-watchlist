import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isConfigured = Boolean(supabaseUrl && supabaseKey);

// The publishable (anon) key is safe in a browser app: the database's Row Level Security
// rules, not the key, are what keep each user's data private.
export const supabase = isConfigured ? createClient(supabaseUrl, supabaseKey) : null;
