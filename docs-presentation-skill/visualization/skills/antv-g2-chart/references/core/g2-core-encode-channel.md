---
id: "g2-core-encode-channel"
title: "Detailed Guide to the G2 encode Channel System"
description: |
  encode is the core data-mapping mechanism in G2 v5. It maps data fields to visual channels such as position, color, size, and shape.
  In Spec mode, encode is a field in the options object; in the chained API, it is called through the .encode() method.

library: "g2"
version: "5.x"
category: "core"
tags:
  - "encode"
  - "channel"
  - "channel"
  - "data mapping"
  - "x"
  - "y"
  - "color"
  - "size"
  - "shape"
  - "spec"

related:
  - "g2-core-chart-init"
  - "g2-scale-linear"
  - "g2-scale-ordinal"
  - "g2-core-data-binding"

use_cases:
  - "Map data fields to visual properties of a chart"
  - "Understand the structure of the encode object in Spec mode"
  - "Configure multi-channel mappings"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/encode"
---

## Core Concepts

A **channel** is an abstraction of a graphical property. In Spec mode, `encode` is a field in the `options` object.
Each key is a channel name, and each value is a data field name (string) or a constant.

## Common Channel List

| Channel | Description | Common Marks |
|------|------|-----------|
| `x` | X-axis position | All marks |
| `y` | Y-axis position | All marks |
| `color` | Color (fill + stroke) | All marks |
| `size` | Size/thickness | Point, Link, Line |
| `shape` | Shape | Point, Interval |
| `opacity` | Opacity | All marks |
| `series` | Series grouping (does not affect color) | Line, Area |
| `key` | Element matching key during animation | All marks |

## Basic Usage (Spec Mode)

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data: [
    { city: 'Beijing', gdp: 3.6 },
    { city: 'Shanghai', gdp: 4.0 },
    { city: 'Guangzhou', gdp: 2.8 },
  ],
  encode: {
    x: 'city',      // Categorical axis: automatically uses a Band Scale
    y: 'gdp',       // Numeric axis: automatically uses a Linear Scale
    color: 'city',  // Distinguish by color
  },
});

chart.render();
```

## Typical Scenario Examples

### Time x-axis (line chart)

```javascript
chart.options({
  type: 'line',
  data: [
    { date: new Date('2024-01-01'), value: 100 },
    { date: new Date('2024-02-01'), value: 130 },
    { date: new Date('2024-03-01'), value: 110 },
  ],
  encode: {
    x: 'date',      // Date objects automatically use a Time Scale
    y: 'value',
    color: 'series', // Multi-series line chart
  },
});
```

### Dual numeric axes + bubble chart (multi-channel mapping)

```javascript
// Color mapping table shared by scale.color.range and the fill callback
const COLOR_MAP = { 'China': '#5B8FF9', 'USA': '#fb7678', 'Japan': '#81e7ee' };

chart.options({
  type: 'point',
  data: [
    { income: 30000, lifeExpect: 72, population: 1400, country: 'China' },
    { income: 60000, lifeExpect: 79, population: 330,  country: 'USA' },
    { income: 45000, lifeExpect: 84, population: 125,  country: 'Japan' },
  ],
  encode: {
    x: 'income',
    y: 'lifeExpect',
    size: 'population',    // Bubble size
    color: 'country',
    shape: 'point',
  },
  scale: {
    size: { type: 'sqrt', range: [4, 40] },    // sqrt scale + appropriate bubble range
    color: { range: Object.values(COLOR_MAP) },
  },
  style: {
    fillOpacity: 0.85,            // Do not use stroke: '#fff'; in light themes it looks like a broken chart
    lineWidth: 0,
    // Radial gradient: from a white center to the mapped edge color, simulating a 3D sphere texture
    // Get the color through COLOR_MAP[datum.country] and keep it consistent with scale.color.range
    fill: (datum) => {
      const color = COLOR_MAP[datum.country];
      return `radial-gradient(circle at 35% 35%, rgb(255,255,255) 0%, ${color} 100%)`;
    },
    shadowBlur: 10,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffsetY: 5,
  },
  legend: { size: false },        // The size legend is not very meaningful; hiding it is recommended
});
```

### Function Mapping (Advanced)

```javascript
chart.options({
  type: 'point',
  data: [...],
  encode: {
    x: 'date',
    y: 'value',
    // When value is a function: dynamically compute the channel value
    color: (d) => d.value > 100 ? 'red' : 'blue',
    size: (d) => Math.sqrt(d.count),
  },
});
```

## encode Field Value Types

| Value type | Meaning | Example |
|--------|------|------|
| `string` (field name) | Maps a data field | `'genre'` |
| `string` (color/shape constant) | Same value for all elements | `'#1890ff'`, `'circle'` |
| `number` | Same numeric value for all elements | `10` (size constant) |
| `function` | Dynamic calculation | `(d) => d.val * 2` |

> **Decision rule**: `encode.color` with `'genre'` is treated as a field name; `'#1890ff'` is treated as a color constant (starts with `#` or is a valid CSS color name). `encode.size` with `10` (number) is a constant.

## G2 v4 to v5 Spec Migration Comparison

| G2 v4 chained syntax | G2 v5 Spec encode field |
|-----------|------------------------|
| `.position('x*y')` | `encode: { x: 'x', y: 'y' }` |
| `.color('type')` | `encode: { color: 'type' }` |
| `.size('count')` | `encode: { size: 'count' }` |
| `.shape('circle')` | `encode: { shape: 'circle' }` |
| `.opacity('rate')` | `encode: { opacity: 'rate' }` |

## Mark-Specific Channels

Different mark types support additional channels:

| Mark | Specific channels | Description |
|------|---------|------|
| `interval` | `y1` | Interval endpoint (Gantt charts, range bars) |
| `line` | `shape` | Line type: `'line'`\|`'smooth'`\|`'hv'`\|`'vh'`\|`'hvh'`\|`'vhv'` |
| `point` | `shape` | Point shape: `'circle'`\|`'square'`\|`'diamond'`\|`'triangle'`\|... |
| `area` | `shape` | Area: `'area'`\|`'smooth'`\|`'hvh'` |
| `text` | `text` | Text content (field name or function) |
| `image` | `src` | Image URL field |
| `vector` | `rotate`, `size` | Direction angle and length |
| `sankey`/`chord` | `source`, `target`, `value` | Start point, end point, and weight for relationship diagrams |

## How encode Distinguishes Constants from Field Names

```javascript
encode: {
  color: 'type',       // Field name -> color by the type field
  color: '#1890ff',    // Starts with # -> color constant, same color for all elements
  color: 'steelblue',  // CSS color name -> color constant
  color: () => 'red',  // Function -> constant when it returns a fixed value
  size: 'population',  // Field name -> map size by population
  size: 10,            // Number -> size constant
}
```

## Common Mistakes and Fixes

### Mistake 1: putting encode inside style
```javascript
// Incorrect: style does not perform data mapping
chart.options({
  type: 'interval',
  data: [...],
  style: { color: 'genre' },  // Invalid! genre is a field name, not a color value
});

// Correct: use encode for data mapping and style for fixed styling
chart.options({
  type: 'interval',
  data: [...],
  encode: { color: 'genre' },   // Data-driven color
  style: { fillOpacity: 0.8 },  // Fixed opacity
});
```

### Mistake 2: confusing the color and series channels
```javascript
// Explanation: color both groups and changes colors; series only groups and does not change color
// For multi-series line charts, color is recommended:
chart.options({
  type: 'line',
  encode: {
    x: 'month',
    y: 'value',
    color: 'type',    // Recommended: each line has a different color
    // series: 'type', // Groups only, same color (use sparingly)
  },
});
```