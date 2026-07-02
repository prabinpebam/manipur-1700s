---
id: "x6-core-connector-params"
title: "Complete X6 Connector Parameters"
description: |
  Complete parameter reference for the five built-in X6 connectors (normal/rounded/smooth/jumpover/loop), including key options such as rounded radius and smooth direction.
library: x6
version: 3.x
category: "core"
tags:
  - connector
  - rounded
  - smooth
  - normal
  - jumpover
  - loop
  - radius
  - direction
---

# Complete Connector Parameters

## Overview

A Connector determines the line style of an edge: how to draw curves between the path points calculated by the router. X6 3.x includes five built-in connectors.

## Usage

```javascript
// String shorthand (uses default parameters)
graph.addEdge({ source, target, connector: 'rounded' });

// Object form (passes parameters)
graph.addEdge({
  source, target,
  connector: { name: 'rounded', args: { radius: 20 } },
});
```

## normal - Straight Line Segments (Default)

Connects path points with straight line segments and has no additional parameters.

```javascript
graph.addEdge({ source, target, connector: 'normal' });
```

**Parameters:** No special parameters.

---

## rounded - Rounded Polyline

Draws rounded corners at polyline turns using Bezier curves.

```javascript
graph.addEdge({
  source, target,
  router: 'orth',
  connector: { name: 'rounded', args: { radius: 10 } },
});
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `radius` | number | `10` | Corner radius (px). Larger values create larger rounded corners. The actual corner radius does not exceed half the length of the adjacent line segments |

**Example Comparison:**

```javascript
// Small rounded corners
connector: { name: 'rounded', args: { radius: 5 } }

// Large rounded corners
connector: { name: 'rounded', args: { radius: 30 } }
```

---

## smooth - Bezier Curve

Connects the start and end points with a cubic Bezier curve. If route points exist, it fits the path through them using a Catmull-Rom spline.

```javascript
graph.addEdge({
  source, target,
  connector: { name: 'smooth', args: { direction: 'H' } },
});
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `direction` | `'H'` \| `'V'` | Auto | Direction of the Bezier curve control points. `'H'` means horizontal (suitable for left-to-right layouts), and `'V'` means vertical (suitable for top-to-bottom layouts). If omitted, it is selected automatically based on the distance between the start and end points |

**direction Details:**
- `'H'` (horizontal): control points take the midpoint along the X axis, producing an S-shaped horizontal curve. Suitable for DAGs, lineage graphs, and other left-to-right layouts
- `'V'` (vertical): control points take the midpoint along the Y axis, producing an S-shaped vertical curve. Suitable for org charts and other top-to-bottom layouts
- Omitted: automatically chooses `'H'` when `|dx| >= |dy|`; otherwise chooses `'V'`

**Note:** When route points (`routePoints`) exist, the `direction` parameter is ignored. Instead, a Catmull-Rom spline is used to pass through all route points.

```javascript
// Lineage graph with a horizontal layout
graph.addEdge({
  source: { cell: leftNode, port: 'out' },
  target: { cell: rightNode, port: 'in' },
  connector: { name: 'smooth', args: { direction: 'H' } },
});

// Org chart with a vertical layout
graph.addEdge({
  source: { cell: parentNode, port: 'bottom' },
  target: { cell: childNode, port: 'top' },
  connector: { name: 'smooth', args: { direction: 'V' } },
});
```

---

## jumpover - Jump-Over Connector

When two edges cross on the canvas, this connector draws an arc-shaped jump-over at the crossing to distinguish the different paths.

```javascript
graph.addEdge({
  source, target,
  connector: { name: 'jumpover', args: { size: 5, type: 'arc' } },
});
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `type` | `'arc'` \| `'gap'` \| `'cubic'` | `'arc'` | Jump-over style: arc/gap/cubic curve |
| `size` | number | `5` | Jump-over size (radius or gap width) |

---

## loop - Self-Loop Connector

Used when an edge's source and target are the same node. It draws a loop-shaped path that starts from the node and returns to itself.

```javascript
graph.addEdge({
  source: node,
  target: node,
  connector: { name: 'loop', args: { width: 50, height: 80, direction: 'top' } },
});
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `width` | number | | Width of the loop |
| `height` | number | | Height of the loop |
| `direction` | string | | Direction of the loop |

---

## Custom Connectors

Register a custom connector with `Graph.registerConnector`:

```javascript
import { Graph, Path } from '@antv/x6';

Graph.registerConnector('wobble', (sourcePoint, targetPoint, routePoints, options) => {
  const path = new Path();
  path.appendSegment(Path.createSegment('M', sourcePoint));
  // Custom path logic
  path.appendSegment(Path.createSegment('L', targetPoint));
  return options.raw ? path : path.serialize();
});

graph.addEdge({
  source, target,
  connector: { name: 'wobble', args: {} },
});
```

**Connector Function Signature:**

```typescript
(
  sourcePoint: PointLike,      // Start point coordinates
  targetPoint: PointLike,      // End point coordinates
  routePoints: PointLike[],    // Intermediate path points calculated by the router
  options: T,                  // User-provided args
  edgeView: EdgeView,          // Edge view instance
) => Path | string             // Returns a Path object or an SVG path string
```

## Complete Example

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  connecting: {
    router: 'orth',
    connector: { name: 'rounded', args: { radius: 8 } },
  },
});

const n1 = graph.addNode({ shape: 'rect', x: 50, y: 50, width: 80, height: 40, label: 'A' });
const n2 = graph.addNode({ shape: 'rect', x: 300, y: 50, width: 80, height: 40, label: 'B' });
const n3 = graph.addNode({ shape: 'rect', x: 300, y: 250, width: 80, height: 40, label: 'C' });

// rounded polyline with rounded corners
graph.addEdge({ source: n1, target: n2, router: 'orth', connector: { name: 'rounded', args: { radius: 15 } } });

// smooth Bezier curve
graph.addEdge({ source: n1, target: n3, connector: { name: 'smooth', args: { direction: 'H' } } });

// Self-loop edge
graph.addEdge({ source: n2, target: n2, connector: 'loop' });
```

## Common Mistakes

```javascript
// Incorrect: rounded has no polyline corner to round when used without a router
graph.addEdge({ source, target, connector: 'rounded' });
// A straight line with only a start and end point has no visible rounded effect

// Correct: combine with the orth/manhattan router to create a polyline
graph.addEdge({ source, target, router: 'orth', connector: 'rounded' });

// Incorrect: misspelled smooth direction
connector: { name: 'smooth', args: { direction: 'horizontal' } }  // Invalid

// Correct: only 'H' or 'V' are accepted
connector: { name: 'smooth', args: { direction: 'H' } }
```
