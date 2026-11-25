import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ButtonGroup } from "./ui/button-group";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Pencil } from "lucide-react";
import { PageTitle } from "./PageTitle";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import {
  type Card,
  createEmptyCard,
  fsrs,
  generatorParameters,
  type Grade,
  Grades,
  Rating,
} from "ts-fsrs";
import type { Database } from "@/types/database.types";

const f = fsrs(generatorParameters({ enable_fuzz: true }));

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
  const diffHours = diffMs / 3_600_000;
  if (diffHours < 24) return `${Math.round(diffHours)}h`;
  const diffDays = diffHours / 24;
  if (diffDays < 30) {
    const rounded = Math.round(diffDays * 10) / 10;
    return `${rounded % 1 === 0 ? rounded.toFixed(0) : rounded}d`;
  }
  return `${Math.round(diffDays)}d`;
};

const fetchDueCards = async (): Promise<MyCard[]> => {
  const supabase = getSupabaseClient();
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
  const supabase = getSupabaseClient();
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

const SHORT_TERM_MS = 20 * 60 * 1000;

const ConfiguredFlashCard = () => {
  const supabase = getSupabaseClient();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editWord, setEditWord] = useState("");
  const [replacementImage, setReplacementImage] = useState<File | null>(null);
  const [editErrMsg, setEditErrMsg] = useState<string | null>(null);
  const [queue, setQueue] = useState<MyCard[]>([]);
  const [nextDueDate, setNextDueDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastRating, setLastRating] = useState<{
    prevCard: MyCard;
    logId: number;
  } | null>(null);

  const replacementPreviewUrl = useMemo(() => {
    if (!replacementImage) return null;
    return URL.createObjectURL(replacementImage);
  }, [replacementImage]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cards = await fetchDueCards();
        if (cancelled) return;
        setLoadError(null);
        setQueue(cards);
        if (cards.length === 0) {
          const nextDue = await fetchNextDueDate();
          if (!cancelled) setNextDueDate(nextDue);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setLoadError("Could not load flash cards. Check your connection and try again.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  useEffect(() => {
    const nextCard = queue[1];
    if (!nextCard) return;
    const preloadImage = new Image();
    preloadImage.decoding = "async";
    preloadImage.src = nextCard.img_url;
  }, [queue]);

  // When the session queue empties after cards were loaded, fetch the
  // next future due date so we can show "All caught up!" with the correct time.
  useEffect(() => {
    const sessionDone = !isLoading && queue.length === 0;
    if (!sessionDone) return;
    fetchNextDueDate().then(setNextDueDate).catch(console.error);
  }, [isLoading, queue.length]);

  useEffect(() => {
    return () => {
      if (replacementPreviewUrl) URL.revokeObjectURL(replacementPreviewUrl);
    };
  }, [replacementPreviewUrl]);

  const currentCard = queue[0];

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

  const handleRating = useCallback(async (rating: Grade, id: number) => {
    const prevCard = currentCard;
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

    const { data: logData, error: logError } = await supabase
      .from("review_logs")
      .insert({
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
      })
      .select("id")
      .single();
    if (logError) {
      console.error(logError);
    } else {
      setLastRating({ prevCard, logId: logData.id });
    }

    const updatedCard = convertDbRow(data[0]);
    const isShortTerm =
      result.card.due.getTime() - now.getTime() <= SHORT_TERM_MS;

    setIsFlipped(false);
    setQueue((prev) => {
      const rest = prev.slice(1);
      if (isShortTerm && rest.length > 0) {
        const insertAt = Math.min(3, rest.length);
        const next = [...rest];
        next.splice(insertAt, 0, updatedCard);
        return next;
      }
      return rest;
    });
  }, [currentCard, supabase]);

  const handleUndo = useCallback(async () => {
    if (!lastRating) return;
    const { prevCard, logId } = lastRating;

    const { error: cardError } = await supabase
      .from("flashcards")
      .update({
        ...prevCard,
        due: prevCard.due.toISOString(),
        last_review: prevCard.last_review?.toISOString() ?? null,
      })
      .eq("id", prevCard.id);
    if (cardError) {
      console.error(cardError);
      return;
    }

    const { error: logError } = await supabase
      .from("review_logs")
      .delete()
      .eq("id", logId);
    if (logError) console.error(logError);

    setQueue((prev) => {
      const withoutRequeued = prev.filter((c) => c.id !== prevCard.id);
      return [prevCard, ...withoutRequeued];
    });
    setLastRating(null);
    setIsFlipped(false);
  }, [lastRating, supabase]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isEditing) return;
      if (
        e.target instanceof HTMLElement &&
        e.target.closest("input, textarea, select, [role='dialog']")
      ) {
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && lastRating) {
        e.preventDefault();
        handleUndo();
        return;
      }
      if (!currentCard) return;
      if (!isFlipped) {
        if (
          e.key === " " &&
          !(e.target instanceof HTMLElement && e.target.closest("button, a"))
        ) {
          e.preventDefault();
          setIsFlipped(true);
        }
      } else {
        const gradeMap: Record<string, Grade> = {
          "1": Grades[0],
          "2": Grades[1],
          "3": Grades[2],
          "4": Grades[3],
        };
        const grade = gradeMap[e.key];
        if (grade !== undefined) {
          handleRating(grade, currentCard.id);
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isEditing, isFlipped, currentCard, lastRating, handleUndo, handleRating]);

  if (isLoading) {
    return (
      <>
        <PageTitle title="Flash Cards" />
        <div className="flex min-h-96 w-full items-center justify-center rounded-lg border bg-card p-6 sm:max-w-md">
          <p className="text-muted-foreground">Loading…</p>
        </div>
      </>
    );
  }

  if (loadError) {
    return (
      <>
        <PageTitle title="Flash Cards" />
        <div
          role="alert"
          className="flex min-h-96 w-full flex-col items-center justify-center gap-4 rounded-lg border bg-card p-6 text-center sm:max-w-md"
        >
          <p className="text-sm text-destructive">{loadError}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setIsLoading(true);
              setLoadError(null);
              setRetryCount((count) => count + 1);
            }}
          >
            Retry
          </Button>
        </div>
      </>
    );
  }

  if (!currentCard && !isLoading) {
    const hasMore = nextDueDate !== null;
    return (
      <>
        <PageTitle title="Flash Cards" />
        <div className="flex min-h-96 w-full flex-col items-center justify-center gap-3 rounded-lg border bg-card p-6 text-center sm:max-w-md">
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
            <>
              <p className="text-lg font-medium">No flash cards yet</p>
              <p className="text-sm text-muted-foreground">
                Add a word and image to start reviewing.
              </p>
              <Button asChild className="mt-1">
                <Link to="/flash-cards/create">Create a flash card</Link>
              </Button>
            </>
          )}
        </div>
      </>
    );
  }

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

    setQueue((prev) => {
      const next = [...prev];
      next[0] = convertDbRow(data[0]);
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

    setQueue((prev) => prev.filter((c) => c.id !== currentCard.id));
    setIsEditing(false);
    setIsFlipped(false);
    setEditErrMsg(null);
    setReplacementImage(null);
  };

  const remaining = queue.length;

  return (
    <>
      <PageTitle title="Flash Cards" />
      <div className="mb-2 flex items-center gap-3">
        <p className="text-sm tabular-nums text-muted-foreground">
          {remaining} card{remaining !== 1 ? "s" : ""} remaining
        </p>
        {lastRating && (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto px-2 py-0.5 text-xs text-muted-foreground"
            onClick={handleUndo}
          >
            Undo
          </Button>
        )}
      </div>
      <div
        className="flex min-h-96 w-full flex-col rounded-lg border bg-card p-6 sm:max-w-md"
        data-testid="flashcard"
        role={isFlipped ? undefined : "button"}
        aria-label={isFlipped ? undefined : "Flip card"}
        tabIndex={isFlipped ? undefined : 0}
        onClick={!isFlipped ? () => setIsFlipped(true) : undefined}
        onKeyDown={
          !isFlipped
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIsFlipped(true);
                }
              }
            : undefined
        }
      >
        {isFlipped ? (
          <div className="relative flex flex-1 flex-col items-center justify-between gap-5">
            <h2 lang="hu" className="text-center text-3xl font-semibold tracking-tight text-foreground">
              {currentCard.word}
            </h2>
            <div className="flex min-h-40 w-full flex-1 items-center justify-center">
              <img
                className="max-h-60 max-w-full rounded-lg object-contain shadow-sm outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
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
                className="flex w-full flex-col items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Input
                  aria-label="Word"
                  value={editWord}
                  onChange={(e) => setEditWord(e.target.value)}
                  placeholder="kutya"
                />
                <Input
                  type="file"
                  aria-label="Replacement image"
                  accept="image/*"
                  className="text-muted-foreground file:text-sm file:font-medium file:text-foreground"
                  onChange={(e) =>
                    setReplacementImage(e.target.files?.[0] ?? null)
                  }
                />
                {editErrMsg ? (
                  <p role="alert" className="text-center text-sm text-destructive">
                    {editErrMsg}
                  </p>
                ) : null}
                <div className="flex w-full flex-wrap justify-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button variant="default" size="sm" onClick={handleSaveEdit}>
                    Save
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleDeleteCard}>
                    Delete
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <ButtonGroup>
                  {Grades.map((grade, i) => (
                    <Button
                      variant="outline"
                      size="sm"
                      key={grade}
                      data-testid={`rate-${Rating[grade].toLowerCase()}`}
                      className="h-auto cursor-pointer flex-col gap-0.5 px-3 py-1.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRating(grade, currentCard.id);
                      }}
                    >
                      <span className="text-xs font-medium">{Rating[grade]}</span>
                      {schedulingPreviews?.get(grade) && (
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {schedulingPreviews.get(grade)}
                        </span>
                      )}
                      <span className="text-xs tabular-nums text-muted-foreground">
                        [{i + 1}]
                      </span>
                    </Button>
                  ))}
                </ButtonGroup>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="absolute bottom-0 left-0 text-muted-foreground hover:text-foreground"
                  aria-label="Edit card"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartEdit();
                  }}
                >
                  <Pencil className="size-4" aria-hidden="true" />
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-1 cursor-pointer items-center justify-center">
            <img
              className="max-h-72 max-w-full rounded-lg object-contain shadow-sm outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
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

export const FlashCard = () => {
  if (!isSupabaseConfigured()) {
    return (
      <>
        <PageTitle title="Flash Cards" />
        <p role="alert" className="max-w-md text-center text-muted-foreground">
          Flash Cards require Supabase configuration. Add the project URL and
          an anon or publishable key, then restart Magyar.
        </p>
      </>
    );
  }

  return <ConfiguredFlashCard />;
};
