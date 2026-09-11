export const isConjugationAnswerCorrect = (
  userAnswer: string,
  expectedAnswer: string | undefined,
): boolean =>
  expectedAnswer !== undefined && userAnswer.trim() === expectedAnswer;
