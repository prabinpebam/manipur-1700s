---
id: "g2-transform-normalizey"
title: "G2 NormalizeY Normalization Transform"
description: |
  NormalizeY normalizes y values within each x group to [0, 1].
  It is usually used after stackY to create percentage stacked charts,
  remove differences in totals, and focus on proportional distributions.

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "normalizeY"
  - "normalization"
  - "percentage"
  - "transform"
  - "percentage stacking"
  - "proportion"
  - "spec"

related:
  - "g2-mark-interval-normalized"
  - "g2-transform-stacky"

use_cases:
  - "Create percentage stacked column charts"
  - "Create percentage stacked area charts"
  - "Remove differences in totals and focus on proportions"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform/normalize-y"
---

## Basic usage (must be used with stackY)

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [
    { type: 'stackY' },       // Step 1: stack
    { type: 'normalizeY' },   // Step 2: normalize (the order must not be reversed!)
  ],
  axis: {
    y: { labelFormatter: (v) => `${(v * 100).toFixed(0)}%` },
  },
});

chart.render();
```

## Options

```javascript
transform: [
  { type: 'stackY' },
  {
    type: 'normalizeY',
    basis: 'max',    // Normalization basis: 'max' (default, maximum value in each group) | 'min' | 'first' | 'last' | 'mean' | 'median'
    series: 'y',     // Channel to normalize, default 'y'
  },
],
```

## Percentage stacked area chart

```javascript
chart.options({
  type: 'area',
  data,
  encode: { x: 'date', y: 'value', color: 'type' },
  transform: [
    { type: 'stackY' },
    { type: 'normalizeY' },
  ],
  axis: {
    y: { labelFormatter: (v) => `${(v * 100).toFixed(0)}%` },
  },
});
```

## Y-axis percentage formatting

After normalizeY, y values are in the [0, 1] range and must be manually formatted as percentages for display:

```javascript
axis: {
  y: { labelFormatter: (v) => `${(v * 100).toFixed(0)}%` },
}
```

## Common mistakes and fixes

### Mistake 1: Running normalizeY before stackY
```javascript
// ❌ Incorrect: normalizing before stacking does not produce a percentage stacked effect
transform: [{ type: 'normalizeY' }, { type: 'stackY' }],

// ✅ Correct: stack first, then normalize
transform: [{ type: 'stackY' }, { type: 'normalizeY' }],
```

### Mistake 2: Using normalizeY directly without stackY
```javascript
// ❌ Incorrect: normalizeY alone does not produce a percentage stacked effect
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'normalizeY' }],
});

// ✅ Correct: use stackY + normalizeY together
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }, { type: 'normalizeY' }],
});
```

### Mistake 3: The Y axis is not formatted as percentages
```javascript
// ❌ Problem: after normalization, the y axis displays 0.0 - 1.0, which users may not understand
chart.options({ transform: [{ type: 'stackY' }, { type: 'normalizeY' }] });

// ✅ Correct: add percentage formatting
chart.options({
  transform: [{ type: 'stackY' }, { type: 'normalizeY' }],
  axis: { y: { labelFormatter: (v) => `${(v * 100).toFixed(0)}%` } },
});
```
