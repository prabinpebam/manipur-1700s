---
id: "g2-interaction-brush-xy"
title: "G2 Single-Axis Brushing (brushXHighlight / brushYHighlight / brushXFilter / brushYFilter)"
description: |
  Single-axis brushing interactions restrict brushing to a single direction:
  - brushXHighlight/brushYHighlight: brushing highlight without filtering data
  - brushXFilter/brushYFilter: brush and filter data (hide elements outside the brushed range)
  X-direction brushing is suitable for interval selection in time series, while Y-direction brushing is suitable for numeric range filtering.

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "brushXHighlight"
  - "brushYHighlight"
  - "brushXFilter"
  - "brushYFilter"
  - "single-axis brushing"
  - "brushing"
  - "interaction"

related:
  - "g2-interaction-brush-filter"
  - "g2-interaction-brush-axis"
  - "g2-comp-slider"

use_cases:
  - "Time-series charts: brush a time interval in the X direction for highlighting"
  - "Scatter plots: brush a numeric range in the Y direction for filtering"
  - "Annotate and compare intervals in line charts"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/brush-highlight"
---

## brushXHighlight (X-Direction Brushing Highlight)

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 800, height: 400 });

chart.options({
  type: 'line',
  data: timeSeriesData,
  encode: { x: 'date', y: 'value', color: 'series' },
  interaction: {
    brushXHighlight: true,  // Horizontal brushing that highlights lines in the selected interval
  },
});

chart.render();
```

## brushXFilter (X-Direction Brushing Filter)

```javascript
// After brushing, display only the data within the brushed interval
chart.options({
  type: 'point',
  data: scatterData,
  encode: { x: 'date', y: 'value', color: 'category' },
  interaction: {
    brushXFilter: true,   // Brush the X range and filter out points outside the range
  },
});
```

## brushYFilter (Y-Direction Brushing Filter)

```javascript
// Brush a numeric range and display only data whose Y values fall within the selected interval
chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y', color: 'category', size: 'value' },
  interaction: {
    brushYFilter: true,   // Vertical brushing that filters out points outside the Y range
  },
});
```

## Comparison of the Four Brushing Interactions

```javascript
// brushHighlight   → Two-dimensional brushing, highlight (no filtering)
// brushFilter      → Two-dimensional brushing, filter data
// brushXHighlight  → X-direction brushing, highlight
// brushXFilter     → X-direction brushing, filter
// brushYHighlight  → Y-direction brushing, highlight
// brushYFilter     → Y-direction brushing, filter

// Support highlighting on a scatter plot at the same time (single X-axis brushing)
chart.options({
  interaction: {
    brushXHighlight: {
      series: true,        // Whether to highlight other points in the same series
    },
  },
});
```

## Common Errors and Fixes

### Error: Assuming brushXFilter has the same effect as brushFilter
```javascript
// brushFilter can brush a rectangular region in both the X and Y directions at the same time
chart.options({ interaction: { brushFilter: true } });  // Two-dimensional rectangular brushing

// brushXFilter can only be dragged in the X direction, forming a vertical band
chart.options({ interaction: { brushXFilter: true } }); // X-axis direction only

// Different use cases: brushXFilter is more intuitive for time series
```
