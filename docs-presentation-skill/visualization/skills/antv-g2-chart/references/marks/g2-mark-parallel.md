---
id: "g2-mark-parallel"
title: "G2 Parallel Coordinates Mark"
description: |
 A parallel coordinates chart combines the line mark with the parallel coordinate system to show relationships across multiple dimensions.
 It is used for multidimensional relationship analysis, cluster identification, and similar analytical scenarios.

library: "g2"
version: "5.x"
category: "marks"
tags:
 - "parallel coordinates"
 - "parallel"
 - "multidimensional data"
 - "relationship analysis"

related:
 - "g2-mark-radar"
 - "g2-mark-sankey"

use_cases:
 - "Analyze relationships in multidimensional data."
 - "Identify clusters in data."
 - "Support feature engineering workflows."

anti_patterns:
 - "Use a scatter plot when there are fewer than three dimensions."
 - "Avoid using this chart with very large datasets, such as more than 1,000 records."

difficulty: "intermediate"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/mark/parallel"
---

## Core concepts

Parallel coordinates show relationships across multiple dimensions:
- Use the `line` mark.
- Combine it with the `parallel` coordinate system.
- Each line represents one data record across multiple dimensions.

**Key characteristics:**
- Each axis represents a different dimension.
- The intervals between axes do not imply causal relationships.
- Axis order can be adjusted.

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
 container: 'container',
 theme: 'classic',
});

chart.options({
 type: 'line',
 autoFit: true,
 data: {
 type: 'fetch',
 value: 'https://assets.antv.antgroup.com/g2/cars3.json',
 },
 coordinate: { type: 'parallel' },
 encode: {
 position: [
 'economy (mpg)',
 'cylinders',
 'displacement (cc)',
 'power (hp)',
 ],
 color: 'weight (lb)',
 },
 style: {
 lineWidth: 1.5,
 strokeOpacity: 0.4,
 },
});

chart.render();
```

## Common variants

### Horizontal layout

```javascript
chart.options({
 type: 'line',
 coordinate: {
 type: 'parallel',
 transform: [{ type: 'transpose' }],
 },
 encode: {
 position: ['dim1', 'dim2', 'dim3'],
 color: 'category',
 },
});
```

### With interactive brushing

```javascript
chart.options({
 type: 'line',
 coordinate: { type: 'parallel' },
 data,
 encode: { position: ['A', 'B', 'C', 'D'], color: 'group' },
 interaction: {
 brushAxisHighlight: {
 maskFill: '#d8d0c0',
 maskOpacity: 0.3,
 },
 },
 state: {
 active: { lineWidth: 3, strokeOpacity: 1 },
 inactive: { stroke: '#ccc', opacity: 0.3 },
 },
});
```

### Smooth curve

```javascript
chart.options({
 type: 'line',
 coordinate: { type: 'parallel' },
 data,
 encode: {
 position: ['A', 'B', 'C'],
 color: 'category',
 shape: 'smooth', // Smooth curve.
 },
});
```

## Full type reference

```typescript
interface ParallelOptions {
 type: 'line';
 coordinate: {
 type: 'parallel';
 transform?: [{ type: 'transpose' }];
 };
 encode: {
 position: string[]; // Multiple dimension fields.
 color?: string; // Category field.
 };
 style: {
 lineWidth?: number;
 strokeOpacity?: number;
 };
}
```

## Parallel coordinates vs line chart

| Feature | Parallel coordinates | Polyline chart |
|------|------------|--------|
| Use case | Multidimensional relationships | Time trends |
| Axis meaning | Different dimensions | Time series |
| Line meaning | One record | One metric |

## Common errors and fixes

### Error 1: using the wrong coordinate system

```javascript
// ❌ Problem: the default coordinate system is used.
coordinate: {}

// ✅ Correct: use the parallel coordinate system.
coordinate: { type: 'parallel' }
```

### Error 2: incorrect position encoding

```javascript
// ❌ Problem: using x/y encodings.
encode: { x: 'dim1', y: 'dim2' }

// ✅ Correct: use a position array.
encode: { position: ['dim1', 'dim2', 'dim3'] }
```

### Error 3: too few dimensions

```javascript
// ⚠️ Note: at least four dimensions are recommended.
// Use a scatter plot for two or three dimensions.
```
