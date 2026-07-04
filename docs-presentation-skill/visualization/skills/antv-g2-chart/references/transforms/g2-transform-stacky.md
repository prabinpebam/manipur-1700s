---
id: "g2-transform-stacky"
title: "G2 StackY Stacking Transform"
description: |
  StackY is a Mark Transform in G2 v5 for stacking data.
  It accumulates multiple values at the same x position in sequence and generates y0/y1 intervals.
  It is configured in the transform array (at the same level as data and encode) and is a core dependency for stacked bar charts, stacked area charts, and pie charts.

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "StackY"
  - "stacking"
  - "stackY"
  - "mark transform"
  - "stacked bar chart"
  - "stacked area chart"
  - "spec"

related:
  - "g2-mark-interval-stacked"
  - "g2-mark-area-stacked"
  - "g2-transform-normalizey"
  - "g2-transform-dodgex"
  - "g2-data-fold"

use_cases:
  - "Create a stacked bar chart"
  - "Create a stacked area chart"
  - "Create a pie chart (with the theta coordinate system)"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform/stack-y"
---

## Core Concept

**StackY is a Mark Transform, not a Data Transform**

- Mark transforms are configured in the `transform` array (at the same level as `data` and `encode`)
- They run during mark rendering and modify visual channel values
- **Do not** put them in `data.transform`

StackY performs cumulative calculations for the data in each x group:
- Input: `y` values (the raw values of each subcategory)
- Output: `y0` (bottom position) and `y1` (top position), which drive the start and end positions of bars or areas

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],  // ✅ Mark Transform: at the same level as data/encode
});
```

## Basic Usage (Spec Mode)

```javascript
import { Chart } from '@antv/g2';

// Stacked bar chart
const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data: [
    { month: 'Jan', type: 'A', value: 100 },
    { month: 'Jan', type: 'B', value: 200 },
    { month: 'Feb', type: 'A', value: 120 },
    { month: 'Feb', type: 'B', value: 180 },
  ],
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],   // Declare the stacking transform
});

chart.render();
```

## Configuration Options

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [
    {
      type: 'stackY',
      orderBy: null,     // null | 'value' | 'sum' | 'series' - controls the stacking order
      reverse: false,    // Whether to reverse the stacking order
      y: 'y',            // Input y-channel name (default 'y')
      y1: 'y1',          // Output bottom-channel name (default 'y1')
    },
  ],
});
```

## Combining with normalizeY (Percentage Stacking)

```javascript
// The transform array supports chained execution of multiple transforms
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [
    { type: 'stackY' },       // Stack first
    { type: 'normalizeY' },   // Then normalize to [0, 1]
  ],
  axis: {
    y: { labelFormatter: (v) => `${(v * 100).toFixed(0)}%` },
  },
});
```

## Using It for Pie Charts (with the theta Coordinate System)

```javascript
chart.options({
  type: 'interval',
  data: [
    { type: 'Category 1', value: 40 },
    { type: 'Category 2', value: 30 },
    { type: 'Category 3', value: 30 },
  ],
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],           // Convert values into angular intervals
  coordinate: { type: 'theta', outerRadius: 0.8 },
});
```

## Using It for Stacked Area Charts

```javascript
chart.options({
  type: 'area',
  data: [...],
  encode: { x: 'date', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
});
```

## Common Errors and Fixes

### Error 1: Putting stackY in data.transform

```javascript
// ❌ Error: stackY is a Mark Transform and cannot be placed in data.transform
chart.options({
  type: 'interval',
   {
    type: 'inline',
    value: data,
    transform: [{ type: 'stackY' }],  // ❌ Wrong location
  },
});

// ✅ Correct: put stackY in the mark's transform (at the same level as data/encode)
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],  // ✅ Correct
});
```

### Error 2: Writing transform as an Object Instead of an Array
```javascript
// ❌ Error: transform must be an array
chart.options({ transform: { type: 'stackY' } });

// ✅ Correct
chart.options({ transform: [{ type: 'stackY' }] });
```

### Error 3: Forgetting stackY in a Pie Chart
```javascript
// ❌ Error: without stackY in the theta coordinate system, all sectors start at 0 and completely overlap
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  coordinate: { type: 'theta' },
  // Missing transform!
});

// ✅ Correct
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],   // Required!
  coordinate: { type: 'theta' },
});
```

### Error 4: Multi-Series Data Is Shown Without Stacking, Causing Overlap
```javascript
// ❌ Error: a multi-type interval without stackY or dodgeX places bars on top of each other at the same position
chart.options({
  type: 'interval',
  data: multiTypeData,
  encode: { x: 'month', y: 'value', color: 'type' },
  // Neither stackY (stacking) nor dodgeX (grouping) is configured
});

// ✅ Stacked display
chart.options({ transform: [{ type: 'stackY' }], ... });

// ✅ Grouped display
chart.options({ transform: [{ type: 'dodgeX' }], ... });
```
