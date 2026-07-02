---
id: "x6-core-attr-registry"
title: "X6 Custom Attribute Registration (Attr Registry)"
description: |
  X6's attribute registration mechanism, used to extend the attrs configuration for nodes and edges. Supports three custom attribute handlers: set, position, and offset.
library: x6
version: 3.x
category: "core"
tags:
  - attr
  - registry
  - custom-attr
  - attrs
---

# Custom Attribute Registration (Attr Registry)

## Overview

X6 uses the Attr Registry to manage all special attributes that can be used in `attrs`. Standard SVG attributes such as `fill` and `stroke` are set directly on DOM elements, while X6 also provides a set of advanced built-in attributes such as `refX`, `refWidth`, and `connection`, and allows users to register new custom attributes.

## Built-in Special Attributes

### Relative Positioning Attributes (ref Series)

Position and size are calculated relative to the BBox of a reference element, usually the node body:

| Attribute | Description | Value Range |
|-----------|-------------|-------------|
| `ref` | Specifies the selector for the reference element | CSS selector string |
| `refX` | Relative X coordinate | 0 to 1 means percentage; other values are absolute offsets |
| `refY` | Relative Y coordinate | Same as above |
| `refDx` | X offset relative to the right side of the reference element | Pixel value |
| `refDy` | Y offset relative to the bottom of the reference element | Pixel value |
| `refWidth` | Relative width | 0 to 1 means percentage; other values are absolute adjustments |
| `refHeight` | Relative height | Same as above |
| `refRx` | Relative corner radius rx | 0 to 1 means percentage |
| `refRy` | Relative corner radius ry | Same as above |
| `refCx` | Relative center cx | 0 to 1 means percentage |
| `refCy` | Relative center cy | Same as above |
| `refR` | Relative radius, inscribed | 0 to 1 means percentage |
| `refRCircumscribed` | Relative radius, circumscribed | 0 to 1 means percentage |
| `refD` | Relative path d, scaled to fit | SVG path string |
| `refPoints` | Relative polygon points, scaled to fit | Point coordinate string |

```javascript
graph.addNode({
  shape: 'rect',
  x: 100, y: 100, width: 200, height: 80,
  attrs: {
    body: { fill: '#fff', stroke: '#333' },
    icon: {
      ref: 'body',       // Reference the body element
      refX: 0.5,         // Horizontally centered (50%)
      refY: 0.5,         // Vertically centered (50%)
      refWidth: 0.3,     // Width is 30% of body
      refHeight: 0.3,    // Height is 30% of body
    },
  },
});
```

### Gradient Attributes

`fill` and `stroke` support gradient objects. X6 automatically creates the gradient definition in SVG `<defs>`:

```javascript
attrs: {
  body: {
    fill: {
      type: 'linearGradient',
      stops: [
        { offset: '0%', color: '#31d0c6' },
        { offset: '100%', color: '#7c68fc' },
      ],
    },
  },
}
```

### Edge Connection Attributes

Valid only in the `attrs` of an Edge:

| Attribute | Description |
|-----------|-------------|
| `connection` | Automatically follows the edge path, set to `true` or a `{ stubs }` object |
| `atConnectionLength` | Position at a specified length along the edge path while preserving tangent direction |
| `atConnectionRatio` | Position at a specified ratio along the edge path while preserving tangent direction |
| `atConnectionLengthIgnoreGradient` | Position along the path without rotation |
| `atConnectionRatioIgnoreGradient` | Position at a ratio along the path without rotation |

```javascript
graph.addEdge({
  source: node1,
  target: node2,
  attrs: {
    line: { connection: true, stroke: '#333', strokeWidth: 2 },
    label: {
      atConnectionRatio: 0.5,  // Position the label at 50% of the edge
      text: 'Hello',
      textAnchor: 'middle',
      textVerticalAnchor: 'middle',
    },
  },
});
```

### Other Built-in Attributes

| Attribute | Description |
|-----------|-------------|
| `text` | Sets text content, supporting advanced layout such as multiline text and text paths |
| `textWrap` | Automatic text wrapping configuration |
| `title` | Sets an SVG `<title>` child element for tooltip text |
| `html` | Sets the element's innerHTML |
| `style` | Sets a CSS style object through `elem.style` |
| `filter` | SVG filter, with support for object-form shorthand syntax |

## Custom Attribute Registration

### Registration API

Register a custom attribute with `Graph.registerAttr(name, definition)`:

```javascript
import { Graph } from '@antv/x6';

Graph.registerAttr('myAttr', {
  // qualify: determines whether this attribute handler should be applied (optional)
  qualify(value, { elem, attrs, cell, view }) {
    return typeof value === 'number';
  },
  // set: returns the SVG attribute object to set
  set(value, { elem, refBBox, cell, view }) {
    return { opacity: value / 100 };
  },
});
```

### Three Attribute Definition Types

#### 1. Set Attribute - Calculate and Set SVG Attributes

```javascript
Graph.registerAttr('highlightWidth', {
  qualify(value) {
    return typeof value === 'number';
  },
  set(value, { refBBox }) {
    // Return the attributes to set on the DOM element
    return {
      strokeWidth: value,
      stroke: value > 2 ? 'red' : '#333',
    };
  },
});
```

#### 2. Position Attribute - Calculate Element Position Offset

```javascript
Graph.registerAttr('centerInParent', {
  position(value, { refBBox }) {
    if (value) {
      return {
        x: refBBox.x + refBBox.width / 2,
        y: refBBox.y + refBBox.height / 2,
      };
    }
    return null;
  },
});
```

#### 3. Offset Attribute - Calculate Additional Displacement

```javascript
Graph.registerAttr('circularOffset', {
  offset(value, { refBBox }) {
    const angle = (value * Math.PI) / 180;
    const radius = Math.min(refBBox.width, refBBox.height) / 2;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  },
});
```

### qualify Function

`qualify` determines whether the attribute value should be handled by this custom handler. If it returns `false`, the attribute is set directly on the element as a normal SVG attribute.

```javascript
Graph.registerAttr('fill', {
  // Use gradient handling only when the fill value is an object; string values are used directly as SVG fill values
  qualify(value) {
    return typeof value === 'object' && value !== null;
  },
  set(fill, { view }) {
    return `url(#${view.graph.defineGradient(fill)})`;
  },
});
```

## Complete Example: Custom Progress Bar Attribute

```javascript
import { Graph } from '@antv/x6';

// Register a progress attribute that dynamically sets width and color based on a percentage
Graph.registerAttr('progress', {
  qualify(value) {
    return typeof value === 'number';
  },
  set(value, { refBBox }) {
    const percent = Math.max(0, Math.min(1, value));
    const color = percent > 0.7 ? '#52c41a' : percent > 0.3 ? '#faad14' : '#f5222d';
    return {
      width: refBBox.width * percent,
      fill: color,
    };
  },
});

const graph = new Graph({ container: 'container', width: 800, height: 600 });

graph.addNode({
  shape: 'rect',
  x: 100, y: 100, width: 200, height: 30,
  markup: [
    { tagName: 'rect', selector: 'body' },
    { tagName: 'rect', selector: 'progress' },
    { tagName: 'text', selector: 'label' },
  ],
  attrs: {
    body: { width: 200, height: 30, fill: '#f0f0f0', stroke: '#d9d9d9' },
    progress: { progress: 0.65, height: 30, rx: 0, ry: 0 },
    label: { text: '65%', refX: 0.5, refY: 0.5, textAnchor: 'middle', textVerticalAnchor: 'middle' },
  },
});
```

## Common Mistakes

```javascript
// ❌ Incorrect: refX/refY use pixel values but a percentage effect is expected
attrs: { icon: { refX: 100, refY: 50 } }
// When refX > 1, it is treated as an absolute pixel offset, not a percentage

// ✅ Correct: use decimals from 0 to 1 to represent percentages
attrs: { icon: { refX: 0.5, refY: 0.5 } }  // Centered

// ❌ Incorrect: using the connection attribute on a non-edge element
graph.addNode({
  attrs: { body: { connection: true } }  // connection is valid only for edges
});

// ✅ Correct: connection is used in edge attrs
graph.addEdge({
  attrs: { line: { connection: true, stroke: '#333' } },
});
```
