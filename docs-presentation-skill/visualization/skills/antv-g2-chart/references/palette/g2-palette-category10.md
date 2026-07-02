---
id: "g2-palette-category10"
title: "G2 Category10 Palette"
description: |
  AntV's classic 10-color palette for color mapping in categorical data.
  It includes 10 carefully designed colors and works well for most categorical visualization scenarios.

library: "g2"
version: "5.x"
category: "palette"
tags:
  - "palette"
  - "palette"
  - "color"
  - "categorical"
  - "10 colors"

related:
  - "g2-palette-category20"
  - "g2-scale-ordinal"
  - "g2-theme-builtin"

use_cases:
  - "Default colors for categorical data"
  - "Color mapping for bar charts and line charts"
  - "Scenarios that need no more than 10 colors"

anti_patterns:
  - "When there are more than 10 categories, consider Category20 or a custom palette"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/palette"
---

## Core concepts

Category10 is AntV's default categorical palette:
- Includes 10 colors
- Colors are carefully designed and easy to distinguish
- Suitable for most categorical visualization scenarios

**Color list:**
```
#5B8FF9  - Blue
#5AD8A6  - Green
#5D7092  - Gray blue
#F6BD16  - Yellow
#6F5EF9  - Purple
#6DC8EC  - Cyan
#945FB9  - Deep purple
#FF9845  - Orange
#1E9493  - Deep cyan
#FF99C3  - Pink
```

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'interval',
  data: [
    { category: 'A', value: 100 },
    { category: 'B', value: 150 },
    { category: 'C', value: 80 },
  ],
  encode: {
    x: 'category',
    y: 'value',
    color: 'category',
  },
  // Category10 is the default palette, so it does not need to be specified explicitly.
});

chart.render();
```

## Common variants

### Specify the palette explicitly

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  scale: {
    color: {
      type: 'ordinal',
      range: 'category10',  // Specify explicitly.
    },
  },
});
```

### Custom color range

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  scale: {
    color: {
      type: 'ordinal',
      range: [
        '#5B8FF9',
        '#5AD8A6',
        '#5D7092',
        '#F6BD16',
        '#6F5EF9',
      ],
    },
  },
});
```

### Configure with Theme

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  theme: {
    defaultCategory10: 'category10',
  },
});
```

## Complete color reference

| Index | Color value | Color name |
|------|--------|--------|
| 0 | #5B8FF9 | Blue |
| 1 | #5AD8A6 | Green |
| 2 | #5D7092 | Gray blue |
| 3 | #F6BD16 | Yellow |
| 4 | #6F5EF9 | Purple |
| 5 | #6DC8EC | Cyan |
| 6 | #945FB9 | Deep purple |
| 7 | #FF9845 | Orange |
| 8 | #1E9493 | Deep cyan |
| 9 | #FF99C3 | Pink |

## Comparison with Category20

| Feature | Category10 | Category20 |
|------|------------|------------|
| Number of colors | 10 | 20 |
| Color style | Consistent saturation | Alternating saturation |
| Applicable scenario | Up to 10 categories | 10-20 categories |
| Used by default | Yes | No |

## Common errors and fixes

### Error 1: More than 10 categories

```javascript
// Warning: Colors are reused cyclically when there are more than 10 categories.
// Category 11 will use the same color as category 1.

// Solution 1: Use Category20.
scale: {
  color: { type: 'ordinal', range: 'category20' }
}

// Solution 2: Customize with more colors.
scale: {
  color: {
    type: 'ordinal',
    range: [...customColors]
  }
}
```

### Error 2: Invalid color value format

```javascript
// Error: The color value format is invalid.
range: ['rgb(91, 143, 249)', ...]

// Correct: Use the standard HEX format.
range: ['#5B8FF9', ...]
```
