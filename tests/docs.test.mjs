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
  for (const page of pages) {
    const text = read(page);
    assert.doesNotMatch(text, /суммариз|нотариз|claude/iu, page);
    for (const match of text.matchAll(/Opus/g)) {
      const around = text.slice(Math.max(0, match.index - 40), match.index + 44);
      assert.match(around, /кодек/iu, `${page}: "Opus" without "кодек": …${around}…`);
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

// defer-скрипты выполняются по порядку и задерживают всё после себя (см. коммит d38df8f).
test("analytics in docs does not block rendering", () => {
  const config = readFileSync(new URL(".vitepress/config.mts", docsDir), "utf8");
  assert.match(config, /stats\.pisarev\.me\/script\.js/);
  assert.match(config, /async: ""/);
  assert.doesNotMatch(config, /defer: ""/);
});

test("landing links to the docs from the header and the footer", () => {
  const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
  assert.equal(app.match(/href="\.\/docs\/"/g)?.length, 2);
});
