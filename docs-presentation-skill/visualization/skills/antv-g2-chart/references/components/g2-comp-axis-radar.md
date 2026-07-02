---
id: "g2-comp-axis-radar"
title: "G2 Radar Chart Axis (AxisRadar)"
description: |
  An axis component specifically for radar charts. It displays axis lines and ticks for multiple dimensions
  in a polar coordinate system and is one of the core components of radar charts.

library: "g2"
version: "5.x"
category: "components"
tags:
  - "axis"
  - "radar chart"
  - "polar coordinate"
  - "axis"

related:
  - "g2-coord-polar"
  - "g2-mark-radar"
  - "g2-comp-axis-config"

use_cases:
  - "Display multiple dimensions in radar charts"
  - "Use axes in a polar coordinate system"
  - "Build performance evaluation charts"

anti_patterns:
  - "Not applicable to Cartesian coordinate charts"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/component/axis"
---

## Core concepts

AxisRadar is an axis component specifically for radar charts:
- Displays radial axis lines in a polar coordinate system
- Supports axis labels for multiple dimensions
- Automatically calculates axis angles and positions

**Features:**
- Automatically connects axes to form a grid
- Supports custom axis styles
- Works with polar coordinate systems

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'line',
  coordinate: { type: 'polar' },
  data: [
    { item: 'Design', score: 70 },
    { item: 'Development', score: 60 },
    { item: 'Marketing', score: 50 },
    { item: 'Sales', score: 80 },
    { item: 'Support', score: 90 },
  ],
  encode: {
    x: 'item',
    y: 'score',
  },
  axis: {
    x: {
      // Radar chart X-axis configuration
      title: false,
      tickLine: null,
    },
    y: {
      // Radar chart Y-axis (radial axis)
      title: 'Score',
      grid: true,
      gridConnect: 'line',  // Grid connection type
    },
  },
});

chart.render();
```

## Common variants

### Custom grid style

```javascript
chart.options({
  type: 'line',
  coordinate: { type: 'polar' },
  data,
  encode: { x: 'item', y: 'score' },
  axis: {
    y: {
      grid: true,
      gridConnect: 'line',
      gridLineWidth: 1,
      gridStroke: '#e8e8e8',
      gridType: 'line',
    },
  },
});
```

### Hide axis lines

```javascript
chart.options({
  type: 'line',
  coordinate: { type: 'polar' },
  data,
  encode: { x: 'item', y: 'score' },
  axis: {
    x: { line: null },
    y: { line: null },
  },
});
```

### Custom labels

```javascript
chart.options({
  type: 'line',
  coordinate: { type: 'polar' },
  data,
  encode: { x: 'item', y: 'score' },
  axis: {
    x: {
      labelFormatter: (val) => val.toUpperCase(),
      labelSpacing: 10,
    },
    y: {
      labelFormatter: (val) => `${val}%`,
    },
  },
});
```

## Complete type reference

```typescript
interface AxisRadarOptions {
  // Basic configuration
  title?: string | { text: string; style?: object };
  tickLine?: null | { length?: number; style?: object };
  line?: null | { style?: object };

  // Label configuration
  labelFormatter?: string | ((val: any) => string);
  labelSpacing?: number;
  labelStyle?: object;

  // Grid configuration
  grid?: boolean;
  gridConnect?: 'line' | 'curve';  // Grid connection type
  gridLineWidth?: number;
  gridStroke?: string;
  gridType?: 'line' | 'circle';

  // Radar-chart specific
  radar?: {
    count: number;   // Number of axes
    index: number;   // Index of the current axis
  };
}
```

## Differences from regular axes

| Feature | Regular axis | Radar chart axis |
|------|-----------|-------------|
| Coordinate system | Cartesian coordinates | Polar coordinates |
| Axis direction | Horizontal/vertical | Radial |
| Grid | Rectangular | Polygonal/circular |
| Label position | At both ends of the axis | Outside the axis endpoint |

## Common mistakes and fixes

### Mistake 1: Not using a polar coordinate system

```javascript
// ❌ Incorrect: radar chart axes require a polar coordinate system
chart.options({
  type: 'line',
  data,
  encode: { x: 'item', y: 'score' },
  axis: { y: { gridConnect: 'line' } },
});

// ✅ Correct: add a polar coordinate system
chart.options({
  type: 'line',
  coordinate: { type: 'polar' },
  data,
  encode: { x: 'item', y: 'score' },
  axis: { y: { gridConnect: 'line' } },
});
```

### Mistake 2: Invalid gridConnect parameter

```javascript
// ❌ Incorrect: gridConnect only supports 'line' or 'curve'
axis: { y: { gridConnect: 'polygon' } }

// ✅ Correct
axis: { y: { gridConnect: 'line' } }
```

---

## Radar chart stroke is not displayed

Radar charts are implemented with `coordinate: { type: 'polar' }` plus a combination of `area` and `line` marks. In polar coordinates, the stroke of the `line` mark depends on color scale inference. If `lineWidth` is not set explicitly, the stroke may be invisible in some themes or scenarios.

```javascript
// ❌ Incorrect: the line mark does not set lineWidth, so the stroke may be invisible in some themes
chart.options({
  type: 'view',
  data,
  coordinate: { type: 'polar' },
  children: [
    { type: 'area', encode: { x: 'item', y: 'score', color: 'type' }, style: { fillOpacity: 0.2 } },
    { type: 'line', encode: { x: 'item', y: 'score', color: 'type' } },  // ❌ Missing lineWidth
  ],
});

// ✅ Correct: set lineWidth explicitly
chart.options({
  type: 'view',
  data,
  coordinate: { type: 'polar' },
  children: [
    { type: 'area', encode: { x: 'item', y: 'score', color: 'type' }, style: { fillOpacity: 0.2 } },
    { type: 'line', encode: { x: 'item', y: 'score', color: 'type' }, style: { lineWidth: 2 } },
  ],
});
```

## Radar chart theme defaults

Default values for radar chart axes (`axisRadar`) in G2 themes:

| Property | Default | Description |
|------|--------|------|
| `gridStrokeOpacity` | `0.3` | Grid line opacity |
| `gridType` | `'surround'` | Surrounding grid |
| `tick` | `false` | Do not show tick lines |
| `titlePosition` | `'start'` | Title at the axis start position |
| `gridClosed` | `true` | Closed grid |

> **Dark background adaptation**: If radar chart axis labels are invisible on a dark background, solve it with one line: `theme: 'classicDark'`, or manually set `labelFill`/`gridStroke` for each axis. See [dark theme adaptation](../concepts/g2-concept-dark-theme-adaptation.md).
