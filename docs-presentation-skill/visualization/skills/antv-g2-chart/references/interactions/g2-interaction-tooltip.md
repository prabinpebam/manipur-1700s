---
id: "g2-interaction-tooltip"
title: "G2 Tooltip interaction configuration"
description: |
  Configure the Tooltip for G2 charts, including content customization, formatting, and custom rendering.
  In Spec mode, the Mark-level tooltip field controls the content,
  while the chart-level interaction field controls Tooltip behavior.

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "Tooltip"
  - "tooltip"
  - "tooltip"
  - "interaction"
  - "hover"
  - "hover"
  - "spec"

related:
  - "g2-core-chart-init"
  - "g2-interaction-crosshair"

use_cases:
  - "Add data hover tips to a chart"
  - "Customize the fields and format displayed in Tooltip"
  - "Disable Tooltip when it is not needed"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/component/tooltip"
---

## Core concepts

In G2 Spec mode, Tooltip has two configuration locations:
- **Mark-level `tooltip` field**: controls the Tooltip content displayed for that Mark
- **Chart-level `interaction` field**: controls Tooltip trigger behavior and custom rendering

G2 enables Tooltip by default and shows the current element's data on mouse hover.

## Basic usage (Spec mode)

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data,
  encode: { x: 'genre', y: 'sold' },
  tooltip: {
    title: 'genre',     // Tooltip title field
    items: [
      { field: 'sold', name: 'Sales', valueFormatter: (v) => `${v} ten thousand` },
    ],
  },
});

chart.render();
```

## Detailed configuration of the tooltip field

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'x', y: 'y' },
  tooltip: {
    // Title: field name string | fixed string | function
    title: 'name',

    // items: defines the data rows displayed in Tooltip
    items: [
      // Form 1: field name string (shortcut form)
      'value',

      // Form 2: object configuration
      {
        field: 'value',                              // Data field
        name: 'Value',                               // Display name
        valueFormatter: (v) => `${v.toFixed(2)}%`,  // Value formatting
        color: '#1890ff',                            // Color marker
      },

      // Form 3: function (fully custom)
      (data) => ({
        name: 'Computed value',
        value: data.a + data.b,
      }),
    ],
  },
});
```

## Disable Tooltip

```javascript
// Disable Tooltip for the entire chart
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'x', y: 'y' },
  interaction: { tooltip: false },   // Disable at the chart level
});

// Or disable Tooltip content for a specific Mark (pass false)
chart.options({
  type: 'interval',
  tooltip: false,   // This Mark does not provide Tooltip content
});
```

## Custom Tooltip rendering (HTML)

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'genre', y: 'sold' },
  interaction: {
    tooltip: {
      render: (event, { title, items }) => `
        <div style="padding: 8px 12px; background: white; border: 1px solid #ddd; border-radius: 4px;">
          <strong>${title}</strong>
          ${items.map(item => `
            <div style="display: flex; justify-content: space-between; gap: 16px; margin-top: 4px;">
              <span style="color: ${item.color}">${item.name}</span>
              <span>${item.value}</span>
            </div>
          `).join('')}
        </div>
      `,
    },
  },
});
```

## Configure Tooltip in a view container

```javascript
// When multiple Marks are overlaid, configure Tooltip once on the outer view
chart.options({
  type: 'view',
  data: [...],
  interaction: { tooltip: { shared: true } },  // Shared Tooltip (merged display for multiple Marks)
  children: [
    {
      type: 'line',
      encode: { x: 'month', y: 'value', color: 'type' },
      tooltip: { items: [{ field: 'value', name: 'Value' }] },
    },
    {
      type: 'point',
      encode: { x: 'month', y: 'value', color: 'type' },
      tooltip: false,    // Point Mark does not trigger Tooltip separately
    },
  ],
});
```

## Common mistakes and fixes

### Mistake 1: writing tooltip inside style
```javascript
// ❌ Incorrect
chart.options({ type: 'interval',  [...], style: { tooltip: { title: 'name' } } });

// ✅ Correct: tooltip is at the same level as encode/style
chart.options({ type: 'interval',  [...], tooltip: { title: 'name' } });
```

### Mistake 2: confusing the responsibilities of interaction.tooltip and mark.tooltip
```javascript
// ❌ Incorrect: writing content configuration inside interaction
chart.options({
  interaction: { tooltip: { items: [{ field: 'value' }] } },  // Invalid!
});

// ✅ Correct: content configuration is in the Mark's tooltip field; behavior configuration is in interaction.tooltip
chart.options({
  type: 'interval',
  tooltip: { items: [{ field: 'value', name: 'Value' }] },  // Content
  interaction: { tooltip: { shared: true } },              // Behavior
});
```
