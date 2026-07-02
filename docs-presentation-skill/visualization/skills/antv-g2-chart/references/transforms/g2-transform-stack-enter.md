---
id: "g2-transform-stack-enter"
title: "G2 StackEnter Stacked Entrance Animation Transform"
description: |
  stackEnter is a Transform in G2 v5 for grouped entrance animations.
  It offsets the enterDelay of elements in the same group in sequence,
  creating an entrance animation where groups appear one after another.
  It is commonly used for staged group entrances in bar charts and line charts.

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "stackEnter"
  - "entrance animation"
  - "enterDelay"
  - "group animation"
  - "transform"
  - "animation"

related:
  - "g2-animation-intro"
  - "g2-transform-stacky"
  - "g2-mark-interval-grouped"

use_cases:
  - "Animate bar-chart groups in batches (x groups appear one by one)"
  - "Draw line-chart series one after another"
  - "Reveal data progressively with a controlled rhythm in data storytelling"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform/stack-enter"
---

## Core Concept

`stackEnter` assigns an `enterDelay` value to each data item:
- It groups data by the `groupBy` channel (default `['x']`)
- Elements in the same group share the same entrance delay
- Delays are accumulated sequentially across different groups

The delay for each group equals the sum of `enterDuration` for all preceding groups.

## Basic Usage (Grouped Bar Entrance)

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data: [
    { month: 'Jan', value: 83 },
    { month: 'Feb', value: 60 },
    { month: 'Mar', value: 95 },
    { month: 'Apr', value: 72 },
    { month: 'May', value: 110 },
  ],
  encode: { x: 'month', y: 'value', color: 'month' },
  transform: [
    {
      type: 'stackEnter',
      groupBy: ['x'],          // Group by x (one batch per month)
      orderBy: null,           // No additional sorting
      duration: 300,           // Animation duration per group (milliseconds); defaults to enterDuration
    },
  ],
  animate: {
    enter: {
      type: 'scaleInY',        // Each group of bars grows from bottom to top
      duration: 300,
    },
  },
});

chart.render();
```

## Sequential Entrance for Multiple Line-Series

```javascript
chart.options({
  type: 'line',
  data: multiSeriesData,
  encode: { x: 'date', y: 'value', color: 'series' },
  transform: [
    {
      type: 'stackEnter',
      groupBy: ['color'],    // Group by color (series), so each line enters in sequence
      duration: 800,
    },
  ],
  animate: {
    enter: {
      type: 'pathIn',        // Draw the line from left to right
      duration: 800,
    },
  },
});
```

## Configuration Options

```javascript
chart.options({
  transform: [
    {
      type: 'stackEnter',
      groupBy: ['x'],          // Grouping channel; default ['x']
                               // Can be a single string or an array: ['x', 'color']
      orderBy: null,           // Basis for inter-group sorting: null | 'x' | function
      reverse: false,          // Whether to reverse the group order
      duration: undefined,     // Entrance duration per group (milliseconds); if omitted, uses animate.enter.duration
    },
  ],
});
```

## Common Errors and Fixes

### Error: animate.enter Is Not Configured
```javascript
// ❌ stackEnter is configured, but animate.enter is missing, so no animation is visible
chart.options({
  transform: [{ type: 'stackEnter', groupBy: ['x'] }],
  // Missing animate configuration!
});

// ✅ Must be used together with animate.enter
chart.options({
  transform: [{ type: 'stackEnter', groupBy: ['x'], duration: 400 }],
  animate: {
    enter: {
      type: 'scaleInY',    // Choose an appropriate entrance animation type
      duration: 400,
    },
  },
});
```

### Error: duration and animate.enter.duration Are Inconsistent, Making the Animation Disjointed
```javascript
// ❌ stackEnter duration does not match animate.enter.duration
chart.options({
  transform: [{ type: 'stackEnter', duration: 500 }],  // 500 ms per group
  animate: { enter: { type: 'scaleInY', duration: 200 } },  // ❌ 200 ms animation (switches before the group finishes)

// ✅ Keep them consistent
chart.options({
  transform: [{ type: 'stackEnter', duration: 400 }],
  animate: { enter: { type: 'scaleInY', duration: 400 } },   // ✅ Consistent
});
```
