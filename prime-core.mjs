export const primeNumbersUpTo100 = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67,
  71, 73, 79, 83, 89, 97,
];

export function isPrime(number) {
  if (!Number.isInteger(number) || number < 2) return false;
  for (let divisor = 2; divisor * divisor <= number; divisor += 1) {
    if (number % divisor === 0) return false;
  }
  return true;
}

export function factorize(number) {
  if (!Number.isInteger(number) || number < 2 || number > 100) {
    throw new RangeError("題目數字必須介於 2 到 100。");
  }
  const factors = [];
  let remainder = number;
  for (let divisor = 2; divisor <= remainder; divisor += 1) {
    while (remainder % divisor === 0) {
      factors.push(divisor);
      remainder /= divisor;
    }
  }
  return factors;
}

export function getFactorPairs(number) {
  if (!Number.isInteger(number) || number < 2 || number > 100 || isPrime(number)) {
    return [];
  }
  const pairs = [];
  for (let factor = 2; factor * factor <= number; factor += 1) {
    if (number % factor === 0) pairs.push([factor, number / factor]);
  }
  return pairs;
}

export function applyFactorPair(branches, branchId, pair) {
  const [leftValue, rightValue] = pair;
  return branches.flatMap((branch) => {
    if (branch.id !== branchId) return [branch];
    return [
      { id: `${branch.id}-left`, value: leftValue, side: "left" },
      { id: `${branch.id}-right`, value: rightValue, side: "right" },
    ];
  });
}

export function getQualityRank({
  completed,
  mistakes = 0,
  hintsUsed = 0,
  bestCombo = 0,
} = {}) {
  if (!completed) return { id: "novice", label: "見習級", tone: "retry" };

  if (mistakes === 0 && hintsUsed === 0 && bestCombo >= 5) {
    return { id: "diamond", label: "鑽石級", tone: "perfect" };
  }
  if (mistakes <= 1 && hintsUsed <= 1) {
    return { id: "gold", label: "黃金級", tone: "excellent" };
  }
  if (mistakes <= 3) {
    return { id: "silver", label: "白銀級", tone: "steady" };
  }
  return { id: "bronze", label: "青銅級", tone: "complete" };
}

export function getDifficultyPool(level) {
  const maxByLevel = { easy: 30, normal: 60, challenge: 100 };
  const max = maxByLevel[level] ?? maxByLevel.normal;
  return Array.from({ length: max - 1 }, (_, index) => index + 2);
}

export function makeChoices(correct, count = 4, seed = 0) {
  const choices = primeNumbersUpTo100.filter((number) => number !== correct);
  choices.sort((a, b) => seededRank(seed, a) - seededRank(seed, b));
  const result = choices.slice(0, count - 1);
  const insertAt = seededRank(seed, correct) % count;
  result.splice(insertAt, 0, correct);
  return result;
}

function seededRank(seed, value) {
  let hash = 2166136261;
  const text = `${seed}:${value}`;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
