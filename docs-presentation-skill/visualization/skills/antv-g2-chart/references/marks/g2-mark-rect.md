---
id: "g2-mark-rect"
title: "G2 Rectangle Annotation (rect)"
description: |
  The rect mark draws rectangles at arbitrary positions and sizes in a chart,
  using x/x1 for left and right boundaries and y/y1 for lower and upper boundaries (in axis units).
  It is commonly used to highlight data ranges, partition backgrounds, and annotate regions.
  It is similar to rangeX but more general, supporting boundaries in both x and y directions.

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "rect"
  - "rectangle"
  - "region annotation"
  - "background partition"
  - "annotation"

related:
  - "g2-mark-rangex"
  - "g2-comp-annotation"
  - "g2-mark-linex-liney"

use_cases:
  - "Highlight a specific x/y range in a chart"
  - "Annotate a value range as a rectangle in a scatter plot"
  - "Partition a chart background by color"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/annotation/range/"
---

## Minimal runnable example (two-dimensional range annotation)

```javascript
import { Chart } from '@antv/g2';

const scatterData = Array.from({ length: 100 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
}));

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'view',
  children: [
  // Main scatter plot
  {
  type: 'point',
  data: scatterData,
  encode: { x: 'x', y: 'y' },
  style: { r: 3, fillOpacity: 0.6 },
  },
  // Rectangle annotation: highlight the range x: 30-70, y: 30-70.
  {
  type: 'rect',
  [{ x: 30, x1: 70, y: 30, y1: 70, label: 'Target range' }],
  encode: { x: 'x', x1: 'x1', y: 'y', y1: 'y1' },
  style: {
  fill: '#52c41a',
  fillOpacity: 0.1,
  stroke: '#52c41a',
  lineWidth: 1.5,
  lineDash: [4, 4],
  },
  labels: [
  { text: 'label', position: 'top-left', style: { fill: '#52c41a', fontSize: 11 } },
  ],
  },
  ],
});

chart.render();
```

## Configuration options

```javascript
chart.options({
  type: 'rect',
  data: [{ x: 20, x1: 60, y: 0, y1: 100, label: 'Range A' }],
  encode: {
  x: 'x', // Left boundary of the rectangle, in x-axis units
  x1: 'x1', // Right boundary of the rectangle
  y: 'y', // Bottom boundary of the rectangle, in y-axis units
  y1: 'y1', // Top boundary of the rectangle
  },
  style: {
  fill: '#5B8FF9',
  fillOpacity: 0.1,
  stroke: '#5B8FF9',
  lineWidth: 1,
  },
});
```

## Common errors and fixes

### Error: confusing rect with rangeX/rangeY; rect requires both x and y directions
```javascript
// rangeX: specify only the x direction; the y direction fills the full chart height.
chart.options({ type: 'rangeX', encode: { x: 'start', x1: 'end' } });

// rangeY: specify only the y direction; the x direction fills the full chart width.
chart.options({ type: 'rangeY', encode: { y: 'min', y1: 'max' } });

// rect: specify both x and y directions for a complete rectangular range.
chart.options({ type: 'rect', encode: { x: 'x', x1: 'x1', y: 'y', y1: 'y1' } });
```
