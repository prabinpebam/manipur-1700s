---
id: "g2-comp-space-layer"
title: "G2 Layer Overlay (spaceLayer / view with Multiple Marks)"
description: |
  spaceLayer stacks multiple views in the same area with shared axes.
  It can create composite charts such as line chart plus column chart overlays or line chart plus scatterplot overlays.
  A more common pattern is to configure multiple marks with the children array in a single view.

library: "g2"
version: "5.x"
category: "compositions"
tags:
  - "spaceLayer"
  - "layer"
  - "overlay"
  - "composite chart"
  - "dual-axis chart"
  - "view"
  - "children"

related:
  - "g2-core-view-composition"
  - "g2-comp-facet-rect"

use_cases:
  - "Overlay a column chart and line chart for two-metric comparison"
  - "Overlay a scatterplot and trend line"
  - "Overlay a line chart and confidence interval area"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/composition/space-layer"
---

## Minimal Runnable Example (Column Chart + Line Chart)

```javascript
import { Chart } from '@antv/g2';

const data = [
  { month: 'Jan', sales: 200, growth: 15 },
  { month: 'Feb', sales: 280, growth: 22 },
  { month: 'Mar', sales: 320, growth: 8 },
  { month: 'Apr', sales: 250, growth: -5 },
  { month: 'May', sales: 410, growth: 18 },
];

const chart = new Chart({ container: 'container', width: 640, height: 400 });

// Approach 1: type: 'view' with children. This is the recommended and most concise approach.
chart.options({
  type: 'view',
  data,
  children: [
    // Column chart: show sales.
    {
      type: 'interval',
      encode: { x: 'month', y: 'sales', color: '#5B8FF9' },
      style: { fillOpacity: 0.8 },
      axis: { y: { title: 'Sales' } },
    },
    // Line chart: show growth rate with a shared x-axis.
    {
      type: 'line',
      encode: { x: 'month', y: 'growth' },
      scale: { y: { independent: true } },  // Independent y-axis for a dual-axis chart.
      style: { lineWidth: 2.5, stroke: '#F4664A' },
      axis: { y: { position: 'right', title: 'Growth Rate (%)' } },
    },
  ],
});

chart.render();
```

## Line Chart + Points (Mark Composition)

```javascript
chart.options({
  type: 'view',
  data,
  children: [
    {
      type: 'line',
      encode: { x: 'date', y: 'value', color: 'type' },
      style: { lineWidth: 2 },
    },
    {
      type: 'point',
      encode: { x: 'date', y: 'value', color: 'type' },
      style: { r: 4, lineWidth: 1, fill: '#fff' },
    },
  ],
});
```

## Area Chart + Line (Confidence Interval)

```javascript
chart.options({
  type: 'view',
  data: confidenceData,
  children: [
    // Confidence interval area.
    {
      type: 'area',
      encode: { x: 'date', y: 'upper', y1: 'lower', color: '#5B8FF9' },
      style: { fillOpacity: 0.2 },
    },
    // Center line.
    {
      type: 'line',
      encode: { x: 'date', y: 'mean' },
      style: { lineWidth: 2, stroke: '#5B8FF9' },
    },
  ],
});
```

## Common Errors and Fixes

### Error: A dual y-axis chart does not set `independent: true`, so both data series are mapped to the same y-axis range
```javascript
// Sales (0 to 400) and growth (-10 to 25) share one y-axis, so the growth line is almost flat.
chart.options({
  type: 'view',
  children: [
    { type: 'interval', encode: { x: 'month', y: 'sales' } },
    { type: 'line',     encode: { x: 'month', y: 'growth' } },  // No independent y-axis.
  ],
});

// Correct: Set independent: true on the second y-axis.
chart.options({
  type: 'view',
  children: [
    { type: 'interval', encode: { x: 'month', y: 'sales' } },
    {
      type: 'line',
      encode: { x: 'month', y: 'growth' },
      scale: { y: { independent: true } },  // Independent scale.
      axis: { y: { position: 'right' } },    // Place it on the right.
    },
  ],
});
```
