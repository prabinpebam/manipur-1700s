---
id: "x6-core-markup"
title: "X6 Markup (DOM Structure Definition)"
description: |
  The DOM structure of X6 nodes, edges, and ports is described through markup.
  Based on the actual implementations in src/view/markup.ts and src/shape/util.ts,
  this document systematically explains MarkupJSONMarkup fields, the selector / groupSelector mechanism,
  the default markup of built-in shapes, guidelines for writing custom shape markup, and compatible string markup syntax.

library: "x6"
version: "3.x"
category: "core"
subcategory: "markup"
tags:
  - "markup"
  - "selector"
  - "groupSelector"
  - "tagName"
  - "DOM"
  - "custom shape"
  - "custom shape"
  - "registerNode"
  - "label"
  - "body"
  - "lines"

related:
  - "x6-core-shapes"
  - "x6-core-node"
  - "x6-core-edge"
  - "x6-intermediate-custom-node"
  - "x6-intermediate-custom-edge"

use_cases:
  - "Define custom node shapes by declaring markup in registerNode"
  - "Define custom edge shapes, such as double lines or thick hit areas"
  - "Understand where selectors in attrs (body / label / line) come from"
  - "Independently style multiple child elements in markup through selectors"
  - "Apply the same attribute to multiple child elements at once through groupSelector"

anti_patterns:
  - "Reusing the same selector in markup"
  - "Writing attrs keys as CSS selectors; they should be selector / groupSelector names from markup"
  - "Mixing SVG tagName values in the markup of HTML nodes"
  - "Omitting the lines groupSelector in edge markup, causing attrs.lines to fail"

difficulty: "intermediate"
completeness: "full"
---

## Core Concepts

**Markup** is the **low-level DOM structure description** for nodes, edges, ports, and labels in X6. The `attrs` configuration of the same cell must refer to specific DOM elements through the `selector` or `groupSelector` declared in markup to take effect correctly.

> Source location: `src/view/markup.ts` - `parseJSONMarkup` recursively builds SVG / XHTML nodes from the JSON description.

## MarkupJSONMarkup Fields Quick Reference

| Field | Type | Description | Required |
|------|------|------|------|
| `tagName` | `string` | DOM element tag name, such as `'rect'`, `'circle'`, `'path'`, `'text'`, `'g'`, or `'image'` | ✓ |
| `selector` | `string` | Unique selector. `attrs[selector] = {...}` uses it to precisely target the element | |
| `groupSelector` | `string \| string[]` | Group selector. Applies the same attrs group to multiple elements at once. **Its name cannot conflict with a selector** | |
| `ns` | `string` | Namespace. Defaults to `http://www.w3.org/2000/svg`; HTML elements must use `Dom.ns.xhtml` | |
| `attrs` | `SimpleAttrs` | DOM attributes (automatically converted to kebab-case). Merged with `cell.attrs[selector]`, with the latter taking priority | |
| `style` | `Record<string, string \| number>` | Inline CSS, set through `Dom.css` | |
| `className` | `string \| string[]` | DOM `class` attribute | |
| `textContent` | `string` | The element's `textContent`. Note: dynamic text should be placed in `attrs.text/text` | |
| `children` | `MarkupJSONMarkup[]` | Child elements, built recursively | |

Missing `tagName` throws `TypeError: Invalid tagName` in `parseJSONMarkup`.

## Difference Between `selector` and `groupSelector` (Key Point)

- `selector` **must be unique** within a markup. Duplicates throw `TypeError: Selector must be unique`.
- `groupSelector` allows multiple elements to share the same name. When that name is referenced in `attrs`, the attributes are applied to **all members**.
- If a `groupSelector` has the same name as a `selector`, it throws `Error: Ambiguous group selector`.

```javascript
// Built-in edge markup (excerpt from src/shape/edge.ts)
markup: [
  { tagName: 'path', selector: 'wrap', groupSelector: 'lines', attrs: {...} },
  { tagName: 'path', selector: 'line', groupSelector: 'lines', attrs: {...} },
]
attrs: {
  lines: { connection: true, strokeLinejoin: 'round' }, // ← Applies to both wrap and line
  wrap:  { strokeWidth: 10 },                            // ← Applies only to the first path (invisible hit area)
  line:  { stroke: '#333', strokeWidth: 2, targetMarker: 'classic' }, // ← The actual visible line
}
```

## Default Markup of Built-in Shapes (Verified from `src/shape/util.ts`)

`createShape(shape, config)` generates default markup for all base shapes:

```javascript
// Equivalent to
markup: [
  { tagName: shape, selector: 'body' },  // shape: rect / circle / ellipse / polygon / polyline / path / image / text-block
  { tagName: 'text', selector: 'label' },
]
attrs: {
  [shape]: { /* BaseBodyAttr: fill #ffffff, stroke #333333, strokeWidth 2 */ },
  text:    { /* BaseLabelAttr: fontSize 14, fill #000, refX/refY 0.5, anchor middle */ },
}
```

From this, several easy-to-miss rules follow:

1. The `body` selector in built-in node attrs **actually corresponds to the tagName of that shape itself**. For example, the body of rect is `<rect>` and the body of circle is `<circle>`, so attrs can only contain SVG attributes supported by that tagName.
2. The text selector of built-in nodes is called **`label`** (not `text`), but internal `attrs.text` is also kept as an alias, and both can match.
3. The default markup for edges (`edge`) contains two `path` elements (`wrap` + `line`), controlled together through the `lines` group. If you override markup for a custom edge, you must preserve the `lines` group or rewrite attrs accordingly.

## Custom Node: Complete Markup Example

```javascript
import { Graph } from '@antv/x6';

Graph.registerNode(
  'card-node',
  {
    inherit: 'rect',
    width: 180,
    height: 64,
    markup: [
      { tagName: 'rect',  selector: 'body' },
      { tagName: 'image', selector: 'icon' },
      { tagName: 'text',  selector: 'title' },
      { tagName: 'text',  selector: 'subtitle' },
    ],
    attrs: {
      body: {
        refWidth: '100%',       // Follow the node width
        refHeight: '100%',
        fill: '#fff',
        stroke: '#8f8f8f',
        strokeWidth: 1,
        rx: 6,
        ry: 6,
      },
      icon: {
        ref: 'body',
        refX: 8,
        refY: 0.5,             // 50% of the body height
        refY2: -10,            // Then another -10 pixels
        width: 20,
        height: 20,
        'xlink:href': '',
      },
      title: {
        ref: 'body',
        refX: 36,
        refY: 16,
        textAnchor: 'start',
        textVerticalAnchor: 'middle',
        fontSize: 14,
        fill: '#262626',
      },
      subtitle: {
        ref: 'body',
        refX: 36,
        refY: 40,
        textAnchor: 'start',
        textVerticalAnchor: 'middle',
        fontSize: 12,
        fill: '#8c8c8c',
      },
    },
  },
  true,
);

const graph = new Graph({
  container: 'container',
  background: { color: '#F2F7FA' },
});

graph.addNode({
  shape: 'card-node',
  x: 40, y: 40,
  attrs: {
    icon:     { 'xlink:href': 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png' },
    title:    { text: 'AntV X6' },
    subtitle: { text: 'Graph editor' },
  },
});

graph.centerContent();
```

## Custom Edge: Markup with a Hit Area

```javascript
import { Graph } from '@antv/x6';

Graph.registerEdge(
  'thick-edge',
  {
    inherit: 'edge',
    markup: [
      // The first invisible thick path is used as the click hit area
      { tagName: 'path', selector: 'wrap',  groupSelector: 'lines',
        attrs: { fill: 'none', stroke: 'transparent', strokeWidth: 12, cursor: 'pointer' } },
      // The second visible thin path is the actual edge line
      { tagName: 'path', selector: 'line',  groupSelector: 'lines',
        attrs: { fill: 'none', pointerEvents: 'none' } },
    ],
    attrs: {
      lines: { connection: true, strokeLinejoin: 'round' }, // ← Must be preserved
      line:  { stroke: '#1890ff', strokeWidth: 2, targetMarker: 'classic' },
    },
  },
  true,
);
```

## String Markup (Compatible Syntax)

`markup` can also be a string (HTML/SVG fragment), but it is **not recommended** for custom shapes:
- String mode has no `selector` concept, so attrs cannot precisely target elements.
- It usually only appears in internal scenarios such as `getPortContainerMarkup()`, where there is a "single g container".
- Business code should always use JSON markup.

```javascript
// ❌ Not recommended
markup: '<rect class="body"/><text class="label"/>'

// ✅ Recommended
markup: [
  { tagName: 'rect', selector: 'body' },
  { tagName: 'text', selector: 'label' },
]
```

## Port Markup

Port markup is configured through `ports.groups[name].markup`. The default markup is a `<circle>` (see `Markup.getPortMarkup()`):

```javascript
ports: {
  groups: {
    in: {
      position: 'left',
      markup: [{ tagName: 'circle', selector: 'circle' }], // ← Default value
      attrs: {
        circle: { r: 4, magnet: true, stroke: '#8f8f8f', fill: '#fff' },
      },
    },
  },
}
```

> The top-level tagName of port markup must be an SVG element. If you need HTML-style ports, register the entire HTML node with `Shape.HTML.register` instead of changing port markup.

## Label Markup (Edge Labels)

The default markup for `labels` in `graph.addEdge` is `<rect> + <text>`. It can be overridden through `defaultLabel` or an individual label:

```javascript
graph.addEdge({
  source: a, target: b,
  defaultLabel: {
    markup: [
      { tagName: 'rect',  selector: 'body' },
      { tagName: 'text',  selector: 'label' },
    ],
    attrs: {
      body:  { fill: '#fff', stroke: '#8f8f8f', rx: 4, ry: 4 },
      label: { fontSize: 12, fill: '#262626', textAnchor: 'middle', textVerticalAnchor: 'middle' },
    },
  },
  labels: [{ position: 0.5, attrs: { label: { text: 'connected' } } }],
});
```

## Common Mistakes and Fixes

### ❌ Duplicate `selector`

```javascript
// Incorrect: both elements use 'body', causing TypeError: Selector must be unique at runtime
markup: [
  { tagName: 'rect', selector: 'body' },
  { tagName: 'rect', selector: 'body' },
]

// Correct: each selector is unique
markup: [
  { tagName: 'rect', selector: 'body' },
  { tagName: 'rect', selector: 'header' },
]
```

### ❌ `groupSelector` Has the Same Name as a `selector`

```javascript
// Incorrect: throws Error: Ambiguous group selector
markup: [
  { tagName: 'path', selector: 'lines' },
  { tagName: 'path', groupSelector: 'lines' },
]

// Correct: use distinct names
markup: [
  { tagName: 'path', selector: 'line', groupSelector: 'lines' },
  { tagName: 'path', selector: 'wrap', groupSelector: 'lines' },
]
```

### ❌ Missing `tagName`

```javascript
// Incorrect: throws TypeError: Invalid tagName
markup: [{ selector: 'body' }]

// Correct
markup: [{ tagName: 'rect', selector: 'body' }]
```

### ❌ Treating a CSS Selector as an `attrs` Key

```javascript
// Incorrect: attrs keys must be selector / groupSelector names from markup
attrs: {
  '.body': { fill: '#fff' },        // ❌ Not a CSS selector
  'rect.body': { fill: '#fff' },    // ❌
}

// Correct
markup: [{ tagName: 'rect', selector: 'body' }],
attrs: {
  body: { fill: '#fff' },           // ✅ Matches the selector name
}
```

### ❌ Omitting the `lines` groupSelector in a Custom Edge

```javascript
// Incorrect: the lines group is lost when overriding markup, so attrs.lines.connection = true fails,
// and the edge path will not update with source/target
markup: [{ tagName: 'path', selector: 'line' }],
attrs: { lines: { connection: true } },

// Correct: either preserve groupSelector or move connection onto line
markup: [{ tagName: 'path', selector: 'line', groupSelector: 'lines' }],
attrs: { lines: { connection: true }, line: { stroke: '#333' } },
// Or
markup: [{ tagName: 'path', selector: 'line' }],
attrs: { line: { connection: true, stroke: '#333' } },
```

### ❌ Putting HTML Content in SVG Markup

```javascript
// Incorrect: treating div as an SVG child node will fail to render
markup: [
  { tagName: 'rect', selector: 'body' },
  { tagName: 'div',  selector: 'content' },     // ❌ There is no div in the SVG namespace
]

// Correct: use Shape.HTML.register
import { Shape } from '@antv/x6';
Shape.HTML.register({
  shape: 'my-card',
  effect: ['data'],
  html(node) {
    const el = document.createElement('div');
    el.style.cssText = 'width:100%;height:100%;border:1px solid #8f8f8f;';
    el.innerHTML = node.getData()?.html || '';
    return el;
  },
});
```
