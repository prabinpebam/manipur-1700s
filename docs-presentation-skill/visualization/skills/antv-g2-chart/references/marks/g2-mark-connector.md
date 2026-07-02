---
id: "g2-mark-connector"
title: "G2 Connector Annotation (connector)"
description: |
  The connector mark draws an angled connector line between two points to annotate relationships or differences between two data points in a chart.
  It is commonly used to annotate the difference between two bars or the change between two data points, together with text or labels to display the difference annotation.
  It is similar to the link mark but focuses more on annotation use cases and uses a right-angled polyline by default.

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "connector"
  - "connector"
  - "annotation"
  - "difference annotation"
  - "annotation"
  - "polyline connector"

related:
  - "g2-mark-link"
  - "g2-mark-linex-liney"
  - "g2-comp-annotation"

use_cases:
  - "Annotate the difference between two bar values"
  - "Connect two data points and show the difference"
  - "Annotate the change between start and end points in a line chart"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/annotation/connector/"
---

## Minimal runnable example (difference annotation)

```javascript
import { Chart } from '@antv/g2';

const data = [
  { month: 'Jan', value: 83 },
  { month: 'Feb', value: 60 },
  { month: 'Mar', value: 95 },
];

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'view',
  children: [
    // Main bar chart
    {
      type: 'interval',
       data,
      encode: { x: 'month', y: 'value', color: 'month' },
    },
    // connector: connect the Jan and Mar bars and annotate the difference
    {
      type: 'connector',
       [{ x: 'Jan', y: 83, x1: 'Mar', y1: 95 }],
      encode: {
        x: 'x',
        y: 'y',
        x1: 'x1',
        y1: 'y1',
      },
      labels: [
        {
          text: '+12',
          position: 'top',
          style: { fill: '#52c41a', fontWeight: 'bold' },
        },
      ],
      style: {
        stroke: '#52c41a',
        lineWidth: 1.5,
        offset: 16,   // Offset of the connector line relative to the data point
      },
    },
  ],
});

chart.render();
```

## Configuration options

```javascript
chart.options({
  type: 'connector',
  data: [{ x: 'A', y: 100, x1: 'B', y1: 150 }],
  encode: {
    x: 'x',    // Start x (corresponds to the main chart x-axis)
    y: 'y',    // Start y
    x1: 'x1',  // End x
    y1: 'y1',  // End y
  },
  style: {
    stroke: '#999',
    lineWidth: 1,
    offset: 16,         // Pixel offset between the connector line and the data point; default is 16
    endMarker: true,    // Whether to show the end marker
    startMarker: false, // Whether to show the start marker
  },
});
```

## Common errors and fixes

### Error: only x/y is specified in encode, without x1/y1 - the connector line has no end point
```javascript
// ❌ Error: connector requires a start point and an end point
chart.options({
  type: 'connector',
  encode: { x: 'x', y: 'y' },   // ❌ Missing x1/y1
});

// ✅ Correct: both start and end points must be specified
chart.options({
  type: 'connector',
  encode: { x: 'x', y: 'y', x1: 'x1', y1: 'y1' },  // ✅
});
```
