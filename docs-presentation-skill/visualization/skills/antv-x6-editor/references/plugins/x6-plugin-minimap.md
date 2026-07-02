---
id: "x6-plugin-minimap"
title: "X6 MiniMap Plugin"
description: |
  The MiniMap plugin displays a thumbnail overview of the canvas in a separate container and supports quick navigation by dragging the viewport frame, making it suitable for large canvases.

library: "x6"
version: "3.x"
category: "plugins"
subcategory: "minimap"
tags:
  - "MiniMap"
  - "minimap"
  - "thumbnail"
  - "navigation"
  - "minimap"
  - "overview"

related:
  - "x6-plugins"
  - "x6-plugin-scroller"
  - "x6-core-graph-init"

use_cases:
  - "Global preview for large canvases"
  - "Quick navigation through the minimap"
  - "View the current viewport position in the overall canvas"

difficulty: "beginner"
completeness: "full"
---

## Basic Usage

```javascript
import { Graph, MiniMap } from '@antv/x6';

const graph = new Graph({ container: 'container' });
graph.use(new MiniMap({
  enabled: true,
  container: document.getElementById('minimap'),
  width: 200,
  height: 160,
}));
```

**Important**: MiniMap requires a separate DOM container and cannot share the same container with the canvas.

## Options

| Option | Type | Default | Description |
|--------|------|--------|------|
| `container` | HTMLElement | **Required** | DOM container for the minimap |
| `width` | number | `300` | Minimap width |
| `height` | number | `200` | Minimap height |
| `padding` | number | `10` | Minimap padding |
| `scalable` | boolean | `true` | Whether the canvas can be scaled through the minimap by dragging viewport frame corners |
| `minScale` | number | `0.01` | Minimum scale ratio |
| `maxScale` | number | `16` | Maximum scale ratio |
| `graphOptions` | object | `{}` | Options passed to the internal thumbnail Graph |
| `createGraph` | function | - | Custom method for creating the thumbnail Graph |

## Complete Example

```javascript
import { Graph, Scroller, MiniMap } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  background: { color: '#F2F7FA' },
  grid: { visible: true },
});

// Scroller provides scrolling capability
graph.use(new Scroller({ enabled: true, pannable: true }));

// MiniMap provides a global overview
graph.use(new MiniMap({
  enabled: true,
  container: document.getElementById('minimap'),
  width: 200,
  height: 160,
  padding: 10,
  scalable: true,
}));

// Add many nodes
for (let i = 0; i < 30; i++) {
  graph.addNode({
    x: Math.random() * 3000,
    y: Math.random() * 2000,
    width: 100,
    height: 50,
    label: `Node ${i + 1}`,
  });
}
```

## HTML Layout Example

Prepare the minimap container in the HTML in advance:

```html
<div style="display: flex;">
  <!-- Canvas container -->
  <div id="container" style="flex: 1; height: 600px;"></div>
  <!-- Minimap container -->
  <div id="minimap" style="width: 200px; height: 160px; border: 1px solid #ccc;"></div>
</div>
```

## Common Errors

### Incorrect: Missing container

```javascript
// Incorrect: container is missing
graph.use(new MiniMap({
  enabled: true,
  width: 200,
  height: 160,
  // Missing container, so the minimap has nowhere to render
}));
```

```javascript
// Correct: provide a separate DOM container
graph.use(new MiniMap({
  enabled: true,
  container: document.getElementById('minimap'),
  width: 200,
  height: 160,
}));
```

### Incorrect: container Is the Same as the Canvas Container

```javascript
// Incorrect: the minimap and canvas cannot use the same container
const el = document.getElementById('container');
const graph = new Graph({ container: el });
graph.use(new MiniMap({ container: el }));  // Conflict
```

```javascript
// Correct: use a separate container
const graph = new Graph({ container: document.getElementById('container') });
graph.use(new MiniMap({
  container: document.getElementById('minimap'),  // Separate container
}));
```

### Incorrect: Configuring minimap in the Constructor

```javascript
// Incorrect: unsupported in 3.x
const graph = new Graph({
  container: 'container',
  minimap: { enabled: true, container: el },
});
```

```javascript
// Correct
import { Graph, MiniMap } from '@antv/x6';
const graph = new Graph({ container: 'container' });
graph.use(new MiniMap({ enabled: true, container: el }));
```
