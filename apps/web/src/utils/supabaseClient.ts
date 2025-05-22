import { createSupabaseClient } from "@workspace/supabase/src/client";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Required environment variables are not defined");
}

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);
