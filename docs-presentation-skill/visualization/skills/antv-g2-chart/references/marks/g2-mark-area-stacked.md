---
id: "g2-mark-area-stacked"
title: "G2 Stacked Area Chart"
description: |
  Create a stacked area chart with the Area Mark and stackY Transform.
  It shows both the trend of each series and the accumulated total; each series area starts from the top of the previous series.

library: "g2"
version: "5.x"
category: "marks"
subcategory: "area"
tags:
  - "stacked area chart"
  - "stacked area"
  - "stackY"
  - "multi-series"
  - "trend"
  - "total"
  - "spec"

related:
  - "g2-mark-area-basic"
  - "g2-transform-stacky"
  - "g2-mark-interval-stacked"

use_cases:
  - "Show how the total of multiple series changes over time"
  - "Focus on both each series trend and the overall scale"
  - "Traffic sources, revenue composition, and similar scenarios"

anti_patterns:
  - "Colors become difficult to distinguish with more than 5 series"
  - "When precise comparison of a single series is needed (because baselines differ), use a line chart instead"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/area/stacked"
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
    { month: 'Jan', type: 'A', value: 100 },
    { month: 'Jan', type: 'B', value: 200 },
    { month: 'Jan', type: 'C', value: 150 },
    { month: 'Feb', type: 'A', value: 120 },
    { month: 'Feb', type: 'B', value: 180 },
    { month: 'Feb', type: 'C', value: 160 },
    { month: 'Mar', type: 'A', value: 90  },
    { month: 'Mar', type: 'B', value: 220 },
    { month: 'Mar', type: 'C', value: 130 },
  ],
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
});

chart.render();
```

## Smooth stacked area chart

```javascript
chart.options({
  type: 'area',
  data,
  encode: {
    x: 'month',
    y: 'value',
    color: 'type',
    shape: 'smooth',
  },
  transform: [{ type: 'stackY' }],
  style: { fillOpacity: 0.85 },
});
```

## Stacked area + line outline

```javascript
chart.options({
  type: 'view',
  data,
  children: [
    {
      type: 'area',
      encode: { x: 'month', y: 'value', color: 'type' },
      transform: [{ type: 'stackY' }],
      style: { fillOpacity: 0.7 },
    },
    {
      type: 'line',
      encode: { x: 'month', y: 'value', color: 'type', series: 'type' },
      transform: [{ type: 'stackY' }],
      style: { lineWidth: 1.5 },
    },
  ],
});
```

## Percentage stacked area chart

```javascript
chart.options({
  type: 'area',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [
    { type: 'stackY' },
    { type: 'normalizeY' },
  ],
  axis: {
    y: { labelFormatter: (v) => `${(v * 100).toFixed(0)}%` },
  },
});
```

## Common mistakes and fixes

### Mistake: Forgetting stackY causes series to obscure each other
```javascript
// Error: each series area starts from y=0 and overlaps the others
chart.options({
  type: 'area',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  // Missing transform!
});

// Correct
chart.options({
  type: 'area',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
});
```
