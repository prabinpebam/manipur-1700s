---
id: "g2-mark-radial-bar"
title: "G2 Radial Bar Chart Mark"
description: |
 A radial bar chart uses the interval mark with a radial coordinate system to compare categorical data in a circular layout.
 It is best for attractive presentation scenarios where precise value comparison is less important than visual impact.

library: "g2"
version: "5.x"
category: "marks"
tags:
 - "radial bar chart"
 - "radial bar"
 - "circular bar chart"

related:
 - "g2-mark-interval-basic"
 - "g2-mark-rose"

use_cases:
 - "categorical data comparison"
 - "aesthetic presentation"
 - "large-screen visualization"

anti_patterns:
 - "Use a standard bar chart for precise value comparison"
 - "Sort data before rendering"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/mark/radial-bar"
---

## Core concepts

A radial bar chart is a bar chart adapted to a radial coordinate system:
- Use the `interval` mark.
- Combine it with the `radial` coordinate system.
- Use long-form data to show value magnitude.

**Notes:**
- Because values are represented by radius, outer bars can appear visually larger.
- Sort the data before rendering.
- Radial bars are better for aesthetic presentation than precise comparison.

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
 container: 'container',
 theme: 'classic',
});

chart.options({
 type: 'interval',
 data: [
 { question: 'Taiwan Strait relations', percent: 0.21 },
 { question: 'Military strength', percent: 0.47 },
 { question: 'Environmental impact', percent: 0.49 },
 ],
 coordinate: { type: 'radial', innerRadius: 0.2 },
 encode: {
 x: 'question',
 y: 'percent',
 color: 'question',
 },
 style: {
 radiusTopLeft: 4,
 radiusTopRight: 4,
 },
});

chart.render();
```

## Common variants

### Specify angle range

```javascript
chart.options({
 type: 'interval',
 coordinate: {
 type: 'radial',
 innerRadius: 0.3,
 startAngle: -Math.PI,
 endAngle: -0.25 * Math.PI,
 },
 data,
 encode: { x: 'category', y: 'value', color: 'category' },
});
```

### With labels

```javascript
chart.options({
 type: 'interval',
 coordinate: { type: 'radial', innerRadius: 0.2 },
 data,
 encode: { x: 'category', y: 'value', color: 'category' },
 labels: [
 {
 text: 'value',
 position: 'inside',
 style: { fontWeight: 'bold', fill: 'white' },
 },
 ],
});
```

### With interaction

```javascript
chart.options({
 type: 'interval',
 coordinate: { type: 'radial', innerRadius: 0.2 },
 data,
 encode: { x: 'category', y: 'value', color: 'category' },
 interaction: [
 { type: 'elementHighlight', background: true },
 ],
});
```

## Full type reference

```typescript
interface RadialBarOptions {
 type: 'interval';
 coordinate: {
 type: 'radial';
 innerRadius?: number; // inner radius
 startAngle?: number; // start angle
 endAngle?: number; // end angle
 };
 encode: {
 x: string; // category field, mapped to angle
 y: string; // value field, mapped to radius
 color?: string;
 };
}
```

## Radial bar chart vs. bar chart

| Feature | Radial bar chart | Bar chart |
|------|--------|--------|
| Coordinate system | Polar coordinates | Cartesian coordinates |
| Visual effect | More visually striking | More precise |
| Data comparison | Radius-based comparison | Accurate length-based comparison |

## Common errors and fixes

### Error 1: data is not sorted

```javascript
// ❌ Problem: unsorted data can make the visual ordering misleading.
data: [{ category: 'A', value: 100 }, { category: 'B', value: 50 }]

// ✅ Correct: sort data by value.
data: [{ category: 'B', value: 50 }, { category: 'A', value: 100 }]
```

### Error 2: using a polar coordinate system

```javascript
// ❌ Problem: polar coordinates produce a rose-chart style coordinate system.
coordinate: { type: 'polar' }

// ✅ Correct: use the radial coordinate system.
coordinate: { type: 'radial' }
```

### Error 3: too many categories

```javascript
// ⚠️ Note: keep the category count under about 15.
// Too many categories make the circular bars too narrow.
```

### Error 4: encode channels are mapped incorrectly

```javascript
// ❌ Problem: x maps to the value field and y maps to the category field, which is wrong in radial coordinates.
encode: {
 x: 'value', // x should map to the category field.
 y: 'category', // y should map to the value field.
}

// ✅ Correct: x maps to the category field, and y maps to the value field.
encode: {
 x: 'category', // x maps to category, then to angle.
 y: 'value', // y maps to value, then to radius.
}
```

### Error 5: transform sort direction is wrong

```javascript
// ❌ Problem: this sort direction may not produce the intended inside-to-outside ordering.
transform: [
 {
 type: 'sortX',
 by: 'value',
 reverse: false, // Should be true to increase from inside to outside.
 },
],

// ✅ Correct: use the intended sort direction.
transform: [
 {
 type: 'sortX',
 by: 'value',
 reverse: true, // Increase from inside to outside.
 },
],
// Alternatively, and often preferably, sort in the data layer first.
data: rawData.sort((a, b) => b.value - a.value)
```
