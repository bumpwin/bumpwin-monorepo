import "dotenv/config";
import { createSupabaseClient } from "@workspace/supabase/src/client";

export const supabase = createSupabaseClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);
