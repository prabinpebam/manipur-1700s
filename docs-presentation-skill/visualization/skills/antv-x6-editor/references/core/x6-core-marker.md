---
id: "x6-core-marker"
title: "X6 Arrow Markers"
description: |
  Configuration for arrow markers at the start and end of edges.
  Includes built-in arrow types (classic, block, diamond, circle, cross, ellipse, and more) and custom arrows.

library: "x6"
version: "3.x"
category: "core"
subcategory: "marker"
tags:
  - "marker"
  - "arrow"
  - "targetMarker"
  - "sourceMarker"
  - "classic"
  - "block"
  - "diamond"
  - "circle"
  - "cross"
  - "ellipse"
  - "arrow"
  - "custom arrow"
  - "SVG path"
  - "gradient arrow"
  - "defineGradient"
  - "linearGradient"

related:
  - "x6-core-edge"
  - "x6-core-anchor"
  - "x6-intermediate-custom-edge"

use_cases:
  - "Add arrows to edges"
  - "Customize arrow style and size"
  - "Set different arrows for the start and end of an edge"
  - "Hollow arrows, diamond arrows, and circular arrows"
  - "Custom SVG path arrows"
  - "Gradient-filled arrows"

difficulty: "beginner"
completeness: "full"
---

## Core Concepts

A **Marker** is a decorative element at the start (`sourceMarker`) or end (`targetMarker`) of an edge. Configure it through the edge's `attrs.line`.

## Configuration

```javascript
graph.addEdge({
  source: node1,
  target: node2,
  attrs: {
    line: {
      stroke: '#8f8f8f',
      strokeWidth: 1,
      targetMarker: 'classic',       // End arrow (string shorthand)
      sourceMarker: null,            // No arrow at the start
    },
  },
});
```

## Built-in Arrow Types

| Name | Description | Effect |
|------|------|------|
| `'classic'` | Classic solid arrow (V-shaped, with an indentation) | ▶ indented |
| `'block'` | Solid triangular arrow (no indentation) | ▶ full triangle |
| `'diamond'` | Diamond arrow | ◆ |
| `'circle'` | Circular arrow | ● |
| `'circlePlus'` | Circle with a cross | ⊕ |
| `'ellipse'` | Elliptical arrow | ⬮ |
| `'cross'` | X-shaped cross (hollow) | ✕ |
| `'async'` | Oblique marker (acute triangle, often used for async signals) | ◁ oblique |

## Parameter Configuration

Use object format to pass parameters:

```javascript
attrs: {
  line: {
    targetMarker: {
      name: 'classic',
      size: 10,        // Unified size
      width: 12,       // Width (higher priority than size)
      height: 8,       // Height (higher priority than size)
      offset: 0,       // Offset along the path direction
    },
  },
}
```

### `classic` Parameters

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `size` | `number` | `10` | Arrow size (default value for width and height) |
| `width` | `number` | `size` | Arrow width |
| `height` | `number` | `size` | Arrow height |
| `offset` | `number` | `-width/2` | Offset along the path direction |
| `factor` | `number` | `0.75` | Indentation factor, from 0 to 1; larger values make the indentation shallower |

### `block` Parameters

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `size` | `number` | `10` | Arrow size |
| `width` | `number` | `size` | Arrow width |
| `height` | `number` | `size` | Arrow height |
| `offset` | `number` | `-width/2` | Offset along the path direction |
| `open` | `boolean` | `false` | Whether the arrow is hollow (stroke only) |

### `diamond` Parameters

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `size` | `number` | `10` | Diamond size |
| `width` | `number` | `size` | Diamond width |
| `height` | `number` | `size` | Diamond height |
| `offset` | `number` | `-width/2` | Offset along the path direction |

### `circle` Parameters

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `r` | `number` | `5` | Circle radius |

### `ellipse` Parameters

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `rx` | `number` | `5` | Radius in the X direction |
| `ry` | `number` | `5` | Radius in the Y direction |

### `cross` Parameters

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `size` | `number` | `10` | Cross size |
| `width` | `number` | `size` | Width |
| `height` | `number` | `size` | Height |
| `offset` | `number` | `-width/2` | Offset along the path direction |

### `async` Parameters

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `width` | `number` | `10` | Width |
| `height` | `number` | `6` | Height |
| `offset` | `number` | `-width/2` | Offset along the path direction |
| `open` | `boolean` | `false` | Whether the arrow is hollow (stroke only) |
| `flip` | `boolean` | `false` | Whether to flip the direction |

## Complete Example

### Common Arrow Combinations

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
});

const node1 = graph.addNode({
  shape: 'rect', x: 50, y: 50, width: 80, height: 40, label: 'A',
  attrs: { body: { fill: '#fff', stroke: '#8f8f8f', rx: 4, ry: 4 } },
});

const node2 = graph.addNode({
  shape: 'rect', x: 300, y: 50, width: 80, height: 40, label: 'B',
  attrs: { body: { fill: '#fff', stroke: '#8f8f8f', rx: 4, ry: 4 } },
});

// Classic arrow
graph.addEdge({
  source: node1,
  target: node2,
  attrs: {
    line: { stroke: '#333', strokeWidth: 1, targetMarker: 'classic' },
  },
});
```

### Custom Arrow Size and Color

```javascript
graph.addEdge({
  source: node1,
  target: node2,
  attrs: {
    line: {
      stroke: '#1890ff',
      strokeWidth: 2,
      targetMarker: {
        name: 'block',
        size: 14,
        open: true,        // Hollow triangle
        stroke: '#1890ff',
        fill: 'none',
      },
    },
  },
});
```

### Bidirectional Arrows

```javascript
graph.addEdge({
  source: node1,
  target: node2,
  attrs: {
    line: {
      stroke: '#333',
      strokeWidth: 1,
      sourceMarker: 'classic',
      targetMarker: 'classic',
    },
  },
});
```

### Diamond and Circle Arrows in ER Diagrams

```javascript
// One-to-many relationship
graph.addEdge({
  source: tableA,
  target: tableB,
  attrs: {
    line: {
      stroke: '#333',
      strokeWidth: 1,
      sourceMarker: { name: 'diamond', size: 12, fill: '#fff', stroke: '#333' },
      targetMarker: { name: 'classic', size: 10 },
    },
  },
});
```

### Removing the Default Arrow

```javascript
graph.addEdge({
  source: node1,
  target: node2,
  attrs: {
    line: {
      stroke: '#8f8f8f',
      targetMarker: null,    // No arrow
    },
  },
});
```

## Custom SVG Path Arrows

**When the built-in arrows are not enough**, you can directly pass a `{ tagName, d, ...attrs }` object. X6 automatically registers it in SVG `<defs>` and generates the corresponding `<marker>` element. You **do not need to, and must not**, manually call `document.createElementNS` or access `graph.svgDoc` or `graph.defs` (these are not public APIs in 3.x).

- `tagName` usually uses `'path'` together with the `d` path
- Path coordinate system: the marker's local coordinate system, with the origin at the edge endpoint and the **X-axis along the edge direction**. Common diamond path: `'M 20 -10 0 0 20 10 Z'`
- You can write SVG attributes such as `fill`, `stroke`, and `strokeWidth` directly in the object

```javascript
graph.addEdge({
  source: [100, 140],
  target: [400, 140],
  attrs: {
    line: {
      stroke: '#8f8f8f',
      strokeWidth: 1,
      // Source end: default gray diamond
      sourceMarker: {
        tagName: 'path',
        d: 'M 20 -10 0 0 20 10 Z',
      },
      // Target end: custom diamond with red stroke and green fill
      targetMarker: {
        tagName: 'path',
        stroke: '#D94111',
        strokeWidth: 2,
        fill: '#90C54C',
        d: 'M 20 -10 0 0 20 10 Z',
      },
    },
  },
});
```

## Gradient-filled Arrows

If you must apply a gradient to a custom marker, the **only correct** approach is to use the public X6 API `graph.defineGradient(options)` to get a `gradientId`, then set `fill` to `url(#gradientId)`.

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  background: { color: '#F2F7FA' },
});

const source = graph.addNode({
  shape: 'rect', x: 80, y: 100, width: 100, height: 40, label: 'Source',
  attrs: { body: { stroke: '#8f8f8f', strokeWidth: 1, fill: '#fff', rx: 6, ry: 6 } },
});

const target = graph.addNode({
  shape: 'rect', x: 360, y: 100, width: 100, height: 40, label: 'Target',
  attrs: { body: { stroke: '#8f8f8f', strokeWidth: 1, fill: '#fff', rx: 6, ry: 6 } },
});

// 1) Register a linear gradient through the public API and get its id
const gradientId = graph.defineGradient({
  type: 'linearGradient',
  stops: [
    { offset: 0, color: '#ff0000' },
    { offset: 1, color: '#00ff00' },
  ],
});

// 2) Reference it in the marker object with url(#id)
graph.addEdge({
  source,
  target,
  attrs: {
    line: {
      stroke: '#8f8f8f',
      strokeWidth: 2,
      sourceMarker: 'classic',
      targetMarker: {
        tagName: 'path',
        d: 'M 0 -10 10 0 0 10 -10 0 Z',
        fill: `url(#${gradientId})`,
        stroke: 'none',
      },
    },
  },
});
```

> ⚠️ The `stops[].offset` value of `graph.defineGradient` is a number from `0` to `1` (not a `'0%'` string).

## Common Mistakes

### ❌ Manually Creating SVG `<defs>` / `<linearGradient>`

```javascript
// Incorrect: graph.svgDoc / graph.defs are not public properties on X6, and this bypasses X6's defs management
const defs = graph.svgDoc.createElementNS('http://www.w3.org/2000/svg', 'defs');           // ❌
const gradient = graph.svgDoc.createElementNS(                                              // ❌
  'http://www.w3.org/2000/svg',
  'linearGradient',
);
gradient.setAttribute('id', 'gradient');
// ...
graph.svgDoc.appendChild(defs);                                                             // ❌ Runtime error
```

```javascript
// Correct: get an id with graph.defineGradient, then use url(#id) in fill
const gradientId = graph.defineGradient({
  type: 'linearGradient',
  stops: [
    { offset: 0, color: '#ff0000' },
    { offset: 1, color: '#00ff00' },
  ],
});
attrs.line.targetMarker = {
  tagName: 'path',
  d: 'M 0 -10 10 0 0 10 -10 0 Z',
  fill: `url(#${gradientId})`,
  stroke: 'none',
};
```

### ❌ Setting `marker` in the Wrong Location

```javascript
// Incorrect: marker is not a top-level edge property
graph.addEdge({
  source: node1,
  target: node2,
  targetMarker: 'classic', // ❌ Invalid
});

// Correct: marker belongs under attrs.line
graph.addEdge({
  source: node1,
  target: node2,
  attrs: {
    line: { targetMarker: 'classic' }, // ✅
  },
});
```

### ❌ Forgetting to Set `fill` for Hollow Arrows

```javascript
// Hollow arrows require block + open: true, or manually setting fill: 'none'
attrs: {
  line: {
    targetMarker: {
      name: 'block',
      open: true,  // ✅ block supports the open parameter
    },
  },
}
```
