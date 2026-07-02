---
id: "g2-mark-line-multi"
title: "G2 Multi-Series Line Chart"
description: |
  Create a multi-series line chart by encoding a categorical field with the color channel, where each line represents one category.
  G2 automatically generates an independent line for each color value.
  This is commonly used for trend comparisons and for showing how multiple metrics change over time.

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "line chart"
  - "multi-series"
  - "line"
  - "time series"
  - "trend comparison"
  - "multiple lines"

related:
  - "g2-mark-line-basic"
  - "g2-mark-area-stacked"
  - "g2-transform-select"

use_cases:
  - "Compare sales trends across multiple products"
  - "Show temperature changes over time across multiple regions"
  - "Compare multiple KPI lines"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/line/"
---

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const data = [
  { month: 'Jan', city: 'Beijing', temp: -3 },
  { month: 'Feb', city: 'Beijing', temp: 0 },
  { month: 'Mar', city: 'Beijing', temp: 9 },
  { month: 'Apr', city: 'Beijing', temp: 18 },
  { month: 'Jan', city: 'Shanghai', temp: 5 },
  { month: 'Feb', city: 'Shanghai', temp: 7 },
  { month: 'Mar', city: 'Shanghai', temp: 13 },
  { month: 'Apr', city: 'Shanghai', temp: 20 },
  { month: 'Jan', city: 'Guangzhou', temp: 15 },
  { month: 'Feb', city: 'Guangzhou', temp: 16 },
  { month: 'Mar', city: 'Guangzhou', temp: 21 },
  { month: 'Apr', city: 'Guangzhou', temp: 26 },
];

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'line',
  data,
  encode: {
    x: 'month',
    y: 'temp',
    color: 'city',   // Key: color by city, automatically generating multiple lines.
  },
  style: { lineWidth: 2 },
  legend: { color: { position: 'top' } },
});

chart.render();
```

## Line + scatter combination (emphasize data points)

```javascript
chart.options({
  type: 'view',
  data,
  children: [
    {
      type: 'line',
      encode: { x: 'month', y: 'value', color: 'city' },
      style: { lineWidth: 2 },
    },
    {
      type: 'point',
      encode: { x: 'month', y: 'value', color: 'city', shape: 'circle' },
      style: { r: 4, lineWidth: 1.5, fill: '#fff' },
    },
  ],
});
```

## Line + end labels

```javascript
chart.options({
  type: 'view',
  children: [
    {
      type: 'line',
       data,
      encode: { x: 'month', y: 'value', color: 'city' },
    },
    {
      type: 'text',
       data,
      encode: {
        x: 'month',
        y: 'value',
        color: 'city',
        text: 'city',
      },
      transform: [{ type: 'selectX', selector: 'last' }],  // Select only the end of each line.
      style: { textAnchor: 'start', dx: 6, fontSize: 12 },
    },
  ],
});
```

## Smooth curve

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  style: {
    lineWidth: 2,
    shape: 'smooth',   // Smooth curve instead of a polyline
  },
});
```

## Common errors and fixes

### Error: Multi-series data uses wide-table format; use long-table format instead
```javascript
// Error: wide-table format. G2 cannot automatically color by series.
const wrongData = [
  { month: 'Jan', Beijing: -3, Shanghai: 5, Guangzhou: 15 },
  { month: 'Feb', Beijing: 0,  Shanghai: 7, Guangzhou: 16 },
];

// Correct: long-table format, where each record is one data point for one series.
const correctData = [
  { month: 'Jan', city: 'Beijing', value: -3 },
  { month: 'Jan', city: 'Shanghai', value: 5 },
  // ...
];
chart.options({
  encode: { x: 'month', y: 'value', color: 'city' },  // Bind color to a categorical field.
});
```