---
id: "g6-behavior-hover-activate"
title: "G6 Hover Activate Behavior"
description: |
  Use the hover-activate behavior to highlight nodes and related edges on mouse hover,
  improving graph readability.

library: "g6"
version: "5.x"
category: "behaviors"
subcategory: "highlight"
tags:
  - "interaction"
  - "hover"
  - "hover"
  - "hover-activate"
  - "highlight"
  - "activate"

related:
  - "g6-behavior-click-select"
  - "g6-state-overview"

use_cases:
  - "Highlight edges related to the current node in edge-dense graphs"
  - "Knowledge graph exploration"
  - "Relationship graph analysis"

anti_patterns:
  - "hover-activate provides limited value when there are few edges"

difficulty: "beginner"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
author: "antv-team"
source_url: "https://g6.antv.antgroup.com/manual/behavior/hover-activate"
---

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
       { id: 'n4', data: { label: 'D' } },
    ],
    edges: [
       { source: 'n1', target: 'n2' },
       { source: 'n1', target: 'n3' },
       { source: 'n2', target: 'n4' },
       { source: 'n3', target: 'n4' },
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
      cursor: 'pointer',
    },
    state: {
      active: {
        fill: '#ff7875',
        halo: true,
        haloFill: '#ff7875',
        haloOpacity: 0.25,
        haloLineWidth: 12,
      },
      inactive: {
        opacity: 0.3,
      },
    },
  },
  edge: {
    type: 'line',
    style: { stroke: '#ccc', endArrow: true },
    state: {
      active: {
        stroke: '#ff7875',
        lineWidth: 3,
      },
      inactive: {
        opacity: 0.2,
      },
    },
  },
  layout: { type: 'force' },
  behaviors: [
    'drag-canvas',
    'zoom-canvas',
    {
      type: 'hover-activate',
      degree: 1,              // Number of neighbor hops to highlight (1 = direct neighbors)
      state: 'active',        // Active state name
    },
  ],
});

graph.render();
```

## Parameter reference

```typescript
interface HoverActivateOptions {
  degree?: number;              // Neighbor hop count, default 1
  state?: string;               // Active element state, default 'active'
  inactiveState?: string;       // Inactive element state, default 'inactive'
  enable?: boolean | ((event) => boolean);
}
```
