---
id: "g2-coord-radial"
title: "G2 Radial Coordinate System"
description: |
  The radial coordinate system is a variant of the polar coordinate system in G2 v5.
  It maps transposed Cartesian coordinates to a circular layout: the x axis maps to radius, and the y axis maps to angle.
  Compared with polar coordinates, the mapping is reversed. Polar maps x to angle and y to radius, while radial is suited to radial bar charts and radial line charts.

library: "g2"
version: "5.x"
category: "coordinates"
tags:
  - "radial"
  - "radial coordinates"
  - "centripetal bar chart"
  - "radial chart"
  - "coordinate"
  - "circular layout"

related:
  - "g2-coord-polar"
  - "g2-coord-theta"
  - "g2-mark-interval-basic"

use_cases:
  - "Radial bar charts with bars extending outward from the center"
  - "Circular bar charts where categories extend from the center"
  - "Circular-layout displays for time series"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/coordinate/radial"
---

## Core Concepts

The radial coordinate system reverses the mapping used by the polar coordinate system:

| Coordinate system | x channel | y channel | Typical chart |
|--------|--------|--------|----------|
| `polar` | -> angle around the circle | -> radius, or distance from the center | rose chart |
| `radial` | -> radius, or distance from the center | -> angle around the circle | radial bar chart |

## Minimal Runnable Example (Radial Bar Chart)

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
    { month: 'Jun', value: 85 },
  ],
  encode: {
    x: 'month',    // x channel maps to angle around the circle.
    y: 'value',    // y channel maps to bar length along the radius.
    color: 'month',
  },
  coordinate: { type: 'radial', innerRadius: 0.1, outerRadius: 0.8 },
});

chart.render();
```

## Configuration Options

```javascript
chart.options({
  coordinate: {
    type: 'radial',
    innerRadius: 0.1,            // Inner ring radius; 0 starts at the center. Default is 0.
    outerRadius: 1,              // Outer ring radius ratio; default is 1.
    startAngle: -Math.PI / 2,   // Start angle; default is -pi/2, or the 12 o'clock direction.
    endAngle: (Math.PI * 3) / 2, // End angle; default is 3pi/2, or one clockwise turn.
  },
});
```

## Radial Bar Chart with an Inner Hole

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  coordinate: {
    type: 'radial',
    innerRadius: 0.3,   // Reserve space in the center.
    outerRadius: 0.9,
  },
  style: { fillOpacity: 0.85 },
});
```

## Difference from the Polar Coordinate System

```javascript
// polar: x -> angle, y -> radius, producing a rose chart effect.
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value' },  // x is a category field for angle; y is a value field for radius.
  coordinate: { type: 'polar' },
});

// radial: x -> radius, y -> angle, producing a radial bar chart effect.
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value' },  // x is a category field for angle; y is a value field for radius.
  coordinate: { type: 'radial' },
});
```

## Common Errors and Fixes

### Error: x/y Encoding Is Reversed from the Expected Direction
```javascript
// Error: in radial charts, x should represent the angular direction and y should represent the radial value.
chart.options({
  type: 'interval',
  encode: { x: 'value', y: 'month' },  // Values are used as angles and months are used as radius.
  coordinate: { type: 'radial' },
});

// Correct: use the category field as x for angles and the value field as y for radius.
chart.options({
  type: 'interval',
  encode: { x: 'month', y: 'value' },  // month -> angle, value -> radius.
  coordinate: { type: 'radial' },
});
```

### Error: Center Image Is Not Displayed Correctly
```javascript
// Error: using fixed coordinates (0, 0) cannot guarantee that the image is centered.
chart.options({
  type: 'image',
  data: [{ url: 'https://example.com/logo.png' }],
  encode: {
    x: () => 0,
    y: () => 0
  },
  style: {
    img: (d) => d.url,
    width: 80,
    height: 80
  }
});

// Correct: set style.x and style.y with relative positions so the image is centered.
chart.options({
  type: 'image',
  data: [{ src: 'https://example.com/logo.png' }],
  style: {
    x: '50%',      // 50% of the container width.
    y: '50%',      // 50% of the container height.
    width: 80,
    height: 80
  }
});
```

### Error: Multiple Overlaid Views Cause Coordinate System Conflicts
```javascript
// Error: redefining the coordinate system inside child views can cause rendering conflicts.
chart.options({
  type: 'view',
  children: [
    {
      type: 'interval',
      coordinate: { type: 'radial' }  // Coordinate system defined in a child view.
    },
    {
      type: 'image',
      coordinate: { type: 'radial' }  // Image marks do not need their own coordinate system.
    }
  ]
});

// Correct: define the coordinate system on the top-level view and let children inherit it.
chart.options({
  type: 'view',
  coordinate: { type: 'radial', innerRadius: 0.3 },
  children: [
    {
      type: 'interval',
      data,
      encode: { x: 'type', y: 'value' }
    },
    {
      type: 'image',
      data: [{ src: 'https://example.com/logo.png' }],
      style: {
        x: '50%',
        y: '50%',
        width: 80,
        height: 80
      }
    }
  ]
});
```
