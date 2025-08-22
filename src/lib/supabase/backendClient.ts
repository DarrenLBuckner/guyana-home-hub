import { createClient } from '@supabase/supabase-js';

const backendSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_BACKEND_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_BACKEND_ANON_KEY!
);

export default backendSupabase;
