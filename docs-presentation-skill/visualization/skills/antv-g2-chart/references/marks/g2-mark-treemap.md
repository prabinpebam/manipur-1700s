---
id: "g2-mark-treemap"
title: "G2 Treemap (treemap)"
description: |
  G2 v5 includes a built-in treemap mark that uses rectangle area to represent each node's proportion within hierarchical data.
  It consumes nested children trees and uses encode.value to map leaf-node values.
  The mark supports multiple tiling algorithms and hierarchical drill-down interactions.

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "rectangular tree chart"
  - "treemap"
  - "hierarchical data"
  - "proportion"
  - "hierarchy"
  - "tree-shaped"
  - "spec"

related:
  - "g2-mark-arc-pie"
  - "g2-mark-sankey"
  - "g2-core-chart-init"

use_cases:
  - "show file directory or disk usage size"
  - "show product-category sales proportions across multiple levels"
  - "show market-sector gains and losses as a heatmap"

difficulty: "intermediate"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/graph/hierarchy/#treemap"
---

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 800,
  height: 500,
});

// Nested tree data.
const data = {
  name: 'root',
  children: [
    {
      name: 'Technology',
      children: [
        { name: 'Frontend', value: 120 },
        { name: 'Backend', value: 180 },
        { name: 'Algorithms', value: 80 },
      ],
    },
    {
      name: 'Product',
      children: [
        { name: 'Mobile', value: 95 },
        { name: 'Web', value: 60 },
      ],
    },
    {
      name: 'Design',
      children: [
        { name: 'UI', value: 70 },
        { name: 'UX', value: 45 },
      ],
    },
  ],
};

chart.options({
  type: 'treemap',
  data: {
    value: data
  },
  encode: {
    value: 'value', // Leaf-node value field.
  },
  layout: {
    tile: 'treemapSquarify', // Layout algorithm; this is the default.
    paddingInner: 2, // Spacing between rectangles.
  },
  style: {
    labelText: (d) => d.data?.name || '',
    labelFill: '#fff',
    labelFontSize: 13,
    fillOpacity: 0.85,
  },
  legend: false,
});

chart.render();
```

## Data configuration forms

**Why does treemap use `{ value: data }` instead of `data`?**

Hierarchical data is an **object** with `name` and `children`, not an array, so the complete data form is required:

```javascript
// ❌ Error: hierarchical data is not an array and cannot use the shorthand form.
chart.options({
  type: 'treemap',
  data: hierarchyData, // ❌ Does not work.
});

// ✅ Correct: hierarchical data requires the complete form.
chart.options({
  type: 'treemap',
  data: { value: hierarchyData }, // ✅
});
```

**The shorthand form is only for array data** and does not apply to inline hierarchical objects.

---

## Complete configuration options

```javascript
chart.options({
  type: 'treemap',
  data: {
    value: hierarchicalData
  },
  encode: {
    value: 'value', // Leaf-node value field; controls rectangle area.
  },
  layout: {
    // Available tiling algorithms:
    // 'treemapSquarify' (default, produces nearly square rectangles)
    // 'treemapBinary' (binary split)
    // 'treemapDice' (horizontal division)
    // 'treemapSlice' (vertical division)
    // 'treemapSliceDice' (alternating split)
    tile: 'treemapSquarify',
    paddingInner: 2, // Spacing between same-level rectangles, in pixels.
    paddingOuter: 4, // Outer margin.
    paddingTop: 20, // Top area for parent-node labels.
    ratio: 1.618, // Golden ratio; used by treemapSquarify.
    ignoreParentValue: true, // Ignore a parent node's own value.
  },
  style: {
    // Rectangle label.
    labelText: (d) => d.data?.name,
    labelFill: '#fff',
    labelFontSize: 12,
    labelPosition: 'top-left', // Label position.
    fillOpacity: 0.8,
    stroke: '#fff',
    lineWidth: 1,
  },
});
```

## Multilevel labels (parent nodes and leaf nodes)

```javascript
chart.options({
  type: 'treemap',
  data: {
    value: data
  },
  encode: { value: 'value' },
  layout: {
    tile: 'treemapSquarify',
    paddingInner: 3,
    paddingTop: 24, // Reserve space for parent-node labels.
  },
  style: {
    // Display names on leaf nodes.
    labelText: (d) => {
      // path is an array from the root to the current node.
      return d.depth > 1 ? d.data?.name : '';
    },
    // Use stronger labels for parent nodes at depth 1.
    labelFontSize: (d) => d.depth === 1 ? 14 : 11,
    labelFontWeight: (d) => d.depth === 1 ? 'bold' : 'normal',
    labelFill: '#fff',
    fillOpacity: (d) => d.depth === 1 ? 0.6 : 0.85,
  },
});
```

## Stock-sector heatmap (market gains and losses)

```javascript
const marketData = {
  name: 'A-shares',
  children: [
    {
      name: 'Technology',
      children: [
        { name: 'Huawei', value: 1200, change: 3.5 },
        { name: 'Tencent', value: 980, change: -1.2 },
        { name: 'Alibaba', value: 850, change: 0.8 },
      ],
    },
    {
      name: 'Finance',
      children: [
        { name: 'ICBC', value: 2100, change: 1.1 },
        { name: 'CCB', value: 1800, change: -0.5 },
      ],
    },
  ],
};

chart.options({
  type: 'treemap',
  data: {
    value: marketData
  },
  encode: {
    value: 'value',
    // Map color by percentage change.
    color: (d) => d.data?.change ?? 0,
  },
  scale: {
    color: {
      type: 'diverging',
      palette: 'RdYlGn', // Red (down) -> yellow (flat) -> green (up).
      domain: [-5, 0, 5],
    },
  },
  style: {
    labelText: (d) =>
      d.data?.name && d.data?.change != null
        ? `${d.data.name}\n${d.data.change > 0 ? '+' : ''}${d.data.change}%`
        : d.data?.name || '',
    labelFill: '#fff',
    labelFontSize: 12,
  },
  legend: { color: { position: 'top' } },
});
```

## Common errors and fixes

### Error 1: Data is not tree-shaped

```javascript
// ❌ Error: treemap requires nested tree data and cannot use a flat array.
chart.options({
  type: 'treemap',
  data: [
    { name: 'Frontend', value: 120, parent: 'Technology' }, // ❌ Flat format.
  ],
});

// ✅ Correct: use nested children.
chart.options({
  type: 'treemap',
  data: {
    value: {
      name: 'root',
      children: [
        {
          name: 'Technology',
          children: [
            { name: 'Frontend', value: 120 }, // ✅ Leaf node with a value.
          ],
        },
      ],
    },
  },
  encode: { value: 'value' },
});
```

### Error 2: encode.value does not match the data field name

```javascript
// ❌ Error: the leaf-node field is size, but encode.value is set to value.
const data = {
  value: { name: 'root', children: [{ name: 'A', size: 100 }] }
};
chart.options({
  encode: { value: 'value' }, // ❌ Field name does not match.
});

// ✅ Correct.
chart.options({
  encode: { value: 'size' }, // ✅ Matches the data field.
});
```

---

## Node data access rules (important)

In hierarchy charts, the callback parameter `d` is **not the original data object**. G2 wraps the original data in a d3-hierarchy node, so the original data is available on `d.data`.

### Why does `encode.color: 'growth'` not work?

**Root cause**: when an encode channel is configured with a string, G2 internally reads `datum[fieldName]`. For hierarchy marks, `datum` is the hierarchy node, not the original data object:

```
d['growth'] -> undefined ❌ (the hierarchy node has no top-level growth property)
d.data['growth'] -> 3.5 ✅ (the original data is stored on d.data)
```

**Exception**: `encode.value: 'value'` appears to work with a string because G2 applies special handling for the `value` channel on hierarchy marks and reads the node's calculated `value` property. Other channels such as `color` and `shape` do not have this special handling, so string fields read `datum[field]` directly and may return `undefined`.

```javascript
// ❌ encode.color: 'growth' is equivalent to:
const color = datum['growth'] // datum is a hierarchy node; 'growth' is not on the node top level.
// Result: all rectangles use the same color.

// ✅ Use a callback to access the original data correctly.
const color = datum.data?.['growth'] // datum.data is the original data object.
```

### Structure of callback parameter d

```javascript
// d is a d3-hierarchy node with a structure like this:
{
  value: 100, // Node value calculated by d3 from child leaf values.
  depth: 2, // Hierarchy depth; 0 is the root node.
  height: 0, // Child-tree height; leaf nodes have height 0.
  data: { // Original data is stored here.
    name: 'Frontend',
    value: 120,
    growth: 3.5,
    // ...other custom fields.
  },
  path: ['root', 'Technology', 'Frontend'], // Path from the root to the current node.
}
```

### Accessing fields in encode

```javascript
// ❌ Error: string field names for color, shape, and similar channels do not work here.
encode: {
  value: 'value', // ✅ The value channel has special handling, so a string can be used.
  color: 'growth', // ❌ Equivalent to d['growth'] = undefined; all rectangles use the same color.
}

// ✅ Correct: all non-value channels should use callbacks.
encode: {
  value: 'value',
  color: (d) => d.data?.growth, // ✅ Access the original field through d.data.
}
```

### Common coloring strategies

```javascript
// Color by parent node; recommended for visual grouping.
color: (d) => d.path?.[1] || d.data?.name

// Color by hierarchy depth.
color: (d) => d.depth

// Color by a custom field.
color: (d) => d.data?.growth
color: (d) => d.data?.category

// Color by value with a continuous color scale.
color: (d) => d.value
```

### Customizing colors with scale

```javascript
encode: {
  value: 'value',
  color: (d) => d.data?.growth,
},
scale: {
  color: {
    type: 'diverging',
    palette: 'RdYlGn',
    domain: [-5, 0, 5],
  },
}
```

### Error 3: Using a string field name for encode.color makes all rectangles the same color

```javascript
// ❌ Error: color: 'growth' is equivalent to d['growth']; the hierarchy node has no top-level growth property.
chart.options({
  type: 'treemap',
  data: { value: data },
  encode: {
    value: 'value',
    color: 'growth', // ❌ d['growth'] = undefined, so all rectangles use the same color.
  },
});

// ✅ Correct: color requires a callback that reads the original field through d.data.
chart.options({
  type: 'treemap',
  data: { value: data },
  encode: {
    value: 'value',
    color: (d) => d.data?.growth, // ✅ Color by percentage change.
  },
});
```

### Error 4: Using d.name in labels or style returns undefined

```javascript
// ❌ Error: the original field for a treemap node is in d.data, so d.name is undefined.
style: {
  labelText: (d) => d.name, // ❌ d.name is undefined.
}

// ✅ Correct: access the original data field through d.data.
style: {
  labelText: (d) => d.data?.name || '', // ✅
}
```
