---
id: "g2-transform-symmetryy"
title: "G2 SymmetryY Symmetry Transform (Butterfly Chart / Population Pyramid)"
description: |
  symmetryY applies an offset to the y channel so that data is symmetric around the y=0 axis.
  Typical applications include population pyramids (two directions of bars shown symmetrically) and butterfly charts.
  It is usually combined with the transpose coordinate system to create horizontal symmetric bar charts.

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "symmetryY"
  - "symmetry"
  - "population pyramid"
  - "butterfly chart"
  - "population pyramid"
  - "transform"

related:
  - "g2-transform-stacky"
  - "g2-coord-transpose"
  - "g2-mark-interval-stacked"

use_cases:
  - "Population pyramid (symmetric display of male and female age distributions)"
  - "Butterfly chart for A/B comparison"
  - "Charts with positive and negative values symmetric around the center"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform/symmetry-y"
---

## Minimal Runnable Example (Population Pyramid)

```javascript
import { Chart } from '@antv/g2';

const data = [
  { age: '0-9',   gender: 'Male', value: 8500 },
  { age: '10-19', gender: 'Male', value: 9200 },
  { age: '20-29', gender: 'Male', value: 10300 },
  { age: '30-39', gender: 'Male', value: 9800 },
  { age: '40-49', gender: 'Male', value: 8900 },
  { age: '0-9',   gender: 'Female', value: 8100 },
  { age: '10-19', gender: 'Female', value: 8800 },
  { age: '20-29', gender: 'Female', value: 9900 },
  { age: '30-39', gender: 'Female', value: 9500 },
  { age: '40-49', gender: 'Female', value: 8700 },
];

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data,
  encode: {
    x: 'age',
    y: 'value',
    color: 'gender',
  },
  transform: [
    { type: 'stackY' },     // Stack first
    { type: 'symmetryY' },  // Then make symmetric (using y=0 as the center axis)
  ],
  coordinate: { transform: [{ type: 'transpose' }] },  // Transpose to horizontal bars
  axis: {
    y: {
      labelFormatter: (v) => Math.abs(v).toLocaleString(),  // Display negative values as positive numbers
    },
  },
});

chart.render();
```

## Configuration Options

```javascript
transform: [
  {
    type: 'symmetryY',
    groupBy: 'x',   // Channel used for grouping; default 'x'
  },
]
```

## Butterfly Chart (Two Categories Symmetric Left and Right)

```javascript
chart.options({
  type: 'interval',
  data: abTestData,
  encode: { x: 'metric', y: 'value', color: 'group' },
  transform: [
    { type: 'stackY' },
    { type: 'symmetryY' },
  ],
  coordinate: { transform: [{ type: 'transpose' }] },
  style: { fillOpacity: 0.85 },
});
```

## Common Errors and Fixes

### Error: Forgetting stackY Before symmetryY, So Grouped Data Is Not Symmetric
```javascript
// ❌ Without stackY, bars for the two gender values overlap on the same side, so symmetry fails
transform: [
  { type: 'symmetryY' },  // ❌ Missing the preceding stackY
]

// ✅ Must apply stackY before symmetryY
transform: [
  { type: 'stackY' },     // ✅ Stack first (grouped data is stacked together)
  { type: 'symmetryY' },  // ✅ Then make symmetric (offset the two groups to the two sides)
]
```
