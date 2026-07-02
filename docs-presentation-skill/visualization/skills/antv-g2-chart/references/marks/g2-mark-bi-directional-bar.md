---
id: "g2-mark-bi-directional-bar"
title: "G2 Bi-Directional Bar Mark"
description: |
  Bi-directional bar chart Mark. Uses the interval mark to show comparisons between forward and reverse data.
  Suitable for positive/negative data comparison, income/expense comparison, completed/incomplete comparison, and similar scenarios.

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "bi-directional bar chart"
  - "positive-negative bar chart"
  - "bi-directional"
  - "comparison"
  - "population pyramid"
  - "butterfly chart"
  - "symmetric bar chart"

related:
  - "g2-mark-interval-basic"
  - "g2-mark-interval-stacked"

use_cases:
  - "Compare positive and negative categorical data"
  - "Compare income and expenses"
  - "Compare completed and incomplete values"
  - "Population pyramid (male/female comparison)"
  - "Butterfly chart (left-right symmetric bar chart)"

anti_patterns:
  - "Not suitable for data without opposing meanings"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/mark/bi-directional-bar"
---

## Core concepts

A bi-directional bar chart shows comparisons between forward and reverse data:
- Uses the `interval` mark
- Represents reverse data with negative values
- Works with the `transpose` coordinate transform

**Suitable scenarios:**
- Completed/incomplete comparison
- Income/expense comparison
- Positive/negative data comparison

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
});

const data = [
  { department: 'Department 1', people: 37, type: 'completed' },
  { department: 'Department 1', people: 9, type: 'uncompleted' },
  { department: 'Department 2', people: 27, type: 'completed' },
  { department: 'Department 2', people: 10, type: 'uncompleted' },
];

chart.options({
  type: 'interval',
  coordinate: { transform: [{ type: 'transpose' }] },
  data,
  encode: {
    x: 'department',
    y: (d) => (d.type === 'completed' ? d.people : -d.people),
    color: 'department',
  },
  style: {
    fill: ({ type }) => type === 'uncompleted' ? 'transparent' : undefined,
    stroke: ({ type }) => type === 'uncompleted' ? '#1890ff' : undefined,
    lineWidth: 2,
  },
});

chart.render();
```

## Common variants

### Stacked bi-directional bar chart

```javascript
chart.options({
  type: 'interval',
  coordinate: { transform: [{ type: 'transpose' }] },
  data,
  transform: [{ type: 'stackY' }],
  encode: {
    x: 'question',
    y: (d) =>
      d.type === 'Disagree' || d.type === 'Strongly disagree'
        ? -d.percentage
        : d.percentage,
    color: 'type',
  },
});
```

### Custom Y-axis labels

```javascript
chart.options({
  type: 'interval',
  coordinate: { transform: [{ type: 'transpose' }] },
  data,
  encode: { x: 'category', y: (d) => d.type === 'A' ? d.value : -d.value },
  axis: {
    y: {
      labelFormatter: (d) => Math.abs(d),  // Show absolute values
    },
  },
});
```

### Grouped display

```javascript
chart.options({
  type: 'interval',
  coordinate: { transform: [{ type: 'transpose' }] },
  data,
  encode: {
    x: 'group',
    y: (d) => d.direction === 'forward' ? d.value : -d.value,
    color: 'category',
  },
  style: {
    maxWidth: 20,
  },
});
```

## Complete type reference

```typescript
interface BiDirectionalData {
  category: string;      // Categorical field
  value: number;         // Numeric value
  direction: 'forward' | 'backward';  // Direction
}

interface BiDirectionalOptions {
  type: 'interval';
  coordinate: {
    transform: [{ type: 'transpose' }];
  };
  encode: {
    x: string;           // Categorical field
    y: (d) => number;    // Return a positive/negative value based on direction
    color?: string;
  };
}
```

## Bi-directional bar chart vs. bar chart

| Feature | Bi-directional bar chart | Bar chart |
|------|------------|--------|
| Data direction | Two directions: positive and negative | Single direction |
| Use | Compare opposing meanings | Compare numeric values |
| Visual effect | Bi-directional symmetry | One-way |

## Population pyramid (butterfly chart)

A population pyramid is a typical use case for a bi-directional bar chart: male and female data use opposite directions on each side and are implemented with the negative-value technique, with **no need for `createView`**.

```javascript
const data = [
  { age: '0-4',   male: 5.3, female: 5.1 },
  { age: '5-9',   male: 5.6, female: 5.4 },
  { age: '10-14', male: 5.8, female: 5.5 },
  // ...
];

// Convert wide table to long table: merge male/female into one column
const longData = data.flatMap((d) => [
  { age: d.age, sex: 'Male',   population: d.male },
  { age: d.age, sex: 'Female', population: d.female },
]);

chart.options({
  type: 'interval',
  data: longData,
  coordinate: { transform: [{ type: 'transpose' }] },  // Horizontal bar chart
  encode: {
    x: 'age',
    // Key: use negative values for male and positive values for female to form left-right symmetry
    y: (d) => d.sex === 'Male' ? -d.population : d.population,
    color: 'sex',
  },
  axis: {
    y: {
      labelFormatter: (d) => Math.abs(d),  // Show absolute values (hide the minus sign)
      title: 'Population share (%)',
    },
    x: { title: 'Age group' },
  },
  scale: {
    color: { range: ['#5B8FF9', '#FF7875'] },
  },
});
```

## Common mistakes and fixes

### Mistake 1: Missing negative-value conversion

```javascript
// Problem: all values are positive
encode: { y: 'value' }

// Correct: return a positive/negative value based on type
encode: { y: (d) => d.type === 'A' ? d.value : -d.value }
```

### Mistake 2: Missing transpose

```javascript
// Problem: the default orientation is vertical
coordinate: {}

// Correct: add transpose
coordinate: { transform: [{ type: 'transpose' }] }
```

### Mistake 3: Y-axis labels show negative values

```javascript
// Problem: negative values are displayed as negative numbers
axis: {}

// Correct: format as absolute values
axis: {
  y: { labelFormatter: (d) => Math.abs(d) },
}
```

### Mistake 4: Using `chart.createView()` to implement a population pyramid

This is the most common mistake: in the V4 era, `createView` was used to create two separate left and right views, but this API has been removed in V5. The correct approach is the **negative-value technique** (a single `interval` + negative-value encoding) or `spaceLayer`.

```javascript
// Prohibited: V4 createView does not exist in V5
const leftView = chart.createView();
leftView.options({
  type: 'interval',
  data: usData,
  encode: { x: 'age', y: 'male' },
});
const rightView = chart.createView();
rightView.options({ ... });

// Solution 1 (recommended): negative-value technique with a single interval, using negative values for male
chart.options({
  type: 'interval',
  data: combinedData,   // male/female combined into one array
  coordinate: { transform: [{ type: 'transpose' }] },
  encode: {
    x: 'age',
    y: (d) => d.sex === 'Male' ? -d.population : d.population,
    color: 'sex',
  },
  axis: { y: { labelFormatter: (d) => Math.abs(d) } },
});

// Solution 2: spaceLayer (use when the two sides require fully independent scales)
chart.options({
  type: 'spaceLayer',
  children: [
    {
      type: 'interval',
      data: leftData,
      coordinate: { transform: [{ type: 'transpose' }, { type: 'reflectX' }] },
      encode: { x: 'age', y: 'male' },
      axis: { y: { position: 'right' } },
    },
    {
      type: 'interval',
      data: rightData,
      coordinate: { transform: [{ type: 'transpose' }] },
      encode: { x: 'age', y: 'female' },
      axis: { y: false },
    },
  ],
});
```
