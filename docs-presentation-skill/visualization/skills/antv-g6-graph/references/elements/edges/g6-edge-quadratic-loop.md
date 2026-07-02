---
id: "g6-edge-quadratic-loop"
title: "G6 Quadratic Bezier Edge and Self-loop Edge"
description: |
  Use quadratic edges to create lightweight arc-shaped effects; use loop edges to handle connections from a node to itself.
  quadratic has fewer control points than cubic and offers better performance.

library: "g6"
version: "5.x"
category: "elements"
subcategory: "edges"
tags:
  - "edge"
  - "quadratic curve"
  - "self-loop"
  - "quadratic"
  - "loop"

related:
  - "g6-edge-line"
  - "g6-edge-cubic"

difficulty: "intermediate"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
---

## Quadratic Bezier edge (quadratic)

`quadratic` is a lighter arc-shaped edge than `cubic` and has only one control point.

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  width: 640,
  height: 480,
  data: {
    nodes: [
       { id: 'a', data: { label: 'A' } },
       { id: 'b', data: { label: 'B' } },
       { id: 'c', data: { label: 'C' } },
    ],
    edges: [
       { source: 'a', target: 'b', data: { label: 'Forward' } },
       { source: 'b', target: 'a', data: { label: 'Reverse' } },  // reverse parallel edge
       { source: 'a', target: 'c', data: { label: 'Direct' } },
    ],
  },
  node: {
    type: 'circle',
    style: {
      size: 40,
      fill: '#1783FF',
      stroke: '#fff',
      labelText: (d) => d.data.label,
      labelPlacement: 'center',
      labelFill: '#fff',
    },
  },
  edge: {
    type: 'quadratic',
    style: {
      stroke: '#aaa',
      lineWidth: 1.5,
      endArrow: true,
      // curveOffset: controls arc size (positive bends right, negative bends left)
      curveOffset: 30,
      // curvePosition: relative control point position on the path (0-1), default 0.5
      curvePosition: 0.5,
      labelText: (d) => d.data.label,
      labelBackground: true,
    },
  },
  layout: { type: 'circular' },
  behaviors: ['drag-canvas', 'zoom-canvas'],
});

graph.render();
```

### Quadratic-specific properties

| Property | Type | Default | Description |
|------|------|--------|------|
| `curveOffset` | `number` | `30` | Control point offset distance (px), which controls curvature |
| `curvePosition` | `number` | `0.5` | Proportional control point position on the line segment (0-1) |
| `controlPoint` | `[number, number]` | - | Directly specify control point coordinates (overrides curveOffset/curvePosition) |

---

## Self-loop edge (loop)

When an edge has the same `source` and `target`, G6 automatically renders it as a self-loop.

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  width: 640,
  height: 480,
  data: {
    nodes: [
       { id: 'n1', data: { label: 'State A' } },
       { id: 'n2', data: { label: 'State B' } },
    ],
    edges: [
       { source: 'n1', target: 'n2', data: { label: 'Transition' } },
      // self-loop: source === target
       { source: 'n1', target: 'n1', data: { label: 'Self-loop' } },
       { source: 'n2', target: 'n2', data: { label: 'Stay' } },
    ],
  },
  node: {
    type: 'circle',
    style: {
      size: 50,
      fill: '#1783FF',
      stroke: '#fff',
      lineWidth: 2,
      labelText: (d) => d.data.label,
      labelPlacement: 'center',
      labelFill: '#fff',
    },
  },
  edge: {
    type: 'line',                   // use line for normal edges; self-loops are processed automatically by G6
    style: {
      stroke: '#aaa',
      lineWidth: 1.5,
      endArrow: true,
      labelText: (d) => d.data.label,
      labelBackground: true,
      // self-loop style properties
      loopPlacement: 'top',         // 'top' | 'bottom' | 'left' | 'right', etc.
      loopClockwise: true,          // clockwise
    },
  },
  layout: { type: 'circular', radius: 100 },
  behaviors: ['drag-canvas', 'zoom-canvas'],
});

graph.render();
```

### Loop style properties (effective when source === target)

| Property | Type | Default | Description |
|------|------|--------|------|
| `loopPlacement` | `'top' \| 'bottom' \| 'left' \| 'right' \| 'top-left' \| ...` | `'top'` | Self-loop direction |
| `loopClockwise` | `boolean` | `true` | Clockwise direction |
| `loopDist` | `number` | `20` | Distance from the self-loop to the node |

---

## Parallel edge processing

Multiple edges in the same direction overlap by default. Use the `process-parallel-edges` transform to separate them automatically:

```javascript
transforms: [
  {
    type: 'process-parallel-edges',
    offset: 15,                     // parallel edge spacing
  },
],
edge: {
  type: 'quadratic',                // recommended for displaying parallel edges
},
```