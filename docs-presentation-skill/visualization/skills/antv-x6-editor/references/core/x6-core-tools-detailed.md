---
id: "x6-core-tools-detailed"
title: "Detailed Guide to X6 Built-in Tools"
description: |
  X6 3.x provides a variety of built-in tools that can be attached to nodes or edges to implement interactive features.
  These include button, button-remove, editor, boundary, vertices, segments, arrowhead, anchor, and other tools.

library: "x6"
version: "3.x"
category: "core"
subcategory: "tools"
tags:
  - "tools"
  - "tool"
  - "button"
  - "button-remove"
  - "editor"
  - "boundary"
  - "vertices"
  - "segments"
  - "arrowhead"
  - "anchor"
  - "interaction"

related:
  - "x6-intermediate-tools"
  - "x6-core-events"

use_cases:
  - "Add a delete button to a node"
  - "Double-click to edit node/edge text"
  - "Drag intermediate vertices on an edge"
  - "Drag edge segments"
  - "Display a node boundary box"
  - "Drag arrowheads to change connections"
  - "Drag anchors to adjust connection positions"

difficulty: "intermediate"
completeness: "full"
---

## Complete List of Built-in Tools

### Node Tools

| Tool Name | Description | Typical Use |
|-----------|-------------|-------------|
| `button` | Custom button | Add action buttons to nodes |
| `button-remove` | Delete button | Delete a node when clicked |
| `boundary` | Boundary box | Display a dashed boundary for a node |
| `editor` | Text editor | Double-click to edit node label text |

### Edge Tools

| Tool Name | Description | Typical Use |
|-----------|-------------|-------------|
| `button` | Custom button | Add action buttons to edges |
| `button-remove` | Delete button | Delete an edge when clicked |
| `boundary` | Boundary box | Display the bounding box of an edge |
| `vertices` | Vertex tool | Drag to add/move/remove edge vertices |
| `segments` | Segment tool | Drag orthogonal edge segments |
| `arrowhead` | Arrowhead tool | Drag the source/target arrowheads of an edge to change connections |
| `anchor` | Anchor tool | Drag to adjust the anchor position of an edge on a node |
| `editor` | Text editor | Double-click to edit edge label text |

---

## Button Tool

Displays a clickable button on a node or edge.

### Options

| Property | Type | Description |
|----------|------|-------------|
| `x` | `number \| string` | Button X position (supports percentages such as `'100%'`) |
| `y` | `number \| string` | Button Y position |
| `offset` | `{ x, y }` | Offset |
| `rotate` | `boolean` | Whether to rotate with the node |
| `useCellGeometry` | `boolean` | Whether to position based on node geometry |
| `markup` | `Markup[]` | Custom button SVG structure |
| `onClick` | `function` | Click callback |

### Example: Custom Button

```javascript
node.addTools([
  {
    name: 'button',
    args: {
      x: '100%',
      y: 0,
      offset: { x: -10, y: 10 },
      markup: [
        {
          tagName: 'circle',
          selector: 'button',
          attrs: {
            r: 8,
            stroke: '#fe854f',
            'stroke-width': 2,
            fill: 'white',
            cursor: 'pointer',
          },
        },
        {
          tagName: 'text',
          textContent: '+',
          selector: 'icon',
          attrs: {
            fill: '#fe854f',
            'font-size': 12,
            'text-anchor': 'middle',
            'pointer-events': 'none',
            y: '0.3em',
          },
        },
      ],
      onClick({ cell }) {
        console.log('Button clicked on', cell.id);
      },
    },
  },
]);
```

---

## Button-Remove Tool

A preset delete button that deletes the node or edge it belongs to when clicked.

### Options

Inherits all Button options and includes a red X icon by default.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `x` | `number` | `0` | X position |
| `y` | `number` | `0` | Y position |
| `offset` | `{ x, y }` | - | Offset |

### Example

```javascript
// Show the delete button when hovering over a node
graph.on('node:mouseenter', ({ node }) => {
  node.addTools([
    {
      name: 'button-remove',
      args: { x: 0, y: 0, offset: { x: 4, y: 4 } },
    },
  ]);
});

graph.on('node:mouseleave', ({ node }) => {
  node.removeTools();
});
```

---

## Editor Tool (Text Editing)

When a node or edge label is double-clicked, an inline editor appears to modify the text.

### Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `attrs.fontSize` | `number` | `14` | Editor font size |
| `attrs.fontFamily` | `string` | `'Arial'` | Font family |
| `attrs.color` | `string` | `'#000'` | Text color |
| `attrs.backgroundColor` | `string` | `'#fff'` | Editor background color |
| `getText` | `function` | - | Function for getting the current text |
| `setText` | `function` | - | Function for setting the new text |

### Example: Node Text Editing

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({ container: 'container' });

const node = graph.addNode({
  shape: 'rect',
  x: 100,
  y: 100,
  width: 120,
  height: 50,
  label: 'Double-click to edit',
  attrs: { body: { fill: '#fff', stroke: '#8f8f8f', rx: 6, ry: 6 } },
});

// Add the editor tool
node.addTools([
  {
    name: 'editor',
    args: {
      attrs: {
        fontSize: 14,
        color: '#333',
        backgroundColor: '#fafafa',
      },
      getText({ cell }) {
        return cell.attr('label/text') || '';
      },
      setText({ cell, value }) {
        cell.attr('label/text', value);
      },
    },
  },
]);
```

### Example: Edge Label Editing

```javascript
edge.addTools([
  {
    name: 'editor',
    args: {
      getText({ cell }) {
        return cell.getLabelAt(0)?.attrs?.label?.text || '';
      },
      setText({ cell, value }) {
        cell.setLabelAt(0, { attrs: { label: { text: value } } });
      },
    },
  },
]);
```

---

## Boundary Tool

Displays a dashed boundary box for a node or edge.

### Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `padding` | `number \| SideOptions` | `10` | Padding between the boundary and the node |
| `rotate` | `boolean` | - | Whether to rotate with the node |
| `useCellGeometry` | `boolean` | `true` | Calculate based on node geometry |
| `attrs` | `object` | Dashed rectangle | Boundary box style |

### Example

```javascript
node.addTools([
  {
    name: 'boundary',
    args: {
      padding: 8,
      attrs: {
        fill: 'none',
        stroke: '#1890ff',
        'stroke-width': 1,
        'stroke-dasharray': '4, 4',
      },
    },
  },
]);
```

---

## Vertices Tool (Edge Vertices)

Displays draggable vertex control points on an edge. You can add, move, and delete vertices to adjust the edge path.

### Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `snapRadius` | `number` | `20` | Snap radius |
| `addable` | `boolean` | `true` | Whether clicking an edge can add vertices |
| `removable` | `boolean` | `true` | Whether vertices can be removed |
| `removeRedundancies` | `boolean` | `true` | Automatically remove collinear vertices |
| `stopPropagation` | `boolean` | `true` | Stop event propagation |
| `attrs` | `object` | Circular control point | Vertex style |
| `modifiers` | `ModifierKey` | - | Modifier key that must be held when adding a vertex |

### Example

```javascript
graph.on('edge:mouseenter', ({ edge }) => {
  edge.addTools([
    {
      name: 'vertices',
      args: {
        snapRadius: 15,
        attrs: {
          r: 5,
          fill: '#fff',
          stroke: '#1890ff',
          'stroke-width': 2,
          cursor: 'move',
        },
      },
    },
  ]);
});

graph.on('edge:mouseleave', ({ edge }) => {
  edge.removeTools();
});
```

### Interaction Modes

- **Add a vertex**: click an empty area on the edge path
- **Move a vertex**: drag an existing vertex control point
- **Delete a vertex**: double-click the vertex (or configure through `removable`)

---

## Segments Tool (Segment Dragging)

On orthogonally routed edges, displays draggable segment control bars. Dragging a segment adjusts the orthogonal path.

### Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `precision` | `number` | `0.5` | Segment detection precision |
| `threshold` | `number` | `40` | Minimum segment length threshold |
| `snapRadius` | `number` | `10` | Snap radius |
| `removeRedundancies` | `boolean` | `true` | Automatically remove redundant points |
| `stopPropagation` | `boolean` | `true` | Stop event propagation |
| `attrs` | `object` | Rectangular control bar | Segment handle style |

### Example

```javascript
graph.on('edge:mouseenter', ({ edge }) => {
  edge.addTools([
    {
      name: 'segments',
      args: {
        snapRadius: 10,
        attrs: {
          width: 20,
          height: 8,
          x: -10,
          y: -4,
          rx: 4,
          ry: 4,
          fill: '#333',
          stroke: '#fff',
          'stroke-width': 2,
        },
      },
    },
  ]);
});

graph.on('edge:mouseleave', ({ edge }) => {
  edge.removeTools();
});
```

### Key Notes

- **Applies to orthogonal routing** edges (`orth`, `manhattan`)
- Control bars are displayed only on horizontal or vertical segments
- Dragging automatically adjusts adjacent vertex coordinates

---

## Arrowhead Tool

Displays a draggable arrowhead at the source or target of an edge. Dragging it can change the edge connection target.

### Options

| Property | Type | Description |
|----------|------|-------------|
| `type` | `'source' \| 'target'` | Which end of the edge the arrowhead is on |
| `attrs` | `object` | Arrowhead SVG style |

### Example

```javascript
edge.addTools([
  { name: 'source-arrowhead' },
  { name: 'target-arrowhead' },
]);
```

### Built-in Presets

- `'source-arrowhead'`: source arrowhead tool
- `'target-arrowhead'`: target arrowhead tool

---

## Anchor Tool

Displays an anchor controller at an edge endpoint. Dragging it adjusts the anchor position of the edge on the node.

### Options

| Property | Type | Description |
|----------|------|-------------|
| `type` | `'source' \| 'target'` | Which endpoint's anchor to control |
| `customAnchorAttrs` | `object` | Custom anchor style |
| `defaultAnchorAttrs` | `object` | Default anchor style |
| `resetAnchor` | `boolean \| AnchorConfig` | Reset the anchor on double-click |

### Example

```javascript
edge.addTools([
  {
    name: 'anchor',
    args: {
      type: 'source',
      customAnchorAttrs: {
        'stroke-width': 4,
        stroke: '#33334F',
        fill: '#FFFFFF',
        r: 5,
      },
    },
  },
  {
    name: 'anchor',
    args: { type: 'target' },
  },
]);
```

---

## Adding and Managing Tools

### Adding Tools

```javascript
// Add a single tool
node.addTools([{ name: 'button-remove', args: { x: 0, y: 0 } }]);

// Add multiple tools
edge.addTools([
  { name: 'vertices' },
  { name: 'segments' },
  { name: 'source-arrowhead' },
  { name: 'target-arrowhead' },
]);
```

### Removing Tools

```javascript
// Remove all tools
node.removeTools();
```

### Checking Tools

```javascript
if (node.hasTools()) {
  node.removeTools();
}
```

### Show/Hide on Hover Pattern

```javascript
graph.on('node:mouseenter', ({ node }) => {
  node.addTools([
    { name: 'boundary' },
    { name: 'button-remove', args: { x: 0, y: 0 } },
  ]);
});

graph.on('node:mouseleave', ({ node }) => {
  node.removeTools();
});

graph.on('edge:mouseenter', ({ edge }) => {
  edge.addTools([
    { name: 'vertices' },
    { name: 'button-remove', args: { distance: 20 } },
  ]);
});

graph.on('edge:mouseleave', ({ edge }) => {
  edge.removeTools();
});
```

---

## Common Errors and Fixes

### Error 1: Using Non-existent hideTools/showTools APIs

```javascript
// Wrong: X6 3.x does not provide these APIs
node.hideTools();
node.showTools();

// Correct: control visibility with addTools/removeTools
node.addTools([...]);
node.removeTools();
```

### Error 2: Configuring Tools in Graph Options

```javascript
// Wrong: tools are not configured in Graph options
const graph = new Graph({
  container: 'container',
  tools: ['button-remove'],  // This option does not exist
});

// Correct: add tools through node/edge instances
const node = graph.addNode({ ... });
node.addTools([{ name: 'button-remove', args: { x: 0, y: 0 } }]);
```

### Error 3: Passing a Non-array to addTools

```javascript
// Wrong: addTools expects an array argument
node.addTools({ name: 'boundary' });

// Correct: pass an array
node.addTools([{ name: 'boundary' }]);
```
