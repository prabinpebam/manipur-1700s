---
id: "g2-interaction-brushy-filter"
title: "G2 BrushYFilter Interaction"
description: |
  Brush-selection filtering interaction along the Y-axis. Users can drag to select a Y-axis range,
  and the chart filters the data to show only values within that range.

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "brush selection"
  - "filtering"
  - "brush"
  - "Y-axis"
  - "data filtering"

related:
  - "g2-interaction-brush-filter"
  - "g2-interaction-brushx-filter"
  - "g2-interaction-brushy-highlight"

use_cases:
  - "Filtering by numeric range"
  - "Selecting a Y-axis interval"
  - "Filtering outliers"

anti_patterns:
  - "Use BrushXFilter when filtering along the X-axis is required"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction"
---

## Core concept

The BrushYFilter interaction lets users drag along the Y-axis to select an interval. The chart automatically filters the data and displays only the data within that interval.

**Key characteristics:**
- Selection is limited to the Y-axis direction
- Data is filtered automatically after selection
- Suitable for filtering numeric ranges

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'point',
  data: [
    { x: 10, y: 100 },
    { x: 20, y: 150 },
    { x: 30, y: 80 },
    { x: 40, y: 200 },
    { x: 50, y: 120 },
  ],
  encode: {
    x: 'x',
    y: 'y',
  },
  interaction: {
    brushYFilter: true,
  },
});

chart.render();
```

## Common variants

### Custom style

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y' },
  interaction: {
    brushYFilter: {
      brushStyle: {
        fill: '#52c41a',
        fillOpacity: 0.2,
        stroke: '#52c41a',
      },
    },
  },
});
```

### Set an initial selection

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y' },
  interaction: {
    brushYFilter: {
      selection: [0.3, 0.7],  // Initial selection ratio [start, end]
    },
  },
});
```

## Complete type reference

```typescript
interface BrushYFilterInteraction {
  brushYFilter: boolean | {
    brushStyle?: {
      fill?: string;
      fillOpacity?: number;
      stroke?: string;
      lineWidth?: number;
    };
    selection?: [number, number];  // [startRatio, endRatio]
    // Other options are inherited from BrushFilter
  };
}
```

## Comparison with BrushFilter and BrushXFilter

| Interaction | Selection direction | Common use case |
|-------------|---------|---------|
| brushFilter | Any direction | General filtering |
| brushXFilter | X direction only | Filtering by time range |
| brushYFilter | Y direction only | Filtering by numeric range |

## Common errors and fixes

### Error 1: Conflicting with other brush interactions

```javascript
// ❌ Incorrect: enabling multiple brush interactions at the same time can cause conflicts
interaction: {
  brushXFilter: true,
  brushYFilter: true,
}

// ✅ Correct: choose one based on your requirement
interaction: {
  brushYFilter: true,
}
```

### Error 2: Incorrect selection parameter format

```javascript
// ❌ Incorrect: selection should use ratio values in the range [0, 1]
interaction: {
  brushYFilter: { selection: [100, 200] }
}

// ✅ Correct: use ratio values
interaction: {
  brushYFilter: { selection: [0.2, 0.6] }
}
```
