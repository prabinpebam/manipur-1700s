---
id: "g2-data-ema"
title: "G2 EMA Exponential Moving Average"
description: |
  The EMA (Exponential Moving Average) data transform smooths data with exponential moving averages.
  It assigns higher weight to recent data points, reducing data volatility and making trends easier to observe.
  Configure it in data.transform.

library: "g2"
version: "5.x"
category: "data"
tags:
  - "ema"
  - "exponential moving average"
  - "smoothing"
  - "trend"
  - "data transform"

related:
  - "g2-mark-line"

use_cases:
  - "Smooth time-series data"
  - "Perform technical analysis on financial data"
  - "Display smoothed training metrics"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-27"
updated: "2025-03-27"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/data/ema"
---

## Core concepts

**EMA is a data transform, not a mark transform**

- Configure data transforms in `data.transform`
- Exponential moving average is a data smoothing algorithm

**Formula**: EMA_t = alpha x P_t + (1 - alpha) x EMA_{t-1}

**Notes**:
- In G2, the closer `alpha` is to 1, the stronger the smoothing effect
- The closer `alpha` is to 0, the closer the EMA is to the original data
- The `field` value must refer to a numeric field

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 700, height: 400 });

const data = [
  { t: 0, y: 100 },
  { t: 1, y: 180 },
  { t: 2, y: 120 },
  { t: 3, y: 200 },
  { t: 4, y: 150 },
  { t: 5, y: 250 },
];

chart.options({
  type: 'view',
  children: [
    {
      type: 'line',
       {
        type: 'inline',
        value: data,
        transform: [
          {
            type: 'ema',
            field: 'y',      // Field to smooth
            alpha: 0.6,      // Smoothing factor
            as: 'emaY',      // Output field name
          },
        ],
      },
      encode: { x: 't', y: 'emaY' },
      style: { stroke: '#f90' },
    },
    {
      type: 'line',
       { type: 'inline', value: data },
      encode: { x: 't', y: 'y' },
      style: { stroke: '#ccc', lineDash: [4, 2] },
    },
  ],
});

chart.render();
```

## Configuration options

| Property | Description                                                    | Type     | Default          | Required |
| -------- | -------------------------------------------------------------- | -------- | ---------------- | -------- |
| field    | Name of the field to smooth                                    | `string` | `'y'`            | yes      |
| alpha    | Smoothing factor; controls the smoothing level (larger is smoother) | `number` | `0.6`        |          |
| as       | New field name to generate; overwrites the original field if omitted | `string` | Same as `field` |          |

## Smoothing financial market data

```javascript
chart.options({
  type: 'view',
  children: [
    {
      type: 'line',
       {
        type: 'fetch',
        value: 'https://example.com/stock.csv',
        transform: [
          {
            type: 'ema',
            field: 'close',
            alpha: 0.7,
            as: 'emaClose',
          },
        ],
      },
      encode: { x: 'date', y: 'emaClose' },
      style: { stroke: '#007aff', lineWidth: 2 },
    },
    {
      type: 'line',
       { type: 'fetch', value: 'https://example.com/stock.csv' },
      encode: { x: 'date', y: 'close' },
      style: { stroke: '#bbb', lineDash: [4, 2] },
    },
  ],
});
```

## Common errors and fixes

### Error 1: Putting ema in a mark transform

```javascript
// Incorrect: ema is a data transform and cannot be placed in a mark transform
chart.options({
  type: 'line',
  data,
  transform: [{ type: 'ema', field: 'y' }],  // Incorrect location
});

// Correct: put ema in data.transform
chart.options({
  type: 'line',
   {
    type: 'inline',
    value: data,
    transform: [{ type: 'ema', field: 'y', as: 'emaY' }],  // Correct
  },
});
```

### Error 2: The field is not numeric

```javascript
// Incorrect: the field value must refer to a numeric field
 {
  transform: [{ type: 'ema', field: 'name' }],  // name is a string
}

// Correct: use a numeric field
 {
  transform: [{ type: 'ema', field: 'value' }],
}
```

### Error 3: Forgetting to set the as field

```javascript
// Note: omitting as overwrites the original field
data: {
  transform: [{ type: 'ema', field: 'y' }],  // The y field will be overwritten
}
encode: { y: 'y' },  // Uses the smoothed data

// Recommended: set as to preserve the original field
 {
  transform: [{ type: 'ema', field: 'y', as: 'emaY' }],
}
// You can display both the original data and the smoothed data
```
