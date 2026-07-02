---
id: "g6-core-data-structure"
title: "G6 Data Structure"
description: |
  G6 5.x graph data format specification, including complete field descriptions for NodeData, EdgeData, and ComboData,
  data operation APIs, and best practices.

library: "g6"
version: "5.x"
category: "core"
subcategory: "data"
tags:
  - "Data structure"
  - "NodeData"
  - "EdgeData"
  - "ComboData"
  - "data structure"
  - "graph data"
  - "nodes"
  - "edges"

related:
  - "g6-core-graph-init"
  - "g6-node-circle"
  - "g6-edge-line"

use_cases:
  - "Define the graph data format"
  - "Load data from a server and render a graph"
  - "Dynamically add and remove nodes and edges"

anti_patterns:
  - "Do not put business properties directly at the node top level; put them in the data field"
  - "Do not put business logic data in style; style should only contain rendering-related properties"
  - "Do not generate duplicate edges (edges with the same source and target), which causes an Edge already exists error"

difficulty: "beginner"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
author: "antv-team"
source_url: "https://g6.antv.antgroup.com/manual/data"
---

## Core concepts

G6 is a data-driven graph visualization engine that uses a standard JSON format to describe graph structures.

**Basic GraphData structure:**
```typescript
interface GraphData {
  nodes?: NodeData[];
  edges?: EdgeData[];
  combos?: ComboData[];
}
```

## Minimal runnable example

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  data: {
    nodes: [
      { id: 'n1', data: { name: 'nodeA', type: 'user' } },
      { id: 'n2', data: { name: 'nodeB', type: 'product' } },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2', data: { weight: 5 } },
    ],
  },
  node: {
    style: { labelText: (d) => d.data.name },
  },
  layout: { type: 'force' },
  behaviors: ['drag-canvas', 'zoom-canvas'],
});

graph.render();
```

## Complete NodeData structure

```typescript
interface NodeData {
  id: string;                      // required, unique identifier
  type?: string;                   // node type, such as 'circle', 'rect', or 'image'
  data?: Record<string, unknown>;  // business data (recommended for custom properties)
  style?: NodeStyle;               // node style (overrides global configuration)
  states?: string[];               // initial state list
  combo?: string;                  // ID of the combo it belongs to
  children?: string[];             // child node ID list in tree-shaped data
}

// Example
const nodes = [
  {
    id: 'user-001',
    type: 'circle',                  // override the global node type
    data: {
      name: 'Zhang San',
      role: 'admin',
      score: 95,
    },
    style: {
      fill: '#ff7875',               // override the global style
      size: 60,
    },
    states: ['selected'],            // initially selected
  },
];
```

## Complete EdgeData structure

```typescript
interface EdgeData {
  id?: string;                     // optional unique identifier; generated automatically if not specified
  source: string;                  // required, source node ID
  target: string;                  // required, target node ID
  type?: string;                   // edge type, such as 'line', 'cubic', or 'polyline'
  data?: Record<string, unknown>;  // business data
  style?: EdgeStyle;               // edge style (overrides global configuration)
  states?: string[];               // initial state list
}

// Example
const edges = [
  {
    id: 'edge-001',
    source: 'user-001',
    target: 'product-001',
    data: {
      type: 'purchase',
      amount: 299,
      date: '2024-01-15',
    },
    style: {
      stroke: '#ff4d4f',
      lineWidth: 2,
    },
  },
];
```

## Complete ComboData structure

```typescript
interface ComboData {
  id: string;                      // required, unique identifier
  type?: string;                   // combo type: 'circle' | 'rect'
  data?: Record<string, unknown>;  // business data
  style?: ComboStyle;              // combo style
  states?: string[];               // initial state
  combo?: string;                  // parent combo ID (nested combo)
}

// Example: node grouping
const data = {
  nodes: [
    { id: 'n1', combo: 'group1', data: { label: 'Member 1' } },
    { id: 'n2', combo: 'group1', data: { label: 'Member 2' } },
    { id: 'n3', combo: 'group2', data: { label: 'Member 3' } },
  ],
  edges: [
    { source: 'n1', target: 'n3' },
  ],
  combos: [
    { id: 'group1', data: { label: 'Team A' } },
    { id: 'group2', data: { label: 'Team B' } },
  ],
};
```

## Tree-shaped data

Tree layouts (such as mindmap and compact-box) use `treeToGraphData()` for conversion. It must be imported from `@antv/g6`:

```javascript
import { Graph, treeToGraphData } from '@antv/g6';

// Tree-shaped data structure
const treeData = {
  id: 'root',
  data: { label: 'Root Node' },
  children: [
    {
      id: 'child1',
      data: { label: 'Child Node 1' },
      children: [
        { id: 'grandchild1', data: { label: 'Grandchild Node 1' } },
        { id: 'grandchild2', data: { label: 'Grandchild Node 2' } },
      ],
    },
    {
      id: 'child2',
      data: { label: 'Child Node 2' },
    },
  ],
};

const graph = new Graph({
  container: 'container',
  data: treeToGraphData(treeData),   // convert to GraphData format
  layout: {
    type: 'mindmap',
    direction: 'H',
  },
  behaviors: ['drag-canvas', 'zoom-canvas', 'collapse-expand'],
});

graph.render();
```

## Loading remote data

```javascript
const graph = new Graph({
  container: 'container',
  data: { nodes: [], edges: [] },  // initial empty data
  layout: { type: 'force' },
  behaviors: ['drag-canvas', 'zoom-canvas'],
});

// Load data asynchronously
fetch('https://api.example.com/graph-data')
  .then((res) => res.json())
  .then((data) => {
    graph.setData(data);     // or set it before render
    graph.render();
  });

// Recommended approach: update after render completes
await graph.render();
const data = await fetch('/api/data').then((r) => r.json());
graph.setData(data);
await graph.draw();
```

## Data operation APIs

```javascript
// Reading data
const allNodes = graph.getNodeData();
const oneNode = graph.getNodeData('n1');
const allEdges = graph.getEdgeData();
const oneEdge = graph.getEdgeData('e1');

// Add
graph.addNodeData([
  { id: 'n10', data: { label: 'New Node' } },
]);
graph.addEdgeData([
  { source: 'n1', target: 'n10' },
]);
await graph.draw();

// Update
graph.updateNodeData([
  { id: 'n1', data: { label: 'Updated' }, style: { fill: 'red' } },
]);
await graph.draw();

// Delete
graph.removeNodeData(['n10']);    // also deletes associated edges
graph.removeEdgeData(['e1']);
await graph.draw();

// Batch update data (replace the full dataset)
graph.setData({ nodes: [...], edges: [...] });
await graph.draw();
```

## Separating style from data (best practice)

```javascript
// Recommended: put business data in data, and compute styles from data through callback functions
const nodes = [
  { id: 'n1', data: { name: 'High Priority', priority: 'high', value: 100 } },
  { id: 'n2', data: { name: 'Low Priority', priority: 'low', value: 30 } },
];

const graph = new Graph({
  container: 'container',
  data: { nodes, edges: [] },
  node: {
    style: {
      // Map data to styles through callback functions
      fill: (d) => d.data.priority === 'high' ? '#ff4d4f' : '#1783FF',
      size: (d) => Math.max(20, d.data.value / 2),
      labelText: (d) => d.data.name,
    },
  },
});
```

## Common errors and fixes

### Error 1: Putting business properties at the node top level

```javascript
// Incorrect: label, type, and other business properties are placed directly at the node top level
{ id: 'n1', label: 'Node 1', category: 'user', value: 100 }

// Correct: put business properties in the data field
{ id: 'n1', data: { label: 'Node 1', category: 'user', value: 100 } }
```

### Error 2: Missing source or target on an edge

```javascript
// Incorrect: missing source or target
{ id: 'e1', from: 'n1', to: 'n2' }    // v4 syntax

// Correct
{ id: 'e1', source: 'n1', target: 'n2' }
```

### Error 3: Duplicate node ID

```javascript
// Incorrect: duplicate IDs can cause rendering errors
const nodes = [
  { id: 'node1', data: { label: 'A' } },
  { id: 'node1', data: { label: 'B' } },   // duplicate id
];

// Correct: every node ID must be unique
const nodes = [
  { id: 'node-a', data: { label: 'A' } },
  { id: 'node-b', data: { label: 'B' } },
];
```

### Error 4: Edge source/target references a nonexistent node

```javascript
// Incorrect: references a nonexistent node ID
const edges = [
  { source: 'n1', target: 'n999' },  // n999 does not exist
];

// Correct: ensure both source and target exist in nodes
```

### Error 5: Duplicate edges cause the "Edge already exists" error

G6 does not allow duplicate edges (edges with the same source and target). When generating edges dynamically, deduplicate them; otherwise G6 throws an `Edge already exists: xxx-yyy` error.

```javascript
// Incorrect: randomly generated edges may produce duplicates
const edges = [];
for (let i = 0; i < 34; i++) {
  for (let j = 0; j < 3; j++) {
    const target = Math.floor(Math.random() * 34);
    if (target !== i) {
      edges.push({ source: `${i}`, target: `${target}` }); // may duplicate!
    }
  }
}

// Correct: use a Set to deduplicate and ensure every source-target pair is unique
const edges = [];
const edgeSet = new Set();
for (let i = 0; i < 34; i++) {
  for (let j = 0; j < 3; j++) {
    const target = Math.floor(Math.random() * 34);
    const key = `${i}-${target}`;
    const reverseKey = `${target}-${i}`;
    if (target !== i && !edgeSet.has(key) && !edgeSet.has(reverseKey)) {
      edgeSet.add(key);
      edges.push({ source: `${i}`, target: `${target}` });
    }
  }
}
```

**Best practice: prefer explicit static edge data and avoid random edge generation.** If dynamic generation is required, always check for duplicates before adding edges:

```javascript
// Recommended: use explicit edge data instead of relying on random generation
const data = {
  nodes: Array.from({ length: 10 }, (_, i) => ({ id: `${i}` })),
  edges: [
    { source: '0', target: '1' },
    { source: '0', target: '2' },
    { source: '1', target: '3' },
    { source: '2', target: '3' },
    // each source-target pair appears only once
  ],
};

const graph = new Graph({
  container: 'container',
  autoFit: 'view',
  data,
  node: {
    style: {
      labelText: (d) => d.id,
      labelPlacement: 'center',
      labelFill: '#fff',
    },
  },
  layout: { type: 'circular' },
  behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
});

graph.render();
```

### Error 6: treeToGraphData is not imported

```javascript
// Incorrect: forgot to import treeToGraphData from @antv/g6
import { Graph } from '@antv/g6';
// ...
data: treeToGraphData(treeData),  // ReferenceError: treeToGraphData is not defined

// Correct: import it explicitly
import { Graph, treeToGraphData } from '@antv/g6';
// ...
data: treeToGraphData(treeData),
```