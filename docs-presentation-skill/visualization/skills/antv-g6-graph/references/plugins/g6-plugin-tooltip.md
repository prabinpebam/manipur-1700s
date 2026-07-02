---
id: "g6-plugin-tooltip"
title: "G6 Tooltip Plugin"
description: |
  Use the tooltip plugin to display a detail panel when users hover over or click nodes or edges.
  Supports custom HTML content, positions, trigger modes, and more.

library: "g6"
version: "5.x"
category: "plugins"
subcategory: "interaction"
tags:
  - "plugin"
  - "tooltip"
  - "tip"
  - "hover"
  - "information panel"
  - "plugin"

related:
  - "g6-plugin-minimap"
  - "g6-behavior-click-select"

use_cases:
  - "Show detailed attributes when hovering over nodes"
  - "Show relationship information when hovering over edges"
  - "Show an action panel when clicking elements"

anti_patterns:
  - "Excessive tooltip content can affect performance; consider using a sidebar panel instead"

difficulty: "beginner"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
author: "antv-team"
source_url: "https://g6.antv.antgroup.com/manual/plugin/tooltip"
---

## Minimal Runnable Example

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  width: 640,
  height: 480,
  data: {
    nodes: [
       { id: 'n1', data: { name: 'Alex Zhang', age: 28, dept: 'Engineering' } },
       { id: 'n2', data: { name: 'Li Smith', age: 35, dept: 'Product' } },
    ],
    edges: [
       { id: 'e1', source: 'n1', target: 'n2', data: { relation: 'Colleague', since: 2020 } },
    ],
  },
  node: {
    type: 'circle',
    style: {
      size: 40,
      fill: '#1783FF',
      labelText: (d) => d.data.name,
      labelPlacement: 'bottom',
    },
  },
  layout: { type: 'force' },
  behaviors: ['drag-canvas', 'zoom-canvas'],
  plugins: [
    {
      type: 'tooltip',
      // Custom tooltip content
      getContent: (event, items) => {
        const item = items[0];
        if (!item) return '';
        
        const { data } = item;
        return `
          <div style="padding: 8px 12px; min-width: 120px;">
            <div style="font-weight: bold; margin-bottom: 4px;">${data.name || item.id}</div>
            ${data.age ? `<div>Age: ${data.age}</div>` : ''}
            ${data.dept ? `<div>Department: ${data.dept}</div>` : ''}
            ${data.relation ? `<div>Relationship: ${data.relation}</div>` : ''}
          </div>
        `;
      },
    },
  ],
});

graph.render();
```

## Common Variants

### Show Different Content for Nodes and Edges

```javascript
plugins: [
  {
    type: 'tooltip',
    trigger: 'hover',             // 'hover' | 'click'
    position: 'right',            // 'top' | 'bottom' | 'left' | 'right' | 'top-left', etc.
    enable: (event) => {
      // Show tooltips only for nodes
      return event.targetType === 'node';
    },
    getContent: (event, items) => {
      const [item] = items;
      const d = item.data;
      return `
        <div>
          <h4 style="margin:0 0 8px">${d.name}</h4>
          <table style="border-collapse:collapse">
            ${Object.entries(d).map(([k, v]) => `
              <tr>
                <td style="color:#999;padding:2px 8px 2px 0">${k}</td>
                <td style="font-weight:500">${v}</td>
              </tr>
            `).join('')}
          </table>
        </div>
      `;
    },
  },
],
```

### Trigger Tooltip on Click

```javascript
plugins: [
  {
    type: 'tooltip',
    trigger: 'click',             // Triggered by click
    enterable: true,              // The mouse can enter the tooltip
    getContent: (event, items) => {
      const [item] = items;
      return `<div style="padding:8px">
        <a href="/detail/${item.id}" target="_blank">View details</a>
      </div>`;
    },
  },
],
```

## Parameter Reference

```typescript
interface TooltipOptions {
  trigger?: 'hover' | 'click';          // Trigger mode, default 'hover'
  position?: 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  enable?: boolean | ((event) => boolean);
  getContent?: (event: IPointerEvent, items: ElementDatum[]) => HTMLElement | string;
  onOpenChange?: (open: boolean) => void;
  offset?: [number, number];            // Offset [x, y]
  enterable?: boolean;                  // Whether the mouse can enter the tooltip
  title?: string | ((items) => string); // Tooltip title
  container?: HTMLElement;              // Custom container
  style?: {                             // Style
    ['.g6-tooltip']?: CSSProperties;
  };
}
```
