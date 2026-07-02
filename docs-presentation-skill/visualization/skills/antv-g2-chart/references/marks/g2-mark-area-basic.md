---
id: "g2-mark-area-basic"
title: "G2 Basic Area Chart (Area Mark)"
description: |
  Use the Area Mark to create an area chart, filling the region below a line chart
  to emphasize data magnitude and trends. This article uses Spec mode and covers single-series charts, gradient fills, and related usage.

library: "g2"
version: "5.x"
category: "marks"
subcategory: "area"
tags:
  - "area chart"
  - "Area"
  - "filled area chart"
  - "trend"
  - "magnitude"
  - "fill"
  - "spec"

related:
  - "g2-mark-line-basic"
  - "g2-mark-area-stacked"
  - "g2-core-encode-channel"

use_cases:
  - "Show how values change over time while emphasizing magnitude"
  - "Use as a background fill when overlaying a line"
  - "Compare total distribution across multiple series"

anti_patterns:
  - "In multi-series area charts without stacking, series obscure each other; use a stacked area chart or line chart instead"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/area/basic"
---

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'area',
  data: [
    { month: 'Jan', value: 33 },
    { month: 'Feb', value: 78 },
    { month: 'Mar', value: 56 },
    { month: 'Apr', value: 91 },
    { month: 'May', value: 67 },
    { month: 'Jun', value: 45 },
  ],
  encode: { x: 'month', y: 'value' },
});

chart.render();
```

## Gradient-filled area chart

```javascript
chart.options({
  type: 'area',
  data,
  encode: { x: 'month', y: 'value' },
  style: {
    fill: 'linear-gradient(180deg, #1890ff 0%, rgba(24,144,255,0.1) 100%)',
    fillOpacity: 0.8,
  },
});
```

## Area chart + line (overlay)

```javascript
// The area provides background magnitude; the line provides the precise trend
chart.options({
  type: 'view',
  data,
  children: [
    {
      type: 'area',
      encode: { x: 'month', y: 'value' },
      style: { fillOpacity: 0.2, fill: '#1890ff' },
    },
    {
      type: 'line',
      encode: { x: 'month', y: 'value' },
      style: { stroke: '#1890ff', lineWidth: 2 },
    },
    {
      type: 'point',
      encode: { x: 'month', y: 'value', shape: 'circle' },
      style: { fill: '#1890ff', r: 4 },
    },
  ],
});
```

## Smooth curve area chart

```javascript
chart.options({
  type: 'area',
  data,
  encode: {
    x: 'month',
    y: 'value',
    shape: 'smooth',    // Smooth interpolation
  },
  style: { fillOpacity: 0.6 },
});
```

## Time-series area chart

```javascript
chart.options({
  type: 'area',
  data: [
    { date: new Date('2024-01'), value: 100 },
    { date: new Date('2024-02'), value: 130 },
    { date: new Date('2024-03'), value: 90  },
    { date: new Date('2024-04'), value: 160 },
    { date: new Date('2024-05'), value: 145 },
  ],
  encode: { x: 'date', y: 'value' },
  axis: {
    x: { labelFormatter: 'YYYY-MM' },
  },
});
```

## Common mistakes and fixes

### Mistake 1: Using stroke + lineWidth on an area mark for an outline

```javascript
// Error: stroke + lineWidth outlines the entire filled region (bottom and both sides),
// rather than only the top edge line
chart.options({
  type: 'area',
  data,
  encode: { x: 'date', y: 'value' },
  style: {
    fill: '#FF5924',
    fillOpacity: 0.4,
    stroke: '#FF5924',      // Error: stroke outlines the entire region
    lineWidth: 2,            // Error
  },
});

// Correct: use view + children to overlay area (fill) + line (top edge line)
chart.options({
  type: 'view',
  data,
  children: [
    {
      type: 'area',
      encode: { x: 'date', y: 'value' },
      style: { fill: '#FF5924', fillOpacity: 0.4 },
    },
    {
      type: 'line',
      encode: { x: 'date', y: 'value' },
      style: { stroke: '#FF5924', lineWidth: 2 },
    },
  ],
});
```

### Mistake 2: Multi-series area charts without stackY obscure each other
```javascript
// Problem: multiple area series overlap, and later series obscure earlier ones
chart.options({
  type: 'area',
  data: multiSeriesData,
  encode: { x: 'month', y: 'value', color: 'type' },
  // Without stackY, each series starts stacking from y=0 and covers the others
});

// Solution 1: stacked area chart (see g2-mark-area-stacked)
chart.options({
  type: 'area',
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
});

// Solution 2: use a line chart instead to compare multiple series
chart.options({
  type: 'line',
  encode: { x: 'month', y: 'value', color: 'type' },
});
```
