import conjugations from "../assets/conjugations.json";

export const Conjugator = () => {
  console.log(conjugations);
  return (
    <main className="flex flex-col items-center pb-4">
      <h1 className="text-xl mb-5">Conjugator Quiz</h1>
      <form className="flex flex-col gap-5">
        <fieldset className="flex gap-2">
          <legend>Past and/or Present</legend>
          <input type="checkbox" name="tense" value="present" id="present" />
          <label htmlFor="present">Present</label>
          <input type="checkbox" name="tense" value="past" id="past" />
          <label htmlFor="past">Past</label>
        </fieldset>

        <fieldset className="flex gap-2">
          <legend>Definite and/or Indefinite</legend>
          <input type="checkbox" name="def" value="definite" id="definite" />
          <label htmlFor="definite">Definite</label>
          <input
            type="checkbox"
            name="def"
            value="indefinite"
            id="indefinite"
          />
          <label htmlFor="indefinite">Indefinite</label>
        </fieldset>

        <button type="submit" className="border p-2">
          Start Quiz
        </button>
      </form>

      <p>{conjugations[0].infinitive}</p>
      <p>{conjugations[0].translation}</p>
      {Object.keys(conjugations[0].present.indefinite).map((key) => (
        <p className="p-2">
          {key} <input className="border" />
        </p>
      ))}
      <button className="border p-2">Submit</button>
    </main>
  );
};

// select past or present
// select definite or indefinite
// display translation
// display infinitive
// get a random pronoun from the key
// the answer is the value
