---
id: "g2-interaction-brush-filter"
title: "G2 Brushing Filter Interaction (brushFilter)"
description: |
  brushFilter allows users to drag on a chart to draw a rectangular region for filtering data.
  Unlike brushHighlight, brushFilter directly filters out data points outside the selected region
  and keeps only the data inside the selection. It supports single-axis filtering in the x/y direction
  as well as two-dimensional rectangular filtering.

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "brush"
  - "brushFilter"
  - "brushing"
  - "filtering"
  - "interaction"
  - "interaction"

related:
  - "g2-interaction-brush"
  - "g2-interaction-element-select"

use_cases:
  - "Select data points of interest in a scatter plot for deeper analysis"
  - "Select a specific time range in a time series and zoom in for inspection"
  - "Explore multidimensional data by selecting a data subset with a rectangle"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/brush-filter"
---

## Minimal Runnable Example (Scatter Plot Brushing Filter)

```javascript
import { Chart } from '@antv/g2';

const data = Array.from({ length: 300 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  group: Math.floor(Math.random() * 4),
}));

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y', color: 'group', shape: 'point' },
  scale: { color: { type: 'ordinal' } },
  interaction: {
    brushFilter: true,   // Enable brushing filter: drag a rectangular region to filter data
  },
});

chart.render();
```

## Brushing in the X-Axis Direction Only (Time Range Filtering)

```javascript
chart.options({
  type: 'line',
  data: timeData,
  encode: { x: 'date', y: 'value', color: 'type' },
  interaction: {
    brushXFilter: true,   // Brushing filter in the X-axis direction only (commonly used for time filtering)
  },
});
```

## Custom Brushing Style

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y' },
  interaction: {
    brushFilter: {
      maskFill: '#1890ff',
      maskFillOpacity: 0.15,
      maskStroke: '#1890ff',
      maskLineWidth: 1.5,
    },
  },
});
```

## Brushing Highlight vs. Brushing Filter

```javascript
// brushHighlight: elements outside the selection are dimmed (all data remains visible)
chart.options({ interaction: { brushHighlight: true } });

// brushFilter: elements outside the selection are filtered out (only selected data remains)
chart.options({ interaction: { brushFilter: true } });
```

## Common Errors and Fixes

### Error: Enabling brushFilter and brushHighlight at the same time causes behavior conflicts
```javascript
// ❌ Enabling both at the same time causes conflicts
chart.options({
  interaction: {
    brushFilter: true,
    brushHighlight: true,  // ❌ Conflicts with brushFilter
  },
});

// ✅ Enable only one of them
chart.options({
  interaction: {
    brushFilter: true,  // ✅ Filtering mode
  },
});
```
