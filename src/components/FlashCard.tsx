import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import image from '../assets/puppy.jpg'
export const FlashCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const word = 'Kutya'

  function handleFlip(): void {
   setIsFlipped(true)
  }

  return (
    <Card className="w-full sm:max-w-md aspect-square overflow-hidden" onClick={()=>handleFlip()}>
      <CardContent className="flex h-full flex-col items-center justify-center p-6">
        {isFlipped ? (
          <>
            <h2 className="text-3xl mt-4 tracking-wide text-center text-slate-600">
              {word}
            </h2>
            <div className=" aspect-square m-6">
              <img className='object-cover w-full h-full rounded-xl' src={image}></img>
            </div>
          </>
        ) : (
          <h2 className="text-7xl tracking-wide text-center">{word}</h2>
        )}
      </CardContent>
    </Card>
  );
};
