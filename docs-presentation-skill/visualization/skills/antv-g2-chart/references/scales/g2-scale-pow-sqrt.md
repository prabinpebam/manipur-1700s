---
id: "g2-scale-pow-sqrt"
title: "G2 Power Scale (pow) and Square Root Scale (sqrt)"
description: |
  The pow scale maps numeric values with a power function (y = x^exponent). When exponent=0.5, it is equivalent to the sqrt scale.
  sqrt is a special case of pow (exponent=0.5). It maps values to their square roots and is commonly used for area encoding, such as bubble size, to ensure visual area is linearly proportional to the data value.

library: "g2"
version: "5.x"
category: "scales"
tags:
  - "pow"
  - "sqrt"
  - "power"
  - "square root"
  - "scale"
  - "scale"
  - "bubble chart"

related:
  - "g2-scale-log"
  - "g2-scale-linear"
  - "g2-mark-point-bubble"

use_cases:
  - "Use a sqrt scale for the size channel in bubble charts to keep area linear"
  - "Use pow to stretch or compress numeric ranges when data is mildly skewed"
  - "Linear mapping between area and value in visual encoding"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/scale/pow"
---

## Minimal runnable example (bubble chart with a sqrt scale)

```javascript
import { Chart } from '@antv/g2';

const data = [
  { country: 'China', gdp: 17.7, population: 141 },
  { country: 'United States', gdp: 25.5, population: 33 },
  { country: 'India', gdp: 3.4,  population: 142 },
  { country: 'Japan', gdp: 4.2,  population: 13 },
  { country: 'Brazil', gdp: 1.8,  population: 22 },
];

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'point',
  data,
  encode: {
    x: 'gdp',
    y: 'country',
    size: 'population',
    color: 'country',
  },
  scale: {
    size: {
      type: 'sqrt',        // Square root scale: area is linearly proportional to population.
      range: [8, 60],      // Radius range.
    },
  },
  style: { fillOpacity: 0.7 },
});

chart.render();
```

## pow scale (custom exponent)

```javascript
// exponent = 2: larger values are amplified more, which is useful for showing small differences.
scale: {
  y: {
    type: 'pow',
    exponent: 2,    // y = x^2, amplifying differences among large values.
  },
}

// exponent = 0.5: equivalent to sqrt and compresses large values.
scale: {
  y: {
    type: 'pow',
    exponent: 0.5,  // Equivalent to type: 'sqrt'.
  },
}
```

## Why bubble size should use sqrt

```javascript
// Incorrect: mapping radius with a linear scale.
// If radius r is linear with the value, area = pi*r^2, so area grows quadratically with the value.
// For populations 100 and 400, the visual area ratio is 1:16, which misleads readers.
scale: { size: { type: 'linear', range: [8, 60] } }  // Incorrect.

// Correct: mapping radius with a sqrt scale.
// If radius r = sqrt(value), area = pi*r^2 = pi*value, so area is linear with the value.
// For populations 100 and 400, the visual area ratio is 1:4, matching the true proportion.
scale: { size: { type: 'sqrt', range: [8, 60] } }  // Correct.
```

## Common mistakes and fixes

### Mistake: the data contains 0 or negative values and exponent < 1; sqrt(0) is valid, but negative values produce NaN
```javascript
// sqrt(-1) = NaN. Negative values in the data will cause errors.
chart.options({
  scale: { y: { type: 'sqrt' } },
   [{ y: -10 }],  // Negative value.
});

// A sqrt scale only applies to non-negative values.
// If negative values exist, process them with Math.abs first, or use linear instead.
chart.options({
  scale: { y: { type: 'sqrt', domain: [0, 200] } },  // Ensure the domain is non-negative.
});
```
