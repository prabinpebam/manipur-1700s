---
id: "g2-mark-arc-pie"
title: "G2 Pie Chart (Interval + theta coordinate system)"
description: |
  Create a pie chart with the Interval Mark, theta coordinate system, and stackY transform.
  It shows the proportional relationship of each part to the whole. This article uses Spec mode (chart.options({})).

library: "g2"
version: "5.x"
category: "marks"
subcategory: "arc"
tags:
  - "pie chart"
  - "pie"
  - "proportion"
  - "ratio"
  - "theta coordinate system"
  - "stackY"
  - "spec"

related:
  - "g2-mark-arc-donut"
  - "g2-core-chart-init"
  - "g2-transform-stacky"
  - "g2-interaction-tooltip"

use_cases:
  - "Show each category's proportion of the total"
  - "Display market share distribution"
  - "Visualize resource allocation ratios"

anti_patterns:
  - "Pie charts become difficult to read with more than 6-7 categories; use a bar chart instead"
  - "Not suitable when precise value comparison is required (human angle perception is inaccurate)"
  - "Pie charts are meaningless when values are zero or negative"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/pie"
---

## Core concepts

The Spec structure of a G2 v5 pie chart:
- `coordinate: { type: 'theta' }` - converts Cartesian coordinates to circular angle coordinates
- `transform: [{ type: 'stackY' }]` - accumulates category values into angle intervals (**required**)
- `encode.y` - maps the numeric field (angle size)
- `encode.color` - maps the categorical field (sector color)

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'interval',
  data: [
    { type: 'Category 1', value: 27 },
    { type: 'Category 2', value: 25 },
    { type: 'Category 3', value: 18 },
    { type: 'Category 4', value: 15 },
    { type: 'Category 5', value: 10 },
    { type: 'Other',      value: 5  },
  ],
  encode: {
    y: 'value',       // Map the numeric field (determines sector angle size)
    color: 'type',    // Map the categorical field (determines sector color)
  },
  transform: [{ type: 'stackY' }],   // Required: converts y values to angle intervals
  coordinate: { type: 'theta', outerRadius: 0.8 },
  legend: {
    color: { position: 'bottom', layout: { justifyContent: 'center' } },
  },
  labels: [
    {
      text: (d) => `${d.type}\n${d.value}`,
      position: 'outside',
      connector: true,
    },
  ],
});

chart.render();
```

## Pie chart with percentage labels

```javascript
import { Chart } from '@antv/g2';

const data = [
  { type: 'Category 1', value: 27 },
  { type: 'Category 2', value: 25 },
  { type: 'Category 3', value: 18 },
  { type: 'Category 4', value: 15 },
  { type: 'Other',      value: 15 },
];
const total = data.reduce((sum, d) => sum + d.value, 0);

const chart = new Chart({ container: 'container', width: 600, height: 480 });

chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'theta', outerRadius: 0.8 },
  labels: [
    {
      text: (d) => `${((d.value / total) * 100).toFixed(1)}%`,
      position: 'inside',
      style: { fill: 'white', fontSize: 12, fontWeight: 'bold' },
    },
  ],
});

chart.render();
```

## Donut chart

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: {
    type: 'theta',
    outerRadius: 0.8,
    innerRadius: 0.5,    // Set the inner radius to make a donut chart
  },
});
```

## Rose chart (polar bar chart)

```javascript
// In polar coordinates, each sector has the same angle, and radius is determined by the value
chart.options({
  type: 'interval',
  data,
  encode: { x: 'type', y: 'value', color: 'type' },
  coordinate: { type: 'polar' },   // Note: rose charts use polar, not theta
});
```

## Common mistakes and fixes

### Mistake 1: Forgetting transform stackY
```javascript
// Error: without stackY, all sectors start at angle 0 and completely overlap
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  coordinate: { type: 'theta' },
  // Missing transform!
});

// Correct: stackY must be declared
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],   // Required!
  coordinate: { type: 'theta' },
});
```

### Mistake 2: Misusing the x channel in a pie chart
```javascript
// Error: the x channel is invalid in theta coordinates; do not encode.x in a pie chart
chart.options({
  type: 'interval',
  encode: { x: 'type', y: 'value' },    // x has no meaning under theta
  coordinate: { type: 'theta' },
});

// Correct: a pie chart only needs encode.y (numeric) and encode.color (category)
chart.options({
  type: 'interval',
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'theta' },
});
```

### Mistake 3: G2 v4 pie chart syntax
```javascript
// Error (G2 v4 syntax)
chart.coord('theta', { radius: 0.75 });
chart.interval().position('value').color('type');

// Correct (G2 v5 Spec syntax)
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'theta', outerRadius: 0.8 },
});
```
