# Magyar verification map

This directory is the maintained source for verifying Magyar's user-facing behavior. Read this index before driving the app, then use the matching feature file as the recipe.

## Baseline preconditions

- Install from `package-lock.json` with `npm ci`; do not switch package managers during a verification run.
- Require `npm run build` and `npm test` to pass before browser verification.
- Launch with `scripts/control-magyar launch <port>` and require `doctor <port>` to pass.
- Drive only the exact environment port started by this run. A unique port creates an isolated browser origin for localStorage and sessionStorage.
- Magyar has no authentication. Conjugator, Grammar, Érzés, and the static portion of Search are local. Blog reads remote Strapi. Flash Cards and Phrasebook read and write the shared self-hosted Supabase stack at `https://supabase.csbod.com`.
- Never create, rate, edit, or delete a Flash Card or Phrasebook entry merely to smoke-test the UI. Those actions mutate shared tables or storage.

## Driving conventions

- Use one harness for the full run: T3 Code preview when automation-capable, otherwise the controller's isolated `agent-browser` fallback. Never use the unnamed default `agent-browser` session.
- Prefer ARIA roles, accessible names, labels, route paths, and visible headings over CSS selectors, DOM position, or coordinates.
- Start each recipe from its named route and baseline state.
- Treat quoted control names and Hungarian accents as exact.
- If a feature uses local persistence, prove it through a reload or second user-facing view and remove only the verification origin's scratch keys afterward.

## Proof and skip reporting

- Always capture before/after screenshots, semantic snapshots, and an action transcript. Capture a T3 recording when T3 is the harness; with `agent-browser`, video is optional and requires `ffmpeg`.
- Put artifacts in the path printed by `control-magyar evidence-dir <port>`.
- Record the feature ID, route, port, harness, asserted end state, and video availability alongside the artifacts.
- A route loading is not enough: exercise the feature's actual user path.
- For remote mutations, require explicit authorization and prove both the UI result and the Supabase table/storage side effect through a read-only second view.
- Report any untested entry point as skipped; do not claim it was covered through a different route.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph describing the visible behavior. It then uses exactly four H2 sections in this order.

1. `Sub-features` lists short IDs and behaviors.
2. `How to get to it (user POV)` lists user entry points.
3. `Driving it with the browser harness` gives preconditions, exact actions, and observable results.
4. `Gotchas` records traps that can invalidate proof.

## Features

- [Conjugator quiz](./conjugator.md) covers preferences, word selection, answering, hints, and completion.
- [Grammar lessons](./grammar.md) covers the lesson index and desktop/mobile lesson navigation.
- [Phrasebook](./phrasebook.md) covers shared phrase persistence, editing, filtering, URLs, and empty states.
- [Site search](./search.md) covers the global dialog, full results page, keyboard entry, categories, and result navigation.
- [Flash Cards](./flash-cards.md) covers study and create surfaces with mandatory shared-data safeguards.

The Home, Blog, and Érzés surfaces are identified but not yet mapped in detail; add them with `/maintain-verification-skill` when work touches those areas.
