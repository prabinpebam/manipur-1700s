---
id: "g2-interaction-brushy-highlight"
title: "G2 BrushYHighlight Interaction"
description: |
  Brush-selection highlighting interaction along the Y-axis. Users can drag to select a Y-axis range,
  and data elements within that range are highlighted.

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "brush selection"
  - "highlighting"
  - "brush"
  - "Y-axis"
  - "data exploration"

related:
  - "g2-interaction-brush"
  - "g2-interaction-brushx-highlight"
  - "g2-interaction-brushy-filter"

use_cases:
  - "Highlighting a numeric range"
  - "Highlighting a selected Y-axis interval"
  - "Identifying outliers"

anti_patterns:
  - "Use BrushYFilter when data needs to be filtered"
  - "Use BrushXHighlight when selection along the X-axis is required"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction"
---

## Core concept

The BrushYHighlight interaction lets users drag along the Y-axis to select an interval. Data elements inside the selection are highlighted, while the other elements are dimmed.

**Key characteristics:**
- Selection is limited to the Y-axis direction
- Highlights data instead of filtering it
- Suitable for exploring numeric ranges

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
    brushYHighlight: true,
  },
});

chart.render();
```

## Common variants

### Custom brush style

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y' },
  interaction: {
    brushYHighlight: {
      brushStyle: {
        fill: '#52c41a',
        fillOpacity: 0.3,
      },
    },
  },
});
```

### Custom highlight state

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y' },
  interaction: {
    brushYHighlight: {
      selectedHandles: ['handle-n', 'handle-s'],  // Drag handles to display
    },
  },
  state: {
    active: {
      fill: '#52c41a',
      r: 8,
    },
    inactive: {
      fillOpacity: 0.3,
    },
  },
});
```

## Complete type reference

```typescript
interface BrushYHighlightInteraction {
  brushYHighlight: boolean | {
    brushStyle?: {
      fill?: string;
      fillOpacity?: number;
      stroke?: string;
    };
    selectedHandles?: string[];  // ['handle-n', 'handle-s']
    // Other options are inherited from BrushHighlight
  };
}
```

## Comparison with BrushHighlight and BrushXHighlight

| Interaction | Selection direction | Common use case |
|-------------|---------|---------|
| brushHighlight | Any direction | General highlighting |
| brushXHighlight | X direction only | Highlighting category or time ranges |
| brushYHighlight | Y direction only | Highlighting numeric ranges |

## Difference from BrushYFilter

| Feature | BrushYHighlight | BrushYFilter |
|------|-----------------|--------------|
| Data handling | Highlight display | Filter and hide |
| Data outside the selection | Dimmed but visible | Completely hidden |
| Applicable scenarios | Data exploration and comparison | Data filtering and zooming |

## Common errors and fixes

### Error 1: Confusing it with Filter interactions

```javascript
// ❌ Incorrect: highlight is used even though the goal is to filter data
interaction: { brushYHighlight: true }

// ✅ Correct: choose based on the requirement
// Need highlighting: brushYHighlight
// Need filtering: brushYFilter
```

### Error 2: State styles are not configured

```javascript
// ⚠️ Note: the default highlight effect may not be obvious
// Configure state for a better visual effect
chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y' },
  interaction: { brushYHighlight: true },
  state: {
    active: { fill: '#52c41a', r: 8 },
    inactive: { fillOpacity: 0.2 },
  },
});
```
