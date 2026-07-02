---
id: "g2-mark-chord"
title: "G2 Chord Diagram (Chord Mark)"
description: |
  Use Chord Mark to create a chord diagram. Chord diagrams show flow relationships between nodes,
  and are common in trade flows, migration data, capital flows, and similar scenarios.

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "chord diagram"
  - "Chord"
  - "relationship graph"
  - "flow diagram"
  - "matrix visualization"

related:
  - "g2-mark-sankey"
  - "g2-mark-link"
  - "g2-coord-polar"

use_cases:
  - "Show trade flows between countries or regions"
  - "Visualize population migration data"
  - "Analyze capital-flow relationships"
  - "Show collaboration relationships between departments"

anti_patterns:
  - "Poor visualization quality when there are too many nodes (>20)"
  - "Not suitable for simple one-way relationships (use Sankey instead)"
  - "Not suitable for hierarchical data"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/relationship/chord"
---

## Core concepts

Chord Mark is a composite mark for drawing chord diagrams in G2 v5:
- **Node**: a polygon on an arc that represents an entity
- **Link**: a ribbon area connecting nodes that represents a flow relationship
- **Layout**: automatically calculates node positions and link shapes

**Key configuration:**
- `encode.source`: source node field of the edge
- `encode.target`: target node field of the edge
- `encode.value`: weight field of the edge
- `layout`: layout configuration (node width, spacing, and so on)

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

// Chord diagram data: nodes + links
const data = {
  nodes: [
    { key: 'A', name: 'Product A' },
    { key: 'B', name: 'Product B' },
    { key: 'C', name: 'Product C' },
  ],
  links: [
    { source: 'A', target: 'B', value: 100 },
    { source: 'B', target: 'C', value: 80 },
    { source: 'C', target: 'A', value: 60 },
  ],
};

chart.options({
  type: 'chord',
  data: {
    value: data
  },
  encode: {
    source: 'source',
    target: 'target',
    value: 'value',
  },
});

chart.render();
```

## Common variants

### With node labels

```javascript
chart.options({
  type: 'chord',
  data: {
    value: data
  },
  encode: {
    source: 'source',
    target: 'target',
    value: 'value',
    nodeKey: 'key',  // Node identifier field
  },
  nodeLabels: [
    { text: 'name', position: 'outside', fontSize: 12 },
  ],
});
```

### Custom layout

```javascript
chart.options({
  type: 'chord',
  data: {
    value: data
  },
  encode: {
    source: 'source',
    target: 'target',
    value: 'value',
  },
  layout: {
    nodeWidthRatio: 0.05,    // Node width ratio (0, 1)
    nodePaddingRatio: 0.1,   // Node padding ratio [0, 1)
    sortBy: 'weight',        // Sort method: 'id' | 'weight' | 'frequency' | null
  },
});
```

### Custom style

```javascript
chart.options({
  type: 'chord',
  data: {
    value: data
  },
  encode: {
    source: 'source',
    target: 'target',
    value: 'value',
    nodeColor: 'key',        // Node color mapping
    linkColor: 'source',     // Link color mapping
  },
  style: {
    node: {
      opacity: 1,
      lineWidth: 1,
    },
    link: {
      opacity: 0.5,
      lineWidth: 1,
    },
  },
});
```

### With Tooltip

```javascript
chart.options({
  type: 'chord',
  data: {
    value: data
  },
  encode: {
    source: 'source',
    target: 'target',
    value: 'value',
  },
  tooltip: {
    node: {
      title: '',
      items: [(d) => ({ name: d.key, value: d.value })],
    },
    link: {
      title: '',
      items: [(d) => ({ name: `${d.source} → ${d.target}`, value: d.value })],
    },
  },
});
```

## Spec complete-structure quick reference

```javascript
chart.options({
  type: 'chord',
  data: {
    // Data (nodes + links structure)
    value: {
      nodes: [...],
      links: [...],
    },
  },
  // Channel mapping
  encode: {
    source: 'source',        // Edge source node
    target: 'target',        // Edge target node
    value: 'value',          // Edge weight
    nodeKey: 'key',          // Node identifier field
    nodeColor: 'key',        // Node color
    linkColor: 'source',     // Link color
  },

  // Layout configuration
  layout: {
    nodeWidthRatio: 0.05,
    nodePaddingRatio: 0.1,
    sortBy: null,            // 'id' | 'weight' | 'frequency' | function
  },

  // Style
  style: {
    node: { opacity: 1, lineWidth: 1 },
    link: { opacity: 0.5, lineWidth: 1 },
    label: { fontSize: 10 },
  },

  // Labels
  nodeLabels: [{ text: 'name', position: 'outside' }],
  linkLabels: [],

  // Tooltip
  tooltip: { ... },

  // Animation
  animate: {
    node: { enter: { type: 'fadeIn' } },
    link: { enter: { type: 'fadeIn' } },
  },
});
```

## Complete type reference

```typescript
interface ChordSpec {
  type: 'chord';
  data: {
    value: {
      nodes: Array<{ key: string; [key: string]: any }>;
      links: Array<{ source: string; target: string; value: number; [key: string]: any }>;
    };
  }
  encode?: {
    source?: string;
    target?: string;
    value?: string;
    nodeKey?: string;
    nodeColor?: string;
    linkColor?: string;
  };
  layout?: {
    nodeWidthRatio?: number;   // (0, 1), default: 0.05
    nodePaddingRatio?: number; // [0, 1), default: 0.1
    sortBy?: 'id' | 'weight' | 'frequency' | ((data: any) => any) | null;
  };
  style?: {
    node?: { opacity?: number; lineWidth?: number; fill?: string };
    link?: { opacity?: number; lineWidth?: number; fill?: string };
    label?: { fontSize?: number; fill?: string };
  };
  nodeLabels?: LabelOption[];
  linkLabels?: LabelOption[];
  tooltip?: TooltipOption;
  animate?: AnimateOption;
}
```

## Common errors and fixes

### Error 1: incorrect data format

```javascript
// ❌ Error: uses a flat array
chart.options({
  type: 'chord',
  data: [
    { source: 'A', target: 'B', value: 100 },
  ],
});

// ✅ Correct: use a nodes + links structure
chart.options({
  type: 'chord',
  data: {
    value: {
      nodes: [{ key: 'A' }, { key: 'B' }],
      links: [{ source: 'A', target: 'B', value: 100 }],
    }
  },
  encode: { source: 'source', target: 'target', value: 'value' },
});
```

### Error 2: node keys do not match

```javascript
// ❌ Error: source/target in links do not match keys in nodes
const data = {
  nodes: [{ key: 'ProductA' }],
  links: [{ source: 'A', target: 'B', value: 100 }],  // 'A' ≠ 'ProductA'
};

// ✅ Correct: ensure keys are consistent
const data = {
  nodes: [{ key: 'A' }, { key: 'B' }],
  links: [{ source: 'A', target: 'B', value: 100 }],
};
```

### Error 3: missing value encoding

```javascript
// ❌ Error: no weight field is specified
chart.options({
  type: 'chord',
  data: {
    value: data
  },
  encode: { source: 'source', target: 'target' },
});

// ✅ Correct: specify the value field
chart.options({
  type: 'chord',
  data: {
    value: data
  },
  encode: { source: 'source', target: 'target', value: 'value' },
});
```
