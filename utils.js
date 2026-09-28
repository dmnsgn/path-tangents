/** @module utils */

import { avec3 } from "pex-math";

// Deltas x₀→x₁ and x₁→x₂ of the current point.
const DELTAS = new Float64Array(6);

// Parameter spacing between two consecutive points, as in Catmull-Rom splines.
const uniform = () => 1;
const centripetal = (deltas, i) => Math.sqrt(avec3.length(deltas, i));
const chordal = (deltas, i) => avec3.length(deltas, i);

/**
 * Parameter spacing functions of the parabola methods.
 *
 * @type {Record<
 *   "uniform" | "centripetal" | "chordal",
 *   import("./types.js").Spacing
 * >}
 */
const SPACINGS = { uniform, centripetal, chordal };

/**
 * Set `out[i]` to the delta from `points[from]` to `points[to]`.
 *
 * @param {import("pex-math").TypedArray | number[]} out
 * @param {number} i
 * @param {import("pex-math").TypedArray | number[]} points Flat points.
 * @param {number} from
 * @param {number} to
 */
function setDelta(out, i, points, from, to) {
  avec3.set(out, i, points, to);
  avec3.sub(out, i, points, from);
}

/**
 * Set `out[i]` to the derivative at x₁ of the parabola through x₀, x₁, x₂.
 *
 * @param {import("pex-math").TypedArray | number[]} out
 * @param {number} i
 * @param {import("pex-math").TypedArray} deltas Flat deltas x₀→x₁ and x₁→x₂.
 * @param {number} a Spacing of x₀→x₁.
 * @param {number} b Spacing of x₁→x₂.
 */
function parabolaMiddleTangent(out, i, deltas, a, b) {
  avec3.set(out, i, deltas, 0);
  avec3.scale(out, i, b / a);
  avec3.addScaled(out, i, deltas, 1, a / b);
}

/**
 * Set `out[i]` to the derivative at x₀ of the parabola through x₀, x₁, x₂.
 *
 * @param {import("pex-math").TypedArray | number[]} out
 * @param {number} i
 * @param {import("pex-math").TypedArray} deltas Flat deltas x₀→x₁ and x₁→x₂.
 * @param {number} a Spacing of x₀→x₁.
 * @param {number} b Spacing of x₁→x₂.
 */
function parabolaEndTangent(out, i, deltas, a, b) {
  avec3.set(out, i, deltas, 0);
  avec3.scale(out, i, (2 * a + b) / (a * (a + b)));
  avec3.addScaled(out, i, deltas, 1, -a / (b * (a + b)));
}

/**
 * Compute the previous and next distinct point of each point, -1 when there is
 * none.
 *
 * @param {import("pex-math").TypedArray | number[]} points Flat points.
 * @param {number} size Number of points.
 * @param {boolean} closed
 * @returns {import("./types.js").Neighbours}
 */
function computeNeighbours(points, size, closed) {
  const prev = new Int32Array(size).fill(-1);
  const next = new Int32Array(size).fill(-1);

  // Duplicated points reuse the answer of their neighbour.
  for (let i = size - 2; i >= 0; i--) {
    next[i] = avec3.distanceSq(points, i, points, i + 1) ? i + 1 : next[i + 1];
  }
  for (let i = 1; i < size; i++) {
    prev[i] = avec3.distanceSq(points, i, points, i - 1) ? i - 1 : prev[i - 1];
  }

  // Closed paths: the last duplicates continue from the start and vice versa.
  if (closed && size > 1) {
    const wrapNext = avec3.distanceSq(points, size - 1, points, 0)
      ? 0
      : next[0];
    const wrapPrev = avec3.distanceSq(points, 0, points, size - 1)
      ? size - 1
      : prev[size - 1];
    for (let i = size - 1; i >= 0 && next[i] === -1; i--) next[i] = wrapNext;
    for (let i = 0; i < size && prev[i] === -1; i++) prev[i] = wrapPrev;
  }

  return { prev, next };
}

/**
 * Set `out[i]` to the direction of the segment starting at point `i`, or ending
 * there for the last point of open paths.
 *
 * @param {import("pex-math").TypedArray | number[]} out
 * @param {import("pex-math").TypedArray | number[]} points Flat points.
 * @param {import("./types.js").Neighbours} neighbours
 * @param {number} i
 */
function forwardTangent(out, points, { prev, next }, i) {
  if (next[i] !== -1) {
    setDelta(out, i, points, i, next[i]);
  } else if (prev[i] !== -1) {
    setDelta(out, i, points, prev[i], i);
  }
}

/**
 * Set `out[i]` to the derivative at point `i` of the parabola through it and
 * its two neighbours.
 *
 * @param {import("pex-math").TypedArray | number[]} out
 * @param {import("pex-math").TypedArray | number[]} points Flat points.
 * @param {import("./types.js").Neighbours} neighbours
 * @param {number} i
 * @param {import("./types.js").Spacing} spacing
 */
function parabolaTangent(out, points, neighbours, i, spacing) {
  const prev = neighbours.prev[i];
  const next = neighbours.next[i];

  if (prev !== -1 && next !== -1) {
    setDelta(DELTAS, 0, points, prev, i);
    setDelta(DELTAS, 1, points, i, next);
    const a = spacing(DELTAS, 0);
    const b = spacing(DELTAS, 1);
    parabolaMiddleTangent(out, i, DELTAS, a, b);

    // A path folding back on itself has no defined direction at the fold.
    const scale =
      (b / a) * avec3.length(DELTAS, 0) + (a / b) * avec3.length(DELTAS, 1);
    if (avec3.length(out, i) <= Number.EPSILON * scale) {
      avec3.set(out, i, DELTAS, 1);
    }
    return;
  }

  // Open path ends: one-sided parabola when three distinct points exist.
  const isStart = next !== -1;
  const p1 = isStart ? next : prev;
  if (p1 === -1) return;

  const p2 = isStart ? neighbours.next[p1] : neighbours.prev[p1];
  if (p2 === -1) {
    setDelta(out, i, points, isStart ? i : p1, isStart ? p1 : i);
    return;
  }

  setDelta(DELTAS, 0, points, i, p1);
  setDelta(DELTAS, 1, points, p1, p2);
  parabolaEndTangent(out, i, DELTAS, spacing(DELTAS, 0), spacing(DELTAS, 1));
  if (!isStart) avec3.scale(out, i, -1);
}

export {
  SPACINGS,
  setDelta,
  parabolaMiddleTangent,
  parabolaEndTangent,
  computeNeighbours,
  forwardTangent,
  parabolaTangent,
};
