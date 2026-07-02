---
id: "g2-mark-mosaic"
title: "G2 Mosaic Plot (mosaic)"
description: |
 Mosaic plots and Marimekko charts commonly appear in three forms:
 1. Uniform mosaic plot: use type: 'cell' to show the distribution of two-dimensional categorical data with color and size.
 2. Non-uniform mosaic plot: use type: 'interval' with the flexX, stackY, and normalizeY transforms. Rectangle width represents category size, and height represents the internal distribution proportion.
 3. Density mosaic plot: use type: 'rect' with the bin transform to show density for two-dimensional continuous data.

library: "g2"
version: "5.x"
category: "marks"
tags:
 - "mosaic plot"
 - "mosaic"
 - "marimekko"
 - "cell"
 - "flexX"
 - "bin"
 - "heatmap"

related:
 - "g2-mark-cell-heatmap"
 - "g2-mark-interval-stacked"

use_cases:
 - "Show the distribution of two-dimensional categorical data with a uniform mosaic plot."
 - "Analyze market segmentation with a non-uniform mosaic plot."
 - "Analyze density for two-dimensional continuous data."

difficulty: "intermediate"
completeness: "full"
created: "2025-04-01"
updated: "2025-04-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/mosaic"
---

## Core concepts

Mosaic plots are typically implemented in three ways:

| Type | mark | Characteristics |
|------|------|------|
| Uniform mosaic plot | `cell` | Uses a uniform axis distribution and encodes additional dimensions with color or size. |
| Non-uniform mosaic plot | `interval` + flexX | Allocates x-axis width according to data proportions. |
| Density mosaic plot | `rect` + bin | Bins continuous data and displays density. |

## Uniform mosaic plot (cell)

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
 container: 'container',
 autoFit: true,
 height: 400,
});

chart.options({
 type: 'cell',
 [
 { product: 'Phone', region: 'North China', sales: 120, category: 'High-end' },
 { product: 'Phone', region: 'East China', sales: 180, category: 'High-end' },
 { product: 'Phone', region: 'South China', sales: 150, category: 'High-end' },
 { product: 'Computer', region: 'North China', sales: 80, category: 'Mid-range' },
 { product: 'Computer', region: 'East China', sales: 110, category: 'Mid-range' },
 { product: 'Computer', region: 'South China', sales: 95, category: 'Mid-range' },
 { product: 'Tablet', region: 'North China', sales: 60, category: 'Mid-range' },
 { product: 'Tablet', region: 'East China', sales: 85, category: 'Mid-range' },
 { product: 'Tablet', region: 'South China', sales: 70, category: 'Low-end' },
 { product: 'Headphones', region: 'North China', sales: 40, category: 'Low-end' },
 { product: 'Headphones', region: 'East China', sales: 55, category: 'Low-end' },
 { product: 'Headphones', region: 'South China', sales: 45, category: 'Low-end' },
 ],
 encode: {
 x: 'product',
 y: 'region',
 color: 'category',
 size: 'sales', // Use cell size to encode value.
 },
 scale: {
 color: { palette: 'category10', type: 'ordinal' },
 size: { type: 'linear', range: [0.3, 1] },
 },
 style: {
 stroke: '#fff',
 lineWidth: 2,
 inset: 2,
 },
});

chart.render();
```

## Non-uniform mosaic plot (Marimekko Chart)

Rectangle width is allocated by each x-axis field's share of the total, which is useful for market-share-style data:

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
 container: 'container',
 width: 900,
 height: 600,
 paddingLeft: 0,
 paddingRight: 0,
});

chart.options({
 type: 'interval',
 data: {
 type: 'fetch',
 value: 'https://gw.alipayobjects.com/os/bmw-prod/3041da62-1bf4-4849-aac3-01a387544bf4.csv',
 },
 transform: [
 { type: 'flexX', reducer: 'sum' }, // Allocate x-axis width by the summed value ratio.
 { type: 'stackY' }, // Stack values along the y-axis.
 { type: 'normalizeY' }, // Normalize the y-axis to 0-1.
 ],
 encode: {
 x: 'market',
 y: 'value',
 color: 'segment',
 },
 axis: {
 y: false,
 },
 scale: {
 x: { paddingOuter: 0, paddingInner: 0.01 },
 },
 tooltip: 'value',
 labels: [
 {
 text: 'segment',
 x: 5,
 y: 5,
 textAlign: 'start',
 textBaseline: 'top',
 fontSize: 10,
 fill: '#fff',
 },
 ],
});

chart.render();
```

## Density mosaic plot (bin transform)

This form is suitable for showing the density relationship between two continuous fields:

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
 container: 'container',
 autoFit: true,
});

chart.options({
 type: 'rect',
 data: {
 type: 'fetch',
 value: 'https://assets.antv.antgroup.com/g2/movies.json',
 },
 encode: {
 x: 'IMDB Rating',
 y: 'Rotten Tomatoes Rating',
 },
 transform: [
 { type: 'bin', color: 'count', thresholdsX: 30, thresholdsY: 20 },
 ],
 scale: {
 color: { palette: 'ylGnBu' },
 },
});

chart.render();
```

## Common errors and fixes

### Error 1: non-uniform mosaic plot missing the flexX transform

```javascript
// ❌ Error: without flexX, x-axis widths are uniform, so this is not a true mosaic plot.
chart.options({
 type: 'interval',
 data,
 transform: [
 { type: 'stackY' },
 { type: 'normalizeY' },
 // ❌ Missing flexX.
 ],
 encode: { x: 'market', y: 'value', color: 'segment' },
});

// ✅ Correct: use all three transforms together.
chart.options({
 type: 'interval',
 data,
 transform: [
 { type: 'flexX', reducer: 'sum' }, // ✅ Allocate x-axis width by proportion.
 { type: 'stackY' },
 { type: 'normalizeY' },
 ],
 encode: { x: 'market', y: 'value', color: 'segment' },
});
```

### Error 2: uniform mosaic plot uses interval instead of cell

```javascript
// ❌ Problem: interval is less direct for a uniform grid scenario than cell.
chart.options({
 type: 'interval', // ❌ Use cell for a uniform mosaic grid.
 data,
 encode: { x: 'product', y: 'region', color: 'category' },
});

// ✅ Correct: use cell for two-dimensional categorical data on a uniform grid.
chart.options({
 type: 'cell', // ✅
 data,
 encode: { x: 'product', y: 'region', color: 'category' },
});
```

### Error 3: density mosaic plot uses cell/interval instead of rect

```javascript
// ❌ Error: use rect plus the bin transform for binned continuous data.
chart.options({
 type: 'cell', // ❌ cell is suitable for discrete data.
 data,
 encode: { x: 'IMDB Rating', y: 'Rotten Tomatoes Rating' },
});

// ✅ Correct: use rect for binned continuous data.
chart.options({
 type: 'rect', // ✅
 data,
 encode: { x: 'IMDB Rating', y: 'Rotten Tomatoes Rating' },
 transform: [{ type: 'bin', color: 'count' }],
});
```

## Comparison of the three mosaic plot types

| Type | Data type | mark | Core transform |
|------|---------|------|---------------|
| Uniform mosaic plot | Two-dimensional discrete data | `cell` | None |
| Non-uniform mosaic plot | Multidimensional categorical data with values | `interval` | `flexX + stackY + normalizeY` |
| Density mosaic plot | Two-dimensional continuous data | `rect` | `bin` |
