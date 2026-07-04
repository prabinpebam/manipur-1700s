---
id: "g6-plugin-contextmenu-toolbar"
title: "G6 Context Menu (contextmenu) and Toolbar (toolbar)"
description: |
  contextmenu: Opens an action menu when an element is right-clicked.
  toolbar: Displays toolbar buttons in a canvas corner, such as zoom, fit, and undo.

library: "g6"
version: "5.x"
category: "plugins"
subcategory: "interaction"
tags:
  - "plugin"
  - "context menu"
  - "toolbar"
  - "contextmenu"
  - "toolbar"

related:
  - "g6-plugin-tooltip"
  - "g6-plugin-history"

difficulty: "intermediate"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
---

## Context Menu (contextmenu)

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  data: {
    nodes: [
       { id: 'n1', data: { label: 'User A' } },
       { id: 'n2', data: { label: 'User B' } },
    ],
    edges: [{ source: 'n1', target: 'n2' }],
  },
  node: {
    type: 'circle',
    style: {
      size: 40,
      fill: '#1783FF',
      stroke: '#fff',
      labelText: (d) => d.data.label,
      labelPlacement: 'bottom',
    },
  },
  layout: { type: 'circular' },
  behaviors: ['drag-canvas', 'zoom-canvas'],
  plugins: [
    {
      type: 'contextmenu',
      trigger: 'contextmenu',          // 'click' | 'contextmenu' (default)
      // Return the menu item list
      getItems: (event) => {
        // Return different menus based on the clicked element type
        if (event.targetType === 'node') {
          return [
             { id: 'view',   value: 'view',   name: 'View details' },
             { id: 'edit',   value: 'edit',   name: 'Edit node' },
             { id: 'delete', value: 'delete', name: 'Delete node' },
          ];
        }
        if (event.targetType === 'edge') {
          return [
             { id: 'delete', value: 'delete', name: 'Delete edge' },
          ];
        }
        // Click the canvas
        return [
           { id: 'fit',   value: 'fit',   name: 'Fit view' },
           { id: 'reset', value: 'reset', name: 'Reset view' },
        ];
      },
      // Menu item click callback
      onClick: (value, target, current) => {
        if (value === 'delete') {
          const id = current.id;
          if (current.targetType === 'node') {
            graph.removeNodeData([id]);
          } else {
            graph.removeEdgeData([id]);
          }
          graph.draw();
        }
        if (value === 'fit') {
          graph.fitView();
        }
      },
      // Offset [x, y]
      offset: [4, 4],
    },
  ],
});

graph.render();
```

### contextmenu Configuration Parameters

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `trigger` | `'click' \| 'contextmenu'` | `'contextmenu'` | Trigger mode |
| `getItems` | `(event) => Item[] \| Promise<Item[]>` | - | Menu item generation function; mutually exclusive with `getContent` |
| `getContent` | `(event) => HTMLElement \| string` | - | Fully custom menu HTML |
| `onClick` | `(value, target, current) => void` | - | Menu item click callback |
| `offset` | `[number, number]` | `[4, 4]` | Menu offset |
| `enable` | `boolean \| ((event) => boolean)` | `true` | Whether to enable the menu |
| `className` | `string` | `'g6-contextmenu'` | CSS class name for the menu container |

---

## Toolbar (toolbar)

```javascript
plugins: [
  {
    type: 'toolbar',
    position: 'top-right',             // Toolbar position
    getItems: () => [
       { id: 'zoom-in',   value: 'zoom-in',   name: 'Zoom in' },
       { id: 'zoom-out',  value: 'zoom-out',  name: 'Zoom out' },
       { id: 'fit',       value: 'fit',       name: 'Fit view' },
       { id: 'undo',      value: 'undo',      name: 'Undo' },
       { id: 'redo',      value: 'redo',      name: 'Redo' },
       { id: 'download',  value: 'download',  name: 'Export image' },
    ],
    onClick: async (value) => {
      if (value === 'zoom-in') await graph.zoomTo(graph.getZoom() * 1.2);
      if (value === 'zoom-out') await graph.zoomTo(graph.getZoom() / 1.2);
      if (value === 'fit') await graph.fitView();
    },
    // Custom style
    style: {
      display: 'flex',
      gap: '4px',
      padding: '4px',
      background: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      borderRadius: '4px',
    },
  },
],
```

### toolbar Configuration Parameters

| Parameter | Type | Default | Description |
|------|------|--------|------|
| `position` | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'top-left'` | Toolbar position |
| `getItems` | `() => ToolbarItem[] \| Promise<ToolbarItem[]>` | - | **Required**. Toolbar item list |
| `onClick` | `(value: string, target: Element) => void` | - | Click callback |
| `className` | `string` | - | Toolbar CSS class name |
| `style` | `Partial<CSSStyleDeclaration>` | - | Toolbar container style |

**ToolbarItem:**
```typescript
interface ToolbarItem {
  id: string;
  value: string;     // The value parameter passed to the click callback
  name?: string;     // Display text or title
  icon?: string;     // SVG icon string
}
```
