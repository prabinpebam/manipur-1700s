---
id: "g6-edge-line"
title: "G6 Straight Line Edge (Line Edge)"
description: |
  Use line edges (line) to connect nodes; this is the simplest edge type.
  It supports style configuration such as arrows, labels, and dashed lines.

library: "g6"
version: "5.x"
category: "elements"
subcategory: "edges"
tags:
  - "edge"
  - "straight line"
  - "line"
  - "edge"
  - "arrow"
  - "directed graph"

related:
  - "g6-edge-cubic"
  - "g6-edge-polyline"
  - "g6-node-circle"

use_cases:
  - "Simple network graphs"
  - "Topology graphs"
  - "Directed graphs"
  - "Flowcharts (with polyline edges)"

anti_patterns:
  - "When nodes are close and there are many edges, straight lines can overlap easily; consider cubic or quadratic edges"
  - "For parallel edge scenarios (multiple edges with the same source and target), use the process-parallel-edges transform"

difficulty: "beginner"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
author: "antv-team"
source_url: "https://g6.antv.antgroup.com/manual/element/edge/line"
---

## Core concepts

A straight line edge (`line`) is the simplest edge type in G6. It directly connects two nodes without any curvature.

**Main style properties:**
- `stroke`: edge color
- `lineWidth`: edge width
- `endArrow`: target arrow (`true` or an arrow configuration object)
- `startArrow`: source arrow
- `lineDash`: dashed line configuration

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
       { id: 'e1', source: 'n1', target: 'n2', data: { label: 'Connection' } },
       { id: 'e2', source: 'n2', target: 'n3' },
    ],
  },
  node: {
    type: 'circle',
    style: {
      size: 36,
      fill: '#1783FF',
      labelText: (d) => d.data.label,
      labelPlacement: 'center',
      labelFill: '#fff',
    },
  },
  edge: {
    type: 'line',
    style: {
      stroke: '#999',
      lineWidth: 1.5,
      endArrow: true,              // show arrow
      labelText: (d) => d.data.label,
    },
  },
  layout: { type: 'dagre', rankdir: 'LR' },
  behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
});

graph.render();
```

## Common variants

### Weighted edge (width mapping)

```javascript
edge: {
  type: 'line',
  style: {
    stroke: '#aaa',
    lineWidth: (d) => Math.max(1, d.data.weight / 10),  // set width by weight
    endArrow: true,
    labelText: (d) => d.data.weight ? `${d.data.weight}` : '',
    labelFontSize: 12,
    labelFill: '#666',
  },
},
```

### Dashed edge

```javascript
edge: {
  type: 'line',
  style: {
    stroke: '#aaa',
    lineWidth: 1.5,
    lineDash: [4, 4],        // dashed line: [dash length, gap length]
    endArrow: true,
  },
},
```

### Custom arrow

```javascript
edge: {
  type: 'line',
  style: {
    stroke: '#1783FF',
    lineWidth: 2,
    endArrow: {
      type: 'triangle',      // 'triangle' | 'circle' | 'diamond' | 'rect' | 'vee' | 'simple'
      fill: '#1783FF',
      stroke: '#1783FF',
      size: 10,
    },
    startArrow: {
      type: 'circle',
      fill: '#fff',
      stroke: '#1783FF',
      size: 8,
    },
  },
},
```

### Color by edge type

```javascript
edge: {
  type: 'line',
  style: {
    stroke: (d) => {
      const colors = {
        'dependency': '#4096ff',
        'extends': '#52c41a',
        'implements': '#fa8c16',
      };
      return colors[d.data.type] || '#aaa';
    },
    lineWidth: 1.5,
    endArrow: true,
    lineDash: (d) => d.data.type === 'implements' ? [4, 4] : [],
    labelText: (d) => d.data.type,
    labelFontSize: 11,
  },
},
```

### Process parallel edges

```javascript
// When multiple edges exist between the same pair of nodes, use the process-parallel-edges transform
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  width: 640,
  height: 480,
  data: {
    nodes: [
       { id: 'a', data: { label: 'A' } },
       { id: 'b', data: { label: 'B' } },
    ],
    edges: [
       { id: 'e1', source: 'a', target: 'b', data: { label: 'Call' } },
       { id: 'e2', source: 'a', target: 'b', data: { label: 'Callback' } },
       { id: 'e3', source: 'b', target: 'a', data: { label: 'Return' } },
    ],
  },
  // Use a transform to process parallel edges
  transforms: ['process-parallel-edges'],
  edge: {
    type: 'quadratic',          // curves are more readable for parallel edges
    style: {
      stroke: '#aaa',
      endArrow: true,
      labelText: (d) => d.data.label,
    },
  },
  layout: { type: 'force' },
  behaviors: ['drag-canvas', 'zoom-canvas'],
});
```

## Edge state styles

```javascript
edge: {
  type: 'line',
  style: {
    stroke: '#aaa',
    lineWidth: 1,
    endArrow: true,
  },
  state: {
    selected: {
      stroke: '#1783FF',
      lineWidth: 3,
    },
    hover: {
      stroke: '#40a9ff',
      lineWidth: 2,
    },
    inactive: {
      opacity: 0.2,
    },
  },
},
```

## Common errors

### Error 1: Edge labels are not displayed

```javascript
// Incorrect: data has a label, but labelText is not configured
const edges = [{ source: 'n1', target: 'n2', data: { label: 'Relation' } }];
edge: { type: 'line', style: { stroke: '#aaa' } }  // labelText is not configured

// Correct: configure labelText
edge: {
  type: 'line',
  style: {
    stroke: '#aaa',
    labelText: (d) => d.data.label || '',  // read from data
  },
},
```

### Error 2: Arrow direction is not as expected

```javascript
// Incorrect: assuming startArrow is at the source end, but the rendered position is confused
// Clarification: endArrow is at the target end, and startArrow is at the source end

// Correct: use endArrow for directed graphs
edge: {
  type: 'line',
  style: {
    endArrow: true,    // arrow at the target end
  },
},
```