# Phrasebook

Phrasebook lets a user add and edit Hungarian/English phrase pairs stored in shared Supabase, filter built-in and custom phrases, and share the active filter through the URL.

## Sub-features

- `phrasebook-add` saves a trimmed Hungarian and English pair.
- `phrasebook-persist` restores custom phrases on another device or after reload.
- `phrasebook-edit` updates or deletes a saved phrase.
- `phrasebook-filter` matches Hungarian or English text without requiring accents.
- `phrasebook-url` mirrors the active query in `?q=`.
- `phrasebook-empty` shows a specific no-match message.

## How to get to it (user POV)

- Choose `Phrasebook` in the desktop navigation.
- Open `Open Menu` on mobile and choose `Phrasebook`.
- Choose the `Phrasebook` card on Home.
- Open `/phrasebook` directly.
- Open a phrase result from global or full-page search.

## Driving it with the browser harness

Preconditions:

- Controller doctor passes for the verification port.
- Supabase environment variables point to the intended shared project.
- Start at `/phrasebook` on the isolated verification origin.
- No existing custom phrase equals `Jó tesztelést!` / `Happy testing!`.
- Explicit authorization was given to create, edit, and delete a temporary shared row.

- **Add a phrase.** Fill textbox `Magyar` with `Jó tesztelést!` and textbox `English` with `Happy testing!`; choose `Add phrase`. Both fields clear and the new pair appears before the built-in phrases.
- **Confirm persistence.** Reload `/phrasebook` or open it from a second browser origin. The same pair remains visible from the user-facing list.
- **Edit the phrase.** Choose `Edit phrases`, change the English value, and choose `Save`. Reload and require the updated value.
- **Filter in English.** Fill `Search phrases` with `Happy testing`. Only matching phrase rows remain and the URL contains `?q=Happy+testing` or its equivalent encoding.
- **Filter without accents.** Replace the query with a built-in Hungarian term without diacritics when applicable. A matching accented phrase remains visible.
- **Prove the empty state.** Search `volcano-never-matches`. Require `No phrases match “volcano-never-matches”.`.
- **Cleanup and proof.** Delete the temporary phrase through the UI, then confirm through a read-only Supabase query that it no longer exists. Capture add, reload, edit, match, empty state, and cleanup with screenshots, semantic snapshots, and an action transcript. Add video when the chosen harness supports it.

## Gotchas

- Custom phrases live in the shared `phrasebook_entries` table. Browser actions mutate shared data even on an isolated verification port.
- Existing values in `localStorage` key `phrasebook.customPhrases` are imported once and the key is removed after a successful import.
- The newest custom phrase appears first.
- Both fields are required and trimmed; `Add phrase` remains disabled when either trimmed value is empty.
- Search updates the URL with history replacement. Wait for the URL as well as the visible list.
- Always delete the verification phrase and verify its absence at the database boundary after evidence capture.
