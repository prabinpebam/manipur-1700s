---
name: antv-g6-graph
description: G6 v5 graph visualization code generation skill, supporting initialization, layout, interaction, and plugin configuration for network graphs, tree graphs, flowcharts, and other graph types
---

# G6 v5 Graph Visualization Code Generation Skill

## Core Constraints (Required)

### Initialization Rules
- The `container` parameter is required. Pass a DOM element ID string or a DOM element object.
- Use the `new Graph({...})` constructor. **Do not use** `new G6.Graph()` (v4 syntax).
- Complete all configuration in the constructor at once. Do not repeatedly call configuration methods afterward to override settings.
- `graph.render()` returns a Promise and renders asynchronously. If you need to wait for completion, use `await graph.render()`.

### Data Structure Rules
- Data format: `{ nodes: [...], edges: [...], combos?: [...] }`
- Each node must have a unique `id` (string). Put business data in the `data` field.
- Each edge must have `source` and `target`, whose values are node `id`s.
- **Do not** use the v4 `graph.data()` method to pass data.

### Node/Edge Style Rules
- Configure styles through `node.style` / `edge.style`, supporting static values and callback functions.
- Callback function signature: `(datum: NodeData | EdgeData) => value`
- Set label text with `style.labelText` (**not** `label` or `labelCfg`).
- Set node size with `style.size` (a single numeric value or a [width, height] array).

### Layout Rules
- Put the `layout` configuration in the Graph options: `{ type: 'force', ... }`
- The `force` layout **does not support** `preventOverlap` / `nodeSize` (G6 v4 parameters; v5 silently ignores them). To prevent overlap, use `d3-force` + `collide` instead.
- Tree layouts (mindmap, compact-box, dendrogram, indented) require tree data or conversion with `treeToGraphData()`.
- Force-directed layouts run asynchronously and continue iterating after `graph.render()`.
- **`nodeStrength` must be a non-negative number** (>= 0). Negative values can cause abnormal layout calculation or unpredictable node behavior.

### Interaction Behavior Rules
- `behaviors` is an array of strings or configuration objects.
- Common behavior string shorthands: `'drag-canvas'`, `'zoom-canvas'`, `'drag-element'`, `'click-select'`
- G6 v5 **removed the Mode concept**. Configure all behaviors directly in the array.
- Use object form for complex configuration: `{ type: 'click-select', multiple: true }`

### Plugin Rules
- `plugins` is an array, similar to `behaviors`.
- Shorthands: `'minimap'`, `'grid-line'`, `'tooltip'`
- Complex configuration: `{ type: 'tooltip', getContent: (e, items) => '...' }`

---

## Prohibited Error Patterns

### ❌ Using the v4 API

```javascript
// Incorrect: v4 chainable API
const graph = new G6.Graph({ ... });
graph.data(data);
graph.render();
graph.node((node) => ({ ... }));  // v4 callback

// Correct: v5 constructor
const graph = new Graph({
  container: 'container',
  data: { nodes: [...], edges: [...] },
  node: { style: { ... } },
});
graph.render();
```

### ❌ Incorrect node data structure

```javascript
// Incorrect: business properties placed directly at the top level
{ id: 'node1', label: 'Node 1', value: 100 }

// Correct: business properties placed in the data field
{ id: 'node1', data: { label: 'Node 1', value: 100 } }
```

### ❌ Incorrect label configuration

```javascript
// Incorrect: v4 labelCfg
node: {
  labelCfg: { style: { fill: '#333' } }
}

// Correct: v5 style.labelText
node: {
  style: {
    labelText: (d) => d.data.label,
    labelFill: '#333',
    labelFontSize: 14,
  }
}
```

### ❌ behaviors using the Mode concept

```javascript
// Incorrect: v4 modes
modes: {
  default: ['drag-canvas', 'zoom-canvas'],
  edit: ['create-edge'],
}

// Correct: v5 direct behaviors array
behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
```

### ❌ Reading attributes.data in custom node render() causes a blank screen

```javascript
// Incorrect: attributes is the computed style object and does not contain node data; accessing data.color throws TypeError
render(attributes, container) {
  const { data } = attributes;       // undefined
  const fill = data.color;           // TypeError -> blank screen
}

// Correct: use a node.style callback in the Graph configuration to map the data field to a custom style property
// 1. Graph configuration
node: {
  type: 'my-node',
  style: { color: (d) => d.data.color },
},
// 2. Read directly from attributes in render()
render(attributes, container) {
  const { color = '#1783FF' } = attributes;  // ✅
}
```

### ❌ Using extend to register custom nodes

```javascript
// Incorrect: extend has been removed from the official G6 v5 release; calling it after import reports "extend is not a function"
import { Graph, extend } from '@antv/g6';
const extendedGraph = extend(Graph, {
  nodes: { 'my-node': MyNodeFn },
});

// Incorrect: v4 group.addShape() API
const MyNode = (node) => (model) => {
  const group = node.group();
  group.addShape('circle', { attrs: { r: 20 } });
};

// Correct: BaseNode class + register()
import { BaseNode, Circle, ExtensionCategory, Graph, register } from '@antv/g6';
class MyNode extends BaseNode {
  render(attributes, container) {
    super.render(attributes, container);
    this.upsert('key', Circle, { cx: 0, cy: 0, r: 20, fill: '#1783FF' }, container);
  }
}
register(ExtensionCategory.NODE, 'my-node', MyNode);
const graph = new Graph({ node: { type: 'my-node' } });
```

### ❌ Missing container

```javascript
// Incorrect: container omitted
const graph = new Graph({ });

// Correct: container is required, and its value is a string ID or DOM element
const graph = new Graph({ container: 'container' });
// Or pass a DOM element
const graph = new Graph({ container: document.getElementById('container') });
```

> Common variant error: `container: container` (using a string ID as a variable name; the variable is undefined -> ReferenceError -> blank screen)

### ❌ autoFit: 'view' with an asynchronous force-directed layout causes a blank screen

```javascript
// Incorrect: layouts such as combo-combined / force / d3-force are asynchronous and iterative
// autoFit runs before layout iteration starts; all nodes are piled at the origin and the bounding box is zero -> abnormal zoom -> blank screen
const graph = new Graph({
  autoFit: 'view',          // ❌ Do not set this here with asynchronous layouts
  layout: { type: 'combo-combined' },
});
graph.render();

// Correct: do not set autoFit; call fitView after the AFTER_LAYOUT event
import { Graph, GraphEvent } from '@antv/g6';
const graph = new Graph({
  layout: { type: 'combo-combined' },
});
graph.on(GraphEvent.AFTER_LAYOUT, () => graph.fitView({ padding: 20 }));
graph.render();
```

> Synchronous layouts (`dagre`, `grid`, `circular`, etc.) are not affected by this and can use `autoFit: 'view'` directly.

---

## Basic Structure Template

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  // 1. Container
  container: 'container',       // DOM id or HTMLElement
  autoFit: 'view',              // Optional: 'center' | 'view' | false

  // 2. Data
  data: {
    nodes: [
       { id: 'n1', data: { label: 'Node 1' } },
       { id: 'n2', data: { label: 'Node 2' } },
    ],
    edges: [
       { source: 'n1', target: 'n2' },
    ],
  },

  // 3. Node style
  node: {
    type: 'circle',             // Node type
    style: {
      size: 40,
      fill: '#1783FF',
      stroke: '#fff',
      lineWidth: 2,
      labelText: (d) => d.data.label,
      labelPlacement: 'bottom',
    },
  },

  // 4. Edge style
  edge: {
    type: 'line',
    style: {
      stroke: '#aaa',
      lineWidth: 1,
      endArrow: true,
    },
  },

  // 5. Layout
  layout: {
    type: 'force',
    preventOverlap: true,
    nodeSize: 40,
  },

  // 6. Interactions
  behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],

  // 7. Plugins (optional)
  plugins: ['grid-line'],

  // 8. Theme (optional)
  theme: 'light',               // 'light' | 'dark'
});

graph.render();
```

---

## Graph Type Selection Guide

| Graph type | Recommended layout | Typical scenarios |
|--------|----------|----------|
| Network graph / relationship graph | `force` / `fruchterman` | Social networks, knowledge graphs |
| Hierarchy / flowchart | `dagre` / `antv-dagre` | Organizational structures, workflows |
| Tree graph | `compact-box` / `mindmap` | File trees, mind maps |
| Circular graph | `circular` | Cyclic dependencies, circular relationships |
| Grid graph | `grid` | Chessboard layouts, matrix relationships |
| Concentric circles | `concentric` | Center-radiating relationships |
| Radial layout | `radial` | Radial layout centered on a specific node |

---

## Built-in Node Types

| Type name | Shape | Applicable scenarios |
|--------|------|----------|
| `circle` | Circle | General-purpose nodes, network graphs |
| `rect` | Rectangle | Flowcharts, UML |
| `ellipse` | Ellipse | General-purpose, emphasizes vertical direction |
| `diamond` | Diamond | Decision nodes |
| `hexagon` | Hexagon | Honeycomb layouts |
| `triangle` | Triangle | Special markers |
| `star` | Five-pointed star | Special markers, ratings |
| `donut` | Donut | Nodes with progress |
| `image` | Image | Avatars, icon nodes |
| `html` | HTML | Custom rich-text nodes |

---

## Built-in Edge Types

| Type name | Shape | Applicable scenarios |
|--------|------|----------|
| `line` | Straight line | Simple graphs, topology graphs |
| `cubic` | Cubic Bezier curve | General-purpose, curved effect |
| `cubic-horizontal` | Horizontal cubic curve | Horizontal flowcharts |
| `cubic-vertical` | Vertical cubic curve | Vertical flowcharts |
| `quadratic` | Quadratic Bezier curve | Lightweight curved edges |
| `polyline` | Polyline | Orthogonal layouts |
| `loop` | Self-loop | Loop from a node to itself |

---

## Built-in Layout Algorithms

| Layout name | Type | Features |
|--------|------|------|
| `force` | Force-directed | Physics simulation, natural distribution |
| `d3-force` | Force-directed | Based on D3, configurable force types |
| `fruchterman` | Force-directed | Fast, supports GPU acceleration |
| `force-atlas2` | Force-directed | Large-scale graphs, good clustering effect |
| `dagre` | Hierarchical | DAG, automatic layering |
| `antv-dagre` | Hierarchical | AntV-optimized Dagre |
| `circular` | Circular | Nodes arranged in a circle |
| `concentric` | Concentric circles | Ring partitioning by attribute value |
| `grid` | Grid | Regular grid arrangement |
| `radial` | Radial | Radiates from a specific node as the center |
| `mds` | Dimensionality reduction | Preserves relative distances between nodes |
| `random` | Random | For debugging |
| `compact-box` | Tree | Compact tree, saves space |
| `mindmap` | Tree | Mind-map style |
| `dendrogram` | Tree | Dendrogram |
| `indented` | Tree | Indented tree |

---

## Built-in Interaction Behaviors

| Behavior name | Description |
|--------|------|
| `drag-canvas` | Drag the canvas |
| `zoom-canvas` | Zoom the canvas with the mouse wheel |
| `scroll-canvas` | Pan the canvas with the mouse wheel |
| `drag-element` | Drag nodes/edges/combos |
| `drag-element-force` | Drag nodes in a force-directed graph |
| `click-select` | Select elements by clicking |
| `brush-select` | Select elements with a brush box |
| `lasso-select` | Lasso selection |
| `hover-activate` | Activate elements on hover |
| `collapse-expand` | Collapse/expand nodes (tree graph) |
| `create-edge` | Create edges interactively |
| `focus-element` | Focus an element (zoom to the specified element) |
| `fix-element-size` | Keep element size unchanged during zoom |
| `auto-adapt-label` | Automatically show/hide labels (prevent overlap) |
| `optimize-viewport-transform` | Viewport optimization for large-scale graphs |

---

## Built-in Plugins

| Plugin name | Description |
|--------|------|
| `grid-line` | Grid background lines |
| `background` | Background color/image |
| `watermark` | Watermark |
| `minimap` | Minimap navigation |
| `legend` | Legend |
| `tooltip` | Element tooltip |
| `toolbar` | Toolbar (zoom, undo, etc.) |
| `contextmenu` | Context menu |
| `history` | Undo/redo |
| `timebar` | Timeline filtering |
| `fisheye` | Fisheye magnification effect |
| `edge-bundling` | Edge bundling |
| `edge-filter-lens` | Edge filter lens |
| `hull` | Element contour hull |
| `bubble-sets` | Bubble sets |
| `snapline` | Alignment guide lines |
| `fullscreen` | Fullscreen |

---

## Element States

G6 v5 has 5 built-in states: `selected`, `active`, `highlight`, `inactive`, `disabled`

```javascript
// Set styles for states in the Graph configuration
node: {
  style: {
    fill: '#1783FF',
  },
  state: {
    selected: {
      fill: '#ff6b6b',
      stroke: '#ff4d4d',
      lineWidth: 3,
    },
    hover: {
      fill: '#40a9ff',
    },
  },
},

// Dynamically set states
graph.setElementState('node1', 'selected');
graph.setElementState('node1', ['selected', 'highlight']);
graph.setElementState('node1', []);  // Clear all states
```

---

## Theme System

```javascript
// Built-in themes
const graph = new Graph({
  theme: 'light',   // Default
  // theme: 'dark',
});

// Dynamically switch themes
graph.setTheme('dark');
graph.render();
```

---

## Data Operation API

```javascript
// Add elements
graph.addNodeData([{ id: 'n3', data: { label: 'New Node' } }]);
graph.addEdgeData([{ source: 'n1', target: 'n3' }]);

// Update elements
graph.updateNodeData([{ id: 'n1', style: { fill: 'red' } }]);

// Remove elements
graph.removeNodeData(['n3']);

// Re-rendering is required after updating data
graph.draw();
```

---

## Common Usage Patterns

### Data-driven Styles (Recommended)

```javascript
node: {
  style: {
    size: (d) => d.data.size || 30,
    fill: (d) => {
      const colorMap = { type1: '#1783FF', type2: '#FF6B6B', type3: '#52C41A' };
      return colorMap[d.data.type] || '#ccc';
    },
    labelText: (d) => d.data.name,
  },
},
```

### Palette Mapping

```javascript
node: {
  palette: {
    type: 'group',       // Map colors by category
    field: 'category',   // Category field in the data
    color: 'tableau10',  // Built-in palette name
  },
},
```

### Map Continuous Values to Node Size

```javascript
transforms: [
  {
    type: 'map-node-size',
    field: 'value',
    range: [16, 60],
  },
],
```

### Parallel Edge Handling

```javascript
transforms: [
  {
    type: 'process-parallel-edges',
    offset: 15,
  },
],
edge: {
  type: 'quadratic',
},
```

---

## Data Operation API Quick Reference

```javascript
// Create
graph.addNodeData([{ id: 'n3', data: { label: 'New Node' } }]);
graph.addEdgeData([{ source: 'n1', target: 'n3' }]);
graph.draw();

// Delete
graph.removeNodeData(['n3']);   // Associated edges are automatically deleted
graph.draw();

// Update
graph.updateNodeData([{ id: 'n1', data: { label: 'Updated' } }]);
graph.draw();

// Query
const node = graph.getNodeData('n1');
const selected = graph.getElementDataByState('node', 'selected');
const zoom = graph.getZoom();

// Viewport
await graph.fitView({ padding: 20 });
await graph.focusElement('n1', { duration: 500 });
await graph.zoomTo(1.5);

// State
graph.setElementState('n1', 'selected');
graph.setElementState('n1', []);          // Clear

// Destroy
graph.destroy();
```

---

## Event Listening Quick Reference

```javascript
// Element events (node/edge/combo + event type)
graph.on('node:click', (e) => console.log(e.target.id));
graph.on('edge:pointerover', (e) => graph.setElementState(e.target.id, 'active'));
graph.on('canvas:click', () => { /* Click blank area */ });

// Lifecycle events
import { GraphEvent } from '@antv/g6';
graph.on(GraphEvent.AFTER_RENDER, () => console.log('Render complete'));
graph.on(GraphEvent.AFTER_LAYOUT, () => console.log('Layout complete'));
```

---

## Reference Documentation Index

### Core
- [`g6-core-graph-init`](references/core/g6-core-graph-init.md): Complete Graph initialization configuration
- [`g6-core-data-structure`](references/core/g6-core-data-structure.md): Data structure rules
- [`g6-core-graph-api`](references/core/g6-core-graph-api.md): Graph instance API (create, delete, update, query; viewport; state)
- [`g6-core-events`](references/core/g6-core-events.md): Event system (element events, canvas events, lifecycle)
- [`g6-core-custom-element`](references/core/g6-core-custom-element.md): Custom nodes/edges (register + BaseNode/BaseEdge)
- [`g6-core-transforms-animation`](references/core/g6-core-transforms-animation.md): Data transforms (map-node-size) and animation configuration

### Node Types
- [`g6-node-circle`](references/elements/nodes/g6-node-circle.md): Circle (general-purpose)
- [`g6-node-rect`](references/elements/nodes/g6-node-rect.md): Rectangle (flowchart)
- [`g6-node-image`](references/elements/nodes/g6-node-image.md): Image nodes
- [`g6-node-diamond-ellipse-hexagon`](references/elements/nodes/g6-node-diamond-ellipse-hexagon.md): Diamond/ellipse/hexagon
- [`g6-node-star-triangle-donut`](references/elements/nodes/g6-node-star-triangle-donut.md): Five-pointed star/triangle/donut progress
- [`g6-node-html`](references/elements/nodes/g6-node-html.md): HTML rich-text nodes
- [`g6-node-react`](references/elements/nodes/g6-node-react.md): React/Vue custom nodes (@antv/g6-extension-react)

### Combo
- [`g6-combo-overview`](references/elements/combos/g6-combo-overview.md): Combo grouping (circle/rect, collapse and expand)

### Edge Types
- [`g6-edge-line`](references/elements/edges/g6-edge-line.md): Straight-line edges
- [`g6-edge-cubic`](references/elements/edges/g6-edge-cubic.md): Cubic Bezier curve edges
- [`g6-edge-cubic-directional`](references/elements/edges/g6-edge-cubic-directional.md): Directed cubic curves (cubic-horizontal horizontal / cubic-vertical vertical)
- [`g6-edge-polyline`](references/elements/edges/g6-edge-polyline.md): Polyline edges
- [`g6-edge-quadratic-loop`](references/elements/edges/g6-edge-quadratic-loop.md): Quadratic curves and self-loop edges

### Layouts
- [`g6-layout-force`](references/layouts/g6-layout-force.md): Force-directed (force/d3-force)
- [`g6-layout-dagre`](references/layouts/g6-layout-dagre.md): Hierarchy/flowcharts (dagre)
- [`g6-layout-circular`](references/layouts/g6-layout-circular.md): Circular
- [`g6-layout-grid`](references/layouts/g6-layout-grid.md): Grid
- [`g6-layout-mindmap`](references/layouts/g6-layout-mindmap.md): Mind map
- [`g6-layout-advanced`](references/layouts/g6-layout-advanced.md): Concentric circles/radial/mds/fruchterman
- [`g6-layout-combo-fishbone`](references/layouts/g6-layout-combo-fishbone.md): Compound layout (combo-combined) + fishbone layout (fishbone)

### Data Transforms
- [`g6-core-transforms-animation`](references/core/g6-core-transforms-animation.md): map-node-size and animation configuration
- [`g6-transform-parallel-edges-radial`](references/transforms/g6-transform-parallel-edges-radial.md): Parallel edge handling (process-parallel-edges) + radial labels (place-radial-labels)

### Interaction Behaviors
- [`g6-behavior-click-select`](references/behaviors/g6-behavior-click-select.md): Click to select
- [`g6-behavior-drag-element`](references/behaviors/g6-behavior-drag-element.md): Drag nodes
- [`g6-behavior-canvas-nav`](references/behaviors/g6-behavior-canvas-nav.md): Canvas dragging + zooming
- [`g6-behavior-hover-activate`](references/behaviors/g6-behavior-hover-activate.md): Hover activation
- [`g6-behavior-lasso-collapse`](references/behaviors/g6-behavior-lasso-collapse.md): Lasso selection + collapse and expand
- [`g6-behavior-create-edge-focus`](references/behaviors/g6-behavior-create-edge-focus.md): Create edges + focus elements
- [`g6-behavior-advanced`](references/behaviors/g6-behavior-advanced.md): fix-element-size / auto-adapt-label / drag-element-force

### Plugins
- [`g6-plugin-tooltip`](references/plugins/g6-plugin-tooltip.md): Hover tooltip
- [`g6-plugin-minimap`](references/plugins/g6-plugin-minimap.md): Minimap
- [`g6-plugin-contextmenu-toolbar`](references/plugins/g6-plugin-contextmenu-toolbar.md): Context menu + toolbar
- [`g6-plugin-history-legend`](references/plugins/g6-plugin-history-legend.md): Undo/redo + legend
- [`g6-plugin-fisheye-hull-watermark`](references/plugins/g6-plugin-fisheye-hull-watermark.md): Fisheye magnification + contour hull + watermark
- [`g6-plugin-timebar-gridline`](references/plugins/g6-plugin-timebar-gridline.md): Timeline + grid lines
- [`g6-plugin-background-snapline`](references/plugins/g6-plugin-background-snapline.md): Canvas background (background) + alignment lines (snapline)
- [`g6-plugin-edge-bundling-bubble`](references/plugins/g6-plugin-edge-bundling-bubble.md): Edge bundling (edge-bundling) + bubble sets (bubble-sets)
- [`g6-plugin-fullscreen-title`](references/plugins/g6-plugin-fullscreen-title.md): Fullscreen (fullscreen) + graph title (title)

### States and Themes
- [`g6-state-overview`](references/states/g6-state-overview.md): Element state system
- [`g6-theme-overview`](references/themes/g6-theme-overview.md): Theme system

### Scenario Templates
- [`g6-pattern-network-graph`](references/patterns/g6-pattern-network-graph.md): Network relationship graph
- [`g6-pattern-tree-graph`](references/patterns/g6-pattern-tree-graph.md): Tree graph/organizational structure
- [`g6-pattern-flow-chart`](references/patterns/g6-pattern-flow-chart.md): Flowchart