export const isConjugationAnswerCorrect = (
  userAnswer: string,
  expectedAnswer: string | undefined,
): boolean =>
  expectedAnswer !== undefined && userAnswer.trim() === expectedAnswer;

export const hasConjugationForm = (
  conjugation: {
    present: { definite: unknown };
    past: { definite: unknown };
  },
  tense: "present" | "past",
  voice: "indefinite" | "definite",
): boolean => voice === "indefinite" || conjugation[tense].definite !== null;
