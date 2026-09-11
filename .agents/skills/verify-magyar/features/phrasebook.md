# Phrasebook

Phrasebook lets a user add a Hungarian/English phrase pair to local browser storage, filter built-in and custom phrases, and share the active filter through the URL.

## Sub-features

- `phrasebook-add` saves a trimmed Hungarian and English pair.
- `phrasebook-persist` restores custom phrases after reload.
- `phrasebook-filter` matches Hungarian or English text without requiring accents.
- `phrasebook-url` mirrors the active query in `?q=`.
- `phrasebook-empty` shows a specific no-match message.

## How to get to it (user POV)

- Choose `Phrasebook` in the desktop navigation.
- Open `Open Menu` on mobile and choose `Phrasebook`.
- Choose the `Phrasebook` card on Home.
- Open `/phrasebook` directly.
- Open a phrase result from global or full-page search.

## Driving it with T3 Code collaborative browser

Preconditions:

- Controller doctor passes for the verification port.
- Start at `/phrasebook` on the isolated verification origin.
- No existing custom phrase equals `Jó tesztelést!` / `Happy testing!`.

- **Add a phrase.** Fill textbox `Magyar` with `Jó tesztelést!` and textbox `English` with `Happy testing!`; choose `Add phrase`. Both fields clear and the new pair appears before the built-in phrases.
- **Confirm persistence.** Reload `/phrasebook`. The same pair remains visible from the user-facing list.
- **Filter in English.** Fill `Search phrases` with `Happy testing`. Only matching phrase rows remain and the URL contains `?q=Happy+testing` or its equivalent encoding.
- **Filter without accents.** Replace the query with a built-in Hungarian term without diacritics when applicable. A matching accented phrase remains visible.
- **Prove the empty state.** Search `volcano-never-matches`. Require `No phrases match “volcano-never-matches”.`.
- **Proof.** Record add, reload, match, and empty state. Save screenshots of the persisted pair and empty result.

## Gotchas

- Custom phrases live in `localStorage` key `phrasebook.customPhrases`; this is isolated only by browser origin, so use the controller's dedicated port.
- The newest custom phrase appears first.
- Both fields are required and trimmed; `Add phrase` remains disabled when either trimmed value is empty.
- Search updates the URL with history replacement. Wait for the URL as well as the visible list.
- Remove only the verification phrase or the entire `phrasebook.customPhrases` key on the isolated verification origin after evidence capture.
