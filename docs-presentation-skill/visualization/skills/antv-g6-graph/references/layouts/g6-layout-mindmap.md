---
id: "g6-layout-mindmap"
title: "G6 Mindmap Layout"
description: |
  Use the mindmap layout to display tree data,
  with the root node centered and child nodes expanded to both sides.

library: "g6"
version: "5.x"
category: "layouts"
subcategory: "tree"
tags:
  - "layout"
  - "mindmap"
  - "mindmap"
  - "tree"
  - "tree"
  - "branch"

related:
  - "g6-core-data-structure"
  - "g6-layout-dagre"
  - "g6-behavior-collapse-expand"

use_cases:
  - "Mindmaps"
  - "Knowledge trees"
  - "Category directories"
  - "Decision trees"

anti_patterns:
  - "Do not use the mindmap layout for non-tree data (convert with treeToGraphData first)"
  - "Nodes become too dense when the depth exceeds 5 levels"

difficulty: "intermediate"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
author: "antv-team"
source_url: "https://g6.antv.antgroup.com/manual/layout/mindmap"
---

## Core concepts

The mindmap layout expands tree data from the root node to both sides (or one side), and is a classic layout for knowledge graphs and category displays.

**Prerequisite:** Tree data is required and should be passed in after conversion with `treeToGraphData()`.

## Minimal runnable example

```javascript
import { Graph, treeToGraphData } from '@antv/g6';

const treeData = {
  id: 'root',
  data: { label: 'Central topic' },
  children: [
    {
      id: 'branch1',
      data: { label: 'Branch 1' },
      children: [
         { id: 'leaf1', data: { label: 'Item 1.1' } },
         { id: 'leaf2', data: { label: 'Item 1.2' } },
      ],
    },
    {
      id: 'branch2',
      data: { label: 'Branch 2' },
      children: [
         { id: 'leaf3', data: { label: 'Item 2.1' } },
         { id: 'leaf4', data: { label: 'Item 2.2' } },
         { id: 'leaf5', data: { label: 'Item 2.3' } },
      ],
    },
    {
      id: 'branch3',
      data: { label: 'Branch 3' },
    },
  ],
};

const graph = new Graph({
  container: 'container',
  width: 900,
  height: 600,
  data: treeToGraphData(treeData),
  node: {
    type: 'rect',
    style: {
      size: [120, 36],
      radius: 18,                // Rounded rectangle
      fill: (d) => d.id === 'root' ? '#1783FF' : '#f0f5ff',
      stroke: (d) => d.id === 'root' ? '#1783FF' : '#adc6ff',
      lineWidth: 1,
      labelText: (d) => d.data.label,
      labelPlacement: 'center',
      labelFill: (d) => d.id === 'root' ? '#fff' : '#333',
    },
  },
  edge: {
    type: 'cubic-horizontal',
    style: {
      stroke: '#adc6ff',
      lineWidth: 1.5,
    },
  },
  layout: {
    type: 'mindmap',
    direction: 'H',             // 'H' = horizontal expansion, 'V' = vertical expansion
    getWidth: () => 120,        // Node width (used to calculate spacing)
    getHeight: () => 36,        // Node height
    getHGap: () => 40,          // Horizontal spacing
    getVGap: () => 10,          // Vertical spacing
  },
  behaviors: [
    'drag-canvas',
    'zoom-canvas',
    'collapse-expand',          // Supports collapse/expand
  ],
});

graph.render();
```

## Common variants

### One-sided tree expanded to the right

```javascript
layout: {
  type: 'mindmap',
  direction: 'LR',           // One-sided expansion from left to right
  getWidth: () => 120,
  getHeight: () => 36,
  getHGap: () => 50,
  getVGap: () => 8,
},
edge: {
  type: 'cubic-horizontal',
},
```

### Vertically expanded tree

```javascript
layout: {
  type: 'mindmap',
  direction: 'V',            // Vertical expansion
  getWidth: () => 100,
  getHeight: () => 36,
  getHGap: () => 20,
  getVGap: () => 50,
},
edge: {
  type: 'cubic-vertical',
},
```

### With collapse/expand functionality

```javascript
const graph = new Graph({
  // ...
  behaviors: [
    'drag-canvas',
    'zoom-canvas',
    {
      type: 'collapse-expand',
      trigger: 'click',          // Click to trigger collapse/expand
      animation: true,           // With animation
    },
  ],
});
```

## Parameter reference

```typescript
interface MindmapLayoutOptions {
  direction?: 'H' | 'V' | 'LR' | 'RL' | 'TB' | 'BT';
  getWidth?: (node: NodeData) => number;
  getHeight?: (node: NodeData) => number;
  getHGap?: (node: NodeData) => number;
  getVGap?: (node: NodeData) => number;
  getSide?: (node: NodeData) => 'left' | 'right';  // Controls which side the node is on
  workerEnabled?: boolean;
}
```

## Common errors

### Error 1: Directly using tree data without conversion

```javascript
// Directly passing in tree structure
const graph = new Graph({
  data: {
    id: 'root',
    children: [...]
  },
  layout: { type: 'mindmap' },
});

// Use treeToGraphData for conversion
import { treeToGraphData } from '@antv/g6';
const graph = new Graph({
  data: treeToGraphData(treeData),
  layout: { type: 'mindmap' },
});
```

### Error 2: getWidth/getHeight are not set, causing node overlap

```javascript
// Node size is not provided to the layout
layout: { type: 'mindmap' },

// Provide node size to the layout algorithm
layout: {
  type: 'mindmap',
  getWidth: () => 120,   // Matches node.style.size[0]
  getHeight: () => 36,   // Matches node.style.size[1]
  getHGap: () => 40,
  getVGap: () => 10,
},
```
