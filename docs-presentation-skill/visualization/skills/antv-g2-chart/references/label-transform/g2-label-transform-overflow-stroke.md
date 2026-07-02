---
id: "g2-label-transform-overflow-stroke"
title: "G2 OverflowStroke Label Transform"
description: |
  Label overflow-stroke transform. When a label exceeds an element boundary, a stroke is automatically added
  to improve label readability.

library: "g2"
version: "5.x"
category: "label-transform"
tags:
  - "label"
  - "label"
  - "overflow"
  - "stroke"
  - "stroke"

related:
  - "g2-label-transform-overflow-hide"
  - "g2-label-transform-contrast-reverse"
  - "g2-comp-label-config"

use_cases:
  - "External labels in pie charts"
  - "Labels that need improved readability"
  - "Label display on complex backgrounds"

anti_patterns:
  - "Simple scenarios that do not require strokes"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/label"
---

## Core Concept

The OverflowStroke label transform detects whether a label exceeds the element boundary:
- If it exceeds the boundary, a stroke is added to the label
- This improves readability on complex backgrounds

**How it works:**
1. Calculate the element and label bounding boxes
2. Detect whether the label exceeds the element boundary
3. If it exceeds the boundary, add a stroke style

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
    { category: 'A', value: 100 },
    { category: 'B', value: 150 },
    { category: 'C', value: 80 },
  ],
  encode: {
    x: 'category',
    y: 'value',
    color: 'category',
  },
  labels: [
    {
      text: 'value',
      position: 'inside',
      transform: [{ type: 'overflowStroke' }],
    },
  ],
});

chart.render();
```

## Common Variants

### Combining with Other Transforms

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  labels: [
    {
      text: 'value',
      position: 'inside',
      transform: [
        { type: 'overflowStroke' },
        { type: 'contrastReverse' },
      ],
    },
  ],
});
```

## Complete Type Reference

```typescript
interface OverflowStrokeTransform {
  type: 'overflowStroke';
  // No additional configuration parameters
}
```

## Comparison with Other Label Transforms

| Transform | Function | Handling Method |
|-----------|------|---------|
| overflowStroke | Stroke overflowing labels | Add a stroke |
| overflowHide | Hide overflow | Hide label |
| contrastReverse | Contrast reversal | Change color |

## Common Errors and Fixes

### Error 1: Invalid transform Format

```javascript
// ❌ Error: transform should be an array
labels: [{ text: 'value', transform: { type: 'overflowStroke' } }]

// ✅ Correct
labels: [{ text: 'value', transform: [{ type: 'overflowStroke' }] }]
```

### Error 2: Incorrect Order with Other Transforms

```javascript
// ⚠️ Note: stroke should be applied after color adjustment
// Recommended order: contrastReverse -> overflowStroke

// ✅ Correct order
transform: [
  { type: 'contrastReverse' },
  { type: 'overflowStroke' },
]
```
