# path-tangents

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)
[![npm version](https://badge.fury.io/js/path-tangents.svg)](https://www.npmjs.com/package/path-tangents)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Compute tangents for a path of 3D points.

## Installation

```bash
npm install path-tangents
```

[![NPM](https://nodei.co/npm/path-tangents.png)](https://nodei.co/npm/path-tangents/)

## Usage

```js
const computePathTangents = require("path-tangents");

const isClosed = true;
const tangents = computePathTangents(path, isClosed);
```

## API

| Option       | Description                   |       Type       |
| :----------- | :---------------------------- | :--------------: |
| **path**     | Array of 3D points [x, y, z]  | Array<[x, y, z]> |
| **isClosed** | Specify is the path is closed |     boolean?     |

## License

MIT. See [license file](https://github.com/dmnsgn/path-tangents/blob/master/LICENSE.md).
