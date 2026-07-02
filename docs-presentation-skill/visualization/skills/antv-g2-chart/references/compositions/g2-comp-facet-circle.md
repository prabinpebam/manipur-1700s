---
id: "g2-comp-facet-circle"
title: "G2 Circular Faceting (facetCircle)"
description: |
  facetCircle splits data into subsets by a field and arranges each subset chart along a circular path.
  Unlike the rectangular grid used by facetRect, facetCircle is suitable for cyclical data, such as 12 months arranged around a circle.
  Each subplot shares the same y-axis range, which makes comparisons easier.

library: "g2"
version: "5.x"
category: "compositions"
tags:
  - "facetCircle"
  - "circular faceting"
  - "facet"
  - "faceting"
  - "cycle"
  - "small multiples"

related:
  - "g2-comp-facet-rect"
  - "g2-comp-repeat-matrix"

use_cases:
  - "Compare 12 months with circular small multiples"
  - "Apply circular faceting to cyclical time data, such as days of the week or months of the year"
  - "Arrange charts for cyclical categories around a circle"

difficulty: "advanced"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/composition/facet-circle"
---

## Minimal Runnable Example (12-Month Circular Faceting)

```javascript
import { Chart } from '@antv/g2';

// Daily data for each month.
const data = [];
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
months.forEach((month, mi) => {
  for (let day = 1; day <= 10; day++) {
    data.push({ month, day, value: Math.random() * 100 });
  }
});

const chart = new Chart({ container: 'container', width: 640, height: 640 });

chart.options({
  type: 'facetCircle',
  data,
  encode: { position: 'month' },  // Facet by month and use it to position each subplot.
  children: [
    {
      type: 'interval',
      encode: { x: 'day', y: 'value', color: 'value' },
      scale: { color: { type: 'sequential', palette: 'blues' } },
      style: { lineWidth: 0 },
      coordinate: { type: 'polar' },  // Each subplot uses polar coordinates.
    },
  ],
});

chart.render();
```

## Common Errors and Fixes

### Error: Children do not use `coordinate: { type: 'polar' }`, so subplots are rectangular rather than circular
```javascript
// FacetCircle arranges subplots in a circle, but each subplot can still use Cartesian coordinates.
// Specify polar coordinates in children when you want each subplot to appear circular.
chart.options({
  type: 'facetCircle',
  encode: { position: 'month' },
  children: [
    {
      type: 'interval',
      encode: { x: 'day', y: 'value' },
      // No coordinate: polar. The subplot is a standard column chart arranged on a circle.
    },
  ],
});

// Usually, add polar coordinates to the subplot.
children: [
  {
    type: 'interval',
    encode: { x: 'day', y: 'value' },
    coordinate: { type: 'polar' },
  },
]
```
