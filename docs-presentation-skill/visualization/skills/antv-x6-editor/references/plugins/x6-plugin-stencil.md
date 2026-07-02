---
id: "x6-plugin-stencil"
title: "X6 Stencil Drag Panel Plugin"
description: |
  Stencil is a sidebar drag panel that provides grouped display and search for predefined node templates.
  Users can drag nodes from the Stencil panel onto the canvas. It is commonly used as a toolbox in flowchart editors and DAG editors.

library: "x6"
version: "3.x"
category: "plugins"
subcategory: "stencil"
tags:
  - "stencil"
  - "drag panel"
  - "sidebar"
  - "toolbox"
  - "node template"
  - "grouping"
  - "search"
  - "drag"
  - "panel"

related:
  - "x6-plugins"
  - "x6-plugin-dnd"
  - "x6-core-graph-init"
  - "x6-pattern-flowchart"

use_cases:
  - "Left-side node panel for a flowchart editor"
  - "Grouped node toolbox"
  - "Searchable component library panel"
  - "Drag predefined nodes from a sidebar onto the canvas"

difficulty: "intermediate"
completeness: "full"
---

## Core Concepts

**Stencil** is an independent sidebar panel component. Internally, it maintains a separate small canvas for displaying node templates. Users drag nodes from Stencil to the target canvas, and Stencil uses the Dnd plugin internally to implement the drag logic.

Stencil features:
- Supports grouped display of node templates
- Supports search filtering
- Supports collapsed and expanded groups
- Supports custom layouts, such as grid layouts
- Allows custom dragNode and dropNode behavior during dragging

## Basic Usage

```javascript
import { Graph, Stencil } from '@antv/x6';

// 1. Create the target canvas
const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  grid: { visible: true },
});

// 2. Register the Stencil plugin through graph.use()
const stencil = new Stencil({
  title: 'Component Library',
  target: graph,
  stencilGraphWidth: 200,
  stencilGraphHeight: 300,
  groups: [
    { name: 'basic', title: 'Basic Nodes' },
    { name: 'advanced', title: 'Advanced Nodes' },
  ],
});
graph.use(stencil);

// 3. Mount the Stencil container to the DOM
document.getElementById('stencil-container').appendChild(stencil.container);

// 4. Load node templates into groups (using graph.createNode to create node templates is recommended)
const rect = graph.createNode({
  shape: 'rect',
  width: 80,
  height: 40,
  label: 'Rectangle',
  attrs: { body: { fill: '#fff', stroke: '#8f8f8f' } },
});

const circle = graph.createNode({
  shape: 'circle',
  width: 60,
  height: 60,
  label: 'Circle',
  attrs: { body: { fill: '#fff', stroke: '#8f8f8f' } },
});

stencil.load([rect, circle], 'basic');

stencil.load(
  [
    graph.createNode({
      shape: 'rect',
      width: 80,
      height: 40,
      label: 'Custom',
      attrs: { body: { fill: '#efdbff', stroke: '#9254de', rx: 6, ry: 6 } },
    }),
  ],
  'advanced',
);
```

## Options

### StencilOptions

| Parameter | Type | Required | Default | Description |
|------|------|------|--------|------|
| `target` | `Graph` | Yes | - | Target canvas instance |
| `title` | `string` | | `'Stencil'` | Panel title |
| `groups` | `StencilGroup[]` | | - | Group configuration |
| `stencilGraphWidth` | `number` | | `200` | Width of the canvas inside the panel |
| `stencilGraphHeight` | `number` | | `800` | Height of the canvas inside the panel |
| `stencilGraphPadding` | `number` | | - | Padding inside the panel canvas |
| `stencilGraphOptions` | `Options` | | - | Extra options for the panel canvas |
| `collapsable` | `boolean` | | `false` | Whether groups can be collapsed |
| `search` | `boolean \| Function \| object` | | - | Search configuration |
| `placeholder` | `string` | | `'Search'` | Placeholder text for the search input |
| `notFoundText` | `string` | | `'No matches found'` | Message displayed when search returns no results |
| `layout` | `Function` | | Grid layout | Node layout function |
| `layoutOptions` | `object` | | - | Layout parameters |
| `getDragNode` | `Function` | | Clone the source node | Customize the node displayed during dragging |
| `getDropNode` | `Function` | | Clone the dragged node | Customize the node placed on the canvas |
| `validateNode` | `Function` | | - | Validate whether a node can be dropped |

### StencilGroup

| Parameter | Type | Required | Default | Description |
|------|------|------|--------|------|
| `name` | `string` | Yes | - | Unique group identifier |
| `title` | `string` | | `name` | Display title of the group |
| `collapsed` | `boolean` | | `false` | Whether the group is collapsed by default |
| `collapsable` | `boolean` | | Inherits from the parent | Whether the group can be collapsed |
| `graphWidth` | `number` | | Inherits `stencilGraphWidth` | Canvas width for this group |
| `graphHeight` | `number` | | Inherits `stencilGraphHeight` | Canvas height for this group |
| `graphPadding` | `number` | | Inherited | Canvas padding for this group |
| `graphOptions` | `Options` | | - | Extra canvas options for this group |
| `layout` | `Function` | | Inherits from the parent | Node layout function for this group |
| `layoutOptions` | `object` | | Inherits from the parent | Layout parameters for this group |

## Search Configuration

### Enable Search

```javascript
const stencil = new Stencil({
  target: graph,
  search: true,  // Search by shape name by default
  placeholder: 'Search nodes...',
  notFoundText: 'No matching nodes found',
  groups: [{ name: 'basic', title: 'Basic Nodes' }],
});
```

### Custom Search Filter

```javascript
const stencil = new Stencil({
  target: graph,
  search(cell, keyword, groupName, stencil) {
    // Search by label text
    return cell.attr('label/text')?.includes(keyword) || false;
  },
  groups: [{ name: 'basic', title: 'Basic Nodes' }],
});
```

## Custom Drag and Drop Nodes

```javascript
const stencil = new Stencil({
  target: graph,
  groups: [{ name: 'basic', title: 'Basic Nodes' }],

  // Node displayed during dragging (can use a simplified display)
  getDragNode(sourceNode, options) {
    return sourceNode.clone();
  },

  // Node placed on the canvas (can add extra attributes)
  getDropNode(draggingNode, options) {
    const node = draggingNode.clone();
    node.setAttrs({
      body: { stroke: '#1890ff', strokeWidth: 2 },
    });
    return node;
  },

  // Validate whether dropping is allowed
  validateNode(droppingNode, options) {
    // Return false to prevent dropping
    return true;
  },
});
```

## Custom Layout

The default layout is a two-column grid. You can customize it:

```javascript
const stencil = new Stencil({
  target: graph,
  groups: [{ name: 'basic', title: 'Basic Nodes' }],
  layoutOptions: {
    columns: 2,        // Number of columns
    columnWidth: 90,   // Column width
    rowHeight: 80,     // Row height
    dx: 10,            // X offset
    dy: 10,            // Y offset
    resizeToFit: false,
  },
});
```

## API Methods

| Method | Description |
|------|------|
| `stencil.load(nodes, groupName?)` | Load an array of nodes into the specified group |
| `stencil.load({ groupA: nodes, groupB: nodes })` | Batch-load nodes into multiple groups by object mapping |
| `stencil.unload(nodes, groupName?)` | Remove nodes from the specified group |
| `stencil.unload({ groupA: nodes })` | Batch-remove nodes by object mapping |
| `stencil.toggleGroup(groupName)` | Toggle a group's expanded/collapsed state |
| `stencil.isGroupCollapsed(groupName)` | Check whether a group is collapsed |
| `stencil.container` | Get the Stencil DOM container element |

## Complete Example: Flowchart Editor Toolbox

```javascript
import { Graph, Stencil, Snapline, History } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  grid: { visible: true, size: 10 },
  connecting: {
    allowBlank: false,
    router: 'orth',
    connector: 'rounded',
  },
});

graph.use(new Snapline({ enabled: true }));
graph.use(new History({ enabled: true }));

const stencil = new Stencil({
  title: 'Flow Nodes',
  target: graph,
  stencilGraphWidth: 180,
  stencilGraphHeight: 400,
  collapsable: true,
  search: true,
  placeholder: 'Search nodes',
  groups: [
    { name: 'basic', title: 'Basic Shapes', collapsed: false },
    { name: 'flow', title: 'Flow Control', collapsed: false },
  ],
  layoutOptions: {
    columns: 2,
    columnWidth: 80,
    rowHeight: 60,
    dx: 10,
    dy: 10,
  },
});

document.getElementById('stencil-container').appendChild(stencil.container);

// Basic shapes
const rect = graph.createNode({
  shape: 'rect',
  width: 60,
  height: 40,
  label: 'Rectangle',
  attrs: { body: { fill: '#fff', stroke: '#8f8f8f', rx: 4, ry: 4 } },
});

const circle = graph.createNode({
  shape: 'circle',
  width: 50,
  height: 50,
  label: 'Circle',
  attrs: { body: { fill: '#fff', stroke: '#8f8f8f' } },
});

const ellipse = graph.createNode({
  shape: 'ellipse',
  width: 60,
  height: 40,
  label: 'Ellipse',
  attrs: { body: { fill: '#fff', stroke: '#8f8f8f' } },
});

stencil.load([rect, circle, ellipse], 'basic');

// Flow control
const decision = graph.createNode({
  shape: 'polygon',
  width: 60,
  height: 40,
  label: 'Decision',
  attrs: {
    body: {
      fill: '#fff',
      stroke: '#8f8f8f',
      refPoints: '0,10 10,0 20,10 10,20',
    },
  },
});

const subProcess = graph.createNode({
  shape: 'rect',
  width: 60,
  height: 40,
  label: 'Subprocess',
  attrs: { body: { fill: '#e6f7ff', stroke: '#1890ff', rx: 4, ry: 4 } },
});

stencil.load([decision, subProcess], 'flow');
```

## Common Mistakes and Fixes

### Incorrectly Using an Object for the `layout` Option

```javascript
// Incorrect: layout should be a function, not an object
const stencil = new Stencil({
  target: graph,
  layout: { columns: 1 }, // Error: t.call is not a function
});

// Correct: use layoutOptions to configure layout parameters
const stencil = new Stencil({
  target: graph,
  layoutOptions: { columns: 1 },
});
```

### Passing Shape Configuration Objects Directly Instead of Node Instances

```javascript
// Incorrect: passing shape configuration objects directly may cause rendering issues
stencil.load([{ shape: 'rect', width: 80, height: 40 }], 'basic');

// Correct: use graph.createNode to create node instances
const node = graph.createNode({ shape: 'rect', width: 80, height: 40 });
stencil.load([node], 'basic');
```

### Forgetting to Mount the Stencil Container to the DOM

```javascript
// Incorrect: the plugin is registered, but the stencil panel is not mounted to the page DOM
const stencil = new Stencil({ target: graph, groups: [...] });
graph.use(stencil);
// Missing DOM mounting, so the panel will not be displayed

// Correct: after registration, mount stencil.container to the DOM
const stencil = new Stencil({ target: graph, groups: [...] });
graph.use(stencil);
document.getElementById('panel').appendChild(stencil.container);
```

### Forgetting to Set `target`

```javascript
// Incorrect: target is missing
const stencil = new Stencil({
  groups: [{ name: 'basic', title: 'Basic' }],
}); // Dragging has no target

// Correct: the target canvas must be specified
const stencil = new Stencil({
  target: graph,
  groups: [{ name: 'basic', title: 'Basic' }],
});
```

### Passing an Array Without Specifying `groupName` When Groups Are Used

```javascript
// Not recommended: when there are multiple groups, omitting groupName loads into the default group
stencil.load([{ shape: 'rect', width: 80, height: 40 }]); // May not be the expected group

// Recommended approach 1: specify groupName
stencil.load([{ shape: 'rect', width: 80, height: 40 }], 'basic');

// Recommended approach 2: use object mapping for batch loading
stencil.load({
  basic: [{ shape: 'rect', width: 80, height: 40 }],
  advanced: [{ shape: 'circle', width: 60, height: 60 }],
});
```

</skill>
