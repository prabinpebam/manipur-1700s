---
id: "x6-core-shapes"
title: "Complete Reference for X6 Built-in Shapes"
description: |
  X6 3.x includes 10 built-in shapes: rect / circle / ellipse / polygon / polyline / path /
  image / text-block / html / edge. Based on the actual source in src/shape/*.ts, this document
  systematically lists each shape's default markup, default attrs, dedicated fields, size/content positioning rules, and typical usage.

library: "x6"
version: "3.x"
category: "core"
subcategory: "shapes"
tags:
  - "shape"
  - "rect"
  - "circle"
  - "ellipse"
  - "polygon"
  - "polyline"
  - "path"
  - "image"
  - "text-block"
  - "html"
  - "edge"
  - "built-in nodes"
  - "addNode"

related:
  - "x6-core-markup"
  - "x6-core-node"
  - "x6-core-edge"
  - "x6-intermediate-custom-node"

use_cases:
  - "Choose an appropriate built-in shape for each business scenario"
  - "Confirm each shape's default attrs and required fields"
  - "Write the points field for polygon / polyline nodes"
  - "Use the path field for path nodes (shortcut for the SVG d attribute)"
  - "Use the imageUrl / imageWidth / imageHeight shortcut fields for image nodes"
  - "Use the text field for text-block nodes (multiline text)"

anti_patterns:
  - "Forgetting to set points on a polygon node or using the wrong format (should be 'x1,y1 x2,y2 ...')"
  - "Forgetting to set path (refD) on a path node, causing only an empty body to render"
  - "Setting image node properties on attrs.body instead of attrs.image"
  - "Using non-existent shapes such as Shape.Cylinder / Shape.Diamond / Shape.Group"

difficulty: "beginner"
completeness: "full"
---

## Overview of X6 3.x Built-in Shapes

> Verified against `src/shape/index.ts`: 10 shapes are exported. The `Shape` namespace contains **only** these 10 shapes; it does not include `Cylinder / Diamond / Group / Hexagon`.

| Class Name | shape String | tagName (body) | Suitable Scenarios |
|------------|--------------|----------------|--------------------|
| `Rect`      | `'rect'`       | `<rect>`          | General rectangular nodes and flow steps (most common) |
| `Circle`    | `'circle'`     | `<circle>`        | State nodes and start/end endpoints |
| `Ellipse`   | `'ellipse'`    | `<ellipse>`       | Ellipse nodes and emphasis |
| `Polygon`   | `'polygon'`    | `<polygon>`       | Polygons (diamond, hexagon, pentagram, etc.) |
| `Polyline`  | `'polyline'`   | `<polyline>`      | Polylines (open paths, not closed) |
| `Path`      | `'path'`       | `<path>`          | Arbitrary SVG paths (icons, freeform shapes) |
| `Image`     | `'image'`      | `<image>`         | Image nodes (icons) |
| `TextBlock` | `'text-block'` | `<rect>` + foreignObject | Multiline text blocks (HTML layout) |
| `HTML`      | (requires registration) | `foreignObject` | Rich HTML nodes |
| `Edge`      | `'edge'`       | two `<path>` elements | Default edge type |

### Naming Differences That Commonly Cause Mistakes

- The shape string **`text-block`** uses a hyphen, not camelCase.
- `Shape.HTML` is a **class**, but you must first call `Shape.HTML.register({ shape: 'xxx', ... })` to register a named shape before calling `addNode({ shape: 'xxx' })`; HTML cannot be used directly with `addNode({ shape: 'html' })`.
- `Edge` has the default edge shape string `'edge'`. Almost all `graph.addEdge({...})` calls inherit it by default, so you do not need to declare it explicitly.

## Common Default attrs (Verified Against `src/shape/base.ts`)

All node shapes generated with `createShape` (except `path` / `text-block`) share the following:

```javascript
// BaseBodyAttr
attrs.body = { fill: '#ffffff', stroke: '#333333', strokeWidth: 2 }

// BaseLabelAttr (written to attrs.text; the selector name is 'text')
attrs.text = {
  fontSize: 14, fill: '#000000',
  refX: 0.5, refY: 0.5,
  textAnchor: 'middle', textVerticalAnchor: 'middle',
  fontFamily: 'Arial, helvetica, sans-serif',
}
```

The top-level `label` field is automatically written by `propHooks` to `attrs/text/text`. In other words:

```javascript
graph.addNode({ shape: 'rect', label: 'Hello' });
// Equivalent to
graph.addNode({ shape: 'rect', attrs: { text: { text: 'Hello' } } });
```

> Note: **The text selector for built-in shapes is `text` in attrs, not `label`**. In `util.ts:getMarkup`, the selector is written as `'label'`, but `Base.config` registers the attrs key as `text`. Both can match, but **using `attrs.text` is recommended** (consistent with the base class).

## 1. Rect (Rectangle, Most Common)

**Source (`src/shape/rect.ts`)**:

```javascript
attrs: { body: { refWidth: '100%', refHeight: '100%' } }
```

`refWidth: '100%'` / `refHeight: '100%'` makes `<rect>` automatically fill the node's `width / height`. Set rounded corners with `rx / ry`.

```javascript
graph.addNode({
  shape: 'rect',
  x: 100, y: 60, width: 120, height: 40,
  label: 'Rectangle',
  attrs: {
    body: { stroke: '#8f8f8f', strokeWidth: 1, fill: '#fff', rx: 6, ry: 6 },
  },
});
```

## 2. Circle

**Source (`src/shape/circle.ts`)**:

```javascript
attrs: { body: { refCx: '50%', refCy: '50%', refR: '50%' } }
```

With `refR: '50%'`, the radius is automatically `min(width, height) / 2`. **To get a true circle, `width` and `height` must be equal**.

```javascript
graph.addNode({
  shape: 'circle',
  x: 60, y: 100, width: 60, height: 60,   // Width and height must be equal
  label: 'Start',
  attrs: { body: { fill: '#f6ffed', stroke: '#52c41a', strokeWidth: 2 } },
});
```

## 3. Ellipse

**Source (`src/shape/ellipse.ts`)**:

```javascript
attrs: { body: { refCx: '50%', refCy: '50%', refRx: '50%', refRy: '50%' } }
```

`width / height` do not need to be equal; half of each value is automatically used as rx / ry.

```javascript
graph.addNode({
  shape: 'ellipse',
  x: 200, y: 80, width: 120, height: 60,
  label: 'Process',
  attrs: { body: { fill: '#e6f7ff', stroke: '#1890ff', strokeWidth: 2 } },
});
```

## 4. Polygon (Including Diamonds / Hexagons)

**Source (`src/shape/poly.ts`)**: the `points` field is written by `propHooks` to `attrs/body/refPoints`.

> `refPoints` is an X6 custom attr: input uses **percentage** coordinates and is automatically scaled to the node BBox.

### Approach 1: Top-level `points` Field (Recommended)

The following three formats are supported:
- `'x1,y1 x2,y2 ...'` string (standard SVG points)
- Array of arrays: `[[x1,y1], [x2,y2]]`
- Array of objects: `[{x,y}, {x,y}]`

```javascript
// Diamond (decision node): percentage coordinates
graph.addNode({
  shape: 'polygon',
  x: 100, y: 100, width: 120, height: 60,
  label: '?',
  points: '60,0 120,30 60,60 0,30',           // string form
  attrs: { body: { fill: '#fff', stroke: '#8f8f8f' } },
});

// Hexagon: array form
graph.addNode({
  shape: 'polygon',
  x: 240, y: 100, width: 120, height: 60,
  points: [[30, 0], [90, 0], [120, 30], [90, 60], [30, 60], [0, 30]],
  attrs: { body: { fill: '#fff7e6', stroke: '#fa8c16' } },
});
```

### Approach 2: Write attrs.body.refPoints Directly

```javascript
attrs: { body: { refPoints: '60,0 120,30 60,60 0,30' } }
```

> ⚠️ Do not set both the top-level `points` field and `attrs.body.refPoints`; they conflict (the top-level propHook overrides the attr).

## 5. Polyline (Open Path)

This shares the `Poly` base class with Polygon (`src/shape/polyline.ts`) and uses the same syntax. The difference is that `<polyline>` **is not closed**.

```javascript
graph.addNode({
  shape: 'polyline',
  x: 100, y: 100, width: 120, height: 60,
  points: '0,60 30,0 60,60 90,30 120,60',
  attrs: { body: { fill: 'none', stroke: '#1890ff', strokeWidth: 2 } },
});
```

## 6. Path (Arbitrary SVG Path)

**Source (`src/shape/path.ts`)**: unlike other shapes, a path node has 3 markup elements (`bg` transparent background + `body` real path + `label` text). The top-level `path` field is written by propHook to `attrs/body/refD`.

```javascript
graph.addNode({
  shape: 'path',
  x: 100, y: 100, width: 120, height: 80,
  path: 'M 60 0 L 120 80 L 0 80 Z',        // triangle path
  label: 'Triangle',
  attrs: { body: { stroke: '#722ed1', strokeWidth: 2, fill: '#f9f0ff' } },
});
```

- Like `refPoints`, `refD` is scaled to the BBox, so path coordinates can be written relative to the node size.
- For path nodes, `attrs.body.fill` defaults to `none`, `stroke` defaults to `#000`, and `strokeWidth` defaults to `2` (different from other shapes!).
- A transparent hit area is needed for hover / click. Path nodes include `bg`, which already sets `pointerEvents: 'all'`.

## 7. Image

**Source (`src/shape/image.ts`)**: the internal selector is **`image`** rather than `body`, because createShape overrides the default with `selector: 'image'`. It provides 3 shortcut fields: `imageUrl` / `imageWidth` / `imageHeight`.

```javascript
graph.addNode({
  shape: 'image',
  x: 60, y: 60, width: 60, height: 60,
  // Shortcut field (recommended)
  imageUrl: 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
  // Equivalent to: attrs: { image: { 'xlink:href': '...' } }
});

// Full attrs syntax is also supported
graph.addNode({
  shape: 'image',
  x: 200, y: 60, width: 80, height: 80,
  attrs: {
    image: {
      'xlink:href': 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
      width: 80, height: 80,
    },
  },
});
```

> ⚠️ Syntax such as `attrs.body.fill` is **invalid** for image nodes. Image nodes do not have a `body` selector at all, so all styles must be written under `attrs.image`.

## 8. TextBlock (Multiline Text Block)

**Source (`src/shape/text-block.ts`)**:
- When the browser supports `foreignObject` (the vast majority of cases), the body is `<rect>`, and the text is rendered through `foreignObject > div`, which **automatically supports wrapping**.
- When it is not supported, it falls back to `<rect> + <text>`.
- The top-level `text` field is written by propHook to `attrs/label/text`.

```javascript
graph.addNode({
  shape: 'text-block',
  x: 100, y: 100, width: 200, height: 80,
  text: 'This is a long multiline text block\nIt wraps automatically and is centered',
  attrs: {
    body: { fill: '#fff', stroke: '#8f8f8f', strokeWidth: 1, rx: 6, ry: 6 },
    label: { style: { fontSize: 13, color: '#262626' } },
  },
});
```

> In `text-block`, label styles must be placed in `attrs.label.style` (HTML inline style), not SVG attributes. Use `style.color` rather than `fill` to set color.

## 9. HTML (Rich HTML Nodes)

`Shape.HTML` must be registered before use; you cannot call addNode directly. **For the complete guide, all business templates (cards / forms / status badges), the effect re-rendering mechanism, and migration notes for the deprecated X6 2.x API `Graph.registerHTMLComponent`, see [`core/x6-core-html-shape.md`](./x6-core-html-shape.md)**. The minimal usage is shown here:

```javascript
import { Graph, Shape } from '@antv/x6';

Shape.HTML.register({
  shape: 'my-html',
  width: 200, height: 80,
  effect: ['data'],
  html(node) {
    const div = document.createElement('div');
    div.style.cssText = 'width:100%;height:100%;border:1px solid #8f8f8f;padding:8px;';
    div.innerHTML = `<b>${node.getData()?.title || ''}</b>`;
    return div;
  },
});

graph.addNode({
  shape: 'my-html',
  x: 100, y: 60,
  data: { title: 'Hello HTML' },
});
```

> ⚠️ X6 3.x does **not** have a `Graph.registerHTMLComponent` API (deprecated in X6 2.x). All HTML nodes are registered uniformly through `Shape.HTML.register`.

## 10. Edge (Default Edge)

`shape: 'edge'` is the default shape for `graph.addEdge` and almost never needs to be declared explicitly. The markup consists of two paths (a transparent wrap used as the hit area + the real line). See `core/x6-core-edge.md` and `core/x6-core-markup.md` for details.

```javascript
graph.addEdge({
  source: a, target: b,
  // shape: 'edge',   // Can be omitted
  attrs: {
    line: { stroke: '#8f8f8f', strokeWidth: 1, targetMarker: 'classic' },
  },
});
```

## Selection Guide

| Business Intent | Recommended Shape | Key Fields |
|-----------------|-------------------|------------|
| General flow step | `rect` + rx/ry rounded corners | `attrs.body.{fill,stroke,rx,ry}` |
| Start / end node | `circle` | `width === height` |
| Judgment / decision | `polygon` (diamond) | `points: '60,0 120,30 60,60 0,30'` |
| Resource / database | `path` | `path: 'M ...'` |
| Node with icon | `image` (simple) / `Shape.HTML` (complex) | `imageUrl` / `html(cell)` |
| Multiline text note | `text-block` | `text: '...'` |
| Rich UI (buttons, cards, forms) | `Shape.HTML.register` | `effect: ['data']` |
| Edge | `edge` (default, can be omitted) | `attrs.line.*` |

## Common Errors and Fixes

### ❌ Using a Non-existent Shape

```javascript
// Wrong: X6 3.x does not have Cylinder / Diamond / Group / Hexagon
graph.addNode({ shape: 'cylinder', ... });   // ❌ Throws "shape not found"
graph.addNode({ shape: 'diamond',  ... });   // ❌
new Shape.Group();                            // ❌ Cannot read properties of undefined

// Correct
graph.addNode({ shape: 'polygon', points: '60,0 120,30 60,60 0,30', ... });  // diamond
graph.addNode({ shape: 'path',    path: 'M 0 20 Q 60 0 120 20 ...', ... });  // cylinder using path
```

### ❌ Missing points on Polygon

```javascript
// Wrong: without points, the <polygon> element has no vertices and renders empty
graph.addNode({ shape: 'polygon', x: 100, y: 100, width: 120, height: 60 });

// Correct
graph.addNode({
  shape: 'polygon',
  x: 100, y: 100, width: 120, height: 60,
  points: '60,0 120,30 60,60 0,30',
});
```

### ❌ Writing image node styles to attrs.body

```javascript
// Wrong: the selector for image nodes is 'image', not 'body'
graph.addNode({
  shape: 'image',
  x: 60, y: 60, width: 60, height: 60,
  attrs: { body: { 'xlink:href': '...' } },   // ❌ No effect
});

// Correct
graph.addNode({
  shape: 'image',
  x: 60, y: 60, width: 60, height: 60,
  imageUrl: 'https://...',                    // ✅ Shortcut field
});
// Or
graph.addNode({
  shape: 'image',
  x: 60, y: 60, width: 60, height: 60,
  attrs: { image: { 'xlink:href': 'https://...' } },
});
```

### ❌ Missing path on Path Node

```javascript
// Wrong: only the transparent <rect bg> is rendered, so no path is visible
graph.addNode({ shape: 'path', x: 100, y: 100, width: 120, height: 80 });

// Correct: the path field is required
graph.addNode({
  shape: 'path',
  x: 100, y: 100, width: 120, height: 80,
  path: 'M 60 0 L 120 80 L 0 80 Z',
});
```

### ❌ Circle Node width !== height

```javascript
// Wrong: a rectangular width/height makes refR: '50%' use the smaller value, so the node is smaller and centered with empty space
graph.addNode({ shape: 'circle', x: 0, y: 0, width: 100, height: 60 });

// Correct: keep equal width and height for a circle
graph.addNode({ shape: 'circle', x: 0, y: 0, width: 60, height: 60 });
// Or use ellipse instead
graph.addNode({ shape: 'ellipse', x: 0, y: 0, width: 100, height: 60 });
```

### ❌ Calling addNode Directly for an Unregistered HTML Node

```javascript
// Wrong: 'html' is not a default available shape string
graph.addNode({ shape: 'html', html: '<div>x</div>' });   // ❌ Throws shape not found

// Correct: first register a named HTML shape
Shape.HTML.register({
  shape: 'card',
  html(node) { /* ... */ },
});
graph.addNode({ shape: 'card', x: 0, y: 0, width: 200, height: 80 });
```

### ❌ Setting Font Color on TextBlock with SVG Attributes

```javascript
// Wrong: inside foreignObject is an HTML <div>, so fill has no effect
attrs: { label: { fill: '#f00' } }

// Correct: use HTML inline style
attrs: { label: { style: { color: '#f00', fontSize: 14 } } }
```
