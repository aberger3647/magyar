---
name: verify-magyar
description: Verify Magyar's React web UI through the real browser when changing routes, learning tools, local persistence, or shared Supabase flash-card behavior.
---

# Verify Magyar

Use this skill to prove Magyar as a user experiences it. The primary surface is the React/Vite browser app. `scripts/import-anki.ts` is a separate maintenance CLI and is outside this verifier's browser scope.

Read `features/README.md` before driving a feature. Use the matching feature file for its complete entry points, proof states, and safety constraints.

## Launch

1. From the repository root, install the committed dependency set if `node_modules/.bin/vite` is missing:

   ```bash
   npm ci
   ```

2. Prove the checkout can compile before launching it:

   ```bash
   npm run build
   npm test
   ```

3. Start an isolated verification instance on port `4173` in a persistent terminal or an exec command that can yield a live session:

   ```bash
   ./.agents/skills/verify-magyar/scripts/control-magyar launch 4173
   ```

   The controller refuses an occupied port, records the exact process it owns, prints the loopback health URL and evidence directory, and then stays attached to this checkout's Vite process. Vite listens on `0.0.0.0` so the T3 environment-port preview can reach it; doctor still checks through `127.0.0.1`. The helper adds the machine's exact Tailscale DNS name to Vite's allowed hosts when it can detect one; set `VERIFY_MAGYAR_ALLOWED_HOST` explicitly if the preview uses a different hostname. In Codex, retain the yielded exec session ID. Runtime state lives in `/tmp/verify-magyar-4173`; evidence lives under `.verification-evidence/` and survives cleanup.

4. From a second terminal/tool call, poll `doctor 4173` until it reports healthy. If another verifier already owns `4173`, choose a different explicit port such as `4174`. Different ports create different browser origins, so localStorage and sessionStorage do not collide.

Teardown is:

```bash
./.agents/skills/verify-magyar/scripts/control-magyar cleanup 4173
```

Use the same port for every command in one run.

## Doctor

Run this first whenever the browser, route, or stored state looks wrong:

```bash
./.agents/skills/verify-magyar/scripts/control-magyar doctor 4173
```

Doctor is read-only. It requires all of the following: the recorded PID is alive, its command belongs to this checkout's Vite installation, that PID owns the requested listening port, the current Git revision matches the revision recorded at launch, and the served HTML contains Magyar's page title. Never drive an instance that fails doctor or was not started by this controller.

## Drive

Use the T3 Code collaborative browser on Codex:

1. Call `preview_status`. If no automation-capable preview is attached, call `preview_open`.
2. Navigate with `preview_navigate` using the environment-port target for the controller's port. Supply a route path when the feature recipe names one.
3. Set a desktop viewport such as `1440x900` unless the recipe is explicitly testing the mobile menu. For mobile navigation, use a named mobile preset and the `Open Menu` button.
4. Call `preview_snapshot` before interacting. Use its role/name locators with `preview_click`, `preview_type`, `preview_press`, and `preview_wait_for`; do not use coordinates when a semantic locator exists.
5. Prefer the repository's stable handles: headings such as `Conjugator Quiz`, labels such as `Magyar`, `English`, `Search phrases`, and the six pronouns, and controls such as `Clear all`, `Start Quiz`, `Submit`, `Finish Quiz`, `Open Menu`, and `Select lesson`.

For the safe Conjugator smoke path:

1. Navigate to `/conjugator`.
2. Choose `Clear all`, click the stable checkbox selector `#word-lát` in the row labeled `lát`, and choose `Start Quiz`.
3. Require the URL to include `/conjugator/present/indefinite` and the page to show `Word 1 of 1`.
4. Fill the labeled inputs with `én=látok`, `te=látsz`, `ő=lát`, `mi=látunk`, `ti=láttok`, and `ők=látnak`.
5. Choose `Submit`. Immediately capture the transient success toast, then require an enabled button named `Finish Quiz` and six correct indicators.

This is a real user path: select preferences, start the quiz, enter answers, submit, and observe the result. Do not seed the answer form through JavaScript or call internal functions.

## Evidence

Record the action and the resulting state, not only the final screen.

1. Start a browser recording before the first user action and stop it after the result is visible.
2. Save a screenshot before the action and another after the observable end state with `preview_snapshot(save=true)`.
3. Copy every returned screenshot or recording into the run's evidence directory:

   ```bash
   ./.agents/skills/verify-magyar/scripts/control-magyar artifact 4173 /path/returned/by/preview conjugator-after.png
   ```

4. Record the feature ID, route, port, and expected end state in `notes.txt` inside the same evidence directory. Get the directory with:

   ```bash
   ./.agents/skills/verify-magyar/scripts/control-magyar evidence-dir 4173
   ```

Proof must exercise the production UI, not internal setters or test-only endpoints. For local persistence such as Phrasebook entries, reload or revisit the route and prove the value remains visible. For Flash Cards, visible UI is insufficient: ratings, edits, creates, and deletes write to shared Supabase tables or storage and require explicit authorization plus a read-only second view of the affected row/object. Mocks are acceptable only where the production boundary already provides isolation. Do not infer safety from a label such as dry-run; observe the database, storage, network, or filesystem boundary it claims to skip.

## Cleanup

First remove only the browser scratch state created on the verification origin. In the verification tab, use `preview_evaluate` to remove `quizWords`, `randomWord`, `completedQuizWords`, and any feature-specific local state such as `phrasebook.customPhrases`; do not clear storage on a different port or a user-owned tab.

Then stop only the controller-owned instance:

```bash
./.agents/skills/verify-magyar/scripts/control-magyar cleanup 4173
```

The controller validates the recorded PID and command before signaling it. It never kills by process name. Cleanup removes `/tmp/verify-magyar-4173` but intentionally leaves `.verification-evidence/<run>/` intact. After cleanup, confirm the evidence directory and its artifacts still exist.

## Helpers

`scripts/control-magyar` is executable and is the only shipped helper:

```bash
./.agents/skills/verify-magyar/scripts/control-magyar launch 4173
./.agents/skills/verify-magyar/scripts/control-magyar doctor 4173
./.agents/skills/verify-magyar/scripts/control-magyar evidence-dir 4173
./.agents/skills/verify-magyar/scripts/control-magyar artifact 4173 /source/file proof.png
./.agents/skills/verify-magyar/scripts/control-magyar cleanup 4173
```

It manages the exact Vite process it starts, checks readiness and ownership, and copies browser-produced evidence into the persistent run directory. It does not drive the browser or mutate application data.
