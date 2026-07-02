---
id: "g2-transform-selectx"
title: "G2 SelectX Transform"
description: |
  Selects a data subset by the X channel. It is used to filter specific data points within each X category,
  such as the maximum, minimum, first, or last value.

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "selection"
  - "filtering"
  - "X axis"
  - "extreme values"

related:
  - "g2-transform-select"
  - "g2-transform-selecty"

use_cases:
  - "Show only the maximum value for each category"
  - "Filter the first/last data point in each X group"
  - "Highlight extreme-value points"

anti_patterns:
  - "Do not use it when all data must be retained"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform"
---

## Core concepts

SelectX Transform groups data by the X channel, then selects a specific data point from each group. Supported selectors include:
- `max`: point with the largest Y value
- `min`: point with the smallest Y value
- `first`: first data point
- `last`: last data point
- custom selection function

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'point',
  data: [
    { category: 'A', value: 10 },
    { category: 'A', value: 25 },
    { category: 'A', value: 15 },
    { category: 'B', value: 20 },
    { category: 'B', value: 35 },
    { category: 'B', value: 30 },
  ],
  encode: {
    x: 'category',
    y: 'value',
  },
  transform: [
    {
      type: 'selectX',
      selector: 'max',  // Keep only the maximum-value point in each category
    },
  ],
});

chart.render();
```

## Common variants

### Selecting the minimum value

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'category', y: 'value' },
  transform: [
    { type: 'selectX', selector: 'min' },
  ],
});
```

### Selecting the first/last value

```javascript
// Select the first data point in each category
chart.options({
  type: 'point',
  data,
  encode: { x: 'category', y: 'value' },
  transform: [
    { type: 'selectX', selector: 'first' },
  ],
});

// Select the last data point in each category
chart.options({
  type: 'point',
  data,
  encode: { x: 'category', y: 'value' },
  transform: [
    { type: 'selectX', selector: 'last' },
  ],
});
```

### Custom selector

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'category', y: 'value' },
  transform: [
    {
      type: 'selectX',
      selector: (I, Y) => {
        // I: array of indices within the group
        // Y: array of values in the Y channel
        // Return the selected index
        return I.reduce((maxIdx, i) => Y[i] > Y[maxIdx] ? i : maxIdx, I[0]);
      },
    },
  ],
});
```

## Complete type reference

```typescript
interface SelectXTransform {
  type: 'selectX';
  selector: 'max' | 'min' | 'first' | 'last' | ((I: number[], Y: any[]) => number);
}
```

## Comparison with Select/SelectY

| Transform | Grouping dimension | Common use case |
|-----------|---------|---------|
| select | By specified channel | General selection |
| selectX | By X channel | X-axis categorical filtering |
| selectY | By Y channel | Y-axis categorical filtering |

## Common mistakes and fixes

### Mistake 1: Misspelling selector

```javascript
// ❌ Incorrect
transform: [{ type: 'selectX', selector: 'maximum' }]

// ✅ Correct
transform: [{ type: 'selectX', selector: 'max' }]
```

### Mistake 2: Returning the wrong value from a custom selector

```javascript
// ❌ Incorrect: returns a value instead of an index
selector: (I, Y) => Math.max(...I.map(i => Y[i]))

// ✅ Correct: returns an index
selector: (I, Y) => I.reduce((maxIdx, i) => Y[i] > Y[maxIdx] ? i : maxIdx, I[0])
```
