import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { isFist, isOpenHand } from "./gesture-core.mjs";

function makeHand(open) {
  const hand = Array.from({ length: 21 }, () => ({ x: 0, y: 0, z: 0 }));
  hand[0] = { x: 0, y: 0, z: 0 };
  hand[4] = { x: open ? 0.65 : 0.12, y: 0.1, z: 0 };
  hand[5] = { x: -0.25, y: 0.45, z: 0 };
  hand[9] = { x: 0, y: 0.5, z: 0 };
  hand[13] = { x: 0.25, y: 0.45, z: 0 };
  hand[17] = { x: 0.5, y: 0.35, z: 0 };
  for (const tip of [8, 12, 16, 20]) {
    hand[tip - 2] = { x: hand[tip - 3]?.x ?? 0, y: open ? 0.62 : 0.58, z: 0 };
    hand[tip] = { x: hand[tip - 2].x, y: open ? 1.1 : 0.22, z: 0 };
  }
  return hand;
}

test("detects open hand and fist gestures", () => {
  assert.equal(isOpenHand(makeHand(true)), true);
  assert.equal(isFist(makeHand(true)), false);
  assert.equal(isFist(makeHand(false)), true);
  assert.equal(isOpenHand(makeHand(false)), false);
});

test("site contains camera gesture mode", () => {
  const latest = readdirSync(new URL(".", import.meta.url))
    .filter((file) => /^prime-factor-defense-\d{8}-\d{6}\.html$/.test(file))
    .sort()
    .at(-1);
  assert.ok(latest);
  const html = readFileSync(new URL(`./${latest}`, import.meta.url), "utf8");
  assert.match(html, /startCamera/i);
  assert.match(html, /HandLandmarker|MediaPipe/i);
  assert.match(html, /體感|鏡頭/);
});
