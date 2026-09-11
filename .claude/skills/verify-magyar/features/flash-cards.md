# Flash Cards

Flash Cards lets a user study due cards with FSRS scheduling, undo a rating, edit or delete a card, and create a new word/image card backed by shared Supabase tables and storage.

## Sub-features

- `flashcards-load` shows due cards, an all-caught-up state, or a no-cards state.
- `flashcards-flip` reveals the word and scheduling choices.
- `flashcards-rate` writes the updated schedule and a review log.
- `flashcards-undo` restores the previous card and deletes the last review log.
- `flashcards-edit` updates the word and optionally replaces its stored image.
- `flashcards-delete` permanently deletes a row and attempts to remove its image.
- `flashcards-create` uploads an image and inserts a new card row.

## How to get to it (user POV)

- Open desktop menu `Flash Cards`, then choose `Study` or `Create`.
- Open `Open Menu` on mobile and choose `Study Flash Cards` or `Create Flash Cards`.
- Choose the `Flash Cards` card on Home to study.
- Open `/flash-cards` or `/flash-cards/create` directly.

## Driving it with T3 Code collaborative browser

Preconditions:

- Controller doctor passes for the verification port.
- `VITE_SUPABASE_URL` and an anon/publishable key were present when Vite launched.
- Any create, rate, edit, or delete action has explicit user authorization because it mutates shared remote data.
- The exact target card and cleanup/reversal plan are recorded before a mutation.

- **Missing configuration.** When the Supabase environment is absent, open `/flash-cards` and require the alert `Flash Cards require Supabase configuration`; open `/flash-cards/create` and require the corresponding create alert. Stop there and report the production boundary as unavailable.
- **Read-only load.** With valid configuration, open `/flash-cards`. Require heading `Flash Cards` and one of: a card button named `Flip card`, `All caught up!` with a next review, or `No flashcards yet`.
- **Read-only create surface.** With valid configuration, open `/flash-cards/create`. Require heading `Create Flash Cards`, textbox `Enter Word`, image chooser text `Click or drag image here`, and button `Create Card`. Do not submit.
- **Flip only with caution.** If a due card exists, choosing `Flip card` is UI-local and reveals its word, image, four rating buttons, and `Edit card`; stop before rating unless authorized.
- **Authorized rating.** Choose one grade or key `1`-`4`; require the visible queue to advance, then read the affected `flashcards` row and new `review_logs` row through a read-only second view. If testing Undo, require both records to return to their prior state.
- **Authorized create/edit/delete.** Capture the exact row and storage object before and after. A success toast or changed card alone is not enough proof.
- **Proof.** For read-only reconnaissance, record route load and visible controls. For mutations, preserve the before/after UI plus database and storage evidence and execute the recorded reversal when the scenario is meant to be temporary.

## Gotchas

- Flash Cards is the only app feature backed by shared Supabase; there is no local database, auth boundary, or disposable test tenant.
- Rating updates `flashcards` and inserts `review_logs`. Create uploads to `cardimages` before inserting. Edit may upload a replacement and delete the old image. Delete is explicitly irreversible in the UI.
- A card can be requeued soon after a low rating, so queue order alone does not prove the schedule write.
- Control-Z/Command-Z is not the implementation: Undo is Control-Z and only after a successful rating, or the visible `Undo` button.
- If credentials are absent, report Flash Cards as unavailable; do not substitute mocked success for production-boundary proof.
