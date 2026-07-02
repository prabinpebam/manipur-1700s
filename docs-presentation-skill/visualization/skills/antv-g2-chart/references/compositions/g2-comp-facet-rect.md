---
id: "g2-comp-facet-rect"
title: "G2 Rectangular Faceting (facetRect)"
description: |
  facetRect splits data by categorical fields and draws an independent subchart for each category in a grid layout.
  It is suitable for comparing data distributions and trends across groups. Use type: 'facetRect' with encode.x and encode.y to specify the faceting dimensions.

library: "g2"
version: "5.x"
category: "compositions"
tags:
  - "facetRect"
  - "faceting"
  - "facet"
  - "small multiples"
  - "trellis"
  - "grid layout"
  - "spec"

related:
  - "g2-core-view-composition"
  - "g2-mark-interval-basic"
  - "g2-mark-point-scatter"

use_cases:
  - "Compare data distributions across categories"
  - "Compare multidimensional time-series data"
  - "Facet charts by region, product, or department"

difficulty: "intermediate"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/composition/facet-rect"
---

## Basic Concepts

```
chart.options({
  type: 'facetRect',
  encode: {
    x: 'facetingcolumn field',      // Split data into multiple columns by this field.
    y: 'facetingrow field',         // Split data into multiple rows by this optional field.
  },
  children: [
    { type: 'subplot Mark', ... },  // Shared subplot configuration; data is automatically filtered.
  ],
});
```

**Key rules**:
- `encode.x` -> split into columns by the unique values of this field.
- `encode.y` -> split into rows by the unique values of this field.
- Marks in `children` automatically receive the filtered data.

## One-Dimensional Column Faceting (Split into Columns by Category)

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 800,
  height: 300,
});

const data = [
  { month: 'Jan', value: 33, region: 'East China' },
  { month: 'Feb', value: 78, region: 'East China' },
  { month: 'Mar', value: 56, region: 'East China' },
  { month: 'Jan', value: 45, region: 'South China' },
  { month: 'Feb', value: 62, region: 'South China' },
  { month: 'Mar', value: 71, region: 'South China' },
  { month: 'Jan', value: 28, region: 'North China' },
  { month: 'Feb', value: 39, region: 'North China' },
  { month: 'Mar', value: 53, region: 'North China' },
];

chart.options({
  type: 'facetRect',
  data,
  encode: { x: 'region' },     // Facet by region into three columns.
  children: [
    {
      type: 'interval',
      encode: { x: 'month', y: 'value' },
      style: { fill: '#1890ff' },
    },
  ],
});

chart.render();
```

## Two-Dimensional Faceting (Row + Column)

```javascript
const data = [
  { quarter: 'Q1', value: 100, region: 'East China', type: 'Online' },
  { quarter: 'Q2', value: 130, region: 'East China', type: 'Online' },
  { quarter: 'Q1', value: 80,  region: 'South China', type: 'Online' },
  { quarter: 'Q2', value: 95,  region: 'South China', type: 'Online' },
  { quarter: 'Q1', value: 60,  region: 'East China', type: 'Offline' },
  { quarter: 'Q2', value: 85,  region: 'East China', type: 'Offline' },
  { quarter: 'Q1', value: 40,  region: 'South China', type: 'Offline' },
  { quarter: 'Q2', value: 55,  region: 'South China', type: 'Offline' },
];

chart.options({
  type: 'facetRect',
  data,
  encode: {
    x: 'region',   // Columns: East China and South China.
    y: 'type',     // Rows: Online and Offline.
  },
  children: [
    {
      type: 'interval',
      encode: { x: 'quarter', y: 'value' },
    },
  ],
});
```

## Faceted Line Chart (Multi-Series Trend Comparison)

```javascript
chart.options({
  type: 'facetRect',
  data,
  encode: { x: 'product' },          // Facet by product.
  children: [
    {
      type: 'view',
      children: [
        {
          type: 'area',
          encode: { x: 'month', y: 'sales' },
          style: { fill: '#1890ff', fillOpacity: 0.15 },
        },
        {
          type: 'line',
          encode: { x: 'month', y: 'sales' },
          style: { stroke: '#1890ff', lineWidth: 2 },
        },
      ],
    },
  ],
});
```

## Configure Facet Title Styles

```javascript
chart.options({
  type: 'facetRect',
  data,
  encode: { x: 'region' },
  children: [
    {
      type: 'interval',
      encode: { x: 'month', y: 'value' },
    },
  ],
  // Facet title configuration through the frame field.
  frame: false,                        // Whether to show the border.
  // Configure the title through the facetRect title option.
  title: {
    position: 'top',                   // Title at the top.
    style: { fontSize: 13, fill: '#333', fontWeight: 'bold' },
  },
});
```

## Shared Axes (shareData)

```javascript
chart.options({
  type: 'facetRect',
  data,
  encode: { x: 'category' },
  shareData: true,          // Share the data range so axes use consistent ticks.
  children: [
    {
      type: 'point',
      encode: { x: 'x', y: 'y', color: 'category' },
    },
  ],
});
```

## Common Errors and Fixes

### Error: Specifying `data` inside the children of facetRect
```javascript
// Error: Do not specify data again inside the child mark, or faceting filters will not take effect.
chart.options({
  type: 'facetRect',
  data: allData,
  encode: { x: 'region' },
  children: [
    {
      type: 'interval',
      data: allData,        // This causes every facet to show all data.
      encode: { x: 'month', y: 'value' },
    },
  ],
});

// Correct: Do not specify data on the child mark; it automatically receives the faceted data.
chart.options({
  type: 'facetRect',
  data: allData,
  encode: { x: 'region' },
  children: [
    {
      type: 'interval',
      encode: { x: 'month', y: 'value' },   // Inherit data and let facetRect filter it.
    },
  ],
});
```

### Error: The encode field does not match the data field name
```javascript
// Error: The faceting field specified by encode.x does not exist in the data.
chart.options({
  type: 'facetRect',
  data: [{ month: 'Jan', value: 33, area: 'East China' }],
  encode: { x: 'region' },   // The data contains 'area', not 'region'.
});

// Correct: Keep field names consistent with the data.
chart.options({
  type: 'facetRect',
  data,
  encode: { x: 'area' },
});
```
