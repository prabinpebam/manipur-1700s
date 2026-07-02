---
id: "g2-transform-flexx"
title: "G2 FlexX Flexible Width Transform (Mosaic Chart / Variable-Width Bars)"
description: |
  flexX dynamically adjusts the flex attribute of the x-axis scale according to data values, so each bar's width is proportional to a value.
  It is commonly used for mosaic charts (Marimekko charts): bar width represents one dimension and bar height represents another.
  Use field to specify the field that controls width, and reducer to specify the aggregation method.

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "flexX"
  - "variable-width bars"
  - "mosaic chart"
  - "Marimekko"
  - "flexible width"
  - "transform"

related:
  - "g2-transform-stacky"
  - "g2-mark-interval-stacked"

use_cases:
  - "Create mosaic charts (two-dimensional proportions: bar width x bar height)"
  - "Create variable-width bar charts (bar width represents sample size or weight)"
  - "Create market share charts (width = market size, height = share)"

difficulty: "advanced"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform/flex-x"
---

## Minimal Runnable Example (Mosaic Chart)

```javascript
import { Chart } from '@antv/g2';

// Mosaic chart: x category, y subcategory proportion, and value controls bar width (market size)
const data = [
  { region: 'North China', type: 'Online', revenue: 300, share: 0.6 },
  { region: 'North China', type: 'Offline', revenue: 300, share: 0.4 },
  { region: 'East China', type: 'Online', revenue: 500, share: 0.7 },
  { region: 'East China', type: 'Offline', revenue: 500, share: 0.3 },
  { region: 'South China', type: 'Online', revenue: 200, share: 0.5 },
  { region: 'South China', type: 'Offline', revenue: 200, share: 0.5 },
];

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'interval',
  data,
  encode: {
    x: 'region',
    y: 'share',
    color: 'type',
  },
  transform: [
    {
      type: 'flexX',
      field: 'revenue',    // Field that controls bar width
      reducer: 'sum',      // Aggregation method (the same x category may have multiple rows, so sum is needed)
    },
    { type: 'stackY' },   // Then stack in the y direction (percentage)
  ],
  axis: {
    y: { labelFormatter: (v) => `${(v * 100).toFixed(0)}%` },
  },
});

chart.render();
```

## Options

```javascript
transform: [
  {
    type: 'flexX',
    field: 'sampleSize',  // Field name that controls width (weight for each x category)
    channel: 'y',         // Which channel's values are used to compute flexibility (default is 'y')
    reducer: 'sum',       // Aggregation method for field values within the same x category ('sum' is the most common)
  },
]
```

## Common Mistakes and Fixes

### Mistake: Incorrect order of flexX and stackY--use flexX before stackY
```javascript
// ❌ Mistake: flexX should run before stackY
transform: [
  { type: 'stackY' },   // ❌ stackY runs first, then flexX adjusts width, which breaks the proportional relationship
  { type: 'flexX', field: 'revenue' },
]

// ✅ Correct order: flexX first (set flexible width), then stackY (stack height)
transform: [
  { type: 'flexX', field: 'revenue', reducer: 'sum' },  // ✅ Set flexible width first
  { type: 'stackY' },                                     // ✅ Then stack
]
```

### Mistake: Not setting reducer--width calculation is inconsistent when the same x has multiple rows
```javascript
// ❌ reducer is not set. The same region has multiple rows (online/offline), so flexX does not know how to aggregate width
transform: [{ type: 'flexX', field: 'revenue' }]  // ❌ Missing reducer

// ✅ Set reducer: 'sum' to sum field values for the same x
transform: [{ type: 'flexX', field: 'revenue', reducer: 'sum' }]  // ✅
```