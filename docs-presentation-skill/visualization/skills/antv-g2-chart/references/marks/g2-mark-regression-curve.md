---
id: "g2-mark-regression-curve"
title: "G2 Regression Curve Chart"
description: |
  A regression curve chart overlays a regression trend line on a scatter plot. Use type: 'view' to combine
  type: 'point' (raw data) and type: 'line' (regression curve),
  with regression calculations connected through a custom callback in data.transform using libraries such as d3-regression.

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "regression curve chart"
  - "regression"
  - "linear regression"
  - "trend line"
  - "d3-regression"
  - "scatter plot"

related:
  - "g2-mark-point-scatter"
  - "g2-mark-line-basic"

use_cases:
  - "Show a linear or nonlinear relationship between variables"
  - "Preview a trend before deeper analysis"
  - "Analyze correlation"

anti_patterns:
  - "Do not fit a regression curve when there are too few data points"
  - "Do not add a regression line when the variables have no meaningful relationship"

difficulty: "intermediate"
completeness: "full"
created: "2025-04-01"
updated: "2025-04-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/regressioncurve"
---

## Core concepts

**Regression curve chart = `type: 'view'` composed with `point` (scatter plot) + `line` (regression line)**

- Scatter (`type: 'point'`): shows the original data.
- Regression line (`type: 'line'`): uses a `custom` callback in `data.transform` to apply a regression function.
- Common regression libraries include `d3-regression` (`regressionLinear`, `regressionQuad`, `regressionExp`, `regressionLog`, `regressionPoly`).

**Regression function output format**: return an array of points such as `[[x0, y0], [x1, y1], ...]`; use `(d) => d[0]` and `(d) => d[1]` in `encode`.

## Linear regression (minimal runnable example)

```javascript
import { Chart } from '@antv/g2';
import { regressionLinear } from 'd3-regression';

const chart = new Chart({
  container: 'container',
  theme: 'classic',
});

chart.options({
  type: 'view',
  autoFit: true,
  {
  type: 'fetch',
  value: 'https://assets.antv.antgroup.com/g2/linear-regression.json',
  },
  children: [
  // Scatter plot: original data
  {
  type: 'point',
  encode: { x: (d) => d[0], y: (d) => d[1] },
  scale: { x: { domain: [0, 1] }, y: { domain: [0, 5] } },
  style: { fillOpacity: 0.75, fill: '#1890ff' },
  },
  // Line: regression curve
  {
  type: 'line',
  {
  transform: [
  {
  type: 'custom',
  callback: regressionLinear(), // d3-regression regression function
  },
  ],
  },
  encode: { x: (d) => d[0], y: (d) => d[1] },
  style: { stroke: '#30BF78', lineWidth: 2 },
  labels: [
  {
  text: 'y = 1.7x + 3.01',
  selector: 'last',
  position: 'right',
  textAlign: 'end',
  dy: -8,
  },
  ],
  tooltip: false,
  },
  ],
  axis: {
  x: { title: 'Independent variable X' },
  y: { title: 'Dependent variable Y' },
  },
});

chart.render();
```

## Polynomial regression (quadratic regression)

```javascript
import { regressionQuad } from 'd3-regression';

chart.options({
  type: 'view',
  autoFit: true,
  [
  { x: -4, y: 5.2 }, { x: -3, y: 2.8 }, { x: -2, y: 1.5 },
  { x: -1, y: 0.8 }, { x: 0, y: 0.5 }, { x: 1, y: 0.8 },
  { x: 2, y: 1.5 }, { x: 3, y: 2.8 }, { x: 4, y: 5.2 },
  ],
  children: [
  {
  type: 'point',
  encode: { x: 'x', y: 'y' },
  style: { fillOpacity: 0.75, fill: '#1890ff' },
  },
  {
  type: 'line',
  {
  transform: [
  {
  type: 'custom',
  callback: regressionQuad()
  .x((d) => d.x)
  .y((d) => d.y)
  .domain([-4, 4]),
  },
  ],
  },
  encode: { x: (d) => d[0], y: (d) => d[1] },
  style: { stroke: '#30BF78', lineWidth: 2 },
  labels: [
  {
  text: 'y = 0.3x² + 0.5',
  selector: 'last',
  textAlign: 'end',
  dy: -8,
  },
  ],
  tooltip: false,
  },
  ],
});
```

## Exponential regression

```javascript
import { regressionExp } from 'd3-regression';

// In a child line mark
{
  type: 'line',
  data: {
  transform: [
  {
  type: 'custom',
  callback: regressionExp(),
  },
  ],
  },
  encode: { x: (d) => d[0], y: (d) => d[1], shape: 'smooth' },
  style: { stroke: '#30BF78', lineWidth: 2 },
  tooltip: false,
}
```

## Common d3-regression functions

| Function | Regression type | Suitable scenario |
|------|---------|---------|
| `regressionLinear()` | Linear, y = ax + b | Strong linear relationship |
| `regressionQuad()` | Quadratic, y = ax² + bx + c | Curved relationship |
| `regressionPoly()` | Polynomial | Complex curvature |
| `regressionExp()` | Exponential, y = ae^(bx) | Exponential growth or decay |
| `regressionLog()` | Logarithmic, y = a·ln(x) + b | Growth with a decreasing rate |
| `regressionPow()` | Power law, y = ax^b | Power-law relationship |

## Common errors and fixes

### Error 1: placing the regression function in the wrong position

```javascript
// ❌ Error: the custom regression transform belongs in the child line mark's data.transform.
chart.options({
  type: 'view',
  {
  transform: [{ type: 'custom', callback: regressionLinear() }], // ❌ Placed at the top-level view data
  },
  children: [{ type: 'point', encode: { x: 'x', y: 'y' } }],
});

// ✅ Correct: each child mark can use an independent data source.
chart.options({
  type: 'view',
  data, // Scatter data
  children: [
  { type: 'point', encode: { x: 'x', y: 'y' } }, // Scatter uses data
  {
  type: 'line',
  data: {
  transform: [{ type: 'custom', callback: regressionLinear().x(d=>d.x).y(d=>d.y) }],
  }, // ✅ Regression line uses independent data
  encode: { x: (d) => d[0], y: (d) => d[1] },
  },
  ],
});
```

### Error 2: using the wrong encode accessors

```javascript
// ❌ Error: d3-regression outputs [[x, y], ...] arrays, not objects.
{
  type: 'line',
  encode: { x: 'x', y: 'y' }, // ❌ d[0] is not d.x
}

// ✅ Correct: use functions to read array values.
{
  type: 'line',
  encode: { x: (d) => d[0], y: (d) => d[1] }, // ✅
}
```

### Error 3: object data does not work without specifying .x() and .y()

```javascript
// ❌ Problem: d3-regression reads [x, y] arrays by default.
const data = [{ x: 1, y: 2 }, { x: 3, y: 4 }]; // Object format
// regressionLinear() reads d[0] and d[1] by default, so it cannot read object fields.

// ✅ Correct: explicitly specify how to read the fields.
callback: regressionLinear()
  .x((d) => d.x) // ✅ Specify the x field
  .y((d) => d.y), // ✅ Specify the y field
```

### Error 4: missing the data key

```javascript
// ❌ Error
children: [
  {
  type: 'line',
  {
  transform: [{ type: 'custom', callback: regressionLinear() }],
  }, // ❌ Isolated object causes a syntax error because the data key is missing.
  encode: { x: (d) => d[0], y: (d) => d[1] },
  },
]

// ✅ Correct
children: [
  {
  type: 'line',
  { // ✅ This object should be assigned to the data key.
  transform: [{ type: 'custom', callback: regressionLinear() }],
  },
  encode: { x: (d) => d[0], y: (d) => d[1] },
  },
]
```
