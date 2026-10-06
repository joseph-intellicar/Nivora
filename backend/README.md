# Nivora Backend (Phase 2)

Not scaffolded yet.

**Stack:** NestJS 12 + TypeScript · Prisma 7 (`@prisma/adapter-pg`) · Neon PostgreSQL 18 · Zod (shared) · Jest.

- Design: [`../docs/backend-architecture.md`](../docs/backend-architecture.md)
- Requirements: [`../requirements.md`](../requirements.md)

## Environment

Secrets live in `backend/.env` (git-ignored). Copy `.env.example` and fill in:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon **pooled** connection string (host contains `-pooler`) — used by the API |
| `DIRECT_URL` | Neon **direct** connection string — used by Prisma Migrate |

Never commit `.env` or paste connection strings into documents.
