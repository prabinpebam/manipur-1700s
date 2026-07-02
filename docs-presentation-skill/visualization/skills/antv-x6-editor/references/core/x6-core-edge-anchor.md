---
id: "x6-core-edge-anchor"
title: "X6 Edge Anchor"
description: |
  Edge anchors determine the anchor position when an edge connects to another edge. When an edge's source or target is another edge, the edge anchor determines where the connection point lies on the target edge.
library: x6
version: 3.x
category: "core"
tags:
  - edge-anchor
  - anchor
  - edge
  - connection
---

# Edge Anchor

## Overview

When an edge's `source` or `target` connects to another edge instead of a node, use Edge Anchor to determine the connection point on the target edge path.

## Built-in Edge Anchor types

| Type | Description | Parameters |
|------|------|------|
| `ratio` | Positions by ratio (default is 0.5, the midpoint) | `{ ratio: 0~1 }` |
| `length` | Positions by absolute length (pixel distance from the start point) | `{ length: number }` |
| `closest` | Path point closest to the reference point | None |
| `orth` | Intersection closest to the reference point in an orthogonal direction | `{ fallbackAt?: number \| string }` |

## Usage

Configure edge anchors through `source.anchor` or `target.anchor`:

```javascript
graph.addEdge({
  source: { cell: edge1.id, anchor: { name: 'ratio', args: { ratio: 0.3 } } },
  target: { cell: edge2.id, anchor: { name: 'closest' } },
});
```

## Details for each type

### ratio - Position by ratio

Takes a point by ratio along the target edge path. `ratio` is a decimal between 0 and 1 (default is 0.5, the midpoint). If ratio > 1, it is automatically divided by 100 and treated as a percentage.

```javascript
graph.addEdge({
  source: { cell: anotherEdge.id, anchor: { name: 'ratio', args: { ratio: 0.25 } } },
  target: targetNode,
});
```

### length - Position by absolute length

Returns the point a specified pixel distance along the path from the target edge's start point (default 20px).

```javascript
graph.addEdge({
  source: { cell: anotherEdge.id, anchor: { name: 'length', args: { length: 50 } } },
  target: targetNode,
});
```

### closest - Closest point

Returns the point on the target edge path that is closest to the reference point.

```javascript
graph.addEdge({
  source: { cell: anotherEdge.id, anchor: { name: 'closest' } },
  target: targetNode,
});
```

### orth - Orthogonal anchor

Starts from the reference point and finds the intersection with the target edge path in the horizontal or vertical direction. If no orthogonal intersection is found, it falls back to the position specified by `fallbackAt` (ratio or length). If `fallbackAt` is not set, it falls back to `closest`.

```javascript
graph.addEdge({
  source: { cell: anotherEdge.id, anchor: { name: 'orth', args: { fallbackAt: 0.5 } } },
  target: targetNode,
});
```

## Difference from Node Anchor

| Feature | Node Anchor | Edge Anchor |
|------|-------------|-------------|
| Applicable scenario | Edge connects to a node | Edge connects to another edge |
| Configuration location | `source/target.anchor` | Same as the left column (automatically selected by target type) |
| Built-in types | center, top, bottom, left, right, etc. | ratio, length, closest, orth |

## Custom Edge Anchor

Register a custom edge anchor with `Graph.registerEdgeAnchor`:

```javascript
import { Graph } from '@antv/x6';

Graph.registerEdgeAnchor('myAnchor', (view, magnet, ref, options, type) => {
  // view: EdgeView instance
  // ref: reference point
  // Return a Point object
  const ratio = options.ratio || 0.5;
  return view.getPointAtRatio(ratio);
});

// Usage
graph.addEdge({
  source: { cell: edge1.id, anchor: { name: 'myAnchor', args: { ratio: 0.7 } } },
  target: targetNode,
});
```

## Common errors

```javascript
// ❌ Incorrect: edge anchors only take effect for edge-to-edge connections; use node anchors for node connections
graph.addEdge({
  source: { cell: node.id, anchor: { name: 'ratio' } }, // ratio is an edge anchor and does not apply to nodes
  target: targetNode,
});

// ✅ Correct: use a node anchor for node connections
graph.addEdge({
  source: { cell: node.id, anchor: { name: 'center' } },
  target: targetNode,
});
```