---
id: "g6-theme-overview"
title: "G6 Theme System"
description: |
  The theme system in G6 5.x, including how to use the built-in light and dark themes
  and how to switch themes dynamically.

library: "g6"
version: "5.x"
category: "themes"
subcategory: "overview"
tags:
  - "theme system"
  - "theme"
  - "dark"
  - "light"
  - "dark mode"
  - "light mode"

related:
  - "g6-state-overview"
  - "g6-core-graph-init"

use_cases:
  - "Support graph visualizations in both light and dark modes"
  - "Unify the visual style of a graph"

difficulty: "beginner"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
author: "antv-team"
source_url: "https://g6.antv.antgroup.com/manual/theme/overview"
---

## Core Concepts

A G6 v5 theme is a subset of Graph Options and includes:
- Background color (`background`)
- Default node styles (`node`)
- Default edge styles (`edge`)
- Default combo styles (`combo`)

Each section can include base styles, palettes, state styles, and animation configuration.

**Important limitation:** themes support only static values, not callback functions.

## Using Built-in Themes

```javascript
import { Graph } from '@antv/g6';

// Light theme (default)
const graph = new Graph({
  container: 'container',
  data: { nodes: [...], edges: [...] },
  theme: 'light',               // Default value
  layout: { type: 'force' },
  behaviors: ['drag-canvas', 'zoom-canvas'],
});

// Dark theme
const graphDark = new Graph({
  container: 'container-dark',
  theme: 'dark',
  // ...
});

graph.render();
```

## Switching Themes Dynamically

```javascript
// Initialize
const graph = new Graph({
  container: 'container',
  theme: 'light',
  // ...
});
await graph.render();

// Switch the theme
document.getElementById('theme-toggle').addEventListener('click', async () => {
  const currentTheme = graph.getTheme();
  await graph.setTheme(currentTheme === 'light' ? 'dark' : 'light');
  await graph.render();
});
```

## Palette

The palette in a theme automatically assigns colors by category fields:

```javascript
node: {
  // Use a palette to color nodes automatically by category
  palette: {
    type: 'group',        // 'group' = by category | 'value' = continuous mapping by numeric value
    field: 'category',    // Field name in the data
    color: 'tableau10',   // Built-in palette name
    // Optional: custom color list
    // color: ['#ff4d4f', '#1783FF', '#52c41a', '#fa8c16'],
  },
},
```

**Built-in palettes:** `tableau10`, `spectral`, `blues`, `greens`, `oranges`, `reds`, `purples`

## Common Combinations

### Dark Theme + Force-Directed Graph

```javascript
const graph = new Graph({
  container: 'container',
  width: 900,
  height: 600,
  theme: 'dark',
    { nodes: [...], edges: [...] },
  node: {
    style: {
      labelText: (d) => d.data.label,
      labelPlacement: 'bottom',
    },
    palette: {
      type: 'group',
      field: 'type',
      color: 'tableau10',
    },
  },
  layout: { type: 'force', preventOverlap: true },
  behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element-force', 'hover-activate'],
});
```
