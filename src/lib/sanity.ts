import { createClient } from "@sanity/client";

const projectId =
  import.meta.env.VITE_SANITY_PROJECT_ID ?? "a5faczj8";
const dataset = import.meta.env.VITE_SANITY_DATASET ?? "production";
const readToken = import.meta.env.VITE_SANITY_READ_TOKEN;

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: true,
  ...(readToken ? { token: readToken } : {}),
});
