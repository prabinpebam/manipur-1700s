---
id: "x6-core-transform-api"
title: "X6 Canvas Size and Transform APIs"
description: |
  A complete guide to transform APIs such as canvas zooming (zoom/scale), panning (translate), rotation (rotate), fitting content (fitToContent/zoomToFit), and centering (centerContent/centerCell).
library: x6
version: 3.x
category: "core"
tags:
  - transform
  - zoom
  - scale
  - resize
  - translate
  - fit
  - center
---

# Canvas Size and Transform APIs

## Overview

X6's TransformManager provides canvas-level zooming, panning, rotation, resizing, and content fitting capabilities. All transform APIs are called directly through the `graph` instance.

## Canvas Size

### resize - Resize the Canvas

```javascript
// Set the canvas width and height (pixels)
graph.resize(1000, 600);
```

### autoResize - Automatically Follow the Container Size

Configure `autoResize: true` in the Graph constructor, and the canvas will use ResizeObserver to automatically follow size changes of the parent container:

```javascript
const graph = new Graph({
  container: 'container',
  autoResize: true,  // Automatically follow the parent container size
});
```

You can also pass a specific DOM element as the observed target:

```javascript
const graph = new Graph({
  container: 'container',
  autoResize: document.getElementById('wrapper'),
});
```

### getComputedSize - Get the Current Canvas Size

```javascript
const { width, height } = graph.getComputedSize();
```

## Zooming (Zoom / Scale)

### zoom - Zoom the Canvas

```javascript
// Relative zoom: increase by 0.2 from the current scale
graph.zoom(0.2);

// Absolute zoom: set to 1.5x
graph.zoom(1.5, { absolute: true });

// Zoom around a specified center point
graph.zoom(0.5, { absolute: true, center: { x: 400, y: 300 } });

// Limit the zoom range
graph.zoom(2, { absolute: true, minScale: 0.5, maxScale: 4 });

// Grid-aligned zoom
graph.zoom(1.5, { absolute: true, scaleGrid: 0.25 });  // Align the scale value to multiples of 0.25
```

**zoom options parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `absolute` | boolean | `true` means absolute zoom; `false` (default) means relative increment |
| `minScale` | number | Minimum scale ratio |
| `maxScale` | number | Maximum scale ratio |
| `scaleGrid` | number | Grid for aligning scale values |
| `center` | `{ x, y }` | Zoom center point (canvas coordinates) |

### getZoom - Get the Current Zoom Ratio

```javascript
const currentZoom = graph.getZoom();  // Returns a number, such as 1.0
```

### scale - Low-level Scaling (Set sx/sy Separately)

```javascript
// Uniform scaling
graph.scale(1.5);

// Non-uniform scaling
graph.scale(2, 1.5);

// Specify the scaling origin
graph.scale(1.5, 1.5, 400, 300);
```

### getScale - Get the Current Scale Ratio (Per Axis)

```javascript
const { sx, sy } = graph.getScale();
```

### scaling Configuration - Limit the Zoom Range

Set global zoom bounds through `scaling` when constructing the Graph:

```javascript
const graph = new Graph({
  container: 'container',
  scaling: { min: 0.2, max: 4 },  // Global zoom range limit
});
```

## Panning (Translate)

### translate - Set Canvas Translation

```javascript
// Set an absolute translation amount
graph.translate(100, 50);
```

### getTranslation - Get the Current Translation

```javascript
const { tx, ty } = graph.getTranslation();
```

## Rotation (Rotate)

### rotate - Rotate the Canvas

```javascript
// Rotate 45 degrees (by default, around the center of canvas content)
graph.rotate(45);

// Specify the rotation center
graph.rotate(90, 400, 300);
```

### getRotation - Get the Current Rotation Angle

```javascript
const angle = graph.getRotation();
```

## Content Fitting

### zoomToFit - Zoom and Pan So All Content Is Visible

```javascript
// Basic usage: automatically fit all content
graph.zoomToFit();

// With padding
graph.zoomToFit({ padding: 20 });

// Limit the zoom range
graph.zoomToFit({ padding: 20, maxScale: 2, minScale: 0.5 });

// Different padding on each side
graph.zoomToFit({ padding: { top: 20, right: 30, bottom: 20, left: 30 } });
```

### zoomToRect - Zoom to a Specified Rectangular Area

```javascript
graph.zoomToRect({ x: 100, y: 100, width: 500, height: 400 });

graph.zoomToRect(
  { x: 0, y: 0, width: 1000, height: 800 },
  { padding: 20, maxScale: 3 },
);
```

### fitToContent - Resize the Canvas to Fit Content

Adjusts the canvas size so it just contains all content (does not scale the content; it changes the canvas size instead):

```javascript
// Basic usage
graph.fitToContent();

// With grid alignment and padding
graph.fitToContent({ gridWidth: 10, gridHeight: 10, padding: 20 });

// Complete parameters
graph.fitToContent({
  gridWidth: 10,
  gridHeight: 10,
  padding: { top: 20, right: 20, bottom: 20, left: 20 },
  minWidth: 400,
  minHeight: 300,
  maxWidth: 2000,
  maxHeight: 1500,
  allowNewOrigin: 'any',  // 'negative' | 'positive' | 'any'
  border: 10,
});
```

**fitToContent options:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `gridWidth` | number | Width alignment grid (default 1) |
| `gridHeight` | number | Height alignment grid (default 1) |
| `padding` | number \| SideOptions | Padding |
| `minWidth` | number | Minimum canvas width |
| `minHeight` | number | Minimum canvas height |
| `maxWidth` | number | Maximum canvas width |
| `maxHeight` | number | Maximum canvas height |
| `border` | number | Content border expansion |
| `allowNewOrigin` | string | Whether origin adjustment is allowed |
| `contentArea` | RectangleLike | Custom content area |
| `useCellGeometry` | boolean | Use geometric calculation (default true) |

### scaleContentToFit - Scale Content to Fit the Canvas

Scales canvas content to fit the current visible canvas area (uniform scaling):

```javascript
graph.scaleContentToFit();

graph.scaleContentToFit({
  padding: 20,
  maxScale: 2,
  minScale: 0.5,
  preserveAspectRatio: true,  // Preserve aspect ratio (default true)
});
```

**scaleContentToFit options:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `padding` | number \| SideOptions | Padding |
| `minScale` / `maxScale` | number | Global scaling limits |
| `minScaleX` / `maxScaleX` | number | X-axis scaling limits |
| `minScaleY` / `maxScaleY` | number | Y-axis scaling limits |
| `scaleGrid` | number | Scaling alignment grid |
| `contentArea` | RectangleLike | Custom content area |
| `viewportArea` | RectangleLike | Custom viewport area |
| `preserveAspectRatio` | boolean | Preserve aspect ratio |

## Centering

### centerContent - Center the Content

```javascript
graph.centerContent();
graph.centerContent({ useCellGeometry: true });
```

### centerCell - Center a Specified Node (Scroll to the Node)

```javascript
const node = graph.addNode({ ... });
graph.centerCell(node);  // Scroll the canvas so this node is centered
```

> **⚠️ Note**: X6 does not have a `graph.scrollToCell()` method. To scroll to a specified node, use `graph.centerCell(cell)`.

### centerPoint - Center a Specified Coordinate

```javascript
graph.centerPoint(500, 300);
```

## Positioning

### positionContent - Position Content in a Specified Direction

```javascript
// Position content at the center of the canvas
graph.positionContent('center');

// Other positions: 'top' | 'top-right' | 'right' | 'bottom-right' | 'bottom' | 'bottom-left' | 'left' | 'top-left'
graph.positionContent('top-left');
```

### positionCell - Position a Node in a Specified Direction

```javascript
graph.positionCell(node, 'center');
```

### positionPoint - Position a Specified Point at a Specific Location on the Canvas

```javascript
// Position local coordinate (200, 150) at 50% 50% of the canvas (that is, centered)
graph.positionPoint({ x: 200, y: 150 }, '50%', '50%');

// Position the point at a 100px offset from the top-left corner of the canvas
graph.positionPoint({ x: 0, y: 0 }, 100, 100);
```

## Content Area Queries

### getContentArea - Get Content Bounds (Local Coordinates)

```javascript
const rect = graph.getContentArea();
// rect: { x, y, width, height }
```

### getContentBBox - Get Content Bounds (Canvas Coordinates)

```javascript
const bbox = graph.getContentBBox();
```

### getGraphArea - Get the Visible Canvas Area (Local Coordinates)

```javascript
const area = graph.getGraphArea();
```

## Coordinate Conversion

### localToGraph - Convert Local Coordinates to Canvas Coordinates

```javascript
const graphPoint = graph.localToGraph({ x: 100, y: 100 });
```

### graphToLocal - Convert Canvas Coordinates to Local Coordinates

```javascript
const localPoint = graph.graphToLocal({ x: 200, y: 150 });
```

## Complete Example

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  autoResize: true,
  scaling: { min: 0.2, max: 5 },
  mousewheel: { enabled: true, modifiers: 'ctrl' },
  panning: true,
});

// Add some nodes
graph.addNode({ shape: 'rect', x: 50, y: 50, width: 100, height: 40, label: 'A' });
graph.addNode({ shape: 'rect', x: 300, y: 200, width: 100, height: 40, label: 'B' });
graph.addNode({ shape: 'rect', x: 600, y: 400, width: 100, height: 40, label: 'C' });

// Automatically fit all content to the center of the canvas
graph.zoomToFit({ padding: 50, maxScale: 1 });

// Listen for zoom events
graph.on('scale', ({ sx, sy }) => {
  console.log(`Current zoom: ${sx.toFixed(2)}x`);
});

// Listen for resize events
graph.on('resize', ({ width, height }) => {
  console.log(`Canvas size: ${width} x ${height}`);
});
```

## Common Errors

```javascript
// ❌ Wrong: when absolute is not passed, zoom is a relative increment, not an absolute value
graph.zoom(1.5);  // This adds +1.5 to the current scale; it does not set the scale to 1.5x!

// ✅ Correct: set an absolute zoom ratio
graph.zoom(1.5, { absolute: true });

// ❌ Wrong: content disappears after fitToContent (when content is empty, it returns an empty rectangle)
graph.fitToContent();  // If there are no elements on the canvas, this may shrink the size to a very small value

// ✅ Correct: set minimum size protection
graph.fitToContent({ minWidth: 400, minHeight: 300 });

// ❌ Wrong: mixing scale and zoom causes unexpected behavior
graph.scale(2, 1.5);  // Non-uniform scaling
graph.zoom(1);         // zoom internally uses scale(sx, sy), overriding it with uniform scaling

// ✅ Correct: consistently use either zoom or scale
graph.zoom(2, { absolute: true });  // Recommended for uniform scaling
```
