---
id: "g2-transform-jitter"
title: "G2 Jitter Transform (Spread Overlapping Points)"
description: |
  The jitter transform adds random offsets to data points on categorical axes to prevent points in the same category from completely overlapping.
  jitter jitters both X and Y, jitterX jitters only X (commonly used for points on bar charts),
  and jitterY jitters only Y. It is commonly used with the point mark to show the distribution of categorical data.

library: "g2"
version: "5.x"
category: "transforms"
tags:
  - "jitter"
  - "jitter"
  - "dot plot"
  - "distribution"
  - "overlap"
  - "beeswarm"
  - "transform"

related:
  - "g2-mark-point-scatter"
  - "g2-transform-dodgex"
  - "g2-transform-stacky"

use_cases:
  - "Show the density distribution of data points within each category (more detailed than a box plot)"
  - "Prevent multiple data points on categorical axes from overlapping"
  - "Overlay with a box plot to show both statistical summaries and raw data"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/transform/jitter"
---

## Minimal Runnable Example (jitter Prevents Overlap in a Categorical Scatter Plot)

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'point',
  data: [
    { dept: 'Engineering', salary: 18000 }, { dept: 'Engineering', salary: 22000 },
    { dept: 'Engineering', salary: 15000 }, { dept: 'Engineering', salary: 19000 },
    { dept: 'Sales', salary: 12000 }, { dept: 'Sales', salary: 16000 },
    { dept: 'Sales', salary: 14000 }, { dept: 'Sales', salary: 11000 },
    { dept: 'Design', salary: 17000 }, { dept: 'Design', salary: 20000 },
  ],
  encode: {
    x: 'dept',     // Categorical axis (jittered in this direction)
    y: 'salary',
    color: 'dept',
  },
  transform: [{ type: 'jitter' }],   // Add random jitter in both x and y directions
  style: { fillOpacity: 0.7, r: 4 },
});

chart.render();
```

## jitterX (Horizontal Jitter Only)

```javascript
// Suitable for a vertical categorical axis: spread only in the x direction while preserving exact y values
chart.options({
  type: 'point',
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  transform: [
    {
      type: 'jitterX',
      padding: 0.1,    // Category width ratio (0 to 0.5); default is 0
      random: Math.random,  // Custom random function (a fixed seed can be used)
    },
  ],
});
```

## Overlay with a Box Plot

```javascript
chart.options({
  type: 'view',
  children: [
    // Box plot (shows statistical summary)
    {
      type: 'boxplot',
      data,
      encode: { x: 'dept', y: 'salary' },
      style: { boxFill: 'transparent', lineWidth: 1.5 },
    },
    // Scatter points (show the raw data distribution)
    {
      type: 'point',
      data,
      encode: { x: 'dept', y: 'salary', color: 'dept' },
      transform: [{ type: 'jitter', padding: 0.1 }],
      style: { r: 3, fillOpacity: 0.6 },
    },
  ],
});
```

## Options

```javascript
transform: [
  {
    type: 'jitter',    // Or 'jitterX' / 'jitterY'
    padding: 0,        // Category boundary padding (0 to 0.5); default is 0
    paddingX: 0,       // Set X padding separately (overrides padding)
    paddingY: 0,       // Set Y padding separately (overrides padding)
    random: Math.random, // Random function; can be replaced with seeded pseudo-random
  },
]
```

## Common Mistakes and Fixes

### Mistake 1: Using jitter on numeric axes--the result is confusing when both directions are numeric
```javascript
// ❌ Mistake: when both x and y are numeric, jitter distorts the exact numeric relationship
chart.options({
  type: 'point',
  encode: { x: 'price', y: 'sales' },  // Both are numeric axes
  transform: [{ type: 'jitter' }],      // ❌ Scatter plots do not normally overlap, so it is unnecessary
});

// ✅ Apply jitter in scenarios with a categorical axis
chart.options({
  encode: { x: 'category', y: 'value' },  // x is categorical
  transform: [{ type: 'jitter' }],         // ✅
});
```

### Mistake 2: Jitter is not obvious with large point datasets because padding is too small
```javascript
// ❌ With the default padding: 0, all points jitter only within a very small range of the category width
transform: [{ type: 'jitter' }]  // padding defaults to 0, so the jitter range is very small

// ✅ Increase padding appropriately
transform: [{ type: 'jitter', padding: 0.15 }]  // Use 15% of the category width as the jitter range
```