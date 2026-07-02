---
id: "g2-interaction-brush-x-highlight"
title: "G2 BrushXHighlight / BrushYHighlight Single-Axis Brushing Highlight"
description: |
  brushXHighlight and brushYHighlight are G2 v5 interactions that
  restrict the brushing range to the X-axis direction (or the Y-axis direction), highlight marks inside the selected region, and fade unselected regions with transparency.
  They are suitable for time-series comparison, focusing on local trends, and similar scenarios.
  If you need to filter data instead of highlighting it, use brushXFilter / brushYFilter.

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "brushXHighlight"
  - "brushYHighlight"
  - "brushing highlight"
  - "X-axis brushing"
  - "Y-axis brushing"
  - "interaction"
  - "highlight"

related:
  - "g2-interaction-brush"
  - "g2-interaction-brush-filter"
  - "g2-interaction-brush-xy"

use_cases:
  - "Select a time range on a time axis and highlight the corresponding data points"
  - "Select several categories in a horizontal comparison chart and highlight them"
  - "Highlight an outlier region in a scatter plot by Y-axis range"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/brush-x-highlight"
---

## Core Concepts

- `brushXHighlight`: brush only in the X-axis direction, highlight selected elements, and fade the rest
- `brushYHighlight`: brush only in the Y-axis direction, highlight selected elements, and fade the rest
- The highlighting effect does not filter data; all data remains visible (unlike `brushXFilter`)

## Basic Usage of BrushXHighlight

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 800, height: 400 });

chart.options({
  type: 'line',
  data: timeSeriesData,
  encode: { x: 'date', y: 'value', color: 'type' },
  interaction: {
    brushXHighlight: true,   // Enable X-axis brushing highlight
  },
});

chart.render();
```

## Basic Usage of BrushYHighlight

```javascript
chart.options({
  type: 'point',
  data: scatterData,
  encode: { x: 'x', y: 'y', color: 'category' },
  interaction: {
    brushYHighlight: true,   // Enable Y-axis brushing highlight
  },
});
```

## Configuration Options

```javascript
chart.options({
  interaction: {
    brushXHighlight: {
      series: true,      // Highlight all points in the same series (in a line chart, selecting one point highlights the entire line); default: true
      state: {
        // Custom styles for highlighted and unhighlighted states
        selected: {
          lineWidth: 2,
          opacity: 1,
        },
        unselected: {
          opacity: 0.2,
        },
      },
    },
  },
});
```

## X/Y Brushing at the Same Time (Free Brushing)

```javascript
// For free brushing (constraining both X and Y), use brushHighlight
chart.options({
  interaction: {
    brushHighlight: true,    // Free rectangular brushing highlight
  },
});
```

## Common Errors and Fixes

### Error: Confusing highlighting with filtering
```javascript
// ❌ Mistakenly assuming brushXHighlight filters out unselected data
// brushXHighlight only changes opacity; all data is still displayed

// ✅ If you need to filter data (remove unselected regions from the chart), use:
chart.options({
  interaction: { brushXFilter: true },   // Filtering mode: unselected data disappears
});

// ✅ If you only need highlighting without filtering, use:
chart.options({
  interaction: { brushXHighlight: true },   // Highlighting mode: unselected data fades out
});
```
