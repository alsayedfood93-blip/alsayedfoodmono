# ALSAYED Food & Beverages

Production monorepo for **ALSAYED Food & Beverages / ALSAYED Coldrinks**.

This repository is the new ALSAYED production architecture. It will replace the legacy Next.js + Laravel implementation only after migration and production verification.

## Architecture

| Path | Role |
|------|------|
| `apps/web` | Customer-facing Next.js website |
| `apps/admin-web` | Next.js admin dashboard |
| `apps/api` | NestJS REST API |
| `packages/database` | Prisma and PostgreSQL database package |
| `packages/shared-types` | Shared TypeScript / API contract types |
| `packages/config` | Shared workspace TypeScript configuration |

## Local ports

| Service | URL |
|---------|-----|
| Web | http://localhost:3000 |
| Admin | http://localhost:3001 |
| API | http://localhost:3002/api |
| Swagger | http://localhost:3002/api/docs |
| PostgreSQL | localhost:5432 |

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io) 11+
- Docker / Docker Compose

## Setup

```bash
pnpm install
docker compose up -d
pnpm db:generate
pnpm db:migrate
pnpm dev
```

Copy `.env.example` to `.env` if you need a fresh local environment file.

## Build verification

```bash
pnpm build
```

Additional checks:

```bash
pnpm lint
pnpm typecheck
```

## Database scripts

| Script | Description |
|--------|-------------|
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:migrate` | Run development migrations |
| `pnpm db:deploy` | Apply migrations (deploy) |
| `pnpm db:studio` | Open Prisma Studio |

## Package manager

This monorepo uses **pnpm workspaces** and **Turborepo** only. Do not use npm or yarn.
