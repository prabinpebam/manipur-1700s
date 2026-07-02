---
id: "g2-animation-intro"
title: "G2 Animation System Overview (animate Configuration)"
description: |
  The G2 v5 animation system is configured through the animate property and supports three timings: enter, update, and exit.
  Built-in animation types include fadeIn/Out, scaleInX/Y, growInX/Y, waveIn, zoomIn/Out, morphing, and pathIn.
  Each animation can configure duration, delay, and easing.

library: "g2"
version: "5.x"
category: "animations"
tags:
  - "animation"
  - "animation"
  - "animate"
  - "enter animation"
  - "fadeIn"
  - "scaleInX"
  - "waveIn"

related:
  - "g2-animation-keyframe"
  - "g2-core-chart-init"

use_cases:
  - "Add enter animations on the initial chart render to improve the visual experience"
  - "Add transition animations when data updates"
  - "Add fade-out effects on exit"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/animate"
---

## Built-in Animation Type Quick Reference

| Animation name | Effect | Suitable scenarios |
|--------|------|---------|
| `fadeIn` | From transparent to opaque | General enter |
| `fadeOut` | From opaque to transparent | General exit |
| `scaleInX` | Scale and expand from the X-axis start | Bar chart enter |
| `scaleInY` | Scale and expand from the Y-axis bottom | Column chart enter |
| `scaleOutX` | Shrink and disappear toward the X-axis | Bar chart exit |
| `scaleOutY` | Shrink and disappear toward the Y-axis | Column chart exit |
| `growInX` | Grow from left to right | Bar chart and line chart enter |
| `growInY` | Grow from bottom to top | Column chart enter |
| `waveIn` | Wave-scan enter | Polar charts (rose charts, pie charts) |
| `zoomIn` | Scale up from the center | Point chart enter |
| `zoomOut` | Shrink toward the center and disappear | Point chart exit |
| `pathIn` | Gradually draw the path | Line charts and path charts |
| `morphing` | Shape morphing transition | Chart type switching |

## Minimal Runnable Example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data: [
    { genre: 'Sports', sold: 275 },
    { genre: 'Strategy', sold: 115 },
    { genre: 'Action', sold: 120 },
    { genre: 'RPG', sold: 98 },
  ],
  encode: { x: 'genre', y: 'sold', color: 'genre' },
  animate: {
    enter: {
      type: 'growInY',    // Enter animation: grow from bottom to top
      duration: 800,      // Duration (milliseconds)
      delay: 0,           // Delay
      easing: 'ease-out', // Easing function
    },
  },
});

chart.render();
```

## Three Animation Timings

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'x', y: 'y', color: 'type' },
  animate: {
    // Enter: when the chart renders for the first time
    enter: {
      type: 'scaleInY',
      duration: 1000,
      easing: 'ease-out-bounce',
    },
    // Update: when data changes
    update: {
      type: 'morphing',
      duration: 500,
    },
    // Exit: when graphical elements are removed
    exit: {
      type: 'fadeOut',
      duration: 300,
    },
  },
});
```

## Disable Animation

```javascript
// Disable all animations
chart.options({
  animate: false,
});

// Disable only enter animations
chart.options({
  animate: {
    enter: false,
  },
});
```

## Recommended Common Animation Combinations

```javascript
// Column chart: growInY enter
animate: { enter: { type: 'growInY', duration: 800 } }

// Line chart: pathIn enter (path drawing effect)
animate: { enter: { type: 'pathIn', duration: 1200 } }

// Pie chart (polar coordinates): waveIn enter
animate: { enter: { type: 'waveIn', duration: 1000 } }

// Scatter plot: zoomIn enter
animate: { enter: { type: 'zoomIn', duration: 600 } }

// General fade-in
animate: { enter: { type: 'fadeIn', duration: 500 } }
```

## Common Mistakes and Fixes

### Mistake 1: writing animate.enter as a string
```javascript
// Incorrect: enter is not a string; it is an object
chart.options({
  animate: { enter: 'fadeIn' },  // Incorrect
});

// Correct
chart.options({
  animate: { enter: { type: 'fadeIn', duration: 600 } },  // Correct
});
```

### Mistake 2: using a non-polar animation in a polar chart
```javascript
// scaleInX/Y does not work correctly in polar coordinates
chart.options({
  coordinate: { type: 'theta' },
  animate: { enter: { type: 'scaleInY' } },  // Incorrect; pie charts should use waveIn
});

// waveIn is recommended for polar charts
chart.options({
  coordinate: { type: 'theta' },
  animate: { enter: { type: 'waveIn', duration: 1000 } },  // Correct
});
```