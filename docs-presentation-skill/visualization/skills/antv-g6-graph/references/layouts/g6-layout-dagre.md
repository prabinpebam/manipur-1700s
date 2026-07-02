---
id: "g6-layout-dagre"
title: "G6 Dagre Hierarchical Layout"
description: |
  Use the Dagre layout to automatically arrange DAGs (directed acyclic graphs) hierarchically.
  Supports top-bottom and left-right directions, suitable for flowcharts, organization charts, and dependency graphs.

library: "g6"
version: "5.x"
category: "layouts"
subcategory: "hierarchical"
tags:
  - "layout"
  - "hierarchy"
  - "dagre"
  - "directed graph"
  - "DAG"
  - "flowchart"
  - "organization chart"

related:
  - "g6-node-rect"
  - "g6-edge-cubic"
  - "g6-edge-polyline"
  - "g6-layout-force"

use_cases:
  - "Flowcharts"
  - "Dependency graphs"
  - "Workflow diagrams"
  - "Build dependency graphs"
  - "State machine diagrams"

anti_patterns:
  - "Cyclic graphs are not suitable for dagre (reverse edges will be ignored)"
  - "Use compact-box or mindmap for tree data"
  - "dagre is slower when the number of nodes exceeds 500"

difficulty: "beginner"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
author: "antv-team"
source_url: "https://g6.antv.antgroup.com/manual/layout/dagre"
---

## Core concepts

The Dagre layout automatically arranges directed acyclic graphs (DAGs) into layers:
- **rankdir**: arrangement direction (TB = top to bottom, LR = left to right)
- **ranksep**: spacing between layers
- **nodesep**: spacing between nodes in the same layer
- **ranker**: ranking algorithm (affects node assignment within layers)

## Minimal runnable example

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  data: {
    nodes: [
       { id: 'start', data: { label: 'Start' } },
       { id: 'step1', data: { label: 'Step 1' } },
       { id: 'step2', data: { label: 'Step 2' } },
       { id: 'step3', data: { label: 'Step 3' } },
       { id: 'end', data: { label: 'End' } },
    ],
    edges: [
       { source: 'start', target: 'step1' },
       { source: 'start', target: 'step2' },
       { source: 'step1', target: 'step3' },
       { source: 'step2', target: 'step3' },
       { source: 'step3', target: 'end' },
    ],
  },
  node: {
    type: 'rect',
    style: {
      size: [120, 40],
      radius: 4,
      fill: '#f0f5ff',
      stroke: '#adc6ff',
      labelText: (d) => d.data.label,
      labelPlacement: 'center',
    },
  },
  edge: {
    type: 'cubic-vertical',
    style: {
      stroke: '#adc6ff',
      endArrow: true,
    },
  },
  layout: {
    type: 'dagre',
    rankdir: 'TB',         // Top to bottom
    ranksep: 60,           // Layer spacing
    nodesep: 20,           // Node spacing
  },
  behaviors: ['drag-canvas', 'zoom-canvas'],
});

graph.render();
```

## Common variants

### Left-to-right flowchart

```javascript
layout: {
  type: 'dagre',
  rankdir: 'LR',            // Left to right
  ranksep: 80,
  nodesep: 30,
  align: 'UL',              // Node alignment mode
},
edge: {
  type: 'cubic-horizontal', // Works with LR direction
  style: {
    stroke: '#91caff',
    endArrow: true,
  },
},
```

### AntV Dagre (better node ranking algorithm)

```javascript
// antv-dagre is Dagre optimized by the AntV team and is better suited for Combo scenarios
layout: {
  type: 'antv-dagre',
  rankdir: 'TB',
  ranksep: 50,
  nodesep: 20,
  ranker: 'tight-tree',     // 'network-simplex' | 'tight-tree' | 'longest-path'
},
```

### Orthogonal flowchart with polyline edges

```javascript
node: {
  type: 'rect',
  style: {
    size: [120, 40],
    radius: 0,               // Right-angled rectangle
    fill: '#fff',
    stroke: '#1783FF',
    lineWidth: 1.5,
    labelText: (d) => d.data.label,
    labelPlacement: 'center',
    // Configure ports
    ports: [
       { key: 'top', placement: 'top' },
       { key: 'bottom', placement: 'bottom' },
    ],
  },
},
edge: {
  type: 'polyline',          // Polyline edge
  style: {
    stroke: '#1783FF',
    lineWidth: 1.5,
    radius: 6,
    endArrow: true,
  },
},
layout: {
  type: 'dagre',
  rankdir: 'TB',
  ranksep: 60,
  nodesep: 30,
  controlPoints: true,      // Preserve control points
},
```

### Hierarchical graph with combos

```javascript
const graph = new Graph({
  container: 'container',
  width: 900,
  height: 600,
  data: {
    nodes: [
       { id: 'n1', combo: 'group1', data: { label: 'Module A' } },
       { id: 'n2', combo: 'group1', data: { label: 'Module B' } },
       { id: 'n3', combo: 'group2', data: { label: 'Module C' } },
    ],
    edges: [
       { source: 'n1', target: 'n3' },
       { source: 'n2', target: 'n3' },
    ],
    combos: [
       { id: 'group1', data: { label: 'Subsystem 1' } },
       { id: 'group2', data: { label: 'Subsystem 2' } },
    ],
  },
  combo: {
    type: 'rect',
    style: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
      labelText: (d) => d.data.label,
      labelPlacement: 'top',
    },
  },
  layout: {
    type: 'antv-dagre',     // antv-dagre supports Combo better
    rankdir: 'LR',
    ranksep: 60,
    nodesep: 20,
  },
});
```

## Parameter reference

```typescript
interface DagreLayoutOptions {
  rankdir?: 'TB' | 'BT' | 'LR' | 'RL';     // Layout direction, default 'TB'
  align?: 'UL' | 'UR' | 'DL' | 'DR';        // Node alignment mode
  nodesep?: number;                           // Spacing between nodes in the same layer, default 50
  ranksep?: number;                           // Layer spacing, default 100
  ranker?: 'network-simplex' | 'tight-tree' | 'longest-path';
  nodeSize?: number | [number, number];        // Node size (used to calculate spacing)
  controlPoints?: boolean;                    // Whether to preserve edge control points
  workerEnabled?: boolean;                    // Whether to run in a Web Worker
}
```

## Common errors

### Error 1: Using dagre on a cyclic graph causes edges to be lost

```javascript
// A cyclic graph (such as a state machine) with dagre ignores reverse edges
const edges = [
   { source: 'a', target: 'b' },
   { source: 'b', target: 'c' },
   { source: 'c', target: 'a' },  // Forms a cycle; dagre ignores it
];

// Use force layout for cyclic graphs
layout: { type: 'force', preventOverlap: true },
```

### Error 2: Node size does not match layout nodeSize

```javascript
// Actual node size does not match dagre's nodeSize parameter, causing node overlap
node: {
  type: 'rect',
  style: { size: [200, 60] },   // Actual size 200x60
},
layout: {
  type: 'dagre',
  nodeSize: 40,   // Parameter is too small and does not match
},

// nodeSize matches node size
node: {
  type: 'rect',
  style: { size: [120, 40] },
},
layout: {
  type: 'dagre',
  nodeSize: [120, 40],   // Matches node size
  ranksep: 60,
},
```

### Error 3: Edge type does not match direction

```javascript
// Horizontal curved edges are used in TB direction
layout: { type: 'dagre', rankdir: 'TB' },
edge: { type: 'cubic-horizontal' },   // Horizontal curves do not look good in TB direction

// Match the direction
layout: { type: 'dagre', rankdir: 'TB' },
edge: { type: 'cubic-vertical' },    // Vertical curves work with TB

layout: { type: 'dagre', rankdir: 'LR' },
edge: { type: 'cubic-horizontal' },  // Horizontal curves work with LR
```
