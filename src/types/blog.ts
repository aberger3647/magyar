import type { PortableTextBlock } from "@portabletext/types";

export type BlogPostListItem = {
  _id: string;
  title: string | null;
  slug: string | null;
  publishedAt: string | null;
  excerpt: string | null;
};

export type BlogPostDetail = BlogPostListItem & {
  body: PortableTextBlock[] | null;
};
