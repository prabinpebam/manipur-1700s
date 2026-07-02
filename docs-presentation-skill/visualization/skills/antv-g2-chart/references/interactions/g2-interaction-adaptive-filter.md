---
id: "g2-interaction-adaptive-filter"
title: "G2 AdaptiveFilter Adaptive Filtering Interaction"
description: |
  adaptiveFilter is a G2 v5 interaction that automatically samples or aggregates data
  when excessive data volume degrades chart rendering performance,
  keeping chart interactions smooth and responsive.
  It is suitable for large line charts, scatter plots, and similar scenarios, and works better when combined with sliderFilter or scrollbarFilter.

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "adaptiveFilter"
  - "adaptive filtering"
  - "big data"
  - "performance optimization"
  - "sampling"
  - "interaction"

related:
  - "g2-interaction-slider-filter"
  - "g2-transform-sample"
  - "g2-mark-line-basic"

use_cases:
  - "Automatically downsample large line charts to keep rendering smooth"
  - "Dynamically adjust data density during sliding-window filtering"
  - "Automatically aggregate scatter plot data when the data volume exceeds a threshold"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/adaptive-filter"
---

## Core Concepts

`adaptiveFilter` listens for chart viewport changes and data scale. When the visible data volume exceeds the pixel capacity,
it automatically applies sampling strategies (such as the LTTB algorithm) to reduce the number of rendered points and avoid performance issues caused by overplotting.

It is usually used together with `sliderFilter` or `scrollbarFilter` to automatically adapt data volume while sliding.

## Basic Usage

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 800, height: 400 });

chart.options({
  type: 'line',
  data: largeDataArray,   // Thousands or more data records
  encode: { x: 'date', y: 'value' },
  interaction: {
    adaptiveFilter: true,   // Enable adaptive filtering
  },
});

chart.render();
```

## Using with sliderFilter

```javascript
chart.options({
  type: 'view',
  data: largeDataArray,
  children: [
    {
      type: 'line',
      encode: { x: 'date', y: 'value' },
    },
  ],
  interaction: {
    sliderFilter: {
      x: { labelFormatter: (v) => new Date(v).toLocaleDateString() },
    },
    adaptiveFilter: true,   // Automatically sample after sliding-window filtering
  },
  slider: {
    x: { values: [0, 0.3] },   // Initially display the first 30% of the data
  },
});
```

## Configuration Options

```javascript
chart.options({
  interaction: {
    adaptiveFilter: {
      // Data-volume threshold that triggers adaptive sampling (default: 2000)
      // Sampling starts when the number of visible data points exceeds this value
      maxPoints: 2000,
    },
  },
});
```

## Common Errors and Fixes

### Error: Enabling adaptiveFilter on small datasets causes data to be filtered unexpectedly
```javascript
// ❌ Unnecessary: small datasets do not need it, and enabling it can create the mistaken impression that data was lost
chart.options({
   smallData,   // Only 50 data records
  interaction: { adaptiveFilter: true },
});

// ✅ Enable it only for large-data scenarios
// adaptiveFilter is suitable for scenarios with more than 1000 data records
chart.options({
  data: massiveData,
  interaction: { adaptiveFilter: true },
});
```
