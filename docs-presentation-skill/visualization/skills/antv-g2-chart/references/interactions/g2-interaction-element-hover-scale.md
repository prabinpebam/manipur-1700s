---
id: "g2-interaction-element-hover-scale"
title: "G2 Hover Scale Interaction (elementHoverScale)"
description: |
  elementHoverScale scales chart elements up when the pointer hovers over them, adding depth and visual feedback.
  It is well suited for enhancing independent elements such as pie slices and points, and it creates a stronger visual effect than standard highlighting.

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "elementHoverScale"
  - "hover scale"
  - "hover"
  - "scale"
  - "interaction"

related:
  - "g2-interaction-element-highlight"
  - "g2-mark-arc-pie"

use_cases:
  - "Pop out and enlarge pie or donut slices on hover"
  - "Enlarge data points on hover in scatter plots"
  - "Create hover enlargement effects for dashboard cards"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/element-hover-scale"
---

## Minimal runnable example (pie chart hover scaling)

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 480, height: 480 });

chart.options({
  type: 'interval',
  data: [
    { type: 'Electronics', value: 40 },
    { type: 'Apparel', value: 25 },
    { type: 'Food', value: 20 },
    { type: 'Other', value: 15 },
  ],
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'theta', outerRadius: 0.85 },
  interaction: {
    elementHoverScale: true,   // Pop out and enlarge the slice on hover
  },
});

chart.render();
```

## Configure the scale ratio

```javascript
chart.options({
  interaction: {
    elementHoverScale: {
      scale: 1.1,    // Scale factor; the default is about 1.1 (10% larger)
    },
  },
});
```

## Combine with other interactions

```javascript
// Pie chart: hover scaling + tooltip
chart.options({
  type: 'interval',
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'theta' },
  interaction: {
    elementHoverScale: true,   // Scale up
    tooltip: true,             // Show the tooltip at the same time
  },
});
```

## Common errors and fixes

### Error: using elementHighlight at the same time creates conflicting visual effects
```javascript
// ❌ Enabling both makes the hovered element scale and change opacity, which creates a confusing effect
chart.options({
  interaction: {
    elementHoverScale: true,
    elementHighlight: true,   // ❌ Conflicts with hoverScale
  },
});

// ✅ Choose only one hover interaction
chart.options({
  interaction: {
    elementHoverScale: true,  // ✅ Scale effect
    // or
    // elementHighlight: true,  // ✅ Dimming effect
  },
});
```
