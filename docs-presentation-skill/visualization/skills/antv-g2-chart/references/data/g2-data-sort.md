---
id: "g2-data-sort"
title: "G2 Sort Data Sorting"
description: |
  The sort data transform sorts data, similar to Array.prototype.sort.
  It is configured in data.transform and preprocesses data order before rendering.
  It is commonly used in scenarios that need data ordered by value, such as pie charts and ranking bar charts.

library: "g2"
version: "5.x"
category: "data"
tags:
  - "sort"
  - "sorting"
  - "data order"
  - "data transform"

related:
  - "g2-data-filter"
  - "g2-data-fold"
  - "g2-transform-sortx"
  - "g2-transform-sorty"

use_cases:
  - "Sort pie chart sectors by size"
  - "Sort bar charts by value"
  - "Display ranking data"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/data/sort"
---

## Core Concepts

**sort is a data transform, not a mark transform.**

- Data transforms are configured in `data.transform`.
- It uses a callback comparison function, similar to Array.sort.
- It runs during the data loading stage and affects all marks that use the data.

**Difference from mark transforms sortX, sortY, and sortColor:**
- Data sort: directly sorts the raw data array.
- Mark sortX, sortY, and sortColor: sort by visual channel values and can sort after aggregation.

## Minimal Runnable Example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data: {
    type: 'inline',
    value: [
      { category: 'A', value: 30 },
      { category: 'B', value: 50 },
      { category: 'C', value: 20 },
      { category: 'D', value: 40 },
    ],
    transform: [
      {
        type: 'sort',
        callback: (a, b) => b.value - a.value,  // Sort in descending order.
      },
    ],
  },
  encode: { x: 'category', y: 'value' },
});

chart.render();
```

## Ascending Order

```javascript
chart.options({
  type: 'interval',
   {
    type: 'inline',
    value: data,
    transform: [
      {
        type: 'sort',
        callback: (a, b) => a.value - b.value,  // Ascending order.
      },
    ],
  },
  encode: { x: 'category', y: 'value' },
});
```

## Sort a Pie Chart by Size

```javascript
chart.options({
  type: 'interval',
  data: {
    type: 'inline',
    value: [
      { item: 'A', count: 40 },
      { item: 'B', count: 20 },
      { item: 'C', count: 30 },
    ],
    transform: [
      {
        type: 'sort',
        callback: (a, b) => b.count - a.count,  // From largest to smallest.
      },
    ],
  },
  encode: { y: 'count', color: 'item' },
  coordinate: { type: 'theta' },
  transform: [{ type: 'stackY' }],
});
```

## Combine with Other Data Transforms

```javascript
chart.options({
  type: 'interval',
   {
    type: 'inline',
    value: rawData,
    transform: [
      { type: 'filter', callback: (d) => d.value > 0 },  // Filter first.
      { type: 'sort', callback: (a, b) => b.value - a.value },  // Then sort.
      { type: 'slice', start: 0, end: 10 },  // Take the first 10 records.
    ],
  },
  encode: { x: 'category', y: 'value' },
});
```

## Sort by String

```javascript
chart.options({
  type: 'interval',
  data: {
    type: 'inline',
    value: data,
    transform: [
      {
        type: 'sort',
        callback: (a, b) => a.name.localeCompare(b.name),  // Sort alphabetically by name.
      },
    ],
  },
  encode: { x: 'name', y: 'value' },
});
```

## Configuration Options

| Property | Description                                             | Type                         | Default       |
| -------- | ------------------------------------------------------- | ---------------------------- | ------------- |
| callback | Array.sort comparator; returns 1, 0, or -1 for >, =, < | `(a: any, b: any) => number` | `(a, b) => 0` |

## Comparison with Mark Transforms sortX and sortY

| Feature | Data sort | mark sortX/sortY |
| ------- | --------- | ---------------- |
| Configuration location | `data.transform` | `transform` (mark level) |
| Sorting basis | Raw data fields | Visual channel values |
| Aggregation support | Not supported | Supports sorting by aggregated values |
| Slice support | Requires use with slice | Built-in slice parameter |

```javascript
// Data sort: sort the data directly.
data: {
  transform: [{ type: 'sort', callback: (a, b) => b.value - a.value }],
}

// mark sortX: sort by the aggregated Y-channel value.
transform: [{ type: 'sortX', by: 'y', reducer: 'sum' }]
```

## Common Errors and Fixes

### Error 1: Placing sort in a mark transform

```javascript
// Incorrect: data sort cannot be placed in a mark transform.
chart.options({
  data: myData,
  transform: [{ type: 'sort', callback: (a, b) => b.value - a.value }],  // Incorrect location.
});

// Correct: place sort in data.transform.
chart.options({
   {
    type: 'inline',
    value: myData,
    transform: [{ type: 'sort', callback: (a, b) => b.value - a.value }],  // Correct.
  },
});
```

### Error 2: Confusing data sort with mark sortX

```javascript
// Incorrect: data sort does not support channel, by, or reducer parameters.
data: {
  transform: [{ type: 'sort', channel: 'x', by: 'value' }],  // This is mark transform syntax.
}

// Correct: data sort uses callback.
 {
  transform: [{ type: 'sort', callback: (a, b) => b.value - a.value }],
}

// If you need to sort by aggregated values, use a mark transform.
transform: [{ type: 'sortX', by: 'y', reducer: 'sum' }]
```

### Error 3: Incorrect callback return value

```javascript
// Incorrect: returns a boolean.
callback: (a, b) => a.value > b.value  // Returns a boolean.

// Correct: returns a number: positive, negative, or zero.
callback: (a, b) => a.value - b.value  // Ascending order.
callback: (a, b) => b.value - a.value  // Descending order.
```

### Error 4: Shorthand data cannot configure transform

```javascript
// Incorrect: shorthand data cannot configure transform.
chart.options({
  data: myData,  // Shorthand form.
  // Cannot add a sort transform.
});

// Correct: use the complete data configuration.
chart.options({
   {
    type: 'inline',
    value: myData,
    transform: [{ type: 'sort', callback: (a, b) => b.value - a.value }],
  },
});
```
