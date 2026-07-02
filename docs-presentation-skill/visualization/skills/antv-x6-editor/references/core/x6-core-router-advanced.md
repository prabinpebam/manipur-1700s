---
id: "x6-core-router-advanced"
title: "X6 Advanced Routers"
description: |
  In addition to common routers such as orth, manhattan, metro, and er, X6 also provides advanced routers such as oneside (single-side routing) and loop (self-loop routing).
  They are suitable for scenarios such as single-side edge exits and self-loop edges.

library: "x6"
version: "3.x"
category: "core"
subcategory: "edge"
tags:
  - "router"
  - "routing"
  - "oneside"
  - "loop"
  - "self-loop"
  - "single-side"
  - "edge"
  - "connection"

related:
  - "x6-core-edge"
  - "x6-core-connector-advanced"

use_cases:
  - "Edges enter and exit from the same side of a node"
  - "Self-loop edges (edges on the same node)"
  - "Single-side outgoing-edge layouts"
  - "Representing cyclic dependencies"

difficulty: "intermediate"
completeness: "full"
---

## Complete Router List

| Router | Description | Typical Scenario |
|--------|-------------|------------------|
| `normal` | Default; direct connection with no intermediate points | Simple connections |
| `orth` | Orthogonal routing (horizontal/vertical segments) | Flowcharts |
| `manhattan` | Intelligent orthogonal routing that automatically avoids obstacles | Complex flowcharts |
| `metro` | Metro-line style (45-degree diagonals) | Metro maps |
| `er` | ER diagram routing | ER diagrams |
| `oneside` | Forces entry and exit from the specified side | Hierarchical layouts, one-way flow |
| `loop` | Self-loop routing | Self-loop edges, cyclic states |

---

## OneSide Router

Forces an edge to enter and exit from a specified side of the node (`top`/`bottom`/`left`/`right`). It is suitable for hierarchical layouts or scenarios that require a unified outgoing direction.

### Configuration Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `side` | `'left' \| 'top' \| 'right' \| 'bottom'` | `'bottom'` | Outgoing direction |
| `padding` | `number \| SideOptions` | `40` | Distance from the outgoing point to the node |

### Example

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({ container: 'container' });

const source = graph.addNode({
  shape: 'rect',
  x: 50,
  y: 50,
  width: 100,
  height: 40,
  label: 'Source',
  attrs: { body: { fill: '#fff', stroke: '#8f8f8f', rx: 6, ry: 6 } },
});

const target = graph.addNode({
  shape: 'rect',
  x: 300,
  y: 200,
  width: 100,
  height: 40,
  label: 'Target',
  attrs: { body: { fill: '#fff', stroke: '#8f8f8f', rx: 6, ry: 6 } },
});

// The edge enters and exits from the bottom
graph.addEdge({
  source,
  target,
  router: {
    name: 'oneside',
    args: {
      side: 'bottom',
      padding: 50,
    },
  },
  attrs: {
    line: { stroke: '#5b8ff9', strokeWidth: 2, targetMarker: 'classic' },
  },
});

// The edge enters and exits from the right
graph.addEdge({
  source,
  target,
  router: {
    name: 'oneside',
    args: {
      side: 'right',
      padding: 30,
    },
  },
  attrs: {
    line: { stroke: '#52c41a', strokeWidth: 2, targetMarker: 'classic' },
  },
});
```

### How It Works

The OneSide router:
1. Moves the source and target connection points outside the specified side of the node
2. Keeps an orthogonal path
3. Automatically aligns the outgoing points when the two nodes' outgoing points are on the same horizontal or vertical line

---

## Loop Router

Used for self-loop edges where `source` and `target` are the same node, or where `sourceAnchor` and `targetAnchor` are the same.

### Configuration Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `width` | `number` | `50` | Width of the self-loop (distance to the node center) |
| `height` | `number` | `80` | Height of the self-loop (arc span) |
| `angle` | `'auto' \| number` | `'auto'` | Self-loop direction angle. `'auto'` automatically finds a direction that does not overlap the node |
| `merge` | `boolean \| number` | - | Whether to merge the start and end points into the same anchor |

### Example: Self-Loop Edge

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({ container: 'container' });

const node = graph.addNode({
  shape: 'rect',
  x: 150,
  y: 100,
  width: 100,
  height: 50,
  label: 'State A',
  attrs: { body: { fill: '#fff', stroke: '#8f8f8f', rx: 6, ry: 6 } },
});

// Self-loop edge: source and target point to the same node
graph.addEdge({
  source: node,
  target: node,
  router: {
    name: 'loop',
    args: {
      width: 60,
      height: 100,
      angle: 'auto',
    },
  },
  connector: { name: 'loop' },
  label: 'Retry',
  attrs: {
    line: { stroke: '#f5222d', strokeWidth: 2, targetMarker: 'classic' },
  },
});
```

### Example: Self-Loop with a Specified Angle

```javascript
// The self-loop exits from the top (angle: -90 means top direction)
graph.addEdge({
  source: node,
  target: node,
  router: {
    name: 'loop',
    args: {
      width: 50,
      height: 80,
      angle: -90,
    },
  },
  connector: { name: 'loop' },
  attrs: {
    line: { stroke: '#722ed1', strokeWidth: 2, targetMarker: 'classic' },
  },
});
```

### Angle Reference

- `0`: right
- `90`: bottom
- `180` or `-180`: left
- `-90` or `270`: top
- `'auto'`: automatically selects a direction that does not overlap the node BBox

---

## Router Shorthand and Object Form

```javascript
// Shorthand (when there are no arguments)
graph.addEdge({ source, target, router: 'orth' });

// Object form (when arguments are needed)
graph.addEdge({
  source,
  target,
  router: {
    name: 'manhattan',
    args: {
      padding: 20,
      excludeShapes: ['group'],
    },
  },
});
```

---

## Common Errors and Fixes

### Error 1: Self-loop edges do not use the loop router

```javascript
// ❌ Error: using the orth router for a self-loop edge produces an edge with length 0
graph.addEdge({ source: node, target: node, router: 'orth' });

// ✅ Correct: use the loop router plus the loop connector for self-loop edges
graph.addEdge({
  source: node,
  target: node,
  router: { name: 'loop', args: { width: 50,  height: 80 } },
  connector: { name: 'loop' },
});
```

### Error 2: The `side` value for oneside is misspelled

```javascript
// ❌ Error: side value is misspelled
router: { name: 'oneside', args: { side: 'buttom' } }

// ✅ Correct: side must be 'top' | 'bottom' | 'left' | 'right'
router: { name: 'oneside', args: { side: 'bottom' } }
```

### Error 3: Incorrect custom-node registration causes rendering failures

```javascript
// ❌ Error: registering a node with Shape.Rectangle.define may cause define to be undefined
Shape.Rectangle.define({
  shape: 'custom-node',
  width: 80,
  height: 40,
  attrs: {
    body: { fill: '#fff', stroke: '#000' },
    label: { text: '', fill: '#333' },
  },
});

// ✅ Correct: use Graph.registerNode to register custom nodes
Graph.registerNode(
  'custom-node',
  {
    inherit: 'rect',
    width: 100,
    height: 40,
    markup: [
      { tagName: 'rect', selector: 'body' },
      { tagName: 'text', selector: 'label' },
    ],
    attrs: {
      body: {
        stroke: '#8f8f8f',
        strokeWidth: 1,
        fill: '#fff',
        rx: 6,
        ry: 6,
      },
    },
  },
  true,
);
```

### Error 4: The orth router does not take effect or fails to avoid obstacles

```javascript
// ❌ Error: router is not set correctly or required graph configuration is missing
graph.addEdge({
  source: sourceNode,
  target: targetNode,
  router: 'orth',
});

// ✅ Correct: enable the router during graph initialization and set it explicitly in addEdge
const graph = new Graph({
  container: 'container',
  connecting: {
    router: 'orth',
  },
});

graph.addEdge({
  source,
  target,
  router: 'orth',
});
```
