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
  assert.match(game, /assets\/renkai\/99_鍊\.png/);
  assert.match(game, /audio\/bgm\/00_battle_BGM\.mp3/);
  assert.match(game, /audio\/sfx\/02_magic_circle_open\.wav/);
  assert.match(game, /class="burst-ultimate-effect/);
  assert.match(game, /class="magic-menu choice-count/);
  assert.match(game, /choice-count-5 button:nth-child\(5\)/);
  assert.match(game, /Math\.min\(5, Math\.max\(2, pairs\.length\)\)/);
});
