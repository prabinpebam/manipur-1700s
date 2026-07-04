---
id: "g6-core-custom-element"
title: "G6 Custom Nodes and Custom Edges"
description: |
  Extend BaseNode / BaseEdge and call register() to register custom element types,
  enabling complex business-logic nodes and edges in graph visualizations.

library: "g6"
version: "5.x"
category: "core"
subcategory: "customization"
tags:
  - "custom node"
  - "custom edge"
  - "register"
  - "BaseNode"
  - "BaseEdge"
  - "extension"

related:
  - "g6-node-circle"
  - "g6-node-html"
  - "g6-edge-line"
  - "g6-core-graph-api"

use_cases:
  - "Business card nodes (e.g., dashboard-style nodes)"
  - "Edges with custom annotations or shapes"
  - "Custom connection point logic"

anti_patterns:
  - "If built-in nodes + style configuration can achieve the goal, avoid customization"
  - "Avoid complex DOM operations inside custom nodes when data updates frequently"

difficulty: "advanced"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
---

## Custom Node

### Basic Structure

```javascript
import {
  BaseNode,
  ExtensionCategory,
  Graph,
  register,
  Rect,
  Text,
  Circle,
} from '@antv/g6';

class StatusNode extends BaseNode {
  /**
   * Draw the main node body.
   * Override render() for full control; manually manage all child shapes.
   */
  render(attributes, container) {
    super.render(attributes, container);
    
    const [width, height] = this.getSize(attributes);
    const { status, label } = attributes;
    
    // Use upsert to create/update shapes (1st param: key, 2nd: constructor, 3rd: properties)
    // Main rectangle (replaces the default key shape)
    this.upsert('key', Rect, {
      x: -width / 2,
      y: -height / 2,
      width,
      height,
      fill: this.getStatusColor(status),
      stroke: '#fff',
      lineWidth: 2,
      radius: 6,
    }, container);
    
    // Status indicator dot
    this.upsert('status-dot', Circle, {
      cx: width / 2 - 8,
      cy: -height / 2 + 8,
      r: 5,
      fill: status === 'online' ? '#52c41a' : '#ff4d4f',
    }, container);
    
    // Label (overrides the default label behavior)
    this.upsert('label', Text, {
      x: 0,
      y: 0,
      text: label || attributes.id,
      fill: '#fff',
      fontSize: 13,
      fontWeight: 'bold',
      textAlign: 'center',
      textBaseline: 'middle',
    }, container);
  }
  
  getStatusColor(status) {
    const colors = { online: '#52c41a', offline: '#ff4d4f', idle: '#faad14' };
    return colors[status] || '#1783FF';
  }
  
  // Return the node's default size
  getDefaultStyle() {
    return { size: [120, 50] };
  }
}

// Register custom node type
register(ExtensionCategory.NODE, 'status-node', StatusNode);

// Usage
const graph = new Graph({
  container: 'container',
  data: {
    nodes: [
       { id: 'server1', data: { label: 'Web Server', status: 'online' } },
       { id: 'server2', data: { label: 'DB Server', status: 'offline' } },
       { id: 'server3', data: { label: 'Cache', status: 'idle' } },
    ],
    edges: [
       { source: 'server1', target: 'server2' },
       { source: 'server1', target: 'server3' },
    ],
  },
  node: {
    type: 'status-node',
    style: {
      size: [130, 50],
      // Map custom properties via style callbacks
      status: (d) => d.data.status,
      label: (d) => d.data.label,
    },
  },
  layout: { type: 'dagre', rankdir: 'LR' },
  behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
});

graph.render();
```

### Critical API

```typescript
// upsert(key, Shape, attrs, container) - create or update a child shape
this.upsert('shape-key', Rect, { x, y, width, height, fill }, container);

// Get the node size
const [width, height] = this.getSize(attributes);

// Get shapeMap (all rendered shapes)
const allShapes = this.shapeMap;

// Node center coordinates (world coordinate system)
const { x, y } = this.getPosition();
```

---

## Extending Built-in Nodes (Recommended)

For simple style extensions (such as adding animations or halo effects), it is recommended to extend built-in nodes (such as `Circle` or `Rect`) instead of `BaseNode`, so you can reuse the built-in node rendering logic:

```javascript
import { Circle, ExtensionCategory, Graph, register } from '@antv/g6';

// Extend the built-in Circle node to add a breathing-animation halo
class BreathingCircle extends Circle {
  // Called after the element is created and the enter animation completes.
  // Suitable for starting looping animations without conflicting with enter animations.
  onCreate() {
    const halo = this.shapeMap.halo;
    if (halo) {
      halo.animate([{ lineWidth: 0 }, { lineWidth: 20 }], {
        duration: 1000,
        iterations: Infinity,
        direction: 'alternate',
      });
    }
  }
}

register(ExtensionCategory.NODE, 'breathing-circle', BreathingCircle);

const graph = new Graph({
  container: 'container',
  data: {
    nodes: [
      { id: 'node-0' },
      { id: 'node-1' },
      { id: 'node-2' },
      { id: 'node-3' },
    ],
  },
  node: {
    type: 'breathing-circle',
    style: {
      size: 50,
      halo: true,  // Enable halo shape
    },
    palette: ['#3875f6', '#efb041', '#ec5b56', '#72c240'],
  },
  layout: {
    type: 'grid',
  },
  behaviors: ['drag-canvas', 'zoom-canvas'],
});

graph.render();
```

### Lifecycle Hooks

Custom nodes/edges support the following lifecycle hooks:

```typescript
class MyNode extends BaseNode {
  /**
   * Called after the element is created and the enter animation completes.
   * Suitable for starting looping animations, binding events, and other one-time initialization operations.
   */
  onCreate() {
    const keyShape = this.shapeMap['key'];
    // Start the breathing animation
    keyShape.animate(
      [{ r: 20 }, { r: 25 }, { r: 20 }],
      { duration: 2000, iterations: Infinity }
    );
  }

  /**
   * Called after the element updates and the transition animation completes.
   */
  onUpdate() {
    console.log('Node updated:', this.id);
  }

  /**
   * Called after the element's exit animation completes and it is destroyed.
   */
  onDestroy() {
    console.log('Node destroyed:', this.id);
  }
}
```

---

## Custom Edge

```javascript
import {
  BaseEdge,
  ExtensionCategory,
  Graph,
  register,
  Path,
} from '@antv/g6';

class ArrowEdge extends BaseEdge {
  /**
   * Return edge SVG path data (must be implemented).
   * Use this.getEndpoints(attributes) to get start and end point coordinates.
   */
  getKeyPath(attributes) {
    // Get start and end coordinates (accounts for ports, node boundaries, etc.)
    const [sourcePoint, targetPoint] = this.getEndpoints(attributes, false);
    
    if (!sourcePoint || !targetPoint) return [['M', 0, 0]];
    
    const [sx, sy] = sourcePoint;
    const [tx, ty] = targetPoint;
    
    // Polyline path: horizontal → vertical → horizontal
    const midX = (sx + tx) / 2;
    
    return [
      ['M', sx, sy],
      ['L', midX, sy],
      ['L', midX, ty],
      ['L', tx, ty],
    ];
  }
}

register(ExtensionCategory.EDGE, 'arrow-edge', ArrowEdge);

const graph = new Graph({
  // ...
  edge: {
    type: 'arrow-edge',
    style: {
      stroke: '#aaa',
      lineWidth: 1.5,
      endArrow: true,
    },
  },
});
```

### Custom Edge Animation (Marching Ants)

After `super.render()`, access the main shape via `this.shapeMap['key']` and call the Web Animations API:

```javascript
import { BaseEdge, ExtensionCategory, Graph, register } from '@antv/g6';

class DashEdge extends BaseEdge {
  getKeyPath(attributes) {
    const [sourcePoint, targetPoint] = this.getEndpoints(attributes);
    if (!sourcePoint || !targetPoint) return [['M', 0, 0]];
    const [sx, sy] = sourcePoint;
    const [tx, ty] = targetPoint;
    return [['M', sx, sy], ['L', tx, ty]];
  }

  render(attributes, container) {
    super.render(attributes, container);

    const keyShape = this.shapeMap['key'];
    if (keyShape) {
      keyShape.style.lineDash = [10, 10];
      // Marching ants: animate lineDashOffset to create a flowing effect
      keyShape.animate(
        [{ lineDashOffset: 0 }, { lineDashOffset: -20 }],
        { duration: 1000, iterations: Infinity },
      );
    }
  }
}

register(ExtensionCategory.EDGE, 'line-dash', DashEdge);

const graph = new Graph({
  container: 'container',
  data: {
    nodes: [
      { id: 'n1', data: { label: 'Start' } },
      { id: 'n2', data: { label: 'End' } },
    ],
    edges: [{ source: 'n1', target: 'n2' }],
  },
  edge: {
    type: 'line-dash',
    style: { stroke: '#999', lineWidth: 2 },
  },
  behaviors: ['drag-canvas', 'zoom-canvas'],
});
graph.render();
```

---

## Registration Type Summary

```javascript
import { ExtensionCategory, register } from '@antv/g6';

// Register custom node
register(ExtensionCategory.NODE, 'my-node', MyNodeClass);

// Register custom edge
register(ExtensionCategory.EDGE, 'my-edge', MyEdgeClass);

// Register custom combo
register(ExtensionCategory.COMBO, 'my-combo', MyComboClass);

// Register custom layout
register(ExtensionCategory.LAYOUT, 'my-layout', MyLayoutClass);

// Register custom behavior
register(ExtensionCategory.BEHAVIOR, 'my-behavior', MyBehaviorClass);

// Register custom plugin
register(ExtensionCategory.PLUGIN, 'my-plugin', MyPluginClass);
```

---

## Common Errors and Fixes

### Error: Starting a looping animation inside `render()` causes a blank screen or animation glitches

```javascript
// ❌ render() is called both when the element is created and on every update.
//    Starting animations here causes:
//    1. Duplicate animations starting, leading to performance issues
//    2. Conflict with the enter animation, which may cause a blank screen
//    3. Animation being reset on every update
class BreathingNode extends BaseNode {
  render(attributes, container) {
    super.render(attributes, container);
    const circle = this.upsert('key', Circle, { cx: 0, cy: 0, r: 30 }, container);
    
    // Error: starting animation inside render
    circle.animate(
      [{ r: 30 }, { r: 40 }, { r: 30 }],
      { duration: 2000, iterations: Infinity }
    );
  }
}

// ✅ Use the onCreate lifecycle hook to start looping animations after the enter animation completes
class BreathingNode extends BaseNode {
  render(attributes, container) {
    super.render(attributes, container);
    this.upsert('key', Circle, { cx: 0, cy: 0, r: 30 }, container);
  }
  
  onCreate() {
    const keyShape = this.shapeMap['key'];
    keyShape.animate(
      [{ r: 30 }, { r: 40 }, { r: 30 }],
      { duration: 2000, iterations: Infinity }
    );
  }
}

// ✅ Alternatively, extend the built-in node and use the built-in halo shape for a breathing effect (recommended)
class BreathingCircle extends Circle {
  onCreate() {
    const halo = this.shapeMap.halo;
    if (halo) {
      halo.animate(
        [{ lineWidth: 0 }, { lineWidth: 20 }, { lineWidth: 0 }],
        { duration: 2000, iterations: Infinity }
      );
    }
  }
}
```

### Error: Using the removed `extend` API

```javascript
// ❌ extend was removed in G6 v5 stable; calling it throws "extend is not a function"
import { Graph, extend } from '@antv/g6';
const ExtGraph = extend(Graph, { nodes: { 'my-node': MyNodeFn } });

// ✅ Use BaseNode + register instead
import { BaseNode, ExtensionCategory, register } from '@antv/g6';
class MyNode extends BaseNode { /* ... */ }
register(ExtensionCategory.NODE, 'my-node', MyNode);
```

### Error: Using a custom type without calling register first

```javascript
// ❌ Not registered - G6 does not know 'my-node'
const graph = new Graph({
  node: { type: 'my-node' },
});

// ✅ Register first, then use
register(ExtensionCategory.NODE, 'my-node', MyNode);
const graph = new Graph({
  node: { type: 'my-node' },
});
```

### Error: Directly manipulating the DOM inside `render` (should use `upsert`)

```javascript
// ❌ Direct DOM manipulation is not managed by the G6 rendering cycle
render(attributes, container) {
  const div = document.createElement('div');
  container.appendChild(div);
}

// ✅ Use upsert to manage the shape lifecycle
render(attributes, container) {
  this.upsert('my-shape', Rect, { x: 0, y: 0 }, container);
}
```

### Error: Reading node business data via `attributes.data` inside `render` → blank screen

```javascript
// ❌ attributes is a collection of computed style properties; it does not include node data fields.
// attributes.data is undefined; accessing data.color throws a TypeError → blank screen.
render(attributes, container) {
  const { data } = attributes;        // undefined!
  const color = data.color;           // TypeError: Cannot read properties of undefined
}

// ✅ Map data to style properties via node.style callbacks, then read directly from attributes.
// Step 1: In the Graph config, map data fields to custom style properties
node: {
  type: 'my-node',
  style: {
    color: (d) => d.data.color,   // Mapped to attributes.color
    label: (d) => d.data.label,   // Mapped to attributes.label
  },
},
// Step 2: Destructure from attributes inside render()
render(attributes, container) {
  const { color = '#1783FF', label } = attributes;  // ✅ Correct
}
```

### Error: upsert key conflicts with the default shape, causing double rendering

```javascript
// ❌ Key is not 'key' - super.render() already creates the default 'key' shape,
//    so upsert('circle', ...) adds an extra circle on top of it
render(attributes, container) {
  super.render(attributes, container);
  this.upsert('circle', Circle, { cx: 0, cy: 0, r: 20 }, container);  // Two circles!
}

// ✅ Use 'key' to replace the default main shape
render(attributes, container) {
  super.render(attributes, container);
  this.upsert('key', Circle, { cx: 0, cy: 0, r: 20 }, container);  // Replaces the default shape
}
```

### Error: Animation using CSS property (`scale`) instead of shape properties

```javascript
// ❌ scale is a CSS transform; @antv/g shape animate() uses shape-native property names
circle.animate(
  [{ scale: 1 }, { scale: 1.1 }, { scale: 1 }],  // Silently ignored - no effect
  { duration: 2000, iterations: Infinity }
);

// ✅ Animate Circle shapes using r / fill / stroke and other shape properties
circle.animate(
  [{ r: 20 }, { r: 25 }, { r: 20 }],
  { duration: 2000, iterations: Infinity }
);
```

### Error: Directly accessing `attributes.sourcePoint` in a custom edge → blank screen

```javascript
// ❌ sourcePoint / targetPoint do not exist directly on attributes.
// Accessing them returns undefined; destructuring then throws a TypeError → blank screen.
class MyEdge extends BaseEdge {
  getKeyPath(attributes) {
    const { sourcePoint, targetPoint } = attributes;  // undefined!
    const [sx, sy] = sourcePoint;  // TypeError: Cannot read properties of undefined
    return [['M', sx, sy], ['L', tx, ty]];
  }
}

// ✅ Use this.getEndpoints(attributes) to get start and end points
class MyEdge extends BaseEdge {
  getKeyPath(attributes) {
    const [sourcePoint, targetPoint] = this.getEndpoints(attributes, false);
    const [sx, sy] = sourcePoint;
    const [tx, ty] = targetPoint;
    return [['M', sx, sy], ['L', tx, ty]];
  }
}
```
