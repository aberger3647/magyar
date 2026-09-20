import { PageTitle } from "./PageTitle";
import phrases from "../assets/phrases.json";
import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { textMatchesQuery } from "@/lib/search";
import {
  createPhrasebookEntry,
  deletePhrasebookEntry,
  listPhrasebookEntries,
  migrateLocalPhrasebookEntries,
  updatePhrasebookEntry,
  type PhrasebookEntry,
} from "@/lib/phrasebook";
import { isSupabaseConfigured } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export const Phrasebook = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get("q") ?? "";
  const [customPhrases, setCustomPhrases] = React.useState<PhrasebookEntry[]>([]);
  const [hungarian, setHungarian] = React.useState("");
  const [english, setEnglish] = React.useState("");
  const [isEditing, setIsEditing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!isSupabaseConfigured()) {
        setErrorMessage("Phrasebook sync is not configured.");
        setIsLoading(false);
        return;
      }

      try {
        await migrateLocalPhrasebookEntries();
        const entries = await listPhrasebookEntries();
        if (!cancelled) setCustomPhrases(entries);
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error ? error.message : "Could not load saved phrases.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const allPhrases = React.useMemo<
    { phrase: { hungarian: string; english: string }; customId?: number }[]
  >(() => {
    const normalizedCustom = customPhrases
      .map((phrase) => ({
        phrase: {
          hungarian: phrase.hungarian.trim(),
          english: phrase.english.trim(),
        },
        customId: phrase.id,
      }))
      .filter(
        ({ phrase }) =>
          phrase.hungarian.length > 0 && phrase.english.length > 0,
      );

    return [
      ...normalizedCustom,
      ...phrases.map((phrase) => ({ phrase })),
    ];
  }, [customPhrases]);

  const visiblePhrases = React.useMemo(() => {
    if (filter.trim().length === 0) return allPhrases;
    return allPhrases.filter(({ phrase }) =>
      textMatchesQuery([phrase.hungarian, phrase.english], filter),
    );
  }, [allPhrases, filter]);

  const canSubmit = hungarian.trim().length > 0 && english.trim().length > 0;

  return (
    <>
      <PageTitle title="Phrasebook" />
      <div className="md:w-2xl w-full">
        <form
          className="mb-4 rounded-md border bg-card p-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!canSubmit || isSaving) return;

            setIsSaving(true);
            setErrorMessage(null);
            try {
              const entry = await createPhrasebookEntry(
                hungarian.trim(),
                english.trim(),
              );
              setCustomPhrases((current) => [entry, ...current]);
              setHungarian("");
              setEnglish("");
            } catch (error) {
              setErrorMessage(
                error instanceof Error ? error.message : "Could not save the phrase.",
              );
            } finally {
              setIsSaving(false);
            }
          }}
        >
          <div className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="phrasebook-hungarian">
                Magyar
              </label>
              <Input
                id="phrasebook-hungarian"
                value={hungarian}
                onChange={(e) => setHungarian(e.target.value)}
                placeholder="Írd be a magyar mondatot…"
                autoComplete="off"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="phrasebook-english">
                English
              </label>
              <Input
                id="phrasebook-english"
                value={english}
                onChange={(e) => setEnglish(e.target.value)}
                placeholder="Type the English translation…"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <Button type="submit" disabled={!canSubmit || isSaving}>
              {isSaving ? "Saving…" : "Add phrase"}
            </Button>
          </div>
        </form>

        {errorMessage && (
          <p role="alert" className="mb-4 text-sm text-destructive">
            {errorMessage}
          </p>
        )}

        <div className="mb-4">
          <label className="sr-only" htmlFor="phrasebook-search">
            Search phrases
          </label>
          <Input
            id="phrasebook-search"
            value={filter}
            onChange={(e) => {
              const next = e.target.value;
              if (next.trim().length === 0) {
                setSearchParams({}, { replace: true });
              } else {
                setSearchParams({ q: next }, { replace: true });
              }
            }}
            placeholder="Search phrases…"
            autoComplete="off"
          />
        </div>

        {!isLoading && customPhrases.length > 0 && (
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {customPhrases.length} saved {customPhrases.length === 1 ? "phrase" : "phrases"}
            </p>
            <Button
              type="button"
              variant={isEditing ? "secondary" : "outline"}
              onClick={() => setIsEditing((editing) => !editing)}
            >
              {isEditing ? "Done editing" : "Edit phrases"}
            </Button>
          </div>
        )}

        {visiblePhrases.length === 0 && (
          <p className="mb-4 text-sm text-muted-foreground">
            No phrases match “{filter}”.
          </p>
        )}

        {visiblePhrases.map(({ phrase, customId }, idx) => {
          const isExact =
            filter.trim().length > 0 && phrase.hungarian === filter.trim();
          return (
            <form
              key={`${phrase.hungarian}__${phrase.english}__${idx}`}
              className={cn(
                "mb-2 flex flex-col justify-between rounded-md bg-accent p-4 md:flex-row",
                isExact && "ring-2 ring-ring",
              )}
              onSubmit={(event) => {
                event.preventDefault();
                if (customId === undefined) return;

                const formData = new FormData(event.currentTarget);
                const nextHungarian = String(formData.get("hungarian") ?? "").trim();
                const nextEnglish = String(formData.get("english") ?? "").trim();
                if (!nextHungarian || !nextEnglish) return;

                setErrorMessage(null);
                void updatePhrasebookEntry(
                  customId,
                  nextHungarian,
                  nextEnglish,
                )
                  .then((updated) => {
                    setCustomPhrases((current) =>
                      current.map((entry) =>
                        entry.id === updated.id ? updated : entry,
                      ),
                    );
                  })
                  .catch((error: unknown) => {
                    setErrorMessage(
                      error instanceof Error
                        ? error.message
                        : "Could not update the phrase.",
                    );
                  });
              }}
            >
              {isEditing && customId !== undefined ? (
                <div className="grid w-full gap-3 md:grid-cols-[1fr_1fr_auto_auto] md:items-end">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor={`phrase-hungarian-${customId}`}>
                      Magyar
                    </label>
                    <Input
                      id={`phrase-hungarian-${customId}`}
                      name="hungarian"
                      defaultValue={phrase.hungarian}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor={`phrase-english-${customId}`}>
                      English
                    </label>
                    <Input
                      id={`phrase-english-${customId}`}
                      name="english"
                      defaultValue={phrase.english}
                    />
                  </div>
                  <Button type="submit">Save</Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      setErrorMessage(null);
                      void deletePhrasebookEntry(customId)
                        .then(() => {
                          setCustomPhrases((current) =>
                            current.filter((entry) => entry.id !== customId),
                          );
                        })
                        .catch((error: unknown) => {
                          setErrorMessage(
                            error instanceof Error
                              ? error.message
                              : "Could not delete the phrase.",
                          );
                        });
                    }}
                  >
                    Delete
                  </Button>
                </div>
              ) : (
                <>
                  <p className="font-bold">{phrase.hungarian}</p>
                  <p>{phrase.english}</p>
                </>
              )}
            </form>
          );
        })}
      </div>
    </>
  );
};
