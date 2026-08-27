import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";

import { blogMarkdownComponents } from "../src/lib/blogMarkdown.tsx";

test("ordered lists preserve numbering when Strapi Markdown separates the items", () => {
  const body = `1. First section

Section details.

2. Second section

More details.

3. Third section`;

  const html = renderToStaticMarkup(
    <ReactMarkdown components={blogMarkdownComponents}>{body}</ReactMarkdown>,
  );

  const renderedStarts = [...html.matchAll(/<ol([^>]*)>/g)].map((match) => {
    const start = match[1]?.match(/start="(\d+)"/)?.[1];
    return start ? Number(start) : 1;
  });

  assert.deepEqual(renderedStarts, [1, 2, 3]);
});
