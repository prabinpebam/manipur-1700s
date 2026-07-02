---
id: "x6-plugin-history"
title: "X6 History Undo and Redo Plugin"
description: |
  The History plugin provides undo and redo capabilities for canvas operations, automatically recording operations such as adding or removing nodes and edges and changing attributes.

library: "x6"
version: "3.x"
category: "plugins"
subcategory: "history"
tags:
  - "History"
  - "undo"
  - "redo"
  - "undo"
  - "redo"
  - "history"
  - "operation rollback"

related:
  - "x6-plugins"
  - "x6-plugin-keyboard"
  - "x6-core-events"

use_cases:
  - "Undo the previous operation"
  - "Redo an undone operation"
  - "Implement Ctrl+Z/Ctrl+Y shortcuts"
  - "Limit the history stack size"
  - "Ignore specific types of operation changes"
  - "Treat batch operations as a single undo step"

difficulty: "beginner"
completeness: "full"
---

## Basic Usage

```javascript
import { Graph, History } from '@antv/x6';

const graph = new Graph({ container: 'container' });
graph.use(new History({ enabled: true }));

// Undo
graph.undo();

// Redo
graph.redo();
```

## Options

| Option | Type | Default | Description |
|--------|------|--------|------|
| `enabled` | boolean | `false` | Whether to enable history |
| `stackSize` | number | `0` (unlimited) | Maximum history stack capacity; when exceeded, the oldest records are discarded |
| `ignoreAdd` | boolean | `false` | Ignore element-add operations |
| `ignoreRemove` | boolean | `false` | Ignore element-remove operations |
| `ignoreChange` | boolean | `false` | Ignore element attribute-change operations |
| `beforeAddCommand` | function | - | Hook before a command is pushed onto the stack; return `false` to prevent it |
| `afterAddCommand` | function | - | Callback after a command is pushed onto the stack |
| `executeCommand` | function | - | Custom command execution logic |
| `cancelInvalid` | boolean | `true` | Whether to cancel invalid commands |

## Programmatic API

```javascript
// Undo/redo
graph.undo();            // Undo the previous step
graph.redo();            // Redo
graph.undoAndCancel();   // Undo without putting it into redoStack, so it cannot be redone

// Query state
graph.canUndo();  // boolean, whether undo is available
graph.canRedo();  // boolean, whether redo is available

// Query stack sizes
graph.getHistoryStackSize();  // History stack capacity, the stackSize option value; 0 means unlimited
graph.getUndoStackSize();     // Number of records currently in the undo stack
graph.getRedoStackSize();     // Number of records currently in the redo stack
graph.getUndoRemainSize();    // Remaining available space in the undo stack

// Clear history
graph.cleanHistory();

// Enable/disable
graph.enableHistory();
graph.disableHistory();
graph.toggleHistory(true);
graph.isHistoryEnabled();  // boolean
```

## Event Listening

```javascript
// Triggered on undo
graph.on('history:undo', ({ cmds, options }) => {
  console.log('Undone');
});

// Triggered on redo
graph.on('history:redo', ({ cmds, options }) => {
  console.log('Redone');
});

// Triggered when a new command is pushed onto the stack
graph.on('history:add', ({ cmds, options }) => {
  console.log('History record added');
});

// Triggered when the history stack is cleared
graph.on('history:clean', ({ cmds, options }) => {
  console.log('History cleared');
});

// Triggered on any history change, including undo, redo, add, and clean
graph.on('history:change', ({ cmds, options }) => {
  // Can be used to update UI button states
  updateUndoButton(graph.canUndo());
  updateRedoButton(graph.canRedo());
});
```

## Limiting the Stack Size

```javascript
graph.use(new History({
  enabled: true,
  stackSize: 50,  // Store at most 50 operation steps
}));
```

## Filtering Operations That Should Not Be Recorded

```javascript
graph.use(new History({
  enabled: true,
  // Ignore all attribute changes and record only additions/removals
  ignoreChange: true,
}));
```

Use `beforeAddCommand` for fine-grained filtering:

```javascript
graph.use(new History({
  enabled: true,
  beforeAddCommand(event, args) {
    // Ignore changes to specific attributes
    if (event === 'cell:change:attrs') {
      return false;  // Do not record attrs changes
    }
  },
}));
```

## Complete Example: Undo/Redo with Shortcuts and UI State

```javascript
import { Graph, History, Keyboard } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
});

graph.use(new History({ enabled: true, stackSize: 100 }));
graph.use(new Keyboard({ enabled: true, global: true }));

// Bind shortcuts
graph.bindKey('ctrl+z', () => graph.undo());
graph.bindKey('ctrl+shift+z', () => graph.redo());

// Listen for history changes and update UI buttons
graph.on('history:change', () => {
  document.getElementById('undo-btn').disabled = !graph.canUndo();
  document.getElementById('redo-btn').disabled = !graph.canRedo();
});

// Add a test node
graph.addNode({ x: 100, y: 100, width: 80, height: 40, label: 'Node' });
// At this point, canUndo() === true
```

## Merging Batch Operations into a Single Undo Step

X6's `model.startBatch()` / `model.stopBatch()` can merge multiple operations into a single history record:

```javascript
// Start batch operation
graph.startBatch('custom-batch');

// The following operations are merged into one history record
graph.addNode({ id: 'a', x: 100, y: 100, width: 80, height: 40 });
graph.addNode({ id: 'b', x: 300, y: 100, width: 80, height: 40 });
graph.addEdge({ source: 'a', target: 'b' });

// End batch operation
graph.stopBatch('custom-batch');

// A single undo() call can undo the three operations above
graph.undo();
```

## Common Errors

### Incorrect: Calling undo/redo Without Registering the Plugin

```javascript
const graph = new Graph({ container: 'container' });
graph.undo();  // Invalid, the History plugin is not registered
```

```javascript
import { Graph, History } from '@antv/x6';
const graph = new Graph({ container: 'container' });
graph.use(new History({ enabled: true }));
graph.undo();
```

### Incorrect: Configuring history in the Constructor

```javascript
// Incorrect: unsupported in 3.x
const graph = new Graph({
  container: 'container',
  history: { enabled: true },
});
```

```javascript
// Correct
import { Graph, History } from '@antv/x6';
const graph = new Graph({ container: 'container' });
graph.use(new History({ enabled: true }));
```
