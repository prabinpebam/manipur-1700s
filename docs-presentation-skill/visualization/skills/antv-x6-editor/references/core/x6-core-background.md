---
id: "x6-core-background"
title: "X6 Canvas Background Configuration"
description: |
  X6 canvas background configuration: solid-color backgrounds, background images, tiling modes (repeat/flip-x/flip-y/flip-xy/watermark), opacity, and more.

library: "x6"
version: "3.x"
category: "core"
subcategory: "background"
tags:
  - "background"
  - "background"
  - "background color"
  - "background image"
  - "watermark"
  - "watermark"

related:
  - "x6-core-graph-init"
  - "x6-core-grid"

use_cases:
  - "Set the canvas background color"
  - "Set a canvas background image"
  - "Add a watermark to the canvas"
  - "Tile or flip a background image"
  - "Dynamically switch backgrounds"

difficulty: "beginner"
completeness: "full"
---

## Basic Usage

Configure the background through the `background` field in the Graph constructor:

```javascript
import { Graph } from '@antv/x6';

// Solid-color background
const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  background: { color: '#F2F7FA' },
});
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `color` | string | - | Background color, as a CSS color value |
| `image` | string | - | Background image URL |
| `position` | string \| object | `'center'` | Background image position. String: CSS background-position; object: `{ x, y }` |
| `size` | string \| object | `'auto auto'` | Background image size. String: `'auto'`/`'contain'`/`'cover'`; object: `{ width, height }` |
| `repeat` | string | `'no-repeat'` | Tiling mode: `'repeat'`, `'no-repeat'`, `'repeat-x'`, `'repeat-y'`, `'flip-x'`, `'flip-y'`, `'flip-xy'`, `'watermark'` |
| `opacity` | number | `1` | Background opacity from 0 to 1 |

## Solid-Color Background

```javascript
const graph = new Graph({
  container: 'container',
  background: { color: '#F2F7FA' },
});
```

## Background Image

```javascript
const graph = new Graph({
  container: 'container',
  background: {
    image: 'https://example.com/bg.png',
    size: 'cover',
    position: 'center',
    opacity: 0.5,
  },
});
```

## Tiling Modes

### repeat (Standard Tiling)

```javascript
const graph = new Graph({
  container: 'container',
  background: {
    image: 'https://example.com/tile.png',
    repeat: 'repeat',
    size: { width: 100, height: 100 },
  },
});
```

### flip-x / flip-y / flip-xy (Flipped Tiling)

The image alternates between horizontal and vertical flips to create a mirrored tiling effect:

```javascript
const graph = new Graph({
  container: 'container',
  background: {
    image: 'https://example.com/pattern.png',
    repeat: 'flip-xy',  // Flip both horizontally and vertically
    size: { width: 200, height: 200 },
  },
});
```

### watermark

Tiles the image as a watermark with a rotation angle:

```javascript
const graph = new Graph({
  container: 'container',
  background: {
    image: 'https://example.com/watermark.png',
    repeat: 'watermark',
    opacity: 0.1,
  },
});
```

## Programmatic API

```javascript
// Dynamically set the background
graph.drawBackground({ color: '#fff' });

// Set a background image
graph.drawBackground({
  image: 'https://example.com/bg.png',
  repeat: 'repeat',
  size: { width: 100, height: 100 },
});

// Clear the background
graph.clearBackground();
```

## Complete Example: Background Color + Grid

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  background: { color: '#F2F7FA' },
  grid: { visible: true, size: 10, type: 'dot' },
});

graph.addNode({
  x: 200,
  y: 150,
  width: 120,
  height: 60,
  label: 'Hello',
  attrs: { body: { fill: '#fff', stroke: '#5F95FF' } },
});
```

## Common Mistakes

### ❌ Confusing background color with grid color

```javascript
// Note: grid color is the color of grid lines or dots, not the background color
const graph = new Graph({
  container: 'container',
  grid: { visible: true, args: { color: '#F2F7FA' } },  // ❌ This does not set the background color
});

// Correct: use background for the background color and grid.args.color for the grid color
const graph = new Graph({
  container: 'container',
  background: { color: '#F2F7FA' },  // ✅ Background color
  grid: { visible: true, args: { color: '#ddd' } },  // ✅ Grid dot color
});
```

### ❌ image path issues

```javascript
// Note: image must be an accessible URL or Data URL
background: {
  image: './bg.png',  // ⚠️ Relative paths may fail to load in some environments
}

// Recommended: use an absolute URL or an imported asset
background: {
  image: 'https://cdn.example.com/bg.png',  // ✅
}
```
