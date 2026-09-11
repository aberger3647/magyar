# Site search

Site search lets a user search Magyar's pages, grammar, verbs, phrases, emotions, letters, and optional blog content through a global dialog or a full results page.

## Sub-features

- `search-dialog-open` opens global search from visible buttons or the Control/Command-K shortcut.
- `search-dialog-results` groups compact results and supports arrow-key selection.
- `search-view-all` opens `/search?q=...` for the current query.
- `search-page-results` lists grouped results and a count.
- `search-filter` limits results to one category tab.
- `search-empty` distinguishes no results from an empty query.

## How to get to it (user POV)

- Choose the search button in the desktop navigation or Home hero.
- Open `Open Menu` on mobile and choose `Search` for the full page.
- Press Control-K or Command-K anywhere in the app.
- Open `/search` directly.

## Driving it with the browser harness

Preconditions:

- Controller doctor passes for the verification port.
- Static search data is available locally. Treat blog results as optional because they require remote Strapi.

- **Open the dialog.** From Home, activate the visible search control or press Control-K. Require dialog `Search the site`, textbox `Search`, and listbox `Search results`.
- **Find a verb.** Fill `Search` with `lat` or `lát`. Require a verb result for `lát`; accent folding means either query should work.
- **Keyboard navigation.** Press `ArrowDown` and require the active option to change; press `Enter` and require navigation to that option's user route.
- **View all.** Reopen the dialog, search `vowel harmony`, and choose `View all results for “vowel harmony”`. Require `/search?q=vowel%20harmony` or equivalent encoding.
- **Filter the page.** On the full page, choose tab `Grammar`. Require `aria-selected=true`, a count ending in `in Grammar`, and only Grammar result groups.
- **Empty result.** Search `volcano-never-matches`. Require `No results for “volcano-never-matches”.`.
- **Proof.** Capture dialog open, query, full-page transition, category selection, and empty result with screenshots, semantic snapshots, and an action transcript. Add video when the chosen harness supports it. The evidence must show the query, selected category, count, and grouped result or empty message.

## Gotchas

- The global shortcut is Control-K on non-Apple platforms and Command-K on Apple platforms.
- The full-page query is debounced by 200 ms. Wait for both the URL and result count instead of sleeping a fixed duration.
- Blog fetch failure is intentionally non-fatal. Do not fail static search proof because no Blog group appears.
- Custom Phrasebook entries are included only when present in this origin's localStorage.
- An empty query shows guidance text, which is different from the no-results state.
