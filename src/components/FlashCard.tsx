import { useEffect, useMemo, useState } from "react";
import { ButtonGroup } from "./ui/button-group";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Pencil } from "lucide-react";
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

const getExtensionForType = (mimeType: string) => {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
};

const makeSafeStorageKey = (text: string) => {
  const normalized = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "card";
};

const getStoragePathFromPublicUrl = (publicUrl: string) => {
  const marker = "/storage/v1/object/public/cardimages/";
  const idx = publicUrl.indexOf(marker);
  if (idx < 0) return null;
  return publicUrl.slice(idx + marker.length);
};

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
  const [isEditing, setIsEditing] = useState(false);
  const [editWord, setEditWord] = useState("");
  const [replacementImage, setReplacementImage] = useState<File | null>(null);
  const [editErrMsg, setEditErrMsg] = useState<string | null>(null);
  // const [isLoading, setIsLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<MyCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const replacementPreviewUrl = useMemo(() => {
    if (!replacementImage) return null;
    return URL.createObjectURL(replacementImage);
  }, [replacementImage]);

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

  useEffect(() => {
    return () => {
      if (replacementPreviewUrl) URL.revokeObjectURL(replacementPreviewUrl);
    };
  }, [replacementPreviewUrl]);

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

  const handleStartEdit = () => {
    setEditWord(currentCard.word);
    setReplacementImage(null);
    setEditErrMsg(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditWord("");
    setReplacementImage(null);
    setEditErrMsg(null);
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    const nextWord = editWord.trim();
    if (!nextWord) {
      setEditErrMsg("Enter a word");
      return;
    }

    let nextImgUrl = currentCard.img_url;
    let oldStoragePathToDelete: string | null = null;
    let uploadedStoragePath: string | null = null;
    if (replacementImage) {
      const uuid = crypto.randomUUID();
      const extension = getExtensionForType(replacementImage.type);
      const safeWord = makeSafeStorageKey(nextWord);
      const filePath = `${safeWord}-${uuid}.${extension}`;
      uploadedStoragePath = filePath;
      const uploadResult = await supabase.storage
        .from("cardimages")
        .upload(filePath, replacementImage);
      if (uploadResult.error) {
        setEditErrMsg(`Image upload failed: ${uploadResult.error.message}`);
        return;
      }
      const {
        data: { publicUrl },
      } = supabase.storage.from("cardimages").getPublicUrl(filePath);
      nextImgUrl = publicUrl;
      oldStoragePathToDelete = getStoragePathFromPublicUrl(currentCard.img_url);
    }

    const { data, error } = await supabase
      .from("flashcards")
      .update({
        word: nextWord,
        img_url: nextImgUrl,
      })
      .eq("id", currentCard.id)
      .select();

    if (error || !data?.[0]) {
      if (uploadedStoragePath) {
        const { error: cleanupError } = await supabase.storage
          .from("cardimages")
          .remove([uploadedStoragePath]);
        if (cleanupError) {
          console.log("Failed to clean up uploaded image", cleanupError);
        }
      }
      setEditErrMsg(`Failed to save card: ${error?.message ?? "unknown error"}`);
      return;
    }

    if (replacementImage && oldStoragePathToDelete) {
      const { error: storageDeleteError } = await supabase.storage
        .from("cardimages")
        .remove([oldStoragePathToDelete]);
      if (storageDeleteError) {
        console.log("Failed to delete old image", storageDeleteError);
      }
    }

    setFlashcards((prev) => {
      const newFlashcards = [...prev];
      newFlashcards[currentIndex] = convertDbRow(data[0]);
      return newFlashcards;
    });
    setEditErrMsg(null);
    setReplacementImage(null);
    setIsEditing(false);
  };

  const handleDeleteCard = async () => {
    const shouldDelete = window.confirm(
      `Delete "${currentCard.word}"? This cannot be undone.`,
    );
    if (!shouldDelete) return;

    const { error } = await supabase
      .from("flashcards")
      .delete()
      .eq("id", currentCard.id);
    if (error) {
      setEditErrMsg(`Failed to delete card: ${error.message}`);
      return;
    }

    const storagePath = getStoragePathFromPublicUrl(currentCard.img_url);
    if (storagePath) {
      const { error: storageError } = await supabase.storage
        .from("cardimages")
        .remove([storagePath]);
      if (storageError) {
        console.log("Failed to delete image", storageError);
      }
    }

    const nextLength = Math.max(0, flashcards.length - 1);
    setCurrentIndex((prev) => Math.min(prev, Math.max(0, nextLength - 1)));
    setFlashcards((prev) => prev.filter((card) => card.id !== currentCard.id));
    setIsEditing(false);
    setIsFlipped(false);
    setEditErrMsg(null);
    setReplacementImage(null);
  };

  return (
    <>
      <PageTitle title="Flash Cards" />
      <div
        className="w-full h-96 sm:max-w-md overflow-hidden rounded-lg border p-6"
        onClick={!isFlipped ? () => handleFlip() : undefined}
      >
        {isFlipped ? (
          <div className="relative flex flex-col items-center justify-between h-full gap-5">
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
                  src={
                    isEditing && replacementPreviewUrl
                      ? replacementPreviewUrl
                      : currentCard.img_url
                  }
                  alt={currentCard.word}
                  decoding="async"
                  fetchPriority="high"
                ></img>
              </>
              {/* )} */}
            </div>
            {isEditing ? (
              <div
                className="w-full flex flex-col items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Input
                  value={editWord}
                  onChange={(e) => setEditWord(e.target.value)}
                  placeholder="Word"
                />
                <Input
                  type="file"
                  accept="image/*"
                  className="text-xs text-slate-500 file:text-sm file:font-medium file:text-foreground"
                  onChange={(e) =>
                    setReplacementImage(e.target.files?.[0] ?? null)
                  }
                />
                {editErrMsg ? (
                  <p className="text-xs text-red-500 text-center">{editErrMsg}</p>
                ) : null}
                <div className="w-full flex flex-wrap justify-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSaveEdit}>
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDeleteCard}>
                    Delete
                  </Button>
                </div>
              </div>
            ) : (
              <>
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute bottom-0 left-0 text-slate-500 hover:text-slate-700"
                  aria-label="Edit card"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartEdit();
                  }}
                >
                  <Pencil className="size-4" />
                </Button>
              </>
            )}
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
