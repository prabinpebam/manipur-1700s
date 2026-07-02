---
id: "g2-core-view-composition"
title: "G2 View Composition (view + children)"
description: |
  G2 v5 uses the type: 'view' container and the children array to implement multi-mark overlays,
  shared data, facets, and other composite charts.
  This is the standard way to compose multiple graphical layers in Spec mode.

library: "g2"
version: "5.x"
category: "core"
tags:
  - "view"
  - "children"
  - "view composition"
  - "multi-mark overlay"
  - "layer"
  - "composite chart"
  - "spec"

related:
  - "g2-core-chart-init"
  - "g2-comp-annotation"
  - "g2-comp-facet-rect"

use_cases:
  - "Overlay multiple graphics in the same coordinate system (line + scatter, area + line)"
  - "Share a data source across multiple child marks"
  - "Add annotation layers to charts"

anti_patterns:
  - "A view container is unnecessary when there is only one mark; use the corresponding type directly"
  - "Do not nest type: 'view' inside children. When a child mark needs independent data, specify the data field directly on that mark instead of wrapping it in another view + children"

difficulty: "intermediate"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/composition/view"
---

## Core Concepts

```
chart.options({
  type: 'view',      // Container type
   [...],       // Parent data (child marks can inherit it)
  encode: {...},     // Parent encoding (child marks can inherit it)
  children: [        // Child mark list (rendered in order; later marks appear on top)
    { type: 'area', ... },
    { type: 'line', ... },
    { type: 'point', ... },
  ],
});
```

**Data inheritance rules**:
- If a child mark does not specify `data`, it inherits the parent `data`
- If a child mark does not specify `encode`, it inherits the corresponding channels from the parent `encode`

## Area + Line + Scatter Overlay

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 700, height: 400 });

const data = [
  { month: 'Jan', value: 33 },
  { month: 'Feb', value: 78 },
  { month: 'Mar', value: 56 },
  { month: 'Apr', value: 91 },
  { month: 'May', value: 67 },
];

chart.options({
  type: 'view',
  data,                                    // Parent data shared by the three child marks
  encode: { x: 'month', y: 'value' },     // Parent encoding inherited by child marks
  children: [
    {
      type: 'area',
      style: { fill: '#1890ff', fillOpacity: 0.15 },
    },
    {
      type: 'line',
      style: { stroke: '#1890ff', lineWidth: 2 },
    },
    {
      type: 'point',
      encode: { shape: 'circle' },
      style: { fill: 'white', stroke: '#1890ff', r: 4, lineWidth: 2 },
    },
  ],
});

chart.render();
```

## Independent Child Mark Data (No Parent Inheritance)

```javascript
chart.options({
  type: 'view',
  children: [
    {
      type: 'interval',
       salesData,       // Independent data
      encode: { x: 'month', y: 'revenue' },
    },
    {
      type: 'line',
       trendData,       // Independent data
      encode: { x: 'month', y: 'growth' },
      scale: { y: { key: 'right' } },   // Independent y-axis
    },
  ],
});
```

## Line + Reference Line Composition

```javascript
chart.options({
  type: 'view',
  data,
  children: [
    {
      type: 'line',
      encode: { x: 'month', y: 'value' },
    },
    {
      type: 'lineY',                       // Horizontal reference line
       [{ threshold: 60 }],
      encode: { y: 'threshold' },
      style: { stroke: 'red', lineDash: [4, 4] },
      labels: [{ text: 'Target Line', position: 'right', style: { fill: 'red' } }],
    },
  ],
});
```

## Common Mistakes and Fixes

### Mistake 1: multiple options() calls overwrite configuration
```javascript
// Incorrect: each options() call overwrites the previous one
chart.options({ type: 'area', ... });
chart.options({ type: 'line', ... });   // Overwrites the area chart!

// Correct: use view + children
chart.options({
  type: 'view',
  data,
  children: [
    { type: 'area', ... },
    { type: 'line', ... },
  ],
});
```

### Mistake 2: nesting view inside children (a common misconception when transforming data separately for a child mark)

```javascript
// Incorrect: nesting another type:'view' + children inside children
chart.options({
  type: 'view',
  data,
  children: [
    { type: 'line', encode: { x: 'time', y: 'value' } },
    {
      type: 'view',                        // Unnecessary nested view
      data: data.map(d => ({              // Only trying to use derived data
        time: d.time,
        min: d.value - 0.1,
        max: d.value + 0.1,
      })),
      children: [
        { type: 'rangeY', encode: { x: 'time', y: 'min', y1: 'max' } },
      ],
    },
  ],
});

// Correct: specify data directly on the child mark; no nested view needed
chart.options({
  type: 'view',
  data,
  children: [
    { type: 'line', encode: { x: 'time', y: 'value' } },
    {
      type: 'rangeY',
      data: data.map(d => ({             // Declare independent data directly on the mark
        time: d.time,
        min: d.value - 0.1,
        max: d.value + 0.1,
      })),
      encode: { x: 'time', y: 'min', y1: 'max' },
      style: { fillOpacity: 0.1 },
    },
  ],
});
```

**Rule**: each element of the `children` array must be a mark (`line`/`point`/`interval`, etc.).
When a mark needs independent or derived data, write `data` directly on that mark node instead of wrapping it in another `view`.
G2 does not support nesting `view` inside `children`.

### Mistake 3: child mark encode field names do not match the data
```javascript
// Incorrect: parent and child encode field names should remain consistent
chart.options({
  type: 'view',
  data: [{ month: 'Jan', value: 33 }],
  encode: { x: 'month', y: 'value' },
  children: [
    {
      type: 'point',
      encode: { x: 'date', y: 'amount' },  // Field names do not match the data!
    },
  ],
});
```