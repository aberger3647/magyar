export type GrammarLesson = {
  title: string;
  description: string;
  to: string;
};

export const grammarLessons: GrammarLesson[] = [
  {
    title: "Alphabet",
    description: "Hungarian alphabet and pronunciation basics.",
    to: "/grammar/alphabet",
  },
  {
    title: "Vowel Harmony",
    description: "Back/front vowels and harmony rules for suffixes.",
    to: "/grammar/vowel-harmony",
  },
  {
    title: "Present Tense",
    description: "Present indefinite conjugation of regular verbs by vowel harmony.",
    to: "/grammar/present-tense",
  },
  {
    title: "Past Tense",
    description: "Past indefinite conjugation of regular verbs by vowel harmony.",
    to: "/grammar/past-tense",
  },
  {
    title: "Future Tense",
    description: "Future with fog + infinitive and lesz for states.",
    to: "/grammar/future-tense",
  },
  {
    title: "Numbers",
    description: "Core numbers and common counting patterns.",
    to: "/grammar/numbers",
  },
  {
    title: "Telling Time",
    description: "Quarters of the hour, the next-hour rule, and minutes with múlt / múlva.",
    to: "/grammar/telling-time",
  },
  {
    title: "Possessives",
    description: "How Hungarian shows ownership with suffixes.",
    to: "/grammar/possessives",
  },
  {
    title: "Accusative Case",
    description: "How to mark direct objects with -t.",
    to: "/grammar/accusative",
  },
  {
    title: "Instrumental Case",
    description: "How Hungarian expresses \"with\" using -val/-vel.",
    to: "/grammar/instrumental",
  },
  {
    title: "Location",
    description: "Suffixes for hol? (where) and hova? (where to).",
    to: "/grammar/location",
  },
  {
    title: "-ik Verbs",
    description: "Special verb class with unique singular conjugation endings.",
    to: "/grammar/ik-verbs",
  },
];
