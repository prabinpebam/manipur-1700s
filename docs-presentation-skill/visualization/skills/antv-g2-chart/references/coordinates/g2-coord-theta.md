---
id: "g2-coord-theta"
title: "G2 Theta Coordinate System (Pie and Donut Charts)"
description: |
  The theta coordinate system is the dedicated coordinate system in G2 v5 for creating pie and donut charts.
  It is essentially Transpose + Polar: the y channel, which contains values, is mapped to angles.
  It must be used with the stackY transform; otherwise all sectors start at angle 0 and completely overlap.

library: "g2"
version: "5.x"
category: "coordinates"
tags:
  - "theta"
  - "pie chart"
  - "donut chart"
  - "pie"
  - "donut"
  - "coordinate"

related:
  - "g2-transform-stacky"
  - "g2-mark-arc-pie"
  - "g2-mark-arc-donut"
  - "g2-coord-polar"

use_cases:
  - "Pie charts that show each part as a proportion of the whole"
  - "Donut charts with a central space for summary values"
  - "Rose-style pie charts"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/coordinate/theta"
---

## Minimal Runnable Example (Pie Chart)

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 480, height: 480 });

chart.options({
  type: 'interval',
  data: [
    { type: 'Electronics', value: 40 },
    { type: 'Apparel',     value: 25 },
    { type: 'Food',        value: 20 },
    { type: 'Other',       value: 15 },
  ],
  encode: {
    y: 'value',      // Map values to sector angle size.
    color: 'type',   // Use color to distinguish categories.
  },
  transform: [{ type: 'stackY' }],       // Required: accumulate values into angle intervals.
  coordinate: { type: 'theta' },         // Required: use the theta coordinate system.
});

chart.render();
```

## Donut Chart (Setting innerRadius)

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: {
    type: 'theta',
    innerRadius: 0.6,   // Inner radius ratio; 0.5 to 0.7 is common.
    outerRadius: 0.9,
  },
  labels: [
    {
      position: 'outside',
      text: (d) => `${d.type}: ${d.value}`,
    },
  ],
});
```

## Configuration Options

```javascript
coordinate: {
  type: 'theta',
  startAngle: -Math.PI / 2,    // Start angle; default is -pi/2, or the 12 o'clock direction.
  endAngle: (Math.PI * 3) / 2, // End angle; default is one full clockwise turn.
  innerRadius: 0,              // Inner hole size; 0 = solid pie chart, > 0 = donut chart.
  outerRadius: 1,              // Outer radius ratio.
}
```

## Pie Chart with Percentage Labels

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'theta', outerRadius: 0.8 },
  labels: [
    {
      position: 'outside',
      text: (d, i, arr) => {
        const total = arr.reduce((sum, item) => sum + item.value, 0);
        return `${((d.value / total) * 100).toFixed(1)}%`;
      },
    },
  ],
  legend: { color: { position: 'right' } },
});
```

## Common Errors and Fixes

### Error 1: Forgetting stackY Causes All Sectors to Start at 0 and Overlap
```javascript
// Error: without stackY, all sector angles start at 0 and the shapes overlap completely.
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  coordinate: { type: 'theta' },   // Missing transform.
});

// Correct: stackY is required.
chart.options({
  transform: [{ type: 'stackY' }],  // Accumulate angles first.
  coordinate: { type: 'theta' },
});
```

### Error 2: Using Polar Instead of Theta for Pie Charts
```javascript
// Error: in polar coordinates, the y channel maps to radius and does not create sector angles.
chart.options({
  coordinate: { type: 'polar' },  // This produces a rose chart, not a pie chart.
});

// Correct: pie charts must use theta.
chart.options({
  coordinate: { type: 'theta' },
});
```

### Error 3: Setting the x Channel in encode
```javascript
// Error: theta pie charts do not need an x channel.
chart.options({
  encode: {
    x: 'type',    // Unnecessary; x has no meaning for theta pie charts.
    y: 'value',
    color: 'type',
  },
});

// Correct: theta pie charts only need y and color.
chart.options({
  encode: {
    y: 'value',    // Values -> angle.
    color: 'type', // Category -> color.
  },
});
```
