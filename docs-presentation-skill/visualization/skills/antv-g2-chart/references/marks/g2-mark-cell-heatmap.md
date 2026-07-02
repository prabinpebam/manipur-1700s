---
id: "g2-mark-cell-heatmap"
title: "G2 Heatmap (Cell Mark)"
description: |
  Use Cell Mark to create a matrix heatmap, where color intensity represents the value at the intersection of two categorical dimensions.
  Commonly used for correlation analysis, time-category distributions, and similar scenarios. This article uses Spec mode.

library: "g2"
version: "5.x"
category: "marks"
subcategory: "cell"
tags:
  - "heatmap"
  - "Cell"
  - "heatmap"
  - "matrix"
  - "correlation"
  - "color mapping"
  - "spec"

related:
  - "g2-core-encode-channel"
  - "g2-scale-sequential"
  - "g2-comp-legend-config"

use_cases:
  - "Show values at the intersection of two categorical dimensions (such as a correlation matrix)"
  - "Time heatmap (such as activity by day of week)"
  - "User behavior matrix analysis"

anti_patterns:
  - "Use a density plot or contour plot when x/y data is continuous"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/heatmap/basic"
---

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'cell',
  data: [
    { week: 'Mon', hour: '6AM',  value: 10 },
    { week: 'Mon', hour: '12PM', value: 80 },
    { week: 'Mon', hour: '6PM',  value: 60 },
    { week: 'Tue', hour: '6AM',  value: 5  },
    { week: 'Tue', hour: '12PM', value: 95 },
    { week: 'Tue', hour: '6PM',  value: 70 },
    { week: 'Wed', hour: '6AM',  value: 20 },
    { week: 'Wed', hour: '12PM', value: 75 },
    { week: 'Wed', hour: '6PM',  value: 55 },
  ],
  encode: {
    x: 'week',
    y: 'hour',
    color: 'value',    // Color intensity represents value magnitude
  },
  scale: {
    color: { 
      type: 'sequential',   // Explicitly specify a sequential color scale
      palette: 'YlOrRd'     // Continuous color scale: YlOrRd | Blues | Viridis, etc.
    },
  },
  style: {
    inset: 1,    // Cell spacing (px)
  },
});

chart.render();
```

## Heatmap with numeric labels

```javascript
chart.options({
  type: 'cell',
  data,
  encode: { x: 'week', y: 'hour', color: 'value' },
  scale: {
    color: { type: 'sequential', palette: 'Blues' },
  },
  labels: [
    {
      text: 'value',
      style: {
        fontSize: 11,
        fill: (d) => d.value > 60 ? 'white' : '#333',  // Use white text on dark backgrounds
      },
    },
  ],
  style: { inset: 2 },
});
```

## Correlation coefficient matrix

```javascript
// Correlation-analysis heatmap (diverging color scale from -1 to 1)
chart.options({
  type: 'cell',
  data: correlationData,  // [{ x: 'Variable A', y: 'Variable B', corr: 0.75 }, ...]
  encode: {
    x: 'x',
    y: 'y',
    color: 'corr',
  },
  scale: {
    color: {
      type: 'sequential',  // Explicitly specify a sequential color scale
      palette: 'RdBu',     // Diverging color scale: red-white-blue
      domain: [-1, 1],     // Fixed numeric range
    },
  },
  labels: [
    {
      text: (d) => d.corr.toFixed(2),
      style: { fontSize: 10 },
    },
  ],
});
```

## Calendar heatmap (GitHub style)

```javascript
// Calendar view of daily activity
chart.options({
  type: 'cell',
  data: dailyData,   // [{ date: '2024-01-01', weekday: 'Mon', week: 1, value: 5 }, ...]
  encode: {
    x: 'week',      // Week number (1-53)
    y: 'weekday',   // Weekday
    color: 'value',
  },
  scale: {
    color: { type: 'sequential', palette: 'Greens', domain: [0, 20] },
    y: {
      domain: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
  },
  style: { inset: 2, radius: 2 },
  axis: {
    y: { title: null },
    x: { title: null, tickCount: 4 },
  },
});
```

## Terrain elevation heatmap

```javascript
// Simulate terrain elevation data
const terrainData = [];
for (let x = 0; x <= 50; x += 2) {
  for (let y = 0; y <= 50; y += 2) {
    // Simulate mountainous terrain: elevation distribution of two peaks
    const elevation1 = 100 * Math.exp(-((x - 15) ** 2 + (y - 15) ** 2) / 200);
    const elevation2 = 80 * Math.exp(-((x - 35) ** 2 + (y - 35) ** 2) / 150);
    const elevation = elevation1 + elevation2 + 10; // Base elevation
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
      type: 'sequential',
      palette: 'viridis',
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

## Common errors and fixes

### Error 1: missing scale configuration on the color channel causes discrete colors
```javascript
// ❌ Issue: color uses a discrete color scale by default, which is not suitable for continuous values
chart.options({ type: 'cell', encode: { x: 'a', y: 'b', color: 'value' } });
// value is continuous but is mapped to discrete colors

// ✅ Correct: specify a continuous palette and explicitly set the type to sequential
chart.options({
  type: 'cell',
  encode: { x: 'a', y: 'b', color: 'value' },
  scale: { 
    color: { 
      type: 'sequential',   // Explicitly specify a sequential color scale
      palette: 'Blues'      // Or 'YlOrRd', 'Viridis', etc.
    } 
  },
});
```

### Error 2: cell sizes are uneven
```javascript
// ❌ Issue: cells deform when the x/y axis category counts differ greatly
// ✅ Fix: set the Chart aspect ratio close to the ratio of x/y category counts
const chart = new Chart({
  container: 'container',
  width: xCategories.length * 40,    // 40 px per cell
  height: yCategories.length * 40,
});
```

### Error 3: not using transform.group correctly causes duplicated or missing data
```javascript
// ❌ Issue: when duplicate x/y channel combinations exist, not using group aggregation can cause overlapping cells or data loss
chart.options({
  type: 'cell',
  data: [
    { day: 1, month: 0, temp: 10 },
    { day: 1, month: 0, temp: 15 }, // Two temperature records for the same day and month
  ],
  encode: {
    x: 'day',
    y: 'month',
    color: 'temp'
  }
});
// The code above may show only one value or produce multiple overlapping cells

// ✅ Correct: use transform.group to aggregate duplicate data (for example, by taking the maximum or average)
chart.options({
  type: 'cell',
  data: [
    { day: 1, month: 0, temp: 10 },
    { day: 1, month: 0, temp: 15 },
  ],
  encode: {
    x: 'day',
    y: 'month',
    color: 'temp'
  },
  transform: [{
    type: 'group',
    color: 'max'  // For data with the same x/y combination, take the maximum temp value
  }]
});
```

### Error 4: not setting scale.type to sequential correctly causes abnormal color mapping
```javascript
// ❌ Issue: if the color channel does not explicitly set scale.type to 'sequential', color mapping may not match expectations
chart.options({
  type: 'cell',
  encode: { x: 'a', y: 'b', color: 'value' },
  scale: { color: { palette: 'Blues' } } // Only palette is set; type is not set
});

// ✅ Correct: explicitly specify scale.type as 'sequential'
chart.options({
  type: 'cell',
  encode: { x: 'a', y: 'b', color: 'value' },
  scale: { 
    color: { 
      type: 'sequential',  // Explicitly specify a sequential color scale
      palette: 'Blues' 
    } 
  }
});
```

### Error 5: case-sensitive palette names can prevent the palette from being found
```javascript
// ❌ Issue: palette name case does not match, such as 'gnBu' when it should actually be 'GnBu'
chart.options({
  type: 'cell',
  data,
  encode: { x: 'day', y: 'month', color: 'temp' },
  scale: {
    color: { type: 'sequential', palette: 'gnBu' } // Lowercase g does not match the actual name
  }
});

// ✅ Correct: use the correct palette name (mind the letter case)
chart.options({
  type: 'cell',
  data,
  encode: { x: 'day', y: 'month', color: 'temp' },
  scale: {
    color: { type: 'sequential', palette: 'GnBu' } // Correct uppercase G
  }
});
```

### Error 6: data is undefined or referenced incorrectly
```javascript
// ❌ Issue: uses an undefined variable 'data'
const processedData = data.map(...);

// ✅ Correct: ensure the data variable being used is correctly defined
const rawData = [...];
const processedData = rawData.map(...);
```

### Error 7: animation configuration syntax error
```javascript
// ❌ Issue: animate.enter should be an object, not a string or another type
chart.options({
  type: 'cell',
  data,
  encode: { x: 'x', y: 'y', color: 'value' },
  animate: 'fadeIn' // Incorrect configuration style
});

// ✅ Correct: use a standard animation configuration object
chart.options({
  type: 'cell',
  data,
  encode: { x: 'x', y: 'y', color: 'value' },
  animate: {
    enter: {
      type: 'fadeIn',
      duration: 1000
    }
  }
});
```
