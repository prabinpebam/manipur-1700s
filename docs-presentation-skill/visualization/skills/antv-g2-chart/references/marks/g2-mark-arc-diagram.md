---
id: "g2-mark-arc-diagram"
title: "G2 Arc Diagram Mark"
description: |
  Arc diagram Mark. Uses a combination of line and point marks to show relationships between nodes.
  Suitable for relationship network analysis, social networks, knowledge graphs, and similar scenarios.

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "arc-length connection chart"
  - "arc diagram"
  - "relationship graph"
  - "network"

related:
  - "g2-mark-chord"
  - "g2-mark-sankey"

use_cases:
  - "Relationship network analysis"
  - "Social networks"
  - "Knowledge graphs"

anti_patterns:
  - "Use a tree chart for hierarchical structures"
  - "Not suitable when there are too many nodes"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/mark/arc-diagram"
---

## Core concepts

An arc diagram shows relationships between nodes:
- Nodes are arranged along a linear axis or in a circle
- Arcs represent connections between nodes
- Supports both linear and circular layouts

**Key characteristics:**
- One-dimensional layout
- Clearly reveals ring and bridge structures
- Node ordering affects the visual result

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  theme: 'classic',
});

// Data preprocessing: compute arc coordinates
const processData = (nodes, links) => {
  const arcData = [];
  const nodePositions = {};

  nodes.forEach((node, i) => {
    nodePositions[node.id] = i * 15 + 50;
  });

  links.forEach((link) => {
    const sourceX = nodePositions[link.source];
    const targetX = nodePositions[link.target];
    const distance = Math.abs(targetX - sourceX);
    const arcHeight = Math.min(150, distance * 0.1);

    for (let i = 0; i <= 15; i++) {
      const t = i / 15;
      const x = sourceX + (targetX - sourceX) * t;
      const y = 600 - arcHeight * Math.sin(Math.PI * t);
      arcData.push({ x, y, linkId: `${link.source}-${link.target}` });
    }
  });

  return { arcData, nodePositions, nodes };
};

chart.options({
  type: 'view',
   data: { type: 'fetch', value: 'relationship.json' },
  // ... data processing and rendering
});

chart.render();
```

## Common variants

### Circular layout

```javascript
chart.options({
  type: 'view',
  coordinate: { type: 'polar' },  // Polar coordinate system
  data,
  children: [
    {
      type: 'line',
      encode: { x: 'x', y: 'y', series: 'linkId' },
    },
    {
      type: 'point',
      encode: { x: 'angle', y: 'radius', color: 'group' },
    },
  ],
});
```

### With node labels

```javascript
chart.options({
  type: 'view',
  children: [
    { type: 'line', data: arcData, encode: { x: 'x', y: 'y', series: 'linkId' } },
    { type: 'point', data: nodeData, encode: { x: 'x', y: 'y', color: 'group' } },
    { type: 'text',  nodeData, encode: { x: 'x', y: 'y', text: 'name' } },
  ],
});
```

### With interactive highlighting

```javascript
chart.options({
  type: 'view',
  children: [
    {
      type: 'line',
      data: arcData,
      encode: { x: 'x', y: 'y', series: 'linkId' },
      style: { strokeOpacity: 0.4 },
      state: {
        active: { strokeOpacity: 1, lineWidth: 2 },
      },
    },
  ],
  interactions: [{ type: 'elementHighlight' }],
});
```

## Complete type reference

```typescript
interface ArcDiagramData {
  nodes: Array<{ id: string; label: string; group?: string }>;
  links: Array<{ source: string; target: string; value?: number }>;
}

// An arc diagram consists of multiple layers:
// 1. line - arc connections
// 2. point - nodes
// 3. text - labels (optional)
```

## Arc diagram vs. chord diagram

| Feature | Arc diagram | Chord diagram |
|------|------------|--------|
| Node layout | Linear/circular | Circular |
| Connection style | Overlapping arcs | Tiled without overlap |
| Suitable scenario | Relationship display | Flow display |

## Common mistakes and fixes

### Mistake 1: Nodes are not sorted

```javascript
// Warning: node ordering affects the visual result
// Recommended: sort by community or degree
```

### Mistake 2: Too many connections

```javascript
// Warning: too many connections cause visual clutter
// Recommended: filter or aggregate some connections
```

### Mistake 3: Missing data preprocessing

```javascript
// Problem: directly using raw data
 { nodes: [...], links: [...] }

// Correct: preprocess data to compute coordinates
data: { transform: [{ type: 'custom', callback: processData }] }
```
