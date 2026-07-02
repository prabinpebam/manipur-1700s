---
id: "g2-interaction-element-select"
title: "G2 Element Selection Interaction (elementSelect)"
description: |
  The G2 v5 element selection interaction is enabled with interaction: [{ type: 'elementSelect' }].
  Clicking a graphical element toggles its selected state. The selected and active state styles can be customized,
  and it can be combined with elementSelectByX or elementSelectByColor for batch selection.
library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "selection"
  - "elementSelect"
  - "interaction"
  - "state"
  - "click"
  - "spec"

related:
  - "g2-interaction-element-highlight"
  - "g2-mark-interval-basic"
  - "g2-interaction-tooltip"

use_cases:
  - "Click a bar to highlight and select it while other bars turn gray"
  - "Click legend items to filter the chart"
  - "Coordinate with an external data panel to show selected details"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction"
---

## Basic usage (click to select bars in a bar chart)

Click a bar to toggle the selected state; click it again to clear the selection:

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
    { genre: 'Sports',   sold: 275 },
    { genre: 'Strategy', sold: 115 },
    { genre: 'Action',   sold: 120 },
    { genre: 'Shooter',  sold: 350 },
    { genre: 'Other',    sold: 150 },
  ],
  encode: { x: 'genre', y: 'sold', color: 'genre' },
  interaction: [
    { type: 'elementSelect' },   // Click an element to toggle its selected state
  ],
});

chart.render();
```

## elementSelectByX (batch select by x value)

This is suitable for grouped bar charts or stacked charts. When any element in a group is clicked, all elements at the same x position are selected:

```javascript
chart.options({
  type: 'interval',
  data: [
    { month: 'Jan', type: 'A', value: 120 },
    { month: 'Jan', type: 'B', value: 80 },
    { month: 'Feb', type: 'A', value: 160 },
    { month: 'Feb', type: 'B', value: 95 },
    { month: 'Mar', type: 'A', value: 140 },
    { month: 'Mar', type: 'B', value: 110 },
  ],
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'dodgeX' }],
  interaction: [
    { type: 'elementSelectByX' },   // Click any bar to select all bars at the same x position
  ],
});
```

## Customize the selected state style

Use `state.selected` to specify the visual style when an element is selected. Unselected elements are visually de-emphasized accordingly:

```javascript
chart.options({
  type: 'interval',
  data: [
    { genre: 'Sports',   sold: 275 },
    { genre: 'Strategy', sold: 115 },
    { genre: 'Action',   sold: 120 },
    { genre: 'Shooter',  sold: 350 },
    { genre: 'Other',    sold: 150 },
  ],
  encode: { x: 'genre', y: 'sold', color: 'genre' },
  state: {
    selected: {
      fill: '#1890ff',          // Fill color when selected
      fillOpacity: 1,           // Opacity when selected
      stroke: '#003a8c',        // Stroke color when selected
      lineWidth: 2,             // Stroke width when selected
    },
    unselected: {
      fillOpacity: 0.3,         // Make unselected elements semi-transparent
    },
  },
  interaction: [
    { type: 'elementSelect' },
  ],
});
```

## Combine highlight and select

Hover triggers highlighting, while clicking triggers selection. Both can be enabled at the same time:

```javascript
chart.options({
  type: 'interval',
  data: [
    { genre: 'Sports',   sold: 275 },
    { genre: 'Strategy', sold: 115 },
    { genre: 'Action',   sold: 120 },
    { genre: 'Shooter',  sold: 350 },
    { genre: 'Other',    sold: 150 },
  ],
  encode: { x: 'genre', y: 'sold', color: 'genre' },
  state: {
    active: {
      fill: '#69c0ff',        // Hover highlight color (active state)
      fillOpacity: 0.9,
    },
    selected: {
      fill: '#1890ff',        // Click selection color (selected state)
      fillOpacity: 1,
      stroke: '#003a8c',
      lineWidth: 2,
    },
    unselected: {
      fillOpacity: 0.3,
    },
  },
  interaction: [
    { type: 'elementHighlight' },   // Hover highlight (active state)
    { type: 'elementSelect' },      // Click selection (selected state)
    { type: 'tooltip' },
  ],
});
```

## Listen for selection events

```javascript
// Listen for selection and unselection events
chart.on('element:select', (event) => {
  const datum = event.data?.data;
  console.log('Selected element data:', datum);
  // Coordinate with an external panel, update state, and so on here
});

chart.on('element:unselect', (event) => {
  console.log('Selection cleared');
});
```

## Common errors and fixes

### Error: writing interaction as an object instead of an array

```javascript
// ❌ Error: interaction must be an array
chart.options({
  interaction: { type: 'elementSelect' },
});

// ✅ Correct
chart.options({
  interaction: [{ type: 'elementSelect' }],
});
```

### Error: using a nonexistent interaction name

```javascript
// ❌ Error: G2 does not have an interaction type named 'elementClick'
chart.options({
  interaction: [{ type: 'elementClick' }],
});

// ✅ Correct names
chart.options({
  interaction: [{ type: 'elementSelect' }],         // Single-element selection
  // or
  // interaction: [{ type: 'elementSelectByX' }],   // Batch selection by x value
  // interaction: [{ type: 'elementSelectByColor' }], // Batch selection by color
});
```

### Error: the selection style does not take effect because state is in the wrong location

```javascript
// ❌ Error: state cannot be nested inside style
chart.options({
  style: {
    state: { selected: { fill: '#1890ff' } },
  },
});

// ✅ Correct: state is at the top level of the mark configuration, alongside encode and style
chart.options({
  type: 'interval',
  data,
  encode: { x: 'genre', y: 'sold' },
  state: {
    selected: { fill: '#1890ff', fillOpacity: 1 },
  },
  interaction: [{ type: 'elementSelect' }],
});
```

### Error: using elementSelect and elementSelectByX together causes conflicts

```javascript
// ❌ When both are enabled, behavior is unpredictable because a click triggers two selection flows
chart.options({
  interaction: [
    { type: 'elementSelect' },
    { type: 'elementSelectByX' },
  ],
});

// ✅ Choose one based on your requirement
// - elementSelect: selects only the single clicked element
// - elementSelectByX: selects all elements with the same x value (suitable for grouped or stacked charts)
// - elementSelectByColor: selects all elements with the same color (series)
chart.options({
  interaction: [{ type: 'elementSelectByX' }],
});
```
