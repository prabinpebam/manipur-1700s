---
id: "g2-mark-liquid"
title: "G2 Liquid Chart (liquid)"
description: |
 The liquid mark displays a single percentage value as a circle filled with animated waves.
 It is commonly used for completion rates, health indicators, KPI attainment, and similar metrics.
 Data is a decimal value from 0 to 1, representing a percentage.

library: "g2"
version: "5.x"
category: "marks"
tags:
 - "liquid"
 - "liquid chart"
 - "progress"
 - "percentage"
 - "KPI"
 - "completion rate"

related:
 - "g2-mark-gauge"
 - "g2-core-chart-init"

use_cases:
 - "Show target completion rates or KPI attainment."
 - "Display proportional metrics such as memory usage."
 - "Visualize key dashboard metrics."

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/other/#liquid"
---

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 300, height: 300 });

chart.options({
 type: 'liquid',
 data: 0.72, // Percentage value in the 0-1 range.
 style: {
 outlineBorder: 4, // Outer outline width.
 outlineDistance: 8, // Spacing between the outline and the inner circle.
 waveLength: 128, // Wave length.
 },
});

chart.render();
```

## Custom styles

```javascript
chart.options({
 type: 'liquid',
 data: 0.6,
 style: {
 outlineBorder: 4,
 outlineDistance: 8,
 waveLength: 128,
 // Wave color.
 fill: '#5B8FF9',
 fillOpacity: 0.85,
 // Background circle color.
 background: {
 fill: '#E8F0FE',
 },
 // Center text style.
 text: {
 style: {
 fontSize: 28,
 fontWeight: 'bold',
 fill: '#fff',
 // Custom text content. By default, the percentage is displayed.
 formatter: (v) => `${(v * 100).toFixed(1)}%`,
 },
 },
 },
 // Hide axes and legends.
 axis: false,
 legend: false,
 tooltip: false,
});
```

## Common errors and fixes

### Error 1: value outside the 0-1 range, causing an abnormal wave position
```javascript
// ❌ Error: the liquid value is 72, but it should be 0.72.
chart.options({
 type: 'liquid',
 data: 72, // ❌ Use 0.72 instead.
});

// ✅ Correct: use a decimal value from 0 to 1.
chart.options({
 data: 0.72, // ✅
});
```

### Error 2: axes are enabled, but axes are meaningless in a liquid chart
```javascript
// ❌ A liquid chart may show chart components that are usually unnecessary.
chart.options({
 type: 'liquid',
 data: 0.7,
 // ❌ Axis, legend, and tooltip are not disabled.
});

// ✅ Recommended: disable extra components.
chart.options({
 type: 'liquid',
 data: 0.7,
 axis: false, // ✅ Disable axes.
 legend: false, // ✅ Disable the legend.
 tooltip: false, // ✅ Disable the tooltip.
});
```
