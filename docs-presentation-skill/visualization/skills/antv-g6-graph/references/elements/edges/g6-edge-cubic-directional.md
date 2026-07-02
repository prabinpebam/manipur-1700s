---
id: "g6-edge-cubic-directional"
title: "G6 Directional Cubic Bezier Curve Edge (cubic-horizontal / cubic-vertical)"
description: |
  cubic-horizontal: a horizontal-direction cubic Bezier curve whose control points are distributed along the horizontal direction, suitable for horizontal flowcharts (LR direction).
  cubic-vertical: a vertical-direction cubic Bezier curve whose control points are distributed along the vertical direction, suitable for vertical hierarchical graphs (TB direction).
  Both are directional variants of cubic edges and are used with dagre/antv-dagre LR and TB layouts respectively.

library: "g6"
version: "5.x"
category: "elements"
subcategory: "edges"
tags:
  - "cubic-horizontal"
  - "cubic-vertical"
  - "Bezier curve"
  - "directed edge"
  - "flowchart edge"
  - "hierarchical graph edge"

related:
  - "g6-edge-cubic"
  - "g6-layout-dagre"
  - "g6-pattern-flow-chart"

difficulty: "beginner"
completeness: "full"
created: "2026-04-16"
updated: "2026-04-16"
---

## Edge type comparison

| Type | Direction | Control point axis | Best layout pairing |
|------|------|---------|-------------|
| `cubic` | Any | Between the two endpoints | General |
| `cubic-horizontal` | Horizontal (left to right) | X axis | dagre `rankdir: 'LR'` |
| `cubic-vertical` | Vertical (top to bottom) | Y axis | dagre `rankdir: 'TB'` |

---

## Horizontal cubic Bezier curve (cubic-horizontal)

The control points are mainly distributed along the X-axis direction and ignore Y-axis changes, producing a horizontal S-shaped curve. It is suitable for horizontal flowcharts.

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  data: {
    nodes: [
      { id: 'start', data: { label: 'Start' } },
      { id: 'process', data: { label: 'Process' } },
      { id: 'decision', data: { label: 'Decision' } },
      { id: 'end', data: { label: 'End' } },
    ],
    edges: [
      { source: 'start', target: 'process' },
      { source: 'process', target: 'decision' },
      { source: 'decision', target: 'end' },
    ],
  },
  node: {
    type: 'rect',
    style: {
      size: [80, 36],
      fill: '#e6f7ff',
      stroke: '#1783FF',
      radius: 4,
      labelText: (d) => d.data.label,
      labelPlacement: 'center',
      // Set connection points on the left and right sides
      ports: [{ placement: 'right' }, { placement: 'left' }],
    },
  },
  edge: {
    type: 'cubic-horizontal',    // horizontal cubic Bezier curve
    style: {
      stroke: '#1783FF',
      lineWidth: 1.5,
      endArrow: true,
      labelText: (d) => d?.data?.label,
      labelBackground: true,
    },
  },
  layout: {
    type: 'antv-dagre',
    rankdir: 'LR',           // left to right, paired with cubic-horizontal
    nodesep: 20,
    ranksep: 100,
  },
  behaviors: ['drag-canvas', 'zoom-canvas'],
});

graph.render();
```

### Style configuration parameters

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `curvePosition` | `number \| [number, number]` | `[0.5, 0.5]` | Relative position of the control point on the endpoint connection line (0-1) |
| `curveOffset` | `number \| [number, number]` | `[0, 0]` | Offset distance of the control point from the endpoint connection line (px) |

General edge style parameters (inherited from BaseEdge):

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `stroke` | `string` | - | Edge color |
| `lineWidth` | `number` | `1` | Line width |
| `endArrow` | `boolean` | `false` | Whether to show the target arrow |
| `startArrow` | `boolean` | `false` | Whether to show the source arrow |
| `lineDash` | `number[]` | - | Dashed line style |
| `labelText` | `string \| Function` | - | Label text |
| `labelBackground` | `boolean` | `false` | Whether to show the label background |

---

## Vertical cubic Bezier curve (cubic-vertical)

The control points are mainly distributed along the Y-axis direction and ignore X-axis changes, producing a vertical S-shaped curve. It is suitable for vertical hierarchical graphs and org charts.

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  width: 600,
  height: 700,
  data: {
    nodes: [
      { id: 'ceo', data: { label: 'CEO' } },
      { id: 'cto', data: { label: 'CTO' } },
      { id: 'cfo', data: { label: 'CFO' } },
      { id: 'dev1', data: { label: 'Frontend Team' } },
      { id: 'dev2', data: { label: 'Backend Team' } },
      { id: 'finance', data: { label: 'Finance Department' } },
    ],
    edges: [
      { source: 'ceo', target: 'cto' },
      { source: 'ceo', target: 'cfo' },
      { source: 'cto', target: 'dev1' },
      { source: 'cto', target: 'dev2' },
      { source: 'cfo', target: 'finance' },
    ],
  },
  node: {
    type: 'rect',
    style: {
      size: [100, 36],
      fill: '#f6ffed',
      stroke: '#52c41a',
      radius: 4,
      labelText: (d) => d.data.label,
      labelPlacement: 'center',
      // Set connection points on the top and bottom sides
      ports: [{ placement: 'top' }, { placement: 'bottom' }],
    },
  },
  edge: {
    type: 'cubic-vertical',    // vertical cubic Bezier curve
    style: {
      stroke: '#52c41a',
      lineWidth: 1.5,
      endArrow: true,
    },
  },
  layout: {
    type: 'antv-dagre',
    rankdir: 'TB',          // top to bottom, paired with cubic-vertical
    nodesep: 40,
    ranksep: 80,
  },
  behaviors: ['drag-canvas', 'zoom-canvas'],
});

graph.render();
```

---

## Adjusting curvature

```javascript
edge: {
  type: 'cubic-horizontal',
  style: {
    // curvePosition: control point position (0-1), 0.5 means the midpoint of the two endpoints
    curvePosition: 0.3,        // single value: both control points use the same position
    // curvePosition: [0.4, 0.6], // array: control the two control points separately

    // curveOffset: control point offset (px); positive values bend to one side, negative values to the other
    curveOffset: 30,           // increase curvature
  },
}
```

---

## State styles

```javascript
edge: {
  type: 'cubic-horizontal',
  style: {
    stroke: '#d9d9d9',
    lineWidth: 1,
    endArrow: true,
  },
  state: {
    selected: {
      stroke: '#1783FF',
      lineWidth: 2,
      shadowColor: 'rgba(24,131,255,0.3)',
      shadowBlur: 8,
    },
    active: {
      stroke: '#40a9ff',
      lineWidth: 2,
    },
    inactive: {
      stroke: '#f0f0f0',
      lineWidth: 1,
    },
  },
},
```

---

## Selection guide

```javascript
// Horizontal flowchart (left to right)
// dagre rankdir: 'LR' + edge type: 'cubic-horizontal'
// node ports: [{placement:'right'}, {placement:'left'}]

// Vertical hierarchical graph (top to bottom)
// dagre rankdir: 'TB' + edge type: 'cubic-vertical'
// node ports: [{placement:'top'}, {placement:'bottom'}]

// General arc-shaped connection (not direction-dependent)
// edge type: 'cubic' (default)

// Orthogonal polyline (flowchart style)
// edge type: 'polyline'
```