---
id: "g6-behavior-advanced"
title: "G6 Advanced Interaction Behaviors (fix-element-size / auto-adapt-label / drag-element-force)"
description: |
  fix-element-size: Keep specified elements (labels, borders, etc.) at a constant size during zooming.
  auto-adapt-label: Automatically hide overlapping labels when viewport space is insufficient.
  drag-element-force: Drag nodes in real time and update the layout in force-directed layouts.

library: "g6"
version: "5.x"
category: "behaviors"
subcategory: "interaction"
tags:
  - "interaction"
  - "fix-element-size"
  - "auto-adapt-label"
  - "drag-element-force"
  - "performance optimization"

related:
  - "g6-behavior-drag-element"
  - "g6-layout-force"

difficulty: "advanced"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
---

## Keep element sizes fixed during zooming (fix-element-size)

When users zoom out on the canvas, keep the absolute pixel sizes of key visual elements such as labels and borders unchanged so fonts do not become too small to read.

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  data: {
    nodes: Array.from({ length: 20 }, (_, i) => ({
      id: `n${i}`,
           { label: `Node ${i}` },
    })),
    edges: Array.from({ length: 15 }, (_, i) => ({
      source: `n${i % 10}`,
      target: `n${(i + 5) % 20}`,
    })),
  },
  node: {
    type: 'circle',
    style: {
      size: 36,
      fill: '#1783FF',
      stroke: '#fff',
      lineWidth: 2,
      labelText: (d) => d.data.label,
      labelPlacement: 'bottom',
      labelFontSize: 12,
    },
  },
  layout: { type: 'force', preventOverlap: true },
  behaviors: [
    'drag-canvas',
    'zoom-canvas',
    'drag-element',
    {
      type: 'fix-element-size',
      // Enable only when zooming out (zoom < 1)
      enable: (event) => event.data.scale < 1,
      // Fix the node label size
      node: [
         { shape: 'label' },                    // Fix labels (font size and position do not change with zoom)
         { shape: 'key', fields: ['lineWidth'] }, // Fix node border width
      ],
      // Fix edge labels and line width
      edge: [
         { shape: 'label' },
         { shape: 'key', fields: ['lineWidth'] },
         { shape: 'halo', fields: ['lineWidth'] },
      ],
    },
  ],
});

graph.render();
```

### fix-element-size configuration parameters

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `enable` | `boolean \| ((event) => boolean)` | `(e) => e.data.scale < 1` | Enable condition |
| `node` | `FixShapeConfig[]` | - | List of shapes in nodes to fix |
| `edge` | `FixShapeConfig[]` | - | List of shapes in edges to fix |
| `combo` | `FixShapeConfig[]` | - | List of shapes in combos to fix |
| `reset` | `boolean` | `false` | Whether to restore the original style on redraw |

**FixShapeConfig:**
```typescript
interface FixShapeConfig {
  shape: string;           // Shape name: 'key' | 'label' | 'halo' | 'icon' | ...
  fields?: string[];       // Fix only specific properties (such as lineWidth); if omitted, fix all
}
```

---

## Automatically hide overlapping labels (auto-adapt-label)

When viewport space is insufficient, automatically hide low-priority labels according to node importance (centrality) to avoid text overlap.

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  data: {
    nodes: Array.from({ length: 50 }, (_, i) => ({
      id: `n${i}`,
           { label: `Node ${i}`, degree: Math.floor(Math.random() * 10) },
    })),
    edges: Array.from({ length: 60 }, (_, i) => ({
      source: `n${i % 25}`,
      target: `n${(i * 3 + 7) % 50}`,
    })),
  },
  node: {
    type: 'circle',
    style: {
      size: 20,
      fill: '#1783FF',
      stroke: '#fff',
      labelText: (d) => d.data.label,
      labelPlacement: 'bottom',
      labelFontSize: 11,
    },
  },
  layout: { type: 'force', preventOverlap: true, nodeSize: 20 },
  behaviors: [
    'drag-canvas',
    'zoom-canvas',
    {
      type: 'auto-adapt-label',
      // Padding for label spacing detection (px)
      padding: 4,
      // Node importance sorting: use centrality; labels of higher-degree nodes are displayed first
      sortNode: {
        type: 'degree',              // 'degree' | 'betweenness' | 'closeness' | 'eigenvector'
        direction: 'both',           // 'in' | 'out' | 'both'
      },
      // Debounce delay (ms)
      throttle: 100,
    },
  ],
});

graph.render();
```

### auto-adapt-label configuration parameters

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `padding` | `number` | `0` | Extra spacing for label collision detection |
| `sortNode` | `NodeCentralityOptions \| SortFn` | `{ type: 'degree' }` | Node sorting (determines which labels are displayed first) |
| `sortEdge` | `SortFn` | - | Edge sorting function |
| `sortCombo` | `SortFn` | - | Combo sorting function |
| `throttle` | `number` | `100` | Debounce delay (ms) |

---

## Drag nodes in a force-directed layout (drag-element-force)

When a d3-force layout is running, dragging nodes also updates the layout force field to create a realistic physical effect.

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  data: {
    nodes: Array.from({ length: 20 }, (_, i) => ({
      id: `n${i}`,
           { label: `N${i}` },
    })),
    edges: Array.from({ length: 25 }, (_, i) => ({
      source: `n${i % 15}`,
      target: `n${(i * 2 + 3) % 20}`,
    })),
  },
  node: {
    type: 'circle',
    style: {
      size: 30,
      fill: '#1783FF',
      stroke: '#fff',
      labelText: (d) => d.data.label,
      labelPlacement: 'center',
      labelFill: '#fff',
    },
  },
  layout: {
    type: 'd3-force',              // Must use d3-force or d3-force-3d
    link: { distance: 80 },
    many: { strength: -200 },
  },
  behaviors: [
    'drag-canvas',
    'zoom-canvas',
    {
      type: 'drag-element-force',
      // true: after dragging, the node is fixed at the current position (no longer participates in layout)
      // false: after release, it continues to participate in the layout force field
      fixed: false,
    },
  ],
});

graph.render();
```

### drag-element-force configuration parameters

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `fixed` | `boolean` | `false` | Whether the node is fixed after the drag is released |

> **Note:** `drag-element-force` only supports `d3-force` / `d3-force-3d` layouts and is incompatible with the ordinary `force` layout. Use `drag-element` for ordinary force-directed graphs.
