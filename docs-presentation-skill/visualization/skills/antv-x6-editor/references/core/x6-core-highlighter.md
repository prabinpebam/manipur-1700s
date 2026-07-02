---
id: "x6-core-highlighter"
title: "X6 Highlighter"
description: |
  Configuration for highlighting nodes and edges.
  Used to highlight connectable nodes/ports during edge creation, or to customize visual feedback for selected states.
  Includes three built-in highlighting strategies: stroke, className, and opacity.

library: "x6"
version: "3.x"
category: "core"
subcategory: "highlighter"
tags:
  - "highlighter"
  - "highlight"
  - "stroke"
  - "className"
  - "opacity"
  - "highlighting"
  - "magnetAvailable"
  - "nodeAvailable"
  - "edge-creation highlight"

related:
  - "x6-core-graph-init"
  - "x6-core-ports"
  - "x6-core-edge"

use_cases:
  - "Highlight connectable ports while creating an edge"
  - "Highlight connectable nodes while creating an edge"
  - "Customize the highlight style for selected elements"
  - "Provide visual feedback on mouse hover"

difficulty: "intermediate"
completeness: "full"
---

## Core Concepts

A **Highlighter** provides visual highlighting effects for nodes/edges. X6 automatically triggers highlighting during edge-creation interactions:

- **magnetAvailable**: highlights connectable ports (magnets) while dragging an edge
- **nodeAvailable**: highlights connectable nodes while dragging an edge
- **default**: the default highlight style, used for manual triggers such as `graph.highlightCell()`

## Configuration

Configure highlighters in the `highlighting` field of the Graph constructor:

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  connecting: {
    highlight: true,  // Must be enabled to trigger highlighting while creating edges
  },
  highlighting: {
    default: {
      name: 'stroke',
      args: { padding: 3 },
    },
    magnetAvailable: {
      name: 'className',
      args: { className: 'available-magnet' },
    },
    nodeAvailable: {
      name: 'className',
      args: { className: 'available-node' },
    },
  },
});
```

## Built-in Highlighters

### stroke

Draws a stroked highlight box (SVG path) around the element. This is the most common highlighting method.

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `padding` | `number` | `3` | Spacing between the highlight box and the element |
| `rx` | `number` | `0` | X-axis corner radius of the highlight box |
| `ry` | `number` | `0` | Y-axis corner radius of the highlight box |
| `attrs` | `object` | `{ 'stroke-width': 3, stroke: '#FEB663' }` | SVG attributes of the highlight box |

```javascript
highlighting: {
  default: {
    name: 'stroke',
    args: {
      padding: 5,
      rx: 4,
      ry: 4,
      attrs: {
        'stroke-width': 2,
        stroke: '#1890ff',
        'stroke-dasharray': '5 3',
      },
    },
  },
}
```

### className

Highlights by adding a CSS class name. This is suitable for complex effects implemented with CSS animations.

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `className` | `string` | `'x6-highlighted'` | CSS class name added to the element |

```javascript
highlighting: {
  magnetAvailable: {
    name: 'className',
    args: { className: 'port-available' },
  },
}
```

Companion CSS:

```css
.port-available circle {
  fill: #52c41a;
  stroke: #52c41a;
  transition: all 0.2s;
}
```

### opacity

Highlights by adding a CSS class that reduces opacity. In practice, non-highlighted elements become faded.

No parameters. Use it directly:

```javascript
highlighting: {
  nodeAvailable: {
    name: 'opacity',
    args: {},
  },
}
```

## `highlighting` Configuration Items

| Field | Trigger Timing | Description |
|------|----------|------|
| `default` | When `graph.highlightCell()` is called manually | Default highlight style |
| `magnetAvailable` | When dragging an edge over a connectable magnet | Port/element highlight |
| `nodeAvailable` | When dragging an edge over a connectable node | Node highlight |

**Note**: You must set `highlight: true` in `connecting` to trigger `magnetAvailable` and `nodeAvailable` highlights during edge-creation interactions.

## Default Graph Configuration

The default X6 Graph `highlighting` configuration (source code):

```javascript
highlighting: {
  default: {
    name: 'stroke',
    args: { padding: 3 },
  },
  nodeAvailable: {
    name: 'className',
    args: { className: 'x6-available-node' },
  },
  magnetAvailable: {
    name: 'className',
    args: { className: 'x6-available-magnet' },
  },
}
```

## Complete Example

### Highlighting Available Ports While Creating an Edge

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  connecting: {
    highlight: true,
    allowBlank: false,
    router: 'orth',
    connector: 'rounded',
  },
  highlighting: {
    magnetAvailable: {
      name: 'stroke',
      args: {
        padding: 4,
        attrs: { 'stroke-width': 2, stroke: '#52c41a' },
      },
    },
  },
});

const node1 = graph.addNode({
  shape: 'rect',
  x: 100,
  y: 100,
  width: 120,
  height: 60,
  label: 'Source',
  attrs: { body: { fill: '#fff', stroke: '#8f8f8f', rx: 6, ry: 6 } },
  ports: {
    groups: {
      out: {
        position: 'right',
        attrs: { circle: { r: 5, magnet: true, stroke: '#8f8f8f', fill: '#fff' } },
      },
    },
    items: [{ id: 'out1', group: 'out' }],
  },
});

const node2 = graph.addNode({
  shape: 'rect',
  x: 400,
  y: 100,
  width: 120,
  height: 60,
  label: 'Target',
  attrs: { body: { fill: '#fff', stroke: '#8f8f8f', rx: 6, ry: 6 } },
  ports: {
    groups: {
      in: {
        position: 'left',
        attrs: { circle: { r: 5, magnet: true, stroke: '#8f8f8f', fill: '#fff' } },
      },
    },
    items: [{ id: 'in1', group: 'in' }],
  },
});

// When dragging an edge from node1's out1 port, node2's in1 port is highlighted
```

### Manual Highlight / Unhighlight

Manually trigger highlighting with the `highlight()` / `unhighlight()` methods on `CellView`:

```javascript
// Get the node view
const nodeView = graph.findViewByCell(node1);

// Highlight manually (uses the highlighting.default configuration when options are omitted)
nodeView.highlight();

// Highlight a specific child element with a custom highlighter
nodeView.highlight(nodeView.container.querySelector('rect'), {
  highlighter: { name: 'stroke', args: { padding: 5, attrs: { stroke: '#f5222d' } } },
});

// Remove the highlight
nodeView.unhighlight();
```

## Common Mistakes

### ❌ Ports Are Not Highlighted While Creating Edges

```javascript
// Incorrect: connecting.highlight was not enabled
const graph = new Graph({
  container: 'container',
  connecting: {
    allowBlank: false,
    // highlight defaults to false!
  },
  highlighting: {
    magnetAvailable: { name: 'stroke', args: { padding: 4 } },
  },
});
// Ports will not be highlighted while creating edges

// Correct: highlight: true must be set
const graph = new Graph({
  container: 'container',
  connecting: {
    allowBlank: false,
    highlight: true, // ✅ Enable edge-creation highlighting
  },
  highlighting: {
    magnetAvailable: { name: 'stroke', args: { padding: 4 } },
  },
});
```

### ❌ Using `className` Without Writing CSS

```javascript
// Problem: the className highlighter only adds a class name; it does not include styles
highlighting: {
  magnetAvailable: {
    name: 'className',
    args: { className: 'my-highlight' }, // Only adds the class name
  },
}
// If there is no corresponding CSS rule, there is no visible change

// Solution: add CSS or switch to the stroke highlighter
```
