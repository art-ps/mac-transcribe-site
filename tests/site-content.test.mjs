import test from "node:test";
import assert from "node:assert/strict";
import { downloadUrl, releasesUrl, release } from "../src/site-content.mjs";

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
