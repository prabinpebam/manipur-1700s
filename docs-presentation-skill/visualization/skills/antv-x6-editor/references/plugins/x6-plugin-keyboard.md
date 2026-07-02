---
id: "x6-plugin-keyboard"
title: "X6 Keyboard Shortcut Plugin"
description: |
  The Keyboard plugin provides keyboard shortcut support for the canvas.
  It is implemented with the Mousetrap library and supports key combinations, key sequences, and scope control.

library: "x6"
version: "3.x"
category: "plugins"
subcategory: "keyboard"
tags:
  - "keyboard"
  - "shortcut"
  - "hotkey"
  - "bindKey"
  - "Mousetrap"
  - "ctrl"
  - "undo"
  - "redo"
  - "delete"
  - "copy"
  - "paste"

related:
  - "x6-plugins"
  - "x6-core-events"

use_cases:
  - "Bind Ctrl+Z/Ctrl+Y to implement undo and redo"
  - "Bind Delete/Backspace to remove selected elements"
  - "Bind Ctrl+C/Ctrl+V for copy and paste"
  - "Customize shortcut operations on the canvas"

difficulty: "beginner"
completeness: "full"
---

## Core Concepts

The **Keyboard** plugin is based on [Mousetrap](https://github.com/ccampbell/mousetrap) and provides shortcut binding capabilities for the canvas. It supports:
- Single keys: `'delete'`, `'backspace'`, `'escape'`
- Key combinations: `'ctrl+z'`, `'ctrl+shift+z'`, `'command+c'`
- Key sequences: `'g i'`, pressing g and then i in sequence
- Multi-key bindings: bind multiple keys at the same time with an array

## Basic Usage

```javascript
import { Graph, Keyboard } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
});

// Register the Keyboard plugin
const keyboard = new Keyboard({ enabled: true });
graph.use(keyboard);

// Bind shortcuts
keyboard.bindKey('ctrl+z', () => {
  // Undo operation
});

keyboard.bind(Keyboard.events.KEYDOWN, (e) => {
  console.log('keydown', e);
});

keyboard.bindKey('ctrl+shift+z', () => {
  // Redo operation
});

keyboard.bindKey(['delete', 'backspace'], () => {
  // Delete selected elements
  const cells = graph.getSelectedCells();
  if (cells.length) {
    graph.removeCells(cells);
  }
});
```

## Options

### KeyboardOptions

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `enabled` | `boolean` | `true` | Whether to enable it |
| `global` | `boolean` | `false` | Whether to bind to document (`true`) or to the canvas container (`false`) |
| `format` | `(key: string) => string` | None | Key formatting function |
| `guard` | `(e: KeyboardEvent) => boolean` | None | Guard function; returning `true` prevents the shortcut from firing |

### global Parameter

- `false` (default): shortcuts only take effect when the canvas container has focus. The container is automatically assigned `tabindex="-1"` to ensure it can receive focus.
- `true`: shortcuts are bound to `document` and work globally without requiring the canvas to be focused.

## API Methods

| Method | Description |
|------|------|
| `keyboard.bindKey(keys, callback, action?)` | Bind a shortcut |
| `keyboard.unbindKey(keys, action?)` | Unbind a shortcut |
| `keyboard.trigger(key, action?)` | Manually trigger a shortcut callback |
| `keyboard.clear()` | Clear all bindings |
| `keyboard.enable()` | Enable keyboard handling |
| `keyboard.disable()` | Disable keyboard handling |
| `keyboard.isEnabled()` | Get the enabled state |
| `keyboard.toggleEnabled(enabled?)` | Toggle the enabled state |

### bindKey Parameters

| Parameter | Type | Description |
|------|------|------|
| `keys` | `string \| string[]` | Key or array of keys |
| `callback` | `(e: KeyboardEvent) => void` | Callback function |
| `action` | `'keypress' \| 'keydown' \| 'keyup'` | Optional trigger timing, default is `'keydown'` |

### Key Syntax, Mousetrap Format

| Type | Example | Description |
|------|------|------|
| Single key | `'a'`, `'1'`, `'delete'` | A single key |
| Modified combination | `'ctrl+s'`, `'command+c'` | Modifier key plus key |
| Multiple modifiers | `'ctrl+shift+z'` | Multiple modifier keys |
| Multi-key binding | `['ctrl+z', 'command+z']` | Array form, compatible with Windows and Mac |
| Key sequence | `'g i'` (space-separated) | Press in sequence |

## Complete Example

### Common Editor Shortcuts

```javascript
import { Graph, Keyboard, Selection, Clipboard, History } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
});

graph.use(new Selection({ enabled: true, rubberband: true }));
graph.use(new Clipboard({ enabled: true }));
graph.use(new History({ enabled: true }));

const keyboard = new Keyboard({ enabled: true });
graph.use(keyboard);

// Undo/redo
keyboard.bindKey(['ctrl+z', 'command+z'], () => {
  if (graph.canUndo()) {
    graph.undo();
  }
});

keyboard.bindKey(['ctrl+shift+z', 'command+shift+z'], () => {
  if (graph.canRedo()) {
    graph.redo();
  }
});

// Delete
keyboard.bindKey(['delete', 'backspace'], () => {
  const cells = graph.getSelectedCells();
  if (cells.length) {
    graph.removeCells(cells);
  }
});

// Copy/paste
keyboard.bindKey(['ctrl+c', 'command+c'], () => {
  const cells = graph.getSelectedCells();
  if (cells.length) {
    graph.copy(cells);
  }
});

keyboard.bindKey(['ctrl+v', 'command+v'], () => {
  if (!graph.isClipboardEmpty()) {
    const cells = graph.paste({ offset: 32 });
    graph.cleanSelection();
    graph.select(cells);
  }
});

// Select all
keyboard.bindKey(['ctrl+a', 'command+a'], (e) => {
  e.preventDefault();
  graph.select(graph.getCells());
});
```

### Global Mode, Without Requiring Canvas Focus

```javascript
const keyboard = new Keyboard({
  enabled: true,
  global: true,  // Bind to document
  guard(e) {
    // Do not trigger inside input/textarea
    const tagName = (e.target as HTMLElement)?.tagName?.toLowerCase();
    return tagName === 'input' || tagName === 'textarea';
  },
});
graph.use(keyboard);
```

## Common Errors

### Incorrect: Shortcuts Do Not Work Because the Canvas Is Not Focused

```javascript
// Problem: in default mode, shortcuts do not fire when the canvas container does not have focus
const keyboard = new Keyboard({ enabled: true });
graph.use(keyboard);
// Shortcuts take effect only after clicking the canvas

// Solution 1: use global mode
const keyboard = new Keyboard({ enabled: true, global: true });

// Solution 2: manually focus the container
graph.container.focus();
```

### Incorrect: Mac/Windows Compatibility Issue

```javascript
// Incorrect: only ctrl is bound, so Mac users cannot use it
keyboard.bindKey('ctrl+z', handler); // Does not work on Mac

// Correct: bind both ctrl and command
keyboard.bindKey(['ctrl+z', 'command+z'], handler);
```

### Incorrect: Use of graph.bindKey or graph.bind

```javascript
// Incorrect: uses graph.bindKey, which does not exist
graph.bindKey('ctrl+s', handler); // Error: graph.bindKey is not a function

// Correct: call bindKey on the keyboard instance
const keyboard = new Keyboard({ enabled: true });
graph.use(keyboard);
keyboard.bindKey('ctrl+s', handler);

// Incorrect: uses graph.bind to listen to Keyboard.events, which is deprecated or unavailable
graph.bind(Keyboard.events.KEYDOWN, handler); // Error: Cannot read properties of undefined

// Correct: use keyboard.bindKey to bind a key combination
keyboard.bindKey('ctrl+d', () => {
  const cells = graph.getSelectedCells();
  if (cells.length) {
    const cloned = graph.cloneCells(cells);
    Object.values(cloned).forEach((cell) => {
      if (cell.isNode()) {
        cell.translate(30, 30);
        graph.addCell(cell);
      }
    });
  }
});
```

### Incorrect: Shortcut Conflict or Not Preventing Default Behavior

```javascript
// Incorrect: browser default behavior is not prevented and may cause side effects such as page navigation
keyboard.bindKey('ctrl+s', () => {
  const data = graph.toJSON();
  console.log(data);
}); // Browser opens the save dialog

// Correct: prevent the default behavior in the callback
keyboard.bindKey('ctrl+s', (e) => {
  e.preventDefault();
  const data = graph.toJSON();
  console.log(data);
  return false; // Optional: return false to prevent further bubbling
});
```

### Incorrect: Runtime Error Caused by an Undefined Variable

```javascript
// Incorrect: the keyboard variable is not declared correctly, causing the runtime error "keyboard is not defined"
const keyboard = new Keyboard({ enabled: true });
graph.use(keyboard);

keyboard.bindKey(['ctrl+c', 'command+c'], () => {
  const cells = graph.getSelectedCells();
  if (cells.length) {
    graph.copy(cells);
  }
});

// Correct: ensure the keyboard variable is declared and used correctly
const keyboard = new Keyboard({ enabled: true });
graph.use(keyboard);

keyboard.bindKey(['ctrl+c', 'command+c'], () => {
  const cells = graph.getSelectedCells();
  if (cells.length) {
    graph.copy(cells);
  }
});
```

### Incorrect: Using graph.bindKey Instead of keyboard.bindKey

```javascript
// Incorrect: uses graph.bindKey, which does not exist
graph.bindKey('ctrl+s', handler); // Error: graph.bindKey is not a function

// Correct: call bindKey on the keyboard instance
const keyboard = new Keyboard({ enabled: true });
graph.use(keyboard);
keyboard.bindKey('ctrl+s', handler);
```

</skill>
