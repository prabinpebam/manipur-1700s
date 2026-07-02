---
id: "x6-intermediate-group"
title: "X6 Groups and Nesting"
description: |
  A configuration guide for parent-child relationships (Group) in X6 nodes.
  Covers grouped nodes, interactive embedding, child-node movement restrictions, automatic parent-node expansion, and expand/collapse behavior.

library: "x6"
version: "3.x"
category: "intermediate"
subcategory: "group"
tags:
  - "groups"
  - "group"
  - "nesting"
  - "parent"
  - "children"
  - "embedding"
  - "grouping"
  - "collapse"
  - "collapse"
  - "expand"
  - "grouping"
  - "restrict"
  - "translating"

related:
  - "x6-core-node"
  - "x6-core-graph-init"
  - "x6-core-events"

use_cases:
  - "Group multiple nodes into one group"
  - "Drag a node into another node to create a parent-child relationship"
  - "Restrict child nodes so they can move only inside the parent node"
  - "Automatically expand the parent node to contain child nodes"
  - "Implement parent-node expansion and collapse"

anti_patterns:
  - "Do not manually set parent/children fields; operate through APIs instead"
  - "Do not forget to enable the embedding option for interactive embedding"
---

# X6 Groups and Nesting

## Basic Concepts

X6 implements grouping through parent-child relationships. When a parent node moves, its child nodes move with it, and edge vertices also move with their common parent node.

## Group Nodes Through APIs

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
});

// Create the parent node
const parent = graph.addNode({
  shape: 'rect',
  x: 40,
  y: 40,
  width: 360,
  height: 200,
  label: 'Parent',
  attrs: {
    body: { fill: '#f5f5f5', stroke: '#d9d9d9', strokeWidth: 1 },
  },
  zIndex: 1,
});

// Create child nodes
const child1 = graph.addNode({
  shape: 'rect',
  x: 80,
  y: 80,
  width: 100,
  height: 40,
  label: 'Child 1',
  attrs: {
    body: { fill: '#fff', stroke: '#8f8f8f', strokeWidth: 1, rx: 6, ry: 6 },
  },
  zIndex: 2,
});

const child2 = graph.addNode({
  shape: 'rect',
  x: 240,
  y: 140,
  width: 100,
  height: 40,
  label: 'Child 2',
  attrs: {
    body: { fill: '#fff', stroke: '#8f8f8f', strokeWidth: 1, rx: 6, ry: 6 },
  },
  zIndex: 2,
});

// Set the parent-child relationship
parent.addChild(child1);
parent.addChild(child2);
```

## Parent-Child Relationship APIs

```javascript
// Add a child node
parent.addChild(childNode);

// Get child nodes
const children = parent.getChildren(); // Cell[] | null

// Get the parent node
const parentNode = child.getParent(); // Cell | null

// Check the relationship
parent.isParentOf(child);  // true
child.isChildOf(parent);   // true

// Get all descendant nodes (recursive)
const descendants = parent.getDescendants();

// Remove a child node (without deleting the node itself)
parent.removeChild(child);

// Embed an edge (set the edge as a child)
parent.addChild(edge);
```

## Interactive Embedding

Embed one node into another as a child by dragging:

```javascript
const graph = new Graph({
  container: 'container',
  embedding: {
    enabled: true,
    // Method for finding parent nodes: when dragging a node, traverse the nodes on the canvas and return the target parent nodes
    findParent({ node }) {
      const bbox = node.getBBox();
      return this.getNodes().filter((candidate) => {
        const targetBBox = candidate.getBBox();
        return bbox.isIntersectWithRect(targetBBox);
      });
    },
  },
});
```

### embedding Options

| Option | Type | Description |
|--------|------|------|
| `enabled` | boolean | Whether to enable embedding |
| `findParent` | Function | Method for finding parent nodes; returns an array of nodes |
| `validate` | Function | Validate whether embedding is allowed |

## Restrict Child Node Movement Range

Restrict child-node movement to the inside of the parent node:

```javascript
const graph = new Graph({
  container: 'container',
  translating: {
    restrict(cellView) {
      const cell = cellView.cell;
      const parentNode = cell.getParent();
      if (parentNode) {
        return parentNode.getBBox();
      }
      return undefined; // No restriction
    },
  },
});
```

## Automatically Expand the Parent Node

Listen for child-node movement events and automatically expand the parent node so it always contains the child nodes:

```javascript
graph.on('node:change:position', ({ node, options }) => {
  if (options.skipParentHandler) return;

  const parentNode = node.getParent();
  if (parentNode) {
    let originSize = parentNode.prop('originSize');
    let originPosition = parentNode.prop('originPosition');
    if (!originSize || !originPosition) {
      originSize = parentNode.getSize();
      originPosition = parentNode.getPosition();
      parentNode.prop('originSize', originSize);
      parentNode.prop('originPosition', originPosition);
    }

    const children = parentNode.getChildren();
    if (children && children.length) {
      // Calculate the bounding box of all child nodes
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      children.filter(child => child.isNode()).forEach((child) => {
        const bbox = child.getBBox();
        minX = Math.min(minX, bbox.x);
        minY = Math.min(minY, bbox.y);
        maxX = Math.max(maxX, bbox.x + bbox.width);
        maxY = Math.max(maxY, bbox.y + bbox.height);
      });

      const padding = 20;
      parentNode.prop(
        {
          position: { x: minX - padding, y: minY - padding },
          size: { width: maxX - minX + 2 * padding, height: maxY - minY + 2 * padding },
        },
        { skipParentHandler: true },
      );
    }
  }
});
```

## Expand and Collapse Parent Nodes

Implement collapsible groups with a custom node:

```javascript
import { Graph } from '@antv/x6';

// Register a collapsible group node
Graph.registerNode(
  'collapsible-group',
  {
    inherit: 'rect',
    width: 200,
    height: 120,
    attrs: {
      body: { fill: '#f5f5f5', stroke: '#d9d9d9', strokeWidth: 1 },
      label: { refX: 10, refY: 10, textAnchor: 'start', textVerticalAnchor: 'top', fontSize: 14 },
    },
  },
  true,
);

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
});

const group = graph.addNode({
  shape: 'collapsible-group',
  x: 40,
  y: 40,
  label: 'Group',
});

const child = graph.addNode({
  shape: 'rect',
  x: 60,
  y: 80,
  width: 100,
  height: 40,
  label: 'Child',
  attrs: { body: { fill: '#fff', stroke: '#8f8f8f', strokeWidth: 1, rx: 6, ry: 6 } },
});

group.addChild(child);

// Toggle the collapsed state
function toggleCollapse(groupNode, collapsed) {
  const children = groupNode.getDescendants();
  children.forEach((cell) => {
    if (collapsed) {
      cell.hide();
    } else {
      cell.show();
    }
  });
  // Adjust the parent node size
  if (collapsed) {
    groupNode.prop('expandedSize', groupNode.getSize());
    groupNode.resize(200, 40);
  } else {
    const size = groupNode.prop('expandedSize');
    if (size) {
      groupNode.resize(size.width, size.height);
    }
  }
}

// Double-click to toggle collapse
graph.on('node:dblclick', ({ node }) => {
  if (node === group) {
    const isCollapsed = node.prop('collapsed') || false;
    node.prop('collapsed', !isCollapsed);
    toggleCollapse(node, !isCollapsed);
  }
});
```

## Collapsible Group Node with a Button

The following is a more complete example showing how to create a group node with a collapse button:

```javascript
import { Graph } from '@antv/x6';

// Register a collapsible group node
Graph.registerNode(
  'collapsable-group',
  {
    inherit: 'rect',
    markup: [
      { tagName: 'rect', selector: 'body' },
      { tagName: 'text', selector: 'label' },
      {
        tagName: 'g',
        selector: 'buttonGroup',
        children: [
          { tagName: 'rect', selector: 'button', attrs: { width: 16, height: 16, rx: 2, ry: 2 } },
          { tagName: 'text', selector: 'buttonSign', attrs: { x: 8, y: 12, textAnchor: 'middle', fontSize: 12 } },
        ],
      },
    ],
    attrs: {
      body: { stroke: '#8f8f8f', strokeWidth: 1, fill: '#e6f7ff', rx: 6, ry: 6 },
      label: { refY: 14, textAnchor: 'middle', textVerticalAnchor: 'top', fontSize: 13 },
      button: { fill: '#fff', stroke: '#8f8f8f', cursor: 'pointer', refX: 8, refY: 8 },
      buttonSign: { fill: '#333', cursor: 'pointer' },
    },
  },
  true,
);

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  background: { color: '#F2F7FA' },
});

const group = graph.addNode({
  shape: 'collapsable-group',
  x: 60,
  y: 40,
  width: 300,
  height: 200,
  label: 'Group (Click to collapse)',
  attrs: {
    buttonSign: { text: '-' },
  },
});

const child1 = graph.addNode({
  shape: 'rect',
  x: 100,
  y: 100,
  width: 80,
  height: 40,
  label: 'Task A',
  attrs: {
    body: { stroke: '#8f8f8f', strokeWidth: 1, fill: '#fff', rx: 6, ry: 6 },
  },
});

const child2 = graph.addNode({
  shape: 'rect',
  x: 240,
  y: 100,
  width: 80,
  height: 40,
  label: 'Task B',
  attrs: {
    body: { stroke: '#8f8f8f', strokeWidth: 1, fill: '#fff', rx: 6, ry: 6 },
  },
});

group.addChild(child1);
group.addChild(child2);

graph.addEdge({
  source: child1,
  target: child2,
  attrs: { line: { stroke: '#8f8f8f', strokeWidth: 1 } },
});

let collapsed = false;
graph.on('node:click', ({ node }) => {
  if (node === group) {
    collapsed = !collapsed;
    const children = group.getChildren();
    if (children) {
      children.forEach((child) => {
        collapsed ? child.hide() : child.show();
      });
    }
    node.attr('buttonSign/text', collapsed ? '+' : '-');
    if (collapsed) {
      node.resize(300, 50);
    } else {
      node.resize(300, 200);
    }
  }
});
```

## Common Errors and Fixes

### ❌ Trying to Drag for Embedding Without Enabling embedding

```javascript
// Error: embedding is not configured, so dragging will not trigger embedding
const graph = new Graph({ container: 'container' });

// Correct: embedding must be enabled
const graph = new Graph({
  container: 'container',
  embedding: { enabled: true },
});
```

### ❌ Manually Setting parent/children Fields

```javascript
// Error: directly operating on internal fields
node.prop('parent', parentId);

// Correct: use APIs
parentNode.addChild(childNode);
```

### ❌ Incorrectly Using Shape.Group.define or a Nonexistent API

```javascript
// Error: using a nonexistent API
Shape.Group.define('collapsable-group', { ... });

// Correct: use Graph.registerNode to register a custom node
Graph.registerNode('collapsable-group', { ... }, true);
```

### ❌ Incorrect Collapse Logic That Does Not Properly Update Button State and Size

```javascript
// Error: button text and node size are not updated correctly
graph.on('node:click', ({ node }) => {
  if (node.shape === 'collapsable-group') {
    const collapsed = !node.prop('collapsed');
    node.prop('collapsed', collapsed);
    
    if (collapsed) {
      node.getChildren().forEach((child) => child.hide());
    } else {
      node.getChildren().forEach((child) => child.show());
    }
  }
});

// Correct: fully handle collapsed state, button text, and node size
let collapsed = false;
graph.on('node:click', ({ node }) => {
  if (node === group) {
    collapsed = !collapsed;
    const children = group.getChildren();
    if (children) {
      children.forEach((child) => {
        collapsed ? child.hide() : child.show();
      });
    }
    node.attr('buttonSign/text', collapsed ? '+' : '-');
    if (collapsed) {
      node.resize(300, 50);
    } else {
      node.resize(300, 200);
    }
  }
});
```

</skill>