---
id: "g2-mark-partition"
title: "G2 Rectangular Partition Chart (partition)"
description: |
 The partition mark uses a rectangular icicle layout to display hierarchical data. Each level starts from the parent node and extends downward, while child node widths fill the parent width in proportion to their values.
 It uses Cartesian coordinates: the horizontal axis represents the value domain, and the vertical axis represents hierarchy depth.
 partition belongs to the @antv/g2 core package and does not require an additional extension library.
 Note: partition and sunburst are independent marks and must not be mixed.
 partition uses a rectangular layout in Cartesian coordinates, while sunburst uses a radial layout in polar coordinates from @antv/g2-extension-plot.

library: "g2"
version: "5.x"
category: "marks"
tags:
 - "partition"
 - "rectangular partition"
 - "icicle"
 - "icicle chart"
 - "hierarchical data"
 - "hierarchy"
 - "drill-down"
 - "drillDown"

related:
 - "g2-mark-treemap"
 - "g2-mark-sunburst"
 - "g2-interaction-drilldown"
 - "g2-mark-pack"

use_cases:
 - "Display hierarchical data with rectangular partitions, such as flame charts or file directory trees."
 - "Visualize proportions in multi-level categorical data."
 - "Explore hierarchies with drill-down interaction."

anti_patterns:
 - "Do not use partition to draw a radial sunburst chart; use sunburst instead, which requires @antv/g2-extension-plot."
 - "Do not write partition data as { value: treeRoot }; partition data uses array form."
 - "Do not access fields with d.data?.name; partition callbacks receive flattened records, so use d.name directly."
 - "Every node, including the root and intermediate nodes, must explicitly set a value field. partition does not automatically sum child nodes. If the root node is missing value, all rectangle widths become 0 and stack at x=0."
 - "Do not use d['ancestor-node'] for branch coloring. That field is the current node name. For branch colors, use d.path[1] || d.path[0]."
 - "When encode.color is a function, its return value is the color-channel domain key. scale.color.domain must exactly match the function return values. If the function returns hex colors while the domain contains data names, the ordinal scale will append the hex strings to the domain and produce confusing legend entries such as #E63946."

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-04-27"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/graph/hierarchy/#partition"
---

## partition vs sunburst comparison

| Feature | partition (rectangular partition) | sunburst (sunburst chart) |
|------|----------------------|-------------------|
| Source | `@antv/g2` core; no extension required | `@antv/g2-extension-plot`; requires `extend` |
| Coordinate system | Cartesian coordinates | Polar coordinates with concentric circles |
| Visual form | Rectangular icicle layout | Concentric rings |
| Data format | Array `[treeRoot]` | Object `{ value: treeRoot }` |
| Callback field access | Use `d.name`, `d.depth`, and `d.value` directly | Use `d.name`, `d.depth`, and `d.path` directly; `d.path` is a string |

## Minimal runnable example

Data should be a single-root array with three fields: `name`, `value`, and `children`. **Every node, including the root and intermediate nodes, must explicitly set `value`**. partition does not automatically sum child nodes. If the root node is missing `value`, all rectangle widths become 0 and stack at the origin.

The following mock data simulates an annual budget allocation with four major categories and three levels of depth:

```javascript
import { Chart } from '@antv/g2';

const data = [
 {
 name: 'Annual Budget',
 value: 1550,
 children: [
 {
 name: 'Product R&D',
 value: 600,
 children: [
 {
 name: 'Frontend',
 value: 220,
 children: [
 { name: 'React', value: 90 },
 { name: 'Vue', value: 80 },
 { name: 'CSS', value: 50 },
 ],
 },
 {
 name: 'Backend',
 value: 230,
 children: [
 { name: 'Java', value: 100 },
 { name: 'Python', value: 80 },
 { name: 'Go', value: 50 },
 ],
 },
 {
 name: 'Mobile',
 value: 150,
 children: [
 { name: 'iOS', value: 80 },
 { name: 'Android', value: 70 },
 ],
 },
 ],
 },
 {
 name: 'Marketing',
 value: 400,
 children: [
 {
 name: 'Digital Marketing',
 value: 180,
 children: [
 { name: 'SEO', value: 70 },
 { name: 'SEM', value: 60 },
 { name: 'Social Media', value: 50 },
 ],
 },
 {
 name: 'Brand Promotion',
 value: 130,
 children: [
 { name: 'Design', value: 70 },
 { name: 'Content', value: 60 },
 ],
 },
 {
 name: 'Campaign Operations',
 value: 90,
 children: [
 { name: 'Online', value: 50 },
 { name: 'Offline', value: 40 },
 ],
 },
 ],
 },
 {
 name: 'Operations Support',
 value: 300,
 children: [
 {
 name: 'Customer Service',
 value: 130,
 children: [
 { name: 'Pre-sales', value: 60 },
 { name: 'After-sales', value: 70 },
 ],
 },
 {
 name: 'Data Analytics',
 value: 100,
 children: [
 { name: 'BI', value: 60 },
 { name: 'Algorithms', value: 40 },
 ],
 },
 {
 name: 'Technical Support',
 value: 70,
 children: [
 { name: 'Operations', value: 40 },
 { name: 'Security', value: 30 },
 ],
 },
 ],
 },
 {
 name: 'Infrastructure',
 value: 250,
 children: [
 {
 name: 'Cloud Computing',
 value: 120,
 children: [
 { name: 'AWS', value: 60 },
 { name: 'Self-hosted IDC', value: 60 },
 ],
 },
 {
 name: 'Toolchain',
 value: 130,
 children: [
 { name: 'CI/CD', value: 50 },
 { name: 'Monitoring', value: 40 },
 { name: 'Logs', value: 40 },
 ],
 },
 ],
 },
 ],
 },
];

const chart = new Chart({ container: 'container', autoFit: true, height: 400 });

chart.options({
 type: 'partition',
 data,
 encode: {
 value: 'value',
 color: (d) => d.path[1] || d.path[0],
 },
 scale: {
 color: {
 range: [
 'rgb(91, 143, 249)',
 'rgb(90, 216, 166)',
 'rgb(246, 189, 22)',
 'rgb(232, 104, 74)',
 'rgb(154, 100, 220)',
 ],
 },
 },
 labels: [
 {
 text: 'name',
 position: 'inside',
 transform: [{ type: 'overflowHide' }],
 },
 ],
 style: { inset: 0.5 },
 axis: { x: { title: 'Budget (10k yuan)' } },
});

chart.render();
```

## Data format notes

`partition` data is an **array**. Each item is a tree root node, so multiple roots are supported.

**Key point: every node must explicitly set `value`**. The partition layout does not automatically sum child node values. A non-leaf node's `value` should equal the sum of all leaf node values under it.

```javascript
// ✅ Correct: root and intermediate nodes all explicitly set value.
chart.options({
 type: 'partition',
 data: [
 {
 name: 'root',
 value: 300, // <- Required on the root node; equals the sum of all leaf child values.
 children: [
 {
 name: 'A',
 value: 200, // <- Required on intermediate nodes.
 children: [
 { name: 'A1', value: 120 },
 { name: 'A2', value: 80 },
 ],
 },
 { name: 'B', value: 100 },
 ],
 },
 ],
});

// ❌ Error: root node is missing value, so all rectangle widths become 0 and stack at x=0.
chart.options({
 type: 'partition',
 data: [{ name: 'root', children: [...] }], // ❌ Missing value; the chart will not render correctly.
});

// ❌ Error: do not wrap partition data as { value: treeRoot } as you would for sunburst.
chart.options({
 type: 'partition',
 data: { value: { name: 'root', children: [...] } }, // ❌ Does not work.
});
```

## Callback functions in data-driven fields

Before rendering, `partition` flattens tree-shaped data. The callback parameter `d` is **already a flattened record**, so access fields directly:

```javascript
// d after flattening.
{
 name: 'diffProps', // Node name.
 value: 120, // Node value.
 depth: 3, // Level depth, where the root node is 0.
 path: ['main', 'render', 'reconcile', 'diffProps'], // Path array from the root to the current node.
 'ancestor-node': 'diffProps', // Note: this is the current node name, not the first node at the level.
 childNodeCount: 0, // Number of child nodes; 0 for a leaf node.
 x: [x0, x1], // Horizontal position range.
 y: [y0, y1], // Vertical position range, representing the level.
}
```

**Coloring by branch (level category)**: use `d.path[1]`, the second item in the path, as the level-child node name. Do not use `d['ancestor-node']`, which is the current node name and will not group by branch:

```javascript
// ✅ Color by branch: the same level-child subtree gets the same color.
encode: { color: (d) => d.path[1] || d.path[0] }
// path[1] is undefined for the root node, so fall back to path[0], the root node name.

// ✅ Color by node name: each node has an independent color.
encode: { color: 'name' }

// ✅ Color by level depth.
encode: { color: (d) => d.depth }

// ❌ Error: ancestor-node is the current node name, not the first level child.
encode: { color: (d) => d['ancestor-node'] } // Equivalent to d.name, so it does not group by branch.

// ❌ Error: partition does not use d3-hierarchy-wrapped records; d.data does not exist.
encode: { color: (d) => d.data?.name }
```

## Choosing label positions

- **Shallow trees (6 levels or fewer)**: use `position: 'inside'`. The text appears inside each rectangle, and `overflowHide` hides overflowing labels automatically.
- **Deep trees (more than 6 levels)**: use `position: 'left'` with `dx: 8`. Text starts from the left edge of the rectangle, which is suitable when rows are short.

```javascript
// Shallow tree (recommended).
labels: [{ text: 'name', position: 'inside', transform: [{ type: 'overflowHide' }] }]

// Deep tree (used in the official example; suitable for 10+ levels).
labels: [{ text: 'name', position: 'left', dx: 8, transform: [{ type: 'overflowHide' }] }]
```

## Layout options

```javascript
chart.options({
 type: 'partition',
 data: [...],
 encode: { value: 'value', color: 'name' },
 layout: {
 sort: (a, b) => b.value - a.value, // Sort child nodes by value in descending order.
 fillParent: true, // Child nodes fill the parent node width; default is true.
 // valueField: 'value', // Value field name; default is 'value'.
 // nameField: 'name', // Name field name; default is 'name'.
 },
});
```

## With drill-down interaction

`partition` has a built-in `drillDown` interaction. Click a node to drill down:

```javascript
chart.options({
 type: 'partition',
 data: [...],
 encode: { value: 'value', color: 'name' },
 interaction: {
 drillDown: true, // Already enabled by default.
 },
});
```

## Common errors and fixes

### Error 1: root node missing value -> all rectangles overlap at x=0

The partition layout uses `node.value` to calculate the root node width (`x1 = x0 + value`). If the root node `value` is 0 or missing, its width is 0. Child nodes then start from `x=0`, and their own widths overlap severely.

```javascript
// ❌ Error: the root node has no value, so child nodes start at x=0 and overlap.
chart.options({
 type: 'partition',
 data: [
 {
 name: 'root',
 // value is missing!
 children: [
 { name: 'A', value: 150 }, // x=[0, 150]
 { name: 'B', value: 200 }, // x=[0, 200] <- overlaps with A!
 ],
 },
 ],
});

// ✅ Correct: every node explicitly sets value.
chart.options({
 type: 'partition',
 data: [
 {
 name: 'root',
 value: 350, // <- Required; equals the sum of all leaf child values.
 children: [
 { name: 'A', value: 150 }, // x=[0, 150]
 { name: 'B', value: 200 }, // x=[150, 350] <- Correct.
 ],
 },
 ],
});
```

### Error 2: mixing up partition and sunburst
```javascript
// ❌ Error: do not use partition with polar coordinates to draw a sunburst chart.
chart.options({
 type: 'partition',
 coordinate: { type: 'polar' }, // ❌ partition does not support sunburst-style polar coordinates.
});

// ✅ Correct: use sunburst for a sunburst chart; it requires @antv/g2-extension-plot.
import { plotlib } from '@antv/g2-extension-plot';
import { Runtime, corelib, extend } from '@antv/g2';
const Chart = extend(Runtime, { ...corelib(), ...plotlib() });

chart.options({
 type: 'sunburst',
 data: { value: treeRoot }, // sunburst uses the { value: root } object form.
 encode: { value: 'sum' },
});
```

### Error 3: data uses sunburst's object format
```javascript
// ❌ Error: partition does not use the { value: root } object form.
chart.options({
 type: 'partition',
 data: { value: { name: 'root', children: [...] } },
});

// ✅ Correct: partition uses an array, and the root node must explicitly set value.
chart.options({
 type: 'partition',
 data: [{ name: 'root', value: 1000, children: [...] }],
});
```

### Error 4: using d.data?.name to access fields in labels
```javascript
// ❌ Error: this is d3-hierarchy syntax. partition records are already flattened, so d.data does not exist.
labels: [{ text: (d) => d.data?.name }]

// ✅ Correct: access flattened fields directly.
labels: [{ text: 'name' }]
labels: [{ text: (d) => d.name }]
```

### Error 5: misusing ancestor-node for branch coloring
```javascript
// ❌ Error: ancestor-node is the current node name, so each node may get a different color and grouping is lost.
encode: { color: (d) => d['ancestor-node'] }

// ✅ Correct: use path[1] to read the first-level child node name for branch coloring.
encode: { color: (d) => d.path[1] || d.path[0] }
```

### Error 6: encode.color function return values do not match scale.color.domain

The value returned by an `encode.color` function is the color-channel **domain key**. `scale.color.domain` must exactly match the function's actual return values.

If the function returns hex color strings while `domain` contains data names, the `@antv/scale` ordinal scale appends the hex strings to the domain and produces confusing legend entries such as `#E63946`.

```javascript
// ❌ Error: the function returns hex colors, but the domain contains data field names.
// The ordinal scale appends '#E63946' and '#BDBDBD' to the domain, and the legend shows hex-string items.
encode: {
 color: (d) => ['Product R&D', 'Infrastructure'].includes(d.path[1]) ? '#E63946' : '#BDBDBD',
},
scale: {
 color: {
 domain: ['Product R&D', 'Marketing', 'Operations Support', 'Infrastructure'], // ❌ Does not match function return values.
 range: ['#E63946', '#BDBDBD', '#BDBDBD', '#E63946'],
 },
},
// Result: the domain becomes ['Product R&D', 'Marketing', 'Operations Support', 'Infrastructure', '#E63946', '#BDBDBD'].
// The legend displays six items, including the '#E63946' and '#BDBDBD' strings.

// ✅ Correct: return semantic labels from the function, and make scale.domain match those labels exactly.
encode: {
 color: (d) => ['Product R&D', 'Infrastructure'].includes(d.path[1]) ? 'highlight' : 'muted',
},
scale: {
 color: {
 domain: ['highlight', 'muted'], // ✅ Exactly matches the function return values.
 range: ['#E63946', '#BDBDBD'],
 },
},
// The legend displays only two semantic items, and color mapping is correct.
```

If you do not need a legend and only need a color map, you can specify `range` without setting `domain`; the ordinal scale will collect the domain automatically:

```javascript
// ✅ When legend labels are not required, use range directly and let the ordinal scale collect the domain automatically.
encode: { color: (d) => d.path[1] || d.path[0] },
scale: {
 color: {
 range: ['rgb(91,143,249)', 'rgb(90,216,166)', 'rgb(246,189,22)', 'rgb(232,104,74)'],
 },
},
```
