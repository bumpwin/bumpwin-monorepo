# Cloudflare Pages Setup

## Local Development with Cloudflare Pages

### 1. Setup wrangler config

Copy the example configuration:
```bash
cp wrangler.jsonc.example wrangler.jsonc
```

Update `wrangler.jsonc` with your actual Supabase credentials:
```json
{
  "vars": {
    "NEXT_PUBLIC_SUPABASE_URL": "https://your-project.supabase.co",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "your_actual_anon_key_here"
  }
}
```

### 2. Commands

- **Build**: `pnpm run pages:build`
- **Preview**: `pnpm run pages:preview` (or `j p`)
- **Deploy**: `pnpm run pages:deploy`

### 3. Production Deployment

For production, set environment variables in Cloudflare Dashboard:
1. Go to Cloudflare Pages → Your project → Settings → Environment variables
2. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Security Notes

- `wrangler.jsonc` is git-ignored for security
- ANON keys are client-public by design but should not be committed to public repos
- Use Cloudflare Dashboard for production secrets
- Enable Row Level Security (RLS) in Supabase for actual access control