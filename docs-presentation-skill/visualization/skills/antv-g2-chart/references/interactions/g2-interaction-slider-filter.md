---
id: "g2-interaction-slider-filter"
title: "G2 slider filter"
description: |
  In G2 v5, the slider component can be enabled with slider: { x: true } or interaction: [{ type: 'sliderFilter' }].
  Dragging the slider filters the x/y-axis data range and is commonly used to select a local time range in time-series charts.
library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "slider"
  - "slider"
  - "filtering"
  - "time series"
  - "range selection"
  - "spec"

related:
  - "g2-mark-line-basic"
  - "g2-interaction-tooltip"
  - "g2-scale-time"

use_cases:
  - "Drag in a time-series line chart to view a local time range"
  - "Zoom into a local region of a large chart"
  - "Link the time range across multiple charts"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/component/slider"
---

## Basic usage (time-series line chart + X-axis slider)

Add a slider to the bottom of a line chart and drag it to filter the time range:

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 720,
  height: 480,
});

// Generate 30 days of time-series data
const data = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(2024, 0, i + 1).toISOString().slice(0, 10),
  value: Math.round(200 + Math.random() * 300),
}));

chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  slider: {
    x: true,   // Display the slider below the X axis
  },
});

chart.render();
```

## Set the initial visible range

`values` accepts ratio values in the `[0, 1]` interval and controls the initially selected range in the slider:

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  slider: {
    x: {
      values: [0.6, 1.0],   // Initially show only the last 40% of the data
    },
  },
});
```

## Dual-axis slider (filter both X and Y axes)

Add sliders to both the X and Y axes, which is useful for two-dimensional data exploration such as scatter plots:

```javascript
chart.options({
  type: 'point',
  data: [
    { price: 12000, score: 85, brand: 'A' },
    { price: 8500,  score: 72, brand: 'B' },
    { price: 23000, score: 91, brand: 'C' },
    { price: 5000,  score: 60, brand: 'D' },
    { price: 18000, score: 88, brand: 'E' },
    { price: 31000, score: 95, brand: 'F' },
    { price: 9500,  score: 78, brand: 'G' },
  ],
  encode: { x: 'price', y: 'score', color: 'brand' },
  slider: {
    x: {
      values: [0, 0.7],   // Initial X-axis display range: 0-70%
    },
    y: {
      values: [0.2, 1.0], // Initial Y-axis display range: 20%-100%
    },
  },
});
```

## Custom label format

Use `labelFormatter` to format the labels displayed at the two ends of the slider:

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  slider: {
    x: {
      values: [0.4, 1.0],
      labelFormatter: (value) => {
        // value is the actual data value (the original data after ratio conversion)
        const date = new Date(value);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      },
    },
  },
});
```

## Enable it with interaction

You can also enable sliderFilter through the `interaction` array. The two forms have the same effect:

```javascript
// Method 1: slider property (recommended and more concise)
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  slider: { x: true },
});

// Method 2: interaction array
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  interaction: [
    { type: 'sliderFilter' },
  ],
});
```

## Common mistakes and fixes

### Mistake: values is outside the [0, 1] range

```javascript
// ❌ values must be within the [0, 1] interval and represent a data ratio
chart.options({
  slider: {
    x: { values: [10, 80] },   // Mistake: not pixels or indexes, but a 0-1 ratio
  },
});

// ✅ Correct: use decimals between 0 and 1
chart.options({
  slider: {
    x: { values: [0.1, 0.8] },   // Show data from 10% to 80%
  },
});
```

### Mistake: using sliderFilter on a discrete categorical axis

```javascript
// ❌ slider is mainly suitable for continuous axes (time axes and numeric axes),
// and it performs poorly on a purely categorical X axis; the filtering logic may not match expectations
chart.options({
  type: 'interval',
  data: [{ genre: 'Sports', sold: 275 }, { genre: 'Action', sold: 120 }],
  encode: { x: 'genre', y: 'sold' },   // genre is a discrete category
  slider: { x: true },
});

// ✅ sliderFilter is best suited for time-series data or large continuous numeric datasets
chart.options({
  type: 'line',
  data: timeSeriesData,
  encode: { x: 'date', y: 'value' },   // date is a time axis
  slider: { x: true },
});
```

### Mistake: writing slider as an array

```javascript
// ❌ slider is an object, not an array
chart.options({
  slider: [{ x: true }],
});

// ✅ slider is an object, and x/y are its properties
chart.options({
  slider: { x: true },
  // Or enable both axes at the same time
  // slider: { x: true, y: true },
});
```

### Mistake: reversing the values order (start value is greater than end value)

```javascript
// ❌ The start value cannot be greater than the end value
chart.options({
  slider: {
    x: { values: [0.8, 0.2] },
  },
});

// ✅ The first value is the start position and the second value is the end position (both are 0-1 ratios)
chart.options({
  slider: {
    x: { values: [0.2, 0.8] },
  },
});
```
