import { avec3 } from "pex-math";

// Deltas x₀→x₁ and x₁→x₂ of the current point.
const DELTAS = new Float64Array(6);

// Parameter spacing between two consecutive points, as in Catmull-Rom splines.
const uniform = () => 1;
const centripetal = (deltas, i) => Math.sqrt(avec3.length(deltas, i));
const chordal = (deltas, i) => avec3.length(deltas, i);

const SPACINGS = { uniform, centripetal, chordal };

function setDelta(out, i, points, from, to) {
  avec3.set(out, i, points, to);
  avec3.sub(out, i, points, from);
}

// Derivative at x₁ of the parabola through x₀, x₁, x₂ with spacings a, b.
function parabolaMiddleTangent(out, i, deltas, a, b) {
  avec3.set(out, i, deltas, 0);
  avec3.scale(out, i, b / a);
  avec3.addScaled(out, i, deltas, 1, a / b);
}

// Derivative at x₀ of the parabola through x₀, x₁, x₂ with spacings a, b.
function parabolaEndTangent(out, i, deltas, a, b) {
  avec3.set(out, i, deltas, 0);
  avec3.scale(out, i, (2 * a + b) / (a * (a + b)));
  avec3.addScaled(out, i, deltas, 1, -a / (b * (a + b)));
}

// Duplicated points carry no direction: skip to the nearest distinct one.
function findNeighbour(points, size, i, step, closed) {
  for (let k = 1; k < size; k++) {
    let j = i + step * k;
    if (closed) j = (j + size) % size;
    else if (j < 0 || j >= size) return null;
    if (avec3.distance(points, j, points, i) > 0) return j;
  }
  return null;
}

function forwardTangent(out, points, size, i, closed) {
  const next = findNeighbour(points, size, i, 1, closed);
  if (next !== null) {
    setDelta(out, i, points, i, next);
    return;
  }
  const prev = findNeighbour(points, size, i, -1, closed);
  if (prev !== null) setDelta(out, i, points, prev, i);
}

function parabolaTangent(out, points, size, i, closed, spacing) {
  const prev = findNeighbour(points, size, i, -1, closed);
  const next = findNeighbour(points, size, i, 1, closed);

  if (prev !== null && next !== null) {
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
  const isStart = next !== null;
  const p1 = isStart ? next : prev;
  if (p1 === null) return;

  const p2 = findNeighbour(points, size, p1, isStart ? 1 : -1, closed);
  if (p2 === null) {
    setDelta(out, i, points, isStart ? i : p1, isStart ? p1 : i);
    return;
  }

  setDelta(DELTAS, 0, points, i, p1);
  setDelta(DELTAS, 1, points, p1, p2);
  parabolaEndTangent(out, i, DELTAS, spacing(DELTAS, 0), spacing(DELTAS, 1));
  if (!isStart) avec3.scale(out, i, -1);
}

/**
 * Compute tangents for a path of 3D points.
 *
 * @param {import("./types.js").Vec3Array} path Simplicial complex geometry positions.
 * @param {import("./types.js").Options} [options={}]
 * @returns {import("./types.js").Vec3Array} Unit tangents, in the same layout as `path`.
 */
const pathTangents = (path, options) => {
  const { closed = false, method = "chordal" } = { ...options };

  const spacing = SPACINGS[method];

  const isFlatArray = !path[0]?.length;
  const size = path.length / (isFlatArray ? 3 : 1);
  const points = isFlatArray ? path : new Float64Array(size * 3);
  if (!isFlatArray) path.forEach((point, i) => avec3.set(points, i, point, 0));

  // Double precision: parabola terms can cancel out before normalisation.
  const tangents = new Float64Array(size * 3);

  for (let i = 0; i < size; i++) {
    if (spacing) {
      parabolaTangent(tangents, points, size, i, closed, spacing);
    } else {
      forwardTangent(tangents, points, size, i, closed);
    }
    avec3.normalize(tangents, i);
  }

  return isFlatArray
    ? new Float32Array(tangents)
    : Array.from({ length: size }, (_, i) => [
        tangents[i * 3],
        tangents[i * 3 + 1],
        tangents[i * 3 + 2],
      ]);
};

export default pathTangents;

export * from "./types.js";
