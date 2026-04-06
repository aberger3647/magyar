import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PortableText } from "@portabletext/react";
import { sanityClient } from "@/lib/sanity";
import { blogPortableTextComponents } from "@/lib/blogPortableText";
import type { BlogPostDetail } from "@/types/blog";
import { PageTitle } from "./PageTitle";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  body
}`;

function formatDate(iso: string | null) {
  if (!iso) return null;
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "long",
    }).format(new Date(iso));
  } catch {
    return null;
  }
}

type BlogPostLoadedProps = { slug: string };

function BlogPostLoaded({ slug }: BlogPostLoadedProps) {
  const [post, setPost] = useState<BlogPostDetail | null | undefined>(
    undefined,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    sanityClient
      .fetch<BlogPostDetail | null>(POST_QUERY, { slug })
      .then((data) => {
        if (!cancelled) {
          setError(null);
          setPost(data ?? null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            "Could not load this post. Check CORS and that the post is published.",
          );
          setPost(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (post === undefined && !error) {
    return (
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <p className="text-center text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <PageTitle title="Blog" />
        <p className="text-center text-sm text-destructive" role="alert">
          {error}
        </p>
        <Link
          to="/blog"
          className="text-center text-sm text-primary underline underline-offset-4"
        >
          Back to blog
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <PageTitle title="Not found" />
        <p className="text-center text-muted-foreground">
          This post does not exist or is not published yet.
        </p>
        <Link
          to="/blog"
          className="text-center text-sm text-primary underline underline-offset-4"
        >
          Back to blog
        </Link>
      </div>
    );
  }

  const date = formatDate(post.publishedAt);

  return (
    <article className="flex w-full max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <PageTitle title={post.title ?? "Untitled"} />
        {date && (
          <time
            dateTime={post.publishedAt ?? undefined}
            className="text-center text-sm text-muted-foreground"
          >
            {date}
          </time>
        )}
      </div>
      {post.body && post.body.length > 0 ? (
        <div className="w-full border-t border-border pt-6">
          <PortableText
            value={post.body}
            components={blogPortableTextComponents}
          />
        </div>
      ) : (
        <p className="text-muted-foreground">No content yet.</p>
      )}
      <Link
        to="/blog"
        className="text-sm text-primary underline underline-offset-4"
      >
        ← All posts
      </Link>
    </article>
  );
}

export const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return (
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <PageTitle title="Not found" />
        <p className="text-center text-muted-foreground">Missing post link.</p>
        <Link
          to="/blog"
          className="text-center text-sm text-primary underline underline-offset-4"
        >
          Back to blog
        </Link>
      </div>
    );
  }

  return <BlogPostLoaded key={slug} slug={slug} />;
};
