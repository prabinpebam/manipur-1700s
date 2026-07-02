---
id: "x6-core-mousewheel"
title: "X6 Mousewheel Zoom"
description: |
  X6 mousewheel zoom configuration: zoom factor, minimum/maximum zoom scale, modifier-key control, zooming at the mouse position, and more.

library: "x6"
version: "3.x"
category: "core"
subcategory: "mousewheel"
tags:
  - "mousewheel"
  - "zoom"
  - "zoom"
  - "mouse wheel"
  - "scale"

related:
  - "x6-core-graph-init"
  - "x6-core-panning"
  - "x6-core-coord"

use_cases:
  - "Zoom the canvas with the mouse wheel"
  - "Zoom with Ctrl + mouse wheel"
  - "Limit the zoom range"
  - "Zoom centered on the mouse position"

difficulty: "beginner"
completeness: "full"
---

## Basic Usage

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  mousewheel: {
    enabled: true,
    modifiers: 'ctrl',  // Ctrl + mouse wheel zoom
  },
});
```

## Configuration Items

| Configuration Item | Type | Default | Description |
|--------|------|--------|------|
| `enabled` | boolean | `false` | Whether to enable mousewheel zoom |
| `global` | boolean | `false` | Whether to listen globally (`true`: listen on document, `false`: only listen on the canvas container) |
| `factor` | number | `1.2` | Zoom factor; the zoom multiplier for each wheel event |
| `minScale` | number | - | Minimum zoom scale |
| `maxScale` | number | - | Maximum zoom scale |
| `modifiers` | string \| string[] \| null | `null` | Modifier keys: `'ctrl'`, `'alt'`, `'shift'`, `'meta'` |
| `guard` | function | - | Custom predicate function; return `false` to prevent zooming |
| `zoomAtMousePosition` | boolean | `true` | Whether to zoom centered on the mouse position |

## Modifier-key Control

Using `modifiers` is recommended to avoid conflicts with page scrolling:

```javascript
mousewheel: {
  enabled: true,
  modifiers: 'ctrl',  // Only Ctrl + mouse wheel triggers zoom
}
```

Multiple modifier keys are supported. Any one matching key is enough:

```javascript
mousewheel: {
  enabled: true,
  modifiers: ['ctrl', 'meta'],  // Ctrl or Meta modifier key
}
```

## Limiting the Zoom Range

```javascript
mousewheel: {
  enabled: true,
  modifiers: 'ctrl',
  minScale: 0.5,   // Minimum zoom: 50%
  maxScale: 3,     // Maximum zoom: 300%
}
```

## Zooming Centered on the Mouse Position

The default behavior (`zoomAtMousePosition: true`) zooms centered on the mouse position, similar to design tools:

```javascript
mousewheel: {
  enabled: true,
  zoomAtMousePosition: true,  // Default value; centered on the mouse
}
```

When disabled, zooming is centered on the canvas center:

```javascript
mousewheel: {
  enabled: true,
  zoomAtMousePosition: false,  // Zoom centered on the canvas center
}
```

## Custom Filtering with `guard`

```javascript
mousewheel: {
  enabled: true,
  guard(e) {
    // Do not zoom when the mouse is over a specific area
    if (e.target.closest('.no-zoom-area')) {
      return false;
    }
    return true;
  },
}
```

## Programmatic Zoom APIs

```javascript
// Set an absolute zoom scale
graph.zoom(1.5, { absolute: true });  // Zoom to 150%

// Relative zoom
graph.zoom(0.2);    // Zoom in by 20%
graph.zoom(-0.2);   // Zoom out by 20%

// Zoom centered on a specific point
graph.zoom(2, { absolute: true, center: { x: 400, y: 300 } });

// Get the current zoom scale
graph.zoom();  // number, current zoom value

// Fit zoom to content (show all content)
graph.zoomToFit({ padding: 20 });

// Zoom to a specified area
graph.zoomToRect({ x: 100, y: 100, width: 400, height: 300 });
```

## Complete Example

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  grid: { visible: true },
  panning: { enabled: true, modifiers: 'ctrl' },
  mousewheel: {
    enabled: true,
    modifiers: 'ctrl',
    minScale: 0.3,
    maxScale: 5,
    zoomAtMousePosition: true,
  },
});

graph.addNode({ x: 200, y: 200, width: 120, height: 60, label: 'Zoom me' });

// Display the current zoom scale
graph.on('scale', ({ sx }) => {
  console.log(`Current zoom: ${Math.round(sx * 100)}%`);
});
```

## Common Mistakes and Fixes

### ❌ Page Cannot Scroll Because `modifiers` Is Not Set

```javascript
// Problem: without a modifier key, the wheel is intercepted by the canvas, so the page cannot scroll
mousewheel: { enabled: true }  // ⚠️ Any wheel event triggers zoom
```

```javascript
// Correct: set a modifier key so normal wheel behavior is unaffected
mousewheel: { enabled: true, modifiers: 'ctrl' }  // ✅
```

### ❌ Confusing Relative and Absolute Modes of `zoom()`

```javascript
// Note the difference:
graph.zoom(2);                         // Relative: current scale + 2 (becomes 3x)
graph.zoom(2, { absolute: true });     // Absolute: set to 2x
```

### ❌ Blank Screen Because the Container Is Not Specified Correctly or the DOM Is Not Ready

```javascript
// Incorrect example: container variable is undefined or the DOM has not finished loading
const graph = new Graph({
  container,  // ❌ container variable is undefined
  panning: true,
  mousewheel: {
    enabled: true,
    modifiers: 'ctrl',
    minScale: 0.5,
    maxScale: 3,
  }
});
```

```javascript
// Correct example: ensure the DOM element exists and is mounted
const graph = new Graph({
  container: 'container',
  background: { color: '#F2F7FA' },
  panning: {
    enabled: true,
    modifiers: 'shift',
  },
  mousewheel: {
    enabled: true,
    modifiers: 'ctrl',
    minScale: 0.5,
    maxScale: 3,
  },
});

// Add nodes to ensure the canvas has content
graph.addNode({ shape: 'rect', x: 60, y: 60, width: 120, height: 50, label: 'Shift+Drag to pan' });
graph.addNode({ shape: 'rect', x: 260, y: 160, width: 120, height: 50, label: 'Ctrl+Wheel to zoom' });
```

### ❌ Incorrect `panning` Configuration Makes Dragging Ineffective

```javascript
// Anti-pattern: both panning and mousewheel omit modifiers,
// and 'mouseWheel' is also placed in panning.eventTypes, causing wheel events
// to conflict between panning and mousewheel zoom. It feels like a "blank screen / not working" issue.
const graph = new Graph({
  container: 'container',
  panning: {
    enabled: true,
    eventTypes: ['leftMouseDown', 'mouseWheel'], // ❌ Conflicts with mousewheel zoom
  },
  mousewheel: {
    enabled: true,
    modifiers: ['ctrl'],
    minScale: 0.5,
    maxScale: 3,
  },
});
```

```javascript
// Correct: use modifiers to separate the two interactions
// - Regular left-button drag = pan (or Shift + drag, depending on product definition)
// - Ctrl + wheel = zoom
const graph = new Graph({
  container: 'container',
  background: { color: '#F2F7FA' },
  panning: {
    enabled: true,
    modifiers: 'shift', // Or leave empty: 'leftMouseDown' + no modifiers
  },
  mousewheel: {
    enabled: true,
    modifiers: 'ctrl',
    minScale: 0.5,
    maxScale: 3,
  },
});
```

> Note: `panning` also supports boolean shorthand (`panning: true`, equivalent to `{ enabled: true, eventTypes: ['leftMouseDown'] }`), so it is not true that "boolean values are unsupported". However, when panning, mousewheel, Selection rubberband, and similar interactions are enabled together, you **must use `modifiers` to distinguish trigger conditions** and prevent event contention.

### ❌ Blank Screen Because No Content Was Added After Canvas Initialization

```javascript
// Incorrect example: only panning / mousewheel is configured, with no nodes or edges
const graph = new Graph({
  container: 'container',
  panning: { enabled: true, modifiers: 'shift' },
  mousewheel: { enabled: true, modifiers: 'ctrl', minScale: 0.5, maxScale: 3 },
});
// ❌ Rendering validation will treat this as a "blank screen": the canvas exists, but there is visually no content
```

```javascript
// Correct example: even if the user query only describes interaction configuration, add at least visible content with addNode/addEdge
const graph = new Graph({
  container: 'container',
  background: { color: '#F2F7FA' },
  grid: { visible: true, size: 10 },
  panning: { enabled: true, modifiers: 'shift' },
  mousewheel: { enabled: true, modifiers: 'ctrl', minScale: 0.5, maxScale: 3 },
});

graph.addNode({
  shape: 'rect', x: 60, y: 60, width: 120, height: 50, label: 'Shift+Drag to pan',
  attrs: { body: { fill: '#e6f7ff', stroke: '#1890ff', rx: 6, ry: 6 } },
});
graph.addNode({
  shape: 'rect', x: 260, y: 160, width: 120, height: 50, label: 'Ctrl+Wheel to zoom',
  attrs: { body: { fill: '#f6ffed', stroke: '#52c41a', rx: 6, ry: 6 } },
});
graph.addEdge({
  source: { x: 180, y: 85 },
  target: { x: 260, y: 185 },
  attrs: { line: { stroke: '#8f8f8f', strokeWidth: 1, targetMarker: 'classic' } },
});
```
