import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import {
  downloadUrl,
  releasesUrl,
  release,
  kitUrl,
  contactUrl,
  authorUrl,
} from "../src/site-content.mjs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const srcDir = new URL("../src/", import.meta.url);
const tsx = readdirSync(srcDir, { recursive: true })
  .filter((f) => f.endsWith(".tsx"))
  .sort()
  .map((f) => readFileSync(new URL(f, srcDir), "utf8"))
  .join("\n");
const indexHtml = read("index.html");
const sources = tsx + indexHtml;
const docsPages = readdirSync(new URL("../docs/", import.meta.url))
  .filter((f) => f.endsWith(".md"))
  .map((f) => read(`docs/${f}`))
  .join("\n");

test("release metadata describes the shipped DMG", () => {
  assert.equal(release.fileName, "MacTranscribe.dmg");
  assert.match(release.macOS, /macOS/);
});

test("download URL points at the latest public release asset", () => {
  assert.equal(
    downloadUrl,
    "https://github.com/art-ps/mac-transcribe-releases/releases/latest/download/MacTranscribe.dmg",
  );
});

// Код приложения лежит в приватном art-ps/mac-transcribe: посетителю сайта любая
// ссылка туда отдаёт 404. Скачивание и версии живут только в публичном -releases.
test("no link points at the private code repository", () => {
  for (const url of [downloadUrl, releasesUrl]) {
    assert.doesNotMatch(url, /github\.com\/art-ps\/mac-transcribe\//);
  }
});

test("every download link reports a umami event with its place", () => {
  const links = tsx.match(/<a\b[^>]*href=\{downloadUrl\}[^>]*>/g) ?? [];
  assert.equal(links.length, 3);
  for (const link of links) assert.match(link, /data-umami-event="download"/);
  const places = links.map((link) => link.match(/data-umami-event-place="([a-z]+)"/)?.[1]);
  assert.deepEqual(places.sort(), ["final", "header", "hero"]);
});

// При первом запуске качается модель финального прохода: Large 947 МБ или Small 483 МБ.
// 626 МБ — Turbo для live, его лендинг уже однажды выдавал за первую загрузку.
test("release facts match the shipped app", () => {
  assert.equal(release.macOS, "macOS 26.0+, Apple Silicon");
  assert.equal(release.sizeLabel, "40 МБ");
});

test("kit and contact links point at the public releases repo", () => {
  assert.equal(
    kitUrl,
    "https://github.com/art-ps/mac-transcribe-releases/releases/download/starter-kit/mactranscribe-starter-kit.zip",
  );
  assert.equal(contactUrl, "https://github.com/art-ps/mac-transcribe-releases/issues");
  for (const url of [downloadUrl, releasesUrl, kitUrl, contactUrl, authorUrl]) {
    assert.doesNotMatch(url, /github\.com\/art-ps\/(mac-transcribe\/|product-ai)/);
  }
});

test("site copy has no stale or forbidden wording", () => {
  const text = sources + docsPages + release.modelLabel + release.sizeLabel + release.macOS;
  for (const bad of ["нотариз", "xattr", "суммаризац", "В вольт", "26.4", "60 МБ"]) {
    assert.doesNotMatch(text, new RegExp(bad, "iu"), bad);
  }
});

// 626 МБ — Turbo для live, не первая загрузка: на лендинге запрещено, в docs (страница про live) — честный факт.
test("landing does not mention 626", () => {
  const mjs = readdirSync(srcDir).filter((f) => f.endsWith(".mjs")).map((f) => readFileSync(new URL(f, srcDir), "utf8")).join("\n");
  assert.doesNotMatch(tsx + mjs + indexHtml, /626/);
});

test("hero states the outcome and offers the example", () => {
  assert.match(sources, /Ваши встречи — основа для исследований, решений и требований/u);
  const example = sources.match(/<a\b[^>]*href="#example"[^>]*>/g) ?? [];
  assert.ok(example.some((a) => /data-umami-event="example"/.test(a) && /data-umami-event-place="hero"/.test(a)));
});

test("header navigation covers the new sections", () => {
  for (const id of ["#scenarios", "#example", "#kit", "#setup", "#faq"]) assert.match(sources, new RegExp(`href="${id}"`));
});

test("example viewer shows all four demo documents", () => {
  for (const key of ["transcript", "analysis", "synthesis", "requirements"]) assert.match(sources, new RegExp(`demoDocs\\.${key}\\b`));
});

// Task 6 добавит вторую ссылку на набор в финальном блоке (место final).
test("every kit link reports a umami event with its place", () => {
  const links = tsx.match(/<a\b[^>]*href=\{kitUrl\}[^>]*>/g) ?? [];
  assert.equal(links.length, 1);
  for (const link of links) assert.match(link, /data-umami-event="kit"/);
  const places = links.map((link) => link.match(/data-umami-event-place="([a-z]+)"/)?.[1]);
  assert.deepEqual(places.sort(), ["kit"]);
});

test("setup block links to the workflow docs and names the export button", () => {
  assert.match(sources, /href="\.\/docs\/workflow"/);
  assert.match(sources, /кнопкой «В хранилище»/u);
});
