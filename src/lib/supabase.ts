import type { Database } from "@/types/database.types";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL?.trim();
const supabaseKey = (
  import.meta.env?.VITE_SUPABASE_ANON_KEY ??
  import.meta.env?.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
)?.trim();

type SupabaseConfiguration =
  | { kind: "configured"; client: SupabaseClient<Database> }
  | { kind: "missing" };

const configuration: SupabaseConfiguration =
  supabaseUrl && supabaseKey
    ? {
        kind: "configured",
        client: createClient<Database>(supabaseUrl, supabaseKey),
      }
    : { kind: "missing" };

export const isSupabaseConfigured = () => configuration.kind === "configured";

export const getSupabaseClient = (): SupabaseClient<Database> => {
  if (configuration.kind === "missing") {
    throw new Error(
      "Flash Cards require VITE_SUPABASE_URL and a Supabase anon or publishable key.",
    );
  }

  return configuration.client;
};
