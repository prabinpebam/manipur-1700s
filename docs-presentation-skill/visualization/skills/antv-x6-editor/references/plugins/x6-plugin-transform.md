---
id: "x6-plugin-transform"
title: "X6 Transform Resize and Rotate Plugin"
description: |
  The Transform plugin provides visual resize and rotate handles for nodes, allowing users to drag handles to adjust node size and angle.

library: "x6"
version: "3.x"
category: "plugins"
subcategory: "transform"
tags:
  - "Transform"
  - "resize"
  - "rotate"
  - "resize"
  - "rotate"
  - "drag to resize"
  - "node transform"

related:
  - "x6-plugins"
  - "x6-core-node"
  - "x6-core-events"

use_cases:
  - "Drag to resize nodes"
  - "Rotate node angles"
  - "Restrict minimum and maximum node sizes"
  - "Resize while preserving node aspect ratio"
  - "Disable resizing for specific nodes"

difficulty: "beginner"
completeness: "full"
---

## Basic Usage

```javascript
import { Graph, Transform } from '@antv/x6';

const graph = new Graph({ container: 'container' });
graph.use(new Transform({
  resizing: { enabled: true },
  rotating: { enabled: true },
}));
```

## Options

### `resizing` Options

| Option | Type | Default | Description |
|--------|------|--------|------|
| `enabled` | boolean \| function | `false` | Whether resizing is enabled; pass a function to filter by node |
| `minWidth` | number | `0` | Minimum width |
| `maxWidth` | number | `Infinity` | Maximum width |
| `minHeight` | number | `0` | Minimum height |
| `maxHeight` | number | `Infinity` | Maximum height |
| `orthogonalResizing` | boolean | `true` | Whether orthogonal resizing is enabled (horizontal/vertical directions only) |
| `restrictedResizing` | boolean \| number | `false` | Restrict the resize range (`true` restricts it to the canvas; a number is the margin) |
| `preserveAspectRatio` | boolean | `false` | Whether to preserve the aspect ratio |
| `allowReverse` | boolean | `true` | Whether control points can reverse when the minimum size is reached |
| `autoScrollOnResizing` | boolean | `true` | Whether to auto-scroll the canvas while resizing |

### `rotating` Options

| Option | Type | Default | Description |
|--------|------|--------|------|
| `enabled` | boolean \| function | `false` | Whether rotation is enabled; pass a function to filter by node |
| `rotateGrid` | number | `15` | Rotation angle step (angle interval snapped to each time) |

## Programmatic API

```javascript
// Create a transform widget for the specified node
graph.createTransformWidget(node);

// Clear all transform widgets
graph.clearTransformWidgets();
```

## Events

```javascript
// Resize starts
graph.on('node:resize', ({ node, e }) => {
  console.log('Resize started:', node.id);
});

// Resizing
graph.on('node:resizing', ({ node, e }) => {
  console.log('Resizing:', node.getSize());
});

// Resize ends
graph.on('node:resized', ({ node, e }) => {
  console.log('Resize completed:', node.getSize());
});

// Rotation starts
graph.on('node:rotate', ({ node, e }) => {
  console.log('Rotation started:', node.id);
});

// Rotating
graph.on('node:rotating', ({ node, e }) => {
  console.log('Rotating:', node.getAngle());
});

// Rotation ends
graph.on('node:rotated', ({ node, e }) => {
  console.log('Rotation completed:', node.getAngle());
});
```

## Complete Example: Size Limits + Preserved Aspect Ratio

```javascript
import { Graph, Transform } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  grid: { visible: true },
});

graph.use(new Transform({
  resizing: {
    enabled: true,
    minWidth: 40,
    minHeight: 40,
    maxWidth: 400,
    maxHeight: 400,
    preserveAspectRatio: true,  // Preserve the aspect ratio
  },
  rotating: {
    enabled: true,
    rotateGrid: 15,  // Snap every 15 degrees
  },
}));

graph.addNode({
  x: 200,
  y: 200,
  width: 120,
  height: 80,
  label: 'Resize and rotate me',
  attrs: { body: { fill: '#EFF4FF', stroke: '#5F95FF' } },
});
```

## Filter by Node

`enabled` can be a function that determines whether resizing or rotation is allowed for each node:

```javascript
graph.use(new Transform({
  resizing: {
    enabled(node) {
      // Only nodes whose shape is 'rect' can be resized
      return node.shape === 'rect';
    },
  },
  rotating: {
    enabled(node) {
      // Control whether rotation is allowed through node data
      return node.getData()?.rotatable !== false;
    },
  },
}));
```

## Common Mistakes

### Do Not Configure `resizing`/`rotating` in the Constructor

```javascript
// Incorrect: not supported in 3.x
const graph = new Graph({
  container: 'container',
  resizing: { enabled: true },
  rotating: { enabled: true },
});
```

```javascript
// Correct
import { Graph, Transform } from '@antv/x6';
const graph = new Graph({ container: 'container' });
graph.use(new Transform({
  resizing: { enabled: true },
  rotating: { enabled: true },
}));
```

### Do Not Confuse Transform with CSS `transform`

```javascript
// Incorrect: do not use CSS transforms to rotate X6 nodes
node.attr('body/transform', 'rotate(45deg)');  // Does not take effect and may break layout
```

```javascript
// Correct: use the node API to set the angle
node.rotate(45);  // Rotate through the X6 model layer
```
