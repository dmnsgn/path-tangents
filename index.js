const { vec3 } = require("gl-matrix");

function computePathTangents(path, isClosed = false) {
  return path.map((point, index, points) => {
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
}

module.exports = computePathTangents;
