---
id: g6-graph-basic-usage
title: G6 Graph Basic Usage
description: Introduces how to use AntV G6 to create basic graphs, including configuration for nodes, edges, layouts, behaviors, and plugins, with complete examples for common graph types.
library: G6
version: 5.x
category: basic
tags:
  - graph
  - nodes
  - edges
  - layout
  - behaviors
  - plugins
---

# G6 Graph Basic Usage

## Overview

AntV G6 is a graph visualization engine that supports multiple layout algorithms, behaviors, and plugins. This document explains how to correctly create and configure G6 graph instances.

## Core API

### Creating a Graph instance

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container', // Container ID or DOM element
  width: 800,             // Canvas width; not required by default
  height: 600,            // Canvas height; not required by default
  data: {
    nodes: [...],
    edges: [...],
  },
  layout: { type: 'grid' },
  node: { /* Node style configuration */ },
  edge: { /* Edge style configuration */ },
  behaviors: [...],       // Behaviors
  plugins: [...],         // Plugins
});

graph.render();
```

### Data format

```javascript
const data = {
  nodes: [
    { id: 'node1' },
    { id: 'node2', style: { x: 100, y: 200 } },
    { id: 'node3', data: { label: 'Node 3', value: 42 }, states: ['active'] },
  ],
  edges: [
    { source: 'node1', target: 'node2' },
    { id: 'edge1', source: 'node2', target: 'node3', states: ['selected'] },
  ],
  combos: [
    { id: 'combo1' },
  ],
};
```

## Common layout types

| Layout type | Description |
|---------|------|
| `grid` | Grid layout |
| `snake` | Snake layout |
| `radial` | Radial layout |
| `antv-dagre` | DAG directed acyclic graph layout |
| `fruchterman` | Force-directed layout (Fruchterman) |
| `d3-force` | D3 force-directed layout |
| `indented` | Indented tree layout |
| `mindmap` | Mind map layout |

## Common behaviors

```javascript
behaviors: [
  'drag-canvas',           // Drag canvas
  'zoom-canvas',           // Zoom canvas
  'drag-element',          // Drag element
  'drag-element-force',    // Drag elements in force-directed graphs
  'collapse-expand',       // Collapse/expand nodes
  'click-select',          // Click to select
  'focus-element',         // Focus element
  { type: 'scroll-canvas', direction: 'y' }, // Vertical scrolling
  {
    type: 'brush-select',  // Brush selection
    enable: true,
    trigger: [],
  },
]
```

## Common plugins

```javascript
plugins: [
  {
    type: 'watermark',
    text: 'G6: Graph Visualization',
    textFontSize: 14,
    fill: 'rgba(0, 0, 0, 0.1)',
    rotate: Math.PI / 12,
  },
  {
    type: 'background',
    backgroundColor: '#f0f0f0',
    opacity: 0.2,
  },
  {
    type: 'tooltip',
    trigger: 'click',
    getContent: (e, items) => {
      return `<p>${items[0]?.id}</p>`;
    },
  },
]
```

## Minimal runnable example

### Basic grid layout graph

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  data: {
    nodes: [
      { id: 'node1' },
      { id: 'node2' },
      { id: 'node3' },
      { id: 'node4' },
      { id: 'node5' },
    ],
    edges: [
      { source: 'node1', target: 'node2' },
      { source: 'node1', target: 'node3' },
      { source: 'node1', target: 'node4' },
      { source: 'node2', target: 'node3' },
      { source: 'node3', target: 'node4' },
      { source: 'node4', target: 'node5' },
    ],
  },
  layout: { type: 'grid' },
  behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
});

graph.render();
```

### Fixed-coordinate node graph (with brush selection)

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  data: {
    nodes: [
      { id: 'node-1', style: { x: 200, y: 250 } },
      { id: 'node-2', style: { x: 250, y: 200 } },
      { id: 'node-3', style: { x: 300, y: 250 } },
      { id: 'node-4', style: { x: 250, y: 300 } },
    ],
    edges: [
      { source: 'node-1', target: 'node-2' },
      { source: 'node-2', target: 'node-3' },
      { source: 'node-3', target: 'node-4' },
      { source: 'node-4', target: 'node-1' },
    ],
  },
  behaviors: [
    {
      key: 'brush-select',
      type: 'brush-select',
      enable: true,
      animation: false,
      trigger: [],
    },
  ],
});

graph.render();
```

### Snake-layout chain graph

```javascript
import { Graph } from '@antv/g6';

const data = {
  nodes: new Array(16).fill(0).map((_, i) => ({ id: `${i}` })),
  edges: new Array(15).fill(0).map((_, i) => ({ source: `${i}`, target: `${i + 1}` })),
};

const graph = new Graph({
  container: 'container',
  data,
  node: {
    style: {
      labelFill: '#fff',
      labelPlacement: 'center',
      labelText: (d) => d.id,
    },
  },
  layout: {
    type: 'snake',
    padding: 50,
  },
  behaviors: ['drag-canvas', 'drag-element'],
});

graph.render();
```

### Radial layout graph

```javascript
import { Graph } from '@antv/g6';

const data = {
  nodes: Array.from({ length: 10 }, (_, i) => ({ id: `${i}` })),
  edges: [
    { source: '0', target: '1' },
    { source: '0', target: '2' },
    { source: '0', target: '3' },
    { source: '1', target: '4' },
    { source: '2', target: '5' },
    { source: '3', target: '6' },
    { source: '4', target: '7' },
    { source: '5', target: '8' },
    { source: '6', target: '9' },
  ],
};

const graph = new Graph({
  container: 'container',
  data,
  autoFit: 'center',
  layout: {
    type: 'radial',
    nodeSize: 32,
    unitRadius: 100,
    linkDistance: 200,
  },
  node: {
    style: {
      labelFill: '#fff',
      labelPlacement: 'center',
      labelText: (d) => d.id,
    },
  },
  behaviors: ['drag-canvas', 'drag-element'],
});

graph.render();
```

### DAG directed acyclic graph (dagre layout)

```javascript
import { Graph } from '@antv/g6';

const data = {
  nodes: [
    { id: '0' }, { id: '1' }, { id: '2' }, { id: '3' },
    { id: '4' }, { id: '5' }, { id: '6' }, { id: '7' },
    { id: '8' }, { id: '9' },
  ],
  edges: [
    { source: '0', target: '1' },
    { source: '0', target: '2' },
    { source: '1', target: '4' },
    { source: '0', target: '3' },
    { source: '3', target: '4' },
    { source: '4', target: '5' },
    { source: '4', target: '6' },
    { source: '5', target: '7' },
    { source: '5', target: '8' },
    { source: '8', target: '9' },
    { source: '2', target: '9' },
    { source: '3', target: '9' },
  ],
};

const graph = new Graph({
  container: 'container',
  autoFit: 'view',
  data,
  layout: {
    type: 'antv-dagre',
    nodeSize: [60, 30],
    nodesep: 60,
    ranksep: 40,
    controlPoints: true,
  },
  node: {
    type: 'rect',
    style: {
      size: [60, 30],
      radius: 8,
      labelText: (d) => d.id,
      labelBackground: true,
    },
  },
  edge: {
    type: 'polyline',
  },
  behaviors: ['drag-element', 'drag-canvas', 'zoom-canvas'],
});

graph.render();
```

### Graph with watermark plugin

```javascript
import { Graph } from '@antv/g6';

const data = {
  nodes: [
    { id: 'node-0' }, { id: 'node-1' }, { id: 'node-2' },
    { id: 'node-3' }, { id: 'node-4' }, { id: 'node-5' },
  ],
  edges: [
    { source: 'node-0', target: 'node-1' },
    { source: 'node-0', target: 'node-2' },
    { source: 'node-0', target: 'node-3' },
    { source: 'node-0', target: 'node-4' },
    { source: 'node-1', target: 'node-0' },
    { source: 'node-2', target: 'node-0' },
    { source: 'node-3', target: 'node-0' },
    { source: 'node-4', target: 'node-0' },
    { source: 'node-5', target: 'node-0' },
  ],
};

const graph = new Graph({
  container: 'container',
  data,
  layout: { type: 'grid' },
  behaviors: ['zoom-canvas', 'drag-canvas', 'drag-element'],
  plugins: [
    {
      type: 'watermark',
      text: 'G6: Graph Visualization',
      textFontSize: 14,
      textFontFamily: 'Microsoft YaHei',
      fill: 'rgba(0, 0, 0, 0.1)',
      rotate: Math.PI / 12,
    },
  ],
});

graph.render();
```

### Graph with background plugin

```javascript
import { Graph } from '@antv/g6';

const data = {
  nodes: [
    { id: 'node-0' }, { id: 'node-1' }, { id: 'node-2' },
    { id: 'node-3' }, { id: 'node-4' }, { id: 'node-5' },
  ],
  edges: [
    { source: 'node-0', target: 'node-1' },
    { source: 'node-0', target: 'node-2' },
    { source: 'node-0', target: 'node-3' },
    { source: 'node-0', target: 'node-4' },
    { source: 'node-1', target: 'node-0' },
    { source: 'node-2', target: 'node-0' },
    { source: 'node-3', target: 'node-0' },
    { source: 'node-4', target: 'node-0' },
    { source: 'node-5', target: 'node-0' },
  ],
};

const graph = new Graph({
  container: 'container',
  data,
  layout: { type: 'grid' },
  behaviors: ['zoom-canvas', 'drag-canvas', 'drag-element'],
  plugins: [
    {
      type: 'background',
      width: '800px',
      height: '600px',
      backgroundColor: 'red',
      backgroundSize: 'cover',
      opacity: 0.2,
    },
  ],
});

graph.render();
```

### Graph with Tooltip plugin

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  data: {
    nodes: [
      { id: '0', data: { label: 'node-0', description: 'This is node-0.' } },
      { id: '1', data: { label: 'node-1', description: 'This is node-1.' } },
      { id: '2', data: { label: 'node-2', description: 'This is node-2.' } },
      { id: '3', data: { label: 'node-3', description: 'This is node-3.' } },
      { id: '4', data: { label: 'node-4', description: 'This is node-4.' } },
      { id: '5', data: { label: 'node-5', description: 'This is node-5.' } },
    ],
    edges: [
      { source: '0', target: '1', data: { description: 'Edge from 0 to 1.' } },
      { source: '0', target: '2', data: { description: 'Edge from 0 to 2.' } },
      { source: '0', target: '3', data: { description: 'Edge from 0 to 3.' } },
      { source: '0', target: '4', data: { description: 'Edge from 0 to 4.' } },
      { source: '0', target: '5', data: { description: 'Edge from 0 to 5.' } },
    ],
  },
  layout: { type: 'grid' },
  plugins: [
    {
      type: 'tooltip',
      trigger: 'click',
      getContent: (e, items) => {
        let result = `<h4>Custom Content</h4>`;
        items.forEach((item) => {
          result += `<p>Type: ${item.data?.description}</p>`;
        });
        return result;
      },
    },
  ],
  behaviors: ['drag-canvas', 'drag-element'],
});

graph.render();
```

### Graph with combos

```javascript
import { Graph } from '@antv/g6';

const data = {
  nodes: [
    { id: 'node1', combo: 'combo1', style: { x: 110, y: 150 } },
    { id: 'node2', combo: 'combo1', style: { x: 190, y: 150 } },
    { id: 'node3', combo: 'combo2', style: { x: 150, y: 260 } },
  ],
  edges: [{ source: 'node1', target: 'node2' }],
  combos: [{ id: 'combo1', combo: 'combo2' }, { id: 'combo2' }],
};

const graph = new Graph({
  container: 'container',
  node: {
    style: { labelText: (d) => d.id },
  },
  data,
  behaviors: ['collapse-expand', 'focus-element'],
});

graph.render();
```

### Edge state styles (dagre layout + cubic-horizontal edges)

```javascript
import { Graph } from '@antv/g6';

const data = {
  nodes: [
    { id: 'node1' }, { id: 'node2' }, { id: 'node3' },
    { id: 'node4' }, { id: 'node5' }, { id: 'node6' },
  ],
  edges: [
    { id: 'line-default', source: 'node1', target: 'node2' },
    { id: 'line-active', source: 'node1', target: 'node3', states: ['active'] },
    { id: 'line-selected', source: 'node1', target: 'node4', states: ['selected'] },
    { id: 'line-highlight', source: 'node1', target: 'node5', states: ['highlight'] },
    { id: 'line-inactive', source: 'node1', target: 'node6', states: ['inactive'] },
  ],
};

const graph = new Graph({
  container: 'container',
  data,
  node: {
    style: {
      port: true,
      ports: [{ placement: 'right' }, { placement: 'left' }],
    },
  },
  edge: {
    type: 'cubic-horizontal',
    style: {
      labelText: (d) => d.id,
      labelBackground: true,
      endArrow: true,
    },
  },
  layout: {
    type: 'antv-dagre',
    rankdir: 'LR',
    nodesep: 20,
    ranksep: 120,
  },
});

graph.render();
```

### Parallel edge handling (process-parallel-edges)

```javascript
import { Graph } from '@antv/g6';

const data = {
  nodes: [
    { id: 'A', style: { x: 50, y: 350 } },
    { id: 'B', style: { x: 250, y: 150 } },
    { id: 'C', style: { x: 450, y: 350 } },
  ],
  edges: [
    { source: 'A', target: 'B' },
    { source: 'B', target: 'A' },
    { id: 'B-C:1', source: 'B', target: 'C' },
    { id: 'B-C:2', source: 'B', target: 'C' },
    { source: 'A', target: 'C' },
  ],
};

const graph = new Graph({
  container: 'container',
  autoFit: 'center',
  data,
  node: {
    style: {
      labelText: (d) => d.id,
    },
  },
  edge: {
    style: {
      labelText: (d) => d?.data?.label || `${d.source}->${d.target}`,
      startArrow: false,
    },
  },
  transforms: [
    {
      type: 'process-parallel-edges',
      mode: 'merge',
      style: {
        halo: true,
        haloOpacity: 0.2,
        haloStroke: 'red',
        startArrow: true,
      },
    },
  ],
});

graph.render();
```

### Fruchterman force-directed layout (with cluster coloring)

```javascript
import { Graph } from '@antv/g6';

const data = {
  nodes: [
    { id: '0', data: { cluster: 'a' } },
    { id: '1', data: { cluster: 'a' } },
    { id: '2', data: { cluster: 'b' } },
    { id: '3', data: { cluster: 'b' } },
    { id: '4', data: { cluster: 'c' } },
    { id: '5', data: { cluster: 'c' } },
  ],
  edges: [
    { source: '0', target: '1' },
    { source: '0', target: '2' },
    { source: '2', target: '3' },
    { source: '3', target: '4' },
    { source: '4', target: '5' },
  ],
};

const graph = new Graph({
  container: 'container',
  data,
  layout: {
    type: 'fruchterman',
    gravity: 5,
    speed: 5,
    clustering: true,
    nodeClusterBy: 'cluster',
    clusterGravity: 16,
  },
  node: {
    style: {
      labelFill: '#fff',
      labelPlacement: 'center',
      labelText: (d) => d.id,
    },
    palette: {
      type: 'group',
      field: 'cluster',
    },
  },
  edge: {
    style: {
      endArrow: true,
    },
  },
  behaviors: ['drag-canvas', 'drag-element'],
});

graph.render();
```

### D3 force-directed layout (2D grid graph)

```javascript
import { Graph } from '@antv/g6';

function getData(size = 5) {
  const nodes = Array.from({ length: size * size }, (_, i) => ({ id: `${i}` }));
  const edges = [];
  for (let y = 0; y < size; ++y) {
    for (let x = 0; x < size; ++x) {
      if (y > 0) edges.push({ source: `${(y - 1) * size + x}`, target: `${y * size + x}` });
      if (x > 0) edges.push({ source: `${y * size + (x - 1)}`, target: `${y * size + x}` });
    }
  }
  return { nodes, edges };
}

const graph = new Graph({
  data: getData(),
  container: 'container',
  layout: {
    type: 'd3-force',
    manyBody: { strength: -30 },
    link: { strength: 1, distance: 20, iterations: 10 },
  },
  node: {
    style: { size: 10, fill: '#000' },
  },
  edge: {
    style: { stroke: '#000' },
  },
  behaviors: [{ type: 'drag-element-force' }, 'zoom-canvas'],
});

graph.render();
```

### Custom node (breathing animated circular node)

```javascript
import { Circle, ExtensionCategory, Graph, register } from '@antv/g6';

class BreathingCircle extends Circle {
  onCreate() {
    const halo = this.shapeMap.halo;
    halo.animate([{ lineWidth: 0 }, { lineWidth: 20 }], {
      duration: 1000,
      iterations: Infinity,
      direction: 'alternate',
    });
  }
}

register(ExtensionCategory.NODE, 'breathing-circle', BreathingCircle);

const graph = new Graph({
  container: 'container',
  data: {
    nodes: [
      { id: 'node-0' }, { id: 'node-1' },
      { id: 'node-2' }, { id: 'node-3' },
    ],
  },
  node: {
    type: 'breathing-circle',
    style: {
      size: 50,
      halo: true,
    },
    palette: ['#3875f6', '#efb041', '#ec5b56', '#72c240'],
  },
  layout: { type: 'grid' },
});

graph.render();
```

### Hexagon node (multi-state display)

```javascript
import { Graph, iconfont } from '@antv/g6';

const style = document.createElement('style');
style.innerHTML = `@import url('${iconfont.css}');`;
document.head.appendChild(style);

const data = {
  nodes: [
    { id: 'default' },
    { id: 'halo' },
    { id: 'badges' },
    { id: 'ports' },
    { id: 'active', states: ['active'] },
    { id: 'selected', states: ['selected'] },
    { id: 'highlight', states: ['highlight'] },
    { id: 'inactive', states: ['inactive'] },
    { id: 'disabled', states: ['disabled'] },
  ],
};

const graph = new Graph({
  container: 'container',
  data,
  node: {
    type: 'hexagon',
    style: {
      size: 40,
      labelText: (d) => d.id,
      iconFontFamily: 'iconfont',
      iconText: '\ue602',
      halo: (d) => d.id === 'halo',
      badges: (d) =>
        d.id === 'badges'
          ? [
              { text: 'A', placement: 'right-top' },
              { text: 'Important', placement: 'right' },
              { text: 'Notice', placement: 'right-bottom' },
            ]
          : [],
      badgeFontSize: 8,
      badgePadding: [1, 4],
      portR: 3,
      ports: (d) =>
        d.id === 'ports'
          ? [
              { placement: 'left' },
              { placement: 'right' },
              { placement: 'top' },
              { placement: 'bottom' },
            ]
          : [],
    },
  },
  layout: { type: 'grid' },
});

graph.render();
```

### Static network graph (with click selection and canvas reset)

```javascript
import { CanvasEvent, Graph } from '@antv/g6';

const rawData = {
  nodes: [
    { id: 'A', x: 100, y: 100 },
    { id: 'B', x: 300, y: 100 },
    { id: 'C', x: 200, y: 300 },
  ],
  edges: [
    { source: 'A', target: 'B' },
    { source: 'B', target: 'C' },
    { source: 'A', target: 'C' },
  ],
};

const data = {
  nodes: rawData.nodes.map((node) => ({
    ...node,
    style: { x: node.x, y: node.y },
  })),
  edges: rawData.edges,
};

const graph = new Graph({
  container: 'container',
  animation: false,
  data,
  node: {
    style: { size: 12 },
  },
  behaviors: [
    'drag-canvas',
    'zoom-canvas',
    'drag-element',
    { type: 'click-select', multiple: true },
  ],
  autoFit: 'view',
});

graph.render();

graph.on(CanvasEvent.CLICK, () => {
  graph.setElementState(
    Object.fromEntries(
      [...data.nodes, ...data.edges].map((element) => [element.id, []])
    )
  );
});
```

## Common errors and fixes

### Error 1: Calling the non-existent tool `list_references`

**Symptom**:Render error `400 LLM is trying to invoke a non-exist tool: "list_references"`

**Cause**:The LLM tries to call a non-existent tool to query documentation, so it cannot generate code.

**Fix**:Write code directly with the standard G6 API; no external tool calls are needed. Use the examples in this document as a reference.

---

### Error 2: Forgetting to call `graph.render()`

**Incorrect example**:
```javascript
const graph = new Graph({ container: 'container', data });
// Missing graph.render()
```

**Correct example**:
```javascript
const graph = new Graph({ container: 'container', data });
graph.render(); // Must call render to render the graph
```

---

### Error 3: Incorrect data format

**Incorrect example**:
```javascript
// Error: pass a node array directly
const graph = new Graph({
  data: [{ id: 'node1' }, { id: 'node2' }],
});
```

**Correct example**:
```javascript
// Correct: data must contain nodes and edges fields
const graph = new Graph({
  data: {
    nodes: [{ id: 'node1' }, { id: 'node2' }],
    edges: [{ source: 'node1', target: 'node2' }],
  },
});
```

---

### Error 4: Node coordinates should be placed in the `style` field

**Incorrect example**:
```javascript
// Error: set x/y directly on the node object
{ id: 'node1', x: 100, y: 200 }
```

**Correct example**:
```javascript
// Correct: put coordinates in the style field
{ id: 'node1', style: { x: 100, y: 200 } }
```

---

### Error 5: Incorrect layout type name

**Incorrect example**:
```javascript
layout: { type: 'dagre' } // Error: in G6 v5, use 'antv-dagre'
```

**Correct example**:
```javascript
layout: { type: 'antv-dagre' } // Correct syntax in G6 v5
```

---

### Error 6: Using a custom node before registering it

**Incorrect example**:
```javascript
// Error: using a custom node type before registration
const graph = new Graph({
  node: { type: 'breathing-circle' },
});
```

**Correct example**:
```javascript
import { Circle, ExtensionCategory, Graph, register } from '@antv/g6';

class BreathingCircle extends Circle { /* ... */ }

// Register it first
register(ExtensionCategory.NODE, 'breathing-circle', BreathingCircle);

const graph = new Graph({
  node: { type: 'breathing-circle' },
});
```

---

### Error 7: Using tree data directly without conversion

**Incorrect example**:
```javascript
// Error: pass tree data directly to data
const graph = new Graph({
  data: { id: 'root', children: [...] },
});
```

**Correct example**:
```javascript
import { Graph, treeToGraphData } from '@antv/g6';

// Correct: convert with treeToGraphData
const graph = new Graph({
  data: treeToGraphData({ id: 'root', children: [...] }),
});
```

---

### Error 8: Incomplete `scroll-canvas` behavior configuration

**Incorrect example**:
```javascript
behaviors: ['scroll-canvas'] // Missing direction configuration
```

**Correct example**:
```javascript
behaviors: [{ type: 'scroll-canvas', direction: 'y' }] // Specify the scroll direction
```