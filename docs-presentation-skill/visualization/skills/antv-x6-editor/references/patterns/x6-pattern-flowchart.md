---
id: "x6-pattern-flowchart"
title: "X6 Flowchart"
description: |
  Best practices for building flowcharts and approval flows with X6.
  Includes patterns such as start/end/decision/step nodes, conditional branches, and swimlane diagrams.

library: "x6"
version: "3.x"
category: "patterns"
subcategory: "flowchart"
tags:
  - "Flowchart"
  - "Approval flow"
  - "Conditional branch"
  - "Diamond"
  - "Decision"
  - "Swimlane"
  - "Start and end"
  - "State machine"
  - "Org structure"

related:
  - "x6-core-node"
  - "x6-core-edge"
  - "x6-core-graph-init"
  - "x6-plugins"

use_cases:
  - "Create approval-flow diagrams"
  - "Draw business processes"
  - "Conditional decision branches"
  - "Swimlane diagrams for cross-department collaboration"
  - "State-machine diagram"
  - "Org chart"

difficulty: "intermediate"
completeness: "full"
---

## Core Flowchart Elements

| Element | Shape | Purpose |
|------|------|------|
| Start/End | Circle / rounded rectangle | Process start and end points |
| Step | Rectangle | Processing step |
| Decision | Diamond | Conditional branch |
| Connector | Edge with arrow | Process direction |

## Register a Diamond Node

```javascript
import { Graph } from '@antv/x6';

Graph.registerNode('diamond', {
  inherit: 'polygon',
  width: 80,
  height: 80,
  attrs: {
    body: {
      refPoints: '0,10 10,0 20,10 10,20',
      fill: '#fff',
      stroke: '#8f8f8f',
      strokeWidth: 1,
    },
    label: { fontSize: 12 },
  },
}, true);
```

## Complete Flowchart Example

```javascript
import { Graph } from '@antv/x6';

Graph.registerNode('diamond', {
  inherit: 'polygon', width: 80, height: 80,
  attrs: { body: { refPoints: '0,10 10,0 20,10 10,20', fill: '#fff', stroke: '#8f8f8f' } },
}, true);

const graph = new Graph({
  container: 'container',
  background: { color: '#F2F7FA' },
  grid: { visible: true },
});

// Start
const start = graph.addNode({
  shape: 'circle', x: 220, y: 20, width: 60, height: 60, label: 'Start',
  attrs: { body: { stroke: '#52c41a', strokeWidth: 2, fill: '#f6ffed' } },
});

// Step
const submit = graph.addNode({
  shape: 'rect', x: 200, y: 120, width: 100, height: 40, label: 'Submit',
  attrs: { body: { stroke: '#8f8f8f', strokeWidth: 1, fill: '#fff', rx: 6, ry: 6 } },
});

// Decision
const review = graph.addNode({
  shape: 'diamond', x: 210, y: 200, label: 'Approve?',
});

// Branch result
const approved = graph.addNode({
  shape: 'rect', x: 80, y: 320, width: 100, height: 40, label: 'Approved',
  attrs: { body: { stroke: '#52c41a', strokeWidth: 2, fill: '#f6ffed', rx: 6, ry: 6 } },
});

const rejected = graph.addNode({
  shape: 'rect', x: 320, y: 320, width: 100, height: 40, label: 'Rejected',
  attrs: { body: { stroke: '#f5222d', strokeWidth: 2, fill: '#fff1f0', rx: 6, ry: 6 } },
});

// End
const end = graph.addNode({
  shape: 'circle', x: 220, y: 420, width: 60, height: 60, label: 'End',
  attrs: { body: { stroke: '#f5222d', strokeWidth: 2, fill: '#fff1f0' } },
});

// Connectors
const edgeStyle = { line: { stroke: '#8f8f8f', strokeWidth: 1, targetMarker: 'classic' } };
graph.addEdge({ source: start, target: submit, attrs: edgeStyle });
graph.addEdge({ source: submit, target: review, attrs: edgeStyle });
graph.addEdge({ source: review, target: approved, label: 'Yes', attrs: { line: { stroke: '#52c41a', strokeWidth: 1, targetMarker: 'classic' } } });
graph.addEdge({ source: review, target: rejected, label: 'No', attrs: { line: { stroke: '#f5222d', strokeWidth: 1, targetMarker: 'classic' } } });
graph.addEdge({ source: approved, target: end, attrs: edgeStyle });
graph.addEdge({ source: rejected, target: end, attrs: edgeStyle });

graph.centerContent();
```

## State-machine Diagram

Suitable for order states, workflow states, and similar scenarios:

```javascript
const graph = new Graph({ container: 'container', background: { color: '#F2F7FA' } });

const states = [
  { id: 'pending', x: 60, y: 120, label: 'Pending', color: '#fa8c16', bg: '#fff7e6' },
  { id: 'paid', x: 200, y: 120, label: 'Paid', color: '#1890ff', bg: '#e6f7ff' },
  { id: 'shipping', x: 340, y: 120, label: 'Shipping', color: '#722ed1', bg: '#f9f0ff' },
  { id: 'done', x: 480, y: 120, label: 'Done', color: '#52c41a', bg: '#f6ffed' },
];

const nodes = states.map(s => graph.addNode({
  id: s.id, shape: 'circle', x: s.x, y: s.y, width: 70, height: 70, label: s.label,
  attrs: { body: { stroke: s.color, strokeWidth: 2, fill: s.bg } },
}));

const transitions = [
  { from: 'pending', to: 'paid', label: 'pay' },
  { from: 'paid', to: 'shipping', label: 'ship' },
  { from: 'shipping', to: 'done', label: 'confirm' },
];

transitions.forEach(t => {
  graph.addEdge({
    source: t.from, target: t.to, label: t.label,
    attrs: { line: { stroke: '#8f8f8f', strokeWidth: 1, targetMarker: 'classic' } },
  });
});
```

## Org Chart

Use `router: 'orth'` to implement a tree hierarchy:

```javascript
const graph = new Graph({
  container: 'container',
  background: { color: '#F2F7FA' },
});

const createPerson = (x, y, name, title, color) => {
  return graph.addNode({
    shape: 'rect',
    x,
    y,
    width: 130,
    height: 50,
    attrs: {
      body: { fill: '#fff', stroke: color, strokeWidth: 2, rx: 6, ry: 6 },
      label: { text: `${name}\n${title}`, fontSize: 11, lineHeight: 16 },
    },
  });
};

const ceo = createPerson(310, 30, 'John', 'CEO', '#722ed1');
const cto = createPerson(120, 140, 'Alice', 'CTO', '#1890ff');
const cfo = createPerson(490, 140, 'Bob', 'CFO', '#faad14');
const lead1 = createPerson(40, 260, 'Carol', 'FE Lead', '#1890ff');
const lead2 = createPerson(200, 260, 'Dave', 'BE Lead', '#1890ff');
const acc = createPerson(430, 260, 'Eve', 'Accounting', '#faad14');
const fin = createPerson(570, 260, 'Frank', 'Finance', '#faad14');

const edgeStyle = { attrs: { line: { stroke: '#8f8f8f', strokeWidth: 1, targetMarker: null } }, router: 'orth', connector: 'rounded' };

graph.addEdge({ source: ceo, target: cto, ...edgeStyle });
graph.addEdge({ source: ceo, target: cfo, ...edgeStyle });
graph.addEdge({ source: cto, target: lead1, ...edgeStyle });
graph.addEdge({ source: cto, target: lead2, ...edgeStyle });
graph.addEdge({ source: cfo, target: acc, ...edgeStyle });
graph.addEdge({ source: cfo, target: fin, ...edgeStyle });
```

## Swimlane Diagram

Use large rectangle nodes as swimlane backgrounds, with process nodes placed in different lanes:

```javascript
const graph = new Graph({ container: 'container', background: { color: '#F2F7FA' } });

// Swimlane background (low zIndex)
graph.addNode({
  shape: 'rect', x: 20, y: 20, width: 560, height: 100, zIndex: 0,
  label: 'Sales Dept',
  attrs: { body: { fill: '#e6f7ff', stroke: '#91d5ff', rx: 6, ry: 6 }, label: { refX: 30, refY: 0.5, textAnchor: 'start' } },
});

graph.addNode({
  shape: 'rect', x: 20, y: 130, width: 560, height: 100, zIndex: 0,
  label: 'Tech Dept',
  attrs: { body: { fill: '#f6ffed', stroke: '#b7eb8f', rx: 6, ry: 6 }, label: { refX: 30, refY: 0.5, textAnchor: 'start' } },
});

// Process nodes (high zIndex)
const task1 = graph.addNode({
  shape: 'rect', x: 140, y: 50, width: 100, height: 36, zIndex: 2, label: 'Receive',
  attrs: { body: { stroke: '#8f8f8f', strokeWidth: 1, fill: '#fff', rx: 4, ry: 4 } },
});

const task2 = graph.addNode({
  shape: 'rect', x: 340, y: 160, width: 100, height: 36, zIndex: 2, label: 'Develop',
  attrs: { body: { stroke: '#8f8f8f', strokeWidth: 1, fill: '#fff', rx: 4, ry: 4 } },
});

graph.addEdge({ source: task1, target: task2, router: 'orth', connector: 'rounded', attrs: { line: { stroke: '#8f8f8f', strokeWidth: 1, targetMarker: 'classic' } } });
```

## Batch-load Graph Data with fromJSON

The `graph.fromJSON` method can load a complete graph structure, including nodes and edges, all at once. Note the following:

- `container` must be a DOM element or its ID string
- You do not need to call `graph.render()` manually; `fromJSON` renders automatically
- Node and edge attributes should comply with the X6 specification

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  background: { color: '#F2F7FA' },
});

graph.fromJSON({
  nodes: [
    {
      id: 'start',
      shape: 'rect',
      x: 200,
      y: 20,
      width: 100,
      height: 40,
      label: 'Start',
      attrs: {
        body: { stroke: '#8f8f8f', strokeWidth: 1, fill: '#fff', rx: 6, ry: 6 },
      },
    },
    {
      id: 'left',
      shape: 'rect',
      x: 80,
      y: 120,
      width: 100,
      height: 40,
      label: 'Branch A',
      attrs: {
        body: { stroke: '#8f8f8f', strokeWidth: 1, fill: '#fff', rx: 6, ry: 6 },
      },
    },
    {
      id: 'right',
      shape: 'rect',
      x: 320,
      y: 120,
      width: 100,
      height: 40,
      label: 'Branch B',
      attrs: {
        body: { stroke: '#8f8f8f', strokeWidth: 1, fill: '#fff', rx: 6, ry: 6 },
      },
    },
    {
      id: 'end',
      shape: 'rect',
      x: 200,
      y: 220,
      width: 100,
      height: 40,
      label: 'End',
      attrs: {
        body: { stroke: '#8f8f8f', strokeWidth: 1, fill: '#fff', rx: 6, ry: 6 },
      },
    },
  ],
  edges: [
    { source: 'start', target: 'left', attrs: { line: { stroke: '#8f8f8f', strokeWidth: 1 } } },
    { source: 'start', target: 'right', attrs: { line: { stroke: '#8f8f8f', strokeWidth: 1 } } },
    { source: 'left', target: 'end', attrs: { line: { stroke: '#8f8f8f', strokeWidth: 1 } } },
    { source: 'right', target: 'end', attrs: { line: { stroke: '#8f8f8f', strokeWidth: 1 } } },
  ],
});

graph.centerContent();
```

## Common Errors and Fixes

### Error: graph.render is not a function

**Incorrect code example:**

```javascript
const graph = new Graph({ container: 'container' });
graph.fromJSON(data);
graph.render(); // ❌ Incorrect: graph.render is not a function
```

**Cause analysis:**
The X6 `Graph` instance has no `render` method. Data loaded with `fromJSON` is rendered automatically, so no manual call is required.

**Correct approach:**

```javascript
const graph = new Graph({ container: 'container' });
graph.fromJSON(data); // ✅ Correct: renders automatically
// graph.centerContent(); // Optional: center the content
```

### Error: Declaring `const container` in the code

**Incorrect code example:**

```javascript
// ❌ Incorrect: duplicate declaration of the container variable (already injected by the runtime)
const container = document.getElementById('container');
const graph = new Graph({ container }); // Error: Identifier 'container' has already been declared
```

**Correct approach:**

```javascript
// ✅ Correct: use the string 'container' directly
const graph = new Graph({ container: 'container' });
```

### Error: Incorrect node or edge attribute format

**Incorrect code example:**

```javascript
// Incorrect edge definition
{
  id: 'edge1',
  source: 'node1',
  target: 'node2',
  label: 'Connection' // ❌ Incorrect: label should be defined in attrs or with a labels array
}
```

**Correct approach:**

```javascript
// Correct edge definition
{
  source: 'node1',
  target: 'node2',
  label: 'Connection', // ✅ In fromJSON, label can be used directly
  attrs: {
    line: { stroke: '#8f8f8f', strokeWidth: 1 }
  }
}
```

### Error: Using graph.render() causes a runtime error

**Incorrect code example:**

```javascript
import { Graph } from '@antv/x6'

const graph = new Graph({
  container: 'container',
  background: { color: '#F2F7FA' },
})

const data = {
  nodes: [...],
  edges: [...]
}

graph.fromJSON(data)
graph.render() // ❌ Incorrect: graph.render is not a function
```

**Cause analysis:**
The X6 Graph instance has no `render` method, so calling it causes a runtime error. The `fromJSON` method automatically completes graph rendering.

**Correct approach:**

```javascript
import { Graph } from '@antv/x6'

const graph = new Graph({
  container: 'container',
  background: { color: '#F2F7FA' },
})

graph.fromJSON(data) // ✅ Correct: renders automatically
graph.centerContent() // Optional: center the content
```

### Error: Importing nonexistent modules or using unsupported plugins

**Incorrect code example:**

```javascript
import { Graph, Shape, Addon } from '@antv/x6' // ❌ Incorrect: imports nonexistent modules

const graph = new Graph({
  container: 'container',
  plugins: [
    new Addon.Selection({ // ❌ Incorrect: plugin unsupported or imported incorrectly
      enabled: true,
      multiple: true,
      rubberband: true,
      modifiers: 'shift',
    }),
  ],
})
```

**Cause analysis:**
The X6 module structure does not include `Shape` or `Addon` modules. Plugins must be imported through the `@antv/x6-plugin-*` package family.

**Correct approach:**

```javascript
import { Graph } from '@antv/x6'

const graph = new Graph({
  container: 'container',
  // Plugins must be imported through standalone packages, such as @antv/x6-plugin-selection
})
```

### Error: Using nested nodes without correctly configuring the nesting relationship

**Incorrect code example:**

```javascript
const parentNode = graph.addNode({ ... })
const childNode = graph.addNode({ ... })

parentNode.addChild(childNode) // ❌ Incorrect: nesting relationship is not configured correctly
```

**Cause analysis:**
In X6, nested nodes need to specify the parent node through the `parent` property at creation time, or be managed through the `embedding` plugin.

**Correct approach:**

```javascript
const parentNode = graph.addNode({ id: 'parent', ... })
const childNode = graph.addNode({ parent: 'parent', ... }) // ✅ Correct: specified through the parent property
```
</skill>