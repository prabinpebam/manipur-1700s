---
id: "g2-transform-select"
title: "G2 Select / SelectX / SelectY Filtering Transform"
description: |
  The select family of transforms selects specific data rows from grouped data for annotations.
  selectX groups by the x channel before selecting rows (commonly used for end labels in line charts),
  while selectY groups by the y channel before selecting rows.
  selector supports preset values such as 'first', 'last', 'min', and 'max', as well as custom functions.

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "select"
  - "selectX"
  - "selectY"
  - "filtering"
  - "end labels"
  - "extreme-value annotations"
  - "transform"

related:
  - "g2-mark-line-basic"
  - "g2-mark-text"
  - "g2-comp-annotation"

use_cases:
  - "Show the latest data label at the end of a line chart"
  - "Annotate the maximum or minimum value of each line"
  - "Place annotation labels at a specific x position"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform/select"
---

## Minimal runnable example (end labels for a line chart)

```javascript
import { Chart } from '@antv/g2';

const data = [
  { month: 'Jan', type: 'A', value: 83 },
  { month: 'Feb', type: 'A', value: 90 },
  { month: 'Mar', type: 'A', value: 76 },
  { month: 'Jan', type: 'B', value: 50 },
  { month: 'Feb', type: 'B', value: 65 },
  { month: 'Mar', type: 'B', value: 72 },
];

const chart = new Chart({ container: 'container', width: 640, height: 400 });

// Main line chart
chart.options({
  type: 'view',
  children: [
    {
      type: 'line',
       data,
      encode: { x: 'month', y: 'value', color: 'type' },
    },
    // End label: text mark + selectX (select the last point of each line)
    {
      type: 'text',
       data,
      encode: { x: 'month', y: 'value', color: 'type', text: 'type' },
      transform: [
        {
          type: 'selectX',
          selector: 'last',   // Select the point with the largest x value in each group (each line)
        },
      ],
      style: { textAnchor: 'start', dx: 6 },
    },
  ],
});

chart.render();
```

## Annotating the maximum value

```javascript
// Add an annotation at the highest point of the line chart
{
  type: 'point',
  data,
  encode: { x: 'date', y: 'value', color: 'type' },
  transform: [
    {
      type: 'selectY',
      selector: 'max',   // Select the point with the largest y value in each group
    },
  ],
  style: { r: 6, lineWidth: 2 },
  labels: [{ text: (d) => `Max: ${d.value}`, position: 'top' }],
}
```

## selector quick reference

```javascript
// Select the last point (commonly used for end labels)
transform: [{ type: 'selectX', selector: 'last' }]

// Select the first point
transform: [{ type: 'selectX', selector: 'first' }]

// Select the point with the largest y value
transform: [{ type: 'selectY', selector: 'max' }]

// Select the point with the smallest y value
transform: [{ type: 'selectY', selector: 'min' }]

// Custom: select the Nth point
transform: [{ type: 'selectX', selector: (data) => data[Math.floor(data.length / 2)] }]
```

## Common mistakes and fixes

### Mistake: Applying select to the line mark itself--apply it to a separate text/point mark instead
```javascript
// ❌ Applying selectX to a line mark leaves the entire line with only one point
chart.options({
  type: 'line',
  data,
  encode: { x: 'month', y: 'value' },
  transform: [{ type: 'selectX', selector: 'last' }],  // ❌ This turns the line into a single point
});

// ✅ Use select on an additional text or point mark alongside the line
chart.options({
  type: 'view',
  children: [
    { type: 'line', data, encode: { x: 'month', y: 'value' } },
    {
      type: 'text',
      data,
      encode: { x: 'month', y: 'value', text: 'value' },
      transform: [{ type: 'selectX', selector: 'last' }],  // ✅ Independent mark
    },
  ],
});
```
