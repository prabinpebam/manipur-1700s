---
id: x6-imperative-api
title: Complete Guide to the X6 Imperative API
description: |
  Complete guide to the X6 3.x imperative API: canvas creation, node and edge operations, grid configuration, edge labels, event interactions,
  plugin system, export features, custom node registration, drag restrictions, highlighting configuration, and other core usage patterns.
library: x6
version: 3.x
category: basic
tags:
  - x6
  - imperative
  - node
  - edge
  - grid
  - plugin
  - interaction
  - export
  - register-node
  - history
  - snapline
  - selection
  - port
  - highlighting

related:
  - x6-core-graph-init
  - x6-core-node
  - x6-core-edge
  - x6-plugins

use_cases:
  - "Create nodes and edges with the imperative API"
  - "Configure the canvas grid and background"
  - "Add edge labels at multiple positions"
  - "Implement node-click selection interactions"
  - "Use plugins to implement undo and redo"
  - "Export the canvas as PNG/SVG"
  - "Register custom nodes and configure ports"
  - "Restrict node drag direction"
  - "Configure port highlighting effects"

difficulty: beginner
---

## Overview

When users request using X6 to draw charts, display relationships, or implement canvas interactions, you **must output complete, runnable JavaScript code**. Core workflow:

1. Import `Graph` and the required plugins from `@antv/x6`
2. Create a canvas instance with `new Graph({ container: 'container', ... })`
3. Build content with `graph.addNode()` / `graph.addEdge()`
4. If plugins are needed, register them with `graph.use(new Plugin(options))`
5. If interactions are needed, bind events with `graph.on()`

## Minimal Runnable Example

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 400,
  background: { color: '#F2F7FA' },
  grid: { visible: true, size: 10, type: 'dot' },
});

const source = graph.addNode({
  shape: 'rect',
  x: 40,
  y: 100,
  width: 80,
  height: 40,
  label: 'Source',
  attrs: {
    body: { stroke: '#8f8f8f', strokeWidth: 1, fill: '#fff', rx: 6, ry: 6 },
  },
});

const target = graph.addNode({
  shape: 'rect',
  x: 200,
  y: 100,
  width: 80,
  height: 40,
  label: 'Target',
  attrs: {
    body: { stroke: '#8f8f8f', strokeWidth: 1, fill: '#fff', rx: 6, ry: 6 },
  },
});

graph.addEdge({
  source,
  target,
  attrs: { line: { stroke: '#8f8f8f', strokeWidth: 1 } },
});
```

## Core API

### 1. Adding Nodes and Edges

`source`/`target` can accept a node instance, a node ID string, or an object such as `{ cell: node, port: 'portId' }`.

```javascript
const nodeA = graph.addNode({
  shape: 'rect',
  x: 40,
  y: 100,
  width: 80,
  height: 40,
  label: 'A',
  attrs: {
    body: { stroke: '#8f8f8f', strokeWidth: 1, fill: '#fff', rx: 6, ry: 6 },
  },
});

const nodeB = graph.addNode({
  shape: 'rect',
  x: 200,
  y: 100,
  width: 80,
  height: 40,
  label: 'B',
  attrs: {
    body: { stroke: '#8f8f8f', strokeWidth: 1, fill: '#fff', rx: 6, ry: 6 },
  },
});

graph.addEdge({
  source: nodeA,
  target: nodeB,
  attrs: { line: { stroke: '#8f8f8f', strokeWidth: 1 } },
});
```

### 2. Canvas Grid Configuration

```javascript
const graph = new Graph({
  container: 'container',
  background: { color: '#F2F7FA' },
  grid: {
    visible: true,
    size: 10,
    type: 'dot', // 'dot' | 'fixedDot' | 'mesh'
    args: { color: '#a0a0a0', thickness: 2 },
  },
});
```

### 3. Multiple Edge Labels

Use the `labels` array to add labels at different positions on an edge. The `position` value ranges from 0 to 1.

```javascript
graph.addEdge({
  source,
  target,
  attrs: { line: { stroke: '#8f8f8f', strokeWidth: 1 } },
  labels: [
    {
      position: 0.1,
      attrs: {
        label: { text: 'Begin', fill: '#333' },
        rect: { fill: '#f0f0f0', stroke: '#ddd' },
      },
    },
    {
      position: 0.5,
      attrs: {
        label: { text: 'Middle', fill: '#333' },
        rect: { fill: '#e6f7ff', stroke: '#91d5ff' },
      },
    },
    {
      position: 0.9,
      attrs: {
        label: { text: 'End', fill: '#333' },
        rect: { fill: '#f6ffed', stroke: '#b7eb8f' },
      },
    },
  ],
});
```

### 4. Event Interactions and Dynamic Styles

Use `node.attr('path/prop', value)` to dynamically modify styles.

```javascript
let selectedNode = null;

graph.on('node:click', ({ node }) => {
  if (selectedNode) {
    selectedNode.attr('body/stroke', '#8f8f8f');
    selectedNode.attr('body/strokeWidth', 1);
  }
  node.attr('body/stroke', '#1890ff');
  node.attr('body/strokeWidth', 3);
  selectedNode = node;
});

graph.on('blank:click', () => {
  if (selectedNode) {
    selectedNode.attr('body/stroke', '#8f8f8f');
    selectedNode.attr('body/strokeWidth', 1);
    selectedNode = null;
  }
});
```

### 5. Node Visibility

```javascript
const node = graph.addNode({ shape: 'rect', x: 60, y: 140, width: 100, height: 40, label: 'Hidden' });
node.hide();
node.show();
```

### 6. Plugin System

Import plugin classes from `@antv/x6` and register them with `graph.use()`. After registration, convenience methods are automatically mounted on `graph`.

```javascript
import { Graph, History, Snapline, Selection, Export } from '@antv/x6';

const graph = new Graph({ container: 'container' });

// Register plugins
graph.use(new History({ enabled: true }));
graph.use(new Snapline({ enabled: true }));
graph.use(new Selection({ enabled: true, rubberband: true, showNodeSelectionBox: true }));
graph.use(new Export());

// History events
graph.on('history:change', () => {
  console.log('Can Undo:', graph.canUndo());
  console.log('Can Redo:', graph.canRedo());
});

// Dynamically enable/disable
graph.disableSnapline();
graph.enableSnapline();
graph.disableSelection();
graph.enableSelection();
```

### 7. Exporting the Canvas

Register the Export plugin first, then call an export method.

```javascript
import { Graph, Export } from '@antv/x6';

const graph = new Graph({ container: 'container' });
graph.use(new Export());

graph.toPNG((dataUri) => {
  console.log('PNG exported:', dataUri.substring(0, 50) + '...');
});
```

### 8. Custom Node Registration and Ports

```javascript
Graph.registerNode(
  'lineage-node',
  {
    inherit: 'rect',
    width: 140,
    height: 40,
    attrs: {
      body: { stroke: '#8f8f8f', strokeWidth: 1, fill: '#fff', rx: 4, ry: 4 },
    },
    ports: {
      groups: {
        in: {
          position: 'left',
          attrs: { circle: { magnet: true, stroke: '#8f8f8f', r: 4, fill: '#fff' } },
        },
        out: {
          position: 'right',
          attrs: { circle: { magnet: true, stroke: '#8f8f8f', r: 4, fill: '#fff' } },
        },
      },
    },
  },
  true,
);

const src = graph.addNode({
  shape: 'lineage-node',
  x: 40,
  y: 40,
  label: 'ods_user',
  ports: { items: [{ id: 'out1', group: 'out' }] },
});

const dst = graph.addNode({
  shape: 'lineage-node',
  x: 260,
  y: 80,
  label: 'dwd_order_detail',
  ports: { items: [{ id: 'in1', group: 'in' }, { id: 'out1', group: 'out' }] },
});

graph.addEdge({
  source: { cell: src, port: 'out1' },
  target: { cell: dst, port: 'in1' },
  connector: 'smooth',
  attrs: { line: { stroke: '#8f8f8f', strokeWidth: 1 } },
});
```

### 9. Drag Restrictions

Return `{ x, y, width, height }` through `translating.restrict` to limit the movement area. `width: 1` means movement is only vertical.

```javascript
const graph = new Graph({
  container: 'container',
  background: { color: '#F2F7FA' },
  translating: {
    restrict(cellView) {
      return { x: 100, y: 0, width: 1, height: 400 };
    },
  },
});
```

### 10. Highlighting Effects and Edge Connection Interactions

Use `highlighting` together with `connecting` to implement port highlighting.

```javascript
const graph = new Graph({
  container: 'container',
  highlighting: {
    magnetAvailable: {
      name: 'stroke',
      args: { attrs: { fill: '#fff', stroke: '#47C769' } },
    },
    magnetAdsorbed: {
      name: 'stroke',
      args: { attrs: { fill: '#fff', stroke: '#31d0c6' } },
    },
  },
  connecting: {
    allowBlank: false,
    createEdge() {
      return this.createEdge({
        attrs: { line: { stroke: '#8f8f8f', strokeWidth: 1 } },
      });
    },
  },
});
```

## Common Errors and Fixes

| Error Pattern | Fix |
|---------|---------|
| **No code generated** | You must output complete code: `import` -> `new Graph()` -> `addNode` -> `addEdge` |
| **Missing Graph instantiation** | Always start with `new Graph({ container: 'container' })` |
| **Confusing IDs and instances for edge connections** | Prefer using node instances directly; if using string IDs, make sure the nodes have matching `id` values |
| **Custom node not registered** | Call `Graph.registerNode('name', config, true)` before use |
| **Plugin not imported or not enabled** | Import from `@antv/x6`, use `new Plugin({ enabled: true })` + `graph.use()` |
| **Incorrect style modification syntax** | Use `node.attr('body/stroke', '#1890ff')` instead of direct assignment |
| **Using `new Node()` / `new Edge()`** | Use `graph.addNode()` / `graph.addEdge()` instead |
| **Calling `graph.render()`** | The imperative API renders automatically; no manual call is needed |
| **Using `new Edge()` in `connecting.createEdge`** | Use `this.createEdge({ ... })` instead |
| **Incorrect return format from `translating.restrict`** | Must return `{ x, y, width, height }` |
| **Using deprecated highlighting options** | Use `magnetAvailable` / `magnetAdsorbed`, not `nodeHover` / `magnetHover` |
| **Export plugin not registered before export** | Call `graph.use(new Export())` before calling `graph.toPNG()` |
