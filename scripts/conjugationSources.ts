/**
 * Parsers and comparison logic for checking src/assets/conjugations.json
 * against outside conjugation tables (CoolJugator and English Wiktionary).
 *
 * Everything here is pure (string in, data out) so tests/ can exercise it with
 * saved page fragments. Fetching and caching live in check-conjugations.ts.
 *
 * Downloaded pages are untrusted text. They are only ever matched with regular
 * expressions, never evaluated.
 */

export const PERSONS = ["én", "te", "ő", "mi", "ti", "ők"] as const;
export type Person = (typeof PERSONS)[number];
export type Tense = "present" | "past";
export type Voice = "indefinite" | "definite";
export type CellGroup = `${Tense}.${Voice}`;

/** Every acceptable spelling per person. Sources list alternatives, e.g. kezdetek or kezdtek. */
export type Forms = Record<Person, string[]>;
export type SourceTable = Partial<Record<CellGroup, Forms>>;

export type VerbEntry = {
  lemma: string;
  present: { indefinite: Record<Person, string>; definite?: Record<Person, string> | null };
  past: { indefinite: Record<Person, string>; definite?: Record<Person, string> | null };
};

const CELL_GROUPS: CellGroup[] = [
  "present.indefinite",
  "present.definite",
  "past.indefinite",
  "past.definite",
];

const decodeEntities = (text: string): string =>
  text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(Number(dec)))
    .replace(/&(nbsp|shy);/g, (_, name: string) => (name === "nbsp" ? " " : ""))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");

const readAttributes = (tag: string): Record<string, string> => {
  const attributes: Record<string, string> = {};
  for (const match of tag.matchAll(/([\w:-]+)="([^"]*)"/g)) {
    attributes[match[1]] = decodeEntities(match[2]);
  }
  return attributes;
};

// ---------------------------------------------------------------------------
// CoolJugator
// ---------------------------------------------------------------------------

const COOLJUGATOR_PREFIXES: Record<string, CellGroup> = {
  present_indef: "present.indefinite",
  present_def: "present.definite",
  past_indef: "past.indefinite",
  past_def: "past.definite",
};

/**
 * Each form is a <div class="conjugation-cell"> whose id is the tense block plus
 * a person number (present_indef1 .. present_indef6) and whose data-default holds
 * the form. One quirk: the 3sg cell of the present indefinite block is
 * id="dict_form" instead of present_indef3, so keying only on the numbered ids
 * silently loses that person.
 *
 * Throws when a block is present but incomplete, so a markup change shows up as
 * an error rather than as missing data that looks like agreement.
 */
export const parseCoolJugator = (html: string): SourceTable => {
  const collected: Partial<Record<CellGroup, Partial<Record<Person, string[]>>>> = {};

  for (const tag of html.match(/<div\b[^>]*\bconjugation-cell\b[^>]*>/g) ?? []) {
    const { id, "data-default": form } = readAttributes(tag);
    if (!id || form === undefined) continue;

    let group: CellGroup | undefined;
    let personNumber = 0;
    if (id === "dict_form") {
      group = "present.indefinite";
      personNumber = 3;
    } else {
      const match = id.match(/^([a-z_]+?)([1-6])$/);
      group = match ? COOLJUGATOR_PREFIXES[match[1]] : undefined;
      personNumber = match ? Number(match[2]) : 0;
    }
    if (!group) continue;

    const person = PERSONS[personNumber - 1];
    const block = (collected[group] ??= {});
    const forms = (block[person] ??= []);
    if (!forms.includes(form)) forms.push(form);
  }

  const table: SourceTable = {};
  for (const group of CELL_GROUPS) {
    const block = collected[group];
    if (!block) continue;
    const missing = PERSONS.filter((person) => !block[person]?.length);
    if (missing.length > 0) {
      throw new Error(`CoolJugator ${group} block is missing ${missing.join(", ")}`);
    }
    table[group] = block as Forms;
  }
  return table;
};

// ---------------------------------------------------------------------------
// Wiktionary
// ---------------------------------------------------------------------------

const cleanCell = (html: string): string =>
  decodeEntities(
    html
      .replace(/<sup[^>]*>[\s\S]*?<\/sup>/g, "")
      .replace(/<br\s*\/?>/g, " / ")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/­/g, "")
    .replace(/\s+/g, " ")
    .trim();

const splitAlternatives = (cell: string): string[] =>
  cell
    .replace(/[()]/g, "")
    .split(/\s*\/\s*|\s+or\s+|,\s*/)
    .map((form) => form.replace(/^or\s+/, "").trim())
    .filter((form) => /^\p{L}+$/u.test(form));

const hungarianSection = (html: string): string => {
  const start = html.indexOf('id="Hungarian"');
  if (start < 0) return "";
  const rest = html.slice(start + 1);
  const next = rest.search(/<h2 id="(?!Hungarian")/);
  return next < 0 ? rest : rest.slice(0, next);
};

/**
 * Wiktionary lays each verb's table out as rows like
 *   indicative | indicative | present | indef. | f1 .. f6
 *   def.       | f1 .. f6
 *   past       | indef. | f1 .. f6
 * and a few verbs (van) use a longer-label layout:
 *   Indicative Mood | Present | Indefinite | f1 .. f6
 * Both are read by walking the rows while tracking mode (indicative or not),
 * tense, and voice. Archaic, conditional and subjunctive rows are skipped.
 * Returns one SourceTable per verb table on the page; a page can hold several
 * (homographs), and callers pick the ones whose 3sg matches the lemma.
 */
export const parseWiktionary = (html: string): SourceTable[] => {
  const tables: SourceTable[] = [];

  for (const tableMatch of hungarianSection(html).matchAll(
    /<table[^>]*class="[^"]*inflection-table[^"]*"[\s\S]*?<\/table>/g,
  )) {
    const table: SourceTable = {};
    let indicative = false;
    let tense: Tense | null = null;

    for (const rowMatch of tableMatch[0].matchAll(/<tr[\s\S]*?<\/tr>/g)) {
      const cells = [...rowMatch[0].matchAll(/<(?:th|td)[^>]*>([\s\S]*?)<\/(?:th|td)>/g)].map(
        (cell) => cleanCell(cell[1]),
      );
      if (cells.length < 7) continue;

      const labels = cells.slice(0, -6).map((label) => label.toLowerCase());
      const voice: Voice | null = labels.some((label) => /^(indef\.|indefinite)$/.test(label))
        ? "indefinite"
        : labels.some((label) => /^(def\.|definite)$/.test(label))
          ? "definite"
          : null;
      if (!voice) continue;

      if (labels.some((label) => /conditional|subjunctive|imperative/.test(label))) {
        indicative = false;
      } else if (labels.some((label) => /^indicative/.test(label))) {
        indicative = true;
      }
      if (labels.includes("present")) tense = "present";
      else if (labels.includes("past")) tense = "past";
      else if (labels.some((label) => /archaic|preterite|future/.test(label))) tense = null;

      if (!indicative || !tense) continue;
      const forms = cells.slice(-6).map(splitAlternatives);
      if (forms.some((alternatives) => alternatives.length === 0)) continue;
      table[`${tense}.${voice}`] = Object.fromEntries(
        PERSONS.map((person, index) => [person, forms[index]]),
      ) as Forms;
    }

    if (table["present.indefinite"]) tables.push(table);
  }

  return tables;
};

/** Keeps the tables that describe this verb, i.e. whose present 3sg is the lemma. */
export const tablesForLemma = (tables: SourceTable[], lemma: string): SourceTable[] =>
  tables.filter((table) => table["present.indefinite"]?.ő.includes(lemma));

// ---------------------------------------------------------------------------
// Comparison
// ---------------------------------------------------------------------------

export type SourceAnswer = { source: string; forms: string[] };

export type FindingStatus = "unconfirmed" | "disputed" | "variant" | "unverifiable" | "reviewed";

export type Finding = {
  lemma: string;
  cell: `${CellGroup}.${Person}`;
  ours: string;
  /** Sources that have data for this cell, and what they list. */
  answers: SourceAnswer[];
  /**
   * unconfirmed: sources have data but none lists our form.
   * disputed: a source lists forms that no source confirming ours accepts.
   * variant: a source prefers a different form, but a source confirming ours
   *   accepts that form too, so the sources agree and only the choice differs.
   * unverifiable: no source has data for this cell.
   * reviewed: a person checked this cell and recorded why it stands (see
   *   markReviewed); only ever set on unconfirmed or disputed cells.
   */
  status: FindingStatus;
  reason?: string;
};

export type Comparison = { cellsChecked: number; findings: Finding[] };

/**
 * Compares one verb against every source's tables. A source with several tables
 * (homographs) confirms a cell when any of them lists our form. Cells that every
 * source with data confirms produce no finding.
 */
export const compareVerb = (
  entry: VerbEntry,
  sources: Record<string, SourceTable[]>,
): Comparison => {
  const findings: Finding[] = [];
  let cellsChecked = 0;

  for (const group of CELL_GROUPS) {
    const [tense, voice] = group.split(".") as [Tense, Voice];
    const ours = entry[tense][voice];
    if (!ours) continue;

    for (const person of PERSONS) {
      cellsChecked++;
      const answers: SourceAnswer[] = Object.entries(sources).flatMap(([source, tables]) => {
        const forms = [...new Set(tables.flatMap((table) => table[group]?.[person] ?? []))];
        return forms.length > 0 ? [{ source, forms }] : [];
      });

      const confirming = answers.filter((answer) => answer.forms.includes(ours[person]));
      const dissenting = answers.filter((answer) => !answer.forms.includes(ours[person]));

      let status: FindingStatus | null;
      if (answers.length === 0) {
        status = "unverifiable";
      } else if (confirming.length === 0) {
        status = "unconfirmed";
      } else if (dissenting.length === 0) {
        status = null;
      } else {
        const accepted = new Set(confirming.flatMap((answer) => answer.forms));
        status = dissenting.every((answer) => answer.forms.every((form) => accepted.has(form)))
          ? "variant"
          : "disputed";
      }

      if (status) {
        findings.push({
          lemma: entry.lemma,
          cell: `${group}.${person}`,
          ours: ours[person],
          answers,
          status,
        });
      }
    }
  }

  return { cellsChecked, findings };
};

/** A cell a person looked into and decided should stay as it is. */
export type ReviewedException = {
  lemma: string;
  cell: Finding["cell"];
  /** The form this decision is about. If the data changes, the exception stops applying. */
  form: string;
  reason: string;
};

/**
 * Turns unconfirmed and disputed findings into "reviewed" when a recorded
 * exception covers that exact lemma, cell and form. Keying on the form means a
 * later edit to the data brings the cell back under scrutiny.
 */
export const markReviewed = (findings: Finding[], exceptions: ReviewedException[]): Finding[] =>
  findings.map((finding) => {
    if (finding.status !== "unconfirmed" && finding.status !== "disputed") return finding;
    const exception = exceptions.find(
      (candidate) =>
        candidate.lemma === finding.lemma &&
        candidate.cell === finding.cell &&
        candidate.form === finding.ours,
    );
    return exception ? { ...finding, status: "reviewed", reason: exception.reason } : finding;
  });
