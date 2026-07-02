---
id: "g2-label-transform-overlap-dodge-y"
title: "G2 OverlapDodgeY Label Transform"
description: |
  Label Y-direction dodge transform. When labels overlap in the Y direction, their positions are automatically adjusted
  using an iterative algorithm to avoid label overlap.

library: "g2"
version: "5.x"
category: "label-transform"
tags:
  - "label"
  - "label"
  - "overlap"
  - "dodge"
  - "dodge"

related:
  - "g2-label-transform-overlap-hide"
  - "g2-label-transform-overflow-hide"
  - "g2-comp-label-config"

use_cases:
  - "Displaying labels for dense data points"
  - "Label avoidance in time-series charts"
  - "Scenarios where all labels need to be displayed"

anti_patterns:
  - "Too many labels may still result in a cluttered layout"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/label"
---

## Core Concept

The OverlapDodgeY label transform adjusts label positions in the Y direction through an iterative algorithm:
- It detects whether adjacent labels overlap in the X direction
- If they overlap, it separates them in the Y direction
- It iterates until there is no overlap or the maximum number of iterations is reached

**Algorithm characteristics:**
- Time complexity O(n log n)
- Supports setting the maximum number of iterations
- Supports setting label spacing

## Minimal Runnable Example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'line',
  data: [
    { date: '2024-01-01', value: 100, label: 'Event A' },
    { date: '2024-01-02', value: 120, label: 'Event B' },
    { date: '2024-01-02', value: 110, label: 'Event C' },  // Same day; labels may overlap
  ],
  encode: {
    x: 'date',
    y: 'value',
  },
  labels: [
    {
      text: 'label',
      position: 'top',
      transform: [{ type: 'overlapDodgeY' }],
    },
  ],
});

chart.render();
```

## Common Variants

### Custom Spacing

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  labels: [
    {
      text: 'label',
      position: 'top',
      transform: [
        {
          type: 'overlapDodgeY',
          padding: 4,  // Minimum spacing between labels (pixels)
        },
      ],
    },
  ],
});
```

### Controlling Iteration Count

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  labels: [
    {
      text: 'label',
      position: 'top',
      transform: [
        {
          type: 'overlapDodgeY',
          maxIterations: 20,  // Maximum number of iterations; default 10
          maxError: 0.1,      // Maximum error; default 0.1
        },
      ],
    },
  ],
});
```

### Combining with Other Transforms

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  labels: [
    {
      text: 'label',
      position: 'top',
      transform: [
        { type: 'overlapDodgeY' },
        { type: 'overflowHide' },  // Dodge first, then handle overflow
      ],
    },
  ],
});
```

## Complete Type Reference

```typescript
interface OverlapDodgeYTransform {
  type: 'overlapDodgeY';
  padding?: number;         // Label spacing; default 1
  maxIterations?: number;   // Maximum number of iterations; default 10
  maxError?: number;        // Maximum error; default 0.1
}
```

## Comparison with Other Label Transforms

| Transform | Function | Advantages | Disadvantages |
|-----------|------|------|------|
| overlapDodgeY | Y-direction dodge | Keeps all labels | May change the layout |
| overlapHide | Hide overlapping labels | Stable layout | Loses some labels |
| overflowHide | Hide overflowing labels | Avoids overflow | May lose labels |

## How It Works Diagram

```
Original state:
  Label A -------- Label B
      up overlap up

After processing:
  Label B
      up
  Label A --------

  (Separated in the Y direction)
```

## Common Errors and Fixes

### Error 1: Invalid transform Format

```javascript
// ❌ Error: transform should be an array
labels: [{ text: 'value', transform: { type: 'overlapDodgeY' } }]

// ✅ Correct
labels: [{ text: 'value', transform: [{ type: 'overlapDodgeY' }] }]
```

### Error 2: Inappropriate Iteration Count

```javascript
// ⚠️ Note: too many iterations can affect performance
// When there are many labels, reduce the iteration count

// When there are few labels
transform: [{ type: 'overlapDodgeY', maxIterations: 20 }]

// When there are many labels
transform: [{ type: 'overlapDodgeY', maxIterations: 5 }]
```

### Error 3: Incorrect Transform Order with Other Transforms

```javascript
// ❌ Error: hiding first and dodging afterward produces poor results
transform: [
  { type: 'overlapHide' },
  { type: 'overlapDodgeY' },
]

// ✅ Correct: dodge first, then hide labels that still cannot be handled
transform: [
  { type: 'overlapDodgeY' },
  { type: 'overlapHide' },
]
```
