---
id: "g2-mark-vector"
title: "G2 Vector Plot (vector)"
description: |
  The vector mark draws an arrow at each data point to encode both direction and magnitude.
  It is useful for field data with direction and intensity, such as wind fields and water-flow directions.
  In encode, the rotate channel controls direction as an angle, and the size channel controls arrow length.

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "vector"
  - "magnitude"
  - "direction field"
  - "wind field"
  - "arrow"
  - "flow field"

related:
  - "g2-mark-point-scatter"
  - "g2-core-encode-channel"

use_cases:
  - "visualize wind fields with wind direction and speed"
  - "show simulated flow-field results"
  - "visualize gradient fields or force fields"

difficulty: "advanced"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/point/#vector"
---

## Minimal runnable example (wind field)

```javascript
import { Chart } from '@antv/g2';

// Simulated wind-field data: each grid point has a position, wind direction angle, and wind speed.
const data = [];
for (let x = 0; x < 10; x++) {
  for (let y = 0; y < 10; y++) {
    const angle = (x * 30 + y * 15) % 360; // Wind direction in degrees.
    const speed = 2 + Math.random() * 8; // Wind speed.
    data.push({ x, y, angle, speed });
  }
}

const chart = new Chart({ container: 'container', width: 600, height: 600 });

chart.options({
  type: 'vector',
  data,
  encode: {
    x: 'x',
    y: 'y',
    rotate: 'angle', // Arrow rotation angle in degrees; 0 points right, increasing clockwise.
    size: 'speed', // Map arrow length to speed.
    color: 'speed', // Map color to wind speed.
  },
  scale: {
    color: { type: 'sequential', palette: 'viridis' },
    size: { range: [6, 24] },
  },
  style: {
    arrow: true, // Display arrowheads.
  },
  legend: { color: { title: 'Wind speed (m/s)' } },
});

chart.render();
```

## Configuration options

```javascript
chart.options({
  type: 'vector',
  data,
  encode: {
    x: 'x',
    y: 'y',
    rotate: 'direction', // Direction angle field; 0° points right and values increase clockwise.
    size: 'magnitude', // Magnitude field for arrow length.
    color: 'intensity', // Optional color encoding field.
  },
  style: {
    arrow: true, // Whether to display arrowheads; default is true.
    arrowSize: 6, // Arrowhead size in pixels.
  },
});
```

## Common errors and fixes

### Error: rotate uses degrees, not radians
```javascript
// ❌ If the original data is in radians, using it directly in the rotate channel gives the wrong direction.
const data = [{ ..., direction: Math.PI / 4 }]; // Radians.
chart.options({ encode: { rotate: 'direction' } }); // ❌ G2 expects degrees.

// ✅ Convert radians to degrees.
const data = data.map(d => ({ ...d, dirDeg: (d.direction * 180) / Math.PI }));
chart.options({ encode: { rotate: 'dirDeg' } }); // ✅ Degree value.
```
