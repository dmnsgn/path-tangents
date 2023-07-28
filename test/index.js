import test from "node:test";

import computePathTangents from "../index.js";

export function deepAlmostEqual(a, b, epsilon = 0.001) {
  if (a.length != b.length) throw new Error(`${a} deepAlmostEqual ${b}`);
  for (let i = 0; i < a.length; i++) {
    if (!Number.isFinite(a[i]) || !Number.isFinite(b[[i]])) {
      throw new Error(`${a} deepAlmostEqual ${b} not finite`);
    }
    if (Math.abs(a[i] - b[i]) > epsilon) {
      throw new Error(
        `${a} deepAlmostEqual ${b} (diff=${Math.abs(a[i] - b[i])})`
      );
    }
  }
}

test("should return the same values for TypedArray or Array of vec3", (t) => {
  const positions = Array.from({ length: 1_000 }, () =>
    Array.from({ length: 3 }, () => Math.random())
  );
  const a = computePathTangents(new Float32Array(positions.flat()), true);
  const b = computePathTangents(positions, true).flat();

  deepAlmostEqual(a, b);
});
