---
id: "g2-interaction-brushx-filter"
title: "G2 BrushXFilter Interaction"
description: |
  Brush-selection filtering interaction along the X-axis. Users can drag to select an X-axis range,
  and the chart filters the data to show only values within that range.

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "brush selection"
  - "filtering"
  - "brush"
  - "X-axis"
  - "data filtering"

related:
  - "g2-interaction-brush-filter"
  - "g2-interaction-brushy-filter"
  - "g2-interaction-brushx-highlight"

use_cases:
  - "Filtering by time range"
  - "Selecting an X-axis interval"
  - "Zooming in to inspect data"

anti_patterns:
  - "Use BrushYFilter when filtering along the Y-axis is required"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction"
---

## Core concept

The BrushXFilter interaction lets users drag along the X-axis to select an interval. The chart automatically filters the data and displays only the data within that interval.

**Key characteristics:**
- Selection is limited to the X-axis direction
- Data is filtered automatically after selection
- Supports resetting the selection

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
  data: [
    { date: '2024-01', value: 100 },
    { date: '2024-02', value: 120 },
    { date: '2024-03', value: 150 },
    { date: '2024-04', value: 130 },
    { date: '2024-05', value: 160 },
  ],
  encode: {
    x: 'date',
    y: 'value',
  },
  interaction: {
    brushXFilter: true,
  },
});

chart.render();
```

## Common variants

### Custom style

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  interaction: {
    brushXFilter: {
      brushStyle: {
        fill: '#1890ff',
        fillOpacity: 0.2,
        stroke: '#1890ff',
      },
    },
  },
});
```

### Set an initial selection

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  interaction: {
    brushXFilter: {
      selection: [0.2, 0.8],  // Initial selection ratio [start, end]
    },
  },
});
```

## Complete type reference

```typescript
interface BrushXFilterInteraction {
  brushXFilter: boolean | {
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

## Comparison with BrushFilter and BrushYFilter

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
  brushXFilter: true,
}
```

### Error 2: Incorrect selection parameter format

```javascript
// ❌ Incorrect: selection should use ratio values in the range [0, 1]
interaction: {
  brushXFilter: { selection: ['2024-01', '2024-03'] }
}

// ✅ Correct: use ratio values
interaction: {
  brushXFilter: { selection: [0.2, 0.6] }
}
```
