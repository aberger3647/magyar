import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  SpellCheck,
  Layers,
  MessagesSquare,
} from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listPosts, type StrapiPost } from "@/lib/strapi";

type Section = {
  title: string;
  description: string;
  to: string;
  icon: typeof BookOpen;
};

const sections: Section[] = [
  {
    title: "Grammar",
    description: "Vowel harmony, possessives, accusative, and more.",
    to: "/grammar",
    icon: BookOpen,
  },
  {
    title: "Conjugator",
    description: "Drill verb conjugations across tenses and persons.",
    to: "/conjugator",
    icon: SpellCheck,
  },
  {
    title: "Flash Cards",
    description: "Spaced-repetition vocabulary practice.",
    to: "/flash-cards",
    icon: Layers,
  },
  {
    title: "Phrasebook",
    description: "Useful phrases for everyday situations.",
    to: "/phrasebook",
    icon: MessagesSquare,
  },
];

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
      new Date(iso),
    );
  } catch {
    return null;
  }
}

export const Home = () => {
  const [recentPosts, setRecentPosts] = useState<StrapiPost[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    listPosts()
      .then((data) => {
        if (!cancelled) setRecentPosts(data.slice(0, 3));
      })
      .catch(() => {
        if (!cancelled) setRecentPosts([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex w-full max-w-5xl flex-col gap-12 px-2 py-8 sm:py-12">
      <section className="flex flex-col gap-4">
        <h1 className="scroll-m-20 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          Learn{" "}
          <span lang="hu" className="font-extrabold">
            Magyar
          </span>
          , a little every day.
        </h1>
        <p className="max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
          Grammar lessons, conjugation drills, flash cards, and a phrasebook.
          Pick a tool and start.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sections.map(({ title, description, to, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Card className="h-full transition-colors group-hover:bg-muted/40">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{title}</CardTitle>
                </div>
                <CardDescription className="pt-1">
                  {description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex items-baseline justify-between border-b border-border pb-3">
          <h2 className="text-2xl font-bold tracking-tight">From the blog</h2>
          <Link
            to="/blog"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            All posts →
          </Link>
        </div>
        {recentPosts === null && (
          <p className="text-sm text-muted-foreground">Loading…</p>
        )}
        {recentPosts && recentPosts.length === 0 && (
          <p className="text-sm text-muted-foreground">No posts yet.</p>
        )}
        {recentPosts && recentPosts.length > 0 && (
          <ul className="divide-y divide-border">
            {recentPosts.map((post) => {
              const date = formatDate(post.publishedAt);
              return (
                <li key={post.documentId}>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group flex flex-col gap-1 rounded-md py-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-base font-semibold text-foreground group-hover:text-primary">
                        {post.title}
                      </h3>
                      {date && (
                        <time
                          dateTime={post.publishedAt}
                          className="shrink-0 text-xs text-muted-foreground"
                        >
                          {date}
                        </time>
                      )}
                    </div>
                    {post.excerpt && (
                      <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {post.excerpt}
                      </p>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
};
