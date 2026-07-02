---
id: "g2-label-transform-exceed-adjust"
title: "G2 ExceedAdjust Label Transform"
description: |
  Label exceed-adjust transform. When a label exceeds the specified range, its position is automatically adjusted
  to ensure the label remains visible within the viewport.

library: "g2"
version: "5.x"
category: "label-transform"
tags:
  - "label"
  - "label"
  - "exceed"
  - "adjust"
  - "exceed"

related:
  - "g2-label-transform-overflow-hide"
  - "g2-label-transform-overlap-dodge-y"
  - "g2-comp-label-config"

use_cases:
  - "Adjusting labels near chart edges"
  - "Labels for small elements"
  - "Scenarios where labels must remain fully visible"

anti_patterns:
  - "Scenarios where labels can be hidden (use overflowHide instead)"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/label"
---

## Core Concept

The ExceedAdjust label transform detects whether labels exceed the viewport:
- If a label exceeds the viewport, its position is adjusted automatically
- It ensures labels are shown in full

**How it works:**
1. Calculate the label bounding box
2. Detect whether it exceeds the chart boundary
3. If it exceeds the boundary, adjust the position inward

## Minimal Runnable Example

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
    { x: 10, y: 100 },
    { x: 20, y: 150 },
    { x: 30, y: 200 },  // May be near the top edge of the chart
  ],
  encode: {
    x: 'x',
    y: 'y',
  },
  labels: [
    {
      text: 'y',
      position: 'top',
      transform: [{ type: 'exceedAdjust' }],
    },
  ],
});

chart.render();
```

## Common Variants

### Combining with Other Transforms

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y' },
  labels: [
    {
      text: 'y',
      position: 'top',
      transform: [
        { type: 'exceedAdjust' },
        { type: 'overlapDodgeY' },
      ],
    },
  ],
});
```

## Complete Type Reference

```typescript
interface ExceedAdjustTransform {
  type: 'exceedAdjust';
  // No additional configuration parameters
}
```

## Comparison with Other Label Transforms

| Transform | Function | Handling Method |
|-----------|------|---------|
| exceedAdjust | Exceed adjustment | Move position |
| overflowHide | Hide overflow | Hide label |
| overlapDodgeY | Avoid overlap | Separate in the Y direction |

## Common Errors and Fixes

### Error 1: Invalid transform Format

```javascript
// ❌ Error: transform should be an array
labels: [{ text: 'value', transform: { type: 'exceedAdjust' } }]

// ✅ Correct
labels: [{ text: 'value', transform: [{ type: 'exceedAdjust' }] }]
```

### Error 2: Incorrect Transform Order with Other Transforms

```javascript
// ⚠️ Note: transform order affects the result
// Recommended: handle exceeding first, then handle overlap

// ✅ Correct order
transform: [
  { type: 'exceedAdjust' },
  { type: 'overlapDodgeY' },
]
```
