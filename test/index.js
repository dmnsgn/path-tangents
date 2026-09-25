import test from "node:test";
import assert from "node:assert/strict";

import computePathTangents from "../index.js";

const METHODS = ["forward", "uniform", "centripetal", "chordal"];
const PARABOLA_METHODS = ["uniform", "centripetal", "chordal"];

export const deepAlmostEqual = (a, b, epsilon = 1e-6) => {
  assert.equal(a.length, b.length, `${a} != ${b}`);
  for (let i = 0; i < a.length; i++) {
    assert.ok(
      Number.isFinite(a[i]) && Math.abs(a[i] - b[i]) <= epsilon,
      `[${i}] ${a[i]} != ${b[i]} (±${epsilon})`,
    );
  }
};

const normalize = (v) => {
  const l = Math.hypot(...v);
  return v.map((x) => x / l);
};
const angle = (a, b) =>
  Math.acos(Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));

const assertUnit = (tangents) =>
  tangents.forEach((t) => {
    assert.ok(t.every(Number.isFinite), `${t} not finite`);
    assert.ok(Math.abs(Math.hypot(...t) - 1) < 1e-6, `${t} not unit`);
  });

// Seeded so failures are reproducible
const createRandom =
  (seed = 1) =>
  () =>
    (seed = (seed * 16807) % 2147483647) / 2147483647;

test("should return the same values for TypedArray or Array of vec3", () => {
  const random = createRandom();
  const positions = Array.from({ length: 1_000 }, () =>
    Array.from({ length: 3 }, () => random()),
  );
  for (const method of METHODS) {
    for (const closed of [false, true]) {
      const a = computePathTangents(new Float32Array(positions.flat()), {
        closed,
        method,
      });
      const b = computePathTangents(positions, { closed, method }).flat();

      // Float32 input rounding shows on nearly aligned random points
      deepAlmostEqual(a, b, 1e-3);
    }
  }
});

test("should default to chordal", () => {
  const positions = [
    [0, 0, 0],
    [1, 0.2, 0],
    [1.2, 1, 0.1],
    [3, 1.5, 0],
  ];
  assert.deepEqual(
    computePathTangents(positions),
    computePathTangents(positions, { method: "chordal" }),
  );
});

test("forward: should follow segments and close on the first point", () => {
  const positions = [
    [0, 0, 0],
    [1, 0, 0],
    [1, 1, 0],
  ];
  const open = computePathTangents(positions, { method: "forward" });
  deepAlmostEqual(open.flat(), [1, 0, 0, 0, 1, 0, 0, 1, 0]);

  const closed = computePathTangents(positions, {
    method: "forward",
    closed: true,
  });
  deepAlmostEqual(closed[2], normalize([-1, -1, 0]));
});

test("parabola methods: should be exact on a closed evenly sampled circle", () => {
  const count = 16;
  const positions = Array.from({ length: count }, (_, i) => {
    const a = (Math.PI * 2 * i) / count;
    return [Math.cos(a), 0, Math.sin(a)];
  });
  for (const method of PARABOLA_METHODS) {
    const tangents = computePathTangents(positions, { closed: true, method });
    positions.forEach(([x, , z], i) =>
      deepAlmostEqual(tangents[i], [-z, 0, x], 1e-6),
    );
  }
});

test("uniform: should be exact on a parabola sampled evenly in its parameter, ends included", () => {
  const positions = Array.from({ length: 6 }, (_, u) => [u, u * u, 0]);
  const tangents = computePathTangents(positions, { method: "uniform" });
  positions.forEach(([u], i) =>
    deepAlmostEqual(tangents[i], normalize([1, 2 * u, 0]), 1e-6),
  );
});

test("chordal: should be the most accurate on unevenly sampled curves", () => {
  const random = createRandom(3);
  const count = 40;
  const us = Array.from({ length: count }, (_, i) =>
    i === 0 || i === count - 1
      ? i / (count - 1)
      : (i + (random() - 0.5) * 0.8) / (count - 1),
  );
  // Helix with 4 turns
  const t = (u) => Math.PI * 8 * u;
  const positions = us.map((u) => [Math.cos(t(u)), 0.1 * t(u), Math.sin(t(u))]);
  const exact = us.map((u) =>
    normalize([-Math.sin(t(u)), 0.1, Math.cos(t(u))]),
  );

  const maxError = (method) =>
    Math.max(
      ...computePathTangents(positions, { method }).map((tangent, i) =>
        angle(tangent, exact[i]),
      ),
    );
  const errors = Object.fromEntries(METHODS.map((m) => [m, maxError(m)]));

  assert.ok(errors.chordal < errors.centripetal, JSON.stringify(errors));
  assert.ok(errors.centripetal < errors.uniform, JSON.stringify(errors));
  assert.ok(errors.chordal < errors.forward, JSON.stringify(errors));
});

test("centripetal: should give the bisector at a polyline corner", () => {
  const positions = [
    [-3, 0, 0],
    [0, 0, 0],
    [0, 1, 0],
  ];
  const tangents = computePathTangents(positions, { method: "centripetal" });
  deepAlmostEqual(tangents[1], normalize([1, 1, 0]), 1e-6);
});

test("should ignore duplicated points", () => {
  const positions = [
    [0, 0, 0],
    [1, 0.5, 0],
    [2, 0.8, 0.2],
    [3, 0.5, 0.1],
  ];
  const indices = [0, 0, 1, 2, 2, 2, 3, 3];
  const duplicated = indices.map((j) => positions[j]);
  for (const method of METHODS) {
    for (const closed of [false, true]) {
      const expected = computePathTangents(positions, { method, closed });
      const tangents = computePathTangents(duplicated, { method, closed });
      assertUnit(tangents);
      // Forward tangents of the last duplicates of an open path look backward
      indices.forEach((j, i) => {
        if (method === "forward" && !closed && i >= 6) j = 2;
        deepAlmostEqual(tangents[i], expected[j], 1e-6);
      });
    }
  }
});

test("should handle a path folding back on itself", () => {
  const positions = [
    [0, 0, 0],
    [1, 0, 0],
    [0, 0, 0],
  ];
  for (const method of METHODS) {
    for (const closed of [false, true]) {
      assertUnit(computePathTangents(positions, { method, closed }));
    }
  }
});

test("should handle degenerate sizes", () => {
  for (const method of METHODS) {
    for (const closed of [false, true]) {
      const options = { method, closed };
      assert.equal(computePathTangents([], options).length, 0);
      assert.equal(computePathTangents(new Float32Array(), options).length, 0);
      deepAlmostEqual(computePathTangents([[1, 2, 3]], options)[0], [0, 0, 0]);
      deepAlmostEqual(
        computePathTangents(
          [
            [1, 1, 1],
            [1, 1, 1],
          ],
          options,
        ).flat(),
        [0, 0, 0, 0, 0, 0],
      );

      const two = computePathTangents(
        [
          [0, 0, 0],
          [0, 2, 0],
        ],
        options,
      );
      assertUnit(two);
      deepAlmostEqual(two[0], [0, 1, 0]);
    }
  }
});

test("should handle straight lines with uneven spacing", () => {
  const positions = [0, 0.1, 0.15, 2, 2.01, 5].map((x) => [x, x, 0]);
  for (const method of METHODS) {
    computePathTangents(positions, { method }).forEach((t) =>
      deepAlmostEqual(t, normalize([1, 1, 0]), 1e-6),
    );
  }
});

test("should handle long runs of duplicated points in linear time", () => {
  const size = 100_000;
  const positions = new Float32Array(size * 3);
  positions.set([1, 0, 0], (size - 1) * 3);

  const start = performance.now();
  const tangents = computePathTangents(positions);
  assert.ok(performance.now() - start < 500, "too slow");
  deepAlmostEqual(tangents.subarray(0, 3), [1, 0, 0]);
});

test("should keep double precision for Float64Array paths", () => {
  const positions = new Float64Array([0, 0, 0, 1, 1e-9, 0, 2, 0, 0]);
  const tangents = computePathTangents(positions);
  assert.ok(tangents instanceof Float64Array);
  assert.ok(computePathTangents([...positions]) instanceof Float32Array);
});

test("should ignore a closed path last point duplicating the first", () => {
  const count = 12;
  const circle = Array.from({ length: count }, (_, i) => {
    const a = (Math.PI * 2 * i) / count;
    return [Math.cos(a), Math.sin(a), 0];
  });
  for (const method of METHODS) {
    const expected = computePathTangents(circle, { method, closed: true });
    const tangents = computePathTangents([...circle, circle[0]], {
      method,
      closed: true,
    });
    [...expected, expected[0]].forEach((t, i) =>
      deepAlmostEqual(tangents[i], t),
    );
  }
});
