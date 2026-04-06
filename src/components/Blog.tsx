import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { sanityClient } from "@/lib/sanity";
import type { BlogPostListItem } from "@/types/blog";
import { PageTitle } from "./PageTitle";

const POSTS_QUERY = `*[_type == "post" && defined(slug.current)] | order(coalesce(publishedAt, _updatedAt) desc) {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt
}`;

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
  const [posts, setPosts] = useState<BlogPostListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    sanityClient
      .fetch<BlogPostListItem[]>(POSTS_QUERY)
      .then((data) => {
        if (!cancelled) {
          setError(null);
          setPosts(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            "Could not load posts. Check Sanity CORS (add this site’s URL) and that posts are published.",
          );
          setPosts([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-8">
      <PageTitle title="Blog" />
      {error && (
        <p className="text-center text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {posts === null && !error && (
        <p className="text-center text-muted-foreground">Loading…</p>
      )}
      {posts && posts.length === 0 && !error && (
        <p className="text-center text-muted-foreground">
          No posts yet. Add and publish one in Sanity Studio.
        </p>
      )}
      {posts && posts.length > 0 && (
        <ul className="flex w-full flex-col gap-6 border-t border-border pt-6">
          {posts.map((post) => {
            const slug = post.slug;
            const date = formatDate(post.publishedAt);
            return (
              <li key={post._id} className="flex flex-col gap-1">
                {slug ? (
                  <Link
                    to={`/blog/${slug}`}
                    className="text-lg font-semibold text-foreground hover:text-primary"
                  >
                    {post.title ?? "Untitled"}
                  </Link>
                ) : (
                  <span className="text-lg font-semibold">
                    {post.title ?? "Untitled"}
                  </span>
                )}
                {date && (
                  <time
                    dateTime={post.publishedAt ?? undefined}
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
