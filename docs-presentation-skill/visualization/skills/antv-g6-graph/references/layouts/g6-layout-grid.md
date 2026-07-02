---
id: "g6-layout-grid"
title: "G6 Grid Layout"
description: |
  Use the grid layout to arrange nodes regularly in a rectangular grid.
  Suitable for scenarios with many nodes and no obvious hierarchy or relationships.

library: "g6"
version: "5.x"
category: "layouts"
subcategory: "grid"
tags:
  - "layout"
  - "grid"
  - "grid"
  - "matrix"
  - "regular arrangement"

related:
  - "g6-layout-force"
  - "g6-layout-circular"

use_cases:
  - "Node list display"
  - "Node collections without obvious topological relationships"
  - "Debugging and demonstration purposes"

anti_patterns:
  - "Use force or dagre when there are obvious topological relationships"
  - "Spacing may be too large and not compact enough when there are few nodes"

difficulty: "beginner"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
author: "antv-team"
source_url: "https://g6.antv.antgroup.com/manual/layout/grid"
---

## Minimal runnable example

```javascript
import { Graph } from '@antv/g6';

const nodes = Array.from({ length: 12 }, (_, i) => ({
  id: `n${i}`,
  data: { label: `Node ${i + 1}`, value: Math.random() * 100 },
}));

const graph = new Graph({
  container: 'container',
  data: { nodes, edges: [] },
  node: {
    type: 'circle',
    style: {
      size: 40,
      fill: '#1783FF',
      labelText: (d) => d.data.label,
      labelPlacement: 'bottom',
    },
  },
  layout: {
    type: 'grid',
    rows: 3,              // Number of rows
    cols: 4,              // Number of columns (optional, automatically computed)
    rowGap: 40,           // Row gap
    colGap: 40,           // Column gap
  },
  behaviors: ['drag-canvas', 'zoom-canvas'],
});

graph.render();
```

## Parameter reference

```typescript
interface GridLayoutOptions {
  rows?: number;           // Number of rows
  cols?: number;           // Number of columns
  rowGap?: number;         // Row gap
  colGap?: number;         // Column gap
  sortBy?: string;         // Sort by a field
  preventOverlap?: boolean;
  nodeSize?: number | [number, number];
  workerEnabled?: boolean;
}
```
