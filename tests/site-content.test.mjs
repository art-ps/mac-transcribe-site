import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { downloadUrl, releasesUrl, release } from "../src/site-content.mjs";

const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");

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
  const links = app.match(/<a\b[^>]*href=\{downloadUrl\}[^>]*>/g) ?? [];
  assert.equal(links.length, 3);
  for (const link of links) assert.match(link, /data-umami-event="download"/);
  const places = links.map((link) => link.match(/data-umami-event-place="([a-z]+)"/)?.[1]);
  assert.deepEqual(places, ["header", "hero", "final"]);
});

// При первом запуске качается модель финального прохода: Large 947 МБ или Small 483 МБ.
// 626 МБ — Turbo для live, его лендинг уже однажды выдавал за первую загрузку.
test("landing does not claim the 626 MB Turbo as the first download", async () => {
  const { readFile } = await import("node:fs/promises");
  const landing = (await readFile(new URL("../src/App.tsx", import.meta.url), "utf8")) + release.modelLabel;
  assert.doesNotMatch(landing, /626/);
});
