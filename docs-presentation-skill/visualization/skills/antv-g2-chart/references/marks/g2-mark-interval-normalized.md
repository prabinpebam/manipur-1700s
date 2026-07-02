---
id: "g2-mark-interval-normalized"
title: "G2 100% Stacked Bar Chart"
description: |
  Create a 100% stacked bar chart with the Interval Mark and the stackY + normalizeY transforms.
  The total height of each group is normalized to 100%, focusing on changes in the proportions of each subcategory.
  This removes the effect of total-value differences and makes it easier to compare structural distributions across groups.

library: "g2"
version: "5.x"
category: "marks"
subcategory: "interval"
tags:
  - "100% stacked"
  - "normalized"
  - "normalizeY"
  - "proportion"
  - "structural analysis"
  - "100% stacked bar"
  - "spec"

related:
  - "g2-mark-interval-stacked"
  - "g2-mark-interval-grouped"
  - "g2-transform-normalizey"
  - "g2-transform-stacky"

use_cases:
  - "Compare the proportional distribution of subcategories across groups"
  - "Focus on structural changes rather than absolute values"
  - "Remove total-value differences and highlight proportions"

anti_patterns:
  - "Use a regular stacked bar chart when absolute value changes are important"
  - "When there are only two subcategories, a simple line chart or area chart may be more intuitive"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/bar/normalized"
---

## Core concepts

100% stacking = execute the `stackY` and `normalizeY` transforms in order:
1. `stackY`: first stack each subcategory value into y0/y1 intervals.
2. `normalizeY`: then normalize each group's y values to [0, 1].

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
    { month: 'Feb', type: 'A', value: 80  },
    { month: 'Feb', type: 'B', value: 220 },
    { month: 'Feb', type: 'C', value: 100 },
    { month: 'Mar', type: 'A', value: 130 },
    { month: 'Mar', type: 'B', value: 180 },
    { month: 'Mar', type: 'C', value: 90  },
  ],
  encode: {
    x: 'month',
    y: 'value',
    color: 'type',
  },
  transform: [
    { type: 'stackY' },      // 1. Stack first
    { type: 'normalizeY' },  // 2. Then normalize to percentages
  ],
  axis: {
    y: { labelFormatter: (v) => `${(v * 100).toFixed(0)}%` },
  },
});

chart.render();
```

## With percentage data labels

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }, { type: 'normalizeY' }],
  labels: [
    {
      text: (d) => `${(d.value * 100).toFixed(1)}%`,  // Note: after normalization, value is already 0-1.
      position: 'inside',
      style: {
        fill: 'white',
        fontSize: 11,
        fontWeight: 'bold',
      },
      // Filter labels with very small proportions to avoid clutter.
      filter: (d) => d.value > 0.05,
    },
  ],
  axis: {
    y: { labelFormatter: (v) => `${(v * 100).toFixed(0)}%` },
  },
});
```

## 100% stacked bar chart (horizontal)

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }, { type: 'normalizeY' }],
  coordinate: { transform: [{ type: 'transpose' }] },
  axis: {
    x: { labelFormatter: (v) => `${(v * 100).toFixed(0)}%` },
  },
});
```

## Common errors and fixes

### Error: transform order is reversed
```javascript
// Error: normalizeY before stackY produces incorrect results.
chart.options({
  transform: [{ type: 'normalizeY' }, { type: 'stackY' }],
});

// Correct: stackY must come before normalizeY.
chart.options({
  transform: [{ type: 'stackY' }, { type: 'normalizeY' }],
});
```