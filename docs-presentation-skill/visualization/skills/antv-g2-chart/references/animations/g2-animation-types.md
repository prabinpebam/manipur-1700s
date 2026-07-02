---
id: "g2-animation-types"
title: "Detailed Guide to Built-in G2 Animation Types (fadeIn/scaleIn/growIn/pathIn/waveIn/zoomIn/morphing)"
description: |
  G2 v5 provides many built-in animation types, each suitable for different marks and coordinate systems:
  fadeIn/Out (fade in/out), scaleInX/Y (scale and expand), growInX/Y (grow on enter),
  pathIn (path drawing), waveIn (polar-coordinate wave enter), zoomIn/Out (scaled point enter), and morphing (shape transition).
  Use them through configurations such as animate.enter.type.

library: "g2"
version: "5.x"
category: "animations"
tags:
  - "fadeIn"
  - "scaleInX"
  - "scaleInY"
  - "growInX"
  - "growInY"
  - "pathIn"
  - "waveIn"
  - "zoomIn"
  - "zoomOut"
  - "morphing"
  - "animation type"

related:
  - "g2-animation-intro"
  - "g2-animation-keyframe"

use_cases:
  - "Choose the most appropriate enter animation by chart type"
  - "Path-drawing animation for line charts"
  - "Wave enter for pie charts and rose charts"
  - "Morphing transitions during data updates"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/animate"
---

## Animation Types and Applicable Scenarios

| Animation name | Direction | Best marks | Characteristics |
|--------|------|------------|------|
| `fadeIn` | - | All marks | Fade in, general-purpose, safest |
| `fadeOut` | - | All marks | Fade out, general-purpose exit |
| `scaleInX` | X-axis | interval (bar/column chart) | Expands from the upper-left toward the right |
| `scaleInY` | Y-axis | interval (bar/column chart) | Scales up from the bottom |
| `scaleOutX` | X-axis | interval | Exit version of scaleInX |
| `scaleOutY` | Y-axis | interval | Exit version of scaleInY |
| `growInX` | X-axis | line, area, interval (Cartesian coordinates) | Grows from left to right through clipping |
| `growInY` | Y-axis | interval, area (Cartesian coordinates) | Grows from bottom to top through clipping; **disabled for polar/helix coordinates** |
| `pathIn` | Path | line, path, link | Gradually draws the path stroke |
| `waveIn` | Wave | interval (polar coordinates) | Polar-coordinate sector expansion only |
| `zoomIn` | Center | point, text | Scales up from the center |
| `zoomOut` | Center | point, text | Shrinks toward the center and disappears |
| `morphing` | Morph | All marks | Smooth shape morphing transition |

## fadeIn / fadeOut (Fade In and Fade Out)

```javascript
// The most general animation, suitable for any mark
chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y' },
  animate: {
    enter: { type: 'fadeIn', duration: 600 },
    exit: { type: 'fadeOut', duration: 300 },
  },
});
```

## scaleInY / growInY (Column Chart Enter)

```javascript
// scaleInY: scale and expand (has a scaling feel)
// growInY: clipping growth (feels more natural, as if growing out of the ground)
chart.options({
  type: 'interval',
  data,
  encode: { x: 'genre', y: 'sold' },
  animate: {
    // Method 1: scale
    enter: { type: 'scaleInY', duration: 800, easing: 'ease-out' },
    // Method 2: grow (recommended)
    // enter: { type: 'growInY', duration: 800 },
  },
});
```

## pathIn (Line Chart Path Drawing)

```javascript
// pathIn: gradually draws line/path from left to right
chart.options({
  type: 'line',
  data: timeSeriesData,
  encode: { x: 'date', y: 'value', color: 'type' },
  animate: {
    enter: {
      type: 'pathIn',      // Gradually draw the path
      duration: 1500,
      easing: 'linear',    // A constant-speed drawing effect works better
    },
  },
});
```

## waveIn (Polar/Pie Chart Only)

```javascript
// waveIn: wave sweep from the outer ring inward, designed specifically for polar coordinates
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'theta', outerRadius: 0.8 },
  animate: {
    enter: {
      type: 'waveIn',       // Polar coordinates only
      duration: 1000,
    },
  },
});
```

## zoomIn / zoomOut (Point Chart Scaling)

```javascript
// zoomIn: scatter points scale in from the center
chart.options({
  type: 'point',
  data: scatterData,
  encode: { x: 'x', y: 'y', size: 'value' },
  animate: {
    enter: { type: 'zoomIn', duration: 500 },
    exit: { type: 'zoomOut', duration: 300 },
  },
});
```

## morphing (Morphing Update Animation)

```javascript
// morphing: graphical shapes morph smoothly when data updates
chart.options({
  type: 'interval',
  data,
  encode: { x: 'genre', y: 'sold' },
  animate: {
    update: {
      type: 'morphing',    // Morphing transition during data updates
      duration: 600,
    },
  },
});

// Morphing can also be triggered automatically in timingKeyframe
chart.options({
  type: 'timingKeyframe',
  children: [
    { type: 'interval', data, encode: { x: 'x', y: 'y' } },
    { type: 'line',     data, encode: { x: 'x', y: 'y' } },
  ],
});
```

## Recommended Animations by Chart Type

```javascript
// Column chart (growInY recommended)
{ type: 'interval', animate: { enter: { type: 'growInY', duration: 800 } } }

// Bar chart (growInX recommended)
{ type: 'interval', coordinate: { transform: [{ type: 'transpose' }] },
  animate: { enter: { type: 'growInX', duration: 800 } } }

// Line chart (pathIn recommended)
{ type: 'line', animate: { enter: { type: 'pathIn', duration: 1200 } } }

// Scatter plot (zoomIn or fadeIn recommended)
{ type: 'point', animate: { enter: { type: 'zoomIn', duration: 400 } } }

// Pie/donut chart (waveIn recommended)
{ type: 'interval', coordinate: { type: 'theta' },
  animate: { enter: { type: 'waveIn', duration: 1000 } } }

// Area chart (fadeIn or growInX recommended)
{ type: 'area', animate: { enter: { type: 'fadeIn', duration: 800 } } }

// Helix coordinate system (must use fadeIn; growInX/Y is prohibited)
{ type: 'interval', coordinate: { type: 'helix', ... },
  animate: { enter: { type: 'fadeIn', duration: 800 } } }
```

## Common Mistakes and Fixes

### Mistake 1: using scaleInY on a bar chart (transposed)
```javascript
// Incorrect: a bar chart is horizontal, so scaleInY (vertical scaling) is not appropriate
chart.options({
  type: 'interval',
  coordinate: { transform: [{ type: 'transpose' }] },
  animate: { enter: { type: 'scaleInY' } },  // Incorrect; use growInX or scaleInX
});

// Correct: use an X-direction animation for bar charts
chart.options({
  animate: { enter: { type: 'growInX', duration: 800 } },  // Correct
});
```

### Mistake 2: using growInX/growInY on a helix coordinate system

`growInX` / `growInY` are implemented as **clipPath clipping** along the Cartesian axis direction. In a `helix` coordinate system, the axes are remapped to a spiral path, so there is no visible "bottom" or "left" baseline on the screen. The clipping rectangle cuts across the spiral, causing parts of the spiral area to be clipped or rendered incompletely. The chart may still appear incomplete after the animation finishes.

**The same issue applies to all non-Cartesian coordinate systems** (`polar`, `theta`, `helix`): these coordinate systems should use `waveIn` (polar only) or `fadeIn` (general-purpose), and must not use `growInX/Y`.

```javascript
// Incorrect: using growInY with a helix coordinate system causes the clipping rectangle to cut across the spiral and leaves the chart incomplete
chart.options({
  type: 'interval',
  coordinate: { type: 'helix', startAngle: 0, endAngle: Math.PI * 6 },
  animate: {
    enter: { type: 'growInY', duration: 2000 },  // Incorrect: the spiral is clipped and parts are missing
  },
});

// Correct: use fadeIn for helix coordinates
chart.options({
  type: 'interval',
  coordinate: { type: 'helix', startAngle: 0, endAngle: Math.PI * 6 },
  animate: {
    enter: { type: 'fadeIn', duration: 1000 },   // Correct: fade in without clipping side effects
  },
});

// Correct: use waveIn for polar coordinates (theta/polar)
chart.options({
  type: 'interval',
  coordinate: { type: 'theta' },
  animate: {
    enter: { type: 'waveIn', duration: 1000 },   // Correct: polar-coordinate sector expansion
  },
});
```

**Root cause**: `growInX/Y` assumes a fixed Cartesian baseline (X=0 or Y=0) as the clipping start point. This is valid in Cartesian coordinates, but after `helix` / `polar` remaps coordinates to a polar or spiral path, that baseline no longer corresponds to a visible boundary, so the clipping result arbitrarily truncates the spiral shape.