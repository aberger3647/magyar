export const Conjugator = () => {
  return (
    <main className="flex flex-col items-center pb-4">
      <h1 className="text-xl mb-5">Conjugator Quiz</h1>
      <form className="flex flex-col gap-5">
        
        <div className="flex gap-2">
          <input type="radio" name="tense" value="present" id="present" />
          <label htmlFor="present">Present</label>
          <input type="radio" name="tense" value="past" id="past" />
          <label htmlFor="past">Past</label>
        </div>

        <div className="flex gap-2">
          <input type="radio" name="def" value="definite" id="definite" />
          <label htmlFor="definite">Definite</label>
          <input type="radio" name="def" value="indefinite" id="indefinite" />
          <label htmlFor="indefinite">Indefinite</label>
        </div>

        <button type="submit" className="border p-2">
          Start Quiz
        </button>
      </form>
    </main>
  );
};

// select past or present
// select definite or indefinite
// display translation
// display infinitive
// get a random pronoun from the key
// the answer is the value
