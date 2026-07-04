---
id: "g6-plugin-edge-bundling-bubble"
title: "G6 Edge Bundling Plugin + Bubble Sets Plugin (edge-bundling / bubble-sets)"
description: |
  edge-bundling: Bundles adjacent edges together to reduce visual clutter and reveal high-level structure.
  bubble-sets: Uses bubble-shaped outlines to enclose node sets and clearly express relationships between sets, such as intersections and groups.

library: "g6"
version: "5.x"
category: "plugins"
subcategory: "advanced"
tags:
  - "edge-bundling"
  - "bubble-sets"
  - "edge bundling"
  - "bubble sets"
  - "set relationships"
  - "node grouping"

related:
  - "g6-plugin-fisheye-hull-watermark"
  - "g6-layout-circular"
  - "g6-layout-force"

difficulty: "intermediate"
completeness: "full"
created: "2026-04-16"
updated: "2026-04-16"
---

## Edge Bundling (edge-bundling)

Bundles edges with similar directions in a graph to reduce edge crossings and visual clutter in large-scale graphs while revealing high-level connection patterns. It is based on the FEDB (Force-Directed Edge Bundling) algorithm.

```javascript
import { Graph } from '@antv/g6';

// Edge bundling works best with a circular layout
fetch('https://assets.antv.antgroup.com/g6/circular.json')
  .then((res) => res.json())
  .then((data) => {
    const graph = new Graph({
      container: 'container',
      autoFit: 'view',
      data,
      layout: { type: 'circular' },
      node: { style: { size: 20 } },
      behaviors: ['drag-canvas', 'drag-element'],
      plugins: [
        {
          type: 'edge-bundling',
          key: 'bundling',
          bundleThreshold: 0.6,  // Edge compatibility threshold (0-1; higher values bundle fewer edges)
          K: 0.1,                // Edge strength (attraction)
        },
      ],
    });

    graph.render();
  });
```

### edge-bundling Configuration Parameters

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `type` | `string` | `'edge-bundling'` | Plugin type |
| `key` | `string` | - | Unique identifier for dynamic updates |
| `bundleThreshold` | `number` | `0.6` | Edge compatibility threshold: higher values bundle fewer edges; 0.4 gives a pronounced bundling effect, while 0.8 bundles fewer edges |
| `cycles` | `number` | `6` | Number of simulation cycles; affects computation quality |
| `divisions` | `number` | `1` | Initial number of subdivision points; affects edge subdivision granularity |
| `divRate` | `number` | `2` | Growth rate for subdivision points |
| `iterations` | `number` | `90` | Number of iterations in the first cycle |
| `iterRate` | `number` | `2/3` | Iteration count decay rate |
| `K` | `number` | `0.1` | Edge strength (attraction/repulsion): 0.05 is weak, 0.2 is strong |
| `lambda` | `number` | `0.1` | Initial step size |

```javascript
// Shorthand form (uses the default configuration)
plugins: ['edge-bundling']

// Custom configuration
plugins: [
  {
    type: 'edge-bundling',
    bundleThreshold: 0.1,   // Low threshold = more edges are bundled
    cycles: 8,
    K: 0.2,
  },
]

// Dynamic update
graph.updatePlugin({ key: 'bundling', bundleThreshold: 0.8 });
```

---

## Bubble Sets (bubble-sets)

Uses organic bubble contours to enclose specified node sets. This is useful for expressing relationships such as node groups and set intersections. Multiple bubble instances can be displayed side by side.

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  data: {
    nodes: [
      { id: 'n0', data: { cluster: 'a' }, style: { x: 200, y: 150 } },
      { id: 'n1',  { cluster: 'a' }, style: { x: 300, y: 200 } },
      { id: 'n2', data: { cluster: 'a' }, style: { x: 250, y: 300 } },
      { id: 'n3', data: { cluster: 'b' }, style: { x: 500, y: 150 } },
      { id: 'n4',  { cluster: 'b' }, style: { x: 550, y: 280 } },
    ],
    edges: [
      { source: 'n0', target: 'n1' },
      { source: 'n1', target: 'n2' },
      { source: 'n2', target: 'n3' },
      { source: 'n3', target: 'n4' },
    ],
  },
  behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
  plugins: [
    {
      type: 'bubble-sets',
      key: 'bubble-a',
      members: ['n0', 'n1', 'n2'],   // Required: node IDs to enclose
      fill: '#1783FF',
      fillOpacity: 0.1,
      stroke: '#1783FF',
      label: true,
      labelText: 'Group A',
    },
    {
      type: 'bubble-sets',
      key: 'bubble-b',
      members: ['n3', 'n4'],
      fill: '#F08F56',
      fillOpacity: 0.1,
      stroke: '#F08F56',
      label: true,
      labelText: 'Group B',
    },
  ],
});

graph.render();
```

### bubble-sets Configuration Parameters

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `type` | `string` | `'bubble-sets'` | Plugin type |
| `key` | `string` | - | Unique identifier; required for multiple instances |
| `members` | `string[]` | - | **Required**: list of node/edge IDs to wrap |
| `avoidMembers` | `string[]` | - | Node IDs the contour should avoid |
| `fill` | `string` | - | Bubble fill color |
| `fillOpacity` | `number` | - | Fill opacity (recommended: 0.05-0.2) |
| `stroke` | `string` | - | Border color |
| `strokeOpacity` | `number` | - | Border opacity |
| `label` | `boolean` | `true` | Whether to display a label |
| `labelText` | `string` | - | Label text content |
| `labelPlacement` | `string` | `'bottom'` | Label position: `left/right/top/bottom/center` |
| `labelBackground` | `boolean` | `false` | Whether to display a label background |
| `labelPadding` | `number \| number[]` | `0` | Label padding |
| `labelCloseToPath` | `boolean` | `true` | Whether the label stays close to the contour |
| `labelAutoRotate` | `boolean` | `true` | Whether the label rotates with the contour |

### Dynamically Update Bubble Set Members

```javascript
// Update members after initialization
graph.updatePlugin({
  key: 'bubble-a',
  members: ['n0', 'n1', 'n2', 'n3'],  // Add n3 to Group A
});
```

### Automatic Grouping Mode Based on Data Fields

```javascript
// After rendering, automatically build bubble sets based on the cluster field
graph.render().then(() => {
  const nodesByCluster = {};
  graph.getNodeData().forEach((node) => {
    const cluster = node.data.cluster;
    nodesByCluster[cluster] = nodesByCluster[cluster] || [];
    nodesByCluster[cluster].push(node.id);
  });

  const colors = { a: '#1783FF', b: '#F08F56', c: '#52C41A' };
  const plugins = Object.entries(nodesByCluster).map(([cluster, ids]) => ({
    type: 'bubble-sets',
    key: `bubble-${cluster}`,
    members: ids,
    fill: colors[cluster] || '#ccc',
    fillOpacity: 0.1,
    stroke: colors[cluster] || '#ccc',
    labelText: `cluster-${cluster}`,
    labelBackground: true,
    labelPadding: 4,
  }));

  graph.setPlugins(plugins);
  graph.draw();
});
```
