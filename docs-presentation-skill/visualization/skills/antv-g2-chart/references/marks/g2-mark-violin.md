---
id: "g2-mark-violin"
title: "G2 Violin Plot Mark"
description: |
  A violin plot combines density and boxplot marks to show a distribution shape estimated with kernel density estimation.
  It is useful for comparing distributions across groups and exploring the spread, modality, and range of data.

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "violin plot"
  - "violin"
  - "density distribution"
  - "statistical analysis"

related:
  - "g2-mark-boxplot"
  - "g2-mark-density"

use_cases:
  - "comparing distributions across groups"
  - "exploring data distribution patterns"
  - "outlier detection"

anti_patterns:
  - "For small datasets with fewer than 20 observations, consider a boxplot or point-based chart."
  - "Not suitable for discrete data."

difficulty: "intermediate"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/mark/violin"
---

## Core concepts

A violin plot combines a boxplot with a kernel density estimate:
- Shows the full distribution shape.
- Overlays boxplot statistics.
- Uses KDE (kernel density estimation) to generate the density outline.

**Main components:**
- Density outline: shows distribution density.
- Boxplot: displays median, quartiles, and range.
- Median line: marks the median position.

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  theme: 'classic',
});

chart.options({
  type: 'view',
  data: {
    type: 'fetch',
    value: 'https://assets.antv.antgroup.com/g2/species.json',
  },
  children: [
    {
      type: 'density',
      data: {
        transform: [
          { type: 'kde', field: 'y', groupBy: ['x', 'species'] },
        ],
      },
      encode: {
        x: 'x',
        y: 'y',
        series: 'species',
        color: 'species',
        size: 'size',
      },
      tooltip: false,
    },
    {
      type: 'boxplot',
      encode: {
        x: 'x',
        y: 'y',
        series: 'species',
        color: 'species',
        shape: 'violin',
      },
      style: {
        opacity: 0.5,
        strokeOpacity: 0.5,
        point: false,
      },
    },
  ],
});

chart.render();
```

## Common variants

### Polar-coordinate violin plot

```javascript
chart.options({
  type: 'view',
  coordinate: { type: 'polar' },
  data: {
    type: 'fetch',
    value: 'https://assets.antv.antgroup.com/g2/species.json',
  },
  children: [
    {
      type: 'density',
      data: { transform: [{ type: 'kde', field: 'y', groupBy: ['x', 'species'] }] },
      encode: { x: 'x', y: 'y', series: 'species', color: 'species', size: 'size' },
      tooltip: false,
    },
    {
      type: 'boxplot',
      encode: { x: 'x', y: 'y', series: 'species', color: 'species', shape: 'violin' },
      style: { opacity: 0.5, strokeOpacity: 0.5, point: false },
    },
  ],
});
```

### Pure density plot

```javascript
chart.options({
  type: 'density',
  data: {
    type: 'fetch',
    value: 'https://assets.antv.antgroup.com/g2/species.json',
    transform: [
      { type: 'kde', field: 'y', groupBy: ['x'], size: 20 },
    ],
  },
  encode: {
    x: 'x',
    y: 'y',
    color: 'x',
    size: 'size',
  },
  tooltip: false,
});
```

### With outlier markers

```javascript
chart.options({
  type: 'view',
  data: {
    type: 'fetch',
    value: 'https://assets.antv.antgroup.com/g2/morley.json',
  },
  children: [
    {
      type: 'density',
      data: { transform: [{ type: 'kde', field: 'Speed', groupBy: ['Expt'] }] },
      encode: { x: 'Expt', y: 'Speed', size: 'size', color: 'Expt' },
      style: { fillOpacity: 0.4 },
      tooltip: false,
    },
    {
      type: 'boxplot',
      encode: { x: 'Expt', y: 'Speed', color: 'Expt', shape: 'violin' },
      style: {
        opacity: 0.8,
        point: { fill: 'red', size: 3 }, // Outlier markers.
      },
    },
  ],
});
```

## Full type reference

```typescript
interface ViolinOptions {
  type: 'view';
  data: any; // Original data source.
  children: [
    {
      type: 'density';
      data: {
        transform: [
          {
            type: 'kde';
            field: string; // Value field.
            groupBy: string[]; // Grouping fields; should include the x-axis and grouping fields.
            size?: number; // Number of samples. Default is 10; 20-50 is recommended for a smoother curve.
          }
        ]
      };
      encode: {
        x: string;
        y: string;
        size: 'size';
        color?: string;
        series: string;
      };
      tooltip?: boolean; // Recommended to disable to avoid overlap with boxplot tooltips.
    },
    {
      type: 'boxplot';
      encode: {
        x: string;
        y: string;
        shape: 'violin';
        color?: string;
        series: string;
      };
      style?: {
        opacity?: number;
        strokeOpacity?: number;
        point?: boolean | object; // Whether to display outlier points.
      };
    }
  ];
}
```

## Violin plot vs. boxplot

| Feature | Violin plot | Boxplot |
|------|----------|--------|
| Distribution view | Complete density shape | Statistical summary |
| Multimodal detection | Supported | Not supported |
| Simplicity | More complex | Simple |

## Common errors and fixes

### Error 1: Missing the KDE transform

```javascript
// ❌ Problem: missing kernel density estimation.
data: { type: 'fetch', value: 'data.json' }

// ✅ Correct: add the kde transform.
data: {
  type: 'fetch',
  value: 'data.json',
  transform: [{ type: 'kde', field: 'y', groupBy: ['x', 'species'] }],
}
```

### Error 2: Too little data

```javascript
// ⚠️ Note: each group should preferably contain at least 20-30 data points.
// For small datasets, a boxplot or point-based chart is usually better.
```

### Error 3: Missing the boxplot overlay

```javascript
// ❌ Problem: using only a density chart omits summary statistics.
children: [{ type: 'density', ... }]

// ✅ Correct: overlay a boxplot.
children: [
  { type: 'density', ... },
  { 
    type: 'boxplot', 
    encode: { 
      shape: 'violin',
      x: 'x',
      y: 'y',
      series: 'species',
      color: 'species'
    } 
  },
]
```

### Error 4: KDE transform is configured in the wrong place

```javascript
// ❌ Problem: groupBy fields are incomplete or missing.
transform: [{ type: 'kde', field: 'y', groupBy: ['x'] }]

// ✅ Correct: groupBy includes all grouping fields.
transform: [{ type: 'kde', field: 'y', groupBy: ['x', 'species'] }]
```

### Error 5: Encode mapping is incomplete

```javascript
// ❌ Problem: missing required encode mappings.
encode: { x: 'x', y: 'y' }

// ✅ Correct: include all required fields.
encode: {
  x: 'x',
  y: 'y',
  series: 'species',
  color: 'species',
  size: 'size'
}
```
