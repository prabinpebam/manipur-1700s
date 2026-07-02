---
id: "g6-plugin-minimap"
title: "G6 Minimap Plugin (Minimap)"
description: |
  Use the minimap plugin to display a global overview in a corner of the canvas,
  helping users quickly navigate and locate areas in large graphs.

library: "g6"
version: "5.x"
category: "plugins"
subcategory: "navigation"
tags:
  - "plugin"
  - "minimap"
  - "minimap"
  - "navigation"
  - "large graph"
  - "plugin"

related:
  - "g6-plugin-tooltip"
  - "g6-behavior-canvas-nav"

use_cases:
  - "Global navigation for large-scale graphs"
  - "Quickly locating specific regions"

anti_patterns:
  - "React nodes (html type) do not support minimap rendering"
  - "A minimap provides limited value when the graph has few nodes"

difficulty: "beginner"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
author: "antv-team"
source_url: "https://g6.antv.antgroup.com/manual/plugin/minimap"
---

## Minimal Runnable Example

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  width: 900,
  height: 600,
   data: { nodes: [...], edges: [...] },
  layout: { type: 'force' },
  behaviors: ['drag-canvas', 'zoom-canvas'],
  plugins: [
    {
      type: 'minimap',
      size: [200, 120],           // Minimap size [width, height]
      position: 'right-bottom',   // Position
    },
  ],
});

graph.render();
```

## Common Variants

### Complete Configuration

```javascript
plugins: [
  {
    type: 'minimap',
    // Size
    size: [240, 160],
    // Position: preset value or [x, y] coordinates
    position: 'right-bottom',     // 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom'
    // Or use a custom position
    // position: [20, 20],        // [right, bottom] distance
    // Minimap rendering mode
    shape: 'key',                 // 'key'=simplified rendering (better performance) | 'delegate'=delegate rendering
    // Viewport mask style
    maskStyle: {
      fill: 'rgba(0, 0, 0, 0.1)',
      stroke: '#1783FF',
      lineWidth: 1,
    },
    // Container style
    containerStyle: {
      background: '#f5f5f5',
      border: '1px solid #d9d9d9',
      borderRadius: '4px',
    },
    // Padding
    padding: 10,
    // Refresh delay (ms)
    delay: 200,
  },
]
```

## Parameter Reference

```typescript
interface MinimapOptions {
  size?: [number, number];
  position?: 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom' | [number, number];
  shape?: 'key' | 'delegate';
  maskStyle?: ShapeStyle;
  containerStyle?: CSSProperties;
  padding?: number;
  delay?: number;
  filter?: (id: string, elementType: string) => boolean;  // Filter elements that should not be displayed
}
```
