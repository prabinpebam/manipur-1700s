---
id: "g2-palette-category20"
title: "G2 Category20 Palette"
description: |
  AntV's classic 20-color palette for color mapping in categorical data.
  It includes 20 colors and uses an alternating saturation design, making it suitable for visualization scenarios with more categories.

library: "g2"
version: "5.x"
category: "palette"
tags:
  - "palette"
  - "palette"
  - "color"
  - "categorical"
  - "20 colors"

related:
  - "g2-palette-category10"
  - "g2-scale-ordinal"
  - "g2-theme-builtin"

use_cases:
  - "Color mapping for more than 10 categories"
  - "Scenarios that need more color distinctions"
  - "Visualization of complex categorical data"

anti_patterns:
  - "Use Category10 when there are fewer categories"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/palette"
---

## Core concepts

Category20 is AntV's extended categorical palette:
- Includes 20 colors
- Uses an alternating saturation design pattern
- Suitable for scenarios with 10-20 categories

**Design characteristics:**
- The first half uses saturated colors, consistent with Category10
- The second half uses lower-saturation colors
- Alternating use can improve distinguishability

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
    // ... More categories
  ],
  encode: {
    x: 'category',
    y: 'value',
    color: 'category',
  },
  scale: {
    color: {
      type: 'ordinal',
      range: 'category20',
    },
  },
});

chart.render();
```

## Common variants

### Specify the color range explicitly

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  scale: {
    color: {
      type: 'ordinal',
      range: [
        '#5B8FF9', '#CDDDFD',
        '#5AD8A6', '#CDF3E4',
        '#5D7092', '#CED4DE',
        '#F6BD16', '#FCEBB9',
        '#6F5EF9', '#D3CEFD',
        '#6DC8EC', '#D3EEF9',
        '#945FB9', '#DECFEA',
        '#FF9845', '#FFE0C7',
        '#1E9493', '#BBDEDE',
        '#FF99C3', '#FFE0ED',
      ],
    },
  },
});
```

### Combine with custom colors

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  scale: {
    color: {
      type: 'ordinal',
      range: [
        ...customColors.slice(0, 10),
        '#5B8FF9', '#CDDDFD', // Supplement with Category20 colors.
        // ...
      ],
    },
  },
});
```

## Complete color reference

| Index | Color value | Saturation |
|------|--------|--------|
| 0 | #5B8FF9 | High |
| 1 | #CDDDFD | Low |
| 2 | #5AD8A6 | High |
| 3 | #CDF3E4 | Low |
| 4 | #5D7092 | High |
| 5 | #CED4DE | Low |
| 6 | #F6BD16 | High |
| 7 | #FCEBB9 | Low |
| 8 | #6F5EF9 | High |
| 9 | #D3CEFD | Low |
| 10 | #6DC8EC | High |
| 11 | #D3EEF9 | Low |
| 12 | #945FB9 | High |
| 13 | #DECFEA | Low |
| 14 | #FF9845 | High |
| 15 | #FFE0C7 | Low |
| 16 | #1E9493 | High |
| 17 | #BBDEDE | Low |
| 18 | #FF99C3 | High |
| 19 | #FFE0ED | Low |

## Comparison with Category10

| Feature | Category10 | Category20 |
|------|------------|------------|
| Number of colors | 10 | 20 |
| Color style | Consistent saturation | Alternating saturation |
| Applicable scenario | Up to 10 categories | 10-20 categories |
| Used by default | Yes | No |
| Difficulty distinguishing | Easier | Watch adjacent colors |

## Design recommendations

### Recommended number of categories

| Number of categories | Recommended palette |
|---------|-----------|
| 1-5 | Category10 |
| 6-10 | Category10 |
| 11-15 | Category20 |
| 16-20 | Category20 |
| >20 | Custom or grouped |

### Usage tips

```javascript
// Tip: Use alternating saturation to improve distinguishability.
// Place important categories at high-saturation positions (even indexes).

// Example: Highlight important categories.
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  scale: {
    color: {
      type: 'ordinal',
      range: [
        '#5B8FF9',  // High saturation - Category A
        '#CDDDFD',  // Low saturation - Category B
        '#5AD8A6',  // High saturation - Category C (important)
        // ...
      ],
    },
  },
});
```

## Common errors and fixes

### Error 1: More than 20 categories

```javascript
// Warning: Colors are reused cyclically when there are more than 20 categories.

// Solution 1: Customize with more colors.
scale: {
  color: {
    type: 'ordinal',
    range: [...30colors]
  }
}

// Solution 2: Merge small categories.
// Merge small categories into an "Other" category.
```

### Error 2: Adjacent colors are not distinguishable enough

```javascript
// Warning: Adjacent low-saturation colors may be hard to distinguish.

// Solution: Adjust the domain order.
scale: {
  color: {
    type: 'ordinal',
    domain: ['A', 'C', 'E', 'B', 'D'],  // Alternate high/low saturation.
    range: 'category20'
  }
}
```
