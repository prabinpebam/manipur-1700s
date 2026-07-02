---
id: "g2-mark-line-basic"
title: "G2 Basic Line Chart (Line Mark)"
description: |
  Create a line chart with Line Mark to show how data changes over time or ordered categories.
  This article uses Spec mode (chart.options({})) and supports common variants such as single-series, multi-series, and smooth curves.

library: "g2"
version: "5.x"
category: "marks"
subcategory: "line"
tags:
  - "line chart"
  - "trend"
  - "time series"
  - "Line"
  - "curve"
  - "multi-series"
  - "spec"

related:
  - "g2-mark-area-basic"
  - "g2-core-encode-channel"
  - "g2-scale-time"
  - "g2-interaction-tooltip"

use_cases:
  - "Show trends over time"
  - "Compare trends across multiple metrics or dimensions"
  - "Show changes in continuous numeric values"

anti_patterns:
  - "Line charts are not intuitive when there are few data points (< 5); use a bar chart instead"
  - "Line charts are not suitable for unordered data or unordered categories"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/line/basic"
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
  type: 'line',
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

## Time-series line chart

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 800, height: 400 });

chart.options({
  type: 'line',
  data: [
    { date: new Date('2024-01-01'), value: 100 },
    { date: new Date('2024-02-01'), value: 130 },
    { date: new Date('2024-03-01'), value: 110 },
    { date: new Date('2024-04-01'), value: 160 },
    { date: new Date('2024-05-01'), value: 145 },
  ],
  encode: {
    x: 'date',     // Date type automatically uses Time Scale
    y: 'value',
  },
  axis: {
    x: {
      tickCount: 5,
      labelFormatter: 'YYYY-MM',  // Date formatting
    },
  },
});

chart.render();
```

## Multi-series line chart

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 700, height: 400 });

chart.options({
  type: 'line',
  data: [
    { month: 'Jan', type: 'Product A', value: 33 },
    { month: 'Jan', type: 'Product B', value: 55 },
    { month: 'Feb', type: 'Product A', value: 78 },
    { month: 'Feb', type: 'Product B', value: 62 },
    { month: 'Mar', type: 'Product A', value: 56 },
    { month: 'Mar', type: 'Product B', value: 89 },
    { month: 'Apr', type: 'Product A', value: 91 },
    { month: 'Apr', type: 'Product B', value: 74 },
  ],
  encode: {
    x: 'month',
    y: 'value',
    color: 'type',   // The color channel automatically splits lines by type.
  },
});

chart.render();
```

## Smooth curve

```javascript
chart.options({
  type: 'line',
  data: [...],
  encode: {
    x: 'month',
    y: 'value',
    shape: 'smooth',    // 'line' | 'smooth' | 'hv' | 'vh' | 'hvh' | 'vhv'
  },
});
```

## Line + data points (layer composition)

```javascript
// Use the children array in Spec mode to overlay multiple marks.
chart.options({
  type: 'view',               // view container
   [...],
  children: [
    {
      type: 'line',
      encode: { x: 'month', y: 'value', color: 'type' },
    },
    {
      type: 'point',
      encode: {
        x: 'month',
        y: 'value',
        color: 'type',
        shape: 'circle',
      },
      style: { r: 4 },
    },
  ],
});
```

## Line + area fill (layer composition)

```javascript
chart.options({
  type: 'view',
  data: [...],
  children: [
    {
      type: 'area',
      encode: { x: 'month', y: 'value' },
      style: { fillOpacity: 0.2 },
    },
    {
      type: 'line',
      encode: { x: 'month', y: 'value' },
      style: { stroke: '#1890ff', lineWidth: 2 },
    },
  ],
});
```

## With tooltip and end labels

```javascript
chart.options({
  type: 'line',
  data: [...],
  encode: { x: 'month', y: 'value' },
  tooltip: {
    items: [{ field: 'value', name: 'Value' }],
  },
  labels: [
    {
      text: 'value',
      selector: 'last',    // Show the label only on the last point.
      style: { fontSize: 12, fill: '#1890ff' },
    },
  ],
});
```

## Wide table data + fold to long table

A wide table has multiple metric columns in each row. Use the `fold` data transform to convert it to a long table before drawing multi-series lines.

Warning: `fold` is a **data transform**. It must be placed in `data.transform`, not in the mark-level `transform`.

```javascript
const wideData = [
  { date: '2024-01', DAU: 12000, MAU: 45000 },
  { date: '2024-02', DAU: 13500, MAU: 47000 },
  { date: '2024-03', DAU: 11800, MAU: 44500 },
];

chart.options({
  type: 'line',
  data: {
    type: 'inline',
    value: wideData,
    transform: [
      {
        type: 'fold',
        fields: ['DAU', 'MAU'],   // Columns to transform
        key: 'metric',             // New column name that stores the original field name
        value: 'count',            // New column name that stores the original field value
      },
    ],
  },
  encode: {
    x: 'date',
    y: 'count',      // Use the value field name after fold.
    color: 'metric', // Use the key field name after fold.
  },
  labels: [
    { text: 'metric', selector: 'last', position: 'right' },
  ],
});
```

## Dual Y axes (series with different scales)

```javascript
chart.options({
  type: 'view',
  children: [
    {
      type: 'line',
      data: revenueData,
      encode: { x: 'date', y: 'revenue', color: () => 'Revenue (10k units)' },
      scale: { y: { key: 'revenue' } },   // Unique key -> independent y axis
    },
    {
      type: 'line',
      data: userCountData,
      encode: { x: 'date', y: 'count', color: () => 'User count' },
      scale: { y: { key: 'count' } },
      axis: { y: { position: 'right' } },  // Right-side y axis
    },
  ],
});
```

## Multi-series tooltip configuration

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value', color: 'series' },
  tooltip: {
    title: (d) => {
      const date = new Date(d.date);
      return `${date.getFullYear()}-${date.getMonth() + 1}`;
    },
    items: [
      { field: 'series', name: 'Series' },
      { field: 'value', name: 'Value', valueFormatter: (v) => v.toLocaleString() },
    ],
  },
  interaction: [{ type: 'tooltip' }],
});
```

## Spec field quick reference

| Field | Example value | Description |
|------|--------|------|
| `encode.x` | `'month'` | X-axis field |
| `encode.y` | `'value'` | Y-axis field |
| `encode.color` | `'type'` | Color/series differentiation |
| `encode.shape` | `'smooth'` | Line shape |
| `style.lineWidth` | `2` | Line width |
| `style.stroke` | `'#f00'` | Line color (fixed) |
| `labels` | `[{ text: 'value', selector: 'last' }]` | Data labels |
| `tooltip` | `{ items: [{ field: 'value' }] }` | Tooltip |

## Common errors and fixes

### Error 1: Multi-series data is missing the color channel
```javascript
// Error: multi-type data has no color channel, so all points are incorrectly connected into a single tangled line.
chart.options({
  type: 'line',
  data: multiSeriesData,
  encode: { x: 'month', y: 'value' },  // Missing color!
});

// Correct
chart.options({
  type: 'line',
  data: multiSeriesData,
  encode: { x: 'month', y: 'value', color: 'type' },
});
```

### Error 2: Time field is a string
```javascript
// Not recommended: string time axes may sort incorrectly.
const data = [{ date: '2024-03-01', value: 100 }];

// Correct: convert to a Date object, or explicitly configure the scale type.
const data = [{ date: new Date('2024-03-01'), value: 100 }];
// Or:
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
});
```

### Error 3: Multiple marks require view+children (see core constraint #3 for details)
```javascript
// chart.options({ type: 'line', ... }); chart.options({ type: 'point', ... }); -> only point takes effect.
// chart.options({ type: 'view', data, children: [{ type: 'line', ... }, { type: 'point', ... }] });
```