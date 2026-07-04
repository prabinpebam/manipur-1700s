---
id: "g6-plugin-fisheye-hull-watermark"
title: "G6 Fisheye Magnification (fisheye), Hull Enclosure (hull), and Watermark (watermark)"
description: |
  fisheye: Focus-plus-context magnifier effect around the mouse position.
  hull: Draws an enclosing contour around a group of nodes, such as a convex or concave hull.
  watermark: Adds a text or image watermark to the canvas.

library: "g6"
version: "5.x"
category: "plugins"
subcategory: "display"
tags:
  - "plugin"
  - "fisheye"
  - "hull"
  - "watermark"
  - "fisheye"
  - "hull"
  - "watermark"

related:
  - "g6-plugin-minimap"
  - "g6-plugin-tooltip"

difficulty: "advanced"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
---

## Fisheye Magnification (fisheye)

A fisheye lens magnifies the local area near the mouse while keeping the global context visible.

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  data: {
    nodes: Array.from({ length: 50 }, (_, i) => ({
      id: `n${i}`,
           { label: `N${i}` },
    })),
    edges: Array.from({ length: 60 }, (_, i) => ({
      source: `n${i % 25}`,
      target: `n${(i * 3 + 7) % 50}`,
    })),
  },
  node: {
    type: 'circle',
    style: {
      size: 20,
      fill: '#1783FF',
      stroke: '#fff',
      labelText: (d) => d.data.label,
      labelPlacement: 'bottom',
      labelFontSize: 10,
    },
  },
  layout: { type: 'force', preventOverlap: true, nodeSize: 20 },
  behaviors: ['drag-canvas', 'zoom-canvas'],
  plugins: [
    {
      type: 'fisheye',
      trigger: 'pointermove',        // 'pointermove' | 'drag' | 'click'
      r: 120,                        // Fisheye lens radius (px)
      d: 1.5,                        // Magnification distortion coefficient (higher values increase magnification)
      // Adjust the radius with the mouse wheel
      scaleRBy: 'wheel',
      // Lens style
      style: {
        fill: 'rgba(255,255,255,0.1)',
        stroke: '#1783FF',
        lineWidth: 1,
      },
      // Node style overrides inside the magnified area
      nodeStyle: {
        labelFontSize: 14,
        labelFontWeight: 'bold',
      },
    },
  ],
});

graph.render();
```

### fisheye Configuration Parameters

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `trigger` | `string` | `'pointermove'` | Event that triggers fisheye movement |
| `r` | `number` | `120` | Lens radius (px) |
| `d` | `number` | `1.5` | Distortion coefficient; higher values increase magnification |
| `scaleRBy` | `'wheel' \| 'drag'` | - | Adjust radius with the mouse wheel or by dragging |
| `scaleDBy` | `'wheel' \| 'drag'` | - | Adjust distortion with the mouse wheel or by dragging |
| `style` | `Partial<CircleStyleProps>` | - | Lens appearance style |
| `nodeStyle` | `NodeStyle \| ((d) => NodeStyle)` | - | Node style inside the magnified area |

---

## Hull Enclosure (hull)

Draws a convex or concave hull contour around a specified set of nodes. This is suitable for group visualization.

```javascript
plugins: [
  {
    type: 'hull',
    // Define one or more hulls
    hulls: [
      {
        id: 'hull-team-a',
        members: ['n1', 'n2', 'n3'],   // Node ID list
        type: 'smooth-convex',          // 'convex' | 'smooth-convex' | 'concave'
        padding: 20,                    // Outer expansion distance of the contour
        style: {
          fill: 'rgba(23, 131, 255, 0.1)',
          stroke: '#1783FF',
          lineWidth: 2,
        },
        labelText: 'Team A',
        labelPlacement: 'top',
      },
      {
        id: 'hull-team-b',
        members: ['n4', 'n5', 'n6'],
        type: 'smooth-convex',
        padding: 20,
        style: {
          fill: 'rgba(82, 196, 26, 0.1)',
          stroke: '#52c41a',
          lineWidth: 2,
        },
        labelText: 'Team B',
      },
    ],
  },
],
```

### Hull Type Descriptions

| Type | Description |
|------|------|
| `convex` | Minimum convex hull that fits the boundary |
| `smooth-convex` | Smooth convex hull; the default and recommended option |
| `concave` | Concave hull that can avoid internal holes |

---

## Watermark (watermark)

```javascript
plugins: [
  // Text watermark
  {
    type: 'watermark',
    text: 'Internal file · do not distribute',
    textFill: '#ccc',
    textFontSize: 14,
    textFontFamily: 'Arial',
    opacity: 0.3,
    rotate: -Math.PI / 6,   // Rotation angle (radians)
    width: 200,
    height: 100,
  },
  // Image watermark (choose one of the two options)
  // {
  //   type: 'watermark',
  //   imageURL: 'https://example.com/logo.png',
  //   width: 120,
  //   height: 40,
  //   opacity: 0.15,
  // },
],
```

### watermark Configuration Parameters

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `text` | `string` | - | Text watermark content; mutually exclusive with `imageURL` |
| `imageURL` | `string` | - | Image watermark URL |
| `textFill` | `string` | `'#000'` | Text color |
| `textFontSize` | `number` | `14` | Font size |
| `opacity` | `number` | `0.2` | Watermark opacity |
| `rotate` | `number` | `Math.PI/12` | Rotation angle (radians) |
| `width` | `number` | `200` | Width of a single watermark |
| `height` | `number` | `100` | Height of a single watermark |
