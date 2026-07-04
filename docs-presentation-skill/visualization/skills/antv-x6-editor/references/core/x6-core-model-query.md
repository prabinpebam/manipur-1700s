---
id: "x6-core-model-query"
title: "X6 Graph Model Query and Traversal APIs"
description: |
  Graph Model APIs for querying graph structure: getting neighbor nodes, connected edges, predecessors/successors, root/leaf nodes, graph traversal search, and more.
library: x6
version: 3.x
category: "core"
tags:
  - model
  - query
  - neighbors
  - traverse
  - graph-algorithm
  - getConnectedEdges
  - getNeighbors
  - getSuccessors
  - getPredecessors
---

# Graph Model Query and Traversal APIs

## Overview

X6's Graph Model provides rich graph-structure query capabilities for retrieving topological relationships between nodes (neighbors, predecessors, successors), connected edges, root/leaf nodes, and more. These APIs can be called through `graph.model` or directly through `graph` proxies.

## Getting Elements

### getCells / getNodes / getEdges

```javascript
// Get all elements
const cells = graph.getCells();

// Get nodes only
const nodes = graph.getNodes();

// Get edges only
const edges = graph.getEdges();
```

### getCellById

```javascript
const cell = graph.getCellById('node-1');
```

## Connected Edge Queries

### getConnectedEdges - Get All Edges Connected to a Node

```javascript
// Get all connected edges (incoming + outgoing)
const edges = graph.getConnectedEdges(node);

// Get outgoing edges only
const outEdges = graph.getConnectedEdges(node, { outgoing: true });

// Get incoming edges only
const inEdges = graph.getConnectedEdges(node, { incoming: true });

// Include indirect connections (edges connected through edges)
const allEdges = graph.getConnectedEdges(node, { indirect: true });

// Deep search (including connected edges of embedded child nodes)
const deepEdges = graph.getConnectedEdges(node, { deep: true });
```

**options parameter:**

| Parameter | Type | Description |
|------|------|------|
| `incoming` | boolean | Include incoming edges |
| `outgoing` | boolean | Include outgoing edges |
| `indirect` | boolean | Include indirect connections |
| `deep` | boolean | Include edges of embedded child nodes |
| `enclosed` | boolean | Whether to include internal edges in deep mode |

> Note: when neither `incoming` nor `outgoing` is passed, both default to `true`.

### getOutgoingEdges - Get Outgoing Edges

```javascript
const outEdges = graph.getOutgoingEdges(node);
// Returns Edge[] | null
```

### getIncomingEdges - Get Incoming Edges

```javascript
const inEdges = graph.getIncomingEdges(node);
// Returns Edge[] | null
```

## Neighbor Node Queries

### getNeighbors - Get Neighbor Nodes

```javascript
// Get all neighbors (incoming direction + outgoing direction)
const neighbors = graph.getNeighbors(node);

// Get downstream neighbors only
const downstream = graph.getNeighbors(node, { outgoing: true });

// Get upstream neighbors only
const upstream = graph.getNeighbors(node, { incoming: true });
```

### isNeighbor - Check Whether Two Nodes Are Neighbors

```javascript
const isNear = graph.isNeighbor(node1, node2);
const isDownstream = graph.isNeighbor(node1, node2, { outgoing: true });
```

## Predecessors and Successors

### getSuccessors - Get All Successor Nodes

All nodes reachable from the current node along outgoing edges (recursive traversal):

```javascript
const successors = graph.getSuccessors(node);

// Limit distance
const near = graph.getSuccessors(node, { distance: 1 });  // Get direct successors only
const farther = graph.getSuccessors(node, { distance: [2, 3] });  // Successors at distance 2 to 3
```

### isSuccessor - Check Whether a Node Is a Successor

```javascript
const isAfter = graph.isSuccessor(node1, node2);  // Whether node2 is a successor of node1
```

### getPredecessors - Get All Predecessor Nodes

All nodes reachable from the current node along incoming edges (recursive traversal):

```javascript
const predecessors = graph.getPredecessors(node);
```

### isPredecessor - Check Whether a Node Is a Predecessor

```javascript
const isBefore = graph.isPredecessor(node1, node2);  // Whether node2 is a predecessor of node1
```

## Root Nodes and Leaf Nodes

### getRoots - Get Root Nodes (Nodes with No Incoming Edges)

```javascript
const roots = graph.getRootNodes();
```

### getLeafs - Get Leaf Nodes (Nodes with No Outgoing Edges)

```javascript
const leafs = graph.getLeafNodes();
```

### isRoot / isLeaf - Check Whether a Node Is Root/Leaf

```javascript
graph.isRootNode(node);  // true if no incoming edges
graph.isLeafNode(node);  // true if no outgoing edges
```

## Graph Traversal Search

### searchCell - Graph Search (BFS/DFS)

```javascript
// Breadth-first search starting from node
graph.searchCell(node, (cell, distance) => {
  console.log(`${cell.id} distance from start: ${distance}`);
}, { breadthFirst: true });

// Depth-first search (default)
graph.searchCell(node, (cell, distance) => {
  if (cell.id === 'target') {
    return false;  // Return false to stop the search
  }
});
```

### getShortestPath - Shortest Path

```javascript
const path = graph.getShortestPath(sourceNode, targetNode);
// Returns an array of node IDs
```

## Complete Example: DAG Topology Analysis

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({ container: 'container', width: 800, height: 600 });

const a = graph.addNode({ shape: 'rect', x: 50, y: 200, width: 80, height: 40, label: 'A' });
const b = graph.addNode({ shape: 'rect', x: 200, y: 100, width: 80, height: 40, label: 'B' });
const c = graph.addNode({ shape: 'rect', x: 200, y: 300, width: 80, height: 40, label: 'C' });
const d = graph.addNode({ shape: 'rect', x: 400, y: 200, width: 80, height: 40, label: 'D' });

graph.addEdge({ source: a, target: b });
graph.addEdge({ source: a, target: c });
graph.addEdge({ source: b, target: d });
graph.addEdge({ source: c, target: d });

// Query A's successors
const successors = graph.getSuccessors(a);
console.log("A's successors:", successors.map(n => n.id));  // [B, C, D]

// Query D's predecessors
const predecessors = graph.getPredecessors(d);
console.log("D's predecessors:", predecessors.map(n => n.id));  // [B, C, A]

// Get root nodes
const roots = graph.getRootNodes();
console.log('Root nodes:', roots.map(n => n.id));  // [A]

// Get leaf nodes
const leafs = graph.getLeafNodes();
console.log('Leaf nodes:', leafs.map(n => n.id));  // [D]

// Get B's neighbors
const neighbors = graph.getNeighbors(b);
console.log("B's neighbors:", neighbors.map(n => n.id));  // [A, D]
```

## Common Mistakes

```javascript
// ❌ Incorrect: getConnectedEdges may return an empty array, while getOutgoingEdges may return null
const edges = graph.getOutgoingEdges(node);
edges.forEach(e => ...);  // TypeError: null.forEach

// ✅ Correct: check for null first
const edges = graph.getOutgoingEdges(node);
if (edges) {
  edges.forEach(e => ...);
}

// Or use getConnectedEdges, which always returns an array
const edges = graph.getConnectedEdges(node, { outgoing: true });
edges.forEach(e => ...);  // Safe: empty array
```
