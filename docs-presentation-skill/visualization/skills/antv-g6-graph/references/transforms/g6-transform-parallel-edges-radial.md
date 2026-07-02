---
id: "g6-transform-parallel-edges-radial"
title: "G6 Data Transforms: Parallel Edge Processing + Radial Labels (process-parallel-edges / place-radial-labels)"
description: |
  process-parallel-edges: handles multiple parallel edges between two nodes, supporting bundle mode
  (expanded into arcs) and merge mode (collapsed into a single edge).
  place-radial-labels: automatically adjusts label angles and positions for radial layout graphs
  such as radial trees and radial compact trees to prevent label overlap.

library: "g6"
version: "5.x"
category: "transforms"
subcategory: "data"
tags:
  - "process-parallel-edges"
  - "place-radial-labels"
  - "parallel edges"
  - "multiple edges"
  - "radial labels"
  - "transforms"
  - "data transforms"

related:
  - "g6-edge-quadratic-loop"
  - "g6-layout-advanced"
  - "g6-core-transforms-animation"

difficulty: "intermediate"
completeness: "full"
created: "2026-04-16"
updated: "2026-04-16"
---

## Parallel Edge Processing (process-parallel-edges)

When multiple edges exist between two nodes, this transform automatically processes the parallel edges to avoid overlap. It provides two modes:
- **bundle mode** (default): expands each edge into a quadratic Bezier curve with a different curvature.
- **merge mode**: merges multiple parallel edges into a single aggregated edge.

### Bundle Mode (bundle)

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  data: {
    nodes: [
      { id: 'A', style: { x: 100, y: 300 } },
      { id: 'B', style: { x: 400, y: 150 } },
      { id: 'C', style: { x: 700, y: 300 } },
    ],
    edges: [
      // A->B has 5 parallel edges
      ...Array.from({ length: 5 }, (_, i) => ({
        id: `AB-${i}`,
        source: 'A',
        target: 'B',
        data: { label: `Relationship ${i + 1}` },
      })),
      // Bidirectional edges are also supported
      { source: 'A', target: 'C' },
      { source: 'C', target: 'A' },
    ],
  },
  node: {
    style: {
      labelText: (d) => d.id,
      ports: [{ placement: 'center' }],
    },
  },
  edge: {
    // Warning: in bundle mode, do not set a global edge.type here.
    // process-parallel-edges automatically sets the type of parallel edges to quadratic.
    style: {
      labelText: (d) => d?.data?.label,
      endArrow: true,
    },
  },
  behaviors: ['drag-element', 'drag-canvas', 'zoom-canvas'],
  transforms: [
    {
      type: 'process-parallel-edges',
      mode: 'bundle',   // Defaults to bundle
      distance: 20,     // Distance between edges in bundle mode (px)
    },
  ],
});

graph.render();
```

> **Important:** bundle mode forces the parallel edge type to `quadratic`, so you cannot set a global edge type in `edge.type`; otherwise, it will override the bundle processing result.

### Merge Mode (merge)

```javascript
const graph = new Graph({
  // ...
  edge: {
    style: {
      labelText: (d) => `${d.source}->${d.target}`,
      endArrow: true,
    },
  },
  transforms: [
    {
      type: 'process-parallel-edges',
      mode: 'merge',        // Merge into a single aggregated edge
      style: {              // Additional style for the merged edge
        stroke: '#ff7a45',
        lineWidth: 3,
        halo: true,
        haloOpacity: 0.3,
        haloStroke: '#ff7a45',
      },
    },
  ],
});
```

> Note: merged styles are assigned to `datum.style`, which has lower priority than `edge.style` (the default style in the Graph configuration).

### process-parallel-edges Configuration Parameters

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `type` | `string` | `'process-parallel-edges'` | Transform type |
| `key` | `string` | - | Unique identifier for dynamic updates |
| `mode` | `'bundle' \| 'merge'` | `'bundle'` | Processing mode |
| `distance` | `number` | `15` | Edge spacing in bundle mode (px) |
| `edges` | `string[]` | - | IDs of the edges to process (all by default) |
| `style` | `PathStyleProps \| Function` | - | Aggregated edge style in merge mode |

### Shorthand Form

```javascript
// Use the default configuration (bundle mode, distance=15)
transforms: ['process-parallel-edges']

// Dynamically update the configuration
graph.updateTransform({ key: 'parallel', mode: 'bundle', distance: 30 });
```

---

## Radial Labels (place-radial-labels)

This automatic label placement transform is designed for radial layouts such as `radial` and `dendrogram`. It adjusts label positions and rotation angles based on each node's angle in the circular layout to keep labels readable.

```javascript
import { Graph, treeToGraphData } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  autoFit: 'view',
  data: treeToGraphData({
    id: 'root',
    children: [
      { id: 'a1', children: [{ id: 'a1-1' }, { id: 'a1-2' }] },
      { id: 'a2', children: [{ id: 'a2-1' }] },
      { id: 'a3', children: [{ id: 'a3-1' }, { id: 'a3-2' }, { id: 'a3-3' }] },
      { id: 'b1' },
      { id: 'b2', children: [{ id: 'b2-1' }, { id: 'b2-2' }] },
    ],
  }),
  node: {
    style: {
      size: 8,
      labelText: (d) => d.id,
      labelFontSize: 12,
    },
  },
  layout: {
    type: 'dendrogram',    // Or 'compact-box' with radial
    radial: true,
  },
  transforms: [
    {
      type: 'place-radial-labels',
      offset: 4,           // Label offset from the node (px)
    },
  ],
  behaviors: ['drag-canvas', 'zoom-canvas'],
});

graph.render();
```

### place-radial-labels Configuration Parameters

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `type` | `string` | `'place-radial-labels'` | Transform type |
| `offset` | `number` | - | Additional label offset from the node (px) |

### Complete Radial Tree Example

```javascript
import { Graph, treeToGraphData } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  autoFit: 'view',
  data: treeToGraphData({
    id: 'Root Node',
    children: Array.from({ length: 6 }, (_, i) => ({
      id: `Branch ${i + 1}`,
      children: Array.from({ length: 3 }, (_, j) => ({
        id: `${i + 1}-${j + 1}`,
      })),
    })),
  }),
  node: {
    type: 'circle',
    style: {
      size: 10,
      fill: '#1783FF',
      labelText: (d) => d.id,
      labelFontSize: 11,
      labelFill: '#333',
    },
  },
  edge: {
    type: 'line',
    style: { stroke: '#aaa', lineWidth: 1 },
  },
  layout: {
    type: 'radial',          // Radial layout
    unitRadius: 120,
    preventOverlap: true,
    nodeSize: 20,
  },
  transforms: [
    {
      type: 'place-radial-labels',
      offset: 4,
    },
  ],
  behaviors: ['drag-canvas', 'zoom-canvas'],
});

graph.render();
```

---

## Combined Usage: Bidirectional Graph + Parallel Edge Processing

```javascript
import { Graph } from '@antv/g6';

// Microservice dependency graph: A calls multiple APIs on B, and B returns responses.
const graph = new Graph({
  container: 'container',
  data: {
    nodes: [
      { id: 'service-a', data: { label: 'Service A' } },
      { id: 'service-b', data: { label: 'Service B' } },
      { id: 'service-c', data: { label: 'Service C' } },
    ],
    edges: [
      { source: 'service-a', target: 'service-b', data: { label: 'API /users' } },
      { source: 'service-a', target: 'service-b',  { label: 'API /orders' } },
      { source: 'service-b', target: 'service-a', data: { label: 'Response' } },
      { source: 'service-b', target: 'service-c', data: { label: 'Query' } },
      { source: 'service-c', target: 'service-b',  { label: 'Result' } },
    ],
  },
  node: {
    type: 'rect',
    style: {
      size: [120, 40],
      fill: '#e6f7ff',
      stroke: '#1783FF',
      labelText: (d) => d.data.label,
      labelPlacement: 'center',
      ports: [{ placement: 'center' }],
    },
  },
  edge: {
    style: {
      labelText: (d) => d?.data?.label,
      labelBackground: true,
      endArrow: true,
      stroke: '#1783FF',
    },
  },
  layout: { type: 'force', linkDistance: 200 },
  behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
  transforms: [
    {
      type: 'process-parallel-edges',
      mode: 'bundle',
      distance: 25,
    },
  ],
});

graph.render();
```
