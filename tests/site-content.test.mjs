import test from "node:test";
import assert from "node:assert/strict";
import { downloadUrl, release } from "../src/site-content.mjs";

test("release metadata describes the shipped DMG", () => {
  assert.equal(release.fileName, "MacTranscribe.dmg");
  assert.match(release.version, /^build-\d+$/);
  assert.match(release.macOS, /macOS/);
});

test("download URL points at the latest GitHub release asset", () => {
  assert.equal(
    downloadUrl,
    "https://github.com/art-ps/mac-transcribe/releases/latest/download/MacTranscribe.dmg",
  );
});
