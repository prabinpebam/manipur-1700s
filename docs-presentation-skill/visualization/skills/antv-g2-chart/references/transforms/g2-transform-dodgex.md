---
id: "g2-transform-dodgex"
title: "G2 DodgeX Grouping Transform"
description: |
  DodgeX is the Transform used for grouped display in G2 v5.
  It offsets multi-series elements at the same x position horizontally,
  and is the core dependency for grouped bar charts.

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "dodgeX"
  - "grouped"
  - "side-by-side"
  - "transform"
  - "grouped bar chart"
  - "spec"

related:
  - "g2-mark-interval-grouped"
  - "g2-transform-stacky"

use_cases:
  - "Create grouped bar charts (display multiple series side by side)"
  - "Create grouped scatter plots"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform/dodge-x"
---

## Basic Usage

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'dodgeX' }],
});

chart.render();
```

## Options

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [
    {
      type: 'dodgeX',
      padding: 0,          // Spacing between bars within a group (relative to each group width, 0-1); default is 0
      paddingOuter: 0.1,   // Outer margin between the whole group and adjacent groups
      reverse: false,      // Whether to reverse the group order
    },
  ],
});
```

## Difference from stackY

```javascript
// dodgeX: displays each series side by side, making absolute values easy to compare directly
chart.options({ transform: [{ type: 'dodgeX' }] });

// stackY: stacks each series, making totals and proportions easy to compare
chart.options({ transform: [{ type: 'stackY' }] });
```

## Grouped + Stacked Combination

Group and stack simultaneously: apply dodgeX first, then stackY, to create "stacked within groups and side-by-side across groups."

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'quarter', y: 'value', color: 'type', series: 'group' },
  transform: [
    { type: 'dodgeX', groupBy: 'x' },   // Group by series and specify groupBy: 'x' to prevent color from participating in grouping
    { type: 'stackY' },                 // Stack by color within each group
  ],
});
```

## Horizontal Grouped Bar Chart

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'type' },
  transform: [{ type: 'dodgeX' }],
  coordinate: { transform: [{ type: 'transpose' }] },
});
```

## Common Mistakes and Fixes

### Mistake 1: Writing transform as an object
```javascript
// ❌ chart.options({ transform: { type: 'dodgeX' } });
// ✅ chart.options({ transform: [{ type: 'dodgeX' }] });
```

### Mistake 2: Multi-series interval data has no grouping or stacking transform
```javascript
// ❌ Mistake: multi-series data has no transform, so bars overlap at the same position
chart.options({
  type: 'interval',
  data: multiSeriesData,
  encode: { x: 'month', y: 'value', color: 'type' },
});

// ✅ Correct: add dodgeX to display groups side by side
chart.options({
  type: 'interval',
  data: multiSeriesData,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'dodgeX' }],
});
```

### Mistake 3: Putting dodgeX in data.transform
```javascript
// ❌ Mistake: dodgeX is a Mark Transform, not a Data Transform
chart.options({
  data: { type: 'inline', value: data, transform: [{ type: 'dodgeX' }] },
});

// ✅ Correct: place it at the same level as data/encode
chart.options({
  data,
  encode: { x: 'x', y: 'y', color: 'type' },
  transform: [{ type: 'dodgeX' }],
});
```