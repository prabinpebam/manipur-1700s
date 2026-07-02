---
id: "g2-coord-cartesian"
title: "G2 Cartesian Coordinate System"
description: |
  Cartesian is the default coordinate system in G2 v5. The x and y channels map to horizontal and vertical positions respectively.
  Most common charts, including column charts, line charts, and scatterplots, use the Cartesian coordinate system.
  Additional coordinate transformations, such as transpose, can be applied through coordinate.transform.

library: "g2"
version: "5.x"
category: "coordinates"
tags:
  - "cartesian"
  - "cartesian coordinate system"
  - "default coordinate system"
  - "coordinate"
  - "cartesian coordinates"

related:
  - "g2-coord-transpose"
  - "g2-coord-polar"
  - "g2-mark-interval-basic"
  - "g2-mark-line-basic"

use_cases:
  - "Column charts in the default Cartesian coordinate system"
  - "Line charts in the default Cartesian coordinate system"
  - "Bar charts using Cartesian coordinates with transpose"
  - "Scatterplots in Cartesian coordinates"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/coordinate/cartesian"
---

## Core Concepts

The Cartesian coordinate system is the default coordinate system in G2. You do not need to configure the `coordinate` field explicitly.

- The x channel maps to the horizontal position, from left to right.
- The y channel maps to the vertical position, from bottom to top.
- Additional transformations, such as transpose, can be added through `coordinate.transform`.

## Default Usage (No Configuration Required)

```javascript
import { Chart } from '@antv/g2';

// Cartesian is the default coordinate system, so no coordinate configuration is required.
const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data: [
    { genre: 'Sports',   sold: 275 },
    { genre: 'Strategy', sold: 115 },
    { genre: 'Action',   sold: 120 },
  ],
  encode: { x: 'genre', y: 'sold' },
  // No coordinate configuration is needed; Cartesian is used by default.
});

chart.render();
```

## Explicit Specification (Equivalent to the Default)

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'genre', y: 'sold' },
  coordinate: { type: 'cartesian' },  // Explicitly specifying this is equivalent to omitting it.
});
```

## Cartesian Coordinate System + Transpose (Bar Chart)

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'genre', y: 'sold' },
  coordinate: {
    type: 'cartesian',
    transform: [{ type: 'transpose' }],  // Transpose swaps x and y, converting a column chart into a bar chart.
  },
});
```

## Coordinate Configuration Options

```javascript
chart.options({
  coordinate: {
    type: 'cartesian',
    transform: [
      { type: 'transpose' },         // Transpose swaps x and y.
      { type: 'reflect', x: true },  // Mirror across the x direction.
      { type: 'reflect', y: true },  // Mirror across the y direction.
      { type: 'scale', sx: 1, sy: -1 },  // Apply custom scaling.
    ],
  },
});
```

## Common Errors and Fixes

### Error: Configuring Cartesian Coordinates When a Donut Chart Is Expected
```javascript
// Error: pie and donut charts require the theta coordinate system, not Cartesian coordinates.
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'cartesian' },  // This renders a standard column chart instead.
});

// Correct: use the theta coordinate system for pie and donut charts.
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'theta', outerRadius: 0.8, innerRadius: 0.5 },
});
```
