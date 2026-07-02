---
id: "x6-core-grid"
title: "X6 Grid Configuration"
description: |
  X6 canvas grid configuration: dot, fixedDot, mesh, doubleMesh, plus controls for grid color, size, and visibility.

library: "x6"
version: "3.x"
category: "core"
subcategory: "grid"
tags:
  - "grid"
  - "grid"
  - "dot"
  - "mesh"
  - "doubleMesh"
  - "alignment"
  - "background grid"

related:
  - "x6-core-graph-init"
  - "x6-core-background"

use_cases:
  - "Show a dot grid"
  - "Show grid lines"
  - "Customize grid color and size"
  - "Dynamically show or hide the grid"
  - "Use a double-layer grid with major and minor grid lines"

difficulty: "beginner"
completeness: "full"
---

## Basic Usage

Configure the grid in the Graph constructor through the `grid` field:

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  grid: {
    visible: true,
    size: 10,  // Grid step size (pixels)
  },
});
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `visible` | boolean | `false` | Whether to show the grid |
| `size` | number | `10` | Grid step size (the smallest interval nodes snap to while moving) |
| `type` | string | `'dot'` | Grid type: `'dot'`, `'fixedDot'`, `'mesh'`, or `'doubleMesh'` |
| `args` | object | - | Parameters for the corresponding grid type |

**Note**: Even when `visible: false`, `size` still takes effect. When nodes are dragged, they snap to grid points spaced by `size`.

## Grid Types

### dot (dot grid, default)

Displays evenly distributed dots. The dot size changes with zoom:

```javascript
const graph = new Graph({
  container: 'container',
  grid: {
    visible: true,
    size: 10,
    type: 'dot',
    args: {
      color: '#aaaaaa',   // Dot color
      thickness: 1,        // Dot size
    },
  },
});
```

### fixedDot (fixed dot grid)

Similar to `dot`, but when the zoom scale is <= 1, the dot size remains unchanged so it does not become too small to see:

```javascript
const graph = new Graph({
  container: 'container',
  grid: {
    visible: true,
    size: 10,
    type: 'fixedDot',
    args: {
      color: '#aaaaaa',
      thickness: 2,
    },
  },
});
```

### mesh (grid lines)

Displays intersecting grid lines:

```javascript
const graph = new Graph({
  container: 'container',
  grid: {
    visible: true,
    size: 10,
    type: 'mesh',
    args: {
      color: 'rgba(224, 224, 224, 1)',  // Line color
      thickness: 1,                      // Line thickness
    },
  },
});
```

### doubleMesh (double-layer grid)

Displays two layers of grid lines: a major grid and a minor grid. The minor grid uses `factor` to multiply the spacing:

```javascript
const graph = new Graph({
  container: 'container',
  grid: {
    visible: true,
    size: 10,
    type: 'doubleMesh',
    args: [
      // First layer: dense grid
      {
        color: 'rgba(224, 224, 224, 1)',
        thickness: 1,
      },
      // Second layer: coarser grid (spacing = size * factor)
      {
        color: 'rgba(224, 224, 224, 0.2)',
        thickness: 3,
        factor: 4,  // Spacing is 4 times the base size
      },
    ],
  },
});
```

## Programmatic API

```javascript
// Get the grid step size
graph.getGridSize();  // number

// Set the grid step size
graph.setGridSize(20);

// Show the grid
graph.showGrid();

// Hide the grid
graph.hideGrid();

// Redraw the grid (switch type)
graph.drawGrid({
  type: 'mesh',
  args: { color: '#ddd', thickness: 1 },
});
```

## Complete Example

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  grid: {
    visible: true,
    size: 20,
    type: 'doubleMesh',
    args: [
      { color: '#eee', thickness: 1 },
      { color: '#ddd', thickness: 1, factor: 4 },
    ],
  },
});

// Nodes automatically snap to 20px grid points
graph.addNode({
  x: 100,  // The actual position snaps to an integer multiple of size
  y: 100,
  width: 80,
  height: 40,
  label: 'Snaps to grid',
});
```

## Common Mistakes

### Confusing size and visible

```javascript
// Incorrect assumption: visible: false means there is no grid effect
const graph = new Graph({
  container: 'container',
  grid: { visible: false, size: 20 },
});
// In practice, nodes still snap to the 20px grid when dragged.
```

### Passing an object instead of an array to doubleMesh args

```javascript
// Incorrect: doubleMesh args must be an array
grid: {
  type: 'doubleMesh',
  args: { color: '#eee', thickness: 1 },  // Incorrect; should be an array
}

// Correct
grid: {
  type: 'doubleMesh',
  args: [
    { color: '#eee', thickness: 1 },
    { color: '#ddd', thickness: 1, factor: 4 },
  ],  // Correct
}
```
