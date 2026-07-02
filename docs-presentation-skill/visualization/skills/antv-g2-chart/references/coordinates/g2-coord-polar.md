---
id: "g2-coord-polar"
title: "G2 Polar Coordinate System"
description: |
  The polar coordinate system maps Cartesian coordinates into a circular region: the x channel maps to angle, and the y channel maps to radius.
  It is commonly used for rose charts, polar column charts, polar area charts, and circular progress indicators.
  Use startAngle and endAngle to control the angular range, and innerRadius to control the inner hole size.

library: "g2"
version: "5.x"
category: "coordinates"
tags:
  - "polar"
  - "polar coordinates"
  - "rose chart"
  - "nightingale"
  - "coxcomb"
  - "radial"
  - "coordinate"

related:
  - "g2-coord-transpose"
  - "g2-mark-arc-pie"
  - "g2-mark-interval-stacked"

use_cases:
  - "Rose charts or Nightingale charts where categories are encoded by angle and radius"
  - "Polar area charts for cyclic data"
  - "Circular progress indicators"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/coordinate/polar"
---

## Minimal Runnable Example (Rose Chart)

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 500, height: 500 });

chart.options({
  type: 'interval',
  data: [
    { month: 'Jan', value: 83 },
    { month: 'Feb', value: 60 },
    { month: 'Mar', value: 95 },
    { month: 'Apr', value: 72 },
    { month: 'May', value: 110 },
    { month: 'Jun', value: 88 },
  ],
  encode: {
    x: 'month',   // Maps to angle.
    y: 'value',   // Maps to radius length.
    color: 'month',
  },
  coordinate: { type: 'polar' },  // Key configuration: polar coordinates.
});

chart.render();
```

## Configuration Options

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'month', y: 'value', color: 'month' },
  coordinate: {
    type: 'polar',
    startAngle: -Math.PI / 2,    // Start angle; default is -pi/2, or the 12 o'clock direction.
    endAngle: (Math.PI * 3) / 2, // End angle; default is 3pi/2, or one clockwise turn.
    innerRadius: 0,              // Inner radius; 0 means no hole, and 0.5 means a hole at 50% radius.
    outerRadius: 1,              // Outer radius ratio; default is 1.
  },
});
```

## Half-Circle Rose Chart

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'month' },
  coordinate: {
    type: 'polar',
    startAngle: -Math.PI / 2,   // Start from the top.
    endAngle: Math.PI / 2,      // Stop at the bottom to form a semicircle.
  },
});
```

## Polar Stacked Area Chart

```javascript
chart.options({
  type: 'area',
  data: timeSeriesData,
  encode: { x: 'date', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'polar', innerRadius: 0.2 },
  style: { fillOpacity: 0.65 },
});
```

## Common Errors and Fixes

### Error 1: Uneven Rose Chart Angles Because the x Channel Is Not Categorical
```javascript
// Error: the x channel contains numeric values, so angles are uneven in polar coordinates.
chart.options({
  encode: { x: 'timestamp', y: 'value' },  // Timestamp is treated as a value field.
  coordinate: { type: 'polar' },
});

// Correct: the x channel should be a categorical string field.
chart.options({
  encode: { x: 'month', y: 'value' },  // String category.
  coordinate: { type: 'polar' },
});
```

### Error 2: Confusing Polar with Theta
```javascript
// Error: polar coordinates do not automatically convert the y channel into sector angles for a pie chart.
chart.options({
  type: 'interval',
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'polar' },  // Pie charts should use theta, not polar.
});

// Correct: pie charts must use the theta coordinate system.
chart.options({
  coordinate: { type: 'theta' },
});
```
