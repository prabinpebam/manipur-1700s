---
id: "g2-mark-path"
title: "G2 Path Mark"
description: |
 The path mark draws arbitrary shapes from SVG path strings (the d attribute).
 It is useful for custom graphics, map outlines, flow arrows, and shapes that cannot be expressed with standard marks.
 Unlike the line mark, which connects data-point coordinates, the path mark renders the SVG path string directly.

library: "g2"
version: "5.x"
category: "marks"
tags:
 - "path"
 - "SVG"
 - "custom shape"
 - "annotation"

related:
 - "g2-mark-polygon"
 - "g2-mark-link"
 - "g2-mark-connector"

use_cases:
 - "Draw custom SVG path shapes"
 - "Add non-GeoJSON chart outlines or annotations"
 - "Create custom arrows and flow-process graphics"

difficulty: "advanced"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/mark/path"
---

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

// The path mark reads SVG path strings from the d field.
const pathData = [
 {
 d: 'M 100 200 C 100 100 400 100 400 200 S 700 300 700 200',
 color: '#5B8FF9',
 label: 'Curved path',
 },
 {
 d: 'M 100 350 L 250 300 L 400 350 L 550 300 L 700 350',
 color: '#FF6B6B',
 label: 'Polyline path',
 },
];

chart.options({
 type: 'view',
 width: 640,
 height: 480,
 children: [
 {
 type: 'path',
 data: pathData,
 encode: {
 d: 'd', // Field containing the SVG path string.
 color: 'color',
 },
 style: {
 lineWidth: 2,
 fillOpacity: 0, // Paths are often used as outlines only.
 },
 },
 ],
});

chart.render();
```

## Closed paths with fill

```javascript
// Closed paths that end with Z can be filled.
const shapes = [
 {
 d: 'M 200 100 L 300 300 L 100 300 Z', // triangle
 category: 'Triangle',
 },
 {
 d: 'M 450 100 L 550 150 L 550 250 L 450 300 L 350 250 L 350 150 Z', // hexagon
 category: 'Hexagon',
 },
];

chart.options({
 type: 'path',
 data: shapes,
 encode: {
 d: 'd',
 color: 'category',
 },
 style: {
 fillOpacity: 0.3,
 lineWidth: 2,
 },
});
```

## Common errors and fixes

### Error: using x/y encodings with a path mark
```javascript
// ❌ The path mark does not use x/y coordinate encodings; it uses d for SVG path data.
chart.options({
 type: 'path',
 encode: { x: 'x', y: 'y' }, // ❌ x/y encodings are not supported by path.
});

// ✅ Provide a complete SVG path string through the d field.
chart.options({
 type: 'path',
 encode: { d: 'd' }, // ✅ d contains the SVG path string.
 style: { lineWidth: 2 },
});
```

### Error: confusing path with line
```javascript
// To connect multiple data-coordinate points, use a line mark.
chart.options({ type: 'line', encode: { x: 'date', y: 'value' } });

// To render a custom SVG path shape, use a path mark.
chart.options({ type: 'path', encode: { d: 'pathString' } });
```
