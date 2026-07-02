---
id: "g2-interaction-brush-axis"
title: "G2 Axis Brushing Highlight (brushAxisHighlight)"
description: |
  brushAxisHighlight brushes an interval on a single axis in a parallel coordinate system
  and highlights polylines that satisfy the selection criteria on all axes. It is the most common
  multidimensional filtering interaction for parallel coordinate charts and can set intervals
  on multiple axes at the same time to enable combined multidimensional filtering.

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "brushAxisHighlight"
  - "axis brushing"
  - "parallel coordinates"
  - "multidimensional filtering"
  - "interaction"

related:
  - "g2-coord-parallel"
  - "g2-interaction-brush-filter"

use_cases:
  - "Perform combined multidimensional filtering in a parallel coordinate chart"
  - "Set separate filter intervals on multiple axes"
  - "Interactively explore high-dimensional data"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/brush-axis-highlight"
---

## Minimal Runnable Example

```javascript
import { Chart } from '@antv/g2';

const data = [
  { name: 'Product A', price: 120, sales: 300, rating: 4.5, stock: 80 },
  { name: 'Product B', price: 85,  sales: 450, rating: 3.8, stock: 120 },
  { name: 'Product C', price: 200, sales: 180, rating: 4.9, stock: 40 },
  { name: 'Product D', price: 60,  sales: 600, rating: 3.2, stock: 200 },
  { name: 'Product E', price: 150, sales: 220, rating: 4.2, stock: 65 },
];

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'line',
  data,
  encode: {
    position: ['price', 'sales', 'rating', 'stock'],
    color: 'name',
  },
  coordinate: { type: 'parallel' },
  style: { lineWidth: 1.5, strokeOpacity: 0.7 },
  interaction: {
    brushAxisHighlight: true,   // Drag on each axis to set a filter interval
  },
});

chart.render();
```

## Standard Combination with the parallel Coordinate System

```javascript
chart.options({
  type: 'line',
  data: carData,
  encode: {
    position: ['mpg', 'cylinders', 'displacement', 'horsepower', 'weight', 'acceleration'],
    color: 'origin',
  },
  coordinate: { type: 'parallel' },
  style: { lineWidth: 1, strokeOpacity: 0.5 },
  interaction: {
    brushAxisHighlight: {
      // Style for unselected lines
      unhighlightedOpacity: 0.1,
    },
  },
  legend: { color: { position: 'top' } },
});
```

## Common Errors and Fixes

### Error: Using brushAxisHighlight on a chart that is not in a parallel coordinate system
```javascript
// ❌ brushAxisHighlight is designed specifically for parallel coordinate systems
chart.options({
  type: 'line',
  encode: { x: 'date', y: 'value' },   // Regular line chart
  coordinate: { type: 'cartesian' },
  interaction: { brushAxisHighlight: true },  // ❌ Regular charts do not have axes that can be brushed this way
});

// ✅ Use regular brushHighlight or brushFilter instead
chart.options({
  interaction: { brushHighlight: true },  // ✅ Regular rectangular brushing
});

// ✅ Use brushAxisHighlight only for parallel coordinate charts
chart.options({
  coordinate: { type: 'parallel' },
  interaction: { brushAxisHighlight: true },  // ✅
});
```
