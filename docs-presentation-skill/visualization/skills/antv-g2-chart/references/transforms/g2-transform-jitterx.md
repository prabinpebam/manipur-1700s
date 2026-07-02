---
id: "g2-transform-jitterx"
title: "G2 JitterX Transform"
description: |
  Applies jitter to data in the X direction to prevent overlapping points.
  It is commonly used in scatter plots to spread categorical data points.

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "jitter"
  - "jitter"
  - "scatter plot"
  - "overlap prevention"
  - "X axis"

related:
  - "g2-transform-jitter"
  - "g2-transform-jittery"
  - "g2-mark-point-scatter"

use_cases:
  - "Prevent point overlap in categorical scatter plots"
  - "Show the distribution density of categorical data"
  - "Visualize one-dimensional data distributions"

anti_patterns:
  - "Continuous numerical data does not require jitter"
  - "The jitter effect is not obvious when there are too few points"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform"
---

## Core concepts

JitterX Transform randomly offsets data points in the X direction so overlapping points are spread apart. This is especially useful for scatter plots with categorical data.

**How it works:**
1. Determines the range of each category from the X-axis scale
2. Randomly offsets each point's X position within that range
3. Uses `padding` to control the offset range

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
    { category: 'A', value: 12 },
    { category: 'A', value: 11 },
    { category: 'B', value: 20 },
    { category: 'B', value: 22 },
  ],
  encode: {
    x: 'category',
    y: 'value',
  },
  transform: [
    { type: 'jitterX' },
  ],
});

chart.render();
```

## Common variants

### Controlling the jitter range

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'category', y: 'value' },
  transform: [
    {
      type: 'jitterX',
      padding: 0.2,  // Jitter range ratio, default 0
    },
  ],
});
```

### Custom random function

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'category', y: 'value' },
  transform: [
    {
      type: 'jitterX',
      random: () => Math.random(),  // Default Math.random
    },
  ],
});
```

### Using with JitterY

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'category', y: 'category2' },
  transform: [
    { type: 'jitterX' },
    { type: 'jitterY' },
  ],
});
```

## Complete type reference

```typescript
interface JitterXTransform {
  type: 'jitterX';
  padding?: number;      // Inner padding for the jitter range, default 0
  random?: () => number; // Random number generator, default Math.random
}
```

## Comparison with Jitter/JitterY

| Transform | Jitter direction | Common use case |
|-----------|---------|---------|
| jitter | X and Y | Two-dimensional categorical data |
| jitterX | X only | X-axis categorical data |
| jitterY | Y only | Y-axis categorical data |

## Common mistakes and fixes

### Mistake 1: Using jitter with continuous data

```javascript
// ❌ Not recommended: jitter can be misleading when the X axis is continuous numerical data
chart.options({
  type: 'point',
  data,
  encode: { x: 'continuousValue', y: 'value' },
  transform: [{ type: 'jitterX' }],
});

// ✅ Correct: use it when the X axis contains categorical data
chart.options({
  type: 'point',
  data,
  encode: { x: 'category', y: 'value' },
  transform: [{ type: 'jitterX' }],
});
```

### Mistake 2: Setting padding too high

```javascript
// ❌ Incorrect: excessive padding can cause points to overflow into adjacent categories
transform: [{ type: 'jitterX', padding: 0.8 }]

// ✅ Correct: use a reasonable padding value
transform: [{ type: 'jitterX', padding: 0.2 }]
```
