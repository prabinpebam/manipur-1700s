---
id: "x6-core-connector-advanced"
title: "X6 Advanced Connectors"
description: |
  In addition to the commonly used normal, rounded, and smooth connectors, X6 also provides loop (self-loop connector) and jumpover (jump-over connector).
  They are suitable for scenarios such as drawing self-loop edges and displaying jump-overs on crossing lines.

library: "x6"
version: "3.x"
category: "core"
subcategory: "edge"
tags:
  - "connector"
  - "connector"
  - "loop"
  - "jumpover"
  - "jump-over"
  - "self-loop"
  - "crossing"

related:
  - "x6-core-edge"
  - "x6-core-router-advanced"

use_cases:
  - "Draw curves for self-loop edges"
  - "Show jump-overs for crossing connections"
  - "Avoid visual overlap between connections"
  - "State-machine self-loops"

difficulty: "intermediate"
completeness: "full"
---

## Complete Connector List

| Connector | Description | Typical Scenario |
|-----------|-------------|------------------|
| `normal` | Default. Connects route points with straight line segments | Simple connections |
| `rounded` | Polyline with rounded corners | Flowcharts |
| `smooth` | Bezier curve | Smooth connections |
| `jumpover` | Jump-over connector that creates arc jumps at crossings | Complex wiring diagrams |
| `loop` | Self-loop curve | Self-loop edges |

---

## Loop Connector

A connector designed specifically for self-loop edges. It uses quadratic Bezier curves (`Q` commands) to draw arcs and works together with the `loop` router.

### Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `split` | `boolean \| number` | - | Whether to split the curve |

### Example

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({ container: 'container' });

const node = graph.addNode({
  shape: 'rect',
  x: 150,
  y: 100,
  width: 100,
  height: 50,
  label: 'State A',
  attrs: { body: { fill: '#fff', stroke: '#8f8f8f', rx: 6, ry: 6 } },
});

// Self-loop edge: the loop router and loop connector must be used together
graph.addEdge({
  source: node,
  target: node,
  router: {
    name: 'loop',
    args: { width: 60, height: 100, angle: 'auto' },
  },
  connector: { name: 'loop' },
  label: 'Retry',
  attrs: {
    line: { stroke: '#f5222d', strokeWidth: 2, targetMarker: 'classic' },
  },
});
```

### Key Notes

- **Must be used with the `loop` router**. The router provides intermediate control points, and the connector uses them to draw the curve.
- The generated path is composed of two joined `Q` segments (quadratic Bezier curves).

---

## Jumpover Connector

When multiple edges cross, this connector draws an arc-shaped jump-over at each crossing to avoid visual confusion.

### Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `size` | `number` | `5` | Size (radius) of the jump-over arc |
| `type` | `'arc' \| 'gap' \| 'cubic'` | `'arc'` | Jump-over style type |
| `radius` | `number` | `0` | Polyline corner radius |
| `ignoreConnectors` | `string[]` | `['smooth']` | Connector types whose crossings should be ignored |

### Jump-Over Types

- **`arc`**: Semi-circular jump-over (default), the most common option
- **`gap`**: Creates a break/gap
- **`cubic`**: Uses a cubic curve for a smoother jump-over

### Example

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  connecting: {
    connector: {
      name: 'jumpover',
      args: {
        size: 8,
        type: 'arc',
      },
    },
  },
});

// Create multiple crossing edges
const node1 = graph.addNode({
  shape: 'rect', x: 50, y: 50, width: 80, height: 40, label: 'A',
  attrs: { body: { fill: '#fff', stroke: '#8f8f8f', rx: 4, ry: 4 } },
});
const node2 = graph.addNode({
  shape: 'rect', x: 300, y: 50, width: 80, height: 40, label: 'B',
  attrs: { body: { fill: '#fff', stroke: '#8f8f8f', rx: 4, ry: 4 } },
});
const node3 = graph.addNode({
  shape: 'rect', x: 50, y: 200, width: 80, height: 40, label: 'C',
  attrs: { body: { fill: '#fff', stroke: '#8f8f8f', rx: 4, ry: 4 } },
});
const node4 = graph.addNode({
  shape: 'rect', x: 300, y: 200, width: 80, height: 40, label: 'D',
  attrs: { body: { fill: '#fff', stroke: '#8f8f8f', rx: 4, ry: 4 } },
});

// Two crossing edges
graph.addEdge({
  source: node1,
  target: node4,
  connector: { name: 'jumpover', args: { size: 8, type: 'arc' } },
  attrs: { line: { stroke: '#5b8ff9', strokeWidth: 2 } },
});

graph.addEdge({
  source: node2,
  target: node3,
  connector: { name: 'jumpover', args: { size: 8, type: 'arc' } },
  attrs: { line: { stroke: '#52c41a', strokeWidth: 2 } },
});
```

### Setting jumpover on a Single Edge

```javascript
// Configure a single edge
graph.addEdge({
  source: node1,
  target: node2,
  connector: {
    name: 'jumpover',
    args: {
      size: 6,
      type: 'cubic',
      radius: 4,
    },
  },
  attrs: { line: { stroke: '#333', strokeWidth: 2 } },
});
```

### Setting jumpover as the Global Default

```javascript
// Configure globally during Graph initialization
const graph = new Graph({
  container: 'container',
  connecting: {
    connector: {
      name: 'jumpover',
      args: { size: 5, type: 'arc' },
    },
  },
});
```

---

## Connector Shorthand and Object Syntax

```javascript
// Shorthand (when there are no arguments)
graph.addEdge({ source, target, connector: 'rounded' });

// Object syntax (when passing arguments)
graph.addEdge({
  source,
  target,
  connector: {
    name: 'rounded',
    args: { radius: 10 },
  },
});
```

---

## Common Mistakes and Fixes

### Mistake 1: Using only the loop connector for a self-loop edge without the loop router

```javascript
// Incorrect: the loop router is missing, so the connector has no correct control points
graph.addEdge({
  source: node,
  target: node,
  connector: { name: 'loop' },
});

// Correct: use the router and connector together
graph.addEdge({
  source: node,
  target: node,
  router: { name: 'loop', args: { width: 50, height: 80 } },
  connector: { name: 'loop' },
});
```

### Mistake 2: jumpover does not take effect

```javascript
// Incorrect: only one edge uses jumpover, while the other uses smooth (ignored by default)
// jumpover ignores crossings with smooth connectors by default

// Correct: ensure every edge that needs a jump-over uses jumpover or a non-ignored connector
// Or modify the ignoreConnectors parameter
connector: {
  name: 'jumpover',
  args: { ignoreConnectors: [] },  // Do not ignore any connectors
}
```

### Mistake 3: Misspelling the jumpover type

```javascript
// Incorrect
connector: { name: 'jumpover', args: { type: 'curve' } }

// Correct: type must be one of 'arc' | 'gap' | 'cubic'
connector: { name: 'jumpover', args: { type: 'cubic' } }
```
