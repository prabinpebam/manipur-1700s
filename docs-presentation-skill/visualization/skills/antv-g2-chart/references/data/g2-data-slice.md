---
id: "g2-data-slice"
title: "G2 Slice Data Slicing"
description: |
  The Slice data transform slices data to obtain a subset.
  It is similar to Array.prototype.slice and is configured in data.transform.

library: "g2"
version: "5.x"
category: "data"
tags:
  - "slice"
  - "slicing"
  - "pagination"
  - "data transform"
  - "data transform"

related:
  - "g2-data-filter"
  - "g2-data-sort"

use_cases:
  - "Display paginated data"
  - "Take only the first N data records"
  - "Extract data from a specific range"

difficulty: "beginner"
completeness: "full"
created: "2025-03-27"
updated: "2025-03-27"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/data/slice"
---

## Core Concepts

**Slice is a data transform, not a mark transform.**

- Data transforms are configured in `data.transform`.
- It is similar to [Array.prototype.slice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice).

## Minimal Runnable Example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 700, height: 400 });

const data = [
  { month: 'Jan', value: 100 },
  { month: 'Feb', value: 120 },
  { month: 'Mar', value: 150 },
  { month: 'Apr', value: 180 },
  { month: 'May', value: 200 },
];

chart.options({
  type: 'line',
   {
    type: 'inline',
    value: data,
    transform: [
      {
        type: 'slice',
        start: 0,
        end: 3,  // Take only the first 3 data records.
      },
    ],
  },
  encode: { x: 'month', y: 'value' },
});

chart.render();
```

## Configuration Options

| Property | Description              | Type     | Default          |
| -------- | ------------------------ | -------- | ---------------- |
| start    | Starting index for slice | `number` | `0`              |
| end      | Ending index for slice   | `number` | `arr.length - 1` |

## Take the First N Data Records

```javascript
chart.options({
  type: 'interval',
   {
    type: 'inline',
    value: largeData,
    transform: [
      { type: 'sort', callback: (a, b) => b.value - a.value },  // Sort first.
      { type: 'slice', end: 10 },  // Take the first 10 records.
    ],
  },
  encode: { x: 'category', y: 'value' },
});
```

## Pagination Effect

```javascript
// Page 2, 10 records per page.
const page = 2;
const pageSize = 10;

chart.options({
  data: {
    transform: [
      { type: 'slice', start: (page - 1) * pageSize, end: page * pageSize },
    ],
  },
});
```

## Common Errors and Fixes

### Error 1: Placing slice in a mark transform

```javascript
// Incorrect: slice is a data transform and cannot be placed in a mark transform.
chart.options({
  type: 'interval',
  data,
  transform: [{ type: 'slice', end: 10 }],  // Incorrect location.
});

// Correct: place slice in data.transform.
chart.options({
  type: 'interval',
   {
    type: 'inline',
    value: data,
    transform: [{ type: 'slice', end: 10 }],  // Correct.
  },
});
```

### Error 2: Index out of range

```javascript
// Note: If the index is out of range, G2 handles it automatically and does not throw an error.
data: {
  transform: [{ type: 'slice', start: 100, end: 200 }],  // The data has only 50 records.
}
// Result: returns an empty array.
```
