---
id: "g2-data-fold"
title: "G2 Fold Wide-to-Long Table Transform"
description: |
  The Fold data transform converts wide-format data (multiple columns) into long-format data (one value column plus a category column),
  allowing multiple fields to map to the same color/series channel.
  Configure it in data.transform. It is a common data preprocessing method for multi-series charts in G2.

library: "g2"
version: "5.x"
category: "data"
tags:
  - "fold"
  - "wide-to-long table"
  - "pivot"
  - "multi-series"
  - "data transform"

related:
  - "g2-data-filter"
  - "g2-data-sort"
  - "g2-mark-line-basic"
  - "g2-mark-area-stacked"

use_cases:
  - "Convert multi-column wide-table data into a multi-series line chart"
  - "Merge multiple fields of similar metrics into one series field"
  - "Reduce manual flatMap data preprocessing code"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/data/fold"
---

## Core concepts

**Fold is a data transform, not a mark transform**

- Configure data transforms in `data.transform`
- Runs during the data loading stage and affects all marks that use the data

**Wide table**: each metric occupies one column
```
month | revenue | cost | profit
Jan   | 320     | 200  | 120
Feb   | 450     | 230  | 220
```

**Long/Tidy table**: all metric values are merged into one column, with an added category column
```
month | key     | value
Jan   | revenue | 320
Jan   | cost    | 200
Jan   | profit  | 120
Feb   | revenue | 450
...
```

G2's `fold` data transform performs this conversion automatically, without manual `flatMap`.

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 700, height: 400 });

// Wide-table data, where each metric is a separate column
const wideData = [
  { month: 'Jan', revenue: 320, cost: 200, profit: 120 },
  { month: 'Feb', revenue: 450, cost: 230, profit: 220 },
  { month: 'Mar', revenue: 380, cost: 210, profit: 170 },
  { month: 'Apr', revenue: 510, cost: 260, profit: 250 },
];

chart.options({
  type: 'line',
  data: {
    type: 'inline',
    value: wideData,
    transform: [
      {
        type: 'fold',
        fields: ['revenue', 'cost', 'profit'],  // Column names to fold
        key: 'key',      // Generated key column name, default is 'key'
        value: 'value',  // Generated value column name, default is 'value'
      },
    ],
  },
  encode: {
    x: 'month',
    y: 'value',     // Value column after fold
    color: 'key',   // Key column after fold
  },
});

chart.render();
```

## Using fold in a stacked area chart

```javascript
chart.options({
  type: 'area',
  data: {
    type: 'inline',
    value: wideData,
    transform: [
      { type: 'fold', fields: ['revenue', 'cost', 'profit'] },
    ],
  },
  encode: { x: 'month', y: 'value', color: 'key' },
  transform: [{ type: 'stackY' }],  // mark transform
});
```

## Equivalent manual approach, for comparison

```javascript
// Without fold, manually use flatMap; the code is more verbose
const longData = wideData.flatMap((d) => [
  { month: d.month, metric: 'revenue', value: d.revenue },
  { month: d.month, metric: 'cost',    value: d.cost    },
  { month: d.month, metric: 'profit',  value: d.profit  },
]);

chart.options({
  type: 'line',
   longData,
  encode: { x: 'month', y: 'value', color: 'metric' },
});
```

## Configuration options

| Property | Description                                                 | Type       | Default |
| -------- | ----------------------------------------------------------- | ---------- | ------- |
| fields   | List of fields to expand                                    | `string[]` |         |
| key      | Field name corresponding to the expanded field enum values  | `string`   | `key`   |
| value    | Field name corresponding to the expanded data values        | `string`   | `value` |

## Common errors and fixes

### Error 1: Putting fold in a mark transform

```javascript
// Incorrect: fold is a data transform and cannot be placed in a mark transform
chart.options({
  type: 'line',
   wideData,
  transform: [{ type: 'fold', fields: ['a', 'b'] }],  // Incorrect location
});

// Correct: put fold in data.transform
chart.options({
  type: 'line',
  data: {
    type: 'inline',
    value: wideData,
    transform: [{ type: 'fold', fields: ['a', 'b'] }],  // Correct
  },
});
```

### Error 2: Field names in fields are misspelled

```javascript
// Incorrect: field names do not match the data, so fold produces undefined values
data: {
  transform: [{ type: 'fold', fields: ['Revenue', 'Cost'] }],  // Uppercase, but the data uses lowercase
}

// Correct: field names must exactly match the keys in the data objects, including case
data: {
  transform: [{ type: 'fold', fields: ['revenue', 'cost'] }],
}
```

### Error 3: y/color field names in encode do not match the as configuration

```javascript
// Incorrect: fold generates 'key'/'value' columns by default, but encode uses other names
chart.options({
  data: {
    transform: [{ type: 'fold', fields: ['a', 'b'] }],  // Generates key/value by default
  },
  encode: { y: 'metric', color: 'series' },  // Incorrect: these fields do not exist
});

// Correct: encode names are consistent with the fold key/value configuration
chart.options({
  data: {
    transform: [{ type: 'fold', fields: ['a', 'b'], key: 'metric', value: 'amount' }],
  },
  encode: { y: 'amount', color: 'metric' },
});
```

### Error 4: Shorthand data cannot configure transform

```javascript
// Incorrect: shorthand data cannot configure transform
chart.options({
   wideData,  // Shorthand form
  // Cannot add a fold transform
});

// Correct: use the full data configuration
chart.options({
   {
    type: 'inline',
    value: wideData,
    transform: [{ type: 'fold', fields: ['revenue', 'cost'] }],
  },
});
```

### Error 5: Missing `data` keyword causes SyntaxError

This is an extremely common error during code generation: the `data` property value is a multiline nested object, so it is easy to forget the `data:` key name. That causes a JavaScript syntax error (`Unexpected token '{'`) and prevents the chart from running at all.

```javascript
// Incorrect: the key name is missing, so { type: 'inline', ... } is an isolated object literal that causes a SyntaxError
chart.options({
  type: 'interval',
  {                          // Syntax error: missing the data: prefix
    type: 'inline',
    value: populationData,
    transform: [{
      type: 'fold',
      fields: ['Under 5 Years', '5 to 13 Years'],
      key: 'AgeGroup',
      value: 'Population',
    }]
  },
  encode: { x: 'State', y: 'Population', color: 'AgeGroup' },
});

// Correct: the data: key name is required
chart.options({
  type: 'interval',
   {                    // Cannot be omitted
    type: 'inline',
    value: populationData,
    transform: [{
      type: 'fold',
      fields: ['Under 5 Years', '5 to 13 Years'],
      key: 'AgeGroup',
      value: 'Population',
    }]
  },
  encode: { x: 'State', y: 'Population', color: 'AgeGroup' },
});
```

**Why it is easy to omit**: the `data` value is a multiline nested object. During generation, it is easy to treat it as an independent block rather than a property of `chart.options({})`, causing the `` prefix to be omitted. The same issue can occur with multiline object properties such as `coordinate:` and `children:`. Whenever a property's value is a complex object, confirm that the full key name is present.
