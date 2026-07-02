---
id: "x6-plugin-selection"
title: "X6 Selection Marquee Selection Plugin"
description: |
  The Selection plugin provides single selection, multi-selection, and marquee selection for nodes and edges. It supports selection boxes, modifier-key multi-selection, dragging selected elements, and related features.

library: "x6"
version: "3.x"
category: "plugins"
subcategory: "selection"
tags:
  - "Selection"
  - "selected"
  - "marquee selection"
  - "multi-selection"
  - "rubberband"
  - "select"
  - "unselect"
  - "getSelectedCells"

related:
  - "x6-plugins"
  - "x6-plugin-keyboard"
  - "x6-core-events"

use_cases:
  - "Select multiple nodes with a marquee"
  - "Click to select nodes or edges"
  - "Ctrl/Meta multi-selection"
  - "Get the list of selected elements"
  - "Batch delete after selection"
  - "Batch move after selection"

difficulty: "beginner"
completeness: "full"
---

## Basic Usage

```javascript
import { Graph, Selection } from '@antv/x6';

const graph = new Graph({ container: 'container' });
graph.use(new Selection({
  enabled: true,
  rubberband: true,  // Enable marquee selection
}));
```

## Options

| Option | Type | Default | Description |
|--------|------|--------|------|
| `enabled` | boolean | `false` | Whether selection is enabled |
| `rubberband` | boolean | `false` | Whether marquee selection is enabled (drag a rectangle to select elements) |
| `multiple` | boolean | `true` | Whether multi-selection is allowed |
| `strict` | boolean | `false` | Strict mode: an element must be fully inside the marquee to be selected |
| `showNodeSelectionBox` | boolean | `false` | Whether to show a selection box when a node is selected |
| `showEdgeSelectionBox` | boolean | `false` | Whether to show a selection box when an edge is selected |
| `movable` | boolean | `true` | Whether selected elements can be dragged and moved |
| `multipleSelectionModifiers` | string[] | `['ctrl', 'meta']` | Modifier keys for multi-selection |
| `rubberband` | boolean | `false` | Enable marquee selection |
| `filter` | function/string[] | - | Filter elements that cannot be selected |
| `content` | function | - | Custom display content for the selection box |

## Programmatic API

After the Selection plugin is registered, the following methods are automatically mounted on the graph instance:

```javascript
// Select elements (supports node IDs, node instances, and arrays)
graph.select(node);
graph.select([node1, node2]);
graph.select('node-id');

// Unselect
graph.unselect(node);
graph.unselect([node1, node2]);

// Check whether an element is selected
graph.isSelected(node);       // boolean
graph.isSelected('node-id');  // boolean

// Get selected elements
graph.getSelectedCells();      // Cell[]
graph.getSelectedCellCount();  // number

// Clear selection
graph.cleanSelection();

// Reset selection (replace the current selection with new elements)
graph.resetSelection([node1, node2]);

// Check whether the selection is empty
graph.isSelectionEmpty();  // boolean
```

## Dynamic Control APIs

```javascript
// Enable/disable selection
graph.enableSelection();
graph.disableSelection();
graph.toggleSelection(true);
graph.isSelectionEnabled();  // boolean

// Enable/disable multi-selection
graph.enableMultipleSelection();
graph.disableMultipleSelection();
graph.toggleMultipleSelection(true);
graph.isMultipleSelection();  // boolean

// Enable/disable marquee selection
graph.enableRubberband();
graph.disableRubberband();
graph.toggleRubberband(true);
graph.isRubberbandEnabled();  // boolean

// Enable/disable strict marquee selection
graph.enableStrictRubberband();
graph.disableStrictRubberband();
graph.toggleStrictRubberband(true);
graph.isStrictRubberband();  // boolean

// Whether selected elements can be dragged and moved
graph.enableSelectionMovable();
graph.disableSelectionMovable();
graph.toggleSelectionMovable(true);
graph.isSelectionMovable();  // boolean

// Set marquee-selection modifier keys
graph.setRubberbandModifiers('alt');
graph.setRubberbandModifiers(['ctrl', 'shift']);

// Set the selection filter
graph.setSelectionFilter((cell) => cell.isNode());

// Set custom selection-box content
graph.setSelectionDisplayContent((selection, contentElement) => {
  contentElement.textContent = `${selection.length} items`;
});
```

## Events

```javascript
// Selection change event
graph.on('selection:changed', ({ added, removed, selected }) => {
  // added: newly selected elements
  // removed: unselected elements
  // selected: all currently selected elements
  console.log('Currently selected:', selected.length, 'elements');
});
```

## Complete Example: Marquee Selection + Delete Shortcut

```javascript
import { Graph, Selection, Keyboard } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
});

graph.use(new Selection({
  enabled: true,
  rubberband: true,
  multiple: true,
  showNodeSelectionBox: true,
  multipleSelectionModifiers: ['ctrl', 'meta'],
}));
graph.use(new Keyboard({ enabled: true }));

// Delete selected elements with the Delete key
graph.bindKey('delete', () => {
  const cells = graph.getSelectedCells();
  if (cells.length) {
    graph.removeCells(cells);
  }
});

// Select all with Ctrl+A
graph.bindKey('ctrl+a', () => {
  graph.select(graph.getCells());
});

// Add sample data
graph.addNode({ id: 'node1', x: 100, y: 100, width: 80, height: 40, label: 'Node 1' });
graph.addNode({ id: 'node2', x: 300, y: 100, width: 80, height: 40, label: 'Node 2' });
graph.addEdge({ source: 'node1', target: 'node2' });
```

## Filter Example: Only Allow Nodes to Be Selected

```javascript
graph.use(new Selection({
  enabled: true,
  rubberband: true,
  filter: (cell) => cell.isNode(),  // Edges cannot be selected
}));
```

You can also filter by shape name:

```javascript
graph.use(new Selection({
  enabled: true,
  filter: ['rect', 'circle'],  // Only rect and circle shapes can be selected
}));
```

## Common Mistakes

### Calling `graph.select()` Without Registering the Plugin

```javascript
// Incorrect: Selection plugin is not registered
const graph = new Graph({ container: 'container' });
graph.select(node);  // Invalid; it will not throw an error, but it will not take effect
```

```javascript
// Correct: register the plugin first
import { Graph, Selection } from '@antv/x6';
const graph = new Graph({ container: 'container' });
graph.use(new Selection({ enabled: true }));
graph.select(node);
```

### Do Not Configure `selecting` in the Constructor

```javascript
// Incorrect: not supported in 3.x
const graph = new Graph({
  container: 'container',
  selecting: { enabled: true, rubberband: true },
});
```

```javascript
// Correct: use graph.use()
import { Graph, Selection } from '@antv/x6';
const graph = new Graph({ container: 'container' });
graph.use(new Selection({ enabled: true, rubberband: true }));
```
