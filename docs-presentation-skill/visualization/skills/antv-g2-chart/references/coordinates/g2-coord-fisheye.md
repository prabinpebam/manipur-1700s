---
id: "g2-coord-fisheye"
title: "G2 Fisheye Coordinate System"
description: |
  The fisheye coordinate transform magnifies areas near the focus and compresses areas farther away.
  It helps preserve both local detail and global context in large, dense datasets.
  It is usually used with the fisheye interaction to create dynamic mouse-following magnification.

library: "g2"
version: "5.x"
category: "coordinates"
tags:
  - "fisheye"
  - "focus+context"
  - "coordinate"
  - "dense data"

related:
  - "g2-mark-point-scatter"
  - "g2-coord-transpose"

use_cases:
  - "Inspecting local detail in dense scatterplots"
  - "Exploring dense regions in time series"
  - "Viewing global context and local detail at the same time"

difficulty: "advanced"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/coordinate/fisheye"
---

## Minimal Runnable Example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'point',
  data: Array.from({ length: 200 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    group: i % 5,
  })),
  encode: { x: 'x', y: 'y', color: 'group', shape: 'point' },
  scale: { color: { type: 'ordinal' } },
  coordinate: {
    transform: [
      {
        type: 'fisheye',
        focusX: 0.5,       // Focus x position in relative coordinates from 0 to 1.
        focusY: 0.5,       // Focus y position in relative coordinates from 0 to 1.
        distortionX: 2,    // Magnification factor in the x direction; larger values magnify more strongly.
        distortionY: 2,    // Magnification factor in the y direction.
      }
    ]
  },
  // Usually used with the fisheye interaction so the focus follows the mouse.
  interaction: { fisheye: true },
});

chart.render();
```

## Configuration Options

```javascript
coordinate: {
  transform: [
    {
      type: 'fisheye',
      focusX: 0,        // Focus x position in relative coordinates from 0 to 1; default is 0.
      focusY: 0,        // Focus y position in relative coordinates from 0 to 1; default is 0.
      distortionX: 2,   // Distortion strength in the x direction; default is 2.
      distortionY: 2,   // Distortion strength in the y direction; default is 2.
      visual: false,    // Whether to enable the visual effect; default is false.
    }
  ]
}
```

## X-Only Fisheye (Time Series)

```javascript
chart.options({
  type: 'line',
  data: timeSeriesData,
  encode: { x: 'date', y: 'value', color: 'type' },
  coordinate: {
    transform: [
      {
        type: 'fisheye',
        distortionX: 3,   // Magnify only in the x direction.
        distortionY: 0,   // Keep the y direction unchanged.
      }
    ]
  },
  interaction: { fisheye: true },
});
```

## Common Errors and Fixes

### Error: Using Fisheye Without Interaction Makes the Effect Static
```javascript
// This works, but the focus is fixed and does not respond to the mouse.
chart.options({
  coordinate: {
    transform: [
      {
        type: 'fisheye',
        focusX: 0.3,
        focusY: 0.5,
      }
    ]
  },
  // interaction.fisheye is not configured.
});

// Recommended: combine the transform with interaction for dynamic fisheye behavior.
chart.options({
  coordinate: { transform: [ { type: 'fisheye' } ] },
  interaction: { fisheye: true },  // The focus follows the mouse.
});
```
