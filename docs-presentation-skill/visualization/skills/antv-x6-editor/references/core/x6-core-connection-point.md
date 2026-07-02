---
id: "x6-core-connection-point"
title: "X6 Connection Points (ConnectionPoint)"
description: |
  Strategies for calculating the actual intersection between an edge and a node boundary.
  connectionPoint determines the final endpoint position of a connection on the node boundary and works together with anchor.

library: "x6"
version: "3.x"
category: "core"
subcategory: "connection-point"
tags:
  - "connectionPoint"
  - "connection point"
  - "boundary"
  - "bbox"
  - "rect"
  - "anchor"
  - "edge intersection"

related:
  - "x6-core-anchor"
  - "x6-core-edge"
  - "x6-core-ports"

use_cases:
  - "Control where an edge intersects a node shape boundary"
  - "Connect edges precisely to node outlines"
  - "Handle connection intersections for rotated nodes"
  - "Configure connection endpoint offsets"

difficulty: "intermediate"
completeness: "full"
---

## Core Concepts

A **ConnectionPoint** is the actual intersection between an edge path and a node boundary. Its relationship with anchor is:

1. **Anchor** -> Determines the reference point (for example, the node center)
2. **ConnectionPoint** -> Draws a ray from the opposite endpoint toward the anchor and calculates its intersection with the node boundary

```
opposite endpoint ---------- connectionPoint (boundary intersection) --- anchor (reference point, inside the node)
                                      ^
                              final edge endpoint
```

## Configuration

### Global Configuration

```javascript
const graph = new Graph({
  container: 'container',
  connecting: {
    connectionPoint: 'boundary',  // Global default
  },
});
```

### Per-Edge Configuration

```javascript
graph.addEdge({
  source: { cell: node1, connectionPoint: 'boundary' },
  target: { cell: node2, connectionPoint: { name: 'boundary', args: { sticky: true } } },
});
```

## Built-in Connection Point Types

| Name | Description | Use Cases |
|------|-------------|-----------|
| `'boundary'` | Intersection with the node's actual shape boundary (**default**) | Irregular shapes such as circles, ellipses, and polygons |
| `'bbox'` | Intersection with the node's unrotated BBox | Simple rectangular nodes |
| `'rect'` | Intersection with the node's rotated BBox | Rotated rectangular nodes |
| `'anchor'` | Uses the anchor position directly without calculating a boundary intersection | When the edge needs to enter the node interior |

## Parameter Details

### boundary Parameters

The most commonly used connection point strategy. It calculates the precise intersection between the ray and the node's SVG shape.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `offset` | `number \| { x, y }` | `0` | Offset distance along the edge direction |
| `stroked` | `boolean` | `false` | Whether to include strokeWidth in the calculation |
| `selector` | `string \| string[]` | None | Selector for the child elements used to calculate the intersection |
| `insideout` | `boolean` | `true` | Whether to still calculate an intersection when the reference point is inside the shape |
| `extrapolate` | `boolean` | `false` | Extends the ray to ensure it intersects the shape |
| `sticky` | `boolean` | `false` | Whether to return the nearest point instead of the anchor when there is no intersection |
| `precision` | `number` | `2` | Intersection precision for Path elements |

### bbox Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `offset` | `number \| { x, y }` | `0` | Offset distance |
| `stroked` | `boolean` | `false` | Whether to include strokeWidth in the calculation |

### rect Parameters

Same as bbox, but considers the node rotation angle.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `offset` | `number \| { x, y }` | `0` | Offset distance |
| `stroked` | `boolean` | `false` | Whether to include strokeWidth in the calculation |

### anchor Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `offset` | `number \| { x, y }` | `0` | Offset distance |
| `align` | `'top' \| 'right' \| 'bottom' \| 'left'` | None | Alignment direction |
| `alignOffset` | `number` | `0` | Alignment offset |

## Complete Example

### boundary: Precise Shape Intersection

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  connecting: {
    anchor: 'center',
    connectionPoint: 'boundary',
    router: 'orth',
    connector: 'rounded',
  },
});

// Circle node - boundary precisely calculates the arc intersection
const circleNode = graph.addNode({
  shape: 'circle',
  x: 100,
  y: 100,
  width: 80,
  height: 80,
  label: 'Start',
  attrs: { body: { fill: '#fff', stroke: '#8f8f8f' } },
});

const rectNode = graph.addNode({
  shape: 'rect',
  x: 350,
  y: 100,
  width: 120,
  height: 60,
  label: 'Process',
  attrs: { body: { fill: '#fff', stroke: '#8f8f8f', rx: 6, ry: 6 } },
});

graph.addEdge({
  source: circleNode,
  target: rectNode,
  attrs: { line: { stroke: '#8f8f8f', targetMarker: 'classic' } },
});
```

### sticky Mode: Always Ensure a Connection Point

```javascript
graph.addEdge({
  source: {
    cell: node1,
    connectionPoint: {
      name: 'boundary',
      args: { sticky: true },  // Return the nearest point when there is no intersection
    },
  },
  target: node2,
});
```

### anchor Type: Let the Edge Enter the Node

```javascript
// Connect the edge directly to the anchor position instead of stopping at the boundary
graph.addEdge({
  source: {
    cell: node1,
    anchor: 'center',
    connectionPoint: 'anchor',  // Edge reaches the node center
  },
  target: node2,
});
```

### Connection Point with an Offset

```javascript
graph.addEdge({
  source: {
    cell: node1,
    connectionPoint: {
      name: 'boundary',
      args: { offset: 10 },  // Move the connection point 10px outward from the boundary
    },
  },
  target: node2,
});
```

## How connectionPoint Works with anchor

```
Scenario: node1 -> node2

1. Determine node2's anchor position (for example, center = node center)
2. Draw a ray from node1 toward node2's anchor
3. connectionPoint calculates the intersection between the ray and the node2 boundary
4. That intersection is the actual position of the edge's target endpoint
```

| Combination | Effect |
|-------------|--------|
| `anchor: 'center'` + `connectionPoint: 'boundary'` | Edge reaches the node shape boundary (most common) |
| `anchor: 'center'` + `connectionPoint: 'anchor'` | Edge enters the node and reaches the center |
| `anchor: 'left'` + `connectionPoint: 'boundary'` | Calculates the boundary intersection from the left-side direction |
| `anchor: 'midSide'` + `connectionPoint: 'boundary'` | Automatically selects the nearest side's boundary intersection |

## Common Mistakes

### Incorrectly confusing connectionPoint with anchor

```javascript
// Incorrect: using anchor when you want the edge to connect to the node boundary
graph.addEdge({
  source: { cell: node1, anchor: 'boundary' }, // 'boundary' is not an anchor type
  target: node2,
});

// Correct: boundary is a connectionPoint type
graph.addEdge({
  source: { cell: node1, connectionPoint: 'boundary' },
  target: node2,
});
```

### Using bbox for circular nodes, resulting in imprecise intersections

```javascript
// Not recommended: for circular nodes, bbox calculates intersections with a rectangular boundary
connectionPoint: 'bbox'  // Circular nodes will have a gap

// Recommended: use boundary to precisely calculate the arc intersection
connectionPoint: 'boundary'
```
