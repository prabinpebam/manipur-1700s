---
id: "g6-behavior-lasso-collapse"
title: "G6 Lasso Select (lasso-select) and Collapse/Expand (collapse-expand)"
description: |
  lasso-select: freely draw a lasso selection area to select multiple elements.
  collapse-expand: click/double-click a node or combo to collapse/expand its subtree or internal nodes.

library: "g6"
version: "5.x"
category: "behaviors"
subcategory: "interaction"
tags:
  - "interaction"
  - "lasso"
  - "box selection"
  - "lasso-select"
  - "collapse-expand"
  - "collapse"
  - "expand"

related:
  - "g6-behavior-click-select"
  - "g6-combo-overview"
  - "g6-pattern-tree-graph"

difficulty: "intermediate"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
---

## Lasso selection (lasso-select)

Allow users to draw a free-form selection curve; enclosed elements are marked with the selected state.

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  width: 640,
  height: 480,
  data: {
    nodes: Array.from({ length: 20 }, (_, i) => ({
      id: `n${i}`,
       data: { label: `Node ${i}` },
    })),
    edges: Array.from({ length: 15 }, (_, i) => ({
      source: `n${i % 10}`,
      target: `n${(i + 3) % 20}`,
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
    state: {
      selected: {
        fill: '#ff4d4f',
        stroke: '#cf1322',
        halo: true,
        haloFill: '#ff4d4f',
        haloOpacity: 0.2,
      },
    },
  },
  layout: { type: 'force', preventOverlap: true },
  behaviors: [
    'drag-canvas',
    'zoom-canvas',
    {
      type: 'lasso-select',
      // Trigger the lasso by dragging with the right mouse button (avoids conflicts with canvas dragging)
      trigger: 'pointerdown',
      // Lasso style
      style: {
        fill: 'rgba(99, 149, 255, 0.1)',
        stroke: '#6395ff',
        lineWidth: 1,
        lineDash: [4, 2],
      },
      // Selected state name
      state: 'selected',
      // Real-time updates (dynamic highlighting during dragging)
      immediately: false,
      // Element types within the selected range
      itemTypes: ['node'],         // Select only nodes, not edges
    },
  ],
});

graph.render();

// Get all selected nodes
graph.on('canvas:pointerup', () => {
  const selectedNodes = graph.getElementDataByState('node', 'selected');
  console.log('Selected nodes:', selectedNodes.map(n => n.id));
});
```

### lasso-select configuration parameters

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `trigger` | `string` | `'pointerdown'` | Trigger event |
| `immediately` | `boolean` | `false` | Update selected state in real time during dragging |
| `state` | `string` | `'selected'` | Selected state name |
| `itemTypes` | `('node' \| 'edge' \| 'combo')[]` | `['node', 'edge', 'combo']` | Element types participating in selection |
| `style` | `PathStyleProps` | - | Lasso path style |

---

## Collapse/expand (collapse-expand)

Click/double-click a node (tree graph) or combo to collapse/expand a subtree.

```javascript
import { Graph, treeToGraphData } from '@antv/g6';

const treeData = {
  id: 'root',
   data: { label: 'Root node' },
  children: [
    {
      id: 'branch1',
       data: { label: 'Branch 1' },
      children: [
        { id: 'leaf1', data: { label: 'Leaf 1' } },
        { id: 'leaf2', data: { label: 'Leaf 2' } },
      ],
    },
    {
      id: 'branch2',
      data: { label: 'Branch 2' },
      children: [
        { id: 'leaf3', data: { label: 'Leaf 3' } },
      ],
    },
  ],
};

const graph = new Graph({
  container: 'container',
  width: 640,
  height: 480,
  data: treeToGraphData(treeData),
  node: {
    type: 'rect',
    style: {
      size: [100, 36],
      fill: '#1783FF',
      stroke: '#fff',
      radius: 4,
      labelText: (d) => d.data.label,
      labelPlacement: 'center',
      labelFill: '#fff',
    },
  },
  edge: {
    type: 'cubic-horizontal',
    style: { stroke: '#aaa' },
  },
  layout: {
    type: 'mindmap',
    direction: 'H',
    getHeight: () => 36,
    getWidth: () => 100,
    getVGap: () => 10,
    getHGap: () => 60,
  },
  behaviors: [
    'drag-canvas',
    'zoom-canvas',
    {
      type: 'collapse-expand',
      trigger: 'click',              // 'click' | 'dblclick'
      animation: true,               // Animate on collapse
      // Collapse/expand callbacks
      onCollapse: (id) => console.log('Collapse:', id),
      onExpand: (id) => console.log('Expand:', id),
    },
  ],
});

graph.render();
```

### collapse-expand configuration parameters

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `trigger` | `'click' \| 'dblclick'` | `'dblclick'` | Trigger mode |
| `animation` | `boolean` | `true` | Collapse/expand animation |
| `enable` | `boolean \| ((event) => boolean)` | `true` | Whether to enable |
| `align` | `boolean` | `true` | Whether to automatically center after collapsing |
| `onCollapse` | `(id: string) => void` | - | Callback after collapse completes |
| `onExpand` | `(id: string) => void` | - | Callback after expand completes |

### Control collapse/expand through the API

```javascript
// Collapse a node and its subtree
await graph.collapseElement('branch1');

// Expand
await graph.expandElement('branch1');

// Check state
console.log(graph.isCollapsed('branch1')); // true/false
```

## Common errors

### Error: Using collapse-expand in a non-tree graph

```javascript
// collapse-expand applies only to tree data (each node has a unique parent)
// Using it in an ordinary network graph can cause unexpected behavior

// For tree graphs only; use with treeToGraphData
import { treeToGraphData } from '@antv/g6';
data: treeToGraphData(treeData),
behaviors: [{ type: 'collapse-expand' }],
```
