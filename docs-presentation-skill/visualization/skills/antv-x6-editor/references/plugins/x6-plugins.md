---
id: "x6-plugins"
title: "X6 Plugin Configuration"
description: |
  How to use X6 built-in plugins: Selection, Snapline, History, Clipboard,
  Keyboard, MiniMap, Scroller, Transform, and others.

library: "x6"
version: "3.x"
category: "plugins"
subcategory: "all"
tags:
  - "plugin"
  - "plugin"
  - "import"
  - "Illegal constructor"
  - "is not a constructor"
  - "Embedding"
  - "embedding"
  - "embedding"
  - "node embedding"
  - "Connecting"
  - "Mousewheel"
  - "Panning"
  - "Selection"
  - "selection"
  - "marquee selection"
  - "Snapline"
  - "alignment guide"
  - "History"
  - "undo"
  - "redo"
  - "undo"
  - "redo"
  - "Clipboard"
  - "copy"
  - "paste"
  - "Keyboard"
  - "shortcut"
  - "MiniMap"
  - "minimap"
  - "Scroller"
  - "scroll"
  - "Transform"
  - "resize"
  - "rotate"
  - "Stencil"
  - "sidebar"
  - "drag"

related:
  - "x6-core-graph-init"
  - "x6-core-events"

use_cases:
  - "Enable node marquee selection"
  - "Add alignment guides"
  - "Implement undo and redo"
  - "Configure shortcuts"
  - "Add minimap navigation"
  - "Enable canvas scrolling"
  - "Resize and rotate nodes"
  - "Create nodes by dragging from a sidebar"

anti_patterns:
  - "Do not use standalone @antv/x6-plugin-xxx packages; they are deprecated"
  - "Do not pass selecting/snapline/history and similar options to the Graph constructor; 3.x does not support this"

difficulty: "intermediate"
completeness: "full"
---

## How to Use Plugins

In X6 3.x, plugins are imported directly from `@antv/x6` and registered with `graph.use(new Plugin(options))`. Each plugin implements the `GraphPlugin` interface.

```javascript
import { Graph, Selection, Snapline, History } from '@antv/x6';

const graph = new Graph({ container: 'container' });

// Register plugins through graph.use()
graph.use(new Selection({ enabled: true }));
graph.use(new Snapline({ enabled: true }));
graph.use(new History({ enabled: true }));
```

## Plugin Import Quick Reference (Check Before Outputting Code)

All 11 built-in X6 plugins are imported from the `@antv/x6` main package. If you use a plugin, you must list it in the import statement.

| Usage                                                 | Required import                      |
| ----------------------------------------------------- | ------------------------------------ |
| `new Selection(...)` or `graph.select/unselect/...`   | `Selection`                          |
| `new Snapline(...)`                                   | `Snapline`                           |
| `new History(...)` or `graph.undo/redo`               | `History`                            |
| `new Clipboard(...)` or `graph.copy/paste/cut`        | `Clipboard`                          |
| `new Keyboard(...)` or `graph.bindKey`                | `Keyboard`                           |
| `new MiniMap(...)`                                    | `MiniMap`                            |
| `new Scroller(...)`                                   | `Scroller`                           |
| `new Transform(...)`                                  | `Transform`                          |
| `new Export()` or `graph.toPNG/toSVG/toJPEG`          | `Export`                             |
| `new Stencil(...)`                                    | `Stencil`                            |
| `new Dnd(...)`                                        | `Dnd`                                |
| `Shape.HTML.register(...)` / `Shape.HTML.create(...)` | `Shape` (not `HTML`)                 |

> A single combined import line is recommended to avoid omissions:
>
> ```javascript
> import { Graph, Shape, Selection, Keyboard, History, Clipboard } from '@antv/x6';
> ```

### Missing the `Selection` Import Causes `Failed to construct 'Selection': Illegal constructor`

The evaluation environment and Playground use the X6 UMD build (`window.X6`). Before executing code, they destructure the corresponding classes from `window.X6` according to the `import` list. If `Selection` does not appear in the import list, the identifier `Selection` falls back to `window.Selection` (the browser's native Selection interface, not a constructor), and `new Selection({...})` then throws `Illegal constructor`.

```javascript
// Missing Selection causes Illegal constructor
import { Graph } from '@antv/x6';
const graph = new Graph({ container: 'container' });
graph.use(new Selection({ enabled: true, rubberband: true })); // Selection is not imported, so it falls back to window.Selection
```

```javascript
// Selection must be included in the import
import { Graph, Selection } from '@antv/x6';
const graph = new Graph({ container: 'container' });
graph.use(new Selection({ enabled: true, rubberband: true }));
```

### `Embedding` / `Connecting` / `Mousewheel` / `Panning` Are Not Plugins; Do Not Use `new` or `graph.use`

X6 3.x has only 11 plugins (listed in the table above). The following concepts are all `new Graph({ ... })` constructor options, not plugin classes:

| Concept             | Incorrect usage (runtime error)                       | Correct usage (Graph constructor option)                                                  |
| ------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Node embedding      | `import { Embedding } from '@antv/x6'` / `new Embedding(...)` / `graph.use(new Embedding(...))` -> `Embedding is not a constructor` | `new Graph({ embedding: { enabled: true, findParent: 'bbox', validate: ({ child, parent }) => true } })` |
| Connection interaction | `new Connecting(...)` / `graph.use(...)`          | `new Graph({ connecting: { snap: true, allowBlank: false, router: 'manhattan', connector: 'rounded' } })` |
| Mouse-wheel zoom    | `new Mousewheel(...)`                                 | `new Graph({ mousewheel: { enabled: true, modifiers: ['ctrl'], factor: 1.1 } })`          |
| Canvas panning      | `new Panning(...)`                                    | `new Graph({ panning: { enabled: true, modifiers: 'shift' } })`                           |
| Grid / background   | `new Grid(...)` / `new Background(...)`               | `new Graph({ grid: true, background: { color: '#f5f5f5' } })`                             |
| Node translating    | `new Translating(...)`                                | `new Graph({ translating: { restrict: true } })`                                          |
| Highlighting        | `new Highlighting(...)`                               | `new Graph({ highlighting: { magnetAvailable: { name: 'stroke', args: {...} } } })`       |

> Simple rule: if the X6 documentation or source code contains `interface XxxOptions extends ...` instead of `class Xxx extends Base`, it is definitely a Graph constructor option and must not be used with `new` or `graph.use`.



```javascript
// Keyboard / History are not imported
import { Graph } from '@antv/x6';
graph.use(new Keyboard({ enabled: true })); // Keyboard is not a constructor
graph.use(new History({ enabled: true }));  // History is not a constructor
```

```javascript
// Put all required classes in the same import line
import { Graph, Keyboard, History } from '@antv/x6';
graph.use(new Keyboard({ enabled: true }));
graph.use(new History({ enabled: true }));
```

### Using `Shape.HTML.register` but Forgetting to Import `Shape`

```javascript
// Incorrect
import { Graph } from '@antv/x6';
Shape.HTML.register({ shape: 'form', html() { /* ... */ } }); // Shape is not defined
```

```javascript
// Correct
import { Graph, Shape } from '@antv/x6';
Shape.HTML.register({ shape: 'form', html() { /* ... */ } });
```

## Selection (Marquee Selection)

```javascript
import { Graph, Selection } from '@antv/x6';

const graph = new Graph({ container: 'container' });
graph.use(new Selection({
  enabled: true,
  rubberband: true,        // Enable marquee selection
  multiple: true,          // Allow multi-selection
  showNodeSelectionBox: true,  // Show the selection box
  multipleSelectionModifiers: ['ctrl', 'meta'],  // Modifier keys for multi-selection
}));

// Programmatic operations (automatically mounted on the graph instance after plugin registration)
graph.select(node);              // Select
graph.unselect(node);            // Unselect
graph.isSelected(node);          // Whether selected
graph.getSelectedCells();        // Get all selected elements
graph.cleanSelection();          // Clear selection
```

## Snapline (Alignment Guides)

```javascript
import { Graph, Snapline } from '@antv/x6';

const graph = new Graph({ container: 'container' });
graph.use(new Snapline({
  enabled: true,
  tolerance: 10,           // Snap tolerance in pixels
}));
```

## History (Undo/Redo)

```javascript
import { Graph, History } from '@antv/x6';

const graph = new Graph({ container: 'container' });
graph.use(new History({ enabled: true }));

// Undo
graph.undo();

// Redo
graph.redo();

// Whether undo/redo is available
graph.canUndo();
graph.canRedo();

// Listen for events
graph.on('history:undo', () => console.log('Undone'));
graph.on('history:redo', () => console.log('Redone'));

// Merge batch operations into a single undo step (do not use graph.history.batch(); that method does not exist)
graph.startBatch('custom-batch');
// Perform multiple operations...
graph.stopBatch('custom-batch');

// Or use the batchUpdate shorthand
graph.batchUpdate('custom-batch', () => {
  // All operations here are merged into a single undo step
  graph.addNode({ shape: 'rect', x: 100, y: 100, width: 80, height: 40 });
  graph.addNode({ shape: 'rect', x: 300, y: 100, width: 80, height: 40 });
});
```

## Clipboard (Copy/Paste)

```javascript
import { Graph, Clipboard } from '@antv/x6';

const graph = new Graph({ container: 'container' });
graph.use(new Clipboard({ enabled: true }));

// Copy selected elements
graph.copy(graph.getSelectedCells());

// Paste with a 20 px offset
graph.paste({ offset: 20 });

// Cut
graph.cut(graph.getSelected( ));
```

## Keyboard (Shortcuts)

```javascript
import { Graph, Keyboard } from '@antv/x6';

const graph = new Graph({ container: 'container' });
graph.use(new Keyboard({
  enabled: true,
  global: true,            // Global shortcuts (not limited to canvas focus)
}));

// Bind shortcuts
graph.bindKey('ctrl+c', () => {
  const cells = graph.getSelectedCells();
  if (cells.length) graph.copy(cells);
});

graph.bindKey('ctrl+v', () => {
  graph.paste({ offset: 20 });
});

graph.bindKey('ctrl+z', () => {
  graph.undo();
});

graph.bindKey('ctrl+shift+z', () => {
  graph.redo();
});

graph.bindKey('delete', () => {
  const cells = graph.getSelectedCells();
  if (cells.length) graph.removeCells(cells);
});

graph.bindKey('ctrl+a', () => {
  graph.select(graph.getCells());
});
```

## Scroller (Canvas Scrolling)

```javascript
import { Graph, Scroller } from '@antv/x6';

const graph = new Graph({ container: 'container' });
graph.use(new Scroller({
  enabled: true,
  pannable: true,          // Canvas can be panned
  pageVisible: true,       // Show pages
  pageBreak: false,
}));
```

## MiniMap (Minimap)

```javascript
import { Graph, MiniMap } from '@antv/x6';

const graph = new Graph({ container: 'container' });
graph.use(new MiniMap({
  enabled: true,
  container: document.getElementById('minimap'),  // Minimap container
  width: 200,
  height: 160,
}));
```

**Note**: MiniMap requires a separate DOM container.

## Transform (Node Resize/Rotate)

```javascript
import { Graph, Transform } from '@antv/x6';

const graph = new Graph({ container: 'container' });
graph.use(new Transform({
  resizing: {
    enabled: true,           // Allow resizing
  },
  rotating: {
    enabled: true,           // Allow rotation
  },
}));
```

## Stencil (Sidebar Drag Panel)

Stencil is used to create a draggable node panel, or toolbox:

```javascript
import { Graph, Stencil } from '@antv/x6';

const graph = new Graph({ container: 'container' });

const stencil = new Stencil({
  title: 'Components',
  target: graph,
  groups: [
    { name: 'basic', title: 'Basic Shapes' },
    { name: 'custom', title: 'Custom Nodes' },
  ],
});
graph.use(stencil);

document.getElementById('stencil').appendChild(stencil.container);

// Load node templates into a group
const basicNodes = [
  graph.createNode({ shape: 'rect', width: 80, height: 40, label: 'Rect' }),
  graph.createNode({ shape: 'circle', width: 60, height: 60, label: 'Circle' }),
];
stencil.load(basicNodes, 'basic');

const customNodes = [
  graph.createNode({ shape: 'dag-node', width: 140, height: 50, label: 'DAG Node' }),
];
stencil.load(customNodes, 'custom');
```

## Dnd (Drag to Create)

Simple drag-to-create node behavior without a sidebar:

```javascript
import { Graph, Dnd } from '@antv/x6';

const graph = new Graph({ container: 'container' });

const dnd = new Dnd({ target: graph });
graph.use(dnd);

// Start dragging from an external element
document.getElementById('drag-source').addEventListener('mousedown', (e) => {
  const node = graph.createNode({
    shape: 'rect',
    width: 100,
    height: 40,
    label: 'New Node',
  });
  dnd.start(node, e);
});
```

## Combined Usage Example

```javascript
import { Graph, Selection, Snapline, History, Clipboard, Keyboard, Transform } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  background: { color: '#F2F7FA' },
  grid: { visible: true },
  panning: true,
  mousewheel: { enabled: true, modifiers: 'ctrl' },
  connecting: { allowBlank: false, router: 'orth', connector: 'rounded' },
});

// Register plugins
graph.use(new Selection({ enabled: true, rubberband: true, showNodeSelectionBox: true }));
graph.use(new Snapline({ enabled: true }));
graph.use(new History({ enabled: true }));
graph.use(new Clipboard({ enabled: true }));
graph.use(new Keyboard({ enabled: true, global: true }));
graph.use(new Transform({ resizing: { enabled: true } }));

// Shortcut bindings
graph.bindKey('ctrl+c', () => graph.copy(graph.getSelectedCells()));
graph.bindKey('ctrl+v', () => graph.paste({ offset: 20 }));
graph.bindKey('ctrl+z', () => graph.undo());
graph.bindKey('ctrl+shift+z', () => graph.redo());
graph.bindKey('delete', () => graph.removeCells(graph.getSelectedCells()));
```

## Common Mistakes and Fixes

### Error: Passing Plugin Options to the Constructor

**Problem code**:
```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  selecting: { enabled: true },  // Not supported in 3.x
  snapline: { enabled: true },   // Not supported in 3.x
  history: { enabled: true },    // Not supported in 3.x
});
```

**Cause**:
In X6 3.x, plugins are registered through `graph.use()`. Constructor-option mode is not supported.

**Fixed code**:
```javascript
import { Graph, Selection, Snapline, History } from '@antv/x6';

const graph = new Graph({ container: 'container' });
graph.use(new Selection({ enabled: true }));
graph.use(new Snapline({ enabled: true }));
graph.use(new History({ enabled: true }));
```

### Error: Using Standalone `@antv/x6-plugin-xxx` Packages

**Problem code**:
```javascript
import { Selection } from '@antv/x6-plugin-selection';  // Deprecated
import { History } from '@antv/x6-plugin-history';      // Deprecated
```

**Cause**:
Standalone plugin packages are deprecated. In 3.x, all plugins are exported directly from `@antv/x6`.

**Fixed code**:
```javascript
import { Graph, Selection, History } from '@antv/x6';  // Correct
```

### Error: Calling `graph.render()`

**Problem code**:
```javascript
const data = { nodes: [...], edges: [...] };
graph.fromJSON(data);
graph.render(); // Error
```

**Cause**:
`graph.fromJSON()` renders automatically. There is no need to call `render()` manually.

**Fixed code**:
```javascript
const data = { nodes: [...], edges: [...] };
graph.fromJSON(data);
```

### Error: The Canvas Container Is Not Initialized Correctly or No Basic Nodes Are Added, Causing a Blank Screen

**Problem code**:
```javascript
import { Graph, Selection, Snapline, History, Keyboard } from '@antv/x6';

const graph = new Graph({
  container: container, // Use the string container: 'container' instead
});

graph.use(new Selection({ enabled: true }));
graph.use(new Snapline({ enabled: true }));
graph.use(new History({ enabled: true }));
graph.use(new Keyboard({ enabled: true }));

// No nodes or edges have been added, so the canvas is blank
```

**Cause**:
1. The `container` parameter should be a DOM element or its ID string.
2. No nodes or edges have been added to the canvas, causing a blank screen.

**Fixed code**:
```javascript
import { Graph, Selection, Snapline, History, Keyboard, Clipboard } from '@antv/x6';

const graph = new Graph({
  container: 'container', // Correct: use the string ID
  width: 800,
  height: 600,
  background: { color: '#F2F7FA' },
  grid: { visible: true },
  panning: true,
  mousewheel: { enabled: true, modifiers: 'ctrl' },
  connecting: { allowBlank: false, router: 'orth', connector: 'rounded' },
});

// Register plugins
graph.use(new Selection({ enabled: true, rubberband: true }));
graph.use(new Snapline({ enabled: true }));
graph.use(new History({ enabled: true }));
graph.use(new Keyboard({ enabled: true }));
graph.use(new Clipboard({ enabled: true }));

// Add basic nodes and edges
const node1 = graph.addNode({ shape: 'rect', x: 100, y: 100, width: 80, height: 40, label: 'Start' });
const node2 = graph.addNode({ shape: 'circle', x: 300, y: 100, width: 60, height: 60, label: 'End' });
graph.addEdge({ source: node1, target: node2 });

// Shortcut bindings
graph.bindKey('delete', () => {
  const cells = graph.getSelectedCells();
  if (cells.length) graph.removeCells(cells);
});
graph.bindKey('ctrl+z', () => graph.undo());
graph.bindKey('ctrl+shift+z', () => graph.redo());
graph.bindKey('ctrl+c', () => graph.copy(graph.getSelectedCells()));
graph.bindKey('ctrl+v', () => graph.paste({ offset: 20 }));
```

### Error: Calling Plugin Methods Incorrectly, Such as `keyboard.bindKey`

**Problem code**:
```javascript
const keyboard = new Keyboard({ enabled: true, global: true });
graph.use(keyboard);

keyboard.bindKey(['delete', 'backspace'], () => { ... }); // Error
```

**Cause**:
Plugin methods should be called through the `graph` instance, not the plugin instance.

**Fixed code**:
```javascript
graph.use(new Keyboard({ enabled: true, global: true }));

graph.bindKey(['delete', 'backspace'], () => {
  const cells = graph.getSelectedCells();
  if (cells.length) graph.removeCells(cells);
});
```

### Error: The History Plugin Has No `batch` Method

**Problem code**:
```javascript
graph.history.batch(() => {
  const node1 = graph.addNode(data[0]);
  const node2 = graph.addNode(data[1]);
  graph.addEdge({ source: node1, target: node2 });
});
```

**Cause**:
The History plugin does not have a `batch` method. Use `graph.startBatch()` and `graph.stopBatch()` to control batch operations.

**Fixed code**:
```javascript
graph.startBatch('custom-batch');

const node1 = graph.addNode(data[0]);
const node2 = graph.addNode(data[1]);
graph.addEdge({ source: node1, target: node2 });

graph.stopBatch('custom-batch');
```

---
</skill>
