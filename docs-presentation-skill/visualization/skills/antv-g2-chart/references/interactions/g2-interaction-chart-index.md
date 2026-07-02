---
id: "g2-interaction-chart-index"
title: "G2 ChartIndex Linked Cursor Line"
description: |
  chartIndex renders a vertical cursor line (reference line) on the chart that follows mouse movement,
  and can link cursors across multiple charts for horizontal comparison of data at the same time point.
  It is suitable for linked time-series charts and synchronized multi-metric inspection in dashboards.

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "chartIndex"
  - "cursor line"
  - "linked interaction"
  - "reference line"
  - "multi-chart linking"
  - "interaction"
  - "crosshair"

related:
  - "g2-interaction-tooltip"
  - "g2-mark-linex-liney"
  - "g2-recipe-dashboard"

use_cases:
  - "Link multiple line charts to inspect metric values at the same time point"
  - "Crosshair cursor in a time-series dashboard"
  - "Compare corresponding values across two time series"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/chart-index"
---

## Core concept

`chartIndex` renders a vertical reference line in the plotting area that follows the mouse position along the X-axis.
Used with `shared: true` Tooltip, it enables linked highlighting of data from multiple series at the same time point.

## Single-chart cursor line

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 800, height: 400 });

chart.options({
  type: 'line',
  data: timeSeriesData,
  encode: { x: 'date', y: 'value', color: 'type' },
  interaction: {
    chartIndex: true,          // Enable the cursor line
    tooltip: { shared: true }, // Use with shared Tooltip
  },
});

chart.render();
```

## Options

```javascript
chart.options({
  interaction: {
    chartIndex: {
      // Cursor line style
      ruleStroke: '#aaa',          // Cursor line color; default is '#aaa'
      ruleLineWidth: 1,            // Cursor line width; default is 1
      ruleLineDash: [4, 4],        // Dashed style for the cursor line
      // Label options
      labelDy: -8,                 // Vertical label offset
      labelBackground: true,       // Whether to show the label background
      labelBackgroundFill: '#fff', // Label background color
      // Performance control
      wait: 50,                    // Debounce delay in milliseconds; default is 50
      leading: true,               // Trigger on the leading edge of the debounce
      trailing: false,             // Trigger on the trailing edge of the debounce
    },
  },
});
```

## Multi-chart linking (same container parent element)

```javascript
// Implement linked cursors across charts by sharing emit events
// The two charts use the same emitter, which must be implemented manually or by using G2's on/emit API
const chart1 = new Chart({ container: 'container1', width: 800, height: 200 });
const chart2 = new Chart({ container: 'container2', width: 800, height: 200 });

[chart1, chart2].forEach((chart) => {
  chart.options({
    type: 'line',
    data: timeSeriesData,
    encode: { x: 'date', y: 'value' },
    interaction: {
      chartIndex: true,
    },
  });
  chart.render();
});
```

## Common errors and fixes

### Error: The cursor line appears, but Tooltip does not show data for the same time point
```javascript
// ❌ In a multi-series chart, Tooltip only shows the element nearest to the current mouse position
chart.options({
  interaction: {
    chartIndex: true,
    // Missing the tooltip shared option
  },
});

// ✅ Enable shared Tooltip so data from all series at the same time point is shown together
chart.options({
  interaction: {
    chartIndex: true,
    tooltip: { shared: true },   // Required together with chartIndex
  },
});
```
