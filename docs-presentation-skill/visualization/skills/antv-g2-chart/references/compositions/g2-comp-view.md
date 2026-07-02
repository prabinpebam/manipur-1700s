---
id: "g2-comp-view"
title: "G2 View Composition"
description: |
  View composition is used to create multi-view charts. It can combine multiple marks together while sharing data, scales, axes, and other configuration.

library: "g2"
version: "5.x"
category: "compositions"
tags:
  - "composition"
  - "view"
  - "multi-view"
  - "composite chart"

related:
  - "g2-comp-space-layer"
  - "g2-comp-space-flex"
  - "g2-core-chart-init"

use_cases:
  - "multi-series charts"
  - "composite chart"
  - "multi-mark charts with shared configuration"

anti_patterns:
  - "A single-mark chart does not need a View composition"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/composition"
---

## Core Concepts

View composition allows multiple marks to be composed together:
- Share data and configuration.
- Manage scales and axes consistently.
- Support nested composition.

**Characteristics:**
- Child marks inherit parent configuration.
- Data can be merged across parent and child marks.
- Axes, legends, and other components can be configured at the view level.

## Minimal Runnable Example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'view',
  data: [
    { month: 'Jan', value: 100, type: 'A' },
    { month: 'Feb', value: 120, type: 'A' },
    { month: 'Jan', value: 80, type: 'B' },
    { month: 'Feb', value: 90, type: 'B' },
  ],
  children: [
    {
      type: 'line',
      encode: { x: 'month', y: 'value', color: 'type' },
    },
    {
      type: 'point',
      encode: { x: 'month', y: 'value', color: 'type' },
    },
  ],
});

chart.render();
```

## Common Variants

### Shared Axis Configuration

```javascript
chart.options({
  type: 'view',
  data,
  axis: {
    x: { title: 'Month' },
    y: { title: 'Value' },
  },
  children: [
    { type: 'line', encode: { x: 'month', y: 'value', color: 'type' } },
    { type: 'point', encode: { x: 'month', y: 'value', color: 'type' } },
  ],
});
```

### Shared Scales

```javascript
chart.options({
  type: 'view',
  data,
  scale: {
    color: {
      range: ['#1890ff', '#52c41a'],
    },
  },
  children: [
    { type: 'line', encode: { x: 'month', y: 'value', color: 'type' } },
    { type: 'point', encode: { x: 'month', y: 'value', color: 'type' } },
  ],
});
```

### Independent Data for Child Marks

```javascript
chart.options({
  type: 'view',
  children: [
    {
      type: 'interval',
      data: [{ category: 'A', value: 100 }],
      encode: { x: 'category', y: 'value' },
    },
    {
      type: 'line',
      data: [{ x: 0, y: 50 }, { x: 1, y: 150 }],
      encode: { x: 'x', y: 'y' },
      scale: { x: { type: 'identity' }, y: { domain: [0, 200] } },
    },
  ],
});
```

### With Legend Configuration

```javascript
chart.options({
  type: 'view',
  data,
  encode: { color: 'type' },
  legend: {
    color: { position: 'top' },
  },
  children: [
    { type: 'line', encode: { x: 'month', y: 'value', color: 'type' } },
    { type: 'point', encode: { x: 'month', y: 'value', color: 'type' } },
  ],
});
```

## Complete Type Reference

```typescript
interface ViewComposition {
  type: 'view';
  data?: DataOption;
  encode?: EncodeOption;
  scale?: ScaleOption;
  axis?: AxisOption;
  legend?: LegendOption;
  transform?: TransformOption[];
  slider?: SliderOption;
  children: MarkSpec[];  // Child mark array.
}
```

## Differences from SpaceLayer/SpaceFlex

| Composition Type | Purpose | Characteristics |
|---------|------|------|
| view | Multi-mark overlay | Shared coordinate system |
| spaceLayer | Multiple chart layer overlay | Independent coordinate systems |
| spaceFlex | Multi-view arrangement | Side-by-side or stacked layout |

## Common Errors and Fixes

### Error 1: Incorrect children format

```javascript
// Error: children should be an array.
chart.options({
  type: 'view',
  children: { type: 'line', ... },
});

// Correct.
chart.options({
  type: 'view',
  children: [{ type: 'line', ... }],
});
```

### Error 2: Child mark does not specify type

```javascript
// Error: A child mark must have a type.
chart.options({
  type: 'view',
  children: [{ encode: { x: 'a', y: 'b' } }],
});

// Correct.
chart.options({
  type: 'view',
  children: [{ type: 'line', encode: { x: 'a', y: 'b' } }],
});
```

### Error 3: Confusing parent data with child data

```javascript
// Note: View data is merged with child mark data.
// If a child mark has its own data, it overrides the parent data.

// Method 1: Provide data at the parent level.
chart.options({
  type: 'view',
  data,
  children: [
    { type: 'line', encode: { x: 'a', y: 'b' } },
  ],
});

// Method 2: Provide independent data for child marks.
chart.options({
  type: 'view',
  children: [
    { type: 'line', data, encode: { x: 'a', y: 'b' } },
  ],
});
```

### Error 4: Incorrect use of density and boxplot causes a blank screen

```javascript
// Error: The data format for density and boxplot is incorrect.
// density requires data transformed by KDE and must include y and size fields.
// boxplot requires raw data for internal statistical calculations.
chart.options({
  type: 'view',
  data: rawData,
  children: [
    {
      type: 'density',
      encode: { x: 'category', y: 'value', size: 'size' },
    },
    {
      type: 'boxplot',
      encode: { x: 'category', y: 'value' },
    },
  ],
});

// Correct: Use transform for KDE and ensure the data format is correct.
chart.options({
  type: 'view',
  data: {
    type: 'inline',
    value: rawData,
  },
  children: [
    {
      type: 'density',
      data: {
        transform: [
          {
            type: 'kde',
            field: 'value',
            groupBy: ['category'],
            size: 50, // Controls the detail level of the density curve.
          },
        ],
      },
      encode: {
        x: 'category',
        y: 'value',
        size: 'size',
        series: 'category',
      },
      style: {
        fillOpacity: 0.7,
      },
      tooltip: false,
    },
    {
      type: 'boxplot',
      encode: {
        x: 'category',
        y: 'value',
        series: 'category',
        shape: 'violin', // Optional; used for a violin plot.
      },
      style: {
        opacity: 0.8,
        strokeOpacity: 0.6,
        point: false, // Optional; hide outliers.
      },
    },
  ],
});
```
