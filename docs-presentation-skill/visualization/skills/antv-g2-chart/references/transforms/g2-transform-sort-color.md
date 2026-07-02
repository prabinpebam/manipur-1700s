---
id: "g2-transform-sort-color"
title: "G2 SortColor Color-Group Sorting Transform"
description: |
  sortColor is a sorting Transform in G2 v5 that sorts the scale domain of the color channel.
  Similar to sortX (which sorts the x axis), it sorts the category order of the color channel.
  It is commonly used for legend sorting and adjusting layer order in stacked charts.

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "sortColor"
  - "color sorting"
  - "legend order"
  - "transform"
  - "sort"
  - "color"

related:
  - "g2-transform-sortx"
  - "g2-transform-sorty"
  - "g2-mark-interval-stacked"

use_cases:
  - "Sort legend order by numeric value"
  - "Adjust color layer order in stacked column charts"
  - "Control color assignment order for line chart series"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform/sort-color"
---

## Core concepts

`sortColor` recalculates the domain order of the color scale by computing aggregate values for each color group (the mean of the y channel by default). It affects:
- Legend display order
- Layer stacking order in stacked charts
- Color assignment order

## Basic usage

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data: [
    { month: 'Jan', type: 'A', value: 50 },
    { month: 'Jan', type: 'B', value: 80 },
    { month: 'Jan', type: 'C', value: 30 },
    { month: 'Feb', type: 'A', value: 60 },
    { month: 'Feb', type: 'B', value: 70 },
    { month: 'Feb', type: 'C', value: 40 },
  ],
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [
    { type: 'stackY' },
    { type: 'sortColor', channel: 'y', order: 'descending' },  // Sort colors by descending y mean
  ],
});

chart.render();
```

## Options

```javascript
chart.options({
  transform: [
    {
      type: 'sortColor',
      channel: 'y',           // Channel used to compute the sort key, default 'y'
      order: 'ascending',     // 'ascending' | 'descending', default 'ascending'
      reducer: 'mean',        // Aggregation method: 'mean' | 'sum' | 'max' | 'min' | function, default 'mean'
      reverse: false,         // Whether to reverse the sorted result
    },
  ],
});
```

## Comparison with sortX

```javascript
// sortX: sorts x-axis category order (affects the x-axis order of bars/points)
transform: [{ type: 'sortX', channel: 'y', order: 'descending' }]

// sortColor: sorts color groups (legend/stacked layers) without affecting x-axis order
transform: [{ type: 'sortColor', channel: 'y', order: 'descending' }]
```

## Common mistakes and fixes

### Mistake: Expecting bar positions to change when using sortColor
```javascript
// ❌ Incorrect: sortColor only changes color/legend order, not x-axis bar positions
chart.options({
  encode: { x: 'type', y: 'value' },
  transform: [{ type: 'sortColor', channel: 'y', order: 'descending' }],
  // The x-axis bar order does not change!
});

// ✅ To change x-axis bar positions, use sortX
chart.options({
  encode: { x: 'type', y: 'value' },
  transform: [{ type: 'sortX', channel: 'y', order: 'descending' }],  // ✅
});
```
