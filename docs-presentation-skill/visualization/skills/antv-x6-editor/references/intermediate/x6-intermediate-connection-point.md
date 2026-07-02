---
id: "x6-intermediate-connection-point"
title: "X6 Connection Points and Anchors"
description: |
  A complete guide to X6 anchors and connection points.
  Covers built-in anchor types, connection point calculations, global and per-edge configuration, and custom anchors and connection points.

library: "x6"
version: "3.x"
category: "intermediate"
subcategory: "connection-point"
tags:
  - "connection points"
  - "connectionPoint"
  - "anchors"
  - "anchor"
  - "nodeAnchor"
  - "sourceAnchor"
  - "targetAnchor"
  - "boundary"
  - "bbox"
  - "rect"
  - "center"
  - "top"
  - "bottom"
  - "left"
  - "right"
  - "midSide"
  - "orth"

related:
  - "x6-core-edge"
  - "x6-core-ports"
  - "x6-core-graph-init"

use_cases:
  - "Control the exact connection positions between edges and nodes"
  - "Distribute multiple edges with spacing when they connect to the same node"
  - "Set edges to connect to nodes from specific directions (top, bottom, left, right)"
  - "Customize how connection points are calculated"

anti_patterns:
  - "Do not confuse the concepts of anchor and connectionPoint"
  - "Do not confuse port and anchor: port is a connection port, while anchor is the anchor position"
---

# X6 Connection Points and Anchors

## Core Concepts

- **Anchor**: the reference point position of an edge on a node (such as center, top, left side, etc.)
- **ConnectionPoint**: the actual start/end point of an edge calculated from the anchor and reference line

By default:
- The anchor is `center` (the node center)
- The connection point is `boundary` (the intersection of the reference line and the node boundary)

## Usage

### Method 1: Global Configuration (Graph.connecting)

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  connecting: {
    // Global anchor configuration
    sourceAnchor: 'right',
    targetAnchor: 'left',
    // Global connection point configuration
    connectionPoint: 'anchor',
  },
});
```

### Method 2: Per-Edge Configuration (Higher Priority)

```javascript
graph.addEdge({
  source: {
    cell: 'node1',
    anchor: {
      name: 'right',
      args: { dy: -10 },
    },
    connectionPoint: 'anchor',
  },
  target: {
    cell: 'node2',
    anchor: {
      name: 'left',
      args: { dy: -10 },
    },
    connectionPoint: 'anchor',
  },
});
```

## Built-in Anchor Types

| Anchor | Position | Description |
|------|------|------|
| `center` | Node center | Default value |
| `top` | Top center | |
| `bottom` | Bottom center | |
| `left` | Left center | |
| `right` | Right center | |
| `topLeft` | Top-left corner | |
| `topRight` | Top-right corner | |
| `bottomLeft` | Bottom-left corner | |
| `bottomRight` | Bottom-right corner | |
| `midSide` | Center of the nearest side | Automatically selects the side nearest to the reference line |
| `orth` | Orthogonal point | Ensures vertical/horizontal edge connections |
| `nodeCenter` | Node center | Always the geometric center of the node |

### Anchor Parameters

All anchors support the following parameters:

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `dx` | number \| string | 0 | X-axis offset (percentages supported) |
| `dy` | number \| string | 0 | Y-axis offset (percentages supported) |
| `rotate` | boolean | false | Whether to rotate with the node |

### Additional midSide Parameters

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `padding` | number | 0 | Offset |
| `direction` | `'H'` \| `'V'` | - | Restrict direction (H = left/right only, V = top/bottom only) |

## Built-in Connection Point Types

| Connection Point | Description |
|--------|------|
| `boundary` | Default. The intersection of the reference line and the node boundary |
| `bbox` | The intersection of the reference line and the bounding box |
| `rect` | The intersection of the reference line and the rotated rectangle |
| `anchor` | Uses the anchor directly as the connection point (without calculating an intersection) |

### boundary Parameters

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `offset` | number \| Point | 0 | Offset |
| `stroked` | boolean | true | Whether to account for stroke width |
| `sticky` | boolean | false | Use the nearest point when there is no intersection |
| `selector` | string | - | Specifies the child element used for calculation |

## Common Configuration Combinations

### DAG Left-to-Right Connections

```javascript
const graph = new Graph({
  container: 'container',
  connecting: {
    sourceAnchor: 'right',
    targetAnchor: 'left',
    connectionPoint: 'anchor',
    router: 'orth',
    connector: 'rounded',
  },
});
```

### Distributed Connections for Multiple Edges (midSide)

```javascript
const graph = new Graph({
  container: 'container',
  connecting: {
    anchor: 'midSide',
    connectionPoint: 'boundary',
  },
});
```

### Orthogonal Connections (orth anchor)

Ensures edges connect from an orthogonal direction of the node (the nearest top, bottom, left, or right side):

```javascript
const graph = new Graph({
  container: 'container',
  connecting: {
    anchor: 'orth',
    connectionPoint: 'anchor',
    router: 'orth',
    connector: 'rounded',
  },
});
```

### Anchors with Offsets

```javascript
graph.addEdge({
  source: {
    cell: 'node1',
    anchor: { name: 'right', args: { dy: -15 } },  // Upper part of the right side
    connectionPoint: 'anchor',
  },
  target: {
    cell: 'node2',
    anchor: { name: 'left', args: { dy: -15 } },   // Upper part of the left side
    connectionPoint: 'anchor',
  },
  attrs: { line: { stroke: '#8f8f8f', strokeWidth: 1, targetMarker: 'classic' } },
});

graph.addEdge({
  source: {
    cell: 'node1',
    anchor: { name: 'right', args: { dy: 15 } },   // Lower part of the right side
    connectionPoint: 'anchor',
  },
  target: {
    cell: 'node2',
    anchor: { name: 'left', args: { dy: 15 } },    // Lower part of the left side
    connectionPoint: 'anchor',
  },
  attrs: { line: { stroke: '#8f8f8f', strokeWidth: 1, targetMarker: 'classic' } },
});
```

## Custom Connection Points

```javascript
Graph.registerConnectionPoint(
  'custom-cp',
  (line, view, magnet, args) => {
    // line: reference line
    // view: node view
    // magnet: connected SVG element
    // Return Point { x, y }
    const { offset = 0 } = args;
    const bbox = view.getBBox();
    return { x: bbox.x + bbox.width + offset, y: bbox.y + bbox.height / 2 };
  },
  true,
);

// Usage
new Graph({
  connecting: {
    connectionPoint: { name: 'custom-cp', args: { offset: 5 } },
  },
});
```

## Dynamically Modifying Anchors

```javascript
const edge = graph.addEdge({ source: 'node1', target: 'node2' });

// Modify the source anchor
edge.setSource({
  cell: 'node1',
  anchor: { name: 'bottom', args: { dx: 10 } },
  connectionPoint: 'anchor',
});

// Modify the target anchor
edge.setTarget({
  cell: 'node2',
  anchor: 'top',
  connectionPoint: 'boundary',
});
```

## Common Mistakes

### ❌ Confusing anchor and connectionPoint

```javascript
// Incorrect: assuming anchor:'right' makes the edge start from the right side (but the default connectionPoint is boundary, which recalculates the intersection)
graph.addEdge({
  source: { cell: 'node1', anchor: 'right' },
  target: { cell: 'node2', anchor: 'left' },
});
// The edge may not connect exactly from the center of the right side

// Correct: use it together with connectionPoint:'anchor' to skip intersection calculation
graph.addEdge({
  source: { cell: 'node1', anchor: 'right', connectionPoint: 'anchor' },
  target: { cell: 'node2', anchor: 'left', connectionPoint: 'anchor' },
});
```

### ❌ Confusing port and anchor

```javascript
// port is a connection port (connection-point UI on a node), while anchor is the calculation method for the edge connection position
// When a port is available, use the port field in source/target:
graph.addEdge({
  source: { cell: 'node1', port: 'out-1' },  // Connect to a port
  target: { cell: 'node2', port: 'in-1' },
});

// When there is no port, use the anchor field to control the connection position:
graph.addEdge({
  source: { cell: 'node1', anchor: 'right' },  // Connect to an anchor
  target: { cell: 'node2', anchor: 'left' },
});
```
