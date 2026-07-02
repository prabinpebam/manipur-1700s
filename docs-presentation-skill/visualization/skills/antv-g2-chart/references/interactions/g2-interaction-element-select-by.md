---
id: "g2-interaction-element-select-by"
title: "G2 Group Selection (elementSelectByColor / elementSelectByX)"
description: |
  elementSelectByColor: when an element is clicked, selects all elements with the same color value (the color encode value).
  This is commonly used in multi-series line charts to select an entire line by clicking one point on it.
  elementSelectByX: when an element is clicked, selects all elements with the same X value.
  This is commonly used in grouped bar charts to select all bars under the same X category.

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "elementSelectByColor"
  - "elementSelectByX"
  - "group selection"
  - "batch selection"
  - "interaction"

related:
  - "g2-interaction-element-highlight-by"
  - "g2-interaction-element-select"
  - "g2-interaction-legend-filter"

use_cases:
  - "In a multi-series line chart, click one data point to select the entire line"
  - "In a grouped bar chart, click one bar to select all bars in the same X category"
  - "Batch-select scatter plot points by color group"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/element-select"
---

## elementSelectByColor (select by color group)

```javascript
import { Chart } from '@antv/g2';

const data = [
  { month: 'Jan', city: 'Beijing', value: 5 },
  { month: 'Feb', city: 'Beijing', value: 8 },
  { month: 'Jan', city: 'Shanghai', value: 12 },
  { month: 'Feb', city: 'Shanghai', value: 15 },
];

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'line',
  data,
  encode: { x: 'month', y: 'value', color: 'city' },
  interaction: {
    elementSelectByColor: true,  // Click any data point to select all points with the same color
  },
});

chart.render();
```

## elementSelectByX (select by X group)

```javascript
// Grouped bar chart: click a bar to select all grouped bars under that X value
chart.options({
  type: 'interval',
  data: groupedData,
  encode: { x: 'month', y: 'value', color: 'city' },
  transform: [{ type: 'dodgeX' }],
  interaction: {
    elementSelectByX: true,  // Click a bar to select all grouped bars in the same month
  },
});
```

## Combine multiple interactions

```javascript
// Combine highlight and selection: hover to highlight the same-color series, click to select it
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value', color: 'series' },
  interaction: {
    elementHighlightByColor: true,  // Hover: highlight the same-color series
    elementSelectByColor: true,     // Click: select the same-color series
  },
});
```

## Get selection events

```javascript
chart.on('element:select', (event) => {
  const { data } = event.detail;
  console.log('Selected data:', data.datum);
});

chart.on('element:unselect', (event) => {
  console.log('Selection cleared');
});
```

## Common errors and fixes

### Error: elementSelectByColor is invalid when there is no color encode
```javascript
// ❌ Without color encode, selection cannot be grouped by color
chart.options({
  type: 'line',
  encode: { x: 'month', y: 'value' },   // ❌ No color
  interaction: { elementSelectByColor: true },  // Invalid
});

// ✅ A color encode is required
chart.options({
  type: 'line',
  encode: { x: 'month', y: 'value', color: 'city' },  // ✅
  interaction: { elementSelectByColor: true },
});
```

### Error: confusing elementSelectByColor with elementSelect
```javascript
// elementSelect: selects only the single clicked element
chart.options({ interaction: { elementSelect: true } });

// elementSelectByColor: selects all elements with the same color value (batch selection)
chart.options({ interaction: { elementSelectByColor: true } });
```
