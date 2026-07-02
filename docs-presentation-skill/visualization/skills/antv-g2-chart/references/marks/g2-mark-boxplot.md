---
id: "g2-mark-boxplot"
title: "G2 boxplot Automatic Statistical Boxplot"
description: |
  boxplot is a composite Mark in G2 v5 that automatically calculates Q1/Q2/Q3/whiskers/outliers from raw data.
  You can generate a standard boxplot directly from detailed data without manually computing the five-number summary.
  Unlike the box mark, which requires manually supplied statistics such as Q1/Q3, boxplot has built-in statistical calculation logic.

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "boxplot"
  - "boxplot chart"
  - "automatic statistics"
  - "distribution"
  - "Q1"
  - "Q3"
  - "median"
  - "outlier"

related:
  - "g2-mark-box-boxplot"
  - "g2-mark-point-scatter"
  - "g2-transform-bin"

use_cases:
  - "Draw a boxplot directly from detailed data without precomputation"
  - "Compare distributions across multiple groups"
  - "Show distribution shape and outliers"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/statistics/box/#boxplot"
---

## Difference from the box mark

| | `boxplot` | `box` |
|--|-----------|-------|
| Input data | Detailed data (statistics calculated automatically) | Requires manually supplied fields such as Q1/Q3 |
| Composition | Composite Mark (includes box, whiskers, and outliers) | Single Mark (draws only the box) |
| Suitable scenario | Most scenarios (recommended) | When data is already pre-aggregated |

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'boxplot',
  data: [
    { group: 'A', value: 10 },
    { group: 'A', value: 14 },
    { group: 'A', value: 12 },
    { group: 'A', value: 25 },   // Outlier
    { group: 'A', value: 11 },
    { group: 'A', value: 13 },
    { group: 'B', value: 20 },
    { group: 'B', value: 22 },
    { group: 'B', value: 18 },
    { group: 'B', value: 5 },    // Outlier
    { group: 'B', value: 21 },
  ],
  encode: {
    x: 'group',   // Grouping field
    y: 'value',   // Numeric field (statistics calculated automatically)
  },
});

chart.render();
```

## Configure styles

```javascript
chart.options({
  type: 'boxplot',
  data,
  encode: {
    x: 'category',
    y: 'score',
    color: 'category',   // Color by category
  },
  style: {
    boxFill: '#1890ff',          // Box fill color
    boxFillOpacity: 0.3,         // Box opacity
    boxStroke: '#1890ff',        // Box border color
    medianStroke: '#ff4d4f',     // Median line color
    medianLineWidth: 2,          // Median line width
    whiskerStroke: '#666',       // Whisker line color
    outlierFill: '#ff4d4f',      // Outlier point color
    outlierR: 4,                 // Outlier point radius
  },
});
```

## Horizontal boxplot

```javascript
chart.options({
  type: 'boxplot',
  data,
  encode: {
    x: 'score',      // x-axis is numeric
    y: 'category',   // y-axis is categorical
  },
  coordinate: { transform: [{ type: 'transpose' }] },
});
```

## Polar boxplot

```javascript
chart.options({
  type: 'box',
  data: [
    { x: "Oceania", y: [1, 9, 16, 22, 24] },
    { x: "East Europe", y: [1, 5, 8, 12, 16] },
    { x: "Australia", y: [1, 8, 12, 19, 26] },
    { x: "South America", y: [2, 8, 12, 21, 28] },
    { x: "North Africa", y: [1, 8, 14, 18, 24] },
    { x: "North America", y: [3, 10, 17, 28, 30] },
    { x: "West Europe", y: [1, 7, 10, 17, 22] },
    { x: "West Africa", y: [1, 6, 8, 13, 16] }
  ],
  encode: {
    x: 'x',
    y: 'y', // The y field itself is a [min, Q1, median, Q3, max] array
    color: 'x' // Map x (region) to color
  },
  coordinate: {
    type: 'polar', // Polar coordinates
    innerRadius: 0.2 // Optional: set an inner radius to avoid crowding near the center
  },
  scale: {
    x: {
      paddingInner: 0.6,
      paddingOuter: 0.3
    },
    y: {
      zero: true
    }
  },
  style: {
    stroke: "black"
  },
  axis: {
    y: {
      tickCount: 5
    }
  },
  tooltip: {
    items: [
      { channel: 'y', name: 'min' },
      { channel: 'y1', name: 'q1' },
      { channel: 'y2', name: 'q2' },
      { channel: 'y3', name: 'q3' },
      { channel: 'y4', name: 'max' }
    ]
  },
  legend: false // Hide the legend because color matches the x-axis
});
```

## Violin plot (Violin Shape)

```javascript
chart.options({
  type: 'boxplot',
  data,
  encode: {
    x: 'category',
    y: 'value',
    color: 'category',
    shape: 'violin',  // Set shape to violin to create a violin plot effect
  },
  style: {
    opacity: 0.5,
    strokeOpacity: 0.5,
    point: false,     // Hide outlier points
  },
});
```

## Common mistakes and fixes

### Mistake: Using box instead of boxplot without providing statistical fields
```javascript
// Error: box mark requires manually provided Q1/median/Q3/min/max fields
chart.options({
  type: 'box',
  data: rawDetailData,   // Raw detailed data
  encode: { x: 'group', y: 'value' },  // box requires y to be [min, Q1, median, Q3, max]
});

// When using raw detailed data, use boxplot instead (automatic statistics)
chart.options({
  type: 'boxplot',
  data: rawDetailData,
  encode: { x: 'group', y: 'value' },  // boxplot calculates automatically
});
```

### Mistake: Not correctly combining density and boxplot when drawing a violin plot
```javascript
// Error: using boxplot alone with shape: 'violin' does not produce a true density outline
chart.options({
  type: 'view',
  data,
  children: [
    {
      type: 'boxplot',
      encode: {
        x: 'x',
        y: 'y',
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

// Correct approach: combine density + boxplot to implement a violin plot
chart.options({
  type: 'view',
  data,
  children: [
    // Kernel density estimation curve (KDE)
    {
      type: 'density',
      data: {
        transform: [
          {
            type: 'kde',
            field: 'y',
            groupBy: ['x', 'species'],
          },
        ],
      },
      encode: {
        x: 'x',
        y: 'y',
        color: 'species',
        size: 'size',
        series: 'species',
      },
      style: {
        fillOpacity: 0.7,
      },
      tooltip: false,
    },
    // Violin-shaped boxplot (shows only statistical information)
    {
      type: 'boxplot',
      encode: {
        x: 'x',
        y: 'y',
        color: 'species',
        shape: 'violin',
      },
      style: {
        opacity: 0.8,
        strokeOpacity: 0.6,
        point: false,
      },
    },
  ],
});
```

### Mistake: Using boxplot instead of box for polar boxplots
```javascript
// Error: using boxplot to process aggregated five-number summary data
chart.options({
  type: 'boxplot',
  data: [
    { x: "Oceania", y: [1, 9, 16, 22, 24] },
    { x: "East Europe", y: [1, 5, 8, 12, 16] }
  ],
  encode: { x: 'x', y: 'y' }
});

// Correct: use the box mark for aggregated five-number summary data
chart.options({
  type: 'box',
  data: [
    { x: "Oceania", y: [1, 9, 16, 22, 24] },
    { x: "East Europe", y: [1, 5, 8, 12, 16] }
  ],
  encode: { x: 'x', y: 'y' }
});
```

### Mistake: Incorrect tooltip items configuration
```javascript
// Error: tooltip items uses a nonexistent channel name
chart.options({
  type: 'box',
  data,
  encode: { x: 'x', y: 'y' },
  tooltip: {
    items: [
      { channel: 'y0', name: 'min' }, // Error! y0 is not a field name or channel name
      { channel: 'y1', name: 'Q1' },
      { channel: 'y2', name: 'median' },
      { channel: 'y3', name: 'Q3' },
      { channel: 'y4', name: 'max' }
    ]
  }
});

// Correct: use the correct channel names
chart.options({
  type: 'box',
  data,
  encode: { x: 'x', y: 'y' },
  tooltip: {
    items: [
      { channel: 'y', name: 'min' },
      { channel: 'y1', name: 'q1' },
      { channel: 'y2', name: 'q2' },
      { channel: 'y3', name: 'q3' },
      { channel: 'y4', name: 'max' }
    ]
  }
});
```
</skill>
```
