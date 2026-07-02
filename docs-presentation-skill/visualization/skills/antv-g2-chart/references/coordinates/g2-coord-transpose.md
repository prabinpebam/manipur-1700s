---
id: "g2-coord-transpose"
title: "G2 Transposed Coordinate System"
description: |
  Use coordinate: { transform: [{ type: 'transpose' }] } to swap the x and y axes of the Cartesian coordinate system.
  The most common use is converting a vertical column chart into a horizontal bar chart.
  This is especially useful when category names are long or there are many categories.

library: "g2"
version: "5.x"
category: "coordinates"
tags:
  - "transpose"
  - "bar chart"
  - "horizontal"
  - "coordinate"
  - "spec"

related:
  - "g2-mark-interval-basic"
  - "g2-mark-interval-grouped"
  - "g2-mark-interval-stacked"

use_cases:
  - "Horizontal bar charts with clearer labels when category names are long"
  - "Horizontal layouts for charts with many categories, such as more than eight"
  - "Ranking charts sorted from largest to smallest"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/coordinate/transpose"
---

## Minimal Runnable Example (Column Chart to Bar Chart)

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'interval',
  data: [
    { city: 'Beijing',   gdp: 3.6 },
    { city: 'Shanghai',   gdp: 4.3 },
    { city: 'Guangzhou',   gdp: 2.8 },
    { city: 'Shenzhen',   gdp: 3.2 },
    { city: 'Hangzhou',   gdp: 1.8 },
  ],
  encode: {
    x: 'city',   // After transpose, city appears on the y axis in the vertical direction.
    y: 'gdp',    // After transpose, gdp appears on the x axis in the horizontal direction.
  },
  coordinate: { transform: [{ type: 'transpose' }] },   // Key configuration: transpose.
});

chart.render();
```

## Ranking Bar Chart (Sorting + Transpose)

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'city', y: 'gdp', color: 'city' },
  transform: [
    { type: 'sortX', by: 'y', reverse: true },   // Sort by value in descending order first.
  ],
  coordinate: { transform: [{ type: 'transpose' }] },
  axis: {
    x: { title: 'GDP (trillion CNY)' },
    y: { title: null },
  },
  labels: [
    {
      text: (d) => d.gdp.toFixed(1),
      position: 'outside',
      style: { fontSize: 12 },
    },
  ],
});
```

## Horizontal Stacked Bar Chart

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { transform: [{ type: 'transpose' }] },
});
```

## Horizontal Interval Chart (Gantt-Style)

```javascript
chart.options({
  type: 'interval',
  autoFit: true,
  data: [
    { stage: 'Phase 1', task: 'Prototype', start: 1, end: 3 },
    { stage: 'Phase 1', task: 'Validation', start: 3, end: 5 },
    { stage: 'Phase 2', task: 'Development', start: 4, end: 10 },
    { stage: 'Phase 2', task: 'Unit Testing', start: 8, end: 11 },
    { stage: 'Phase 3', task: 'Integration', start: 10, end: 13 },
    { stage: 'Phase 3', task: 'Load Testing', start: 12, end: 15 }
  ],
  encode: {
    x: (d) => `${d.stage} - ${d.task}`,  // Composite label field.
    y: 'start',                          // Start time maps to the y channel.
    y1: 'end',                           // End time maps to the y1 channel.
    color: 'stage'                       // Stage maps to color.
  },
  coordinate: { transform: [{ type: 'transpose' }] },  // Transposed coordinate system.
  axis: {
    x: {
      title: 'Stage and Task',
      labelTransform: 'rotate(30)'       // Rotate labels to prevent overlap.
    },
    y: { title: 'Time (weeks)' }         // Time-axis title.
  }
});

chart.render();
```

## Common Errors and Fixes

### Error: Axis Title Configuration Is Not Adjusted After transpose
```javascript
// Note: after transpose, the original x configuration applies to the vertical axis,
// and the original y configuration applies to the horizontal axis.
// If the horizontal axis should show value units, configure axis.x, not axis.y.
chart.options({
  coordinate: { transform: [{ type: 'transpose' }] },
  axis: {
    y: { title: 'GDP (trillion)' },   // Incorrect: after transpose, y is the category axis, not the value axis.
  },
});

// Correct: after transpose, the horizontal axis corresponds to axis.x.
chart.options({
  coordinate: { transform: [{ type: 'transpose' }] },
  axis: {
    x: { title: 'GDP (trillion)' },   // Value axis.
    y: { title: null },               // Category axis; category names are already shown on the left.
  },
});
```

### Error: Handling Labels Incorrectly in a Horizontal Interval Chart
```javascript
// Error example: using labelFormatter for composite labels can be fragile.
chart.options({
  encode: {
    x: 'task',
    y: 'start',
    y1: 'end'
  },
  axis: {
    x: {
      labelFormatter: (task, item) => {
        const datum = item.data;
        return `${datum.stage}\n${task}`;
      }
    }
  }
});

// Correct: build the composite field during data preprocessing or with an encode function.
chart.options({
  encode: {
    x: (d) => `${d.stage} - ${d.task}`,  // Build composite labels with a function.
    y: 'start',
    y1: 'end'
  },
  axis: {
    x: {
      title: 'Stage and Task',
      labelTransform: 'rotate(30)'        // Rotate labels as needed to avoid overlap.
    }
  }
});
```
