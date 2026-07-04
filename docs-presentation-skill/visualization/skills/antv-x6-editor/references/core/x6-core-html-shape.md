---
id: "x6-core-html-shape"
title: "Complete Guide to X6 HTML Shapes (Shape.HTML.register)"
description: |
  A dedicated guide to rich HTML nodes in X6 3.x: Shape.HTML.register is the only registration entry point. Based on
  the source code in src/shape/html.ts, this document covers the HTML shape registration API, the three return types of
  the html callback (string / HTMLElement / function), the effect re-rendering mechanism (such as effect: ['data']), and
  business scenario templates: HTML card nodes, HTML form nodes (input/select/textarea), HTML status badge nodes, HTML
  user cards (avatar + name + role), and HTML data-table nodes. It also clearly states that the old X6 2.x API
  Graph.registerHTMLComponent is deprecated and does not exist in 3.x.

library: "x6"
version: "3.x"
category: "core"
subcategory: "shapes"
tags:
  - "HTML shape"
  - "Shape.HTML"
  - "Shape.HTML.register"
  - "html-node"
  - "html node"
  - "HTML node"
  - "HTML card"
  - "HTML form node"
  - "HTML status node"
  - "HTML status badge"
  - "HTML user card"
  - "user card node"
  - "editable form node"
  - "rich node"
  - "rich HTML node"
  - "foreignObject"
  - "data re-render"
  - "automatic data re-render"
  - "effect"
  - "effect: ['data']"
  - "registerHTMLComponent"
  - "Graph.registerHTMLComponent"
  - "DOM node"
  - "innerHTML"
  - "createElement"

related:
  - "x6-core-shapes"
  - "x6-core-node"
  - "x6-core-cell-data"
  - "x6-intermediate-custom-node"

use_cases:
  - "Render rich UI nodes such as cards, forms, status badges, and data tables with HTML/CSS"
  - "Automatically re-render node content when data changes"
  - "Embed arbitrary DOM outside SVG nodes, including input, select, and img"
  - "User card nodes (avatar + name + role)"
  - "Editable form nodes (input/select controls)"
  - "Nodes with mutable status (online/offline/idle switching)"

anti_patterns:
  - "Using Graph.registerHTMLComponent - deprecated in X6 3.x and absent from the source code"
  - "Passing html directly with addNode({ shape: 'html', html: '...' }) - you must register a named shape first"
  - "Returning undefined / null from the html callback"
  - "Overusing effect: ['data'] for static display-only nodes"

difficulty: "intermediate"
completeness: "full"
---

## 1. The Only Registration Entry Point: `Shape.HTML.register`

In X6 3.x, **all rich HTML nodes are registered as named shapes through `Shape.HTML.register`**, then added with `graph.addNode({ shape: 'xxx' })`. **There is no other registration method**.

Source location: `src/shape/html.ts:38`

```ts
public static register(config: HTMLShapeConfig) {
  const { shape, html, effect, inherit, ...others } = config
  if (!shape) {
    throw new Error('HTML.register should specify `shape` in config.')
  }
  HTMLShapeMaps[shape] = { html, effect }
  Graph.registerNode(shape, { inherit: inherit || 'html', ...others }, true)
}
```

### `HTMLShapeConfig` Fields (Complete List)

| Field | Type | Required | Description |
|------|------|------|------|
| `shape` | `string` | ✅ | Registered shape id, used by `addNode({ shape })` |
| `html` | `string \| HTMLElement \| (cell) => HTMLElement \| string` | ✅ | HTML content generator function or static HTML |
| `effect` | `(keyof NodeProperties)[]` | ❌ | Which prop changes should re-call `html(cell)` for rendering. If omitted, only the initial render is expected. Note: internal `change:*` listeners still trigger, but re-rendering only happens when the prop is in the effect list. |
| `inherit` | `string` | ❌ | Built-in shape to inherit from; defaults to `'html'` |
| `width` / `height` | `number` | ❌ | Default size; can be overridden by `addNode` |
| Other NodeProperties | - | ❌ | Same as the options of `Graph.registerNode` |

## 2. Minimal Runnable Templates (Increasing Complexity)

### 2.1 Static HTML (Simplest)

Pass a string directly to the `html` field:

```javascript
import { Graph, Shape } from '@antv/x6';

Shape.HTML.register({
  shape: 'static-html',
  width: 160,
  height: 80,
  html: '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;border:1px solid #8f8f8f;border-radius:6px;background:#fff;">Hello</div>',
});

const graph = new Graph({
  container: 'container',
  background: { color: '#F2F7FA' },
});

graph.addNode({ shape: 'static-html', x: 80, y: 60 });
```

### 2.2 Function Returning HTMLElement (Recommended)

`html(node)` returns a DOM element and reads business data with `node.getData()`:

```javascript
import { Graph, Shape } from '@antv/x6';

Shape.HTML.register({
  shape: 'card',
  width: 200,
  height: 80,
  html(node) {
    const data = node.getData() || {};
    const div = document.createElement('div');
    div.style.cssText =
      'width:100%;height:100%;padding:8px;box-sizing:border-box;' +
      'border:1px solid #8f8f8f;border-radius:6px;background:#fff;';
    div.innerHTML = `
      <div style="font-size:14px;font-weight:500;">${data.title || ''}</div>
      <div style="font-size:12px;color:#666;">${data.desc || ''}</div>
    `;
    return div;
  },
});

const graph = new Graph({ container: 'container', background: { color: '#F2F7FA' } });

graph.addNode({
  shape: 'card',
  x: 80, y: 60,
  data: { title: 'Hello', desc: 'World' },
});
```

### 2.3 Add `effect`: Automatically Re-render When `data` Changes

`effect: ['data']` makes the node **automatically call `html(cell)` again** when its `data` prop changes; no manual `view.render()` is required:

```javascript
Shape.HTML.register({
  shape: 'status-badge',
  width: 200, height: 50,
  effect: ['data'],
  html(node) {
    const { name, status } = node.getData() || {};
    const colors = { online: '#52c41a', offline: '#ff4d4f', idle: '#faad14' };
    const color = colors[status] || '#d9d9d9';
    const div = document.createElement('div');
    div.style.cssText = `width:100%;height:100%;display:flex;align-items:center;
      padding:0 10px;border:2px solid ${color};border-radius:8px;background:#fff;`;
    div.innerHTML = `
      <div style="width:8px;height:8px;border-radius:50%;background:${color};margin-right:8px;"></div>
      <span style="font-size:13px;">${name || ''}</span>
      <span style="font-size:11px;color:${color};margin-left:auto;">${status || ''}</span>
    `;
    return div;
  },
});

const node = graph.addNode({
  shape: 'status-badge',
  x: 80, y: 60,
  data: { name: 'API Server', status: 'online' },
});

// Updating data automatically re-executes html(cell) and refreshes the view
setTimeout(() => node.setData({ name: 'API Server', status: 'offline' }), 1000);
```

> **When to add `effect: ['data']`**: when business data changes dynamically, such as status switching or counter updates.
> **When not to add it**: for purely static display nodes, such as cards with fixed titles that are never updated through setData. Extra effects increase re-rendering overhead.

### 2.4 Forms / Interactive Nodes with `input` / `select`

```javascript
Shape.HTML.register({
  shape: 'form-node',
  width: 220, height: 130,
  html(node) {
    const data = node.getData() || {};
    const div = document.createElement('div');
    div.style.cssText =
      'width:100%;height:100%;padding:12px;box-sizing:border-box;' +
      'border:1px solid #d9d9d9;border-radius:8px;background:#fff;';
    div.innerHTML = `
      <div style="font-size:13px;font-weight:500;margin-bottom:8px;">${data.title || ''}</div>
      <div style="margin-bottom:6px;">
        <label style="font-size:11px;color:#666;">Name:</label>
        <input style="width:100%;padding:3px 6px;border:1px solid #d9d9d9;border-radius:4px;font-size:12px;box-sizing:border-box;" value="${data.name || ''}" />
      </div>
      <div>
        <label style="font-size:11px;color:#666;">Type:</label>
        <select style="width:100%;padding:3px 6px;border:1px solid #d9d9d9;border-radius:4px;font-size:12px;">
          <option ${data.type === 'string' ? 'selected' : ''}>string</option>
          <option ${data.type === 'number' ? 'selected' : ''}>number</option>
        </select>
      </div>
    `;
    return div;
  },
});

graph.addNode({
  shape: 'form-node',
  x: 80, y: 40,
  data: { title: 'Variable Config', name: 'userName', type: 'string' },
});
```

### 2.5 User Card (Avatar + Text)

```javascript
Shape.HTML.register({
  shape: 'user-card',
  width: 200, height: 60,
  html(node) {
    const data = node.getData() || {};
    const div = document.createElement('div');
    div.style.cssText =
      'width:100%;height:100%;display:flex;align-items:center;padding:8px;' +
      'box-sizing:border-box;border:1px solid #e8e8e8;border-radius:8px;background:#fff;';
    div.innerHTML = `
      <div style="width:36px;height:36px;border-radius:50%;background:#1890ff;
        display:flex;align-items:center;justify-content:center;
        color:#fff;font-weight:bold;margin-right:10px;">
        ${(data.name || 'U')[0]}
      </div>
      <div>
        <div style="font-size:14px;font-weight:500;">${data.name || ''}</div>
        <div style="font-size:12px;color:#999;">${data.role || ''}</div>
      </div>
    `;
    return div;
  },
});
```

## 3. Three Legal Returns for the `html` Field (Source: `src/shape/html.ts:124-134`)

```ts
let { html } = content;
if (typeof html === 'function') {
  html = html(this.cell);
}
if (html) {
  if (typeof html === 'string') {
    container.innerHTML = html;
  } else {
    Dom.append(container, html);   // Must be an HTMLElement
  }
}
```

| Return Type | Rendering Method | Applicable Scenarios |
|---------|---------|---------|
| `string` | `container.innerHTML = html` | Static structures and template-string concatenation |
| `HTMLElement` | `Dom.append(container, html)` | When you need addEventListener / held refs |
| `(cell) => string \| HTMLElement` | Same as above; can read cell state | Content depends on data / props |

Returning `null` / `undefined` / an empty string all **renders an empty div**.

## 4. Style Guidelines (For Matching Expected Output)

Official X6 demos for HTML shapes are usually **kept minimal**:

1. Define **node width and height** in `Shape.HTML.register({ width, height })` as the default size for the shape; they can be omitted in `addNode`.
2. **`addNode`** should only pass `shape` / `x` / `y` / `data` when needed. **Do not repeat width/height** unless you really need to override them.
3. **Write styles in one `cssText` line** or with concise `style.xxx` assignments. Avoid piling up decorative attributes such as long `box-shadow / fontFamily / padding` strings.
4. **Do not add `effect: ['data']` to static nodes**; it is only needed when `setData` updates the node dynamically.
5. **Do not include connecting / addEdge / centerContent in HTML shape demos** unless the requirement explicitly asks for them.
6. **`background: { color: '#F2F7FA' }`** is the common light-blue background color in X6 demos; keep it consistent with expected output.

## 5. The Old X6 2.x API Is Deprecated (Important)

⚠️ **`Graph.registerHTMLComponent(name, factory)` does not exist in X6 3.x**:

```javascript
// ❌ Incorrect: old X6 2.x API; this method no longer exists in the 3.x source (no matches under grep src/)
Graph.registerHTMLComponent('user-card', (node) => { /* ... */ });
graph.addNode({ shape: 'html', html: 'user-card', data: {...} });

// ✅ Correct: X6 3.x consistently uses Shape.HTML.register
Shape.HTML.register({
  shape: 'user-card',
  html(node) { /* ... */ },
});
graph.addNode({ shape: 'user-card', data: {...} });
```

If you see `Graph.registerHTMLComponent` online or in old demos, **always replace it with `Shape.HTML.register`**:
- You no longer need to write the shape as the string `'html'` and reference it with `html: 'component-name'`.
- Use the shape name from registration directly as `addNode({ shape })`.

## 6. Common Mistakes and Fixes

### ❌ Writing `shape: 'html'` Directly in `addNode`

```javascript
// Incorrect: 'html' is X6's built-in base shape and has no html content definition
graph.addNode({ shape: 'html', html: '<div>x</div>' });
// → Throws "shape not found" or renders blank
```

```javascript
// Correct: register a named shape first
Shape.HTML.register({ shape: 'card', html: '<div>x</div>' });
graph.addNode({ shape: 'card', x: 0, y: 0, width: 100, height: 40 });
```

### ❌ Forgetting to Return from the `html` Callback

```javascript
Shape.HTML.register({
  shape: 'card',
  html(node) {
    const div = document.createElement('div');
    div.textContent = 'hi';
    // ❌ Forgot return; the foreignObject will be empty
  },
});
```

```javascript
// Correct: must return
html(node) {
  const div = document.createElement('div');
  div.textContent = 'hi';
  return div;
}
```

### ❌ Using `Graph.registerHTMLComponent` (X6 2.x Leftover)

See Section 5.

### ❌ Misspelling the Prop Name in `effect`

```javascript
// Incorrect: 'datas' is not a valid NodeProperty key
Shape.HTML.register({ shape: 'x', effect: ['datas'], html(n) { /* ... */ } });
// → setData will not trigger re-rendering
```

```javascript
// Correct: effect entries must be keys of NodeProperties, such as 'data' / 'attrs' / 'size' / 'position'
Shape.HTML.register({ shape: 'x', effect: ['data'], html(n) { /* ... */ } });
```

### ❌ HTML Node Size Does Not Take Effect

```javascript
// Incorrect: the div uses fixed px values, but the outer foreignObject size is determined by width/height
html(node) {
  const div = document.createElement('div');
  div.style.width = '300px';   // ⚠️ The node itself is only 200x80
  div.style.height = '200px';  // → Exceeds the foreignObject and gets clipped
  return div;
}
```

```javascript
// Correct: use 100% internally to fill the foreignObject; control node size through register/addNode
html(node) {
  const div = document.createElement('div');
  div.style.cssText = 'width:100%;height:100%;...';
  return div;
}
graph.addNode({ shape: 'card', width: 300, height: 200 });
```

## 7. Related Documentation

- `core/x6-core-shapes.md` - Overview of all 10 built-in shapes
- `core/x6-core-node.md` - Node APIs (addNode / setData / events)
- `core/x6-core-cell-data.md` - Reading, writing, and listening to cell.data
- `intermediate/x6-intermediate-custom-node.md` - Registering custom SVG nodes with Graph.registerNode
