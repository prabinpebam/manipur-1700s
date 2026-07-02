---
id: "g2-scale-point"
title: "G2 Point Scale"
description: |
  Point Scale maps discrete categories to evenly distributed points.
  It is similar to Band Scale, but its bandwidth is fixed at 0, and it is commonly used for position mapping in scatter plots.

library: "g2"
version: "5.x"
category: "scales"
tags:
  - "scale"
  - "scale"
  - "point"
  - "discrete"
  - "position"

related:
  - "g2-scale-band"
  - "g2-scale-ordinal"
  - "g2-mark-point-scatter"

use_cases:
  - "X/Y-axis position mapping for scatter plots"
  - "Position mapping for categorical data"
  - "Discrete data that needs even distribution"

anti_patterns:
  - "Use Linear Scale for continuous numeric data"
  - "Use Band Scale when bandwidth is required"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/scale"
---

## Core concepts

Point Scale is a discrete scale:
- Maps categories to evenly distributed point positions
- Bandwidth is fixed at 0
- Each category corresponds to an exact position point

**Differences from Band Scale:**
- Band Scale: Each category occupies an interval (with bandwidth)
- Point Scale: Each category corresponds to an exact point (without bandwidth)

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
    { category: 'B', value: 20 },
    { category: 'C', value: 15 },
  ],
  encode: {
    x: 'category',
    y: 'value',
  },
  scale: {
    x: { type: 'point' },
  },
});

chart.render();
```

## Common variants

### Set padding

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'category', y: 'value' },
  scale: {
    x: {
      type: 'point',
      padding: 0.5,  // Padding at both ends, range [0, 1]
    },
  },
});
```

### Set alignment

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'category', y: 'value' },
  scale: {
    x: {
      type: 'point',
      align: 0.5,  // 0: left-aligned, 0.5: centered, 1: right-aligned
    },
  },
});
```

### Specify domain

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'category', y: 'value' },
  scale: {
    x: {
      type: 'point',
      domain: ['A', 'B', 'C', 'D'],  // Explicitly specify category order
    },
  },
});
```

### Specify range

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'category', y: 'value' },
  scale: {
    x: {
      type: 'point',
      range: [0.1, 0.9],  // Mapping range, default [0, 1]
    },
  },
});
```

## Complete type reference

```typescript
interface PointScaleOption {
  type: 'point';
  domain?: string[] | number[];  // Category domain
  range?: [number, number];      // Output range, default [0, 1]
  padding?: number;              // Padding, default 0
  align?: number;                // Alignment, default 0.5
  round?: boolean;               // Whether to round, default false
}
```

## Comparison with Band Scale

| Feature | Point Scale | Band Scale |
|------|-------------|------------|
| Bandwidth | 0 | Has bandwidth |
| Output | Exact point position | Interval start |
| Suitable for | Scatter plots and point plots | Column charts and bar charts |
| padding | Single value | paddingInner + paddingOuter |

## Automatic inference

G2 automatically infers the scale based on the mark type:
- Categorical axes of `interval` marks -> Band Scale
- Categorical axes of `point` marks -> Point Scale
- Categorical axes of `line` marks -> Band Scale

```javascript
// Automatically inferred as Point Scale
chart.options({
  type: 'point',
  data,
  encode: { x: 'category', y: 'value' },
  // scale: { x: { type: 'point' } }  // Can be omitted
});
```

## Common mistakes and fixes

### Mistake 1: using it for marks that require bandwidth (bar charts and heatmaps)

The `point` scale has bandwidth = 0. `interval` (bar chart) and `cell` (heatmap) marks rely on bandwidth to render shapes with area. Using the `point` scale for these marks makes bar or cell width 0, so the shapes are invisible.

```javascript
// ❌ Mistake: using point for a bar chart makes bar width 0
chart.options({
  type: 'interval',
  encode: { x: 'category', y: 'value' },
  scale: { x: { type: 'point' } },  // ❌ bandwidth=0, so bars disappear
});

// ❌ Mistake: using point for a heatmap makes cell width 0 (common misuse: "ensure even distribution")
chart.options({
  type: 'cell',
  encode: { x: 'date', y: 'month', color: 'value' },
  scale: {
    x: { type: 'point' },  // ❌ cell requires bandwidth
    y: { type: 'point' },  // ❌
  },
});

// ✅ Correct: use band for interval and cell (or omit it and let G2 infer automatically)
chart.options({
  type: 'cell',
  encode: { x: 'date', y: 'month', color: 'value' },
  scale: {
    x: { type: 'band' },   // ✅ Has bandwidth, so cells are visible
    y: { type: 'band' },   // ✅
  },
  // Or omit scale directly; cell marks default to band
});
```

**Marks suitable for `point`**: `point` (scatter plots) and `line` (line charts, for categorical x-axes).

### Mistake 2: padding value is too large

```javascript
// ❌ Mistake: padding is out of range
scale: { x: { type: 'point', padding: 1.5 } }

// ✅ Correct: padding is within the [0, 1] range
scale: { x: { type: 'point', padding: 0.5 } }
```

### Mistake 3: align value is invalid

```javascript
// ❌ Mistake: align is out of range
scale: { x: { type: 'point', align: 2 } }

// ✅ Correct: align is within the [0, 1] range
scale: { x: { type: 'point', align: 0.5 } }
```