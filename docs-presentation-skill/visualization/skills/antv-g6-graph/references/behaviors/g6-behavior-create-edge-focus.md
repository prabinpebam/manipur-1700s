---
id: "g6-behavior-create-edge-focus"
title: "G6 Create Edge (create-edge) and Focus Element (focus-element)"
description: |
  create-edge: interactively create a new edge between two nodes.
  focus-element: trigger a viewport animation by click/shortcut to focus on a specified element.

library: "g6"
version: "5.x"
category: "behaviors"
subcategory: "interaction"
tags:
  - "interaction"
  - "create edge"
  - "focus"
  - "create-edge"
  - "focus-element"

related:
  - "g6-behavior-click-select"
  - "g6-behavior-drag-element"

difficulty: "intermediate"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
---

## Interactively create edges (create-edge)

Allow users to create new edges between two nodes by dragging or clicking.

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  width: 640,
  height: 480,
  data: {
    nodes: [
       { id: 'n1', data: { label: 'A' } },
       { id: 'n2', data: { label: 'B' } },
       { id: 'n3', data: { label: 'C' } },
    ],
    edges: [],
  },
  node: {
    type: 'circle',
    style: {
      size: 40,
      fill: '#1783FF',
      stroke: '#fff',
      lineWidth: 2,
      labelText: (d) => d.data.label,
      labelPlacement: 'center',
      labelFill: '#fff',
      // Ports (precise connection points)
      ports: [
         { key: 'top',    placement: 'top' },
         { key: 'bottom', placement: 'bottom' },
         { key: 'left',   placement: 'left' },
         { key: 'right',  placement: 'right' },
      ],
    },
  },
  edge: {
    type: 'line',
    style: {
      stroke: '#aaa',
      lineWidth: 1.5,
      endArrow: true,
    },
  },
  layout: { type: 'circular' },
  behaviors: [
    'drag-canvas',
    'zoom-canvas',
    'drag-element',
    {
      type: 'create-edge',
      trigger: 'drag',             // 'drag' (drag) | 'click' (click source -> click target)
      style: {
        // Style of the temporary edge during creation
        stroke: '#1783FF',
        lineWidth: 2,
        lineDash: [4, 2],
        endArrow: true,
      },
      // Callback when edge creation finishes
      onFinish: (edgeData) => {
        console.log('New edge:', edgeData.source, '->', edgeData.target);
        // Additional business data can be appended to the new edge here
        graph.updateEdgeData([{
          ...edgeData,
             { weight: 1, label: 'New connection' },
        }]);
        graph.draw();
      },
      // Return undefined to cancel creation; return modified data to allow creation
      onCreate: (edgeData) => {
        if (edgeData.source === edgeData.target) return undefined; // Disallow self-loops
        return edgeData;
      },
    },
  ],
});

graph.render();
```

### create-edge configuration parameters

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `trigger` | `'drag' \| 'click'` | `'drag'` | Trigger mode |
| `style` | `EdgeStyleProps` | - | Temporary edge style during creation |
| `onFinish` | `(edge: EdgeData) => void` | - | Callback when edge creation finishes |
| `onCreate` | `(edge: EdgeData) => EdgeData \| undefined` | - | Creation interceptor; return undefined to cancel |
| `enable` | `boolean \| ((event) => boolean)` | `true` | Whether to enable |

---

## Focus elements (focus-element)

After clicking an element, smoothly animate the viewport to move to the center of that element.

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  width: 640,
  height: 480,
  data: {
    nodes: Array.from({ length: 30 }, (_, i) => ({
      id: `n${i}`,
           { label: `Node ${i}`, x: Math.random() * 2000, y: Math.random() * 2000 },
    })),
    edges: [],
  },
  node: {
    type: 'circle',
    style: {
      size: 30,
      fill: '#1783FF',
      stroke: '#fff',
      labelText: (d) => d.data.label,
      labelPlacement: 'bottom',
    },
  },
  layout: { type: 'random', width: 2000, height: 2000 },
  behaviors: [
    'drag-canvas',
    'zoom-canvas',
    {
      type: 'focus-element',
      // Animation configuration
      animation: {
        easing: 'ease-in-out',
        duration: 600,
      },
      // Enable condition (by default, clicking any element triggers focus)
      enable: true,
    },
  ],
});

graph.render();
```

### Focus an element through the API

```javascript
// Move the viewport to the specified node with animation
await graph.focusElement('n5', {
  easing: 'ease-in-out',
  duration: 500,
});

// Focus after search
document.getElementById('search').addEventListener('input', async (e) => {
  const keyword = e.target.value;
  const node = graph.getNodeData().find(n => n.data.label.includes(keyword));
  if (node) {
    await graph.focusElement(node.id, { duration: 500 });
    graph.setElementState(node.id, 'selected');
  }
});
```

### focus-element configuration parameters

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `animation` | `ViewportAnimationEffectTiming` | `{ easing: 'ease-in', duration: 500 }` | Viewport animation configuration |
| `enable` | `boolean \| ((event) => boolean)` | `true` | Whether to enable |
