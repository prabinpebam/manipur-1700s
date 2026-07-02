---
id: "g6-behavior-drag-element"
title: "G6 Drag Element Interaction"
description: |
  Use drag-element and drag-element-force to implement node dragging.
  Ordinary dragging is used for fixed layouts, while the force version is used in force-directed graphs to preserve physical simulation.

library: "g6"
version: "5.x"
category: "behaviors"
subcategory: "dragging"
tags:
  - "interaction"
  - "drag"
  - "drag-element"
  - "behavior"
  - "move nodes"

related:
  - "g6-behavior-click-select"
  - "g6-behavior-drag-canvas"
  - "g6-layout-force"

use_cases:
  - "Manually adjust node positions"
  - "Interactive force-directed graphs"
  - "Editable charts"

anti_patterns:
  - "Do not use ordinary drag-element in force-directed layouts; use drag-element-force instead"
  - "Do not generate edge data randomly; avoid duplicate edges that cause Edge already exists errors"

difficulty: "beginner"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
author: "antv-team"
source_url: "https://g6.antv.antgroup.com/manual/behavior/drag-element"
---

## Core concepts

- `drag-element`: drag a node to a specified position while other nodes remain still (suitable for non-force-directed layouts)
- `drag-element-force`: continue the physical simulation during dragging (suitable for force-directed layouts)

## Important notes

### Edge data must not be duplicated

Each edge in G6 must be unique (edges with the same source + target cannot be added repeatedly), otherwise an `Edge already exists: {source}-{target}` error is thrown.

**Edge data must be deduplicated when generated.** Do not directly push randomly generated edges; use a Set or Map to record existing edges.

```javascript
// Incorrect: randomly generated edges may produce duplicates
const edges = [];
for (let i = 0; i < 34; i++) {
  for (let j = 0; j < 3; j++) {
    const target = Math.floor(Math.random() * 34);
    edges.push({ source: `${i}`, target: `${target}` }); // May duplicate!
  }
}

// Correct: use Set for deduplication
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

### Use the data provided by the prompt directly

When the prompt provides specific node and edge data, use it directly instead of randomly generating data yourself to avoid duplicate edges and other issues.

## Minimal runnable example

```javascript
import { Graph } from '@antv/g6';

const data = {
  nodes: [
    { id: '0' },
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
  ],
  edges: [
    { source: '0', target: '1' },
    { source: '0', target: '2' },
    { source: '1', target: '3' },
    { source: '2', target: '4' },
    { source: '3', target: '5' },
  ],
};

const graph = new Graph({
  container: 'container',
  autoFit: 'view',
  data,
  node: {
    style: {
      labelText: (d) => d.id,
      labelFill: '#fff',
      labelPlacement: 'center',
    },
  },
  layout: { type: 'circular' },
  behaviors: [
    'drag-canvas',
    'zoom-canvas',
    'drag-element',
  ],
});

graph.render();
```

## Common variants

### Dragging in force-directed graphs

```javascript
behaviors: [
  'drag-canvas',
  'zoom-canvas',
  'drag-element-force',       // Force-directed layouts must use the force version
],
layout: { type: 'force', preventOverlap: true },
```

### Full configuration

```javascript
behaviors: [
  'drag-canvas',
  'zoom-canvas',
  {
    type: 'drag-element',
    // Whether to enable; by default, nodes and combos can be dragged
    enable: (event) => ['node', 'combo'].includes(event.targetType),
    // Drag animation
    animation: true,
    // Effect after drag ends: 'move' | 'link' | 'none'
    dropEffect: 'move',
    // Hide related edges during dragging (improves performance): 'none' | 'out' | 'in' | 'both' | 'all'
    hideEdge: 'none',
    // Show a ghost node (shadow node) while dragging
    shadow: true,
    // Dragging state name
    state: 'selected',
    // Custom cursor styles
    cursor: {
      default: 'default',
      grab: 'grab',
      grabbing: 'grabbing',
    },
  },
],
```

### Batch dragging after multi-selection

```javascript
// Combine with click-select to implement multi-select dragging
behaviors: [
  'drag-canvas',
  'zoom-canvas',
  {
    type: 'click-select',
    multiple: true,
    state: 'selected',
  },
  {
    type: 'drag-element',
    // During dragging, all nodes in the selected state move together
    state: 'selected',
  },
],
```

## Common errors and fixes

### Error 1: Using ordinary drag-element in a force-directed graph

```javascript
// Dragged nodes in a force-directed graph do not participate in the physical simulation
layout: { type: 'force' },
behaviors: ['drag-element'],   // Incorrect!

// Use drag-element-force in force-directed graphs
layout: { type: 'force' },
behaviors: ['drag-element-force'],
```

### Error 2: Randomly generated edges cause duplicate edge errors

**Symptom:** `Edge already exists: 12-20`

**Cause:** When edge data is generated randomly, duplicate edges with the same source + target may be produced, and G6 does not allow duplicate edges.

```javascript
// Incorrect: random generation may produce duplicate edges
const edges = [];
for (let i = 0; i < 34; i++) {
  const numEdges = 2 + Math.floor(Math.random() * 2);
  for (let j = 0; j < numEdges; j++) {
    const target = Math.floor(Math.random() * 34);
    if (target !== i) {
      edges.push({ source: `${i}`, target: `${target}` }); // May duplicate!
    }
  }
}

// Correct solution 1: directly use the fixed data provided by the prompt
const data = {
  nodes: [{ id: '0' }, { id: '1' }, /* ... */ { id: '33' }],
  edges: [
    { source: '0', target: '1' },
    { source: '0', target: '2' },
    // ... use deterministic, non-duplicated edge data
  ],
};

// Correct solution 2: deduplicate with Set during generation
const edges = [];
const edgeSet = new Set();
for (let i = 0; i < 34; i++) {
  for (let j = i + 1; j < 34; j++) {
    // Generate in order; naturally no duplicates
    if (Math.random() < 0.1) { // Control edge density
      edgeSet.add(`${i}-${j}`);
      edges.push({ source: `${i}`, target: `${j}` });
    }
  }
}
```

### Error 3: The label field is in the wrong location in node data

In G6 5.x, node labels are configured through styles, not directly in the data field:

```javascript
// Incorrect: G6 5.x does not support configuring label directly in data
nodes: [{ id: 'n1', label: 'A' }]

// Correct: configure through node.style.labelText
node: {
  style: {
    labelText: (d) => d.id,  // Or d.data?.label
    labelPlacement: 'center',
    labelFill: '#fff',
  },
},
```

### Error 4: treeToGraphData is not imported

If tree data must be converted to graph data, import `treeToGraphData` from `@antv/g6`:

```javascript
// Incorrect: directly using an unimported function
data: treeToGraphData(treeData),  // ReferenceError: treeToGraphData is not defined

// Correct: import before use
import { Graph, treeToGraphData } from '@antv/g6';

const graph = new Graph({
  data: treeToGraphData(treeData),
  // ...
});
```
