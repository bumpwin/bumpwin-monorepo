FROM oven/bun:1.0.25-slim

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/cmd/package.json ./apps/cmd/
COPY packages/logger/package.json ./packages/logger/
COPY packages/sui/package.json ./packages/sui/
COPY packages/supabase/package.json ./packages/supabase/

# Install pnpm and dependencies
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile --filter ./apps/cmd...

# Copy source code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start the server
CMD ["bun", "run", "server/index.ts"]
