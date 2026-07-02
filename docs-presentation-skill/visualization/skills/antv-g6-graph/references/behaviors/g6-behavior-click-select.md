---
id: "g6-behavior-click-select"
title: "G6 Click Select Interaction"
description: |
  Use the click-select behavior to select nodes/edges by clicking, with support for multi-selection, neighbor highlighting,
  state linkage, and other features.

library: "g6"
version: "5.x"
category: "behaviors"
subcategory: "selection"
tags:
  - "interaction"
  - "click"
  - "selected"
  - "click-select"
  - "behavior"
  - "selection"

related:
  - "g6-behavior-hover-activate"
  - "g6-behavior-drag-element"
  - "g6-state-overview"

use_cases:
  - "Click a node to view details"
  - "Select a node and highlight related relationships"
  - "Multi-select nodes for batch operations"

anti_patterns:
  - "Do not configure this when selection is not needed, because it affects click event handling"

difficulty: "beginner"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
author: "antv-team"
source_url: "https://g6.antv.antgroup.com/manual/behavior/click-select"
---

## Core concepts

`click-select` lets users select nodes/edges by clicking and supports:
- Selected state marking (default state name `selected`)
- Linked highlighting of neighbor nodes/edges
- Multi-selection (Shift/Ctrl + click)
- Click blank space to clear selection

## Minimal runnable example

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  width: 640,
  height: 480,
  data: {
    nodes: [
       { id: 'n1', data: { label: 'A' } },
       { id: 'n2', data: { label: 'B' } },
       { id: 'n3', data: { label: 'C' } },
    ],
    edges: [
       { source: 'n1', target: 'n2' },
       { source: 'n2', target: 'n3' },
    ],
  },
  node: {
    type: 'circle',
    style: {
      size: 40,
      fill: '#1783FF',
      labelText: (d) => d.data.label,
      labelPlacement: 'center',
      labelFill: '#fff',
    },
    state: {
      selected: {
        fill: '#ff4d4f',
        stroke: '#cf1322',
        lineWidth: 3,
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
    'click-select',              // String shorthand
  ],
});

graph.render();
```

## Common variants

### Full configuration (including neighbor highlighting)

```javascript
behaviors: [
  'drag-canvas',
  'zoom-canvas',
  {
    type: 'click-select',
    // Support multi-selection (hold Shift or Ctrl and click)
    multiple: true,
    // Trigger mode
    trigger: ['click'],           // 'click' | 'dblclick'
    // Selected state name
    state: 'selected',
    // Neighbor state name
    neighborState: 'highlight',
    // State name for unselected elements
    unselectedState: 'inactive',
    // Number of neighbor hops to expand (0 = select only itself)
    degree: 1,
    // Click callback
    onClick: (event) => {
      const { targetType, target } = event;
      if (targetType === 'node') {
        console.log('Selected node:', target.id);
      }
    },
  },
],
// Matching state styles
node: {
  state: {
    selected: { fill: '#ff4d4f', lineWidth: 3 },
    highlight: { fill: '#ffa940', opacity: 1 },
    inactive: { opacity: 0.3 },
  },
},
edge: {
  state: {
    highlight: { stroke: '#ffa940', lineWidth: 2 },
    inactive: { opacity: 0.2 },
  },
},
```

### Show a details panel after click

```javascript
// Listen for selection events
graph.on('node:click', (event) => {
  const nodeId = event.target.id;
  const nodeData = graph.getNodeData(nodeId);
  
  // Update the UI panel
  document.getElementById('detail-panel').innerHTML = `
    <h3>${nodeData.data.name}</h3>
    <p>${nodeData.data.description}</p>
  `;
});
```

### Set the selected state through the API

```javascript
// Select a specific node
graph.setElementState('n1', 'selected');

// Apply multiple states
graph.setElementState('n1', ['selected', 'highlight']);

// Clear states
graph.setElementState('n1', []);

// Get currently selected nodes
const selectedNodes = graph.getElementDataByState('node', 'selected');
```

## Common errors

### Error 1: click-select is configured but state styles are not defined

```javascript
// Only the behavior is configured; no state styles, so there is no visual feedback after node clicks
behaviors: ['click-select'],

// Configure state styles at the same time
behaviors: ['click-select'],
node: {
  state: {
    selected: {
      fill: '#ff4d4f',
      lineWidth: 3,
    },
  },
},
```

### Error 2: point events conflict with click-select

```javascript
// click-select consumes click events internally
// If custom click logic is needed, use the onClick callback
behaviors: [
  {
    type: 'click-select',
    onClick: (event) => {
      // Custom handling
    },
  },
],
```
