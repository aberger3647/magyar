import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import image from "../assets/puppy.jpg";
import { ButtonGroup } from "./ui/button-group";
import { Button } from "./ui/button";

export const FlashCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const word = "Kutya";
  const ratings = ["Again", "Hard", "Good", "Easy"];

  function handleFlip(): void {
    setIsFlipped(true);
  }

  return (
    <div
      className="w-full h-96 sm:max-w-md overflow-hidden rounded-lg border p-6"
      onClick={() => handleFlip()}
    >
        {isFlipped ? (
          <div className='flex flex-col items-center justify-between h-full gap-5'>
            <h2 className="text-3xl tracking-wide text-center text-slate-600">
              {word}
            </h2>
            <div className="flex-1 w-full min-h-0 flex items-center justify-center">
              <img
                className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                src={image}
                alt={word}
              ></img>
            </div>
              <ButtonGroup>
                {ratings.map((rating) => (
                  <Button variant="outline" size="sm" key={rating}>
                    {rating}
                  </Button>
                ))}
              </ButtonGroup>
            </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <h2 className="text-7xl tracking-wide text-center">{word}</h2>
          </div>
        )}
   </div>
  );
};
