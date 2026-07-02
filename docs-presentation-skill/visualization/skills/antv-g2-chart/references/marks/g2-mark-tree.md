---
id: "g2-mark-tree"
title: "G2 Tree Diagram (tree)"
description: |
  The tree mark renders hierarchical, tree-shaped JSON data as a node-link tree diagram.
  It automatically lays out nodes as point marks and edges as link marks.
  Horizontal, vertical, and radial layouts are supported for organizational charts, decision trees, and hierarchical category displays.

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "tree"
  - "tree diagram"
  - "levels"
  - "organizational structure"
  - "tree-like"
  - "hierarchy"

related:
  - "g2-mark-treemap"
  - "g2-mark-partition"
  - "g2-mark-sankey"

use_cases:
  - "visualize an organizational structure"
  - "visualize a decision tree"
  - "display a file directory tree"
  - "visualize category levels"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/hierarchy/tree/"
---

## Minimal runnable example (horizontal tree diagram)

```javascript
import { Chart } from '@antv/g2';

// Tree-shaped data in nested JSON format.
const treeData = {
  name: 'Headquarters',
  children: [
    {
      name: 'R&D Department',
      children: [
        { name: 'Frontend Team', value: 10 },
        { name: 'Backend Team', value: 15 },
        { name: 'Algorithm Team', value: 8 },
      ],
    },
    {
      name: 'Marketing Department',
      children: [
        { name: 'Branding Team', value: 6 },
        { name: 'Operations Team', value: 9 },
      ],
    },
    {
      name: 'Product Department',
      children: [
        { name: 'B2B Product', value: 7 },
        { name: 'C2C Product', value: 5 },
      ],
    },
  ],
};

const chart = new Chart({ container: 'container', width: 800, height: 500 });

chart.options({
  type: 'tree',
  data: treeData,
  layout: {
    // Layout direction: false = vertical (top to bottom), true = horizontal (left to right).
    // The G2 tree mark uses the d3-hierarchy tidy tree layout.
  },
  encode: {
    value: 'value', // Optional field for encoding node size.
  },
  // Node label style.
  nodeLabels: [
    { text: 'name', style: { fontSize: 12, dx: 6 } },
  ],
  // Node and link styles.
  style: {
    nodeSize: 5,
    nodeFill: '#5B8FF9',
    linkStroke: '#aaa',
    linkLineWidth: 1.5,
  },
});

chart.render();
```

## Vertical tree diagram (top to bottom)

```javascript
chart.options({
  type: 'tree',
  data: treeData,
  coordinate: { transform: [{ type: 'transpose' }] }, // Transpose to a vertical layout.
  nodeLabels: [
    {
      text: 'name',
      style: { fontSize: 11, textBaseline: 'bottom', dy: -6 },
    },
  ],
  style: {
    nodeFill: '#52c41a',
    nodeSize: 6,
    linkShape: 'smooth', // Use smooth curved links.
  },
});
```

## Radial tree diagram

```javascript
chart.options({
  type: 'tree',
  data: treeData,
  coordinate: { type: 'polar', innerRadius: 0.1 }, // Polar coordinates create a radial layout.
  style: {
    nodeFill: '#ff7875',
    nodeSize: 4,
  },
  nodeLabels: [
    {
      text: 'name',
      style: {
        fontSize: 10,
        textAlign: (d) => (d.x > Math.PI ? 'right' : 'left'),
      },
    },
  ],
});
```

## Common errors and fixes

### Error: Passing flat data instead of nested JSON
```javascript
// ❌ The tree mark requires nested JSON with a children field, not a flat array.
chart.options({
  type: 'tree',
  data: [
    { id: 1, parent: null, name: 'Root' },
    { id: 2, parent: 1, name: 'Child' },
  ], // ❌ Flat data cannot be used directly.
});

// ✅ Use nested data.
chart.options({
  type: 'tree',
  { name: 'Root', children: [{ name: 'Child' }] }, // ✅ Nested JSON.
});
```

### Error: Confusing tree and treemap
```javascript
// tree: shows hierarchical relationships with nodes and links.
chart.options({ type: 'tree', data: { value: hierarchyData } });

// treemap: shows hierarchical proportions with nested rectangles.
chart.options({ type: 'treemap', data: { value: hierarchyData } });
```

---

## Node data access rules (important)

In hierarchy charts, the callback parameter `d` is **not the original data object**. G2 wraps the original data in a d3-hierarchy node, so the original data is available on `d.data`.

### Structure of callback parameter d

```javascript
// d is a d3-hierarchy node with a structure like this:
{
  value: 10, // Node value, calculated from child subtree totals.
  depth: 2, // Hierarchy depth; 0 is the root node.
  height: 0, // Child-tree height; leaf nodes have height 0.
  data: { // Original data is stored here.
    name: 'Frontend Team',
    value: 10,
    // ...other custom fields.
  },
  path: ['Root', 'R&D Department', 'Frontend Team'],
}
```

### Accessing fields in nodeLabels

When `nodeLabels` uses the string `'name'`, the tree mark applies special handling and reads `d.data['name']`, so the string form works. Use a callback when you need conditional logic, calculated properties such as `depth` or `height`, or custom rendering.

```javascript
// ✅ String form: tree nodeLabels can read data fields with special handling.
nodeLabels: [
  { text: 'name', style: { fontSize: 12 } },
]

// ✅ Callback form: use this for conditional logic or node properties.
nodeLabels: [
  {
    text: (d) => {
      if (d.height > 0) return d.data?.name; // Display parent-node names.
      return `${d.data?.name}\n(${d.value})`; // Display leaf-node names and values.
    },
    style: { fontSize: 12 },
  },
]
```

### encode.color requires a callback

As with other hierarchy marks, a string field for `encode.color` does **not work** for tree marks:

```javascript
// ❌ Error: color: 'type' is equivalent to d['type'], which is undefined.
encode: {
  value: 'value',
  color: 'type', // ❌ undefined, so all nodes use the same color.
}

// ✅ Correct: use a callback.
encode: {
  value: 'value',
  color: (d) => d.data?.type, // Read the original field through d.data.
}
```
