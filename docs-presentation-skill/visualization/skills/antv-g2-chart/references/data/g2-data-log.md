---
id: "g2-data-log"
title: "G2 Log Data Logging"
description: |
  The Log data transform prints the data in the current data transformation stream to the console for debugging.
  It is configured in data.transform and does not affect the data flow.

library: "g2"
version: "5.x"
category: "data"
tags:
  - "log"
  - "debugging"
  - "logging"
  - "data transform"
  - "data transform"

related:
  - "g2-data-filter"

use_cases:
  - "Debug data processing workflows"
  - "Inspect intermediate data state"

difficulty: "beginner"
completeness: "full"
created: "2025-03-27"
updated: "2025-03-27"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/data/log"
---

## Core Concepts

**Log is a data transform, not a mark transform.**

- Data transforms are configured in `data.transform`.
- Use it for debugging by printing data to the console.
- It does not affect the data flow; data is passed unchanged to the next transform.

## Minimal Runnable Example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 700, height: 400 });

const data = [
  { a: 1, b: 2, c: 3 },
  { a: 4, b: 5, c: 6 },
  { a: 7, b: 8, c: 9 },
];

chart.options({
  type: 'interval',
   {
    type: 'inline',
    value: data,
    transform: [
      { type: 'slice', start: 1 },  // Slice first.
      { type: 'log' },               // Print the intermediate result for debugging.
      { type: 'filter', callback: (d) => d.a < 5 },  // Then filter.
    ],
  },
  encode: { x: 'a', y: 'b' },
});

chart.render();
// The console prints the data after slice is applied.
```

## Debug a Data Processing Workflow

```javascript
chart.options({
   {
    type: 'fetch',
    value: 'https://example.com/data.json',
    transform: [
      { type: 'filter', callback: (d) => d.value > 100 },
      { type: 'log' },  // Inspect the filtered data.
      { type: 'sort', callback: (a, b) => b.value - a.value },
      { type: 'log' },  // Inspect the sorted data.
      { type: 'slice', end: 10 },
    ],
  },
});
```

## Configuration Options

The Log transform has no configuration options. Use it directly.

```javascript
{ type: 'log' }
```

## Common Errors and Fixes

### Error 1: Placing log in a mark transform

```javascript
// Incorrect: log is a data transform and cannot be placed in a mark transform.
chart.options({
  type: 'interval',
  data,
  transform: [{ type: 'log' }],  // Incorrect location.
});

// Correct: place log in data.transform.
chart.options({
  type: 'interval',
   {
    type: 'inline',
    value: data,
    transform: [{ type: 'log' }],  // Correct.
  },
});
```

### Notes

```javascript
// Note: Remove the log transform in production to avoid unnecessary console output.
// Development environment
 {
  transform: [
    { type: 'filter', callback: (d) => d.value > 0 },
    { type: 'log' },  // For debugging.
  ],
}

// Production environment
 {
  transform: [
    { type: 'filter', callback: (d) => d.value > 0 },
    // Remove log.
  ],
}
```
