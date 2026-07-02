---
id: "g2-label-transform-overflow-hide"
title: "G2 OverflowHide Label Transform"
description: |
  Label overflow-hide transform. When a label exceeds the boundary of its associated element, it is automatically hidden,
  preventing visual clutter caused by overflowing labels.

library: "g2"
version: "5.x"
category: "label-transform"
tags:
  - "label"
  - "label"
  - "overflow"
  - "hide"
  - "overflow"

related:
  - "g2-label-transform-overlap-hide"
  - "g2-label-transform-overlap-dodge-y"
  - "g2-comp-label-config"

use_cases:
  - "Handling overflow in pie chart labels"
  - "Data labels in bar charts"
  - "Label display for small elements"

anti_patterns:
  - "Scenarios where all labels must be displayed"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/label"
---

## Core Concept

The OverflowHide label transform detects whether a label exceeds the boundary of its associated element:
- If the label is within the element boundary, it is displayed normally
- If the label exceeds the boundary, it is hidden automatically

**How it works:**
1. Calculate the element bounding box
2. Calculate the label bounding box
3. Detect whether the label overflows the element boundary
4. Hide the label if it overflows

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
    { category: 'A', value: 10 },
    { category: 'B', value: 50 },
    { category: 'C', value: 5 },  // Small bar; the label may overflow
  ],
  encode: {
    x: 'category',
    y: 'value',
  },
  labels: [
    {
      text: 'value',
      position: 'inside',
      transform: [{ type: 'overflowHide' }],
    },
  ],
});

chart.render();
```

## Common Variants

### Handling Overflow in Pie Chart Labels

```javascript
chart.options({
  type: 'interval',
  coordinate: { type: 'theta' },
  data,
  encode: { y: 'value', color: 'category' },
  labels: [
    {
      text: 'category',
      position: 'inside',
      transform: [{ type: 'overflowHide' }],
    },
  ],
});
```

### Combining with Other Label Transforms

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value' },
  labels: [
    {
      text: 'value',
      position: 'inside',
      transform: [
        { type: 'overflowHide' },
        { type: 'overlapHide' },  // Handle overflow first, then overlap
      ],
    },
  ],
});
```

## Complete Type Reference

```typescript
interface OverflowHideTransform {
  type: 'overflowHide';
  // No additional configuration parameters
}
```

## Comparison with Other Label Transforms

| Transform | Function | Applicable Scenario |
|-----------|------|---------|
| overflowHide | Hide overflowing labels | Label exceeds the element boundary |
| overlapHide | Hide overlapping labels | Labels overlap each other |
| overlapDodgeY | Y-direction dodge | Labels overlap vertically |

## Common Errors and Fixes

### Error 1: Invalid transform Format

```javascript
// ❌ Error: transform should be an array
labels: [{ text: 'value', transform: { type: 'overflowHide' } }]

// ✅ Correct
labels: [{ text: 'value', transform: [{ type: 'overflowHide' }] }]
```

### Error 2: Inappropriate position Setting

```javascript
// ⚠️ Note: labels in the outside position usually do not overflow
// overflowHide is primarily used for the inside position

// For inside labels
labels: [{
  text: 'value',
  position: 'inside',
  transform: [{ type: 'overflowHide' }]
}]

// For outside labels, consider using overlapHide
labels: [{
  text: 'value',
  position: 'outside',
  transform: [{ type: 'overlapHide' }]
}]
```

### Error 3: Incorrect Transform Order with Other Transforms

```javascript
// ⚠️ Note: transform order affects the result

// Recommended: handle overflow first, then handle overlap
transform: [
  { type: 'overflowHide' },
  { type: 'overlapHide' },
]
```
