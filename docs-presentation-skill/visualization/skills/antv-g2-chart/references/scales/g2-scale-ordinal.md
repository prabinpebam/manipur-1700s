---
id: "g2-scale-ordinal"
title: "G2 Ordinal Scale"
description: |
  The ordinal scale maps discrete category values to discrete output values, such as colors.
  It is mainly used for the color channel, mapping string categories to a color array.
  Specify a custom color list through range, or use a built-in palette through palette.

library: "g2"
version: "5.x"
category: "scales"
tags:
  - "ordinal"
  - "ordinal"
  - "scale"
  - "color"
  - "categorical colors"
  - "scale"
  - "palette"

related:
  - "g2-scale-linear"
  - "g2-theme-builtin"

use_cases:
  - "Customize categorical color mapping"
  - "Assign specific colors to specific categories"
  - "Use built-in or custom palettes"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/scale/ordinal"
---

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'interval',
  data: [
    { genre: 'Sports', sold: 275 },
    { genre: 'Strategy', sold: 115 },
    { genre: 'Action', sold: 120 },
    { genre: 'RPG',  sold: 98 },
  ],
  encode: { x: 'genre', y: 'sold', color: 'genre' },
  scale: {
    color: {
      type: 'ordinal',
      // Custom color list; order corresponds to categories in domain
      range: ['#F4664A', '#FAAD14', '#5B8FF9', '#30BF78'],
    },
  },
});

chart.render();
```

## Specify category-to-color mapping (domain + range)

```javascript
chart.options({
  scale: {
    color: {
      type: 'ordinal',
      domain: ['Passed', 'Failed', 'Skipped'],   // Specify category order
      range: ['#52c41a', '#ff4d4f', '#faad14'],  // Corresponding colors
    },
  },
});
```

## Use a built-in palette

```javascript
// G2 built-in palette names: 'tableau10', 'category10', 'set2', 'pastel', 'blues', etc.
chart.options({
  scale: {
    color: {
      type: 'ordinal',
      palette: 'tableau10',   // Use the Tableau 10 color palette
    },
  },
});
```

## Common mistakes and fixes

### Mistake 1: range has fewer colors than categories, so later categories reuse colors cyclically
```javascript
// ⚠️  There are 5 categories but only 3 colors, so categories 4 and 5 use the same colors as the first two
chart.options({
  scale: {
    color: {
      type: 'ordinal',
      domain: ['A', 'B', 'C', 'D', 'E'],
      range: ['red', 'blue', 'green'],  // ⚠️  Only 3 colors; D/E will cycle
    },
  },
});

// ✅ The number of range colors should be >= the number of categories
chart.options({
  scale: {
    color: {
      type: 'ordinal',
      range: ['#F4664A', '#FAAD14', '#5B8FF9', '#30BF78', '#9254DE'],  // ✅ 5 colors
    },
  },
});
```

### Mistake 2: using ordinal for a continuous numeric channel; use linear or sequential instead
```javascript
// ❌ Using ordinal for a numeric y-axis makes the Y-axis discrete
chart.options({
  scale: {
    y: { type: 'ordinal' },  // ❌ y is numeric, so use linear
  },
});

// ✅ Use linear for numeric scales
chart.options({
  scale: {
    y: { type: 'linear' },  // ✅
  },
});
```
