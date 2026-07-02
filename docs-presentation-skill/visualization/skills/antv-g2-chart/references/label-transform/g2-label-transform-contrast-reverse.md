---
id: "g2-label-transform-contrast-reverse"
title: "G2 ContrastReverse Label Transform"
description: |
  Label contrast-reversal transform. It automatically adjusts label color based on the background color,
  ensuring labels appear light on dark backgrounds and dark on light backgrounds.

library: "g2"
version: "5.x"
category: "label-transform"
tags:
  - "label"
  - "label"
  - "contrast"
  - "color"
  - "contrast"

related:
  - "g2-label-transform-overflow-hide"
  - "g2-comp-label-config"

use_cases:
  - "Internal labels in bar charts"
  - "Pie chart labels"
  - "Labels that need to adjust color based on the background"

anti_patterns:
  - "Labels with fixed colors do not need this transform"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/label"
---

## Core Concept

The ContrastReverse label transform automatically adjusts label color based on the element color:
- Dark background -> light label
- Light background -> dark label

**How it works:**
1. Get the element fill color
2. Calculate the color luminance
3. Select a contrasting color based on the luminance

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
      transform: [{ type: 'contrastReverse' }],
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
        { type: 'contrastReverse' },
        { type: 'overflowHide' },
      ],
    },
  ],
});
```

### Custom Contrast Colors

```javascript
// Note: contrastReverse usually uses the default black-and-white contrast
// To customize it, set the color in style
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  labels: [
    {
      text: 'value',
      position: 'inside',
      style: {
        fill: '#fff',  // Fixed white
        stroke: '#000',  // Add stroke to increase contrast
        lineWidth: 1,
      },
    },
  ],
});
```

## Complete Type Reference

```typescript
interface ContrastReverseTransform {
  type: 'contrastReverse';
  // No additional configuration parameters
}
```

## Comparison with Fixed Colors

| Method | Advantages | Disadvantages |
|------|------|------|
| contrastReverse | Adapts automatically | May not match the design style |
| Fixed color | Consistent style | Contrast may be insufficient |
| Stroke | Increases contrast | May affect clarity |

## Common Errors and Fixes

### Error 1: Invalid transform Format

```javascript
// ❌ Error: transform should be an array
labels: [{ text: 'value', transform: { type: 'contrastReverse' } }]

// ✅ Correct
labels: [{ text: 'value', transform: [{ type: 'contrastReverse' }] }]
```

### Error 2: Inappropriate position Setting

```javascript
// ⚠️ Note: contrastReverse is primarily used for the inside position
// Labels in the outside position are not on the element, so the background color cannot be obtained

// ✅ Correct: use it for inside labels
labels: [{
  text: 'value',
  position: 'inside',
  transform: [{ type: 'contrastReverse' }]
}]
```
