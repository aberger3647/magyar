export type GrammarLesson = {
  title: string;
  description: string;
  to: string;
};

export const grammarLessons: GrammarLesson[] = [
  {
    title: "Phonetics",
    description: "Alphabet, pronunciation, and vowel harmony.",
    to: "/grammar/phonetics",
  },
  {
    title: "Numbers & Time",
    description: "Core numbers and everyday time expressions.",
    to: "/grammar/numbers-time",
  },
  {
    title: "Possessives",
    description: "How Hungarian shows ownership with suffixes.",
    to: "/grammar/possessives",
  },
];
