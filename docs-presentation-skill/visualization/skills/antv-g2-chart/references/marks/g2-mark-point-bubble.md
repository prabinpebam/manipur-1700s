---
id: "g2-mark-point-bubble"
title: "G2 Bubble Chart"
description: |
 A bubble chart extends a scatter plot by using the size channel to encode a third numeric dimension.
 Bind a numeric field to encode.size, and G2 automatically maps values to circle area rather than radius.
 Bubble charts are useful for showing relationships among three numeric dimensions at the same time.
 
 Style guidelines:
 1. Avoid white strokes (stroke: '#fff'); on light themes they can make bubbles look broken.
 2. Use radial-gradient fills and shadows to simulate a subtle 3D sphere effect.
 3. Define a COLOR_MAP shared by scale.color.range and the fill callback to keep colors consistent.
 4. Use a sqrt size scale so bubble area is proportional to the value.
 5. Set size.range thoughtfully (recommended [4, 40]) to avoid extreme size differences.
 6. Use dashed axis grids (gridLineDash) for a cleaner background.

library: "g2"
version: "5.x"
category: "marks"
tags:
 - "bubble chart"
 - "bubble"
 - "scatter plot"
 - "point"
 - "three numeric dimensions"
 - "size"

related:
 - "g2-mark-point-scatter"
 - "g2-scale-linear"
 - "g2-scale-pow-sqrt"

use_cases:
 - "Show relationships among GDP, population, and life expectancy"
 - "Encode a third metric with bubble size"
 - "Compare grouped numeric observations"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/point/#bubble"
---

## Minimal runnable example

Design: radial-gradient fill, shadow, sqrt size scaling, dashed grid lines, and two-series comparison.

```javascript
import { Chart } from '@antv/g2';

// Data: GDP per capita, life expectancy, population, country, and year.
const data1990 = [
 { income: 28604, life: 77, population: 17096869, country: 'Australia' },
 { income: 31163, life: 77.4, population: 27662440, country: 'Canada' },
 { income: 1516, life: 68, population: 1154605773, country: 'China' },
 { income: 13670, life: 74.7, population: 10582082, country: 'Cuba' },
 { income: 28599, life: 75, population: 4986705, country: 'Finland' },
 { income: 29476, life: 77.1, population: 56943299, country: 'France' },
 { income: 31476, life: 75.4, population: 78958237, country: 'Germany' },
 { income: 28666, life: 78.1, population: 254830, country: 'Iceland' },
 { income: 1777, life: 57.7, population: 870601776, country: 'India' },
 { income: 29550, life: 79.1, population: 122249285, country: 'Japan' },
 { income: 2076, life: 67.9, population: 20194354, country: 'North Korea' },
 { income: 12087, life: 72, population: 42972254, country: 'South Korea' },
 { income: 24021, life: 75.4, population: 3397534, country: 'New Zealand' },
 { income: 43296, life: 76.8, population: 4240375, country: 'Norway' },
 { income: 10088, life: 70.8, population: 38195258, country: 'Poland' },
 { income: 19349, life: 69.6, population: 147568552, country: 'Russia' },
 { income: 10670, life: 67.3, population: 53994605, country: 'Turkey' },
 { income: 26424, life: 75.7, population: 57110117, country: 'United Kingdom' },
 { income: 37062, life: 75.4, population: 252847810, country: 'United States' },
];

const data2015 = [
 { income: 44056, life: 81.8, population: 23968973, country: 'Australia' },
 { income: 43294, life: 81.7, population: 35939927, country: 'Canada' },
 { income: 13334, life: 76.9, population: 1376048943, country: 'China' },
 { income: 21291, life: 78.5, population: 11389562, country: 'Cuba' },
 { income: 38923, life: 80.8, population: 5503457, country: 'Finland' },
 { income: 37599, life: 81.9, population: 64395345, country: 'France' },
 { income: 44053, life: 81.1, population: 80688545, country: 'Germany' },
 { income: 42182, life: 82.8, population: 329425, country: 'Iceland' },
 { income: 5903, life: 66.8, population: 1311050527, country: 'India' },
 { income: 36162, life: 83.5, population: 126573481, country: 'Japan' },
 { income: 1390, life: 71.4, population: 25155317, country: 'North Korea' },
 { income: 34644, life: 80.7, population: 50293439, country: 'South Korea' },
 { income: 34186, life: 80.6, population: 4528526, country: 'New Zealand' },
 { income: 64304, life: 81.6, population: 5210967, country: 'Norway' },
 { income: 24787, life: 77.3, population: 38611794, country: 'Poland' },
 { income: 23038, life: 73.13, population: 143456918, country: 'Russia' },
 { income: 19360, life: 76.5, population: 78665830, country: 'Turkey' },
 { income: 38225, life: 81.4, population: 64715810, country: 'United Kingdom' },
 { income: 53354, life: 79.1, population: 321773631, country: 'United States' },
];

const allData = [
 ...data1990.map(d => ({ ...d, year: '1990' })),
 ...data2015.map(d => ({ ...d, year: '2015' })),
];

// Shared color map used by both scale.color.range and the fill callback.
const COLOR_MAP = { '1990': '#fb7678', '2015': '#81e7ee' };

const chart = new Chart({ container: 'container', width: 800, height: 500 });

chart.options({
 type: 'view',
 data: allData,
 children: [
 {
 type: 'point',
 encode: {
 x: 'income',
 y: 'life',
 size: 'population',
 color: 'year',
 shape: 'point',
 },
 scale: {
 size: { type: 'sqrt', range: [4, 40] }, // ✅ sqrt scaling keeps area proportional to value.
 color: { domain: ['1990', '2015'], range: Object.values(COLOR_MAP) },
 y: { nice: true },
 },
 style: {
 fillOpacity: 0.85,
 lineWidth: 0,
 // ✅ Radial gradient: blend from a light center to the mapped color at the edge for a 3D sphere effect.
 // Use COLOR_MAP[datum.year] so the fill callback stays consistent with scale.color.range.
 // Note: datum.year contains the original channel value, such as '1990', not the mapped color.
 fill: (datum) => {
 const color = COLOR_MAP[datum.year];
 return `radial-gradient(circle at 35% 35%, rgb(255,255,255) 0%, ${color} 100%)`;
 },
 // ✅ Shadow: adds a subtle floating effect.
 shadowBlur: 10,
 shadowColor: 'rgba(0, 0, 0, 0.15)',
 shadowOffsetY: 5,
 },
 legend: { size: false },
 labels: [
 { text: 'country', position: 'outside', fontSize: 11, fill: '#333',
 transform: [{ type: 'overlapDodgeY' }] },
 ],
 tooltip: {
 title: (d) => `${d.country} (${d.year})`,
 items: [
 { channel: 'x', name: 'GDP per capita', valueFormatter: (v) => `$${v}` },
 { channel: 'y', name: 'Life expectancy', valueFormatter: (v) => `${v} years` },
 { channel: 'size', name: 'Population', valueFormatter: (v) => `${(v / 1e6).toFixed(1)}M` },
 ],
 },
 },
 ],
 axis: {
 x: { title: 'GDP per capita ($)', grid: true, gridLineDash: [4, 4], gridStrokeOpacity: 0.3 },
 y: { title: 'Life expectancy (years)', grid: true, gridLineDash: [4, 4], gridStrokeOpacity: 0.3 },
 },
});

chart.render();
```

> **Design notes**:
> - **Radial gradient** (`radial-gradient`) blends from a light center to the mapped color at the edge, creating a sphere-like texture.
> - **Shadow** (`shadowBlur` + `shadowColor` + `shadowOffsetY`) creates a subtle floating effect.
> - **Sqrt scaling** keeps bubble area proportional to the value, rather than radius.
> - **Dashed grid lines** (`gridLineDash: [4, 4]`) keep the background unobtrusive.
> - **Two-series comparison** (1990 vs 2015) uses color to distinguish the time dimension.
> - **Hidden size legend** (`legend: { size: false }`) avoids a legend that is often not useful to readers.

## Configuring the size scale

```javascript
scale: {
 size: {
 type: 'sqrt', // ✅ Recommended: sqrt scaling keeps area proportional to value.
 range: [4, 40], // [minimum radius, maximum radius] in pixels.
 // G2 maps size by area rather than radius, which is usually more visually accurate.
 // A range of 4 to 40 is recommended to avoid invisible or overly dominant bubbles.
 },
}
```

> **Why use sqrt?** The size channel in a bubble chart maps to circle area. With linear radius scaling, area is not linearly proportional to value because area = πr².
> With sqrt scaling, radius = √value, so area = π(√value)² = π × value, making the visual area proportional to the data value.
> For details, see the [sqrt scale documentation](g2-scale-pow-sqrt.md).

## Bubble style best practices

### ✅ Recommended: radial gradient, shadow, sqrt scaling, and dashed grid lines
```javascript
chart.options({
 type: 'point',
 encode: { x: 'income', y: 'life', size: 'population', color: 'year' },
 scale: {
 size: { type: 'sqrt', range: [4, 40] }, // sqrt scaling
 color: { domain: ['1990', '2015'], range: Object.values(COLOR_MAP) },
 },
 style: {
 fillOpacity: 0.85,
 lineWidth: 0,
 // Radial gradient: blend from a light center to the mapped color at the edge for a 3D sphere effect.
 // Use COLOR_MAP[datum.year] so the fill callback stays consistent with scale.color.range.
 fill: (datum) => {
 const color = COLOR_MAP[datum.year];
 return `radial-gradient(circle at 35% 35%, rgb(255,255,255) 0%, ${color} 100%)`;
 },
 // Shadow: adds a subtle floating effect.
 shadowBlur: 10,
 shadowColor: 'rgba(0, 0, 0, 0.15)',
 shadowOffsetY: 5,
 },
 legend: { size: false },
 axis: {
 x: { grid: true, gridLineDash: [4, 4], gridStrokeOpacity: 0.3 },
 y: { grid: true, gridLineDash: [4, 4], gridStrokeOpacity: 0.3 },
 },
});
```

### ❌ Avoid: white strokes and low-opacity fills
```javascript
// ❌ A white stroke can disappear on light backgrounds, and low fill opacity can make bubbles look hollow.
chart.options({
 style: {
 fillOpacity: 0.7, // Too low for this style.
 stroke: '#fff', // Hard to see on light backgrounds.
 lineWidth: 1,
 },
});
```

## Common errors and fixes

### Error 1: size channel uses a string category instead of a numeric value
```javascript
// ❌ Error: the size channel should reference a numeric field, not a category.
chart.options({
 encode: {
 size: 'country', // ❌ String category; cannot be mapped meaningfully to size.
 },
});

// ✅ Correct: map size to a numeric field.
chart.options({
 encode: {
 size: 'population', // ✅ Numeric value that can be mapped to size.
 },
});
```

### Error 2: scale.size.range is not set, causing bubbles to be too small or too large
```javascript
// ❌ The default range may produce bubbles that overlap too much or are difficult to see.
chart.options({
 encode: { size: 'value' },
 // ❌ Missing scale.size.range.
});

// ✅ Set an explicit size range; [4, 40] is a good starting point.
chart.options({
 encode: { size: 'value' },
 scale: {
 size: { type: 'sqrt', range: [4, 40] }, // ✅ sqrt scaling plus a controlled visual range.
 },
});
```

### Error 3: using a white stroke (stroke: '#fff') makes the chart look wrong on light themes
```javascript
// ❌ The stroke can disappear against a light background, especially with low fill opacity.
chart.options({
 style: { fillOpacity: 0.7, stroke: '#fff', lineWidth: 1 },
});

// ✅ Remove the stroke and use a radial gradient, shadow, and higher fill opacity.
chart.options({
 style: {
 fillOpacity: 0.85,
 lineWidth: 0,
 fill: (datum) => {
 // Radial gradient: blend from a light center to the mapped color at the edge for a 3D sphere effect.
 const color = COLOR_MAP[datum.year];
 return `radial-gradient(circle at 35% 35%, rgb(255,255,255) 0%, ${color} 100%)`;
 },
 shadowBlur: 10,
 shadowColor: 'rgba(0, 0, 0, 0.15)',
 shadowOffsetY: 5,
 },
});
```

### Error 4: bubble overlap causes information loss
```javascript
// ❌ Dense points can overlap and obscure each other.
chart.options({ type: 'point', encode: { x: 'gdp', y: 'life', size: 'population' } });

// ✅ Add overlapDodgeY to reduce label overlap.
chart.options({
 type: 'point',
 encode: { x: 'gdp', y: 'life', size: 'population' },
 labels: [{ text: 'country', transform: [{ type: 'overlapDodgeY' }] }],
});
```
