---
id: "g2-mark-linex-liney"
title: "G2 LineX / LineY Reference Lines"
description: |
 lineX draws a vertical reference line at a specified x value, and lineY draws a horizontal reference line at a specified y value.
 Use them to annotate averages, targets, thresholds, and similar guide lines.
 They are usually placed in the same view as the main chart through the view's children array.

library: "g2"
version: "5.x"
category: "marks"
tags:
 - "lineX"
 - "lineY"
 - "reference line"
 - "mean line"
 - "target line"
 - "annotation"
 - "guide line"

related:
 - "g2-comp-annotation"
 - "g2-mark-rangex"
 - "g2-mark-line-basic"

use_cases:
 - "Draw x-axis or y-axis mean lines in scatter plots."
 - "Add horizontal reference lines for target values."
 - "Annotate thresholds and warning levels."

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/annotation/line/"
---

## Minimal runnable example (mean reference line)

```javascript
import { Chart } from '@antv/g2';

const data = [
 { month: 'Jan', value: 83 },
 { month: 'Feb', value: 60 },
 { month: 'Mar', value: 95 },
 { month: 'Apr', value: 72 },
 { month: 'May', value: 110 },
];

const avg = data.reduce((sum, d) => sum + d.value, 0) / data.length;

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
 type: 'view',
 data,
 children: [
 // Main bar chart.
 {
 type: 'interval',
 encode: { x: 'month', y: 'value', color: 'month' },
 },
 // Horizontal mean reference line.
 {
 type: 'lineY',
 [{ y: avg }], // Reference line y value.
 encode: { y: 'y' },
 style: {
 stroke: '#F4664A',
 lineWidth: 1.5,
 lineDash: [6, 3], // Dashed line style.
 },
 labels: [
 {
 text: `Mean: ${avg.toFixed(1)}`,
 position: 'right',
 style: { fill: '#F4664A', fontSize: 12 },
 },
 ],
 },
 ],
});

chart.render();
```

## lineX (vertical reference line)

```javascript
// Add an x-axis mean line to a scatter plot.
const meanX = data.reduce((sum, d) => sum + d.x, 0) / data.length;

{
 type: 'lineX',
 data: [{ x: meanX }],
 encode: { x: 'x' },
 style: { stroke: '#5B8FF9', lineWidth: 1.5, lineDash: [4, 4] },
 labels: [{ text: `x̄=${meanX.toFixed(1)}`, position: 'top' }],
}
```

## Target line (fixed value)

```javascript
{
 type: 'lineY',
 data: [{ y: 100 }], // Fixed target value: 100.
 encode: { y: 'y' },
 style: {
 stroke: '#52c41a',
 lineWidth: 2,
 },
 labels: [
 { text: 'Target line 100', position: 'right', style: { fill: '#52c41a' } },
 ],
}
```

## Common errors and fixes

### Error: using nonexistent ruleX / ruleY types
```javascript
// ❌ Error: ruleX and ruleY are Vega-Lite concepts; G2 does not provide these mark types.
chart.options({ type: 'ruleX', ... });
chart.options({ type: 'ruleY', ... });

// ✅ Correct: G2 uses lineX and lineY.
chart.options({ type: 'lineX', data: [{ x: 5 }], encode: { x: 'x' } });
chart.options({ type: 'lineY', data: [{ y: 100 }], encode: { y: 'y' } });
```

### Error: the y field name in data is inconsistent with encode.y
```javascript
// ❌ Error: the data field is 'value', but encode.y is set to 'y'.
chart.options({
 type: 'lineY',
 data: [{ value: 100 }],
 encode: { y: 'y' }, // ❌ The field name is incorrect; no 'y' field exists.
});

// ✅ Correct: keep the encoded field name consistent with the data.
chart.options({
 type: 'lineY',
 data: [{ value: 100 }],
 encode: { y: 'value' }, // ✅
});
// Alternatively, use a 'y' field directly:
chart.options({
 type: 'lineY',
 data: [{ y: 100 }],
 encode: { y: 'y' }, // ✅ The field names match.
});
```

### Error: placing lineY outside the view prevents it from sharing the main chart scale, causing an offset
```javascript
// ❌ The reference line and main chart are not in the same view, so they do not share the y-axis scale.
chart.options({
 type: 'view',
 children: [
 { type: 'interval', encode: { x: 'month', y: 'sales' } },
 ],
});
// Adding lineY separately outside children will not align with the main chart.

// ✅ The reference line must be placed in the same view's children array.
chart.options({
 type: 'view',
 children: [
 { type: 'interval', encode: { x: 'month', y: 'sales' } },
 { type: 'lineY', data: [{ y: 100 }], encode: { y: 'y' } }, // ✅
 ],
});
```
