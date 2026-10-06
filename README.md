# Nivora

Nivora is a modern consumer e-commerce web application.

## Repository structure

```
nivora/
├── frontend/         Customer-facing web app (Phase 1 focus)
├── backend/          Placeholder — backend is built in Phase 2
├── docs/             Project documentation (architecture.md)
├── requirements.md   Product requirements (source of truth)
├── conversation.md   Running log of working sessions and decisions
├── tasks.md          Implementation roadmap with verification steps
├── README.md
└── .gitignore
```

## Project phases

- **Phase 1 (current):** Frontend only. Uses mock product data, mock
  authentication, and localStorage for persistence. Payment is Cash on
  Delivery only.
- **Phase 2:** Real backend API and database in `backend/`, replacing the
  Phase 1 mock/localStorage data layer without rewriting the UI.

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
