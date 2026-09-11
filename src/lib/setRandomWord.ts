import conjugations from "../assets/conjugations.json";

type RandomWordOptions = {
  words: typeof conjugations;
  excludedWord?: string | null;
  random?: () => number;
};

type SetRandomWordOptions = Omit<RandomWordOptions, "random"> & {
  setStoredWord: (newValue: string | null) => void;
};

export const getRandomWord = ({
  words,
  excludedWord,
  random = Math.random,
}: RandomWordOptions): string | null => {
  const alternatives = excludedWord
    ? words.filter((word) => word.lemma !== excludedWord)
    : words;
  const candidates = alternatives.length > 0 ? alternatives : words;

  if (candidates.length === 0) return null;

  const randomIndex = Math.floor(random() * candidates.length);
  return candidates[randomIndex]?.lemma ?? null;
};

export const setRandomWord = ({
  words,
  excludedWord,
  setStoredWord,
}: SetRandomWordOptions) => {
  setStoredWord(getRandomWord({ words, excludedWord }));
};
