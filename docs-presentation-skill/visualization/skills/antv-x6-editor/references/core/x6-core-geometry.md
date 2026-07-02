---
id: "x6-core-geometry"
title: "X6 Geometry Utilities"
description: |
  X6 built-in geometry toolkit, including Point / Line / Rectangle / Ellipse / Polyline / Path / Curve,
  plus Angle and util helper functions. This document is based on the actual source code in src/geometry/*.ts
  and summarizes common APIs and typical scenarios such as calculating node positions, path length, intersection checks, and angle conversion.

library: "x6"
version: "3.x"
category: "core"
subcategory: "geometry"
tags:
  - "geometry"
  - "Point"
  - "Rectangle"
  - "Line"
  - "Ellipse"
  - "Polyline"
  - "Path"
  - "Curve"
  - "Angle"
  - "toDeg"
  - "toRad"
  - "snapToGrid"
  - "containsPoint"
  - "intersect"
  - "BBox"

related:
  - "x6-core-coord"
  - "x6-core-node"
  - "x6-core-edge"
  - "x6-core-router-advanced"

use_cases:
  - "Calculate path geometry in a custom router or connector"
  - "Check whether a point falls inside a node BBox"
  - "Calculate distance, midpoint, or angle between two points"
  - "Use Rectangle to calculate intersections and containment"
  - "Snap mouse coordinates to the grid"
  - "Convert between degrees and radians"

anti_patterns:
  - "Mixing Geometry classes with DOM elements"
  - "Directly reading or writing Point / Rectangle instance properties and then forgetting to call graph.refresh()"
  - "Building angles manually with Math.atan2 while ignoring X6's built-in Angle.toDeg"

difficulty: "intermediate"
completeness: "full"
---

## Overview

X6 abstracts all geometry calculations in the `src/geometry/` module and exports them uniformly from the top-level `@antv/x6` package. These classes are **decoupled from the DOM**. They are just mathematical objects that can be used in any callback, including custom routers, connectors, connection-points, attrs, and tools.

```javascript
import { Point, Line, Rectangle, Ellipse, Polyline, Path, Curve, Angle } from '@antv/x6';
```

> All Geometry subclasses inherit from the `Geometry` base class and support method chaining; most methods return `this`.

## Angle (angle utilities, function-style exports)

Source: `src/geometry/angle.ts`. Import the namespace directly:

```javascript
import { Angle } from '@antv/x6';

Angle.toDeg(Math.PI);          // 180   radians -> degrees
Angle.toRad(180);              // pi    degrees -> radians
Angle.toRad(720, true);        // 4pi   when the second parameter over360=true, do not modulo by 360
Angle.normalize(-30);          // 330   normalize any angle to [0, 360)
```

| API | Description |
|-----|-------------|
| `Angle.toDeg(rad)` | Radians -> degrees; result modulo 360 |
| `Angle.toRad(deg, over360?)` | Degrees -> radians; by default applies `deg % 360` first |
| `Angle.normalize(angle)` | Normalizes any value to `[0, 360)` |

## Point (2D point)

Source: `src/geometry/point.ts`.

### Creating

```javascript
import { Point } from '@antv/x6';

new Point(10, 20);
Point.create(10, 20);                  // Equivalent
Point.create({ x: 10, y: 20 });        // From PointLike
Point.create([10, 20]);                // From an array
Point.fromPolar(100, Math.PI / 4);     // Polar coordinates -> Cartesian
```

### Common Instance Methods (chainable)

```javascript
const p = new Point(10, 20);

p.translate(5, 5);                     // (15, 25), mutates itself and returns this
p.scale(2, 2);                         // (30, 50), third parameter origin defaults to (0,0)
p.rotate(90, new Point(0, 0));         // Rotate 90 degrees counterclockwise around the origin (degrees, not radians)
p.distance({ x: 0, y: 0 });            // Distance to another point
p.equals({ x: 30, y: 50 });            // Whether they are equal
const q = p.clone();                   // Deep copy
p.round(2);                            // Keep 2 decimal places
p.toJSON();                            // { x, y }
```

> The angle for `rotate` is **degrees**, not radians.

### Typical Scenario: Calculate Endpoints in a Custom connection-strategy

```javascript
import { Graph, Point } from '@antv/x6';

Graph.registerConnectionStrategy('snap-by-distance', (args) => {
  const { sourcePoint, targetPoint, type, terminal } = args;
  // Snap the endpoint to a 10px grid
  const aligned = new Point(targetPoint.x, targetPoint.y).round();
  return { ...terminal, x: aligned.x, y: aligned.y };
});
```

## Line (line segment)

Source: `src/geometry/line.ts`.

### Creating

```javascript
import { Line, Point } from '@antv/x6';

new Line(0, 0, 100, 100);                       // (x1, y1, x2, y2)
new Line({ x: 0, y: 0 }, { x: 100, y: 100 });   // Two PointLike objects
```

### Common Methods

```javascript
const l = new Line(0, 0, 100, 0);

l.start;                            // Point(0,0)
l.end;                              // Point(100,0)
l.center;                           // Point(50,0) (getter)
l.getCenter();                      // Same as above

l.length();                         // 100
l.angle();                          // 0 (angle with the positive X axis, in degrees)
l.vector();                         // Point(100, 0)

l.pointAt(0.5);                     // Point(50, 0), 0-1 ratio
l.pointAtLength(30);                // Point(30, 0), by pixel length

l.containsPoint({ x: 50, y: 0 });   // true
l.intersect(new Line(50, -10, 50, 10));  // [Point(50, 0)]
l.translate(0, 10);
l.scale(2, 2);
l.rotate(90, new Point(0, 0));
l.clone();
l.equals(other);
```

## Rectangle (rectangle / BBox, most common)

Source: `src/geometry/rectangle.ts`. Most X6 APIs, such as `cell.getBBox()`, `node.getBBox()`, and `graph.getContentBBox()`, return a `Rectangle`.

### Creating

```javascript
import { Rectangle } from '@antv/x6';

new Rectangle(10, 20, 100, 60);                   // (x, y, width, height)
Rectangle.create(10, 20, 100, 60);
Rectangle.create({ x: 10, y: 20, width: 100, height: 60 });
Rectangle.create([10, 20, 100, 60]);
Rectangle.fromEllipse(ellipse);
```

### Center / Corners / Size

```javascript
const r = new Rectangle(10, 20, 100, 60);

r.getCenter();           // Point(60, 50)
r.getCenterX();          // 60
r.getCenterY();          // 50
r.getOrigin();           // Point(10, 20)
r.getCorner();           // Point(110, 80), bottom right
r.getTopLeft();
r.getTopRight();
r.getBottomLeft();
r.getBottomRight();
r.getTopMiddle();
r.getBottomMiddle();
r.getLeftMiddle();
r.getRightMiddle();
r.toJSON();              // { x, y, width, height }
```

### Geometric Transformations

```javascript
r.translate(5, 5);
r.scale(2, 2);                                  // Third parameter origin defaults to (0,0)
r.rotate(45);                                   // Rotate around the center and return the rotated BBox
r.rotate90();                                   // 90-degree rotation (dedicated shortcut)
r.inflate(10);                                  // Expand 10px in all directions
r.inflate(10, 20);                              // x +10, y +20
r.normalize();                                  // Convert negative width / height to positive
r.round(2);
```

### Checks

```javascript
r.containsPoint(50, 50);
r.containsPoint({ x: 50, y: 50 });
r.containsRect(other);
r.intersectsWithLine(line);                      // Returns intersection point array | null
r.intersectsWithRect(other);                     // Returns intersecting Rectangle | null
r.intersectsWithLineFromCenterToPoint(target);   // Intersection between the ray from center to target and the edge
r.equals(other);
r.clone();
```

### Typical Scenario: Check Whether Nodes Are Inside the Visible Canvas Area

```javascript
import { Rectangle } from '@antv/x6';

const viewport = Rectangle.create(graph.getGraphArea());  // Current viewport
const visibleNodes = graph.getNodes().filter((n) => {
  return viewport.intersectsWithRect(n.getBBox()) != null;
});
```

## Ellipse (ellipse)

Source: `src/geometry/ellipse.ts`.

```javascript
import { Ellipse, Rectangle } from '@antv/x6';

new Ellipse(centerX, centerY, semiAxisA, semiAxisB);
Ellipse.fromRect(rect);              // From an inscribed rectangle

const e = new Ellipse(50, 50, 40, 20);
e.bbox();                            // Bounding Rectangle
e.center();                          // Point(50, 50)
e.containsPoint({ x: 50, y: 50 });   // true
e.intersectionWithLine(line);        // Intersections with a line segment
e.tangentTheta(point);               // Tangent angle
e.clone();
```

## Polyline (polyline)

Source: `src/geometry/polyline.ts`.

```javascript
import { Polyline, Point } from '@antv/x6';

const pl = new Polyline([new Point(0, 0), new Point(50, 50), new Point(100, 0)]);
// PointLike[] / [number, number][] are also supported
new Polyline([[0, 0], [50, 50], [100, 0]]);
new Polyline([{x:0,y:0}, {x:50,y:50}, {x:100,y:0}]);

pl.length();                         // Total polyline length
pl.pointAt(0.5);                     // Locate by ratio
pl.pointAtLength(60);                // Locate by length
pl.bbox();                           // Bounding Rectangle
pl.simplify();                       // Remove collinear points
pl.clone();
```

## Path / Curve (SVG path and cubic Bezier)

Source: `src/geometry/path/*` and `src/geometry/curve.ts`.

```javascript
import { Path, Curve } from '@antv/x6';

const path = new Path();
path
  .moveTo(0, 0)
  .lineTo(100, 0)
  .quadTo(150, 50, 100, 100)
  .curveTo(80, 120, 20, 120, 0, 100)
  .close();

path.length();                       // Arc length (approximate)
path.bbox();                         // Bounding rectangle
path.pointAtLength(50);              // Get a point along the path
path.serialize();                    // Output a standard SVG d string

// Cubic Bezier
const c = new Curve(
  { x: 0, y: 0 },
  { x: 30, y: 100 },
  { x: 70, y: 100 },
  { x: 100, y: 0 },
);
c.pointAt(0.5);
c.length();
c.divide(0.5);                       // Split into two segments
```

Path is very commonly used in custom connectors and markers:

```javascript
// Custom connector
import { Graph, Path, Point } from '@antv/x6';

Graph.registerConnector('curve-connector', (sourcePoint, targetPoint) => {
  const path = new Path();
  path.moveTo(sourcePoint.x, sourcePoint.y);
  path.curveTo(
    sourcePoint.x + 80, sourcePoint.y,
    targetPoint.x - 80, targetPoint.y,
    targetPoint.x, targetPoint.y,
  );
  return path.serialize();
}, true);
```

## util (numeric utilities)

Source: `src/geometry/util.ts`. These are not exported through the `Geometry` class name; import them from the top-level `@antv/x6` package:

```javascript
import { round, random, clamp, snapToGrid, containsPoint, squaredLength } from '@antv/x6';

round(3.14159, 2);                    // 3.14
random();                             // 0-1
random(10);                           // 0-10 integer
random(5, 15);                        // 5-15 integer
clamp(150, 0, 100);                   // 100
snapToGrid(73, 10);                   // 70
containsPoint({ x:0, y:0, width:100, height:100 }, { x: 50, y: 50 });  // true
squaredLength({ x:0, y:0 }, { x:3, y:4 });   // 25
```

> `snapToGrid` is extremely common when implementing "snap mouse dragging to grid" behavior.

## End-to-End Example: Implement a "Center Nodes and Edges" Button with Geometry Utilities

```javascript
import { Graph, Rectangle, Point } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  background: { color: '#F2F7FA' },
  panning: true,
  mousewheel: { enabled: true, modifiers: 'ctrl' },
});

// Add sample content
const a = graph.addNode({ shape: 'rect', x: 40,  y: 40,  width: 80, height: 40, label: 'A' });
const b = graph.addNode({ shape: 'rect', x: 320, y: 220, width: 80, height: 40, label: 'B' });
graph.addEdge({ source: a, target: b });

graph.centerContent();

// Business method: align all node centers to the horizontal centerline of the canvas
function centerHorizontally() {
  const area = Rectangle.create(graph.getGraphArea());
  const cy = area.getCenterY();
  graph.getNodes().forEach((node) => {
    const bbox = node.getBBox();
    const newY = cy - bbox.height / 2 - area.y; // Convert to node coordinates
    node.position(node.position().x, newY);
  });
}

// How to call it:
// centerHorizontally();
```

## Common Mistakes and Fixes

### Passing radians to Point.rotate when it expects degrees

```javascript
// Incorrect: rotate accepts degrees
new Point(10, 0).rotate(Math.PI / 2);   // Actually rotates only 1.57 degrees

// Correct
new Point(10, 0).rotate(90);
// Or convert from radians
import { Angle } from '@antv/x6';
new Point(10, 0).rotate(Angle.toDeg(Math.PI / 2));
```

### Treating Geometry Objects as DOM Elements

```javascript
// Incorrect: Rectangle is only a mathematical object and has no DOM reference
const r = new Rectangle(0, 0, 100, 100);
r.style.background = 'red';            // TypeError

// Correct: to style canvas elements, use cell.attr(...) or cell.setProp(...)
node.attr('body/fill', 'red');
```

### Modifying Rectangle Instance Properties and Forgetting to Sync Them Back to the Cell

```javascript
// Incorrect: node.getBBox() returns a new Rectangle copy, so modifying it does not affect the node
const bbox = node.getBBox();
bbox.x += 50;                          // The node position does not change

// Correct: use the node API
node.translate(50, 0);
// Or
node.position(node.position().x + 50, node.position().y);
```

### Setting gridSize to 0 When Using `snapToGrid`

```javascript
// Incorrect: this returns NaN
snapToGrid(73, 0);

// Correct: grid must be > 0
snapToGrid(73, graph.getGridSize() || 10);
```
