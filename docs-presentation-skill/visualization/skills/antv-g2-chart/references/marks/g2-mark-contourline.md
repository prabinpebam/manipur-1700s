---
id: "g2-mark-contourline"
title: "G2 Contour Plot (contour line)"
description: |
  A contour plot is implemented with type: 'cell' or type: 'line'.
  It uses color-gradient grids or lines to show continuous data distributions on a two-dimensional plane (such as terrain elevation or temperature distribution).
  G2 has no built-in contour algorithm, so cell + a sequential color scale is usually used to simulate a contour effect.

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "contour plot"
  - "contour"
  - "terrain map"
  - "heatmap"
  - "continuous data"
  - "two-dimensional distribution"

related:
  - "g2-mark-cell-heatmap"
  - "g2-mark-point-scatter"

use_cases:
  - "Terrain elevation visualization"
  - "Meteorological data distributions (temperature, air pressure)"
  - "Spatial distribution of two-dimensional continuous data"

anti_patterns:
  - "Discrete categorical data is not suitable for contour plots"
  - "Time-series data is not suitable"

difficulty: "intermediate"
completeness: "full"
created: "2025-04-01"
updated: "2025-04-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/contourline"
---

## Core concepts

There are two ways to implement contour plots in G2:

1. **Grid color blocks simulate contours**: `type: 'cell'` + `sequential` color scale, where color intensity represents value magnitude
2. **Contour outlines**: `type: 'line'` + grouping by value level, drawing closed isolines

**The higher the grid density, the finer the contour effect** (requires data to cover uniform grid points)

## Grid-color-block contour simulation (most common)

```javascript
import { Chart } from '@antv/g2';

// Generate terrain data
const terrainData = [];
for (let x = 0; x <= 50; x += 2) {
  for (let y = 0; y <= 50; y += 2) {
    const elevation1 = 100 * Math.exp(-((x - 15) ** 2 + (y - 15) ** 2) / 200);
    const elevation2 = 80 * Math.exp(-((x - 35) ** 2 + (y - 35) ** 2) / 150);
    const elevation = elevation1 + elevation2 + 10;
    terrainData.push({ x, y, elevation });
  }
}

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

chart.options({
  type: 'cell',
  data: terrainData,
  encode: {
    x: 'x',
    y: 'y',
    color: 'elevation',
  },
  style: {
    stroke: '#333',
    lineWidth: 0.5,
    inset: 0.5,
  },
  scale: {
    color: {
      palette: 'viridis',
      type: 'sequential',
    },
  },
  legend: {
    color: {
      length: 300,
      layout: { justifyContent: 'center' },
      labelFormatter: (value) => `${Math.round(value)}m`,
    },
  },
  tooltip: {
    title: 'Elevation information',
    items: [
      { field: 'x', name: 'Longitude' },
      { field: 'y', name: 'Latitude' },
      {
        field: 'elevation',
        name: 'Elevation',
        valueFormatter: (value) => `${Math.round(value)}m`,
      },
    ],
  },
});

chart.render();
```

## Contour outlines (line implementation)

Preprocess data by value level; each line draws one contour level:

```javascript
import { Chart } from '@antv/g2';

// Precompute points for each contour level
const generateContourLines = () => {
  const lines = [];
  const levels = [20, 40, 60, 80, 100];

  levels.forEach((level, index) => {
    for (let angle = 0; angle <= 360; angle += 5) {
      const radian = (angle * Math.PI) / 180;
      const baseRadius = 5 + index * 4;
      const radius = baseRadius + Math.sin((angle * Math.PI) / 45) * 2;
      lines.push({
        x: 25 + radius * Math.cos(radian),
        y: 25 + radius * Math.sin(radian),
        level,
        lineId: `line_${level}`,
      });
    }
  });
  return lines;
};

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

chart.options({
  type: 'line',
  data: generateContourLines(),
  encode: {
    x: 'x',
    y: 'y',
    color: 'level',
    series: 'lineId',   // Each contour line is an independent series
  },
  style: {
    lineWidth: 2,
    strokeOpacity: 0.8,
  },
  scale: {
    color: {
      type: 'sequential',
      palette: 'oranges',
    },
  },
  axis: {
    x: { title: 'Distance (km)' },
    y: { title: 'Distance (km)' },
  },
  legend: {
    color: { title: 'Elevation (m)' },
  },
});

chart.render();
```

## Common errors and fixes

### Error 1: missing data keyword

```javascript
// ❌ Error: the data keyword must be specified
chart.options({
  type: 'cell',
  terrainData,   // ❌ Isolated object literal, missing the data: key
  encode: { x: 'x', y: 'y', color: 'elevation' },
});

// ✅ Correct
chart.options({
  type: 'cell',
  data: terrainData,
  encode: { x: 'x', y: 'y', color: 'elevation' },
});
```

### Error 2: contour outlines are missing series grouping

```javascript
// ❌ Error: without series, all contour points are connected into one line
chart.options({
  type: 'line',
  data,
  encode: {
    x: 'x',
    y: 'y',
    color: 'level',
    // ❌ Missing series: 'lineId'
  },
});

// ✅ Correct: use series to group each contour line independently
chart.options({
  type: 'line',
  data,
  encode: {
    x: 'x',
    y: 'y',
    color: 'level',
    series: 'lineId',  // ✅ Ensure each line is drawn independently
  },
});
```

### Error 3: color-scale type mismatch

```javascript
// ❌ Error: using an ordinal scale for continuous data yields too few colors
scale: { color: { type: 'ordinal' } }  // ❌ Suitable for discrete categories

// ✅ Correct: use a sequential scale for continuous data
scale: { color: { type: 'sequential', palette: 'viridis' } }  // ✅
```

## Difference between cell contours and heatmap

| Feature | Contour cell | Heatmap |
|------|------------|--------------|
| Coordinates | Two-dimensional uniform grid (x and y are both discrete) | Two-dimensional uniform grid |
| Color | Sequential continuous gradient | Usually sequential |
| Use case | Terrain and continuous field distributions | Frequency and density visualization |
| Data | Three-dimensional (x, y, z) | Usually frequency aggregation |
