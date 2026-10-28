import test from "node:test";
import assert from "node:assert/strict";
import { demoDocs, chainCards, demoFileNames } from "../src/demo-content.mjs";

const allBlocks = () => [
  ...Object.values(demoDocs).flatMap((doc) => doc.blocks),
  ...chainCards.flatMap((card) => card.blocks),
];

test("every source block points at a demo transcript with a timecode", () => {
  for (const b of allBlocks().filter((b) => b.kind === "source")) {
    assert.ok(demoFileNames.includes(b.file), b.file);
    assert.match(b.time, /^\d{2}:\d{2}:\d{2}$/);
  }
});

test("demo content never invents money", () => {
  assert.doesNotMatch(JSON.stringify([demoDocs, chainCards]), /₽|руб|\$/u);
});

test("every demo doc has blocks and names its source path", () => {
  for (const [key, doc] of Object.entries(demoDocs)) {
    assert.ok(doc.blocks.length >= 4, key);
    assert.match(doc.path, /^(Встречи|Исследования|Требования)\//u);
  }
  assert.equal(chainCards.length, 4);
});
