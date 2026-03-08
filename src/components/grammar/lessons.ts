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
    title: "Possessives",
    description: "How Hungarian shows ownership with suffixes.",
    to: "/grammar/possessives",
  },
];
