---
id: "g6-node-rect"
title: "G6 Rectangle Node (Rect Node)"
description: |
  Use rectangle nodes (rect) to create graph visualizations. Rectangle nodes are suitable for displaying modules, components, process steps, and more,
  and support width/height settings, rounded corners, labels, and more.

library: "g6"
version: "5.x"
category: "elements"
subcategory: "nodes"
tags:
  - "node"
  - "rectangle"
  - "rect"
  - "node"
  - "flowchart"
  - "org chart"
  - "UML"

related:
  - "g6-node-circle"
  - "g6-layout-dagre"
  - "g6-state-overview"

use_cases:
  - "Flowchart nodes"
  - "Org chart graphs"
  - "UML diagrams"
  - "File trees"
  - "Architecture graphs"

anti_patterns:
  - "Not suitable for representing non-directional entities (use circle instead)"
  - "Use html nodes when node content is extremely complex"

difficulty: "beginner"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
author: "antv-team"
source_url: "https://g6.antv.antgroup.com/manual/element/node/rect"
---

## Core concepts

A rectangle node (`rect`) has clear borders and is suitable for representing directional entities such as modules, components, and process steps.

**Main differences from circle:**
- `size` accepts a `[width, height]` array and supports different widths and heights
- `radius` can be set to create rounded rectangles
- The content area is larger and suitable for displaying multi-line information

## Minimal runnable example

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  data: {
    nodes: [
       { id: 'start', data: { label: 'Start' } },
       { id: 'process1', data: { label: 'Process Data' } },
       { id: 'decision', data: { label: 'Passed?' } },
       { id: 'end', data: { label: 'End' } },
    ],
    edges: [
       { source: 'start', target: 'process1' },
       { source: 'process1', target: 'decision' },
       { source: 'decision', target: 'end' },
    ],
  },
  node: {
    type: 'rect',
    style: {
      size: [120, 40],           // [width, height]
      radius: 4,                 // rounded corners
      fill: '#f0f5ff',
      stroke: '#adc6ff',
      lineWidth: 1,
      labelText: (d) => d.data.label,
      labelPlacement: 'center',  // center the label
      labelFill: '#333',
    },
  },
  layout: {
    type: 'dagre',
    rankdir: 'TB',               // top to bottom
    ranksep: 50,
    nodesep: 30,
  },
  edge: {
    type: 'cubic-vertical',
    style: {
      endArrow: true,
      stroke: '#adc6ff',
    },
  },
  behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
});

graph.render();
```

## Common variants

### Org chart graph

```javascript
import { Graph, treeToGraphData } from '@antv/g6';

const orgData = {
  id: 'ceo',
      data: { label: 'CEO', dept: 'Board' },
  children: [
    {
      id: 'cto',
      data: { label: 'CTO', dept: 'Technology Department' },
      children: [
         { id: 'dev1', data: { label: 'Frontend Lead', dept: 'Frontend Group' } },
         { id: 'dev2', data: { label: 'Backend Lead', dept: 'Backend Group' } },
      ],
    },
    {
      id: 'cmo',
      data: { label: 'CMO', dept: 'Marketing Department' },
    },
  ],
};

const graph = new Graph({
  container: 'container',
  data: treeToGraphData(orgData),
  node: {
    type: 'rect',
    style: {
      size: [140, 50],
      radius: 6,
      fill: '#e6f4ff',
      stroke: '#91caff',
      lineWidth: 1,
      labelText: (d) => d.data.label,
      labelPlacement: 'center',
      labelFontSize: 14,
      labelFontWeight: 'bold',
    },
  },
  edge: {
    type: 'cubic-vertical',
    style: { stroke: '#91caff', endArrow: true },
  },
  layout: {
    type: 'compact-box',
    direction: 'TB',
    getHeight: () => 50,
    getWidth: () => 140,
    getVGap: () => 40,
    getHGap: () => 20,
  },
  behaviors: ['drag-canvas', 'zoom-canvas'],
});

graph.render();
```

### Distinguishing types by color

```javascript
node: {
  type: 'rect',
  style: {
    size: [120, 40],
    radius: 4,
    fill: (d) => {
      const colors = {
        start: '#f6ffed',
        process: '#e6f4ff',
        decision: '#fff7e6',
        end: '#fff1f0',
      };
      return colors[d.data.type] || '#fafafa';
    },
    stroke: (d) => {
      const colors = {
        start: '#73d13d',
        process: '#4096ff',
        decision: '#ffa940',
        end: '#ff4d4f',
      };
      return colors[d.data.type] || '#d9d9d9';
    },
    labelText: (d) => d.data.label,
    labelPlacement: 'center',
  },
},
```

### Rectangle node with a subtitle

```javascript
// Use a custom HTML node to display multi-line content
import { Graph, ExtensionCategory, register } from '@antv/g6';

// Or use labelText line wrapping
node: {
  type: 'rect',
  style: {
    size: [160, 60],
    radius: 8,
    fill: '#f0f5ff',
    stroke: '#adc6ff',
    // main title
    labelText: (d) => d.data.title,
    labelPlacement: 'center',
    labelOffsetY: -10,
    labelFontSize: 14,
    labelFontWeight: 'bold',
  },
},
```

## Common errors

### Error 1: Using a single numeric size for rect

```javascript
// Incorrect: it runs, but only width is set and height uses the default
node: {
  type: 'rect',
  style: { size: 100 },
}

// Recommended: explicitly set width and height
node: {
  type: 'rect',
  style: { size: [120, 40] },  // [width, height]
}
```

### Error 2: Label exceeds the node border

```javascript
// Incorrect: a long label overflows the node
node: {
  type: 'rect',
  style: {
    size: [80, 30],
    labelText: (d) => d.data.longDescription,  // too long
  },
}

// Correct: set a maximum width and ellipsis behavior
node: {
  type: 'rect',
  style: {
    size: [120, 40],
    labelText: (d) => d.data.label,
    labelMaxWidth: 100,       // maximum width
    labelWordWrap: false,     // ellipsis when exceeded
  },
}
```

### Error 3: Forgetting to set node size when using a dagre layout

```javascript
// Incorrect: node size is not set, so dagre cannot calculate spacing correctly
layout: {
  type: 'dagre',
},
// nodeSize is not configured

// Correct: tell dagre the node size
layout: {
  type: 'dagre',
  nodeSize: [120, 40],  // consistent with node size
  ranksep: 50,
  nodesep: 20,
},
```