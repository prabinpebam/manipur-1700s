---
id: "x6-core-shape-advanced"
title: "X6 Advanced Built-in Shapes"
description: |
  In addition to basic shapes such as rect, circle, and ellipse, X6 also provides advanced shapes such as path, polyline, polygon, and text-block.
  They are suitable for custom path graphics, polyline connections, polygons, rich-text nodes, and similar scenarios.

library: "x6"
version: "3.x"
category: "core"
subcategory: "shape"
tags:
  - "shape"
  - "path"
  - "polyline"
  - "polygon"
  - "text-block"
  - "custom shape"
  - "SVG path"
  - "polyline"
  - "rich text"

related:
  - "x6-core-node"
  - "x6-intermediate-custom-node"

use_cases:
  - "Draw custom SVG path nodes"
  - "Draw polyline-shaped nodes"
  - "Create rich-text nodes"
  - "Draw polygon nodes"

difficulty: "intermediate"
completeness: "full"
---

## Complete List of Built-in Shapes

X6 3.x provides the following built-in shapes:

| Shape | Description | Primary Use |
|-------|-------------|-------------|
| `rect` | Rectangle | The most commonly used node shape |
| `circle` | Circle | State nodes, start/end nodes |
| `ellipse` | Ellipse | Decision nodes |
| `polygon` | Polygon | Custom polygons (diamond, hexagon, etc.) |
| `polyline` | Polyline shape | Polyline path shapes |
| `path` | SVG path | Arbitrary SVG path shapes |
| `text` | Plain text | Text label nodes |
| `text-block` | Rich text block | Text nodes with automatic wrapping |
| `image` | Image | Image nodes |
| `html` | HTML | Custom HTML content nodes |

---

## Path Nodes

The `path` shape uses SVG path data to define arbitrary shapes. Set path data through the `path` property (shortcut) or `attrs.body.refD`.

### Basic Usage

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({ container: 'container' });

// Use the path shortcut property
graph.addNode({
  shape: 'path',
  x: 100,
  y: 50,
  width: 120,
  height: 60,
  path: 'M 0 5 10 0 C 20 0 20 20 10 20 L 0 15 Z',
  attrs: {
    body: {
      fill: '#efdbff',
      stroke: '#9254de',
      strokeWidth: 2,
    },
  },
});

// Use attrs.body.refD (the path is automatically scaled to the node size)
graph.addNode({
  shape: 'path',
  x: 300,
  y: 50,
  width: 100,
  height: 80,
  attrs: {
    body: {
      refD: 'M 0 0 L 1 0.5 L 0 1 Z',
      fill: '#d9f7be',
      stroke: '#52c41a',
      strokeWidth: 2,
    },
  },
});
```

### Key Notes

- The `path` property is a shortcut for `attrs.body.refD`
- Path coordinates in `refD` are proportionally scaled according to the node's `width`/`height`
- Markup structure: `rect(bg)` + `path(body)` + `text(label)`
- `bg` is a transparent background rectangle used for event capture

---

## Polyline Nodes

The `polyline` shape inherits from `polygon` and is used to draw polyline/polygon shapes.

### Basic Usage

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({ container: 'container' });

// Polyline shape (not closed)
graph.addNode({
  shape: 'polyline',
  x: 100,
  y: 50,
  width: 120,
  height: 60,
  attrs: {
    body: {
      refPoints: '0,0 1,0 1,1 0,1',
      fill: '#fff1b8',
      stroke: '#faad14',
      strokeWidth: 2,
    },
  },
});
```

### Difference from Polygon

- `polygon`: a closed polygon; the path is closed automatically
- `polyline`: a polyline shape; it is not closed automatically unless the first and last points are the same

### Polygon Example (Diamond)

```javascript
graph.addNode({
  shape: 'polygon',
  x: 100,
  y: 50,
  width: 100,
  height: 60,
  attrs: {
    body: {
      refPoints: '0.5,0 1,0.5 0.5,1 0,0.5',
      fill: '#e6f7ff',
      stroke: '#1890ff',
      strokeWidth: 2,
    },
  },
});
```

---

## Text-Block Nodes

The `text-block` shape supports rich text content with automatic wrapping. In browsers that support `foreignObject`, it renders text with an HTML div; otherwise, it falls back to SVG text.

### Basic Usage

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({ container: 'container' });

graph.addNode({
  shape: 'text-block',
  x: 100,
  y: 50,
  width: 200,
  height: 80,
  text: 'This is a long text block that wraps automatically. text-block wraps the content based on the node width.',
  attrs: {
    body: {
      fill: '#f0f0f0',
      stroke: '#8f8f8f',
      strokeWidth: 1,
      rx: 4,
      ry: 4,
    },
    label: {
      style: {
        fontSize: 14,
      },
    },
  },
});
```

### Key Notes

- Use the `text` property (shortcut) to set text content
- Text automatically wraps based on the node width
- `attrs.label.style` sets font styles (CSS styles, because HTML rendering is used)
- Suitable for scenarios that require multiline text display

---

## Custom Arrow Markers

In X6, you can use custom SVG paths as arrow markers by defining `sourceMarker` and `targetMarker` directly in an edge's `attrs.line`.

### Basic Usage

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  background: {
    color: '#F2F7FA',
  },
});

graph.addEdge({
  source: [100, 140],
  target: [400, 140],
  label: 'custom-marker',
  attrs: {
    line: {
      sourceMarker: {
        tagName: 'path',
        d: 'M 20 -10 0 0 20 10 Z',
      },
      targetMarker: {
        tagName: 'path',
        stroke: '#D94111',
        strokeWidth: 2,
        fill: '#90C54C',
        d: 'M 20 -10 0 0 20 10 Z',
      },
      stroke: '#8f8f8f',
      strokeWidth: 1,
    },
  },
});
```

### Key Notes

- `sourceMarker` and `targetMarker` can be strings (preset markers) or objects (custom markers)
- A custom marker object must contain the `tagName` and `d` properties
- The `d` property defines the SVG path
- Styles can be set through properties such as `stroke` and `fill`

---

## Common Errors and Fixes

### Error 1: Path nodes use d instead of refD

```javascript
// Wrong: using the d property; the path will not scale
attrs: { body: { d: 'M 0 0 L 100 50 L 0 100 Z' } }

// Correct: use refD so the path scales to the node size
attrs: { body: { refD: 'M 0 0 L 1 0.5 L 0 1 Z' } }

// Correct: use the path shortcut property
graph.addNode({ shape: 'path', path: 'M 0 0 L 100 50 L 0 100 Z', ... })
```

### Error 2: Confusing polygon and polyline

```javascript
// polygon closes automatically; no need to repeat the first point
attrs: { body: { refPoints: '0,0 1,0 1,1 0,1' } }  // Automatically closes into a rectangle

// polyline does not close automatically; add the first point manually if it needs to be closed
attrs: { body: { refPoints: '0,0 1,0 1,1 0,1 0,0' } }  // Manually closed
```

### Error 3: text-block uses label instead of text

```javascript
// Wrong: the label property does not work for text-block
graph.addNode({ shape: 'text-block', label: 'Text content' })

// Correct: use the text property
graph.addNode({ shape: 'text-block', text: 'Text content' })
```

### Error 4: Incorrectly using graph.markers.register to register custom arrows

```javascript
// Wrong: X6 does not provide a graph.markers.register method
const customMarker = { tagName: 'path', attrs: { d: 'M 0 -6 L 12 0 L 0 6 Z' } }
graph.markers.register('custom-marker', customMarker)

// Correct: define the marker directly in attrs.line
graph.addEdge({
  source: node1,
  target: node2,
  attrs: {
    line: {
      sourceMarker: 'classic',
      targetMarker: {
        tagName: 'path',
        d: 'M 0 -6 L 12 0 L 0 6 Z',
        fill: 'green',
        stroke: 'red',
      },
    },
  },
})
```
