---
id: "x6-plugin-dnd"
title: "X6 Dnd Drag-and-Drop Plugin"
description: |
  The Dnd (Drag and Drop) plugin provides the ability to drag nodes from outside the canvas into the canvas.
  It is used to implement interactions for creating new nodes by dragging from a toolbox or panel, with support for drag previews, alignment snapping, and drop validation.

library: "x6"
version: "3.x"
category: "plugins"
subcategory: "dnd"
tags:
  - "dnd"
  - "drag"
  - "drop"
  - "drag and drop"
  - "drag-and-drop"
  - "getDragNode"
  - "getDropNode"
  - "validateNode"

related:
  - "x6-plugins"
  - "x6-plugin-stencil"
  - "x6-core-graph-init"

use_cases:
  - "Drag nodes from an external panel onto the canvas"
  - "Customize the style of the drag preview node"
  - "Validate nodes during drag and drop"
  - "Create nodes with simple drag-and-drop without using Stencil"

difficulty: "intermediate"
completeness: "full"
---

## Core Concepts

The **Dnd** plugin lets you drag nodes from external DOM elements into the canvas. Compared with Stencil:
- **Stencil**: provides a complete sidebar panel UI, including groups, search, and layout, and uses Dnd internally
- **Dnd**: provides the underlying drag-and-drop capability without UI; you implement the interface that triggers dragging yourself

A typical Dnd scenario is a custom toolbar button that adds nodes to the canvas when clicked or dragged.

## Basic Usage

```javascript
import { Graph, Dnd } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
});

// Create a Dnd instance
const dnd = new Dnd({
  target: graph,
  getDragNode(sourceNode, options) {
    return sourceNode.clone();
  },
  getDropNode(draggingNode, options) {
    return draggingNode.clone();
  },
});

// Trigger dragging from an external DOM element
document.getElementById('btn-rect').addEventListener('mousedown', (e) => {
  const node = graph.createNode({
    shape: 'rect',
    width: 100,
    height: 40,
    label: 'New Node',
    attrs: { body: { fill: '#fff', stroke: '#8f8f8f', rx: 6, ry: 6 } },
  });
  dnd.start(node, e);
});
```

## Options

### DndOptions

| Parameter | Type | Required | Default | Description |
|------|------|------|--------|------|
| `target` | `Graph` | yes | - | Target canvas instance |
| `scaled` | `boolean` | | `false` | Whether the dragged node follows the canvas scale |
| `delegateGraphOptions` | `Options` | | - | Additional options for the drag delegate graph |
| `draggingContainer` | `HTMLElement` | | `document.body` | Container element for the node during dragging |
| `dndContainer` | `HTMLElement` | | - | Dnd toolbox container |
| `getDragNode` | `Function` | | Clone the source node | Node displayed during dragging |
| `getDropNode` | `Function` | | Clone the dragged node | Final node placed onto the canvas |
| `validateNode` | `Function` | | - | Validate whether dropping is allowed |

### getDragNode

```typescript
getDragNode(sourceNode: Node, options: {
  sourceNode: Node;
  targetGraph: Graph;
  draggingGraph: Graph;
}) => Node
```

Customize the node displayed during dragging. Defaults to `sourceNode.clone()`.

### getDropNode

```typescript
getDropNode(draggingNode: Node, options: {
  sourceNode: Node;
  targetGraph: Graph;
  draggingGraph: Graph;
  draggingNode: Node;
}) => Node
```

Customize the actual node placed onto the canvas. Defaults to `draggingNode.clone()`.

### validateNode

```typescript
validateNode(droppingNode: Node, options: {
  sourceNode: Node;
  targetGraph: Graph;
  draggingGraph: Graph;
  draggingNode: Node;
  droppingNode: Node;
}) => boolean | Promise<boolean>
```

Validate whether the node can be dropped onto the canvas. Returning `false` or rejecting cancels the drop. Asynchronous validation is supported.

## API Methods

| Method | Description |
|------|------|
| `dnd.start(node, mouseEvent)` | Start dragging. Pass in the source node and mouse event |

## Complete Example

### Custom Toolbar Dragging

```javascript
import { Graph, Dnd, Snapline } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  grid: { visible: true, size: 10 },
});

graph.use(new Snapline({ enabled: true }));

const dnd = new Dnd({
  target: graph,
  scaled: true,  // Drag preview follows the canvas scale

  getDragNode(sourceNode) {
    // Show a simplified version while dragging
    const node = sourceNode.clone();
    node.setAttrs({ body: { opacity: 0.6 } });
    return node;
  },

  getDropNode(draggingNode) {
    // Restore the normal style when placing onto the canvas
    const node = draggingNode.clone();
    node.setAttrs({ body: { opacity: 1 } });
    return node;
  },

  validateNode(droppingNode) {
    // Validation: no more than five nodes with the same shape on the canvas
    const shape = droppingNode.shape;
    const count = graph.getNodes().filter((n) => n.shape === shape).length;
    return count < 5;
  },
});

// Bind toolbar buttons
const shapes = [
  { id: 'btn-rect', shape: 'rect', width: 100, height: 40, label: 'Rectangle' },
  { id: 'btn-circle', shape: 'circle', width: 60, height: 60, label: 'Circle' },
];

shapes.forEach(({ id, ...nodeProps }) => {
  document.getElementById(id)?.addEventListener('mousedown', (e) => {
    const node = graph.createNode({
      ...nodeProps,
      attrs: { body: { fill: '#fff', stroke: '#8f8f8f', rx: 4, ry: 4 } },
    });
    dnd.start(node, e);
  });
});
```

### Asynchronous Drop Validation

```javascript
const dnd = new Dnd({
  target: graph,
  async validateNode(droppingNode) {
    // Asynchronous validation, such as calling a backend API
    const isValid = await checkNodePlacement(droppingNode.getData());
    return isValid;
  },
});
```

## Choosing Between Dnd and Stencil

| Scenario | Recommendation |
|------|------|
| Need a complete sidebar panel UI | Stencil |
| Only need simple drag buttons | Dnd |
| Need search and grouping features | Stencil |
| Fully custom drag-and-drop interaction UI | Dnd |
| Need to initiate dragging from DOM elements that are not node templates | Dnd |

## Common Errors and Fixes

### Incorrect: Calling start in a click Event

```javascript
// Incorrect: mousedown is required; on click, the mouse has already been released and dragging cannot start
element.addEventListener('click', (e) => {
  dnd.start(node, e); // Cannot trigger dragging
});

// Correct: use mousedown
element.addEventListener('mousedown', (e) => {
  dnd.start(node, e);
});
```

### Incorrect: Forgetting to Set target

```javascript
// Incorrect: without target, the node cannot be dropped onto the canvas
const dnd = new Dnd({
  getDragNode: (node) => node.clone(),
});

// Correct
const dnd = new Dnd({
  target: graph,
});
```

### Incorrect: Container Not Mounted Correctly, Causing appendChild Errors

When using Stencil or manually creating a container, ensure that the target container exists and is mounted correctly in the DOM.

```javascript
// Incorrect: if document.getElementById('stencil') returns null, this throws an error
const stencil = new Stencil({...});
document.getElementById('stencil').appendChild(stencil.container); // Error: Cannot read properties of null

// Correct: create the container element first and mount it in the DOM
const stencilContainer = document.createElement('div');
stencilContainer.id = 'stencil';
document.body.appendChild(stencilContainer);

const stencil = new Stencil({...});
document.getElementById('stencil').appendChild(stencil.container);
```

### Incorrect: Using a Nonexistent shape Name

```javascript
// Incorrect: 'cylinder' is not a built-in shape and throws: Node with name 'cylinder' does not exist.
const cylinder = graph.createNode({
  shape: 'cylinder',
  width: 80,
  height: 60,
});

// Correct: use built-in shape names such as 'rect', 'circle', 'ellipse', and 'polygon'
const rect = graph.createNode({
  shape: 'rect',
  width: 100,
  height: 40,
  label: 'Rectangle',
});
```

### Incorrect: Using Shape Constructors

```javascript
// Incorrect: Shape.Cylinder is not a constructor and causes: Shape.Cylinder is not a constructor
const cylinder = new Shape.Cylinder({ ... });

// Correct: use graph.createNode to create nodes
const cylinder = graph.createNode({
  shape: 'rect',
  width: 80,
  height: 60,
  label: 'Cylinder',
});
```

### Recommended Container Creation Pattern

```javascript
// Create and mount the Stencil container
const stencilContainer = document.createElement('div');
stencilContainer.style.width = '200px';
stencilContainer.style.position = 'absolute';
stencilContainer.style.left = '0';
stencilContainer.style.top = '0';
stencilContainer.style.bottom = '0';
document.getElementById('container').parentElement.prepend(stencilContainer);

// Initialize and mount Stencil
const stencil = new Stencil({
  title: 'Shapes',
  target: graph,
  groups: [{ name: 'basic', title: 'Basic Shapes' }],
});

stencilContainer.appendChild(stencil.container);
```

### Correctly Creating Nodes with Built-In Shapes

```javascript
import { Graph, Stencil } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
});

const stencil = new Stencil({
  title: 'Shapes',
  target: graph,
  groups: [
    { name: 'basic', title: 'Basic Shapes' },
  ],
});

const stencilContainer = document.createElement('div');
document.getElementById('container').parentElement.prepend(stencilContainer);
stencilContainer.appendChild(stencil.container);

// Use graph.createNode to create nodes
const rect = graph.createNode({
  shape: 'rect',
  width: 100,
  height: 40,
  label: 'Rectangle',
  attrs: { body: { fill: '#fff', stroke: '#8f8f8f' } },
});

const circle = graph.createNode({
  shape: 'circle',
  width: 60,
  height: 60,
  label: 'Circle',
  attrs: { body: { fill: '#fff', stroke: '#8f8f8f' } },
});

stencil.load([rect, circle], 'basic');
```

</skill>
