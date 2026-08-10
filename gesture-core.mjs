// Keep the same 2D hand-distance rule used by the original game.
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

export function isOpenHand(landmarks) {
  if (!Array.isArray(landmarks) || landmarks.length < 21) return false;
  const palm = distance(landmarks[0], landmarks[9]);
  const extendedFingers = [8, 12, 16, 20].filter(
    (tip) => distance(landmarks[tip], landmarks[0]) > distance(landmarks[tip - 2], landmarks[0]) + palm * 0.12,
  ).length;
  const thumbOpen = distance(landmarks[4], landmarks[9]) > palm * 0.7;
  return extendedFingers >= 4 && thumbOpen;
}

export function isFist(landmarks) {
  if (!Array.isArray(landmarks) || landmarks.length < 21) return false;
  const palm = distance(landmarks[0], landmarks[9]);
  return (
    [8, 12, 16, 20].filter(
      (tip) => distance(landmarks[tip], landmarks[0]) < distance(landmarks[tip - 2], landmarks[0]) + palm * 0.08,
    ).length >= 3 && distance(landmarks[8], landmarks[0]) < palm * 1.75
  );
}

function normalize(vector) {
  const length = Math.hypot(vector.x, vector.y, vector.z) || 1;
  return { x: vector.x / length, y: vector.y / length, z: vector.z / length };
}

function palmNormal(landmarks, hand) {
  const wrist = landmarks[0];
  const indexBase = landmarks[5];
  const pinkyBase = landmarks[17];
  const indexVector = {
    x: indexBase.x - wrist.x,
    y: indexBase.y - wrist.y,
    z: indexBase.z - wrist.z,
  };
  const pinkyVector = {
    x: pinkyBase.x - wrist.x,
    y: pinkyBase.y - wrist.y,
    z: pinkyBase.z - wrist.z,
  };
  const mirror = hand === "left" ? -1 : 1;
  return normalize({
    x: (indexVector.y * pinkyVector.z - indexVector.z * pinkyVector.y) * mirror,
    y: (indexVector.z * pinkyVector.x - indexVector.x * pinkyVector.z) * mirror,
    z: (indexVector.x * pinkyVector.y - indexVector.y * pinkyVector.x) * mirror,
  });
}

function palmCenter(landmarks) {
  const points = [0, 5, 9, 13, 17].map((index) => landmarks[index]);
  return {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
    z: points.reduce((sum, point) => sum + point.z, 0) / points.length,
  };
}

export function palmsFacingEachOther(left, right) {
  if (!Array.isArray(left) || !Array.isArray(right) || left.length < 21 || right.length < 21) return false;
  const leftNormal = palmNormal(left, "left");
  const rightNormal = palmNormal(right, "right");
  const dot = leftNormal.x * rightNormal.x + leftNormal.y * rightNormal.y + leftNormal.z * rightNormal.z;
  const leftCenter = palmCenter(left);
  const rightCenter = palmCenter(right);
  const gap = Math.hypot(leftCenter.x - rightCenter.x, leftCenter.y - rightCenter.y);
  return (
    gap > 0.08 &&
    gap < 0.66 &&
    dot < -0.34 &&
    leftNormal.x * rightNormal.x < -0.07 &&
    Math.abs(leftNormal.x) > 0.28 &&
    Math.abs(rightNormal.x) > 0.28 &&
    Math.abs(leftNormal.z) < 0.7 &&
    Math.abs(rightNormal.z) < 0.7
  );
}

export function palmsForward(left, right) {
  if (!Array.isArray(left) || !Array.isArray(right) || left.length < 21 || right.length < 21) return false;
  const leftNormal = palmNormal(left, "left");
  const rightNormal = palmNormal(right, "right");
  return Math.abs(leftNormal.z) > 0.68 && Math.abs(rightNormal.z) > 0.68 && leftNormal.z * rightNormal.z > 0.34;
}
