/** @module path-tangents */

import { avec3 } from "pex-math";

import {
  SPACINGS,
  computeNeighbours,
  forwardTangent,
  parabolaTangent,
} from "./utils.js";

/**
 * Compute tangents for a path of 3D points.
 *
 * @param {import("./types.js").Path} path Simplicial complex geometry
 *   positions.
 * @param {import("./types.js").Options} [options={}]
 * @returns {import("./types.js").Tangents}
 * @alias module:path-tangents
 */
const pathTangents = (path, options) => {
  const { closed = false, method = "chordal" } = { ...options };

  const spacing = SPACINGS[method];

  const isFlatArray = !path[0]?.length;
  const size = path.length / (isFlatArray ? 3 : 1);
  const points = isFlatArray ? path : new Float64Array(size * 3);
  if (!isFlatArray) path.forEach((point, i) => avec3.set(points, i, point, 0));

  const neighbours = computeNeighbours(points, size, closed);

  // Double precision: parabola terms can cancel out before normalisation.
  const tangents = new Float64Array(size * 3);

  for (let i = 0; i < size; i++) {
    if (spacing) {
      parabolaTangent(tangents, points, neighbours, i, spacing);
    } else {
      forwardTangent(tangents, points, neighbours, i);
    }
    avec3.normalize(tangents, i);
  }

  if (path instanceof Float64Array) return tangents;

  return isFlatArray
    ? new Float32Array(tangents)
    : Array.from({ length: size }, (_, i) => [
        tangents[i * 3],
        tangents[i * 3 + 1],
        tangents[i * 3 + 2],
      ]);
};

export default pathTangents;

export * from "./utils.js";
export * from "./types.js";
