import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SearchResultsList, searchResultDomId } from "@/components/SearchResults";
import { listPosts } from "@/lib/strapi";
import {
  blogDocuments,
  groupSearchResults,
  phraseDocuments,
  readCustomPhrasesFromStorage,
  searchSite,
  type RankedSearchResult,
  type SearchDocument,
} from "@/lib/search";
import { cn } from "@/lib/utils";

type SearchContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const SearchContext = React.createContext<SearchContextValue | null>(null);

let blogDocsCache: SearchDocument[] | null = null;

function loadCustomPhraseDocuments(): SearchDocument[] {
  return phraseDocuments(readCustomPhrasesFromStorage(), "custom-phrase");
}

async function loadBlogDocuments(): Promise<SearchDocument[]> {
  if (blogDocsCache) return blogDocsCache;
  try {
    const posts = await listPosts();
    blogDocsCache = blogDocuments(posts);
    return blogDocsCache;
  } catch {
    blogDocsCache = [];
    return blogDocsCache;
  }
}

export function useSiteSearch() {
  const context = React.useContext(SearchContext);
  if (!context) {
    throw new Error("useSiteSearch must be used within SearchProvider");
  }
  return context;
}

function useIsApple() {
  const [isApple, setIsApple] = React.useState(false);
  React.useEffect(() => {
    setIsApple(/Mac|iPhone|iPad/.test(navigator.platform));
  }, []);
  return isApple;
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((isOpen) => !isOpen);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const value = React.useMemo(() => ({ open, setOpen }), [open]);

  return (
    <SearchContext.Provider value={value}>
      {children}
      <SearchDialog />
    </SearchContext.Provider>
  );
}

function SearchDialog() {
  const { open, setOpen } = useSiteSearch();
  const navigate = useNavigate();
  const [query, setQuery] = React.useState("");
  const [extras, setExtras] = React.useState<SearchDocument[]>([]);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIndex(0);
    setExtras(loadCustomPhraseDocuments());
    let cancelled = false;
    loadBlogDocuments().then((docs) => {
      if (!cancelled && docs.length > 0) {
        setExtras((current) => {
          const withoutBlog = current.filter((doc) => doc.category !== "blog");
          return [...withoutBlog, ...docs];
        });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const results = React.useMemo(
    () => searchSite(query, extras, 16),
    [query, extras],
  );
  const groups = React.useMemo(() => groupSearchResults(results), [results]);

  React.useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const go = React.useCallback(
    (href: string) => {
      setOpen(false);
      navigate(href);
    },
    [navigate, setOpen],
  );

  const selectResult = React.useCallback(
    (result: RankedSearchResult) => {
      go(result.href);
    },
    [go],
  );

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (results.length === 0) return;
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (results.length === 0) return;
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const active = results[activeIndex];
      if (active) {
        selectResult(active);
      } else if (query.trim().length > 0) {
        go(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const activeId = results[activeIndex]?.id ?? null;

  React.useEffect(() => {
    if (!activeId) return;
    document
      .getElementById(searchResultDomId(activeId))
      ?.scrollIntoView({ block: "nearest" });
  }, [activeId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="top-[12%] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl"
        onKeyDown={onKeyDown}
      >
        <DialogTitle className="sr-only">Search the site</DialogTitle>
        <DialogDescription className="sr-only">
          Search verbs, phrases, grammar lessons, and pages. Use arrow keys to
          move and Enter to open a result.
        </DialogDescription>
        <div className="flex items-center gap-2 border-b px-3">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search verbs, phrases, grammar…"
            aria-label="Search"
            aria-autocomplete="list"
            aria-controls="site-search-results"
            aria-activedescendant={
              activeId ? searchResultDomId(activeId) : undefined
            }
            autoComplete="off"
            className="h-12 border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
        </div>
        <div
          id="site-search-results"
          role="listbox"
          aria-label="Search results"
          className="max-h-[min(24rem,60vh)] overflow-y-auto p-3"
        >
          {query.trim().length === 0 ? (
            <p className="px-1 py-6 text-center text-sm text-muted-foreground">
              Try “lát”, “vowel harmony”, or “repeat”.
            </p>
          ) : (
            <SearchResultsList
              groups={groups}
              query={query.trim()}
              activeId={activeId}
              onSelect={selectResult}
              compact
            />
          )}
        </div>
        {query.trim().length > 0 && (
          <button
            type="button"
            className="w-full border-t px-4 py-2.5 text-left text-sm text-muted-foreground hover:bg-muted/50"
            onClick={() => go(`/search?q=${encodeURIComponent(query.trim())}`)}
          >
            View all results for “{query.trim()}”
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function SearchTrigger({
  className,
  size = "nav",
}: {
  className?: string;
  size?: "nav" | "hero";
}) {
  const { setOpen } = useSiteSearch();
  const isApple = useIsApple();
  const shortcut = isApple ? "⌘K" : "Ctrl K";

  if (size === "hero") {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "flex h-12 w-full max-w-xl items-center gap-3 rounded-xl border bg-background px-4 text-left text-base text-muted-foreground shadow-xs transition-colors hover:bg-muted/40",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
          className,
        )}
      >
        <Search className="size-5 shrink-0" />
        <span className="flex-1">Search verbs, phrases, grammar…</span>
        <kbd className="hidden h-6 select-none items-center rounded-md border bg-muted px-2 font-mono text-[11px] font-medium sm:inline-flex">
          {shortcut}
        </kbd>
      </button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => setOpen(true)}
      aria-label={`Search (${shortcut})`}
      className={cn(
        "h-9 w-9 p-0 md:h-9 md:w-auto md:px-3 md:font-normal",
        className,
      )}
    >
      <Search className="size-4" />
      <span className="hidden text-muted-foreground md:inline">Search…</span>
      <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium md:inline-flex">
        {shortcut}
      </kbd>
    </Button>
  );
}
