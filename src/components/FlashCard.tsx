import { useEffect, useState } from "react";
import { ButtonGroup } from "./ui/button-group";
import { Button } from "./ui/button";
// import { Skeleton } from "./ui/skeleton";
import { PageTitle } from "./PageTitle";
import { supabase } from "@/lib/supabase";
import { type Card, createEmptyCard, fsrs, type Grade, Grades } from "ts-fsrs";
import type { Database } from "@/types/database.types";

interface MyCard extends Card {
  word: string;
  img_url: string;
  id: number;
}

const convertDbRows = (
  data: Database["public"]["Tables"]["flashcards"]["Row"][],
) => {
  const cards: MyCard[] = [];
  data.forEach((card) => {
    cards.push(convertDbRow(card));
  });
  return cards;
};

const convertDbRow = (
  data: Database["public"]["Tables"]["flashcards"]["Row"],
) => {
  const scard: Card = createEmptyCard(new Date());
  const card: MyCard = {
    id: data.id,
    word: data.word,
    img_url: data.img_url,
    state: data.state,
    last_review: data.last_review ? new Date(data.last_review) : undefined,
    due: data.due ? new Date(data.due) : scard.due,
    stability: data.stability ?? scard.stability,
    difficulty: data.difficulty ?? scard.difficulty,
    elapsed_days: scard.elapsed_days,
    scheduled_days: data.scheduled_days ?? scard.scheduled_days,
    learning_steps: data.learning_steps ?? scard.learning_steps,
    reps: data.reps ?? scard.reps,
    lapses: data.lapses ?? scard.lapses,
  };
  return card;
};

export const FlashCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<MyCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  function handleFlip(): void {
    setIsFlipped(true);
  }

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("flashcards").select("*");
      if (error) {
        console.log(error);
      } else {
        const cards = convertDbRows(data);
        setFlashcards(cards);
      }
    })();
  }, []);

  useEffect(() => {
    const nextCard = flashcards[currentIndex + 1];
    if (!nextCard) return;
    const preloadImage = new Image();
    preloadImage.decoding = "async";
    preloadImage.src = nextCard.img_url;
  }, [flashcards, currentIndex]);

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

  console.log(currentCard);

  const handleRating = async (rating: Grade, id: number) => {
    const newCard = fsrs().next(currentCard, new Date(), rating);
    const { data, error } = await supabase
      .from("flashcards")
      .update({
        ...newCard.card,
        due: newCard.card.due.toISOString(),
        last_review: newCard.card.last_review?.toISOString(),
      })
      .eq("id", id)
      .select();
    console.log(data, error);
    if (error) {
      console.log(error);
    } else {
      setIsFlipped(false);
      setFlashcards((prev) => {
        const newFlashcards = [...prev];
        newFlashcards[currentIndex] = convertDbRow(data[0]);
        return newFlashcards;
      });
      setCurrentIndex((prev) => prev + 1);
    }
  };

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
              {/* {isLoading ? (
                <Skeleton className="max-w-full max-h-full w-full h-full rounded-lg shadow-sm object-contain" />
              ) : ( */}
              <>
                <img
                  className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                  src={currentCard.img_url}
                  alt={currentCard.word}
                  decoding="async"
                  fetchPriority="high"
                ></img>
              </>
              {/* )} */}
            </div>
            <ButtonGroup>
              {Grades.map((rating) => (
                <Button
                  variant="outline"
                  size="sm"
                  key={rating}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRating(rating, currentCard.id);
                  }}
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
              decoding="async"
              fetchPriority="high"
            ></img>
          </div>
        )}
      </div>
    </>
  );
};
