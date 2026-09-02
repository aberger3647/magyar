import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { PageTitle } from "./PageTitle";
import { SearchResultsList } from "./SearchResults";
import { Input } from "@/components/ui/input";
import { listPosts } from "@/lib/strapi";
import {
  SEARCH_CATEGORY_LABELS,
  blogDocuments,
  groupSearchResults,
  phraseDocuments,
  readCustomPhrasesFromStorage,
  searchSite,
  type SearchCategory,
  type SearchDocument,
} from "@/lib/search";
import { cn } from "@/lib/utils";

const FILTERS: { value: "all" | SearchCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "page", label: SEARCH_CATEGORY_LABELS.page },
  { value: "grammar", label: SEARCH_CATEGORY_LABELS.grammar },
  { value: "verb", label: SEARCH_CATEGORY_LABELS.verb },
  { value: "phrase", label: SEARCH_CATEGORY_LABELS.phrase },
  { value: "emotion", label: SEARCH_CATEGORY_LABELS.emotion },
  { value: "letter", label: SEARCH_CATEGORY_LABELS.letter },
  { value: "blog", label: SEARCH_CATEGORY_LABELS.blog },
];

function loadCustomPhraseDocuments(): SearchDocument[] {
  return phraseDocuments(readCustomPhrasesFromStorage(), "custom-phrase");
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = React.useState(urlQuery);
  const [category, setCategory] = React.useState<"all" | SearchCategory>("all");
  const [extras, setExtras] = React.useState<SearchDocument[]>(() =>
    loadCustomPhraseDocuments(),
  );
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    listPosts()
      .then((posts) => {
        if (cancelled) return;
        setExtras((current) => {
          const withoutBlog = current.filter((doc) => doc.category !== "blog");
          return [...withoutBlog, ...blogDocuments(posts)];
        });
      })
      .catch(() => {
        /* Blog is optional for search; keep static results. */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    const trimmed = query.trim();
    const handle = window.setTimeout(() => {
      if (trimmed === urlQuery) return;
      if (trimmed.length === 0) {
        setSearchParams({}, { replace: true });
      } else {
        setSearchParams({ q: trimmed }, { replace: true });
      }
    }, 200);
    return () => window.clearTimeout(handle);
  }, [query, urlQuery, setSearchParams]);

  const results = React.useMemo(() => {
    const all = searchSite(query, extras, 80);
    if (category === "all") return all;
    return all.filter((result) => result.category === category);
  }, [query, extras, category]);
  const groups = React.useMemo(() => groupSearchResults(results), [results]);
  const trimmed = query.trim();

  return (
    <div className="flex w-full max-w-2xl flex-col gap-8">
      <PageTitle title="Search" />
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search verbs, phrases, grammar…"
            aria-label="Search"
            autoComplete="off"
            className="h-11 pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter results">
          {FILTERS.map((filter) => {
            const selected = category === filter.value;
            return (
              <button
                key={filter.value}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setCategory(filter.value)}
                className={cn(
                  "rounded-full border px-3 py-1 text-sm transition-colors",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:bg-muted/70",
                )}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>
      {trimmed.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">
          Search the site for verbs, phrases, grammar lessons, emotions, and
          pages.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            {results.length === 1
              ? "1 result"
              : `${results.length} results`}
            {category !== "all" ? ` in ${SEARCH_CATEGORY_LABELS[category]}` : ""}
          </p>
          <SearchResultsList groups={groups} query={trimmed} />
        </div>
      )}
    </div>
  );
}
