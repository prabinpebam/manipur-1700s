---
id: "x6-core-events"
title: "X6 event system"
description: |
  Listening to and handling events for the X6 canvas, nodes, and edges.
  Includes usage for click, drag, change, keyboard, and other events.

library: "x6"
version: "3.x"
category: "core"
subcategory: "events"
tags:
  - "event"
  - "event"
  - "click"
  - "mouseenter"
  - "mouseleave"
  - "moved"
  - "added"
  - "removed"
  - "changed"
  - "node:click"
  - "edge:click"
  - "blank:click"
  - "interaction"

related:
  - "x6-core-graph-init"
  - "x6-core-node"
  - "x6-core-edge"

use_cases:
  - "Listen for node click events"
  - "Listen for edge selection state"
  - "Listen for clicks on the blank canvas area"
  - "Listen for node movement completion"
  - "Listen for node/edge addition and removal"

anti_patterns:
  - "Do not destructure event callbacks using positional parameters; use object destructuring"
  - "Do not perform heavy recomputation in high-frequency events (mousemove)"

difficulty: "beginner"
completeness: "full"
---

## Event callback format

**Important**: X6 event callback parameters use **object destructuring**, not positional parameters.

```javascript
// ✅ Correct: object destructuring
graph.on('node:click', ({ node, e }) => {
  console.log('Clicked node:', node.id);
});

// ❌ Incorrect: positional parameters
graph.on('node:click', (node, e) => { ... });
```

## Node events

```javascript
// Click
graph.on('node:click', ({ node, e }) => {
  console.log('Clicked:', node.id);
});

// Double click
graph.on('node:dblclick', ({ node, e }) => {
  console.log('Double clicked:', node.id);
});

// Context menu
graph.on('node:contextmenu', ({ node, e }) => {
  e.preventDefault();
});

// Mouse enter/leave
graph.on('node:mouseenter', ({ node }) => {
  node.attr('body/stroke', '#1890ff');
});

graph.on('node:mouseleave', ({ node }) => {
  node.attr('body/stroke', '#8f8f8f');
});

// While the node is moving
graph.on('node:moving', ({ node, x, y }) => {
  console.log('Moving to:', x, y);
});

// Node movement completed
graph.on('node:moved', ({ node }) => {
  const pos = node.getPosition();
  console.log('Moved to:', pos.x, pos.y);
});

// Node size changed
graph.on('node:resized', ({ node }) => {
  const size = node.getSize();
  console.log('Resized to:', size.width, size.height);
});
```

## Edge events

```javascript
// Click
graph.on('edge:click', ({ edge, e }) => {
  console.log('Edge:', edge.id);
});

// Mouse enter/leave
graph.on('edge:mouseenter', ({ edge }) => {
  edge.attr('line/stroke', '#1890ff');
  edge.attr('line/strokeWidth', 2);
});

graph.on('edge:mouseleave', ({ edge }) => {
  edge.attr('line/stroke', '#8f8f8f');
  edge.attr('line/strokeWidth', 1);
});

// Connection completed
graph.on('edge:connected', ({ edge, isNew }) => {
  if (isNew) {
    console.log('New edge created:', edge.id);
  }
});
```

## Canvas events

```javascript
// Click on blank canvas area
graph.on('blank:click', ({ e }) => {
  // Clear selection
  graph.cleanSelection();
});

// Canvas scaling
graph.on('scale', ({ sx, sy }) => {
  console.log('Scale:', sx, sy);
});

// Canvas panning
graph.on('translate', ({ tx, ty }) => {
  console.log('Translate:', tx, ty);
});
```

## Cell change events

```javascript
// Node/edge added
graph.on('cell:added', ({ cell }) => {
  console.log('Added:', cell.id, cell.isNode() ? 'node' : 'edge');
});

// Node/edge removed
graph.on('cell:removed', ({ cell }) => {
  console.log('Removed:', cell.id);
});

// Attribute changed
graph.on('cell:changed', ({ cell, options }) => {
  console.log('Changed:', cell.id);
});
```

## Selection events

```javascript
// Selection changed (requires the selecting plugin)
graph.on('selection:changed', ({ added, removed, selected }) => {
  console.log('Selected nodes:', selected.length);
  added.forEach(cell => cell.attr('body/stroke', '#1890ff'));
  removed.forEach(cell => cell.attr('body/stroke', '#8f8f8f'));
});
```

## History events

```javascript
// Undo/redo (requires the history plugin)
graph.on('history:undo', () => {
  console.log('Undo performed');
});

graph.on('history:redo', () => {
  console.log('Redo performed');
});
```

## Event management

```javascript
// Listen once
graph.once('node:click', ({ node }) => { ... });

// Remove listener
const handler = ({ node }) => { ... };
graph.on('node:click', handler);
graph.off('node:click', handler);

// Remove all listeners
graph.off('node:click');
```

## Common event patterns

### Toggle node state

```javascript
graph.on('node:click', ({ node }) => {
  const data = node.getData() || {};
  const isActive = !data.active;
  node.setData({ active: isActive });
  node.attr('body/fill', isActive ? '#e6f7ff' : '#fff');
  node.attr('body/stroke', isActive ? '#1890ff' : '#8f8f8f');
});
```

### Highlight adjacent nodes

```javascript
graph.on('node:click', ({ node }) => {
  // Reset all node styles
  graph.getNodes().forEach(n => {
    n.attr('body/fill', '#fff');
  });
  // Highlight the current node
  node.attr('body/fill', '#e6f7ff');
  // Highlight adjacent nodes
  const neighbors = graph.getNeighbors(node);
  neighbors.forEach(n => {
    n.attr('body/fill', '#d9f7be');
  });
});
```

### Delete selected cells

```javascript
graph.on('blank:click', () => {
  graph.cleanSelection();
});

// Use with the keyboard plugin
graph.bindKey('delete', () => {
  const cells = graph.getSelectedCells();
  if (cells.length) {
    graph.removeCells(cells);
  }
});
```

## Minimal runnable example

```javascript
import { Graph } from '@antv/x6'

// Create canvas
const graph = new Graph({
  container: document.getElementById('container'),
  width: 800,
  height: 600,
  background: { color: '#F2F7FA' },
  grid: { visible: true },
})

// Listen for canvas events
graph.on('blank:click', ({ e }) => {
  console.log('Clicked blank area')
})

graph.on('cell:added', ({ cell }) => {
  console.log('Added cell:', cell.id)
})

graph.on('cell:removed', ({ cell }) => {
  console.log('Removed cell:', cell.id)
})

// Add node
graph.addNode({
  shape: 'rect',
  x: 100,
  y: 80,
  width: 100,
  height: 40,
  label: 'Node 1',
  attrs: {
    body: { 
      stroke: '#8f8f8f', 
      strokeWidth: 1, 
      fill: '#fff',
      rx: 6,
      ry: 6
    }
  }
})

// Listen for node events
graph.on('node:mouseenter', ({ node }) => {
  node.attr('body/stroke', '#1890ff')
  node.attr('body/strokeWidth', 2)
})

graph.on('node:mouseleave', ({ node }) => {
  node.attr('body/stroke', '#8f8f8f')
  node.attr('body/strokeWidth', 1)
})
```

## Common errors and fixes

### Error: Incorrect Selection constructor usage

```javascript
// ❌ Incorrect: directly using new Selection()
graph.use(new Selection({ enabled: true, rubberband: true }));

// ✅ Correct: use graph.use() and configure the plugin correctly
import { Selection } from '@antv/x6-plugin-selection'
graph.use(new Selection({ enabled: true, rubberband: true }))
```

### Error: Incorrect plugin initialization method

```javascript
// ❌ Incorrect: initialize plugins with the plugins array
const graph = new Graph({
  plugins: [
    new Selection(),
    new Snapline(),
    new Keyboard(),
    new Clipboard(),
    new History()
  ]
});

// ✅ Correct: initialize plugins with the graph.use() method
import { Selection, Snapline, History } from '@antv/x6-plugin-selection'

graph.use(new Selection({ enabled: true, rubberband: true }));
graph.use(new Snapline({ enabled: true }));
graph.use(new History({ enabled: true }));
```

### Error: Incorrect node registration method

```javascript
// ❌ Incorrect: register nodes with graph.registerNode
graph.registerNode('start-event', {
  // ...
}, true);

// ✅ Correct: use a built-in shape directly or create a node through inheritance
const start = graph.addNode({
  shape: 'circle',
  x: 80,
  y: 200,
  width: 40,
  height: 40,
  attrs: { 
    body: { fill: '#52c41a', stroke: '#389e0d' },
    label: { text: 'Start', fill: '#fff', fontSize: 11 }
  },
  ports: {
    groups: {
      out: {
        position: 'right',
        attrs: {
          circle: { r: 4, magnet: true, stroke: '#52c41a', fill: '#fff' }
        }
      }
    },
    items: [{ id: 'out', group: 'out' }]
  }
});
```

### Error: Context is not bound correctly when creating edges

```javascript
// ❌ Incorrect: using graph.createEdge in createEdge
connecting: {
  createEdge() {
    return graph.createEdge({ ... }); // Incorrect: this binding issue
  }
}

// ✅ Correct: use this.createEdge
connecting: {
  createEdge() {
    return this.createEdge({ ... }); // Correct: this points to the graph instance
  }
}
```

### Error: Incomplete node attributes cause rendering issues

```javascript
// ❌ Incorrect: missing required attribute settings
const start = graph.addNode({
  shape: 'circle',
  x: 80,
  y: 200,
  width: 40,
  height: 40
});

// ✅ Correct: set complete node attributes
const start = graph.addNode({
  shape: 'circle',
  x: 80,
  y: 200,
  width: 40,
  height: 40,
  attrs: { 
    body: { fill: '#52c41a', stroke: '#389e0d' },
    label: { text: 'Start', fill: '#fff', fontSize: 11 }
  },
  ports: {
    groups: {
      out: {
        position: 'right',
        attrs: {
          circle: { r: 4, magnet: true, stroke: '#52c41a', fill: '#fff' }
        }
      }
    },
    items: [{ id: 'out', group: 'out' }]
  }
});
```