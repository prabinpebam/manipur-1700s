---
id: "g6-layout-circular"
title: "G6 Circular Layout"
description: |
  Use the circular layout to arrange nodes evenly on a circle.
  Suitable for showing cyclic relationships, comparison relationships, and peer networks.

library: "g6"
version: "5.x"
category: "layouts"
subcategory: "circular"
tags:
  - "layout"
  - "circular"
  - "circular"
  - "circle"
  - "ring"

related:
  - "g6-layout-force"
  - "g6-layout-dagre"
  - "g6-node-circle"

use_cases:
  - "Cyclic dependency graphs"
  - "Peer network topology"
  - "Ring-shaped organizational structures"
  - "Relationship graphs with a small number of nodes"

anti_patterns:
  - "When there are too many nodes, the circumference becomes too long and affects readability"
  - "Use dagre instead when hierarchy must be displayed"

difficulty: "beginner"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
author: "antv-team"
source_url: "https://g6.antv.antgroup.com/manual/layout/circular"
---

## Minimal runnable example

```javascript
import { Graph } from '@antv/g6';

const nodes = Array.from({ length: 8 }, (_, i) => ({
  id: `n${i}`,
  data: { label: `Node ${i + 1}` },
}));

const edges = nodes.map((n, i) => ({
  source: n.id,
  target: nodes[(i + 1) % nodes.length].id,
}));

const graph = new Graph({
  container: 'container',
  width: 600,
  height: 600,
  data: { nodes, edges },
  node: {
    type: 'circle',
    style: {
      size: 36,
      fill: '#1783FF',
      labelText: (d) => d.data.label,
      labelPlacement: 'bottom',
    },
  },
  edge: {
    type: 'line',
    style: { stroke: '#aaa', endArrow: true },
  },
  layout: {
    type: 'circular',
    radius: 200,          // Circle radius (px)
  },
  behaviors: ['drag-canvas', 'zoom-canvas'],
});

graph.render();
```

## Common variants

### Clockwise/counterclockwise arrangement

```javascript
layout: {
  type: 'circular',
  radius: 200,
  startAngle: 0,          // Start angle (radians)
  endAngle: Math.PI * 2,  // End angle
  clockwise: true,        // Clockwise (false = counterclockwise)
},
```

### Sort nodes by attribute

```javascript
layout: {
  type: 'circular',
  radius: 200,
  // Sort by a field in node data
  ordering: 'degree',     // Sort by degree; options: 'topology' | 'degree' | null
},
```

### Use existing data (recommended)

When data is already provided, use the original data directly instead of dynamically generating random edges:

```javascript
import { Graph } from '@antv/g6';

const data = {
  nodes: [
    { id: '0' }, { id: '1' }, { id: '2' }, { id: '3' },
  ],
  edges: [
    { source: '0', target: '1' },
    { source: '0', target: '2' },
    { source: '1', target: '3' },
  ],
};

const graph = new Graph({
  container: 'container',
  autoFit: 'view',
  data,
  node: {
    style: {
      labelText: (d) => d.id,
      labelFill: '#fff',
      labelPlacement: 'center',
    },
  },
  layout: {
    type: 'circular',
  },
  behaviors: ['drag-canvas', 'drag-element'],
});

graph.render();
```

## Parameter reference

```typescript
interface CircularLayoutOptions {
  radius?: number;           // Circle radius, computed from canvas size by default
  startAngle?: number;       // Start angle (radians), default 0
  endAngle?: number;         // End angle (radians), default 2pi
  clockwise?: boolean;       // Clockwise, default true
  divisions?: number;        // Number of segments to divide the circle into
  ordering?: 'topology' | 'degree' | null;  // Sorting method, default null
  angleRatio?: number;       // Angle ratio between nodes, default 1
  workerEnabled?: boolean;
}
```

## Edge ID rules and duplicate edge issues

Important: G6 edge ID rules are as follows:
- If edge data **explicitly specifies an `id`**, that `id` is used.
- If edge data **does not specify an `id`**, G6 automatically uses `"${source}-${target}"` as the edge ID.

Therefore, **there cannot be multiple edges without ids between the same source-target pair**, otherwise an error is thrown:
```
Edge already exists: 12-20
```

**Solutions:**
1. **Deduplicate:** Ensure the edge array does not contain duplicate source-target combinations.
2. **Explicitly specify ids:** Specify a unique id for each edge, for example `{ id: 'e-0-1', source: '0', target: '1' }`.

## Common errors and fixes

### Error: Randomly generated edges cause duplicates and trigger "Edge already exists"

```javascript
// Incorrect: randomly generated edges may produce duplicate source-target pairs
const edges = [];
for (let i = 0; i < 34; i++) {
  const numEdges = 2 + Math.floor(Math.random() * 2);
  for (let j = 0; j < numEdges; j++) {
    const target = Math.floor(Math.random() * 34);
    if (target !== i) {
      edges.push({ source: `${i}`, target: `${target}` });
      // If source-target is duplicated, the automatically generated G6 ID is also duplicated, causing an error!
    }
  }
}
```

```javascript
// Correct approach 1: use Set to deduplicate and avoid duplicate edges
const edgeSet = new Set();
const edges = [];
for (let i = 0; i < 34; i++) {
  const numEdges = 2 + Math.floor(Math.random() * 2);
  for (let j = 0; j < numEdges; j++) {
    const target = Math.floor(Math.random() * 34);
    const key = `${i}-${target}`;
    if (target !== i && !edgeSet.has(key)) {
      edgeSet.add(key);
      edges.push({ source: `${i}`, target: `${target}` });
    }
  }
}
```

```javascript
// Correct approach 2: explicitly specify a unique id for each edge (so repeated source-target pairs do not conflict)
const edges = [];
let edgeIndex = 0;
for (let i = 0; i < 34; i++) {
  const numEdges = 2 + Math.floor(Math.random() * 2);
  for (let j = 0; j < numEdges; j++) {
    const target = Math.floor(Math.random() * 34);
    if (target !== i) {
      edges.push({ id: `e${edgeIndex++}`, source: `${i}`, target: `${target}` });
    }
  }
}
```

```javascript
// Correct approach 3 (most recommended): when the prompt already provides data, use the original data directly instead of randomly generating edges yourself
// When the query provides reference data (nodes/edges), use it directly and do not replace it with random generation logic
const data = {
  nodes: [ { id: '0' }, { id: '1' }, /* ... */ ],
  edges: [ { source: '0', target: '1' }, /* ... */ ],
};
```

### Error: `sortBy` field does not exist

```javascript
// Incorrect: circular layout has no sortBy parameter
layout: {
  type: 'circular',
  sortBy: 'degree',   // This parameter does not exist!
}

// Correct: use the ordering parameter
layout: {
  type: 'circular',
  ordering: 'degree', // 'topology' | 'degree' | null
}
```
