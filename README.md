# path-tangents

[![npm version](https://img.shields.io/npm/v/path-tangents)](https://www.npmjs.com/package/path-tangents)
[![stability-stable](https://img.shields.io/badge/stability-stable-green.svg)](https://www.npmjs.com/package/path-tangents)
[![npm minzipped size](https://img.shields.io/bundlephobia/minzip/path-tangents)](https://bundlephobia.com/package/path-tangents)
[![dependencies](https://img.shields.io/librariesio/release/npm/path-tangents)](https://github.com/dmnsgn/path-tangents/blob/main/package.json)
[![types](https://img.shields.io/npm/types/path-tangents)](https://github.com/microsoft/TypeScript)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-fa6673.svg)](https://conventionalcommits.org)
[![styled with prettier](https://img.shields.io/badge/styled_with-Prettier-f8bc45.svg?logo=prettier)](https://github.com/prettier/prettier)
[![linted with eslint](https://img.shields.io/badge/linted_with-ES_Lint-4B32C3.svg?logo=eslint)](https://github.com/eslint/eslint)
[![license](https://img.shields.io/github/license/dmnsgn/path-tangents)](https://github.com/dmnsgn/path-tangents/blob/main/LICENSE.md)

Compute tangents for a path of 3D points.

[![paypal](https://img.shields.io/badge/donate-paypal-informational?logo=paypal)](https://paypal.me/dmnsgn)
[![coinbase](https://img.shields.io/badge/donate-coinbase-informational?logo=coinbase)](https://commerce.coinbase.com/checkout/56cbdf28-e323-48d8-9c98-7019e72c97f3)
[![twitter](https://img.shields.io/twitter/follow/dmnsgn?style=social)](https://twitter.com/dmnsgn)

[![path-tangents screenshot](https://raw.githubusercontent.com/dmnsgn/path-tangents/main/screenshot.gif)](https://dmnsgn.github.io/path-tangents/)

## Installation

```bash
npm install path-tangents
```

## Usage

```js
import pathTangents from "path-tangents";

// const path = ...

const tangents = pathTangents(path, { closed: true, method: "central" });
```

## API

<!-- api-start -->

## Functions

<dl>
<dt><a href="#pathTangents">pathTangents(path, [options])</a> ⇒ <code><a href="#Vec3Array">Vec3Array</a></code></dt>
<dd><p>Compute tangents for a path of 3D points.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#vec3">vec3</a> : <code>Array.&lt;number&gt;</code></dt>
<dd></dd>
<dt><a href="#Vec3Array">Vec3Array</a> : <code>TypedArray</code> | <code>Array</code> | <code><a href="#vec3">Array.&lt;vec3&gt;</a></code></dt>
<dd><p>List of 3D vectors, flat
  (eg. <code>new Float32Array([x, y, z, x, y, z, ...])/new Array(x, y, z, x, y, z,   ...)</code>) or nested (eg. <code>new Array([x, y, z], [x, y, z], ...)</code>).</p>
</dd>
<dt><a href="#Method">Method</a> : <code>&quot;forward&quot;</code> | <code>&quot;uniform&quot;</code> | <code>&quot;centripetal&quot;</code> | <code>&quot;chordal&quot;</code></dt>
<dd></dd>
<dt><a href="#Options">Options</a> : <code>object</code></dt>
<dd><p>Options for tangents computation. All optional.</p>
</dd>
</dl>

<a name="pathTangents"></a>

## pathTangents(path, [options]) ⇒ [<code>Vec3Array</code>](#Vec3Array)

Compute tangents for a path of 3D points.

**Kind**: global function
**Returns**: [<code>Vec3Array</code>](#Vec3Array) - Unit tangents, in the same layout
as `path`.

| Param     | Type                                 | Default         | Description                            |
| --------- | ------------------------------------ | --------------- | -------------------------------------- |
| path      | [<code>Vec3Array</code>](#Vec3Array) |                 | Simplicial complex geometry positions. |
| [options] | [<code>Options</code>](#Options)     | <code>{}</code> |                                        |

<a name="vec3"></a>

## vec3 : <code>Array.&lt;number&gt;</code>

**Kind**: global typedef
<a name="Vec3Array"></a>

## Vec3Array : <code>TypedArray</code> \| <code>Array</code> \| [<code>Array.&lt;vec3&gt;</code>](#vec3)

List of 3D vectors, flat
(eg. `new Float32Array([x, y, z, x, y, z, ...])/new Array(x, y, z, x, y, z,
  ...)`) or nested (eg. `new Array([x, y, z], [x, y, z], ...)`).

**Kind**: global typedef
<a name="Method"></a>

## Method : <code>&quot;forward&quot;</code> \| <code>&quot;uniform&quot;</code> \| <code>&quot;centripetal&quot;</code> \| <code>&quot;chordal&quot;</code>

**Kind**: global typedef
<a name="Options"></a>

## Options : <code>object</code>

Options for tangents computation. All optional.

**Kind**: global typedef
**Properties**

| Name     | Type                           | Default                          | Description                                                                                          |
| -------- | ------------------------------ | -------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [closed] | <code>boolean</code>           | <code>false</code>               | Specify if the path is closed. If so the last point connects back to the first one.                  |
| [method] | [<code>Method</code>](#Method) | <code>&quot;chordal&quot;</code> | Tangent estimation method: - "forward": direction of the segment starting at each point. - "uniform" | "centripetal" | "chordal": derivative of the parabola through each point and its two neighbours, parametrised like Catmull-Rom splines. "uniform" assumes evenly spaced points, "chordal" follows segment lengths and handles uneven spacing best, "centripetal" sits in between and gives the corner bisector on polylines. |

<!-- api-end -->

## License

MIT. See [license file](https://github.com/dmnsgn/path-tangents/blob/main/LICENSE.md).
