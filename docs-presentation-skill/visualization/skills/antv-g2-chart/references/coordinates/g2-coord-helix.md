---
id: "g2-coord-helix"
title: "G2 Helix Coordinate System"
description: |
  The helix coordinate system arranges time or ordered data along a spiral. It is suitable for long time series with periodic patterns.
  Data winds along the spiral, and points at the same periodic position align radially, making recurring patterns easier to identify.

library: "g2"
version: "5.x"
category: "coordinates"
tags:
  - "helix"
  - "helix chart"
  - "cycle"
  - "time series"
  - "coordinate"

related:
  - "g2-mark-interval-basic"
  - "g2-scale-time"

use_cases:
  - "Showing cyclical patterns in daily average temperatures across a year"
  - "Analyzing cycles in long stock-price time series"
  - "Visualizing weekly, monthly, or yearly periodic patterns"

difficulty: "advanced"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/coordinate/helix"
---

## Minimal Runnable Example

```javascript
import { Chart } from '@antv/g2';

// Generate one year of daily average temperature data.
const data = Array.from({ length: 365 }, (_, i) => ({
  day: i,
  temp: 15 + 12 * Math.sin((i / 365) * Math.PI * 2) + (Math.random() - 0.5) * 5,
}));

const chart = new Chart({ container: 'container', width: 600, height: 600 });

chart.options({
  type: 'interval',
  data,
  encode: {
    x: 'day',    // Order along the helix.
    y: 'temp',   // Values mapped to radial variation.
    color: 'temp',
  },
  scale: {
    color: { type: 'sequential', palette: 'rdYlBu' },
  },
  coordinate: {
    type: 'helix',
    startAngle: 0,              // Start angle; default is 0.
    endAngle: Math.PI * 6,      // End angle; default is 6 pi, or 3 turns.
    innerRadius: 0.1,
    outerRadius: 0.9,
  },
  style: { lineWidth: 0 },
  legend: false,
});

chart.render();
```

## Configuration Options

```javascript
coordinate: {
  type: 'helix',
  startAngle: 0,              // Start angle in radians; default is 0.
  endAngle: Math.PI * 6,      // End angle; default is 6 pi, or 3 turns.
  innerRadius: 0,             // Inner radius; default is 0.
  outerRadius: 1,             // Outer radius ratio; default is 1.
}
```

## Common Errors and Fixes

### Error: Too Few Data Points for Too Many Helix Turns
```javascript
// Error: 12 monthly data points with 6 pi, or 3 turns, leaves only 4 points per turn.
chart.options({
  data: monthlyData,  // Only 12 records.
  coordinate: { type: 'helix', endAngle: Math.PI * 6 },
});

// Correct: adjust the number of turns based on the amount of data: endAngle = turns x 2 pi.
chart.options({
  coordinate: {
    type: 'helix',
    endAngle: Math.PI * 2,  // One turn, suitable for monthly data.
  },
});
```

### Error: Styling Makes the Graphic Invisible or Render Incorrectly
```javascript
// Error: lineWidth: 0 with an interval mark and insufficient width can make the graphic appear to disappear.
chart.options({
  type: 'interval',
  coordinate: { type: 'helix' },
  style: { lineWidth: 0 },
});

// Correct: use an appropriate lineWidth, or use a mark such as point for fine-grained dense data.
chart.options({
  type: 'point', // Better for large, dense datasets.
  style: { lineWidth: 2 },
});
```

### Error: Animation Type Is Incompatible with the Mark
```javascript
// Error: growInY animation may not apply to interval marks in every helix scenario.
chart.options({
  animate: {
    enter: {
      type: 'growInY',
    }
  }
});

// Correct: use a general-purpose animation such as fadeIn for better compatibility.
chart.options({
  animate: {
    enter: {
      type: 'fadeIn',
      duration: 2000,
    }
  }
});
```
