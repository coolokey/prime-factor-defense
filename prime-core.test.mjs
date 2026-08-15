import test from "node:test";
import assert from "node:assert/strict";
import {
  applyFactorPair,
  factorize,
  getQualityRank,
  getFactorPairs,
  getDifficultyPool,
  isPrime,
  makeChoices,
  primeNumbersUpTo100,
} from "./prime-core.mjs";

test("keeps all generated numbers within 100", () => {
  for (const level of ["easy", "normal", "challenge"]) {
    const pool = getDifficultyPool(level);
    assert.ok(pool.length > 0);
    assert.ok(pool.every((number) => number >= 2 && number <= 100));
  }
});

test("identifies prime numbers up to 100", () => {
  assert.deepEqual(primeNumbersUpTo100, [
    2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67,
    71, 73, 79, 83, 89, 97,
  ]);
  assert.equal(isPrime(1), false);
  assert.equal(isPrime(97), true);
  assert.equal(isPrime(91), false);
});

test("factorizes composite numbers into prime factors", () => {
  assert.deepEqual(factorize(36), [2, 2, 3, 3]);
  assert.deepEqual(factorize(84), [2, 2, 3, 7]);
  assert.deepEqual(factorize(91), [7, 13]);
  assert.deepEqual(factorize(100), [2, 2, 5, 5]);
});

test("builds answer choices that include the correct factor and stay prime", () => {
  const choices = makeChoices(13, 4, 91);
  assert.equal(choices.length, 4);
  assert.ok(choices.includes(13));
  assert.equal(new Set(choices).size, 4);
  assert.ok(choices.every(isPrime));
});

test("grades completion quality without making time the main penalty", () => {
  assert.deepEqual(
    getQualityRank({ completed: true, mistakes: 0, hintsUsed: 0, bestCombo: 8, elapsedSeconds: 120 }),
    { id: "diamond", label: "鑽石級", tone: "perfect" },
  );
  assert.deepEqual(
    getQualityRank({ completed: true, mistakes: 1, hintsUsed: 0, bestCombo: 5, elapsedSeconds: 180 }),
    { id: "gold", label: "黃金級", tone: "excellent" },
  );
  assert.deepEqual(
    getQualityRank({ completed: true, mistakes: 3, hintsUsed: 1, bestCombo: 2, elapsedSeconds: 90 }),
    { id: "silver", label: "白銀級", tone: "steady" },
  );
  assert.deepEqual(
    getQualityRank({ completed: true, mistakes: 5, hintsUsed: 2, bestCombo: 1, elapsedSeconds: 45 }),
    { id: "bronze", label: "青銅級", tone: "complete" },
  );
  assert.deepEqual(
    getQualityRank({ completed: false, mistakes: 0, hintsUsed: 0, bestCombo: 0, elapsedSeconds: 20 }),
    { id: "novice", label: "見習級", tone: "retry" },
  );
});

test("offers non-trivial factor pairs for a defensive factor tree", () => {
  assert.deepEqual(getFactorPairs(12), [[2, 6], [3, 4]]);
  assert.deepEqual(getFactorPairs(13), []);
  assert.deepEqual(getFactorPairs(72), [[2, 36], [3, 24], [4, 18], [6, 12], [8, 9]]);
});

test("replaces one composite branch with two continuing branches", () => {
  const branches = [{ id: "root", value: 12, side: "center" }];
  const next = applyFactorPair(branches, "root", [3, 4]);

  assert.deepEqual(next, [
    { id: "root-left", value: 3, side: "left" },
    { id: "root-right", value: 4, side: "right" },
  ]);
  assert.ok(next.some((branch) => isPrime(branch.value)));
  assert.ok(next.some((branch) => !isPrime(branch.value)));
});
