---
id: "g2-core-chart-init"
title: "G2 Chart Initialization and Basic Configuration"
description: |
  Introduces how to create Chart objects in G2 v5, required and optional parameters,
  responsive sizing, theme configuration, and lifecycle management.
  You must use the declarative Spec syntax (chart.options({})); chained APIs are prohibited.

library: "g2"
version: "5.x"
category: "core"
tags:
  - "Chart"
  - "initialization"
  - "container"
  - "autoFit"
  - "theme"
  - "lifecycle"
  - "init"
  - "spec"
  - "options"
  - "padding"
  - "paddingLeft"
  - "paddingTop"
  - "paddingRight"
  - "paddingBottom"
  - "margin"
  - "inset"
  - "layout"

related:
  - "g2-core-encode-channel"
  - "g2-core-data-binding"
  - "g2-core-lifecycle"
  - "g2-theme-builtin"

use_cases:
  - "Start creating any G2 chart"
  - "Configure the chart canvas size and container"
  - "Set the global theme and padding"

anti_patterns:
  - "Do not call new Chart multiple times on the same container (this creates multiple canvases)"
  - "Do not use the chained API (chart.interval().encode()...)"
  - "Do not call chart.options({}) multiple times in the same chart (later calls completely overwrite earlier ones). Merge configuration into a single call; when overlaying multiple marks, use type: 'view' + children"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-27"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/chart"
---

## Core Concepts

`Chart` is the top-level container object in G2. It manages the canvas, views, coordinate systems, and rendering.

**You must use Spec mode**: pass a complete description object through `chart.options({})` in one call. This structure is clear, easy to serialize, and easy to generate dynamically.

**Do not use the chained API**: chained calls such as `chart.interval().encode()` are prohibited.

## Minimal Runnable Example (Spec Mode)

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'line',        // Mark type
  data: [
    { x: 1, y: 10 },
    { x: 2, y: 30 },
    { x: 3, y: 20 },
  ],
  encode: { x: 'x', y: 'y' },
});

chart.render();
```

## Complete Chart Container Configuration Options

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  // -- Required -----------------------------
  container: 'container',        // string | HTMLElement: DOM container

  // -- Size ---------------------------------
  width: 640,                    // Canvas width (px), default 640
  height: 480,                   // Canvas height (px), default 480
  autoFit: true,                 // Automatically fit the container size (ignores width/height)

  // -- Padding ------------------------------
  // padding only accepts a number or 'auto'; array syntax is not supported
  // Default 'auto': G2 automatically computes space for components such as axes and legends; no manual setting is needed
  padding: 'auto',               // 'auto' | number (same value on all four sides)
  // To control individual directions, use the separate options below (higher priority than padding)
  paddingTop: 40,
  paddingRight: 20,
  paddingBottom: 40,
  paddingLeft: 60,
  inset: 0,                      // Inset inside the data area (prevents data points from touching the edges)

  // -- Theme --------------------------------
  theme: 'classic',              // 'classic' | 'classicDark' | 'academy'

  // -- Renderer -----------------------------
  renderer: undefined,           // Canvas by default; an SVG renderer can be passed in

  // -- Pixel ratio --------------------------
  devicePixelRatio: window.devicePixelRatio,
});
```

## Complete Spec Mode Structure

```javascript
chart.options({
  // Mark type
  type: 'interval',

  // Data. Different marks can have structural differences; prefer the data structure for the corresponding mark
  data: [...],

  // Visual channel mapping
  encode: {
    x: 'genre',
    y: 'sold',
    color: 'genre',
  },

  // Data transforms
  transform: [{ type: 'stackY' }],

  // Scales
  scale: {
    y: { domain: [0, 500] },
    color: { range: ['#1890ff', '#52c41a'] },
  },

  // Coordinate system
  coordinate: { transform: [{ type: 'transpose' }] },

  // Style
  style: { radius: 4 },

  // Data labels
  labels: [{ text: 'sold', position: 'outside' }],

  // Tooltip
  tooltip: { title: 'genre', items: [{ field: 'sold', name: 'Sales' }] },

  // Axes
  axis: {
    x: { title: 'Game Genre' },
    y: { title: 'Sales' },
  },

  // Legend
  legend: {
    color: { position: 'top' },
  },
});
```

## Standard Spec Mode Syntax

```javascript
// Correct: Spec mode (the only recommended syntax)
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'genre', y: 'sold', color: 'genre' },
  style: { radius: 4 },
});

// Prohibited: chained API mode
chart.interval()
  .data([...])
  .encode('x', 'genre')
  .encode('y', 'sold')
  .encode('color', 'genre')
  .style({ radius: 4 });
```


## Responsive Auto-Fit

```javascript
// autoFit: width follows the container, while height can be fixed
const chart = new Chart({
  container: 'container',
  autoFit: true,
  height: 400,
});

chart.options({ type: 'line', data: [...], encode: { x: 'x', y: 'y' } });
chart.render();
```

## Lifecycle

```javascript
// Initial render
chart.render();

// Re-render after updating the Spec (changeData only updates data)
chart.options({ type: 'bar',  newData, encode: { x: 'x', y: 'y' } });
chart.render();

// Update data only (better performance)
chart.changeData(newData);

// Destroy
chart.destroy();

// Event listener
chart.on('afterrender', () => console.log('Render complete'));
```

## Layout Model: margin / padding / inset

G2 v5 divides view space into four layers, from outside to inside:

```
View Area (width x height)
  |- margin (outer margin, default 16; fixed blank space between View Area and Plot Area)
      |- Plot Area (drawing area)
          |- padding (inner padding, default auto; automatically allocates space for components such as axis/legend/title)
              |- Main Area (main area)
                  |- inset (breathing room, default 0; prevents data points from touching the edges)
                      |- Content Area (data mark drawing area)
```

- **`margin`**: outer margin, `number`, default `16`; fixed blank space between the View Area and Plot Area, not directly tied to component rendering
- **`padding`**: inner padding, `number | 'auto'`, default `'auto'`; automatically computed by G2 to reserve space for components such as axes, legends, and titles; manual settings disable auto-fit
- **`inset`**: breathing room, `number`, default `0`; useful for scatter plots and similar charts to prevent points from touching the edges

```javascript
const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
  margin: 16,        // Default; usually does not need to be changed
  // padding: 'auto',  // Default; usually does not need to be changed
  paddingLeft: 80,   // Set individually only when one side needs adjustment
  inset: 8,          // Recommended for scatter plots to prevent data points from being clipped
});
```

## Common Mistakes and Fixes

### Mistake 0: Calling chart.options({}) multiple times

`chart.options()` is a **full replacement**, not a merge. Each chart should call it only once. Multi-mark overlays must use `type: 'view'` + `children`. See SKILL.md core constraint #3 for details.

```javascript
// Incorrect: multiple calls; only the last one takes effect
chart.options({ type: 'interval', data, encode: { x: 'x', y: 'y' } });
chart.options({ type: 'text', data: labelData, encode: { x: 'x', y: 'y', text: 'text' } });

// Correct: one chart.options() call, composed with view + children
chart.options({
  type: 'view',
  children: [
    { type: 'interval', data, encode: { x: 'x', y: 'y' } },
    { type: 'text', data: labelData, encode: { x: 'x', y: 'y', text: 'text' } },
  ],
});
```


### Mistake 1: container points to a nonexistent ID
```javascript
// Incorrect: DOM has not loaded yet
const chart = new Chart({ container: 'chart' });

// Correct: make sure the DOM already exists
document.addEventListener('DOMContentLoaded', () => {
  const chart = new Chart({ container: 'chart', width: 640, height: 400 });
  chart.options({ type: 'line',  [...], encode: { x: 'x', y: 'y' } });
  chart.render();
});
```

### Mistake 2: initializing the same container repeatedly
```javascript
// Incorrect: creates two overlapping canvases
const chart1 = new Chart({ container: 'container' });
const chart2 = new Chart({ container: 'container' });

// Correct: destroy the old instance first
chart1.destroy();
const chart2 = new Chart({ container: 'container' });
```

### Mistake 3: mixing autoFit with a fixed width
```javascript
// Incorrect: autoFit overrides width
const chart = new Chart({ container: 'c', autoFit: true, width: 640 });

// Correct: when using autoFit, set only height
const chart = new Chart({ container: 'c', autoFit: true, height: 400 });
```

### Mistake 4: using array syntax for padding (CSS shorthand)
```javascript
// Incorrect: padding does not support arrays; the G2 v5 type is number | 'auto'
const chart = new Chart({
  container: 'container',
  autoFit: true,
  padding: [40, 30, 40, 50],   // Invalid; it will be ignored or cause an exception
});

// Correct: same value on all four sides
const chart = new Chart({ container: 'container', padding: 40 });

// Correct: directional control using paddingTop/Right/Bottom/Left
const chart = new Chart({
  container: 'container',
  autoFit: true,
  paddingTop: 40,
  paddingRight: 30,
  paddingBottom: 40,
  paddingLeft: 50,
});
```

### Mistake 5: setting padding to 0, which clips axes
```javascript
// Incorrect: padding=0 disables automatic calculation, so axes/legends may not be fully visible
const chart = new Chart({ container: 'container', padding: 0 });

// Correct: keep the default 'auto'; when only one direction needs adjustment, set that direction individually
const chart = new Chart({ container: 'container', paddingLeft: 80 });
// Or keep the default automatic calculation
const chart = new Chart({ container: 'container' });
```