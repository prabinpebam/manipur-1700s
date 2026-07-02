---
id: "g6-core-graph-api"
title: "G6 Graph Core API Reference"
description: |
  Common methods on Graph instances: data CRUD operations, viewport control (zooming, panning, fitting),
  element state management, event listening, and dynamic updates for layouts, behaviors, plugins, and more.

library: "g6"
version: "5.x"
category: "core"
subcategory: "api"
tags:
  - "API"
  - "Graph"
  - "data operations"
  - "viewport"
  - "state"
  - "event"

related:
  - "g6-core-graph-init"
  - "g6-core-data-structure"
  - "g6-core-events"

difficulty: "intermediate"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
---

## Data operation APIs

### Reading data

```javascript
// Get all data
const allData = graph.getData();         // { nodes, edges, combos }
const nodes   = graph.getNodeData();     // NodeData[]
const edges   = graph.getEdgeData();     // EdgeData[]
const combos  = graph.getComboData();    // ComboData[]

// Get a single element by ID
const node  = graph.getNodeData('n1');
const edge  = graph.getEdgeData('e1');
const combo = graph.getComboData('c1');

// Get multiple elements by an ID array
const someNodes = graph.getNodeData(['n1', 'n2', 'n3']);
```

### Adding elements

```javascript
// Add a node
graph.addNodeData([
   { id: 'n3', data: { label: 'New Node', type: 'server' } },
]);

// Add an edge
graph.addEdgeData([
   { source: 'n1', target: 'n3', data: { weight: 5 } },
]);

// Add a combo
graph.addComboData([
   { id: 'c1', data: { label: 'New Group' } },
]);

// Call draw after adding data for changes to take effect
graph.draw();
```

### Updating elements

```javascript
// Update node data (only pass the fields that need to be updated)
graph.updateNodeData([
   { id: 'n1', data: { label: 'Updated Label', value: 200 } },
]);

// Update an edge
graph.updateEdgeData([
   { id: 'e1', data: { weight: 10 } },
]);

graph.draw();
```

### Deleting elements

```javascript
graph.removeNodeData(['n3']);         // delete a node (associated edges are deleted automatically)
graph.removeEdgeData(['e1']);         // delete an edge
graph.removeComboData(['c1']);        // delete a combo

graph.draw();
```

### Batch operations (merged into one history record)

```javascript
// Operations inside batch are merged into one render and history record
graph.batch(() => {
  graph.addNodeData([{ id: 'n10', data: { label: 'Batch A' } }]);
  graph.addNodeData([{ id: 'n11', data: { label: 'Batch B' } }]);
  graph.addEdgeData([{ source: 'n10', target: 'n11' }]);
});
graph.draw();
```

---

## Viewport control APIs

### Zooming

```javascript
// Get the current zoom ratio
const zoom = graph.getZoom();         // returns a number; 1.0 = original size

// Zoom to a specified ratio (with animation)
await graph.zoomTo(1.5, { easing: 'ease-out', duration: 300 });

// Relative zoom (based on the current ratio)
await graph.zoom(0.8);                // zoom out to 80% of the current ratio
```

### Panning

```javascript
// Get the current pan offset
const { x, y } = graph.getTranslate();

// Pan to an absolute position
await graph.translateTo({ x: 100, y: 200 });

// Relative pan
await graph.translate({ x: 50, y: 0 });
```

### Fitting the view

```javascript
// Automatically zoom and center all elements
await graph.fitView({
  padding: 20,                        // padding
  direction: 'both',                  // 'x' | 'y' | 'both'
  when: 'overflow',                   // fit only when content overflows
});

// Center only (no zoom)
await graph.fitCenter();

// Focus on a specified element (pan and zoom to that element)
await graph.focusElement('n1', {
  easing: 'ease-in-out',
  duration: 500,
});
```

---

## Element state APIs

```javascript
// Set the state of a single element
graph.setElementState('n1', 'selected');
graph.setElementState('n1', ['selected', 'highlight']);
graph.setElementState('n1', []);          // clear all states

// Batch setting (recommended, better performance)
graph.setElementState({
  'n1': 'selected',
  'n2': ['highlight'],
  'e1': 'active',
});

// Read states
const states = graph.getElementState('n1'); // string[]

// Query elements by state
const selectedNodes = graph.getElementDataByState('node', 'selected');
const activeEdges   = graph.getElementDataByState('edge', 'active');
```

---

## Element visibility APIs

```javascript
// Hide/show (optionally with animation)
graph.hideElement(['n1', 'n2'], true);     // true = with animation
graph.showElement(['n1', 'n2'], true);

// Adjust z-order
graph.frontElement(['n1']);               // bring to front
graph.backElement(['n1']);                // send to back
```

---

## Relationship query APIs

```javascript
// Query all edges related to a node
const relatedEdges  = graph.getRelatedEdgesData('n1');
const incomingEdges = graph.getIncomingEdgesData('n1');
const outgoingEdges = graph.getOutgoingEdgesData('n1');

// Query element type
const type = graph.getElementType('n1'); // 'node' | 'edge' | 'combo' | null
```

---

## Dynamic updates for layouts / behaviors / plugins

```javascript
// Dynamically switch layouts
graph.setLayout({ type: 'circular' });
await graph.layout();                    // rerun layout

// Dynamically update behaviors (no need to render again)
graph.setBehaviors([
  'drag-canvas',
  'zoom-canvas',
    { type: 'click-select', multiple: true },
]);

// Partially update a behavior configuration
graph.updateBehavior({
  key: 'click-select',
  multiple: false,
});

// Dynamically add/remove plugins
graph.setPlugins(['minimap', { type: 'tooltip', getContent: () => '' }]);

// Get a plugin instance (the plugin must have a key)
// plugins: [{ type: 'history', key: 'h1', stackSize: 20 }]
const history = graph.getPluginInstance('h1');
```

---

## Image export

```javascript
// Export as a PNG Data URL
const dataURL = await graph.toDataURL({ type: 'image/png', encoderOptions: 0.9 });

// Download the image
const link = document.createElement('a');
link.download = 'graph.png';
link.href = dataURL;
link.click();
```

---

## Destroy

```javascript
// Destroy the graph instance and release memory
graph.destroy();
```