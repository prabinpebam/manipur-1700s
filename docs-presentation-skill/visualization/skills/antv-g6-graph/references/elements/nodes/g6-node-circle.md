---
id: "g6-node-circle"
title: "G6 Circle Node"
description: |
  Use circle nodes (circle) to create graph visualizations. Circle is the most general node shape,
  supporting labels, icons, badges, ports, and multiple states.

library: "g6"
version: "5.x"
category: "elements"
subcategory: "nodes"
tags:
  - "node"
  - "circle"
  - "circle"
  - "node"
  - "network graph"
  - "social network"

related:
  - "g6-node-rect"
  - "g6-node-image"
  - "g6-state-overview"
  - "g6-core-graph-init"

use_cases:
  - "Network topology graphs"
  - "Social relationship graphs"
  - "Knowledge graphs"
  - "General node scenarios"

anti_patterns:
  - "When there are many nodes (>1000), consider performance optimization and avoid complex styles"
  - "Use html or react nodes when complex content must be displayed"

difficulty: "beginner"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
author: "antv-team"
source_url: "https://g6.antv.antgroup.com/manual/element/node/circle"
---

## Core concepts

A circle node (`circle`) is the default node type in G6. Its outer shape is circular and it is suitable for representing non-directional entities.

**Main style properties:**
- `size`: node diameter (px), default 32
- `fill`: fill color
- `stroke`: border color
- `lineWidth`: border width
- `labelText`: label text (callback function)
- `labelPlacement`: label position (`'center'` | `'top'` | `'bottom'` | `'left'` | `'right'`)

## Minimal runnable example

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  width: 640,
  height: 480,
  data: {
    nodes: [
       { id: 'n1', data: { label: 'User A' } },
       { id: 'n2', data: { label: 'User B' } },
       { id: 'n3', data: { label: 'User C' } },
    ],
    edges: [
       { source: 'n1', target: 'n2' },
       { source: 'n2', target: 'n3' },
       { source: 'n1', target: 'n3' },
    ],
  },
  node: {
    type: 'circle',
    style: {
      size: 40,
      fill: '#1783FF',
      stroke: '#fff',
      lineWidth: 2,
      labelText: (d) => d.data.label,
      labelPlacement: 'bottom',
      labelFill: '#333',
    },
  },
  layout: { type: 'circular' },
  behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
});

graph.render();
```

## Common variants

### Coloring by category (palette)

```javascript
node: {
  type: 'circle',
  style: {
    size: 40,
    labelText: (d) => d.data.name,
    labelPlacement: 'bottom',
  },
  palette: {
    type: 'group',
    field: 'category',        // category field in the data
    color: 'tableau10',       // built-in palette
  },
},
```

### Mapping numeric values to node size

```javascript
// Use a transform to map node size
transforms: [
  {
    type: 'map-node-size',
    field: 'value',           // numeric value field in data
    range: [20, 80],          // mapped size range
  },
],
node: {
  type: 'circle',
  style: {
    labelText: (d) => d.data.name,
  },
},
```

### Node with icon

```javascript
node: {
  type: 'circle',
  style: {
    size: 48,
    fill: '#1783FF',
    // icon (requires iconfont or Unicode)
    iconText: '\ue6a7',          // iconfont unicode
    iconFontFamily: 'iconfont',  // font name
    iconFill: '#fff',
    iconFontSize: 20,
    labelText: (d) => d.data.label,
    labelPlacement: 'bottom',
  },
},
```

### Node with badge

```javascript
node: {
  type: 'circle',
  style: {
    size: 40,
    fill: '#1783FF',
    labelText: (d) => d.data.label,
    // badge configuration
    badges: [
      {
        text: '!',
        placement: 'right-top',  // badge position
        fill: '#ff4d4f',
        textFill: '#fff',
        fontSize: 10,
      },
    ],
  },
},
```

### Node with ports

```javascript
// Ports are used to precisely control edge connection positions
node: {
  type: 'circle',
  style: {
    size: 40,
    fill: '#1783FF',
    ports: [
       { key: 'top', placement: 'top' },
       { key: 'bottom', placement: 'bottom' },
       { key: 'left', placement: 'left' },
       { key: 'right', placement: 'right' },
    ],
  },
},
```

### Node state styles

```javascript
node: {
  type: 'circle',
  style: {
    size: 40,
    fill: '#1783FF',
    labelText: (d) => d.data.label,
  },
  state: {
    selected: {
      fill: '#ff7875',
      stroke: '#ff4d4f',
      lineWidth: 3,
      // halo effect
      haloFill: '#ff7875',
      haloLineWidth: 12,
      haloOpacity: 0.25,
    },
    hover: {
      fill: '#40a9ff',
      cursor: 'pointer',
    },
    inactive: {
      opacity: 0.3,
    },
  },
},
// with hover-activate behavior
behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element', 'hover-activate'],
```

## Complete style property reference

```typescript
// common node style properties
interface CircleNodeStyle {
  // shape
  size?: number;                    // node size (diameter)
  
  // fill and stroke
  fill?: string;                    // fill color
  fillOpacity?: number;             // fill opacity 0-1
  stroke?: string;                  // stroke color
  lineWidth?: number;               // stroke width
  lineDash?: number[];              // dashed stroke [dash length, gap length]
  opacity?: number;                 // overall opacity 0-1
  
  // shadow
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  
  // halo (hover/select effect)
  halo?: boolean;                   // whether to show the halo
  haloFill?: string;
  haloLineWidth?: number;
  haloOpacity?: number;
  
  // label
  labelText?: string | ((d: NodeData) => string);
  labelPlacement?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  labelFill?: string;
  labelFontSize?: number;
  labelFontWeight?: string | number;
  labelBackground?: boolean;        // whether to show the label background
  labelBackgroundFill?: string;
  labelBackgroundOpacity?: number;
  labelOffsetX?: number;
  labelOffsetY?: number;
  labelMaxWidth?: number;           // maximum label width (ellipsis when exceeded)
  labelWordWrap?: boolean;          // whether to wrap automatically
  
  // icon
  iconText?: string;                // icon text/unicode
  iconFontFamily?: string;          // icon font
  iconFill?: string;
  iconFontSize?: number;
  iconWidth?: number;
  iconHeight?: number;
  
  // badges
  badges?: BadgeStyle[];
  
  // ports
  ports?: PortStyle[];
  
  // interaction
  cursor?: string;                  // cursor style
}
```

## Common errors

### Error 1: Using the v4 label property

```javascript
// Incorrect: v4 syntax
node: {
  labelCfg: {
    style: { fill: '#333', fontSize: 14 }
  }
}

// Correct: v5 syntax
node: {
  style: {
    labelText: (d) => d.data.label,
    labelFill: '#333',
    labelFontSize: 14,
  }
}
```

### Error 2: Setting label directly in data and forgetting to configure labelText

```javascript
// Incorrect: node data has a label, but style does not reference it
const nodes = [{ id: 'n1', data: { label: 'Node 1' } }];
// node.style.labelText is not configured, so the node will not display a label

// Correct
node: {
  style: {
    labelText: (d) => d.data.label,  // read label from data
  },
},
```

### Error 3: Setting size as an array for a node type that does not support it

```javascript
// Incorrect: setting a [width, height] array for a circle node
node: {
  type: 'circle',
  style: { size: [60, 40] },  // circle only accepts a single numeric value
}

// Correct: circle nodes use a single numeric value
node: {
  type: 'circle',
  style: { size: 60 },
}

// rect nodes can use an array
node: {
  type: 'rect',
  style: { size: [120, 60] },  // [width, height]
}
```