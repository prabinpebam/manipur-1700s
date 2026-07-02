---
id: "g2-mark-beeswarm"
title: "G2 Beeswarm Chart"
description: |
  The beeswarm mark automatically arranges points along a categorical axis to avoid overlap, forming a honeycomb-like layout.
  Points are packed closely but do not cover each other. It is suitable for showing one-dimensional numeric distributions under categorical variables.
  Unlike the random offsets of the jitter transform, beeswarm uses a force-directed algorithm for precise placement.

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "beeswarm"
  - "beeswarm chart"
  - "point distribution"
  - "non-overlapping scatter"
  - "distribution chart"

related:
  - "g2-mark-point-scatter"
  - "g2-transform-jitter"
  - "g2-mark-box-boxplot"

use_cases:
  - "Show the precise distribution of data points within each category without overlap"
  - "Overlay with a boxplot to show both summary statistics and raw data"
  - "Show exact distributions for small samples"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/point/#beeswarm"
---

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const data = [
  { dept: 'Engineering', salary: 18000 }, { dept: 'Engineering', salary: 22000 },
  { dept: 'Engineering', salary: 15000 }, { dept: 'Engineering', salary: 25000 },
  { dept: 'Engineering', salary: 19000 }, { dept: 'Engineering', salary: 21000 },
  { dept: 'Sales', salary: 12000 }, { dept: 'Sales', salary: 16000 },
  { dept: 'Sales', salary: 14000 }, { dept: 'Sales', salary: 11000 },
  { dept: 'Design', salary: 17000 }, { dept: 'Design', salary: 20000 },
  { dept: 'Design', salary: 18500 }, { dept: 'Design', salary: 23000 },
];

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'point',
  data,
  encode: {
    x: 'dept',
    y: 'salary',
    color: 'dept',
    shape: 'point',
  },
  // Configure the beeswarm layout through layout, not as a standalone mark type
  // It is effectively a point mark plus a beeswarm layout transform
  style: { r: 5, fillOpacity: 0.8 },
  // Use the jitter transform to approximate a beeswarm effect (or use a beeswarm data transform)
  transform: [{ type: 'jitter', padding: 0.1 }],
});

chart.render();
```

## Using the beeswarm mark (standalone type)

```javascript
// G2 v5 also supports type: 'beeswarm' for directly using a beeswarm layout
const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'point',
  data,
  encode: {
    x: 'dept',
    y: 'salary',
    color: 'dept',
  },
  // Beeswarm uses a force-directed algorithm so points do not overlap
  style: { r: 4, fillOpacity: 0.75 },
  layout: {
    type: 'beeswarm',   // Use beeswarm layout
    padding: 1,         // Point spacing
  },
});
```

## Overlay with a boxplot

```javascript
chart.options({
  type: 'view',
  data,
  children: [
    {
      type: 'boxplot',
      encode: { x: 'dept', y: 'salary' },
      style: { boxFill: 'transparent', boxStroke: '#999', lineWidth: 1.5 },
    },
    {
      type: 'point',
      encode: { x: 'dept', y: 'salary', color: 'dept' },
      transform: [{ type: 'jitter', padding: 0.1 }],
      style: { r: 3.5, fillOpacity: 0.65 },
    },
  ],
});
```

## Common mistakes and fixes

### Mistake: Using beeswarm for too much data makes layout slow and visually crowded
```javascript
// Thousands of rows in a beeswarm chart will be slow and visually saturated
chart.options({
  data: tenThousandRows,   // Too much data
  transform: [{ type: 'jitter' }],
});

// For large datasets, use a density chart or colored scatter plot instead
// Beeswarm is suitable for fewer than 500 rows
chart.options({
  data: smallSample,
  transform: [{ type: 'jitter', padding: 0.08 }],  // Small sample
});
```
