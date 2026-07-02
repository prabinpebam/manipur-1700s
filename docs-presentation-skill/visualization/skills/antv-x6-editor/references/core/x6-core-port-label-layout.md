---
id: "x6-core-port-label-layout"
title: "X6 Port Label Layout"
description: |
  X6 port label layout strategies: side (fixed direction), outside/inside (outside/inside the node), radial, and more. These strategies control the position and orientation of port text.

library: "x6"
version: "3.x"
category: "core"
subcategory: "port-label-layout"
tags:
  - "port"
  - "label"
  - "port-label-layout"
  - "port label"
  - "label position"
  - "outside"
  - "inside"
  - "radial"

related:
  - "x6-core-ports"
  - "x6-core-port-layout"
  - "x6-core-node"

use_cases:
  - "Show port labels to the left, right, above, or below ports"
  - "Automatically show port labels outward"
  - "Show port labels inside nodes"
  - "Use radial port-label layout for circular nodes"
  - "Customize port-label offsets"

difficulty: "intermediate"
completeness: "full"
---

## Concept

Port Label Layout controls the offset and alignment of port text relative to the port position. Unlike Port Layout, which controls where ports are placed on the node, label layout affects only where text is displayed.

## Basic Usage

Configure it with `label.position` in port groups:

```javascript
graph.addNode({
  x: 100,
  y: 100,
  width: 160,
  height: 80,
  ports: {
    groups: {
      in: {
        position: 'left',
        label: {
          position: 'left',  // Show the label to the left of the port
        },
        attrs: { circle: { r: 5, magnet: true, stroke: '#8f8f8f', fill: '#fff' } },
      },
      out: {
        position: 'right',
        label: {
          position: 'right',  // Show the label to the right of the port
        },
        attrs: { circle: { r: 5, magnet: true, stroke: '#8f8f8f', fill: '#fff' } },
      },
    },
    items: [
      { id: 'in-1', group: 'in', attrs: { text: { text: 'Input' } } },
      { id: 'out-1', group: 'out', attrs: { text: { text: 'Output' } } },
    ],
  },
});
```

## Built-in Layout Strategies

### Side Class (Fixed Direction)

| Name | Description |
|------|-------------|
| `'left'` | Label is to the left of the port and right-aligned |
| `'right'` | Label is to the right of the port and left-aligned |
| `'top'` | Label is above the port and centered |
| `'bottom'` | Label is below the port and centered |
| `'manual'` | Manually specify the position (with `x`/`y` in `args`) |

```javascript
label: {
  position: 'right',  // String shorthand
}

// Equivalent object form
label: {
  position: {
    name: 'right',
    args: {},  // Pass x/y/angle/attrs to override defaults
  },
}
```

### InOut Class (Automatically Inside or Outside the Node)

Based on where the port is located on the node boundary, X6 automatically decides whether the label faces inward or outward:

| Name | Description |
|------|-------------|
| `'outside'` | Label is outside the node (away from the node center) |
| `'outsideOriented'` | Same as above, and text automatically rotates parallel to the boundary |
| `'inside'` | Label is inside the node (toward the node center) |
| `'insideOriented'` | Same as above, and text automatically rotates parallel to the boundary |

```javascript
ports: {
  groups: {
    default: {
      position: 'left',
      label: {
        position: {
          name: 'outside',
          args: { offset: 15 },  // Label offset from the port in pixels
        },
      },
    },
  },
}
```

How `outside` and `inside` are determined: based on the angle of the port position relative to the node center, X6 automatically places the label outside or inside the node.

### Radial Class (Radial Layout)

Suitable for circular nodes or cases where ports are distributed along an arc:

| Name | Description |
|------|-------------|
| `'radial'` | Place the label along the radial direction (away from the node center) |
| `'radialOriented'` | Same as above, and text automatically rotates to the radial direction |

```javascript
ports: {
  groups: {
    default: {
      position: {
        name: 'ellipse',  // Distribute ports along an ellipse
        args: { dr: 0, compensateRotate: false },
      },
      label: {
        position: {
          name: 'radial',
          args: { offset: 20 },  // Radial offset from the port to the label
        },
      },
    },
  },
}
```

## Configuration Parameters

All layout strategies support these common parameters:

| Parameter | Type | Description |
|-----------|------|-------------|
| `x` | number | Override the label x offset |
| `y` | number | Override the label y offset |
| `angle` | number | Label rotation angle |
| `attrs` | object | Override the label SVG attributes |

InOut and Radial additionally support:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `offset` | number | `15`/`20` | Offset distance between the label and the port |

## Complete Example: Input and Output Ports

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
});

graph.addNode({
  x: 200,
  y: 150,
  width: 200,
  height: 100,
  label: 'Process',
  ports: {
    groups: {
      in: {
        position: 'left',
        label: { position: 'outside' },
        attrs: {
          circle: { r: 5, magnet: true, stroke: '#31d0c6', fill: '#fff', strokeWidth: 2 },
        },
      },
      out: {
        position: 'right',
        label: { position: 'outside' },
        attrs: {
          circle: { r: 5, magnet: true, stroke: '#ff6347', fill: '#fff', strokeWidth: 2 },
        },
      },
    },
    items: [
      { id: 'in-1', group: 'in', attrs: { text: { text: 'data' } } },
      { id: 'in-2', group: 'in', attrs: { text: { text: 'config' } } },
      { id: 'out-1', group: 'out', attrs: { text: { text: 'result' } } },
      { id: 'out-2', group: 'out', attrs: { text: { text: 'error' } } },
    ],
  },
});
```

## Manually Positioning Labels

Use the `manual` strategy to fully control label position:

```javascript
label: {
  position: {
    name: 'manual',
    args: {
      x: 10,
      y: -10,
      angle: 0,
      attrs: {
        '.': { 'text-anchor': 'start', fontSize: 12, fill: '#666' },
      },
    },
  },
}
```

## Common Errors

### ❌ Confusing Port Layout (`position`) with Label Layout (`label.position`)

```javascript
// Incorrect understanding: label.position does not control where the port is placed on the node
ports: {
  groups: {
    in: {
      position: 'left',         // Port is on the left side of the node ← port layout
      label: {
        position: 'left',       // Label is to the left of the port ← label layout (different concept!)
      },
    },
  },
}
```

### ❌ Label Not Displayed

```javascript
// Error: port items are missing the text property
items: [{ id: 'p1', group: 'in' }]  // ❌ Label has no content

// Correct: set label text with attrs.text.text
items: [{ id: 'p1', group: 'in', attrs: { text: { text: 'Port 1' } } }]  // ✅
```
