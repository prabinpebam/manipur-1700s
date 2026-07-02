---
id: "g2-mark-k-chart"
title: "G2 K-Chart (Candlestick) Mark"
description: |
  K-chart Mark. Use a combination of link and interval to show price trends for financial data such as stocks.
  It is suitable for stock analysis, futures trading, cryptocurrency analysis, and similar scenarios.

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "K-chart"
  - "candlestick chart"
  - "candlestick"
  - "stocks"

related:
  - "g2-mark-line-basic"
  - "g2-mark-boxplot"

use_cases:
  - "Analyze stock prices"
  - "Futures trading"
  - "Analyze cryptocurrencies"

anti_patterns:
  - "Not suitable for non-time-series data"
  - "Use a line chart for displaying a single numeric value"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/mark/candlestick"
---

## Core concepts

A K-chart shows price trends in financial data:
- Use the `link` mark for wicks (highest/lowest price).
- Use the `interval` mark for the body (opening/closing price).
- Use color to distinguish rising and falling prices.

**OHLC data:**
- Opening price (start)
- Closing price (end)
- Highest price (max)
- Lowest price (min)

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

const data = [
  { time: '2015-11-19', start: 8.18, max: 8.33, min: 7.98, end: 8.32 },
  { time: '2015-11-18', start: 8.37, max: 8.6, min: 8.03, end: 8.09 },
  { time: '2015-11-17', start: 8.7, max: 8.78, min: 8.32, end: 8.37 },
  { time: '2015-11-16', start: 8.48, max: 8.85, min: 8.43, end: 8.7 },
];

chart.options({
  type: 'view',
  data,
  encode: {
    x: 'time',
    color: (d) => (d.start > d.end ? 'Down' : 'Up'),
  },
  scale: {
    color: { domain: ['Down', 'Up'], range: ['#4daf4a', '#e41a1c'] },
  },
  children: [
    // Wick (highest/lowest price)
    {
      type: 'link',
      encode: { y: ['min', 'max'] },
    },
    // Body (opening/closing price)
    {
      type: 'interval',
      encode: { y: ['start', 'end'] },
      style: { fillOpacity: 1 },
    },
  ],
});

chart.render();
```

## Common variants

### With volume

```javascript
// K-chart
const kChart = new Chart({ container: 'kChart' });
kChart.options({
  type: 'view',
  data,
  encode: { x: 'time', color: (d) => d.start > d.end ? 'Down' : 'Up' },
  children: [
    { type: 'link', encode: { y: ['min', 'max'] } },
    { type: 'interval', encode: { y: ['start', 'end'] } },
  ],
});

// Volume chart
const volumeChart = new Chart({ container: 'volumeChart' });
volumeChart.options({
  type: 'interval',
  data,
  encode: {
    x: 'time',
    y: 'volume',
    color: (d) => d.start > d.end ? 'Down' : 'Up',
  },
});
```

### Spec mode

```javascript
chart.options({
  type: 'view',
  data,
  encode: {
    x: 'time',
    color: (d) => d.start > d.end ? 'Down' : 'Up',
  },
  scale: {
    color: { domain: ['Down', 'Up'], range: ['#4daf4a', '#e41a1c'] },
  },
  children: [
    {
      type: 'link',
      encode: { y: ['min', 'max'] },
    },
    {
      type: 'interval',
      encode: { y: ['start', 'end'] },
      style: { fillOpacity: 1 },
    },
  ],
});
```

### With axis titles

```javascript
chart.options({
  type: 'view',
  data,
  children: [
    { type: 'link', encode: { y: ['min', 'max'] } },
    {
      type: 'interval',
      encode: { y: ['start', 'end'] },
      axis: {
        y: { title: 'Price' },
      },
    },
  ],
});
```

## Complete type reference

```typescript
interface KChartData {
  time: string;      // Time
  start: number;     // Opening price
  end: number;       // Closing price
  max: number;       // Highest price
  min: number;       // Lowest price
  volume?: number;   // Volume (optional)
}

// A K-chart consists of two layers:
// 1. link - wick (highest/lowest price)
// 2. interval - body (opening/closing price)
```

## K-chart vs line chart

| Feature | K-chart | Line chart |
|------|-------|--------|
| Information density | OHLC data | Single price |
| Use | Technical analysis | Trend display |
| Complexity | Higher | Simple |

## Common errors and fixes

### Error 1: Missing the link mark

```javascript
// Problem: only the body is shown, without the wick.
chart.options({
  type: 'interval',
  encode: { y: ['start', 'end'] },
});

// Correct: combine link and interval with view.
chart.options({
  type: 'view',
  children: [
    { type: 'link', encode: { y: ['min', 'max'] } },
    { type: 'interval', encode: { y: ['start', 'end'] } },
  ],
});
```

### Error 2: Incorrect color encoding

```javascript
// Problem: the color field is incorrect.
encode: { color: 'time' }

// Correct: set color based on rising or falling prices.
encode: { color: (d) => d.start > d.end ? 'Down' : 'Up' }
```

### Error 3: Incorrect data order

```javascript
// Note: time data must be sorted correctly.
scale: {
  x: {
    compare: (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  },
}
```