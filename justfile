set shell := ["bash", "-euo", "pipefail", "-c"]

PROJECT_NAME := "monorepo-template-web"

install:
    echo "Installing dependencies for all packages..."
    bun install
    pnpm install
    echo "Installing dependencies for apps/api..."
    (cd apps/api && bun install && pnpm install)
    echo "Installing dependencies for apps/web..."
    (cd apps/web && bun install && pnpm install)
    echo "Installing dependencies for packages/sui..."
    (cd packages/sui && bun install && pnpm install)
    echo "Installing dependencies for packages/logger..."
    (cd packages/logger && bun install && pnpm install)
    echo "Installing dependencies for packages/supabase..."
    (cd packages/supabase && bun install && pnpm install)
    echo "Installing dependencies for packages/shadcn..."
    (cd packages/shadcn && bun install && pnpm install)
    echo "All installations completed."

dev:
    bun run dev

server-dev:
    bun run server:dev

build:
    bun run build

format:
    bun run format

lint:
    bun run lint

build-packages:
    echo "Building packages..."
    pnpm --filter @workspace/logger build
    pnpm --filter @workspace/sui build
    pnpm --filter @workspace/supabase build
    echo "All packages built."

typecheck:
    bun run typecheck

checkall: format lint # typecheck

create-package pkg_name:
    ./scripts/create-package.sh {{pkg_name}}

shadcn-add component_name:
    (cd packages/shadcn && bunx --bun shadcn@canary add {{component_name}})

pages-build:
    pnpm run pages:build

pages-preview:
    pnpm run pages:preview

pages-deploy:
    pnpm run pages:deploy --project-name {{PROJECT_NAME}}


## QuestDB

questdb-start:
    docker run -p 9000:9000 -p 8812:8812 questdb/questdb:latest

questdb-stop:
    # TODO:

questdb-deploy:
    (cd packages/questdb && QDB_HOST=localhost QDB_PG_PORT=8812 QDB_USER=admin QDB_PASSWORD=quest bunx tsx src/deploy.ts)

questdb-seed:
    (cd packages/questdb && QDB_HOST=localhost QDB_PG_PORT=8812 QDB_USER=admin QDB_PASSWORD=quest bunx tsx src/seed.ts)

questdb-query:
    (cd packages/questdb && QDB_HOST=localhost QDB_PG_PORT=8812 QDB_USER=admin QDB_PASSWORD=quest bunx tsx src/query.ts)

## Supabase

supabase-init:
    supabase init

supabase-login:
    supabase login

supabase-link project_ref:
    supabase link --project-ref {{project_ref}}

supabase-start:
    supabase start

supabase-stop:
    supabase stop --no-backup

supabase-reset:
    supabase db reset

supabase-migration-new name:
    supabase migration new {{name}}

supabase-pull:
    supabase db pull

supabase-push:
    supabase db push

supabase-status:
    supabase status

supabase-migration-list:
    supabase migration list

## Jobs

listen-chat:
    (cd apps/cmd && bun run listen-chat)
