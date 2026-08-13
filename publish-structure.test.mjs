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
  assert.match(index, new RegExp(`url=${latest}`));
  assert.match(index, new RegExp(`href="${latest}"`));
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

  assert.match(game, /assets\/renkai\/SUUKAI_Logo_2(?:_[^"]+)?\.png/);
  assert.match(game, /數界視覺版/);
  assert.match(game, /數界術式/);
  assert.match(game, /SUUKAI_Logo_2_20260813_tight\.png/);
  assert.match(game, /intro-logo[\s\S]*clamp\(260px,\s*42vh,\s*420px\)/);
  assert.match(game, /max-height: calc\(100vh - 48px\)/);
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

test("first level is a prime versus non-prime gate with ten correct answers to pass", () => {
  const files = readdirSync(new URL(".", import.meta.url));
  const datedGames = files
    .filter((file) => /^prime-factor-defense-\d{8}-\d{6}\.html$/.test(file))
    .sort();
  const latest = datedGames.at(-1);
  const game = readFileSync(new URL(`./${latest}`, import.meta.url), "utf8");

  assert.match(game, /質數守門/);
  assert.match(game, /100 以內共有 25 個質數/);
  assert.match(game, /PRIME_GATE_GOAL = 10/);
  assert.match(game, /primeGateCorrect/);
  assert.match(game, /answerPrimeGate\(true\)/);
  assert.match(game, /answerPrimeGate\(false\)/);
  assert.match(game, /isCursorInGateZone/);
  assert.match(game, /leftPrimeZone/);
  assert.match(game, /rightNonPrimeZone/);
  assert.match(game, /GATE_HOVER_MS = 700/);
  assert.match(game, /GATE_CENTER_Y_RATIO = 0\.42/);
  assert.match(game, /GATE_RADIUS_RATIO = 0\.1/);
  assert.match(game, /drawPrimeChoiceZone\(w \* 0\.24, gateY/);
  assert.match(game, /drawPrimeChoiceZone\(w \* 0\.76, gateY/);
  assert.doesNotMatch(game, /gestures\.leftCursor && gestures\.leftCursor\.x < 0\.42/);
  assert.doesNotMatch(game, /gestures\.rightCursor && gestures\.rightCursor\.x > 0\.58/);
  assert.match(game, /聚爆跳過/);
  assert.match(game, /進入下一關：合數破陣/);
});

test("latest game reviews all 25 primes before the first challenge starts", () => {
  const files = readdirSync(new URL(".", import.meta.url));
  const datedGames = files
    .filter((file) => /^prime-factor-defense-\d{8}-\d{6}\.html$/.test(file))
    .sort();
  const latest = datedGames.at(-1);
  const game = readFileSync(new URL(`./${latest}`, import.meta.url), "utf8");

  assert.match(game, /reviewOverlay/);
  assert.match(game, /startPrimeReview/);
  assert.match(game, /confirmPrimeReview/);
  assert.match(game, /REVIEW_CONFIRM_HOVER_MS = 800/);
  assert.match(game, /已複習完畢，開始接受挑戰/);
  assert.match(game, /2、3、5、7、11、13、17、19、23、29、31、37、41、43、47、53、59、61、67、71、73、79、83、89、97/);
  assert.match(game, /state\.phase = "review"/);
  assert.match(game, /trackReviewConfirmGesture/);
});

test("latest game shows remaining lives as red hearts and lost lives as white hearts", () => {
  const files = readdirSync(new URL(".", import.meta.url));
  const datedGames = files
    .filter((file) => /^prime-factor-defense-\d{8}-\d{6}\.html$/.test(file))
    .sort();
  const latest = datedGames.at(-1);
  const game = readFileSync(new URL(`./${latest}`, import.meta.url), "utf8");

  assert.match(game, /\.hearts i\.alive/);
  assert.match(game, /\.hearts i\.lost/);
  assert.match(game, /heart\.classList\.toggle\("alive", index < state\.health\)/);
  assert.match(game, /heart\.classList\.toggle\("lost", index >= state\.health\)/);
  assert.doesNotMatch(game, /heart\.classList\.toggle\("active", index < state\.health\)/);
});
