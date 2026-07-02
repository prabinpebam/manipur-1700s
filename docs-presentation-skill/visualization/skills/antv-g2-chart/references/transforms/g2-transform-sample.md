---
id: "g2-transform-sample"
title: "G2 Sample Data Sampling Transform"
description: |
  The sample transform automatically downsamples data when it exceeds a threshold (2000 rows by default),
  preventing large datasets from rendering too slowly or becoming visually overcrowded.
  It supports multiple strategies, including first, last, min, max, median, and lttb (largest triangle, trend-preserving).

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "sample"
  - "sampling"
  - "large data"
  - "performance optimization"
  - "lttb"
  - "downsampling"
  - "transform"

related:
  - "g2-mark-line-basic"
  - "g2-transform-filter"

use_cases:
  - "Preserve visual trends when sampling line chart data with more than 2000 rows"
  - "Optimize performance for real-time data streams"
  - "Visualize large time series such as stock candlestick data"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform/sample"
---

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

// Simulate 5000 time-series data rows
const data = Array.from({ length: 5000 }, (_, i) => ({
  time: new Date(2020, 0, 1 + Math.floor(i / 10)).toISOString(),
  value: Math.sin(i / 50) * 100 + Math.random() * 20,
}));

const chart = new Chart({ container: 'container', width: 800, height: 400 });

chart.options({
  type: 'line',
  data,
  encode: { x: 'time', y: 'value' },
  transform: [
    {
      type: 'sample',
      thresholds: 500,     // Trigger sampling only when there are more than 500 rows
      strategy: 'lttb',   // Largest-triangle sampling; best for preserving visual trends
    },
  ],
});

chart.render();
```

## Sampling strategy comparison

```javascript
// lttb (recommended): largest-triangle three-buckets algorithm with the highest visual fidelity
transform: [{ type: 'sample', strategy: 'lttb', thresholds: 500 }]

// median: use the median of each bucket; smooth but may lose extrema
transform: [{ type: 'sample', strategy: 'median', thresholds: 1000 }]

// min/max: preserve each bucket's minimum/maximum value; suitable when extrema must be retained
transform: [{ type: 'sample', strategy: 'max', thresholds: 800 }]

// first/last: use the first/last row in each bucket; fastest but least accurate
transform: [{ type: 'sample', strategy: 'first', thresholds: 2000 }]
```

## Grouped sampling for multiple series

```javascript
// groupBy specifies grouping fields so each series is sampled independently
chart.options({
  type: 'line',
  data: multiSeriesData,
  encode: { x: 'time', y: 'value', color: 'series' },
  transform: [
    {
      type: 'sample',
      thresholds: 300,
      strategy: 'lttb',
      groupBy: ['series', 'color'],  // Group by series; downsample each group independently
    },
  ],
});
```

## Options

```javascript
transform: [
  {
    type: 'sample',
    strategy: 'median',   // Sampling strategy: 'first'|'last'|'min'|'max'|'median'|'lttb'|function
                          // Default 'median'
    thresholds: 2000,     // Data volume threshold that triggers sampling, default 2000
    groupBy: ['series', 'color'],  // Grouping fields, default ['series', 'color']
  },
]
```

## Common mistakes and fixes

### Mistake 1: Setting thresholds too high--the data is large but sampling is not triggered
```javascript
// ❌ 10000 rows of data, thresholds is the default 2000, but the strategy is not ideal
transform: [{ type: 'sample' }]  // Default thresholds: 2000, strategy: 'median'
// ⚠️  Reducing 10000 rows to 2000 rows may still be too many

// ✅ Set thresholds explicitly based on the rendering target
transform: [{ type: 'sample', thresholds: 300, strategy: 'lttb' }]
```

### Mistake 2: Using sample on a column chart--this breaks complete categories
```javascript
// ❌ After sampling a column chart, some categories disappear, creating visual gaps
chart.options({
  type: 'interval',
  encode: { x: 'category', y: 'value' },
  transform: [{ type: 'sample' }],  // ❌ Column charts usually do not need sampling
});

// ✅ sample is mainly used for continuous data such as line charts
chart.options({
  type: 'line',
  encode: { x: 'time', y: 'value' },
  transform: [{ type: 'sample', strategy: 'lttb' }],  // ✅
});
```
