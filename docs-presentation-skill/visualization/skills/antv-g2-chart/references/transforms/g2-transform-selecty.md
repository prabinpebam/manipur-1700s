---
id: "g2-transform-selecty"
title: "G2 SelectY Transform"
description: |
  Selects a data subset by the Y channel. It is used to filter specific data points within each Y category,
  such as the maximum, minimum, first, or last value.

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "selection"
  - "filtering"
  - "Y axis"
  - "extreme values"

related:
  - "g2-transform-select"
  - "g2-transform-selectx"

use_cases:
  - "Filter extreme values in horizontal bar charts"
  - "Select data in transposed coordinate systems"
  - "Filter data points by Y category"

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

SelectY Transform groups data by the Y channel, then selects a specific data point from each group. Supported selectors include:
- `max`: point with the largest X value
- `min`: point with the smallest X value
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
    { value: 10, category: 'A' },
    { value: 25, category: 'A' },
    { value: 15, category: 'A' },
    { value: 20, category: 'B' },
    { value: 35, category: 'B' },
    { value: 30, category: 'B' },
  ],
  encode: {
    x: 'value',
    y: 'category',
  },
  transform: [
    {
      type: 'selectY',
      selector: 'max',  // Keep only the maximum-value point in each Y category
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
  encode: { x: 'value', y: 'category' },
  transform: [
    { type: 'selectY', selector: 'min' },
  ],
});
```

### Selecting the first/last value

```javascript
// Select the first data point in each Y category
chart.options({
  type: 'point',
  data,
  encode: { x: 'value', y: 'category' },
  transform: [
    { type: 'selectY', selector: 'first' },
  ],
});

// Select the last data point in each Y category
chart.options({
  type: 'point',
  data,
  encode: { x: 'value', y: 'category' },
  transform: [
    { type: 'selectY', selector: 'last' },
  ],
});
```

### Custom selector

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'value', y: 'category' },
  transform: [
    {
      type: 'selectY',
      selector: (I, X) => {
        // I: array of indices within the group
        // X: array of values in the X channel
        // Return the selected index
        return I.reduce((maxIdx, i) => X[i] > X[maxIdx] ? i : maxIdx, I[0]);
      },
    },
  ],
});
```

## Complete type reference

```typescript
interface SelectYTransform {
  type: 'selectY';
  selector: 'max' | 'min' | 'first' | 'last' | ((I: number[], X: any[]) => number);
}
```

## Comparison with Select/SelectX

| Transform | Grouping dimension | Common use case |
|-----------|---------|---------|
| select | By specified channel | General selection |
| selectX | By X channel | X-axis categorical filtering |
| selectY | By Y channel | Y-axis categorical filtering |

## Common mistakes and fixes

### Mistake 1: Misspelling selector

```javascript
// ❌ Incorrect
transform: [{ type: 'selectY', selector: 'minimum' }]

// ✅ Correct
transform: [{ type: 'selectY', selector: 'min' }]
```

### Mistake 2: Returning the wrong value from a custom selector

```javascript
// ❌ Incorrect: returns a value instead of an index
selector: (I, X) => Math.max(...I.map(i => X[i]))

// ✅ Correct: returns an index
selector: (I, X) => I.reduce((maxIdx, i) => X[i] > X[maxIdx] ? i : maxIdx, I[0])
```
