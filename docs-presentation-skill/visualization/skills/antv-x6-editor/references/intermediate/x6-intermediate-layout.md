---
id: "x6-intermediate-layout"
title: "X6 Layout"
description: |
  A complete guide to implementing graph layouts in X6 with @antv/layout and @antv/hierarchy.
  Covers Dagre (directed graphs), Grid, Circle, Force-directed layouts, tree layouts, and mind map layouts.

library: "x6"
version: "3.x"
category: "intermediate"
subcategory: "layout"
tags:
  - "layout"
  - "layout"
  - "dagre"
  - "grid"
  - "circle"
  - "force"
  - "tree"
  - "tree"
  - "mindmap"
  - "mind map"
  - "hierarchy"
  - "@antv/layout"
  - "@antv/hierarchy"
  - "rankdir"
  - "automatic arrangement"

related:
  - "x6-core-graph-init"
  - "x6-core-node"
  - "x6-core-edge"
  - "x6-pattern-dag"

use_cases:
  - "Apply automatic hierarchical layout to DAG nodes"
  - "Arrange nodes in a grid"
  - "Arrange nodes in a circle"
  - "Use a force-directed algorithm for automatic layout"
  - "Automatically lay out tree hierarchies"
  - "Mind Map Layout"

anti_patterns:
  - "Layout algorithms do not automatically add nodes to the canvas; you need to manually call graph.fromJSON()"
  - "Do not confuse @antv/layout with X6's built-in port-layout"
---

# X6 Layout

X6 itself does not include built-in graph layout algorithms. Instead, it uses `@antv/layout` (general layouts) and `@antv/hierarchy` (tree layouts) to calculate node positions, then renders them with `graph.fromJSON()`.

## Install Dependencies

```bash
# General layouts (dagre, grid, circle, force, etc.)
npm install @antv/layout dagre

# Tree layouts (mind maps, compact trees, etc.)
npm install @antv/hierarchy
```

## Dagre Layout (Directed Graphs/DAGs)

The most commonly used hierarchical layout, suitable for flowcharts and DAG data pipelines.

```javascript
import { Graph } from '@antv/x6';
import { DagreLayout } from '@antv/layout';

// Prepare data
const data = {
  nodes: [
    { id: '1', shape: 'rect', width: 100, height: 40, label: 'Start', attrs: { body: { fill: '#fff', stroke: '#8f8f8f', strokeWidth: 1, rx: 6, ry: 6 } } },
    { id: '2', shape: 'rect', width: 100, height: 40, label: 'Process', attrs: { body: { fill: '#fff', stroke: '#8f8f8f', strokeWidth: 1, rx: 6, ry: 6 } } },
    { id: '3', shape: 'rect', width: 100, height: 40, label: 'End', attrs: { body: { fill: '#fff', stroke: '#8f8f8f', strokeWidth: 1, rx: 6, ry: 6 } } },
  ],
  edges: [
    { source: '1', target: '2', attrs: { line: { stroke: '#8f8f8f', strokeWidth: 1, targetMarker: 'classic' } } },
    { source: '2', target: '3', attrs: { line: { stroke: '#8f8f8f', strokeWidth: 1, targetMarker: 'classic' } } },
  ],
};

// Run layout calculation
const dagreLayout = new DagreLayout({
  type: 'dagre',
  rankdir: 'TB',    // Layout direction: TB (top to bottom) | BT | LR (left to right) | RL
  align: 'UL',     // Alignment: UL | UR | DL | DR
  ranksep: 50,     // Layer spacing
  nodesep: 30,     // Spacing between nodes in the same layer
});

const model = dagreLayout.layout(data);

// Render to the canvas
const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  background: { color: '#F2F7FA' },
});

graph.fromJSON(model);
graph.centerContent();
```

### Dagre Options

| Option | Type | Default | Description |
|--------|------|--------|------|
| `rankdir` | string | `'TB'` | Layout direction: `'TB'`/`'BT'`/`'LR'`/`'RL'` |
| `align` | string | `'UL'` | Node alignment: `'UL'`/`'UR'`/`'DL'`/`'DR'` |
| `nodesep` | number | 50 | Spacing between nodes in the same layer |
| `ranksep` | number | 50 | Layer spacing |
| `controlPoints` | boolean | false | Whether to preserve edge control points |

## Grid Layout

Arrange nodes in a grid.

```javascript
import { Graph } from '@antv/x6';
import { GridLayout } from '@antv/layout';

const data = {
  nodes: Array.from({ length: 12 }, (_, i) => ({
    id: `${i + 1}`,
    shape: 'circle',
    width: 32,
    height: 32,
    label: `${i + 1}`,
    attrs: { body: { fill: '#5F95FF', stroke: 'transparent' }, label: { fill: '#fff' } },
  })),
  edges: [],
};

const gridLayout = new GridLayout({
  type: 'grid',
  width: 600,
  height: 400,
  rows: 3,
  cols: 4,
});

const model = gridLayout.layout(data);

const graph = new Graph({ container: 'container' });
graph.fromJSON(model);
```

## Circle Layout

Arrange nodes in a circle.

```javascript
import { Graph } from '@antv/x6';
import { CircularLayout } from '@antv/layout';

const circularLayout = new CircularLayout({
  type: 'circular',
  width: 600,
  height: 600,
  radius: 200,
});

const model = circularLayout.layout(data);

const graph = new Graph({ container: 'container' });
graph.fromJSON(model);
```

## Force Layout

A force-directed layout based on physics simulation.

```javascript
import { Graph } from '@antv/x6';
import { ForceLayout } from '@antv/layout';

const forceLayout = new ForceLayout({
  type: 'force',
  width: 800,
  height: 600,
  preventOverlap: true,
  nodeStrength: -50,
  edgeStrength: 0.1,
});

const model = forceLayout.layout(data);

const graph = new Graph({ container: 'container' });
graph.fromJSON(model);
```

## Tree Layouts (@antv/hierarchy)

Suitable for hierarchical data, such as organizational charts and mind maps.

### Mind Map Layout

```javascript
import { Graph } from '@antv/x6';
import Hierarchy from '@antv/hierarchy';

// Tree data structure
const treeData = {
  id: 'root',
  label: 'Central Topic',
  children: [
    {
      id: 'c1',
      label: 'Branch 1',
      children: [
        { id: 'c1-1', label: 'Subtopic 1-1' },
        { id: 'c1-2', label: 'Subtopic 1-2' },
      ],
    },
    {
      id: 'c2',
      label: 'Branch 2',
      children: [
        { id: 'c2-1', label: 'Subtopic 2-1' },
      ],
    },
  ],
};

// Calculate layout
const result = Hierarchy.mindmap(treeData, {
  direction: 'H',      // H (horizontal) | V (vertical)
  getHeight() { return 30; },
  getWidth() { return 100; },
  getHGap() { return 60; },
  getVGap() { return 20; },
  getSide() { return 'right'; },
});

// Traverse the layout result and convert it to the X6 data format
const model = { nodes: [], edges: [] };

function traverse(node) {
  model.nodes.push({
    id: node.id,
    x: node.x + 400,  // Offset to the canvas center
    y: node.y + 300,
    shape: 'rect',
    width: 100,
    height: 30,
    label: node.data.label || node.id,
    attrs: { body: { fill: '#fff', stroke: '#8f8f8f', strokeWidth: 1, rx: 4, ry: 4 } },
  });
  if (node.children) {
    node.children.forEach((child) => {
      model.edges.push({
        source: node.id,
        target: child.id,
        connector: 'smooth',
        attrs: { line: { stroke: '#A2B1C3', strokeWidth: 1, targetMarker: null } },
      });
      traverse(child);
    });
  }
}

traverse(result);

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  connecting: { connector: 'smooth' },
});

graph.fromJSON(model);
graph.centerContent();
```

### Compact Tree Layout

```javascript
import Hierarchy from '@antv/hierarchy';

const result = Hierarchy.compactBox(treeData, {
  direction: 'TB',     // TB | BT | LR | RL | H | V
  getHeight() { return 30; },
  getWidth() { return 100; },
  getHGap() { return 40; },
  getVGap() { return 20; },
});
```

## @antv/hierarchy Layout Algorithm List

| Algorithm | Method | Use Case |
|------|------|----------|
| Compact tree | `Hierarchy.compactBox(data, options)` | Organizational charts and file trees |
| mind map | `Hierarchy.mindmap(data, options)` | mind map |
| Indented tree | `Hierarchy.indented(data, options)` | Directory structures |
| tree | `Hierarchy.dendrogram(data, options)` | Phylogenetic trees |

## Dynamic Layout (Relayout After Data Changes)

```javascript
// Relayout after adding a new node
function relayout() {
  const currentData = graph.toJSON();
  const newModel = dagreLayout.layout(currentData);
  graph.fromJSON(newModel);
  graph.centerContent();
}
```

## Common Errors

### ❌ Using data Directly After Layout Without Calling fromJSON

```javascript
// Error: layout only calculates positions and does not render automatically
const model = dagreLayout.layout(data);
// Nothing appears on the canvas

// Correct: manual rendering is required
const model = dagreLayout.layout(data);
graph.fromJSON(model);
```

### ❌ DagreLayout Errors Because the dagre Dependency Is Not Installed

```bash
# Error: @antv/layout's DagreLayout depends on the dagre package
# Error: Cannot find module 'dagre'

# Correct: install both packages
npm install @antv/layout dagre
```
