---
id: "x6-core-defs"
title: "X6 defs (gradient / marker / filter definitions)"
description: |
  X6 registers gradients, arrow markers, and SVG filters into the canvas <defs> element
  through graph.defineGradient / graph.defineMarker / graph.defineFilter, and returns reference ids.
  This document is based on the real implementations in src/graph/defs.ts and src/registry/{marker,filter}/*.

library: "x6"
version: "3.x"
category: "core"
subcategory: "defs"
tags:
  - "defs"
  - "defineGradient"
  - "defineMarker"
  - "defineFilter"
  - "linearGradient"
  - "radialGradient"
  - "marker"
  - "arrow"
  - "filter"
  - "dropShadow"
  - "outline"
  - "highlight"
  - "blur"

related:
  - "x6-core-marker"
  - "x6-core-filter"
  - "x6-core-attr-registry"
  - "x6-core-edge"

use_cases:
  - "Set gradient fills for nodes / edges"
  - "Reuse gradient fills for custom arrow markers"
  - "Add shadow / highlight / blur filters to nodes"
  - "Get the id of a <defs> resource in a custom attr"
  - "Dynamically add / remove global SVG resources"

anti_patterns:
  - "Directly operate on graph.svg / graph.defs / document.createElementNS to manually create <defs> child nodes"
  - "Treat a gradient object as a string fill"
  - "Forget tagName in the object passed to defineMarker"
  - "Misspell filter names (for example, dropShadow vs drop-shadow); the 11 built-in X6 names must match exactly"

difficulty: "intermediate"
completeness: "full"
---

## Why defs are needed

The SVG `<defs>` element is used to declare reusable "template resources" (gradients, filters, and markers). These resources are referenced with `url(#id)` in attributes such as `fill / stroke / marker-end / filter`.

X6 wraps all `<defs>` operations in `DefsManager` (`src/graph/defs.ts`) and exposes three Graph methods:

| Method | Return value | Internal behavior |
|------|------|----------|
| `graph.defineGradient(options)` | `string` (id) | Creates `<linearGradient>` / `<radialGradient>` in `<defs>` |
| `graph.defineMarker(options)` | `string` (id) | Creates `<marker>` in `<defs>` |
| `graph.defineFilter(options)` | `string` (id) | Creates `<filter>` in `<defs>` |

All methods are **idempotent**: internally, the id is generated with `StringExt.hashcode(JSON.stringify(options))`, so repeated calls with the same options create the resource only once.

> ⚠️ **Do not** directly read or write internal fields such as `graph.defs` / `graph.svgDoc`; X6 3.x does not expose these public properties, and forced access will throw `Cannot read properties of undefined`.

## `graph.defineGradient`

### Type definition (verified from `src/graph/defs.ts`)

```typescript
interface GradientOptions {
  id?: string
  type: string                              // 'linearGradient' | 'radialGradient'
  stops: { offset: number; color: string; opacity?: number }[]
  attrs?: SimpleAttrs                       // Additional attributes on the <linearGradient> tag itself
}
```

### In most scenarios, you do not need to call it manually -- write a gradient object directly in attrs.fill / attrs.stroke

The built-in X6 `fill` attr registry (see `core/x6-core-attr-registry.md`) automatically calls `defineGradient` when the fill value is an object:

```javascript
attrs: {
  body: {
    fill: {
      type: 'linearGradient',
      stops: [
        { offset: 0,    color: '#1890ff' },
        { offset: 1,    color: '#13c2c2', opacity: 0.6 },
      ],
    },
  },
}
```

> `offset` can be either a number from `0~1` or a string from `'0%' ~ '100%'`; the source code writes it as-is to `stop-offset`.

### When you need to call defineGradient explicitly

When a gradient must be referenced by a **custom marker or custom attr**, you must first get its id and then write it to the marker as `fill: 'url(#xxx)'`:

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  background: { color: '#F2F7FA' },
});

const gradientId = graph.defineGradient({
  type: 'linearGradient',
  stops: [
    { offset: 0, color: '#ff7875' },
    { offset: 1, color: '#ff4d4f' },
  ],
});

graph.addEdge({
  source: { x: 80, y: 80 },
  target: { x: 320, y: 220 },
  attrs: {
    line: {
      stroke: '#ff4d4f',
      strokeWidth: 2,
      targetMarker: {
        // Custom marker: fill it with the gradient id defined above
        tagName: 'path',
        d: 'M 12 -6 0 0 12 6 z',
        fill: `url(#${gradientId})`,
      },
    },
  },
});

graph.centerContent();
```

## `graph.defineMarker`

### Type definition (verified from `src/registry/marker/index.ts`)

```typescript
interface MarkerResult extends SimpleAttrs {
  id?: string
  tagName?: string                              // Defaults to 'path'
  refX?: number
  refY?: number
  markerUnits?: 'userSpaceOnUse' | 'strokeWidth'  // Defaults to 'userSpaceOnUse'
  markerOrient?: 'auto' | 'auto-start-reverse' | number  // Defaults to 'auto'
  children?: { tagName: string; [attr: string]: any }[]
  // Other fields are used as attrs on the path inside the marker (fill / stroke / d / size, etc.)
}
```

### In most scenarios: use built-in names directly in the edge's `targetMarker` / `sourceMarker`

X6 provides 7 built-in marker categories (`src/registry/marker/`):

| name | Shape | Key parameters |
|------|------|----------|
| `'classic'` | Classic triangular arrow (default) | `size`, `width`, `height`, `offset`, `factor` |
| `'block'` | Solid triangular block | `size`, `width`, `height`, `offset`, `open` |
| `'diamond'` | Diamond | `size`, `width`, `height`, `offset` |
| `'cross'` | Cross | `size`, `width`, `height`, `offset` |
| `'circle'` | Dot | `r`, `size`, `offset` |
| `'ellipse'` | Ellipse | `rx`, `ry`, `offset` |
| `'async'` | Asynchronous double arrow | `size`, `width`, `height`, `offset` |
| `'path'` | Custom path | `d`, `offset`, `attrs` |

```javascript
graph.addEdge({
  source: a, target: b,
  attrs: {
    line: {
      stroke: '#333',
      targetMarker: 'classic',                              // String shorthand
      sourceMarker: { name: 'circle', args: { r: 4 } },     // Object + args
    },
  },
});
```

### When defineMarker is needed: fully custom markers (with filter / children / gradient)

```javascript
const arrowId = graph.defineMarker({
  tagName: 'path',
  refX: 6,
  refY: 4,
  markerUnits: 'userSpaceOnUse',
  markerOrient: 'auto',
  d: 'M 0 0 L 8 4 L 0 8 z',
  fill: '#1890ff',
});

graph.addEdge({
  source: a, target: b,
  attrs: {
    line: {
      stroke: '#1890ff',
      'marker-end': `url(#${arrowId})`,    // Reference it directly with the SVG marker-end attribute
    },
  },
});
```

With children (suitable for composite markers, such as circular terminators with borders):

```javascript
graph.defineMarker({
  tagName: 'circle',
  children: [
    { tagName: 'circle', r: 4, fill: '#fff', stroke: '#1890ff', 'stroke-width': 2 },
    { tagName: 'circle', r: 2, fill: '#1890ff' },
  ],
  refX: 5,
  refY: 0,
  markerOrient: 'auto-start-reverse',
});
```

> The source code in `defs.ts:127` shows that if `tagName !== 'path'`, the `d` attribute is automatically deleted to avoid contamination inherited from the standard edge.

## `graph.defineFilter`

### Type definition (verified from `src/registry/filter/index.ts`)

```typescript
type FilterOptions = (FilterNativeItem | FilterManualItem) & {
  id?: string
  attrs?: SimpleAttrs        // Attributes on the <filter> tag itself; default: { x:-1, y:-1, width:3, height:3, filterUnits:'objectBoundingBox' }
}

interface FilterNativeItem {
  name: 'outline' | 'highlight' | 'blur' | 'dropShadow'
      | 'grayScale' | 'sepia' | 'saturate' | 'hueRotate'
      | 'invert'   | 'brightness' | 'contrast'
  args?: { /* Different names correspond to different args; see the table below */ }
}
```

### The 11 built-in X6 filters (verified from `src/registry/filter/main.ts`)

| name | args example | Effect |
|------|-----------|------|
| `'outline'`     | `{ color, width, margin, opacity }` | Outline |
| `'highlight'`   | `{ color, width, blur, opacity }`   | Highlight glow |
| `'blur'`        | `{ x, y }`                           | Blur |
| `'dropShadow'`  | `{ dx, dy, color, blur, opacity }`   | Drop shadow |
| `'grayScale'`   | `{ amount }`                         | Grayscale |
| `'sepia'`       | `{ amount }`                         | Sepia |
| `'saturate'`    | `{ amount }`                         | Saturation |
| `'hueRotate'`   | `{ angle }`                          | Hue rotation |
| `'invert'`      | `{ amount }`                         | Invert colors |
| `'brightness'`  | `{ amount }`                         | Brightness |
| `'contrast'`    | `{ amount }`                         | Contrast |

> Names are case-sensitive: use `dropShadow`, not `drop-shadow`; use `grayScale`, not `grayscale`.

### Use directly through attrs.filter (recommended)

X6 recognizes the `filter` field in `attrs`; when an object is passed, it automatically calls `defineFilter`:

```javascript
graph.addNode({
  shape: 'rect',
  x: 100, y: 100, width: 120, height: 60,
  attrs: {
    body: {
      fill: '#fff',
      stroke: '#8f8f8f',
      filter: {
        name: 'dropShadow',
        args: { dx: 2, dy: 2, blur: 4, color: 'rgba(0,0,0,0.2)' },
      },
    },
  },
});
```

### Call defineFilter explicitly (when sharing in multiple places or defining a custom filter)

```javascript
const shadowId = graph.defineFilter({
  name: 'dropShadow',
  args: { dx: 0, dy: 4, blur: 8, color: '#1890ff', opacity: 0.4 },
});

// Multiple nodes share the same filter reference
['n1', 'n2', 'n3'].forEach((id, i) => {
  graph.addNode({
    id, shape: 'rect',
    x: 60 + i * 160, y: 100, width: 100, height: 50,
    attrs: { body: { fill: '#fff', filter: `url(#${shadowId})` } },
  });
});
```

### Custom filter tags (`FilterManualItem`)

If the 11 built-in entries are not enough, pass a `name` that is not in the native list, and then extend the filter factory function yourself through `Registry` (advanced usage that most business scenarios do not need; see `core/x6-core-filter.md` for details).

## What the three methods have in common

1. **All return values are string ids**, which must be composed into `url(#id)` before use.
2. **Idempotent**: multiple calls with the same options create the DOM only once (based on a `JSON.stringify` hash).
3. **DefsManager.remove(id)** can remove a resource explicitly, but this is usually unnecessary.

## Common errors and fixes

### ❌ Directly operating on the DOM to create defs

```javascript
// Incorrect: graph.defs / graph.svgDoc are not public APIs and will report Cannot read properties of undefined
const defs = graph.defs;
const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
defs.appendChild(grad);

// Correct: use defineGradient
const id = graph.defineGradient({
  type: 'linearGradient',
  stops: [{ offset: 0, color: '#f00' }, { offset: 1, color: '#0f0' }],
});
attrs.body.fill = `url(#${id})`;
```

### ❌ Passing a gradient as a string

```javascript
// Incorrect: a gradient object cannot be parsed by fromJSON as a string
attrs: { body: { fill: 'linear-gradient(#f00, #0f0)' } }   // ❌ This is CSS syntax

// Correct: pass a gradient object
attrs: {
  body: {
    fill: {
      type: 'linearGradient',
      stops: [{ offset: 0, color: '#f00' }, { offset: 1, color: '#0f0' }],
    },
  },
}
```

### ❌ Missing tagName in defineMarker

```javascript
// Incorrect: tagName defaults to 'path', but the d attribute must be provided together with path
graph.defineMarker({ refX: 5, refY: 0 });  // Renders as empty

// Correct: path type
graph.defineMarker({ tagName: 'path', d: 'M0 0 L8 4 L0 8 z', fill: '#333' });

// Or: non-path elements must explicitly specify tagName and avoid d
graph.defineMarker({ tagName: 'circle', r: 4, fill: '#333' });
```

### ❌ Incorrect filter name casing

```javascript
// Incorrect: built-in names must match exactly; a typo throws Filter not found
filter: { name: 'drop-shadow', args: { dx: 2, dy: 2 } }   // ❌
filter: { name: 'grayscale',  args: { amount: 1 } }       // ❌

// Correct
filter: { name: 'dropShadow', args: { dx: 2, dy: 2 } }    // ✅
filter: { name: 'grayScale',  args: { amount: 1 } }       // ✅
```

### ❌ Redefining the same gradient repeatedly

```javascript
// Incorrect: building an id every time is redundant because X6 already deduplicates internally
for (const node of nodes) {
  const id = graph.defineGradient({ type: 'linearGradient', stops: [...] });
  // ...
}

// Correct: call once to get the id
const gradientId = graph.defineGradient({ type: 'linearGradient', stops: [...] });
nodes.forEach((n) => n.attr('body/fill', `url(#${gradientId})`));
```