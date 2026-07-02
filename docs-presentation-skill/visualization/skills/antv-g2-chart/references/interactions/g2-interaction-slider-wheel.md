---
id: "g2-interaction-slider-wheel"
title: "G2 SliderWheel zoom interaction"
description: |
  sliderWheel is a G2 v5 interaction that zooms the chart's slider component by using the mouse wheel or a two-finger trackpad scroll.
  Scrolling the mouse wheel up narrows the time window (zoom in), while scrolling down expands the time window (zoom out).
  Zooming is centered on the mouse position. Use it together with the slider component and the sliderFilter interaction.

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "sliderWheel"
  - "wheel zoom"
  - "wheel"
  - "zoom"
  - "zoom"
  - "interaction"
  - "slider"

related:
  - "g2-interaction-slider-filter"
  - "g2-comp-slider"
  - "g2-mark-line-basic"

use_cases:
  - "Quickly zoom the time range in a time-series chart with the mouse wheel"
  - "Provide a faster zoom operation instead of manually dragging the slider"
  - "Zoom a chart time axis with a two-finger trackpad gesture"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/slider-wheel"
---

## Core concepts

`sliderWheel` listens for the `wheel` event on the chart container and converts the wheel delta into a zoom change in the slider value range.
- Wheel up (delta < 0): narrow the window (zoom in on the data)
- Wheel down (delta > 0): expand the window (zoom out from the data)
- Zooming is centered on the mouse position and keeps the data point under the mouse stationary

## Basic usage

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 800, height: 400 });

chart.options({
  type: 'line',
  data: timeSeriesData,
  encode: { x: 'date', y: 'value' },
  slider: {
    x: { values: [0, 0.3] },   // Initially show the first 30%
  },
  interaction: {
    sliderFilter: true,    // sliderFilter must be enabled first
    sliderWheel: true,     // Then enable sliderWheel
  },
});

chart.render();
```

## Configuration options

```javascript
chart.options({
  interaction: {
    sliderWheel: {
      x: true,               // X-axis slider responds to the wheel, default true
      y: true,               // Y-axis slider responds to the wheel, default true
      // x: 'shift',         // Respond only while Shift is held
      // y: 'ctrl',          // Respond only while Ctrl is held
      wheelSensitivity: 0.05,  // Wheel sensitivity, default 0.05
      minRange: 0.01,          // Minimum zoom range (prevents excessive zoom-in), default 0.01
    },
  },
});
```

## Modifier key control (to avoid conflicts with page scrolling)

```javascript
// Zoom the chart only while Ctrl is held (to avoid conflicts with page scrolling)
chart.options({
  interaction: {
    sliderWheel: {
      x: 'ctrl',    // Only Ctrl + wheel triggers X-axis zoom
      y: false,     // The Y axis does not respond to the wheel
    },
  },
});
```

## Common mistakes and fixes

### Mistake: forgetting to enable sliderFilter as well
```javascript
// ❌ With sliderWheel but no sliderFilter, wheel scrolling has no effect
chart.options({
  slider: { x: true },
  interaction: {
    sliderWheel: true,   // ❌ Missing sliderFilter
  },
});

// ✅ Must be used with sliderFilter
chart.options({
  slider: { x: true },
  interaction: {
    sliderFilter: true,   // ✅ Enable filtering first
    sliderWheel: true,    // ✅ Then enable wheel zoom
  },
});
```

### Mistake: enabling sliderWheel without a slider component
```javascript
// ❌ sliderWheel does not work without a slider component
chart.options({
  // No slider configuration
  interaction: { sliderWheel: true },  // Invalid
});

// ✅ A slider component is required
chart.options({
  slider: { x: { values: [0, 0.5] } },
  interaction: {
    sliderFilter: true,
    sliderWheel: true,
  },
});
```
