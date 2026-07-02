---
id: "g6-edge-cubic"
title: "G6 Cubic Bezier Curve Edge (Cubic Edge)"
description: |
  Use cubic Bezier curve edges (cubic) to connect nodes with smooth curves, suitable for any layout.
  Provides three variants: cubic, cubic-horizontal, and cubic-vertical.

library: "g6"
version: "5.x"
category: "elements"
subcategory: "edges"
tags:
  - "edge"
  - "curve"
  - "cubic"
  - "Bezier"
  - "bezier"
  - "edge"

related:
  - "g6-edge-line"
  - "g6-edge-polyline"
  - "g6-layout-dagre"

use_cases:
  - "General graph shapes (works with all layouts)"
  - "Hierarchical graph edges (cubic-vertical with dagre TB)"
  - "Horizontal flowcharts (cubic-horizontal with dagre LR)"
  - "Parallel edge scenarios"

anti_patterns:
  - "Use cubic-vertical or cubic-horizontal for tree-shaped graphs; do not use polyline"
  - "Curves increase visual complexity when edges are very dense; consider the edge-bundling plugin"

difficulty: "intermediate"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
author: "antv-team"
source_url: "https://g6.antv.antgroup.com/manual/element/edge/cubic"
---

## Core concepts

`cubic` uses a cubic Bezier curve to connect two points. It is more visually pleasing than a straight line and works with arbitrary node positions.

**Three variants:**
- `cubic`: a general curve, suitable for all layouts
- `cubic-horizontal`: a horizontal S-shaped curve, used with LR/RL layouts
- `cubic-vertical`: a vertical S-shaped curve, used with TB/BT layouts

**Key parameters for controlling curvature:**
- `curveOffset`: the degree of curve bending (positive and negative values control direction)
- `curvePosition`: control point position (0-1)
- `controlPoints`: custom control point coordinates

## Minimal runnable example

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  width: 640,
  height: 480,
  data: {
    nodes: [
       { id: 'n1', data: { label: 'A' } },
       { id: 'n2', data: { label: 'B' } },
       { id: 'n3', data: { label: 'C' } },
    ],
    edges: [
       { source: 'n1', target: 'n2' },
       { source: 'n2', target: 'n3' },
       { source: 'n3', target: 'n1' },  // loopback edge
    ],
  },
  node: {
    type: 'circle',
    style: {
      size: 40,
      fill: '#1783FF',
      labelText: (d) => d.data.label,
      labelPlacement: 'center',
      labelFill: '#fff',
    },
  },
  edge: {
    type: 'cubic',                 // general curve
    style: {
      stroke: '#aaa',
      lineWidth: 1.5,
      endArrow: true,
    },
  },
  layout: { type: 'circular', radius: 150 },
  behaviors: ['drag-canvas', 'zoom-canvas'],
});

graph.render();
```

## Common variants

### Vertical hierarchical graph (with dagre TB)

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  data: {
    nodes: [
       { id: 'root', data: { label: 'Root Node' } },
       { id: 'a', data: { label: 'Child Node A' } },
       { id: 'b', data: { label: 'Child Node B' } },
       { id: 'c', data: { label: 'Child Node C' } },
    ],
    edges: [
       { source: 'root', target: 'a' },
       { source: 'root', target: 'b' },
       { source: 'root', target: 'c' },
    ],
  },
  node: {
    type: 'rect',
    style: {
      size: [100, 36],
      radius: 4,
      fill: '#f0f5ff',
      stroke: '#adc6ff',
      labelText: (d) => d.data.label,
      labelPlacement: 'center',
    },
  },
  edge: {
    type: 'cubic-vertical',       // vertical S-shaped curve
    style: {
      stroke: '#adc6ff',
      endArrow: true,
    },
  },
  layout: {
    type: 'dagre',
    rankdir: 'TB',
    ranksep: 60,
    nodesep: 20,
  },
  behaviors: ['drag-canvas', 'zoom-canvas'],
});
```

### Horizontal flowchart (with dagre LR)

```javascript
edge: {
  type: 'cubic-horizontal',      // horizontal S-shaped curve
  style: {
    stroke: '#91caff',
    lineWidth: 2,
    endArrow: {
      type: 'triangle',
      fill: '#91caff',
      size: 8,
    },
    labelText: (d) => d.data.label,
    labelBackground: true,
    labelBackgroundFill: '#fff',
    labelBackgroundOpacity: 0.9,
  },
},
layout: {
  type: 'dagre',
  rankdir: 'LR',                  // left to right
  ranksep: 80,
  nodesep: 30,
},
```

### Curved edges in a radial layout

```javascript
// cubic works best in radial layouts
edge: {
  type: 'cubic',
  style: {
    stroke: '#ccc',
    lineWidth: 1,
    endArrow: false,
    curveOffset: 30,              // control the curvature amplitude
  },
},
layout: {
  type: 'radial',
  unitRadius: 100,
  focusNode: 'center',
},
```

### Gradient edge

```javascript
// Use a linear gradient (requires gradient support from @antv/g)
edge: {
  type: 'cubic',
  style: {
    stroke: 'l(0) 0:#1783FF 1:#FF6B6B',  // gradient color
    lineWidth: 2,
    endArrow: true,
  },
},
```

## Common errors

### Error 1: Direction mismatch

```javascript
// Incorrect: cubic-vertical (vertical curve) is used with a dagre LR layout
layout: { type: 'dagre', rankdir: 'LR' },
edge: { type: 'cubic-vertical' },   // direction mismatch; the curve will not look good

// Correct: use cubic-horizontal for LR layouts
layout: { type: 'dagre', rankdir: 'LR' },
edge: { type: 'cubic-horizontal' },

// Correct: use cubic-vertical for TB layouts
layout: { type: 'dagre', rankdir: 'TB' },
edge: { type: 'cubic-vertical' },
```

### Error 2: Confusing the curveOffset direction

```javascript
// Positive curveOffset bends right/up; negative values bend left/down
edge: {
  type: 'cubic',
  style: {
    curveOffset: 50,   // positive value bends to one side
    // curveOffset: -50,  // negative value bends to the other side
  },
},
```