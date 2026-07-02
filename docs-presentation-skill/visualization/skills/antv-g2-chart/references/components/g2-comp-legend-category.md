---
id: "g2-comp-legend-category"
title: "G2 Category Legend (LegendCategory)"
description: |
  A category legend component used to display legend items for discrete categories.
  It is the most common legend type and is suitable for visualizing categorical data.

library: "g2"
version: "5.x"
category: "components"
tags:
  - "legend"
  - "legend"
  - "category"
  - "category"

related:
  - "g2-comp-legend-config"
  - "g2-scale-ordinal"
  - "g2-interaction-legend-filter"

use_cases:
  - "category legends for bar charts"
  - "series legends for line charts"
  - "group legends for scatter plots"

anti_patterns:
  - "Use a continuous legend (LegendContinuous) for continuous data"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/component/legend"
---

## Core Concepts

LegendCategory is a category legend component:
- Displays legend items for discrete categories
- Each item contains an icon and a label
- Supports interactions (click-to-filter and hover highlighting)

**Features:**
- Automatically inferred from color/shape channels
- Supports horizontal and vertical layouts
- Supports custom icons

## Minimal Runnable Example

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
    { category: 'A', type: 'X', value: 100 },
    { category: 'A', type: 'Y', value: 150 },
    { category: 'B', type: 'X', value: 120 },
    { category: 'B', type: 'Y', value: 180 },
  ],
  encode: {
    x: 'category',
    y: 'value',
    color: 'type',
  },
  legend: {
    color: {
      position: 'top',
      layout: {
        justifyContent: 'center',
      },
    },
  },
});

chart.render();
```

## Common Variants

### Vertical Layout

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'type' },
  legend: {
    color: {
      position: 'right',
      layout: {
        flexDirection: 'column',
      },
    },
  },
});
```

### Custom Label Format

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'type' },
  legend: {
    color: {
      labelFormatter: (val) => `Type: ${val}`,
    },
  },
});
```

### Adding a Title

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'type' },
  legend: {
    color: {
      title: 'Type',
      position: 'top',
    },
  },
});
```

### Custom Icons

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'type' },
  legend: {
    color: {
      itemMarker: 'square',  // 'circle' | 'square' | 'line' | ...
      itemMarkerSize: 12,
    },
  },
});
```

### Grid Layout

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'type' },
  legend: {
    color: {
      cols: 3,  // Show 3 items per row
      layout: { justifyContent: 'center' },
    },
  },
});
```

### Disabling Interaction

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'type' },
  legend: {
    color: {
      itemMarker: 'circle',
    },
  },
  interaction: {
    legendFilter: false,  // Disable click-to-filter
  },
});
```

## Complete Type Reference

```typescript
interface LegendCategoryOptions {
  // Position and layout
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  layout?: {
    flexDirection?: 'row' | 'column';
    justifyContent?: 'flex-start' | 'center' | 'flex-end';
    flexWrap?: 'wrap' | 'nowrap';
  };
  cols?: number;  // Number of columns in the grid layout

  // Title
  title?: string | string[];

  // Icons
  itemMarker?: string | ((id: any, index: number) => string);
  itemMarkerSize?: number;
  itemMarkerLineWidth?: number;
  itemSpacing?: number;

  // Labels
  labelFormatter?: string | ((val: any) => string);
  maxItemWidth?: number;

  // Style
  style?: {
    fill?: string;
    fontSize?: number;
    // More styles...
  };

  // Other
  dx?: number;
  dy?: number;
}
```

## Differences from Continuous Legends

| Feature | Category Legend | Continuous Legend |
|------|---------|---------|
| Data type | Discrete categories | Continuous numeric values |
| Display | Icon + label list | Ribbon + ticks |
| Interaction | Click-to-filter | No filtering |
| Suitable scenarios | Categorical data | Numeric mapping |

## Common Errors and Fixes

### Error 1: Invalid position Parameter

```javascript
// ❌ Error: position should be a predefined value
legend: { color: { position: 'top-left' } }

// ✅ Correct
legend: { color: { position: 'top' } }
```

### Error 2: color Channel Is Not Mapped

```javascript
// ❌ Error: without a color channel, the legend will not be displayed
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value' },
  legend: { color: { position: 'top' } },
});

// ✅ Correct: add a color channel
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'type' },
  legend: { color: { position: 'top' } },
});
```

### Error 3: Invalid itemMarker Type

```javascript
// ❌ Error: itemMarker should be a predefined shape name or a function
legend: { color: { itemMarker: 'triangle-up' } }

// ✅ Correct: use a supported shape
legend: { color: { itemMarker: 'triangle' } }
// Or
legend: { color: { itemMarker: (id, i) => i === 0 ? 'circle' : 'square' } }
```