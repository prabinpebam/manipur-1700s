---
id: "g6-layout-combo-fishbone"
title: "G6 Composite Layout + Fishbone Layout (combo-combined / fishbone)"
description: |
  combo-combined: designed specifically for graphs with Combo groups; outer nodes use force-directed layout, while the inside of combos uses layouts such as concentric.
  fishbone: fishbone diagram layout, suitable for hierarchical structures, cause-and-effect analysis, failure analysis, and other scenarios.

library: "g6"
version: "5.x"
category: "layouts"
subcategory: "hierarchical"
tags:
  - "combo-combined"
  - "fishbone"
  - "composite layout"
  - "fishbone diagram"
  - "cause-and-effect analysis"
  - "Combo layout"

related:
  - "g6-combo-overview"
  - "g6-layout-force"
  - "g6-layout-advanced"

difficulty: "intermediate"
completeness: "full"
created: "2026-04-16"
updated: "2026-04-16"
---

## Composite layout (combo-combined)

Designed specifically for graphs containing Combo groups. By default, the outer layer uses a force-directed layout (gForce), while the inside of combos uses a concentric layout (Concentric), balancing overall stability with clear internal structure.

> Warning: **autoFit blank-screen trap**: In `combo-combined`, the outer default `gForce` is an asynchronous force-directed layout. When `autoFit: 'view'` is set directly in the Graph config, `fitView` runs before the force-directed iteration starts. All nodes are stacked at the origin, the bounding box area is zero, and the zoom ratio becomes abnormal, causing a **blank screen**.
>
> Correct approach: **do not set `autoFit` in the config**. Instead, listen for `GraphEvent.AFTER_LAYOUT` and then call `fitView()`.

```javascript
import { Graph, GraphEvent } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  // Do not set autoFit: 'view' here; it triggers before force-directed iteration and causes a blank screen
  data: {
    nodes: [
      { id: 'n1', combo: 'c1', data: { label: 'Node 1' } },
      { id: 'n2', combo: 'c1', data: { label: 'Node 2' } },
      { id: 'n3', combo: 'c1', data: { label: 'Node 3' } },
      { id: 'n4', combo: 'c2', data: { label: 'Node 4' } },
      { id: 'n5', combo: 'c2', data: { label: 'Node 5' } },
      { id: 'n6', data: { label: 'Free node' } },
    ],
    edges: [
      { source: 'n1', target: 'n4' },
      { source: 'n3', target: 'n5' },
      { source: 'n5', target: 'n6' },
    ],
    combos: [
      { id: 'c1',  { label: 'Group A' } },
      { id: 'c2', data: { label: 'Group B' } },
    ],
  },
  node: {
    style: {
      size: 24,
      labelText: (d) => d.data.label,
    },
    palette: {
      type: 'group',
      field: (d) => d.combo,
    },
  },
  combo: {
    type: 'rect',
    style: {
      labelText: (d) => d.data.label,  // Read business data from the data field; do not put it in the style field
      labelPlacement: 'top',
      padding: 20,
    },
  },
  layout: {
    type: 'combo-combined',
    comboPadding: 10,    // Padding inside Combo (affects force calculation; recommended to match visual padding)
    nodeSize: 24,        // Node size (used for collision detection)
    spacing: 8,          // Minimum spacing to prevent overlap
  },
  behaviors: ['drag-element', 'drag-canvas', 'zoom-canvas'],
});

// Run fitView after the force-directed layout completes to avoid a blank screen
graph.on(GraphEvent.AFTER_LAYOUT, () => {
  graph.fitView({ padding: 20 });
});

graph.render();
```
---

## Fishbone layout (fishbone)

The fishbone layout arranges hierarchical data into a fishbone shape. It is suitable for cause-and-effect relationships (Ishikawa/fishbone diagrams), failure analysis, multi-factor analysis, and similar scenarios.

> Note: fishbone requires tree data and is usually used with `treeToGraphData()`.

```javascript
import { Graph, treeToGraphData } from '@antv/g6';

const treeData = {
  id: 'Result',
  children: [
    {
      id: 'Cause A',
      children: [
        { id: 'Sub-cause A1' },
        { id: 'Sub-cause A2' },
      ],
    },
    {
      id: 'Cause B',
      children: [
        { id: 'Sub-cause B1' },
        { id: 'Sub-cause B2', children: [{ id: 'Sub-sub-cause B2-1' }] },
      ],
    },
    { id: 'Cause C' },
  ],
};

const graph = new Graph({
  container: 'container',
  width: 900,
  height: 500,
  autoFit: 'view',
   treeToGraphData(treeData),
  node: {
    type: 'rect',
    style: {
      size: [80, 30],
      fill: '#e6f7ff',
      stroke: '#1783FF',
      labelText: (d) => d.id,
      labelPlacement: 'center',
      labelFill: '#333',
    },
  },
  edge: {
    type: 'polyline',
    style: {
      stroke: '#1783FF',
      lineWidth: 2,
    },
  },
  layout: {
    type: 'fishbone',
    direction: 'LR',   // 'LR': fish head on the left; 'RL': fish head on the right (default)
    hGap: 60,          // Horizontal spacing
    vGap: 40,          // Vertical spacing
  },
  behaviors: ['drag-canvas', 'zoom-canvas'],
});

graph.render();
```

### fishbone configuration parameters

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `type` | `string` | `'fishbone'` | Layout type |
| `direction` | `'LR' \| 'RL'` | `'RL'` | Direction: LR means fish head on the left, RL means fish head on the right |
| `hGap` | `number` | - | Horizontal spacing |
| `vGap` | `number` | - | Vertical spacing |
| `getRibSep` | `(node) => number` | `() => 60` | Fishbone spacing callback |
| `nodeSize` | `number \| [number, number] \| Function` | - | Node size |
| `nodeFilter` | `(node) => boolean` | - | Node filter participating in layout |
| `preLayout` | `boolean` | - | Whether to precompute layout before initialization |

### 6M fishbone diagram (Ishikawa diagram) example

```javascript
import { Graph } from '@antv/g6';

// Directly use flat data with depth and children fields (G6 fishbone supports this format)
const graph = new Graph({
  container: 'container',
  width: 1000,
  height: 600,
  autoFit: 'view',
  data: {
    nodes: [
      { id: 'Quality issue', depth: 0, children: ['Man', 'Machine', 'Material', 'Method', 'Environment', 'Measurement'] },
      { id: 'Man', depth: 1, children: ['Insufficient training', 'Operation error'] },
      { id: 'Insufficient training', depth: 2 },
      { id: 'Operation error', depth: 2 },
      { id: 'Machine', depth: 1, children: ['Equipment aging'] },
      { id: 'Equipment aging', depth: 2 },
      { id: 'Material', depth: 1 },
      { id: 'Method', depth: 1, children: ['Missing process'] },
      { id: 'Missing process', depth: 2 },
      { id: 'Environment', depth: 1 },
      { id: 'Measurement', depth: 1 },
    ],
    edges: [
      { source: 'Quality issue', target: 'Man' },
      { source: 'Quality issue', target: 'Machine' },
      { source: 'Quality issue', target: 'Material' },
      { source: 'Quality issue', target: 'Method' },
      { source: 'Quality issue', target: 'Environment' },
      { source: 'Quality issue', target: 'Measurement' },
      { source: 'Man', target: 'Insufficient training' },
      { source: 'Man', target: 'Operation error' },
      { source: 'Machine', target: 'Equipment aging' },
      { source: 'Method', target: 'Missing process' },
    ],
  },
  node: {
    type: 'rect',
    style: {
      size: [80, 32],
      fill: '#fff7e6',
      stroke: '#fa8c16',
      lineWidth: 1,
      labelText: (d) => d.id,
      labelPlacement: 'center',
    },
  },
  edge: {
    type: 'polyline',
    style: { stroke: '#fa8c16', lineWidth: 2 },
  },
  layout: {
    type: 'fishbone',
    direction: 'RL',
    hGap: 60,
    vGap: 48,
  },
  behaviors: ['drag-canvas', 'zoom-canvas'],
});

graph.render();
```
