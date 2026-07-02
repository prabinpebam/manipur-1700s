---
id: "g2-comp-tooltip-config"
title: "G2 Tooltip Configuration and Customization"
description: |
  In G2 v5, tooltip is enabled through the top-level tooltip configuration or interaction: [{ type: 'tooltip' }].
  It supports custom content (filtering with the items field and fully custom HTML with the render function).
  groupKey controls merge rules, and crosshairs displays crosshair guide lines.

library: "g2"
version: "5.x"
category: "components"
tags:
  - "tooltip"
  - "customization"
  - "interaction"
  - "spec"

related:
  - "g2-interaction-tooltip"
  - "g2-mark-line-basic"
  - "g2-mark-interval-basic"

use_cases:
  - "Customize tooltip display fields and formats"
  - "Share tooltips across multiple series (grouped tooltip)"
  - "Fully customize the tooltip HTML template"
  - "Show crosshair guide lines for easier positioning"

difficulty: "intermediate"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/component/tooltip"
---

## Minimal runnable example (enable the default tooltip)

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 600,
  height: 400,
});

const data = [
  { month: 'Jan', value: 120, type: 'Sales' },
  { month: 'Feb', value: 180, type: 'Sales' },
  { month: 'Mar', value: 150, type: 'Sales' },
];

chart.options({
  type: 'line',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  // tooltip is enabled by default; this configuration customizes it
  tooltip: {
    title: (d) => `${d.month} Data`,   // Custom title
    items: [
      { channel: 'y', name: 'Sales', valueFormatter: (v) => `¥${v}` },
    ],
  },
});

chart.render();
```

## Multi-field tooltip (show multiple information items)

```javascript
const data = [
  { date: '2024-01', revenue: 1200, cost: 800, profit: 400 },
  { date: '2024-02', revenue: 1800, cost: 950, profit: 850 },
  { date: '2024-03', revenue: 1500, cost: 1000, profit: 500 },
];

chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'revenue' },
  tooltip: {
    title: 'date',
    // Each item in items corresponds to one displayed row
    items: [
      { field: 'revenue', name: 'Revenue', valueFormatter: (v) => `¥${v}` },
      { field: 'cost', name: 'Cost', valueFormatter: (v) => `¥${v}` },
      { field: 'profit', name: 'Profit', valueFormatter: (v) => `¥${v}` },
    ],
  },
});
```

## Fully custom HTML (render function)

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  tooltip: {
    render: (event, { title, items }) => {
      // Return an HTML string to fully customize tooltip content
      return `
        <div style="padding: 8px 12px; background: #fff; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
          <div style="font-weight: bold; margin-bottom: 6px;">${title}</div>
          ${items.map(({ name, value, color }) => `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="width: 8px; height: 8px; background: ${color}; border-radius: 50%; display: inline-block;"></span>
              <span>${name}:</span>
              <span style="font-weight: 500;">${value}</span>
            </div>
          `).join('')}
        </div>
      `;
    },
  },
});
```

## Shared tooltip across multiple series (groupKey)

```javascript
// In a multi-line chart, show values for all series at the same time on hover
chart.options({
  type: 'view',
  data,
  children: [
    {
      type: 'line',
      encode: { x: 'month', y: 'value', color: 'type' },
      tooltip: {
        // groupKey: which field to use for merging tooltips across multiple series
        // By default, points from all series with the same x value are merged into one tooltip
        title: 'month',
      },
    },
  ],
  interaction: [{ type: 'tooltip', shared: true }],   // shared: true shows a shared tooltip
});
```

## Complete configuration options

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'month', y: 'value' },

  tooltip: {
    // Title
    title: 'month',               // Field name or function (d) => string

    // Display items
    items: [
      {
        field: 'value',           // Data field name
        channel: 'y',             // Or use a channel name ('x' | 'y' | 'color', etc.)
        name: 'Sales',            // Display name (overrides the default)
        color: '#1890ff',         // Color of the color swatch
        // valueFormatter accepts:
        //   function (value) => string   <- use this form when you need to append units
        //   d3-format string '.2f'       <- formats only the number itself and does not support appending text
        valueFormatter: (v) => `${v} ten thousand CNY`,   // Function form; can append units
        // valueFormatter: '.2f',                       // d3-format; formats numbers only
        // valueFormatter: '.0f m',                     // Incorrect! Text cannot be appended after d3-format
      },
    ],

    // Rendering
    render: (event, { title, items }) => `<div>...</div>`,  // Fully custom HTML

    // Trigger mode
    // Configure it in interaction
  },

  // tooltip interaction (additional configuration can be added)
  interaction: [
    {
      type: 'tooltip',
      shared: true,       // Shared tooltip across multiple marks
      crosshairs: true,   // Show crosshair guide lines
    },
  ],
});
```

## Crosshair guide lines (crosshairs)

Crosshair guide lines are configured through the `tooltip` interaction item in `interaction`:

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'month', y: 'value' },
  interaction: [
    {
      type: 'tooltip',
      crosshairs: true,           // Show crosshair guide lines (enabled by default)
      crosshairsStroke: '#aaa',   // Guide-line color
      crosshairsLineWidth: 1,     // Guide-line width
      crosshairsLineDash: [4, 4], // Dashed-line style
    },
  ],
});
```

## Customize tooltip styles with CSS

When the `render` function is not customizable enough, you can directly override the default styles with CSS:

```javascript
// Method 1: Override in global page CSS
// .g2-tooltip { background: #1a1a1a; color: #fff; border-radius: 8px; }
// .g2-tooltip-title { font-size: 14px; font-weight: bold; }
// .g2-tooltip-list-item-value { color: #fadb14; }

// Method 2: Use the css parameter of interaction for local overrides
chart.options({
  interaction: [
    {
      type: 'tooltip',
      css: {
        '.g2-tooltip': {
          background: '#1a1a1a',
          color: '#fff',
          borderRadius: '8px',
          padding: '8px 12px',
        },
        '.g2-tooltip-title': {
          fontSize: '14px',
          fontWeight: 'bold',
          marginBottom: '6px',
        },
        '.g2-tooltip-list-item-value': {
          color: '#fadb14',
        },
      },
    },
  ],
});
```

**Built-in CSS class names:**
- `.g2-tooltip` - tooltip container
- `.g2-tooltip-title` - title
- `.g2-tooltip-list-item` - single data item
- `.g2-tooltip-list-item-name-label` - data item name
- `.g2-tooltip-list-item-value` - data item value
- `.g2-tooltip-list-item-marker` - data item color marker

---

## Common mistakes and fixes

### Mistake 1: tooltip.items field name does not match the data

```javascript
// Incorrect: the data field is 'revenue', but items uses 'value'
const data = [{ month: 'Jan', revenue: 1200 }];
chart.options({
  tooltip: {
    items: [{ field: 'value' }],   // The data has no 'value' field
  },
});

// Correct: field matches a data field name
chart.options({
  tooltip: {
    items: [{ field: 'revenue', name: 'Revenue' }],
  },
});
```

### Mistake 2: The render function forgets to return a string

```javascript
// Incorrect: the render function has no return statement
chart.options({
  tooltip: {
    render: (event, { title, items }) => {
      const html = `<div>${title}</div>`;
      // Forgot to return it!
    },
  },
});

// Correct: an HTML string must be returned
chart.options({
  tooltip: {
    render: (event, { title, items }) => {
      return `<div>${title}</div>`;
    },
  },
});
```

### Mistake 3: Concatenating units in a d3-format string for valueFormatter

`valueFormatter` supports two forms: a function `(v) => string` or a d3-format string (such as `'.2f'`). **A d3-format string formats only the number itself; you cannot append text units after it**. A spaced form such as `'.0f m'` is treated as an invalid format specifier, which can cause incorrect display or an error.

```javascript
// Incorrect: appending text units after a d3-format string
chart.options({
  tooltip: {
    items: [
      { field: 'distance', name: 'Distance', valueFormatter: '.0f m' },     // Invalid format; d3-format does not support appended text
      { field: 'price',    name: 'Price', valueFormatter: '.2f CNY' },      // Same issue
    ],
  },
});

// Correct: use a function form when units need to be appended
chart.options({
  tooltip: {
    items: [
      { field: 'distance', name: 'Distance', valueFormatter: (v) => `${Math.round(v)} m` },  // Function form
      { field: 'price',    name: 'Price', valueFormatter: (v) => `¥${v.toFixed(2)}` },       // Function form
    ],
  },
});

// When only formatting numbers (no units needed), a d3-format string can be used
chart.options({
  tooltip: {
    items: [
      { field: 'ratio', name: 'Ratio', valueFormatter: '.1%' },    // Pure d3-format, no text
      { field: 'value', name: 'Value', valueFormatter: ',.0f' },   // Thousands-separated integer
    ],
  },
});
```

### Mistake 4: shared is not configured for a multi-series tooltip

```javascript
// Problem: in a multi-line chart, the tooltip shows only the currently hovered line
chart.options({
  type: 'view',
  children: [
    { type: 'line', encode: { x: 'month', y: 'value', color: 'type' } },
  ],
  // Without shared: true, the tooltip only shows the line directly under the pointer
});

// Correct: set shared: true to show all series
chart.options({
  type: 'view',
  children: [
    { type: 'line', encode: { x: 'month', y: 'value', color: 'type' } },
  ],
  interaction: [{ type: 'tooltip', shared: true }],
});
```

---

> **Dark background adaptation**: When tooltip styles need to adapt to a dark background, use `theme: 'classicDark'` for automatic switching, or manually control styles through `interaction.tooltip.css`. See [dark theme adaptation](../concepts/g2-concept-dark-theme-adaptation.md)
