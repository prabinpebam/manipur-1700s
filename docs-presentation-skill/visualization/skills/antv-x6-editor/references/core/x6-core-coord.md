---
id: "x6-core-coord"
title: "X6 Coordinate Conversion (Coord)"
description: |
  X6 coordinate system conversion APIs for converting between local (canvas local coordinates), graph (viewport coordinates), client (browser viewport coordinates), and page (document coordinates).

library: "x6"
version: "3.x"
category: "core"
subcategory: "coord"
tags:
  - "coord"
  - "coordinate conversion"
  - "localToGraph"
  - "clientToLocal"
  - "snapToGrid"
  - "coordinate system"

related:
  - "x6-core-graph-init"
  - "x6-core-panning"
  - "x6-core-mousewheel"

use_cases:
  - "Convert mouse event coordinates to canvas coordinates"
  - "Add nodes based on screen positions"
  - "Drag external elements onto the canvas and position them"
  - "Snap coordinates to the grid"
  - "Position custom context menus"

difficulty: "intermediate"
completeness: "full"
---

## Coordinate Systems

X6 has four coordinate systems:

| Coordinate System | Description | Use Cases |
|-------------------|-------------|-----------|
| **local** | Canvas local coordinates. Node x/y values belong to this coordinate system | Node positioning, addNode, node properties |
| **graph** | Viewport coordinates after pan/zoom transformations | Actual rendered pixel positions on the canvas |
| **client** | Browser window viewport coordinates (`getBoundingClientRect`) | Mouse event clientX/clientY |
| **page** | Document coordinates, including page scroll offsets | Mouse event pageX/pageY |

Conversion relationship:

```
local --[matrix]--> graph --[offset]--> client --[scroll]--> page
```

## Point Coordinate Conversion APIs

### local -> Others

```javascript
// local -> graph (applies zoom and pan)
graph.localToGraph({ x: 100, y: 100 });      // Point
graph.localToGraph(100, 100);                  // Point

// local -> client (browser viewport coordinates)
graph.localToClient({ x: 100, y: 100 });      // Point

// local -> page (document coordinates)
graph.localToPage({ x: 100, y: 100 });        // Point
```

### Others -> local

```javascript
// graph -> local (inverse transform)
graph.graphToLocal({ x: 200, y: 150 });       // Point

// client -> local (most common: mouse event -> canvas coordinates)
graph.clientToLocal({ x: e.clientX, y: e.clientY });   // Point
graph.clientToLocal(e.clientX, e.clientY);              // Point

// client -> graph
graph.clientToGraph({ x: e.clientX, y: e.clientY });   // Point

// page -> local
graph.pageToLocal({ x: e.pageX, y: e.pageY });         // Point
```

## Rectangle Coordinate Conversion APIs

Every point conversion has a corresponding rectangle version that returns a `Rectangle` object:

```javascript
// local -> graph
graph.localToGraphRect({ x: 100, y: 100, width: 200, height: 150 });

// local -> client
graph.localToClientRect(100, 100, 200, 150);

// graph -> local
graph.graphToLocalRect({ x: 200, y: 150, width: 300, height: 200 });

// client -> local
graph.clientToLocalRect(e.clientX, e.clientY, width, height);

// client -> graph
graph.clientToGraphRect({ x: 0, y: 0, width: 100, height: 100 });

// page -> local
graph.pageToLocalRect({ x: 0, y: 0, width: 100, height: 100 });
```

## snapToGrid

Converts client coordinates to local coordinates and snaps them to the grid:

```javascript
// Snap the mouse position to the grid
const pos = graph.snapToGrid(e.clientX, e.clientY);
// Returns the snapped local coordinates: Point { x, y }
```

## Common Scenario Examples

### Scenario 1: Create a Node by Dragging an External Element onto the Canvas

```javascript
document.getElementById('drag-source').addEventListener('drop', (e) => {
  e.preventDefault();
  // Convert the mouse release position to canvas coordinates and snap it to the grid
  const pos = graph.snapToGrid(e.clientX, e.clientY);
  graph.addNode({
    x: pos.x,
    y: pos.y,
    width: 100,
    height: 50,
    label: 'New Node',
  });
});
```

### Scenario 2: Position a Custom Context Menu

```javascript
graph.on('node:contextmenu', ({ e, node }) => {
  // Use client coordinates to position the menu (relative to the browser viewport)
  const menu = document.getElementById('context-menu');
  menu.style.left = `${e.clientX}px`;
  menu.style.top = `${e.clientY}px`;
  menu.style.display = 'block';
});
```

### Scenario 3: Get a Node's Actual Screen Position

```javascript
const node = graph.getCellById('node1');
const { x, y } = node.getPosition();  // local coordinates

// Convert to browser viewport coordinates (useful for positioning overlays)
const clientPos = graph.localToClient({ x, y });
console.log(`Node screen position: (${clientPos.x}, ${clientPos.y})`);
```

### Scenario 4: Calculate Nodes Within the Visible Canvas Area

```javascript
// Get the current visible area (graph coordinate system)
const visibleArea = graph.getGraphArea();  // Rectangle

// Convert to the local coordinate system
const localArea = graph.graphToLocalRect(visibleArea);

// Filter nodes within the visible area
const visibleNodes = graph.getNodes().filter((node) => {
  const bbox = node.getBBox();
  return localArea.isIntersectWithRect(bbox);
});
```

## Common Mistakes

### Using mouse clientX/clientY directly as node coordinates

```javascript
// Incorrect: mouse coordinates are in the client coordinate system and cannot be used directly for node positioning
document.addEventListener('click', (e) => {
  graph.addNode({ x: e.clientX, y: e.clientY, width: 80, height: 40 });  // Incorrect position
});
```

```javascript
// Correct: convert the coordinate system first
document.addEventListener('click', (e) => {
  const pos = graph.clientToLocal(e.clientX, e.clientY);
  graph.addNode({ x: pos.x, y: pos.y, width: 80, height: 40 });
});
```

### Confusing localToGraph with localToClient

```javascript
// localToGraph: adds canvas zoom/pan transformations and is used for pixel calculations inside the canvas
// localToClient: converts to browser viewport coordinates and is used to position DOM elements such as popovers and menus
```

### Coordinates in X6 Events Are Already local Coordinates

```javascript
// The x and y values in X6 event callbacks are already local coordinates; no further conversion is needed
graph.on('blank:click', ({ e, x, y }) => {
  // x and y are already local coordinates
  graph.addNode({ x, y, width: 80, height: 40 });
});
```
