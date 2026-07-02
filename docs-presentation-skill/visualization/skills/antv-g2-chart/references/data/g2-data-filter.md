---
id: "g2-data-filter"
title: "G2 Filter Data Filtering"
description: |
  The filter data transform filters data during the data loading stage based on conditions, keeping only rows that satisfy the condition.
  It is similar to JavaScript's Array.filter and accepts a predicate function.
  Configure it in data.transform to preprocess data before rendering.

library: "g2"
version: "5.x"
category: "data"
tags:
  - "filter"
  - "filtering"
  - "data filtering"
  - "conditional filtering"
  - "data transform"

related:
  - "g2-data-fold"
  - "g2-data-sort"
  - "g2-interaction-brush"

use_cases:
  - "Display only a subset of data that satisfies a condition, such as values above a threshold"
  - "Exclude outliers or empty values"
  - "Perform category filtering during data loading"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/data/filter"
---

## Core concepts

**filter is a data transform, not a mark transform**

- Configure data transforms in `data.transform`
- Runs during the data loading stage and affects all marks that use the data
- Unlike mark transforms, data transforms are data preprocessing and do not involve visual channels

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'interval',
   {
    type: 'inline',
    value: [
      { genre: 'Sports', sold: 275 },
      { genre: 'Strategy', sold: 115 },
      { genre: 'Action', sold: 120 },
      { genre: 'RPG', sold: 98 },
      { genre: 'Shooter', sold: 35 },
    ],
    transform: [
      {
        type: 'filter',
        callback: (d) => d.sold >= 100,  // Keep only data with sales >= 100
      },
    ],
  },
  encode: { x: 'genre', y: 'sold', color: 'genre' },
});

chart.render();
```

## Excluding empty values and outliers

```javascript
chart.options({
  type: 'line',
   {
    type: 'inline',
    value: rawData,
    transform: [
      {
        type: 'filter',
        // Filter out null, undefined, and NaN
        callback: (d) => d.value != null && !isNaN(d.value) && d.value > 0,
      },
    ],
  },
  encode: { x: 'date', y: 'value' },
});
```

## Filtering with multiple conditions

```javascript
chart.options({
  type: 'point',
   {
    type: 'inline',
    value: allData,
    transform: [
      {
        type: 'filter',
        callback: (d) => d.category === 'A' && d.y > 50,
      },
    ],
  },
  encode: { x: 'x', y: 'y', color: 'category' },
});
```

## Using with fetch

```javascript
chart.options({
  type: 'point',
   {
    type: 'fetch',
    value: 'https://example.com/data.json',
    transform: [
      {
        type: 'filter',
        callback: (d) => d.value > 100,
      },
    ],
  },
  encode: { x: 'x', y: 'y' },
});
```

## Combining multiple data transforms

```javascript
chart.options({
  type: 'interval',
   {
    type: 'inline',
    value: rawData,
    transform: [
      { type: 'filter', callback: (d) => d.value != null },
      { type: 'sort', callback: (a, b) => b.value - a.value },
      { type: 'slice', start: 0, end: 10 },  // Keep only the top 10 rows
    ],
  },
  encode: { x: 'category', y: 'value' },
});
```

## Configuration options

| Property | Description                               | Type                                           | Default                                                    |
| -------- | ----------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------- |
| callback | Filter function; returns true to keep the row | `(d: any, idx: number, arr: any[]) => boolean` | `(d) => d !== undefined && d !== null && !Number.isNaN(d)` |

## Common errors and fixes

### Error 1: Putting filter in a mark transform

```javascript
// Incorrect: filter is a data transform and cannot be placed in a mark transform
chart.options({
  type: 'interval',
   myData,
  transform: [{ type: 'filter', callback: (d) => d.value > 100 }],  // Incorrect location
});

// Correct: put filter in data.transform
chart.options({
  type: 'interval',
   {
    type: 'inline',
    value: myData,
    transform: [{ type: 'filter', callback: (d) => d.value > 100 }],  // Correct
  },
});
```

### Error 2: callback is not a function

```javascript
// Incorrect: callback must be a function
data: {
  transform: [{ type: 'filter', callback: 'value > 100' }],  // String
}

// Correct: use an arrow function
 {
  transform: [{ type: 'filter', callback: (d) => d.value > 100 }],  // Correct
}
```

### Error 3: Shorthand data cannot configure transform

```javascript
// Incorrect: shorthand data cannot configure transform
chart.options({
  data: myData,  // Shorthand form
  // Cannot add transform
});

// Correct: use the full data configuration
chart.options({
  data: {
    type: 'inline',
    value: myData,
    transform: [{ type: 'filter', callback: (d) => d.value > 100 }],
  },
});
```
