/**
 * Check src/assets/conjugations.json against CoolJugator and English Wiktionary.
 *
 * Usage:
 *   npm run check:conjugations                    # every verb, both sources
 *   npm run check:conjugations -- lát elvár       # just these verbs
 *   npm run check:conjugations -- --source cooljugator --verbose
 *
 * Options:
 *   --source <name>  cooljugator or wiktionary; repeat to pick both (default: both)
 *   --refresh        download pages again instead of using the cache
 *   --strict         also fail on disputed cells (default: only unconfirmed ones fail)
 *   --verbose        also list variants, reviewed exceptions and unverifiable cells
 *   --data <path>    check a different conjugations JSON file
 *   --help
 *
 * Exit codes: 0 clean, 1 findings need attention, 2 results are incomplete
 * (a page could not be fetched or parsed, so "no problems" would prove nothing).
 *
 * Pages are cached in .cache/conjugation-sources/ for 30 days, so re-running
 * after editing a form makes no requests. Only new verbs or --refresh hit the
 * network, one request every 1.5 seconds, backing off when a site says to.
 * Cells a person has reviewed and kept live in scripts/conjugation-reviewed.json.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import {
  compareVerb,
  markReviewed,
  parseCoolJugator,
  parseWiktionary,
  tablesForLemma,
  type Finding,
  type ReviewedException,
  type SourceTable,
  type VerbEntry,
} from "./conjugationSources.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE_DIR = path.join(ROOT, ".cache", "conjugation-sources");
const CACHE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
const REQUEST_GAP_MS = 1500;
const MAX_ATTEMPTS = 6;
const USER_AGENT =
  "magyar-conjugation-check/1.0 (personal Hungarian learning app; github.com/aberger3647/magyar)";

type Source = {
  url: (lemma: string) => string;
  /** Returns the tables describing this verb; throws if the page has none. */
  parse: (html: string, lemma: string) => SourceTable[];
};

const SOURCES: Record<string, Source> = {
  cooljugator: {
    url: (lemma) => `https://cooljugator.com/hu/${encodeURIComponent(lemma)}`,
    parse: (html) => {
      const table = parseCoolJugator(html);
      if (!table["present.indefinite"] || !table["past.indefinite"]) {
        throw new Error("no present and past conjugation on the page");
      }
      return [table];
    },
  },
  wiktionary: {
    url: (lemma) =>
      `https://en.wiktionary.org/api/rest_v1/page/html/${encodeURIComponent(lemma)}`,
    parse: (html, lemma) => {
      const tables = tablesForLemma(parseWiktionary(html), lemma);
      if (tables.length === 0) {
        throw new Error("no Hungarian verb table whose third person singular is the lemma");
      }
      return tables;
    },
  },
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let lastRequestAt = 0;

const download = async (url: string): Promise<string> => {
  for (let attempt = 1; ; attempt++) {
    const wait = lastRequestAt + REQUEST_GAP_MS - Date.now();
    if (wait > 0) await sleep(wait);
    lastRequestAt = Date.now();

    const response = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(30_000),
    });
    if (response.ok) return response.text();

    const retryable = response.status === 429 || response.status >= 500;
    if (!retryable || attempt === MAX_ATTEMPTS) throw new Error(`HTTP ${response.status}`);
    const retryAfter = Number(response.headers.get("retry-after"));
    const seconds = Math.min(retryAfter > 0 ? retryAfter : 10 * attempt, 90);
    console.error(`  HTTP ${response.status} from ${new URL(url).host}, waiting ${seconds}s`);
    await sleep(seconds * 1000);
  }
};

const loadPage = async (
  sourceName: string,
  lemma: string,
  source: Source,
  refresh: boolean,
): Promise<string> => {
  const file = path.join(CACHE_DIR, sourceName, `${lemma.replace(/[/\\]/g, "_")}.html`);
  if (!refresh && fs.existsSync(file) && Date.now() - fs.statSync(file).mtimeMs < CACHE_MAX_AGE_MS) {
    return fs.readFileSync(file, "utf8");
  }
  const html = await download(source.url(lemma));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  return html;
};

const readJson = <T>(file: string): T => JSON.parse(fs.readFileSync(file, "utf8")) as T;

const describe = (finding: Finding): string => {
  const heard = finding.answers
    .map((answer) => `${answer.source}: ${answer.forms.join("/")}`)
    .join(" | ");
  const suffix = finding.reason ? `\n      reviewed: ${finding.reason}` : "";
  return `  ${finding.lemma} ${finding.cell}  ours "${finding.ours}"${heard ? `  ${heard}` : ""}${suffix}`;
};

const main = async (): Promise<number> => {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      source: { type: "string", multiple: true },
      refresh: { type: "boolean", default: false },
      strict: { type: "boolean", default: false },
      verbose: { type: "boolean", default: false },
      data: { type: "string" },
      help: { type: "boolean", default: false },
    },
  });

  if (values.help) {
    console.log(fs.readFileSync(fileURLToPath(import.meta.url), "utf8").split("*/")[0].replace(/^\/\*\*\n|^ \* ?/gm, ""));
    return 0;
  }

  const sourceNames = values.source?.length ? values.source : Object.keys(SOURCES);
  const unknownSource = sourceNames.find((name) => !(name in SOURCES));
  if (unknownSource) {
    console.error(`Unknown source "${unknownSource}". Choose from: ${Object.keys(SOURCES).join(", ")}`);
    return 2;
  }

  const dataFile = values.data ? path.resolve(values.data) : path.join(ROOT, "src/assets/conjugations.json");
  const allVerbs = readJson<VerbEntry[]>(dataFile);
  const unknownLemma = positionals.find((lemma) => !allVerbs.some((verb) => verb.lemma === lemma));
  if (unknownLemma) {
    console.error(`"${unknownLemma}" is not a verb in ${path.relative(process.cwd(), dataFile) || dataFile}`);
    return 2;
  }
  const verbs = positionals.length ? allVerbs.filter((verb) => positionals.includes(verb.lemma)) : allVerbs;
  const reviewed = readJson<ReviewedException[]>(path.join(ROOT, "scripts/conjugation-reviewed.json"));

  const coverage: Record<string, number> = Object.fromEntries(sourceNames.map((name) => [name, 0]));
  const problems: string[] = [];
  const findings: Finding[] = [];
  let cellsChecked = 0;

  for (const [index, verb] of verbs.entries()) {
    const tables: Record<string, SourceTable[]> = {};
    for (const name of sourceNames) {
      try {
        const html = await loadPage(name, verb.lemma, SOURCES[name], values.refresh);
        tables[name] = SOURCES[name].parse(html, verb.lemma);
        coverage[name]++;
      } catch (error) {
        problems.push(`${verb.lemma} (${name}): ${(error as Error).message}`);
      }
    }
    const result = compareVerb(verb, tables);
    cellsChecked += result.cellsChecked;
    findings.push(...markReviewed(result.findings, reviewed));
    if (verbs.length > 5 && (index + 1) % 20 === 0) console.error(`  ${index + 1}/${verbs.length} verbs`);
  }

  const withStatus = (status: Finding["status"]) => findings.filter((finding) => finding.status === status);
  const unconfirmed = withStatus("unconfirmed");
  const disputed = withStatus("disputed");
  const detailed = values.verbose ? ["variant", "reviewed", "unverifiable"] as const : [];

  console.log(`Checked ${verbs.length} verbs (${cellsChecked} cells)`);
  for (const name of sourceNames) {
    console.log(`  ${name.padEnd(12)} read ${coverage[name]}/${verbs.length} verbs`);
  }

  if (problems.length > 0) {
    console.log(`\nINCOMPLETE: ${problems.length} page(s) could not be used, so those verbs are not fully checked:`);
    for (const problem of problems) console.log(`  ${problem}`);
  }
  if (unconfirmed.length > 0) {
    console.log(`\nUNCONFIRMED: no source lists our form (${unconfirmed.length})`);
    unconfirmed.forEach((finding) => console.log(describe(finding)));
  }
  if (disputed.length > 0) {
    console.log(`\nDISPUTED: a source contradicts one that confirms our form (${disputed.length})`);
    disputed.forEach((finding) => console.log(describe(finding)));
  }
  for (const status of detailed) {
    const group = withStatus(status);
    if (group.length > 0) {
      console.log(`\n${status.toUpperCase()} (${group.length})`);
      group.forEach((finding) => console.log(describe(finding)));
    }
  }

  const count = (status: Finding["status"]) => withStatus(status).length;
  const confirmed = cellsChecked - findings.length;
  console.log(
    `\n${confirmed} cells confirmed by every source with data; ` +
      `${count("variant")} variant, ${count("reviewed")} reviewed, ${count("unverifiable")} unverifiable, ` +
      `${disputed.length} disputed, ${unconfirmed.length} unconfirmed` +
      (values.verbose ? "" : " (--verbose lists variant, reviewed and unverifiable)"),
  );

  if (problems.length > 0) return 2;
  return unconfirmed.length > 0 || (values.strict && disputed.length > 0) ? 1 : 0;
};

main().then(
  (code) => process.exit(code),
  (error) => {
    console.error(error);
    process.exit(2);
  },
);
