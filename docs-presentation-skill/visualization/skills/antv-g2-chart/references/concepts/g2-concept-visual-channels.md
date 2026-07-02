---
id: "g2-concept-visual-channels"
title: "G2 Visual Channels"
description: |
  Visual channels map data attributes to visual attributes, including position, color, size, shape, direction, and more.
  Understanding each channel's perceptual efficiency and applicable data types helps you design more accurate and effective visualizations.
  This is the theoretical basis for G2 encode configuration design.

library: "g2"
version: "5.x"
category: "concepts"
tags:
  - "visual channels"
  - "encode"
  - "perceptual efficiency"
  - "data mapping"
  - "visualization design"
  - "color"
  - "size"
  - "position"

related:
  - "g2-core-encode-channel"
  - "g2-concept-color-theory"

use_cases:
  - "Understand the design principles behind G2 encode channels"
  - "Choose suitable visual channels for different data types"
  - "Avoid misusing channels with low perceptual efficiency"

difficulty: "intermediate"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
---

## Core Concepts

A visual channel maps a **data attribute** to a **visual attribute**. In G2, this mapping is specified through the `encode` field:

```javascript
chart.options({
  encode: {
    x: 'month',      // Position channel on the x-axis <- categorical field.
    y: 'revenue',    // Position channel on the y-axis <- quantitative field.
    color: 'product',// Color channel <- categorical field.
    size: 'amount',  // Size channel <- quantitative field.
  },
});
```

## Main Visual Channels and Their Perceptual Efficiency

### Quantitative Data (Continuous Values)

Ranked from highest to lowest perceptual accuracy:

| Rank | Channel | G2 Corresponding | Description |
|------|------|---------|------|
| ★★★★★ | **position (x/y axes)** | `encode.x`, `encode.y` | Most accurate; people can compare positions precisely |
| ★★★★ | **length/height** | `encode.y` (column chart) | Second most accurate; requires a common baseline |
| ★★★ | **area/size** | `encode.size` | Moderate accuracy; suitable for relative comparisons in bubble charts |
| ★★ | **color lightness/darkness** | `encode.color` (continuous color scale) | Harder to compare precisely; suitable only for rough trends |
| ★ | **angle** | Pie-chart slice angle | People judge angles poorly; use with caution |

### Categorical Data (Discrete Categories)

| Channel | G2 Corresponding | Applicable Scenario |
|------|---------|---------|
| **position grouping** | `encode.x` (category axis) | Categories in column charts or line charts |
| **color (hue)** | `encode.color` | Distinguish up to 8 categories; more categories become confusing |
| **shape** | `encode.shape` | Distinguish up to 6 categories in scatterplots |
| **texture/pattern** | `encode.shape` (custom) | Color-free environments or auxiliary distinction |

## Channel Selection Rules

```
Quantitative data (values) -> prefer: position axes (x/y) > size > color intensity (continuous color).
Categorical data (categories) -> prefer: position axes (x/y) > color hue > shape.
Ordered data (rank) -> prefer: position axis order > decreasing size > gradient color.
```

## Channel Combination Examples

### Bubble Chart: Three Quantitative Channels

```javascript
// x-position + y-position + size = three quantitative encodings.
// Color mapping table: scale.color.range and fill use the same values.
const COLOR_MAP = { 'Asia': '#fb7678', 'Europe': '#81e7ee', 'Americas': '#5B8FF9' };

chart.options({
  type: 'point',
  data,
  encode: {
    x: 'GDP',          // Quantitative -> position (most accurate).
    y: 'LifeExpectancy',// Quantitative -> position.
    size: 'Population', // Quantitative -> size (third dimension).
    color: 'Region',    // Category -> color hue (fourth dimension).
    shape: 'point',
  },
  scale: {
    size: { type: 'sqrt', range: [4, 40] },   // Square-root scale to keep area proportional to values.
    color: { range: Object.values(COLOR_MAP) },
  },
  style: {
    fillOpacity: 0.85,
    lineWidth: 0,
    // Radial gradient from a white center to the mapped edge color to simulate a 3D sphere.
    // Read the color from COLOR_MAP[datum.Region] and keep it consistent with scale.color.range.
    fill: (datum) => {
      const color = COLOR_MAP[datum.Region];
      return `radial-gradient(circle at 35% 35%, rgb(255,255,255) 0%, ${color} 100%)`;
    },
    shadowBlur: 10,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffsetY: 5,
  },  // Do not use stroke: '#fff'.
  legend: { size: false },
});
```

### Heatmap: Encode Values with Color Intensity

```javascript
// When color encodes quantitative data, use a sequential color scale from light to dark, not a categorical palette.
chart.options({
  type: 'cell',
  data,
  encode: {
    x: 'weekday',
    y: 'hour',
    color: 'value',     // Quantitative -> color lightness/darkness through a continuous color scale.
  },
  scale: {
    color: {
      type: 'sequential',
      palette: 'blues',  // Sequential color scale, not a categorical palette.
    },
  },
});
```

## Common Channel Misuse

### Misuse 1: Using color hue to represent numeric magnitude

```javascript
// ❌ Misuse: color hue such as red, green, or blue cannot express magnitude.
chart.options({
  encode: { color: 'temperature' },   // temperature is numeric, and hue cannot show magnitude.
  scale: { color: { type: 'ordinal' } },   // ❌ Categorical palette used for numeric values.
});

// ✅ Correct: use a continuous color scale for numeric values.
chart.options({
  encode: { color: 'temperature' },
  scale: {
    color: {
      type: 'sequential',   // Sequential scale.
      palette: 'reds',      // Ordered light-to-dark colors.
    },
  },
});
```

### Misuse 2: Using too many color categories

```javascript
// ❌ More than 8 color categories are difficult for people to distinguish.
chart.options({
  encode: { color: 'province' },   // If there are 31 provinces, color cannot separate them effectively.
});

// ✅ Alternatives when there are more than 8 categories:
// 1. Merge minor categories into "Other".
// 2. Use position channels, such as grouped column charts or faceting.
// 3. Use interactive filtering, such as clicking the legend to show or hide categories.
```

### Misuse 3: Too many pie-chart slices

```javascript
// ❌ The angle channel has low perceptual accuracy; more than 5 slices are hard to compare.
chart.options({
  type: 'interval',
  coordinate: { type: 'theta' },
  // If there are 10 or more categories, a pie chart performs poorly.
});

// ✅ Use a column chart when there are many categories; position channels are more accurate.
chart.options({
  type: 'interval',
  encode: { x: 'category', y: 'value' },
  transform: [{ type: 'sortX', by: 'y', reverse: true }],
});
```
