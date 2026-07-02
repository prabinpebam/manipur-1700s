---
id: "g2-transform-sortx"
title: "G2 SortX Sorting Transform"
description: |
  SortX sorts categorical data on the x axis by a specified field or function.
  It is commonly used to arrange column charts by value from high to low and create ranking charts.
  For multi-series sorting by group total, use the built-in reducer: 'sum'; no custom function is required.

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "sortX"
  - "sorting"
  - "ranking"
  - "transform"
  - "column chart sorting"
  - "spec"

related:
  - "g2-mark-interval-basic"
  - "g2-transform-dodgex"

use_cases:
  - "Create column charts sorted by descending value (ranking charts)"
  - "Customize the sort order of categorical axes"
  - "Sort multi-series stacked charts by group total"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-04-02"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform/sort-x"
---

## Minimal runnable example (sorted by descending value)

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data: [
    { city: 'Beijing', gdp: 3.6 },
    { city: 'Shanghai', gdp: 4.3 },
    { city: 'Guangzhou', gdp: 2.8 },
    { city: 'Shenzhen', gdp: 3.2 },
    { city: 'Hangzhou', gdp: 1.8 },
    { city: 'Chengdu', gdp: 2.0 },
  ],
  encode: { x: 'city', y: 'gdp' },
  transform: [
    {
      type: 'sortX',
      by: 'y',           // Sort by y-channel value
      reverse: true,     // true = descending (largest value on the left)
    },
  ],
  coordinate: { transform: [{ type: 'transpose' }] },   // Convert to a horizontal ranking chart
});

chart.render();
```

## Options

```javascript
transform: [
  {
    type: 'sortX',
    by: 'y',          // Channel name to sort by ('y' | 'x' | 'color', etc.)
    reducer: 'max',   // Group aggregation method (see below), default 'max'
    reverse: true,    // Whether to reverse the order (default false = ascending)
    slice: 10,        // Keep only the top N items (for Top N charts)
  },
],
```

**Built-in `reducer` values** (aggregate multiple y values within each group in multi-series/stacked scenarios):

| Value | Meaning |
|----|------|
| `'max'` | Use the group maximum (default) |
| `'min'` | Use the group minimum |
| `'sum'` | Use the group total <- **use this to sort multi-series data by total** |
| `'mean'` | Use the group average |
| `'median'` | Use the group median |
| `'first'` | Use the first value in the group |
| `'last'` | Use the last value in the group |

## Top N ranking chart (show only the top 10)

```javascript
chart.options({
  type: 'interval',
  data: fullData,
  encode: { x: 'name', y: 'score' },
  transform: [
    {
      type: 'sortX',
      by: 'y',
      reverse: true,
      slice: 10,   // Keep only the top 10
    },
  ],
  coordinate: { transform: [{ type: 'transpose' }] },
  axis: { x: { title: null } },
});
```

## Custom sorting (by a specified field)

```javascript
// The data contains a rank field; sort by rank
chart.options({
  type: 'interval',
  data,
  encode: { x: 'name', y: 'value' },
  transform: [
    { type: 'sortX', by: 'rank', reverse: false },
  ],
});
```

## Sorting by group total (multi-series stacked chart)

In a multi-series chart, each x group contains multiple data rows. Use the built-in `reducer: 'sum'` to sort by the sum of y values in each group. **No custom function is required**:

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'city', y: 'value', color: 'type' },
  transform: [
    { type: 'stackY' },
    {
      type: 'sortX',
      by: 'y',
      reducer: 'sum',   // ✅ Built-in summation; sorts by the total of all series for each city
      reverse: true,
    },
  ],
});
```

## Sorting considerations in radial coordinates

When using the `radial` coordinate system, SortX behaves the same as it does in a standard Cartesian coordinate system, but note the following:

1. **x and y channel mapping**: In radial coordinates, x is usually mapped to the angle (the circumferential direction), while y is mapped to the radius (the distance from the center). Therefore, `by: 'y'` effectively sorts by radius.
2. **Need for sorting**: Because radial charts have a "radius feedback effect" where outer bars can appear longer than inner bars even when their values are smaller, **sorting the data is strongly recommended when using radial coordinates** to ensure visual accuracy.
3. **Sort direction control**: `reverse: true` sorts data in descending order, placing the largest values closest to the outer ring; `reverse: false` does the opposite.

```javascript
// ✅ Correct: sort by y value and render in radial coordinates
chart.options({
  type: 'interval',
  data: [
    { movie: 'Movie A', rating: 9.2, genre: 'Sci-Fi' },
    { movie: 'Movie B', rating: 8.7, genre: 'Action' },
    { movie: 'Movie C', rating: 8.5, genre: 'Sci-Fi' },
    { movie: 'Movie D', rating: 7.9, genre: 'Comedy' },
    { movie: 'Movie E', rating: 7.2, genre: 'Action' },
    { movie: 'Movie F', rating: 6.8, genre: 'Comedy' }
  ].sort((a, b) => b.rating - a.rating), // Pre-sort the data
  coordinate: { type: 'radial', innerRadius: 0.35 },
  encode: {
    x: 'movie',
    y: 'rating',
    color: 'rating',
  },
  scale: {
    y: { domain: [0, 10] },
  },
  style: {
    radius: 5,
    fillOpacity: 0.95,
  },
  labels: [{
    text: 'rating',
    position: 'inside',
    style: { fontWeight: 'bold', fill: 'white' },
  }],
  axis: {
    x: { label: { autoRotate: true, style: { fontSize: 10 } } },
    y: { label: true, grid: false, style: { fontSize: 9 } },
  },
  interaction: [{ type: 'elementHighlightByColor' }],
});
```

## Common mistakes and fixes

### Mistake: Replacing the built-in reducer with a custom function and incorrectly using a nonexistent `{ value }` parameter

`sortX` does not have an API like `by: ({ value }) => ...`. `by` only accepts a **channel-name string**, and aggregation logic is controlled by `reducer`. A custom `reducer` function has the signature `(GI, V) => number` (`GI` = row-index array for the group, `V` = full column of numeric values), rather than receiving an array of data objects.

```javascript
// ❌ Incorrect: by does not accept a function, and the ({ value }) parameter does not exist
transform: [
  {
    type: 'sortX',
    by: ({ value }) => d3.sum(value, (d) => d.sales),   // ❌ by can only be a string
    reverse: true,
  },
],

// ❌ Also incorrect: even without d3, this function form is invalid
transform: [
  {
    type: 'sortX',
    by: ({ value }) => value.reduce((sum, d) => sum + d.value, 0),  // ❌ by does not support functions
    reverse: true,
  },
],

// ✅ Correct: use the built-in reducer: 'sum' to sort by group total
transform: [
  {
    type: 'sortX',
    by: 'y',
    reducer: 'sum',   // ✅ Built-in aggregation; no custom function required
    reverse: true,
  },
],
```

### Mistake: Using an unimported `d3` in callbacks

G2 uses d3 internally, but the `d3` object is not exposed to user code. Calling `d3.sum()`, `d3.max()`, and similar methods will throw `ReferenceError: d3 is not defined`. If custom logic is required, use native JS instead:

```javascript
// d3.sum(arr, d => d.v)  ->  arr.reduce((s, d) => s + d.v, 0)
// d3.max(arr, d => d.v)  ->  Math.max(...arr.map(d => d.v))
// d3.min(arr, d => d.v)  ->  Math.min(...arr.map(d => d.v))
// d3.mean(arr, d => d.v) ->  arr.reduce((s, d) => s + d.v, 0) / arr.length
```

### Mistake: Incorrect x/y mapping in radial coordinates makes sorting ineffective

In radial coordinates, if the field that should be used as the sort key is incorrectly mapped to the x channel while the angle is mapped to the y channel, `sortX` cannot produce the expected effect. The correct approach is to map the sort-key field to the y channel and ensure the data is sorted by that field.

```javascript
// ❌ Incorrect: maps rating to the x channel in radial coordinates
chart.options({
  type: 'interval',
  data: [
    { movie: 'Movie A', rating: 9.2, genre: 'Sci-Fi' },
    { movie: 'Movie B', rating: 8.7, genre: 'Action' },
    // ...
  ],
  coordinate: { type: 'radial', innerRadius: 0.2 },
  encode: {
    x: 'rating',       // ❌ Incorrect: rating should be mapped to the y channel
    y: 'movie',        // ❌ Incorrect: movie should be mapped to the x channel
    color: 'rating',
  },
  transform: [
    {
      type: 'sortX',
      by: 'rating',    // ❌ Incorrect: by should be 'y'
      reverse: false,
    },
  ],
});

// ✅ Correct: map rating to the y channel, map movie to the x channel, and pre-sort
chart.options({
  type: 'interval',
  data: [
    { movie: 'Movie A', rating: 9.2, genre: 'Sci-Fi' },
    { movie: 'Movie B', rating: 8.7, genre: 'Action' },
    // ...
  ].sort((a, b) => b.rating - a.rating),
  coordinate: { type: 'radial', innerRadius: 0.35 },
  encode: {
    x: 'movie',        // ✅ Correct: movie maps to the x channel (angle)
    y: 'rating',       // ✅ Correct: rating maps to the y channel (radius)
    color: 'rating',
  },
});
```
