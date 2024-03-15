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

![](https://raw.githubusercontent.com/dmnsgn/path-tangents/main/screenshot.jpg)

## Installation

```bash
npm install path-tangents
```

## Usage

```js
import pathTangents from "path-tangents";

// const path = ...

const closed = true;
const tangents = pathTangents(path, closed);
```

## API

<!-- api-start -->

## Functions

<dl>
<dt><a href="#pathTangents">pathTangents(path, [closed])</a> ⇒ <code>TypedArray</code> | <code>Array</code> | <code><a href="#vec3">Array.&lt;vec3&gt;</a></code></dt>
<dd><p>Compute tangents for a path of 3D points.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#vec3">vec3</a> : <code>Array.&lt;number&gt;</code></dt>
<dd></dd>
</dl>

<a name="pathTangents"></a>

## pathTangents(path, [closed]) ⇒ <code>TypedArray</code> \| <code>Array</code> \| [<code>Array.&lt;vec3&gt;</code>](#vec3)

Compute tangents for a path of 3D points.

**Kind**: global function

| Param    | Type                                                                                      | Default            | Description                                                                                                                                                        |
| -------- | ----------------------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| path     | <code>TypedArray</code> \| <code>Array</code> \| [<code>Array.&lt;vec3&gt;</code>](#vec3) |                    | Simplicial complex geometry positions (eg. `new Float32Array([x, y, z, x, y, z, ...])/new Array(x, y, z, x, y, z, ...)` or `new Array([x, y, z], [x, y, z], ...)`) |
| [closed] | <code>boolean</code>                                                                      | <code>false</code> | Specify if the path is closed. If so the last tangent will point to the first point. Otherwise it will follow the previous point.                                  |

<a name="vec3"></a>

## vec3 : <code>Array.&lt;number&gt;</code>

**Kind**: global typedef

<!-- api-end -->

## License

MIT. See [license file](https://github.com/dmnsgn/path-tangents/blob/main/LICENSE.md).
