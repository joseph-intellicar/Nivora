# Verification suites

These are the scripts behind the 🤖 checks in `tasks.md` and `tasks-phase2.md`. They used to live in a temporary scratch folder; they are kept here so they survive between sessions. Output (logs, screenshots, builds' logs) goes to `.out/` (git-ignored).

## Servers

| Script                      | Purpose                                                                                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `serve.sh start\|stop`      | `next start` of the current frontend build on **:3100** (never :3000). Pass `BACKEND_URL` for `http` builds. Refuses to start if the port is busy |
| `api.sh start\|stop [port]` | The built backend (`backend/dist`) on :4100. Use `ENV_FILE=.env.test FRONTEND_ORIGIN=http://localhost:3100` for test runs                         |

Typical `http`-mode run:

```bash
(cd backend && npm run build && ENV_FILE=.env.test npx prisma db seed -- --reset)
ENV_FILE=.env.test FRONTEND_ORIGIN=http://localhost:3100 scripts/verify/api.sh start 4100
(cd frontend && NEXT_PUBLIC_DATA_SOURCE=http BACKEND_URL=http://localhost:4100 npx next build)
BACKEND_URL=http://localhost:4100 scripts/verify/serve.sh start
```

## HTTP suites (Python 3, against :3100)

| Suite                                  | Checks                                                                                                |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `check-035.py`                         | Category/subcategory pages, 404s                                                                      |
| `check-040.py`                         | Product details pages                                                                                 |
| `check-057.py`                         | Discovery flows (search, filters, sort, pagination)                                                   |
| `check-039.py off\|on`                 | SEO: metadata, JSON-LD, robots and sitemap. `on` needs a build with `NEXT_PUBLIC_ALLOW_INDEXING=true` |
| `check-proxy.py`                       | `http` mode: guests get 307 → `/login?from=…`; a session cookie lets protected pages render           |
| `check-guard.py`, `check-stage7-11.py` | Mock mode: protected pages render only a skeleton, with no customer data                              |
| `a11y.py`                              | Static accessibility audit of key pages                                                               |
| `crawl.py`                             | Follows every link from Home: no broken links, all 154 products reachable                             |

## Node suites

These run the real data layer in Node. `register.mjs` resolves `@/…` and `@nivora/shared/…` to TypeScript source.

```bash
cd scripts/verify
node --import ./register.mjs --import ./browser-shim.mjs e2e-journeys.mjs   # mock mode (localStorage shim)
node --import ./register.mjs --import ./http-shim.mjs e2e-journeys.mjs      # http mode via :3100 + cookie jar
```

`check-0xx.mjs` cover data, domain rules and the mock adapters. `e2e-journeys.mjs` and `check-stage3.mjs` run in either mode. `check-data.mjs @nivora/shared/data/products:PRODUCTS` checks catalog quality.

## Screenshots and performance

| Script                                      | Purpose                                                                                                                     |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `shot.sh <path> <w> <h> <out.png>`          | Headless Chrome screenshot as a guest                                                                                       |
| `shot-session.mjs <outDir> <w> <h> <path>…` | Screenshots as Joseph (session cookie via the DevTools protocol). `PREP=cart` fills the cart first; `LOGIN=0` stays a guest |
| `perf.mjs [n]`                              | p50/p95 latency of the main API endpoints (API on :4100, seeded `nivora_test`)                                              |
| `query-count.sh`                            | SQL statements per endpoint (start the API with `PRISMA_LOG_QUERIES=1`; `VERBOSE=1` lists them)                             |
