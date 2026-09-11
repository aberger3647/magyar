# Conjugator quiz

Conjugator lets a user choose tense, voice, and verbs, then answer six pronoun forms, request incremental hints, advance through selected verbs, and finish the quiz.

## Sub-features

- `conjugator-preferences` selects present or past, indefinite or definite, and one or more verbs.
- `conjugator-start` opens the quiz at the route matching the chosen tense and voice.
- `conjugator-submit` marks each pronoun answer correct or incorrect.
- `conjugator-hint` fills the next correct character after an incorrect submission.
- `conjugator-progress` advances selected verbs without repeating completed ones.
- `conjugator-finish` exposes `Finish Quiz` after the final selected verb is correct.

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

- **Isolate one verb.** Choose `Clear all`, then select the checkbox named `lát`. With `agent-browser`, use `find role checkbox click --name "lát"`; if T3 cannot resolve it semantically, use the stable selector `#word-lát` in the row labeled `lát`. The preferences summary reads `1 selected`, and `Start Quiz` is enabled.
- **Start defaults.** Choose `Start Quiz`. The URL includes `/conjugator/present/indefinite`; a card shows the lemma `lát`, badges `present` and `indefinite`, and `Word 1 of 1`.
- **Submit a wrong answer.** Fill all six labeled inputs with a non-empty wrong value and choose `Submit`. Incorrect indicators appear and `Hint` becomes enabled.
- **Use a hint.** Focus the `én` input and choose `Hint`. Its value advances toward `látok` by one correct character from the first mismatch.
- **Submit correct answers.** Fill `én=látok`, `te=látsz`, `ő=lát`, `mi=látunk`, `ti=láttok`, and `ők=látnak`; choose `Submit`. Capture the transient success toast immediately, then require all six inputs to have correct indicators and the enabled progression control to be named `Finish Quiz`.
- **Proof.** Capture the preference selection through the correct result with before/after screenshots, semantic snapshots, and an action transcript. Add video when the chosen harness supports it. The evidence must show the app identity, `Word 1 of 1`, the six fields, and `Finish Quiz`.

## Gotchas

- The selected verbs and current random verb persist in localStorage; completed verbs persist in sessionStorage. Clear only `quizWords`, `randomWord`, and `completedQuizWords` on the verification origin during cleanup.
- `Hint` stays disabled until a submitted answer is incomplete or wrong.
- The quiz is random when several verbs are selected. Select only `lát` for deterministic proof.
- The source data currently contains `vár` twice, which emits a duplicate React-key warning on the preferences page. Do not use `vár` for a deterministic smoke proof until that data issue is resolved.
- Do not set storage or call quiz helpers to create the proved state; use the preferences UI.
- `Finish Quiz` becomes the button label only after the final selected verb has all six correct answers.
