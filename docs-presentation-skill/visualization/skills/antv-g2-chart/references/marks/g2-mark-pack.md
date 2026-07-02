---
id: "g2-mark-pack"
title: "G2 Circle Packing Chart (pack)"
description: |
 The pack mark uses a circle-packing layout to display hierarchical data.
 Parent-child relationships are represented by circle containment, and circle size maps to numeric values.
 Data must be a tree structure with nested children fields or a flat structure with parent references.

library: "g2"
version: "5.x"
category: "marks"
tags:
 - "pack"
 - "circle packing"
 - "circle packing chart"
 - "hierarchical data"
 - "tree-shaped"
 - "nested"

related:
 - "g2-mark-treemap"
 - "g2-core-chart-init"

use_cases:
 - "Show hierarchical scale relationships, such as file directory sizes."
 - "Show nested category relationships and proportions."
 - "Compare department scale in an organizational structure."

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/other/#pack"
---

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

// Hierarchical tree-shaped data.
const data = {
 name: 'Company',
 children: [
 {
 name: 'R&D Department',
 children: [
 { name: 'Frontend Team', value: 12 },
 { name: 'Backend Team', value: 18 },
 { name: 'Algorithm Team', value: 8 },
 ],
 },
 {
 name: 'Marketing Department',
 children: [
 { name: 'Branding Team', value: 6 },
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

const chart = new Chart({ container: 'container', width: 600, height: 600 });

chart.options({
 type: 'pack',
 data: {
 value: data,
 },
 encode: {
 value: 'value', // Leaf node value used to set circle size.
 },
 style: {
 labelFontSize: 11,
 fillOpacity: 0.8,
 },
 legend: false,
});

chart.render();
```

## Data configuration forms

**Why does pack use `{ value: data }` instead of `data`?**

In G2 v5, the shorthand data form is limited to a specific case.

### Shorthand form (array data only)

You can use the shorthand data form only when all three conditions are true:
1. The data is inline.
2. The data is an array.
3. No data transform is needed.

```javascript
// ✅ Ordinary charts: array data can use the shorthand form.
const arrayData = [
 { genre: 'Sports', sold: 275 },
 { genre: 'Strategy', sold: 115 },
];

chart.options({
 type: 'interval',
 data: arrayData, // Shorthand form.
});
```

### Full form (required for hierarchical data)

Hierarchical data is an object that contains name and children fields. It is not an array, so it must use the full data form:

```javascript
// Hierarchical data is an object, not an array.
const hierarchyData = {
 name: 'root',
 children: [
 { name: 'A', value: 30 },
 { name: 'B', value: 50 },
 ],
};

// ❌ Error: hierarchical data is not an array and cannot use the shorthand form.
chart.options({
 type: 'pack',
 data: hierarchyData, // ❌ Does not work.
});

// ✅ Correct: hierarchical data must use the full form.
chart.options({
 type: 'pack',
 data: { value: hierarchyData }, // ✅
});
```

### Data configuration comparison table

| Data type | Form | Example |
|---------|------|------|
| Array data without transforms | Shorthand | `data: arrayData` or ` [...]` |
| Array data with transforms | Full | ` { value: [...], transform: [...] }` |
| Hierarchical data object | Full | ` { value: { name, children } }` |
| Remote data | Full | `data: { type: 'fetch', value: 'url' }` |

---

## Common errors and fixes

### Error 1: passing the tree object directly to data

```javascript
// ❌ Error: hierarchical data is not an array and cannot use the shorthand form.
chart.options({
 type: 'pack',
 data: hierarchyData, // ❌ Passing the tree-shaped object directly does not work.
});

// ✅ Correct: hierarchical data must use the { value: treeData } form.
chart.options({
 type: 'pack',
 data: { value: hierarchyData }, // ✅
});
```

### Error 2: leaf nodes have no value field, so all circles have the same size

```javascript
// ❌ Leaf nodes have no value field, so all nodes have the same size and differences are hidden.
const data = {
 value: {
 name: 'root',
 children: [
 { name: 'A' }, // ❌ Missing value.
 { name: 'B' },
 ],
 }
};

// ✅ Add a value field to each leaf node.
const data = {
 value: {
 name: 'root',
 children: [
 { name: 'A', value: 30 }, // ✅
 { name: 'B', value: 50 },
 ],
 }
}
```

### Error 3: using a string field name for encode.color makes all circles the same color

```javascript
// ❌ Error: color: 'name' is equivalent to d['name']; hierarchy nodes do not have a top-level name property, so it returns undefined.
chart.options({
 type: 'pack',
 data: { value: data },
 encode: {
 value: 'value',
 color: 'name', // ❌ d['name'] = undefined, so all circles use the same color.
 },
});

// ✅ Correct: color must use a callback function and access the original field through d.data.
chart.options({
 type: 'pack',
 data: { value: data },
 encode: {
 value: 'value',
 color: (d) => d.data?.name, // ✅ Color by the node's own name.
 // Or color by parent group, which is often more intuitive:
 // color: (d) => d.path?.[1] || d.data?.name,
 },
});
```

**Why does the string form work for `value: 'value'` but not for `color: 'name'`?**
G2 applies special handling to the `value` channel for hierarchy marks and reads the calculated d3-hierarchy node `.value` property directly. Other channels such as `color` and `shape` use the generic datum field lookup. When the string form is used, G2 reads `datum[field]`; for hierarchy marks, `datum` is the hierarchy node rather than the original data object, so `datum['name']` is `undefined`.

### Error 4: using d.name directly in labels causes undefined

```javascript
// ❌ Error: for pack nodes, original fields are stored in d.data; d.name is undefined.
labels: [
 {
 text: (d) => `${d.name}\n${d.value?.toLocaleString()}`, // ❌ d.name is undefined.
 },
]

// ✅ Correct: access original data fields through d.data.
labels: [
 {
 text: (d) => {
 if (d.height > 0) return ''; // Do not show labels for parent nodes.
 return `${d.data?.name}\n${d.value?.toLocaleString()}`; // ✅
 },
 position: 'inside',
 fontSize: 10,
 fill: '#000',
 },
]
```

**Root cause**: In G2 hierarchy charts, the original data is wrapped as a hierarchy node. The callback parameter `d` is a node object containing built-in fields such as `depth`, `height`, and `value`; the original data object is stored in `d.data`.

### Error 5: confusing data.value with the node's value field

```javascript
// ⚠️ Distinguish two different meanings of value:
// 1. data.value: the value in the data configuration, which can be any supported data source.
// 2. node value field: the leaf node value used to set circle size.

// ✅ Correct understanding.
chart.options({
 type: 'pack',
 data: {
 value: { // This is the data configuration value.
 name: 'root',
 children: [
 { name: 'A', value: 30 }, // This is the node value field.
 ],
 },
 },
 encode: {
 value: 'value', // Map the node value field to circle size.
 },
});
```

---

## Node data access rules (important!)

In hierarchy charts, callback functions such as encode and label callbacks do not receive the original data object directly. The parameter `d` is a d3-hierarchy node wrapped by G2, and the original data is stored in `d.data`.

### Why does `encode.color: 'name'` not work?

**Root cause**: When encode is a string, G2 internally reads `datum[fieldName]`, which accesses the node object's property directly. For hierarchy marks, `datum` is a hierarchy node, not the original data object:

```
d['name'] -> undefined ❌ (the hierarchy node has no name property at the top level)
d.data['name'] -> 'Frontend Team' ✅ (the original data is stored on d.data)
```

**Exception**: `encode.value: 'value'` appears to work because G2 applies special handling to the `value` channel for hierarchy marks and reads the calculated node `value` property directly. Other channels such as `color` and `shape` do not have this special handling, so a string field name reads `datum[field]` and returns `undefined`.

```javascript
// ❌ encode.color: 'name' is internally equivalent to:
const color = datum['name'] // datum is a hierarchy node, so there is no top-level 'name' property.
// Result: all circles use the same color because undefined maps to the default color.

// ✅ Use a callback to access the original field correctly:
const color = datum.data?.['name'] // datum.data is the original data object.
```

### Structure of callback parameter d

```javascript
// d is a d3-hierarchy node with a structure like this:
{
 value: 100, // Node value calculated by summing leaf child values.
 depth: 2, // Level depth, where 0 is the root node.
 height: 0, // Subtree height, where 0 is a leaf node.
 data: { // <- The original data object is here.
 name: 'Frontend Team',
 value: 12,
 category: 'tech',
 // ... Other custom fields.
 },
 path: ['root', 'Technology', 'Frontend'], // Path from the root to the current node.
}
```

### Accessing fields in encode

```javascript
// ❌ Error: string field names do not work for color, shape, and similar channels; they return undefined.
encode: {
 value: 'value', // ✅ The value channel has special handling, so the string form can be used.
 color: 'name', // ❌ Equivalent to d['name'] = undefined, so all circles use the same color.
}

// ✅ Correct: channels other than value should use callback functions.
encode: {
 value: 'value',
 color: (d) => d.data?.name, // ✅ Access the original field through d.data.
}
```

### Accessing fields in labels

```javascript
// ❌ Error: d.name is undefined because the original field is stored in d.data.
labels: [
 {
 text: (d) => `${d.name}\n${d.value}`, // ❌ d.name is undefined.
 },
]

// ✅ Correct: access the original field through d.data.
labels: [
 {
 text: (d) => `${d.data?.name}\n${d.value?.toLocaleString()}`, // ✅
 position: 'inside',
 fontSize: 10,
 fill: '#000',
 },
]
```

### Common access patterns

```javascript
// Original fields such as name, category, and other custom fields must be accessed through d.data.
d.data?.name
d.data?.category
d.data?.type

// Hierarchy-node built-in fields can be accessed directly.
d.value // Node value calculated by summing the child subtree.
d.depth // Level depth, where 0 is the root node.
d.height // Subtree height, where 0 is a leaf node.

// Common coloring strategies.
color: (d) => d.path?.[1] || d.data?.name // Color by second-level parent. Recommended for grouping.
color: (d) => d.depth // Color by level depth.
color: (d) => d.data?.name // Color by current node name.
color: (d) => d.data?.category // Color by a custom field.
color: (d) => d.value // Color by value size.
```

### Complete example with labels

```javascript
chart.options({
 type: 'pack',
 data: { value: data },
 encode: {
 value: 'value',
 color: (d) => d.path?.[1] || d.data?.name,
 },
 style: {
 stroke: '#fff',
 lineWidth: 1,
 fillOpacity: 0.8,
 },
 labels: [
 {
 text: (d) => {
 // Show labels only for leaf nodes (height === 0) to avoid parent label overlap.
 if (d.height > 0) return '';
 return `${d.data?.name}\n${d.value?.toLocaleString()}`;
 },
 position: 'inside',
 fontSize: 10,
 fill: '#000',
 },
 ],
 legend: false,
});
```

### Customizing colors with scale

```javascript
encode: {
 value: 'value',
 color: (d) => d.data?.category,
},
scale: {
 color: {
 type: 'sequential',
 palette: 'blues',
 },
}
```

