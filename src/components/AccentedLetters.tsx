"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

export const AccentedLetters = () => {
  return (
    <div className="mb-4 flex justify-center">
      <ButtonGroup>
        <Button variant="outline" size="sm">
          á
        </Button>
        <Button variant="outline" size="sm">
          é
        </Button>
        <Button variant="outline" size="sm">
          í
        </Button>
        <Button variant="outline" size="sm">
          ó
        </Button>
        <Button variant="outline" size="sm">
          ö
        </Button>
        <Button variant="outline" size="sm">
          ő
        </Button>
        <Button variant="outline" size="sm">
          ú
        </Button>
        <Button variant="outline" size="sm">
          ü
        </Button>
        <Button variant="outline" size="sm">
          ű
        </Button>
      </ButtonGroup>
    </div>
  );
};
