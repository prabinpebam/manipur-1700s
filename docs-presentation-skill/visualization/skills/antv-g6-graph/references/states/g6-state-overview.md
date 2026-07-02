---
id: "g6-state-overview"
title: "G6 Element State System"
description: |
  A complete guide to the element state system in G6 5.x, including built-in states,
  custom states, state style configuration, and state APIs.

library: "g6"
version: "5.x"
category: "states"
subcategory: "overview"
tags:
  - "element state"
  - "state"
  - "selected"
  - "active"
  - "highlight"
  - "inactive"
  - "disabled"

related:
  - "g6-behavior-click-select"
  - "g6-behavior-hover-activate"
  - "g6-core-graph-init"

use_cases:
  - "Highlight selected nodes"
  - "Hover effects"
  - "Disable and activate nodes"
  - "Combine multiple states"

anti_patterns:
  - "Do not use callback functions in state styles; state styles only support static values."
  - "Do not define dynamic data mappings in states; that is the responsibility of global styles."

difficulty: "beginner"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
author: "antv-team"
source_url: "https://g6.antv.antgroup.com/manual/element/state"
---

## Core Concepts

Key characteristics of element states in G6 v5:
- **Multiple states can coexist**: one element can have multiple states at the same time.
- **Styles are layered**: styles from multiple states are combined, and states set later take higher priority.
- **Fully customizable**: in addition to built-in states, you can define any custom state.

**Built-in state names:** `selected`, `active`, `highlight`, `inactive`, `disabled`

## Minimal Runnable Example

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  width: 640,
  height: 480,
  data: {
    nodes: [
       { id: 'n1', data: { label: 'A' }, states: ['selected'] },  // Initially selected
       { id: 'n2', data: { label: 'B' } },
       { id: 'n3', data: { label: 'C' }, states: ['disabled'] }, // Initially disabled
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
    // State styles
    state: {
      selected: {
        fill: '#ff4d4f',
        stroke: '#cf1322',
        lineWidth: 3,
        halo: true,
        haloFill: '#ff4d4f',
        haloOpacity: 0.2,
      },
      active: {
        fill: '#40a9ff',
        stroke: '#1677ff',
      },
      highlight: {
        fill: '#ffa940',
      },
      inactive: {
        opacity: 0.3,
        fill: '#d9d9d9',
      },
      disabled: {
        fill: '#f0f0f0',
        stroke: '#d9d9d9',
        labelFill: '#bfbfbf',
        cursor: 'not-allowed',
      },
    },
  },
  edge: {
    state: {
      selected: { stroke: '#ff4d4f', lineWidth: 3 },
      active: { stroke: '#40a9ff', lineWidth: 2 },
      inactive: { opacity: 0.2 },
    },
  },
  layout: { type: 'force', preventOverlap: true },
  behaviors: ['drag-canvas', 'zoom-canvas', 'click-select'],
});

graph.render();
```

## State API

```javascript
// Set a single state
graph.setElementState('node1', 'selected');

// Set multiple states at the same time
graph.setElementState('node1', ['selected', 'highlight']);

// Clear all states
graph.setElementState('node1', []);

// Clear a specific state while keeping the others
const currentStates = graph.getElementState('node1');
const newStates = currentStates.filter(s => s !== 'selected');
graph.setElementState('node1', newStates);

// Set states in batches
graph.setElementState({
  node1: 'selected',
  node2: ['highlight'],
  node3: [],
});

// Query an element's states
const states = graph.getElementState('node1');
// Returns: ['selected', 'highlight']

// Find elements by state
const selectedNodes = graph.getElementDataByState('node', 'selected');
const activeEdges = graph.getElementDataByState('edge', 'active');
```

## Custom States

```javascript
// You can use any custom state name
node: {
  state: {
    // Built-in state
    selected: { fill: '#ff4d4f' },
    // Custom states
    warning: {
      fill: '#faad14',
      stroke: '#d48806',
      lineWidth: 2,
    },
    error: {
      fill: '#ff4d4f',
      stroke: '#cf1322',
    },
    success: {
      fill: '#52c41a',
      stroke: '#389e0d',
    },
    loading: {
      opacity: 0.6,
      // Can be used with animation to create a dynamic effect
    },
  },
},

// Set custom states
graph.setElementState('node1', 'warning');
graph.setElementState('node1', 'error');
```

## State Style Priority

```
style in data > state styles (later states > earlier states) > global node/edge style > theme style
```

```javascript
// Example: the node has both selected and highlight states
// The selected style and highlight style are layered; properties from highlight take priority because it is set later.
graph.setElementState('n1', ['selected', 'highlight']);
```

## Updating States After Rendering

If you need to run state-related operations after the graph has rendered, use `await graph.render()` or listen for lifecycle events:

```javascript
import { Graph, GraphEvent } from '@antv/g6';

const graph = new Graph({ /* ... */ });

// Option 1: use await
await graph.render();
graph.setElementState('node1', 'selected');

// Option 2: use GraphEvent (must be imported from @antv/g6)
graph.on(GraphEvent.AFTER_RENDER, () => {
  graph.setElementState('node1', 'selected');
});

// Option 3: use the string event name (no import required)
graph.on('afterrender', () => {
  graph.setElementState('node1', 'selected');
});
```

## Common Mistakes and Fixes

### Mistake 1: Using callback functions in state styles

```javascript
// Incorrect: state styles do not support callback functions
node: {
  state: {
    selected: {
      fill: (d) => d.data.color,  // This will not work.
    },
  },
},

// Correct: use only static values in state styles
node: {
  state: {
    selected: {
      fill: '#ff4d4f',  // Static color value
    },
  },
},
```

### Mistake 2: Setting a state without defining the corresponding style

```javascript
// Incorrect: a state is set but no style is defined, so the node will not change visually.
behaviors: ['click-select'],
// node.state is not configured

// Correct: configure state styles when using states
behaviors: ['click-select'],
node: {
  state: {
    selected: { fill: '#ff4d4f', lineWidth: 3 },
  },
},
```

### Mistake 3: Using GraphEvent without importing it

```javascript
// Incorrect: GraphEvent is not defined
import { Graph } from '@antv/g6';

graph.on(GraphEvent.AFTER_RENDER, () => {  // GraphEvent is not defined
  // ...
});

// Correct: import GraphEvent from @antv/g6
import { Graph, GraphEvent } from '@antv/g6';

graph.on(GraphEvent.AFTER_RENDER, () => {
  // ...
});

// Or use the string event name (no import required)
import { Graph } from '@antv/g6';

graph.on('afterrender', () => {
  // ...
});
```
