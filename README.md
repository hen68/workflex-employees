# WORKFLEX — Employees & Projects

A small full-stack app to manage employees and compute a project's total monthly cost. Built for the WORKFLEX take-home and optimized for the stated grading axes — code structure, commit quality, backend validation, and the reasoning below — not feature count.

## Stack

- **Backend** — Node.js + Express 5 + TypeScript, Prisma ORM, PostgreSQL, zod validation.
- **Frontend** — Next.js 15 (App Router) + React 19 + TypeScript, used as a **client-only** React shell that calls the Express API.
- **Tooling** — pnpm workspace, Docker (Postgres), Vitest.

## Run locally

Prerequisites: Node 22, pnpm 10, Docker.

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
docker compose up -d --wait      # Postgres; --wait blocks until healthy
pnpm install
pnpm db:migrate                  # prisma migrate deploy + generate (non-interactive)
pnpm db:seed                     # 7 sample employees across 3 projects
pnpm dev                         # API on :4000, web on :3000
```

Open http://localhost:3000. `pnpm test` runs the unit tests; `pnpm typecheck` and `pnpm lint` are the quality gates (also run in CI).

## API

Base path `/api`. JSON throughout, with a consistent error envelope: `{ "error": { "message": string, "fieldErrors"?: Record<string, string[]> } }`.

| Method | Path | Notes |
|---|---|---|
| GET | `/api/employees?project=&status=` | List; optional filters, AND-combined, exact match; invalid `status` → 400 |
| POST | `/api/employees` | Create (validated) → 201 |
| GET | `/api/employees/:id` | One → 200 / 404 |
| PUT | `/api/employees/:id` | Full update (validated; `status` required) → 200 / 404 |
| DELETE | `/api/employees/:id` | → 204 / 404 |
| GET | `/api/employees/summary?project=X` | `{ project, employeeCount, standardMonthlyHours, totalCost }`; missing `project` → 400 |

## Assumptions & decisions (the reasoning)

**The hours/rate gap — the central judgement call.** The brief lists an *hourly rate* per employee but **no hours field**, while the summary asks for *sum of hours × rate* — a genuine contradiction in the spec. I resolved it explicitly rather than guessing: a single configured constant **`STANDARD_MONTHLY_HOURS`** (env, default **168** — a conventional full-time month, ~21 working days × 8 h; 160 is the rounded alternative). Each ACTIVE employee contributes `STANDARD_MONTHLY_HOURS × hourlyRate`. The realistic alternative — per-employee logged hours / timesheets — is a whole subsystem the brief does not ask for and is intentionally deferred (top of "With more time").

**Project cost counts ACTIVE employees only.** The brief doesn't qualify cost by status; I treat INACTIVE as "not currently billing", so they are excluded from both `totalCost` and `employeeCount`. Called out prominently so a reviewer hand-summing a project doesn't read the lower figure as a bug.

**Money is never a float.** `hourlyRate` is `Decimal(10,2)` in Postgres, all arithmetic uses `Prisma.Decimal`, and `totalCost` is returned (and rendered) as a **string** so precision survives JSON and the client never re-floats it.

**Validation is backend-authoritative.** zod schemas are parsed at the request boundary inside each route handler (no middleware / `res.locals` indirection — the parsed value's type flows by inference, with no casts). A failed parse throws a `ZodError` that the single central error handler maps to `400` with `fieldErrors`; the frontend only surfaces those. `PUT` is a full replace and **requires `status`**, so an update cannot silently flip it. An unknown project is a valid empty query → `200` with `totalCost: "0.00"` (not a 404).

**Scope kept deliberately small.** `project` is a plain string (no Project entity / project CRUD — not asked, YAGNI). The backend has no controller/repository/DI ceremony for a single entity: `route → zod → service → Prisma`, with one central error handler. Prisma migrations are committed so `migrate deploy` reproduces the schema on a clean clone.

**Frontend is a client-only React shell.** Next.js App Router is used purely as the React framework + router + dev server; all components are Client Components and the Express API owns data — this avoids running two server layers for a mini app. The data layer is one typed `fetch` wrapper + one `useEmployees` hook (no data-fetching library). Filtering is **apply-on-blur/submit** (not per-keystroke) and uses **keep-previous-data + request cancellation**: the list never blanks or flickers on a filter change, and the latest filter always wins. Backend validation errors render inline via `aria-describedby`; markup is semantic and accessible. Styling is a light, modern pass kept intentionally lean (the brief de-scopes polished styling).

## Testing

Vitest unit tests cover the pure core — `calculateProjectCost` (empty project, INACTIVE excluded, multiple employees, decimal precision) and the zod schemas (trimming, string/numeric `hourlyRate`, 2-decimal/range bounds, enum, unknown-key stripping, `status` required on update). No DB, no mocks, no supertest. Endpoint wiring is verified via the run path above; an integration harness is intentionally out of scope — infrastructure disproportionate to a task that lists unit tests as optional.

## With more time

- Authentication & authorization.
- A normalized `Project` entity + project CRUD.
- Per-employee logged hours / timesheets (the realistic replacement for the fixed-hours assumption).
- Pagination & sorting; debounced live search as an alternative filter UX.
- A shared zod/types package to remove the frontend↔backend type mirroring.
- OpenAPI/Swagger; Playwright E2E.
- Structured logging + graceful shutdown; optimistic UI / a data-fetching library.
