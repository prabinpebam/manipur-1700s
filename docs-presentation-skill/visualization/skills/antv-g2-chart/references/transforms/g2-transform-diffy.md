---
id: "g2-transform-diffy"
title: "G2 DiffY Difference Area Transform"
description: |
  diffY calculates the difference interval between two lines (from y0 to y1) and is used to draw difference area charts.
  It keeps the y value of the upper line unchanged and calculates the lower line's difference relative to the upper line as y1,
  visually showing positive and negative difference regions between two series.

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "diffY"
  - "difference"
  - "difference area"
  - "comparison"
  - "transform"
  - "interval area"

related:
  - "g2-mark-area-stacked"
  - "g2-transform-stacky"
  - "g2-mark-line-basic"

use_cases:
  - "Show positive and negative difference regions between two lines"
  - "Visualize deviation between actual and forecast values"
  - "Show differences between upper and lower price ranges"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform/diff-y"
---

## Minimal Runnable Example (Actual vs. Forecast Difference)

```javascript
import { Chart } from '@antv/g2';

const data = [
  { month: 'Jan', actual: 83,  forecast: 75 },
  { month: 'Feb', actual: 60,  forecast: 70 },
  { month: 'Mar', actual: 95,  forecast: 85 },
  { month: 'Apr', actual: 72,  forecast: 80 },
  { month: 'May', actual: 110, forecast: 100 },
  { month: 'Jun', actual: 88,  forecast: 95 },
];

// Convert to long-table format
const longData = data.flatMap(d => [
  { month: d.month, value: d.actual,   type: 'Actual' },
  { month: d.month, value: d.forecast, type: 'Forecast' },
]);

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'view',
  children: [
    // Difference area (positive difference: actual > forecast shown in green; negative difference: actual < forecast shown in red)
    {
      type: 'area',
       longData,
      encode: { x: 'month', y: 'value', color: 'type', series: 'type' },
      transform: [{ type: 'diffY' }],   // Calculate the difference interval between the two series
      style: {
        fillOpacity: 0.3,
      },
    },
    // Main lines
    {
      type: 'line',
       longData,
      encode: { x: 'month', y: 'value', color: 'type' },
      style: { lineWidth: 2 },
    },
  ],
});

chart.render();
```

## Options

```javascript
transform: [
  {
    type: 'diffY',
    groupBy: 'x',   // Group and align by the x channel; default is 'x'
  },
]
```

## Common Mistakes and Fixes

### Mistake: The data does not have two series--diffY needs at least two series to calculate a difference
```javascript
// ❌ Only one series; diffY has no comparison baseline, so the difference is 0
chart.options({
  type: 'area',
  data: singleSeriesData,
  encode: { x: 'date', y: 'value' },  // ❌ No series/color to distinguish two groups
  transform: [{ type: 'diffY' }],
});

// ✅ There must be two series (distinguished by color/series)
chart.options({
  type: 'area',
  data: twoSeriesData,
  encode: {
    x: 'date',
    y: 'value',
    color: 'type',   // ✅ Distinguish the two series
    series: 'type',
  },
  transform: [{ type: 'diffY' }],
});
```

### Mistake: Confusing diffY with stackY--stackY accumulates values, while diffY computes differences
```javascript
// stackY: accumulates y values from multiple series (suitable for stacked charts)
transform: [{ type: 'stackY' }]

// diffY: calculates the difference interval between two series (suitable for difference area charts)
transform: [{ type: 'diffY' }]
```