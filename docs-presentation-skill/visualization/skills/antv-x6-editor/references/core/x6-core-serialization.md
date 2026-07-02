---
id: "x6-core-serialization"
title: "X6 Data Serialization and Persistence"
description: |
  Importing and exporting X6 graph data, JSON serialization, clearing, and reloading.
  Covers usage of methods such as toJSON/fromJSON/clearCells.

library: "x6"
version: "3.x"
category: "core"
subcategory: "serialization"
tags:
  - "serialization"
  - "toJSON"
  - "fromJSON"
  - "clearCells"
  - "import"
  - "export"
  - "persistence"
  - "data"
  - "save"
  - "load"

related:
  - "x6-core-graph-init"
  - "x6-core-node"
  - "x6-core-edge"

use_cases:
  - "Save canvas data to the backend"
  - "Load graph data from the backend"
  - "Clear the canvas and reload it"
  - "Batch-import nodes and edges"

anti_patterns:
  - "Do not manually construct internal fields in the cells array"
  - "Do not call addNode again for nodes that already exist after fromJSON"

difficulty: "beginner"
completeness: "full"
---

## Exporting Data

```javascript
// Export the entire canvas data
const data = graph.toJSON();
// Return format: { cells: [...] }
// cells contains the complete configuration for all nodes and edges

console.log(JSON.stringify(data));
```

## Importing Data

```javascript
// Method 1: load complete data with fromJSON (clears existing content)
graph.fromJSON({
  nodes: [
    { id: 'node1', shape: 'rect', x: 40, y: 40, width: 100, height: 40, label: 'Node 1' },
    { id: 'node2', shape: 'rect', x: 240, y: 40, width: 100, height: 40, label: 'Node 2' },
  ],
  edges: [
    { source: 'node1', target: 'node2', attrs: { line: { stroke: '#8f8f8f', strokeWidth: 1, targetMarker: 'classic' } } },
  ],
});

// Method 2: load data exported by toJSON
const savedData = graph.toJSON();
// ... later ...
graph.fromJSON(savedData);
```

## Clearing the Canvas

```javascript
// Clear all nodes and edges
graph.clearCells();

// Clear and then reload
graph.clearCells();
graph.fromJSON(newData);
```

## Batch Operations

```javascript
// Batch add
const nodes = [
  { shape: 'rect', x: 40, y: 40, width: 100, height: 40, label: 'A' },
  { shape: 'rect', x: 200, y: 40, width: 100, height: 40, label: 'B' },
];
nodes.forEach(config => graph.addNode(config));

// Freeze the canvas to avoid frequent redraws (performance optimization)
graph.freeze();
for (let i = 0; i < 100; i++) {
  graph.addNode({ shape: 'rect', x: (i % 10) * 110, y: Math.floor(i / 10) * 70, width: 90, height: 40 });
}
graph.unfreeze();
```

## Getting Elements

```javascript
// Get all elements (nodes + edges)
const allCells = graph.getCells();

// Get only nodes
const allNodes = graph.getNodes();

// Get only edges
const allEdges = graph.getEdges();

// Get by ID
const cell = graph.getCellById('node1');

// Get neighboring nodes
const neighbors = graph.getNeighbors(node);

// Get connected edges
const connectedEdges = graph.getConnectedEdges(node);
```

## Removing Elements

```javascript
// Remove a single node (connected edges are also removed)
graph.removeNode('node1');
// Or
graph.removeCell(node);

// Remove a single edge
graph.removeEdge('edge1');

// Remove in batches
graph.removeCells([node1, node2, edge1]);
```

## Disposing the Canvas

```javascript
// Dispose the instance and release all resources and events
graph.dispose();
```

## Complete Persistence Example

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({ container: 'container', background: { color: '#F2F7FA' } });

// Load data
const initialData = {
  nodes: [
    { id: 'start', shape: 'rect', x: 40, y: 80, width: 100, height: 40, label: 'Start',
      attrs: { body: { stroke: '#52c41a', strokeWidth: 2, fill: '#f6ffed', rx: 6, ry: 6 } } },
    { id: 'end', shape: 'rect', x: 280, y: 80, width: 100, height: 40, label: 'End',
      attrs: { body: { stroke: '#f5222d', strokeWidth: 2, fill: '#fff1f0', rx: 6, ry: 6 } } },
  ],
  edges: [
    { source: 'start', target: 'end', attrs: { line: { stroke: '#8f8f8f', strokeWidth: 1, targetMarker: 'classic' } } },
  ],
};

graph.fromJSON(initialData);

// Save
function save() {
  const data = graph.toJSON();
  localStorage.setItem('graph-data', JSON.stringify(data));
}

// Load
function load() {
  const raw = localStorage.getItem('graph-data');
  if (raw) {
    graph.fromJSON(JSON.parse(raw));
  }
}
```

## Common Errors and Fixes

### Error 1: Passing data exported by toJSON directly to fromJSON causes an error

```javascript
// Wrong example: directly load the value returned by toJSON
const graph = new Graph({ container: 'container' });
graph.fromJSON([
  { id: 'node1', shape: 'rect', label: 'Node 1', x: 40, y: 40, width: 80, height: 40 },
  { id: 'node2', shape: 'rect', label: 'Node 2', x: 240, y: 40, width: 80, height: 40 },
  { id: 'edge1', source: 'node1', target: 'node2', label: 'Edge' }
]);

const exportedData = graph.toJSON(); // Returns { cells: [...] }
// The following line reports an error: The `shape` should be specified when creating a node/edge instance
graph2.fromJSON(exportedData); 
```

```javascript
// Correct approach: use the cells field from the value returned by toJSON
const exportedData = graph.toJSON();
graph2.fromJSON(exportedData.cells); // Note that the cells array is passed here

// Or use the complete structure
graph2.fromJSON({ nodes: exportedData.cells.filter(c => c.shape), edges: exportedData.cells.filter(c => !c.shape) });
```

### Error 2: A node or edge is missing the required shape field

```javascript
// Wrong example: missing the shape field
graph.fromJSON([
  { id: 'node1', x: 40, y: 40, width: 80, height: 40, label: 'Node 1' }, // Missing shape
  { source: 'node1', target: 'node2' } // Missing shape; defaults to edge
]);
```

```javascript
// Correct approach: ensure every node has a shape field
graph.fromJSON([
  { id: 'node1', shape: 'rect', x: 40, y: 40, width: 80, height: 40, label: 'Node 1' },
  { id: 'edge1', shape: 'edge', source: 'node1', target: 'node2' }
]);
```

### Error 3: An edge references a target node that does not exist

```javascript
// Wrong example: the edge references a node that does not exist
graph.fromJSON([
  { id: 'node1', shape: 'rect', x: 40, y: 40, width: 80, height: 40, label: 'Node 1' },
  { source: 'node1', target: 'node2' } // node2 does not exist
]);
```

```javascript
// Correct approach: ensure all referenced nodes are defined
graph.fromJSON([
  { id: 'node1', shape: 'rect', x: 40, y: 40, width: 80, height: 40, label: 'Node 1' },
  { id: 'node2', shape: 'rect', x: 240, y: 40, width: 80, height: 40, label: 'Node 2' },
  { source: 'node1', target: 'node2' }
]);
```

### Error 4: Passing an array to fromJSON without correctly distinguishing nodes and edges

```javascript
// Wrong example: mixing nodes and edges in the same array passed to fromJSON
const graph = new Graph({ container: 'container' });
graph.fromJSON([
  { id: 'source', shape: 'rect', label: 'Source', x: 40, y: 40, width: 100, height: 40 },
  { id: 'target', shape: 'rect', label: 'Target', x: 200, y: 160, width: 100, height: 40 },
  { source: 'source', target: 'target' } // The edge has no shape field and is mistakenly treated as a node
]);
```

```javascript
// Correct approach: use an object structure to specify nodes and edges separately
graph.fromJSON({
  nodes: [
    { id: 'source', shape: 'rect', label: 'Source', x: 40, y: 40, width: 100, height: 40 },
    { id: 'target', shape: 'rect', label: 'Target', x: 200, y: 160, width: 100, height: 40 }
  ],
  edges: [
    { source: 'source', target: 'target' }
  ]
});
```

### Error 5: Misunderstanding the structure returned by toJSON

```javascript
// Wrong example: use the value returned by toJSON directly with fromJSON
const graph = new Graph({ container: 'container' });
graph.fromJSON([
  { id: 'node1', shape: 'rect', x: 40, y: 40, width: 80, height: 40, label: 'Node 1' },
  { source: 'node1', target: 'node2' }
]);

const data = graph.toJSON(); // Returns { cells: [...] }
// The following line reports an error: The `shape` should be specified when creating a node/edge instance
graph2.fromJSON(data);
```

```javascript
// Correct approach: use the cells field from the value returned by toJSON
const data = graph.toJSON();
graph2.fromJSON(data.cells); // Note that the cells array is passed here

// Or use the complete structure
graph2.fromJSON({ nodes: data.cells.filter(c => c.shape), edges: data.cells.filter(c => !c.shape) });
```

### Error 6: Not handling the edge shape field correctly when loading nodes and edges with fromJSON

```javascript
// Wrong example: edge is missing the shape field
const graph = new Graph({ container: 'container' });
graph.fromJSON([
  { id: 'source', shape: 'rect', label: 'Source', x: 40, y: 40, width: 100, height: 40 },
  { id: 'target', shape: 'rect', label: 'Target', x: 200, y: 160, width: 100, height: 40 },
  { source: 'source', target: 'target' } // The edge has no shape field and is mistakenly treated as a node
]);
```

```javascript
// Correct approach: ensure edges have a shape field
const graph = new Graph({ container: 'container' });
graph.fromJSON([
  { id: 'source', shape: 'rect', label: 'Source', x: 40, y: 40, width: 100, height: 40 },
  { id: 'target', shape: 'rect', label: 'Target', x: 200, y: 160, width: 100, height: 40 },
  { id: 'edge1', shape: 'edge', source: 'source', target: 'target' }
]);
```

### Error 7: Passing an array format when loading nodes and edges with fromJSON without correctly distinguishing nodes and edges

```javascript
// Wrong example: mixing nodes and edges in the same array passed to fromJSON
const graph = new Graph({ container: 'container' });
graph.fromJSON([
  { id: 'source', shape: 'rect', label: 'Source', x: 40, y: 40, width: 100, height: 40 },
  { id: 'target', shape: 'rect', label: 'Target', x: 200, y: 160, width: 100, height: 40 },
  { source: 'source', target: 'target' } // The edge has no shape field and is mistakenly treated as a node
]);
```

```javascript
// Correct approach: use an object structure to specify nodes and edges separately
const graph = new Graph({ container: 'container' });
graph.fromJSON({
  nodes: [
    { id: 'source', shape: 'rect', label: 'Source', x: 40, y: 40, width: 100, height: 40 },
    { id: 'target', shape: 'rect', label: 'Target', x: 200, y: 160, width: 100, height: 40 }
  ],
  edges: [
    { source: 'source', target: 'target' }
  ]
});
```
