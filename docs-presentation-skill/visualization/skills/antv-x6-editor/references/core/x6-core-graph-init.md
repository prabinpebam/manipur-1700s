---
id: "x6-core-graph-init"
title: "X6 Canvas Initialization"
description: |
  A complete configuration guide for creating a graph editing canvas with new Graph({...}).
  Covers container, size, background, grid, pan and zoom, and connection interaction configuration.

library: "x6"
version: "3.x"
category: "core"
subcategory: "init"
tags:
  - "initialization"
  - "Graph"
  - "container"
  - "canvas"
  - "background"
  - "grid"
  - "grid"
  - "background"
  - "container"
  - "new Graph"
  - "panning"
  - "mousewheel"
  - "zoom"
  - "pan"

related:
  - "x6-core-node"
  - "x6-core-edge"
  - "x6-core-ports"

use_cases:
  - "Create a graph editing canvas"
  - "Configure the canvas background and grid"
  - "Enable canvas pan and zoom"
  - "Set the canvas size"

anti_patterns:
  - "Do not omit the container parameter"
  - "Do not use standalone @antv/x6-plugin-xxx packages"

difficulty: "beginner"
completeness: "full"
---

## Core Concepts

Graph is the X6 canvas container and manages all nodes and edges. X6 uses an **imperative API**: create the canvas first, then add elements incrementally with `addNode()` and `addEdge()`.

**Key differences between X6 and G6:**
- X6 is a graph **editing** engine with heavy interaction, while G6 is a graph **visualization** engine focused on layout and rendering
- X6 has no built-in layout algorithm; node positions are manually specified with `x` and `y`
- X6 uses ports as the core mechanism for connections

## Basic Initialization

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',  // Required: DOM id or HTMLElement
  width: 80 0,              // Optional: adapts to the container if omitted
  height: 600,
});
```

## Background and Grid

```javascript
const graph = new Graph({
  container: 'container',
  background: {
    color: '#F2F7FA',      // Background color
  },
  grid: {
    visible: true,         // Show the grid
    size: 10,              // Grid size
    type: 'dot',           // 'dot' | 'mesh' | 'double-mesh'
  },
});
```

### Double-Layer Grid

```javascript
grid: {
  size: 10,
  visible: true,
  type: 'double-mesh',
  args: [
    { color: '#eee', thickness: 1 },
    { color: '#ddd', thickness: 1, factor: 4 },
  ],
},
```

## Pan and Zoom

```javascript
const graph = new Graph({
  container: 'container',
  panning: true,                    // Drag to pan (left-drag on a blank area)
  mousewheel: {
    enabled: true,
    modifiers: 'ctrl',              // Hold Ctrl and scroll to zoom
    minScale: 0.2,
    maxScale: 4,
  },
});
```

### Panning Configuration Details

```javascript
panning: {
  enabled: true,
  modifiers: 'shift',    // Hold Shift to pan
  eventTypes: ['leftMouseDown', 'rightMouseDown'],
}
```

## Canvas Transformations

```javascript
// Center the content
graph.centerContent();

// Zoom to fit the canvas
graph.zoomToFit({ padding: 20 });

// Set the zoom level
graph.zoom(0.5);     // Relative zoom
graph.zoomTo(1.5);   // Absolute zoom

// Scroll to a specific node
graph.centerCell(node);

// Zoom to a specified rectangular area (local zoom-in)
graph.zoomToRect({
  x: 0,
  y: 0,
  width: 400,
  height: 300,
});
```

## Connection Interaction Configuration

```javascript
const graph = new Graph({
  container: 'container',
  connecting: {
    allowBlank: false,          // Disallow connecting to blank areas
    allowLoop: false,           // Disallow self-loops
    allowNode: false,           // Disallow connecting to nodes (ports only)
    allowEdge: false,           // Disallow connecting to edges
    allowMulti: true,           // Allow multiple edges
    highlight: true,            // Highlight connectable points while dragging a connection
    router: 'orth',             // Default router
    connector: 'rounded',       // Default connector
    createEdge() {              // Style of the edge created while dragging a connection
      return this.createEdge({
        attrs: {
          line: { stroke: '#1890ff', strokeWidth: 2, targetMarker: 'classic' },
        },
      });
    },
    validateConnection({ sourcePort, targetPort }) {
      return sourcePort !== targetPort;  // Custom validation logic
    },
  },
});
```

## Node Movement Restrictions

```javascript
const graph = new Graph({
  container: 'container',
  translating: {
    restrict: true,   // Restrict nodes to moving within the canvas bounds
  },
});

// Or customize the restricted area
translating: {
  restrict(cellView) {
    return { x: 0, y: 0, width: 800, height: 600 };
  },
},
```

## Node Embedding (Grouping)

```javascript
const graph = new Graph({
  container: 'container',
  embedding: {
    enabled: true,
    findParent: 'bbox',   // Use the bounding box to detect the parent node
  },
});
```

## Data Operations

### Clear the Canvas

Use `graph.clearCells()` to clear all nodes and edges from the canvas. This is commonly used to reset or reload data.

```javascript
// Clear all nodes and edges
graph.clearCells();
```

### Add Nodes and Edges

```javascript
// Add a node
const node = graph.addNode({
  shape: 'rect',
  x: 60,
  y: 60,
  width: 100,
  height: 40,
  label: 'Node 1',
  attrs: {
    body: { stroke: '#1890ff', fill: '#e6f7ff' },
  },
});

// Add an edge (pass a node instance or node id)
graph.addEdge({
  source: node1,
  target: node2,
  attrs: {
    line: { stroke: '#8f8f8f', strokeWidth: 1, targetMarker: 'classic' },
  },
});
```

### Reload Data After Clearing

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  background: { color: '#F2F7FA' },
});

// Load initial data
graph.addNode({ shape: 'rect', x: 60, y: 60, width: 100, height: 40, label: 'Old Node 1' });
graph.addNode({ shape: 'rect', x: 240, y: 60, width: 100, height: 40, label: 'Old Node 2' });

// Clear the canvas
graph.clearCells();

// Reload new data
const newSource = graph.addNode({
  id: 'newSource',
  shape: 'rect',
  x: 60,
  y: 80,
  width: 100,
  height: 40,
  label: 'New Node A',
  attrs: { body: { stroke: '#52c41a', strokeWidth: 2, fill: '#f6ffed' } },
});

const newTarget = graph.addNode({
  id: 'newTarget',
  shape: 'rect',
  x: 260,
  y: 80,
  width: 100,
  height: 40,
  label: 'New Node B',
  attrs: { body: { stroke: '#52c41a', strokeWidth: 2, fill: '#f6ffed' } },
});

graph.addEdge({
  source: newSource,
  target: newTarget,
  attrs: { line: { stroke: '#52c41a', strokeWidth: 2, targetMarker: 'classic' } },
});
```

## Complete Configuration Example

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  background: { color: '#F2F7FA' },
  grid: { visible: true, size: 10 },
  panning: true,
  mousewheel: { enabled: true, modifiers: 'ctrl' },
  connecting: {
    allowBlank: false,
    router: 'orth',
    connector: 'rounded',
    createEdge() {
      return this.createEdge({
        attrs: { line: { stroke: '#8f8f8f', strokeWidth: 1, targetMarker: 'classic' } },
      });
    },
  },
});

// Register plugins
import { Selection, Snapline, History } from '@antv/x6';
graph.use(new Selection({ enabled: true, rubberband: true }));
graph.use(new Snapline({ enabled: true }));
graph.use(new History({ enabled: true }));
```

## Common Mistakes and Fixes

### 1. Omitting the container Parameter

```javascript
// Incorrect
const graph = new Graph({ width: 800, height: 600 });

// Correct
const graph = new Graph({ container: 'container', width: 800, height: 600 });
```

### 2. Failing to Reload Data After Clearing the Canvas

When you need to clear the canvas and reload new data, you must explicitly call `graph.clearCells()`, then continue using `graph.addNode()` and `graph.addEdge()` to add new elements.

```javascript
// Incorrect: overwriting variables directly without clearing the canvas leaves old data behind
graph.addNode({ shape: 'rect', label: 'Old' });
// Missing clearCells()

// Correct: clear first, then load
graph.clearCells();
graph.addNode({ shape: 'rect', label: 'New' });
```

### 3. Using Deprecated Standalone Plugin Packages

X6 3.x has all plugins built in, so you do not need to install `@antv/x6-plugin-xxx` packages.

```javascript
// Incorrect
import { Snapline } from '@antv/x6-plugin-snapline';

// Correct: import from @antv/x6 and register with graph.use()
import { Graph, Snapline } from '@antv/x6';
const graph = new Graph({ container: 'container' });
graph.use(new Snapline({ enabled: true }));
```

### 4. Incorrect edge source/target Format

```javascript
// Incorrect: passing undefined variables directly
graph.addEdge({ source: 'node1', target: 'node2' }); // Throws if nodes do not have ids or do not exist

// Correct: pass node instances or ensure the ids already exist
const node1 = graph.addNode({ id: 'n1', shape: 'rect', x: 0, y: 0, width: 100, height: 40 });
const node2 = graph.addNode({ id: 'n2', shape: 'rect', x: 200, y: 0, width: 100, height: 40 });
graph.addEdge({ source: node1, target: node2 });
// Or
graph.addEdge({ source: 'n1', target: 'n2' });
```

### 5. container Usage Rules

The `container` variable is automatically injected by the runtime environment. Do **not** declare `const container = ...` in the code; otherwise, it will throw `Identifier 'container' has already been declared`.

```javascript
// Correct: use the string 'container' directly
const graph = new Graph({ container: 'container' });

// Incorrect: redeclaring the container variable
const container = document.getElementById('container');
const graph = new Graph({ container }); // Error: Identifier 'container' has already been declared
```

### 6. Not Calling Canvas Transformation Methods Correctly After Initialization

```javascript
// Incorrect: centerContent or zoomToFit is not called
const graph = new Graph({ container: 'container' });
graph.addNode(...);
// Missing centering or zoom call

// Correct: call transformation methods after initialization
const graph = new Graph({ container: 'container' });
graph.addNode(...);
graph.zoomToFit();
graph.centerContent();
```

### 7. container Must Be Valid

```javascript
// Correct: use the string 'container' (injected by the runtime environment)
const graph = new Graph({ container: 'container' });

// Incorrect: passing a nonexistent element
const graph = new Graph({ container: document.getElementById('not-exist') }); // Throws
```

### 8. Calling `zoomToFit` Without Calling `centerContent` Afterwards

```javascript
// Incorrect: only calls zoomToFit and does not center the content
graph.zoomToFit();

// Correct: zoom first, then center
graph.zoomToFit();
graph.centerContent();
```

### 9. Using Strings for `source` and `target` Instead of Node Instances Incorrectly

```javascript
// Incorrect: source and target are strings, but node existence is not guaranteed
graph.addEdge({ source: 'source', target: 'target' });

// Correct: pass node instances or ensure nodes already exist
const sourceNode = graph.addNode({ id: 'source', shape: 'rect', x: 40, y: 40, width: 100, height: 40 });
const targetNode = graph.addNode({ id: 'target', shape: 'rect', x: 200, y: 200, width: 100, height: 40 });
graph.addEdge({ source: sourceNode, target: targetNode });
// Or
graph.addEdge({ source: 'n1', target: 'n2' });
```

### 10. Incorrect `router` and `connector` Configuration

```javascript
// Incorrect: router and connector are configured incorrectly
connecting: {
  router: 'manhattan',
  connector: {
    name: 'rounded',
    args: {
      radius: 8,
    },
  },
}

// Correct: use the standard configuration
connecting: {
  router: 'orth',
  connector: 'rounded',
}
```

### 11. Use the String 'container' for container

```javascript
// Correct: use the default 'container' string
const graph = new Graph({ container: 'container' });

// Incorrect: declaring the container variable in code (the runtime environment already injects it, so redeclaration causes an error)
const container = document.getElementById('my-container');
const graph = new Graph({ container }); // Identifier 'container' has already been declared
```

### 12. Incorrect Order for `zoomToFit` and `centerContent`

```javascript
// Incorrect: center first, then zoom
graph.centerContent();
graph.zoomToFit();

// Correct: zoom first, then center
graph.zoomToFit();
graph.centerContent();
```

### 13. Incorrect `mousewheel` Configuration

```javascript
// Incorrect: mousewheel is not enabled
const graph = new Graph({
  container: 'container',
  mousewheel: {
    enabled: false,
  },
});

// Correct: enable mousewheel
const graph = new Graph({
  container: 'container',
  mousewheel: {
    enabled: true,
    modifiers: 'ctrl',
  },
});
```

### 14. Incorrect `panning` Configuration

```javascript
// Incorrect: panning is not enabled
const graph = new Graph({
  container: 'container',
  panning: false,
});

// Correct: enable panning
const graph = new Graph({
  container: 'container',
  panning: true,
});
```

### 15. Incorrect `background` Configuration

```javascript
// Incorrect: background is not set
const graph = new Graph({
  container: 'container',
});

// Correct: set background
const graph = new Graph({
  container: 'container',
  background: {
    color: '#F2F7FA',
  },
});
```

### 16. Incorrect `grid` Configuration

```javascript
// Incorrect: grid is not set
const graph = new Graph({
  container: 'container',
});

// Correct: set grid
const graph = new Graph({
  container: 'container',
  grid: {
    visible: true,
    size: 10,
  },
});
```

### 17. Calling `graph.centerContent()` and `graph.zoom()` on an Empty Canvas

```javascript
// Incorrect: calling centerContent and zoom while the canvas is empty causes a blank screen
const graph = new Graph({ container: 'container' });
graph.centerContent(); // Blank screen
graph.zoom(0.8);       // Blank screen

// Correct: add nodes before calling centerContent and zoom
const graph = new Graph({ container: 'container' });
graph.addNode({ shape: 'rect', x: 50, y: 50, width: 100, height: 40, label: 'Node A' });
graph.centerContent();
graph.zoom(0.8);
```

### 18. Incorrect `graph.zoom()` Parameter

```javascript
// Incorrect: using a negative number as the zoom parameter
graph.zoom(-0.2); // Not recommended; may cause unexpected behavior

// Correct: use a positive number or relative value
graph.zoom(0.8);  // Zoom out
graph.zoom(1.2);  // Zoom in
graph.zoomTo(1.0); // Set the absolute zoom level
```

### 19. Incorrect Use of the `zoomToRect` Method

```javascript
// Incorrect: syntax or spelling errors cause rendering failures
graph.zoomToRect({
  x: 0,
  y: 0,
  width: 400,
  height: 300
}); // Make sure there are no semicolons or other syntax errors at the end

// Correct: use zoomToRect to zoom to a specified rectangular area
graph.zoomToRect({
  x: 0,
  y: 0,
  width: 400,
  height: 300,
});
```

### 20. Incorrect Use of the `container` Variable (Redeclaration)

```javascript
// Incorrect: redeclaring the container variable in code
const container = document.getElementById('my-container');
const graph = new Graph({ container });

// Correct: use the string 'container'
const graph = new Graph({ container: 'container' });
```
