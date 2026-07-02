---
id: "g2-interaction-drilldown"
title: "G2 Drill-down Interaction (drillDown)"
description: |
  The drillDown interaction supports click-to-drill behavior for hierarchical data (partition / sunburst charts).
  After a node is clicked, only that node's subtree is displayed, and breadcrumb navigation is shown at the top.
  Users can click breadcrumbs to navigate back up level by level. This interaction applies only to partition marks.

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "drillDown"
  - "drill-down"
  - "hierarchical data"
  - "sunburst chart"
  - "partition"
  - "breadcrumb"
  - "interaction"

related:
  - "g2-mark-treemap"
  - "g2-interaction-element-select"

use_cases:
  - "Explore hierarchical data in sunburst or partition charts with drill-down"
  - "Inspect an organization chart level by level"
  - "Browse a file directory tree interactively"

difficulty: "advanced"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/drill-down"
---

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const data = {
  name: 'Company',
  children: [
    {
      name: 'Engineering Department',
      children: [
        { name: 'Frontend Team', value: 12 },
        { name: 'Backend Team', value: 18 },
        { name: 'Algorithms Team', value: 8 },
      ],
    },
    {
      name: 'Marketing Department',
      children: [
        { name: 'Brand Team', value: 6 },
        { name: 'Operations Team', value: 10 },
      ],
    },
    {
      name: 'Design Department',
      children: [
        { name: 'UX Team', value: 7 },
        { name: 'Visual Design Team', value: 5 },
      ],
    },
  ],
};

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'sunburst',   // Sunburst chart, the polar-coordinate form of partition
  data: { value: data },
  encode: { value: 'value', color: 'name' },
  interaction: {
    drillDown: true,   // Enable the drill-down interaction
  },
});

chart.render();
```

## Customize breadcrumb style

```javascript
chart.options({
  type: 'sunburst',
  data: { value: data },
  encode: { value: 'value', color: 'name' },
  interaction: {
    drillDown: {
      breadCrumb: {
        rootText: 'Entire Company',  // Breadcrumb text for the root node; default is 'root'
        style: {
          fill: 'rgba(0,0,0,0.65)',
          fontSize: 13,
        },
        active: {
          fill: '#1890ff',          // Breadcrumb text color on hover
        },
        y: 8,                       // Breadcrumb Y-axis offset
      },
    },
  },
});
```

## Common errors and fixes

### Error 1: Using drillDown with treemap instead of partition or sunburst
```javascript
// ❌ Incorrect: drillDown applies only to partition types, including sunburst charts
// treemap has a dedicated treemapDrillDown interaction
chart.options({
  type: 'treemap',
  interaction: { drillDown: true },  // ❌ Use treemapDrillDown instead
});

// ✅ Use treemapDrillDown for treemap
chart.options({
  type: 'treemap',
  interaction: { treemapDrillDown: true },  // ✅
});

// ✅ Use drillDown for sunburst or partition
chart.options({
  type: 'sunburst',
  interaction: { drillDown: true },  // ✅
});
```

### Error 2: The data is not hierarchical, so drill-down cannot display child nodes
```javascript
// ❌ Flat data has no children, so there is no content after drilling down
chart.options({
  data: [{ name: 'A', value: 10 }, { name: 'B', value: 20 }],  // ❌ Flat
  interaction: { drillDown: true },
});

// ✅ Hierarchical data with children is required
chart.options({
  data: {
    value: { name: 'root', children: [...] },  // ✅ Tree structure
  },
  interaction: { drillDown: true },
});
```
