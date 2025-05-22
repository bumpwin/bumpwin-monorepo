import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_CONFIG } from "./config";

export const createSupabaseClient = (
  url: string,
  anonKey: string,
): SupabaseClient => createClient(url, anonKey);

// Create authenticated client with token
// export function createAuthenticatedClient(token: string): SupabaseClient {
//   return createClient(
//     SUPABASE_CONFIG.PROJECT.URL,
//     SUPABASE_CONFIG.PROJECT.ANON_KEY,
//     {
//       global: {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       },
//     },
//   );
// }
