import test from "node:test";
import assert from "node:assert/strict";
import {
  factorize,
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
