// Supabase configuration
export const SUPABASE_CONFIG = {
  // Supabase project configuration
  PROJECT: {
    URL: (process.env.SUPABASE_URL as string) || "http://127.0.0.1:54321",
    ANON_KEY:
      (process.env.SUPABASE_ANON_KEY as string) ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",
  },
};
