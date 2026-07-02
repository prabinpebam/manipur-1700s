---
id: "g2-mark-bullet"
title: "G2 Bullet Chart Mark"
description: |
  Bullet chart Mark. Implemented with a view combining interval and point marks to compare actual values against targets.
  Suitable for performance monitoring, KPI display, progress tracking, and similar scenarios.

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "bullet chart"
  - "bullet"
  - "KPI"
  - "progress"

related:
  - "g2-mark-interval-basic"
  - "g2-mark-gauge"

use_cases:
  - "Performance metric monitoring"
  - "KPI dashboards"
  - "Budget execution tracking"

anti_patterns:
  - "Use a line chart for time trend analysis"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/mark/bullet"
---

## Core concepts

A bullet chart is a compact metric display chart that shows:
- **Actual value bar**: the current actual value achieved
- **Target marker**: the target that should be reached
- **Performance ranges**: background color bands representing poor/good/excellent levels

**Suitable scenarios:**
- Dashboard KPI display
- Performance metric monitoring
- Resource utilization monitoring

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  theme: 'classic',
});

const data = [
  { title: 'Sales completion rate', ranges: 100, measures: 80, target: 85 },
];

chart.options({
  type: 'view',
  coordinate: { transform: [{ type: 'transpose' }] },
  children: [
    {
      type: 'interval',
      data,
      encode: { x: 'title', y: 'ranges', color: '#f0efff' },
      style: { maxWidth: 30 },
    },
    {
      type: 'interval',
      data,
      encode: { x: 'title', y: 'measures', color: '#5B8FF9' },
      style: { maxWidth: 20 },
    },
    {
      type: 'point',
      data,
      encode: {
        x: 'title',
        y: 'target',
        shape: 'line',
        color: '#3D76DD',
        size: 8,
      },
    },
  ],
});

chart.render();
```

## Common variants

### Multi-metric bullet chart

```javascript
const multiData = [
  { metric: 'CPU usage', ranges: 100, measures: 65, target: 80 },
  { metric: 'Memory usage', ranges: 100, measures: 45, target: 70 },
  { metric: 'Disk usage', ranges: 100, measures: 88, target: 85 },
];

chart.options({
  type: 'view',
  coordinate: { transform: [{ type: 'transpose' }] },
  children: [
    { type: 'interval', data: multiData, encode: { x: 'metric', y: 'ranges', color: '#f5f5f5' } },
    { type: 'interval', data: multiData, encode: { x: 'metric', y: 'measures', color: '#52c41a' } },
    { type: 'point', data: multiData, encode: { x: 'metric', y: 'target', shape: 'line', size: 6 } },
  ],
});
```

### With performance ranges

```javascript
const transformedData = [
  { title: 'Project progress', value: 40, level: 'Poor' },
  { title: 'Project progress', value: 30, level: 'Good' },
  { title: 'Project progress', value: 30, level: 'Excellent' },
];

chart.options({
  type: 'view',
  coordinate: { transform: [{ type: 'transpose' }] },
  children: [
    {
      type: 'interval',
      data: transformedData,
      encode: { x: 'title', y: 'value', color: 'level' },
      transform: [{ type: 'stackY' }],
      scale: {
        color: { domain: ['Poor', 'Good', 'Excellent'], range: ['#ffebee', '#fff3e0', '#e8f5e8'] },
      },
    },
    // ... actual value and target value
  ],
});
```

### Vertical bullet chart

```javascript
chart.options({
  type: 'view',
  // Do not use transpose
  children: [
    { type: 'interval', data, encode: { x: 'metric', y: 'ranges', color: '#f0f0f0' } },
    { type: 'interval', data, encode: { x: 'metric', y: 'measures', color: '#52c41a' } },
    { type: 'point', data, encode: { x: 'metric', y: 'target', shape: 'line', size: 6 } },
  ],
});
```

## Complete type reference

```typescript
interface BulletData {
  title: string;      // Metric name
  ranges: number;     // Background range (usually 100)
  measures: number;   // Actual value
  target: number;     // Target value
}

// A bullet chart consists of three layers:
// 1. interval - background range
// 2. interval - actual value bar
// 3. point (shape: 'line') - target marker
```

## Bullet chart vs. gauge

| Feature | Bullet chart | Gauge |
|------|--------|--------|
| Space usage | Compact | Larger |
| Information density | Multiple metrics | Single metric |
| Suitable scenario | Dashboard | Large-screen display |

## Common mistakes and fixes

### Mistake 1: Missing transpose

```javascript
// Problem: the default orientation is vertical
coordinate: {}

// Correct: horizontal bullet charts require transpose
coordinate: { transform: [{ type: 'transpose' }] }
```

### Mistake 2: Target marker is not obvious

```javascript
// Problem: the target value uses the default point shape
encode: { shape: 'point' }

// Correct: use the line shape
encode: { shape: 'line', size: 8 }
```
