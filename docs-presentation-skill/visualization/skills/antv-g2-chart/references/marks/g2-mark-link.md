---
id: "g2-mark-link"
title: "G2 Link Chart (Connecting Two Points)"
description: |
 The link mark draws a line segment between two data points. Each record defines an independent start point (x/y) and end point (x1/y1).
 Unlike the line mark, each link record is an independent segment and does not require color or series grouping.
 It is suitable for migration, comparison, and ranking-change scenarios.

library: "g2"
version: "5.x"
category: "marks"
tags:
 - "link"
 - "link segment"
 - "slope chart"
 - "ranking change"
 - "migration chart"
 - "two-point link"

related:
 - "g2-mark-line-basic"
 - "g2-mark-point-scatter"

use_cases:
 - "Build slope charts that show ranking or value changes between two periods."
 - "Connect intervals across two categories, such as migration or offset comparisons."
 - "Show paths between start and end points."

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/link/"
---

## Minimal runnable example (slope chart for ranking changes)

```javascript
import { Chart } from '@antv/g2';

// Each record represents one city's ranking change from 2022 to 2023.
const data = [
 { city: 'Beijing', rank2022: 1, rank2023: 2 },
 { city: 'Shanghai', rank2022: 2, rank2023: 1 },
 { city: 'Guangzhou', rank2022: 3, rank2023: 5 },
 { city: 'Shenzhen', rank2022: 4, rank2023: 3 },
 { city: 'Chengdu', rank2022: 5, rank2023: 4 },
];

const chart = new Chart({ container: 'container', width: 400, height: 480 });

chart.options({
 type: 'link',
 data,
 encode: {
 x: ['2022', '2023'], // Two x-axis positions: start and end.
 y: ['rank2022', 'rank2023'], // Two y values: start and end.
 color: 'city',
 },
 scale: {
 y: { reverse: true }, // Show rankings from top to bottom, with 1 at the top.
 },
 style: {
 lineWidth: 2,
 strokeOpacity: 0.8,
 },
 // Display labels at both ends.
 labels: [
 { text: (d) => `${d.city} ${d.rank2022}`, position: 'left' },
 { text: (d) => `${d.rank2023}`, position: 'right' },
 ],
});

chart.render();
```

## Arrow links

```javascript
chart.options({
 type: 'link',
 data,
 encode: {
 x: ['source_x', 'target_x'],
 y: ['source_y', 'target_y'],
 color: 'type',
 },
 style: {
 lineWidth: 1.5,
 // End arrow.
 endArrow: true,
 endArrowSize: 8,
 },
});
```

## Common errors and fixes

### Error: encode.x/y is written as a single field name, but link requires [start field, end field] arrays
```javascript
// ❌ Error: x and y are single fields, so only one endpoint is defined.
chart.options({
 type: 'link',
 encode: {
 x: 'x', // ❌ Only one position.
 y: 'y', // ❌
 },
});

// ✅ Correct: x and y must be arrays containing two field names.
chart.options({
 type: 'link',
 encode: {
 x: ['x0', 'x1'], // ✅ [start point field, end point field]
 y: ['y0', 'y1'], // ✅
 },
});
```

### Error: using a line mark instead of a link mark; behavior differs with multiple data series
```javascript
// ❌ If each record is an independent segment, line requires series grouping and is error-prone.
chart.options({
 type: 'line',
 encode: { x: 'x', y: 'y', color: 'id' }, // Requires color to split the lines.
});

// ✅ For one line segment per record, use link directly.
chart.options({
 type: 'link',
 encode: { x: ['x0', 'x1'], y: ['y0', 'y1'] }, // ✅ More intuitive.
});
```
