---
id: "g6-layout-advanced"
title: "G6 Advanced Layouts (concentric / radial / mds / fruchterman)"
description: |
  Configuration and use cases for four layouts: concentric, radial,
  mds (dimensionality reduction with distance preservation), and fruchterman (fast force-directed layout).

library: "g6"
version: "5.x"
category: "layouts"
subcategory: "advanced"
tags:
  - "layout"
  - "concentric"
  - "radial"
  - "concentric"
  - "radial"
  - "mds"
  - "fruchterman"

related:
  - "g6-layout-force"
  - "g6-layout-circular"
  - "g6-layout-dagre"

difficulty: "intermediate"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
---

## Concentric layout (concentric)

Layer nodes by node property value; nodes with larger values are placed in the inner rings.

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  width: 640,
  height: 640,
  data: {
    nodes: Array.from({ length: 20 }, (_, i) => ({
      id: `n${i}`,
           { label: `N${i}`, degree: Math.floor(Math.random() * 10) },
    })),
    edges: Array.from({ length: 25 }, (_, i) => ({
      source: `n${i % 10}`,
      target: `n${(i * 3 + 5) % 20}`,
    })),
  },
  node: {
    type: 'circle',
    style: {
      size: 30,
      fill: '#1783FF',
      stroke: '#fff',
      labelText: (d) => d.data.label,
      labelPlacement: 'bottom',
    },
  },
  layout: {
    type: 'concentric',
    // Field used for sorting (larger values are placed in inner rings)
    sortBy: 'degree',            // Field name or 'degree' (automatically computed degree)
    // Minimum concentric ring spacing (px)
    minNodeSpacing: 20,
    // Distance between levels
    levelDistance: 60,
    // Prevent node overlap
    preventOverlap: true,
    nodeSize: 30,
    // Outermost ring radius
    maxLevelDiff: 0.5,
  },
  behaviors: ['drag-canvas', 'zoom-canvas'],
});

graph.render();
```

---

## Radial layout (radial)

Arrange nodes outward from a specified center node by graph distance for a clear hierarchy.

```javascript
const graph = new Graph({
  container: 'container',
  data: {
    nodes: Array.from({ length: 20 }, (_, i) => ({ id: `n${i}`, data: {} })),
    edges: [
       { source: 'n0', target: 'n1' },
       { source: 'n0', target: 'n2' },
       { source: 'n0', target: 'n3' },
       { source: 'n1', target: 'n4' },
       { source: 'n1', target: 'n5' },
      // ...
    ],
  },
  node: {
    type: 'circle',
    style: {
      size: 30,
      fill: '#1783FF',
      stroke: '#fff',
      labelText: (d) => d.id,
      labelPlacement: 'bottom',
    },
  },
  layout: {
    type: 'radial',
    // Center node id (defaults to the first node)
    focusNode: 'n0',
    // Spacing for each layer
    unitRadius: 80,
    // Prevent overlap
    preventOverlap: true,
    nodeSize: 30,
    // Strict radii (try to place nodes in each layer on the same radius)
    strictRadii: true,
    // Spacing between child nodes
    nodeSpacing: 5,
  },
  behaviors: ['drag-canvas', 'zoom-canvas'],
});

graph.render();
```

---

## Dimensionality reduction layout (mds)

Preserve graph distances between nodes (shortest-path distances) when arranging them; suitable for showing similarity/distance relationships.

```javascript
const graph = new Graph({
  container: 'container',
  width: 640,
  height: 480,
    { nodes: [...], edges: [...] },
  layout: {
    type: 'mds',
    // Edge weight field (read from edge.data; affects node distance calculation)
    linkDistance: 100,
  },
  behaviors: ['drag-canvas', 'zoom-canvas'],
});
```

---

## Fast force-directed layout (fruchterman)

Faster than d3-force, suitable for medium-sized graphs (hundreds of nodes), and supports GPU acceleration.

```javascript
const graph = new Graph({
  container: 'container',
  data: { nodes: [...], edges: [...] },
  layout: {
    type: 'fruchterman',
    // Number of iterations (more iterations are more stable but slower)
    iterations: 1000,
    // Gravity coefficient (prevents nodes from flying away)
    gravity: 10,
    // Speed (affects convergence speed)
    speed: 5,
    // Whether to enable clustering
    clustering: false,
    // Repulsive force between nodes
    k: undefined,           // Automatically computed by default
    // Use WebWorker (runs asynchronously without blocking the main thread)
    workerEnabled: true,
  },
  behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
});

graph.render();
```

### Comparison between fruchterman and force

| Feature | force (d3-force) | fruchterman |
|------|-----------------|-------------|
| Algorithm | D3 force-directed | Fruchterman-Reingold |
| Performance | Medium | Faster |
| GPU acceleration | Not supported | Supported |
| Configurable force types | Yes (link/many/center...) | No |
| Large-scale graphs | Requires optimization | Better |

---

## Layout selection guide

```
Need hierarchy?
  -> Directed acyclic graph (DAG): dagre / antv-dagre
  -> Tree structure: compact-box / mindmap / dendrogram / indented

Need circular/symmetric arrangement?
  -> Small number of nodes: circular
  -> Layered by attributes: concentric
  -> Centered on a specific point: radial

Need a physical spring effect?
  -> Small graph (< 200 nodes): force / d3-force
  -> Medium graph (< 500 nodes): fruchterman
  -> Large graph (> 500 nodes): force-atlas2

Need to preserve original positional relationships?
  -> Use node x/y coordinates + layout: { type: 'preset' } (or do not set a layout)

Other special needs?
  -> Grid alignment: grid
  -> Preserve graph distance: mds
```
