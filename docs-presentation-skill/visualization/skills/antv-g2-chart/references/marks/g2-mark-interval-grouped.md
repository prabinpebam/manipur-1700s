---
id: "g2-mark-interval-grouped"
title: "G2 Grouped Bar Chart"
description: |
  Create a grouped bar chart with the Interval Mark and the dodgeX transform.
  A grouped bar chart displays multiple series within the same category side by side, making it easy to compare absolute values across subcategories.

library: "g2"
version: "5.x"
category: "marks"
subcategory: "interval"
tags:
  - "grouped bar chart"
  - "grouped bar"
  - "dodgeX"
  - "multi-series"
  - "side-by-side"
  - "comparison"
  - "spec"

related:
  - "g2-mark-interval-basic"
  - "g2-mark-interval-stacked"
  - "g2-transform-dodgex"

use_cases:
  - "Compare absolute values of multiple sub-metrics within the same category"
  - "Compare sales across product lines in different time periods"
  - "Display multidimensional data side by side"

anti_patterns:
  - "When there are more than 4-5 series, bars in each group become too thin and hard to read"
  - "Use a stacked bar chart when focusing on proportions"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/bar/grouped"
---

## Core concepts

Grouped bar chart = `type: 'interval'` + `transform: [{ type: 'dodgeX' }]`.
`dodgeX` offsets multiple series of bars at the same x position horizontally to avoid overlap.

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
    { month: 'Jan', type: 'Product A', value: 100 },
    { month: 'Jan', type: 'Product B', value: 130 },
    { month: 'Jan', type: 'Product C', value: 90  },
    { month: 'Feb', type: 'Product A', value: 120 },
    { month: 'Feb', type: 'Product B', value: 100 },
    { month: 'Feb', type: 'Product C', value: 150 },
    { month: 'Mar', type: 'Product A', value: 80  },
    { month: 'Mar', type: 'Product B', value: 140 },
    { month: 'Mar', type: 'Product C', value: 110 },
  ],
  encode: {
    x: 'month',
    y: 'value',
    color: 'type',
  },
  transform: [{ type: 'dodgeX' }],   // Key: grouping transform
});

chart.render();
```

## Grouped bar chart (horizontal)

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'dodgeX' }],
  coordinate: { transform: [{ type: 'transpose' }] },
});
```

## Grouped bar chart + data labels

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'dodgeX' }],
  labels: [
    {
      text: 'value',
      position: 'outside',
      style: { fontSize: 11 },
    },
  ],
});
```

## Adjust group spacing

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [
    {
      type: 'dodgeX',
      padding: 0.1,       // Spacing between bars within a group (0-1), default 0
      paddingOuter: 0.1,  // Spacing between groups
    },
  ],
});
```

## Common errors and fixes

### Error 1: Forgetting dodgeX, causing bars to overlap
```javascript
// Error: multi-series data has no dodgeX, so bars are overlaid at the same position.
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  // Missing transform!
});

// Correct
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'dodgeX' }],
});
```

### Error 2: Using stackY and dodgeX together
```javascript
// Error: the two transforms conflict, and behavior is unpredictable.
chart.options({
  transform: [{ type: 'stackY' }, { type: 'dodgeX' }],
});

// Correct: stacking and grouping are mutually exclusive; choose one.
chart.options({ transform: [{ type: 'stackY' }] });   // Stacked
chart.options({ transform: [{ type: 'dodgeX' }] });   // Grouped
```