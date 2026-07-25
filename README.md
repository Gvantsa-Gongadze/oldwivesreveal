# Old Wives' Reveal

A folk "blood renewal" baby-gender calculator. Father's cycle is 4 years, mother's is 3;
whoever is closer to their renewal point at the reckoning date "wins," and the result flips
if the mother is older than the father. Purely for fun — not medical prediction.

## Stack

- **apps/api** — NestJS + Prisma + PostgreSQL. Computes and stores each reckoning.
- **apps/web** — React 18 + Vite + TanStack Query. Renders the cycle dials and verdict, and
  lists recent history.
- **packages/shared-types** — the calculation logic and request/response types, shared by
  both apps so there's a single source of truth for the math.

No accounts, no Redis, no background jobs — this scope is just "reckon and remember."

## Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm` if you don't have it)
- Docker (for Postgres) — or point `DATABASE_URL` at your own Postgres instance

## First-time setup

```bash
# from the project root
pnpm install

# start Postgres
docker compose up -d

# configure the API's environment
cp apps/api/.env.example apps/api/.env

# generate the Prisma client and create the reveals table
pnpm --filter api prisma:generate
pnpm --filter api prisma:migrate
```

The migrate command will prompt you for a migration name the first time (e.g. `init`).

## Running it

In two terminals:

```bash
pnpm dev:api   # http://localhost:3000
pnpm dev:web   # http://localhost:5173
```

Open http://localhost:5173 — the web app proxies `/api/*` to the Nest server.

## Project layout

```
apps/
  api/            NestJS backend
    prisma/schema.prisma
    src/
      reveals/    controller, service, DTO
      prisma/     PrismaService
  web/            React frontend
    src/
      components/ CycleDial, VerdictCard, RevealForm, HistoryList
      api/        fetch client for the reveals endpoints
packages/
  shared-types/   calculateReveal() + shared TS types
```

## API

- `POST /reveals` — body `{ fatherBirthDate, motherBirthDate, reckonDate }` (all `YYYY-MM-DD`),
  returns the full reading and persists it.
- `GET /reveals?limit=10` — recent history, newest first.
- `GET /reveals/:id` — a single stored reading.

## Note on this build

Dependencies were installed and the `shared-types` and `web` packages were verified to
compile cleanly. The Prisma client couldn't be generated in the sandbox this was built in
(its engine binaries are fetched from `binaries.prisma.sh`, which wasn't reachable there),
so the `api` package's build wasn't run end-to-end — but the schema fields, service, and
controller were manually cross-checked for consistency. Running `pnpm --filter api
prisma:generate` on your own machine should resolve this and let `pnpm --filter api build`
complete normally. If it doesn't, share the error and I'll fix it.
