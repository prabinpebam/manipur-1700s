---
id: "g2-scale-threshold"
title: "G2 Threshold Scale (threshold)"
description: |
  The threshold scale splits continuous numeric values into intervals by specified thresholds, and maps each interval to a discrete output such as a color.
  It is commonly used for heatmaps, choropleth maps, and similar scenarios where a few key thresholds divide data into levels.
  Unlike quantize, which divides the range evenly, threshold supports custom non-uniform breakpoints.

library: "g2"
version: "5.x"
category: "scales"
tags:
  - "threshold"
  - "threshold"
  - "scale"
  - "classification"
  - "choropleth"
  - "heatmap"
  - "scale"

related:
  - "g2-scale-linear"
  - "g2-scale-ordinal"
  - "g2-mark-cell-heatmap"

use_cases:
  - "Choropleth map classification"
  - "Heatmap data classification into low, medium, high, and critical levels"
  - "Color mapping with custom intervals"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/scale/threshold"
---

## Minimal runnable example (classified heatmap coloring)

```javascript
import { Chart } from '@antv/g2';

const data = [
  { week: 'Mon', hour: '08:00', count: 5 },
  { week: 'Mon', hour: '09:00', count: 45 },
  { week: 'Mon', hour: '12:00', count: 120 },
  { week: 'Tue', hour: '09:00', count: 85 },
  { week: 'Wed', hour: '12:00', count: 200 },
  // ...
];

const chart = new Chart({ container: 'container', width: 640, height: 300 });

chart.options({
  type: 'cell',
  data,
  encode: {
    x: 'hour',
    y: 'week',
    color: 'count',
  },
  scale: {
    color: {
      type: 'threshold',
      domain: [30, 80, 150],          // Three thresholds divide the data into four intervals.
      range: ['#ebedf0', '#c6e48b', '#7bc96f', '#196127'],  // Corresponding four colors.
    },
  },
  style: { lineWidth: 2, stroke: '#fff' },
});

chart.render();
```

## Configuration options

```javascript
scale: {
  color: {
    type: 'threshold',
    domain: [30, 80, 150],    // N thresholds produce N+1 intervals.
    range: ['#low', '#mid-low', '#mid-high', '#high'],  // N+1 output values.
  },
}
```

## Risk-level coloring example

```javascript
// Map a continuous risk score to four risk-level colors.
chart.options({
  scale: {
    color: {
      type: 'threshold',
      domain: [25, 50, 75],     // Low/medium/high/critical boundaries.
      range: [
        '#52c41a',  // 0 to 25: low risk (green).
        '#faad14',  // 25 to 50: medium risk (yellow).
        '#ff7a45',  // 50 to 75: high risk (orange).
        '#ff4d4f',  // 75 and above: critical risk (red).
      ],
    },
  },
});
```

## Common mistakes and fixes

### Mistake: domain and range lengths do not match
```javascript
// Incorrect: two domain thresholds produce three intervals, but there are only two range colors.
chart.options({
  scale: {
    color: {
      type: 'threshold',
      domain: [50, 100],     // Two thresholds mean three intervals.
      range: ['#green', '#red'],  // Only two colors; there should be three.
    },
  },
});

// Correct: N domain thresholds require N+1 range colors.
chart.options({
  scale: {
    color: {
      type: 'threshold',
      domain: [50, 100],
      range: ['#52c41a', '#faad14', '#ff4d4f'],  // Three colors.
    },
  },
});
```
