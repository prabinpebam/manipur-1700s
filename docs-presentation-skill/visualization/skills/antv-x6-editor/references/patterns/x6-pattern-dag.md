---
id: "x6-pattern-dag"
title: "X6 DAG Directed Acyclic Graph"
description: |
  Best practices for building DAGs (directed acyclic graphs) with X6.
  Suitable for data pipelines, CI/CD pipelines, task dependencies, and similar scenarios.

library: "x6"
version: "3.x"
category: "patterns"
subcategory: "dag"
tags:
  - "DAG"
  - "Directed acyclic graph"
  - "Data pipeline"
  - "pipeline"
  - "CI/CD"
  - "Pipeline"
  - "Task dependency"
  - "Data lineage"
  - "ETL"
  - "Port connections"

related:
  - "x 6-core-ports"
  - "x6-core-edge"
  - "x6-core-node"
  - "x6-plugins"

use_cases:
  - "Create data-processing pipeline diagrams"
  - "CI/CD pipeline visualization"
  - "Task dependency diagram"
  - "Data lineage analysis diagram"

difficulty: "intermediate"
completeness: "full"
---

## Core DAG Features

- **Directed**: Edges have direction, flowing from upstream to downstream
- **Acyclic**: No circular dependencies exist
- **Port connections**: Connections are established through the in/out ports of Ports
- **Left-to-right / top-to-bottom layout**: Usually a horizontal (left to right) or vertical (top to bottom) flow

## DAG Node Registration

```javascript
import { Graph } from '@antv/x6';

Graph.registerNode('dag-node', {
  inherit: 'rect',
  width: 140,
  height: 50,
  attrs: {
    body: { stroke: '#8f8f8f', strokeWidth: 1, fill: '#fff', rx: 6, ry: 6 },
  },
  ports: {
    groups: {
      in: {
        position: 'left',
        attrs: { circle: { magnet: true, r: 5, stroke: '#1890ff', fill: '#fff' } },
      },
      out: {
        position: 'right',
        attrs: { circle: { magnet: true, r: 5, stroke: '#1890ff', fill: '#fff' } },
      },
    },
  },
}, true);
```

## Complete DAG Example

The following is a standard, directly runnable DAG data-pipeline example. Regardless of whether the user provides reference JSON, output complete runnable code and assign an independent variable name to each node.

```javascript
import { Graph } from '@antv/x6';

Graph.registerNode('dag-node', {
  inherit: 'rect',
  width: 140,
  height: 48,
  attrs: {
    body: { fill: '#fff', stroke: '#5F95FF', strokeWidth: 1, rx: 6, ry: 6 },
    label: { fontSize: 13, fill: '#333' },
  },
  ports: {
    groups: {
      in: { position: 'left', attrs: { circle: { r: 5, magnet: true, stroke: '#5F95FF', fill: '#fff', strokeWidth: 1 } } },
      out: { position: 'right', attrs: { circle: { r: 5, magnet: true, stroke: '#5F95FF', fill: '#fff', strokeWidth: 1 } } },
    },
  },
}, true);

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 500,
  background: { color: '#F2F7FA' },
  grid: { visible: true, size: 10 },
  connecting: {
    allowBlank: false,
    allowLoop: false,
    allowMulti: false,
    router: 'orth',
    connector: 'rounded',
    createEdge() {
      return this.createEdge({
        attrs: { line: { stroke: '#5F95FF', strokeWidth: 1, targetMarker: 'classic' } },
      });
    },
    validateConnection({ sourcePort, targetPort }) {
      return sourcePort !== targetPort;
    },
  },
});

const extract = graph.addNode({ shape: 'dag-node', x: 40, y: 100, label: 'MySQL Source', ports: { items: [{ id: 'out-1', group: 'out' }] } });
const transform = graph.addNode({ shape: 'dag-node', x: 260, y: 60, label: 'Data Clean', ports: { items: [{ id: 'in-1', group: 'in' }, { id: 'out-1', group: 'out' }] } });
const aggregate = graph.addNode({ shape: 'dag-node', x: 260, y: 160, label: 'Aggregate', ports: { items: [{ id: 'in-1', group: 'in' }, { id: 'out-1', group: 'out' }] } });
const load = graph.addNode({ shape: 'dag-node', x: 500, y: 120, label: 'Write to DW', ports: { items: [{ id: 'in-1', group: 'in' }, { id: 'in-2', group: 'in' }] } });

graph.addEdge({ source: { cell: extract, port: 'out-1' }, target: { cell: transform, port: 'in-1' }, attrs: { line: { stroke: '#5F95FF', strokeWidth: 1, targetMarker: 'classic' } } });
graph.addEdge({ source: { cell: extract, port: 'out-1' }, target: { cell: aggregate, port: 'in-1' }, attrs: { line: { stroke: '#5F95FF', strokeWidth: 1, targetMarker: 'classic' } } });
graph.addEdge({ source: { cell: transform, port: 'out-1' }, target: { cell: load, port: 'in-1' }, attrs: { line: { stroke: '#5F95FF', strokeWidth: 1, targetMarker: 'classic' } } });
graph.addEdge({ source: { cell: aggregate, port: 'out-1' }, target: { cell: load, port: 'in-2' }, attrs: { line: { stroke: '#5F95FF', strokeWidth: 1, targetMarker: 'classic' } } });
```

## Generate a DAG from User Data

When users provide reference node/edge data, such as JSON arrays, **do not copy the JSON fields directly**, because user data often mistakenly uses port IDs as node IDs or lacks complete `ports` configuration. The correct approach is:

1. Create an independent variable for each node based on its semantics, such as `source1`, `etl`, or `warehouse`.
2. Explicitly add `shape: 'dag-node'` and `ports.items` in `addNode`.
3. Use the `{ cell: nodeVar, port: '...' }` object format for edges; do not use string IDs.
4. Always output complete runnable code; do not return empty code or pseudocode.

```javascript
// Counterexample: do not directly iterate over user JSON as node configuration
// Correct example: rebuild nodes and edges based on semantics
const etl = graph.addNode({
  shape: 'dag-node',
  x: 260,
  y: 90,
  label: 'ETL Transform',
  ports: {
    items: [
      { id: 'in1', group: 'in' },
      { id: 'in2', group: 'in' },
      { id: 'out1', group: 'out' },
    ],
  },
});
```

## DAG Nodes with Status

```javascript
const statusColors = {
  pending: { stroke: '#8f8f8f', fill: '#fff' },
  running: { stroke: '#1890ff', fill: '#e6f7ff' },
  success: { stroke: '#52c41a', fill: '#f6ffed' },
  failed: { stroke: '#f5222d', fill: '#fff1f0' },
};

function setNodeStatus(node, status) {
  const colors = statusColors[status];
  node.attr('body/stroke', colors.stroke);
  node.attr('body/fill', colors.fill);
  node.setData({ status });
}
```

## Connection Validation (Prevent Cycles)

```javascript
const graph = new Graph({
  container: 'container',
  connecting: {
    allowBlank: false,
    allowLoop: false,
    router: 'orth',
    connector: 'rounded',
    validateConnection({ sourceCell, targetCell }) {
      // Prevent self-connections
      if (sourceCell === targetCell) return false;
      // Check whether a cycle would be formed (simple implementation)
      const edges = graph.getEdges();
      // ... use topological sorting to detect cycles
      return true;
    },
  },
});
```

## Data Lineage Diagram (Multi-layer DAG)

Data lineage is a typical DAG use case, showing how data flows from source tables to final reports:

```javascript
// Use smooth connector instead of orth; it is better for multi-layer fan-out scenarios
graph.addEdge({
  source: { cell: srcNode, port: 'out1' },
  target: { cell: tgtNode, port: 'in1' },
  connector: 'smooth',
  attrs: { line: { stroke: '#8f8f8f', strokeWidth: 1 } },
});
```

Layering recommendations:
- **ODS layer**: Raw data sources (white background)
- **DWD layer**: Detailed data (light blue `#e6f7ff`)
- **DWS layer**: Summary data (light green `#f6ffed`)
- **ADS layer**: Application data (light orange `#fff7e6`)

## Common Errors and Fixes

### 1. Returning empty code (no code)

**Symptom**: After the user provides reference JSON data, the model outputs no code.  
**Cause**: The model is confused by incomplete fields or port/node IDs in the data and gives up generation.  
**Fix**: Always output complete runnable code based on the standard DAG template. Ignore potentially incorrect `id` fields in the user JSON, create independent variables according to node semantics, and explicitly configure `ports.items`.

```javascript
// ❌ Incorrect: no code is generated, or only data comments are output
// ✅ Correct: directly output complete code
const source1 = graph.addNode({
  shape: 'dag-node', x: 40, y: 40, label: 'MySQL Source',
  ports: { items: [{ id: 'out1', group: 'out' }] },
});
```

### 2. Incorrect edge connection format

**Symptom**: `source: 'source1'` or `source: { cell: 'source1' }` (string ID).  
**Fix**: Use a node variable reference plus a port ID object.

```javascript
// ❌ Incorrect
graph.addEdge({ source: 'source1', target: 'etl' });

// ✅ Correct
graph.addEdge({
  source: { cell: source1, port: 'out1' },
  target: { cell: etl, port: 'in1' },
  attrs: { line: { stroke: '#1890ff', strokeWidth: 1, targetMarker: 'classic' } },
});
```

### 3. Node missing port configuration

**Symptom**: Only `shape` and `label` are specified in `addNode`, with no `ports`.  
**Fix**: A DAG must connect through ports. Each node must declare `ports: { items: [...] }` in `addNode` and specify `group: 'in'` or `group: 'out'`.

```javascript
// ❌ Incorrect
graph.addNode({ shape: 'dag-node', label: 'ETL' });

// ✅ Correct
graph.addNode({
  shape: 'dag-node',
  label: 'ETL',
  ports: {
    items: [
      { id: 'in1', group: 'in' },
      { id: 'out1', group: 'out' },
    ],
  },
});
```

### 4. Confusing port IDs with node variable names

**Symptom**: Treating `"id": "out1"` in user JSON as a node ID, causing duplicated node IDs or lost semantics.  
**Fix**: `out1`/`in1` should be used as **port IDs** in `ports.items`; nodes themselves should use meaningful variable names, such as `source1`, `etl`, or `warehouse`.

```javascript
// ✅ Correct distinction
const warehouse = graph.addNode({
  shape: 'dag-node',
  label: 'Data Warehouse',
  ports: { items: [{ id: 'in1', group: 'in' }, { id: 'out1', group: 'out' }] },
});
```

### 5. Incorrectly using the addPorts method

**Symptom**: Calling addPorts after addNode to add ports, instead of declaring ports.items all at once during addNode.  
**Fix**: Declare ports.items when calling addNode to avoid manually adding ports later.

```javascript
// ❌ Incorrect
const node = graph.addNode({ shape: 'dag-node', label: 'Node' });
node.addPorts([{ id: 'in1', group: 'in' }]);

// ✅ Correct
const node = graph.addNode({
  shape: 'dag-node',
  label: 'Node',
  ports: { items: [{ id: 'in1', group: 'in' }] },
});
```

### 6. Using string IDs as cell references

**Symptom**: Edge connections use string IDs instead of node variable references.  
**Fix**: Use a node variable reference plus a port ID object.

```javascript
// ❌ Incorrect
graph.addEdge({ source: { cell: 'source1', port: 'out1' }, target: { cell: 'etl', port: 'in1' } });

// ✅ Correct
graph.addEdge({ source: { cell: source1, port: 'out1' }, target: { cell: etl, port: 'in1' } });
```

### 7. Incorrectly importing extra dependencies

**Symptom**: Importing `Shape` or other unnecessary modules, causing loading failures.  
**Fix**: Import only `Graph` and avoid unnecessary module imports.

```javascript
// ❌ Incorrect
import { Graph, Shape } from '@antv/x6'

// ✅ Correct
import { Graph } from '@antv/x6';
```

### 8. Incorrectly using the addNode + addPorts pattern

**Symptom**: Calling addNode first and then addPorts, instead of declaring ports.items all at once in addNode.  
**Fix**: Declare ports.items when calling addNode.

```javascript
// ❌ Incorrect
const node = graph.addNode({ shape: 'dag-node', label: 'Node' });
node.addPorts([{ id: 'in1', group: 'in' }]);

// ✅ Correct
const node = graph.addNode({
  shape: 'dag-node',
  label: 'Node',
  ports: { items: [{ id: 'in1', group: 'in' }] },
});
```

### 9. Incorrectly using a ports array instead of an items object

**Symptom**: Using `ports: [{ id: 'out', group: 'out' }]` in `addNode` instead of `ports: { items: [...] }`.  
**Fix**: You must use the `ports: { items: [...] }` format; otherwise ports cannot render correctly.

```javascript
// ❌ Incorrect
graph.addNode({
  shape: 'dag-node',
  label: 'Node',
  ports: [{ id: 'out', group: 'out' }]
});

// ✅ Correct
graph.addNode({
  shape: 'dag-node',
  label: 'Node',
  ports: { items: [{ id: 'out', group: 'out' }] }
});
```

### 10. Incorrectly using createEdge in a way that introduces extra dependencies

**Symptom**: Using `Shape.Edge` in `connecting.createEdge`, which introduces an extra dependency.  
**Fix**: Avoid using `Shape.Edge`; use the default edge configuration directly.

```javascript
// ❌ Incorrect
connecting: {
  createEdge() {
    return new Shape.Edge({
      attrs: { line: { stroke: '#A2B1C3' } }
    });
  }
}

// ✅ Correct
connecting: {
  // No custom createEdge is needed
}
```

### 11. Incorrectly using the ports array form instead of the items object form

**Symptom**: Using `ports: [{ id: 'out1', group: 'out' }]` in `addNode` instead of `ports: { items: [...] }`.  
**Fix**: You must use the `ports: { items: [...] }` format; otherwise ports cannot render correctly.

```javascript
// ❌ Incorrect
graph.addNode({
  shape: 'dag-node',
  label: 'Node',
  ports: [{ id: 'out1', group: 'out' }]
});

// ✅ Correct
graph.addNode({
  shape: 'dag-node',
  label: 'Node',
  ports: { items: [{ id: 'out1', group: 'out' }] }
});
```

### 12. Incorrectly using addPorts to add ports

**Symptom**: Calling addPorts after addNode to add ports, instead of declaring ports.items all at once during addNode.  
**Fix**: Declare ports.items when calling addNode to avoid manually adding ports later.

```javascript
// ❌ Incorrect
const node = graph.addNode({ shape: 'dag-node', label: 'Node' });
node.addPorts([{ id: 'in1', group: 'in' }]);

// ✅ Correct
const node = graph.addNode({
  shape: 'dag-node',
  label: 'Node',
  ports: { items: [{ id: 'in1', group: 'in' }] },
});
```

### 13. Incorrectly using the plugins option to add functionality

**Symptom**: Adding plugins via `plugins: [new Selection(...)]`, causing incorrect initialization.  
**Fix**: Use `graph.use(new Plugin(...))` to add plugins.

```javascript
// ❌ Incorrect
const graph = new Graph({
  plugins: [
    new Selection({ enabled: true }),
  ],
});

// ✅ Correct
import { Selection } from '@antv/x6-plugin-selection';
const graph = new Graph({ /* ... */ });
graph.use(new Selection({ enabled: true }));
```

### 14. Incorrectly returning this.createEdge from createEdge

**Symptom**: Returning `this.createEdge(...)` inside `createEdge` causes recursive calls and a stack overflow.  
**Fix**: Return `graph.createEdge(...)` directly or use `new Edge(...)`.

```javascript
// ❌ Incorrect
createEdge() {
  return this.createEdge({ ... });
}

// ✅ Correct
createEdge() {
  return graph.createEdge({ ... });
}
```