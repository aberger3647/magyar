import { PageTitle } from "./PageTitle";
import phrases from "../assets/phrases.json";
import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { textMatchesQuery } from "@/lib/search";
import { cn } from "@/lib/utils";

export const Phrasebook = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get("q") ?? "";
  const [customPhrases, setCustomPhrases] = useLocalStorage<
    { hungarian: string; english: string }[]
  >("phrasebook.customPhrases", []);

  const [hungarian, setHungarian] = React.useState("");
  const [english, setEnglish] = React.useState("");

  const allPhrases = React.useMemo(() => {
    const normalizedCustom = customPhrases
      .map((p) => ({
        hungarian: p.hungarian.trim(),
        english: p.english.trim(),
      }))
      .filter((p) => p.hungarian.length > 0 && p.english.length > 0);

    // Show newest custom phrases first, then the built-in list.
    return [...normalizedCustom].reverse().concat(phrases);
  }, [customPhrases]);

  const visiblePhrases = React.useMemo(() => {
    if (filter.trim().length === 0) return allPhrases;
    return allPhrases.filter((phrase) =>
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

        {visiblePhrases.length === 0 && (
          <p className="mb-4 text-sm text-muted-foreground">
            No phrases match “{filter}”.
          </p>
        )}

        {visiblePhrases.map((phrase, idx) => {
          const isExact =
            filter.trim().length > 0 && phrase.hungarian === filter.trim();
          return (
            <div
              key={`${phrase.hungarian}__${phrase.english}__${idx}`}
              className={cn(
                "mb-2 flex flex-col justify-between rounded-md bg-accent p-4 md:flex-row",
                isExact && "ring-2 ring-ring",
              )}
            >
              <p className="font-bold">{phrase.hungarian}</p>
              <p>{phrase.english}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};
