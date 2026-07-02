---
id: "g2-interaction-element-highlight"
title: "G2 Element Highlight Interaction (elementHighlight)"
description: |
  elementHighlight is one of the most commonly used interactions in G2 v5. It highlights the current element on hover
  and can also highlight elements in the same series or coordinate with other views. It supports all mark types, including interval, line, and point marks.

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "elementHighlight"
  - "highlight"
  - "interaction"
  - "hover"
  - "interactive"
  - "spec"

related:
  - "g2-interaction-brush"
  - "g2-mark-interval-basic"
  - "g2-mark-line-basic"

use_cases:
  - "Highlight the current bar on hover in a bar chart"
  - "Highlight the current series on hover in a line chart"
  - "Highlight similar data points on hover in a scatter plot"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/element-highlight"
---

## Basic usage (bar chart highlight)

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
  encode: { x: 'genre', y: 'sold' },
  interaction: { elementHighlight: true },   // Highlight the current bar on hover
});

chart.render();
```

## Highlight background color configuration

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'genre', y: 'sold', color: 'genre' },
  interaction: {
    elementHighlight: {
      background: true,              // Whether to show the highlight background
      backgroundFill: '#f0f0f0',    // Background fill color
    },
  },
});
```

## Line chart: highlight the current series

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'month', y: 'value', color: 'series' },
  interaction: {
    elementHighlight: true,        // Highlight the current line on hover
  },
});
```

## elementHighlightByColor: highlight series with the same color

```javascript
// Highlight all elements with the same color (series) on hover
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'dodgeX' }],
  interaction: {
    elementHighlightByColor: true,   // Highlight all bars in the same series
  },
});
```

## elementHighlightByX: highlight elements at the same x position

```javascript
// Highlight all elements with the same x value on hover (useful for grouped bar charts)
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  interaction: {
    elementHighlightByX: true,    // Highlight all elements in the same group (same x position)
  },
});
```

## Enable tooltip and highlight together

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'revenue', color: 'product' },
  transform: [{ type: 'dodgeX' }],
  interaction: {
    elementHighlight: true,    // Element highlight
    tooltip: true,             // Tooltip prompt
  },
  tooltip: {
    title: 'month',
    items: [
      { field: 'revenue', valueFormatter: (v) => `$${v}0K` },
    ],
  },
});
```

## Listen for highlight events

```javascript
chart.on('element:highlight', (event) => {
  const datum = event.data?.data;
  console.log('Highlighted element data:', datum);
});

chart.on('element:unhighlight', () => {
  console.log('Highlight cleared');
});
```

## Common errors and fixes

### Error: writing interaction as an object
```javascript
// ❌ Error: interaction must be an array (legacy syntax)
chart.options({
  interaction: { type: 'elementHighlight' },
});

// ✅ Correct: the new version supports the object form
chart.options({
  interaction: { elementHighlight: true },
});
```

### Error: confusing elementHighlight with elementHighlightByColor
```javascript
// ❌ Using both at the same time causes duplicate responses
chart.options({
  interaction: {
    elementHighlight: true,
    elementHighlightByColor: true,
  },
});

// ✅ Choose one based on your requirement
// - elementHighlight: highlights only the single element under the pointer
// - elementHighlightByColor: highlights all elements with the same color (series)
// - elementHighlightByX: highlights all elements at the same x position
```

### Error: nesting a view inside children of another view causes a blank screen
```javascript
// ❌ Error: nesting a view inside children causes rendering to fail
chart.options({
  type: 'view',
  children: [
    {
      type: 'view', // Nested views are not allowed
      children: [...]
    }
  ]
});

// ✅ Correct: use a top-level container or a single view structure
chart.options({
  type: 'view',
  children: [
    { type: 'interval', ... },
    { type: 'image', ... }
  ]
});
```

### Error: the image mark is not configured correctly, so it cannot be displayed
```javascript
// ❌ Error: required encode and style configuration is missing
{
  type: 'image',
  data: [{ url: '...' }],
  encode: { x: () => 0, y: () => 0 } // Not suitable for centered display
}

// ✅ Correct: use style to set a fixed position and size
{
  type: 'image',
  style: {
    x: '50%', // Centered
    y: '50%',
    width: 80,
    height: 80
  },
  encode: {
    src: 'url'
  }
}
```

</skill>
