import { Link } from "react-router-dom";
import {
  BookOpen,
  Heart,
  Layers,
  MessagesSquare,
  Newspaper,
  SpellCheck,
  Type,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  GroupedSearchResults,
  RankedSearchResult,
  SearchCategory,
} from "@/lib/search";

export function searchResultDomId(id: string) {
  return `search-result-${encodeURIComponent(id)}`;
}

const CATEGORY_ICONS: Record<
  SearchCategory,
  typeof BookOpen
> = {
  page: Layers,
  grammar: BookOpen,
  verb: SpellCheck,
  phrase: MessagesSquare,
  emotion: Heart,
  letter: Type,
  blog: Newspaper,
};

type SearchResultsListProps = {
  groups: GroupedSearchResults[];
  query: string;
  activeId?: string | null;
  onSelect?: (result: RankedSearchResult) => void;
  compact?: boolean;
};

export function SearchResultsList({
  groups,
  query,
  activeId,
  onSelect,
  compact = false,
}: SearchResultsListProps) {
  if (groups.length === 0) {
    return (
      <p className="px-1 py-6 text-center text-sm text-muted-foreground">
        No results for “{query}”. Try a verb like lát, a phrase, or a grammar
        topic.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => {
        const Icon = CATEGORY_ICONS[group.category];
        return (
          <section key={group.category} className="flex flex-col gap-2">
            <h2 className="flex items-center gap-2 px-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <Icon className="size-3.5" />
              {group.label}
            </h2>
            <ul className="flex flex-col gap-1">
              {group.items.map((result) => {
                const isActive = result.id === activeId;
                return (
                  <li key={result.id}>
                    <Link
                      to={result.href}
                      id={searchResultDomId(result.id)}
                      role="option"
                      aria-selected={isActive}
                      onClick={(event) => {
                        if (!onSelect) return;
                        event.preventDefault();
                        onSelect(result);
                      }}
                      className={cn(
                        "flex flex-col gap-0.5 rounded-md px-3 py-2 outline-none transition-colors",
                        "hover:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring",
                        isActive && "bg-muted",
                        compact ? "py-2" : "py-2.5",
                      )}
                    >
                      <span className="flex items-baseline justify-between gap-3">
                        <span
                          lang={
                            result.category === "phrase" ||
                            result.category === "verb" ||
                            result.category === "emotion" ||
                            result.category === "letter"
                              ? "hu"
                              : undefined
                          }
                          className="font-medium text-foreground"
                        >
                          {result.title}
                        </span>
                        {!compact && (
                          <Badge variant="outline" className="shrink-0">
                            {group.label}
                          </Badge>
                        )}
                      </span>
                      <span className="line-clamp-2 text-sm text-muted-foreground">
                        {result.subtitle}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
