# OneGovFlow

OneGovFlow is a premium GovTech workspace that lets citizens create one reusable profile, manage verified documents, understand eligibility, and track government applications from one place.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- `pnpm --filter @workspace/onegovflow run typecheck` — check the web app
- `pnpm --filter @workspace/api-server run typecheck` — check the API server

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/onegovflow/src/contexts/language-context.tsx` — mandatory first-run language onboarding, Supabase preference sync, and shared translations
- `artifacts/onegovflow/src/components/app-shell.tsx` — responsive citizen workspace shell and navigation
- `artifacts/onegovflow/src/pages/app-pages.tsx` — routed landing, citizen, service, application, GovGuide, admin, and settings screens
- `artifacts/onegovflow/src/index.css` — OneGovFlow design tokens, typography, motion, and theme
- `artifacts/api-server/src/routes/onegovflow.ts` — MVP API routes
- `artifacts/api-server/src/data/onegovflow.ts` — seeded MVP data and demo state
- `lib/api-spec/openapi.yaml` — source of truth for typed API contracts

## Architecture decisions

- The frontend is contract-first: user-facing API calls are represented in OpenAPI before hooks are generated.
- The visual language adapts the supplied scholarship portal references into OneGovFlow branding without reusing SBI assets or identity.
- The first MVP slice uses seeded data so the full demo remains usable while additional Supabase tables are wired.
- Language onboarding is a global provider, not a page-level feature, so new screens inherit the selected language automatically.
- Supabase stores `user_preferences.preferred_language`; local storage is only the fast client-side cache.

## Product

The current MVP includes a mandatory English/Hindi language onboarding screen, public landing page, login entry state, citizen dashboard, readiness score, document vault, profile editor, services marketplace, explainable eligibility results, application tracking, GovGuide workflow assistant, officer dashboard, settings, and Judge Demo Mode.

## User preferences

- Treat this as the long-term OneGovFlow codebase for Team Inoverse and SIH26129.
- Extend existing files and components; do not regenerate, rename, or replace working routes or components without an explicit request.
- Keep the product premium, trustworthy, spacious, and production-oriented rather than visually generic.
- Use React, TypeScript, Tailwind CSS, Framer Motion, and Supabase-compatible boundaries.

## Gotchas

- The app must never render the landing, login, or dashboard before a language has been selected.
- Run API codegen after every OpenAPI change before importing new generated hooks or schemas.
- Artifact workflows provide `PORT` and `BASE_PATH`; do not run the web app through a manually configured replacement workflow.
- Do not silently choose between multiple Supabase connections; bind the connection the user selects.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
