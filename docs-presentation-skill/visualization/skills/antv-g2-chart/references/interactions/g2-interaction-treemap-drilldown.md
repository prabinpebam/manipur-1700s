---
id: "g2-interaction-treemap-drilldown"
title: "G2 treemapDrillDown"
description: |
  treemapDrillDown provides hierarchical drill-down interaction for treemaps.
  Click a rectangle to enter the next level, and use the breadcrumb navigation at the top to return to the parent level.
  Unlike drillDown, which is used for partition/sunburst, it is designed specifically for treemap layouts.

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "treemapDrillDown"
  - "treemap"
  - "drill-down"
  - "hierarchy"
  - "breadcrumb"
  - "interaction"

related:
  - "g2-mark-treemap"
  - "g2-interaction-drilldown"
  - "g2-mark-partition"

use_cases:
  - "Visualize multi-level directories or file sizes"
  - "Analyze sales by hierarchical product category"
  - "Drill down in an organizational-structure treemap"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/hierarchy/treemap/#treemap-drill-down"
---

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

// Multi-level tree data
const hierarchyData = {
  name: 'Total sales',
  children: [
    {
      name: 'Electronics',
      children: [
        { name: 'Phones', value: 400 },
        { name: 'Computers', value: 350 },
        { name: 'Tablets', value: 200 },
      ],
    },
    {
      name: 'Apparel',
      children: [
        { name: 'Menswear', value: 280 },
        { name: 'Womenswear', value: 320 },
      ],
    },
    {
      name: 'Food',
      children: [
        { name: 'Snacks', value: 180 },
        { name: 'Beverages', value: 150 },
      ],
    },
  ],
};

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'treemap',
  data: hierarchyData,
  encode: { value: 'value', color: 'name' },
  style: {
    labelText: (d) => d.data.name,
    labelFill: '#fff',
    stroke: '#fff',
    lineWidth: 1,
  },
  interaction: {
    treemapDrillDown: {
      // Breadcrumb navigation style
      breadCrumbFill: 'rgba(0,0,0,0.85)',
      breadCrumbFontSize: 12,
      activeFill: 'rgba(0,0,0,0.5)',
    },
  },
});

chart.render();
```

## treemapDrillDown vs drillDown comparison

```javascript
// treemapDrillDown: designed specifically for treemap layouts
chart.options({
  type: 'treemap',
  interaction: { treemapDrillDown: true },
});

// drillDown: used for partition (sunburst/icicle charts)
chart.options({
  type: 'partition',
  interaction: { drillDown: true },
  coordinate: { type: 'polar' },   // Sunburst charts use polar coordinates
});
```

## Common mistakes and fixes

### Mistake: using treemapDrillDown on a non-treemap mark
```javascript
// ❌ treemapDrillDown only applies to treemap marks
chart.options({
  type: 'partition',   // ❌ Use drillDown, not treemapDrillDown
  interaction: { treemapDrillDown: true },
});

// ✅ Use drillDown for partition
chart.options({
  type: 'partition',
  interaction: { drillDown: true },   // ✅
});

// ✅ Use treemapDrillDown for treemap
chart.options({
  type: 'treemap',
  interaction: { treemapDrillDown: true },  // ✅
});
```

### Mistake: data is not a nested hierarchy
```javascript
// ❌ Flat data cannot be drilled down
chart.options({
  type: 'treemap',
  data: [{ name: 'a', value: 10 }, { name: 'b', value: 20 }],  // ❌ No hierarchy
  interaction: { treemapDrillDown: true },
});

// ✅ A nested children structure is required
chart.options({
  type: 'treemap',
   { name: 'root', children: [...] },  // ✅ Nested hierarchy
  interaction: { treemapDrillDown: true },
});
```
