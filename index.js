import { vec3, avec3 } from "pex-math";

/**
 * @typedef {number[]} vec3
 */

/**
 * Compute tangents for a path of 3D points.
 *
 * @param {TypedArray | Array | vec3[]} path Simplicial complex geometry positions (eg. `new Float32Array([x, y, z, x, y, z, ...])/new Array(x, y, z, x, y, z, ...)` or `new Array([x, y, z], [x, y, z], ...)`)
 * @param {boolean} [closed=false] Specify if the path is closed. If so the last tangent will point to the first point. Otherwise it will follow the previous point.
 * @returns {TypedArray | Array | vec3[]}
 */
const pathTangents = (path, closed = false) => {
  const isFlatArray = !path[0]?.length;

  if (isFlatArray) {
    const size = path.length / 3;
    const tangents = new Float32Array(size * 3);

    for (let i = 0; i < size; i++) {
      if (i < size - 1) {
        avec3.set(tangents, i, path, i + 1);
        avec3.sub(tangents, i, path, i);
      } else {
        if (closed) {
          avec3.set(tangents, i, path, 0);
          avec3.sub(tangents, i, path, i);
        } else {
          avec3.set(tangents, i, path, i);
          avec3.sub(tangents, i, path, i - 1);
        }
      }

      avec3.normalize(tangents, i);
    }

    return tangents;
  }

  return path.map((point, i, points) => {
    let tangent;

    if (i < points.length - 1) {
      tangent = vec3.sub(vec3.copy(points[i + 1]), point);
    } else {
      tangent = closed
        ? vec3.sub(vec3.copy(points[0]), point)
        : vec3.sub(vec3.copy(point), points[i - 1]);
    }

    return vec3.normalize(tangent);
  });
};

export default pathTangents;
