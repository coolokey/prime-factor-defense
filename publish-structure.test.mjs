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
  assert.match(game, /進入第二關：質數收集陣/);
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

test("latest game lets students verify prime and non-prime gesture zones during review", () => {
  const files = readdirSync(new URL(".", import.meta.url));
  const datedGames = files
    .filter((file) => /^prime-factor-defense-\d{8}-\d{6}\.html$/.test(file))
    .sort();
  const latest = datedGames.at(-1);
  const game = readFileSync(new URL(`./${latest}`, import.meta.url), "utf8");

  assert.match(game, /#handOverlay \{ z-index: 80/);
  assert.match(game, /reviewPractice/);
  assert.match(game, /reviewPrimeZone/);
  assert.match(game, /reviewNonPrimeZone/);
  assert.match(game, /reviewPrimeReady/);
  assert.match(game, /reviewNonPrimeReady/);
  assert.match(game, /trackReviewPracticeGestures/);
  assert.match(game, /updateReviewConfirmState/);
  assert.match(game, /reviewConfirmButton\.disabled = !\(state\.reviewPrimeReady && state\.reviewNonPrimeReady\)/);
  assert.match(game, /質數感應/);
  assert.match(game, /非質數感應/);
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
  assert.match(game, /heart\.textContent = index < state\.health \? "♥" : "♡"/);
  assert.match(game, /heart\.style\.color = index < state\.health \? "var\(--danger\)" : "#f8feff"/);
  assert.match(game, /heart\.classList\.toggle\("alive", index < state\.health\)/);
  assert.match(game, /heart\.classList\.toggle\("lost", index >= state\.health\)/);
  assert.doesNotMatch(game, /heart\.classList\.toggle\("active", index < state\.health\)/);
});

test("latest review screen keeps the prime list compact instead of full-bleed", () => {
  const files = readdirSync(new URL(".", import.meta.url));
  const datedGames = files
    .filter((file) => /^prime-factor-defense-\d{8}-\d{6}\.html$/.test(file))
    .sort();
  const latest = datedGames.at(-1);
  const game = readFileSync(new URL(`./${latest}`, import.meta.url), "utf8");

  assert.match(game, /prime-review-card \{ width: min\(760px, 100%\)/);
  assert.match(game, /prime-list[\s\S]*?max-width: 720px/);
  assert.match(game, /prime-chip[\s\S]*?min-height: 32px/);
  assert.match(game, /review-zone[\s\S]*?min-height: 82px/);
});

test("second level collects all 25 primes from five-number rounds", () => {
  const files = readdirSync(new URL(".", import.meta.url));
  const datedGames = files
    .filter((file) => /^prime-factor-defense-\d{8}-\d{6}\.html$/.test(file))
    .sort();
  const latest = datedGames.at(-1);
  const game = readFileSync(new URL(`./${latest}`, import.meta.url), "utf8");

  assert.match(game, /第二關：質數收集陣/);
  assert.match(game, /PRIME_COLLECTION_GOAL = primeNumbersUpTo100\.length/);
  assert.match(game, /COLLECTION_ROUND_SIZE = 5/);
  assert.match(game, /collectedPrimes:\s*new Set\(\)/);
  assert.match(game, /spawnPrimeCollectionRound/);
  assert.match(game, /answerPrimeCollection/);
  assert.match(game, /completePrimeCollection/);
  assert.match(game, /已召喚 \$\{state\.collectedPrimes\.size\}\/\$\{PRIME_COLLECTION_GOAL\}/);
});

test("second level keeps duplicate primes safe and lets burst clear composites", () => {
  const files = readdirSync(new URL(".", import.meta.url));
  const datedGames = files
    .filter((file) => /^prime-factor-defense-\d{8}-\d{6}\.html$/.test(file))
    .sort();
  const latest = datedGames.at(-1);
  const game = readFileSync(new URL(`./${latest}`, import.meta.url), "utf8");

  assert.match(game, /已召喚過/);
  assert.match(game, /state\.collectedPrimes\.has\(number\)/);
  assert.match(game, /clearPrimeCollectionComposites/);
  assert.match(game, /filter\(\(choice\) => isPrime\(choice\.number\)\)/);
  assert.match(game, /聚爆清除本輪非質數/);
  assert.doesNotMatch(game, /state\.health -= 1;[\s\S]{0,160}已召喚過/);
});

test("second level keeps gesture hit targets stable after burst filtering", () => {
  const files = readdirSync(new URL(".", import.meta.url));
  const datedGames = files
    .filter((file) => /^prime-factor-defense-\d{8}-\d{6}\.html$/.test(file))
    .sort();
  const latest = datedGames.at(-1);
  const game = readFileSync(new URL(`./${latest}`, import.meta.url), "utf8");

  assert.match(game, /isCursorInCollectionChoice\(cursor, item\.index\)/);
  assert.match(game, /target\.choices\.find\(\(item\) => item\.index === choiceIndex\)/);
  assert.match(game, /const position = COLLECTION_POSITIONS\[choice\.index\]/);
});
