---
id: g6-mds-layout-cluster-graph
title: G6 MDS Layout Cluster Graph Visualization
description: Use the G6 MDS (Multidimensional Scaling) layout to build graph visualizations. Nodes display different colors based on the cluster field, with interactions such as canvas zooming, panning, and element dragging. Covers data format requirements, node style mapping, palette configuration, and common error fixes.
library: G6
version: 5.x
category: layout
tags:
  - mds
  - Layout
  - Cluster
  - Graph
  - Interaction
  - Palette
  - palette
---

# G6 MDS Layout Cluster Graph Visualization

## Overview

The MDS (Multidimensional Scaling) layout builds a distance matrix between nodes and reconstructs their relative distances from high-dimensional space as accurately as possible in two dimensions. It is suitable for showing similarity or structural relationships between nodes.

This skill explains how to:
1. Correctly organize the G6 graph data format (top-level `nodes` + `edges` structure)
2. Configure the MDS layout
3. Use `palette` to automatically map colors based on each node's `cluster` field
4. Enable interactions such as canvas zooming, panning, and element dragging

---

## Key points

### 1. Data format

The G6 `data` option must contain top-level `nodes` and `edges` arrays. **Do not pass a node array directly**:

```js
// ✅ Correct
const graph = new Graph({
  data: {
    nodes: [ { id: '0', data: { cluster: 'a' } }, ... ],
    edges: [ { source: '0', target: '1' }, ... ],
  },
});

// ❌ Error -- pass a node array directly
const graph = new Graph({
  data: [ { id: '0', data: { cluster: 'a' } }, ... ],
});
```

### 2. MDS layout configuration

```js
layout: {
  type: 'mds',
  linkDistance: 100,  // Ideal distance between nodes; default is 50
  // center is optional; default is [0, 0]
}
```

### 3. Map node colors by cluster (palette)

Use `node.palette` to automatically assign colors based on node data fields, without manually enumerating colors for each cluster:

```js
node: {
  palette: {
    field: 'cluster',   // Group by the data.cluster field
    color: 'tableau',   // Use a built-in palette, or pass a color array
  },
}
```

### 4. Built-in behaviors

| Behavior name         | Description             |
| ---------------- | ---------------- |
| `drag-canvas`    | Drag canvas         |
| `zoom-canvas`    | Mouse-wheel canvas zoom     |
| `drag-element`   | Drag nodes/edges      |

```js
behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
```

---

## Minimal runnable example

```js
import { Graph } from '@antv/g6';

const data = {
  nodes: [
    { id: '0',  data: { cluster: 'a' } },
    { id: '1',  data: { cluster: 'a' } },
    { id: '2',  data: { cluster: 'a' } },
    { id: '3',  data: { cluster: 'a' } },
    { id: '4',  data: { cluster: 'a' } },
    { id: '5',  data: { cluster: 'a' } },
    { id: '6',  data: { cluster: 'a' } },
    { id: '7',  data: { cluster: 'a' } },
    { id: '8',  data: { cluster: 'a' } },
    { id: '9',  data: { cluster: 'a' } },
    { id: '10', data: { cluster: 'a' } },
    { id: '11', data: { cluster: 'a' } },
    { id: '12', data: { cluster: 'a' } },
    { id: '13', data: { cluster: 'b' } },
    { id: '14', data: { cluster: 'b' } },
    { id: '15', data: { cluster: 'b' } },
    { id: '16', data: { cluster: 'b' } },
    { id: '17', data: { cluster: 'b' } },
    { id: '18', data: { cluster: 'c' } },
    { id: '19', data: { cluster: 'c' } },
    { id: '20', data: { cluster: 'c' } },
    { id: '21', data: { cluster: 'c' } },
    { id: '22', data: { cluster: 'c' } },
    { id: '23', data: { cluster: 'c' } },
    { id: '24', data: { cluster: 'c' } },
    { id: '25', data: { cluster: 'c' } },
    { id: '26', data: { cluster: 'c' } },
    { id: '27', data: { cluster: 'c' } },
    { id: '28', data: { cluster: 'c' } },
    { id: '29', data: { cluster: 'c' } },
    { id: '30', data: { cluster: 'c' } },
    { id: '31', data: { cluster: 'd' } },
    { id: '32', data: { cluster: 'd' } },
    { id: '33', data: { cluster: 'd' } },
  ],
  edges: [
    { source: '0',  target: '1'  },
    { source: '0',  target: '2'  },
    { source: '0',  target: '3'  },
    { source: '0',  target: '4'  },
    { source: '0',  target: '5'  },
    { source: '0',  target: '7'  },
    { source: '0',  target: '8'  },
    { source: '0',  target: '9'  },
    { source: '0',  target: '10' },
    { source: '0',  target: '11' },
    { source: '0',  target: '13' },
    { source: '0',  target: '14' },
    { source: '0',  target: '15' },
    { source: '0',  target: '16' },
    { source: '2',  target: '3'  },
    { source: '4',  target: '5'  },
    { source: '4',  target: '6'  },
    { source: '5',  target: '6'  },
    { source: '7',  target: '13' },
    { source: '8',  target: '14' },
    { source: '9',  target: '10' },
    { source: '10', target: '22' },
    { source: '10', target: '14' },
    { source: '10', target: '12' },
    { source: '10', target: '24' },
    { source: '10', target: '21' },
    { source: '10', target: '20' },
    { source: '11', target: '24' },
    { source: '11', target: '22' },
    { source: '11', target: '14' },
    { source: '12', target: '13' },
    { source: '16', target: '17' },
    { source: '16', target: '18' },
    { source: '16', target: '21' },
    { source: '16', target: '22' },
    { source: '17', target: '18' },
    { source: '17', target: '20' },
    { source: '18', target: '19' },
    { source: '19', target: '20' },
    { source: '19', target: '33' },
    { source: '19', target: '22' },
    { source: '19', target: '23' },
    { source: '20', target: '21' },
    { source: '21', target: '22' },
    { source: '22', target: '24' },
    { source: '22', target: '25' },
    { source: '22', target: '26' },
    { source: '22', target: '23' },
    { source: '22', target: '28' },
    { source: '22', target: '30' },
    { source: '22', target: '31' },
    { source: '22', target: '32' },
    { source: '22', target: '33' },
    { source: '23', target: '28' },
    { source: '23', target: '27' },
    { source: '23', target: '29' },
    { source: '23', target: '30' },
    { source: '23', target: '31' },
    { source: '23', target: '33' },
    { source: '32', target: '33' },
  ],
};

const graph = new Graph({
  container: 'container',
  autoFit: 'view',
  padding: 20,
  data,
  node: {
    style: {
      labelText: (d) => d.id,
      labelFill: '#fff',
      labelPlacement: 'center',
      labelFontSize: 10,
    },
    // Automatically assign colors based on the cluster field
    palette: {
      field: 'cluster',
      color: 'tableau',
    },
  },
  layout: {
    type: 'mds',
    nodeSize: 32,
    linkDistance: 100,
  },
  behaviors: ['drag-element', 'drag-canvas', 'zoom-canvas'],
});

graph.render();
```

---

## Complete configuration notes

### Graph options

| Option      | Description                                         | Type                    | Example value                              |
| ----------- | -------------------------------------------- | ----------------------- | ----------------------------------- |
| `container` | DOM id or HTMLElement of the mount container             | `string \| HTMLElement` | `'container'`                       |
| `autoFit`   | Automatically fit the viewport; `'view'` means zoom until everything is visible    | `'view' \| 'center'`    | `'view'`                            |
| `padding`   | Padding used when fitting (pixels)                     | `number \| number[]`    | `20`                                |
| `data`      | Graph data, which must contain top-level `nodes` and `edges` fields | `GraphData`             | `{ nodes: [...], edges: [...] }`    |
| `node`      | Global node configuration (styles, palettes, and more)                 | `NodeOptions`           | See below                              |
| `layout`    | Layout algorithm configuration                                 | `LayoutOptions`         | `{ type: 'mds', linkDistance: 100 }`|
| `behaviors` | Behavior list                                 | `string[]`              | `['drag-element', 'drag-canvas', 'zoom-canvas']` |

### MDS layout options

| Option         | Description                         | Type     | Default value |
| -------------- | ---------------------------- | -------- | ------ |
| `type`         | Layout type, Fixed to `'mds'`     | `string` | -      |
| `linkDistance` | Ideal distance between nodes               | `number` | `50`   |
| `center`       | Layout center coordinates `[x, y]`        | `number[]` | `[0, 0]` |

### Node palette options

| Option  | Description                                                   | Type                    | Example value      |
| ------- | ------------------------------------------------------ | ----------------------- | ----------- |
| `field` | Data field name used for grouping (corresponds to the field in `node.data`)      | `string`                | `'cluster'` |
| `color` | Palette name or color array                                     | `string \| string[]`    | `'tableau'` |

---

## Common errors and fixes

### Error 1: Passing a node array directly instead of a GraphData object

**ErrorCause**:The reference data in the query description is a node array (for example, `[{"id":"0","data":{"cluster":"a"}},...]`). The LLM might assign it directly to `data`, causing G6 to fail to recognize the data format.

```js
// ❌ Incorrect approach -- data is directly a node array
const graph = new Graph({
  data: [
    { id: '0', data: { cluster: 'a' } },
    { id: '1', data: { cluster: 'a' } },
    // ...
  ],
});
```

```js
// ✅ Correct approach -- data must be an object containing nodes/edges
const graph = new Graph({
  data: {
    nodes: [
      { id: '0', data: { cluster: 'a' } },
      { id: '1', data: { cluster: 'a' } },
      // ...
    ],
    edges: [
      { source: '0', target: '1' },
      // ...
    ],
  },
});
```

### Error 2: Hard-coding node colors instead of using palette mapping

**ErrorCause**:Manually checking cluster values with `if/switch` in `style.fill` makes the code redundant and harder to maintain.

```js
// ❌ Not recommended -- manually enumerate colors
node: {
  style: {
    fill: (d) => {
      if (d.data.cluster === 'a') return '#5B8FF9';
      if (d.data.cluster === 'b') return '#61DDAA';
      if (d.data.cluster === 'c') return '#F6BD16';
      return '#CCC';
    },
  },
},
```

```js
// ✅ Recommended -- use palette for automatic mapping
node: {
  palette: {
    field: 'cluster',   // Specify the grouping field
    color: 'tableau',   // Use a built-in palette
  },
},
```

### Error 3: Missing the edges field causes abnormal layout behavior

**ErrorCause**:The MDS layout relies on edge connections to build the distance matrix. If `edges` is missing from `data`, the layout can degrade into a random distribution.

```js
// ❌ Error -- Missing edges
const graph = new Graph({
  data: {
    nodes: [ ... ],
    // No edges provided
  },
  layout: { type: 'mds' },
});
```

```js
// ✅ Correct -- provide complete nodes and edges
const graph = new Graph({
  data: {
    nodes: [ ... ],
    edges: [ { source: '0', target: '1' }, ... ],
  },
  layout: { type: 'mds', linkDistance: 100 },
});
```

### Error 4: Labels appear outside nodes instead of centered

**ErrorCause**:The default `labelPlacement` is `'bottom'`. To display labels inside nodes, explicitly set it to `'center'` and adjust `labelFill` for readability.

```js
// ❌ Label appears below the node (default behavior)
node: {
  style: {
    labelText: (d) => d.id,
  },
},
```

```js
// ✅ Label centered inside the node
node: {
  style: {
    labelText: (d) => d.id,
    labelPlacement: 'center',  // Center the label
    labelFill: '#fff',          // White text, contrasting with the node fill color
    labelFontSize: 10,
  },
},
```

---

## Extension: dynamically switch layouts

To switch to another layout at runtime (such as Force), use `graph.setLayout`:

```js
// Switch to a force-directed layout
graph.setLayout({
  type: 'force',
  gravity: 10,
  linkDistance: 80,
});
await graph.layout();
```

---

## Reference documentation

- [MDS layout documentation](/manual/layout/mds-layout)
- [Layout overview](/manual/layout/overview)
- [General node options](/manual/element/node/base-node)
- [Graph data format](/manual/data)
- [Graph options](/manual/graph/option)