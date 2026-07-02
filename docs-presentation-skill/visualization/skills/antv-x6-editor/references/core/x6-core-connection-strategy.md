---
id: "x6-core-connection-strategy"
title: "X6 Connection Strategy"
description: |
  Connection strategies determine how source/target endpoint data is generated when a connection is dropped: use the default anchor (noop), pin to absolute coordinates (pinAbsolute), or pin to a relative position (pinRelative).

library: "x6"
version: "3.x"
category: "core"
subcategory: "connection-strategy"
tags:
  - "connectionStrategy"
  - "connection strategy"
  - "pinAbsolute"
  - "pinRelative"
  - "connection landing point"
  - "anchor pinning"

related:
  - "x6-core-anchor"
  - "x6-core-connection-point"
  - "x6-core-edge"

use_cases:
  - "Drop connections precisely at the mouse release position"
  - "Pin connections to relative positions on node edges"
  - "Customize connection endpoint position logic"

difficulty: "advanced"
completeness: "full"
---

## Concept Overview

When users create connections by dragging, the source/target endpoints of the edge connect to node anchors by default. A **Connection Strategy** can change this default behavior and anchor endpoints to more precise positions.

Three built-in strategies:

| Strategy | Description |
|----------|-------------|
| `noop` | Default behavior. Performs no extra processing and uses the normal anchor calculation |
| `pinAbsolute` | Pins the endpoint to the absolute coordinate position where the mouse was released (x/y offset relative to the node's top-left corner) |
| `pinRelative` | Pins the endpoint to the relative position where the mouse was released (a 0-1 ratio) |

## Basic Usage

Configure it in the Graph `connecting` options:

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  connecting: {
    connectionStrategy: 'pinRelative',
  },
});
```

## pinAbsolute

Pins the endpoint to the absolute coordinates (pixel values) corresponding to the mouse release position:

```javascript
const graph = new Graph({
  container: 'container',
  connecting: {
    connectionStrategy: 'pinAbsolute',
  },
});
```

After the connection is created, the edge source/target data contains an `anchor` field:

```javascript
// Example connection data
{
  source: { cell: 'node1', anchor: { name: 'topLeft', args: { dx: 50, dy: 20 } } },
  target: { cell: 'node2', anchor: { name: 'topLeft', args: { dx: 30, dy: 40 } } },
}
```

## pinRelative

Pins the endpoint to the relative ratio (0-1) of the mouse release position:

```javascript
const graph = new Graph({
  container: 'container',
  connecting: {
    connectionStrategy: 'pinRelative',
  },
});
```

The relative position is represented as a ratio. After the node moves or resizes, the connection endpoint follows automatically:

```javascript
// Example connection data (end values are relative offsets from -1 to 1)
{
  source: { cell: 'node1', anchor: { name: 'nodeCenter', args: { dx: '20%', dy: '30%' } } },
  target: { cell: 'node2', anchor: { name: 'nodeCenter', args: { dx: '-10%', dy: '15%' } } },
}
```

## Use Case Comparison

| Scenario | Recommended Strategy |
|----------|----------------------|
| Standard flowcharts/DAGs (connections to ports) | `noop` (default) |
| Free-form connections to any position on a node | `pinRelative` |
| Precise positioning, such as circuit diagrams | `pinAbsolute` |

## Working with Ports

When a connection attaches to a port, connection strategies usually do not need to be configured because the port itself is already a precise anchor. Connection strategies are mainly used when there are **no ports and the connection attaches directly to the node body**.

```javascript
const graph = new Graph({
  container: 'container',
  connecting: {
    allowBlank: false,
    // connectionStrategy is usually unnecessary when ports exist
    // Use this when there are no ports and precise landing points are required:
    connectionStrategy: 'pinRelative',
  },
});
```

## Custom Connection Strategies

You can register a custom strategy:

```javascript
import { Graph } from '@antv/x6';

Graph.registerConnectionStrategy('myStrategy', (terminal, cellView, magnet, coords, edge, type, options) => {
  // terminal: current endpoint data { cell, port, ... }
  // cellView: view of the target node/edge
  // magnet: DOM element that triggered the connection
  // coords: canvas coordinates where the mouse was released { x, y }
  // Return the modified terminal data
  return {
    ...terminal,
    anchor: {
      name: 'center',
    },
  };
});

const graph = new Graph({
  container: 'container',
  connecting: {
    connectionStrategy: 'myStrategy',
  },
});
```

## Common Mistakes

### Using pinAbsolute for Nodes with Ports

```javascript
// Not recommended: using pinAbsolute on nodes with ports can make anchor calculation confusing
const graph = new Graph({
  container: 'container',
  connecting: { connectionStrategy: 'pinAbsolute' },
});
graph.addNode({
  x: 100, y: 100, width: 80, height: 40,
  ports: { items: [{ id: 'p1', group: 'out' }] },  // Ports already exist
});
// During connection, the port position is ignored and the edge connects to the absolute mouse release position
```

```javascript
// Correct: use the default strategy (noop) when ports exist so connections attach naturally to ports
const graph = new Graph({
  container: 'container',
  connecting: { allowBlank: false },  // Uses the default strategy
});
```
