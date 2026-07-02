---
id: "g2-interaction-element-point-move"
title: "G2 ElementPointMove Data Point Drag Editing"
description: |
  elementPointMove is a G2 v5 interaction that lets users change values by dragging data points in a chart with the mouse.
  It supports line charts, bar charts, pie charts, area charts, and more. After dragging, it triggers the 'element-point:moved' event and returns the updated data.
  It is useful for visual data editing, interactive budget adjustment, manual forecast correction, and similar scenarios.

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "elementPointMove"
  - "data editing"
  - "drag"
  - "interactive"
  - "data modification"
  - "interaction"

related:
  - "g2-mark-line-basic"
  - "g2-mark-interval-basic"
  - "g2-interaction-element-select"

use_cases:
  - "Visual budget allocation editing by dragging bars to adjust values"
  - "Manually adjust forecast trends in a line chart"
  - "Interactively adjust category proportions in a pie chart"

difficulty: "advanced"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/element-point-move"
---

## Core concepts

`elementPointMove` renders draggable control points on chart elements. When the user presses and drags with the mouse, it updates the data in real time and redraws the chart.
After dragging ends, it triggers the `element-point:moved` event, whose callback arguments include the modified data.

Supported mark types:
- `line` (line chart): every data point can be dragged
- `area` (area chart): every vertex can be dragged
- `interval` (bar chart / column chart / pie chart): bar vertices can be dragged

## Drag data points in a line chart

```javascript
import { Chart } from '@antv/g2';

const data = [
  { month: 'Jan', value: 83 },
  { month: 'Feb', value: 60 },
  { month: 'Mar', value: 95 },
  { month: 'Apr', value: 72 },
  { month: 'May', value: 110 },
];

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'line',
  data,
  encode: { x: 'month', y: 'value' },
  interaction: {
    elementPointMove: true,   // Enable data point dragging
  },
});

// Listen for data change events
chart.on('element-point:moved', (event) => {
  const { changeData, data } = event.data;
  console.log('Updated single record:', changeData);
  console.log('Complete updated data:', data);
});

chart.render();
```

## Drag data points in a bar chart

```javascript
chart.options({
  type: 'interval',
  data: budgetData,
  encode: { x: 'department', y: 'budget', color: 'department' },
  interaction: {
    elementPointMove: {
      precision: 0,   // Drag tooltip precision (number of decimal places); default is 2
    },
  },
});
```

## Configuration options

```javascript
chart.options({
  interaction: {
    elementPointMove: {
      precision: 2,             // Number of decimal places for the real-time tooltip label; default is 2
      selection: [],            // Initially selected data point index [elementIndex, pointIndex]
      // Control point style
      pointR: 6,                // Control point radius; default is 6
      pointStroke: '#888',      // Control point stroke color
      pointActiveStroke: '#f5f5f5',  // Stroke color when active
      // Guide line style
      pathStroke: '#888',
      pathLineDash: [3, 4],
      // Tooltip label style
      labelFontSize: 12,
      labelFill: '#888',
    },
  },
});
```

## Listen for events

```javascript
// Drag-end event (data has been updated)
chart.on('element-point:moved', ({  { changeData, data } }) => {
  // changeData: the modified single record { month: 'Feb', value: 75 }
  // data: the complete modified data array
  syncToServer(changeData);
});

// Control point selection event
chart.on('element-point:select', ({  { selection } }) => {
  // selection: [elementIndex, pointIndex]
  console.log('Selected point index:', selection);
});
```

## Common errors and fixes

### Error: using this interaction on a scatter plot (not supported)
```javascript
// ❌ The point mark does not support elementPointMove
chart.options({
  type: 'point',
  interaction: { elementPointMove: true },  // Invalid
});

// ✅ Supported types: line, area, interval
chart.options({
  type: 'line',
  interaction: { elementPointMove: true },  // ✅
});
```
