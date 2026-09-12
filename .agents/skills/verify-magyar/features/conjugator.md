# Conjugator quiz

Conjugator lets a user choose tense, voice, and verbs, then answer six pronoun forms, request incremental hints, advance through selected verbs, and finish the quiz.

## Sub-features

- `conjugator-preferences` selects and locally remembers present or past, indefinite or definite, and one or more verbs.
- `conjugator-start` opens the quiz at the route matching the chosen tense and voice.
- `conjugator-submit` marks each pronoun answer correct or incorrect.
- `conjugator-hint` fills the next correct character after an incorrect submission.
- `conjugator-progress` advances selected verbs without repeating completed ones.
- `conjugator-random` skips to another random selected verb without completing the current verb.
- `conjugator-finish` exposes `Finish Quiz` after the final selected verb is correct and returns to preferences.

## How to get to it (user POV)

- Choose `Conjugator` in the desktop navigation.
- Open `Open Menu` on mobile and choose `Conjugator`.
- Choose the `Conjugator` card on Home.
- Open `/conjugator` directly.

## Driving it with the browser harness

Preconditions:

- Controller doctor passes for the verification port.
- The tab is on `/conjugator` at the same port.
- The browser origin belongs to this verification run.

- **Remember preferences.** Choose `Past` and `Definite`, reload, and require both choices to remain checked. Restore `Present` and `Indefinite` before continuing.
- **Choose another random word.** Choose `Clear all`, select `lát` and `dolgozik`, and choose `Start Quiz`. Require `Word 1 of 2`, choose `Random Word`, and require the lemma to change while the progress remains `Word 1 of 2`. Return to `/conjugator`.
- **Isolate one verb.** Choose `Clear all`, then select the checkbox named `lát`. With `agent-browser`, use `find role checkbox click --name "lát"`; if T3 cannot resolve it semantically, use the stable selector `#word-lát` in the row labeled `lát`. The preferences summary reads `1 selected`, and `Start Quiz` is enabled.
- **Start saved preferences.** Choose `Start Quiz`. The URL includes `/conjugator/present/indefinite`; a card shows the lemma `lát`, badges `present` and `indefinite`, and `Word 1 of 1`.
- **Submit a wrong answer.** Fill all six labeled inputs with a non-empty wrong value and choose `Submit`. Incorrect indicators appear and `Hint` becomes enabled.
- **Use a hint.** Focus the `én` input and choose `Hint`. Its value advances toward `látok` by one correct character from the first mismatch.
- **Submit correct answers.** Fill `én=látok`, `te=látsz`, `ő=lát`, `mi=látunk`, `ti=láttok`, and `ők=látnak`; choose `Submit`. Capture the transient success toast immediately, then require all six inputs to have correct indicators and the enabled progression control to be named `Finish Quiz`.
- **Finish.** Choose `Finish Quiz` and require the app to return directly to `/conjugator` with the preference controls visible and no play-again prompt.
- **Proof.** Capture the preference selection through the return to preferences with screenshots, semantic snapshots, and an action transcript. Add video when the chosen harness supports it. The evidence must show the app identity, `Word 1 of 1`, the six fields, `Finish Quiz`, and the restored preferences screen.

## Gotchas

- The selected verbs, tense/voice preferences, and current random verb persist in localStorage; completed verbs persist in sessionStorage. Clear only `quizWords`, `quizPreferences`, `randomWord`, and `completedQuizWords` on the verification origin during cleanup.
- `Hint` stays disabled until a submitted answer is incomplete or wrong.
- The quiz is random when several verbs are selected. Select only `lát` for deterministic proof.
- The source data currently contains `vár` twice, which emits a duplicate React-key warning on the preferences page. Do not use `vár` for a deterministic smoke proof until that data issue is resolved.
- Do not set storage or call quiz helpers to create the proved state; use the preferences UI.
- `Finish Quiz` becomes the button label only after the final selected verb has all six correct answers.
