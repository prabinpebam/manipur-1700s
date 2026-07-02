---
id: "g2-transform-groupx"
title: "G2 GroupX Grouped Aggregation Transform"
description: |
  groupX groups data by values in the x channel and aggregates the y channel (count, sum, mean, min, max, and so on).
  It is commonly used to compute statistics directly from raw row-level data without pre-aggregating the data.
  groupY, groupColor, and groupN are its variants; they group by the y channel, color channel, or a fixed count respectively.

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "groupX"
  - "grouping"
  - "aggregation"
  - "count"
  - "sum"
  - "mean"
  - "transform"
  - "statistics"

related:
  - "g2-transform-stacky"
  - "g2-transform-binx"
  - "g2-mark-interval-basic"

use_cases:
  - "Count records in each category from raw row-level data (frequency bar chart)"
  - "Aggregate detailed data into group means or sums"
  - "Visualize word frequency statistics"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform/group"
---

## Minimal Runnable Example (Count/Frequency Bar Chart)

```javascript
import { Chart } from '@antv/g2';

// Raw row-level data; no need to precompute frequencies
const rawData = [
  { dept: 'Engineering' }, { dept: 'Engineering' }, { dept: 'Engineering' },
  { dept: 'Sales' }, { dept: 'Sales' },
  { dept: 'Design' }, { dept: 'Design' }, { dept: 'Design' }, { dept: 'Design' },
  { dept: 'HR' },
];

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'interval',
  data: rawData,
  encode: {
    x: 'dept',  // Grouping field
    y: '★',     // Placeholder; the actual y value is calculated by groupX
    color: 'dept',
  },
  transform: [
    {
      type: 'groupX',
      y: 'count',    // Aggregation method for the y channel: count records in each group
    },
  ],
});

chart.render();
```

## Aggregation Methods Quick Reference

```javascript
// Count (how many records in each group)
transform: [{ type: 'groupX', y: 'count' }]

// Sum (total of the y field in each group)
transform: [{ type: 'groupX', y: 'sum' }]

// Mean (average of the y field in each group)
transform: [{ type: 'groupX', y: 'mean' }]

// Maximum / minimum
transform: [{ type: 'groupX', y: 'max' }]
transform: [{ type: 'groupX', y: 'min' }]

// Median
transform: [{ type: 'groupX', y: 'median' }]

// Custom aggregation function
transform: [{ type: 'groupX', y: (values) => values.reduce((a, b) => a + b, 0) / values.length }]
```

## Grouping by Color (groupColor)

```javascript
// Count men and women in each department
chart.options({
  type: 'interval',
  data: rawEmployeeData,
  encode: { x: 'dept', y: '★', color: 'gender' },
  transform: [
    { type: 'groupX', y: 'count' },   // First group and count by the x and color combination
    { type: 'dodgeX' },               // Then display groups side by side
  ],
});
```

## Mean Line Chart (Draw Directly from Detailed Data)

```javascript
chart.options({
  type: 'line',
  data: dailySalesData,
  encode: { x: 'month', y: 'dailySales' },
  transform: [
    { type: 'groupX', y: 'mean' },  // Calculate average daily sales for each month
  ],
  style: { lineWidth: 2 },
});
```

## KDE Grouping Notes in Density Charts

When using the `density` chart type with the `kde` transform, note that the `kde` transform itself does not depend on `groupX`; instead, it uses the `groupBy` parameter to specify grouping fields. For example:

```javascript
chart.options({
  type: 'density',
  data: {
    type: 'inline',
    value: irisData,
    transform: [{
      type: 'kde',
      field: 'y',
      groupBy: ['x', 'species'],  // Group by the x and species fields for KDE calculation
    }],
  },
  encode: {
    x: 'x',
    y: 'y',
    color: 'species',
    size: 'size',
    series: 'species',
  },
});
```

In this case, the `kde` transform automatically performs grouping and density calculation, so there is no need to add `groupX`.

## Common Mistakes and Fixes

### Mistake 1: Setting encode.y to an actual field name--the y channel is overwritten after groupX is applied
```javascript
// ❌ If you want groupX to calculate count, encode.y does not need to be an actual field
chart.options({
  encode: { x: 'dept', y: 'salary' },
  transform: [{ type: 'groupX', y: 'count' }],  // ⚠️ count overwrites salary
});
// Result: the y-axis shows count, not the sum of salary

// ✅ If you want count, the y field name does not matter (usually use '★' or any placeholder)
chart.options({
  encode: { x: 'dept', y: '★' },
  transform: [{ type: 'groupX', y: 'count' }],  // ✅ Count records in each group
});

// ✅ If you want sum(salary), encode.y must be 'salary'
chart.options({
  encode: { x: 'dept', y: 'salary' },
  transform: [{ type: 'groupX', y: 'sum' }],  // ✅ Calculate the sum of salary for each group
});
```

### Mistake 2: Confusing groupX with binX--groupX is for existing categories, while binX is for numeric binning
```javascript
// ❌ Using groupX for numeric x makes each unique value a group, resulting in too many groups
chart.options({
  encode: { x: 'age', y: '★' },
  transform: [{ type: 'groupX', y: 'count' }],  // ❌ age has dozens of unique values
});

// ✅ Numeric x should use binX (bin first, then count)
chart.options({
  encode: { x: 'age', y: '★' },
  transform: [{ type: 'binX', y: 'count', thresholds: 10 }],  // ✅ Split into 10 bins
});
```

### Mistake 3: Incorrectly combining groupX and kde in a density chart
```javascript
// ❌ Mistake example: mixing groupX and kde in a density chart
chart.options({
  type: 'density',
  data: {
    type: 'inline',
    value: irisData,
    transform: [
      { type: 'kde', field: 'y', groupBy: ['x'] },
      { type: 'groupX', y: 'mean' }  // ❌ kde already performs grouping and aggregation; groupX is not needed
    ]
  },
  encode: { x: 'x', y: 'y', color: 'x' }
});

// ✅ Correct approach: use only kde and specify grouping fields through groupBy
chart.options({
  type: 'density',
  data: {
    type: 'inline',
    value: irisData,
    transform: [
      { type: 'kde', field: 'y', groupBy: ['x'] }  // ✅ Use only the kde transform
    ]
  },
  encode: { x: 'x', y: 'y', color: 'x', size: 'size' }
});
```

### Mistake 4: Incorrectly configuring encode mapping fields in a density chart
```javascript
// ❌ Mistake example: not using the fields output by kde correctly
chart.options({
  type: 'density',
  data: {
    type: 'inline',
    value: rawData,
    transform: [{
      type: 'kde',
      field: 'y',
      groupBy: ['x']
    }]
  },
  encode: {
    x: 'x',
    y: 'y',        // ❌ Should use the y field output by kde (default is 'y')
    color: 'x',
    size: 'size'   // ❌ Should use the size field output by kde (default is 'size')
  }
});

// ✅ Correct approach: ensure fields used in encode match the kde output fields
chart.options({
  type: 'density',
  data: {
    type: 'inline',
    value: rawData,
    transform: [{
      type: 'kde',
      field: 'y',
      groupBy: ['x'],
      as: ['kde_y', 'kde_size']  // ✅ Custom output field names
    }]
  },
  encode: {
    x: 'x',
    y: 'kde_y',      // ✅ Use the custom y field name
    color: 'x',
    size: 'kde_size' // ✅ Use the custom size field name
  }
});
```