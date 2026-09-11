# Grammar lessons

Grammar presents a lesson index and lets a user move among Hungarian grammar lessons through cards, desktop side links, or a compact mobile selector.

## Sub-features

- `grammar-index` lists all lesson cards with titles and descriptions.
- `grammar-open` opens a chosen lesson at its dedicated route.
- `grammar-desktop-nav` moves between lessons from the desktop sidebar.
- `grammar-mobile-nav` moves between lessons with the `Select lesson` control.
- `grammar-content` displays the selected lesson's visible heading and teaching content.

## How to get to it (user POV)

- Choose `Grammar` in the desktop navigation.
- Open `Open Menu` on mobile and choose `Grammar`.
- Choose the `Grammar` card on Home.
- Open `/grammar` directly.
- Search for a grammar topic and open its result.

## Driving it with the browser harness

Preconditions:

- Controller doctor passes for the verification port.
- Start at `/grammar` on a desktop viewport unless testing the compact selector.

- **Inspect the index.** Require heading `Grammar`, text `Choose a lesson:`, and links including `Alphabet`, `Vowel Harmony`, `Present Tense`, `Past Tense`, `Future Tense`, `Numbers`, `Telling Time`, `Possessives`, `Accusative Case`, `Instrumental Case`, `Location`, and `-ik Verbs`.
- **Open a lesson.** Choose `Alphabet`. Require URL `/grammar/alphabet`, heading `Alphabet and Pronunciation`, and content `The Hungarian Alphabet` / `A magyar ábécé`.
- **Desktop lesson navigation.** At desktop width, choose `Vowel Harmony` from the sidebar. Require `/grammar/vowel-harmony` and that lesson's heading before asserting success.
- **Mobile lesson navigation.** Resize to a mobile viewport. With T3, click combobox `Select lesson`, press `Home`, press `ArrowDown` twice, then press `Enter`. With `agent-browser`, snapshot and run `select <combobox-ref> "/grammar/present-tense"`. Require `/grammar/present-tense` and the Present Tense content to update.
- **Proof.** Capture index-to-lesson navigation with before/after screenshots, semantic snapshots, and an action transcript. Add video when the chosen harness supports it, and put the final route in the evidence notes.

## Gotchas

- `/grammar/phonetics` and `/grammar/alphabet` currently render the same Alphabet component; prove the entry point you actually used.
- Desktop lesson links are hidden on small viewports, while `Select lesson` is hidden at desktop width.
- Lesson pages can be long and horizontally scrollable in bounded teaching tables. A screenshot of only the navigation is not content proof.
- Route success requires a lesson heading or distinctive content, not only the URL change.
