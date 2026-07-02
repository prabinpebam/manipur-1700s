---
id: "g2-mark-histogram"
title: "G2 Histogram Mark"
description: |
  Histogram Mark. Use the rect mark with the binX transform to show the distribution of continuous numeric data.
  It is suitable for statistical analysis, data-distribution exploration, and similar scenarios.

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "histogram"
  - "distribution"
  - "statistics"

related:
  - "g2-mark-boxplot"
  - "g2-transform-binx"

use_cases:
  - "Analyze data distributions"
  - "Perform statistical analysis"
  - "Count frequencies"

anti_patterns:
  - "Use a bar chart for comparing categorical data"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/mark/histogram"
---

## Core concepts

A histogram shows the distribution of continuous numeric data. Unlike a bar chart:
- A histogram uses the `rect` mark and supports the `x` and `x1` channels to represent intervals.
- It must be used with the `binX` transform to automatically bin and aggregate data.
- There is no spacing between bars, indicating that the data is continuous.

**Key elements:**
- `rect` mark: supports interval representation.
- `binX` transform: automatically bins and aggregates data.
- `x1` channel: represents the end position of the interval.

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

chart.options({
  type: 'rect',
  data: {
    type: 'fetch',
    value: 'https://gw.alipayobjects.com/os/antvdemo/assets/data/diamond.json',
  },
  encode: {
    x: 'carat',
    y: 'count',
  },
  transform: [
    { type: 'binX', y: 'count' },
  ],
  style: {
    fill: '#1890FF',
    fillOpacity: 0.9,
  },
});

chart.render();
```

## Common variants

### Specify the number of bins

```javascript
chart.options({
  type: 'rect',
  data,
  encode: { x: 'value', y: 'count' },
  transform: [
    { type: 'binX', y: 'count', thresholds: 30 },  // Specify the number of bins
  ],
});
```

### Compare multiple distributions

```javascript
chart.options({
  type: 'rect',
  data,
  encode: {
    x: 'price',
    y: 'count',
    color: 'group',
  },
  transform: [
    { type: 'binX', y: 'count', groupBy: ['group'] },
  ],
  style: { fillOpacity: 0.7 },
});
```

### With axis titles

```javascript
chart.options({
  type: 'rect',
  data,
  encode: { x: 'carat', y: 'count' },
  transform: [{ type: 'binX', y: 'count' }],
  axis: {
    x: { title: 'Diamond weight (carats)' },
    y: { title: 'Frequency' },
  },
});
```

## Complete type reference

```typescript
interface HistogramOptions {
  type: 'rect';
  encode: {
    x: string;           // Continuous numeric field
    y: 'count';          // Count statistic
    color?: string;      // Grouping field
  };
  transform: [
    {
      type: 'binX';
      y: 'count';
      thresholds?: number;  // Number of bins
      groupBy?: string[];   // Grouping fields
    }
  ];
}
```

## Histogram vs bar chart

| Feature | Histogram | Bar chart |
|------|--------|--------|
| Data type | Continuous numeric data | Categorical data |
| Mark type | `rect` | `interval` |
| Bar spacing | No spacing | Has spacing |
| X axis | Continuous intervals | Discrete categories |

## Common errors and fixes

### Error 1: Using the interval mark

```javascript
// Problem: interval does not support interval representation
type: 'interval'

// Correct: use the rect mark
type: 'rect'
```

### Error 2: Missing the binX transform

```javascript
// Problem: no binning or aggregation
encode: { x: 'value', y: 'count' }

// Correct: add the binX transform
transform: [{ type: 'binX', y: 'count' }]
```

### Error 3: Too little data

```javascript
// Note: a histogram needs enough data.
// Recommended data size: >= 50 records.
```