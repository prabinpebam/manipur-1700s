---
id: "g2-data-sortby"
title: "G2 SortBy Field Sorting"
description: |
  The SortBy data transform sorts data by specified fields.
  Unlike sort, sortBy specifies sorting through field names, which is more concise and intuitive.
  It is configured in data.transform.

library: "g2"
version: "5.x"
category: "data"
tags:
  - "sortBy"
  - "field sorting"
  - "sorting"
  - "data transform"
  - "data transform"

related:
  - "g2-data-sort"
  - "g2-transform-sortx"

use_cases:
  - "Sort by field value"
  - "Sort by multiple fields"
  - "Arrange in ascending or descending order"

difficulty: "beginner"
completeness: "full"
created: "2025-03-27"
updated: "2025-03-27"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/data/sortBy"
---

## Core Concepts

**SortBy is a data transform, not a mark transform.**

- Data transforms are configured in `data.transform`.
- It specifies sorting by field name and is more concise than sort.

**Difference from sort:**
- `sort`: uses a callback comparison function.
- `sortBy`: specifies fields by name and is more concise.

## Minimal Runnable Example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 700, height: 400 });

const data = [
  { genre: 'Sports', sold: 275 },
  { genre: 'Strategy', sold: 115 },
  { genre: 'Action', sold: 120 },
  { genre: 'Shooter', sold: 350 },
  { genre: 'Other', sold: 150 },
];

chart.options({
  type: 'interval',
  data: {
    type: 'inline',
    value: data,
    transform: [
      {
        type: 'sortBy',
        fields: ['sold'],  // Sort by the sold field in ascending order.
      },
    ],
  },
  encode: { x: 'genre', y: 'sold' },
});

chart.render();
```

## Configuration Options

| Property | Description       | Type                              | Default |
| -------- | ----------------- | --------------------------------- | ------- |
| fields   | Fields to sort by | `(string \| [string, boolean])[]` | `[]`    |

## Descending Order

```javascript
chart.options({
  data: {
    type: 'inline',
    value: data,
    transform: [
      {
        type: 'sortBy',
        fields: [['sold', false]],  // false indicates descending order.
      },
    ],
  },
});
```

## Multi-Field Sorting

```javascript
// Sort by name in ascending order first; when name values are the same, sort by age in descending order.
chart.options({
  data: {
    type: 'inline',
    value: data,
    transform: [
      {
        type: 'sortBy',
        fields: [
          ['name', true],   // name ascending.
          ['age', false],   // age descending.
        ],
      },
    ],
  },
});
```

## Comparison with sort

```javascript
// Use sortBy. Recommended and more concise.
data: {
  transform: [{ type: 'sortBy', fields: ['value'] }],
}

// Use sort. More flexible.
data: {
  transform: [{ type: 'sort', callback: (a, b) => a.value - b.value }],
}

// sortBy descending.
data: {
  transform: [{ type: 'sortBy', fields: [['value', false]] }],
}

// sort descending.
data: {
  transform: [{ type: 'sort', callback: (a, b) => b.value - a.value }],
}
```

## Common Errors and Fixes

### Error 1: Placing sortBy in a mark transform

```javascript
// Incorrect: sortBy is a data transform and cannot be placed in a mark transform.
chart.options({
  type: 'interval',
  data,
  transform: [{ type: 'sortBy', fields: ['value'] }],  // Incorrect location.
});

// Correct: place sortBy in data.transform.
chart.options({
  type: 'interval',
  data: {
    type: 'inline',
    value: data,
    transform: [{ type: 'sortBy', fields: ['value'] }],  // Correct.
  },
});
```

### Error 2: Field name does not exist

```javascript
// Incorrect: the field name does not exist, so sorting is ineffective.
data: {
  transform: [{ type: 'sortBy', fields: ['nonexistent'] }],
}

// Correct: ensure the field name exists.
data: {
  transform: [{ type: 'sortBy', fields: ['value'] }],
}
```
