---
id: "g2-mark-distribution-curve"
title: "G2 Distribution Curve Chart (distribution curve)"
description: |
  A distribution curve chart uses type: 'line' + encode.shape: 'smooth' + custom binning statistics in data.transform
  to show the frequency-density distribution of continuous numeric data. It is suitable for exploring distribution shapes and comparing distributions across groups.

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "distribution curve chart"
  - "distribution curve"
  - "frequency density"
  - "normal distribution"
  - "smooth"
  - "KDE"

related:
  - "g2-mark-histogram"
  - "g2-mark-density"
  - "g2-mark-violin"

use_cases:
  - "Show the probability-density distribution of continuous numeric values"
  - "Compare distribution shapes across multiple groups"
  - "Data quality checks (normality testing)"

anti_patterns:
  - "Results are unstable with fewer than 30 records; use a scatter plot or boxplot instead"
  - "Discrete categorical data is not suitable for distribution curves"

difficulty: "intermediate"
completeness: "full"
created: "2025-04-01"
updated: "2025-04-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/distributioncurve"
---

## Core concepts

**Distribution curve chart = `type: 'line'` + `encode.shape: 'smooth'` + manual binning statistics**

G2 itself does not have a built-in distribution-curve mark. You need to bin the raw data, calculate frequency density, and then draw it with a smooth line:

```
Raw data -> binning (bins) -> calculate frequency density for each bin -> smooth line
```

If the raw data has already been processed by KDE, you can also directly use `type: 'density'` + `data.transform kde`.

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  theme: 'classic',
});

chart.options({
  type: 'line',
  data: {
    value: [
      { value: 85 }, { value: 92 }, { value: 78 }, { value: 95 },
      { value: 88 }, { value: 72 }, { value: 91 }, { value: 83 },
      // ... More data (100+ records recommended)
    ],
    transform: [
      {
        type: 'custom',
        callback: (data) => {
          const values = data.map((d) => d.value);
          const min = Math.min(...values);
          const max = Math.max(...values);
          const binCount = 20;
          const binWidth = (max - min) / binCount;

          // Binning statistics
          const bins = Array.from({ length: binCount }, (_, i) => ({
            x0: min + i * binWidth,
            x1: min + (i + 1) * binWidth,
            count: 0,
          }));
          values.forEach((v) => {
            const idx = Math.min(Math.floor((v - min) / binWidth), binCount - 1);
            bins[idx].count++;
          });

          // Output frequency density
          const total = values.length;
          return bins.map((bin) => ({
            x: (bin.x0 + bin.x1) / 2,
            y: bin.count / total,
          }));
        },
      },
    ],
  },
  encode: {
    x: 'x',
    y: 'y',
    shape: 'smooth',   // Smooth curve
  },
  style: {
    lineWidth: 3,
    stroke: '#1890ff',
  },
  axis: {
    x: { title: 'Value' },
    y: { title: 'Frequency density' },
  },
});

chart.render();
```

## Comparison of multiple distribution curves

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  theme: 'classic',
});

chart.options({
  type: 'line',
  data: {
    type: 'fetch',
    value: 'https://assets.antv.antgroup.com/g2/species.json',
    transform: [
      {
        type: 'custom',
        callback: (data) => {
          // Group by species and bin each group separately
          const groups = {};
          data.forEach((d) => {
            if (!groups[d.species]) groups[d.species] = [];
            groups[d.species].push(d.y);
          });

          const binCount = 20;
          const results = [];

          Object.entries(groups).forEach(([species, values]) => {
            const filteredValues = values.filter((v) => !isNaN(v));
            const min = Math.min(...filteredValues);
            const max = Math.max(...filteredValues);
            const binWidth = (max - min) / binCount;

            const bins = Array.from({ length: binCount }, (_, i) => ({
              x0: min + i * binWidth,
              x1: min + (i + 1) * binWidth,
              count: 0,
            }));
            filteredValues.forEach((v) => {
              const idx = Math.min(Math.floor((v - min) / binWidth), binCount - 1);
              bins[idx].count++;
            });

            const total = filteredValues.length;
            bins.forEach((bin) => {
              results.push({
                x: (bin.x0 + bin.x1) / 2,
                y: bin.count / total,
                species,
              });
            });
          });

          return results;
        },
      },
    ],
  },
  encode: {
    x: 'x',
    y: 'y',
    color: 'species',
    shape: 'smooth',
  },
  style: {
    lineWidth: 2,
    strokeOpacity: 0.8,
  },
  axis: {
    x: { title: 'Petal length' },
    y: { title: 'Frequency density' },
  },
  legend: {
    color: { title: 'Species', position: 'right' },
  },
});

chart.render();
```

## Use density mark instead (recommended)

When the dataset is large enough, prefer the built-in density mark + KDE transform; it is more accurate than manual binning:

```javascript
chart.options({
  type: 'density',
  data: {
    type: 'inline',
    value: rawData,
    transform: [
      {
        type: 'kde',
        field: 'value',        // Field for KDE
        groupBy: ['category'], // Grouping field
        size: 30,              // Number of output points; more points give finer detail
      },
    ],
  },
  encode: {
    x: 'category',
    y: 'y',
    size: 'size',
    series: 'category',
    color: 'category',
  },
  tooltip: false,
});
```

## Common errors and fixes

### Error 1: forgetting encode.shape: 'smooth'

```javascript
// ❌ Result: a line chart with obvious jagged edges, not like a distribution curve
chart.options({
  type: 'line',
  data: binnedData,
  encode: { x: 'x', y: 'y' },  // ❌ Missing shape: 'smooth'
});

// ✅ Correct: smooth makes the curve smooth
chart.options({
  type: 'line',
  data: binnedData,
  encode: { x: 'x', y: 'y', shape: 'smooth' },  // ✅
});
```

### Error 2: drawing raw data directly without binning

```javascript
// ❌ Error: raw data points are connected as a line, not a density curve
chart.options({
  type: 'line',
  data: rawData,   // ❌ Not binned; just connected scatter points
  encode: { x: 'index', y: 'value', shape: 'smooth' },
});

// ✅ Correct: first bin in data.transform, then draw
chart.options({
  type: 'line',
  data: {
    value: rawData,
    transform: [{ type: 'custom', callback: binningFn }],
  },
  encode: { x: 'x', y: 'y', shape: 'smooth' },
});
```

### Error 3: missing data keyword

```javascript
// ❌ Error: transform must be placed inside the data object
chart.options({
  type: 'line',
  data: { value: rawData, transform: [...] },  // ❌ Isolated { } syntax error
  encode: { x: 'x', y: 'y' },
});

// ✅ Correct: must have the data: key
chart.options({
  type: 'line',
  data: { value: rawData, transform: [...] },  // ✅
  encode: { x: 'x', y: 'y' },
});
```

## Distribution curve vs. related chart selection

| Chart | Use case |
|------|---------|
| Distribution curve (line + smooth) | Show continuous distribution shapes; 50+ data points |
| Histogram | Need exact frequency counts and interval distribution |
| density mark | Large datasets with automatic KDE estimation |
| Violin plot | Multi-group comparison + statistical summary |
