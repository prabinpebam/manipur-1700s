---
id: "g6-plugin-background-snapline"
title: "G6 Background Plugin + Snapline Plugin (background / snapline)"
description: |
  background: Sets a background color, gradient, or image for the canvas.
  snapline: Displays intelligent alignment guides while dragging nodes and supports automatic snapping.

library: "g6"
version: "5.x"
category: "plugins"
subcategory: "visual"
tags:
  - "background"
  - "snapline"
  - "alignment guide"
  - "background"
  - "canvas background"
  - "snap alignment"

related:
  - "g6-plugin-tooltip"
  - "g6-behavior-drag-element"

difficulty: "beginner"
completeness: "full"
created: "2026-04-16"
updated: "2026-04-16"
---

## Background Plugin (background)

Sets a background color, gradient, or background image for the graph canvas. Supports all CSS style properties.

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  data: {
    nodes: [
      { id: 'n1', data: { label: 'Node 1' } },
      { id: 'n2', data: { label: 'Node 2' } },
    ],
    edges: [{ source: 'n1', target: 'n2' }],
  },
  plugins: [
    {
      type: 'background',
      key: 'bg',
      backgroundColor: '#f0f2f5',   // Background color
    },
  ],
});

graph.render();
```

### background Configuration Parameters

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `type` | `string` | `'background'` | Plugin type |
| `key` | `string` | - | Unique identifier for `graph.updatePlugin()` |
| `backgroundColor` | `string` | - | Background color (CSS color) |
| `backgroundImage` | `string` | - | Background image (`'url(...)'`) |
| `backgroundSize` | `string` | `'cover'` | Background size (CSS background-size) |
| `backgroundRepeat` | `string` | - | Background repeat behavior (CSS background-repeat) |
| `backgroundPosition` | `string` | - | Background position |
| `opacity` | `string` | - | Background opacity (0-1) |
| `transition` | `string` | `'background 0.5s'` | Transition animation |
| `zIndex` | `string` | `-1` | Stacking order; the default value -1 places it below other elements |
| `width` | `string` | `'100%'` | Background width |
| `height` | `string` | `'100%'` | Background height |

> Note: The default `zIndex` value of -1 ensures that the background stays below other DOM plugins such as grid lines.

### Common Background Styles

```javascript
// Solid-color background
{ type: 'background', backgroundColor: '#f0f2f5' }

// Gradient background
{ type: 'background', background: 'linear-gradient(45deg, #1890ff, #722ed1)', opacity: '0.8' }

// Image background
{
  type: 'background',
  backgroundImage: 'url(https://example.com/bg.png)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  opacity: '0.2',
}

// Dark-theme background
{ type: 'background', backgroundColor: '#1a1a2e' }
```

### Dynamically Update the Background

```javascript
const graph = new Graph({
  plugins: [{ type: 'background', key: 'bg', backgroundColor: '#f0f2f5' }],
});

// Dynamically switch the background
graph.updatePlugin({ key: 'bg', backgroundColor: '#e6f7ff', transition: 'background 1s ease' });
```

---

## Snapline Plugin (snapline)

Automatically displays horizontal and vertical alignment guides when dragging nodes. It supports automatic snapping for precise alignment.

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  data: {
    nodes: [
      { id: 'n1' },
      { id: 'n2' },
      { id: 'n3' },
    ],
    edges: [],
  },
  layout: { type: 'grid' },
  behaviors: ['drag-canvas', 'drag-element'],
  plugins: [
    {
      type: 'snapline',
      key: 'snapline',
      tolerance: 5,        // Distance threshold for triggering alignment (px)
      offset: 20,          // Extension distance at both ends of the alignment guide (px)
      autoSnap: true,      // Whether to automatically snap to the aligned position
      verticalLineStyle: { stroke: '#1783FF', lineWidth: 1 },
      horizontalLineStyle: { stroke: '#1783FF', lineWidth: 1 },
    },
  ],
});

graph.render();
```

### snapline Configuration Parameters

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `type` | `string` | `'snapline'` | Plugin type |
| `key` | `string` | - | Unique identifier |
| `tolerance` | `number` | `5` | Distance threshold for triggering alignment (px) |
| `offset` | `number` | `20` | Extension distance at both ends of the alignment guide (px) |
| `autoSnap` | `boolean` | `true` | Whether to automatically snap to the aligned position |
| `shape` | `string \| Function` | `'key'` | Reference shape (`'key'` is the primary shape) |
| `verticalLineStyle` | `LineStyle` | `{ stroke: '#1783FF' }` | Vertical alignment guide style |
| `horizontalLineStyle` | `LineStyle` | `{ stroke: '#1783FF' }` | Horizontal alignment guide style |
| `filter` | `(node) => boolean` | `() => true` | Filters nodes that should not participate in alignment |

### Custom Alignment Guide Style

```javascript
plugins: [
  {
    type: 'snapline',
    tolerance: 8,
    autoSnap: false,     // Only show guides; do not snap automatically
    verticalLineStyle: {
      stroke: '#F08F56',
      lineWidth: 2,
      lineDash: [4, 4],
    },
    horizontalLineStyle: {
      stroke: '#17C76F',
      lineWidth: 2,
      lineDash: [4, 4],
    },
    // Exclude specific nodes from alignment
    filter: (node) => node.id !== 'fixed-node',
  },
]
```

---

## Combined Usage Example

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  data: {
    nodes: Array.from({ length: 9 }, (_, i) => ({ id: `n${i}` })),
    edges: [],
  },
  layout: { type: 'grid', cols: 3 },
  node: {
    type: 'rect',
    style: { size: [80, 40], fill: '#1783FF', stroke: '#fff', labelText: (d) => d.id },
  },
  behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
  plugins: [
    {
      type: 'background',
      backgroundColor: '#f8f9fa',
    },
    {
      type: 'snapline',
      tolerance: 6,
      autoSnap: true,
      verticalLineStyle: { stroke: '#ff4d4f', lineWidth: 1 },
      horizontalLineStyle: { stroke: '#52c41a', lineWidth: 1 },
    },
  ],
});

graph.render();
```
