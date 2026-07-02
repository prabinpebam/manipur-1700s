---
id: "g2-mark-arc-donut"
title: "G2 Donut Chart"
description: |
  Create a donut chart by setting coordinate.innerRadius on top of a pie chart.
  The empty center area can display summary numbers or explanatory text, reducing visual weight while preserving part-to-whole proportions.

library: "g2"
version: "5.x"
category: "marks"
subcategory: "arc"
tags:
  - "donut chart"
  - "ring chart"
  - "donut"
  - "innerRadius"
  - "proportion"
  - "pie chart variant"
  - "spec"

related:
  - "g2-mark-arc-pie"
  - "g2-transform-stacky"

use_cases:
  - "Show category proportions with summary data in the center"
  - "A more modern way to show proportions than a pie chart"
  - "Proportion rings in KPI cards"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/donut"
---

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 480,
  height: 480,
});

chart.options({
  type: 'interval',
  data: [
    { type: 'Category 1', value: 27 },
    { type: 'Category 2', value: 25 },
    { type: 'Category 3', value: 18 },
    { type: 'Category 4', value: 15 },
    { type: 'Other',      value: 15 },
  ],
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: {
    type: 'theta',
    outerRadius: 0.8,
    innerRadius: 0.5,    // Key: set the inner radius to create the hollow effect
  },
});

chart.render();
```

## Donut chart with center text

```javascript
import { Chart } from '@antv/g2';

const data = [
  { type: 'Completed', value: 75 },
  { type: 'Incomplete', value: 25 },
];
const total = data.reduce((s, d) => s + d.value, 0);

const chart = new Chart({ container: 'container', width: 400, height: 400 });

chart.options({
  type: 'view',
  children: [
    {
      type: 'interval',
       data,
      encode: { y: 'value', color: 'type' },
      transform: [{ type: 'stackY' }],
      coordinate: { type: 'theta', outerRadius: 0.85, innerRadius: 0.6 },
      scale: {
        color: { range: ['#1890ff', '#f0f0f0'] },
      },
      legend: false,
    },
    {
      // Use a text mark to draw center text at the polar coordinate center
      type: 'text',
       [{ value: data[0].value }],
      encode: { text: (d) => `${d.value}%` },
      style: {
        x: '50%', y: '50%',
        textAlign: 'center',
        fontSize: 32,
        fontWeight: 'bold',
        fill: '#1890ff',
      },
    },
  ],
});

chart.render();
```

## Donut chart with external labels

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'theta', outerRadius: 0.8, innerRadius: 0.5 },
  labels: [
    {
      text: (d) => `${d.type}: ${d.value}`,
      position: 'outside',
      connector: true,
    },
  ],
});
```

## Common mistakes and fixes

### Mistake: innerRadius is greater than outerRadius
```javascript
// Error: the inner radius is greater than the outer radius, so the ring disappears
chart.options({
  coordinate: { type: 'theta', outerRadius: 0.5, innerRadius: 0.8 },
});

// Correct: innerRadius < outerRadius; a 0.5-0.7 ratio is recommended
chart.options({
  coordinate: { type: 'theta', outerRadius: 0.8, innerRadius: 0.5 },
});
```
