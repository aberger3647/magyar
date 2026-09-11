import assert from "node:assert/strict";
import test from "node:test";

import conjugations from "../src/assets/conjugations.json";
import { isConjugationAnswerCorrect } from "../src/lib/conjugatorQuiz.ts";
import { getRandomWord } from "../src/lib/setRandomWord.ts";

test("conjugator answers ignore surrounding whitespace", () => {
  assert.equal(isConjugationAnswerCorrect("  látok  ", "látok"), true);
  assert.equal(isConjugationAnswerCorrect("lát ok", "látok"), false);
});

test("random word stays within the selected words and avoids a repeat", () => {
  const selectedWords = conjugations.slice(0, 2);
  const currentWord = selectedWords[0]?.lemma;

  assert.ok(currentWord);
  assert.equal(
    getRandomWord({
      words: selectedWords,
      excludedWord: currentWord,
      random: () => 0,
    }),
    selectedWords[1]?.lemma,
  );
});

test("random word keeps the only selected lemma available", () => {
  const repeatedLemma = conjugations.filter(
    (conjugation) => conjugation.lemma === "vár",
  );

  assert.equal(
    getRandomWord({
      words: repeatedLemma,
      excludedWord: "vár",
      random: () => 0,
    }),
    "vár",
  );
});
