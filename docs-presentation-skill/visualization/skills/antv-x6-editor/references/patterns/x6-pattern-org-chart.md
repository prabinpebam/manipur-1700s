---
id: "x6-pattern-org-chart"
title: "X6 Org Chart"
description: |
  Best practices for building org charts with X6: tree hierarchy layouts, custom person-card nodes, collapsing and expanding subtrees, and more.

library: "x6"
version: "3.x"
category: "patterns"
subcategory: "org-chart"
tags:
  - "Org chart"
  - "org chart"
  - "Org structure"
  - "Tree diagram"
  - "People relationships"
  - "Hierarchical structure"

related:
  - "x6-intermediate-group"
  - "x6-intermediate-custom-node"
  - "x6-intermediate-layout"
  - "x6-core-edge"

use_cases:
  - "Company org chart display"
  - "Team hierarchy relationships"
  - "Reporting relationship diagram"
  - "Department structure visualization"

difficulty: "intermediate"
completeness: "full"
---

## Scenario Characteristics

Core characteristics of org charts:
- **Tree structure**: Top-to-bottom hierarchy
- **Custom card nodes**: Include information such as name, title, and avatar
- **Vertical edges**: Edges are usually orthogonal or smooth curves from the bottom of a parent node to the top of a child node
- **Collapse/expand**: Subtrees can be collapsed to improve readability when there are many nodes

## Register a Card Node

```javascript
import { Graph } from '@antv/x6';

Graph.registerNode('org-card', {
  inherit: 'rect',
  width: 180,
  height: 70,
  attrs: {
    body: {
      fill: '#fff',
      stroke: '#e8e8e8',
      strokeWidth: 1,
      rx: 8,
      ry: 8,
    },
    label: {
      fontSize: 14,
      fontWeight: 'bold',
      fill: '#333',
      refY: 20,
      refX: 0.5,
    },
  },
  ports: {
    groups: {
      top: {
        position: 'top',
        attrs: { circle: { r: 0 } },  // Hide port circles
      },
      bottom: {
        position: 'bottom',
        attrs: { circle: { r: 0 } },
      },
    },
    items: [
      { id: 'top', group: 'top' },
      { id: 'bottom', group: 'bottom' },
    ],
  },
}, true);
```

## Complete Example

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 1000,
  height: 600,
  background: { color: '#F8FAFC' },
  panning: { enabled: true, modifiers: 'ctrl' },
  mousewheel: { enabled: true, modifiers: 'ctrl' },
  interacting: { nodeMovable: false },  // Org charts usually disable free dragging
});

// Define org data
const orgData = {
  id: 'ceo',
  label: 'CEO\nZhang San',
  children: [
    {
      id: 'cto',
      label: 'CTO\nLi Si',
      children: [
        { id: 'fe-lead', label: 'Frontend Lead\nWang Wu' },
        { id: 'be-lead', label: 'Backend Lead\nZhao Liu' },
      ],
    },
    {
      id: 'cfo',
      label: 'CFO\nSun Qi',
      children: [
        { id: 'finance', label: 'Finance Manager\nZhou Ba' },
      ],
    },
    {
      id: 'coo',
      label: 'COO\nWu Jiu',
    },
  ],
};

// Recursively create nodes and edges
function buildOrgChart(data, parentId, yOffset, xCenter) {
  const node = graph.addNode({
    id: data.id,
    x: xCenter - 90,
    y: yOffset,
    width: 180,
    height: 60,
    label: data.label,
    attrs: {
      body: { fill: '#fff', stroke: '#5B8FF9', strokeWidth: 1.5, rx: 8, ry: 8 },
      label: { fontSize: 13, fill: '#333' },
    },
  });

  if (parentId) {
    graph.addEdge({
      source: { cell: parentId },
      target: { cell: data.id },
      attrs: { line: { stroke: '#A3B1BF', strokeWidth: 1.5, targetMarker: null } },
      router: 'orth',
      connector: 'rounded',
    });
  }

  if (data.children && data.children.length > 0) {
    const childCount = data.children.length;
    const spacing = 220;
    const startX = xCenter - ((childCount - 1) * spacing) / 2;

    data.children.forEach((child, index) => {
      buildOrgChart(child, data.id, yOffset + 120, startX + index * spacing);
    });
  }
}

buildOrgChart(orgData, null, 50, 500);
```

## Use @antv/hierarchy Layout

For complex tree structures, use `@antv/hierarchy` to calculate the layout automatically:

```javascript
import { Graph } from '@antv/x6';
import Hierarchy from '@antv/hierarchy';

const result = Hierarchy.compactBox(orgData, {
  direction: 'TB',  // Top-to-Bottom
  getWidth: () => 180,
  getHeight: () => 60,
  getHGap: () => 40,
  getVGap: () => 60,
});

// result contains the calculated x and y coordinates
function renderTree(node) {
  graph.addNode({
    id: node.id,
    x: node.x,
    y: node.y,
    width: 180,
    height: 60,
    label: node.data.label,
    attrs: { body: { fill: '#fff', stroke: '#5B8FF9', rx: 8, ry: 8 } },
  });

  if (node.children) {
    node.children.forEach((child) => {
      renderTree(child);
      graph.addEdge({
        source: node.id,
        target: child.id,
        attrs: { line: { stroke: '#A3B1BF', targetMarker: null } },
        router: 'orth',
        connector: 'rounded',
      });
    });
  }
}

renderTree(result);
```

## Collapse and Expand Subtrees

```javascript
// Mark whether the node is collapsed
function toggleCollapse(nodeId) {
  const node = graph.getCellById(nodeId);
  const collapsed = node.getData()?.collapsed;

  // Get all descendant nodes and edges
  const descendants = getDescendants(nodeId);

  if (collapsed) {
    // Expand: show descendants
    descendants.forEach((cell) => cell.show());
    node.setData({ collapsed: false });
  } else {
    // Collapse: hide descendants
    descendants.forEach((cell) => cell.hide());
    node.setData({ collapsed: true });
  }
}

function getDescendants(nodeId) {
  const result = [];
  const edges = graph.getEdges().filter((e) => e.getSourceCellId() === nodeId);

  edges.forEach((edge) => {
    result.push(edge);
    const targetId = edge.getTargetCellId();
    const targetNode = graph.getCellById(targetId);
    if (targetNode) {
      result.push(targetNode);
      result.push(...getDescendants(targetId));
    }
  });

  return result;
}

// Double-click a node to collapse/expand
graph.on('node:dblclick', ({ node }) => {
  toggleCollapse(node.id);
});
```

## Best Practices

1. **Orthogonal routing + no arrows**: Org charts usually do not need arrows; set `targetMarker: null`
2. **Disable free dragging**: `interacting: { nodeMovable: false }` keeps the layout tidy
3. **Top-to-bottom layout**: Use `direction: 'TB'` from `@antv/hierarchy`
4. **Use colors to distinguish levels**: Use different colors for different levels
5. **Enable virtual rendering for large organizations**: Configure `virtual: true` for org charts with more than 100 people
