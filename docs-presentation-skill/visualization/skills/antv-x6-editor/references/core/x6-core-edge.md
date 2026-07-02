---
id: "x6-core-edge"
title: "X6 edge configuration and styling"
description: |
  Creating X6 edges and configuring routers, connectors, arrows, labels, and vertices.
  Includes usage of routers and connectors such as orth/manhattan/smooth/rounded.

library: "x6"
version: "3.x"
category: "core"
subcategory: "edge"
tags:
  - "edge"
  - "edge"
  - "connection"
  - "router"
  - "router"
  - "connector"
  - "connector"
  - "arrow"
  - "marker"
  - "targetMarker"
  - "label"
  - "label"
  - "vertices"
  - "orth"
  - "manhattan"
  - "smooth"
  - "rounded"
  - "strokeDasharray"
  - "dashed line"

related:
  - "x6-core-node"
  - "x6-core-ports"
  - "x6-core-graph-init"

use_cases:
  - "Create connections between nodes"
  - "Set an edge's router and connector"
  - "Configure edge arrow styles"
  - "Add text labels to edges"
  - "Create dashed / curved edges"
  - "Set intermediate vertices for an edge"

anti_patterns:
  - "Do not confuse the roles of router and connector"
  - "Do not omit source/target"

difficulty: "beginner"
completeness: "full"
---

## Add edges

```javascript
// Method 1: pass node instances
graph.addEdge({ source: sourceNode, target: targetNode });

// Method 2: pass node IDs
graph.addEdge({ source: 'node1', target: 'node2' });

// Method 3: connect to ports
graph.addEdge({
  source: { cell: 'node1', port: 'out1' },
  target: { cell: 'node2', port: 'in1' },
});

// Method 4: use coordinate points
graph.addEdge({
  source: { x: 100, y: 50 },
  target: { x: 400, y: 50 },
});
// Or use shorthand
graph.addEdge({
  sourcePoint: [100, 50],
  targetPoint: [400, 50],
});
```

## Edge styles

```javascript
graph.addEdge({
  source: node1,
  target: node2,
  attrs: {
    line: {
      stroke: '#8f8f8f',        // Line color
      strokeWidth: 1,           // Line width
      strokeDasharray: '5 3',   // Dashed line (5px dash + 3px gap)
      targetMarker: 'classic',  // Arrow at the target end
      sourceMarker: null,       // No arrow at the source end
    },
  },
});
```

## Arrow types

```javascript
// Built-in arrows
targetMarker: 'classic'        // Classic triangular arrow
targetMarker: 'block'          // Solid triangle
targetMarker: 'circle'         // Circle
targetMarker: 'circlePlus'     // Circle with a plus sign
targetMarker: 'diamond'        // Diamond
targetMarker: 'ellipse'        // Ellipse
targetMarker: 'cross'          // Cross
targetMarker: 'async'          // Asynchronous marker

// Custom arrow
targetMarker: {
  name: 'block',
  width: 12,
  height: 8,
  offset: -4,
  fill: '#333',
}
```

## Router

Routers determine the path points (bends) that an edge passes through.

```javascript
// Orthogonal routing (vertical/horizontal polyline)
graph.addEdge({ source, target, router: 'orth' });

// Manhattan routing (intelligent obstacle avoidance)
graph.addEdge({ source, target, router: 'manhattan' });

// Router with configuration
graph.addEdge({
  source, target,
  router: { name: 'orth', args: { padding: 20 } },
});

// Router for ER diagrams
graph.addEdge({ source, target, router: 'er' });

// Metro-line routing
graph.addEdge({ source, target, router: 'metro' });
```

## Connector

Connectors determine how lines are drawn between path points.

```javascript
// Rounded polyline
graph.addEdge({ source, target, router: 'orth', connector: 'rounded' });

// Bezier curve
graph.addEdge({ source, target, connector: 'smooth' });

// Jumpover (jump at intersections)
graph.addEdge({ source, target, connector: 'jumpover' });

// Connector with configuration
graph.addEdge({
  source, target,
  connector: { name: 'rounded', args: { radius: 10 } },
});
```

## Edge labels

```javascript
// Shorthand
graph.addEdge({ source, target, label: 'Yes' });

// Detailed configuration
graph.addEdge({
  source, target,
  labels: [
    {
      position: 0.5,           // Label position on the edge (0-1)
      attrs: {
        text: { text: 'label text', fontSize: 12, fill: '#333' },
        rect: { fill: '#fff', stroke: '#8f8f8f', rx: 3, ry: 3 },
      },
    },
  ],
});

// Multiple labels
graph.addEdge({
  source, target,
  labels: [
    { position: 0.25, attrs: { text: { text: 'start' } } },
    { position: 0.75, attrs: { text: { text: 'end' } } },
  ],
});
```

## Vertices

Manually specify the intermediate bend points of an edge:

```javascript
graph.addEdge({
  source: node1,
  target: node2,
  vertices: [
    { x: 200, y: 50 },
    { x: 200, y: 200 },
  ],
  attrs: { line: { stroke: '#8f8f8f', strokeWidth: 1, targetMarker: 'classic' } },
});
```

## Dynamically modify edges

```javascript
// Modify style
edge.attr('line/stroke', '#f5222d');
edge.attr('line/strokeWidth', 2);

// Modify labels
edge.setLabels([{ attrs: { text: { text: 'Updated' } } }]);

// Modify router
edge.setRouter('manhattan');

// Modify connector
edge.setConnector('smooth');

// Modify source/target
edge.setSource(newSourceNode);
edge.setTarget({ cell: 'node3', port: 'in1' });
```

## Common edge style combinations

### Flowchart edge

```javascript
graph.addEdge({
  source, target,
  router: 'orth',
  connector: 'rounded',
  attrs: { line: { stroke: '#8f8f8f', strokeWidth: 1, targetMarker: 'classic' } },
});
```

### Lineage graph edge

```javascript
graph.addEdge({
  source: { cell: srcNode, port: 'out1' },
  target: { cell: tgtNode, port: 'in1' },
  connector: 'smooth',
  attrs: { line: { stroke: '#8f8f8f', strokeWidth: 1 } },
});
```

### Dashed edge (call relationship)

```javascript
graph.addEdge({
  source, target,
  attrs: {
    line: { stroke: '#aaa', strokeWidth: 1, strokeDasharray: '5 3', targetMarker: 'classic' },
  },
});
```

### Highlighted-state edge

```javascript
graph.addEdge({
  source, target,
  attrs: { line: { stroke: '#1890ff', strokeWidth: 2, targetMarker: 'classic' } },
});
```