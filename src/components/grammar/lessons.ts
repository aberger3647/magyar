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
    title: "Numbers",
    description: "Core numbers and common counting patterns.",
    to: "/grammar/numbers",
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
    title: "-ik Verbs",
    description: "Special verb class with unique singular conjugation endings.",
    to: "/grammar/ik-verbs",
  },
];
