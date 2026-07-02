---
id: "g2-mark-interval-stacked"
title: "G2 Stacked Bar Chart"
description: |
  Create a stacked bar chart with the Interval Mark and the stackY transform.
  In Spec mode, add the stackY transform through the transform array.
  A stacked bar chart is used to show part-to-whole relationships and changes in the proportions of subcategories within totals.

library: "g2"
version: "5.x"
category: "marks"
subcategory: "interval"
tags:
  - "stacked bar chart"
  - "stacked bar"
  - "StackY"
  - "stacked"
  - "part-to-whole"
  - "multi-series"
  - "spec"

related:
  - "g2-mark-interval-basic"
  - "g2-mark-interval-grouped"
  - "g2-mark-interval-normalized"
  - "g2-transform-stacky"

use_cases:
  - "Show the composition of multiple subcategories at each time point"
  - "Compare the proportions of items within different categories"
  - "Visualize the relationship between totals and sub-items"

anti_patterns:
  - "When there are more than 5-7 subcategories, stacked charts become hard to read; consider a grouped bar chart"
  - "Not suitable for comparing trends of individual subcategories because baselines are hard to align"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/bar/stacked"
---

## Core concepts

Stacked bar chart = `type: 'interval'` + `transform: [{ type: 'stackY' }]`.
`stackY` stacks multiple values at the same x position into y0/y1 intervals,
so each subcategory's bar is stacked vertically in sequence.

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'interval',
  data: [
    { month: 'Jan', type: 'A', value: 100 },
    { month: 'Jan', type: 'B', value: 200 },
    { month: 'Jan', type: 'C', value: 150 },
    { month: 'Feb', type: 'A', value: 120 },
    { month: 'Feb', type: 'B', value: 180 },
    { month: 'Feb', type: 'C', value: 160 },
    { month: 'Mar', type: 'A', value: 90 },
    { month: 'Mar', type: 'B', value: 220 },
    { month: 'Mar', type: 'C', value: 130 },
  ],
  encode: {
    x: 'month',
    y: 'value',
    color: 'type',
  },
  transform: [{ type: 'stackY' }],   // Key: stacking transform
});

chart.render();
```

## Stacked bar chart with data labels

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  labels: [
    {
      text: 'value',
      position: 'inside',     // Labels inside the bars
      style: { fontSize: 11, fill: 'white' },
    },
  ],
});
```

## Stacked bar chart (horizontal)

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { transform: [{ type: 'transpose' }] },   // Transpose to a horizontal bar chart
});
```

## Control stacking order

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'stackY', orderBy: 'value' }],  // Stack sorted by value
});
```

## 100% stacked bar chart

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [
    { type: 'stackY' },
    { type: 'normalizeY' },  // Normalize to [0, 1], producing 100% stacking
  ],
  axis: {
    y: { labelFormatter: (v) => `${(v * 100).toFixed(0)}%` },
  },
});
```

## Common errors and fixes

### Error 1: Forgetting transform stackY
```javascript
// Error: multi-series data is not stacked automatically, so bars overlap at the same position.
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  // Missing transform!
});

// Correct: stackY must be declared explicitly.
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],   // Required!
});
```

### Error 2: Duplicate data rows for the same (x, color) combination
```javascript
// Error: two records appear for the same month and type, so stackY stacks them repeatedly.
const badData = [
  { month: 'Jan', type: 'A', value: 100 },
  { month: 'Jan', type: 'A', value: 50 },  // Duplicate!
];

// Correct: each (x, color) combination has exactly one record. Aggregate at the data layer if merging is needed.
```

### Error 3: Writing transform as an object instead of an array
```javascript
// Error: transform must be an array.
chart.options({ transform: { type: 'stackY' } });

// Correct: transform is an array and supports chaining multiple transforms.
chart.options({ transform: [{ type: 'stackY' }] });
```