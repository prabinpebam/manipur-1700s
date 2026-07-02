---
id: "g2-mark-rose"
title: "G2 Rose Chart Mark"
description: |
  A rose chart is built with the interval mark and a polar coordinate system.
  It uses sector radius to represent value size and is useful for comparing categories or displaying periodic data.

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "rose chart"
  - "rose"
  - "Nightingale chart"
  - "polar coordinates"

related:
  - "g2-mark-arc-pie"
  - "g2-coord-polar"

use_cases:
  - "categorical data comparison"
  - "periodic data display"
  - "multidimensional comparison"

anti_patterns:
  - "Use a pie chart when there are too few categories"
  - "Not suitable when values differ dramatically"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/mark/rose"
---

## Core concepts

A rose chart draws a bar chart in a polar coordinate system:
- Use the `interval` mark.
- Combine it with the `polar` coordinate system.
- Use sector radius to represent value size.

**Difference from a pie chart:**
- Pie chart: radians represent values.
- Rose chart: radius represents values.

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  theme: 'classic',
});

chart.options({
  type: 'interval',
  autoFit: true,
  coordinate: { type: 'polar' },
  data: [
  { country: 'China', cost: 96 },
  { country: 'Germany', cost: 121 },
  { country: 'United States', cost: 100 },
  { country: 'Japan', cost: 111 },
  ],
  encode: {
  x: 'country',
  y: 'cost',
  color: 'country',
  },
  style: {
  stroke: 'white',
  lineWidth: 1,
  },
});

chart.render();
```

## Common variants

### Stacked rose chart

```javascript
chart.options({
  type: 'interval',
  coordinate: { type: 'polar', innerRadius: 0.1 },
  data,
  encode: { x: 'year', y: 'count', color: 'type' },
  transform: [{ type: 'stackY' }],
});
```

### Sector rose chart

```javascript
chart.options({
  type: 'interval',
  coordinate: {
  type: 'polar',
  startAngle: Math.PI,
  endAngle: Math.PI * (3 / 2),
  },
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
});
```

### With labels

```javascript
chart.options({
  type: 'interval',
  coordinate: { type: 'polar' },
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  labels: [
  {
  text: 'value',
  style: { textAlign: 'center', fontSize: 10 },
  },
  ],
});
```

## Full type reference

```typescript
interface RoseOptions {
  type: 'interval';
  coordinate: {
  type: 'polar';
  innerRadius?: number; // Inner radius
  startAngle?: number; // Start angle
  endAngle?: number; // End angle
  };
  encode: {
  x: string; // Category field
  y: string; // Value field
  color?: string;
  };
  transform?: [{ type: 'stackY' }]; // Stacking
}
```

## Rose chart vs pie chart

| Feature | Rose chart | Pie chart |
|------|--------|------|
| Value mapping | Radius | Radians |
| Number of categories | More | Fewer |
| Comparison direction | Radius comparison | Area comparison |

## Common errors and fixes

### Error 1: using the theta coordinate system

```javascript
// ❌ Problem: theta is the coordinate system for pie charts.
coordinate: { type: 'theta' }

// ✅ Correct: use the polar coordinate system.
coordinate: { type: 'polar' }
```

### Error 2: data is not sorted

```javascript
// ⚠️ Note: rose charts are easier to read when the data is sorted.
// You can use the sortX transform.
transform: [{ type: 'sortX', by: 'y' }]
```

### Error 3: too many categories

```javascript
// ⚠️ Note: keep the number of categories below about 30.
// Too many categories make sectors too narrow to read.
```
