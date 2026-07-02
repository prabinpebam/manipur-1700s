---
id: "g2-mark-range-rangey"
title: "G2 range / rangeX / rangeY Region Annotations"
description: |
 range, rangeX, and rangeY are G2 v5 marks for drawing rectangular region annotations.
 rangeX annotates intervals along the X axis as vertical bands, often to highlight time periods.
 rangeY annotates intervals along the Y axis as horizontal bands, often to highlight value ranges.
 range annotates a rectangular region in both X and Y directions.
 These marks are commonly overlaid with other marks as background region annotations.

library: "g2"
version: "5.x"
category: "marks"
tags:
 - "range"
 - "rangeX"
 - "rangeY"
 - "region annotation"
 - "highlight range"
 - "background highlight"
 - "annotation"

related:
 - "g2-mark-linex-liney"
 - "g2-mark-connector"
 - "g2-comp-annotation"

use_cases:
 - "Highlight a time period on a line chart"
 - "Annotate normal, warning, or target value ranges"
 - "Highlight reference regions in comparison charts"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/extra-topics/annotation#rangex"
---

## Comparison of the three range marks

| Mark | Data format | encode | Use case |
|------|---------|--------|------|
| `rangeX` | `[{ start: v1, end: v2 }]` | `x: 'start', x1: 'end'` | X-axis interval as a vertical band; the usual choice for time periods |
| `rangeY` | `[{ min: v1, max: v2 }]` | `y: 'min', y1: 'max'` | Y-axis interval as a horizontal band; the usual choice for value ranges |
| `range` | `[{ x: [v1,v2], y: [v1,v2] }]` | `x: 'x', y: 'y'` | Two-dimensional rectangle where x and y fields are arrays; used less often |

> **Selection principle**: use `rangeX` when you only need to highlight an X-direction time segment; use `rangeY` when you only need to highlight a Y-direction value range; use `range` when you need a rectangular region defined by both X and Y ranges.

## RangeX highlighting a time period

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 800, height: 400 });

chart.options({
 type: 'view',
 data: timeSeriesData,
 encode: { x: 'date', y: 'value' },
 children: [
 // Main line chart.
 { type: 'line' },
 // X-axis range annotation that highlights a period.
 {
 type: 'rangeX',
 data: [
 { start: '2024-11-01', end: '2024-11-30', label: 'Double 11' },
 ],
 encode: {
 x: 'start', // Range start.
 x1: 'end', // Range end.
 },
 style: {
 fill: '#ff4d4f',
 fillOpacity: 0.1,
 },
 },
 ],
});

chart.render();
```

## RangeY annotating a value range

```javascript
chart.options({
 type: 'view',
 data,
 encode: { x: 'date', y: 'value' },
 children: [
 { type: 'line' },
 // Y-axis range annotation for a normal range.
 {
 type: 'rangeY',
 data: [{ min: 60, max: 100, label: 'Normal Range' }],
 encode: {
 y: 'min', // Lower bound.
 y1: 'max', // Upper bound.
 },
 style: {
 fill: '#52c41a',
 fillOpacity: 0.08,
 stroke: '#52c41a',
 strokeOpacity: 0.3,
 lineWidth: 1,
 lineDash: [4, 4],
 },
 },
 ],
});
```

## Two-dimensional rectangular range

> ⚠️ **The `range` data format differs from `rangeX` and `rangeY`**: the `x` and `y` fields are `[start, end]` arrays. The encode configuration only needs `x` and `y`; it does **not** require `x1` or `y1`.

```javascript
// Scatter plot four-quadrant background colors, setting both X and Y ranges.
chart.options({
 type: 'view',
 children: [
 {
 type: 'point',
 data: scatterData,
 encode: { x: 'changeX', y: 'changeY' },
 },
 {
 type: 'range',
 // ✅ x and y field values are [start, end] arrays.
 data: [
 { x: [-25, 0], y: [-30, 0], region: 'Q3' },
 { x: [-25, 0], y: [0, 20], region: 'Q2' },
 { x: [0, 5], y: [-30, 0], region: 'Q4' },
 { x: [0, 5], y: [0, 20], region: 'Q1' },
 ],
 encode: { x: 'x', y: 'y', color: 'region' }, // ✅ encode only needs x and y.
 style: { fillOpacity: 0.15 },
 },
 ],
});
```

## Annotating thresholds together with lineX/lineY

```javascript
// RangeY background annotation plus a lineY threshold annotation.
chart.options({
 type: 'view',
 data,
 children: [
 { type: 'line', encode: { x: 'date', y: 'value' } },
 // Danger zone background.
 {
 type: 'rangeY',
 data: [{ min: 80, max: 100 }],
 encode: { y: 'min', y1: 'max' },
 style: { fill: '#ff4d4f', fillOpacity: 0.08 },
 },
 // Threshold line.
 {
 type: 'lineY',
 data: [{ y: 80 }],
 encode: { y: 'y' },
 style: { stroke: '#ff4d4f', lineWidth: 1, lineDash: [4, 4] },
 },
 ],
});
```

## Common errors and fixes

### ❌ Error: using non-existent regionX / regionY mark types
```javascript
// ❌ Error: regionX and regionY are concepts in some libraries, but they are not G2 mark types.
chart.options({ type: 'regionX', ... });
chart.options({ type: 'regionY', ... });

// ✅ Correct: G2 uses rangeX and rangeY.
chart.options({ type: 'rangeX', encode: { x: 'start', x1: 'end' } });
chart.options({ type: 'rangeY', encode: { y: 'start', y1: 'end' } });
```

### ❌ Error: using x1/y1 with range, confusing it with rangeX/rangeY syntax

```javascript
// ❌ Error: range does not use x1/y1; its x and y fields are [start, end] arrays.
chart.options({
 type: 'range',
 data: [{ x0: 20, x1: 40, y0: 50, y1: 80 }],
 encode: { x: 'x0', x1: 'x1', y: 'y0', y1: 'y1' }, // ❌
});

// ✅ Correct: x/y field values are arrays.
chart.options({
 type: 'range',
 data: [{ x: [20, 40], y: [50, 80] }],
 encode: { x: 'x', y: 'y' }, // ✅
});

// 💡 In many cases, use rangeX or rangeY instead of range:
// - To highlight only the X direction, use rangeX (encode: { x: 'start', x1: 'end' }).
// - To highlight only the Y direction, use rangeY (encode: { y: 'min', y1: 'max' }).
```

### ❌ Error: omitting encode, the most common cause of regions not rendering

`rangeY` and `rangeX` require an explicit `encode`; G2 cannot infer range start and end fields automatically from field names.

```javascript
// ❌ Error: missing encode; the region will not render.
{
 type: 'rangeY',
 data: [{ y: 54, y1: 72 }],
 style: { fill: '#FF0000', fillOpacity: 0.1 },
 // ❌ Missing encode.
}

// ✅ Correct: write encode explicitly to map field names.
{
 type: 'rangeY',
 data: [{ y: 54, y1: 72 }],
 encode: { y: 'y', y1: 'y1' }, // ✅ Tell G2 which fields are the lower and upper bounds.
 style: { fill: '#FF0000', fillOpacity: 0.1 },
}

// ✅ Field names can be arbitrary; the key is that encode matches the data fields.
{
 type: 'rangeY',
 data: [{ lower: 54, upper: 72 }],
 encode: { y: 'lower', y1: 'upper' }, // ✅ Field names only need to match the data.
 style: { fill: '#FF0000', fillOpacity: 0.1 },
}
```

### ❌ Error: rangeX only writes x without x1
```javascript
// ❌ Error: rangeX requires both x (start) and x1 (end) encodings.
chart.options({
 type: 'rangeX',
 data: [{ start: 10, end: 20 }],
 encode: { x: 'start' }, // ❌ Missing x1.
});

// ✅ Correct
chart.options({
 type: 'rangeX',
 data: [{ start: 10, end: 20 }],
 encode: { x: 'start', x1: 'end' }, // ✅ Both x and x1 are present.
});
```
