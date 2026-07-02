---
id: "g2-comp-space-flex"
title: "G2 Flexible Layout (spaceFlex)"
description: |
  spaceFlex arranges multiple subplots by flexible ratios in either the row or column direction.
  Similar to CSS flexbox, each subplot size is allocated proportionally by the ratio array.
  It is suitable for side-by-side layouts with unequal chart widths and is more flexible than repeatMatrix.

library: "g2"
version: "5.x"
category: "compositions"
tags:
  - "spaceFlex"
  - "flexible layout"
  - "multiple charts"
  - "flex"
  - "side by side"
  - "composition"

related:
  - "g2-comp-space-layer"
  - "g2-comp-facet-rect"
  - "g2-comp-repeat-matrix"

use_cases:
  - "Create a two-chart layout with a wider left chart and a narrower right chart, such as a 2:1 ratio"
  - "Create equal layouts for multiple charts, such as three equal-width charts"
  - "Display multiple charts side by side with unequal widths"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/composition/space-flex"
---

## Minimal Runnable Example (Left-Right 2:1 Layout)

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 900, height: 400 });

chart.options({
  type: 'spaceFlex',
  width: 900,
  height: 400,
  direction: 'row',      // 'row' for horizontal layout, or 'col' for vertical layout.
  ratio: [2, 1],         // Left chart uses 2/3 of the width; right chart uses 1/3.
  padding: 20,           // Spacing between subplots.
  children: [
    // Left chart: line chart using 2/3 of the width.
    {
      type: 'line',
      data: salesData,
      encode: { x: 'month', y: 'value', color: 'city' },
      title: 'Monthly Sales Trend',
    },
    // Right chart: pie chart using 1/3 of the width.
    {
      type: 'interval',
      data: categoryData,
      encode: { y: 'value', color: 'type' },
      transform: [{ type: 'stackY' }],
      coordinate: { type: 'theta', outerRadius: 0.85 },
      title: 'Category Share',
    },
  ],
});

chart.render();
```

## Vertical Layout (Large Top, Small Bottom)

```javascript
chart.options({
  type: 'spaceFlex',
  width: 640,
  height: 700,
  direction: 'col',      // Vertical layout.
  ratio: [3, 1],         // Top chart uses 3/4 of the height; bottom chart uses 1/4.
  children: [
    {
      type: 'line',
      data: timeData,
      encode: { x: 'date', y: 'value', color: 'type' },
    },
    // Overview axis chart, shown as the smaller bottom chart.
    {
      type: 'line',
      data: timeData,
      encode: { x: 'date', y: 'value', color: 'type' },
      style: { lineWidth: 1 },
      axis: { y: false },
    },
  ],
});
```

## Three Equal-Width Charts Side by Side

```javascript
chart.options({
  type: 'spaceFlex',
  direction: 'row',
  ratio: [1, 1, 1],   // Three equal-width charts.
  children: [chart1Config, chart2Config, chart3Config],
});
```

## Common Errors and Fixes

### Error: The ratio array length does not match the children array length
```javascript
// Error: There are three subplots, but ratio has only two values.
chart.options({
  type: 'spaceFlex',
  ratio: [2, 1],          // Only two ratio values.
  children: [c1, c2, c3], // Three subplots.
});

// Correct: The ratio array length must equal the children array length.
chart.options({
  ratio: [2, 1, 1],   // Three ratio values for three subplots.
  children: [c1, c2, c3],
});
```

### Error: Setting width and height on subplots even though spaceFlex calculates them automatically
```javascript
// Setting width or height separately on a subplot can override the automatic spaceFlex layout.
children: [
  { type: 'line', width: 400, height: 300, ... },  // Avoid setting these separately.
]

// Correct: Configure only the subplot content. The parent spaceFlex allocates width and height by ratio.
children: [
  { type: 'line', data: ..., encode: { ... } },  // Do not set width or height.
]
```
