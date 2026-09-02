import conjugations from "@/assets/conjugations.json";
import phrases from "@/assets/phrases.json";
import emotionsData from "@/assets/emotions.json";
import { HUNGARIAN_ALPHABET } from "@/constants/alphabet";
import { grammarLessons } from "@/components/grammar/lessons";
import type { EmotionsData } from "@/types/emotions";
import type { Pronouns } from "@/types/pronouns";

export type SearchCategory =
  | "page"
  | "grammar"
  | "verb"
  | "phrase"
  | "emotion"
  | "letter"
  | "blog";

export type SearchDocument = {
  id: string;
  category: SearchCategory;
  title: string;
  subtitle: string;
  href: string;
  titleFolded: string;
  searchText: string;
};

export type RankedSearchResult = SearchDocument & {
  score: number;
};

export type GroupedSearchResults = {
  category: SearchCategory;
  label: string;
  items: RankedSearchResult[];
};

type ConjugationEntry = {
  translation: string;
  lemma: string;
  infinitive: string;
  type: string;
  present: { indefinite: Pronouns; definite: Pronouns | null };
  past: { indefinite: Pronouns; definite: Pronouns | null };
};

export const SEARCH_CATEGORY_LABELS: Record<SearchCategory, string> = {
  page: "Pages",
  grammar: "Grammar",
  verb: "Verbs",
  phrase: "Phrases",
  emotion: "Érzés",
  letter: "Alphabet",
  blog: "Blog",
};

const CATEGORY_ORDER: SearchCategory[] = [
  "page",
  "grammar",
  "verb",
  "phrase",
  "emotion",
  "letter",
  "blog",
];

const PAGES: { title: string; subtitle: string; href: string }[] = [
  {
    title: "Home",
    subtitle: "Grammar lessons, conjugation drills, flash cards, and a phrasebook.",
    href: "/",
  },
  {
    title: "Conjugator",
    subtitle: "Drill verb conjugations across tenses and persons.",
    href: "/conjugator",
  },
  {
    title: "Flash Cards",
    subtitle: "Spaced-repetition vocabulary practice.",
    href: "/flash-cards",
  },
  {
    title: "Create Flash Cards",
    subtitle: "Add a new vocabulary card with an image.",
    href: "/flash-cards/create",
  },
  {
    title: "Grammar",
    subtitle: "Vowel harmony, possessives, accusative, and more.",
    href: "/grammar",
  },
  {
    title: "Phrasebook",
    subtitle: "Useful phrases for everyday situations.",
    href: "/phrasebook",
  },
  {
    title: "Érzés",
    subtitle: "Hungarian emotion wheel — find the word for how you feel.",
    href: "/erzes",
  },
  {
    title: "Blog",
    subtitle: "Notes and articles about learning Hungarian.",
    href: "/blog",
  },
];

/** Fold Hungarian diacritics so "lat" matches "lát" and "orom" matches "öröm". */
export function foldHungarian(value: string): string {
  return value
    .toLocaleLowerCase("hu")
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .replace(/[-_/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenizeQuery(query: string): string[] {
  return foldHungarian(query)
    .split(" ")
    .filter((token) => token.length > 0);
}

export function textMatchesQuery(texts: string[], query: string): boolean {
  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) return true;
  const haystack = foldHungarian(texts.filter(Boolean).join(" "));
  return tokens.every((token) => haystack.includes(token));
}

function makeDocument(
  id: string,
  category: SearchCategory,
  title: string,
  subtitle: string,
  href: string,
  extra: string[] = [],
): SearchDocument {
  const titleFolded = foldHungarian(title);
  const searchText = foldHungarian(
    [title, subtitle, ...extra].filter(Boolean).join(" "),
  );
  return { id, category, title, subtitle, href, titleFolded, searchText };
}

function pronounValues(pronouns: Pronouns | null): string[] {
  if (!pronouns) return [];
  return Object.values(pronouns);
}

function verbForms(entry: ConjugationEntry): string[] {
  return [
    entry.lemma,
    entry.infinitive,
    entry.translation,
    entry.type.replace(/[-/]/g, " "),
    ...pronounValues(entry.present.indefinite),
    ...pronounValues(entry.present.definite),
    ...pronounValues(entry.past.indefinite),
    ...pronounValues(entry.past.definite),
  ];
}

const CUSTOM_PHRASES_KEY = "phrasebook.customPhrases";

export function readCustomPhrasesFromStorage(): {
  hungarian: string;
  english: string;
}[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_PHRASES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is { hungarian: string; english: string } =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as { hungarian?: unknown }).hungarian === "string" &&
        typeof (item as { english?: unknown }).english === "string",
    );
  } catch {
    return [];
  }
}

export function phraseDocuments(
  items: { hungarian: string; english: string }[],
  idPrefix = "phrase",
): SearchDocument[] {
  return items
    .map((phrase) => ({
      hungarian: phrase.hungarian.trim(),
      english: phrase.english.trim(),
    }))
    .filter((phrase) => phrase.hungarian.length > 0 && phrase.english.length > 0)
    .map((phrase, index) =>
      makeDocument(
        `${idPrefix}:${index}:${phrase.hungarian}`,
        "phrase",
        phrase.hungarian,
        phrase.english,
        `/phrasebook?q=${encodeURIComponent(phrase.hungarian)}`,
      ),
    );
}

export function blogDocuments(
  posts: { slug: string; title: string; excerpt: string | null }[],
): SearchDocument[] {
  return posts.map((post) =>
    makeDocument(
      `blog:${post.slug}`,
      "blog",
      post.title,
      post.excerpt?.trim() || "Blog post",
      `/blog/${post.slug}`,
      post.excerpt ? [post.excerpt] : [],
    ),
  );
}

function flattenEmotions(data: EmotionsData): SearchDocument[] {
  const docs: SearchDocument[] = [];
  for (const core of data.cores) {
    docs.push(
      makeDocument(
        `emotion:${core.id}`,
        "emotion",
        core.hu,
        core.en,
        "/erzes",
      ),
    );
    for (const secondary of core.secondary) {
      docs.push(
        makeDocument(
          `emotion:${secondary.id}`,
          "emotion",
          secondary.hu,
          secondary.en,
          "/erzes",
        ),
      );
      for (const tertiary of secondary.tertiary) {
        docs.push(
          makeDocument(
            `emotion:${tertiary.id}`,
            "emotion",
            tertiary.hu,
            tertiary.en,
            "/erzes",
          ),
        );
      }
    }
  }
  return docs;
}

export function buildStaticSearchIndex(): SearchDocument[] {
  const verbs = (conjugations as ConjugationEntry[]).map((entry) =>
    makeDocument(
      `verb:${entry.lemma}`,
      "verb",
      entry.lemma,
      `${entry.infinitive} · ${entry.translation}`,
      "/conjugator",
      verbForms(entry),
    ),
  );

  const letters = HUNGARIAN_ALPHABET.map((row) =>
    makeDocument(
      `letter:${row.letter}`,
      "letter",
      row.letter,
      `${row.pronunciation} Example: ${row.example}`,
      "/grammar/alphabet",
      [row.name, row.pronunciation, row.example],
    ),
  );

  return [
    ...PAGES.map((page) =>
      makeDocument(`page:${page.href}`, "page", page.title, page.subtitle, page.href),
    ),
    ...grammarLessons.map((lesson) =>
      makeDocument(
        `grammar:${lesson.to}`,
        "grammar",
        lesson.title,
        lesson.description,
        lesson.to,
      ),
    ),
    ...verbs,
    ...phraseDocuments(phrases),
    ...flattenEmotions(emotionsData as EmotionsData),
    ...letters,
  ];
}

let staticIndex: SearchDocument[] | null = null;

export function getStaticSearchIndex(): SearchDocument[] {
  if (!staticIndex) staticIndex = buildStaticSearchIndex();
  return staticIndex;
}

function scoreDocument(doc: SearchDocument, tokens: string[]): number {
  let score = 0;
  const titleWords = doc.titleFolded.split(" ").filter(Boolean);

  for (const token of tokens) {
    let tokenScore = 0;
    if (doc.titleFolded === token) {
      tokenScore = 100;
    } else if (titleWords.some((word) => word === token)) {
      tokenScore = 80;
    } else if (doc.titleFolded.startsWith(token)) {
      tokenScore = 60;
    } else if (titleWords.some((word) => word.startsWith(token))) {
      tokenScore = 45;
    } else if (doc.titleFolded.includes(token)) {
      tokenScore = 30;
    } else if (doc.searchText.includes(token)) {
      tokenScore = 12;
    } else {
      return 0;
    }
    score += tokenScore;
  }

  if (doc.category === "page" || doc.category === "grammar") {
    score += 4;
  }

  return score;
}

export function searchDocuments(
  documents: SearchDocument[],
  query: string,
  limit = 50,
): RankedSearchResult[] {
  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) return [];

  const ranked: RankedSearchResult[] = [];
  for (const doc of documents) {
    const score = scoreDocument(doc, tokens);
    if (score > 0) ranked.push({ ...doc, score });
  }

  ranked.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.title.localeCompare(b.title, "hu");
  });

  return ranked.slice(0, limit);
}

export function searchSite(
  query: string,
  extras: SearchDocument[] = [],
  limit = 50,
): RankedSearchResult[] {
  return searchDocuments(
    [...getStaticSearchIndex(), ...extras],
    query,
    limit,
  );
}

export function groupSearchResults(
  results: RankedSearchResult[],
): GroupedSearchResults[] {
  const byCategory = new Map<SearchCategory, RankedSearchResult[]>();
  for (const result of results) {
    const list = byCategory.get(result.category);
    if (list) list.push(result);
    else byCategory.set(result.category, [result]);
  }

  return CATEGORY_ORDER.filter((category) => byCategory.has(category)).map(
    (category) => ({
      category,
      label: SEARCH_CATEGORY_LABELS[category],
      items: byCategory.get(category) ?? [],
    }),
  );
}
