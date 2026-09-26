import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { sidebar } from "../docs/sidebar.mjs";

const docsDir = new URL("../docs/", import.meta.url);
// Только верхний уровень docs/: рабочие заметки в docs/superpowers не публикуются.
const pages = readdirSync(docsDir).filter((name) => name.endsWith(".md"));
const links = sidebar.flatMap((group) => group.items.map((item) => item.link));
const linkFor = (page) => (page === "index.md" ? "/" : `/${page.replace(/\.md$/, "")}`);
const pageFor = (link) => (link === "/" ? "index.md" : `${link.slice(1)}.md`);
const read = (page) => readFileSync(new URL(page, docsDir), "utf8");

test("every docs page is in the sidebar", () => {
  for (const page of pages) {
    assert.ok(links.includes(linkFor(page)), `${page} is missing from docs/sidebar.mjs`);
  }
});

test("every sidebar item points at an existing page", () => {
  for (const link of links) {
    assert.ok(existsSync(new URL(pageFor(link), docsDir)), `${link} has no docs/${pageFor(link)}`);
  }
});

// Владелец убрал это с сайта: суммаризация уходит из приложения, нотаризацию не рекламируем,
// а «Opus» без слова «кодек» путают с моделью Claude Opus.
test("docs never mention what the site dropped", () => {
  const configText = readFileSync(new URL(".vitepress/config.mts", docsDir), "utf8");
  const texts = [...pages.map((page) => [page, read(page)]), ["config.mts", configText]];
  for (const [label, text] of texts) {
    assert.doesNotMatch(text, /суммариз|нотариз|claude/iu, label);
    for (const match of text.matchAll(/Opus/g)) {
      const around = text.slice(Math.max(0, match.index - 40), match.index + 44);
      assert.match(around, /кодек/iu, `${label}: "Opus" without "кодек": …${around}…`);
    }
  }
});

// Документация живёт на подпути github.io: ссылка "/" увела бы на art-ps.github.io.
test("links to the landing page use its full URL", () => {
  for (const page of pages) {
    const text = read(page);
    assert.doesNotMatch(text, /\]\(\/mac-transcribe-site\//, `${page}: use https://art-ps.github.io/mac-transcribe-site/`);
  }
});

// file:line из кода приложения нужны в отчёте о задаче, а не читателю страницы.
test("docs never cite app source files", () => {
  for (const page of pages) {
    assert.doesNotMatch(read(page), /Sources\/|\.swift\b/, `${page}: app source citation leaked into the page`);
  }
});

// defer-скрипты выполняются по порядку и задерживают всё после себя (см. коммит d38df8f).
test("analytics in docs does not block rendering", () => {
  const config = readFileSync(new URL(".vitepress/config.mts", docsDir), "utf8");
  const scriptEntry = config.match(/\[\s*"script",\s*\{[^}]*\},?\s*\]/s)?.[0];
  assert.ok(scriptEntry, "analytics <script> head entry not found in config.mts");
  assert.match(scriptEntry, /stats\.pisarev\.me\/script\.js/);
  assert.match(scriptEntry, /\basync\s*:/);
  // Comments strip out first: the comment explaining "not defer" itself contains "defer:".
  const codeOnly = config.replace(/\/\/.*$/gm, "");
  assert.doesNotMatch(codeOnly, /\bdefer\s*:/, "config.mts must not declare a defer key anywhere");
});

test("landing links to the docs from the header and the footer", () => {
  const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
  assert.equal(app.match(/href="\.\/docs\/"/g)?.length, 2);
});
