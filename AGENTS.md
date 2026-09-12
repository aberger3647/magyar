# AGENTS.md

## Cursor Cloud specific instructions

Magyar is a client-only React 19 + Vite + TypeScript SPA (Tailwind v4, shadcn/Radix UI). The only backend is a remote hosted **Supabase** project accessed with the anon key; there is no local backend/database to run and no auth.

### Services / commands
Single frontend service. Standard scripts live in `package.json`:
- Dev server: `npm run dev` (Vite on `http://localhost:5173`). Use `npm run dev -- --host` if you need it reachable on the VM network interface.
- Build: `npm run build` (`tsc -b` typecheck + `vite build`). <!-- pragma: allowlist secret -->
- Lint: `npm run lint` (ESLint flat config).

### Non-obvious notes
- Package manager: both `package-lock.json` (npm) and `bun.lock` (bun) are committed. This environment uses **npm** (`npm install` / `npm ci`); pick one manager and stick with it to avoid lockfile drift.
- Supabase credentials are provided as environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`) injected as Cloud Agent secrets — there is no committed `.env`. Vite reads them at dev/build time via `import.meta.env`. The Flash Cards feature (and only that feature) needs them; Conjugator, Grammar, and Phrasebook are fully local/static.
- `npm run lint` currently reports pre-existing errors (in `src/components/ui/*` and `src/hooks/use-mobile.ts`) unrelated to environment setup — do not treat these as environment breakage.
- The `import-anki` script (`npm run import-anki`) uses `better-sqlite3` (a native module) and is a maintenance tool, not part of the app runtime.
- Flash Cards write to the shared remote Supabase `flashcards`/`review_logs` tables and upload images to the `cardimages` bucket — avoid creating/reviewing cards in tests unless you intend to mutate shared data. The Conjugator quiz is a safe, fully-local flow for end-to-end verification.

### Verification and completion

Local Conjugator, Grammar, and Phrasebook checks may be run, fixed, and rerun without asking at
each step. Start with the focused test or browser flow for the changed behavior, then run the
relevant build and lint scripts. Treat the documented pre-existing lint baseline separately, but
do not add new findings. Shared Flash Card data changes remain explicit operations.

The task is done when the requested behavior is visible, the affected local or shared-data boundary
is verified, relevant checks pass, and the final diff contains no unrelated changes.
