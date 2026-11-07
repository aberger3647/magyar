import assert from "node:assert/strict";
import test from "node:test";

import conjugations from "../src/assets/conjugations.json";

const PERSONS = ["én", "te", "ő", "mi", "ti", "ők"] as const;
type Person = (typeof PERSONS)[number];
type Forms = Record<Person, string>;

const swapEnding = (word: string, from: string, to: string): string | null =>
  word.endsWith(from) ? word.slice(0, -from.length) + to : null;

// Past indefinite te/mi/ti/ők follow from the 1sg form (-tam back, -tem front).
const pastIndefiniteFromFirstPerson = (first: string) => {
  const stem = first.slice(0, -2);
  return first.endsWith("am")
    ? { te: `${stem}ál`, mi: `${stem}unk`, ti: `${stem}atok`, ők: `${stem}ak` }
    : { te: `${stem}él`, mi: `${stem}ünk`, ti: `${stem}etek`, ők: `${stem}ek` };
};

// Past definite follows from the same verb's own past indefinite forms.
const pastDefiniteFromIndefinite = (indefinite: Forms): Record<Person, string | null> => ({
  én: indefinite.én,
  te: swapEnding(indefinite.te, "ál", "ad") ?? swapEnding(indefinite.te, "él", "ed"),
  ő: swapEnding(indefinite.én, "m", ""),
  mi: swapEnding(indefinite.mi, "unk", "uk") ?? swapEnding(indefinite.mi, "ünk", "ük"),
  ti: swapEnding(indefinite.ti, "atok", "átok") ?? swapEnding(indefinite.ti, "etek", "étek"),
  ők: swapEnding(indefinite.ők, "ak", "ák") ?? swapEnding(indefinite.ők, "ek", "ék"),
});

test("past indefinite te, mi, ti and ők agree with the first-person form", () => {
  const problems: string[] = [];

  for (const { lemma, past } of conjugations) {
    const first = past.indefinite.én;
    if (!first.endsWith("am") && !first.endsWith("em")) {
      problems.push(`${lemma} past.indefinite.én "${first}" does not end in -am or -em`);
      continue;
    }
    const expected = pastIndefiniteFromFirstPerson(first);
    for (const person of ["te", "mi", "ti", "ők"] as const) {
      if (past.indefinite[person] !== expected[person]) {
        problems.push(
          `${lemma} past.indefinite.${person} is "${past.indefinite[person]}", expected "${expected[person]}"`,
        );
      }
    }
  }

  assert.deepEqual(problems, []);
});

test("past definite forms follow from the same verb's past indefinite forms", () => {
  const problems: string[] = [];

  for (const { lemma, past } of conjugations) {
    if (!past.definite) continue;
    const expected = pastDefiniteFromIndefinite(past.indefinite);
    for (const person of PERSONS) {
      if (past.definite[person] !== expected[person]) {
        problems.push(
          `${lemma} past.definite.${person} is "${past.definite[person]}", expected "${expected[person]}"`,
        );
      }
    }
  }

  assert.deepEqual(problems, []);
});
