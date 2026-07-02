---
id: "g2-interaction-fisheye"
title: "G2 Fisheye Interaction"
description: |
  The fisheye interaction moves the focus of the fisheye effect with the pointer, creating dynamic focus-plus-context magnification.
  It should be used with a fisheye coordinate system, or enabled independently, in which case G2 automatically adds fisheye to coordinate.transform.
  When the pointer leaves the chart area, the view automatically returns to normal.

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "fisheye"
  - "fisheye effect"
  - "focus-plus-context"
  - "focus context"
  - "interaction"

related:
  - "g2-coord-fisheye"
  - "g2-mark-point-scatter"

use_cases:
  - "Dynamic local magnification in dense scatter plots"
  - "Interactive detail exploration for large numbers of data points"
  - "Exploration of dense regions in time series"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/fisheye"
---

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const data = Array.from({ length: 300 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  group: i % 5,
}));

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y', color: 'group', shape: 'point' },
  scale: { color: { type: 'ordinal' } },
  coordinate: { transform: [ { type: 'fisheye' } ] },  // Use with the fisheye coordinate system
  interaction: {
    fisheye: true,   // Focus follows the pointer
  },
});

chart.render();
```

## Configure fisheye intensity

```javascript
chart.options({
  type: 'point',
  data,
  encode: { x: 'x', y: 'y', color: 'group' },
  coordinate: { transform: [ { type: 'fisheye' } ] },
  interaction: {
    fisheye: {
      wait: 30,       // Throttle wait time in milliseconds; default is 30. Lower values are more responsive
      leading: true,  // Execute on the leading edge of the throttle; default is undefined
      trailing: false, // Execute on the trailing edge of the throttle; default is false
    },
  },
});
```

## X-only fisheye (exploring dense regions in a line chart)

```javascript
chart.options({
  type: 'line',
  data: denseTimeData,
  encode: { x: 'date', y: 'value', color: 'type' },
  coordinate: {
    transform: [
      {
        type: 'fisheye',
        distortionX: 4,   // Magnification strength in the X direction
        distortionY: 0,   // No distortion in the Y direction
      }
    ]
  },
  interaction: { fisheye: true },
});
```

## Common errors and fixes

### Error: only interaction.fisheye is configured and no coordinate system is set, so the fisheye effect does not work
```javascript
// ⚠️ interaction.fisheye automatically adds fisheye to coordinate.transform
// However, if coordinate has other settings, you may need to configure it explicitly
chart.options({
  coordinate: { type: 'cartesian' },  // ⚠️ Cartesian coordinates are explicitly set; fisheye appends a transform
  interaction: { fisheye: true },     // Automatically inserts fisheye into coordinate.transform
});

// ✅ Simplest form: specify the fisheye coordinate system directly
chart.options({
  coordinate: { transform: [ { type: 'fisheye' } ] },
  interaction: { fisheye: true },
});
```
