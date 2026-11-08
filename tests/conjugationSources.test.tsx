import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import conjugations from "../src/assets/conjugations.json";
import reviewedExceptions from "../scripts/conjugation-reviewed.json";
import {
  PERSONS,
  compareVerb,
  markReviewed,
  parseCoolJugator,
  parseWiktionary,
  tablesForLemma,
  type Finding,
  type Forms,
  type ReviewedException,
  type SourceTable,
  type VerbEntry,
} from "../scripts/conjugationSources.ts";

const fixture = (name: string): string =>
  fs.readFileSync(new URL(`./fixtures/conjugation-sources/${name}`, import.meta.url), "utf8");

// ---------------------------------------------------------------------------
// CoolJugator
// ---------------------------------------------------------------------------

test("CoolJugator: reads all four blocks, including the 3sg cell whose id is dict_form", () => {
  const table = parseCoolJugator(fixture("cooljugator-lat.html"));

  assert.deepEqual(Object.keys(table).sort(), [
    "past.definite",
    "past.indefinite",
    "present.definite",
    "present.indefinite",
  ]);
  assert.deepEqual(table["present.indefinite"]?.ő, ["lát"]);
  assert.deepEqual(table["present.indefinite"]?.én, ["látok"]);
  assert.deepEqual(table["present.indefinite"]?.ők, ["látnak"]);
  assert.deepEqual(table["present.definite"]?.ti, ["látjátok"]);
  assert.deepEqual(table["past.indefinite"]?.ő, ["látott"]);
  assert.deepEqual(table["past.definite"]?.mi, ["láttuk"]);
  assert.deepEqual(table["past.definite"]?.ők, ["látták"]);
});

test("CoolJugator: a verb with no definite forms yields only the indefinite blocks", () => {
  const table = parseCoolJugator(fixture("cooljugator-kell.html"));

  assert.deepEqual(Object.keys(table).sort(), ["past.indefinite", "present.indefinite"]);
  assert.deepEqual(table["present.indefinite"]?.ő, ["kell"]);
  assert.deepEqual(table["present.indefinite"]?.ti, ["kelletek"]);
  assert.deepEqual(table["past.indefinite"]?.ők, ["kellettek"]);
});

test("CoolJugator: a block missing a person is an error, not silent missing data", () => {
  const broken = fixture("cooljugator-lat.html").replace('id="past_def4"', 'id="removed"');

  assert.throws(() => parseCoolJugator(broken), /past\.definite block is missing mi/);
});

test("CoolJugator: a page with no conjugation cells yields an empty table", () => {
  assert.deepEqual(parseCoolJugator("<html><body>Not found</body></html>"), {});
});

// ---------------------------------------------------------------------------
// Wiktionary
// ---------------------------------------------------------------------------

test("Wiktionary: reads present and past, keeps alternatives, skips archaic, conditional and subjunctive rows", () => {
  const tables = parseWiktionary(fixture("wiktionary-kezd.html"));

  assert.equal(tables.length, 1);
  const [table] = tables;
  assert.deepEqual(table["present.indefinite"]?.én, ["kezdek"]);
  assert.deepEqual(table["present.indefinite"]?.ti, ["kezdetek", "kezdtek"]);
  assert.deepEqual(table["present.definite"]?.mi, ["kezdjük"]);
  assert.deepEqual(table["past.indefinite"]?.te, ["kezdtél"]);
  assert.deepEqual(table["past.definite"]?.ők, ["kezdték"]);

  const everyForm = Object.values(table).flatMap((forms) => Object.values(forms).flat());
  for (const other of ["kezdék", "kezdenék", "kezdjek", "kezdendek"]) {
    assert.ok(!everyForm.includes(other), `${other} comes from a row that is not present or past indicative`);
  }
});

test("Wiktionary: reads the longer-label layout used for van, and has no definite block for an intransitive verb", () => {
  const [table] = parseWiktionary(fixture("wiktionary-van.html"));

  assert.deepEqual(Object.keys(table).sort(), ["past.indefinite", "present.indefinite"]);
  assert.deepEqual(table["present.indefinite"]?.én, ["vagyok"]);
  assert.deepEqual(table["present.indefinite"]?.ő, ["van"]);
  assert.deepEqual(table["present.indefinite"]?.ők, ["vannak"]);
  assert.deepEqual(table["past.indefinite"]?.mi, ["voltunk"]);
  assert.ok(!Object.values(table).some((forms) => Object.values(forms).flat().includes("leszek")));
});

test("Wiktionary: only the Hungarian section is read", () => {
  const page = fixture("wiktionary-kezd.html");
  const otherLanguage = (marker: string, heading: string) =>
    page.replace(/kezd/g, marker).replace('id="Hungarian"', `id="${heading}"`);
  const before = otherLanguage("elol", "French");
  const after = otherLanguage("utan", "German");

  const tables = parseWiktionary(before + page + after);

  assert.equal(tables.length, 1);
  assert.deepEqual(tables[0]["present.indefinite"]?.ő, ["kezd"]);
});

test("Wiktionary: tablesForLemma keeps the tables whose 3sg is the lemma", () => {
  const withThirdPerson = (form: string): SourceTable => ({
    "present.indefinite": { én: [], te: [], ő: [form], mi: [], ti: [], ők: [] },
  });
  const tables = [withThirdPerson("süt"), withThirdPerson("sül"), withThirdPerson("süt")];

  assert.equal(tablesForLemma(tables, "süt").length, 2);
  assert.equal(tablesForLemma(tables, "lát").length, 0);
});

// ---------------------------------------------------------------------------
// Comparison
// ---------------------------------------------------------------------------

const allPersons = (word: string): Record<(typeof PERSONS)[number], string> =>
  Object.fromEntries(PERSONS.map((person) => [person, word])) as Record<(typeof PERSONS)[number], string>;

const forms = (word: string, overrides: Partial<Forms> = {}): Forms => ({
  ...(Object.fromEntries(PERSONS.map((person) => [person, [word]])) as Forms),
  ...overrides,
});

const verb = (presentOverrides: Partial<Record<(typeof PERSONS)[number], string>> = {}): VerbEntry => ({
  lemma: "teszt",
  present: { indefinite: { ...allPersons("p"), ...presentOverrides }, definite: null },
  past: { indefinite: allPersons("q"), definite: null },
});

const source = (presentOverrides: Partial<Forms> = {}): SourceTable[] => [
  { "present.indefinite": forms("p", presentOverrides), "past.indefinite": forms("q") },
];

test("compare: cells every source confirms produce no finding, and absent definite forms are not checked", () => {
  const result = compareVerb(verb(), { a: source(), b: source() });

  assert.equal(result.cellsChecked, 12);
  assert.deepEqual(result.findings, []);
});

test("compare: a form no source lists is unconfirmed", () => {
  const result = compareVerb(verb({ én: "x" }), { a: source({ én: ["y"] }), b: source({ én: ["z"] }) });

  assert.equal(result.findings.length, 1);
  assert.equal(result.findings[0].status, "unconfirmed");
  assert.equal(result.findings[0].cell, "present.indefinite.én");
  assert.equal(result.findings[0].ours, "x");
});

test("compare: a source preferring another form that a confirming source also accepts is a variant", () => {
  const result = compareVerb(verb({ ti: "mondtok" }), {
    cooljugator: source({ ti: ["mondotok"] }),
    wiktionary: source({ ti: ["mondotok", "mondtok"] }),
  });

  assert.deepEqual(result.findings.map((finding) => finding.status), ["variant"]);
});

test("compare: a source contradicting one that confirms us is disputed", () => {
  const result = compareVerb(verb({ ti: "nőtök" }), {
    cooljugator: source({ ti: ["nőttök"] }),
    wiktionary: source({ ti: ["nőtök"] }),
  });

  assert.deepEqual(result.findings.map((finding) => finding.status), ["disputed"]);
});

test("compare: a source with no data for a cell does not count against us", () => {
  const withoutThirdPerson: SourceTable[] = [
    { "present.indefinite": { ...forms("p"), ő: [] }, "past.indefinite": forms("q") },
  ];
  const result = compareVerb(verb(), { a: source(), b: withoutThirdPerson });

  assert.deepEqual(result.findings, []);
});

test("compare: a cell no source has data for is unverifiable", () => {
  const withDefinite: VerbEntry = { ...verb(), present: { ...verb().present, definite: allPersons("d") } };
  const result = compareVerb(withDefinite, { a: source(), b: source() });

  assert.equal(result.cellsChecked, 18);
  assert.deepEqual(
    result.findings.map((finding) => finding.status),
    Array(6).fill("unverifiable"),
  );
});

test("compare: a source with several tables confirms a cell when any table lists our form", () => {
  const homographs: SourceTable[] = [
    { "present.indefinite": forms("p", { én: ["other"] }), "past.indefinite": forms("q") },
    { "present.indefinite": forms("p"), "past.indefinite": forms("q") },
  ];

  assert.deepEqual(compareVerb(verb(), { a: homographs }).findings, []);
});

test("reviewed: an exception for the exact lemma, cell and form settles unconfirmed and disputed cells", () => {
  const unconfirmed = compareVerb(verb({ én: "x" }), { a: source({ én: ["y"] }) }).findings;
  const disputed = compareVerb(verb({ ti: "nőtök" }), {
    a: source({ ti: ["nőttök"] }),
    b: source({ ti: ["nőtök"] }),
  }).findings;
  const exceptions: ReviewedException[] = [
    { lemma: "teszt", cell: "present.indefinite.én", form: "x", reason: "checked by hand" },
    { lemma: "teszt", cell: "present.indefinite.ti", form: "nőtök", reason: "lő is the same" },
  ];

  const settled = markReviewed([...unconfirmed, ...disputed], exceptions);

  assert.deepEqual(settled.map((finding) => finding.status), ["reviewed", "reviewed"]);
  assert.deepEqual(settled.map((finding) => finding.reason), ["checked by hand", "lő is the same"]);
});

test("reviewed: changing the form brings the cell back under review", () => {
  const findings = compareVerb(verb({ én: "x2" }), { a: source({ én: ["y"] }) }).findings;
  const exceptions: ReviewedException[] = [
    { lemma: "teszt", cell: "present.indefinite.én", form: "x", reason: "about the old form" },
  ];

  assert.deepEqual(
    markReviewed(findings, exceptions).map((finding: Finding) => finding.status),
    ["unconfirmed"],
  );
});

test("every reviewed exception still describes a form in the data", () => {
  for (const { lemma, cell, form } of reviewedExceptions as ReviewedException[]) {
    const [tense, voice, person] = cell.split(".") as ["present" | "past", "indefinite" | "definite", (typeof PERSONS)[number]];
    const entry = conjugations.find((candidate) => candidate.lemma === lemma);

    assert.ok(entry, `${lemma} is not in conjugations.json`);
    assert.equal(
      entry[tense][voice]?.[person],
      form,
      `${lemma} ${cell} is no longer "${form}", so its reviewed exception is stale`,
    );
  }
});
