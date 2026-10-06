# Nivora

Nivora is a modern consumer e-commerce web application.

## Repository structure

```
nivora/
├── frontend/         Customer-facing web app (Phase 1 focus)
├── backend/          Phase 2 backend (NestJS + Prisma + Neon) — design ready, not scaffolded
├── docs/             architecture.md, backend-architecture.md, manual-testing.md
├── requirements.md   Product requirements (source of truth)
├── conversation.md   Running log of working sessions and decisions
├── tasks.md          Phase 1 roadmap (complete)
├── tasks-phase2.md   Phase 2 roadmap: backend + frontend integration
├── README.md
└── .gitignore
```

## Project phases

- **Phase 1 (complete):** Frontend only. Uses mock product data, mock
  authentication, and localStorage for persistence. Payment is Cash on
  Delivery only.
- **Phase 2 (next):** Real backend in `backend/` — **NestJS + TypeScript, Prisma, Neon
  PostgreSQL** — replacing the Phase 1 mock/localStorage data layer without rewriting the UI.
  Design: [`docs/backend-architecture.md`](docs/backend-architecture.md).

See [`requirements.md`](requirements.md) for the full product requirements and
[`docs/architecture.md`](docs/architecture.md) for the frontend architecture.

## Frontend stack (Phase 1)

Next.js (App Router) · React · TypeScript · Tailwind CSS · TanStack Query ·
Zustand · React Hook Form · Zod

## Status

Phase 1 frontend implemented: all 65 tasks in [`tasks.md`](tasks.md) are done and verified by
scripted/HTTP checks. Browser walkthrough: [`docs/manual-testing.md`](docs/manual-testing.md).

Run it: `cd frontend && npm install && npm run dev`, then open http://localhost:3000.
Test account: **joseph@example.com / password123**.
