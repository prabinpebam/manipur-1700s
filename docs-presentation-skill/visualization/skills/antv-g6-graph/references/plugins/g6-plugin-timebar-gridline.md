---
id: "g6-plugin-timebar-gridline"
title: "G6 Timebar (timebar) and Grid Line (grid-line)"
description: |
  timebar: Filters or plays back temporal changes in graph data through a timebar.
  grid-line: Draws grid guide lines on the canvas background, with support for following canvas zooming and panning.

library: "g6"
version: "5.x"
category: "plugins"
subcategory: "display"
tags:
  - "plugin"
  - "timebar"
  - "grid"
  - "timebar"
  - "grid-line"

related:
  - "g6-plugin-minimap"

difficulty: "intermediate"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
---

## Timebar (timebar)

The timebar filters nodes and edges by time range or automatically plays temporal data.

```javascript
import { Graph } from '@antv/g6';

// The node and edge data include timestamp fields
const data = {
  nodes: [
     { id: 'n1', data: { label: 'A', timestamp: 1000 } },
     { id: 'n2', data: { label: 'B', timestamp: 2000 } },
     { id: 'n3', data: { label: 'C', timestamp: 3000 } },
     { id: 'n4', data: { label: 'D', timestamp: 4000 } },
  ],
  edges: [
     { source: 'n1', target: 'n2', data: { timestamp: 1500 } },
     { source: 'n2', target: 'n3', data: { timestamp: 2500 } },
     { source: 'n3', target: 'n4', data: { timestamp: 3500 } },
  ],
};

const graph = new Graph({
  container: 'container',
  data,
  node: {
    type: 'circle',
    style: {
      size: 40,
      fill: '#1783FF',
      stroke: '#fff',
      labelText: (d) => d.data.label,
    },
  },
  layout: { type: 'dagre', rankdir: 'LR' },
  behaviors: ['drag-canvas', 'zoom-canvas'],
  plugins: [
    {
      type: 'timebar',
      // Time data: evenly spaced ticks
       [1000, 1500, 2000, 2500, 3000, 3500, 4000],
      // Function that extracts the time value from data
      getTime: (datum) => datum.data.timestamp,
      // Initial visible time range
      values: [1000, 2500],
      // Element types to apply to
      elementTypes: ['node', 'edge'],
      // Filtering mode
      mode: 'modify',          // 'modify' (modify visibility) | 'visibility' (display none)
      // Timebar type
      timebarType: 'time',     // 'time' | 'chart' (trend line chart)
      // Position
      position: 'bottom',      // 'bottom' | 'top'
      // Size
      width: 600,
      height: 60,
      // Time label formatter
      labelFormatter: (t) => new Date(t).toLocaleDateString(),
      // Change callback
      onChange: (values) => {
        console.log('Time range:', values);
      },
    },
  ],
});

graph.render();
```

### timebar Configuration Options

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `data` | `number[] \| { time, value }[]` | - | **Required**, time tick data |
| `getTime` | `(datum) => number` | - | **Required**, extracts the time value from element data |
| `values` | `number \| [number, number]` | - | Initial time range |
| `elementTypes` | `ElementType[]` | `['node']` | Element types to filter |
| `mode` | `'modify' \| 'visibility'` | `'modify'` | Filtering mode |
| `timebarType` | `'time' \| 'chart'` | `'time'` | Timebar display type |
| `position` | `'bottom' \| 'top'` | `'bottom'` | Position |
| `width` | `number` | `450` | Width |
| `height` | `number` | `60` | Height |
| `labelFormatter` | `(time) => string` | - | Time label formatter |
| `loop` | `boolean` | `false` | Loop during playback |

### timebar Playback Control API

```javascript
const timebar = graph.getPluginInstance('timebar-key');
timebar.play();      // Play automatically
timebar.pause();     // Pause
timebar.forward();   // Move forward one frame
timebar.backward();  // Move backward one frame
timebar.reset();     // Reset to the start
```

---

## Grid Line (grid-line)

Draws a reference grid on the canvas background to assist with alignment and layout.

```javascript
plugins: [
  {
    type: 'grid-line',
    size: 20,                  // Grid cell size (px)
    stroke: '#0001',           // Grid line color (very faint by default)
    lineWidth: 1,
    // Whether the grid follows canvas panning and zooming
    follow: {
      translate: true,         // Follow panning
      zoom: false,             // Do not change with zooming (keep the pixel size)
    },
    // Border
    border: true,
    borderStroke: '#e8e8e8',
    borderLineWidth: 1,
    borderStyle: 'solid',
  },
]
```

### grid-line Configuration Options

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `size` | `number` | `20` | Grid cell size (px) |
| `stroke` | `string` | `'#0001'` | Grid line color |
| `lineWidth` | `number \| string` | `1` | Grid line width |
| `follow` | `boolean \| { translate?, zoom? }` | `false` | Whether to follow canvas transforms |
| `border` | `boolean` | `true` | Whether to draw a border |
| `borderStroke` | `string` | `'#eee'` | Border color |
| `borderLineWidth` | `number` | `1` | Border width |

> **Tip:** `follow: true` is equivalent to `{ translate: true, zoom: true }`, so the grid follows canvas zooming,
> keeping the grid over the visible area with fixed spacing. With `follow: false` (default), the grid stays fixed at its initial position.
