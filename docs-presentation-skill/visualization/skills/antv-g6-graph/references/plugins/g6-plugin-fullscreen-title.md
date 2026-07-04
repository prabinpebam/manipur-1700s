---
id: "g6-plugin-fullscreen-title"
title: "G6 Fullscreen Plugin + Title Plugin (fullscreen / title)"
description: |
  fullscreen: Expands the graph visualization to the full screen, with support for keyboard shortcuts and programmatic control.
  title: Adds a main title and subtitle to the graph, with customizable position, fonts, and styles.

library: "g6"
version: "5.x"
category: "plugins"
subcategory: "ui"
tags:
  - "fullscreen"
  - "title"
  - "full screen"
  - "heading"
  - "graph title"
  - "immersive"

related:
  - "g6-plugin-contextmenu-toolbar"
  - "g6-plugin-history-legend"

difficulty: "beginner"
completeness: "full"
created: "2026-04-16"
updated: "2026-04-16"
---

## Title Plugin (title)

Adds a main title and subtitle to the graph canvas, with support for custom fonts, colors, alignment, and other styles.

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  data: {
    nodes: [
      { id: 'n1', data: { label: 'Node 1' } },
      { id: 'n2', data: { label: 'Node 2' } },
    ],
    edges: [{ source: 'n1', target: 'n2' }],
  },
  layout: { type: 'force' },
  behaviors: ['drag-canvas', 'zoom-canvas'],
  plugins: [
    {
      type: 'title',
      key: 'chart-title',
      title: 'Knowledge Graph',         // Main title text
      subtitle: 'Data source: internal system', // Subtitle text
      align: 'left',           // 'left' | 'center' | 'right'
      size: 48,                // Title area height (px), default 44
      padding: [16, 24, 0, 24], // [top, right, bottom, left]
      spacing: 8,              // Spacing between the main title and subtitle (px)
    },
  ],
});

graph.render();
```

### title Configuration Options

**Container configuration:**

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `type` | `string` | `'title'` | Plugin type |
| `key` | `string` | - | Unique identifier |
| `title` | `string` | - | **Required**: main title text |
| `subtitle` | `string` | - | Subtitle text |
| `align` | `'left' \| 'center' \| 'right'` | `'left'` | Title alignment |
| `size` | `number` | `44` | Title area height (px) |
| `padding` | `number \| number[]` | `[16,24,0,24]` | Padding |
| `spacing` | `number` | `8` | Spacing between the main title and subtitle |

**Main title styles (titleXxx):**

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `titleFontSize` | `number` | `16` | Font size |
| `titleFontWeight` | `number` | `bold` | Font weight |
| `titleFill` | `string` | `'#1D2129'` | Font color |
| `titleFillOpacity` | `number` | `0.9` | Font opacity |
| `titleFontFamily` | `string` | `'system-ui, sans-serif'` | Font family |

**Subtitle styles (subtitleXxx):**

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `subtitleFontSize` | `number` | `12` | Font size |
| `subtitleFontWeight` | `number` | `normal` | Font weight |
| `subtitleFill` | `string` | `'#1D2129'` | Font color |
| `subtitleFillOpacity` | `number` | `0.65` | Font opacity |

### Complete Style Example

```javascript
plugins: [
  {
    type: 'title',
    key: 'title',
    align: 'center',
    size: 60,
    spacing: 4,
    // Main title
    title: 'Organization Chart',
    titleFontSize: 20,
    titleFontWeight: 600,
    titleFill: '#262626',
    // Subtitle
    subtitle: '2026 Q1 · 120 people in total',
    subtitleFontSize: 13,
    subtitleFill: '#8c8c8c',
  },
]
```

### Dynamically Updating the Title

```javascript
graph.updatePlugin({ key: 'title', title: 'New Title', subtitle: 'Updated at: 2026-04-16' });
```

---

## Fullscreen Plugin (fullscreen)

Expands the graph visualization to the full screen, supports keyboard shortcut triggers or programmatic control through the API, and provides enter and exit callbacks.

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  data: {
    nodes: Array.from({ length: 20 }, (_, i) => ({ id: `n${i}` })),
  },
  layout: { type: 'force' },
  behaviors: ['drag-canvas', 'zoom-canvas'],
  plugins: [
    {
      type: 'fullscreen',
      key: 'fullscreen',
      autoFit: true,     // Automatically fit the canvas size after entering full screen
      trigger: {
        request: 'F',    // Press F to enter full screen
        exit: 'Escape',  // Press Esc to exit full screen
      },
      onEnter: () => console.log('Entered full screen'),
      onExit: () => console.log('Exited full screen'),
    },
  ],
});

graph.render();
```

### fullscreen Configuration Options

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `type` | `string` | `'fullscreen'` | Plugin type |
| `key` | `string` | - | Unique identifier (required for programmatic control) |
| `autoFit` | `boolean` | `true` | Whether to automatically fit the canvas size after entering full screen |
| `trigger` | `{ request?: string; exit?: string }` | - | Keyboard shortcut triggers |
| `onEnter` | `() => void` | - | Callback when entering full screen |
| `onExit` | `() => void` | - | Callback when exiting full screen |

### Programmatic Fullscreen Control

```javascript
const graph = new Graph({
  plugins: [{ type: 'fullscreen', key: 'fs' }],
});

// Control through the API
const fsPlugin = graph.getPluginInstance('fs');
fsPlugin.request();  // Enter full screen
fsPlugin.exit();     // Exit full screen
```

### Using with a Toolbar

```javascript
plugins: [
  { type: 'fullscreen', key: 'fullscreen' },
  {
    type: 'toolbar',
    position: 'top-left',
    onClick: (item) => {
      const fs = graph.getPluginInstance('fullscreen');
      if (item === 'fullscreen') fs.request();
      if (item === 'exit-fullscreen') fs.exit();
    },
    getItems: () => [
      { id: 'fullscreen', value: 'fullscreen' },
      { id: 'exit-fullscreen', value: 'exit-fullscreen' },
    ],
  },
]
```

---

## Combined Title + Fullscreen Example

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  width: 900,
  height: 600,
  data: {
    nodes: Array.from({ length: 15 }, (_, i) => ({
      id: `n${i}`,
      data: { label: `Node ${i}` },
    })),
    edges: Array.from({ length: 12 }, (_, i) => ({
      source: `n${i % 10}`,
      target: `n${(i + 3) % 15}`,
    })),
  },
  node: {
    style: {
      labelText: (d) => d.data.label,
      labelPlacement: 'bottom',
    },
  },
  layout: { type: 'force', preventOverlap: true },
  behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
  plugins: [
    {
      type: 'title',
      title: 'Relationship Network Graph',
      subtitle: 'Based on a force-directed layout',
      align: 'center',
    },
    {
      type: 'fullscreen',
      key: 'fs',
      autoFit: true,
      trigger: { request: 'F', exit: 'Escape' },
    },
    {
      type: 'toolbar',
      position: 'top-right',
      onClick: (item) => {
        if (item === 'fullscreen') graph.getPluginInstance('fs').request();
      },
      getItems: () => [{ id: 'fullscreen', value: 'fullscreen' }],
    },
  ],
});

graph.render();
```
