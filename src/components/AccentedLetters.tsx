"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

const chars = ["á", "é", "í", "ó", "ö", "ő", "ú", "ü", "ű"];

export const AccentedLetters = ({
  handleCharInsert,
}: {
  handleCharInsert: (char: string) => void;
}) => {
  return (
    <div className="mb-4 flex justify-center">
      <ButtonGroup>
        {chars.map((char) => (
          <Button
            variant="outline"
            size="sm"
            key={char}
            onClick={() => handleCharInsert(char)}
          >
            {char}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
};
