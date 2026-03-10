import conjugations from "../assets/conjugations.json";

export const setRandomWord = (
  words: typeof conjugations,
  setStoredWord: (newValue: string | null) => void
) => {
  if (words.length === 0) {
    setStoredWord(null);
    return;
  }
  const numOfWords = words.length;
  const randomNum = Math.floor(Math.random() * numOfWords);
  const randomWordObj = words[randomNum];
  const randomWord = randomWordObj.lemma;
  setStoredWord(randomWord);
};
