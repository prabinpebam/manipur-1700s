---
id: "x6-plugin-clipboard"
title: "X6 Clipboard Copy and Paste Plugin"
description: |
  The Clipboard plugin provides copy, cut, and paste capabilities for canvas elements, with support for cross-canvas paste and localStorage persistence.

library: "x6"
version: "3.x"
category: "plugins"
subcategory: "clipboard"
tags:
  - "Clipboard"
  - "copy"
  - "paste"
  - "cut"
  - "copy"
  - "paste"
  - "cut"

related:
  - "x6-plugins"
  - "x6-plugin-selection"
  - "x6-plugin-keyboard"

use_cases:
  - "Copy selected nodes and edges"
  - "Cut selected elements"
  - "Paste onto the canvas with an offset"
  - "Copy and paste across pages"
  - "Ctrl+C/Ctrl+V shortcuts"

difficulty: "beginner"
completeness: "full"
---

## Basic Usage

```javascript
import { Graph, Clipboard } from '@antv/x6';

const graph = new Graph({ container: 'container' });
graph.use(new Clipboard({ enabled: true }));

// Copy
graph.copy(cells);

// Paste
graph.paste();

// Cut
graph.cut(cells);
```

## Options

| Option | Type | Default | Description |
|--------|------|--------|------|
| `enabled` | boolean | `false` | Whether to enable the clipboard |
| `useLocalStorage` | boolean | `false` | Whether to store data in localStorage, enabling cross-page paste |

## Programmatic API

### copy(cells, options?)

Copy the specified elements to the clipboard:

```javascript
// Copy selected elements
const cells = graph.getSelectedCells();
graph.copy(cells);

// Deep copy, including child elements
graph.copy(cells, { deep: true });

// Use localStorage for cross-page copy
graph.copy(cells, { useLocalStorage: true });
```

### cut(cells, options?)

Cut: copy the elements, then remove them from the canvas:

```javascript
const cells = graph.getSelectedCells();
graph.cut(cells);
```

### paste(options?)

Paste clipboard content onto the canvas:

```javascript
// Default paste with a 20 px offset
graph.paste();

// Custom offset
graph.paste({ offset: 40 });

// Specify the offset direction
graph.paste({ offset: { dx: 30, dy: 30 } });

// Modify node properties while pasting
graph.paste({
  offset: 20,
  nodeProps: { zIndex: 10 },
  edgeProps: { zIndex: 5 },
});

// Paste from localStorage
graph.paste({ useLocalStorage: true });
```

### getCellsInClipboard()

Get the elements currently in the clipboard:

```javascript
const cells = graph.getCellsInClipboard();
console.log('Clipboard contains', cells.length, 'elements');
```

### isClipboardEmpty()

Check whether the clipboard is empty:

```javascript
if (!graph.isClipboardEmpty()) {
  graph.paste();
}
```

## Event Listening

```javascript
graph.on('clipboard:changed', ({ cells }) => {
  console.log('Clipboard content changed:', cells.length, 'elements');
});
```

## Complete Example: Copy and Paste with Shortcuts

```javascript
import { Graph, Selection, Clipboard, Keyboard } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
});

graph.use(new Selection({ enabled: true, rubberband: true }));
graph.use(new Clipboard({ enabled: true }));
graph.use(new Keyboard({ enabled: true, global: true }));

// Ctrl+C to copy
graph.bindKey('ctrl+c', () => {
  const cells = graph.getSelectedCells();
  if (cells.length) {
    graph.copy(cells);
  }
});

// Ctrl+X to cut
graph.bindKey('ctrl+x', () => {
  const cells = graph.getSelectedCells();
  if (cells.length) {
    graph.cut(cells);
  }
});

// Ctrl+V to paste
graph.bindKey('ctrl+v', () => {
  if (!graph.isClipboardEmpty()) {
    const cells = graph.paste({ offset: 20 });
    graph.cleanSelection();
    graph.select(cells);  // Select the pasted elements
  }
});

// Add a sample node
graph.addNode({ x: 100, y: 100, width: 100, height: 50, label: 'Copy me' });
```

## Cross-Page Copy and Paste

After `useLocalStorage` is enabled, copied data is stored in the browser's localStorage and can be pasted between different pages under the same domain:

```javascript
graph.use(new Clipboard({
  enabled: true,
  useLocalStorage: true,  // Enable cross-page support
}));

// Copy on page A
graph.copy(graph.getSelectedCells(), { useLocalStorage: true });

// Paste on page B
graph.paste({ useLocalStorage: true });
```

## Common Errors

### Incorrect: Passing an Empty Array When Copying

```javascript
// Incorrect: does not check whether any elements are selected
graph.bindKey('ctrl+c', () => {
  graph.copy(graph.getSelectedCells());  // If no element is selected, an empty array is passed
  // The clipboard is cleared at this point.
});
```

```javascript
// Correct: check first
graph.bindKey('ctrl+c', () => {
  const cells = graph.getSelectedCells();
  if (cells.length) {
    graph.copy(cells);
  }
});
```

### Incorrect: Calling copy/paste Without Registering Clipboard

```javascript
// Incorrect: plugin is not registered
const graph = new Graph({ container: 'container' });
graph.copy(cells);   // Invalid
graph.paste();       // Invalid
```

```javascript
// Correct: register the plugin first
import { Graph, Clipboard } from '@antv/x6';
const graph = new Graph({ container: 'container' });
graph.use(new Clipboard({ enabled: true }));
graph.copy(cells);
graph.paste();
```
