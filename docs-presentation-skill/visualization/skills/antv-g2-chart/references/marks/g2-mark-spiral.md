---
id: "g2-mark-spiral"
title: "G2 Spiral Chart (spiral)"
description: |
  A spiral chart uses the helix coordinate system (coordinate.type: 'helix') to draw time-series data as a spiral,
  extending outward from the center. It is suitable for showing periodic patterns and trends in large time series (usually 100+ data points).

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "spiral chart"
  - "spiral"
  - "helix"
  - "time series"
  - "periodic"
  - "large data volume"

related:
  - "g2-mark-line-basic"
  - "g2-mark-interval-basic"

use_cases:
  - "Show trends in large time-series data sets with 100 or more data points"
  - "Identify periodic patterns, such as yearly or seasonal cycles"
  - "Create a compact view of time-series data"

anti_patterns:
  - "Small data sets with fewer than 30 items are better shown as line charts"
  - "Not suitable when precise value comparison is required, because spiral coordinates are nonlinear"
  - "Do not use growInX or growInY for animate.enter; use fadeIn to avoid incomplete spiral rendering"

difficulty: "intermediate"
completeness: "full"
created: "2025-04-01"
updated: "2025-04-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/spiral"
---

## Core concepts

**Spiral chart = interval/line mark + `coordinate: { type: 'helix', startAngle, endAngle }`**

- `coordinate.type: 'helix'`: Archimedean spiral coordinate system.
- `startAngle`: spiral start angle in radians; `Math.PI / 2` starts at the top.
- `endAngle`: spiral end angle; larger values create more turns.
- **Data volume**: usually requires at least 100 items to form a complete spiral.

**Relationship between angle and number of turns**: `number of turns = (endAngle - startAngle) / (2 * Math.PI)`

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  autoFit: true,
  height: 500,
});

chart.options({
  type: 'interval',
  data: {
  value: [
  { time: '2025.07.11', value: 35 },
  { time: '2025.07.12', value: 30 },
  { time: '2025.07.13', value: 55 },
  // ... more data points (100+ items)
  ],
  },
  encode: { x: 'time', y: 'value', color: 'value' },
  scale: {
  color: { type: 'linear', range: ['#ffffff', '#1890FF'] },
  },
  coordinate: {
  type: 'helix',
  startAngle: Math.PI / 2, // Start from the top
  endAngle: Math.PI / 2 + 6 * Math.PI, // Three turns; each turn is 2π
  },
  animate: { enter: { type: 'fadeIn' } },
  tooltip: { title: 'time' },
});

chart.render();
```

## Common angle configurations

```javascript
// Dense spiral with about six turns; suitable for yearly data by week.
coordinate: {
  type: 'helix',
  startAngle: 1.5707963267948966, // Math.PI / 2
  endAngle: 39.269908169872416, // Math.PI / 2 + 12 * Math.PI (six turns)
}

// Fewer turns, about three; suitable for quarterly data.
coordinate: {
  type: 'helix',
  startAngle: Math.PI / 2,
  endAngle: Math.PI / 2 + 6 * Math.PI,
}

// Add an inner radius for a ring-style spiral.
coordinate: {
  type: 'helix',
  startAngle: 0.2 * Math.PI,
  endAngle: 6.5 * Math.PI,
  innerRadius: 0.1,
}
```

## Spiral chart grouped by category

```javascript
chart.options({
  type: 'interval',
  data: {
  type: 'fetch',
  value: 'url-to-data.json',
  },
  encode: {
  x: 'time',
  y: 'group', // Use the y channel to separate categories.
  color: 'value', // Map value to color.
  },
  scale: {
  color: {
  type: 'linear',
  range: ['#fff', '#ec4839'],
  },
  },
  coordinate: {
  type: 'helix',
  startAngle: 0.2 * Math.PI,
  endAngle: 6.5 * Math.PI,
  innerRadius: 0.1,
  },
  tooltip: {
  title: 'time',
  items: [
  { field: 'group', name: 'Group' },
  { field: 'value', name: 'Value' },
  ],
  },
});
```

## Common errors and fixes

### Error 1: too few data points

```javascript
// ❌ Problem: five data points cannot form a meaningful spiral.
chart.options({
  type: 'interval',
  data: {
  value: [
  { time: '2025-01', value: 35 },
  { time: '2025-02', value: 50 },
  { time: '2025-03', value: 45 },
  { time: '2025-04', value: 60 },
  { time: '2025-05', value: 40 },
  ],
  },
  coordinate: { type: 'helix', startAngle: Math.PI / 2, endAngle: 40 },
});

// ✅ Use a line chart for small data sets.
chart.options({
  type: 'line',
  data,
  encode: { x: 'time', y: 'value' },
});
```

### Error 2: incorrect coordinate type name

```javascript
// ❌ Error: there is no 'spiral' coordinate type; use 'helix'.
coordinate: { type: 'spiral' } // ❌ Does not exist

// ✅ Correct: use helix.
coordinate: { type: 'helix', startAngle: Math.PI / 2, endAngle: 40 } // ✅
```

### Error 3: confusing degrees with radians

```javascript
// ❌ Error: angles must be in radians, not degrees.
coordinate: {
  type: 'helix',
  startAngle: 90, // ❌ 90° is not radians; use Math.PI / 2.
  endAngle: 2250, // ❌ Use a radian value.
}

// ✅ Correct: use radians.
coordinate: {
  type: 'helix',
  startAngle: Math.PI / 2, // ✅ 90° = π/2 radians
  endAngle: Math.PI / 2 + 12 * Math.PI, // ✅ Six turns
}
```

### Error 4: incorrect data format; inline data requires a value wrapper

```javascript
// ❌ Error: inline array data must be placed in data.value.
chart.options({
  data: [{ time: '2025.01', value: 35 }, ...], // ❌ Direct array
  coordinate: { type: 'helix', ... },
});

// ✅ Correct: wrap inline data with { value: [...] }.
chart.options({
  {
  value: [{ time: '2025.01', value: 35 }, ...], // ✅
  },
  coordinate: { type: 'helix', ... },
});
```

### Error 5: using growInY or growInX for animate.enter can cause incomplete spiral rendering

`growInX/Y` clips the drawing along Cartesian coordinate axes using a clipPath. In a helix coordinate system, geometry has already been remapped onto a spiral path, so there is no simple baseline direction. A rectangular clip can cut across the spiral and hide parts of the chart even after the animation completes.

```javascript
// ❌ Error: growInY in a helix coordinate system uses a rectangular clip that can cut across the spiral.
chart.options({
  type: 'interval',
  coordinate: { type: 'helix', startAngle: 0, endAngle: Math.PI * 6 },
  animate: {
  enter: { type: 'growInY', duration: 2000 }, // ❌ May produce incomplete spiral rendering
  },
});

// ✅ Correct: use fadeIn, or omit the enter animation, for helix coordinates.
chart.options({
  type: 'interval',
  coordinate: { type: 'helix', startAngle: 0, endAngle: Math.PI * 6 },
  animate: {
  enter: { type: 'fadeIn', duration: 1000 }, // ✅
  },
});
```

## Choosing between a spiral chart and a line chart

| Scenario | Recommended chart |
|------|---------|
| Data volume < 50 items | Line chart |
| Data volume 100+ items, trend exploration | Spiral chart or line chart |
| Need to discover periodic patterns | **Spiral chart**; each turn can align to a period such as a week |
| Need precise value reading | Line chart |
| Large-screen visual display | **Spiral chart** |
