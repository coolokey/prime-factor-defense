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

test("second level trial starts directly while keeping the fixed 1 to 100 range and no difficulty buttons", () => {
  const files = readdirSync(new URL(".", import.meta.url));
  const datedGames = files
    .filter((file) => /^prime-factor-defense-\d{8}-\d{6}\.html$/.test(file))
    .sort();
  const latest = datedGames.at(-1);
  const game = readFileSync(new URL(`./${latest}`, import.meta.url), "utf8");

  assert.match(game, /第二關試玩：質數收集陣/);
  assert.match(game, /開始試玩第二關/);
  assert.match(game, /startButton"\)\.addEventListener\("click", startSecondLevelPractice\)/);
  assert.match(game, /Array\.from\(\{ length: 100 \}, \(_, index\) => index \+ 1\)/);
  assert.doesNotMatch(game, /data-level/);
  assert.doesNotMatch(game, /簡單 2-30/);
  assert.doesNotMatch(game, /普通 2-60/);
  assert.doesNotMatch(game, /挑戰 2-100/);
  assert.doesNotMatch(game, /getDifficultyPool/);
  assert.doesNotMatch(game, /state\.level/);
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

  assert.match(game, /getPrimeCollectionHoveredChoice\(cursors, target\.choices\)/);
  assert.match(game, /target\.choices\.find\(\(item\) => item\.index === choiceIndex\)/);
  assert.match(game, /const position = COLLECTION_POSITIONS\[choice\.index\]/);
});

test("second level gesture practice remains available before the trial", () => {
  const files = readdirSync(new URL(".", import.meta.url));
  const datedGames = files
    .filter((file) => /^prime-factor-defense-\d{8}-\d{6}\.html$/.test(file))
    .sort();
  const latest = datedGames.at(-1);
  const game = readFileSync(new URL(`./${latest}`, import.meta.url), "utf8");

  assert.match(game, /secondReviewOverlay/);
  assert.match(game, /startSecondLevelPractice/);
  assert.match(game, /state\.phase = "secondReview"/);
  assert.match(game, /思考時請握拳/);
  assert.match(game, /確認答案後再伸出手指去選擇/);
  assert.match(game, /secondThinkReady/);
  assert.match(game, /secondPointReady/);
  assert.match(game, /第二關試玩前先完成手勢練習/);
  assert.match(game, /開始試玩第二關/);
});

test("second level third collection choice sits at the progress circle center", () => {
  const files = readdirSync(new URL(".", import.meta.url));
  const datedGames = files
    .filter((file) => /^prime-factor-defense-\d{8}-\d{6}\.html$/.test(file))
    .sort();
  const latest = datedGames.at(-1);
  const game = readFileSync(new URL(`./${latest}`, import.meta.url), "utf8");

  assert.match(game, /COLLECTION_CENTER = \{ x: 0\.5, y: 0\.5 \}/);
  assert.match(game, /COLLECTION_POSITIONS = \[\s*\{ x: 0\.27, y: 0\.22 \},\s*\{ x: 0\.73, y: 0\.22 \},\s*COLLECTION_CENTER,/);
  assert.match(game, /const centerY = h \* 0\.5/);
  assert.match(game, /ctx\.fillText\("第二關：質數收集陣", centerX, h \* 0\.08\)/);
});

test("second level correct answers disappear and wrong answers explain composites", () => {
  const files = readdirSync(new URL(".", import.meta.url));
  const datedGames = files
    .filter((file) => /^prime-factor-defense-\d{8}-\d{6}\.html$/.test(file))
    .sort();
  const latest = datedGames.at(-1);
  const game = readFileSync(new URL(`./${latest}`, import.meta.url), "utf8");

  assert.match(game, /removePrimeCollectionChoice\(choiceIndex\)/);
  assert.match(game, /target\.choices = target\.choices\.filter\(\(item\) => item\.index !== choiceIndex\)/);
  assert.match(game, /showCollectionHint\(choiceIndex, "此數為合數", getCompositeReminder\(number\), 2200\)/);
  assert.match(game, /state\.collectionRejectedChoice = choiceIndex/);
  assert.doesNotMatch(game, /else \{[\s\S]{0,260}removePrimeCollectionChoice\(choiceIndex\)/);
  assert.match(game, /function getCompositeReminder\(number\)/);
  assert.match(game, /可以被 \$\{pair\[0\]\} 和 \$\{pair\[1\]\} 整除/);
});

test("second level only allows pointing hands to select numbers", () => {
  const files = readdirSync(new URL(".", import.meta.url));
  const datedGames = files
    .filter((file) => /^prime-factor-defense-\d{8}-\d{6}\.html$/.test(file))
    .sort();
  const latest = datedGames.at(-1);
  const game = readFileSync(new URL(`./${latest}`, import.meta.url), "utf8");

  assert.match(game, /getPrimeCollectionPointingCursors/);
  assert.match(game, /gestures\.leftCursor && !gestures\.leftFist/);
  assert.match(game, /gestures\.rightCursor && !gestures\.rightFist/);
  assert.match(game, /const cursors = getPrimeCollectionPointingCursors\(\)/);
  assert.match(game, /function trackPrimeCollectionHands\(time\) \{[\s\S]*?const cursors = getPrimeCollectionPointingCursors\(\)/);
});

test("second level practice confirm button can be triggered by gesture", () => {
  const files = readdirSync(new URL(".", import.meta.url));
  const datedGames = files
    .filter((file) => /^prime-factor-defense-\d{8}-\d{6}\.html$/.test(file))
    .sort();
  const latest = datedGames.at(-1);
  const game = readFileSync(new URL(`./${latest}`, import.meta.url), "utf8");

  assert.match(game, /已完成手勢練習 開始進行遊戲/);
  assert.match(game, /const SECOND_REVIEW_CONFIRM_HOVER_MS = 450/);
  assert.match(game, /\[gestures\.leftCursor, gestures\.rightCursor\]\.filter\(Boolean\)/);
  assert.match(game, /cursorInExpandedElement\(cursor, secondReviewConfirmButton, 96\)/);
  assert.match(game, /trackSecondReviewConfirmGesture/);
  assert.match(game, /secondReviewConfirmButton\.classList\.toggle\("active", hovering\)/);
});

test("second level number selection is more forgiving and has no inner summon text", () => {
  const files = readdirSync(new URL(".", import.meta.url));
  const datedGames = files
    .filter((file) => /^prime-factor-defense-\d{8}-\d{6}\.html$/.test(file))
    .sort();
  const latest = datedGames.at(-1);
  const game = readFileSync(new URL(`./${latest}`, import.meta.url), "utf8");

  assert.match(game, /const COLLECTION_HOVER_MS = 450/);
  assert.match(game, /const COLLECTION_HIT_RADIUS_PX = 72/);
  assert.match(game, /<= getCollectionHitRadius\(\)/);
  assert.doesNotMatch(game, /停留召喚/);
});

test("second level chooses the nearest collection number with equal hit radii", () => {
  const files = readdirSync(new URL(".", import.meta.url));
  const datedGames = files
    .filter((file) => /^prime-factor-defense-\d{8}-\d{6}\.html$/.test(file))
    .sort();
  const latest = datedGames.at(-1);
  const game = readFileSync(new URL(`./${latest}`, import.meta.url), "utf8");

  assert.doesNotMatch(game, /function getCollectionHitRadius\(index\)/);
  assert.doesNotMatch(game, /COLLECTION_CENTER_HIT_RADIUS/);
  assert.match(game, /const COLLECTION_HIT_RADIUS_PX = 72/);
  assert.match(game, /function getCollectionHitRadius\(\)/);
  assert.match(game, /return COLLECTION_HIT_RADIUS_PX/);
  assert.match(game, /function getCollectionPixelPosition\(index\)/);
  assert.match(game, /function getPrimeCollectionHoveredChoice\(cursors, choices\)/);
  assert.doesNotMatch(game, /const centerChoice = choices\.find/);
  assert.match(game, /hits\.sort\(\(a, b\) => a\.distance - b\.distance\)/);
});

test("second level collection colors are randomized and do not reveal primality", () => {
  const files = readdirSync(new URL(".", import.meta.url));
  const datedGames = files
    .filter((file) => /^prime-factor-defense-\d{8}-\d{6}\.html$/.test(file))
    .sort();
  const latest = datedGames.at(-1);
  const game = readFileSync(new URL(`./${latest}`, import.meta.url), "utf8");

  assert.match(game, /COLLECTION_COLOR_PALETTE/);
  assert.match(game, /const colorPool = shuffle\(COLLECTION_COLOR_PALETTE\)/);
  assert.match(game, /color:\s*colorPool\[index % colorPool\.length\]/);
  assert.match(game, /drawCollectionNumber\(choice\.number, x, y, active, collected, choice\.color, time\)/);
  assert.match(game, /function drawCollectionNumber\(number, x, y, active, collected, color, time\)/);
  assert.doesNotMatch(game, /drawCollectionNumber\(choice\.number, x, y, active, collected, prime, already, time\)/);
  assert.doesNotMatch(game, /const color = collected \|\| already \? AURORA\.gold : prime \? AURORA\.correct : AURORA\.danger/);
});

test("second level composite selections deduct health and directly call out composites", () => {
  const files = readdirSync(new URL(".", import.meta.url));
  const datedGames = files
    .filter((file) => /^prime-factor-defense-\d{8}-\d{6}\.html$/.test(file))
    .sort();
  const latest = datedGames.at(-1);
  const game = readFileSync(new URL(`./${latest}`, import.meta.url), "utf8");

  assert.match(game, /state\.health = Math\.max\(0, state\.health - 1\)/);
  assert.match(game, /state\.collectionRejectedChoice = choiceIndex/);
  assert.match(game, /showCollectionHint\(choiceIndex, "此數為合數", getCompositeReminder\(number\), 2200\)/);
  assert.doesNotMatch(game, /showFeedback\("此數為合數"/);
  assert.match(game, /if \(state\.health <= 0\) endGame\(\)/);
});

test("second level composite hint is drawn below the selected number", () => {
  const files = readdirSync(new URL(".", import.meta.url));
  const datedGames = files
    .filter((file) => /^prime-factor-defense-\d{8}-\d{6}\.html$/.test(file))
    .sort();
  const latest = datedGames.at(-1);
  const game = readFileSync(new URL(`./${latest}`, import.meta.url), "utf8");

  assert.match(game, /collectionHint:\s*null/);
  assert.match(game, /function showCollectionHint\(choiceIndex, title, body, duration\)/);
  assert.match(game, /state\.collectionHint = \{\s*choiceIndex,/);
  assert.match(game, /drawCollectionHint\(choice\.index, x, y\)/);
  assert.match(game, /function drawCollectionHint\(choiceIndex, x, y\)/);
  assert.match(game, /ctx\.translate\(x, y \+ 78\)/);
});

test("third final chapter appears as the next locked ending after prime collection", () => {
  const files = readdirSync(new URL(".", import.meta.url));
  const datedGames = files
    .filter((file) => /^prime-factor-defense-\d{8}-\d{6}\.html$/.test(file))
    .sort();
  const latest = datedGames.at(-1);
  const game = readFileSync(new URL(`./${latest}`, import.meta.url), "utf8");

  assert.match(game, /第三關：質數封印戰/);
  assert.match(game, /完結篇即將開啟/);
  assert.match(game, /前兩段挑戰已完成/);
  assert.match(game, /overlay\.querySelector\("#startButton"\)\.textContent = "重新開始完整挑戰"/);
});
