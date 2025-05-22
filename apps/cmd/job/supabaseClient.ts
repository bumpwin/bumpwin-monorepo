import "dotenv/config";
import { createSupabaseClient } from "@workspace/supabase/src/client";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Required environment variables are not defined");
}

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);
