---
id: "x6-intermediate-custom-node"
title: "X6 Custom Nodes"
description: |
  A complete guide to X6 custom nodes: registering custom SVG nodes with Graph.registerNode and HTML nodes with Shape.HTML.register.
  Covers markup/attrs customization, inheriting built-in nodes, rendering and updating HTML nodes, and effect-based reactivity.

library: "x6"
version: "3.x"
category: "intermediate"
subcategory: "custom-node"
tags:
  - "custom nodes"
  - "registerNode"
  - "Graph.registerNode"
  - "Shape.HTML.register"
  - "HTML nodes"
  - "markup"
  - "attrs"
  - "inherit"
  - "foreignObject"
  - "shape"
  - "effect"
  - "custom shapes"
  - "Shape.Group"
  - "group nodes"
  - "parent-child nodes"
  - "embed"
  - "addChild"
  - "box-sizing"
  - "font-size"
  - "Invalid left-hand side"
  - "style properties"
  - "camelCase"

related:
  - "x6-core-node"
  - "x6-core-graph-init"
  - "x6-intermediate-tools"

use_cases:
  - "Register custom SVG node shapes"
  - "Use HTML/DOM to render complex node content"
  - "Inherit and extend built-in nodes"
  - "Implement data-driven reactive HTML nodes"
  - "Reuse custom node configurations"

anti_patterns:
  - "Do not use position:absolute/relative/transform/opacity in HTML nodes, as they may cause rendering issues"
  - "Do not forget to set the effect field; otherwise HTML nodes will not respond to data changes"
  - "Do not use Shape.Group / Shape.Group.define / new Shape.Group; the Shape namespace in X6 3.x does not include Group"
  - "Do not use hyphenated properties such as el.style.box-sizing / el.style.font-size in html() callbacks; use camelCase or bracket notation"
---

# X6 Custom Nodes

## Method 1: Graph.registerNode (SVG Nodes)

Customize node appearance with `markup` (structure) and `attrs` (styles), then register it as a custom shape.

### Basic Registration

```javascript
import { Graph } from '@antv/x6';

Graph.registerNode(
  'custom-rect',
  {
    inherit: 'rect',  // Inherit the built-in rect node
    width: 120,
    height: 50,
    attrs: {
      body: {
        fill: '#ffffff',
        stroke: '#1890ff',
        strokeWidth: 2,
        rx: 8,
        ry: 8,
      },
      label: {
        fontSize: 14,
        fill: '#333',
      },
    },
  },
  true, // Override a registration with the same name
);

// Use the custom node
const graph = new Graph({ container: 'container', width: 800, height: 600 });

graph.addNode({
  shape: 'custom-rect',
  x: 100,
  y: 100,
  label: 'Custom Node',
});
```

### Custom Markup (Multi-Element Nodes)

```javascript
Graph.registerNode(
  'status-node',
  {
    inherit: 'rect',
    width: 160,
    height: 60,
    markup: [
      { tagName: 'rect', selector: 'body' },
      { tagName: 'circle', selector: 'statusIndicator' },
      { tagName: 'text', selector: 'label' },
      { tagName: 'text', selector: 'description' },
    ],
    attrs: {
      body: {
        refWidth: '100%',
        refHeight: '100%',
        fill: '#fff',
        stroke: '#d9d9d9',
        strokeWidth: 1,
        rx: 6,
        ry: 6,
      },
      statusIndicator: {
        r: 5,
        cx: 15,
        cy: 15,
        fill: '#52c41a',  // Green = normal
      },
      label: {
        refX: 30,
        refY: 15,
        fontSize: 14,
        fill: '#333',
        textAnchor: 'start',
        textVerticalAnchor: 'middle',
        text: 'Node',
      },
      description: {
        refX: 15,
        refY: 40,
        fontSize: 12,
        fill: '#999',
        textAnchor: 'start',
        textVerticalAnchor: 'middle',
        text: 'Description',
      },
    },
  },
  true,
);

graph.addNode({
  shape: 'status-node',
  x: 100,
  y: 100,
  attrs: {
    label: { text: 'Data Processing' },
    description: { text: 'ETL Pipeline' },
    statusIndicator: { fill: '#52c41a' },
  },
});
```

### Diamond Decision Node (polygon)

```javascript
Graph.registerNode(
  'decision-node',
  {
    inherit: 'polygon',
    width: 80,
    height: 80,
    attrs: {
      body: {
        refPoints: '0,10 10,0 20,10 10,20',  // Diamond vertices
        fill: '#fff',
        stroke: '#faad14',
        strokeWidth: 2,
      },
      label: {
        fontSize: 12,
        fill: '#333',
        refX: 0.5,
        refY: 0.5,
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
      },
    },
  },
  true,
);
```

## Method 2: Shape.HTML.register (HTML Nodes)

Use HTML/DOM to render complex node content (tables, charts, rich text, etc.), implemented with SVG `foreignObject`.

### Basic Usage

```javascript
import { Graph, Shape } from '@antv/x6';

Shape.HTML.register({
  shape: 'custom-html',
  width: 200,
  height: 80,
  html() {
    const div = document.createElement('div');
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.background = '#fff';
    div.style.border = '1px solid #d9d9d9';
    div.style.borderRadius = '8px';
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.justifyContent = 'center';
    div.style.fontSize = '14px';
    div.style.color = '#333';
    div.textContent = 'HTML Node';
    return div;
  },
});

const graph = new Graph({ container: 'container', width: 800, height: 600 });

graph.addNode({
  shape: 'custom-html',
  x: 100,
  y: 100,
});
```

### Reactive HTML Nodes (Data-Driven Updates)

Declare dependent properties with the `effect` field; when those properties change, the `html()` method is called again automatically to update the DOM.

```javascript
import { Graph, Shape, Dom } from '@antv/x6';

Shape.HTML.register({
  shape: 'data-card',
  width: 200,
  height: 100,
  effect: ['data'],  // Listen for data changes
  html(cell) {
    const { title, status, progress } = cell.getData() || {};
    const div = document.createElement('div');
    Dom.css(div, {
      width: '100%',
      height: '100%',
      background: '#fff',
      border: '1px solid #d9d9d9',
      borderRadius: '8px',
      padding: '12px',
      boxSizing: 'border-box',
      fontFamily: 'Arial, sans-serif',
    });
    div.innerHTML = `
      <div style="font-size:14px;font-weight:bold;color:#333">${title || 'Untitled'}</div>
      <div style="font-size:12px;color:#999;margin-top:4px">Status: ${status || 'pending'}</div>
      <div style="margin-top:8px;height:6px;background:#f0f0f0;border-radius:3px">
        <div style="width:${(progress || 0) * 100}%;height:100%;background:#1890ff;border-radius:3px"></div>
      </div>
    `;
    return div;
  },
});

const graph = new Graph({ container: 'container', width: 800, height: 600 });

const node = graph.addNode({
  shape: 'data-card',
  x: 100,
  y: 100,
  data: { title: 'Data Cleaning', status: 'running', progress: 0.6 },
});

// The node refreshes automatically after data is updated
node.setData({ title: 'Data Cleaning', status: 'completed', progress: 1.0 });
```

### ER Diagram-Style Node

```javascript
Shape.HTML.register({
  shape: 'er-table',
  width: 200,
  height: 150,
  effect: ['data'],
  html(cell) {
    const { tableName, fields } = cell.getData() || {};
    const div = document.createElement('div');
    Dom.css(div, {
      width: '100%',
      height: '100%',
      background: '#fff',
      border: '1px solid #5B8FF9',
      borderRadius: '4px',
      overflow: 'hidden',
      fontFamily: 'monospace',
      fontSize: '12px',
    });
    const header = `<div style="background:#5B8FF9;color:#fff;padding:6px 8px;font-weight:bold">${tableName || 'table'}</div>`;
    const rows = (fields || [])
      .map((f) => `<div style="padding:4px 8px;border-bottom:1px solid #f0f0f0">${f.name}: <span style="color:#999">${f.type}</span></div>`)
      .join('');
    div.innerHTML = header + rows;
    return div;
  },
});

graph.addNode({
  shape: 'er-table',
  x: 100,
  y: 100,
  data: {
    tableName: 'users',
    fields: [
      { name: 'id', type: 'int' },
      { name: 'name', type: 'varchar' },
      { name: 'email', type: 'varchar' },
    ],
  },
});
```

## Working with Ports

Custom nodes can be used together with ports:

```javascript
graph.addNode({
  shape: 'custom-rect',
  x: 100,
  y: 100,
  label: 'With Ports',
  ports: {
    groups: {
      in: {
        position: 'left',
        attrs: { circle: { r: 5, magnet: true, stroke: '#8f8f8f', fill: '#fff' } },
      },
      out: {
        position: 'right',
        attrs: { circle: { r: 5, magnet: true, stroke: '#8f8f8f', fill: '#fff' } },
      },
    },
    items: [
      { id: 'in-1', group: 'in' },
      { id: 'out-1', group: 'out' },
    ],
  },
});
```

## Common Mistakes

### ❌ `Shape.Group` / `Shape.Group.define()` Does Not Exist

In X6 3.x, the `Shape` namespace **only exports**: `Circle / Edge / Ellipse / HTML / Image / Path / Polygon / Polyline / Rect / TextBlock`. There is **no `Group`**. All of the following forms throw `Cannot read properties of undefined (reading 'define')` / `Shape.Group is not a constructor` at runtime:

```javascript
// ❌
Shape.Group.define({ shape: 'dept-group', ... });
new Shape.Group({ ... });
import { Group } from '@antv/x6'; // ❌ The main package also does not export Group
```

**Correct approaches for parent-child grouping / container nodes (choose one):**

```javascript
// 1) Use a regular rect directly as the parent node and establish the parent-child relationship with embed / addChild
const parent = graph.addNode({ shape: 'rect', x: 40, y: 40, width: 300, height: 200, label: 'Department', attrs: { body: { fill: '#f5f5f5', stroke: '#999' } } });
const child  = graph.addNode({ shape: 'rect', x: 80, y: 90, width: 100, height: 40, label: 'Employee A' });
parent.addChild(child);            // Maintain the parent-child relationship
// Or: parent.embed(child)          // Embed (depends on the Graph embedding configuration)

// 2) Register a custom group shape before using it
Graph.registerNode('dept-group', {
  inherit: 'rect',
  width: 300, height: 200,
  attrs: {
    body: { fill: '#f5f5f5', stroke: '#999', strokeDasharray: '4,2' },
    label: { refX: 8, refY: 8, textAnchor: 'start', textVerticalAnchor: 'top' },
  },
});
graph.addNode({ shape: 'dept-group', x: 40, y: 40, label: 'Department' });

// 3) When Embedding interactions are needed, enable them in the Graph constructor options (not a plugin!)
const graph = new Graph({
  container: 'container',
  embedding: { enabled: true, findParent: 'bbox', frontOnly: false },
});
```

> `Shape.Cylinder` / `Shape.Diamond` / `Shape.Cloud`, and similar shapes also do not exist. When you need irregular nodes, use either `'polygon'` + custom `points`, or `Graph.registerNode` + custom `markup`.

### ❌ HTML Node `el.style.box-sizing = '...'` Throws Invalid left-hand side

In the `html(node)` callback of `Shape.HTML.register`, or in any DOM operation, **do not** write hyphenated property names directly on `style`. JS parses `style.box-sizing` as `style.box - sizing` (a subtraction expression), then throws `Uncaught SyntaxError: Invalid left-hand side in assignment`, preventing the entire script from executing:

```javascript
// ❌ All of these throw Invalid left-hand side in assignment
html() {
  const wrap = document.createElement('div');
  wrap.style.box-sizing      = 'border-box';
  wrap.style.font-size       = '14px';
  wrap.style.background-color= '#fff';
  wrap.style.border-radius   = '8px';
  return wrap;
}
```

**Correct forms (choose one; the first two are recommended):**

```javascript
// 1) camelCase
wrap.style.boxSizing       = 'border-box';
wrap.style.fontSize        = '14px';
wrap.style.backgroundColor = '#fff';
wrap.style.borderRadius    = '8px';

// 2) Bracket notation (preserves hyphens)
wrap.style['box-sizing']     = 'border-box';
wrap.style['font-size']      = '14px';
wrap.style['background-color']= '#fff';
wrap.style['border-radius']  = '8px';

// 3) Write all styles at once with cssText
wrap.style.cssText = 'box-sizing:border-box;font-size:14px;background:#fff;border-radius:8px;';

// 4) Assign properties in bulk with Object.assign
Object.assign(wrap.style, {
  boxSizing: 'border-box', fontSize: '14px',
  backgroundColor: '#fff', borderRadius: '8px',
});
```

### ❌ Using position:absolute in HTML Nodes Causes Rendering Issues

```javascript
// Incorrect: absolute positioning inside foreignObject may cause incomplete rendering
html() {
  const div = document.createElement('div');
  div.style.position = 'absolute';  // ❌ May cause rendering issues
  return div;
}

// Correct: use flex or normal flow layout
html() {
  const div = document.createElement('div');
  div.style.display = 'flex';  // ✅
  return div;
}
```

### ❌ Forgetting to Set effect Causes Nodes Not to Update

```javascript
// Incorrect: the node does not refresh after data changes
Shape.HTML.register({
  shape: 'my-node',
  html(cell) {
    const { value } = cell.getData();
    // ...
  },
  // Missing effect: ['data']
});

// Correct: declare effect
Shape.HTML.register({
  shape: 'my-node',
  effect: ['data'],  // ✅ Listen for data changes
  html(cell) {
    const { value } = cell.getData();
    // ...
  },
});
```

### ❌ registerNode Without the Third Parameter Causes Duplicate Registration Errors

```javascript
// Incorrect: duplicate registration throws an error
Graph.registerNode('my-node', { ... });
Graph.registerNode('my-node', { ... }); // Error: already registered

// Correct: pass true as the third parameter to allow overrides
Graph.registerNode('my-node', { ... }, true);
```
