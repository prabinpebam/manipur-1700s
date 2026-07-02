---
id: "g6-layout-force"
title: "G6 Force-Directed Layout"
description: |
  Use force-directed layouts (force / d3-force / fruchterman) to automatically arrange nodes.
  Based on physical simulation, nodes repel each other and edges attract connected nodes until equilibrium is reached.

library: "g6"
version: "5.x"
category: "layouts"
subcategory: "force"
tags:
  - "layout"
  - "force-directed"
  - "force"
  - "d3-force"
  - "fruchterman"
  - "network"
  - "automatic layout"

related:
  - "g6-core-graph-init"
  - "g6-behavior-drag-element"
  - "g6-node-circle"

use_cases:
  - "Network relationship graphs"
  - "Social graphs"
  - "Knowledge graphs"
  - "Exploratory graph analysis"

anti_patterns:
  - "Force-directed calculation is slow when node count exceeds 1000; consider fruchterman or force-atlas2"
  - "Use dagre instead when a fixed hierarchical order is needed"
  - "Use compact-box or mindmap for tree data"

difficulty: "beginner"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
author: "antv-team"
source_url: "https://g6.antv.antgroup.com/manual/layout/force"
---

## Core concepts

Force-directed layouts simulate physical forces so the graph automatically reaches visual equilibrium:
- **Repulsion**: nodes repel each other to prevent overlap
- **Edge attraction**: edges pull connected nodes closer
- **Gravity**: pulls nodes toward the canvas center

> **Constraint:** `nodeStrength` must be a non-negative number (>= 0). Negative values can cause abnormal layout calculations or unpredictable node behavior.

G6 provides three force-directed layouts:
| Layout type | Characteristics |
|----------|------|
| `force` | Built into G6, intuitive parameters, sufficient for most scenarios |
| `d3-force` | Based on D3, rich force types, highly customizable |
| `fruchterman` | Good performance, supports GPU acceleration, suitable for large graphs |

## Minimal runnable example

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  data: {
    nodes: [
       { id: 'n1', data: { label: 'Node 1' } },
       { id: 'n2', data: { label: 'Node 2' } },
       { id: 'n3', data: { label: 'Node 3' } },
       { id: 'n4', data: { label: 'Node 4' } },
       { id: 'n5', data: { label: 'Node 5' } },
    ],
    edges: [
       { source: 'n1', target: 'n2' },
       { source: 'n1', target: 'n3' },
       { source: 'n2', target: 'n4' },
       { source: 'n3', target: 'n4' },
       { source: 'n4', target: 'n5' },
    ],
  },
  node: {
    type: 'circle',
    style: {
      size: 36,
      fill: '#1783FF',
      labelText: (d) => d.data.label,
      labelPlacement: 'bottom',
    },
  },
  edge: {
    type: 'line',
    style: { stroke: '#aaa', endArrow: true },
  },
  layout: {
    type: 'force',
    linkDistance: 100,
    gravity: 10,
  },
  behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
});

graph.render();
```

## Common variants

### G6 Force layout (full parameters)

```javascript
layout: {
  type: 'force',
  // Ideal edge length
  linkDistance: 100,
  // Gravity strength (the larger it is, the more nodes cluster toward the center)
  gravity: 10,
  // Coulomb repulsion distance scaling (smaller values increase the repulsion range and help spread nodes)
  coulombDisScale: 0.005,
  // Center point
  center: [400, 300],     // [x, y], defaults to canvas center
  // Maximum iterations
  maxIteration: 1000,
  // Damping coefficient (0-1; smaller values converge faster)
  damping: 0.9,
  // Minimum movement distance (values smaller than this are considered converged)
  minMovement: 0.5,
},
// preventOverlap / nodeSize are G6 v4 parameters and are silently ignored in the v5 force layout
// If overlap prevention is needed, use d3-force + collide instead (see the D3 Force example below)
```

### D3 Force layout

```javascript
layout: {
  type: 'd3-force',
  // Edge link force (spring effect)
  link: {
    distance: 100,         // Ideal edge length
    strength: 0.8,         // Force strength 0-1
  },
  // Repulsion between nodes (Coulomb repulsion)
  manyBody: {
    strength: -200,        // Negative values are repulsive; positive values are attractive
    distanceMax: 400,
  },
  // Pull toward the center
  center: {
    x: 0,
    y: 0,
    strength: 0.1,
  },
  // Collision detection (prevents overlap)
  collide: {
    radius: 30,
    strength: 0.5,
  },
  // Control iteration
  alpha: 0.5,
  alphaDecay: 0.028,
  alphaMin: 0.001,
},
```

### Fruchterman layout (recommended for large graphs)

```javascript
layout: {
  type: 'fruchterman',
  gravity: 1,
  speed: 5,
  clustering: true,              // Enable clustering
  clusterGravity: 10,
  // GPU acceleration (requires introducing the WebGL renderer)
  // workerEnabled: true,        // Run in a Web Worker
},
```

### Drag nodes in a force-directed graph

```javascript
// Dragging nodes in force-directed graphs requires drag-element-force
// This lets other nodes respond in real time during dragging
behaviors: [
  'drag-canvas',
  'zoom-canvas',
  'drag-element-force',  // Replaces ordinary drag-element
],
```

### Fix positions for some nodes

```javascript
// Fix positions by setting coordinates in node style
const nodes = [
   { id: 'center', data: { label: 'Center' }, style: { x: 400, y: 300 } },
   { id: 'n1', data: { label: 'Node 1' } },
   { id: 'n2', data: { label: 'Node 2' } },
];

// Or specify fixed nodes in layout configuration
layout: {
  type: 'force',
  // Callback function: nodes returning true will be fixed
  nodeFixable: (d) => d.id === 'center',
},
```

## Web Worker acceleration (large graphs)

```javascript
layout: {
  type: 'fruchterman',    // fruchterman supports GPU acceleration and is recommended for large graphs
  gravity: 1,
  speed: 5,
},
// G6 v5 force layout has removed workerEnabled; use fruchterman or force-atlas2 for large graphs
```

## Common errors

### Error 1: Ordinary dragging in a force-directed graph does not respond to the physical simulation

```javascript
// drag-element dragging does not affect the physical state of other nodes
behaviors: ['drag-element'],

// Use drag-element-force to preserve physical simulation
behaviors: ['drag-element-force'],
```

### Error 2: Nodes overlap in force layout -- v4 preventOverlap is ineffective

```javascript
// preventOverlap / nodeSize are G6 v4 parameters and are silently ignored in the G6 v5 force layout, so nodes still overlap
layout: {
  type: 'force',
  preventOverlap: true,   // Ineffective
  nodeSize: 40,           // Ineffective
},


// Use d3-force + collide collision detection instead (recommended)
layout: {
  type: 'd3-force',
  link: { distance: 100, strength: 0.8 },
  manyBody: { strength: -200 },
  collide: {
    radius: 25,     // Node radius (nodeSize / 2)
    strength: 0.7,
  },
},
```

### Error 3: Reading coordinates before the layout has converged

```javascript
// Reading coordinates immediately after render() may occur before layout completes
graph.render();
const pos = graph.getElementPosition('n1');  // May be inaccurate

// Wait for layout completion
await graph.render();
const pos = graph.getElementPosition('n1');  // Read after layout completes
```
