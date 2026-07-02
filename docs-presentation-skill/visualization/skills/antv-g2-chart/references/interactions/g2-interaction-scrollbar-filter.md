---
id: "g2-interaction-scrollbar-filter"
title: "G2 ScrollbarFilter interaction"
description: |
  scrollbarFilter is a G2 v5 interaction that filters the visible data range through an embedded scrollbar in the chart.
  It is similar to sliderFilter, but uses a more compact scrollbar control instead of a slider.
  It is suitable for large datasets that need page-by-page browsing, such as bar charts with many categories.
  Use it together with the scrollbar component (scrollbar: { x: true }).

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "scrollbarFilter"
  - "scrollbar"
  - "scrollbar"
  - "data filtering"
  - "pagination"
  - "interaction"

related:
  - "g2-interaction-slider-filter"
  - "g2-comp-scrollbar"
  - "g2-mark-interval-basic"

use_cases:
  - "Horizontally scroll a bar chart with too many categories"
  - "Browse long time-series data page by page"
  - "Show a local view of a large categorical dataset"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/component/scrollbar"
---

## Core concepts

The `scrollbarFilter` interaction must be used with the `scrollbar` component:
- `scrollbar` field: controls where the scrollbar is displayed (X axis / Y axis)
- `scrollbarFilter` interaction: responds to scrollbar drag events and filters the data range

Difference from `sliderFilter`:
- `sliderFilter`: a dual-ended slider that supports selecting any range
- `scrollbarFilter`: a scrollbar with a fixed window size; it can only pan and cannot zoom the range

## Basic usage (X-axis scrollbar)

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 600, height: 400 });

chart.options({
  type: 'interval',
   manyCategories,   // Large categorical dataset
  encode: { x: 'category', y: 'value' },
  scrollbar: {
    x: true,   // Enable the X-axis scrollbar
  },
  interaction: {
    scrollbarFilter: true,   // Enable scrollbar filtering
  },
});

chart.render();
```

## Y-axis scrollbar

```javascript
chart.options({
  type: 'interval',
  data: manyCategories,
  encode: { x: 'value', y: 'category' },  // Bar chart
  coordinate: { transform: [{ type: 'transpose' }] },
  scrollbar: {
    y: true,   // Enable the Y-axis scrollbar (vertical scrolling for a bar chart)
  },
  interaction: {
    scrollbarFilter: true,
  },
});
```

## Configuration options

```javascript
chart.options({
  scrollbar: {
    x: {
      ratio: 0.3,    // Initial scrollbar window ratio (show 30% of all data), calculated from the data size by default
    },
  },
  interaction: {
    scrollbarFilter: {
      // scrollbarFilter currently has few options; it is mainly configured through the scrollbar component
    },
  },
});
```

## Common mistakes and fixes

### Mistake: forgetting to configure the scrollbar component
```javascript
// ❌ Adding only interaction without the scrollbar component does not display a scrollbar
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value' },
  interaction: { scrollbarFilter: true },  // ❌ No scrollbar component
});

// ✅ Configure the scrollbar component as well
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value' },
  scrollbar: { x: true },              // ✅ Enable the scrollbar component
  interaction: { scrollbarFilter: true },  // ✅ Enable the filtering interaction
});
```

### Mistake: mixing it with sliderFilter
```javascript
// ❌ Enabling scrollbar and slider at the same time can cause conflicts
chart.options({
  scrollbar: { x: true },
  slider: { x: true },
  interaction: {
    scrollbarFilter: true,
    sliderFilter: true,   // ❌ Do not enable both at the same time
  },
});

// ✅ Choose one of them
chart.options({
  scrollbar: { x: true },
  interaction: { scrollbarFilter: true },
});
```
