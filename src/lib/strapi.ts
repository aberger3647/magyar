const STRAPI_URL =
  import.meta.env.VITE_STRAPI_URL ?? "https://strapi.alexberger.dev";

type StrapiListResponse<T> = {
  data: T[];
  meta?: { pagination?: { page: number; pageSize: number; total: number } };
};

export type StrapiPost = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

async function strapiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${STRAPI_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Strapi ${res.status}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

export async function listPosts(): Promise<StrapiPost[]> {
  const json = await strapiFetch<StrapiListResponse<StrapiPost>>(
    "/api/posts?sort=publishedAt:desc&pagination[pageSize]=100",
  );
  return json.data;
}

export async function getPostBySlug(slug: string): Promise<StrapiPost | null> {
  const json = await strapiFetch<StrapiListResponse<StrapiPost>>(
    `/api/posts?filters[slug][$eq]=${encodeURIComponent(slug)}&pagination[pageSize]=1`,
  );
  return json.data[0] ?? null;
}
