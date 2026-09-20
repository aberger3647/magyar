import { PageTitle } from "./PageTitle";
import phrases from "../assets/phrases.json";
import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { textMatchesQuery } from "@/lib/search";
import { cn } from "@/lib/utils";

type CustomPhrase = { hungarian: string; english: string };

export const Phrasebook = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get("q") ?? "";
  const [customPhrases, setCustomPhrases] = useLocalStorage<CustomPhrase[]>(
    "phrasebook.customPhrases",
    [],
  );

  const [hungarian, setHungarian] = React.useState("");
  const [english, setEnglish] = React.useState("");
  const [isEditing, setIsEditing] = React.useState(false);

  const allPhrases = React.useMemo<
    { phrase: CustomPhrase; customIndex?: number }[]
  >(() => {
    const normalizedCustom = customPhrases
      .map((phrase, customIndex) => ({
        phrase: {
          hungarian: phrase.hungarian.trim(),
          english: phrase.english.trim(),
        },
        customIndex,
      }))
      .filter(
        ({ phrase }) =>
          phrase.hungarian.length > 0 && phrase.english.length > 0,
      );

    // Show newest custom phrases first, then the built-in list.
    return [
      ...normalizedCustom.reverse(),
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
          onSubmit={(e) => {
            e.preventDefault();
            if (!canSubmit) return;

            setCustomPhrases([
              ...customPhrases,
              { hungarian: hungarian.trim(), english: english.trim() },
            ]);
            setHungarian("");
            setEnglish("");
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
            <Button type="submit" disabled={!canSubmit}>
              Add phrase
            </Button>
          </div>
        </form>

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

        {customPhrases.length > 0 && (
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

        {visiblePhrases.map(({ phrase, customIndex }, idx) => {
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
                if (customIndex === undefined) return;

                const formData = new FormData(event.currentTarget);
                const nextHungarian = String(formData.get("hungarian") ?? "").trim();
                const nextEnglish = String(formData.get("english") ?? "").trim();
                if (!nextHungarian || !nextEnglish) return;

                setCustomPhrases(
                  customPhrases.map((customPhrase, index) =>
                    index === customIndex
                      ? { hungarian: nextHungarian, english: nextEnglish }
                      : customPhrase,
                  ),
                );
              }}
            >
              {isEditing && customIndex !== undefined ? (
                <div className="grid w-full gap-3 md:grid-cols-[1fr_1fr_auto_auto] md:items-end">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor={`phrase-hungarian-${customIndex}`}>
                      Magyar
                    </label>
                    <Input
                      id={`phrase-hungarian-${customIndex}`}
                      name="hungarian"
                      defaultValue={phrase.hungarian}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor={`phrase-english-${customIndex}`}>
                      English
                    </label>
                    <Input
                      id={`phrase-english-${customIndex}`}
                      name="english"
                      defaultValue={phrase.english}
                    />
                  </div>
                  <Button type="submit">Save</Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() =>
                      setCustomPhrases(
                        customPhrases.filter((_, index) => index !== customIndex),
                      )
                    }
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
