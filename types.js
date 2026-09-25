/** @typedef {number[]} vec3 */

/**
 * @typedef {Int8Array
 *   | Uint8Array
 *   | Uint8ClampedArray
 *   | Int16Array
 *   | Uint16Array
 *   | Int32Array
 *   | Uint32Array
 *   | Float32Array
 *   | Float64Array
 *   | number[]
 *   | vec3[]} Path
 *   3D points, flat (eg. `new Float32Array([x, y, z, x, y, z, ...])/new Array(x,
 *   y, z, x, y, z, ...)`) or nested (eg. `new Array([x, y, z], [x, y, z],
 *   ...)`).
 */

/**
 * @typedef {Float32Array | Float64Array | vec3[]} Tangents Unit tangents in the
 *   layout of the path: a Float64Array for Float64Array paths, a Float32Array
 *   for other flat paths, vec3[] for nested paths.
 */

/** @typedef {"forward" | "uniform" | "centripetal" | "chordal"} Method */

/**
 * @typedef {object} Options Options for tangents computation. All optional.
 * @property {boolean} [closed=false] Specify if the path is closed. If so the
 *   last point connects back to the first one.
 * @property {Method} [method="chordal"] Tangent estimation method:
 *
 *   - "forward": direction of the segment starting at each point.
 *   - "uniform" | "centripetal" | "chordal": derivative of the parabola through
 *       each point and its two neighbours, parametrised like Catmull-Rom
 *       splines. "uniform" assumes evenly spaced points, "chordal" follows
 *       segment lengths and handles uneven spacing best, "centripetal" sits in
 *       between and gives the corner bisector on polylines.
 */

export {};
