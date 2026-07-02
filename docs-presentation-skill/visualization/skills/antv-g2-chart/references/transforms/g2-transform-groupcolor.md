---
id: "g2-transform-groupcolor"
title: "G2 GroupColor Transform"
description: |
  Groups and aggregates data by the color channel. It is commonly used for categorical aggregation,
  such as calculating totals or averages by category.

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "grouping"
  - "aggregation"
  - "color"
  - "categorical statistics"

related:
  - "g2-transform-groupx"
  - "g2-transform-groupy"
  - "g2-transform-group"

use_cases:
  - "Calculate totals by category"
  - "Aggregate data by the color dimension"
  - "Calculate the average and maximum values for each category"

anti_patterns:
  - "Do not use it when the original data must be preserved"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform"
---

## Core Concepts

GroupColor Transform groups data by the value of the `color` channel, then computes aggregations for each group.

**Supported aggregation functions:**
- `sum`: sum
- `mean`: mean
- `median`: median
- `max`: maximum
- `min`: minimum
- `count`: count
- `first`: take the first value
- `last`: take the last value

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
  data: [
    { category: 'A', type: 'X', value: 10 },
    { category: 'A', type: 'Y', value: 20 },
    { category: 'B', type: 'X', value: 15 },
    { category: 'B', type: 'Y', value: 25 },
  ],
  encode: {
    x: 'category',
    y: 'value',
    color: 'type',  // Group by type
  },
  transform: [
    {
      type: 'groupColor',
      y: 'sum',  // Sum each group
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
  data,
  encode: { x: 'category', y: 'value', color: 'type' },
  transform: [
    { type: 'groupColor', y: 'mean' },
  ],
});
```

### Multi-Channel Aggregation

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'type', size: 'count' },
  transform: [
    {
      type: 'groupColor',
      y: 'sum',
      size: 'count',  // Aggregate the size channel at the same time
    },
  ],
});
```

### Custom Aggregation Function

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'type' },
  transform: [
    {
      type: 'groupColor',
      y: (I, V) => {
        // I: index array within the group
        // V: value array for this channel
        return I.reduce((sum, i) => sum + V[i], 0) / I.length;
      },
    },
  ],
});
```

## Complete Type Reference

```typescript
interface GroupColorTransform {
  type: 'groupColor';
  y?: 'sum' | 'mean' | 'median' | 'max' | 'min' | 'count' | 'first' | 'last' | ((I: number[], V: any[]) => any);
  // Other channels can also be aggregated
  [channel: string]: Reducer;
}

type Reducer = 'sum' | 'mean' | 'median' | 'max' | 'min' | 'count' | 'first' | 'last' | ((I: number[], V: any[]) => any);
```

## Common Mistakes and Fixes

### Mistake 1: Not specifying the color channel

```javascript
// ❌ Mistake: groupColor is invalid without a color channel
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value' },
  transform: [{ type: 'groupColor', y: 'sum' }],
});

// ✅ Correct: add the color channel
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'type' },
  transform: [{ type: 'groupColor', y: 'sum' }],
});
```

### Mistake 2: Misspelling the aggregation function name

```javascript
// ❌ Mistake
transform: [{ type: 'groupColor', y: 'average' }]

// ✅ Correct
transform: [{ type: 'groupColor', y: 'mean' }]
```