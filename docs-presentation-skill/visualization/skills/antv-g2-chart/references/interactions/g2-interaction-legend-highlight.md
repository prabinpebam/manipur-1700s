---
id: "g2-interaction-legend-highlight"
title: "G2 legendHighlight"
description: |
  The legendHighlight interaction highlights chart elements for the corresponding group when a user hovers over a legend item.
  Elements in other groups become semi-transparent (the inactive state).
  The difference from legendFilter is that legendHighlight only changes the visual state and does not filter data;
  legendFilter actually hides data items after the legend is clicked.

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "legendHighlight"
  - "legend highlight"
  - "interaction"
  - "highlight"
  - "interaction"

related:
  - "g2-interaction-legend-filter"
  - "g2-interaction-element-highlight-by"
  - "g2-comp-legend-config"

use_cases:
  - "Highlight a series when hovering over the legend in a multi-series line chart"
  - "Highlight the corresponding group when hovering over the legend in a grouped bar chart"
  - "Highlight points by color category in a scatter plot"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/legend-highlight"
---

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const data = [
  { month: 'Jan', city: 'Beijing', value: 5 },
  { month: 'Jan', city: 'Shanghai', value: 12 },
  { month: 'Feb', city: 'Beijing', value: 8 },
  { month: 'Feb', city: 'Shanghai', value: 15 },
  { month: 'Mar', city: 'Beijing', value: 12 },
  { month: 'Mar', city: 'Shanghai', value: 18 },
];

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'line',
  data,
  encode: { x: 'month', y: 'value', color: 'city' },
  interaction: {
    legendHighlight: true,  // Highlight the corresponding series when hovering over the legend
  },
});

chart.render();
```

## legendHighlight vs legendFilter comparison

```javascript
// legendHighlight: hover over a legend item -> highlight the corresponding elements; other elements become semi-transparent (data is not hidden)
chart.options({
  interaction: { legendHighlight: true },
});

// legendFilter: click a legend item -> toggle showing or hiding the corresponding data items (data is removed from the chart)
chart.options({
  interaction: { legendFilter: true },
});

// Enable both interactions: hover highlighting + click filtering
chart.options({
  interaction: {
    legendHighlight: true,
    legendFilter: true,
  },
});
```

## Custom highlight styles

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  state: {
    active: {
      // Style for the active (highlighted) state
      lineWidth: 2,
      stroke: '#000',
    },
    inactive: {
      // Style for the inactive (background) state
      fillOpacity: 0.2,
      strokeOpacity: 0.2,
    },
  },
  interaction: {
    legendHighlight: true,
  },
});
```

## Common mistakes and fixes

### Mistake: highlighting does not work when the legend has no color encode
```javascript
// ❌ Without color encode, the legend is not associated with elements, so highlighting has no effect
chart.options({
  type: 'interval',
  encode: { x: 'month', y: 'value' },   // ❌ Missing color encode
  interaction: { legendHighlight: true },
});

// ✅ Use color encode to associate legend items with elements
chart.options({
  type: 'interval',
  encode: { x: 'month', y: 'value', color: 'city' },  // ✅ Has color encode
  interaction: { legendHighlight: true },
});
```
