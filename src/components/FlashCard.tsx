import { useEffect, useMemo, useState } from "react";
import { ButtonGroup } from "./ui/button-group";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Pencil } from "lucide-react";
import { PageTitle } from "./PageTitle";
import { supabase } from "@/lib/supabase";
import {
  type Card,
  createEmptyCard,
  fsrs,
  type Grade,
  Grades,
  Rating,
} from "ts-fsrs";
import type { Database } from "@/types/database.types";

const f = fsrs();

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

const convertDbRow = (
  data: Database["public"]["Tables"]["flashcards"]["Row"],
): MyCard => {
  const scard: Card = createEmptyCard(new Date());
  return {
    id: data.id,
    word: data.word,
    img_url: data.img_url,
    state: data.state,
    last_review: data.last_review ? new Date(data.last_review) : undefined,
    due: data.due ? new Date(data.due) : scard.due,
    stability: data.stability ?? scard.stability,
    difficulty: data.difficulty ?? scard.difficulty,
    elapsed_days: data.elapsed_days,
    scheduled_days: data.scheduled_days ?? scard.scheduled_days,
    learning_steps: data.learning_steps ?? scard.learning_steps,
    reps: data.reps ?? scard.reps,
    lapses: data.lapses ?? scard.lapses,
  };
};

const formatInterval = (due: Date, now: Date): string => {
  const diffMs = due.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60_000);
  if (diffMins < 60) return `${Math.max(1, diffMins)}m`;
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  return `${Math.round(diffHours / 24)}d`;
};

const fetchDueCards = async (): Promise<MyCard[]> => {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("flashcards")
    .select("*")
    .or(`due.is.null,due.lte.${now}`)
    .order("due", { ascending: true, nullsFirst: true });
  if (error) throw error;
  return data.map(convertDbRow);
};

const fetchNextDueDate = async (): Promise<Date | null> => {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("flashcards")
    .select("due")
    .gt("due", now)
    .order("due", { ascending: true })
    .limit(1);
  if (error || !data?.length) return null;
  return data[0].due ? new Date(data[0].due) : null;
};

export const FlashCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editWord, setEditWord] = useState("");
  const [replacementImage, setReplacementImage] = useState<File | null>(null);
  const [editErrMsg, setEditErrMsg] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<MyCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextDueDate, setNextDueDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const replacementPreviewUrl = useMemo(() => {
    if (!replacementImage) return null;
    return URL.createObjectURL(replacementImage);
  }, [replacementImage]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const cards = await fetchDueCards();
        setFlashcards(cards);
        if (cards.length === 0) {
          const nextDue = await fetchNextDueDate();
          setNextDueDate(nextDue);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
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

  // When the session is completed (rated through all loaded cards), fetch the
  // next future due date so we can show "All caught up!" with the correct time.
  useEffect(() => {
    const sessionDone =
      !isLoading && flashcards.length > 0 && currentIndex >= flashcards.length;
    if (!sessionDone) return;
    fetchNextDueDate().then(setNextDueDate).catch(console.error);
  }, [isLoading, flashcards.length, currentIndex]);

  useEffect(() => {
    return () => {
      if (replacementPreviewUrl) URL.revokeObjectURL(replacementPreviewUrl);
    };
  }, [replacementPreviewUrl]);

  const currentCard = flashcards[currentIndex];

  const schedulingPreviews = useMemo(() => {
    if (!currentCard || !isFlipped) return null;
    const now = new Date();
    const items = f.repeat(currentCard, now);
    const map = new Map<Grade, string>();
    for (const item of items) {
      map.set(item.log.rating as Grade, formatInterval(item.card.due, now));
    }
    return map;
  }, [currentCard, isFlipped]);

  if (isLoading) {
    return (
      <>
        <PageTitle title="Flash Cards" />
        <div className="w-full h-96 sm:max-w-md overflow-hidden rounded-lg border p-6 flex items-center justify-center">
          <p className="text-muted-foreground">Loading…</p>
        </div>
      </>
    );
  }

  if (!currentCard) {
    const hasMore = nextDueDate !== null;
    return (
      <>
        <PageTitle title="Flash Cards" />
        <div className="w-full h-96 sm:max-w-md overflow-hidden rounded-lg border p-6 flex flex-col items-center justify-center gap-2 text-center">
          {hasMore ? (
            <>
              <p className="text-lg font-medium">All caught up!</p>
              <p className="text-sm text-muted-foreground">
                Next review:{" "}
                {nextDueDate.toLocaleString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            </>
          ) : (
            <p className="text-muted-foreground">No flashcards yet</p>
          )}
        </div>
      </>
    );
  }

  const handleRating = async (rating: Grade, id: number) => {
    const now = new Date();
    const result = f.next(currentCard, now, rating);
    const { data, error } = await supabase
      .from("flashcards")
      .update({
        ...result.card,
        due: result.card.due.toISOString(),
        last_review: result.card.last_review?.toISOString(),
      })
      .eq("id", id)
      .select();
    if (error) {
      console.error(error);
      return;
    }

    const { error: logError } = await supabase.from("review_logs").insert({
      flashcard_id: id,
      rating: result.log.rating,
      state: result.log.state,
      due: result.log.due?.toISOString() ?? null,
      stability: result.log.stability ?? null,
      difficulty: result.log.difficulty ?? null,
      elapsed_days: result.log.elapsed_days,
      last_elapsed_days: result.log.last_elapsed_days,
      scheduled_days: result.log.scheduled_days,
      review: result.log.review.toISOString(),
    });
    if (logError) console.error(logError);

    setIsFlipped(false);
    setFlashcards((prev) => {
      const next = [...prev];
      next[currentIndex] = convertDbRow(data[0]);
      return next;
    });
    setCurrentIndex((prev) => prev + 1);
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
          console.error("Failed to clean up uploaded image", cleanupError);
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
        console.error("Failed to delete old image", storageDeleteError);
      }
    }

    setFlashcards((prev) => {
      const next = [...prev];
      next[currentIndex] = convertDbRow(data[0]);
      return next;
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
        console.error("Failed to delete image", storageError);
      }
    }

    const remaining = flashcards.filter((c) => c.id !== currentCard.id);
    const nextIndex = Math.min(currentIndex, Math.max(0, remaining.length - 1));
    setCurrentIndex(nextIndex);
    setFlashcards(remaining);
    setIsEditing(false);
    setIsFlipped(false);
    setEditErrMsg(null);
    setReplacementImage(null);
  };

  const remaining = flashcards.length - currentIndex;

  return (
    <>
      <PageTitle title="Flash Cards" />
      <p className="text-sm text-muted-foreground mb-2">
        {remaining} card{remaining !== 1 ? "s" : ""} remaining
      </p>
      <div
        className="w-full h-96 sm:max-w-md overflow-hidden rounded-lg border p-6"
        data-testid="flashcard"
        role="button"
        aria-label={isFlipped ? currentCard.word : "Flip card"}
        tabIndex={isFlipped ? -1 : 0}
        onClick={!isFlipped ? () => setIsFlipped(true) : undefined}
        onKeyDown={
          !isFlipped
            ? (e) => e.key === "Enter" && setIsFlipped(true)
            : undefined
        }
      >
        {isFlipped ? (
          <div className="relative flex flex-col items-center justify-between h-full gap-5">
            <h2 className="text-3xl tracking-wide text-center text-slate-600">
              {currentCard.word}
            </h2>
            <div className="flex-1 w-full min-h-0 flex items-center justify-center">
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
              />
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
                  {Grades.map((grade) => (
                    <Button
                      variant="outline"
                      size="sm"
                      key={grade}
                      data-testid={`rate-${Rating[grade].toLowerCase()}`}
                      className="cursor-pointer flex flex-col h-auto py-1.5 px-3 gap-0.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRating(grade, currentCard.id);
                      }}
                    >
                      <span className="text-xs font-medium">{Rating[grade]}</span>
                      {schedulingPreviews?.get(grade) && (
                        <span className="text-[10px] text-muted-foreground">
                          {schedulingPreviews.get(grade)}
                        </span>
                      )}
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
            />
          </div>
        )}
      </div>
    </>
  );
};
