---
id: "g2-scale-band"
title: "G2 Band Categorical Scale"
description: |
  Band Scale is the G2 scale used for categorical x-axes, such as bar charts.
  It maps discrete category values to equal-width bands and supports configuring inner and outer spacing.
  It is used automatically when encode.x maps to a string or categorical field.

library: "g2"
version: "5.x"
category: "scales"
tags:
  - "band"
  - "categorical scale"
  - "bar chart"
  - "padding"
  - "scale"
  - "ordinal"
  - "spec"

related:
  - "g2-mark-interval-basic"
  - "g2-mark-interval-grouped"
  - "g2-comp-axis-config"

use_cases:
  - "Configure bar width and spacing in bar charts"
  - "Specify the display order of a categorical axis"
  - "Control alignment for categorical data"

difficulty: "intermediate"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/scale/band"
---

## Automatic detection

When encode.x maps to a string field, G2 automatically uses Band Scale, so explicit configuration is usually unnecessary:

```javascript
chart.options({
  type: 'interval',
  data: [
    { genre: 'Sports',   sold: 275 },
    { genre: 'Strategy', sold: 115 },
  ],
  encode: { x: 'genre', y: 'sold' },   // 'genre' is a string, so Band Scale is used automatically
});
```

## Configuring bar width (padding)

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'genre', y: 'sold' },
  scale: {
    x: {
      type: 'band',
      padding: 0.3,         // Inner bar spacing (0-1), default 0.1
      // paddingInner: 0.3, // Same as padding
      // paddingOuter: 0.2, // Outer spacing at both ends
    },
  },
});
```

## Custom category order

```javascript
// Specify the category display order instead of the data order
chart.options({
  type: 'interval',
  data,
  encode: { x: 'genre', y: 'sold' },
  scale: {
    x: {
      type: 'band',
      domain: ['Action', 'Shooter', 'Sports', 'Strategy', 'Other'],  // Explicitly specify the order
    },
  },
});
```

## Heatmaps (cell mark)

`cell` marks also depend on bandwidth, so discrete x/y axes should use `band` (or omit the scale and let G2 infer it automatically). **Do not use the `point` scale**: point has bandwidth=0, so cells will be invisible.

```javascript
chart.options({
  type: 'cell',
  data: heatmapData,
  encode: { x: 'date', y: 'month', color: 'value' },
  // ✅ Omit the x/y scale; G2 automatically uses band for cell
  scale: {
    color: { type: 'sequential', palette: 'blues' },
  },
});

// ✅ You can also specify band explicitly
scale: {
  x: { type: 'band' },
  y: { type: 'band' },
  color: { type: 'sequential', palette: 'blues' },
}

// ❌ Do not use point: bandwidth=0, so cells disappear
scale: {
  x: { type: 'point' },  // ❌
  y: { type: 'point' },  // ❌
}
```

## Common mistakes and fixes

### Mistake: padding is outside the [0, 1] range
```javascript
// ❌ Mistake: padding > 1 makes the bar width negative
chart.options({ scale: { x: { padding: 1.5 } } });

// ✅ Correct: padding is between 0 and 1; 0 = no spacing, 0.5 = bar width and spacing each take half
chart.options({ scale: { x: { padding: 0.3 } } });
```
