---
id: "g2-coord-parallel"
title: "G2 Parallel Coordinate System"
description: |
  The parallel coordinate system arranges multiple dimensions as parallel vertical axes, with each polyline representing one data record.
  It is used to discover patterns, clusters, and outliers in multidimensional data.
  It should be used with a line mark, and the position channel in encode should be bound to multiple fields.

library: "g2"
version: "5.x"
category: "coordinates"
tags:
  - "parallel"
  - "parallel coordinates"
  - "multidimensional"
  - "high-dimensional data"
  - "coordinate"

related:
  - "g2-mark-line-basic"
  - "g2-coord-transpose"

use_cases:
  - "Comparing multidimensional data, such as multiple automobile performance metrics"
  - "Discovering clusters and relationships in high-dimensional data"
  - "Detecting outliers"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/coordinate/parallel"
---

## Minimal Runnable Example

```javascript
import { Chart } from '@antv/g2';

const data = [
  { name: 'Product A', price: 120, sales: 300, rating: 4.5, stock: 80 },
  { name: 'Product B', price: 85,  sales: 450, rating: 3.8, stock: 120 },
  { name: 'Product C', price: 200, sales: 180, rating: 4.9, stock: 40 },
  { name: 'Product D', price: 60,  sales: 600, rating: 3.2, stock: 200 },
];

const chart = new Chart({ container: 'container', width: 600, height: 400 });

chart.options({
  type: 'line',
  data,
  encode: {
    position: ['price', 'sales', 'rating', 'stock'],  // List of multidimensional fields.
  },
  coordinate: { type: 'parallel' },  // Parallel coordinate system.
  style: {
    lineWidth: 1.5,
    strokeOpacity: 0.7,
  },
  legend: { color: { position: 'right' } },
});

chart.render();
```

## Parallel Coordinates with Interactive Highlighting

```javascript
chart.options({
  type: 'line',
  data,
  encode: {
    position: ['cylinders', 'displacement', 'horsepower', 'weight', 'acceleration', 'miles_per_gallon'],
    color: 'origin',
  },
  coordinate: { type: 'parallel' },
  style: { lineWidth: 1, strokeOpacity: 0.5 },
  interaction: {
    elementHighlight: { background: true },  // Highlight on hover.
  },
  axis: {
    // Configure a separate title for each dimension.
    position0: { title: 'Cylinders' },
    position1: { title: 'Displacement' },
    position2: { title: 'Horsepower' },
  },
});
```

## Common Errors and Fixes

### Error 1: Using x/y Encoding Instead of position
```javascript
// Error: parallel coordinates do not use x/y; they require the position channel.
chart.options({
  type: 'line',
  encode: {
    x: 'price',      // Incorrect.
    y: 'sales',      // Incorrect: only two dimensions, not parallel coordinates.
  },
  coordinate: { type: 'parallel' },
});

// Correct: pass an array of fields to the position channel.
chart.options({
  type: 'line',
  encode: {
    position: ['price', 'sales', 'rating'],  // Correct array form.
  },
  coordinate: { type: 'parallel' },
});
```

### Error 2: Using an interval or point Mark in Parallel Coordinates
```javascript
// Error: the parallel coordinate system is intended for line marks.
chart.options({
  type: 'interval',  // Not meaningful in parallel coordinates.
  coordinate: { type: 'parallel' },
});

// Correct: use a line mark.
chart.options({
  type: 'line',
  coordinate: { type: 'parallel' },
});
```
