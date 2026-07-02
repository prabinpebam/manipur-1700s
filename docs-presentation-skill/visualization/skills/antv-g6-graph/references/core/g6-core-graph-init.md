---
id: "g6-core-graph-init"
title: "G6 Graph Instance Initialization"
description: |
  A complete configuration guide for creating a graph instance with new Graph({...}).
  Covers one-time configuration for container, size, data, styles, layout, and interactions.

library: "g6"
version: "5.x"
category: "core"
subcategory: "init"
tags:
  - "initialization"
  - "Graph"
  - "container"
  - "configuration"
  - "graph init"
  - "container"
  - "new Graph"

related:
  - "g6-core-data-structure"
  - "g6-node-circle"
  - "g6-layout-force"

use_cases:
  - "Create any type of graph visualization"
  - "Configure the basic appearance and behavior of a graph"

anti_patterns:
  - "Do not use the v4 new G6.Graph() and graph.data() pattern"
  - "Do not modify base configuration repeatedly outside the constructor"

difficulty: "beginner"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
author: "antv-team"
source_url: "https://g6.antv.antgroup.com/manual/graph/graph"
---

## Core concepts

Graph is the core container in G6. It manages all elements (nodes, edges, and combos) and operations (interaction and rendering).

**Critical differences between G6 v5 and v4:**
- All configuration is completed at once in `new Graph({...})`
- Data is passed through the `data` field in the constructor (no more `graph.data()`)
- Node labels are configured through `style.labelText` callbacks (no more `label` or `labelCfg`)
- `behaviors` is directly an array (there is no longer a mode concept)

## Minimal runnable example

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',   // required: DOM element ID or HTMLElement
  data: {
    nodes: [
      { id: 'node1', data: { label: 'Node 1' } },
      { id: 'node2', data: { label: 'Node 2' } },
      { id: 'node3', data: { label: 'Node 3' } },
    ],
    edges: [
      { id: 'e1', source: 'node1', target: 'node2' },
      { id: 'e2', source: 'node2', target: 'node3' },
    ],
  },
  layout: { type: 'force' },
  behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
});

graph.render();
```

## Complete configuration description

### Container and size

```javascript
const graph = new Graph({
  container: 'container',         // string ID or DOM element
  width: 800,                     // canvas width (px); no configuration is required by default
  height: 600,                    // canvas height (px); no configuration is required by default
  autoFit: 'view',                // auto fit: 'center' | 'view' | false
  padding: [20, 20, 20, 20],      // padding [top, right, bottom, left]
  devicePixelRatio: 2,            // device pixel ratio for high-definition rendering
});
```

### Renderer configuration

```javascript
const graph = new Graph({
  container: 'container',
  renderer: () => new CanvasRenderer(),    // default Canvas renderer
  // renderer: () => new SVGRenderer(),    // SVG renderer (must be imported separately)
  // renderer: () => new WebGLRenderer(),  // WebGL renderer (must be imported separately)
});
```

### Complete example (including all common configuration)

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  // container
  container: 'container',
  width: 960,
  height: 600,
  autoFit: 'view',

  // data
  data: {
    nodes: [
      { id: 'n1', data: { label: 'Product', type: 'product', value: 80 } },
      { id: 'n2', data: { label: 'User', type: 'user', value: 50 } },
      { id: 'n3', data: { label: 'Order', type: 'order', value: 30 } },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2', data: { label: 'Purchase' } },
      { id: 'e2', source: 'n2', target: 'n3', data: { label: 'Generate' } },
    ],
  },

  // node configuration
  node: {
    type: 'circle',
    style: {
      size: 40,
      fill: '#1783FF',
      stroke: '#fff',
      lineWidth: 2,
      labelText: (d) => d.data.label,
      labelPlacement: 'bottom',
      labelFill: '#333',
    },
  },

  // edge configuration
  edge: {
    type: 'line',
    style: {
      stroke: '#aaa',
      lineWidth: 1.5,
      endArrow: true,
      labelText: (d) => d.data.label,
    },
  },

  // layout
  layout: {
    type: 'force',
    preventOverlap: true,
    nodeSize: 40,
    linkDistance: 100,
  },

  // theme
  theme: 'light',

  // interaction behaviors
  behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element', 'click-select'],

  // plugins
  plugins: ['grid-line', 'minimap'],

  // animation
  animation: true,
});

await graph.render();
```

## Edge data ID rules

**Important: automatic edge ID generation rules**

When no `id` is specified in edge data, G6 automatically generates an edge ID in the `${source}-${target}` format.

**This means that if two edges have the same source and target (parallel edges), they generate the same ID and cause an `Edge already exists` error.**

```javascript
// Incorrect: two edges have the same source/target, so the automatically generated IDs are both "A-B"
edges: [
  { source: 'A', target: 'B' },
  { source: 'A', target: 'B' },  // duplicate!
]

// Correct: explicitly assign a unique ID to each edge
edges: [
  { id: 'e1', source: 'A', target: 'B' },
  { id: 'e2', source: 'A', target: 'B' },
]
```

**Best practice: always explicitly specify a unique `id` for edge data to avoid automatic ID conflicts.**

```javascript
// Recommended syntax: every edge has a unique ID
const edges = [
  { id: 'e-0-1', source: '0', target: '1' },
  { id: 'e-0-2', source: '0', target: '2' },
  { id: 'e-1-2', source: '1', target: '2' },
];

// When generating edges dynamically, use an index to ensure IDs are unique
const edges = rawEdges.map((e, i) => ({
  id: `edge-${i}`,
  source: e.source,
  target: e.target,
}));
```

## Lifecycle methods

```javascript
// Render (must be called)
await graph.render();

// Redraw after updating data
graph.draw();

// Fit the view
graph.fitView();
graph.fitCenter();

// Destroy
graph.destroy();

// Listen for events
graph.on('node:click', (event) => {
  const { target } = event;
  console.log('clicked node:', target.id);
});

// Get rendering state
console.log(graph.rendered);   // boolean
console.log(graph.destroyed);  // boolean
```

## Dynamic operations

```javascript
// Add a node
graph.addNodeData([{ id: 'n4', data: { label: 'New Node' } }]);
await graph.draw();

// Delete a node (associated edges are also deleted)
graph.removeNodeData(['n4']);
await graph.draw();

// Update element styles
graph.updateNodeData([{ id: 'n1', style: { fill: 'red' } }]);
await graph.draw();

// Set element state
graph.setElementState('n1', 'selected');
graph.setElementState('n1', []);  // clear state

// Zooming
graph.zoomTo(1.5);
graph.zoomTo(1, true);  // with animation

// Move the viewport
graph.translateTo([400, 300]);

// Locate a specific element
graph.focusElement('n1');
```

## Tree data conversion

If the data is a tree-shaped structure (with parent-child hierarchy), use the `treeToGraphData` utility function to convert it to the standard G6 graph data format before passing it to `data`.

```javascript
import { Graph, treeToGraphData } from '@antv/g6';

const treeData = {
  id: 'root',
  children: [
    { id: 'child1', children: [{ id: 'leaf1' }] },
    { id: 'child2' },
  ],
};

const graph = new Graph({
  container: 'container',
  data: treeToGraphData(treeData),   // must be converted before passing in
  layout: { type: 'compact-box' },
  behaviors: ['drag-canvas', 'zoom-canvas'],
});

graph.render();
```

> `treeToGraphData` must be explicitly imported from `@antv/g6`; do not call it without importing it.

## Common errors

### Error 1: Missing container

```javascript
// Incorrect
const graph = new Graph({ });

// Correct
const graph = new Graph({ container: 'container' });
```

### Error 2: Using the v4 graph.data() pattern

```javascript
// Incorrect (v4 syntax)
const graph = new G6.Graph({ container: 'container' });
graph.data({ nodes: [...], edges: [...] });
graph.render();

// Correct (v5 syntax)
const graph = new Graph({
  container: 'container',
  data: { nodes: [...], edges: [...] },
});
graph.render();
```

### Error 3: Writing label directly in data

```javascript
// Incorrect: label is written directly in node data
{ id: 'node1', label: 'Node 1' }

// Correct: put business data in the data field
{ id: 'node1', data: { label: 'Node 1' } }
// Then reference it in style:
node: {
  style: {
    labelText: (d) => d.data.label,
  },
}
```

### Error 4: Using v4 modes configuration

```javascript
// Incorrect (v4 modes)
modes: { default: ['drag-canvas', 'zoom-canvas'] }

// Correct (v5 behaviors)
behaviors: ['drag-canvas', 'zoom-canvas']
```

### Error 5: Conflict between autoFit and fixed size

```javascript
// Incorrect: setting autoFit: true together with width/height can produce unexpected results
const graph = new Graph({
  autoFit: true,   // old syntax
});

// Correct: use 'view' or 'center'
const graph = new Graph({
  autoFit: 'view',   // or 'center', or false (manual control)
});
```

### Error 6: Edge ID conflicts cause "Edge already exists"

When edge data is generated dynamically, if multiple edges have the same source and target (parallel edges), omitting IDs causes duplicate automatically generated IDs and throws an `Edge already exists` error.

```javascript
// Incorrect: randomly generated edges may produce duplicate source-target pairs
const edges = [];
for (let i = 0; i < 34; i++) {
  for (let j = 0; j < 3; j++) {
    const target = Math.floor(Math.random() * 34);
    if (target !== i) {
      edges.push({ source: `${i}`, target: `${target}` }); // no configured ID, may duplicate!
    }
  }
}

// Correct solution 1: assign a unique ID to every edge (recommended)
const edges = [];
let edgeIndex = 0;
for (let i = 0; i < 34; i++) {
  for (let j = 0; j < 3; j++) {
    const target = Math.floor(Math.random() * 34);
    if (target !== i) {
      edges.push({ id: `edge-${edgeIndex++}`, source: `${i}`, target: `${target}` });
    }
  }
}

// Correct solution 2: deduplicate the existing edge array and then add IDs
const edgeSet = new Set();
const edges = [];
let edgeIndex = 0;
for (let i = 0; i < 34; i++) {
  for (let j = 0; j < 3; j++) {
    const target = Math.floor(Math.random() * 34);
    const key = `${i}-${target}`;
    if (target !== i && !edgeSet.has(key)) {
      edgeSet.add(key);
      edges.push({ id: `edge-${edgeIndex++}`, source: `${i}`, target: `${target}` });
    }
  }
}
```

### Error 7: Passing tree-shaped data without conversion

```javascript
// Incorrect: tree-shaped data cannot be passed directly to data
const graph = new Graph({
  data: { id: 'root', children: [...] },  // error!
});

// Incorrect: treeToGraphData is used without being imported
const graph = new Graph({
  data: treeToGraphData(treeData),  // ReferenceError: treeToGraphData is not defined
});

// Correct: import it from @antv/g6 before using it
import { Graph, treeToGraphData } from '@antv/g6';
const graph = new Graph({
  data: treeToGraphData(treeData),
});
```