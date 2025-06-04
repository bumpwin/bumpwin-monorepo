import { config } from "@/config";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(config.env.SUPABASE_URL, config.env.SUPABASE_ANON_KEY);
