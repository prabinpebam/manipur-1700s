---
id: "g2-mark-box-boxplot"
title: "G2 Boxplot (Box Mark)"
description: |
  Use the Box Mark to create a boxplot (also called a box-and-whisker plot) that shows the quantile distribution of data:
  minimum, Q1 (25th percentile), median, Q3 (75th percentile), maximum, and outliers.
  This article uses Spec mode.

library: "g2"
version: "5.x"
category: "marks"
subcategory: "box"
tags:
  - "boxplot"
  - "box-and-whisker plot"
  - "Box"
  - "boxplot chart"
  - "distribution"
  - "quantile"
  - "outlier"
  - "spec"

related:
  - "g2-mark-point-scatter"
  - "g2-core-encode-channel"

use_cases:
  - "Show the distribution shape and dispersion of numeric data"
  - "Compare distribution differences across multiple categories"
  - "Identify outliers"

anti_patterns:
  - "A boxplot is not statistically meaningful when the dataset is very small (< 5 points)"
  - "When you need to show the distribution of individual data points, use a violin plot or scatter plot instead"

difficulty: "intermediate"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/statistics/boxplot"
---

## Core concepts

The Box Mark requires 5 numeric channels:
- `y`: median (Q2)
- `y1`: Q1 (25th percentile)
- `y2`: Q3 (75th percentile)
- `y3`: lower whisker (minimum non-outlier)
- `y4`: upper whisker (maximum non-outlier)

**Data format**: Quantiles must be precomputed before passing the data in, or raw data can be used with the `boxplot` transform for automatic calculation.

## Automatically calculate with the boxplot transform (recommended)

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

// Raw data, with multiple observations per category
const rawData = [
  { category: 'A', value: 10 },
  { category: 'A', value: 25 },
  { category: 'A', value: 30 },
  { category: 'A', value: 45 },
  { category: 'A', value: 50 },
  { category: 'A', value: 55 },
  { category: 'A', value: 80 },   // Outlier
  { category: 'B', value: 20 },
  { category: 'B', value: 35 },
  { category: 'B', value: 40 },
  { category: 'B', value: 48 },
  { category: 'B', value: 52 },
  { category: 'B', value: 65 },
];

chart.options({
  type: 'boxplot',          // boxplot is a shorthand combination of box mark + boxplot transform
  data: rawData,
  encode: {
    x: 'category',
    y: 'value',
  },
  style: {
    fill: '#1890ff',
    fillOpacity: 0.3,
    stroke: '#1890ff',
  },
});

chart.render();
```

## Precomputed quantile data

```javascript
// Data already contains quantile fields
chart.options({
  type: 'box',
  data: [
    { category: 'A', min: 10, q1: 25, median: 45, q3: 55, max: 75 },
    { category: 'B', min: 20, q1: 35, median: 48, q3: 58, max: 80 },
    { category: 'C', min: 5,  q1: 20, median: 35, q3: 50, max: 65 },
  ],
  encode: {
    x: 'category',
    y: 'median',     // Median
    y1: 'q1',        // Lower quartile
    y2: 'q3',        // Upper quartile
    y3: 'min',       // Lower whisker
    y4: 'max',       // Upper whisker
  },
  style: {
    fill: '#1890ff',
    fillOpacity: 0.3,
    stroke: '#1890ff',
    lineWidth: 1.5,
  },
});
```

## Boxplot + scatter (show raw data points)

```javascript
chart.options({
  type: 'view',
  data: rawData,
  children: [
    {
      type: 'boxplot',
      encode: { x: 'category', y: 'value' },
      style: { fill: '#1890ff', fillOpacity: 0.2, stroke: '#1890ff' },
    },
    {
      // Overlay raw data points
      type: 'point',
      encode: { x: 'category', y: 'value' },
      transform: [{ type: 'jitter' }],   // jitter avoids point overlap
      style: { fill: '#1890ff', fillOpacity: 0.5, r: 3 },
    },
  ],
});
```

## Common mistakes and fixes

### Mistake: box mark is missing y1/y2/y3/y4 channels
```javascript
// Error: box mark requires 5 y channels; missing channels cause abnormal rendering
chart.options({
  type: 'box',
  encode: { x: 'category', y: 'median' },  // Missing y1-y4!
});

// Correct: use boxplot (automatic calculation) or provide all channels
chart.options({ type: 'boxplot', encode: { x: 'category', y: 'value' } });
```
