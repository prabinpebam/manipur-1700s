---
id: "g6-behavior-canvas-nav"
title: "G6 Canvas Navigation Interactions (Drag / Zoom / Scroll)"
description: |
  Use drag-canvas, zoom-canvas, and scroll-canvas to implement canvas dragging, zooming, and scrolling navigation.
  This is the foundational interaction configuration for almost all graph visualizations.

library: "g6"
version: "5.x"
category: "behaviors"
subcategory: "navigation"
tags:
  - "interaction"
  - "canvas"
  - "drag"
  - "zoom"
  - "drag-canvas"
  - "zoom-canvas"
  - "scroll-canvas"
  - "behavior"

related:
  - "g6-behavior-click-select"
  - "g6-behavior-drag-element"
  - "g6-plugin-minimap"

use_cases:
  - "Large graph navigation"
  - "Basic graph interactions"
  - "All graph visualization scenarios"

anti_patterns:
  - "Mobile scenarios require special handling for touch events"

difficulty: "beginner"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
author: "antv-team"
source_url: "https://g6.antv.antgroup.com/manual/behavior/drag-canvas"
---

## Core concepts

Three canvas navigation behaviors:
- `drag-canvas`: drag the canvas with the mouse
- `zoom-canvas`: zoom the canvas with the mouse wheel
- `scroll-canvas`: scroll the canvas with the mouse wheel (an alternative to zoom, suitable for pages with scrollbars)

## Minimal runnable example

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
      { id: 'edge1', source: 'node1', target: 'node2' },
      { id: 'edge2', source: 'node1', target: 'node3' },
      { id: 'edge3', source: 'node2', target: 'node4' },
      { id: 'edge4', source: 'node3', target: 'node5' },
    ],
  },
  layout: { type: 'grid' },
  behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
});

graph.render();
```

## Common configurations

### Full parameter configuration

```javascript
behaviors: [
  {
    type: 'drag-canvas',
    // Allowed drag directions
    direction: 'both',          // 'both' | 'x' | 'y'
    // Drag boundary limit
    range: Infinity,            // Distance limit beyond the boundary
    // Keyboard triggers
    trigger: {
      up: ['ArrowUp'],
      down: ['ArrowDown'],
      left: ['ArrowLeft'],
      right: ['ArrowRight'],
    },
  },
  {
    type: 'zoom-canvas',
    // Zoom range
    range: [0.1, 10],           // [minimum zoom, maximum zoom]
    // Animation
    animation: { duration: 200 },
  },
],
```

### Prevent accidental node hits when dragging the canvas

```javascript
behaviors: [
  {
    type: 'drag-canvas',
    // Drag only on the canvas background (avoids conflicts with node dragging)
    enable: (event) => event.targetType === 'canvas',
  },
  'drag-element',
],
```

### Move the canvas with keyboard arrow keys

```javascript
behaviors: [
  {
    type: 'drag-canvas',
    trigger: {
      up: ['ArrowUp'],
      down: ['ArrowDown'],
      left: ['ArrowLeft'],
      right: ['ArrowRight'],
    },
  },
  'zoom-canvas',
],
```

### Adapt to pages with scrollbars

```javascript
// When the page has scrollbars, the mouse wheel scrolls the page by default instead of zooming the graph
// Use scroll-canvas instead of zoom-canvas
behaviors: [
  'drag-canvas',
  'scroll-canvas',    // Scroll the canvas with the wheel (up, down, left, right)
  // Zoom while holding Ctrl
  {
    type: 'zoom-canvas',
    key: 'ctrl',      // Zoom only with Ctrl + mouse wheel
  },
  'drag-element',
],
```

## Programmatically control the viewport

```javascript
// Zoom to a specified scale
graph.zoomTo(1.5);
graph.zoomTo(1.5, true);   // With animation

// Restore the default zoom
graph.zoomTo(1);

// Pan the canvas
graph.translateBy(100, 50);    // Relative movement
graph.translateTo([400, 300]); // Move to an absolute position

// Fit the view
graph.fitView();               // Zoom so the entire graph is visible
graph.fitCenter();             // Center without zooming

// Focus on a node
graph.focusElement('node1');
```

## Common errors and fixes

### Error 1: Edge data missing unique IDs causes duplicate edge conflicts

**Symptom:** `Edge already exists: 12-20`

**Cause analysis:** In G6 5.x, if edge data does not explicitly specify an `id`, the system automatically uses `${source}-${target}` as the edge ID. When edges are generated randomly, duplicate edges with the same source-target combination may be produced, causing ID conflict errors.

```javascript
// Incorrect example: randomly generated edges may produce duplicate source-target combinations
const edges = [];
for (let i = 0; i < 34; i++) {
  const target = Math.floor(Math.random() * 34);
  if (target !== i) {
    edges.push({ source: `${i}`, target: `${target}` });
    // If the same source-target is added twice, ID "i-target" is duplicated and an error is thrown
  }
}
```

**Fix 1:** Explicitly specify a unique `id` for each edge

```javascript
// Correct example: specify a unique id for each edge
const edges = [];
let edgeIndex = 0;
for (let i = 0; i < 34; i++) {
  const target = Math.floor(Math.random() * 34);
  if (target !== i) {
    edges.push({
      id: `edge-${edgeIndex++}`,  // Explicitly specify a unique id
      source: `${i}`,
      target: `${target}`,
    });
  }
}
```

**Fix 2:** Deduplicate when generating edges to avoid repeated source-target pairs

```javascript
// Correct example: use Set to deduplicate and avoid duplicate edges
const edgeSet = new Set();
const edges = [];
for (let i = 0; i < 34; i++) {
  const target = Math.floor(Math.random() * 34);
  const key = `${i}-${target}`;
  if (target !== i && !edgeSet.has(key)) {
    edgeSet.add(key);
    edges.push({ source: `${i}`, target: `${target}` });
  }
}
```

**Fix 3 (recommended):** Use explicit static data directly instead of relying on random generation

```javascript
// Recommended: use deterministic data to avoid uncertainty from randomness
const data = {
  nodes: Array.from({ length: 34 }, (_, i) => ({ id: `${i}` })),
  edges: [
    { source: '0', target: '1' },
    { source: '0', target: '2' },
    { source: '1', target: '3' },
    // ... explicitly specified edge list with no duplicates
  ],
};
```

### Error 2: Syntax error in the minimal example code

**Symptom:** The `data` field is missing or the syntax is incomplete, causing blank rendering.

**Cause:** The `data` field is required in the `Graph` constructor and must contain `nodes` and `edges` arrays.

```javascript
// Incorrect example: missing data field
const graph = new Graph({
  container: 'container',
  { nodes: [...], edges: [...] },  // Syntax error: missing data: key
  behaviors: ['drag-canvas'],
});

// Correct example
const graph = new Graph({
  container: 'container',
  data: {
    nodes: [{ id: 'node1' }, { id: 'node2' }],
    edges: [{ source: 'node1', target: 'node2' }],
  },
  behaviors: ['drag-canvas'],
});
```

### Error 3: treeToGraphData is not defined

**Symptom:** `treeToGraphData is not defined`

**Cause:** `treeToGraphData` is a utility function provided by G6 for converting tree-structured data into graph data. It must be explicitly imported from `@antv/g6` and cannot be used directly without import.

```javascript
// Incorrect example: used directly without import
const data = treeToGraphData(treeData);

// Correct example: import before use
import { Graph, treeToGraphData } from '@antv/g6';

const data = treeToGraphData(treeData);
const graph = new Graph({
  container: 'container',
  data,
  behaviors: ['drag-canvas', 'zoom-canvas'],
});
graph.render();
```

### Error 4: Blank canvas rendering

**Common causes and fixes:**

1. **Container size is 0:** Ensure the container DOM element has explicit width and height, or specify `width` and `height` in the Graph configuration.
2. **Empty data:** Ensure the `data.nodes` array is not empty.
3. **render() not called:** You must explicitly call `graph.render()` for rendering.
4. **autoFit configuration:** Use `autoFit: 'view'` to automatically fit the view and avoid graph elements being outside the visible canvas area.

```javascript
// Complete runnable example
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  autoFit: 'view',
  data: {
    nodes: [{ id: 'node1' }, { id: 'node2' }, { id: 'node3' }],
    edges: [
      { source: 'node1', target: 'node2' },
      { source: 'node2', target: 'node3' },
    ],
  },
  layout: { type: 'circular' },
  behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
});

graph.render();
```
