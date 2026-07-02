---
id: "g2-transform-bin"
title: "G2 Bin / BinX Numeric Binning Transform (Histogram)"
description: |
  binX divides a continuous numeric x channel into intervals (bins) and counts the amount of data in each interval.
  It is the core transform for histograms. bin bins both the x and y directions to generate a two-dimensional frequency matrix.
  Use thresholds to control the number of bins, and use the y channel to specify the aggregation method (count, sum, and so on).

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "bin"
  - "binX"
  - "binning"
  - "histogram"
  - "histogram"
  - "frequency distribution"
  - "transform"

related:
  - "g2-transform-groupx"
  - "g2-mark-interval-basic"
  - "g2-mark-cell-heatmap"

use_cases:
  - "Draw histograms (numeric distribution frequency)"
  - "Create two-dimensional frequency heatmaps (bin bins x and y simultaneously)"
  - "Convert continuous numeric values into discrete grouped statistics"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform/bin"
---

## Minimal Runnable Example (Histogram)

```javascript
import { Chart } from '@antv/g2';

// Continuous numeric data; no need to precompute frequencies
const rawData = Array.from({ length: 1000 }, () => ({
  age: Math.floor(Math.random() * 50 + 20),  // Random age between 20 and 70
}));

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'interval',
  data: rawData,
  encode: {
    x: 'age',   // Continuous numeric value -> automatically binned
    y: '★',     // Placeholder; binX calculates count
  },
  transform: [
    {
      type: 'binX',
      y: 'count',        // Aggregation method: count items in each bin
      thresholds: 15,    // Number of bins (approximate); computed automatically by default
    },
  ],
  style: { inset: 1 },  // Leave a 1 px gap between bars
  axis: { y: { title: 'Number of people' } },
});

chart.render();
```

## BinX Options

```javascript
transform: [
  {
    type: 'binX',
    thresholds: 20,  // Number of bins (integer) or threshold array (for example, [0, 25, 50, 75, 100])
    y: 'count',      // Aggregation: 'count' | 'sum' | 'mean' | 'min' | 'max' | function
    // groupBy: 'color',  // Group and bin by color (for grouped histograms)
  },
]
```

## Two-Dimensional Frequency Heatmap (bin)

```javascript
// bin bins both the x and y directions to generate a two-dimensional frequency matrix
chart.options({
  type: 'cell',
  data: scatterData,
  encode: {
    x: 'x',
    y: 'y',
    color: '★',
  },
  transform: [
    {
      type: 'bin',
      color: 'count',    // Count the points in each cell (mapped to color)
      thresholds: [20, 20],  // [number of x-direction bins, number of y-direction bins]
    },
  ],
  scale: { color: { type: 'sequential', palette: 'ylOrRd' } },
  style: { lineWidth: 0 },
});
```

## Grouped Histogram (Binned by Color)

```javascript
chart.options({
  type: 'interval',
  data: employeeData,
  encode: { x: 'salary', y: '★', color: 'dept' },
  transform: [
    { type: 'binX', y: 'count', thresholds: 12 },
    { type: 'stackY' },   // Stack
  ],
});
```

## Common Mistakes and Fixes

### Mistake 1: Using binX on a categorical x field--use groupX for categories
```javascript
// ❌ Mistake: x is a string category, so binX cannot bin it
chart.options({
  encode: { x: 'department', y: '★' },   // department is a string
  transform: [{ type: 'binX', y: 'count' }],  // ❌
});

// ✅ Use groupX for string categories
chart.options({
  encode: { x: 'department', y: '★' },
  transform: [{ type: 'groupX', y: 'count' }],  // ✅
});

// ✅ Use binX for continuous numeric values
chart.options({
  encode: { x: 'age', y: '★' },   // age is numeric
  transform: [{ type: 'binX', y: 'count' }],  // ✅
});
```

### Mistake 2: Setting thresholds too high, which creates many tiny bins
```javascript
// ❌ Setting 500 bins for 1000 records gives 2 records per bin, which makes the histogram statistically meaningless
transform: [{ type: 'binX', y: 'count', thresholds: 500 }]  // ❌

// ✅ Histogram bin counts are usually between 10 and 50
transform: [{ type: 'binX', y: 'count', thresholds: 20 }]  // ✅
```