---
id: "g2-label-transform-overlap-hide"
title: "G2 OverlapHide Label Transform"
description: |
  Label overlap-hide transform. When labels overlap, some labels are automatically hidden
  to avoid visual clutter. Priority-based hiding order is supported.

library: "g2"
version: "5.x"
category: "label-transform"
tags:
  - "label"
  - "label"
  - "overlap"
  - "hide"
  - "overlap"

related:
  - "g2-label-transform-overlap-dodge-y"
  - "g2-label-transform-overflow-hide"
  - "g2-comp-label-config"

use_cases:
  - "Displaying labels for dense data points"
  - "Handling labels in time-series charts"
  - "Scenarios requiring a concise display"

anti_patterns:
  - "Scenarios where all labels must be displayed (use overlapDodgeY instead)"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/label"
---

## Core Concept

The OverlapHide label transform hides some labels by detecting label overlap:
- It checks each label in sequence to determine whether it overlaps with labels already displayed
- If it overlaps, the current label is hidden
- It supports setting priority to determine the hiding order

**How it works:**
1. Get all labels
2. Sort by priority (optional)
3. Check each label in sequence to determine whether it overlaps with already displayed labels
4. Hide it if it overlaps; otherwise display it

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
    { date: '2024-01-01', value: 100 },
    { date: '2024-01-02', value: 120 },
    { date: '2024-01-03', value: 110 },
    { date: '2024-01-04', value: 130 },
  ],
  encode: {
    x: 'date',
    y: 'value',
  },
  labels: [
    {
      text: 'value',
      position: 'top',
      transform: [{ type: 'overlapHide' }],
    },
  ],
});

chart.render();
```

## Common Variants

### Setting Priority

```javascript
chart.options({
  type: 'interval',
  data: [
    { category: 'A', value: 100, priority: 2 },
    { category: 'B', value: 50, priority: 1 },
    { category: 'C', value: 80, priority: 3 },
  ],
  encode: { x: 'category', y: 'value' },
  labels: [
    {
      text: 'value',
      position: 'inside',
      transform: [
        {
          type: 'overlapHide',
          priority: (a, b) => a.priority - b.priority,  // Show higher-priority labels first
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
      text: 'value',
      position: 'top',
      transform: [
        { type: 'overlapDodgeY' },  // Try dodging first
        { type: 'overlapHide' },    // Hide labels that cannot be dodged
      ],
    },
  ],
});
```

## Complete Type Reference

```typescript
interface OverlapHideTransform {
  type: 'overlapHide';
  priority?: (a: any, b: any) => number;  // Priority comparison function
}
```

## Comparison with Other Label Transforms

| Transform | Function | Advantages | Disadvantages |
|-----------|------|------|------|
| overlapHide | Hide overlapping labels | Stable layout | Loses some labels |
| overlapDodgeY | Y-direction dodge | Keeps all labels | May change the layout |
| overflowHide | Hide overflowing labels | Avoids overflow | May lose labels |

## Priority Sorting Example

```javascript
// Sort by value: show larger values first
labels: [{
  text: 'value',
  transform: [{
    type: 'overlapHide',
    priority: (a, b) => b.value - a.value
  }]
}]

// Sort by a specific order
labels: [{
  text: 'value',
  transform: [{
    type: 'overlapHide',
    priority: (a, b) => {
      const order = ['A', 'B', 'C', 'D'];
      return order.indexOf(a.category) - order.indexOf(b.category);
    }
  }]
}]
```

## Common Errors and Fixes

### Error 1: Invalid transform Format

```javascript
// ❌ Error: transform should be an array
labels: [{ text: 'value', transform: { type: 'overlapHide' } }]

// ✅ Correct
labels: [{ text: 'value', transform: [{ type: 'overlapHide' }] }]
```

### Error 2: Priority Function Returns the Wrong Type

```javascript
// ❌ Error: the priority function should return a number
priority: (a, b) => a.value > b.value

// ✅ Correct: return a positive number to prioritize a, and a negative number to prioritize b
priority: (a, b) => b.value - a.value
```

### Error 3: Incorrect Transform Order with Other Transforms

```javascript
// ❌ Error: hiding first prevents later transforms from handling other issues
transform: [
  { type: 'overlapHide' },
  { type: 'overlapDodgeY' },  // Already hidden labels cannot be dodged
]

// ✅ Correct: try other solutions first, then hide as the final step
transform: [
  { type: 'overlapDodgeY' },
  { type: 'overlapHide' },
]
```
