import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { CreateFlashCard } from "../src/components/CreateFlashCard.tsx";
import { FlashCard } from "../src/components/FlashCard.tsx";

test("flash-card routes render a configuration message without Supabase env", () => {
  const studyMarkup = renderToStaticMarkup(<FlashCard />);
  const createMarkup = renderToStaticMarkup(<CreateFlashCard />);

  assert.match(studyMarkup, /Flash Cards require Supabase configuration/);
  assert.match(createMarkup, /Creating Flash Cards requires Supabase configuration/);
});
