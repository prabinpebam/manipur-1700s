---
id: "g6-node-diamond-ellipse-hexagon"
title: "G6 Polygonal Shape Nodes (Diamond / Ellipse / Hexagon)"
description: |
  Use diamond, ellipse, and hexagon nodes to create graph visualizations.
  Suitable for flowchart decision nodes, emphasizing vertical relationships, honeycomb layouts, and similar scenarios.

library: "g6"
version: "5.x"
category: "elements"
subcategory: "nodes"
tags:
  - "node"
  - "diamond"
  - "ellipse"
  - "hexagon"
  - "diamond"
  - "ellipse"
  - "hexagon"

related:
  - "g6-node-circle"
  - "g6-node-rect"
  - "g6-state-overview"

use_cases:
  - "Flowchart decision nodes (diamond)"
  - "Honeycomb layouts (hexagon)"
  - "Emphasizing vertical relationships (ellipse)"

difficulty: "beginner"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
---

## Diamond node (diamond)

Diamond nodes are commonly used as decision nodes in flowcharts.

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  width: 640,
  height: 480,
  data: {
    nodes: [
       { id: 'start', data: { label: 'Start' } },
       { id: 'decision', data: { label: 'Condition met?' } },
       { id: 'yes', data: { label: 'Execute A' } },
       { id: 'no', data: { label: 'Execute B' } },
    ],
    edges: [
       { source: 'start', target: 'decision' },
       { source: 'decision', target: 'yes', data: { label: 'Yes' } },
       { source: 'decision', target: 'no', data: { label: 'No' } },
    ],
  },
  node: {
    // specify different types by node ID through a callback
    type: (d) => (d.id === 'decision' ? 'diamond' : 'rect'),
    style: {
      size: (d) => (d.id === 'decision' ? 60 : [100, 40]),
      fill: (d) => (d.id === 'decision' ? '#faad14' : '#1783FF'),
      stroke: '#fff',
      lineWidth: 2,
      labelText: (d) => d.data.label,
      labelPlacement: 'center',
      labelFill: '#fff',
      labelFontSize: 12,
    },
  },
  edge: {
    style: {
      endArrow: true,
      labelText: (d) => d.data.label,
      labelBackground: true,
    },
  },
  layout: { type: 'dagre', rankdir: 'TB', nodesep: 30, ranksep: 40 },
  behaviors: ['drag-canvas', 'zoom-canvas'],
});

graph.render();
```

### Diamond style properties

| Property | Type | Description |
|------|------|------|
| `size` | `number` | Overall node size, controlling width and height |
| `fill` | `string` | Fill color |
| `stroke` | `string` | Stroke color |
| `lineWidth` | `number` | Stroke width |

---

## Ellipse node (ellipse)

The default size of an ellipse node is [45, 35]. It is suitable for database entities (ER diagrams) and similar scenarios.

```javascript
node: {
  type: 'ellipse',
  style: {
    size: [80, 50],          // [width, height]
    fill: '#722ED1',
    stroke: '#fff',
    lineWidth: 2,
    labelText: (d) => d.data.label,
    labelPlacement: 'center',
    labelFill: '#fff',
  },
},
```

### Ellipse-specific properties

| Property | Type | Description |
|------|------|------|
| `size` | `[number, number]` | `[width, height]`, corresponding to rx*2 and ry*2 respectively |

---

## Hexagon node (hexagon)

Hexagon nodes are suitable for honeycomb layouts and provide good space utilization.

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  width: 640,
  height: 480,
  data: {
    nodes: Array.from({ length: 12 }, (_, i) => ({
      id: `h${i}`,
           { label: `Region${i + 1}`, value: Math.random() * 100 },
    })),
    edges: [],
  },
  node: {
    type: 'hexagon',
    style: {
      size: 60,              // circumcircle radius * 2
      fill: (d) => {
        const level = Math.floor(d.data.value / 33);
        return ['#52c41a', '#faad14', '#ff4d4f'][level] || '#1783FF';
      },
      stroke: '#fff',
      lineWidth: 2,
      labelText: (d) => d.data.label,
      labelPlacement: 'center',
      labelFill: '#fff',
      labelFontSize: 11,
    },
  },
  layout: { type: 'grid', cols: 4 },
  behaviors: ['drag-canvas', 'zoom-canvas'],
});

graph.render();
```

### Hexagon-specific properties

| Property | Type | Description |
|------|------|------|
| `size` | `number` | Equivalent to `outerR * 2` (circumcircle diameter) |

---

## Common errors

### Error: Setting an array size for diamond/hexagon

```javascript
// Incorrect: diamond/hexagon/star/triangle only accept a single numeric value
node: {
  type: 'diamond',
  style: { size: [60, 40] },
}

// Correct
node: {
  type: 'diamond',
  style: { size: 60 },
}

// Only ellipse/rect support a [width, height] array
node: {
  type: 'ellipse',
  style: { size: [80, 50] },
}
```