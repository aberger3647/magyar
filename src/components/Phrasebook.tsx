import { PageTitle } from "./PageTitle";
import phrases from "../assets/phrases.json";

export const Phrasebook = () => {
  return (
    <>
      <PageTitle title="Phrasebook" />
      <div className="md:w-2xl">
      {phrases.map((phrase) => (
        <div className="flex flex-col md:flex-row justify-between mb-2 bg-accent p-4 rounded-md">
          <p className="font-bold">{phrase.hungarian}</p>
          <p>{phrase.english}</p>
        </div>
      ))}
      </div>
    </>
  );
};
