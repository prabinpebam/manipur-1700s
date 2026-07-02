---
id: "g2-transform-pack"
title: "G2 Pack Transform"
description: |
  A packing-layout Transform that evenly arranges multiple graphical elements to avoid overlap.
  It is commonly used in scenarios that require automatic layout, such as treemaps and bubble charts.

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "packing"
  - "pack"
  - "layout"
  - "overlap prevention"
  - "grid"

related:
  - "g2-mark-pack"
  - "g2-mark-treemap"

use_cases:
  - "Automatically arrange multiple graphical elements"
  - "Create small-multiple grid layouts"
  - "Prevent graphical elements from overlapping"

anti_patterns:
  - "A single graphical element does not need packing"
  - "Data that already has explicit position information"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform"
---

## Core concepts

Pack Transform evenly arranges multiple graphical elements through transforms (translate + scale) to avoid overlap. It automatically calculates the position and scale ratio of each element.

**How it works:**
1. Calculates the bounding box of each element
2. Calculates a grid layout based on the container size
3. Applies translate and scale transforms to each element

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'pack',
   {
    nodes: [
      { name: 'A', value: 100 },
      { name: 'B', value: 80 },
      { name: 'C', value: 60 },
    ],
  },
  encode: {
    value: 'value',
    color: 'value',
  },
});

chart.render();
```

## Common variants

### Using as a Transform

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value' },
  transform: [
    {
      type: 'pack',
      padding: 5,        // Element spacing
      direction: 'col',  // Arrangement direction: 'col' | 'row'
    },
  ],
});
```

### Custom spacing

```javascript
chart.options({
  type: 'pack',
  data,
  encode: { value: 'value', color: 'value' },
  transform: [
    {
      type: 'pack',
      padding: 10,  // Spacing between elements
    },
  ],
});
```

### Arrange by row

```javascript
chart.options({
  type: 'pack',
  data,
  encode: { value: 'value', color: 'value' },
  transform: [
    {
      type: 'pack',
      direction: 'row',  // Arrange by row
    },
  ],
});
```

## Complete type reference

```typescript
interface PackTransform {
  type: 'pack';
  padding?: number;       // Element spacing, default 0
  direction?: 'col' | 'row';  // Arrangement direction, default 'col'
}
```

## Relationship with Pack Mark

Pack Mark uses Pack Transform internally for layout:
- **Pack Mark**: used to create circle packing charts
- **Pack Transform**: used for grid arrangement of arbitrary graphical elements

## Common mistakes and fixes

### Mistake 1: Setting padding too high

```javascript
// ❌ Incorrect: excessive padding can over-compress elements
transform: [{ type: 'pack', padding: 50 }]

// ✅ Correct: use a reasonable padding value
transform: [{ type: 'pack', padding: 5 }]
```

### Mistake 2: Invalid direction parameter

```javascript
// ❌ Incorrect
transform: [{ type: 'pack', direction: 'horizontal' }]

// ✅ Correct
transform: [{ type: 'pack', direction: 'row' }]
```
