import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { getPostBySlug, type StrapiPost } from "@/lib/strapi";
import { blogMarkdownComponents } from "@/lib/blogMarkdown";
import { PageTitle } from "./PageTitle";

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

function BlogPostLoaded({ slug }: { slug: string }) {
  const [post, setPost] = useState<StrapiPost | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getPostBySlug(slug)
      .then((data) => {
        if (!cancelled) {
          setError(null);
          setPost(data);
          if (data?.title) {
            document.title = `${data.title} · Learn Magyar Language`;
          }
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not load this post. Check your connection and try again.");
          setPost(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [slug, retryCount]);

  if (post === undefined && !error) {
    return (
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <p className="text-center text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex w-full max-w-2xl flex-col items-center gap-6">
        <PageTitle title="Blog" />
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
              setPost(undefined);
              setRetryCount((count) => count + 1);
            }}
          >
            Retry
          </Button>
        </div>
        <Link
          to="/blog"
          className="rounded-sm text-center text-sm text-primary underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
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
        <PageTitle title={post.title} />
        {date && (
          <time
            dateTime={post.publishedAt}
            className="text-center text-sm text-muted-foreground"
          >
            {date}
          </time>
        )}
      </div>
      {post.body ? (
        <div className="w-full border-t border-border pt-6">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            components={blogMarkdownComponents}
          >
            {post.body}
          </ReactMarkdown>
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
