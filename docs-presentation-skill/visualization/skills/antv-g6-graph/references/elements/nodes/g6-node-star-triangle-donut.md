---
id: "g6-node-star-triangle-donut"
title: "G6 Special Shape Nodes (Star / Triangle / Donut)"
description: |
  Use star, triangle, and donut progress nodes.
  Suitable for special annotations, direction indicators, progress displays, and similar scenarios.

library: "g6"
version: "5.x"
category: "elements"
subcategory: "nodes"
tags:
  - "node"
  - "star"
  - "triangle"
  - "donut"
  - "star"
  - "triangle"
  - "donut"

related:
  - "g6-node-circle"
  - "g6-node-diamond-ellipse-hexagon"

difficulty: "intermediate"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
---

## Star node (star)

Star nodes are suitable for scenarios such as ratings, favorites, and important markers.

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  width: 640,
  height: 480,
  data: {
    nodes: [
       { id: 's1', data: { label: 'Important', level: 1 } },
       { id: 's2', data: { label: 'Normal', level: 0 } },
       { id: 's3', data: { label: 'Critical', level: 2 } },
    ],
    edges: [
       { source: 's1', target: 's2' },
       { source: 's2', target: 's3' },
    ],
  },
  node: {
    type: 'star',
    style: {
      size: 60,                          // circumcircle diameter
      fill: (d) => (d.data.level > 0 ? '#faad14' : '#ddd'),
      stroke: '#d48806',
      lineWidth: 2,
      labelText: (d) => d.data.label,
      labelPlacement: 'bottom',
    },
  },
  layout: { type: 'circular' },
  behaviors: ['drag-canvas', 'zoom-canvas'],
});

graph.render();
```

### Star-specific properties

| Property | Type | Default | Description |
|------|------|--------|------|
| `size` | `number` | `32` | Circumcircle diameter |

> The inner radius is automatically calculated as `outerR * 3/8`; no manual configuration is required.

---

## Triangle node (triangle)

Triangle nodes support four directions and can be used to represent direction or flow.

```javascript
node: {
  type: 'triangle',
  style: {
    size: 50,
    direction: 'up',             // 'up' | 'down' | 'left' | 'right'
    fill: '#1783FF',
    stroke: '#fff',
    lineWidth: 2,
    labelText: (d) => d.data.label,
    labelPlacement: 'bottom',
  },
},
```

### Triangle-specific properties

| Property | Type | Default | Description |
|------|------|--------|------|
| `size` | `number` | `40` | Node size |
| `direction` | `'up' \| 'down' \| 'left' \| 'right'` | `'up'` | Triangle orientation |

---

## Donut progress node (donut)

A donut node overlays one or more donut segments on top of a circle and is suitable for displaying multidimensional proportion data.

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  width: 640,
  height: 480,
  data: {
    nodes: [
      {
        id: 'n1',
        data: {
          label: 'Server A',
          cpu: 60,
          memory: 30,
          disk: 10,
        },
      },
      {
        id: 'n2',
        data: {
          label: 'Server B',
          cpu: 20,
          memory: 50,
          disk: 30,
        },
      },
    ],
    edges: [{ source: 'n1', target: 'n2' }],
  },
  node: {
    type: 'donut',
    style: {
      size: 80,
      fill: '#f0f0f0',
      stroke: '#d9d9d9',
      lineWidth: 1,
      // donuts: numeric values for each segment (automatically normalized to proportions)
      donuts: (d) => [d.data.cpu, d.data.memory, d.data.disk],
      // custom segment colors (donutPalette can also use a palette)
      donutPalette: ['#ff4d4f', '#1890ff', '#52c41a'],
      // inner radius, default '50%' (relative to size)
      innerR: '40%',
      labelText: (d) => d.data.label,
      labelPlacement: 'bottom',
    },
  },
  layout: { type: 'circular' },
  behaviors: ['drag-canvas', 'zoom-canvas'],
});

graph.render();
```

### Donut-specific properties

| Property | Type | Default | Description |
|------|------|--------|------|
| `donuts` | `number[] \| DonutRound[] \| ((d) => number[])` | `[]` | Numeric values for each segment, automatically normalized |
| `donutPalette` | `string \| string[]` | `'tableau'` | Segment colors; supports built-in palette names |
| `innerR` | `number \| string` | `'50%'` | Inner radius, percentage or px |

### DonutRound object format

```typescript
interface DonutRound {
  value: number;
  color?: string;       // higher priority than donutPalette
  label?: string;       // segment label (not displayed in the current version)
}

// Use object format
donuts: (d) => [
    { value: d.data.cpu,    color: '#ff4d4f' },
    { value: d.data.memory, color: '#1890ff' },
    { value: d.data.disk,   color: '#52c41a' },
],
```

---

## Common errors

### Error: Donut is not displayed when donuts is set to 0

```javascript
// Incorrect: if all donut values are 0, the donut will not render
donuts: [0, 0, 0]

// Correct: ensure at least one nonzero value
donuts: (d) => [d.data.a || 1, d.data.b, d.data.c]
```