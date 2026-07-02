---
id: "x6-core-cell-data"
title: "X6 Cell Data Operation APIs (prop/attr/data)"
description: |
  Data read/write APIs for nodes and edges: prop() for general property operations, attr() for style attribute operations, and getData()/setData() for business data operations.
library: x6
version: 3.x
category: "core"
tags:
  - cell
  - data
  - prop
  - attr
  - getData
  - setData
  - node
  - edge
---

# Cell Data Operation APIs

## Overview

Every Cell in X6, whether a node or an edge, provides three layers of data operation APIs:

| API | Purpose | Typical Use Case |
|-----|---------|------------------|
| `prop()` | Read and write any property, such as shape, size, or position | Modify node position or size |
| `attr()` | Read and write style attributes under `attrs` | Modify fill color, border, or text |
| `getData()` / `setData()` | Read and write the `data` field, for business data | Store business state and custom data |

## prop - General Property Operations

`prop()` is the lowest-level property operation method and can read or write any Cell property.

### Reading Properties

```javascript
// Get all properties
const allProps = node.prop();

// Get a specific property
const position = node.prop('position');    // { x: 100, y: 200 }
const shape = node.prop('shape');          // 'rect'

// Get a nested property by path
const fill = node.prop('attrs/body/fill'); // '#fff'
```

### Setting Properties

```javascript
// Set a single property
node.prop('position', { x: 200, y: 300 });

// Set a nested property by path
node.prop('attrs/body/fill', '#f0f0f0');

// Batch-set multiple properties with deep merge
node.prop({
  position: { x: 200, y: 300 },
  size: { width: 120, height: 60 },
});
```

### Deleting Properties

```javascript
// Set to null to delete
node.prop('attrs/body/stroke', null);
```

### setProp / removeProp

```javascript
// setProp is equivalent to prop(key, value)
node.setProp('label', 'Hello');
node.setProp({ label: 'Hello', size: { width: 100, height: 40 } });

// removeProp deletes the specified property
node.removeProp('data');
node.removeProp('attrs/body/stroke');
```

## attr - Style Attribute Operations

`attr()` is a shortcut for `prop('attrs', ...)` and is dedicated to SVG style properties under `attrs`.

### Reading Styles

```javascript
// Get all attrs
const attrs = node.attr();
// { body: { fill: '#fff', stroke: '#333' }, label: { text: 'Hello' } }

// Get the attributes of a specified selector
const bodyAttrs = node.attr('body');        // { fill: '#fff', stroke: '#333' }
const fill = node.attr('body/fill');        // '#fff'
```

### Setting Styles

```javascript
// Set the value at a specified path
node.attr('body/fill', '#ff0000');
node.attr('label/text', 'New Title');

// Batch set
node.attr({
  body: { fill: '#ff0000', stroke: '#333' },
  label: { text: 'New Title', fontSize: 14 },
});
```

### Edge attr Operations

```javascript
edge.attr('line/stroke', '#ff0000');
edge.attr('line/strokeWidth', 3);
edge.attr('line/targetMarker', 'classic');
```

## getData / setData - Business Data Operations

The `data` field stores business data unrelated to rendering and is the most common state storage mechanism.

### Set data during initialization

```javascript
const node = graph.addNode({
  shape: 'rect',
  x: 100, y: 100, width: 120, height: 60,
  data: {
    status: 'running',
    progress: 0.75,
    taskId: 'task-001',
  },
});
```

### Read data

```javascript
const data = node.getData();
// { status: 'running', progress: 0.75, taskId: 'task-001' }
```

### Set data (deep merge, default behavior)

```javascript
// Deep merge: update only specified fields and keep other fields
node.setData({ status: 'completed' });
// data becomes: { status: 'completed', progress: 0.75, taskId: 'task-001' }
```

### Set data (shallow merge)

```javascript
// Shallow merge: Object.assign behavior
node.setData({ status: 'failed', error: 'timeout' }, { deep: false });
```

### Replace data (complete overwrite)

```javascript
// Completely overwrite and discard old data
node.replaceData({ status: 'new', version: 2 });
// Equivalent to
node.setData({ status: 'new', version: 2 }, { overwrite: true });
```

### Delete data

```javascript
node.removeData();
```

## Listen for Data Changes

```javascript
// Listen for data changes on a single node
node.on('change:data', ({ current, previous }) => {
  console.log('data changed from', previous, 'to', current);
});

// Listen for data changes on all nodes through graph
graph.on('node:change:data', ({ node, current, previous }) => {
  console.log(`${node.id} data changed`);
});

// Listen for attrs changes
graph.on('node:change:attrs', ({ node }) => {
  console.log(`${node.id} attrs changed`);
});
```

## Batch Operations

Multiple prop/attr/setData calls trigger multiple events. You can use batch to merge them into one:

```javascript
graph.startBatch('update');
node.prop('position', { x: 200, y: 300 });
node.attr('body/fill', '#ff0000');
node.setData({ status: 'updated' });
graph.stopBatch('update');
// Only one batch:stop event is triggered
```

## Complete Example: Dynamic Status Updates

```javascript
import { Graph, Shape } from '@antv/x6';

// Register an HTML node with status-based rendering
Shape.HTML.register({
  shape: 'status-node',
  effect: ['data'],
  html(node) {
    const { status, label } = node.getData() || {};
    const colors = { running: '#52c41a', error: '#f5222d', pending: '#faad14' };
    const div = document.createElement('div');
    div.style.cssText = `
      width: 100%; height: 100%; display: flex; align-items: center;
      padding: 8px; border: 2px solid ${colors[status] || '#d9d9d9'};
      border-radius: 4px; background: #fff;
    `;
    div.innerHTML = `<span style="color:${colors[status] || '#333'}">${label || 'Node'}</span>`;
    return div;
  },
});

const graph = new Graph({ container: 'container', width: 800, height: 600 });

const node = graph.addNode({
  shape: 'status-node',
  x: 100, y: 100, width: 160, height: 50,
  data: { status: 'pending', label: 'Data Processing' },
});

// Simulate status updates; setData triggers effect re-rendering
setTimeout(() => node.setData({ status: 'running' }), 1000);
setTimeout(() => node.setData({ status: 'error', label: 'Data Processing (Failed)' }), 3000);
```

## Common Mistakes

```javascript
// ❌ Incorrect: directly mutating the object returned by getData() does not trigger updates
const data = node.getData();
data.status = 'done';  // Does not trigger re-rendering!

// ✅ Correct: update through setData
node.setData({ status: 'done' });

// ❌ Incorrect: attr path separator uses '.' instead of '/'
node.attr('body.fill', '#fff');  // Incorrect; it does not take effect

// ✅ Correct: use '/' as the path separator
node.attr('body/fill', '#fff');

// ❌ Incorrect: passing only part of attrs to prop will lose the rest
node.prop('attrs', { body: { fill: '#f00' } });
// This overwrites the entire attrs object and loses other selectors such as label!

// ✅ Correct: use path form or the attr() method
node.prop('attrs/body/fill', '#f00');  // Modify only body.fill
node.attr('body/fill', '#f00');        // Equivalent
```
