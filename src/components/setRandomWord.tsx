import conjugations from "../assets/conjugations.json";

export const setRandomWord = (words: typeof conjugations) => {
  const numOfWords = words.length;
  const randomNum = Math.floor(Math.random() * numOfWords);
  const randomWordObj = words[randomNum];
  const randomWord = randomWordObj.lemma;
  localStorage.setItem("randomWord", randomWord);
};
