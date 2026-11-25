import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { listPosts, type StrapiPost } from "@/lib/strapi";
import { PageTitle } from "./PageTitle";

function formatDate(iso: string | null) {
  if (!iso) return null;
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
    }).format(new Date(iso));
  } catch {
    return null;
  }
}

export const Blog = () => {
  const [posts, setPosts] = useState<StrapiPost[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    listPosts()
      .then((data) => {
        if (!cancelled) {
          setError(null);
          setPosts(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not load posts. Check your connection and try again.");
          setPosts([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-8">
      <PageTitle title="Blog" />
      {error && (
        <div
          role="alert"
          className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-6 text-center"
        >
          <p className="text-sm text-destructive">{error}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setError(null);
              setPosts(null);
              setRetryCount((count) => count + 1);
            }}
          >
            Retry
          </Button>
        </div>
      )}
      {posts === null && !error && (
        <p className="text-center text-muted-foreground">Loading…</p>
      )}
      {posts && posts.length === 0 && !error && (
        <p className="text-center text-muted-foreground">
          No posts yet.
        </p>
      )}
      {posts && posts.length > 0 && (
        <ul className="flex w-full flex-col gap-6 border-t border-border pt-6">
          {posts.map((post) => {
            const date = formatDate(post.publishedAt);
            return (
              <li key={post.documentId} className="flex flex-col gap-1">
                <Link
                  to={`/blog/${post.slug}`}
                  className="w-fit rounded-sm text-lg font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  {post.title}
                </Link>
                {date && (
                  <time
                    dateTime={post.publishedAt}
                    className="text-sm text-muted-foreground"
                  >
                    {date}
                  </time>
                )}
                {post.excerpt && (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
