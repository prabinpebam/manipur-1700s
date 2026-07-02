---
id: "g2-comp-legend-continuous"
title: "G2 Continuous Legend (legendContinuous)"
description: |
  Continuous legends show how continuous numeric values map to colors and are common in heatmaps, geographic visualizations, and similar scenarios.
  They support both ribbon and block forms, with configurable label formatting, ranges, and more.

library: "g2"
version: "5.x"
category: "components"
tags:
  - "legend"
  - "continuous legend"
  - "ribbon"
  - "color legend"
  - "heatmap"

related:
  - "g2-comp-legend-config"
  - "g2-comp-legend-category"
  - "g2-scale-sequential"

use_cases:
  - "color-mapping explanations for heatmaps"
  - "numeric range legends for geographic visualizations"
  - "color encoding for continuous numeric values"

anti_patterns:
  - "Use a category legend (legendCategory) for categorical data"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/component/legend"
---

## Core Concepts

A continuous legend shows the mapping from continuous numeric values to a visual channel (usually color):
- When `encode.color` maps to a continuous numeric field, the legend automatically becomes a continuous legend
- Supports linear scales (linear), threshold scales (threshold), and quantile/quantize scales (quantile/quantize)
- Displayed as a ribbon by default

## Minimal Runnable Example

```javascript
import { Chart } from '@antv/g2';

const data = Array.from({ length: 100 }, (_, i) => ({
  x: i % 10,
  y: Math.floor(i / 10),
  value: Math.random() * 100,
}));

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'cell',
  data,
  encode: { x: 'x', y: 'y', color: 'value' },  // value is a continuous numeric value
  scale: { color: { palette: 'Blues' } },
  legend: {
    color: {
      position: 'right',
      length: 200,
      labelFormatter: (v) => Number(v).toFixed(0),  // Note: v may be a string, so convert it first
    },
  },
});

chart.render();
```

## Complete Configuration Options

```javascript
chart.options({
  type: 'cell',
  data,
  encode: { x: 'x', y: 'y', color: 'value' },
  legend: {
    color: {
      // ── position ─────────────────────────────────
      position: 'right',       // 'top' | 'bottom' | 'left' | 'right'
      layout: {
        justifyContent: 'center',
      },

      // ── Size ─────────────────────────────────
      length: 200,             // Ribbon length (px)
      size: 20,                // Ribbon width/height (px)

      // ── Title ─────────────────────────────────
      title: 'Value Range',
      titleFontSize: 12,

      // ── Labels ─────────────────────────────────
      labelFormatter: (v) => Number(v).toFixed(1),  // Note: v may be a string, so convert it first
      labelAlign: 'value',     // 'value' | 'range'

      // ── Style ─────────────────────────────────
      style: {
        ribbonFill: 'black',   // Default ribbon fill color (when no color mapping is present)
      },
    },
  },
});
```

## Common Variants

### Threshold Legend (Segmented Ribbon)

```javascript
// When using threshold/quantize/quantile scales, the legend automatically becomes segmented
chart.options({
  type: 'cell',
  data,
  encode: { x: 'x', y: 'y', color: 'value' },
  scale: {
    color: {
      type: 'quantize',       // Segmented scale
      domain: [0, 100],
      range: ['#f7fbff', '#6baed6', '#08519c'],  // 3 color segments
    },
  },
  legend: {
    color: {
      position: 'right',
    },
  },
});
```

### Horizontal Ribbon

```javascript
chart.options({
  type: 'cell',
  data,
  encode: { x: 'x', y: 'y', color: 'value' },
  legend: {
    color: {
      position: 'bottom',
      length: 400,
      size: 15,
      layout: { justifyContent: 'center' },
    },
  },
});
```

### Custom Ribbon Colors

```javascript
chart.options({
  type: 'cell',
  data,
  encode: { x: 'x', y: 'y', color: 'value' },
  scale: {
    color: {
      type: 'linear',
      domain: [0, 100],
      range: ['#e6f5ff', '#0066cc'],  // Gradient range
    },
  },
  legend: {
    color: {
      position: 'right',
      labelFormatter: (v) => `${Number(v)}°C`,  // Note: v may be a string, so convert it first
    },
  },
});
```

### size Channel Legend

```javascript
// The size channel also generates a continuous legend
chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y', size: 'value' },
  legend: {
    size: {
      position: 'right',
      title: 'Size',
    },
  },
});
```

## Complete Type Reference

```typescript
interface LegendContinuousOptions {
  position?: 'top' | 'bottom' | 'left' | 'right';
  layout?: FlexLayout;
  title?: string | string[];
  length?: number;           // Ribbon length
  size?: number;             // Ribbon width
  labelFormatter?: string | ((value: number) => string);
  labelAlign?: 'value' | 'range';
  style?: {
    ribbonFill?: string;
    [key: string]: any;
  };
}
```

## Continuous Legends vs Category Legends

| Feature | Continuous Legend | Category Legend |
|------|----------|----------|
| Data type | Continuous numeric values | Discrete categories |
| Visual form | Ribbon/block | Legend item list |
| Scale | linear, threshold, quantize | band, ordinal |
| Suitable scenarios | Heatmaps, maps, bubble charts | Bar charts, line charts |

## Common Errors and Fixes

### Error 1: Using a Continuous Legend for Categorical Data

```javascript
// ❌ Problem: category is a categorical field and should not use a continuous legend
encode: { color: 'category' }  // Categorical data
// A continuous legend will not display well

// ✅ Correct: categorical data automatically uses a category legend
// G2 automatically selects the legend type based on the data type
```

### Error 2: Incorrect labelFormatter Parameter Type

```javascript
// ❌ Problem: the labelFormatter parameter v may be a string (not a number)
// G2 continuous legends pass tick values as strings, so calling .toFixed() directly will throw an error
labelFormatter: (v) => v.toFixed(1)   // ❌ TypeError: v.toFixed is not a function
labelFormatter: (v) => v * 100        // ❌ Returns a number instead of a string

// ✅ Correct: convert to a number first, then format it, and finally return a string
labelFormatter: (v) => Number(v).toFixed(1)          // ✅ Keep 1 decimal place
labelFormatter: (v) => `${(Number(v) * 100).toFixed(0)}%`  // ✅ Percentage format
labelFormatter: (v) => `${parseFloat(v).toFixed(0)}m`      // ✅ With unit
```

### Error 3: length Is Too Small

```javascript
// ❌ Problem: the ribbon length is too small, causing labels to overlap
legend: { color: { length: 50 } }  // Too short

// ✅ Correct: set an appropriate length based on the number of labels
legend: { color: { length: 200 } }  // Appropriate
```

## Choosing Between legendCategory and Continuous Legends

- **Use a continuous legend**: when the color/size channel maps to a continuous numeric field
- **Use a category legend**: when the color channel maps to a categorical field

G2 automatically selects the correct legend type based on the scale type; you do not need to specify it manually.