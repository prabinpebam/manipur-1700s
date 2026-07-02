---
id: "g2-interaction-legend-filter"
title: "G2 Legend Filter Interaction (legendFilter)"
description: |
  legendFilter lets users show or hide corresponding data series by clicking legend items.
  In G2 v5 it is enabled by default, so clicking a legend item toggles the visibility of the corresponding series.
  You can disable it or customize its style through configuration. legendHighlight highlights the corresponding series on pointer hover.

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "legendFilter"
  - "legend filter"
  - "legend highlight"
  - "legendHighlight"
  - "interactive"
  - "interaction"

related:
  - "g2-comp-legend-config"
  - "g2-interaction-element-highlight"

use_cases:
  - "Show or hide specific series on demand in multi-series line charts"
  - "Temporarily hide a category in stacked charts"
  - "Selectively inspect charts with many series"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/legend-filter"
---

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const data = [
  { month: 'Jan', city: 'Beijing', temp: -3 },
  { month: 'Feb', city: 'Beijing', temp: 0 },
  { month: 'Jan', city: 'Shanghai', temp: 5 },
  { month: 'Feb', city: 'Shanghai', temp: 7 },
  { month: 'Jan', city: 'Guangzhou', temp: 15 },
  { month: 'Feb', city: 'Guangzhou', temp: 16 },
];

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'line',
  data,
  encode: { x: 'month', y: 'temp', color: 'city' },
  // legendFilter is enabled by default, so no explicit configuration is required
  // Click a city name in the legend to toggle its visibility
});

chart.render();
```

## Explicitly enable legendFilter

```javascript
// If it has been disabled, you can explicitly re-enable it
chart.options({
  type: 'line',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  interaction: {
    legendFilter: true,   // Click the legend to toggle show/hide
  },
});
```

## Enable legendHighlight at the same time (hover highlight)

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  interaction: {
    legendFilter: true,    // Click: filter data
    legendHighlight: true, // Hover: highlight the series
  },
});
```

## Disable legend interactions

```javascript
// Disable legend filtering (the legend is display-only and cannot be clicked)
chart.options({
  interaction: {
    legendFilter: false,  // Disable click filtering
  },
});
```

## Common errors and fixes

### Error: assuming legendFilter must be configured manually, even though G2 v5 enables it by default
```javascript
// ℹ️ G2 v5 enables legendFilter by default; no extra configuration is required
// Explicit configuration is needed only in the following cases:

// 1. When you want to disable it
chart.options({ interaction: { legendFilter: false } });

// 2. When you want to customize style or behavior
chart.options({ interaction: { legendFilter: { /* Custom options */ } } });
```

### Error: expecting legendFilter to work when legend: false, but hidden legends cannot be interacted with
```javascript
// ❌ The legend is hidden, but legend filtering is still expected. A hidden legend cannot be clicked
chart.options({
  legend: false,
  interaction: { legendFilter: true },  // ❌ No legend is available to trigger filtering
});

// ✅ legendFilter requires a visible legend
chart.options({
  legend: { color: { position: 'top' } },  // ✅ Keep the legend visible
  interaction: { legendFilter: true },
});
```
