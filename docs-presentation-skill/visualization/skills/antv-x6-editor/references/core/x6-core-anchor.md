---
id: "x6-core-anchor"
title: "X6 Anchor"
description: |
  Anchor positioning strategies for edges connected to nodes or edges.
  Includes nodeAnchor and edgeAnchor, which control the precise endpoint position on the target element.

library: "x6"
version: "3.x"
category: "core"
subcategory: "anchor"
tags:
  - "anchor"
  - "anchor point"
  - "nodeAnchor"
  - "edgeAnchor"
  - "edge endpoint"
  - "center"
  - "top"
  - "bottom"
  - "left"
  - "right"
  - "midSide"
  - "orth"
  - "ratio"

related:
  - "x6-core-edge"
  - "x6-intermediate-connection-point"
  - "x6-core-ports"

use_cases:
  - "Control where an edge connects to a node"
  - "Set the anchor when an edge connects to another edge"
  - "Automatically align edge endpoints in orthogonal layouts"
  - "Connect edges from a node center, edge, or nearest side"

difficulty: "intermediate"
completeness: "full"
---

## Core Concepts

**Anchor** determines the reference position of an edge endpoint on the target element. X6 provides two types of anchors:

- **nodeAnchor**: The anchor position used when an edge connects to a node.
- **edgeAnchor**: The anchor position used when an edge connects to another edge.

Anchors work together with connectionPoint: anchor determines the reference point, and connectionPoint determines the final connection position, which is usually the intersection between the line from the anchor and the node boundary.

## Node Anchor

### Configuration

Set the `anchor` field in an edge's `source` or `target`:

```javascript
graph.addEdge({
  source: { cell: node1, anchor: 'center' },
  target: { cell: node2, anchor: { name: 'midSide', args: { direction: 'H' } } },
});
```

You can also set the global default in the Graph `connecting` option:

```javascript
const graph = new Graph({
  container: 'container',
  connecting: {
    anchor: 'center', // Global default node anchor
  },
});
```

### Built-in Node Anchors

| Name | Description | Parameters |
|------|-------------|------------|
| `center` | Center of the node BBox (**default**) | `dx`, `dy`, `rotate` |
| `top` | Center of the node top side | `dx`, `dy`, `rotate` |
| `bottom` | Center of the node bottom side | `dx`, `dy`, `rotate` |
| `left` | Center of the node left side | `dx`, `dy`, `rotate` |
| `right` | Center of the node right side | `dx`, `dy`, `rotate` |
| `topLeft` | Top-left corner of the node | `dx`, `dy`, `rotate` |
| `topRight` | Top-right corner of the node | `dx`, `dy`, `rotate` |
| `bottomLeft` | Bottom-left corner of the node | `dx`, `dy`, `rotate` |
| `bottomRight` | Bottom-right corner of the node | `dx`, `dy`, `rotate` |
| `midSide` | Midpoint of the side closest to the opposite endpoint | `direction`, `padding`, `rotate` |
| `orth` | Orthogonal anchor that keeps the edge orthogonal | `padding` |
| `nodeCenter` | Actual center of the node, not the magnet BBox | `dx`, `dy` |

### BBox Anchor Parameters

`center`, `top`, `bottom`, `left`, `right`, `topLeft`, `topRight`, `bottomLeft`, and `bottomRight` share these parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `dx` | `number \| string` | `0` | X-axis offset; supports percentages such as `'25%'` |
| `dy` | `number \| string` | `0` | Y-axis offset; supports percentages such as `'25%'` |
| `rotate` | `boolean` | `false` | Whether to rotate with the node |

### midSide Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `direction` | `'H' \| 'V'` | None | Restricts the direction: `H` selects only left/right, and `V` selects only top/bottom |
| `padding` | `number` | None | BBox expansion value |
| `rotate` | `boolean` | `false` | Whether to rotate with the node |

### orth Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `padding` | `number` | `0` | Padding from the BBox boundary |

## Edge Anchor

Used when an edge connects to another edge.

### Built-in Edge Anchors

| Name | Description | Parameters |
|------|-------------|------------|
| `ratio` | Position by ratio along the edge path (**default**) | `ratio` |
| `length` | Position by length along the edge path | `length` |
| `closest` | Point on the edge path closest to the opposite endpoint | None |
| `orth` | Orthogonal anchor: the intersection between the edge path and an orthogonal line drawn from the opposite endpoint | `fallbackAt` |

### ratio Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `ratio` | `number` | `0.5` | Position ratio between 0 and 1; values greater than 1 are automatically divided by 100 |

### length Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `length` | `number` | `20` | Length in pixels from the start of the path |

### orth Parameters (Edge Anchor)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `fallbackAt` | `number \| string` | None | Fallback position when there is no orthogonal intersection; a number is treated as a ratio (0 to 1), or use a pixel-length string such as `'20'` |

The `orth` edge anchor draws horizontal and vertical lines from the opposite reference point, then uses the closest intersection with the edge path. If there is no intersection, it uses the fallback position specified by `fallbackAt`; if `fallbackAt` is also unspecified, it falls back to `closest`.

## Complete Example

### Use midSide for Automatic Side Connections

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  connecting: {
    anchor: { name: 'midSide', args: { direction: 'H' } },
    connectionPoint: 'boundary',
    router: 'orth',
    connector: 'rounded',
  },
});

const node1 = graph.addNode({
  shape: 'rect',
  x: 100,
  y: 100,
  width: 120,
  height: 60,
  label: 'Start',
  attrs: { body: { fill: '#fff', stroke: '#8f8f8f', rx: 6, ry: 6 } },
});

const node2 = graph.addNode({
  shape: 'rect',
  x: 400,
  y: 250,
  width: 120,
  height: 60,
  label: 'End',
  attrs: { body: { fill: '#fff', stroke: '#8f8f8f', rx: 6, ry: 6 } },
});

// midSide automatically selects the side closest to the opposite endpoint
graph.addEdge({
  source: node1,
  target: node2,
  attrs: { line: { stroke: '#8f8f8f', targetMarker: 'classic' } },
});
```

### Specify source and target anchors separately

```javascript
graph.addEdge({
  source: { cell: node1, anchor: 'right' },
  target: { cell: node2, anchor: { name: 'left', args: { dy: 10 } } },
  attrs: { line: { stroke: '#8f8f8f', targetMarker: 'classic' } },
});
```

### Connect an edge to an edge

```javascript
const edge1 = graph.addEdge({
  source: node1,
  target: node2,
});

// edge2 connects to the midpoint of edge1
graph.addEdge({
  source: node3,
  target: { cell: edge1, anchor: { name: 'ratio', args: { ratio: 0.5 } } },
  attrs: { line: { stroke: '#f5222d', targetMarker: 'classic' } },
});
```

## Common Mistakes

### ❌ Confusing anchor with connectionPoint

```javascript
// Incorrect: anchor does not determine the final connection position; it is only the reference point
graph.addEdge({
  source: { cell: node1, anchor: 'boundary' }, // ❌ boundary is a connectionPoint, not an anchor
  target: node2,
});

// Correct: anchor sets the reference position, and connectionPoint determines the boundary intersection
graph.addEdge({
  source: { cell: node1, anchor: 'center', connectionPoint: 'boundary' },
  target: node2,
});
```

### ❌ Mixing string shorthand and object format incorrectly

```javascript
// The two correct forms
anchor: 'center'                                    // String shorthand
anchor: { name: 'midSide', args: { direction: 'H' } }  // Object format, used when arguments are needed
```
