# AGENTS.md

## Cursor Cloud specific instructions

Magyar is a client-only React 19 + Vite + TypeScript SPA (Tailwind v4, shadcn/Radix UI). Its backend is the shared self-hosted **Supabase** stack on this server, accessed from the browser with the anon key. There is no auth.

### Production infrastructure

- The live site is `https://magyar.alexberger.dev` (`https://hlog.csbod.com` is an alias). Netlify is obsolete and is not a deployment target.
- Dokploy application: `hlog-frontend-krhvr5`, application ID `VYaCBiN22slKLmX5ne3mf`, GitHub repository `aberger3647/magyar`, branch `main`. Pushes to `main` automatically deploy to production.
- Supabase API: `https://supabase.csbod.com`. Dokploy compose stack: `cf-supabase-dygaax`. Database container: `cf-supabase-dygaax-supabase-db`.
- The separate `supabase_*_stitchlog` containers and the stack exposed on localhost port `54321` belong to another project. They contain no Magyar tables. Do not migrate, restart, or delete them while working on Magyar.
- This is not a Supabase Cloud project. Do not run `supabase login`, search for a `*.supabase.co` project, or ask for Supabase Cloud credentials. Inspect the self-hosted stack with `sudo docker` and use the repository migrations in `supabase/migrations/`.
- `VITE_*` values are baked into the static bundle at build time. Dokploy already stores `VITE_SUPABASE_URL=https://supabase.csbod.com` and the matching anon/publishable keys. Verify the built bundle or public app after deployment rather than changing runtime container variables.
- Database changes and production deployments are shared external mutations and still require explicit approval. When a migration is approved, apply it to the database container and record its version in `supabase_migrations.schema_migrations` as `supabase_admin`.

### Services / commands
Single frontend service. Standard scripts live in `package.json`:
- Dev server: `npm run dev` (Vite on `http://localhost:5173`). Use `npm run dev -- --host` if you need it reachable on the VM network interface.
- Build: `npm run build` (`tsc -b` typecheck + `vite build`). <!-- pragma: allowlist secret -->
- Lint: `npm run lint` (ESLint flat config).

### Non-obvious notes
- Package manager: both `package-lock.json` (npm) and `bun.lock` (bun) are committed. This environment uses **npm** (`npm install` / `npm ci`); pick one manager and stick with it to avoid lockfile drift.
- Supabase credentials are provided as environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`) — there is no committed `.env`. Vite reads them at build time via `import.meta.env`. Flash Cards and Phrasebook need them; Conjugator and Grammar are fully local/static.
- `npm run lint` currently reports pre-existing errors (in `src/components/ui/*` and `src/hooks/use-mobile.ts`) unrelated to environment setup — do not treat these as environment breakage.
- The `import-anki` script (`npm run import-anki`) uses `better-sqlite3` (a native module) and is a maintenance tool, not part of the app runtime.
- Flash Cards write to the shared Supabase `flashcards`/`review_logs` tables and upload images to the `cardimages` bucket. Phrasebook writes to the shared `phrasebook_entries` table. Avoid mutating either feature in tests unless you intend to change shared data. The Conjugator quiz is a safe, fully-local flow for end-to-end verification.

### Verification and completion

Local Conjugator and Grammar checks may be run, fixed, and rerun without asking at
each step. Start with the focused test or browser flow for the changed behavior, then run the
relevant build and lint scripts. Treat the documented pre-existing lint baseline separately, but
do not add new findings. Shared Flash Card and Phrasebook data changes remain explicit operations.

The task is done when the requested behavior is visible, the affected local or shared-data boundary
is verified, relevant checks pass, and the final diff contains no unrelated changes.
