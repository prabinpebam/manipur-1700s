---
id: "g2-interaction-brush"
title: "G2 Brushing Interaction (brush)"
description: |
  G2 v5 includes built-in brushing interactions. Use interaction: [{ type: 'brushHighlight' }] or brushFilter
  to drag the mouse to select a region and highlight or filter data points. This is commonly used in scatter plots, line charts, and other scenarios that require local focus.

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "brush"
  - "brushing"
  - "interaction"
  - "brushHighlight"
  - "brushFilter"
  - "interaction"
  - "spec"

related:
  - "g2-mark-point-scatter"
  - "g2-interaction-element-highlight"
  - "g2-core-view-composition"

use_cases:
  - "Select a data-point region of interest in a scatter plot"
  - "Select and filter a time range in a time-series chart"
  - "Focus local analysis on a large dataset"

difficulty: "intermediate"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/brush-highlight"
---

## Basic Usage (brushHighlight: Brushing Highlight)

Drag the mouse to select data points. The selected region is highlighted, and unselected regions are dimmed:

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'point',
  data: [
    { x: 1, y: 4.8, category: 'A' },
    { x: 2, y: 3.2, category: 'B' },
    { x: 3, y: 6.1, category: 'A' },
    { x: 4, y: 2.5, category: 'C' },
    { x: 5, y: 7.3, category: 'B' },
    { x: 6, y: 5.0, category: 'A' },
    { x: 7, y: 1.8, category: 'C' },
  ],
  encode: { x: 'x', y: 'y', color: 'category', size: 8 },
  interaction: [
    { type: 'brushHighlight' },   // Brushing highlight
  ],
});

chart.render();
```

## brushFilter: Brushing Filter

After brushing, only the data points inside the selected region are kept (the others are removed):

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y', color: 'category' },
  interaction: [
    { type: 'brushFilter' },   // Brushing filter (display only points in the selected region)
  ],
});
```

## Scatter Plot + Brushing + Detail Linkage

```javascript
chart.options({
  type: 'point',
  data,
  encode: {
    x: 'income',
    y: 'happiness',
    color: 'region',
    size: 'population',
  },
  scale: {
    size: { range: [4, 20] },
  },
  interaction: [
    { type: 'brushHighlight' },
    { type: 'tooltip' },         // Also keep the tooltip interaction
  ],
  legend: { color: { position: 'top' } },
});
```

## Single-Axis Brushing (Horizontal/Vertical Only)

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'date', y: 'price' },
  interaction: [
    {
      type: 'brushXHighlight',   // Allow horizontal brushing only (by time range)
    },
  ],
});

// Vertical brushing: brushYHighlight
chart.options({
  interaction: [{ type: 'brushYHighlight' }],
});
```

## Brushing + Linked Charts

Listen for events to implement linked charts:

```javascript
const chart = new Chart({ container: 'container', width: 700, height: 400 });

chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y', color: 'type' },
  interaction: [{ type: 'brushFilter' }],
});

chart.render();

// Listen for brushing events
chart.on('brush:filter', (event) => {
  const filteredData = event.data.items;   // Remaining data after brushing
  console.log('Selected data:', filteredData);
  // Use this to update other charts...
});
```

## Common Errors and Fixes

### Error: Writing interaction as an object instead of an array
```javascript
// ❌ Error: interaction must be an array
chart.options({
  interaction: { type: 'brushHighlight' },
});

// ✅ Correct: array format
chart.options({
  interaction: [{ type: 'brushHighlight' }],
});
```

### Error: Enabling brushHighlight and brushFilter at the same time
```javascript
// ❌ Not recommended: these two features conflict, and using them together can produce unexpected behavior
chart.options({
  interaction: [
    { type: 'brushHighlight' },
    { type: 'brushFilter' },
  ],
});

// ✅ Correct: choose one based on your requirements
chart.options({
  interaction: [{ type: 'brushHighlight' }],  // Highlight while keeping all points
  // Or
  // interaction: [{ type: 'brushFilter' }],  // Filter to display only selected points
});
```
