---
id: "g6-node-image"
title: "G6 Image Node"
description: |
  Use image nodes (image) to display image content such as avatars and icons.
  Supports circle clipping, labels, states, and more.

library: "g6"
version: "5.x"
category: "elements"
subcategory: "nodes"
tags:
  - "node"
  - "image"
  - "image"
  - "avatar"
  - "icon"
  - "avatar"

related:
  - "g6-node-circle"
  - "g6-node-rect"
  - "g6-core-data-structure"

use_cases:
  - "User avatar social relationship graphs"
  - "Enterprise relationship graphs with logos"
  - "Iconified system architecture graphs"

anti_patterns:
  - "When there are many images, pay attention to performance and avoid loading large graphs"
  - "When the network is unavailable, image nodes may display as blank; set fallback styles"

difficulty: "beginner"
completeness: "full"
created: "2026-04-15"
updated: "2026-04-15"
author: "antv-team"
source_url: "https://g6.antv.antgroup.com/manual/element/node/image"
---

## Core concepts

An image node (`image`) renders a node as an image and supports URL images, Base64 images, and more.

**Main properties:**
- `src`: image URL (callback function that reads from data)
- `size`: node size
- `labelText`: label text

## Minimal runnable example

```javascript
import { Graph } from '@antv/g6';

const graph = new Graph({
  container: 'container',
  width: 640,
  height: 480,
  data: {
    nodes: [
      {
        id: 'n1',
        data: {
          name: 'Zhang San',
          avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        },
      },
      {
        id: 'n2',
        data: {
          name: 'Li Si',
          avatar: 'https://gw.alipayobjects.com/zos/antfincdn/YXH2wo1%26Kb/Avatar.png',
        },
      },
    ],
    edges: [
       { source: 'n1', target: 'n2' },
    ],
  },
  node: {
    type: 'image',
    style: {
      size: 60,
      src: (d) => d.data.avatar,         // get image URL from data
      labelText: (d) => d.data.name,
      labelPlacement: 'bottom',
    },
  },
  layout: { type: 'circular' },
  behaviors: ['drag-canvas', 'zoom-canvas', 'drag-element'],
});

graph.render();
```

## Common variants

### Circular avatar (clipped as a circle)

```javascript
node: {
  type: 'image',
  style: {
    size: 60,
    src: (d) => d.data.avatar,
    // circle clipping: implemented by setting clipCfg
    clipType: 'circle',
    clipR: 30,           // same as size / 2
    labelText: (d) => d.data.name,
    labelPlacement: 'bottom',
    stroke: '#91caff',
    lineWidth: 2,
  },
},
```

### Image node with status badge

```javascript
node: {
  type: 'image',
  style: {
    size: 60,
    src: (d) => d.data.avatar,
    labelText: (d) => d.data.name,
    labelPlacement: 'bottom',
    // top-right badge (status indicator)
    badges: [
      {
        text: (d) => d.data.online ? 'online' : 'offline',
        placement: 'right-bottom',
        fill: (d) => d.data.online ? '#52c41a' : '#d9d9d9',
        textFill: '#fff',
      },
    ],
  },
},
```

### Mixing local and remote images

```javascript
const graph = new Graph({
  container: 'container',
  width: 640,
  height: 480,
  data: {
    nodes: [
      {
        id: 'github',
        data: {
          name: 'GitHub',
          // Use an online icon
          icon: 'https://github.githubassets.com/favicons/favicon.svg',
        },
      },
      {
        id: 'npm',
        data: {
          name: 'NPM',
          icon: 'https://static.npmjs.com/favicon-32x32.png',
        },
      },
    ],
    edges: [{ source: 'github', target: 'npm' }],
  },
  node: {
    type: 'image',
    style: {
      size: 50,
      src: (d) => d.data.icon,
      labelText: (d) => d.data.name,
      labelPlacement: 'bottom',
    },
  },
  layout: { type: 'force', linkDistance: 150 },
  behaviors: ['drag-canvas', 'zoom-canvas'],
});
```

## Common errors

### Error 1: Writing src as a static string

```javascript
// Incorrect: all nodes display the same image
node: {
  type: 'image',
  style: {
    src: 'https://example.com/avatar.png',  // static value, same for all nodes
  },
}

// Correct: use a callback function to read from data
node: {
  type: 'image',
  style: {
    src: (d) => d.data.avatar,  // each node uses its own image
  },
}
```

### Error 2: Image loading failure causes a blank node

```javascript
// Provide a default fallback image
node: {
  type: 'image',
  style: {
    src: (d) => d.data.avatar || 'https://example.com/default-avatar.png',
    size: 60,
  },
},
```