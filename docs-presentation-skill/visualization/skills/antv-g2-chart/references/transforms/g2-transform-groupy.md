---
id: "g2-transform-groupy"
title: "G2 GroupY Transform"
description: |
  Groups and aggregates data by the Y channel. It is symmetric with GroupX
  and is used in scenarios where data is aggregated by the Y dimension.

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "grouping"
  - "aggregation"
  - "Y-axis"
  - "statistics"

related:
  - "g2-transform-groupx"
  - "g2-transform-groupcolor"
  - "g2-transform-group"

use_cases:
  - "Calculate statistics by the Y dimension"
  - "Aggregate horizontal bar charts"
  - "Grouped aggregation in transposed coordinate systems"

anti_patterns:
  - "Grouping is ineffective when the Y channel is continuous numeric values"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform"
---

## Core Concepts

GroupY Transform groups data by the value of the `y` channel, while also considering the `color` and `series` channels, then computes aggregations for each group.

**Grouping dimensions:**
- Primary dimension: `y` channel
- Additional dimensions: `color`, `series`

## Minimal Runnable Example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'interval',
  coordinate: { transform: [{ type: 'transpose' }] },  // Transpose to a horizontal bar chart
  data: [
    { category: 'A', group: 'X', value: 10 },
    { category: 'A', group: 'Y', value: 20 },
    { category: 'B', group: 'X', value: 15 },
    { category: 'B', group: 'Y', value: 25 },
  ],
  encode: {
    x: 'value',
    y: 'category',
    color: 'group',
  },
  transform: [
    {
      type: 'groupY',
      x: 'sum',  // Sum each group
    },
  ],
});

chart.render();
```

## Common Variants

### Calculate the Mean

```javascript
chart.options({
  type: 'interval',
  coordinate: { transform: [{ type: 'transpose' }] },
  data,
  encode: { x: 'value', y: 'category', color: 'group' },
  transform: [
    { type: 'groupY', x: 'mean' },
  ],
});
```

### Count Statistics

```javascript
chart.options({
  type: 'interval',
  coordinate: { transform: [{ type: 'transpose' }] },
  data,
  encode: { x: 'value', y: 'category' },
  transform: [
    { type: 'groupY', x: 'count' },
  ],
});
```

### Multi-Channel Aggregation

```javascript
chart.options({
  type: 'interval',
  coordinate: { transform: [{ type: 'transpose' }] },
  data,
  encode: { x: 'value', y: 'category', size: 'count' },
  transform: [
    {
      type: 'groupY',
      x: 'sum',
      size: 'count',
    },
  ],
});
```

## Complete Type Reference

```typescript
interface GroupYTransform {
  type: 'groupY';
  x?: Reducer;
  // Other channels can also be aggregated
  [channel: string]: Reducer;
}

type Reducer = 'sum' | 'mean' | 'median' | 'max' | 'min' | 'count' | 'first' | 'last' | ((I: number[], V: any[]) => any);
```

## Comparison with GroupX

| Feature | GroupX | GroupY |
|------|--------|--------|
| Grouping dimension | x, color, series | y, color, series |
| Common scenario | Vertical bar chart | Horizontal bar chart |
| Aggregated channel | Usually y | Usually x |

## Common Mistakes and Fixes

### Mistake 1: Using it in a non-transposed coordinate system

```javascript
// ⚠️ Note: In a normal coordinate system, GroupY is usually used when Y is a categorical axis
// If Y is a numeric axis, grouping may not be meaningful

// ✅ Correct: transposed coordinate system + GroupY
chart.options({
  type: 'interval',
  coordinate: { transform: [{ type: 'transpose' }] },
  data,
  encode: { x: 'value', y: 'category' },
  transform: [{ type: 'groupY', x: 'sum' }],
});
```