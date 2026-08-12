import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";

test("publishes the playable game as a dated html file", () => {
  const files = readdirSync(new URL(".", import.meta.url));
  const datedGames = files.filter((file) =>
    /^prime-factor-defense-\d{8}-\d{6}\.html$/.test(file),
  );
  assert.ok(datedGames.length >= 3, "a new dated game file must preserve the previous release");

  const latest = datedGames.sort().at(-1);
  const index = readFileSync(new URL("./index.html", import.meta.url), "utf8");
  const game = readFileSync(new URL(`./${latest}`, import.meta.url), "utf8");

  assert.match(index, new RegExp(latest));
  assert.match(index, /保留版本/);
  assert.match(game, /startCamera/i);
  assert.match(game, /質因數防衛戰/);
  assert.ok(existsSync(new URL("./gesture-core.mjs", import.meta.url)));
});

test("latest game carries the Renkai visual and audio skin", () => {
  const files = readdirSync(new URL(".", import.meta.url));
  const datedGames = files
    .filter((file) => /^prime-factor-defense-\d{8}-\d{6}\.html$/.test(file))
    .sort();
  const latest = datedGames.at(-1);
  const game = readFileSync(new URL(`./${latest}`, import.meta.url), "utf8");

  assert.match(game, /assets\/renkai\/RENKAI_Logo_2\.png/);
  assert.match(game, /assets\/renkai\/99_數\.png/);
  assert.match(game, /audio\/bgm\/00_battle_BGM\.mp3/);
  assert.match(game, /audio\/sfx\/02_magic_circle_open\.wav/);
  assert.match(game, /class="burst-ultimate-effect/);
  assert.match(game, /class="magic-menu choice-count/);
  assert.match(game, /choice-count-5 button:nth-child\(5\)/);
  assert.match(game, /Math\.min\(5, Math\.max\(2, pairs\.length\)\)/);
});

test("gesture answer selection accepts the first zero-indexed choice", () => {
  const files = readdirSync(new URL(".", import.meta.url));
  const datedGames = files
    .filter((file) => /^prime-factor-defense-\d{8}-\d{6}\.html$/.test(file))
    .sort();
  const latest = datedGames.at(-1);
  const game = readFileSync(new URL(`./${latest}`, import.meta.url), "utf8");

  assert.doesNotMatch(game, /if \(!value\)/);
  assert.match(game, /Number\.isNaN\(value\)/);
});

test("burst gesture uses classroom-friendly charge and release timing", () => {
  const files = readdirSync(new URL(".", import.meta.url));
  const datedGames = files
    .filter((file) => /^prime-factor-defense-\d{8}-\d{6}\.html$/.test(file))
    .sort();
  const latest = datedGames.at(-1);
  const game = readFileSync(new URL(`./${latest}`, import.meta.url), "utf8");
  const gestureCore = readFileSync(new URL("./gesture-core.mjs", import.meta.url), "utf8");

  assert.match(game, /burstReleaseGraceUntil/);
  assert.match(game, /\/ 1200/);
  assert.match(game, /\+ 900/);
  assert.doesNotMatch(game, /\/ 2000/);
  assert.doesNotMatch(game, /> 260/);
  assert.match(gestureCore, /Math\.abs\(leftNormal\.z\) > 0\.45/);
});

test("gesture layer renders glowing skeletons, fingertips, trails, and burst charge aura", () => {
  const files = readdirSync(new URL(".", import.meta.url));
  const datedGames = files
    .filter((file) => /^prime-factor-defense-\d{8}-\d{6}\.html$/.test(file))
    .sort();
  const latest = datedGames.at(-1);
  const game = readFileSync(new URL(`./${latest}`, import.meta.url), "utf8");

  assert.match(game, /leftTrail:\s*\[\]/);
  assert.match(game, /rightTrail:\s*\[\]/);
  assert.match(game, /function drawPalmGlow/);
  assert.match(game, /function drawFingerLights/);
  assert.match(game, /function recordGestureTrail/);
  assert.match(game, /function drawGestureTrailParticles/);
  assert.match(game, /function drawBurstChargeAura/);
  assert.match(game, /globalCompositeOperation = "lighter"/);
});
