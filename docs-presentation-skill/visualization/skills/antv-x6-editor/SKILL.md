---
name: antv-x6-editor
description: X6 graph editing engine code generation skill for node, edge, port, interaction, and plugin configuration in flowcharts, DAGs, ER diagrams, lineage diagrams, and other graph editing scenarios
version: 3.x
---

# X6 Graph Editing Engine Code Generation Skill

## Core Constraints (Must Follow)

<!-- CONSTRAINTS:START -->

### X6 3.x Key Constraints (Mandatory)

- **`graph.render()` does not exist**: In X6 3.x, `new Graph()` / `addNode` / `addEdge` / `fromJSON` all render automatically. Code must not contain `graph.render()`.
- **Do not declare a `container` variable**: The runtime injects `container` as a function parameter. Graph initialization must use only the string literal `container: 'container'`. Do not use `const/let/var container = ...`, and do not use `document.getElementById('container')`.
- **Register the corresponding plugin with `graph.use(new Plugin(...))` before using plugin methods**: `graph.toPNG / toSVG / toJPEG` require `Export`; `graph.select / unselect` require `Selection`; `graph.undo / redo` require `History`; `graph.copy / paste / cut` require `Clipboard`; `graph.bindKey` requires `Keyboard`. The corresponding methods do not exist if the plugin is not registered.
- **Custom shapes must be registered before use**: `Graph.registerNode(name, def)` / `Graph.registerEdge(name, def)` / `Shape.HTML.register({ shape, ... })` must be completed before the first `addNode / addEdge` call.
- **`@antv/x6` exports only 11 plugin classes**: `Clipboard`, `Dnd`, `Export`, `History`, `Keyboard`, `MiniMap`, `Scroller`, `Selection`, `Snapline`, `Stencil`, and `Transform`. `mousewheel`, `embedding`, `panning`, `connecting`, `translating`, `interacting`, `background`, and `grid` are **constructor options** for `new Graph()`, not plugins. **Do not** import classes with these names, and do not call `graph.use(new XxxClass())`. Example: configure wheel zoom in the Graph constructor with `mousewheel: { enabled: true, zoomAtMousePosition: true, modifiers: ['ctrl'] }`.
- **Node/edge animation uses `cell.animate(keyframes, options)` (Web Animations API style)**: X6 3.x **does not have a `node.transition(path, target, options)` method**. In the source code, `transition` exists only as an **options field** for `node.translate(tx, ty, { transition })` / `node.rotate(deg, { transition })` (`boolean | KeyframeEffectOptions`), not as an independent method. Example:
  ```javascript
  // General animation
  node.animate(
    { fill: ['#fff', '#1890ff'], transform: ['scale(1)', 'scale(1.2)'] },
    { duration: 500, iterations: 1, fill: 'forwards' },
  );
  // Translation transition only
  node.translate(120, 0, { transition: { duration: 500, easing: 'ease-in-out' } });
  ```
  Multi-step property changes can be wrapped with `graph.startBatch('animate'); cell.attr(...); graph.stopBatch('animate');`.

### Initialization Rules
- The `container` parameter is required. **Use the string form** `container: 'container'`; the runtime environment automatically resolves it to the DOM element.
- **A background color is required**: `background: { color: '#F2F7FA' }`. All canvases must use the unified light blue-gray background.
- **Do not add a `grid` configuration** unless the user explicitly requests a visible grid.
- **Do not set `width` / `height`** unless the user explicitly specifies canvas dimensions; by default, the canvas adapts to the container size.
- Import style: `import { Graph } from '@antv/x6'`; **import only the classes that are actually used**.
- **Do not import `Shape` unconditionally**: import `Shape` only when using static Shape methods such as `Shape.HTML.register()`.
- Import plugins directly from `'@antv/x6'`, for example `import { Graph, Selection, History } from '@antv/x6'`.
- **Do not** import standalone `@antv/x6-plugin-xxx` packages (deprecated).
- Standard initialization template:
  ```javascript
  import { Graph } from '@antv/x6';
  const graph = new Graph({
    container: 'container',
    background: { color: '#F2F7FA' },
  });
  ```

### Node Operation Rules
- **Prefer `graph.addNode()`** to add nodes one by one rather than batch importing with `graph.fromJSON()` (unless the user explicitly requests batch data loading).
- Built-in shapes: `'rect'`, `'circle'`, `'ellipse'`, `'polygon'`, `'polyline'`, `'path'`, `'text'`, `'text-block'`, `'image'`, `'html'`.
- Configure node styling through `attrs`, following SVG attribute naming.
- Set node positions with `x` and `y` (top-left coordinates), and set dimensions with `width` and `height`.
- **Default node style** (unless the user specifies another style, all nodes should use this unified default style):
  ```javascript
  attrs: {
    body: { stroke: '#8f8f8f', strokeWidth: 1, fill: '#fff', rx: 6, ry: 6 },
  }
  ```
- **Do not** use CSS property names in `attrs` (such as `background-color`); use SVG attributes instead (such as `fill`).

### Edge Operation Rules
- Use `graph.addEdge({ source, target, ... })` to add edges.
- `source`/`target` can be a node instance, a node ID string, an object such as `{ cell: node, port: 'portId' }`, or coordinates such as `{ x, y }`.
- Edge style: `attrs: { line: { stroke, strokeWidth, strokeDasharray, targetMarker, sourceMarker } }`.
- **Default edge style** (unless the user specifies another style): `attrs: { line: { stroke: '#8f8f8f', strokeWidth: 1 } }`.
- Arrowheads: `targetMarker: 'classic'` (classic arrow), `'block'`, `'circle'`, `'diamond'`.
- Routers: `router: 'orth'` (orthogonal), `'manhattan'`, `'metro'`, `'er'`.
- Connectors: `connector: 'rounded'` (rounded corners), `'smooth'` (Bezier curve), `'jumpover'`.

### Port Rules
- Define ports in the node configuration's `ports` field.
- Port groups: `ports: { groups: { groupName: { position, attrs, ... } }, items: [{ id, group }] }`.
- Valid `position` values: `'top'`, `'bottom'`, `'left'`, `'right'`.
- Ports are anchors for edges. Set `attrs: { circle: { magnet: true } }` to allow edges to be dragged out from a port.
- **`magnet: true` is required** for a port to start or receive connections.

### Interaction Configuration Rules
- Configure edge-creation interactions in the Graph configuration through the `connecting` field.
- `connecting: { allowBlank: false, router: 'orth', connector: 'rounded', createEdge() {...} }`.
- Node movement restrictions: `translating: { restrict: true }`, or pass a function to restrict the allowed area.
- Embedding: `embedding: { enabled: true }` allows nodes to be dragged into groups.

### Plugin Usage Rules
- Import plugins from `@antv/x6` and register them with `graph.use(new Plugin(options))`.
- Available plugins: `Selection`, `Snapline`, `History`, `Clipboard`, `Keyboard`, `Scroller`, `MiniMap`, `Transform`, `Export`, `Stencil`, `Dnd`.
- Selection: `graph.use(new Selection({ enabled: true, rubberband: true }))`.
- Snapline: `graph.use(new Snapline({ enabled: true }))`.
- History: `graph.use(new History({ enabled: true }))`.
- Clipboard: `graph.use(new Clipboard({ enabled: true }))`.
- Keyboard: `graph.use(new Keyboard({ enabled: true }))`.
- Scroller: `graph.use(new Scroller({ enabled: true }))`.
- MiniMap: `graph.use(new MiniMap({ enabled: true, container: minimapContainer }))`.
- Transform: `graph.use(new Transform({ resizing: { enabled: true }, rotating: { enabled: true } }))`.
- Export: `graph.use(new Export())` (after registration, `graph.toPNG()` / `graph.toSVG()` can be called).
- Dynamic control: `graph.enablePlugins('selection')` / `graph.disablePlugins('selection')`.
- **Do not** pass options such as `selecting` or `snapline` directly into the Graph constructor (unsupported in 3.x).

### Serialization Rules
- Export: `const data = graph.toJSON()` returns an object `{ cells: [...] }`.
- Import: `graph.fromJSON(data)` loads the entire graph data.
- Clear: `graph.clearCells()` removes all elements.
- **Do not** manually construct internal fields in the `cells` array (such as `zIndex` or `parent`); operate through the API instead.

### Event Rules
- Node event: `graph.on('node:click', ({ node, e }) => {...})`.
- Edge event: `graph.on('edge:click', ({ edge, e }) => {...})`.
- Canvas event: `graph.on('blank:click', ({ e }) => {...})`.
- Change event: `graph.on('node:moved', ({ node }) => {...})`.
- **Event callback parameters are objects**, not positional parameters: use `({ node, e })`, not `(node, e)`.

### Import Rules
- **Every class used must appear in the import statement**: for example, when using `Selection`, use `import { Graph, Selection } from '@antv/x6'`.
- **Do not** use namespace syntax such as `Graph.Selection` or `Graph.Keyboard` (it does not exist).
- **Do not** use classes that have not been imported: `new Selection(...)` must correspond to `import { Selection } from '@antv/x6'`.
- **Import self-check checklist (mandatory; verify line by line before outputting code)**: For **every** `new XxxYyy(...)` call in the code, `XxxYyy` must appear **literally** inside the braces of the first-line `import { ..., XxxYyy } from '@antv/x6'`. Common omissions: `Selection`, `Keyboard`, `History`, `Clipboard`, `Snapline`, `MiniMap`, `Transform`, `Scroller`, `Export`, `Stencil`, `Dnd`, and `Shape` (when using `Shape.HTML.register`).
- **Why missing imports become runtime errors such as `Illegal constructor`**: The evaluation/Playground environment executes code with the **UMD build** (`window.X6`), not a real ES Module. `Selection`, `Keyboard`, and similar classes are **destructured from `window.X6` according to the import list**. If an import is missing, the identifier `Selection` **falls back to `window.Selection`** (the browser's native Selection interface), and `new Selection({...})` throws `Failed to construct 'Selection': Illegal constructor`. `Keyboard` / `History` and similar classes behave the same way (they become `is not a constructor`).
- **Standard fix for missing imports**: Merge all plugin classes used into the same line, such as `import { Graph, Selection, Keyboard, History, ... } from '@antv/x6';`. Do not split imports across multiple lines, and do not omit any class.

### Node Tools Rules
- Add tools: `node.addTools([{ name: 'button-remove', args: { x: 0, y: 0 } }])` or `graph.addTools(node, [...])`.
- Remove tools: `node.removeTools()` or `graph.removeTools(node)`.
- Check tools: `node.hasTools()`.
- **Do not** use `node.hideTools()` / `node.showTools()` (these APIs do not exist in 3.x).
- Correct way to show/hide tools on hover:
  ```javascript
  graph.on('node:mouseenter', ({ node }) => {
    node.addTools([{ name: 'button-remove', args: { x: 0, y: 0 } }]);
  });
  graph.on('node:mouseleave', ({ node }) => {
    node.removeTools();
  });
  ```

### Gradient Rules
- In X6 `attrs`, `fill` supports gradient object syntax. **Do not** directly manipulate `graph.defs` or use `document.createElementNS` to create SVG gradients.
- Correct linear gradient syntax:
  ```javascript
  attrs: {
    body: {
      fill: {
        type: 'linearGradient',
        stops: [
          { offset: '0%', color: '#0000ff' },
          { offset: '100%', color: '#00ff00' },
        ],
      },
    },
  }
  ```

### Code Output Rules
- **Output plain JavaScript only**. Do not use TypeScript syntax (such as `private`, type annotations like `: string`, or `as` type assertions).
- Register custom HTML nodes with `Shape.HTML.register({ shape, html, effect })`. **Do not** use the `class extends Node` approach.
- **Do not** use `Graph.registerHTMLComponent(name, factory)` -- this is an old X6 2.x API, and the method no longer exists in the 3.x source code. Register all HTML nodes through `Shape.HTML.register` (see `references/core/x6-core-html-shape.md`).
- The `effect` array specifies which attribute changes trigger re-rendering (such as `['data']`); **do not add `effect` for purely static display nodes**.
- Correct HTML node syntax:
  ```javascript
  import { Graph, Shape } from '@antv/x6';
  Shape.HTML.register({
    shape: 'my-html',
    effect: ['data'],
    html(node) {
      const div = document.createElement('div');
      div.style.width = '100%';
      div.style.height = '100%';
      div.innerHTML = node.getData().content || '';
      return div;
    },
  });
  const graph = new Graph({ container: 'container' });
  graph.addNode({ shape: 'my-html', x: 100, y: 100, width: 200, height: 80, data: { content: '<div>Hello</div>' } });
  ```

### Stencil Plugin Rules
- Register Stencil with `graph.use(new Stencil({ target: graph, groups: [...] }))`.
- After registration, retrieve the instance with `graph.getPlugin('stencil')` and mount `stencil.container` to the DOM.
- Create node templates inside Stencil with `graph.createNode(...)` (not `graph.addNode`), then load them with `stencil.load(nodes, groupName)`.

### Dynamic Port Rules
- When using `node.addPort()` to add ports dynamically, **the corresponding `ports.groups` must be predefined during node initialization**.
- If no group is predefined, ports cannot be positioned correctly and may cause rendering exceptions.
- Correct syntax:
  ```javascript
  const node = graph.addNode({
    ...,
    ports: {
      groups: {
        in: { position: 'left', attrs: { circle: { r: 4, magnet: true, stroke: '#8f8f8f', fill: '#fff' } } },
        out: { position: 'right', attrs: { circle: { r: 4, magnet: true, stroke: '#8f8f8f', fill: '#fff' } } },
      },
    },
  });
  node.addPort({ id: 'port1', group: 'out' });
  ```
- **`registerNode` + `addNode` ports merge pitfall (hard constraint)**: After `Graph.registerNode(name, { ports: { items: [{ id: 'in1', group: 'in' }] } })`, if you then call `graph.addNode({ shape: name, ports: { items: [{ id: 'in1', group: 'in' }] } })`, X6 internally merges `ObjectExt.merge(defaults, metadata)` by array index during `Cell` construction, and `node.addPorts` also simply concatenates with `[...current, ...new]`. It **does not deduplicate**, and runtime immediately throws `Error: Duplicitied port id.`. Choose one correct approach:
  - Declare only `ports.groups` in `registerNode`, and provide `ports.items` through `addNode` / later `node.addPort` calls.
  - Or declare the complete `ports.items` in `registerNode`, and **do not pass `ports.items` again** in `addNode` (if you need to append ports, call `node.addPort({ id: 'new-id', group: 'xxx' })`, and the new ID must not duplicate any ID declared in the registry).

### DOM/CSS Operation Rules (HTML Nodes / Stencil / Custom Tools)
- When setting styles on DOM elements inside the HTML node `html(node)` callback, **do not** directly write hyphenated properties: `el.style.box-sizing = '...'` and `el.style.font-size = '...'` are parsed by JS as `el.style.box - sizing = ...` and throw `Invalid left-hand side in assignment`. Use one of these correct approaches:
  - Camel case: `el.style.boxSizing = 'border-box'`, `el.style.fontSize = '14px'`, `el.style.backgroundColor = '#fff'`.
  - Bracket notation: `el.style['box-sizing'] = 'border-box'`, `el.style['font-size'] = '14px'`.
  - For multiple styles, prefer `el.style.cssText = 'box-sizing:border-box;font-size:14px;'` or `Object.assign(el.style, { boxSizing: 'border-box', fontSize: '14px' })`.
- Similarly, `el.classList.add('...')` / `el.setAttribute('data-x', '...')` are valid APIs; **do not** use `el.class = '...'` / `el['class-name'] = ...`.

### Nonexistent APIs (Do Not Use)
- **Do not** use `graph.scrollToCell()` -> Correct approach: `graph.centerCell(cell)` scrolls to and centers the specified cell.
- **Do not** use `graph.highlightCell()` / `graph.highlightNode()` -> Correct approach: use `node.attr('body/stroke', '#f00')` or add a CSS class to implement highlighting.
- **Do not** use nonexistent built-in shapes such as `Shape.Cylinder` / `Shape.Diamond` -> Use `'rect'` + `rx/ry`, or customize with `'polygon'`.
- **Do not** use `Shape.Edge.define()` / `Shape.Node.define()` -> Correct approach: `Graph.registerEdge()` / `Graph.registerNode()`.
- **Do not** use `Shape.Group` / `Shape.Group.define()` / `new Shape.Group()` -> The X6 3.x `Shape` namespace **does not** export `Group` (it actually has only `Circle / Edge / Ellipse / HTML / Image / Path / Polygon / Polyline / Rect / TextBlock`; runtime throws `Cannot read properties of undefined (reading 'define')`). Correct parent-child grouping: create a regular node as the parent directly with `graph.addNode({ shape: 'rect', ... })`, then establish the relationship with `parent.addChild(child)` / `parent.embed(child)`; or register a custom group shape with `Graph.registerNode('my-group', { inherit: 'rect', markup: [...], attrs: {...} })` and then call `addNode({ shape: 'my-group' })`.
- **Do not** import / instantiate / use `Embedding` as a plugin with `graph.use(new Embedding(...))` -> X6 3.x **does not have** an `Embedding` plugin class (runtime throws `Embedding is not a constructor`). Node embedding is a **Graph constructor option**: `new Graph({ container, embedding: { enabled: true, findParent: 'bbox', frontOnly: false, validate: ({ child, parent }) => true } })`. Configure hover highlighting through `highlighting.embedding`; embedding/unembedding events are `node:embedding` / `node:embedded`.
- **Do not** use `history.batch()` -> Correct approach: `graph.startBatch('custom'); ...; graph.stopBatch('custom');` or `graph.batchUpdate(() => { ... })`.
- **Do not** use `graph.defs` / `graph.svgDoc` / `document.createElementNS('...', 'linearGradient' | 'defs' | 'marker')` -> X6 3.x does not expose `graph.defs` / `graph.svgDoc`, and runtime throws `Cannot read properties of undefined`. Correct approaches:
  - Standard `fill` gradients on nodes/edges: use gradient object syntax directly in `attrs` (`fill: { type: 'linearGradient', stops: [...] }`).
  - Custom markers that need gradient fill: first call `const id = graph.defineGradient({ type: 'linearGradient', stops: [{ offset: 0, color: '#f00' }, { offset: 1, color: '#0f0' }] })`, then set `fill` to `url(#${id})` in the marker object.
  - Use `graph.defineMarker(options)` / `graph.defineFilter(options)` similarly for custom markers / filters.

### Rendering Output Rules (Must Follow)
- **After canvas initialization, there must be at least one `graph.addNode` / `graph.addEdge` / `graph.fromJSON` call** to ensure the canvas has visible content. Even if the user query describes only interaction configuration (panning / mousewheel / plugins, etc.), add 2-3 sample nodes and 1 edge as rendering carriers; otherwise visual validation will classify the result as a blank screen.
- **After all nodes/edges have been added, call `graph.centerContent()` at the end** (or use `graph.zoomToFit({ padding: 20, maxScale: 1 })` when the canvas should scale with the content). X6 does not center automatically by default. Missing this call causes content to drift toward the top-left and fail visual scoring. Choose exactly one of the two; do not call both.
- When multiple interactions (`panning` + `mousewheel` + `Selection` rubberband) are enabled at the same time, **use `modifiers` to separate trigger conditions** (for example, use `'shift'` for panning, `'ctrl'` for mousewheel, and no modifier for rubberband). **Do not** put `'mouseWheel'` into `panning.eventTypes` while also enabling `mousewheel`, because they will compete for wheel events.

<!-- CONSTRAINTS:END -->

---

## Forbidden Error Patterns

### ❌ Using Deprecated Standalone Plugin Packages

```javascript
// Incorrect: standalone plugin packages are deprecated
import { Selection } from '@antv/x6-plugin-selection';
import { History } from '@antv/x6-plugin-history';

// Correct: import directly from @antv/x6
import { Graph, Selection, History } from '@antv/x6';
const graph = new Graph({ container: 'container' });
graph.use(new Selection({ enabled: true, rubberband: true }));
graph.use(new History({ enabled: true }));
```

### ❌ Passing Plugin Options into the Constructor

```javascript
// Incorrect: 3.x does not support the constructor-options pattern
const graph = new Graph({
  container: 'container',
  selecting: { enabled: true },  // ❌
  snapline: { enabled: true },   // ❌
  history: { enabled: true },    // ❌
});

// Correct: register plugins with graph.use()
import { Graph, Selection, Snapline, History } from '@antv/x6';
const graph = new Graph({ container: 'container' });
graph.use(new Selection({ enabled: true }));
graph.use(new Snapline({ enabled: true }));
graph.use(new History({ enabled: true }));
```

### ❌ Confusing CSS Properties with SVG Attributes

```javascript
// Incorrect: uses CSS property names
attrs: {
  body: {
    'background-color': '#fff',  // ❌
    'border-radius': '6px',      // ❌
  }
}

// Correct: uses SVG attribute names
attrs: {
  body: {
    fill: '#fff',               // ✅ background color
    rx: 6,                      // ✅ corner radius
    ry: 6,
    stroke: '#8f8f8f',          // ✅ border color
    strokeWidth: 1,             // ✅ border width
  }
}
```

### ❌ Missing `container`

```javascript
// Incorrect: container is omitted
const graph = new Graph({});

// Correct: container is required
const graph = new Graph({ container: 'container' });
```

### ❌ Port Without `magnet`

```javascript
// Incorrect: the port cannot create connections
ports: {
  items: [{ id: 'port1', group: 'out' }],
  groups: {
    out: { position: 'right', attrs: { circle: { r: 5 } } }
  }
}

// Correct: set magnet: true
ports: {
  items: [{ id: 'port1', group: 'out' }],
  groups: {
    out: { position: 'right', attrs: { circle: { r: 5, magnet: true, stroke: '#8f8f8f' } } }
  }
}
```

### ❌ Event Callback Uses Positional Parameters

```javascript
// Incorrect: parameters are not passed positionally
graph.on('node:click', (node, e) => { ... });

// Correct: destructure the object parameter
graph.on('node:click', ({ node, e }) => { ... });
```

---

## Basic Structure Template

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  background: { color: '#F2F7FA' },
});

const source = graph.addNode({
  shape: 'rect',
  x: 40,
  y: 40,
  width: 100,
  height: 40,
  label: 'Source',
  attrs: {
    body: { stroke: '#8f8f8f', strokeWidth: 1, fill: '#fff', rx: 6, ry: 6 },
  },
});

const target = graph.addNode({
  shape: 'rect',
  x: 300,
  y: 200,
  width: 100,
  height: 40,
  label: 'Target',
  attrs: {
    body: { stroke: '#8f8f8f', strokeWidth: 1, fill: '#fff', rx: 6, ry: 6 },
  },
});

graph.addEdge({
  source,
  target,
  attrs: {
    line: { stroke: '#8f8f8f', strokeWidth: 1 },
  },
});

// Center content: call after all nodes/edges have been added so canvas content is centered relative to the container.
// To scale content to fit the container, use graph.zoomToFit({ padding: 20, maxScale: 1 }) instead.
graph.centerContent();
```

---

## Scenario Selection Guide

| Scenario | Recommended Configuration | Key Features |
|------|----------|----------|
| DAG data pipeline | ports + orth router + connecting | Directed acyclic graph, port connections |
| ER entity relationship diagram | HTML nodes + er router | Table-style nodes, field display |
| Flowchart / approval workflow | Diamond decision nodes + branch edges | Conditional branches, multiple paths |
| Organization chart | orth router + tree layout | Hierarchy, collapse |
| Lineage analysis | left-right layout + smooth connector | Multi-layer flow, ports |
| Network topology | circular nodes + star structure | Device types, connection status |
| State machine | circular nodes + edge labels | State transitions, event triggers |

---

## Built-in Node Types

| shape | Shape | Applicable Scenarios |
|-------|------|----------|
| `rect` | Rectangle | General nodes, process steps |
| `circle` | Circle | State nodes, endpoints |
| `ellipse` | Ellipse | General emphasis |
| `polygon` | Polygon | Diamond (decision), hexagon |
| `text` | Plain text | Labels, annotations |
| `image` | Image | Icon nodes |
| `html` | HTML | Rich text, table-style nodes |

---

## Routers and Connectors

### Routers -- Determine Edge Paths
| Type | Effect | Applicable Scenarios |
|------|------|----------|
| `normal` | Straight line (default) | Simple graphs |
| `orth` | Orthogonal polyline | Flowcharts, DAGs |
| `manhattan` | Smart orthogonal routing (obstacle avoidance) | Complex layouts |
| `metro` | Metro-line style | Metro maps |
| `er` | ER diagram specific | Entity relationship diagrams |

### Connectors -- Determine Edge Line Style
| Type | Effect | Applicable Scenarios |
|------|------|----------|
| `normal` | Straight segment (default) | Simple graphs |
| `rounded` | Rounded-corner polyline | Flowcharts (recommended) |
| `smooth` | Bezier curve | Lineage diagrams, relationship diagrams |
| `jumpover` | Line jump-over | Complex crossings |

---

## Plugin Quick Reference

| Plugin | Registration Method | Function |
|------|----------|------|
| Selection | `graph.use(new Selection({ enabled: true, rubberband: true }))` | Box-select nodes |
| Snapline | `graph.use(new Snapline({ enabled: true }))` | Alignment guides |
| History | `graph.use(new History({ enabled: true }))` | Undo/redo |
| Clipboard | `graph.use(new Clipboard({ enabled: true }))` | Copy/paste |
| Keyboard | `graph.use(new Keyboard({ enabled: true }))` | Keyboard shortcut binding |
| Scroller | `graph.use(new Scroller({ enabled: true }))` | Scroll canvas |
| MiniMap | `graph.use(new MiniMap({ enabled: true, container }))` | Minimap navigation |
| Transform | `graph.use(new Transform({ resizing: { enabled: true }, rotating: { enabled: true } }))` | Node resize/rotate |
| Export | `graph.use(new Export())` | Export PNG/SVG |
| Stencil | `graph.use(new Stencil({ target: graph, groups: [...] }))` | Sidebar drag-and-drop panel |
| Dnd | `graph.use(new Dnd({ target: graph }))` | Drag to create nodes |