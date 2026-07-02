---
id: "g2-transform-jittery"
title: "G2 JitterY Transform"
description: |
  Applies jitter to data in the Y direction to prevent overlapping points.
  It is commonly used in scatter plots to spread categorical data points.

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "jitter"
  - "jitter"
  - "scatter plot"
  - "overlap prevention"
  - "Y axis"

related:
  - "g2-transform-jitter"
  - "g2-transform-jitterx"
  - "g2-mark-point-scatter"

use_cases:
  - "Prevent point overlap in categorical scatter plots"
  - "Show the distribution of horizontally oriented categorical data"
  - "Apply jitter in transposed coordinate systems"

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

JitterY Transform randomly offsets data points in the Y direction so overlapping points are spread apart. It is symmetric with JitterX and applies when the Y axis contains categorical data.

**How it works:**
1. Determines the range of each category from the Y-axis scale
2. Randomly offsets each point's Y position within that range
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
    { value: 10, category: 'A' },
    { value: 12, category: 'A' },
    { value: 11, category: 'A' },
    { value: 20, category: 'B' },
    { value: 22, category: 'B' },
  ],
  encode: {
    x: 'value',
    y: 'category',
  },
  transform: [
    { type: 'jitterY' },
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
  encode: { x: 'value', y: 'category' },
  transform: [
    {
      type: 'jitterY',
      padding: 0.2,  // Jitter range ratio
    },
  ],
});
```

### Using with JitterX

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'categoryX', y: 'categoryY' },
  transform: [
    { type: 'jitterX' },
    { type: 'jitterY' },
  ],
});
```

### Custom random function

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'value', y: 'category' },
  transform: [
    {
      type: 'jitterY',
      random: () => Math.random(),
    },
  ],
});
```

## Complete type reference

```typescript
interface JitterYTransform {
  type: 'jitterY';
  padding?: number;      // Inner padding for the jitter range, default 0
  random?: () => number; // Random number generator, default Math.random
}
```

## Comparison with Jitter/JitterX

| Transform | Jitter direction | Common use case |
|-----------|---------|---------|
| jitter | X and Y | Two-dimensional categorical data |
| jitterX | X only | X-axis categorical data |
| jitterY | Y only | Y-axis categorical data |

## Common mistakes and fixes

### Mistake 1: Using jitter with continuous data

```javascript
// ❌ Not recommended: jitter can be misleading when the Y axis is continuous numerical data
chart.options({
  type: 'point',
  data,
  encode: { x: 'value', y: 'continuousValue' },
  transform: [{ type: 'jitterY' }],
});

// ✅ Correct: use it when the Y axis contains categorical data
chart.options({
  type: 'point',
  data,
  encode: { x: 'value', y: 'category' },
  transform: [{ type: 'jitterY' }],
});
```

### Mistake 2: Setting padding too high

```javascript
// ❌ Incorrect: excessive padding can cause points to overflow into adjacent categories
transform: [{ type: 'jitterY', padding: 0.8 }]

// ✅ Correct: use a reasonable padding value
transform: [{ type: 'jitterY', padding: 0.2 }]
```
