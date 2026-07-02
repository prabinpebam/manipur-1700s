---
id: "g6-core-events"
title: "G6 Event System"
description: |
  G6 v5 event system: how to listen for element events (node/edge/combo click, hover, drag),
  canvas events, and graph lifecycle events, with common event lists.

library: "g6"
version: "5.x"
category: "core"
subcategory: "events"
tags:
  - "event"
  - "listening"
  - "node:click"
  - "canvas"
  - "lifecycle"

related:
  - "g6-core-graph-api"
  - "g6-behavior-click-select"

difficulty: "intermediate"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
---

## Event listening basics

```javascript
// Listen for an event
graph.on('node:click', (event) => {
  const { target, targetType } = event;
  console.log('clicked node:', target.id);
});

// Cancel a listener (pass the same function reference)
const handler = (e) => console.log(e);
graph.on('node:click', handler);
graph.off('node:click', handler);

// Cancel all listeners for this event
graph.off('node:click');
```

---

## Element events

Element events use the format `{elementType}:{eventType}`, such as `node:click` and `edge:pointerover`.

| Event name | Description |
|--------|------|
| `node:click` | Click a node |
| `node:dblclick` | Double-click a node |
| `node:pointerover` | Pointer enters a node |
| `node:pointerout` | Pointer leaves a node |
| `node:pointerdown` | Mouse/touch presses a node |
| `node:pointerup` | Mouse/touch is released |
| `node:contextmenu` | Right-click a node |
| `node:dragstart` | Start dragging a node |
| `node:drag` | Dragging a node |
| `node:dragend` | Finish dragging a node |
| `edge:click` | Click an edge |
| `edge:pointerover` | Pointer enters an edge |
| `combo:click` | Click a combo |
| `combo:dblclick` | Double-click a combo |

### Event object properties

```typescript
interface IElementEvent {
  target: DisplayObject;    // graph shape object that triggered the event
  targetType: string;       // 'node' | 'edge' | 'combo' | 'canvas'
  originalEvent: Event;     // original DOM event
  // Coordinates in the canvas coordinate system
  canvas: { x: number; y: number };
  // Coordinates in the viewport coordinate system
  viewport: { x: number; y: number };
  // Coordinates in the client coordinate system
  client: { x: number; y: number };
}
```

### Typical usage

```javascript
// Get data when clicking a node
graph.on('node:click', (event) => {
  const nodeId = event.target.id;
  const nodeData = graph.getNodeData(nodeId);
  console.log(nodeData);
});

// Highlight an edge on hover
graph.on('edge:pointerover', (event) => {
  graph.setElementState(event.target.id, 'active');
});
graph.on('edge:pointerout', (event) => {
  graph.setElementState(event.target.id, []);
});

// Context menu
graph.on('node:contextmenu', (event) => {
  event.originalEvent.preventDefault();
  console.log('right-clicked node:', event.target.id);
});
```

---

## Canvas events

| Event name | Description |
|--------|------|
| `canvas:click` | Click a blank area of the canvas |
| `canvas:dblclick` | Double-click the canvas |
| `canvas:pointerdown` | Mouse presses the canvas |
| `canvas:pointerup` | Mouse is released |
| `canvas:pointermove` | Mouse moves on the canvas |
| `canvas:wheel` | Canvas wheel event |
| `canvas:contextmenu` | Right-click the canvas |

```javascript
// Click a blank area to clear selection
graph.on('canvas:click', () => {
  const selected = graph.getElementDataByState('node', 'selected');
  selected.forEach(n => graph.setElementState(n.id, []));
});
```

---

## Graph lifecycle events

```javascript
import { GraphEvent } from '@antv/g6';

// Rendering completed
graph.on(GraphEvent.AFTER_RENDER, () => {
  console.log('graph rendering completed');
});

// Layout completed
graph.on(GraphEvent.AFTER_LAYOUT, () => {
  console.log('layout completed');
});

// Elements created (batch)
graph.on(GraphEvent.AFTER_ELEMENT_CREATE, (event) => {
  console.log('new elements:', event.data);
});

// Viewport transform (zooming/panning)
graph.on(GraphEvent.AFTER_TRANSFORM, (event) => {
  const { translate, zoom } = event.data;
  console.log('viewport transform:', zoom);
});
```

### Common lifecycle events

| Event constant | Event name | Trigger timing |
|----------|--------|---------|
| `GraphEvent.BEFORE_RENDER` | `beforerender` | Before render() starts |
| `GraphEvent.AFTER_RENDER` | `afterrender` | After render() completes |
| `GraphEvent.BEFORE_DRAW` | `beforedraw` | Before draw() starts |
| `GraphEvent.AFTER_DRAW` | `afterdraw` | After draw() completes |
| `GraphEvent.AFTER_LAYOUT` | `afterlayout` | After layout calculation completes |
| `GraphEvent.AFTER_ELEMENT_CREATE` | `afterelementcreate` | After elements are added |
| `GraphEvent.AFTER_ELEMENT_UPDATE` | `afterelementupdate` | After elements are updated |
| `GraphEvent.AFTER_ELEMENT_DESTROY` | `afterelementdestroy` | After elements are deleted |
| `GraphEvent.AFTER_TRANSFORM` | `aftertransform` | After viewport transform |
| `GraphEvent.BEFORE_DESTROY` | `beforedestroy` | Before destroy() |

---

## Common patterns

### Update coordinates after dragging a node

```javascript
graph.on('node:dragend', (event) => {
  const nodeId = event.target.id;
  const { x, y } = graph.getNodeData(nodeId);
  console.log(`node ${nodeId} new coordinates: (${x}, ${y})`);
});
```

### Dynamically update tooltip data

```javascript
graph.on('node:pointerover', async (event) => {
  const nodeId = event.target.id;
  const detail = await fetchNodeDetail(nodeId);
  graph.updateNodeData([{ id: nodeId, data: { ...detail } }]);
});
```