---
id: "x6-core-virtual-render"
title: "X6 Virtual Rendering"
description: |
  X6 virtual rendering only renders nodes and edges inside the visible area, making it suitable for large-data scenarios (thousands of nodes or more).
  It is enabled through the virtual option, supports configurable buffer margins, and can work together with the Scroller plugin.

library: "x6"
version: "3.x"
category: "core"
subcategory: "virtual-render"
tags:
  - "virtual"
  - "virtual rendering"
  - "performance"
  - "large data"
  - "visible area"
  - "on-demand rendering"
  - "performance"

related:
  - "x6-core-graph-init"
  - "x6-plugins"

use_cases:
  - "Render large graphs with thousands of nodes"
  - "Optimize performance while scrolling or zooming the canvas"
  - "Reduce the number of DOM nodes"
  - "Optimize performance for large flowcharts or lineage graphs"

difficulty: "intermediate"
completeness: "full"
---

## Core Concepts

**Virtual Render** is a performance optimization strategy: only nodes and edges inside the current visible area (plus a buffer margin) are rendered, and elements outside the viewport do not create DOM nodes. When the user pans or zooms the canvas, the rendered area updates automatically.

Applicable scenarios:
- More than 500 nodes
- Large lineage graphs, organization charts, and network topology graphs
- Smooth canvas interaction is required

## Configuration

### Basic Enablement

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  virtual: true,  // Enable virtual rendering with the default 120px buffer margin
});
```

### Custom Buffer Margin

```javascript
const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  virtual: {
    enabled: true,
    margin: 200,  // Elements within 200px outside the visible area are also rendered
  },
});
```

## Options

### virtual Parameter

| Type | Description |
|------|-------------|
| `boolean` | `true` enables it, `false` disables it |
| `{ enabled?: boolean; margin?: number }` | Object form; allows configuring the buffer margin |

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Whether to enable it |
| `margin` | `number` | `120` | Buffer margin outside the visible area (pixels). A larger value increases the pre-rendered area and reduces the chance of a blank screen while scrolling |

## API Methods

| Method | Description |
|--------|-------------|
| `graph.enableVirtualRender()` | Dynamically enable virtual rendering |
| `graph.disableVirtualRender()` | Dynamically disable virtual rendering (restore full rendering) |

## Working with Scroller

Virtual rendering automatically listens to scroll events from the Scroller plugin and updates the rendered area while scrolling:

```javascript
import { Graph, Scroller } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  virtual: { enabled: true, margin: 150 },
});

// After Scroller is registered, virtual rendering automatically binds to its scroll events
graph.use(new Scroller({ enabled: true }));
```

## Complete Example: Large-data Scenario

```javascript
import { Graph, Scroller, MiniMap } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 1000,
  height: 600,
  virtual: { enabled: true, margin: 200 },
  async: true,
  grid: { visible: true, size: 10 },
});

graph.use(new Scroller({ enabled: true }));
graph.use(new MiniMap({ enabled: true, container: document.getElementById('minimap-container') }));

// Add many nodes in batches
const nodes = [];
const edges = [];

for (let i = 0; i < 2000; i++) {
  const row = Math.floor(i / 50);
  const col = i % 50;
  nodes.push({
    id: `node-${i}`,
    shape: 'rect',
    x: col * 160,
    y: row * 100,
    width: 120,
    height: 40,
    label: `Node ${i}`,
    attrs: { body: { fill: '#fff', stroke: '#8f8f8f', rx: 4, ry: 4 } },
  });

  // Add horizontal edges
  if (col > 0) {
    edges.push({
      source: `node-${i - 1}`,
      target: `node-${i}`,
      attrs: { line: { stroke: '#ccc', strokeWidth: 1 } },
    });
  }
}

graph.fromJSON({ nodes, edges });
graph.centerContent();
```

## Dynamic Switching

```javascript
// Disable virtual rendering for small datasets (avoid frequent visible-area calculation overhead)
if (nodeCount < 200) {
  graph.disableVirtualRender();
} else {
  graph.enableVirtualRender();
}
```

## Notes

1. **Choosing the buffer margin**: If margin is too small, fast scrolling may show a blank screen (elements are not rendered in time); if it is too large, the optimization effect is reduced. 100-200px is recommended.
2. **Combining with async**: Virtual rendering is usually used with `async: true` (the default). Asynchronous rendering further improves initialization performance for large datasets.
3. **Event listeners**: Virtual rendering listens to `translate` (panning), `scale` (zooming), `resize` (container size changes), and Scroller scroll events to update the rendered area.
4. **Data is not affected**: Virtual rendering only affects DOM rendering; `graph.toJSON()` still exports all element data.

## Common Errors

### ❌ Not Enabling Virtual Rendering for Large Data Causes Lag

```javascript
// Problem: rendering all 2000 nodes creates too many DOM nodes and causes interaction lag
const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
});
// Add 2000 nodes... the canvas becomes very laggy

// Solution: enable virtual rendering
const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  virtual: true,  // ✅ Render only the visible area
});
```

### ❌ Enabling Virtual Rendering for Small Data Adds Extra Overhead

```javascript
// Not recommended: virtual rendering is unnecessary when there are only 20 nodes
const graph = new Graph({
  container: 'container',
  virtual: { enabled: true, margin: 200 }, // visible-area calculation costs more than the rendering time saved
});

// Recommended: do not enable it for small datasets
const graph = new Graph({
  container: 'container',
  // virtual defaults to false
});
```
