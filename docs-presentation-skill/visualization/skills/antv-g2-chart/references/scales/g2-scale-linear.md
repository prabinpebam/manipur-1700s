---
id: "g2-scale-linear"
title: "G2 Linear Scale"
description: |
  The G2 v5 linear scale maps continuous numeric fields and is configured through scale.y or scale.color.
  It supports custom domain (data range) and range (visual range).
  nice/clamp/tickCount control axis tick display.
library: "g2"
version: "5.x"
category: "scales"
tags:
  - "linear scale"
  - "linear"
  - "continuous"
  - "numeric"
  - "domain"
  - "range"
  - "spec"

related:
  - "g2-core-chart-init"
  - "g2-mark-line-basic"
  - "g2-comp-annotation"

use_cases:
  - "Control the Y-axis display range without starting from 0"
  - "Set color mapping to a continuous palette"
  - "Use clamp to truncate data outside the range"

difficulty: "intermediate"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/scale"
---

## Basic usage (custom Y-axis domain)

Line charts use a y-axis that starts at 0 by default. Use `scale.y.domain` to specify an exact range and make line details clearer:

> **Note**: `linear` is the default scale type for numeric fields, so **you do not need to manually specify `type: 'linear'`**.

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'line',
  data: [
    { month: 'Jan', value: 4200 },
    { month: 'Feb', value: 4500 },
    { month: 'Mar', value: 4100 },
    { month: 'Apr', value: 4800 },
    { month: 'May', value: 5200 },
    { month: 'Jun', value: 4900 },
  ],
  encode: { x: 'month', y: 'value' },
  scale: {
    y: {
      domain: [3800, 5500],   // Explicitly specify the y-axis range without starting from 0
      nice: true,             // Automatically extend to clean integer ticks
    },
  },
});

chart.render();
```

## Log scale

When data spans multiple orders of magnitude, use `type: 'log'` to compress the y-axis to a logarithmic scale:

```javascript
chart.options({
  type: 'line',
  data: [
    { year: '2018', revenue: 1200 },
    { year: '2019', revenue: 8500 },
    { year: '2020', revenue: 32000 },
    { year: '2021', revenue: 210000 },
    { year: '2022', revenue: 1500000 },
  ],
  encode: { x: 'year', y: 'revenue' },
  scale: {
    y: {
      type: 'log',      // Log scale, suitable for data spanning orders of magnitude
      base: 10,         // Logarithm base, default 10
      nice: true,
    },
  },
});
```

> Note: log scale cannot include 0 or negative values; otherwise rendering errors may occur.

## Color mapping: sequential color scale

Map a numeric field to continuous colors, suitable for heatmap or bubble-chart coloring:

```javascript
chart.options({
  type: 'point',
  data: [
    { x: 10, y: 20, density: 0.1 },
    { x: 30, y: 50, density: 0.5 },
    { x: 60, y: 80, density: 0.9 },
    { x: 45, y: 35, density: 0.3 },
    { x: 75, y: 60, density: 0.7 },
  ],
  encode: { x: 'x', y: 'y', color: 'density', size: 12 },
  scale: {
    color: {
      type: 'linear',
      domain: [0, 1],                           // Data range
      range: ['#d0e8ff', '#0050b3'],            // From light blue to dark blue
    },
  },
});
```

## Configuration reference

| Property | Type | Default | Description |
|------|------|--------|------|
| `type` | `'linear'` \| `'log'` \| `'pow'` \| `'sqrt'` | `'linear'` | Scale type |
| `domain` | `[number, number]` | Data min/max | Data mapping range (input domain) |
| `range` | `[number, number]` \| `string[]` | Depends on the channel | Visual mapping range (output range) |
| `nice` | `boolean` | `false` | Automatically extend domain to integer ticks |
| `clamp` | `boolean` | `false` | Clamp values outside domain to the boundaries |
| `tickCount` | `number` | Automatic | Expected number of ticks (approximate) |
| `tickInterval` | `number` | Automatic | Fixed interval between adjacent ticks |
| `tickMethod` | `function` | Built-in method | Custom tick generation method |
| `base` | `number` | `10` | Valid only when `type: 'log'`; logarithm base |
| `exponent` | `number` | `2` | Valid only when `type: 'pow'`; exponent |
| `zero` | `boolean` | `true` | Whether to force domain to include 0 |

```javascript
// Complete configuration example
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value' },
  scale: {
    y: {
      // type: 'linear',  // Can be omitted; numeric fields default to linear
      domain: [0, 1000],
      nice: true,
      clamp: true,
      tickCount: 5,
      // tickInterval: 200,  // Choose either this or tickCount
      zero: false,           // Do not force the scale to start at 0
    },
  },
});
```

## Custom ticks with tickMethod

`tickMethod` is used to customize tick generation. Its signature is `(min, max, count) => number[]`:

```javascript
scale: {
  y: {
    tickCount: 5,
    tickMethod: (min, max, count) => {
      // Parameter description:
      // min - data minimum
      // max - data maximum
      // count - recommended number of ticks

      // Custom tick generation logic
      const step = (max - min) / (count - 1);
      const ticks = [];
      for (let i = 0; i < count; i++) {
        ticks.push(min + i * step);
      }
      return ticks;  // Return a numeric array
    },
  },
}
```

**Note**: If you only need to format tick label text, use `axis.labelFormatter`:

```javascript
axis: {
  y: {
    labelFormatter: (v) => `${v}K`,  // Format the label
  },
}
```

## Common mistakes and fixes

### Mistake: forgetting to set `nice: true` results in uneven ticks

```javascript
// ❌ Ticks may include non-integers such as 3827 and 4183
chart.options({
  scale: { y: { domain: [3827, 5243] } },
});

// ✅ nice: true automatically extends to integer ticks such as 3800 and 5400
chart.options({
  scale: { y: { domain: [3827, 5243], nice: true } },
});
```

### Mistake: domain minimum is greater than the maximum (reversed axis)

```javascript
// ❌ Reversing domain flips the axis direction, which is usually not intended
chart.options({
  scale: { y: { domain: [1000, 0] } },
});

// ✅ Correct: put the minimum first and the maximum second
chart.options({
  scale: { y: { domain: [0, 1000] } },
});
```

### Mistake: using log scale with 0 or negative values

```javascript
// ❌ log(0) = -Infinity, which can cause rendering errors or a blank chart
chart.options({
  data: [{ x: 'A', y: 0 }, { x: 'B', y: 100 }],
  scale: { y: { type: 'log' } },
});

// ✅ Ensure all y values are > 0, or preprocess and filter the data
chart.options({
  data: data.filter(d => d.y > 0),
  scale: { y: { type: 'log', domain: [1, 1000000] } },
});
```

### Mistake: setting tickCount and tickInterval at the same time

```javascript
// ❌ When both are set, tickInterval takes precedence and tickCount is ignored
chart.options({
  scale: { y: { tickCount: 5, tickInterval: 200 } },
});

// ✅ Choose one according to your needs
chart.options({
  scale: { y: { tickCount: 5 } },      // About 5 ticks
  // or
  // scale: { y: { tickInterval: 200 } },  // One tick every 200
});
```
