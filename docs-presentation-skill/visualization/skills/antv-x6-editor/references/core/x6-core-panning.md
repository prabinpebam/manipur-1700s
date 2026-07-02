---
id: "x6-core-panning"
title: "X6 Canvas Panning"
description: |
  X6 canvas panning configuration: mouse-drag panning, modifier-key control, and multiple trigger modes including left button, right button, mouse wheel, and pressed mouse wheel.

library: "x6"
version: "3.x"
category: "core"
subcategory: "panning"
tags:
  - "panning"
  - "pan"
  - "drag canvas"
  - "canvas movement"

related:
  - "x6-core-graph-init"
  - "x6-core-mousewheel"
  - "x6-plugin-scroller"

use_cases:
  - "Pan the canvas by dragging the blank area"
  - "Pan by holding a modifier key while dragging"
  - "Pan by right-button dragging"
  - "Pan the canvas with the mouse wheel"
  - "Pan with Space + drag"

difficulty: "beginner"
completeness: "full"
---

## Basic Usage

Configure canvas panning with the `panning` field in the Graph constructor:

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  panning: true,  // Shorthand: enable left-button drag panning
});
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | `false` | Whether to enable panning |
| `modifiers` | string \| string[] \| null | `null` | Modifier keys: `'ctrl'`, `'alt'`, `'shift'`, `'meta'`, or an array combination |
| `eventTypes` | string[] | `['leftMouseDown']` | Trigger modes: `'leftMouseDown'`, `'rightMouseDown'`, `'mouseWheel'`, `'mouseWheelDown'` |

## Shorthand Form

```javascript
// Boolean shorthand
panning: true
// Equivalent to
panning: { enabled: true, eventTypes: ['leftMouseDown'] }
```

## Object Configuration

```javascript
const graph = new Graph({
  container: 'container',
  panning: {
    enabled: true,
    modifiers: 'ctrl',  // Hold Ctrl to drag and pan
    eventTypes: ['leftMouseDown'],
  },
});
```

## Trigger Modes

| eventType | Description |
|-----------|-------------|
| `'leftMouseDown'` | Pan by dragging the blank area with the left mouse button |
| `'rightMouseDown'` | Pan by dragging with the right mouse button |
| `'mouseWheel'` | Pan by scrolling the mouse wheel (not zooming) |
| `'mouseWheelDown'` | Pan by dragging while pressing the mouse wheel (middle button) |

Combine multiple modes:

```javascript
panning: {
  enabled: true,
  eventTypes: ['leftMouseDown', 'rightMouseDown'],  // Both left and right buttons can pan
}
```

## Modifier-Key Control

Use `modifiers` to avoid conflicts between panning and rubberband selection:

```javascript
import { Graph, Selection } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  panning: {
    enabled: true,
    modifiers: 'ctrl',  // Ctrl + drag = pan
  },
});

// Dragging without modifiers = rubberband selection
graph.use(new Selection({ enabled: true, rubberband: true }));
```

## Spacebar Panning

X6 has built-in temporary panning with the spacebar (similar to design tools). Hold the spacebar and drag to pan the canvas; no extra configuration is required:

```javascript
const graph = new Graph({
  container: 'container',
  panning: { enabled: true },
  // Hold Space + mouse drag = pan (supported automatically)
});
```

## Programmatic API

```javascript
// Enable panning
graph.enablePanning();

// Disable panning
graph.disablePanning();

// Check whether panning is enabled
graph.isPannable();  // boolean

// Pan the canvas programmatically
graph.translateBy(dx, dy);   // Relative pan
graph.translate(tx, ty);     // Set absolute offset
```

## Complete Example: Panning + Selection + Zooming

```javascript
import { Graph, Selection } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  background: { color: '#F2F7FA' },
  grid: { visible: true },
  // Ctrl + drag to pan (avoids conflicts with rubberband selection)
  panning: { enabled: true, modifiers: 'ctrl' },
  // Ctrl + wheel to zoom
  mousewheel: { enabled: true, modifiers: 'ctrl' },
});

// Dragging without modifiers = rubberband selection
graph.use(new Selection({ enabled: true, rubberband: true }));

graph.addNode({ x: 100, y: 100, width: 120, height: 60, label: 'Node A' });
graph.addNode({ x: 400, y: 300, width: 120, height: 60, label: 'Node B' });
```

## Panning with Mousewheel

If `panning.eventTypes` includes `'mouseWheel'`, X6 uses the wheel for **panning**, which directly conflicts with **zooming** from `mousewheel: { enabled: true }`, causing zooming to stop responding or behave incorrectly. When configuring both, use `modifiers` to separate their trigger conditions:

```javascript
// Recommended: left-button drag panning + Ctrl + wheel zooming (no conflict)
const graph = new Graph({
  container: 'container',
  background: { color: '#F2F7FA' },
  panning: { enabled: true },                       // Equivalent eventTypes: ['leftMouseDown']
  mousewheel: { enabled: true, modifiers: 'ctrl' }, // Zoom only with Ctrl + wheel
});

// Recommended: Shift + drag panning + Ctrl + wheel zooming (also safe with Selection rubberband)
const graph2 = new Graph({
  container: 'container',
  panning: { enabled: true, modifiers: 'shift' },
  mousewheel: { enabled: true, modifiers: 'ctrl', minScale: 0.5, maxScale: 3 },
});
```

```javascript
// Anti-pattern: put mouseWheel in panning.eventTypes while also enabling mousewheel zooming
const graph = new Graph({
  container: 'container',
  panning: { enabled: true, eventTypes: ['leftMouseDown', 'mouseWheel'] }, // ❌
  mousewheel: { enabled: true, modifiers: ['ctrl'], minScale: 0.5, maxScale: 3 },
});
```

## Panning vs Scroller

| Feature | `panning` configuration | Scroller plugin |
|---------|-------------------------|-----------------|
| Drag panning | ✅ | ✅ |
| Scrollbars | ❌ | ✅ |
| Paged display | ❌ | ✅ |
| Infinite scroll area | ❌ | ✅ |
| Configuration method | Graph constructor | `graph.use()` |

Use `panning` for simple needs, and use the Scroller plugin when scrollbars and paging are required. **Do not use both at the same time**.

## Common Errors

### ❌ Using panning and Scroller Together

```javascript
// Error: conflict
const graph = new Graph({
  container: 'container',
  panning: true,  // ❌
});
graph.use(new Scroller({ enabled: true, pannable: true }));
```

```javascript
// Correct: choose one
// Option A: use panning
const graph = new Graph({ container: 'container', panning: true });

// Option B: use Scroller
const graph = new Graph({ container: 'container' });
graph.use(new Scroller({ enabled: true, pannable: true }));
```

### ❌ Conflict Between panning and rubberband

```javascript
// Problem: without modifiers, should dragging pan or select?
const graph = new Graph({
  container: 'container',
  panning: { enabled: true },  // No modifier
});
graph.use(new Selection({ enabled: true, rubberband: true }));  // Also no modifier
// Result: rubberband selection has higher priority, so panning does not take effect
```

```javascript
// Correct: distinguish them with a modifier key
const graph = new Graph({
  container: 'container',
  panning: { enabled: true, modifiers: 'ctrl' },  // ✅ Ctrl + drag pans
});
graph.use(new Selection({ enabled: true, rubberband: true }));  // Normal drag selects
```
