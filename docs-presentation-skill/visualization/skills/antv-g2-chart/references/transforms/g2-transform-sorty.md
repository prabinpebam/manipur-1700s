---
id: "g2-transform-sorty"
title: "G2 SortY Y-Value Sorting Transform"
description: |
  sortY sorts data records by y value within each x group. It is commonly used in stacked charts to control the stacking order of categories,
  ensuring that larger values appear at the bottom or top. sortX sorts global data by x-channel values,
  while sortColor sorts by color-channel values.

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "sortY"
  - "sortX"
  - "sorting"
  - "stacking order"
  - "transform"

related:
  - "g2-transform-sortx"
  - "g2-transform-stacky"
  - "g2-mark-interval-stacked"

use_cases:
  - "Control the stacking order of categories in a stacked bar chart (larger values at the bottom)"
  - "Ensure a visually more stable stacked layout"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform/sort"
---

## Minimal Runnable Example (Sorted Stacked Bar Chart)

```javascript
import { Chart } from '@antv/g2';

const data = [
  { month: 'Jan', type: 'A', value: 100 },
  { month: 'Jan', type: 'B', value: 200 },
  { month: 'Jan', type: 'C', value: 50 },
  { month: 'Feb', type: 'A', value: 120 },
  { month: 'Feb', type: 'B', value: 80 },
  { month: 'Feb', type: 'C', value: 180 },
];

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [
    { type: 'sortY', reverse: false },  // Sort by y value in ascending order within each x group
    { type: 'stackY' },                 // Then stack (larger values at the top)
  ],
});

chart.render();
```

## sortX (Global Sorting by x Value)

```javascript
// Sort a bar chart by value in descending order (largest value at the top)
chart.options({
  type: 'interval',
  data: rankingData,
  encode: { x: 'name', y: 'value' },
  transform: [
    { type: 'sortX', by: 'y', reverse: true },  // Sort by y value in descending order
  ],
  coordinate: { transform: [{ type: 'transpose' }] },
});
```

## Configuration Options

```javascript
// sortY: sort within each x group
transform: [
  {
    type: 'sortY',
    reverse: false,   // false = ascending (small values first), true = descending (large values first), default false
    by: 'y',          // Channel used for sorting; default 'y'
  },
]

// sortX: globally sort by x-channel values
transform: [
  {
    type: 'sortX',
    by: 'y',          // Sorting basis: 'x' (by x value) or 'y' (by y value)
    reverse: true,    // true = descending; default false
  },
]
```

## Common Errors and Fixes

### Error: sortY Runs After stackY, So y Values Have Changed and the Sorting Basis Is Wrong
```javascript
// ❌ Wrong order: y values after stackY are accumulated values, so sortY sorts by accumulated values
transform: [
  { type: 'stackY' },  // ❌ Stack first
  { type: 'sortY' },   // ❌ Sort afterward, when y is already an accumulated value
]

// ✅ Correct: sort first, then stack
transform: [
  { type: 'sortY' },   // ✅ Sort by the original y values first
  { type: 'stackY' },  // ✅ Then stack (stacking order follows the sorted result)
]
```
