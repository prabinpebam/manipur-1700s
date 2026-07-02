---
id: "g6-core-transforms-animation"
title: "G6 Data Transforms and Animation System"
description: |
  Transforms: process graph data before rendering (node size mapping, parallel edge processing, and more).
  Animation: element enter/exit/update animations, viewport animation, and custom animation configuration.

library: "g6"
version: "5.x"
category: "core"
subcategory: "data"
tags:
  - "transforms"
  - "animation"
  - "map-node-size"
  - "process-parallel-edges"
  - "animation"

related:
  - "g6-core-graph-init"
  - "g6-core-graph-api"

difficulty: "intermediate"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
---

## Data transforms (Transforms)

Transforms are a processing pipeline that runs before data is bound to graph elements. They map data to visual properties.

### map-node-size (node size mapping)

Map a node data field to a node size range:

```javascript
const graph = new Graph({
  container: 'container',
  data: {
    nodes: [
       { id: 'n1', data: { label: 'A', value: 10 } },
       { id: 'n2', data: { label: 'B', value: 50 } },
       { id: 'n3', data: { label: 'C', value: 100 } },
    ],
    edges: [
       { source: 'n1', target: 'n2' },
       { source: 'n2', target: 'n3' },
    ],
  },
  // transforms are configured at the top level of Graph configuration
  transforms: [
    {
      type: 'map-node-size',
      field: 'value',          // mapped data field (read from node.data)
      range: [16, 60],         // mapped size range [minimum, maximum] (px)
    },
  ],
  node: {
    type: 'circle',
    style: {
      // size does not need to be set manually; the transform computes it automatically
      fill: '#1783FF',
      stroke: '#fff',
      labelText: (d) => d.data.label,
      labelPlacement: 'bottom',
    },
  },
  layout: { type: 'force', preventOverlap: true },
  behaviors: ['drag-canvas', 'zoom-canvas'],
});

graph.render();
```

### process-parallel-edges (parallel edge processing)

When multiple edges exist between two nodes, this transform automatically offsets them for display:

```javascript
transforms: [
  {
    type: 'process-parallel-edges',
    offset: 15,                // spacing between parallel edges (px)
    // Apply curves only to edges with a parallel relationship
  },
],
edge: {
  type: 'quadratic',           // recommended to use with quadratic edges
  style: {
    stroke: '#aaa',
    endArrow: true,
  },
},
```

### Built-in transforms list

| Type | Description | Common parameters |
|------|------|---------|
| `map-node-size` | Data-driven node size | `field`, `range` |
| `process-parallel-edges` | Offset parallel edges for display | `offset` |
| `place-radial-labels` | Automatically position labels in radial layouts | - |
| `arrange-draw-order` | Adjust element rendering order | `nodeBeforeEdge` |
| `get-edge-actual-ends` | Calculate actual edge endpoints (supports ports) | - |
| `update-related-edge` | Update related edges when nodes move | - |

---

## Animation system

### Global animation switch

```javascript
const graph = new Graph({
  container: 'container',
  // Disable all animations (improves performance for large graphs)
  animation: false,
  // ...
});
```

### Element enter/exit/update animations

```javascript
const graph = new Graph({
  container: 'container',
    { nodes: [...], edges: [...] },
  node: {
    type: 'circle',
    style: { size: 40, fill: '#1783FF' },
    // animation configuration (each phase is independent)
    animation: {
      // node initial enter animation
      enter: [
        {
          fields: ['opacity'],         // animated property
          from: { opacity: 0 },        // start value
          to: { opacity: 1 },          // end value
          duration: 500,
          easing: 'ease-in',
        },
      ],
      // node update animation (when data changes)
      update: [
        {
          fields: ['fill', 'size'],
          duration: 300,
          easing: 'linear',
        },
      ],
      // node exit animation (when deleted)
      exit: [
        {
          fields: ['opacity'],
          to: { opacity: 0 },
          duration: 300,
        },
      ],
    },
  },
});
```

### Viewport animation configuration

All viewport operations (fitView, focusElement, zoomTo, translateTo) support animation parameters:

```javascript
// ViewportAnimationEffectTiming
await graph.fitView({
  padding: 20,
  // animation configuration
  easing: 'ease-in-out',
  duration: 600,
});

await graph.zoomTo(1.5, {
  easing: 'ease-out',
  duration: 400,
});

await graph.focusElement('n1', {
  easing: 'ease-in-out',
  duration: 500,
});
```

### Common easing values

| Value | Description |
|----|------|
| `'linear'` | Constant speed |
| `'ease'` | Slow, fast, then slow |
| `'ease-in'` | Slow then fast |
| `'ease-out'` | Fast then slow |
| `'ease-in-out'` | Slow, fast, slow |
| `'cubic-bezier(...)` | Custom cubic Bezier curve |

---

## Performance optimization suggestions

```javascript
// 1. Disable animations for large graphs (> 1000 nodes)
animation: false,

// 2. Use the optimize-viewport-transform behavior to reduce rendering work
behaviors: [
  'drag-canvas',
  'zoom-canvas',
  {
    type: 'optimize-viewport-transform',
    // Hide details (labels, etc.) during viewport transforms to improve frame rate
    shapes: (id, elementType) => {
      if (elementType === 'node') return ['label', 'icon', 'halo'];
      return ['label'];
    },
  },
],

// 3. Stop force-directed iterations after layout convergence
layout: {
  type: 'force',
  maxIteration: 300,           // limit the maximum number of iterations
  minMovement: 0.5,            // convergence threshold
},
```