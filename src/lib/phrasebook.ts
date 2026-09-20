import { getSupabaseClient } from "@/lib/supabase";
import type { Database } from "@/types/database.types";

const LEGACY_STORAGE_KEY = "phrasebook.customPhrases";

export type PhrasebookEntry =
  Database["public"]["Tables"]["phrasebook_entries"]["Row"];

export async function listPhrasebookEntries(): Promise<PhrasebookEntry[]> {
  const { data, error } = await getSupabaseClient()
    .from("phrasebook_entries")
    .select("*")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createPhrasebookEntry(
  hungarian: string,
  english: string,
): Promise<PhrasebookEntry> {
  const { data, error } = await getSupabaseClient()
    .from("phrasebook_entries")
    .insert({ hungarian, english })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePhrasebookEntry(
  id: number,
  hungarian: string,
  english: string,
): Promise<PhrasebookEntry> {
  const { data, error } = await getSupabaseClient()
    .from("phrasebook_entries")
    .update({ hungarian, english })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePhrasebookEntry(id: number): Promise<void> {
  const { error } = await getSupabaseClient()
    .from("phrasebook_entries")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function migrateLocalPhrasebookEntries(): Promise<void> {
  const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!raw) return;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return;
  }

  if (!Array.isArray(parsed)) return;

  const entries = Array.from(
    new Map(
      parsed
        .filter(
          (item): item is { hungarian: string; english: string } =>
            typeof item === "object" &&
            item !== null &&
            typeof (item as { hungarian?: unknown }).hungarian === "string" &&
            typeof (item as { english?: unknown }).english === "string",
        )
        .map(({ hungarian, english }) => ({
          hungarian: hungarian.trim(),
          english: english.trim(),
        }))
        .filter(({ hungarian, english }) => hungarian && english)
        .map((entry) => [`${entry.hungarian}\u0000${entry.english}`, entry]),
    ).values(),
  );

  if (entries.length > 0) {
    const { error } = await getSupabaseClient()
      .from("phrasebook_entries")
      .upsert(entries, {
        onConflict: "hungarian,english",
        ignoreDuplicates: true,
      });
    if (error) throw error;
  }

  localStorage.removeItem(LEGACY_STORAGE_KEY);
}
