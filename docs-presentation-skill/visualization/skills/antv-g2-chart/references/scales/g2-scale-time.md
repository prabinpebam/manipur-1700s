---
id: "g2-scale-time"
title: "G2 Time Scale"
description: |
  The Time scale maps time data, such as Date objects or timestamps, to a continuous axis.
  It automatically handles time tick intervals, formatting, and sorting. It is enabled automatically when encode.x maps Date-type data.

library: "g2"
version: "5.x"
category: "scales"
tags:
  - "time"
  - "time scale"
  - "time axis"
  - "Date"
  - "time series"
  - "scale"
  - "spec"

related:
  - "g2-mark-line-basic"
  - "g2-comp-axis-config"
  - "g2-scale-linear"

use_cases:
  - "Draw time-series line charts and area charts"
  - "Control time-axis tick granularity and label formatting"
  - "Set the displayed range of a time axis"

difficulty: "intermediate"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/scale/time"
---

## Automatic detection (recommended)

When the data field is a `Date` object, G2 automatically uses the Time Scale without explicit configuration:

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 700, height: 400 });

chart.options({
  type: 'line',
  data: [
    { date: new Date('2024-01-01'), value: 100 },
    { date: new Date('2024-02-01'), value: 130 },
    { date: new Date('2024-03-01'), value: 110 },
    { date: new Date('2024-04-01'), value: 160 },
    { date: new Date('2024-05-01'), value: 145 },
  ],
  encode: { x: 'date', y: 'value' },   // Date objects automatically use the Time Scale.
});

chart.render();
```

## Explicitly configure the Time Scale

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  scale: {
    x: {
      type: 'time',               // Specify explicitly, required for string dates.
      domain: [                   // Restrict the displayed range.
        new Date('2024-01-01'),
        new Date('2024-12-31'),
      ],
      nice: true,                  // Extend the domain to clean time boundaries.
    },
  },
});
```

## Format time-axis labels

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  axis: {
    x: {
      // Use a dayjs format string.
      labelFormatter: 'YYYY-MM',           // Year-month: 2024-01.
      // labelFormatter: 'MM/DD',          // Month/day: 01/15.
      // labelFormatter: 'YYYY [year] MM [month]',     // English format.
      // labelFormatter: (d) => `Q${Math.ceil((d.getMonth()+1)/3)}`,  // Custom.
      tickCount: 6,
    },
  },
});
```

## String dates (convert to Date objects, recommended)

G2 v5 has some ability to automatically detect strings in the `YYYY-MM-DD` format, but the behavior depends on internal inference and is **unstable**.
Convert all values to `Date` objects during data preprocessing to avoid ambiguity:

```javascript
// Recommended: convert to Date objects during preprocessing.
const rawData = [
  { date: '2024-01-01', value: 100 },
  { date: '2024-02-01', value: 130 },
];
const data = rawData.map(d => ({ ...d, date: new Date(d.date) }));

chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  // No scale.x.type is needed; G2 automatically detects Date objects as the Time Scale.
});
```

**Do not** explicitly write `scale: { x: { type: 'time' } }` for string dates. This configuration is redundant
and can cause rendering exceptions in some scenarios, such as when data types change after fold.

## Common mistakes and fixes

### Mistake 1: explicitly declaring type: 'time' is unnecessary and risky
```javascript
// Not recommended: explicitly writing type: 'time' for string dates.
chart.options({
  type: 'line',
  data: [{ date: '2024-01-01', value: 100 }],
  encode: { x: 'date', y: 'value' },
  scale: { x: { type: 'time' } },   // Redundant and may cause exceptions.
});

// Correct: convert to Date objects and let G2 handle them automatically.
const data = rawData.map(d => ({ ...d, date: new Date(d.date) }));
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
});
```

### Mistake 2: unordered data causes a broken line path
```javascript
// Incorrect: data order is inconsistent, so the line connects points incorrectly.
const data = [
  { date: new Date('2024-03-01'), value: 110 },
  { date: new Date('2024-01-01'), value: 100 },  // Reverse chronological order.
];

// Correct: sort by time before passing data in.
const data = rawData
  .map(d => ({ ...d, date: new Date(d.date) }))
  .sort((a, b) => a.date - b.date);
```
