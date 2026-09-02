import assert from "node:assert/strict";
import test from "node:test";

import {
  foldHungarian,
  phraseDocuments,
  searchDocuments,
  searchSite,
  textMatchesQuery,
  tokenizeQuery,
} from "../src/lib/search.ts";

test("foldHungarian strips Hungarian diacritics", () => {
  assert.equal(foldHungarian("lát"), "lat");
  assert.equal(foldHungarian("ÖRÖMTELI"), "oromteli");
  assert.equal(foldHungarian("űző"), "uzo");
  assert.equal(foldHungarian("ik-verb"), "ik verb");
});

test("tokenizeQuery splits and folds the query", () => {
  assert.deepEqual(tokenizeQuery("  Látom  a  "), ["latom", "a"]);
  assert.deepEqual(tokenizeQuery("   "), []);
});

test("searching without diacritics finds the verb lát", () => {
  const results = searchSite("lat");
  assert.ok(results.some((result) => result.id === "verb:lát"));
});

test("English gloss finds the matching verb", () => {
  const results = searchSite("to see");
  assert.equal(results[0]?.id, "verb:lát");
});

test("conjugated form finds the lemma", () => {
  const results = searchSite("látom");
  assert.ok(results.some((result) => result.id === "verb:lát"));
});

test("grammar topics match lesson titles", () => {
  const results = searchSite("vowel harmony");
  assert.ok(results.some((result) => result.href === "/grammar/vowel-harmony"));
});

test("phrasebook English and Hungarian both match", () => {
  const byEnglish = searchSite("repeat");
  assert.ok(
    byEnglish.some((result) =>
      result.title.toLocaleLowerCase("hu").includes("ismételd"),
    ),
  );

  const byHungarian = searchSite("egeszsegedre");
  assert.ok(byHungarian.some((result) => result.category === "phrase"));
});

test("empty or whitespace query returns no results", () => {
  assert.deepEqual(searchSite(""), []);
  assert.deepEqual(searchSite("   "), []);
});

test("all query tokens must match", () => {
  const results = searchSite("present tense zebra");
  assert.equal(results.length, 0);
});

test("custom phrase documents are searchable", () => {
  const extras = phraseDocuments(
    [{ hungarian: "Jó reggelt", english: "Good morning" }],
    "custom",
  );
  const results = searchDocuments(extras, "reggelt");
  assert.equal(results.length, 1);
  assert.equal(results[0]?.title, "Jó reggelt");
  assert.match(results[0]?.href ?? "", /\/phrasebook\?q=/);
});

test("pages are discoverable", () => {
  const results = searchSite("phrasebook");
  assert.ok(results.some((result) => result.href === "/phrasebook"));
});

test("textMatchesQuery requires every token", () => {
  assert.equal(
    textMatchesQuery(["Egészségedre", "Bless you"], "egeszseg"),
    true,
  );
  assert.equal(
    textMatchesQuery(["Egészségedre", "Bless you"], "bless you"),
    true,
  );
  assert.equal(
    textMatchesQuery(["Egészségedre", "Bless you"], "bless zebra"),
    false,
  );
});
