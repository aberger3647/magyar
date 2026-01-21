import { useEffect, useState } from "react";
import { ButtonGroup } from "./ui/button-group";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { PageTitle } from "./PageTitle";
import { supabase } from "@/lib/supabase";

type Flashcard = {
  id: number;
  word: string;
  img_url: string;
  created_at: string;
  state: string;
  next_review_at: string | null;
  stability: number | null;
  difficulty: number | null;
};

export const FlashCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const ratings: string[] = ["Again", "Hard", "Good", "Easy"];

  function handleFlip(): void {
    setIsFlipped(true);
  }

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from('flashcards').select('*')
      if (error) {
        console.log(error)
      } else {
        setFlashcards(data)
      }
    })()
  }, [])

  const currentCard = flashcards[currentIndex];

  if (!currentCard) {
    return (
      <>
        <PageTitle title="Flash Cards" />
        <div className="w-full h-96 sm:max-w-md overflow-hidden rounded-lg border p-6 flex items-center justify-center">
          <p>No flashcards available</p>
        </div>
      </>
    );
  }

  const handleRating = async (rating: string, id: number) => {
    let numRating
    switch (rating) {
      case "Again":
        numRating = 1;
        break;
      case "Hard":
        numRating = 2;
        break;
      case "Good":
        numRating = 3;
        break;
      case "Easy":
        numRating = 4;
        break;
      default:
        numRating = 1
    }
    const { data, error } = await supabase.from('flashcards').update({ difficulty: numRating }).eq('id', id).select()
    console.log(data,error)
    if (error) {
      console.log(error)
    } else {
      setCurrentIndex(prev => prev + 1)
      setIsFlipped(false)
    }

  }

  return (
    <>
      <PageTitle title="Flash Cards" />
      <div
        className="w-full h-96 sm:max-w-md overflow-hidden rounded-lg border p-6"
        onClick={() => handleFlip()}
      >
        {isFlipped ? (
          <div className="flex flex-col items-center justify-between h-full gap-5">
            <h2 className="text-3xl tracking-wide text-center text-slate-600">
              {currentCard.word}
            </h2>
            <div className="flex-1 w-full min-h-0 flex items-center justify-center">
              {isLoading ? (
                <Skeleton className="max-w-full max-h-full w-full h-full rounded-lg shadow-sm object-contain" />
              ) : (
                <>
                  <img
                    className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                    src={currentCard.img_url}
                    alt={currentCard.word}
                  ></img>
                </>
              )}
            </div>
            <ButtonGroup>
              {ratings.map((rating) => (
                <Button
                  variant="outline"
                  size="sm"
                  key={rating}
                  className="cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); handleRating(rating, currentCard.id) }}
                >
                  {rating}
                </Button>
              ))}
            </ButtonGroup>
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center cursor-pointer">
            <img
              className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
              src={currentCard.img_url}
              alt={currentCard.word}
            ></img>
          </div>
        )}
      </div>
    </>
  );
};
