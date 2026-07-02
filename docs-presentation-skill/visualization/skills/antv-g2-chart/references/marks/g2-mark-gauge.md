---
id: "g2-mark-gauge"
title: "G2 Gauge (gauge)"
description: |
  G2 v5 includes the gauge Mark, which creates a gauge with type: 'gauge'.
  The data contains target (current value) and total (maximum value),
  and supports segmented colors (thresholds), center text, and custom styles.

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "gauge"
  - "gauge"
  - "dial"
  - "KPI"
  - "progress"
  - "spec"

related:
  - "g2-core-chart-init"
  - "g2-mark-arc-pie"

use_cases:
  - "Show KPI completion or achievement rates"
  - "Real-time monitoring metrics (such as CPU usage)"
  - "Progress display (scores and ratings)"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/gauge"
---

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 400,
  height: 300,
});

chart.options({
  type: 'gauge',
  data: {
    value: {
      target: 120,   // Current value
      total: 400,    // Full score / maximum value
      name: 'Score',  // Center label
    },
  },
  legend: false,
});

chart.render();
```

## Segment-colored gauge (threshold coloring)

```javascript
chart.options({
  type: 'gauge',
  data: {
    value: {
      target: 159,
      total: 280,
      name: 'Speed',
      // thresholds: segment by percentage (0-1), using a different color for each segment
      thresholds: [100, 200, 280],   // Corresponding value segments
    },
  },
  scale: {
    color: {
      // Colors for each segment
      range: ['#F4664A', '#FAAD14', '#30BF78'],
    },
  },
  style: {
    // Center text
    textContent: (target, total) =>
      `Progress\n${((target / total) * 100).toFixed(0)}%`,
  },
  legend: false,
});
```

## Complete configuration notes

```javascript
chart.options({
  type: 'gauge',
  data: {
    value: {
      target: 75,       // Current value (required)
      total: 100,       // Maximum value (required)
      name: 'score',    // Label name (optional)
      thresholds: [40, 70, 100],  // Segment thresholds (optional)
    },
  },

  // Color scale (used with thresholds)
  scale: {
    color: {
      range: ['#F4664A', '#FAAD14', '#30BF78'],
    },
  },

  // Gauge style
  style: {
    // Arc endpoint shape: 'round' (rounded end) | 'butt' (square end)
    arcShape: 'round',
    arcLineWidth: 1,
    arcStroke: '#fff',

    // Center text: signature is fixed as (target, total), with no third datum parameter
    textContent: (target, total) => `${target}/${total}`,
    textX: '50%',
    textY: '70%',
    textFontSize: 24,
    textFill: '#262626',

    // Pointer (false means hidden)
    pointerShape: false,
    pinShape: false,
  },

  legend: false,
});
```

## Custom start and end angles

```javascript
chart.options({
  type: 'gauge',
  data: { value: { target: 60, total: 100, name: 'Completion rate' } },
  // gauge internally uses radial coordinates; adjust angles through coordinate
  coordinate: {
    type: 'radial',
    innerRadius: 0.8,
    startAngle: (-10 / 12) * Math.PI,   // approximately -150°
    endAngle: (2 / 12) * Math.PI,        // approximately 30°
  },
  legend: false,
});
```

## Multi-metric gauge composition

```javascript
// Use facetRect or spaceFlex to place multiple gauges side by side
chart.options({
  type: 'spaceFlex',
  children: [
    {
      type: 'gauge',
      data: { value: { target: 75, total: 100, name: 'CPU' } },
      legend: false,
    },
    {
      type: 'gauge',
      data: { value: { target: 60, total: 100, name: 'Memory' } },
      legend: false,
    },
    {
      type: 'gauge',
      data: { value: { target: 45, total: 100, name: 'Disk' } },
      legend: false,
    },
  ],
});
```

## Common errors and fixes

### Error 0: incorrect textContent function signature - mistakenly passing a third datum parameter

The signature of `textContent` is `(target, total) => string`. G2 internally **passes only two numeric values**; there is no third parameter.

```javascript
// ❌ Error: datum is undefined, and accessing datum.unit throws a TypeError
style: {
  textContent: (target, total, datum) => `${target}${datum.unit}\n${datum.name}`,
  //                            ^^^^^ Always undefined!
}

// ✅ Correct: use a closure to capture extra fields in data
const gaugeData = {
  target: 48,
  total: 60,
  name: 'Response time',
  unit: 'min',
  thresholds: [15, 30, 45, 60],
};

chart.options({
  type: 'gauge',
  data: { value: gaugeData },
  style: {
    // Reference an external variable through a closure
    textContent: (target, total) => `${target}${gaugeData.unit}\n${gaugeData.name}`,
  },
});
```

### Error 1: incorrect data format

```javascript
// ❌ Error: gauge data must be nested in the value object
chart.options({
  type: 'gauge',
  data: { target: 75, total: 100 },   // ❌ Top-level object
});

// ✅ Correct: requires the { value: { target, total } } structure
chart.options({
  type: 'gauge',
  data: {
    value: { target: 75, total: 100 },   // ✅
  },
});
```

### Error 2: thresholds and color range counts do not match

```javascript
// ❌ Error: 3 thresholds correspond to 3 segments, but only 2 colors were provided
chart.options({
  type: 'gauge',
  data: { value: { target: 60, total: 100, thresholds: [40, 70, 100] } },
  scale: {
    color: { range: ['#F4664A', '#30BF78'] },   // ❌ Should have 3 colors
  },
});

// ✅ Correct: number of colors = number of threshold segments (thresholds.length segments)
chart.options({
  scale: {
    color: { range: ['#F4664A', '#FAAD14', '#30BF78'] },   // ✅ 3 segments, 3 colors
  },
});
```
