---
id: "g2-mark-heatmap"
title: "G2 Gradient Heatmap (heatmap mark)"
description: |
  The heatmap mark (as distinct from the color-block heatmap of cell mark) uses Gaussian kernel density gradients to draw heat distributions.
  Each point creates an outward-spreading heat halo, making it suitable for geospatial density or two-dimensional density distributions.
  The color channel specifies intensity, and size controls the heat-halo radius.

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "heatmap"
  - "heatmap"
  - "density heatmap"
  - "gradient heatmap"
  - "Gaussian kernel"
  - "spatial density"

related:
  - "g2-mark-cell-heatmap"
  - "g2-mark-density"
  - "g2-mark-point-scatter"

use_cases:
  - "User click or visit heatmaps on maps"
  - "Density-distribution visualization in two-dimensional space"
  - "Density display for many overlapping points (clearer than a scatter plot)"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/heatmap/"
---

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

// Two-dimensional data with density weights
const data = Array.from({ length: 500 }, () => ({
  x: Math.random() * 100 + (Math.random() > 0.5 ? 20 : 60),
  y: Math.random() * 100 + (Math.random() > 0.5 ? 20 : 70),
  weight: Math.random(),
}));

const chart = new Chart({ container: 'container', width: 600, height: 500 });

chart.options({
  type: 'heatmap',   // Gradient heatmap (not a cell heatmap)
  data,
  encode: {
    x: 'x',
    y: 'y',
    color: 'weight',  // Heat intensity (0~1)
    size: 30,         // Heat-halo radius (px), fixed value or field name
  },
  style: {
    opacity: 0.8,
  },
  scale: {
    color: {
      type: 'sequential',
      palette: ['blue', 'cyan', 'lime', 'yellow', 'red'],  // Cool colors -> hot colors
    },
  },
  axis: false,
  legend: false,
});

chart.render();
```

## Configuration options

```javascript
chart.options({
  type: 'heatmap',
  data,
  encode: {
    x: 'lng',
    y: 'lat',
    color: 'intensity',    // Intensity field (default 0~1)
    size: 'radius',        // Heat-halo radius, either a field name or a fixed number
                           // Default 40 (px)
  },
  style: {
    opacity: 1,            // Overall opacity
  },
});
```

## heatmap vs. cell heatmap

```javascript
// heatmap mark: Gaussian gradient with a continuous heat-halo effect, suitable for point-data density
chart.options({ type: 'heatmap', ... });

// cell mark: discrete color blocks, suitable for matrix data (such as two-dimensional time x category tables)
chart.options({ type: 'cell', ... });
```

## Common errors and fixes

### Error 1: color channel values are not in 0~1 - heat color mapping is abnormal
```javascript
// ❌ If color values are raw counts (such as 500 or 1000), color mapping may be inaccurate
chart.options({
  encode: { color: 'rawCount' },  // ⚠️ rawCount values may be 0~10000
});

// ✅ Normalize to 0~1, or set scale.color.domain
chart.options({
  encode: { color: 'intensity' },  // intensity has been normalized to 0~1
  // Or configure domain
  scale: { color: { domain: [0, 1000] } },  // Explicitly specify the range
});
```

### Error 2: confusing it with cell mark - cell is matrix cells, while heatmap is a continuous gradient
```javascript
// ❌ Using cell to show spatial density - grid-like and lacking a continuous-gradient feel
chart.options({ type: 'cell', encode: { x: 'lng', y: 'lat', color: 'density' } });

// ✅ Use heatmap for spatial density (continuous-gradient heat-halo effect)
chart.options({ type: 'heatmap', encode: { x: 'lng', y: 'lat', color: 'density', size: 30 } });
```
