---
id: "g2-mark-polygon"
title: "G2 Polygon Mark"
description: |
 The polygon mark draws arbitrary polygons from multiple x/y channel coordinates.
 Each record represents one polygon, with coordinate arrays passed through the x and y channels.
 It is commonly used for map-region coloring, Voronoi diagrams, and other custom-shape scenarios.

library: "g2"
version: "5.x"
category: "marks"
tags:
 - "polygon"
 - "Voronoi"
 - "chart"
 - "custom shape"

related:
 - "g2-mark-image"
 - "g2-mark-path"

use_cases:
 - "Create Voronoi diagrams with natural region partitioning"
 - "Color custom polygon regions"
 - "Render process-region polygons when standard marks are not precise enough"

difficulty: "advanced"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/other/#polygon"
---

## Minimal runnable example (Voronoi chart)

```javascript
import { Chart } from '@antv/g2';
import { Delaunay } from 'd3-delaunay';

// Generate random points and calculate the Voronoi partition.
const points = Array.from({ length: 30 }, () => [
 Math.random() * 600,
 Math.random() * 400,
]);

const delaunay = Delaunay.from(points);
const voronoi = delaunay.voronoi([0, 0, 600, 400]);

// Convert Voronoi polygons into the G2 data format.
const polygonData = Array.from({ length: points.length }, (_, i) => {
 const cell = voronoi.cellPolygon(i);
 if (!cell) return null;
 return {
 x: cell.map(([px]) => px),
 y: cell.map(([, py]) => py),
 index: i,
 };
}).filter(Boolean);

const chart = new Chart({ container: 'container', width: 600, height: 400 });

chart.options({
 type: 'polygon',
 data: polygonData,
 encode: {
 x: 'x', // Array of x coordinates for each polygon vertex.
 y: 'y', // Array of y coordinates for each polygon vertex.
 color: 'index',
 },
 scale: {
 x: { domain: [0, 600] }, // Specify the coordinate range; the default scale type is linear.
 y: { domain: [0, 400] },
 color: { type: 'ordinal' },
 },
 style: {
 fillOpacity: 0.6,
 stroke: '#fff',
 lineWidth: 1,
 },
 axis: false,
 legend: false,
});

chart.render();
```

## Data format notes

```javascript
// Polygon data format: each record's x/y fields are arrays in polygon vertex order.
const data = [
 {
 x: [10, 50, 90, 10], // x coordinates in order; the first and last point can close the polygon.
 y: [10, 80, 10, 10], // y coordinates in order.
 category: 'A',
 },
 {
 x: [100, 150, 200], // triangle
 y: [20, 100, 20],
 category: 'B',
 },
];

chart.options({
 type: 'polygon',
 data,
 encode: { x: 'x', y: 'y', color: 'category' },
});
```

## Common errors and fixes

### Error: x/y values are single numbers instead of arrays
```javascript
// ❌ Error: polygon x/y values must be coordinate arrays, not single values.
chart.options({
 type: 'polygon',
 data: [{ x: 100, y: 200, ... }], // ❌ x/y are single values, so this is only one point.
 encode: { x: 'x', y: 'y' },
});

// ✅ Correct: x/y values are coordinate arrays.
chart.options({
 type: 'polygon',
 data: [{ x: [10, 50, 90], y: [10, 80, 10], ... }], // ✅ arrays
 encode: { x: 'x', y: 'y' },
});
```
