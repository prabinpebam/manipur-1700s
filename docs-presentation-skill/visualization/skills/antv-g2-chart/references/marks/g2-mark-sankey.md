---
id: "g2-mark-sankey"
title: "G2 Sankey Diagram (sankey)"
description: |
  G2 v5 has a built-in sankey mark for visualizing multi-stage flows or energy allocation.
  The data is a link array containing source, target, and value fields,
  and each node's width is automatically determined by its incoming and outgoing flow.

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "Sankey diagram"
  - "sankey"
  - "flow chart"
  - "energy flow"
  - "conversion funnel"
  - "spec"

related:
  - "g2-mark-funnel"
  - "g2-recipe-funnel"
  - "g2-core-chart-init"

use_cases:
  - "Show energy sources, flows, and allocation"
  - "Analyze user conversion paths across multiple stages"
  - "Visualize budget or funds flow"
  - "Map supply-chain flows"

difficulty: "intermediate"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/graph/network/#sankey"
---

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 800,
  height: 500,
});

// Link array: each record represents one flow.
const links = [
  { source: 'Visit', target: 'Register', value: 8000 },
  { source: 'Visit', target: 'Leave directly', value: 2000 },
  { source: 'Register', target: 'Activate', value: 5000 },
  { source: 'Register', target: 'Churn', value: 3000 },
  { source: 'Activate', target: 'Paid', value: 2000 },
  { source: 'Activate', target: 'Free use', value: 3000 },
];

chart.options({
  type: 'sankey',
  data: {
  value: {
  links, // Link array (required)
  // nodes is optional. If omitted, nodes are inferred from the links.
  },
  },
  layout: {
  nodeAlign: 'justify', // Node alignment: 'left' | 'right' | 'center' | 'justify'
  nodePadding: 0.03, // Vertical spacing between nodes (0-1)
  },
  style: {
  labelSpacing: 3,
  nodeLineWidth: 1,
  linkFillOpacity: 0.4,
  },
  legend: false,
});

chart.render();
```

## Sankey diagram with color differentiation

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 900,
  height: 600,
});

const links = [
  { source: 'Coal', target: 'Electricity', value: 150 },
  { source: 'Oil', target: 'Transportation', value: 120 },
  { source: 'Natural Gas', target: 'Heating', value: 80 },
  { source: 'Electricity', target: 'Industry', value: 90 },
  { source: 'Electricity', target: 'Residential', value: 60 },
  { source: 'Transportation', target: 'Road', value: 80 },
  { source: 'Transportation', target: 'Aviation', value: 40 },
];

chart.options({
  type: 'sankey',
  data: {
  value: { links },
  },
  layout: {
  nodeAlign: 'center',
  nodePadding: 0.03,
  nodeWidth: 0.02, // Node width relative to the canvas
  },
  scale: {
  color: {
  type: 'ordinal',
  // Assign colors by source node.
  },
  },
  style: {
  labelSpacing: 4,
  labelFontWeight: 'bold',
  labelFontSize: 12,
  nodeLineWidth: 1.2,
  linkFillOpacity: 0.35,
  },
  legend: false,
});

chart.render();
```

## Complete configuration options

```javascript
chart.options({
  type: 'sankey',
  data: {
  value: {
  links: [
  { source: 'A', target: 'B', value: 10 }, // source and target are node names.
  ],
  nodes: [ // Optional; inferred automatically when omitted.
  { key: 'A' },
  { key: 'B' },
  ],
  },
  },

  layout: {
  nodeId: (d) => d.key, // Read the node ID; defaults to d.key.
  nodeAlign: 'justify', // 'left' | 'right' | 'center' | 'justify'
  nodeWidth: 0.02, // Node width relative to canvas width, from 0 to 1
  nodePadding: 0.02, // Vertical spacing between nodes
  nodeSort: null, // Node sort function
  linkSort: null, // Link sort function
  iterations: 6, // Number of layout iterations
  },

  style: {
  labelSpacing: 3, // Spacing between labels and nodes
  labelFontSize: 12,
  labelFontWeight: 'normal',
  nodeLineWidth: 1, // Node border width
  nodeStroke: '#fff', // Node border color
  linkFillOpacity: 0.4, // Link opacity
  },
});
```

## Common errors and fixes

### Error 1: incorrect data format; passing the links array directly

```javascript
// ❌ Error: sankey data must be wrapped as { value: { links } }.
chart.options({
  type: 'sankey',
  data: links, // ❌ Do not pass the array directly.
});

// ✅ Correct
chart.options({
  type: 'sankey',
  data: {
  value: { links }, // ✅ Required shape: { value: { links } }
  },
});
```

### Error 2: inconsistent source/target node names cause broken links

```javascript
// ❌ Error: 'Electricity' and 'Power Company' are two different nodes.
const links = [
  { source: 'Coal', target: 'Electricity', value: 100 },
  { source: 'Power Company', target: 'Industry', value: 80 }, // ❌ Inconsistent name
];

// ✅ Correct: use exactly the same node name for matching source and target values.
const links = [
  { source: 'Coal', target: 'Electricity', value: 100 },
  { source: 'Electricity', target: 'Industry', value: 80 }, // ✅ Consistent name
];
```

### Error 3: the chart contains a cycle (circular reference)

```javascript
// ❌ Sankey diagrams do not support cyclic flows.
const links = [
  { source: 'A', target: 'B', value: 10 },
  { source: 'B', target: 'A', value: 5 }, // ❌ Creates a cycle; layout may be abnormal.
];

// ✅ Sankey diagrams are intended for directed, acyclic flow data.
```
