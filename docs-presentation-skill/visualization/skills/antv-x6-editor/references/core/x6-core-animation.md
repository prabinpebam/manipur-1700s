---
id: "x6-core-animation"
title: "X6 Animation and Transitions"
description: |
  A complete guide to the animation system for X6 nodes and edges.
  Covers the animate API, declarative animation, registering animated shapes, animation controls (pause/resume/cancel), and animation events.

library: "x6"
version: "3.x"
category: "core"
subcategory: "animation"
tags:
  - "animation"
  - "animation"
  - "animate"
  - "transition"
  - "transition"
  - "pause"
  - "pause"
  - "play"
  - "cancel"
  - "finish"
  - "reverse"
  - "Web Animations API"
  - "keyframes"
  - "keyframes"
  - "duration"
  - "iterations"

related:
  - "x6-core-node"
  - "x6-core-edge"
  - "x6-core-events"

use_cases:
  - "Add position movement animations to nodes"
  - "Add size change animations to nodes"
  - "Animate custom properties such as data"
  - "Declare animations through configuration"
  - "Register custom shapes with animations"
  - "Control animation pause, resume, and cancellation"
  - "Listen for animation completion events"

anti_patterns:
  - "Use / as the separator for animation property paths, such as position/x; do not write x directly"
  - "Do not confuse CSS animation property names with X6 animation configuration"
---

# X6 Animation and Transitions

X6's `animate` API is implemented based on the [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) standard and provides powerful animation capabilities.

## Basic Usage

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 400,
  background: { color: '#F2F7FA' },
});

const node = graph.addNode({
  shape: 'rect',
  x: 100,
  y: 140,
  width: 100,
  height: 50,
  label: 'Hello X6',
  attrs: { body: { strokeWidth: 1, rx: 6, ry: 6 } },
});

// Add a position animation: move the node from its current position to x=300
node.animate(
  { 'position/x': 300 },
  { duration: 1000, direction: 'alternate', iterations: Infinity },
);
```

## animate API Parameters

```javascript
cell.animate(keyframes, options);
```

### keyframes - Keyframes

Specify animation properties and their target values. Property paths use `/` as the separator and are implemented based on `cell.setPropByPath()`.

```javascript
// Single target value, animated from the current value to the target value
node.animate({ 'position/x': 300 }, { duration: 1000 });

// Array form, specifying the start value and target value
node.animate({ 'position/x': [100, 300] }, { duration: 1000 });

// Animate multiple properties at the same time
node.animate(
  { 'position/x': 300, 'position/y': 200 },
  { duration: 1000 },
);
```

### Common Property Paths

| Path | Description |
|------|-------------|
| `position/x` | Node X coordinate |
| `position/y` | Node Y coordinate |
| `size/width` | Node width |
| `size/height` | Node height |
| `attrs/body/fill` | Node fill color |
| `attrs/body/opacity` | Node opacity |
| `data/xxx` | Custom data property, used for HTML nodes |

### options - Animation Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `duration` | number | - | Animation duration in milliseconds |
| `delay` | number | 0 | Start delay in milliseconds |
| `direction` | string | `'normal'` | `'normal'`/`'reverse'`/`'alternate'`/`'alternate-reverse'` |
| `iterations` | number | 1 | Number of repetitions; `Infinity` means infinite |
| `easing` | string | `'linear'` | Easing function, such as `'ease'` or `'ease-in-out'` |
| `fill` | string | `'none'` | State after the animation ends: `'forwards'`/`'backwards'`/`'both'`/`'none'` |

## Declarative Animation

Declare an animation directly in the node configuration. It automatically plays after the node is added to the canvas:

```javascript
graph.addNode({
  shape: 'rect',
  x: 100,
  y: 140,
  width: 100,
  height: 50,
  label: 'Hello X6',
  attrs: { body: { strokeWidth: 1, rx: 6, ry: 6 } },
  // Declarative animation: each item in the array corresponds to one animate call
  animation: [
    [
      { 'position/x': 300 },
      { duration: 1000, direction: 'alternate', iterations: Infinity },
    ],
  ],
});
```

`animation` is an array. Each item is a `[keyframes, options]` tuple, and playback starts automatically after the node is added to the canvas.

## Register an Animated Shape

Reuse the same animation effect across a group of nodes:

```javascript
import { Graph } from '@antv/x6';

Graph.registerNode(
  'animated-rect',
  {
    inherit: 'rect',
    width: 150,
    height: 60,
    attrs: {
      body: { strokeWidth: 1, rx: 6, ry: 6 },
    },
    animation: [
      [
        { 'position/x': 300 },
        { duration: 1000, direction: 'alternate', iterations: Infinity },
      ],
    ],
  },
  true,
);

// All nodes using animated-rect automatically have this animation
graph.addNode({ shape: 'animated-rect', x: 100, y: 50, label: 'Node 1' });
graph.addNode({ shape: 'animated-rect', x: 100, y: 150, label: 'Node 2' });
```

## Custom Property Animation (HTML Nodes)

Animate custom properties in `data` and use them with HTML nodes to implement complex effects:

```javascript
import { Graph, Shape, Dom } from '@antv/x6';

Shape.HTML.register({
  shape: 'progress-node',
  width: 160,
  height: 40,
  effect: ['data'],
  html(cell) {
    const { progress } = cell.getData() ?? { progress: 0 };
    const div = document.createElement('div');
    Dom.css(div, {
      width: '100%',
      height: '100%',
      background: `linear-gradient(to right, #1890ff ${progress * 100}%, #f0f0f0 ${progress * 100}%)`,
      borderRadius: '4px',
      border: '1px solid #d9d9d9',
    });
    return div;
  },
});

const node = graph.addNode({
  shape: 'progress-node',
  x: 100,
  y: 100,
  data: { progress: 0 },
});

// Animate data/progress
node.animate(
  { 'data/progress': 1 },
  { duration: 2000, fill: 'forwards' },
);
```

## Animation Control

`animate` returns an animation object that supports control operations:

```javascript
const animation = node.animate(
  { 'position/x': [100, 300] },
  { duration: 2000, iterations: Infinity },
);

// Pause
animation.pause();

// Resume playback
animation.play();

// Cancel the animation and restore the initial state
animation.cancel();

// Finish the animation immediately and jump to the final state
animation.finish();

// Play in reverse
animation.reverse();

// Update the playback speed to 2x
animation.updatePlaybackRate(2);
```

### Get all animations on a node

```javascript
const animations = node.getAnimations(); // Animation[]
animations.forEach((anim) => anim.pause());
```

## Animation Events

### Method 1: Web Animations API Style

```javascript
const animation = node.animate(
  { 'position/x': [100, 300] },
  { duration: 1000, iterations: 1 },
);

animation.onfinish = () => {
  console.log('Animation finished');
};

animation.oncancel = () => {
  console.log('Animation cancelled');
};
```

### Method 2: X6 Event System

```javascript
// Listen for all node animation finish events
graph.on('node:animation:finish', ({ node }) => {
  console.log('Node animation finished:', node.id);
});

// Listen for all cell animation cancel events
graph.on('cell:animation:cancel', ({ cell }) => {
  console.log('Animation cancelled:', cell.id);
});
```

Supported events:
- `cell:animation:finish` - Animation finished
- `cell:animation:cancel` - Animation cancelled
- `node:animation:finish` - Node animation finished
- `node:animation:cancel` - Node animation cancelled
- `edge:animation:finish` - Edge animation finished
- `edge:animation:cancel` - Edge animation cancelled

## Built-in Transition Option for `translate` / `rotate`

> ⚠️ X6 3.x **does not provide** a `cell.transition(path, target, options)` method. The commonly misreported "transition method" is actually a **boolean/object options field** on position transform methods such as `node.translate()` and `node.rotate()`. Internally, it still uses `animate`.

### Actual API (verified in `model/node.ts`)

```typescript
node.translate(tx: number, ty: number, options?: {
  transition?: boolean | KeyframeEffectOptions  // <- this is the actual transition option
  restrict?: RectangleLike | null
  exclude?: Cell[]
  // ...
})
```

When `options.transition` is `true` or an object, X6 internally **automatically calls `node.animate({'position/x', 'position/y'}, animateOptions)` once**, with the default `{ duration: 100, fill: 'forwards' }`.

### Usage Examples

```javascript
// Form 1: transition: true, using default animation options (duration 100ms, fill forwards)
node.translate(200, 100, { transition: true });

// Form 2: transition: KeyframeEffectOptions, with custom animation options
node.translate(200, 100, {
  transition: { duration: 800, easing: 'ease-in-out', fill: 'forwards' },
});
```

### Relationship to `node.animate`

| Method | Suitable Use Case |
|--------|-------------------|
| `node.translate(tx, ty, { transition })` | Only positional translation is needed, and the translation itself should have a transition animation |
| `node.animate({ 'position/x', 'position/y' }, options)` | Any property, any keyframes, or when you need an `animation` handle for pause/play/cancel |
| Declarative `animation: [[keyframes, options]]` | A persistent animation that starts automatically after the node is added to the canvas |

`translate({ transition })` is only syntactic sugar for `animate`; **any more complex animation must use `animate`**.

## Common Mistakes and Fixes

### ❌ Incorrect property path syntax

```javascript
// Incorrect: using x directly as the property name
node.animate({ x: 300 }, { duration: 1000 });

// Correct: use the property path position/x
node.animate({ 'position/x': 300 }, { duration: 1000 });
```

### ❌ Node returns to its original position after the animation ends

```javascript
// Incorrect: the default fill='none', so the property is restored after the animation ends
node.animate({ 'position/x': 300 }, { duration: 1000 });

// Correct: set fill='forwards' to keep the final state
node.animate({ 'position/x': 300 }, { duration: 1000, fill: 'forwards' });
```

### ❌ Misusing the nonexistent `node.transition(path, target, options)` method

```javascript
// Incorrect: cell.transition(path, target, options) does not exist in X6 3.x
// Runtime error: node.transition is not a function
node.transition('position', { x: 300, y: 200 }, { duration: 1000 });

// Correct, for position transitions: use translate with the transition option
node.translate(300 - node.position().x, 200 - node.position().y, {
  transition: { duration: 1000, easing: 'ease-in-out', fill: 'forwards' },
});

// Correct, for general transitions: use animate
node.animate(
  { 'position/x': 300, 'position/y': 200 },
  { duration: 1000, easing: 'ease-in-out', fill: 'forwards' },
);
```

### ❌ Incorrect container selector

```javascript
// Incorrect: passing a DOM element variable directly. In evaluation or Playground environments, container is injected by the runtime.
const container = document.getElementById('container');
const graph = new Graph({ container });

// Correct: use the string literal 'container' directly
const graph = new Graph({ container: 'container' });
```

### ❌ Using a `complete` callback to listen for animation completion

```javascript
// Incorrect: neither X6 nor the Web Animations API provides a complete callback
node.animate({ 'position/x': 300 }, {
  duration: 1000,
  complete: () => console.log('done'),
});

// Correct: listen to onfinish on the returned Animation object
const animation = node.animate(
  { 'position/x': 300 },
  { duration: 1000, fill: 'forwards' },
);
animation.onfinish = () => console.log('done');

// Or listen to graph events, which is suitable for multiple nodes
graph.on('node:animation:finish', ({ node }) => {
  console.log('Node animation finished:', node.id);
});
```
