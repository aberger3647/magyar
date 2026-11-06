import assert from "node:assert/strict";
import test from "node:test";

import conjugations from "../src/assets/conjugations.json";
import {
  hasConjugationForm,
  isConjugationAnswerCorrect,
} from "../src/lib/conjugatorQuiz.ts";
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

test("verbs without a definite conjugation are excluded from definite quizzes", () => {
  const nevet = conjugations.find((conjugation) => conjugation.lemma === "nevet");

  assert.ok(nevet);
  assert.equal(hasConjugationForm(nevet, "present", "definite"), false);
  assert.equal(hasConjugationForm(nevet, "past", "definite"), false);
  assert.equal(hasConjugationForm(nevet, "present", "indefinite"), true);

  for (const tense of ["present", "past"] as const) {
    const pool = conjugations.filter((conjugation) =>
      hasConjugationForm(conjugation, tense, "definite"),
    );
    assert.ok(pool.length > 0);
    assert.ok(pool.every((conjugation) => conjugation[tense].definite));
  }
});
