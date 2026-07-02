---
id: "g6-combo-overview"
title: "G6 Combo (Combo Node)"
description: |
  Use combos to group and categorize nodes. Combos support collapse/expand, drag movement,
  and nested combos. G6 includes two built-in types: circle-combo and rect-combo.

library: "g6"
version: "5.x"
category: "elements"
subcategory: "combos"
tags:
  - "combo"
  - "combo"
  - "grouping"
  - "collapse"
  - "expand"

related:
  - "g6-node-circle"
  - "g6-behavior-drag-element"
  - "g6-layout-dagre"

use_cases:
  - "Org chart graphs (department grouping)"
  - "Microservice architecture (service grouping)"
  - "Multi-level nested relationship display"

difficulty: "intermediate"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
---

## Core concepts

A **Combo** is a container surrounding a group of nodes or child combos. It is associated through the `combo` field:
- `combo: 'comboId'` in node data means the node belongs to the specified combo
- The combo automatically calculates its size from the elements inside it
- It supports a collapsed state
- **G6 5.x supports using combos as edge sources or targets** (edges can connect to combos)

## Combo data structure

| Property | Description | Type | Default | Required |
|------|------|------|--------|------|
| `id` | Unique combo identifier | `string` | - | yes |
| `type` | Combo type (`circle`/`rect`) | `string` | - | |
| `data` | Business data (such as labels) | `object` | - | |
| `style` | Style configuration (position, collapsed state, etc.) | `object` | - | |
| `combo` | Parent combo ID (for nesting) | `string` | - | |
| `states` | Initial state | `string[]` | - | |

**Important:** The parent combo (the container referenced by other combos) must also be defined in the `combos` array, even if it only has an `id` field.

## Minimal runnable example (rect-combo)

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  data: {
    nodes: [
       { id: 'n1', combo: 'c1', data: { label: 'Frontend A' } },
       { id: 'n2', combo: 'c1', data: { label: 'Frontend B' } },
       { id: 'n3', combo: 'c2', data: { label: 'Backend A' } },
       { id: 'n4', combo: 'c2', data: { label: 'Backend B' } },
       { id: 'n5', combo: 'c2', data: { label: 'Backend C' } },
    ],
    edges: [
       { source: 'n1', target: 'n3' },
       { source: 'n2', target: 'n4' },
    ],
    combos: [
       { id: 'c1', data: { label: 'Frontend Team' } },
       { id: 'c2', data: { label: 'Backend Team' } },
    ],
  },
  node: {
    type: 'circle',
    style: {
      size: 36,
      fill: '#1783FF',
      stroke: '#fff',
      lineWidth: 2,
      labelText: (d) => d.data.label,
      labelPlacement: 'bottom',
    },
  },
  combo: {
    type: 'rect',                      // 'rect' | 'circle'
    style: {
      fill: '#f0f5ff',
      stroke: '#adc6ff',
      lineWidth: 1,
      radius: 8,                       // rounded corners
      padding: 20,                     // inner padding
      labelText: (d) => d.data.label,
      labelPlacement: 'top',
      labelFill: '#1d39c4',
      labelFontWeight: 600,
      // size after collapse
      collapsedSize: [60, 30],
      collapsedFill: '#1783FF',
    },
  },
  layout: { type: 'antv-dagre', rankdir: 'LR', nodesep: 20, ranksep: 60 },
  behaviors: [
    'drag-canvas',
    'zoom-canvas',
    'drag-element',
    {
      type: 'collapse-expand',
      trigger: 'dblclick',           // double-click the combo to collapse/expand
    },
  ],
});

graph.render();
```

## Circle combo (circle-combo)

```javascript
combo: {
  type: 'circle',
  style: {
    fill: '#f0f5ff',
    stroke: '#adc6ff',
    lineWidth: 1,
    padding: 10,
    labelText: (d) => d.data.label,
    labelPlacement: 'top',
  },
},
```

## Nested combo

For nested combos, a child combo specifies its parent combo ID through the `combo` field. **The parent combo must be defined in the `combos` array**:

```javascript
data: {
  combos: [
     { id: 'parent', data: { label: 'Parent Company' } },           // parent combo
     { id: 'child1', combo: 'parent', data: { label: 'Subsidiary A' } },  // child combo
     { id: 'child2', combo: 'parent', data: { label: 'Subsidiary B' } },  // child combo
  ],
  nodes: [
     { id: 'n1', combo: 'child1', data: { label: 'Employee 1' } },
     { id: 'n2', combo: 'child1', data: { label: 'Employee 2' } },
     { id: 'n3', combo: 'child2', data: { label: 'Employee 3' } },
  ],
},
```

## Using combos as edge endpoints

G6 5.x supports using combos as edge sources or targets:

```javascript
data: {
  nodes: [
    { id: 'n1', combo: 'c1' },
    { id: 'n2', combo: 'c2' },
  ],
  edges: [
    { source: 'c1', target: 'n2' },    // from combo to node
    { source: 'c1', target: 'c2' },   // from combo to combo
  ],
  combos: [
    { id: 'c1', data: { label: 'Group 1' } },
    { id: 'c2', data: { label: 'Group 2' } },
  ],
},
```

## Collapse / expand API

```javascript
// collapse combo
await graph.collapseElement('c1');

// expand combo
await graph.expandElement('c1');

// Determine whether it is collapsed
const isCollapsed = graph.isCollapsed('c1');
```

## Initial collapsed state

Set the initial collapsed state of a combo in data:

```javascript
combos: [
  { 
    id: 'c1', 
    data: { label: 'Collapsed Group' },
    style: { collapsed: true }        // initially collapsed
  },
],
```

## Combo style property reference

| Property | Type | Default | Description |
|------|------|--------|------|
| `fill` | `string` | - | Background fill color |
| `stroke` | `string` | - | Border color |
| `lineWidth` | `number` | `1` | Border width |
| `padding` | `number \| number[]` | `10` | Inner padding |
| `radius` | `number` | `0` | Rounded corners (rect combo) |
| `collapsed` | `boolean` | `false` | Whether collapsed |
| `collapsedSize` | `[number, number]` | - | Size after collapse |
| `collapsedFill` | `string` | - | Fill color after collapse |
| `labelText` | `string \| ((d) => string)` | - | Label text |
| `labelPlacement` | `'top' \| 'bottom' \| 'center'` | `'top'` | Label position |

## Common errors and fixes

### Error: Parent combo is mistakenly recognized as a normal node

When parsing mixed data, a parent combo (a container referenced by other combos) may be mistakenly treated as a normal node if it does not have obvious combo characteristics (such as `style.collapsed`). This can cause a `Node not found` error.

```javascript
// Incorrect: combo2 is recognized as a node
const rawData = [
  {"id":"combo1","combo":"combo2"},  // combo1 belongs to combo2
  {"id":"combo2"},                    // parent combo, but may be misidentified as a node
];

// Incorrect parsing logic (causes combo2 to become a node instead of a combo)
const nodes = rawData.filter(item => !item.combo && !item.style?.collapsed);
const combos = rawData.filter(item => item.combo || item.style?.collapsed);

// Correct: first collect all combo IDs, including referenced parent combos
const comboIds = new Set();
rawData.forEach(item => {
  if (item.combo) comboIds.add(item.combo);  // collect parent combo ID
  if (item.style?.collapsed !== undefined || item.combo) {
    comboIds.add(item.id);  // collect explicit combos
  }
});

// Then classify according to comboIds
const nodes = rawData.filter(item => !comboIds.has(item.id));
const combos = rawData.filter(item => comboIds.has(item.id));
```

### Error: Putting business data (labelText) in the combo `style` field instead of the `data` field

```javascript
// Incorrect: the style field is for style overrides (coordinates, size, etc.), not business data storage
combos: [
  { id: 'a', style: { labelText: 'Combo A' } },
],
combo: {
  style: {
    labelText: (d) => d.style.labelText,  // may fail during style calculation
  },
},

// Correct: put business data in the data field
combos: [
  { id: 'a', data: { label: 'Combo A' } },
],
combo: {
  style: {
    labelText: (d) => d.data.label,
  },
},
```

### Error: Using the `radius` property on a circle combo

```javascript
// Incorrect: radius is only valid for rect combos (for rounded corners); circle combo radius is calculated from content
combo: {
  type: 'circle',
  style: { radius: 10 },   // invalid and will not take effect
},

// Correct: use padding to control inner spacing for a circle combo
combo: {
  type: 'circle',
  style: { padding: 10 },
},
```

### Error: The node combo field references a nonexistent combo ID

```javascript
// Incorrect: combo 'cx' is not defined in the combos array
nodes: [{ id: 'n1', combo: 'cx', data: {} }],
combos: [],

// Correct: ensure the combo ID exists
combos: [{ id: 'cx', data: { label: 'Group' } }],
nodes: [{ id: 'n1', combo: 'cx', data: {} }],
```

### Error: An edge references an undefined combo as an endpoint

```javascript
// Incorrect: combo 'c1' is not defined in the combos array, but an edge references it
edges: [{ source: 'c1', target: 'n1' }],
nodes: [{ id: 'n1' }],
combos: [],

// Correct: ensure the combo used as an edge endpoint is defined
combos: [{ id: 'c1', data: { label: 'Group 1' } }],
nodes: [{ id: 'n1' }],
edges: [{ source: 'c1', target: 'n1' }],
```