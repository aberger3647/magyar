import { Button } from "@/components/ui/button";

const chars = ["á", "é", "í", "ó", "ö", "ő", "ú", "ü", "ű"];

export const AccentedLetters = ({
  handleCharInsert,
}: {
  handleCharInsert: (char: string) => void;
}) => {
  return (
    <div
      role="group"
      aria-label="Insert accented letters"
      className="mb-4 flex flex-wrap justify-center gap-1.5"
    >
      {chars.map((char) => (
        <Button
          type="button"
          variant="outline"
          size="sm"
          key={char}
          lang="hu"
          className="min-w-8 px-2"
          onClick={() => handleCharInsert(char)}
        >
          {char}
        </Button>
      ))}
    </div>
  );
};
