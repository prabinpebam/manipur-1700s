---
id: "x6-plugin-scroller"
title: "X6 Scroller Canvas Scrolling Plugin"
description: |
  The Scroller plugin embeds the canvas in a scrollable container and supports canvas panning, infinite scrolling, paginated display, and related capabilities.

library: "x6"
version: "3.x"
category: "plugins"
subcategory: "scroller"
tags:
  - "Scroller"
  - "scrolling"
  - "panning"
  - "pan"
  - "scroll"
  - "canvas panning"
  - "infinite canvas"

related:
  - "x6-plugins"
  - "x6-plugin-minimap"
  - "x6-core-graph-init"

use_cases:
  - "Scroll through a large canvas"
  - "Drag to pan the canvas"
  - "Display page boundaries"
  - "Center canvas content"
  - "Zoom the canvas to fit"

difficulty: "intermediate"
completeness: "full"
---

## Basic Usage

```javascript
import { Graph, Scroller } from '@antv/x6';

const graph = new Graph({ container: 'container' });
graph.use(new Scroller({
  enabled: true,
  pannable: true,  // Allow dragging to pan the canvas
}));
```

**Note**: After you use the Scroller plugin, the canvas container is wrapped in a scrollable container. The Graph `container` is no longer the outermost container; `scroller.container` is.

## Options

| Option | Type | Default | Description |
|--------|------|--------|------|
| `enabled` | boolean | `true` | Whether scrolling is enabled |
| `pannable` | boolean \| object | `false` | Whether drag panning is enabled. Object form: `{ enabled: true, eventTypes: ['leftMouseDown'] }` |
| `modifiers` | string \| string[] | - | Modifier keys for panning, such as `'ctrl'` or `['ctrl', 'meta']` |
| `className` | string | - | Custom CSS class name for the scroll container |
| `width` | number | - | Scroll container width (defaults to the same width as the canvas container) |
| `height` | number | - | Scroll container height (defaults to the same height as the canvas container) |
| `pageVisible` | boolean | `false` | Whether page boundaries are displayed |
| `pageBreak` | boolean | `false` | Whether page breaks are displayed |
| `pageWidth` | number | - | Page width |
| `pageHeight` | number | - | Page height |
| `padding` | number \| object | - | Extra scrollable area around the canvas |
| `autoResize` | boolean | `true` | Automatically adjust when the container size changes |

### `pannable` Object Configuration

```javascript
graph.use(new Scroller({
  enabled: true,
  pannable: {
    enabled: true,
    eventTypes: ['leftMouseDown'],  // Pan only by dragging with the left mouse button
    // Allowed values: 'leftMouseDown', 'rightMouseDown'
  },
}));
```

## Programmatic API

After Scroller is registered, the behavior of the following graph methods is delegated to Scroller:

```javascript
// Panning controls (handled by Scroller)
graph.enablePanning();
graph.disablePanning();
graph.togglePanning(true);
graph.isPannable();  // boolean

// Centering (automatically implemented by Scroller after registration)
graph.centerPoint(x, y);      // Center canvas coordinate (x, y) in the viewport
graph.centerCell(cell);        // Center the specified element
graph.centerContent();         // Center the canvas content

// Zooming (automatically implemented by Scroller after registration)
graph.zoom(1.5, { absolute: true });   // Zoom to 150%
graph.zoomToFit({ padding: 20 });      // Fit all content into view
graph.zoomToRect(rect);                // Zoom to the specified rectangle
```

### Scroller-Only APIs

The following methods are available only after the Scroller plugin is registered:

```javascript
// Lock/unlock scrolling
graph.lockScroller();     // Disable scrolling
graph.unlockScroller();   // Restore scrolling

// Update Scroller (manually refresh after canvas content changes)
graph.updateScroller();

// Get/set scrollbar position
graph.getScrollbarPosition();              // { left: number, top: number }
graph.setScrollbarPosition(left, top);     // Set the scrollbar position

// Get the Scroller DOM container
const scroller = graph.getPlugin('scroller');
const scrollerContainer = scroller.container;
```

## Complete Example

```javascript
import { Graph, Scroller, MiniMap } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
});

graph.use(new Scroller({
  enabled: true,
  pannable: true,
  pageVisible: true,
  pageBreak: false,
  modifiers: 'ctrl',  // Pan only while holding Ctrl (avoids conflicts with node dragging)
}));

// Add multiple nodes distributed across a large area
for (let i = 0; i < 20; i++) {
  graph.addNode({
    x: Math.random() * 2000,
    y: Math.random() * 1500,
    width: 80,
    height: 40,
    label: `Node ${i + 1}`,
  });
}

// Zoom to fit so all nodes are visible
graph.zoomToFit({ padding: 40 });
```

## Working with MiniMap

When Scroller and MiniMap are used together, MiniMap automatically reflects the Scroller viewport area:

```javascript
import { Graph, Scroller, MiniMap } from '@antv/x6';

const graph = new Graph({ container: 'container' });

graph.use(new Scroller({ enabled: true, pannable: true }));
graph.use(new MiniMap({
  enabled: true,
  container: document.getElementById('minimap'),
  width: 200,
  height: 160,
}));
```

## Scroller vs. `panning` Configuration

X6 Graph itself has a `panning` option (no plugin required), but Scroller provides a more complete scrolling experience:

| Feature | `panning: true` | Scroller Plugin |
|------|-----------------|---------------|
| Drag to pan the canvas | Yes | Yes |
| Scrollbars | No | Yes |
| Paginated display | No | Yes |
| Integration with MiniMap | Partial | Yes |
| Infinite scroll area | No | Yes |

If you only need simple panning, use `panning: true`; if you need scrollbars and pagination, use the Scroller plugin.

## Common Mistakes

### Do Not Use `panning` and Scroller at the Same Time

```javascript
// Incorrect: the two options conflict
const graph = new Graph({
  container: 'container',
  panning: true,  // Conflicts with Scroller
});
graph.use(new Scroller({ enabled: true, pannable: true }));
```

```javascript
// Correct: do not configure panning when using Scroller
const graph = new Graph({ container: 'container' });
graph.use(new Scroller({ enabled: true, pannable: true }));
```

### Do Not Configure `scroller` in the Constructor

```javascript
// Incorrect: not supported in 3.x
const graph = new Graph({
  container: 'container',
  scroller: { enabled: true, pannable: true },
});
```

```javascript
// Correct
import { Graph, Scroller } from '@antv/x6';
const graph = new Graph({ container: 'container' });
graph.use(new Scroller({ enabled: true, pannable: true }));
```
