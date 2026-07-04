---
id: "x6-intermediate-tools"
title: "X6 Tools"
description: |
  A configuration guide for tools on X6 nodes and edges.
  Covers built-in tools (button, button-remove, boundary, vertices, segments, node-editor, edge-editor, arrowhead) and custom tools.

library: "x6"
version: "3.x"
category: "intermediate"
subcategory: "tools"
tags:
  - "tools"
  - "tools"
  - "button"
  - "button-remove"
  - "delete button"
  - "boundary"
  - "vertices"
  - "segments"
  - "node-editor"
  - "edge-editor"
  - "arrowhead"
  - "source-arrowhead"
  - "target-arrowhead"
  - "tools"
  - "interaction"

related:
  - "x6-core-node"
  - "x6-core-edge"
  - "x6-core-events"

use_cases:
  - "Add a delete button to nodes"
  - "Add a vertex editing tool to edges"
  - "Double-click to edit node/edge text"
  - "Drag to change the source or target of an edge"
  - "Show tools on hover"

anti_patterns:
  - "Do not forget to remove dynamically added tools on mouseleave"
  - "node-editor no longer requires passing the event parameter (2.8.0+)"
---

# X6 Tools

Tools are widgets rendered on nodes/edges to enhance interactions, such as delete buttons, vertex editing, and text editing.

## Add Tools

### Add at Creation Time

```javascript
// Node tools
graph.addNode({
  shape: 'rect',
  x: 40,
  y: 40,
  width: 100,
  height: 40,
  label: 'Node',
  attrs: { body: { fill: '#fff', stroke: '#8f8f8f', strokeWidth: 1, rx: 6, ry: 6 } },
  tools: [
    {
      name: 'button-remove',
      args: { x: '100%', y: 0, offset: { x: -10, y: 10 } },
    },
  ],
});

// Edge tools
graph.addEdge({
  source: node1,
  target: node2,
  tools: ['vertices', 'segments'],
});
```

### Dynamically Add/Remove

```javascript
// Add Tools
node.addTools([{ name: 'button-remove', args: { x: 10, y: 10 } }]);

// Check whether a tool exists
node.hasTool('button-remove'); // true

// Remove a specific tool
node.removeTool('button-remove');

// Remove all tools
node.removeTools();
```

### Show Tools on Hover

```javascript
graph.on('node:mouseenter', ({ node }) => {
  node.addTools([
    { name: 'boundary' },
    { name: 'button-remove', args: { x: '100%', y: 0, offset: { x: -10, y: 10 } } },
  ]);
});

graph.on('node:mouseleave', ({ node }) => {
  node.removeTools();
});

graph.on('edge:mouseenter', ({ edge }) => {
  edge.addTools([
    { name: 'vertices' },
    { name: 'button-remove', args: { distance: 20 } },
  ]);
});

graph.on('edge:mouseleave', ({ edge }) => {
  edge.removeTools();
});
```

## Built-in Node Tools

### button - Custom Button

Render a button at a specified position on a node, with support for custom click interactions.

```javascript
node.addTools({
  name: 'button',
  args: {
    x: 0,
    y: 0,
    offset: { x: 18, y: 18 },
    markup: [
      { tagName: 'circle', selector: 'button', attrs: { r: 8, fill: '#1890ff', cursor: 'pointer' } },
      { tagName: 'text', selector: 'icon', attrs: { fill: '#fff', fontSize: 12, textAnchor: 'middle', dominantBaseline: 'central', text: '+' } },
    ],
    onClick({ cell }) {
      console.log('Button clicked on', cell.id);
    },
  },
});
```

| Parameter | Type | Description |
|------|------|------|
| `x` | number \| string | X coordinate (percentages indicate relative positions) |
| `y` | number \| string | Y coordinate |
| `offset` | `{ x, y }` | Offset from x/y |
| `markup` | Markup | SVG structure of the button |
| `onClick` | Function | Click callback `({ e, cell, view }) => void` |

### button-remove - Delete Button

A special case of button that deletes the corresponding node when clicked. Supports all button configurations.

```javascript
graph.addNode({
  shape: 'rect',
  x: 40,
  y: 40,
  width: 100,
  height: 40,
  label: 'Delete me',
  attrs: { body: { fill: '#fff', stroke: '#8f8f8f', strokeWidth: 1, rx: 6, ry: 6 } },
  tools: [
    {
      name: 'button-remove',
      args: { x: '100%', y: 0, offset: { x: -10, y: 10 } },
    },
  ],
});
```

### boundary - Bounding Box

Render a rectangle based on the node bounding box. It is only for visualization and has no interaction.

```javascript
node.addTools({
  name: 'boundary',
  args: {
    padding: 5,
    attrs: {
      fill: '#7c68fc',
      stroke: '#333',
      'stroke-width': 1,
      'fill-opacity': 0.2,
    },
  },
});
```

### node-editor - Text Editing

Provides text editing on nodes; double-click a node to edit its text.

```javascript
// Add the node-editor tool (2.8.0+ does not require passing event)
node.addTools({
  name: 'node-editor',
});

// Specify getText/setText when customizing markup
node.addTools({
  name: 'node-editor',
  args: {
    getText: 'attrs/label/text',  // Property path
    setText: 'attrs/label/text',
  },
});
```

| Parameter | Type | Description |
|------|------|------|
| `getText` | string \| Function | Property path or method for getting text |
| `setText` | string \| Function | Property path or method for setting text |
| `attrs/fontSize` | string | Editor font size; default is 14 |
| `attrs/color` | string | Font color; default is #000 |

## Built-in Edge Tools

### vertices - Vertex Editing

Render small circles at vertex positions. Supports dragging to change positions, double-clicking to delete, and clicking an edge to add vertices.

```javascript
graph.addEdge({
  source: node1,
  target: node2,
  vertices: [{ x: 200, y: 100 }],
  tools: [
    {
      name: 'vertices',
      args: { attrs: { fill: '#666' }, snapRadius: 20 },
    },
  ],
});
```

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `snapRadius` | number | 20 | Vertex snap radius |
| `addable` | boolean | true | Whether vertices can be added |
| `removable` | boolean | true | Whether double-clicking can delete |

### segments - Segment Tool

Render a toolbar at the center of each segment. Dragging adjusts the vertex positions at both ends of the segment.

```javascript
graph.addEdge({
  source: node1,
  target: node2,
  router: 'orth',
  connector: 'rounded',
  tools: ['segments'],
});
```

### button-remove (Edges)

Render a delete button at a specified position on an edge.

```javascript
edge.addTools({
  name: 'button-remove',
  args: { distance: 20 },  // Distance from the source point
});
```

### source-arrowhead / target-arrowhead

Render arrowhead graphics at the source or target of an edge. Dragging can change the edge source/target.

```javascript
edge.addTools([
  'source-arrowhead',
  'target-arrowhead',
]);
```

### edge-editor - Edge Text Editing

Double-click an edge to edit its text label.

```javascript
edge.addTools({
  name: 'edge-editor',
  args: {
    attrs: { fontSize: 14, color: '#333' },
  },
});
```

## Common Patterns

### Show Tools When Selected and Remove Them When Unselected

```javascript
graph.on('node:selected', ({ node }) => {
  node.addTools([
    { name: 'boundary' },
    { name: 'button-remove', args: { x: '100%', y: 0, offset: { x: -10, y: 10 } } },
  ]);
});

graph.on('node:unselected', ({ node }) => {
  node.removeTools();
});
```

### Double-Click to Edit Node Text

```javascript
graph.on('node:dblclick', ({ node }) => {
  node.addTools({ name: 'node-editor' });
});
```

## Common Errors and Fixes

### ❌ Adding Tools on mouseenter But Forgetting to Remove Them on mouseleave

```javascript
// Error: tools accumulate indefinitely
graph.on('node:mouseenter', ({ node }) => {
  node.addTools([{ name: 'button-remove' }]);
});
// Missing mouseleave handler

// Correct: use paired handlers
graph.on('node:mouseenter', ({ node }) => {
  node.addTools([{ name: 'button-remove', args: { x: '100%', y: 0, offset: { x: -10, y: 10 } } }]);
});
graph.on('node:mouseleave', ({ node }) => {
  node.removeTools();
});
```

### ❌ Incorrectly Using graph.render()

```javascript
// Error: Graph instances do not have a render method
const graph = new Graph({ ... });
graph.render(); // ❌ Error: graph.render is not a function

// Correct: the Graph constructor renders automatically; no manual render() call is needed
const graph = new Graph({ ... });
```

### ❌ Incorrect Tool Configuration Method

```javascript
// Error: dynamically adding vertices and segments tools in an event
graph.on('edge:mouseenter', ({ cell }) => {
  cell.addTools([
    'vertices',
    'segments'
  ])
})

// Correct: configure tools directly when creating the edge
graph.addEdge({
  source: node1,
  target: node2,
  tools: ['vertices', 'segments'],
});
```

### ❌ Incorrectly Using the tools.items Configuration Structure

```javascript
// Error: the tools configuration should be an array, not an object
const edge = graph.addEdge({
  source: 'source',
  target: 'target',
  tools: {
    items: [
      { name: 'vertices' },
      { name: 'segments' }
    ]
  }
})

// Correct: tools should use the array form
const edge = graph.addEdge({
  source: 'source',
  target: 'target',
  tools: [
    'vertices',
    'segments'
  ]
})
```

### ❌ Using the Wrong Configuration Format When Adding Tools to an Edge

```javascript
// Error: the tools configuration should be an array, not an object
const edge = graph.addEdge({
  source: 'source',
  target: 'target',
  tools: {
    name: 'segments'
  }
})

// Correct: tools should use the array form
const edge = graph.addEdge({
  source: 'source',
  target: 'target',
  tools: [
    'segments'
  ]
})
```

### ❌ Incorrectly Calling the render Method on a Graph Instance

```javascript
// Error: Graph instances do not have a render method
const graph = new Graph({ ... });
graph.render(); // ❌ Error: graph.render is not a function

// Correct: the Graph constructor renders automatically; no manual render() call is needed
const graph = new Graph({ ... });
```

### ❌ Using the Wrong tools Configuration Format in createEdge

```javascript
// Error: the tools configuration in createEdge should be an array, not an object
graph.options.connecting = {
  createEdge() {
    return graph.createEdge({
      shape: 'edge',
      tools: {
        items: [
          'vertices',
          'segments'
        ]
      }
    })
  }
}

// Correct: tools should use the array form
graph.options.connecting = {
  createEdge() {
    return graph.createEdge({
      shape: 'edge',
      tools: [
        'vertices',
        'segments'
      ]
    })
  }
}
```

### ❌ Not Properly Handling Node Selection State, Causing Duplicate Tools

```javascript
// Error: each click adds a boundary tool without clearing existing tools
graph.on('node:click', ({ node }) => {
  node.addTools([
    { name: 'boundary' }
  ]);
});

// Correct: clear existing tools before adding new ones
graph.on('node:click', ({ node }) => {
  graph.getNodes().forEach((n) => n.removeTools());
  node.addTools([
    { name: 'boundary' }
  ]);
});
```

### ❌ Syntax Error or Incomplete Code Snippet

```javascript
// Error: incomplete code causes a syntax error
const node2 = graph.addNode({
  shape: 'rect',
  x: 300,
  y: 100,
  width: 10  graph.addEdge({ // ❌ syntax error
  source: node1,
  target: node2,
  attrs: {
    line: { stroke: '#8f8f8f', strokeWidth: 1 },
  },
});

// Correct: ensure the code syntax is complete
const node2 = graph.addNode({
  shape: 'rect',
  x: 300,
  y: 100,
  width: 100,
  height: 40,
  label: 'Node 2',
  attrs: {
    body: { stroke: '#8f8f8f', strokeWidth: 1, fill: '#fff', rx: 6, ry: 6 },
  },
});

graph.addEdge({
  source: node1,
  target: node2,
  attrs: {
    line: { stroke: '#8f8f8f', strokeWidth: 1 },
  },
});
```

### ❌ Incorrectly Using the Selection Plugin and Trying to Access node.selected Events

```javascript
// Error: the Selection plugin does not trigger node:selected events, and the Selection plugin is not imported correctly
import { Graph, Selection } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  background: { color: '#F2F7FA' },
  plugins: [
    new Selection({
      enabled: true,
      showNodeSelectionBox: true,
    }),
  ],
});

graph.on('node:selected', ({ node }) => {
  node.addTools([
    {
      name: 'boundary',
      args: {
        attrs: {
          stroke: '#31d0c6',
          strokeWidth: 1,
          strokeDasharray: '5 5',
        },
      },
    },
  ]);
});

// Correct: use click events instead of selected events, and remove the Selection plugin
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  background: { color: '#F2F7FA' },
});

graph.on('node:click', ({ node }) => {
  graph.getNodes().forEach((n) => n.removeTools());
  node.addTools([
    {
      name: 'boundary',
      args: {
        padding: 6,
        attrs: {
          fill: 'none',
          stroke: '#1890ff',
          strokeWidth: 1,
          strokeDasharray: '5 3',
        },
      },
    },
  ]);
});
```

### ❌ Passing the Wrong Data Structure to addTools

```javascript
// Error: addTools accepts an array, not an object
node.addTools({
  name: 'boundary',
  args: {
    attrs: {
      stroke: '#31d0c6',
      strokeWidth: 1,
      strokeDasharray: '5 5',
    },
  },
});

// Correct: addTools should receive an array
node.addTools([
  {
    name: 'boundary',
    args: {
      attrs: {
        stroke: '#31d0c6',
        strokeWidth: 1,
        strokeDasharray: '5 5',
      },
    },
  },
]);
```

## Minimal Runnable Example

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  background: { color: '#F2F7FA' },
});

const source = graph.addNode({
  shape: 'rect',
  x: 40,
  y: 40,
  width: 100,
  height: 40,
  label: 'Source',
  tools: ['button-remove'],
  attrs: {
    body: { stroke: '#8f8f8f', strokeWidth: 1, fill: '#fff', rx: 6, ry: 6 },
  },
});

const target = graph.addNode({
  shape: 'rect',
  x: 160,
  y: 240,
  width: 100,
  height: 40,
  label: 'Target',
  tools: ['button-remove'],
  attrs: {
    body: { stroke: '#8f8f8f', strokeWidth: 1, fill: '#fff', rx: 6, ry: 6 },
  },
});

graph.addEdge({
  source: source,
  target: target,
  vertices: [
    { x: 90, y: 160 },
    { x: 210, y: 160 },
  ],
  tools: ['vertices', 'segments'],
  attrs: {
    line: { stroke: '#8f8f8f', strokeWidth: 1 },
  },
});
```