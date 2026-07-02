---
id: "g2-mark-point-scatter"
title: "G2 Scatter Plot (Point Mark)"
description: |
 Create scatter plots with the point mark, using x/y positions to show correlation between two numeric variables.
 This article uses Spec mode (chart.options({})) and covers variants such as bubble charts, categorical coloring, and custom shapes.

library: "g2"
version: "5.x"
category: "marks"
subcategory: "point"
tags:
 - "scatter plot"
 - "chart"
 - "point"
 - "scatter"
 - "bubble"
 - "correlation"
 - "distribution"
 - "spec"

related:
 - "g2-core-encode-channel"
 - "g2-scale-linear"
 - "g2-interaction-tooltip"

use_cases:
 - "Show correlation between two continuous variables"
 - "Discover data distributions and outliers"
 - "Use size to show a third numeric dimension"

anti_patterns:
 - "For more than 10,000 points, consider sampling or using a density chart"
 - "Scatter plots are not useful when both axes are categorical"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/point/scatter"
---

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
 { x: 10, y: 30, category: 'A' },
 { x: 20, y: 50, category: 'B' },
 { x: 30, y: 20, category: 'A' },
 { x: 40, y: 80, category: 'B' },
 { x: 50, y: 40, category: 'A' },
 { x: 60, y: 65, category: 'B' },
 ],
 encode: {
 x: 'x',
 y: 'y',
 color: 'category',
 },
});

chart.render();
```

## Bubble chart with three numeric dimensions

Bubble style guidelines: avoid white strokes, which can look broken on light backgrounds. Prefer radial gradients, shadows, and higher fill opacity. Use a sqrt size scale with an explicit size.range, such as [4, 40]. Hide the size legend when it adds little value. Use dashed axis grids and overlapDodgeY for labels.

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 700, height: 500 });

const data1990 = [
 { income: 28604, life: 77, population: 17096869, country: 'Australia' },
 { income: 31163, life: 77.4, population: 27662440, country: 'Canada' },
 { income: 1516, life: 68, population: 1154605773, country: 'China' },
 { income: 29476, life: 77.1, population: 56943299, country: 'France' },
 { income: 29550, life: 79.1, population: 122249285, country: 'Japan' },
 { income: 37062, life: 75.4, population: 252847810, country: 'United States' },
];

const data2015 = [
 { income: 44056, life: 81.8, population: 23968973, country: 'Australia' },
 { income: 43294, life: 81.7, population: 35939927, country: 'Canada' },
 { income: 13334, life: 76.9, population: 1376048943, country: 'China' },
 { income: 37599, life: 81.9, population: 64395345, country: 'France' },
 { income: 36162, life: 83.5, population: 126573481, country: 'Japan' },
 { income: 53354, life: 79.1, population: 321773631, country: 'United States' },
];

const allData = [
 ...data1990.map(d => ({ ...d, year: '1990' })),
 ...data2015.map(d => ({ ...d, year: '2015' })),
];

// Shared color map used by both scale.color.range and the fill callback.
const COLOR_MAP = { '1990': '#fb7678', '2015': '#81e7ee' };

chart.options({
 type: 'point',
 data: allData,
 encode: {
 x: 'income',
 y: 'life',
 size: 'population', // Size encodes the third numeric dimension.
 color: 'year',
 shape: 'point',
 },
 scale: {
 size: { type: 'sqrt', range: [4, 40] }, // sqrt scaling plus an explicit range.
 color: { domain: ['1990', '2015'], range: Object.values(COLOR_MAP) },
 },
 style: {
 fillOpacity: 0.85,
 lineWidth: 0,
 // Radial gradient and shadow simulate a subtle 3D sphere texture.
 // Use COLOR_MAP[datum.year] so the fill callback stays consistent with scale.color.range.
 fill: (datum) => {
 const color = COLOR_MAP[datum.year];
 return `radial-gradient(circle at 35% 35%, rgb(255,255,255) 0%, ${color} 100%)`;
 },
 shadowBlur: 10,
 shadowColor: 'rgba(0, 0, 0, 0.15)',
 shadowOffsetY: 5,
 },
 legend: { size: false }, // The size legend is often not useful, so hide it.
 labels: [
 { text: 'country', fontSize: 12, fontWeight: 700, fill: '#2D3748', dy: 10,
 transform: [{ type: 'overlapDodgeY' }] },
 ],
 axis: {
 x: { grid: true, gridLineDash: [4, 4], gridStrokeOpacity: 0.3 },
 y: { grid: true, gridLineDash: [4, 4], gridStrokeOpacity: 0.3 },
 },
 tooltip: {
 title: (d) => `${d.country} (${d.year})`,
 items: [
 { field: 'income', name: 'Per capita income' },
 { field: 'life', name: 'Life expectancy' },
 { field: 'population', name: 'Population', valueFormatter: (v) => `${(v / 1e6).toFixed(1)}M` },
 ],
 },
});

chart.render();
```

> For the complete bubble style recipe, including radial gradients and shadows, see the [bubble chart documentation](g2-mark-point-bubble.md).

## Custom point shapes

```javascript
chart.options({
 type: 'point',
 data: [...],
 encode: {
 x: 'x',
 y: 'y',
 color: 'type',
 shape: 'type', // Map the type field to the shape channel.
 },
 scale: {
 shape: {
 range: ['circle', 'square', 'triangle', 'diamond'],
 },
 },
});
```

## Scatter plot with trend line

```javascript
// Use type: 'view' with children to overlay scatter points and a regression trend line.
chart.options({
 type: 'view',
 data: [...],
 children: [
 {
 type: 'point',
 encode: { x: 'x', y: 'y' },
 },
 {
 type: 'line',
 encode: { x: 'x', y: 'y' },
 transform: [{ type: 'regression' }],
 style: { stroke: '#f00', lineWidth: 1.5 },
 },
 ],
});
```

## Common errors and fixes

### Error 1: performance issues with large datasets
```javascript
// ❌ Rendering too many points can hurt performance.
chart.options({ type: 'point', data: hugeDataWith100000Points, encode: { x: 'x', y: 'y' } });

// ✅ Option 1: sample the data before rendering.
chart.options({ type: 'point', sampledData, encode: { x: 'x', y: 'y' } });

// ✅ Option 2: use a density chart to show distribution.
chart.options({ type: 'density', [...], encode: { x: 'x', y: 'y' } });
```

### Error 2: size channel uses a string constant
```javascript
// ❌ A string passed to size is interpreted as a field name.
chart.options({ type: 'point', encode: { size: '10' } }); // Interprets '10' as a field name.

// ✅ Use a number for a fixed size, or a field name string for data-driven size.
chart.options({ type: 'point', encode: { size: 10 } }); // Fixed size 10.
chart.options({ type: 'point', encode: { size: 'population' } }); // Maps a data field.
```
