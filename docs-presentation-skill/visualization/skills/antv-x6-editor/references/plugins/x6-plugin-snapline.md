---
id: "x6-plugin-snapline"
title: "X6 Snapline Alignment Guide Plugin"
description: |
  The Snapline plugin automatically displays alignment guides while nodes are dragged, helping users align node positions precisely.

library: "x6"
version: "3.x"
category: "plugins"
subcategory: "snapline"
tags:
  - "Snapline"
  - "alignment guide"
  - "guide line"
  - "snap"
  - "alignment"
  - "snap"

related:
  - "x6-plugins"
  - "x6-core-node"

use_cases:
  - "Show alignment guides while dragging nodes"
  - "Precisely align multiple nodes"
  - "Adjust snap tolerance"

difficulty: "beginner"
completeness: "full"
---

## Basic Usage

```javascript
import { Graph, Snapline } from '@antv/x6';

const graph = new Graph({ container: 'container' });
graph.use(new Snapline({ enabled: true }));
```

When a node edge or center aligns with another node while dragging, red guide lines are displayed automatically and the node snaps to the aligned position.

## Options

| Option | Type | Default | Description |
|--------|------|--------|------|
| `enabled` | boolean | `true` | Whether alignment guides are enabled |
| `tolerance` | number | `10` | Snap tolerance in pixels. Snapping is triggered when a node edge or center is closer than this value to an alignment position |
| `sharp` | boolean | `false` | Whether to show truncated alignment guides (displayed only between aligned nodes) |
| `resizing` | boolean | `false` | Whether alignment guides are also shown while resizing nodes |
| `clean` | boolean \| number | `true` | Automatically clear alignment guides. `true` clears immediately; a number is the delay in milliseconds |
| `filter` | function \| string[] | - | Filter nodes that should not participate in alignment calculations |

## Programmatic API

```javascript
// Enable/disable
graph.enableSnapline();
graph.disableSnapline();
graph.toggleSnapline(true);
graph.isSnaplineEnabled();  // boolean

// Hide currently displayed alignment guides
graph.hideSnapline();

// Set a filter
graph.setSnaplineFilter((node) => {
  return node.getData()?.snapable !== false;
});

// Tolerance control
graph.getSnaplineTolerance();      // number, current tolerance value
graph.setSnaplineTolerance(20);    // Set the tolerance

// Sharp (truncated style) control
graph.isSharpSnapline();           // boolean
graph.enableSharpSnapline();       // Enable truncated style
graph.disableSharpSnapline();      // Disable truncated style
graph.toggleSharpSnapline(true);

// Whether alignment guides are also shown during resizing
graph.isSnaplineOnResizingEnabled();   // boolean
graph.enableSnaplineOnResizing();
graph.disableSnaplineOnResizing();
graph.toggleSnaplineOnResizing(true);
```

## Complete Example

```javascript
import { Graph, Snapline } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  grid: { visible: true, size: 10 },
});

graph.use(new Snapline({
  enabled: true,
  tolerance: 15,   // 15 px tolerance
  sharp: true,     // Truncated style
  resizing: true,  // Also align while resizing
}));

// Add sample nodes
graph.addNode({ x: 100, y: 100, width: 120, height: 60, label: 'Node A' });
graph.addNode({ x: 350, y: 200, width: 120, height: 60, label: 'Node B' });
graph.addNode({ x: 200, y: 350, width: 120, height: 60, label: 'Node C' });
// When Node C is dragged to align with the left edge of Node A, a vertical alignment guide appears
```

## Filter Examples

```javascript
// Filter by shape name: only specific shapes participate in alignment
graph.use(new Snapline({
  enabled: true,
  filter: ['rect', 'circle'],  // Only rect and circle nodes participate in alignment
}));

// Filter with a function
graph.use(new Snapline({
  enabled: true,
  filter(node) {
    // Nodes marked as group do not participate in alignment
    return node.getData()?.type !== 'group';
  },
}));
```

## Common Mistakes

### Do Not Configure `snapline` in the Constructor

```javascript
// Incorrect: not supported in 3.x
const graph = new Graph({
  container: 'container',
  snapline: { enabled: true },
});
```

```javascript
// Correct
import { Graph, Snapline } from '@antv/x6';
const graph = new Graph({ container: 'container' });
graph.use(new Snapline({ enabled: true }));
```
