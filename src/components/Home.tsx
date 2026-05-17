import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { listPosts, type StrapiPost } from "@/lib/strapi";

type SectionVariant = "blue" | "orange";

type Section = {
  title: string;
  blurb: string;
  to: string;
  cta: string;
  variant: SectionVariant;
};

const sections: Section[] = [
  {
    title: "Grammar",
    blurb: "Vowel harmony, possessives, accusative, and more.",
    to: "/grammar",
    cta: "Browse Lessons",
    variant: "blue",
  },
  {
    title: "Conjugator",
    blurb: "Drill verb conjugations across tenses and persons.",
    to: "/conjugator",
    cta: "Start Drilling",
    variant: "orange",
  },
  {
    title: "Flash Cards",
    blurb: "Spaced-repetition vocabulary practice.",
    to: "/flash-cards",
    cta: "Study Now",
    variant: "blue",
  },
  {
    title: "Phrasebook",
    blurb: "Useful phrases for everyday situations.",
    to: "/phrasebook",
    cta: "Open Phrasebook",
    variant: "orange",
  },
];

const variantStyles: Record<
  SectionVariant,
  { bg: string; divider: string }
> = {
  blue: { bg: "bg-[#40bdf7]", divider: "border-[#009be3]" },
  orange: { bg: "bg-[#ff6748]", divider: "border-[#bd2000]" },
};

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
    <div className="flex w-full max-w-5xl flex-col">
      <section className="mx-4 mt-4 mb-6 flex flex-col items-center gap-4 text-center">
        <h1 className="ba-h1">Learn Magyar</h1>
        <p className="max-w-2xl text-xl leading-normal md:text-2xl">
          Grammar lessons, conjugation drills, flash cards, and a phrasebook.
          Pick a tool and start.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="ba-h1-section mb-6">Training Tools</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {sections.map((s) => {
            const { bg, divider } = variantStyles[s.variant];
            return (
              <article
                key={s.to}
                className={`${bg} flex flex-col border border-black p-6 text-white md:p-8`}
              >
                <h3 className="ba-h2-card mb-4">{s.title}</h3>
                <hr className={`my-4 border-t ${divider}`} />
                <p className="text-center text-base leading-normal">
                  {s.blurb}
                </p>
                <div className="mt-8 flex justify-center">
                  <Button asChild>
                    <Link to={s.to}>{s.cta}</Link>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mb-12 flex flex-col gap-6">
        <div className="flex items-baseline justify-between border-b border-black pb-3">
          <h2 className="text-2xl font-bold">From the Blog</h2>
          <Link to="/blog" className="text-sm underline underline-offset-4">
            All posts
          </Link>
        </div>
        {recentPosts === null && (
          <p className="text-sm">Loading…</p>
        )}
        {recentPosts && recentPosts.length === 0 && (
          <p className="text-sm">No posts yet.</p>
        )}
        {recentPosts && recentPosts.length > 0 && (
          <ul className="divide-y divide-black">
            {recentPosts.map((post) => {
              const date = formatDate(post.publishedAt);
              return (
                <li key={post.documentId}>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group flex flex-col gap-1 py-4 focus-visible:outline-2 focus-visible:outline-black"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-base group-hover:underline">
                        {post.title}
                      </h3>
                      {date && (
                        <time
                          dateTime={post.publishedAt}
                          className="shrink-0 text-xs"
                        >
                          {date}
                        </time>
                      )}
                    </div>
                    {post.excerpt && (
                      <p className="line-clamp-2 text-sm leading-relaxed">
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
