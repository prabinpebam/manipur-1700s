---
id: "g2-scale-log"
title: "G2 Log Scale"
description: |
  The log scale maps numeric values to logarithmic ticks and is suitable for data spanning multiple orders of magnitude, such as 1 to 1,000,000.
  Use the base parameter to set the logarithm base (default 10), which effectively shows exponential growth or data with large order-of-magnitude differences.

library: "g2"
version: "5.x"
category: "scales"
tags:
  - "log"
  - "logarithmic"
  - "scale"
  - "order of magnitude"
  - "scale"
  - "exponential growth"

related:
  - "g2-scale-linear"
  - "g2-scale-pow"

use_cases:
  - "Show data with large order-of-magnitude differences, such as GDP comparisons from 1 million to 1 trillion"
  - "Exponential growth data such as virus spread"
  - "Power-law characteristics in frequency distributions"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/scale/log"
---

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

// Data with large order-of-magnitude differences
const data = [
  { country: 'Luxembourg',     gdp: 135000 },
  { country: 'United States',       gdp: 65000 },
  { country: 'China',       gdp: 12000 },
  { country: 'Brazil',       gdp: 7500 },
  { country: 'India',       gdp: 2100 },
  { country: 'Ethiopia', gdp: 900 },
];

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'interval',
  data,
  encode: { x: 'country', y: 'gdp', color: 'country' },
  scale: {
    y: {
      type: 'log',    // Log scale
      base: 10,       // Base, default 10
      domain: [100, 200000],
    },
  },
  axis: {
    y: {
      title: 'GDP per capita (USD, log axis)',
      tickCount: 5,
    },
  },
});

chart.render();
```

## Configuration options

```javascript
scale: {
  y: {
    type: 'log',
    base: 10,          // Logarithm base, commonly 2 or 10, default 10
    domain: [1, 1e6],  // Numeric range (note: cannot include 0 or negative values!)
    nice: true,        // Extend ticks to integer powers
    tickCount: 5,      // Recommended number of ticks
    tickMethod: (min, max, count, base) => {
      // Custom tick generation method
      // Return an array of tick values
      return [1, 10, 100, 1000, 10000];
    },
  },
}
```

## Tick control: tickMethod vs labelFormatter vs tickFormatter

These three options have completely different responsibilities and should not be confused:

| Configuration options | Location | Signature | Responsibility |
|--------|------|------|------|
| `tickMethod` | `scale.y` or `axis.y` | `(min, max, count, base?) => number[]` | Determines **which numeric values** are shown as ticks |
| `labelFormatter` | `axis.y` | `(value, index, array) => string` | Determines the tick **display text** - most commonly used |
| `tickFormatter` | `axis.y` | `(datum, index, array, vector) => DisplayObject` | Customizes the tick mark **graphic object** (rarely used) |

### Only format tick label text (most common)

```javascript
// ✅ Only need to change display text -> use axis.labelFormatter; tickMethod is not needed
chart.options({
  scale: { y: { type: 'log', base: 10 } },
  axis: {
    y: {
      labelFormatter: (v) => v >= 1e6 ? `${v/1e6}M` : v >= 1e3 ? `${v/1e3}K` : String(v),
    },
  },
});
```

### Customize tick positions and label text together

```javascript
// ✅ tickMethod controls which ticks are placed, and labelFormatter controls what text is displayed
chart.options({
  scale: {
    y: {
      type: 'log',
      base: 10,
      domain: [0.1, 1000],
      // Signature: (min, max, count, base) => number[]; must return a numeric array
      tickMethod: (min, max, count, base) => [0.1, 1, 10, 100, 1000],
    },
  },
  axis: {
    y: {
      labelFormatter: (v) => `10^${Math.log10(v)}`,
    },
  },
});
```

## Log axis for line charts (exponential growth data)

```javascript
chart.options({
  type: 'line',
  data: covidData,
  encode: { x: 'date', y: 'cases', color: 'country' },
  scale: {
    y: { type: 'log', base: 10, nice: true },
  },
  axis: {
    y: {
      title: 'Cumulative cases (log axis)',
      labelFormatter: (v) => v >= 1e6 ? `${v / 1e6}M` : v >= 1e3 ? `${v / 1e3}K` : String(v),
    },
  },
});
```

## Common mistakes and fixes

### Mistake 1: incorrect tickMethod signature and confusion between tick positions and label formatting

`tickMethod` can be configured in two places, with **different signatures and responsibilities**:

| Location | Signature | Responsibility |
|------|------|------|
| `scale.y.tickMethod` | `(min, max, n?, base?) => number[]` | Controls the tick **numeric positions** |
| `axis.y.tickMethod` | `(start, end, tickCount) => number[]` | Same as above; also returns a numeric array |
| `axis.y.labelFormatter` | `(value) => string` | Controls the tick **display text** |

```javascript
// ❌ Three mistakes:
// 1. The parameter is written as a scale object, but it is actually four numeric values: min/max/count/base
// 2. It calls the nonexistent scale.ticks() method
// 3. It returns an array of {value, text} objects, but should return number[]
scale: {
  y: {
    type: 'log',
    tickMethod: (scale) => {
      const ticks = scale.ticks();
      return ticks.map(tick => ({ value: tick, text: `log10(${tick}) + 1` }));
    },
  },
}

// ✅ Correct split: tickMethod controls positions, and labelFormatter controls text
scale: {
  y: {
    type: 'log',
    base: 10,
    domain: [0.1, 1000],
    tickMethod: (min, max, count, base) => [0.1, 1, 10, 100, 1000],  // ✅ Return number[]
  },
},
axis: {
  y: {
    labelFormatter: (v) => `${Math.log10(v) + 1}`,  // ✅ Format text
  },
}
```

### Mistake 2: data contains 0 or negative values, which log scale cannot handle
```javascript
// ❌ For logarithms, log(0) = -infinity; 0 in the data can cause rendering errors
const data = [{ x: 'A', y: 0 }, { x: 'B', y: 100 }];
chart.options({
  scale: { y: { type: 'log' } },  // ❌ y=0 cannot be displayed on a log axis
});

// ✅ A log axis requires all values to be > 0; you can filter out 0 or add a small offset
const data = [{ x: 'B', y: 100 }];  // ✅ Filter out 0
// Or use domain to force the starting point to be > 0
chart.options({
  scale: { y: { type: 'log', domain: [0.1, 1000] } },
});
```

### Mistake 3: using a log axis for linear data, causing visual distortion
```javascript
// ❌ The data range is 50-200 with no order-of-magnitude difference; a log axis is meaningless and can mislead readers
const data = [/* Uniform distribution between 50 and 200 */];
chart.options({ scale: { y: { type: 'log' } } });  // ❌ Unnecessary

// ✅ Use the default linear scale for linear data
chart.options({ scale: { y: { type: 'linear' } } });  // ✅ Or omit it directly (default)
```
