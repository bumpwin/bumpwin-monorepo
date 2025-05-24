import { createClient } from "@supabase/supabase-js";
import { config } from "../config";

export const supabase = createClient(
  config.env.SUPABASE_URL,
  config.env.SUPABASE_ANON_KEY,
);
