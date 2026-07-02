---
id: "g6-pattern-network-graph"
title: "G6 Network Relationship Graph Pattern"
description: |
  Best practices for creating a complete network relationship graph with G6, including force-directed layout,
  node coloring, Tooltip, interactions, and a complete configuration.

library: "g6"
version: "5.x"
category: "patterns"
subcategory: "network"
tags:
  - "Pattern"
  - "Network graph"
  - "Relationship graph"
  - "Knowledge graph"
  - "Social network"
  - "pattern"
  - "network graph"

related:
  - "g6-layout-force"
  - "g6-node-circle"
  - "g6-behavior-hover-activate"
  - "g6-plugin-tooltip"

use_cases:
  - "Social relationship network"
  - "Knowledge graph"
  - "System dependencies"
  - "Any non-hierarchical relationship network"

anti_patterns:
  - "Do not use a network graph for clearly hierarchical data; use a hierarchy graph instead"

difficulty: "intermediate"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
author: "antv-team"
---

## Complete example

```javascript
import { Graph, GraphEvent } from '@antv/g6';

const data = {
  nodes: [
     { id: 'person1', data: { name: 'Alice Zhang', role: 'admin', degree: 5 } },
     { id: 'person2', data: { name: 'Bob Li', role: 'user', degree: 3 } },
     { id: 'person3', data: { name: 'Charlie Wang', role: 'user', degree: 2 } },
     { id: 'person4', data: { name: 'Diana Zhao', role: 'admin', degree: 4 } },
     { id: 'person5', data: { name: 'Evan Sun', role: 'user', degree: 1 } },
     { id: 'product1', data: { name: 'Product A', role: 'product', degree: 4 } },
     { id: 'product2', data: { name: 'Product B', role: 'product', degree: 3 } },
  ],
  edges: [
     { source: 'person1', target: 'person2', data: { type: 'Friend' } },
     { source: 'person1', target: 'person4', data: { type: 'Colleague' } },
     { source: 'person2', target: 'person3', data: { type: 'Friend' } },
     { source: 'person3', target: 'product1', data: { type: 'Purchase' } },
     { source: 'person4', target: 'product1', data: { type: 'Manage' } },
     { source: 'person4', target: 'product2', data: { type: 'Manage' } },
     { source: 'person5', target: 'product2', data: { type: 'Purchase' } },
     { source: 'person1', target: 'product1', data: { type: 'Purchase' } },
  ],
};

const graph = new Graph({
  container: 'container',
  width: 960,
  height: 640,
  data,

  node: {
    type: 'circle',
    style: {
      // Map node size by degree
      size: (d) => 20 + d.data.degree * 6,
      // Label
      labelText: (d) => d.data.name,
      labelPlacement: 'bottom',
      labelFontSize: 12,
      labelFill: '#333',
      cursor: 'pointer',
    },
    // Color by role category
    palette: {
      type: 'group',
      field: 'role',
      color: ['#1783FF', '#52c41a', '#fa8c16'],
    },
    state: {
      active: {
        lineWidth: 3,
        halo: true,
        haloOpacity: 0.25,
        haloLineWidth: 12,
      },
      inactive: {
        opacity: 0.2,
      },
      selected: {
        lineWidth: 3,
        halo: true,
        haloOpacity: 0.3,
        haloLineWidth: 16,
      },
    },
  },

  edge: {
    type: 'line',
    style: {
      stroke: '#e0e0e0',
      lineWidth: 1,
      endArrow: false,
      labelText: (d) => d.data.type,
      labelFontSize: 10,
      labelFill: '#999',
    },
    state: {
      active: {
        stroke: '#1783FF',
        lineWidth: 2,
      },
      inactive: {
        opacity: 0.1,
      },
    },
  },

  layout: {
    type: 'force',
    linkDistance: 100,
    gravity: 10,
  },

  behaviors: [
    'drag-canvas',
    'zoom-canvas',
    'drag-element-force',
    {
      type: 'hover-activate',
      degree: 1,
      state: 'active',
    },
    {
      type: 'click-select',
      state: 'selected',
    },
  ],

  plugins: [
    {
      type: 'tooltip',
      getContent: (event, items) => {
        const [item] = items;
        if (!item) return '';
        const d = item.data;
        return `
          <div style="padding:10px 14px;min-width:140px">
            <div style="font-weight:bold;font-size:14px;margin-bottom:6px">${d.name}</div>
            <div style="color:#666;font-size:12px">Role: ${d.role}</div>
            <div style="color:#666;font-size:12px">Connections: ${d.degree}</div>
          </div>
        `;
      },
    },
    {
      type: 'minimap',
      size: [200, 130],
      position: 'right-bottom',
    },
  ],
});

graph.on(GraphEvent.AFTER_LAYOUT, () => graph.fitView({ padding: 20 }));
graph.render();
```

## Key configuration notes

| Option | Description |
|--------|------|
| `node.style.size` callback | Dynamically set node size based on the `degree` field in the data |
| `node.palette` | Automatically assign colors by the `role` field |
| `drag-element-force` | Drag behavior specialized for force-directed graphs |
| `hover-activate` | Highlight the hovered node and its neighbors; dim other nodes |
| `tooltip` | Show node details on hover |
| `minimap` | Minimap navigation in the lower-right corner |
