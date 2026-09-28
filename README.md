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

const tangents = pathTangents(path, { closed: true, method: "chordal" });
```

## API

<!-- api-start -->

## Modules

<dl>
<dt><a href="#module_path-tangents">path-tangents</a></dt>
<dd></dd>
<dt><a href="#module_utils">utils</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Path">Path</a> : <code>module:pex-math~TypedArray</code> | <code>Array.&lt;number&gt;</code> | <code>Array.&lt;module:pex-math~Vec3&gt;</code></dt>
<dd><p>3D points, flat (eg. <code>new Float32Array([x, y, z, x, y, z, ...])/new Array(x,   y, z, x, y, z, ...)</code>) or nested (eg. <code>new Array([x, y, z], [x, y, z],   ...)</code>).</p>
</dd>
<dt><a href="#Tangents">Tangents</a> : <code>Float32Array</code> | <code>Float64Array</code> | <code>Array.&lt;module:pex-math~Vec3&gt;</code></dt>
<dd><p>Unit tangents in the layout of the path: a Float64Array for Float64Array
  paths, a Float32Array for other flat paths, nested arrays for nested
  paths.</p>
</dd>
<dt><a href="#Neighbours">Neighbours</a> : <code>object</code></dt>
<dd><p>Previous and next distinct point of each point,
  -1 when there is none.</p>
</dd>
<dt><a href="#Spacing">Spacing</a> ⇒ <code>number</code></dt>
<dd></dd>
<dt><a href="#Method">Method</a> : <code>&quot;forward&quot;</code> | <code>&quot;uniform&quot;</code> | <code>&quot;centripetal&quot;</code> | <code>&quot;chordal&quot;</code></dt>
<dd></dd>
<dt><a href="#Options">Options</a> : <code>object</code></dt>
<dd><p>Options for tangents computation. All optional.</p>
</dd>
</dl>

<a name="module_path-tangents"></a>

## path-tangents

<a name="exp_module_path-tangents--pathTangents"></a>

### pathTangents(path, [options]) ⇒ [<code>Tangents</code>](#Tangents) ⏏

Compute tangents for a path of 3D points.

**Kind**: Exported function

| Param     | Type                             | Default         | Description                            |
| --------- | -------------------------------- | --------------- | -------------------------------------- |
| path      | [<code>Path</code>](#Path)       |                 | Simplicial complex geometry positions. |
| [options] | [<code>Options</code>](#Options) | <code>{}</code> |                                        |

<a name="module_utils"></a>

## utils

- [utils](#module_utils)
  - [.SPACINGS](#module_utils.SPACINGS) : <code>Record.&lt;(&quot;uniform&quot;\|&quot;centripetal&quot;\|&quot;chordal&quot;), Spacing&gt;</code>
  - [.setDelta(out, i, points, from, to)](#module_utils.setDelta)
  - [.parabolaMiddleTangent(out, i, deltas, a, b)](#module_utils.parabolaMiddleTangent)
  - [.parabolaEndTangent(out, i, deltas, a, b)](#module_utils.parabolaEndTangent)
  - [.computeNeighbours(points, size, closed)](#module_utils.computeNeighbours) ⇒ [<code>Neighbours</code>](#Neighbours)
  - [.forwardTangent(out, points, neighbours, i)](#module_utils.forwardTangent)
  - [.parabolaTangent(out, points, neighbours, i, spacing)](#module_utils.parabolaTangent)

<a name="module_utils.SPACINGS"></a>

### utils.SPACINGS : <code>Record.&lt;(&quot;uniform&quot;\|&quot;centripetal&quot;\|&quot;chordal&quot;), Spacing&gt;</code>

Parameter spacing functions of the parabola methods.

**Kind**: static constant of [<code>utils</code>](#module_utils)
<a name="module_utils.setDelta"></a>

### utils.setDelta(out, i, points, from, to)

Set `out[i]` to the delta from `points[from]` to `points[to]`.

**Kind**: static method of [<code>utils</code>](#module_utils)

| Param  | Type                                                                         | Description  |
| ------ | ---------------------------------------------------------------------------- | ------------ |
| out    | <code>module:pex-math~TypedArray</code> \| <code>Array.&lt;number&gt;</code> |              |
| i      | <code>number</code>                                                          |              |
| points | <code>module:pex-math~TypedArray</code> \| <code>Array.&lt;number&gt;</code> | Flat points. |
| from   | <code>number</code>                                                          |              |
| to     | <code>number</code>                                                          |              |

<a name="module_utils.parabolaMiddleTangent"></a>

### utils.parabolaMiddleTangent(out, i, deltas, a, b)

Set `out[i]` to the derivative at x₁ of the parabola through x₀, x₁, x₂.

**Kind**: static method of [<code>utils</code>](#module_utils)

| Param  | Type                                                                         | Description                  |
| ------ | ---------------------------------------------------------------------------- | ---------------------------- |
| out    | <code>module:pex-math~TypedArray</code> \| <code>Array.&lt;number&gt;</code> |                              |
| i      | <code>number</code>                                                          |                              |
| deltas | <code>module:pex-math~TypedArray</code>                                      | Flat deltas x₀→x₁ and x₁→x₂. |
| a      | <code>number</code>                                                          | Spacing of x₀→x₁.            |
| b      | <code>number</code>                                                          | Spacing of x₁→x₂.            |

<a name="module_utils.parabolaEndTangent"></a>

### utils.parabolaEndTangent(out, i, deltas, a, b)

Set `out[i]` to the derivative at x₀ of the parabola through x₀, x₁, x₂.

**Kind**: static method of [<code>utils</code>](#module_utils)

| Param  | Type                                                                         | Description                  |
| ------ | ---------------------------------------------------------------------------- | ---------------------------- |
| out    | <code>module:pex-math~TypedArray</code> \| <code>Array.&lt;number&gt;</code> |                              |
| i      | <code>number</code>                                                          |                              |
| deltas | <code>module:pex-math~TypedArray</code>                                      | Flat deltas x₀→x₁ and x₁→x₂. |
| a      | <code>number</code>                                                          | Spacing of x₀→x₁.            |
| b      | <code>number</code>                                                          | Spacing of x₁→x₂.            |

<a name="module_utils.computeNeighbours"></a>

### utils.computeNeighbours(points, size, closed) ⇒ [<code>Neighbours</code>](#Neighbours)

Compute the previous and next distinct point of each point, -1 when there is
none.

**Kind**: static method of [<code>utils</code>](#module_utils)

| Param  | Type                                                                         | Description       |
| ------ | ---------------------------------------------------------------------------- | ----------------- |
| points | <code>module:pex-math~TypedArray</code> \| <code>Array.&lt;number&gt;</code> | Flat points.      |
| size   | <code>number</code>                                                          | Number of points. |
| closed | <code>boolean</code>                                                         |                   |

<a name="module_utils.forwardTangent"></a>

### utils.forwardTangent(out, points, neighbours, i)

Set `out[i]` to the direction of the segment starting at point `i`, or ending
there for the last point of open paths.

**Kind**: static method of [<code>utils</code>](#module_utils)

| Param      | Type                                                                         | Description  |
| ---------- | ---------------------------------------------------------------------------- | ------------ |
| out        | <code>module:pex-math~TypedArray</code> \| <code>Array.&lt;number&gt;</code> |              |
| points     | <code>module:pex-math~TypedArray</code> \| <code>Array.&lt;number&gt;</code> | Flat points. |
| neighbours | [<code>Neighbours</code>](#Neighbours)                                       |              |
| i          | <code>number</code>                                                          |              |

<a name="module_utils.parabolaTangent"></a>

### utils.parabolaTangent(out, points, neighbours, i, spacing)

Set `out[i]` to the derivative at point `i` of the parabola through it and
its two neighbours.

**Kind**: static method of [<code>utils</code>](#module_utils)

| Param      | Type                                                                         | Description  |
| ---------- | ---------------------------------------------------------------------------- | ------------ |
| out        | <code>module:pex-math~TypedArray</code> \| <code>Array.&lt;number&gt;</code> |              |
| points     | <code>module:pex-math~TypedArray</code> \| <code>Array.&lt;number&gt;</code> | Flat points. |
| neighbours | [<code>Neighbours</code>](#Neighbours)                                       |              |
| i          | <code>number</code>                                                          |              |
| spacing    | [<code>Spacing</code>](#Spacing)                                             |              |

<a name="Path"></a>

## Path : <code>module:pex-math~TypedArray</code> \| <code>Array.&lt;number&gt;</code> \| <code>Array.&lt;module:pex-math~Vec3&gt;</code>

3D points, flat (eg. `new Float32Array([x, y, z, x, y, z, ...])/new Array(x,
  y, z, x, y, z, ...)`) or nested (eg. `new Array([x, y, z], [x, y, z],
  ...)`).

**Kind**: global typedef
<a name="Tangents"></a>

## Tangents : <code>Float32Array</code> \| <code>Float64Array</code> \| <code>Array.&lt;module:pex-math~Vec3&gt;</code>

Unit tangents in the layout of the path: a Float64Array for Float64Array
paths, a Float32Array for other flat paths, nested arrays for nested
paths.

**Kind**: global typedef
<a name="Neighbours"></a>

## Neighbours : <code>object</code>

Previous and next distinct point of each point,
-1 when there is none.

**Kind**: global typedef
**Properties**

| Name | Type                    |
| ---- | ----------------------- |
| prev | <code>Int32Array</code> |
| next | <code>Int32Array</code> |

<a name="Spacing"></a>

## Spacing ⇒ <code>number</code>

**Kind**: global typedef

| Param  | Type                                    | Description                 |
| ------ | --------------------------------------- | --------------------------- |
| deltas | <code>module:pex-math~TypedArray</code> | Flat deltas between points. |
| i      | <code>number</code>                     | Index of the delta.         |

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
