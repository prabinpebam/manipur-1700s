---
id: "g2-interaction-brushx-highlight"
title: "G2 BrushXHighlight Interaction"
description: |
  Brush-selection highlighting interaction along the X-axis. Users can drag to select an X-axis range,
  and data elements within that range are highlighted.

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "brush selection"
  - "highlighting"
  - "brush"
  - "X-axis"
  - "data exploration"

related:
  - "g2-interaction-brush"
  - "g2-interaction-brushy-highlight"
  - "g2-interaction-brushx-filter"

use_cases:
  - "Highlighting a time range"
  - "Highlighting a selected X-axis interval"
  - "Comparative data analysis"

anti_patterns:
  - "Use BrushXFilter when data needs to be filtered"
  - "Use BrushYHighlight when selection along the Y-axis is required"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction"
---

## Core concept

The BrushXHighlight interaction lets users drag along the X-axis to select an interval. Data elements inside the selection are highlighted, while the other elements are dimmed.

**Key characteristics:**
- Selection is limited to the X-axis direction
- Highlights data instead of filtering it
- Suitable for data exploration and comparative analysis

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'interval',
  data: [
    { category: 'A', value: 100 },
    { category: 'B', value: 150 },
    { category: 'C', value: 80 },
    { category: 'D', value: 200 },
    { category: 'E', value: 120 },
  ],
  encode: {
    x: 'category',
    y: 'value',
  },
  interaction: {
    brushXHighlight: true,
  },
});

chart.render();
```

## Common variants

### Custom brush style

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value' },
  interaction: {
    brushXHighlight: {
      brushStyle: {
        fill: '#1890ff',
        fillOpacity: 0.3,
      },
    },
  },
});
```

### Custom highlight state

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value' },
  interaction: {
    brushXHighlight: {
      selectedHandles: ['handle-e', 'handle-w'],  // Drag handles to display
    },
  },
  state: {
    active: {
      fill: '#1890ff',
      stroke: '#0050b3',
      lineWidth: 2,
    },
    inactive: {
      fillOpacity: 0.3,
    },
  },
});
```

## Complete type reference

```typescript
interface BrushXHighlightInteraction {
  brushXHighlight: boolean | {
    brushStyle?: {
      fill?: string;
      fillOpacity?: number;
      stroke?: string;
    };
    selectedHandles?: string[];  // ['handle-e', 'handle-w']
    // Other options are inherited from BrushHighlight
  };
}
```

## Comparison with BrushHighlight and BrushYHighlight

| Interaction | Selection direction | Common use case |
|-------------|---------|---------|
| brushHighlight | Any direction | General highlighting |
| brushXHighlight | X direction only | Highlighting category or time ranges |
| brushYHighlight | Y direction only | Highlighting numeric ranges |

## Difference from BrushXFilter

| Feature | BrushXHighlight | BrushXFilter |
|------|-----------------|--------------|
| Data handling | Highlight display | Filter and hide |
| Data outside the selection | Dimmed but visible | Completely hidden |
| Applicable scenarios | Data exploration and comparison | Data filtering and zooming |

## Common errors and fixes

### Error 1: Confusing it with Filter interactions

```javascript
// ❌ Incorrect: highlight is used even though the goal is to filter data
interaction: { brushXHighlight: true }

// ✅ Correct: choose based on the requirement
// Need highlighting: brushXHighlight
// Need filtering: brushXFilter
```

### Error 2: State styles are not configured

```javascript
// ⚠️ Note: the default highlight effect may not be obvious
// Configure state for a better visual effect
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value' },
  interaction: { brushXHighlight: true },
  state: {
    active: { fill: '#1890ff' },
    inactive: { fillOpacity: 0.2 },
  },
});
```
