---
name: verify-magyar
description: Verify Magyar's React web UI through the real browser when changing routes, learning tools, local persistence, or shared self-hosted Supabase behavior.
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

Choose one browser harness for the entire run:

1. **T3 Code, when available.** Call `preview_status`; call `preview_open` if no tab is attached. If the preview becomes automation-capable, navigate with `preview_navigate` using the environment-port target, call `preview_snapshot`, and interact through semantic preview tools. Do not switch controllers after T3 has opened the verification page.
2. **Standalone fallback.** If T3 preview tools are absent or explicitly unavailable, require `agent-browser` and run `agent-browser doctor`. The controller wraps every command in a named session derived from this worktree and port, preventing the default shared browser from being hijacked:

   ```bash
   ./.agents/skills/verify-magyar/scripts/control-magyar browser 4173 open http://127.0.0.1:4173/conjugator
   ./.agents/skills/verify-magyar/scripts/control-magyar browser 4173 snapshot -i
   ```

3. If neither harness is available, report browser acceptance as unavailable. Do not substitute component rendering, curl, or unit tests for a user-flow claim.

With either harness, use a desktop viewport such as `1440x900` unless the recipe explicitly tests mobile navigation. Prefer snapshot refs, ARIA roles, accessible names, labels, route paths, and visible headings over coordinates. Stable handles include `Conjugator Quiz`, `Magyar`, `English`, `Search phrases`, the six pronouns, `Clear all`, `Start Quiz`, `Submit`, `Finish Quiz`, `Open Menu`, and `Select lesson`.

For the safe Conjugator smoke path:

1. Navigate to `/conjugator` and snapshot the page.
2. Choose `Clear all`, select the checkbox named `lát`, and choose `Start Quiz`. With `agent-browser`, use `find role button click --name "Clear all"`, `find role checkbox click --name "lát"`, and `find role button click --name "Start Quiz"`. If T3 cannot resolve the checkbox semantically, use the stable selector `#word-lát` in the row labeled `lát`.
3. Require the URL to include `/conjugator/present/indefinite` and the page to show `Word 1 of 1`.
4. Fill the labeled inputs with `én=látok`, `te=látsz`, `ő=lát`, `mi=látunk`, `ti=láttok`, and `ők=látnak`. With `agent-browser`, use `find label "én" fill "látok"` and the equivalent command for each remaining label.
5. Choose `Submit`. Immediately capture the transient success toast, then require an enabled button named `Finish Quiz` and six correct indicators. With `agent-browser`, use `find role button click --name "Submit"`, `wait --text "Finish Quiz"`, then re-snapshot.

This is a real user path: select preferences, start the quiz, enter answers, submit, and observe the result. Do not seed the answer form through JavaScript or call internal functions.

## Evidence

Record the action and the resulting state, not only the final screen.

1. Get the evidence directory before browser actions:

   ```bash
   EVIDENCE="$(./.agents/skills/verify-magyar/scripts/control-magyar evidence-dir 4173)"
   ```

2. Save a screenshot and semantic snapshot before the first user action and after the observable end state. Keep an `actions.txt` transcript of the semantic commands and their observed results.
3. With T3, start a preview recording before the first user action and stop it after the result is visible. Use `preview_snapshot(save=true)`, then copy every returned file with `control-magyar artifact`.
4. With `agent-browser`, write artifacts directly into the evidence directory. Video is additional evidence only: run `record start` and `record stop` when `ffmpeg` is available, but do not fail or skip the browser proof when it is absent.

   ```bash
   ./.agents/skills/verify-magyar/scripts/control-magyar browser 4173 screenshot "$EVIDENCE/conjugator-before.png"
   ./.agents/skills/verify-magyar/scripts/control-magyar browser 4173 snapshot -i > "$EVIDENCE/conjugator-before.txt"
   # Perform the real user flow and append its semantic actions/results to "$EVIDENCE/actions.txt".
   ./.agents/skills/verify-magyar/scripts/control-magyar browser 4173 screenshot "$EVIDENCE/conjugator-after.png"
   ./.agents/skills/verify-magyar/scripts/control-magyar browser 4173 snapshot -i > "$EVIDENCE/conjugator-after.txt"
   ```

5. Record the feature ID, route, port, harness, expected end state, and whether video was captured or unavailable in `notes.txt` inside the same evidence directory.

Proof must exercise the production UI, not internal setters or test-only endpoints. Phrasebook and Flash Cards write to shared self-hosted Supabase tables or storage. Their creates, edits, ratings, and deletes require explicit authorization plus a read-only second view of the affected row/object. Mocks are acceptable only where the production boundary already provides isolation. Do not infer safety from a label such as dry-run; observe the database, storage, network, or filesystem boundary it claims to skip.

## Cleanup

First remove only the browser scratch state created on the verification origin. With T3, use `preview_evaluate`. With the standalone fallback, run:

```bash
./.agents/skills/verify-magyar/scripts/control-magyar browser 4173 eval "localStorage.removeItem('quizWords'); localStorage.removeItem('quizPreferences'); localStorage.removeItem('randomWord'); localStorage.removeItem('phrasebook.customPhrases'); sessionStorage.removeItem('completedQuizWords'); true"
./.agents/skills/verify-magyar/scripts/control-magyar browser 4173 close
```

Do not clear storage on a different port, the unnamed default `agent-browser` session, or a user-owned tab.

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
./.agents/skills/verify-magyar/scripts/control-magyar browser 4173 snapshot -i
./.agents/skills/verify-magyar/scripts/control-magyar cleanup 4173
```

It manages the exact Vite process it starts, checks readiness and ownership, copies browser-produced evidence, and proxies `agent-browser` through an isolated worktree-and-port session. Browser commands still act on the real UI and may mutate application data; follow the feature map's boundary rules.
