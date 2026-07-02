---
id: "g2-transform-binx"
title: "G2 BinX Binning Transform (Histogram)"
description: |
  BinX groups continuous x values into specified intervals (bins) and automatically counts the records in each interval (or computes an aggregate value).
  It is the core Transform for drawing frequency histograms. Combined with the Interval Mark, it can generate a histogram directly from raw data.

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "BinX"
  - "histogram"
  - "histogram"
  - "binning"
  - "distribution"
  - "frequency"
  - "transform"
  - "spec"

related:
  - "g2-mark-interval-basic"
  - "g2-transform-stacky"

use_cases:
  - "Show the frequency distribution of continuous numeric data"
  - "Explore the shape of a data distribution (normal, skewed, and so on)"

anti_patterns:
  - "When the data is discrete categories, binX is unnecessary; use interval directly"

difficulty: "intermediate"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform/bin-x"
---

## Minimal Runnable Example (Histogram)

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 400,
});

// Raw continuous numeric data
const rawData = Array.from({ length: 200 }, () => ({
  value: Math.random() * 100,
}));

chart.options({
  type: 'interval',
  data: rawData,
  encode: { x: 'value' },
  transform: [
    {
      type: 'binX',
      y: 'count',      // Count records in each bin and write the result to the y channel
      thresholds: 20,  // Split into about 20 bins
    },
  ],
  style: { inset: 0.5 },    // Leave a thin gap between bars
});

chart.render();
```

## Options

```javascript
transform: [
  {
    type: 'binX',
    // Aggregation target
    y: 'count',       // 'count' (default; count) | 'sum' | 'mean' | 'max' | 'min'
    // For sum/mean and similar reducers, also specify the field to aggregate:
    // y: 'sum', field: 'amount',

    // Bin count control (choose one of three)
    thresholds: 20,           // Target number of bins (approximate; the library adjusts it automatically)
    // domain: [0, 100],      // Specify the value domain
    // step: 5,               // Width of each bin (mutually exclusive with thresholds)
  },
],
```

## Grouped Histogram (Colored by Category)

```javascript
chart.options({
  type: 'interval',
   data,  // [{ value: 42, group: 'A' }, ...]
  encode: { x: 'value', color: 'group' },
  transform: [
    { type: 'binX', y: 'count', thresholds: 15 },
    { type: 'stackY' },   // Stack counts for different groups within the same bin
  ],
});
```

## Common Mistakes and Fixes

### Mistake: Using binX on discrete categorical data
```javascript
// ❌ Mistake: genre is a categorical field and does not need binX
chart.options({
  type: 'interval',
  data,
  encode: { x: 'genre' },
  transform: [{ type: 'binX', y: 'count' }],  // Unnecessary!
});

// ✅ Correct: use interval directly for categorical data; binX is not needed
chart.options({
  type: 'interval',
  data,
  encode: { x: 'genre', y: 'count' },
});
```

### Mistake: Forgetting to specify the y statistic
```javascript
// ❌ Mistake: no y parameter, so the statistic to compute is unknown
chart.options({ transform: [{ type: 'binX', thresholds: 20 }] });

// ✅ Correct: y must be specified
chart.options({ transform: [{ type: 'binX', y: 'count', thresholds: 20 }] });
```