---
id: "g2-mark-shape"
title: "G2 Custom Shape Mark"
description: |
  The shape mark in G2 v5 draws fully custom graphics,
  rendering arbitrary SVG or Canvas graphics by registering custom shape functions.
  Unlike the image mark, which uses image assets, the shape mark draws vector graphics with code
  and can respond to state changes such as highlight and selection.
  It is suitable for visualizations that need special symbols or custom markers.

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "shape"
  - "custom chart shape"
  - "register"
  - "custom shape"
  - "custom marker"

related:
  - "g2-mark-image"
  - "g2-mark-point-scatter"
  - "g2-core-chart-init"

use_cases:
  - "Use custom markers instead of default circles in a scatter plot"
  - "Draw custom landmark symbols on top of a chart"
  - "Create specialized chart symbols for custom visualization scenarios"

difficulty: "advanced"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/extra-topics/custom-mark"
---

## Core concepts

The `shape` mark requires you to first register a custom chart shape with `register('shape.xxx', renderFn)`,
then specify the registered shape name in the mark's `style.shape`.

The custom shape render function receives `(style, context)` parameters:
- `style`: contains x/y coordinates, color, size, and other style properties.
- `context`: contains the G rendering context, including `document`.

## Minimal runnable example

```javascript
import { Chart, register } from '@antv/g2';
import { Circle } from '@antv/g';

// 1. Register a custom chart shape (draw a cross-circle marker).
register('shape.crossCircle', (style, context) => {
  const { x, y, r = 10, fill, stroke } = style;
  const group = new context.document.createElement('g', {});
  const circle = new Circle({ style: { cx: x, cy: y, r, fill, stroke } });
  group.appendChild(circle);
  return group;
});

// 2. Use the custom chart shape.
const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y', color: 'category', size: 'value' },
  style: {
  shape: 'crossCircle', // Use the registered custom shape name.
  },
});

chart.render();
```

## Complete custom shape (using @antv/g graphics)

```javascript
import { Chart, register } from '@antv/g2';
import { Path, Group } from '@antv/g';

// Register a star-shaped chart marker.
register('shape.star', (style, context) => {
  const { x, y, r = 10, fill = '#1890ff', opacity = 1 } = style;

  // Calculate the five-point star path.
  const path = [];
  for (let i = 0; i < 5; i++) {
  const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
  const px = x + r * Math.cos(angle);
  const py = y + r * Math.sin(angle);
  path.push(i === 0 ? `M ${px} ${py}` : `L ${px} ${py}`);
  }
  path.push('Z');

  const shape = new Path({
  style: {
  d: path.join(' '),
  fill,
  opacity,
  },
  });
  return shape;
});

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y', color: 'type' },
  style: {
  shape: 'star',
  r: 12,
  },
});

chart.render();
```

## Choosing between shape and image mark

```javascript
// Use an image asset as a chart marker.
chart.options({
  type: 'image',
  data,
  encode: { x: 'x', y: 'y', src: 'iconUrl' }, // src is the chart image URL.
  style: { width: 24, height: 24 },
});

// Use code to draw a custom chart shape.
register('shape.myIcon', (style) => { /* ... */ });
chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y' },
  style: { shape: 'myIcon' },
});
```

## Common errors and fixes

### Error: using a custom chart shape before registering it
```javascript
// ❌ Error: if the shape is not registered before use, it will not render.
chart.options({
  type: 'point',
  style: { shape: 'myCustomShape' }, // ❌ myCustomShape is not registered.
});

// ✅ Register it before use.
register('shape.myCustomShape', (style) => { /* return a G shape */ });
chart.options({
  type: 'point',
  style: { shape: 'myCustomShape' }, // ✅
});
```
