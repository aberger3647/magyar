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
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<number | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [loadFailed, setLoadFailed] = React.useState(false);
  const [retryCount, setRetryCount] = React.useState(0);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!isSupabaseConfigured()) {
        setErrorMessage("Phrasebook sync is not configured. Built-in phrases remain available.");
        setLoadFailed(false);
        setIsLoading(false);
        return;
      }

      try {
        await migrateLocalPhrasebookEntries();
        const entries = await listPhrasebookEntries();
        if (!cancelled) {
          setCustomPhrases(entries);
          setLoadFailed(false);
          setErrorMessage(null);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadFailed(true);
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
  }, [retryCount]);

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
                placeholder="Jó reggelt!"
                lang="hu"
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
                placeholder="Good morning!"
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
          <div
            role={loadFailed ? "alert" : "status"}
            className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-muted/40 px-3 py-2 text-sm"
          >
            <p className={loadFailed ? "text-destructive" : "text-muted-foreground"}>
              {errorMessage}
            </p>
            {loadFailed && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsLoading(true);
                  setLoadFailed(false);
                  setErrorMessage(null);
                  setRetryCount((count) => count + 1);
                }}
              >
                Retry
              </Button>
            )}
          </div>
        )}

        <div className="mb-4">
          <label className="sr-only" htmlFor="phrasebook-search">
            Search phrases
          </label>
          <Input
            id="phrasebook-search"
            type="search"
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
            <p className="text-sm tabular-nums text-muted-foreground">
              {customPhrases.length} saved {customPhrases.length === 1 ? "phrase" : "phrases"}
            </p>
            <Button
              type="button"
              variant={isEditing ? "secondary" : "outline"}
              onClick={() => {
                setConfirmDeleteId(null);
                setIsEditing((editing) => !editing);
              }}
            >
              {isEditing ? "Done editing" : "Edit phrases"}
            </Button>
          </div>
        )}

        {visiblePhrases.length === 0 && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-card p-4 text-sm">
            <p className="text-muted-foreground">
              No phrases match “{filter}”.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSearchParams({}, { replace: true })}
            >
              Clear search
            </Button>
          </div>
        )}

        <ul className="space-y-2">
          {visiblePhrases.map(({ phrase, customId }, idx) => {
            const isExact =
              filter.trim().length > 0 && phrase.hungarian === filter.trim();
            const rowClass = cn(
              "flex flex-col justify-between gap-1 rounded-md bg-accent p-4 md:flex-row md:gap-4",
              isExact && "ring-2 ring-ring",
            );

            if (isEditing && customId !== undefined) {
              const isConfirmingDelete = confirmDeleteId === customId;
              return (
                <li key={customId}>
                  <form
                    className={rowClass}
                    onSubmit={(event) => {
                      event.preventDefault();
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
                          setLoadFailed(false);
                          setErrorMessage(
                            error instanceof Error
                              ? error.message
                              : "Could not update the phrase.",
                          );
                        });
                    }}
                  >
                    <div className="grid w-full gap-3 md:grid-cols-[1fr_1fr_auto_auto] md:items-end">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium" htmlFor={`phrase-hungarian-${customId}`}>
                          Magyar
                        </label>
                        <Input
                          id={`phrase-hungarian-${customId}`}
                          name="hungarian"
                          lang="hu"
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
                      {isConfirmingDelete ? (
                        <>
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => {
                              setErrorMessage(null);
                              setConfirmDeleteId(null);
                              void deletePhrasebookEntry(customId)
                                .then(() => {
                                  setCustomPhrases((current) =>
                                    current.filter((entry) => entry.id !== customId),
                                  );
                                })
                                .catch((error: unknown) => {
                                  setLoadFailed(false);
                                  setErrorMessage(
                                    error instanceof Error
                                      ? error.message
                                      : "Could not delete the phrase.",
                                  );
                                });
                            }}
                          >
                            Confirm delete
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setConfirmDeleteId(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button type="submit">Save</Button>
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => setConfirmDeleteId(customId)}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </form>
                </li>
              );
            }

            return (
              <li
                key={`${phrase.hungarian}__${phrase.english}__${idx}`}
                className={rowClass}
              >
                <p lang="hu" className="font-bold">{phrase.hungarian}</p>
                <p>{phrase.english}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};
