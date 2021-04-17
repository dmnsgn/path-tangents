import { vec3 } from "gl-matrix";

/**
 * @typedef {number[]} vec3
 */

/**
 * Compute tangents for a path of 3D points.
 *
 * @param {vec3[]} path Array of 3D points [x, y, z].
 * @param {boolean} [isClosed=false] Specify if the path is closed.
 * @returns {vec3[]}
 */
const pathTangents = (path, isClosed = false) =>
  path.map((point, index, points) => {
    let tangent = vec3.create();
    const isNotLastPoint = index < points.length - 1;

    if (isClosed) {
      const nextPoint = isNotLastPoint ? points[index + 1] : points[1];
      vec3.sub(tangent, vec3.clone(nextPoint), point);
    } else {
      if (isNotLastPoint) {
        const nextPoint = points[index + 1];
        vec3.sub(tangent, vec3.clone(nextPoint), point);
      } else {
        const prevPoint = points[index - 1];
        vec3.sub(tangent, vec3.clone(point), prevPoint);
      }
    }

    return vec3.normalize(tangent, tangent);
  });

export default pathTangents;
