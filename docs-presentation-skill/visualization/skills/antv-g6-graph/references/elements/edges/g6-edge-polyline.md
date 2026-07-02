---
id: "g6-edge-polyline"
title: "G6 Polyline Edge"
description: |
  Use polyline edges (polyline) to connect nodes and automatically avoid node obstacles.
  Suitable for orthogonal layouts and flowchart scenarios.

library: "g6"
version: "5.x"
category: "elements"
subcategory: "edges"
tags:
  - "edge"
  - "polyline"
  - "polyline"
  - "orthogonal"
  - "orthogonal"
  - "flowchart"

related:
  - "g6-edge-line"
  - "g6-edge-cubic"
  - "g6-layout-dagre"

use_cases:
  - "Orthogonal layout graphs"
  - "Flowcharts"
  - "UML class diagrams"
  - "Module dependency graphs"

anti_patterns:
  - "Polyline edges can take long detours when nodes are dense; consider cubic or line edges"
  - "Polyline path calculation is relatively slow; pay attention to performance when there are many nodes"

difficulty: "intermediate"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
author: "antv-team"
source_url: "https://g6.antv.antgroup.com/manual/element/edge/polyline"
---

## Core concepts

A polyline edge (`polyline`) automatically calculates bend points so the edge connects nodes as an orthogonal polyline, producing a clean visual result.

**Characteristics:**
- Automatic obstacle avoidance: automatically calculates a path around nodes
- Orthogonal polyline: edges contain only horizontal and vertical line segments
- You can set `radius` to make bend corners rounded

## Minimal runnable example

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  data: {
    nodes: [
       { id: 'n1', data: { label: 'Step 1' } },
       { id: 'n2', data: { label: 'Step 2' } },
       { id: 'n3', data: { label: 'Step 3' } },
       { id: 'n4', data: { label: 'Step 4' } },
    ],
    edges: [
       { source: 'n1', target: 'n2' },
       { source: 'n2', target: 'n3' },
       { source: 'n3', target: 'n4' },
       { source: 'n1', target: 'n4' },
    ],
  },
  node: {
    type: 'rect',
    style: {
      size: [100, 40],
      radius: 4,
      fill: '#f0f5ff',
      stroke: '#adc6ff',
      labelText: (d) => d.data.label,
      labelPlacement: 'center',
    },
  },
  edge: {
    type: 'polyline',
    style: {
      stroke: '#adc6ff',
      lineWidth: 1.5,
      radius: 8,                  // rounded bends
      endArrow: true,
    },
  },
  layout: {
    type: 'dagre',
    rankdir: 'LR',
    ranksep: 60,
    nodesep: 30,
  },
  behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
});

graph.render();
```

## Common errors

### Error 1: Polyline performs poorly in force layouts

```javascript
// Incorrect: polyline path calculation is inaccurate in force layouts (random positions)
layout: { type: 'force' },
edge: { type: 'polyline' },

// Correct: polyline is suitable for orthogonal/hierarchical layouts
layout: { type: 'dagre', rankdir: 'LR' },
edge: { type: 'polyline' },
```