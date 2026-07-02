---
id: "g2-transform-group"
title: "G2 Group / GroupX / GroupY Grouped Aggregation Transforms"
description: |
  Group, GroupX, and GroupY are Transforms for grouped aggregation in G2 v5.
  Group groups by both the x and y channels; GroupX groups by the x channel; GroupY groups by the y channel.
  They support aggregation functions such as mean, sum, count, min, max, median, first, and last.
  They are commonly used in scenarios such as histograms, statistical bar charts, and aggregated line charts.

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "group"
  - "groupX"
  - "groupY"
  - "grouped aggregation"
  - "transform"
  - "statistics"
  - "mean"
  - "sum"

related:
  - "g2-transform-bin"
  - "g2-transform-stacky"
  - "g2-mark-interval-basic"

use_cases:
  - "Calculate averages by category (mean bar chart)"
  - "Group by X and sum values to show totals"
  - "Aggregate detailed data into statistical summaries"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform/group-x"
---

## Core Concepts

| Transform | Grouping dimension | Typical scenario |
|-----------|----------|----------|
| `groupX` | x channel (+ color/series) | Compute mean/sum within the same category |
| `groupY` | y channel | Aggregate by Y groups |
| `group` | x + y channels | Two-dimensional grouped aggregation |

Aggregation functions are specified with forms such as `y: 'mean'`. Supported functions include:
`mean` (mean), `sum` (sum), `count` (count), `min`, `max`, `median`, `first`, and `last`

## Basic GroupX Usage (Mean by Category)

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data: [
    { category: 'A', value: 10 },
    { category: 'A', value: 20 },
    { category: 'A', value: 30 },
    { category: 'B', value: 40 },
    { category: 'B', value: 50 },
  ],
  encode: { x: 'category', y: 'value' },
  transform: [
    {
      type: 'groupX',
      y: 'mean',   // Group by x and take the mean of y
    },
  ],
});

chart.render();
// Result: A shows mean 20, and B shows mean 45
```

## GroupX Aggregation Functions

```javascript
chart.options({
  type: 'interval',
  data: rawData,
  encode: { x: 'category', y: 'value' },
  transform: [
    {
      type: 'groupX',
      y: 'mean',      // Mean
      // y: 'sum',    // Sum
      // y: 'count',  // Count (ignore y channel values and count records)
      // y: 'max',    // Maximum
      // y: 'min',    // Minimum
      // y: 'median', // Median
    },
  ],
});
```

## Statistical Count (Frequency Distribution)

```javascript
// Count how many times each category appears
chart.options({
  type: 'interval',
  data: rawData,
  encode: { x: 'category' },    // No y channel required
  transform: [
    { type: 'groupX', y: 'count' },  // y is generated automatically as the count value
  ],
});
```

## GroupY Usage (Group by Y)

```javascript
// Group by y horizontally and compute the mean (commonly used for horizontal bar charts)
chart.options({
  type: 'interval',
  data: rawData,
  encode: { y: 'category', x: 'value' },
  transform: [
    { type: 'groupY', x: 'mean' },  // Group by y and take the mean of x
  ],
  coordinate: { transform: [{ type: 'transpose' }] },
});
```

## Multi-Field Aggregation

```javascript
// Aggregate multiple fields at the same time
chart.options({
  type: 'point',
  data: rawData,
  encode: { x: 'date', y: 'value', size: 'amount' },
  transform: [
    {
      type: 'groupX',
      y: 'mean',       // Take the mean for y
      size: 'sum',     // Sum the size channel
    },
  ],
});
```

## Using Group in Cell Charts

For `cell` charts, data usually needs to be grouped and aggregated before rendering. For example, group by UTC day and UTC month of the date, and take the maximum value of the highest temperature:

```javascript
const chart = new Chart({
  container: 'container',
});

chart.options({
  type: 'cell',
  height: 300,
  data: {
    type: 'inline',
    value: [
      { date: '2012-01-01', temp_max: 12.8 },
      { date: '2012-01-02', temp_max: 10.6 },
      // More data...
    ]
  },
  encode: {
    x: (d) => new Date(d.date).getUTCDate(),
    y: (d) => new Date(d.date).getUTCMonth(),
    color: 'temp_max',
  },
  transform: [{ type: 'group', color: 'max' }],
  scale: { color: { type: 'sequential', palette: 'gnBu' } },
  style: { inset: 0.5 },
});

chart.render();
```

## Common Mistakes and Fixes

### Mistake 1: Writing transform as an object instead of an array
```javascript
// ❌ Mistake
chart.options({ transform: { type: 'groupX', y: 'mean' } });

// ✅ Correct
chart.options({ transform: [{ type: 'groupX', y: 'mean' }] });
```

### Mistake 2: Passing y encode while using count aggregation
```javascript
// ❌ The y channel is not needed for count aggregation
chart.options({
  encode: { x: 'category', y: 'someField' },
  transform: [{ type: 'groupX', y: 'count' }],  // y: 'count' ignores encode.y
});

// ✅ Count aggregation only needs the x channel
chart.options({
  encode: { x: 'category' },    // y is not needed
  transform: [{ type: 'groupX', y: 'count' }],
});
```

### Mistake 3: Not using Group aggregation correctly in a Cell chart
```javascript
// ❌ Mistake: duplicate x/y combinations are not aggregated, causing abnormal rendering
chart.options({
  type: 'cell',
  data: weatherData,
  encode: {
    x: (d) => new Date(d.date).getUTCDate(),
    y: (d) => new Date(d.date).getUTCMonth(),
    color: 'temp_max'
  },
  transform: []  // Missing the required group aggregation
});

// ✅ Correct: use group and specify the color aggregation method
chart.options({
  type: 'cell',
  data: weatherData,
  encode: {
    x: (d) => new Date(d.date).getUTCDate(),
    y: (d) => new Date(d.date).getUTCMonth(),
    color: 'temp_max'
  },
  transform: [{ type: 'group', color: 'max' }]  // The color channel must be aggregated
});
```