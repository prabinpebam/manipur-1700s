---
id: "x6-core-port-layout"
title: "X6 Port Layout"
description: |
  Layout strategies for positioning ports on nodes and for laying out port labels.
  Port layout controls how ports are distributed on node boundaries, while port label layout controls where port labels are displayed and how they are oriented.

library: "x6"
version: "3.x"
category: "core"
subcategory: "port-layout"
tags:
  - "port"
  - "layout"
  - "port layout"
  - "port position"
  - "top"
  - "bottom"
  - "left"
  - "right"
  - "absolute"
  - "ellipse"
  - "line"
  - "label"

related:
  - "x6-core-ports"
  - "x6-core-node"
  - "x6-core-edge"

use_cases:
  - "Control how ports are distributed on the four sides of a node"
  - "Customize absolute port positions"
  - "Distribute ports along an ellipse"
  - "Control port-label position and orientation"

difficulty: "intermediate"
completeness: "full"
---

## Core Concepts

Port layout in X6 has two layers:

- **Port Layout**: determines the coordinates of ports on the node BBox
- **Port Label Layout**: determines the port label position, angle, and text anchor relative to the port

Both are configured through the `position` and `label.position` fields of a port group.

## Port Layout

### Configuration Method

Set the `position` field in `ports.groups` on the node:

```javascript
graph.addNode({
  shape: 'rect',
  x: 100,
  y: 100,
  width: 120,
  height: 60,
  ports: {
    groups: {
      in: {
        position: 'left',  // String shorthand
        attrs: { circle: { r: 5, magnet: true, stroke: '#8f8f8f', fill: '#fff' } },
      },
      out: {
        position: { name: 'right', args: { strict: true } },  // Object format with arguments
        attrs: { circle: { r: 5, magnet: true, stroke: '#8f8f8f', fill: '#fff' } },
      },
    },
    items: [
      { id: 'in1', group: 'in' },
      { id: 'in2', group: 'in' },
      { id: 'out1', group: 'out' },
    ],
  },
});
```

### Built-in Port Layouts

| Name | Description |
|------|-------------|
| `'left'` | Evenly distributed along the left side of the node |
| `'right'` | Evenly distributed along the right side of the node |
| `'top'` | Evenly distributed along the top side of the node |
| `'bottom'` | Evenly distributed along the bottom side of the node |
| `'line'` | Evenly distributed along a custom line segment |
| `'absolute'` | Each port specifies its own absolute coordinates |
| `'ellipse'` | Distributed along an elliptical arc |
| `'ellipseSpread'` | Evenly spread along an ellipse |

### left / right / top / bottom Arguments

| Argument | Type | Default | Description |
|----------|------|---------|-------------|
| `strict` | `boolean` | `false` | Whether to use strict equal spacing. `false`: ports occupy the middle area and are evenly distributed; `true`: equal spacing includes the margins at both ends |
| `dx` | `number` | `0` | X offset for each port |
| `dy` | `number` | `0` | Y offset for each port |

**Difference with strict**:
- `strict: false` (default): N ports divide the side into N equal sections, and ports are placed at the midpoint of each section. For example, 2 ports are placed at 1/4 and 3/4.
- `strict: true`: N ports divide the side into N+1 equal sections, and ports are placed at the division points. For example, 2 ports are placed at 1/3 and 2/3.

### line Arguments

Distribute ports along a custom line segment.

| Argument | Type | Default | Description |
|----------|------|---------|-------------|
| `start` | `{ x, y }` | Node top-left corner | Start point of the line segment (relative to the node BBox) |
| `end` | `{ x, y }` | Node bottom-right corner | End point of the line segment (relative to the node BBox) |
| `strict` | `boolean` | `false` | Whether to use strict equal spacing |
| `dx` | `number` | `0` | X offset |
| `dy` | `number` | `0` | Y offset |

### absolute Arguments

Each port specifies its own position. Set it through the `args` of each port in `items`:

| Argument | Type | Default | Description |
|----------|------|---------|-------------|
| `x` | `number \| string` | `0` | X coordinate; supports percentages such as `'50%'` |
| `y` | `number \| string` | `0` | Y coordinate; supports percentages such as `'50%'` |
| `angle` | `number` | `0` | Rotation angle |

### ellipse / ellipseSpread Arguments

| Argument | Type | Default | Description |
|----------|------|---------|-------------|
| `start` | `number` | `0` | Start angle in degrees |
| `step` | `number` | `20` (ellipse) / `360/N` (ellipseSpread) | Angle step |
| `compensateRotate` | `boolean` | `false` | Whether to compensate rotation so ports always face outward |
| `dr` | `number` | `0` | Radial offset (positive outward, negative inward) |
| `dx` | `number` | `0` | X offset |
| `dy` | `number` | `0` | Y offset |

**ellipse vs ellipseSpread**:
- `ellipse`: ports expand to both sides by `step` degrees, centered on `start`
- `ellipseSpread`: ports are evenly distributed along the ellipse, and the step is calculated automatically as `360/N`

## Port Label Layout

### Configuration Method

Set it in `label.position` on the port group:

```javascript
ports: {
  groups: {
    in: {
      position: 'left',
      label: {
        position: 'left',  // Show the label to the left of the port
      },
      attrs: { circle: { r: 5, magnet: true, stroke: '#8f8f8f', fill: '#fff' } },
    },
  },
}
```

### Built-in Label Layouts

| Name | Description |
|------|-------------|
| `'left'` | Label is to the left of the port and right-aligned |
| `'right'` | Label is to the right of the port and left-aligned |
| `'top'` | Label is above the port and centered |
| `'bottom'` | Label is below the port and centered |
| `'outside'` | Label is outside the port (relative to the node center) |
| `'outsideOriented'` | Same as outside, but the text orientation follows the angle |
| `'inside'` | Label is inside the port (near the node center) |
| `'insideOriented'` | Same as inside, but the text orientation follows the angle |
| `'radial'` | Radial layout; the label is offset outward along the radial direction |
| `'radialOriented'` | Same as radial, but the text orientation follows the radial angle |
| `'manual'` | Manually specify the position |

### outside / inside Arguments

| Argument | Type | Default | Description |
|----------|------|---------|-------------|
| `offset` | `number` | `15` | Distance between the label and the port |

### radial Arguments

| Argument | Type | Default | Description |
|----------|------|---------|-------------|
| `offset` | `number` | `20` | Offset distance along the radial direction |

## Complete Example

### Four-Side Ports (Most Common)

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  connecting: { allowBlank: false, router: 'orth', connector: 'rounded' },
});

graph.addNode({
  shape: 'rect',
  x: 200,
  y: 150,
  width: 160,
  height: 80,
  label: 'Process Node',
  attrs: { body: { fill: '#fff', stroke: '#8f8f8f', rx: 6, ry: 6 } },
  ports: {
    groups: {
      in: {
        position: 'left',
        label: { position: 'left' },
        attrs: { circle: { r: 5, magnet: true, stroke: '#1890ff', fill: '#fff' } },
      },
      out: {
        position: 'right',
        label: { position: 'right' },
        attrs: { circle: { r: 5, magnet: true, stroke: '#52c41a', fill: '#fff' } },
      },
    },
    items: [
      { id: 'in1', group: 'in', attrs: { text: { text: 'Input 1' } } },
      { id: 'in2', group: 'in', attrs: { text: { text: 'Input 2' } } },
      { id: 'out1', group: 'out', attrs: { text: { text: 'Output' } } },
    ],
  },
});
```

### Absolute-Positioned Ports

```javascript
graph.addNode({
  shape: 'rect',
  x: 100,
  y: 100,
  width: 160,
  height: 80,
  label: 'Custom Port Positions',
  attrs: { body: { fill: '#fff', stroke: '#8f8f8f', rx: 6, ry: 6 } },
  ports: {
    groups: {
      custom: {
        position: 'absolute',
        attrs: { circle: { r: 5, magnet: true, stroke: '#8f8f8f', fill: '#fff' } },
      },
    },
    items: [
      { id: 'p1', group: 'custom', args: { x: 0, y: '25%' } },
      { id: 'p2', group: 'custom', args: { x: '100%', y: '25%' } },
      { id: 'p3', group: 'custom', args: { x: '50%', y: '100%' } },
    ],
  },
});
```

### Ellipse-Distributed Ports

```javascript
graph.addNode({
  shape: 'ellipse',
  x: 200,
  y: 150,
  width: 120,
  height: 120,
  label: 'Service',
  attrs: { body: { fill: '#fff', stroke: '#8f8f8f' } },
  ports: {
    groups: {
      around: {
        position: { name: 'ellipseSpread', args: { start: 0 } },
        label: { position: 'outside' },
        attrs: { circle: { r: 4, magnet: true, stroke: '#8f8f8f', fill: '#fff' } },
      },
    },
    items: [
      { id: 'p1', group: 'around', attrs: { text: { text: 'API' } } },
      { id: 'p2', group: 'around', attrs: { text: { text: 'DB' } } },
      { id: 'p3', group: 'around', attrs: { text: { text: 'MQ' } } },
      { id: 'p4', group: 'around', attrs: { text: { text: 'RPC' } } },
    ],
  },
});
```

### strict Mode Comparison

```javascript
// 2 ports on the left side:
// strict: false → placed at 1/4 and 3/4 (default; visually more centered)
// strict: true  → placed at 1/3 and 2/3 (equal spacing including end margins)

graph.addNode({
  shape: 'rect',
  x: 100, y: 100, width: 120, height: 80,
  ports: {
    groups: {
      left: {
        position: { name: 'left', args: { strict: true } },
        attrs: { circle: { r: 5, magnet: true, stroke: '#8f8f8f', fill: '#fff' } },
      },
    },
    items: [
      { id: 'p1', group: 'left' },
      { id: 'p2', group: 'left' },
    ],
  },
});
```

## Common Errors

### ❌ Confusing port layout and port label layout

```javascript
// Error: position is the port layout, not the label position
ports: {
  groups: {
    in: {
      position: 'outside', // ❌ 'outside' is a label layout, not a port layout
    },
  },
}

// Correct
ports: {
  groups: {
    in: {
      position: 'left',               // ✅ Port layout
      label: { position: 'outside' }, // ✅ Label layout
    },
  },
}
```

### ❌ Forgetting to pass args in items for absolute layout

```javascript
// Error: absolute requires each item to specify a position
ports: {
  groups: { custom: { position: 'absolute' } },
  items: [
    { id: 'p1', group: 'custom' }, // ❌ Missing args; defaults to (0,0)
  ],
}

// Correct
ports: {
  groups: { custom: { position: 'absolute' } },
  items: [
    { id: 'p1', group: 'custom', args: { x: '50%', y: 0 } }, // ✅
  ],
}
```
