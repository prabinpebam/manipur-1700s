---
id: "g2-interaction-element-highlight-by"
title: "G2 Linked Highlighting by Color or X-axis (elementHighlightByColor / elementHighlightByX)"
description: |
  elementHighlightByColor: on mouse hover, highlights all elements that share the same color-channel value as the hovered element.
  elementHighlightByX: on mouse hover, highlights all elements that share the same x-axis value as the hovered element.
  Both are variants of elementHighlight. They differ in the grouping criterion used for highlighting,
  and are commonly used in multi-series charts to link highlights by the same category or the same time point.

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "elementHighlightByColor"
  - "elementHighlightByX"
  - "linked highlighting"
  - "grouped highlighting"
  - "interaction"

related:
  - "g2-interaction-element-highlight"
  - "g2-interaction-element-select"

use_cases:
  - "Hover over a bar in a multi-series chart to highlight all bars with the same color or category"
  - "Hover over a time point to highlight all series at the same time point"
  - "Highlight a heatmap by linked rows or columns"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/element-highlight"
---

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const data = [
  { month: 'Jan', city: 'Beijing', value: 83 },
  { month: 'Feb', city: 'Beijing', value: 60 },
  { month: 'Jan', city: 'Shanghai', value: 71 },
  { month: 'Feb', city: 'Shanghai', value: 55 },
  { month: 'Jan', city: 'Guangzhou', value: 95 },
  { month: 'Feb', city: 'Guangzhou', value: 88 },
];

const chart = new Chart({ container: 'container', width: 640, height: 400 });

// -- Linked highlighting by color (city) --
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'city' },
  transform: [{ type: 'dodgeX' }],
  interaction: {
    elementHighlightByColor: true,   // Hover over one bar to highlight all bars from the same city
  },
});

chart.render();
```

## elementHighlightByX (linked highlighting by the same X-axis value)

```javascript
// Hover over any bar for a month to highlight bars for all cities in the same month
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'city' },
  transform: [{ type: 'dodgeX' }],
  interaction: {
    elementHighlightByX: true,   // Highlight all elements with the same x value
  },
});
```

## Comparison of three highlighting modes

```javascript
// 1. elementHighlight (default): highlights only the single hovered element
interaction: { elementHighlight: true }

// 2. elementHighlightByColor: highlights all elements in the same color group (same category)
interaction: { elementHighlightByColor: true }

// 3. elementHighlightByX: highlights all elements with the same x value (same time point or category)
interaction: { elementHighlightByX: true }
```

## Custom highlight style

```javascript
chart.options({
  interaction: {
    elementHighlightByColor: {
      background: true,         // Show a background during highlighting; if false, only opacity changes
      link: false,              // Whether to show connecting lines, effective only for line charts and similar charts
      offset: 0,                // Offset during highlighting
    },
  },
});
```

## Common errors and fixes

### Error: Using elementHighlightByColor on a chart without a color channel highlights every element
```javascript
// ❌ Without a color channel, all elements are treated as the same color group and all are highlighted on hover
chart.options({
  type: 'interval',
  encode: { x: 'month', y: 'value' },  // ❌ No color channel
  interaction: { elementHighlightByColor: true },
});

// ✅ A color channel is required to group highlights by color
chart.options({
  encode: { x: 'month', y: 'value', color: 'city' },  // ✅ Has color grouping
  interaction: { elementHighlightByColor: true },
});
```
