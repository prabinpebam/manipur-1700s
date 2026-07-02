---
id: "g2-mark-radar"
title: "G2 Radar Chart (Polar Coordinates with Area and Line Marks)"
description: |
 In G2 v5, radar charts are implemented with coordinate: { type: 'polar' } plus area and line marks.
 Use long-form data where encode.x maps the dimension field, encode.y maps the numeric field, and encode.color distinguishes multiple series.

library: "g2"
version: "5.x"
category: "marks"
tags:
 - "chart"
 - "radar"
 - "polar"
 - "polar coordinates"
 - "grid chart"
 - "multidimensional metrics"
 - "spec"

related:
 - "g2-core-view-composition"
 - "g2-mark-area-basic"
 - "g2-mark-line-basic"

use_cases:
 - "Compare multidimensional metrics or KPI scores"
 - "Compare scores across multiple objects or products"
 - "Evaluate products across several dimensions"

anti_patterns:
 - "Avoid more than eight dimensions because labels may overlap; consider a flat coordinate chart instead"
 - "Normalize dimensions first when units or scales differ significantly"

difficulty: "intermediate"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/radar"
---

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
 container: 'container',
 width: 480,
 height: 480,
});

const data = [
 { item: 'Design', type: 'Product A', score: 70 },
 { item: 'Performance', type: 'Product A', score: 60 },
 { item: 'Usability', type: 'Product A', score: 50 },
 { item: 'Reliability', type: 'Product A', score: 80 },
 { item: 'Support', type: 'Product A', score: 90 },
 { item: 'Design', type: 'Product B', score: 40 },
 { item: 'Performance', type: 'Product B', score: 75 },
 { item: 'Usability', type: 'Product B', score: 85 },
 { item: 'Reliability', type: 'Product B', score: 55 },
 { item: 'Support', type: 'Product B', score: 65 },
];

chart.options({
 type: 'view',
 data,
 coordinate: { type: 'polar' }, // Key point: use polar coordinates.
 scale: {
 x: { padding: 0.5, align: 0 },
 y: { tickCount: 5, domainMin: 0, domainMax: 100 },
 },
 axis: {
 x: { grid: true },
 y: { zIndex: 1, title: false },
 },
 children: [
 {
 type: 'area',
 encode: { x: 'item', y: 'score', color: 'type' },
 style: { fillOpacity: 0.2 },
 },
 {
 type: 'line',
 encode: { x: 'item', y: 'score', color: 'type' },
 style: { lineWidth: 2 },
 },
 ],
});

chart.render();
```

## Radar chart with data points

```javascript
chart.options({
 type: 'view',
 data,
 coordinate: { type: 'polar' },
 scale: {
 x: { padding: 0.5, align: 0 },
 y: { tickCount: 5, domainMin: 0 },
 },
 axis: {
 x: { grid: true, labelFontSize: 13 },
 y: { zIndex: 1, title: false, label: false }, // Hide y-axis labels and show only the grid.
 },
 children: [
 {
 type: 'area',
 encode: { x: 'item', y: 'score', color: 'type' },
 style: { fillOpacity: 0.15 },
 },
 {
 type: 'line',
 encode: { x: 'item', y: 'score', color: 'type' },
 style: { lineWidth: 2 },
 },
 {
 type: 'point',
 encode: { x: 'item', y: 'score', color: 'type' },
 style: { r: 4, fill: 'white', lineWidth: 2 },
 },
 ],
 legend: { color: { position: 'top' } },
 interaction: [{ type: 'tooltip' }],
});
```

## Single-series radar chart (solid fill)

```javascript
const singleData = [
 { item: 'Attack', score: 85 },
 { item: 'Defense', score: 72 },
 { item: 'Speed', score: 90 },
 { item: 'Magic', score: 60 },
 { item: 'Stamina', score: 78 },
 { item: 'Luck', score: 66 },
];

chart.options({
 type: 'view',
 data: singleData,
 coordinate: { type: 'polar' },
 scale: {
 x: { padding: 0.5, align: 0 },
 y: { tickCount: 4, domainMin: 0, domainMax: 100 },
 },
 axis: {
 x: { grid: true, labelFontSize: 14 },
 y: { zIndex: 1, title: false },
 },
 children: [
 {
 type: 'area',
 encode: { x: 'item', y: 'score' },
 style: { fill: '#1890ff', fillOpacity: 0.25 },
 },
 {
 type: 'line',
 encode: { x: 'item', y: 'score' },
 style: { stroke: '#1890ff', lineWidth: 2 },
 },
 {
 type: 'point',
 encode: { x: 'item', y: 'score' },
 style: { r: 5, fill: '#1890ff' },
 labels: [{ text: (d) => d.score, position: 'top', style: { fontSize: 11 } }],
 },
 ],
});
```

## Common errors and fixes

### Error 1: forgetting polar coordinates, producing an ordinary area/line chart
```javascript
// ❌ Missing coordinate: this renders an ordinary area or line chart instead of a radar chart.
chart.options({
 type: 'view',
 data,
 // Missing coordinate: { type: 'polar' }.
 children: [{ type: 'area', ... }],
});

// ✅ Correct: use polar coordinates.
chart.options({
 type: 'view',
 data,
 coordinate: { type: 'polar' }, // ✅ Key point.
 children: [{ type: 'area', ... }],
});
```

### Error 2: data format uses a wide table

```javascript
// ❌ A wide table cannot directly use color to distinguish series.
const wrongData = [
 { item: 'Design', A: 70, B: 40 },
 { item: 'Performance', A: 60, B: 75 },
];

// ✅ Correct: use long-form data, where each row is one data point plus a series field.
const correctData = [
 { item: 'Design', type: 'A', score: 70 },
 { item: 'Design', type: 'B', score: 40 },
 { item: 'Performance', type: 'A', score: 60 },
 { item: 'Performance', type: 'B', score: 75 },
];
```

### Error 3: inconsistent dimension units cause visual distortion

```javascript
// ❌ Dimensions with very different scales, such as 0-100 and 0-10,000, can severely distort the shape.
const data = [
 { item: 'Sales', score: 8500 }, // Unit: 10,000 currency units.
 { item: 'Score', score: 85 }, // Unit: points out of 100.
];

// ✅ Normalize values to a shared 0-100 scale before drawing.
const normalized = data.map(d => ({
 ...d,
 score: (d.score / maxScores[d.item]) * 100,
}));
```
