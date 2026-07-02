---
id: "g2-comp-repeat-matrix"
title: "G2 Repeat Matrix (repeatMatrix)"
description: |
  The G2 v5 repeatMatrix composition type repeats the same chart in a matrix by two-dimensional fields.
  Each cell shares the same mark configuration, while the x-axis and y-axis each correspond to a categorical field.
  It is suitable for showing pairwise relationships among multiple variables, such as a scatterplot matrix.

library: "g2"
version: "5.x"
category: "compositions"
tags:
  - "repeat matrix"
  - "repeatMatrix"
  - "scatterplot matrix"
  - "multivariate"
  - "faceting"
  - "spec"

related:
  - "g2-comp-facet-rect"
  - "g2-mark-point-scatter"
  - "g2-core-view-composition"

use_cases:
  - "Create a multivariate pairwise scatterplot matrix"
  - "Explore correlations in multidimensional data"
  - "Show distribution histograms on the diagonal"

difficulty: "advanced"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/matrix"
---

## Minimal Runnable Example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 800,
  height: 800,
});

// Multidimensional data. Each row is one sample with multiple value fields.
const data = [
  { sepalLength: 5.1, sepalWidth: 3.5, petalLength: 1.4, petalWidth: 0.2, species: 'setosa' },
  { sepalLength: 4.9, sepalWidth: 3.0, petalLength: 1.4, petalWidth: 0.2, species: 'setosa' },
  { sepalLength: 7.0, sepalWidth: 3.2, petalLength: 4.7, petalWidth: 1.4, species: 'versicolor' },
  { sepalLength: 6.4, sepalWidth: 3.2, petalLength: 4.5, petalWidth: 1.5, species: 'versicolor' },
  { sepalLength: 6.3, sepalWidth: 3.3, petalLength: 6.0, petalWidth: 2.5, species: 'virginica' },
  // ...more data
];

chart.options({
  type: 'repeatMatrix',
  data,
  encode: {
    x: ['sepalLength', 'sepalWidth', 'petalLength'],   // Column variables.
    y: ['sepalLength', 'sepalWidth', 'petalLength'],   // Row variables.
  },
  children: [
    {
      type: 'point',
      encode: { color: 'species' },
      style: { r: 3, fillOpacity: 0.7 },
    },
  ],
});

chart.render();
```

## Complete Scatterplot Matrix (with Diagonal)

```javascript
chart.options({
  type: 'repeatMatrix',
  data,
  encode: {
    x: ['sepalLength', 'sepalWidth', 'petalLength', 'petalWidth'],
    y: ['sepalLength', 'sepalWidth', 'petalLength', 'petalWidth'],
  },
  // Cell spacing.
  padding: 10,
  children: [
    {
      type: 'point',
      encode: { color: 'species' },
      style: { r: 2.5, fillOpacity: 0.6 },
      legend: { color: { position: 'top' } },
    },
  ],
});
```

## Comparison with facetRect

```javascript
// repeatMatrix: x and y encode values are arrays of variables, automatically arranged into an n-by-n matrix.
chart.options({
  type: 'repeatMatrix',
  encode: {
    x: ['var1', 'var2', 'var3'],
    y: ['var1', 'var2', 'var3'],
  },
  children: [{ type: 'point', encode: { color: 'category' } }],
});

// facetRect: facet by the values of a single category field, with one cell for each value.
chart.options({
  type: 'facetRect',
  encode: { x: 'region' },   // Split different region values into multiple columns.
  children: [
    {
      type: 'interval',
      encode: { x: 'month', y: 'sales' },
    },
  ],
});
```

## Common Errors and Fixes

### Error 1: encode.x or encode.y is written as a single field instead of an array

```javascript
// Error: repeatMatrix encode.x and encode.y must be arrays of field names.
chart.options({
  type: 'repeatMatrix',
  encode: {
    x: 'sepalLength',   // Single field name.
    y: 'sepalWidth',
  },
});

// Correct: x and y must both be arrays.
chart.options({
  type: 'repeatMatrix',
  encode: {
    x: ['sepalLength', 'sepalWidth', 'petalLength'],
    y: ['sepalLength', 'sepalWidth', 'petalLength'],
  },
});
```

### Error 2: Confusing a scatterplot matrix with ordinary faceting

```javascript
// Error: facetRect is used even though the goal is a scatterplot matrix.
chart.options({
  type: 'facetRect',
  encode: {
    x: ['sepalLength', 'sepalWidth'],   // facetRect encode.x only accepts a single field.
  },
});

// Correct: Use repeatMatrix for multivariate pairwise comparisons.
chart.options({
  type: 'repeatMatrix',
  encode: {
    x: ['sepalLength', 'sepalWidth'],
    y: ['sepalLength', 'sepalWidth'],
  },
  children: [{ type: 'point', encode: { color: 'species' } }],
});
```
