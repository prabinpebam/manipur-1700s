---
id: "g2-mark-density"
title: "G2 Density Plot (density)"
description: |
  The density mark uses kernel density estimation (KDE) to convert scatter distributions into continuous density curves or area charts,
  showing the probability density of the data. It must be used with a KDE data transform (data.transform) for preprocessing,
  and is suitable for distribution visualization with many overlapping points.

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "density"
  - "density plot"
  - "KDE"
  - "distribution"
  - "kernel density"
  - "violin"

related:
  - "g2-mark-boxplot"
  - "g2-mark-point-scatter"
  - "g2-data-kde"

use_cases:
  - "Show the distribution shape of continuous numeric data"
  - "Violin plot (density + polar coordinates + symmetric transform)"
  - "Compare data distributions against a boxplot"

difficulty: "advanced"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-27"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/mark/density"
---

## Core concepts

**density mark must be used with a KDE data transform**:

- KDE is a **Data Transform**, configured in `data.transform`
- The required encode channels for density mark are: `x`, `y`, `size`, and `series` (all required)

**Key configuration structure**:
```javascript
chart.options({
  type: 'density',
  data: {
    type: 'fetch',  // Or 'inline'
    value: '...',
    transform: [{ type: 'kde', field: 'y', groupBy: ['x', 'species'] }],
  },
  encode: {
    x: 'x',
    y: 'y',       // ← KDE output field (default 'y'), not the original field name!
    size: 'size', // ← KDE output field (default 'size')
    series: 'species', // Required: series grouping
  },
});
```

**⚠️ `encode.y` must correspond to the KDE output field (default `'y'`), not the original field name**: regardless of what `field` is named (`'value'`, `'score'`, etc.), KDE output is written to the fields specified by `as` (default `['y', 'size']`).

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

chart.options({
  type: 'density',
  data: {
    type: 'fetch',
    value: 'https://assets.antv.antgroup.com/g2/species.json',
    transform: [
      {
        type: 'kde',           // KDE data transform
        field: 'y',            // Field for kernel density estimation
        groupBy: ['x', 'species'],  // Grouping fields
      },
    ],
  },
  encode: {
    x: 'x',
    y: 'y',
    color: 'species',
    size: 'size',      // Required: maps density magnitude
    series: 'species', // Required: series grouping
  },
  tooltip: false,
});

chart.render();
```

## Grouped density plot (multi-category comparison)

```javascript
chart.options({
  type: 'density',
  data: {
    type: 'fetch',
    value: 'https://assets.antv.antgroup.com/g2/species.json',
    transform: [
      {
        type: 'kde',
        field: 'y',
        groupBy: ['x'],  // Group by x
        size: 20,        // Bandwidth parameter
      },
    ],
  },
  encode: {
    x: 'x',
    y: 'y',
    color: 'x',
    size: 'size',
    series: 'x',
  },
  tooltip: false,
});
```

## Polar-coordinate density plot

```javascript
chart.options({
  type: 'density',
  data: {
    type: 'fetch',
    value: 'https://assets.antv.antgroup.com/g2/species.json',
    transform: [
      { type: 'kde', field: 'y', groupBy: ['x', 'species'] },
    ],
  },
  encode: {
    x: 'x',
    y: 'y',
    color: 'species',
    size: 'size',
    series: 'species',
  },
  coordinate: { type: 'polar' },  // Polar coordinate system
  tooltip: false,
});
```

## Common errors and fixes

### Error 1: incorrect kde configuration location

```javascript
// ❌ Error: kde is not data.type; it is data.transform
chart.options({
  type: 'density',
  data: {
    type: 'kde',  // ❌ Wrong! kde is not a data connector type
    field: 'value',
  },
});

// ✅ Correct: kde is a data transform and belongs in data.transform
chart.options({
  type: 'density',
  data: {
    type: 'fetch',
    value: 'https://example.com/data.json',
    transform: [{ type: 'kde', field: 'y', groupBy: ['x'] }],  // ✅ Correct
  },
});
```

### Error 2: missing required encode channels

```javascript
// ❌ Error: missing size and series channels
chart.options({
  type: 'density',
  data: { /* ... */ },
  encode: { x: 'x', y: 'y' },  // ❌ Missing size and series
});

// ✅ Correct: include all required channels
chart.options({
  type: 'density',
  data: { /* ... */ },
  encode: {
    x: 'x',
    y: 'y',
    size: 'size',      // Required
    series: 'species', // Required
  },
});
```

### Error 3: encode.y uses the original field name instead of the KDE output field name

The most common naming confusion: the original field is named `value`, so it is mistakenly assumed that encode should also use `y: 'value'`.

```javascript
// ❌ Error: field: 'value' is the KDE input, but encode.y must use the KDE output field
chart.options({
  type: 'density',
  data: {
    type: 'inline',
    value: rawData,
    transform: [{ type: 'kde', field: 'value', groupBy: ['group'] }],
    //                                ↑ The original field is named 'value'
  },
  encode: {
    x: 'group',
    y: 'value',  // ❌ 'value' is the original scalar, not the density array output by KDE
    size: 'size',
    series: 'group',
  },
});

// ✅ Correct: encode.y corresponds to the KDE output field (default as[0] = 'y')
chart.options({
  type: 'density',
  data: {
    type: 'inline',
    value: rawData,
    transform: [{ type: 'kde', field: 'value', groupBy: ['group'] }],
  },
  encode: {
    x: 'group',
    y: 'y',      // ✅ The default KDE output field name is 'y', not 'value'
    size: 'size',
    series: 'group',
  },
});
```

**Memory rule**: `field` is the KDE **input**, and `as` (default `['y', 'size']`) is the KDE **output**; encode must use **output field names**.

### Error 4: zero-variance data or single-point groups cause KDE degeneration (blank chart)

When a group has only 1 point or all values are identical (variance = 0), KDE has min=max internally, causing division by zero and NaN values, so that group's density plot is not rendered.

```javascript
// ❌ Problematic data: zero variance / single point; KDE fails silently
const data = [
  { group: 'Low load', value: 0 },           // Only 1 point
  { group: 'Medium load', value: 20 },
  { group: 'Medium load', value: 20 },          // 9 identical values
  // ...
];

// ✅ Solution 1: specify min/max to expand the KDE range and avoid a zero-width interval
transform: [{
  type: 'kde',
  field: 'value',
  groupBy: ['group'],
  min: -10,   // Manually specify the range to ensure min ≠ max
  max: 50,
}]

// ✅ Solution 2: when there are too few data points, use a boxplot or scatter plot instead of a density plot
// KDE should have at least 5-10 distinct values per group to produce a meaningful density curve
```

### Error 5: using raw data directly

```javascript
// ❌ Error: raw data has not gone through the KDE transform and has no size field
chart.options({
  type: 'density',
  data: rawPoints,  // ❌ Must go through the kde transform first
  encode: { x: 'x', y: 'y', size: 'size' },
});

// ✅ Correct: use data.transform for KDE preprocessing
chart.options({
  type: 'density',
  data: {
    type: 'inline',
    value: rawPoints,
    transform: [{ type: 'kde', field: 'y', groupBy: ['x'] }],
  },
  encode: { x: 'x', y: 'y', size: 'size', series: 'x' },
});
```

### Error 6: data is not passed correctly in a composite view

In a composite view (`type: 'view'`), if a child chart does not explicitly declare `data`, it inherits parent data. But if a child chart needs a specific data transform (such as KDE), it must explicitly declare its own `data` configuration.

```javascript
// ❌ Error: the child chart does not declare data, so the KDE transform cannot be applied
chart.options({
  type: 'view',
  data: rawData,
  children: [{
    type: 'density',
    // Missing data configuration; transform is ineffective
    encode: { x: 'x', y: 'y', size: 'size', series: 'species' },
  }]
});

// ✅ Correct: the child chart explicitly declares data and applies the KDE transform
chart.options({
  type: 'view',
  data: rawData,
  children: [{
    type: 'density',
    data: {
      // Explicitly declare data, even if it is the same as the parent
      type: 'inline',
      value: rawData,
      transform: [{ type: 'kde', field: 'y', groupBy: ['x', 'species'] }],
    },
    encode: { x: 'x', y: 'y', size: 'size', series: 'species' },
  }]
});
```

### Error 7: improper KDE grouping-field configuration causes insufficient data

When `groupBy` fields are split too finely, some groups can have too few data points (such as one or fewer). KDE cannot compute a valid density distribution, and that group is not rendered.

```javascript
// ❌ Error: groupBy contains too many fields, causing some groups to have only one data point
chart.options({
  type: 'density',
  data: {
    type: 'inline',
    value: rawData,
    transform: [{ 
      type: 'kde', 
      field: 'y', 
      groupBy: ['x', 'species', 'extraCategory'] // Grouping is too fine and may leave some groups with only one point
    }],
  },
  encode: { x: 'x', y: 'y', size: 'size', series: 'species' },
});

// ✅ Correct: choose groupBy fields appropriately so each group has enough data points
chart.options({
  type: 'density',
  data: {
    type: 'inline',
    value: rawData,
    transform: [{ 
      type: 'kde', 
      field: 'y', 
      groupBy: ['x', 'species'] // Reasonable grouping that keeps enough data in each group
    }],
  },
  encode: { x: 'x', y: 'y', size: 'size', series: 'species' },
});
```

### Error 8: KDE output field names not matching encode mappings cause a blank chart

When using `as` to customize output field names in a KDE transform, ensure the `y` and `size` channels in `encode` reference the correct custom field names.

```javascript
// ❌ Error: KDE output field names are density_x and density_y, but encode references the default field names
chart.options({
  type: 'density',
  data: {
    type: 'inline',
    value: rawData,
    transform: [{
      type: 'kde',
      field: 'y',
      groupBy: ['x'],
      as: ['density_x', 'density_y']
    }]
  },
  encode: {
    x: 'x',
    y: 'y',       // ❌ Should be 'density_x'
    size: 'size', // ❌ Should be 'density_y'
    series: 'x'
  }
});

// ✅ Correct: reference the custom field names output by KDE
chart.options({
  type: 'density',
  data: {
    type: 'inline',
    value: rawData,
    transform: [{
      type: 'kde',
      field: 'y',
      groupBy: ['x'],
      as: ['density_x', 'density_y']
    }]
  },
  encode: {
    x: 'x',
    y: 'density_x',  // ✅ Correctly reference the custom field name
    size: 'density_y', // ✅ Correctly reference the custom field name
    series: 'x'
  }
});
```

### Error 9: too few samples per group after KDE grouping causes a blank chart

The KDE algorithm requires enough sample points in each group (recommended at least 5-10 distinct values per group) to compute a density distribution effectively. Too few samples per group after grouping may cause the chart to render blank.

```javascript
// ❌ Error: too few samples per group after grouping
const insufficientData = [
  { group: 'A', value: 1 },
  { group: 'A', value: 1 },
  { group: 'B', value: 2 },
  { group: 'B', value: 2 }
];

chart.options({
  type: 'density',
  data: {
    type: 'inline',
    value: insufficientData,
    transform: [{ type: 'kde', field: 'value', groupBy: ['group'] }]
  },
  encode: { x: 'group', y: 'y', size: 'size', series: 'group' }
});

// ✅ Solution: merge groups, increase the sample count, or use another chart type
const sufficientData = [
  { group: 'A', value: 1 }, { group: 'A', value: 1.1 }, { group: 'A', value: 1.2 },
  { group: 'A', value: 1.3 }, { group: 'A', value: 1.4 }, { group: 'B', value: 2 },
  { group: 'B', value: 2.1 }, { group: 'B', value: 2.2 }, { group: 'B', value: 2.3 },
  { group: 'B', value: 2.4 }
];
```

## Configuration options

### encode channels

| Property | Description | Required |
|--------|------------------------------------------|------|
| x | X-axis field, time or ordered categorical field | ✓ |
| y | Y-axis field, numeric field (KDE output field) | ✓ |
| size | Density magnitude field (generated after the KDE transform) | ✓ |
| series | Series grouping field | ✓ |
| color | Color mapping field | |

### coordinate systems

| Coordinate system | Type | Use case |
|------------|--------------|------------------|
| Cartesian coordinate system | `'cartesian'` | Default; used for density plots and similar charts |
| Polar coordinate system | `'polar'` | Polar violin plots and similar charts |
| Symmetric coordinate system | `'transpose'` | Symmetric violin plots and similar charts |
