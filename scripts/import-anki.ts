/**
 * Import an Anki .apkg export into the Magyar Supabase backend.
 *
 * Usage:
 *   npx tsx scripts/import-anki.ts <path-to-file.apkg>
 *
 * Reads VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from a .env file in
 * the project root (same vars used by the Vite app).
 *
 * Expected Anki note structure (2-field):
 *   Field 0: <img src="filename.jpg"> — the card image
 *   Field 1: hungarian word(s)         — e.g. "piros, vörös"
 *
 * All imported cards start as fresh FSRS new cards (createEmptyCard()).
 * SM-2 scheduling data is intentionally discarded since it doesn't map
 * cleanly to FSRS parameters.
 */

import "dotenv/config";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import AdmZip from "adm-zip";
import Database from "better-sqlite3";
import { createClient } from "@supabase/supabase-js";
import { createEmptyCard } from "ts-fsrs";

// ---------------------------------------------------------------------------
// Config / Supabase client
// ---------------------------------------------------------------------------

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env file.",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ---------------------------------------------------------------------------
// Helpers (mirrors FlashCard.tsx / CreateFlashCard.tsx logic exactly)
// ---------------------------------------------------------------------------

/** Normalize a word into a storage-safe slug. */
function makeSafeStorageKey(text: string): string {
  const normalized = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || "card";
}

/** Extract the src attribute value from an <img> tag string. */
function parseImgSrc(html: string): string | null {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

/** Derive a file extension from the original filename. */
function extFromFilename(filename: string): string {
  const ext = path.extname(filename).toLowerCase().replace(".", "");
  return ext || "jpg";
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const apkgPath = process.argv[2];
  if (!apkgPath) {
    console.error("Usage: npx tsx scripts/import-anki.ts <path-to-file.apkg>");
    process.exit(1);
  }

  if (!fs.existsSync(apkgPath)) {
    console.error(`File not found: ${apkgPath}`);
    process.exit(1);
  }

  // 1. Extract the .apkg ZIP to a temp directory
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "anki-import-"));
  console.log(`Extracting to ${tmpDir} …`);

  try {
    const zip = new AdmZip(apkgPath);
    zip.extractAllTo(tmpDir, true);

    // 2. Parse the media manifest: { "0": "red-00.jpg", "1": "narancssárga.jpg" }
    const mediaManifestPath = path.join(tmpDir, "media");
    if (!fs.existsSync(mediaManifestPath)) {
      console.error("No 'media' file found in the .apkg — nothing to import.");
      process.exit(1);
    }
    const mediaMap: Record<string, string> = JSON.parse(
      fs.readFileSync(mediaManifestPath, "utf8"),
    );
    // Invert: filename → numeric key in ZIP
    const filenameToKey: Record<string, string> = {};
    for (const [key, filename] of Object.entries(mediaMap)) {
      filenameToKey[filename] = key;
    }

    // 3. Open the SQLite collection (try .anki21 first, fall back to .anki2)
    const dbPath =
      fs.existsSync(path.join(tmpDir, "collection.anki21"))
        ? path.join(tmpDir, "collection.anki21")
        : path.join(tmpDir, "collection.anki2");

    if (!fs.existsSync(dbPath)) {
      console.error("No collection database found in the .apkg.");
      process.exit(1);
    }

    const db = new Database(dbPath, { readonly: true });
    const notes = db
      .prepare("SELECT id, flds FROM notes")
      .all() as { id: number; flds: string }[];
    db.close();

    console.log(`Found ${notes.length} note(s) in the collection.`);

    let imported = 0;
    let skipped = 0;

    // 4. Process each note
    for (const note of notes) {
      // Fields are separated by the ASCII unit-separator character \x1f
      const fields = note.flds.split("\x1f");
      const imgHtml = fields[0] ?? "";
      const rawWord = fields[1] ?? "";

      const word = rawWord.trim();
      const imgSrc = parseImgSrc(imgHtml);

      if (!word) {
        console.warn(`  [skip] Note ${note.id}: no word in field 1.`);
        skipped++;
        continue;
      }
      if (!imgSrc) {
        console.warn(`  [skip] Note ${note.id} ("${word}"): no <img> in field 0.`);
        skipped++;
        continue;
      }

      // Find the corresponding numbered media file
      const mediaKey = filenameToKey[imgSrc];
      if (!mediaKey) {
        console.warn(
          `  [skip] Note ${note.id} ("${word}"): image "${imgSrc}" not found in media manifest.`,
        );
        skipped++;
        continue;
      }

      const mediaFilePath = path.join(tmpDir, mediaKey);
      if (!fs.existsSync(mediaFilePath)) {
        console.warn(
          `  [skip] Note ${note.id} ("${word}"): media file "${mediaKey}" not found on disk.`,
        );
        skipped++;
        continue;
      }

      // 5. Upload image to Supabase Storage
      const ext = extFromFilename(imgSrc);
      const safeWord = makeSafeStorageKey(word);
      const storagePath = `${safeWord}-${crypto.randomUUID()}.${ext}`;

      const fileBuffer = fs.readFileSync(mediaFilePath);
      const mimeType = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";

      const { error: uploadError } = await supabase.storage
        .from("cardimages")
        .upload(storagePath, fileBuffer, { contentType: mimeType });

      if (uploadError) {
        console.error(
          `  [error] Note ${note.id} ("${word}"): upload failed — ${uploadError.message}`,
        );
        skipped++;
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from("cardimages")
        .getPublicUrl(storagePath);
      const imgUrl = publicUrlData.publicUrl;

      // 6. Insert flashcard row with fresh FSRS state
      const emptyCard = createEmptyCard();

      const { error: insertError } = await supabase.from("flashcards").insert({
        word,
        img_url: imgUrl,
        state: emptyCard.state,
        due: emptyCard.due.toISOString(),
        stability: emptyCard.stability,
        difficulty: emptyCard.difficulty,
        elapsed_days: emptyCard.elapsed_days,
        scheduled_days: emptyCard.scheduled_days,
        learning_steps: emptyCard.learning_steps,
        reps: emptyCard.reps,
        lapses: emptyCard.lapses,
        last_review: null,
      });

      if (insertError) {
        console.error(
          `  [error] Note ${note.id} ("${word}"): DB insert failed — ${insertError.message}`,
        );
        // Clean up the uploaded image so we don't leave orphans
        await supabase.storage.from("cardimages").remove([storagePath]);
        skipped++;
        continue;
      }

      console.log(`  [ok] "${word}" → ${storagePath}`);
      imported++;
    }

    console.log(`\nDone. Imported: ${imported}, Skipped: ${skipped}.`);
  } finally {
    // 7. Remove the temp directory
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
