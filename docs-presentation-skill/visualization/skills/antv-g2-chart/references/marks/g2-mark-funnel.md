---
id: "g2-mark-funnel"
title: "G2 Funnel Chart (funnel)"
description: |
  A funnel chart uses an interval mark with shape: 'funnel' or 'pyramid'
  to show how data flows through different stages of a business process and its conversion rates.
  It must be used with the symmetryY transform and transpose coordinate.

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "funnel chart"
  - "funnel"
  - "pyramid"
  - "conversion rate"
  - "process"
  - "symmetryY"

related:
  - "g2-mark-interval-basic"
  - "g2-transform-symmetryy"
  - "g2-coord-transpose"

use_cases:
  - "Sales-process conversion-rate analysis"
  - "User registration or purchase funnel"
  - "Pyramid hierarchy display"
  - "Dual-funnel comparison (two-channel comparison)"

anti_patterns:
  - "Unordered data is not suitable for funnel charts"
  - "Processes with values that both increase and decrease are not suitable"

difficulty: "intermediate"
completeness: "full"
created: "2025-04-01"
updated: "2025-04-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/funnel"
---

## Core concepts

**Funnel chart = interval mark + shape: 'funnel' + symmetryY transform + transpose coordinate**

- `encode.shape: 'funnel'`: enables the funnel shape
- `transform: [{ type: 'symmetryY' }]`: makes the funnel symmetric left and right (**required**)
- `coordinate: { transform: [{ type: 'transpose' }] }`: horizontal display (recommended)
- `axis: false`: funnel charts usually hide axes

**Pyramid variant**: `shape: 'pyramid'` + `style: { reverse: true }`

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  theme: 'classic',
});

chart.options({
  type: 'interval',
  data: [
    { stage: 'Visit', value: 8043 },
    { stage: 'Inquiry', value: 2136 },
    { stage: 'Quote', value: 908 },
    { stage: 'Negotiation', value: 691 },
    { stage: 'Closed', value: 527 },
  ],
  encode: {
    x: 'stage',
    y: 'value',
    color: 'stage',
    shape: 'funnel',
  },
  coordinate: { transform: [{ type: 'transpose' }] },
  transform: [{ type: 'symmetryY' }],
  scale: {
    color: { palette: 'spectral' },
  },
  animate: { enter: { type: 'fadeIn' } },
  axis: false,
  labels: [
    {
      text: (d) => `${d.stage}\n${d.value}`,
      position: 'inside',
      transform: [{ type: 'contrastReverse' }],
    },
  ],
  legend: false,
});

chart.render();
```

## Pyramid chart

```javascript
chart.options({
  type: 'interval',
  data: [
    { text: 'Top layer', value: 5 },
    { text: 'Upper-middle layer', value: 10 },
    { text: 'Middle', value: 20 },
    { text: 'Lower-middle layer', value: 25 },
    { text: 'Bottom layer', value: 40 },
  ],
  encode: {
    x: 'text',
    y: 'value',
    color: 'text',
    shape: 'pyramid',   // Pyramid shape
  },
  coordinate: { transform: [{ type: 'transpose' }] },
  transform: [{ type: 'symmetryY' }],
  style: {
    reverse: true,    // Reverse so smaller values are at the top (pyramid shape)
  },
  scale: {
    x: { paddingOuter: 0, paddingInner: 0 },
    color: { type: 'ordinal' },
  },
  axis: false,
  labels: [
    { text: (d) => d.text, position: 'inside' },
    { text: (d) => `${d.value}%`, position: 'inside', style: { dy: 15 } },
  ],
});
```

## Comparison funnel chart (dual funnel)

Compare two mirrored funnels; negative y-axis values reverse the lower funnel:

```javascript
chart.options({
  type: 'view',
  autoFit: true,
  data: [
    { action: 'Visit', visitor: 500, site: 'Site 1' },
    { action: 'Browse', visitor: 400, site: 'Site 1' },
    { action: 'Interact', visitor: 300, site: 'Site 1' },
    { action: 'Order', visitor: 200, site: 'Site 1' },
    { action: 'Complete', visitor: 100, site: 'Site 1' },
    { action: 'Visit', visitor: 550, site: 'Site 2' },
    { action: 'Browse', visitor: 420, site: 'Site 2' },
    { action: 'Interact', visitor: 280, site: 'Site 2' },
    { action: 'Order', visitor: 150, site: 'Site 2' },
    { action: 'Complete', visitor: 80, site: 'Site 2' },
  ],
  scale: {
    x: { padding: 0 },
    color: { range: ['#0050B3', '#1890FF', '#40A9FF', '#69C0FF', '#BAE7FF'] },
  },
  coordinate: { transform: [{ type: 'transpose' }] },
  axis: false,
  children: [
    {
      type: 'interval',
      data: {
        transform: [{ type: 'filter', callback: (d) => d.site === 'Site 1' }],
      },
      encode: { x: 'action', y: 'visitor', color: 'action', shape: 'funnel' },
      style: { stroke: '#FFF' },
      animate: { enter: { type: 'fadeIn' } },
      labels: [
        {
          text: 'visitor',
          position: 'inside',
          transform: [{ type: 'contrastReverse' }],
        },
        { text: 'action', position: 'right' },
      ],
    },
    {
      type: 'interval',
      data: {
        transform: [{ type: 'filter', callback: (d) => d.site === 'Site 2' }],
      },
      encode: {
        x: 'action',
        y: (d) => -d.visitor,  // Negative values create mirror symmetry
        color: 'action',
        shape: 'funnel',
      },
      style: { stroke: '#FFF' },
      animate: { enter: { type: 'fadeIn' } },
      labels: [
        {
          text: 'visitor',
          position: 'inside',
          transform: [{ type: 'contrastReverse' }],
        },
      ],
    },
  ],
  legend: false,
});
```

## Percentage funnel + conversion-rate annotation

`normalizeY` makes each stage height proportional, and `symmetryY` makes it symmetric - **the order cannot be reversed**:

```javascript
const data = [
  { stage: 'Visit', count: 10000 },
  { stage: 'Sign up', count: 6200 },
  { stage: 'Activate', count: 3800 },
  { stage: 'Pay', count: 1500 },
];

const dataWithRate = data.map((d, i) => ({
  ...d,
  rate: i === 0 ? '100%' : `${((d.count / data[i - 1].count) * 100).toFixed(1)}%`,
}));

chart.options({
  type: 'interval',
  data: dataWithRate,
  encode: {
    x: 'stage',
    y: 'count',
    color: 'stage',
    shape: 'funnel',
  },
  transform: [
    { type: 'normalizeY' },   // 1. Normalize first (unify height proportions)
    { type: 'symmetryY' },    // 2. Then symmetrize (form the funnel shape)
  ],
  coordinate: { transform: [{ type: 'transpose' }] },
  axis: false,
  legend: false,
  labels: [
    {
      text: (d) => d.stage,
      position: 'inside',
      style: { fill: 'white', fontSize: 13, fontWeight: 'bold' },
    },
    {
      text: (d) => `Conversion rate ${d.rate}`,
      position: 'right',
      style: { fill: '#666', fontSize: 11 },
      dx: 8,
    },
  ],
});
```

## Common errors and fixes

### Error 1: missing symmetryY transform

```javascript
// ❌ Error: without symmetryY, the funnel is asymmetric and becomes a regular bar chart
chart.options({
  type: 'interval',
  data,
  encode: { x: 'stage', y: 'value', shape: 'funnel' },
  coordinate: { transform: [{ type: 'transpose' }] },
  // ❌ Missing transform: [{ type: 'symmetryY' }]
});

// ✅ Correct: symmetryY must be added
chart.options({
  type: 'interval',
  data,
  encode: { x: 'stage', y: 'value', shape: 'funnel' },
  coordinate: { transform: [{ type: 'transpose' }] },
  transform: [{ type: 'symmetryY' }],  // ✅ Required
});
```

### Error 2: incorrect shape value

```javascript
// ❌ Error: shape belongs in encode, not style
chart.options({
  type: 'interval',
  encode: { x: 'stage', y: 'value' },
  style: { shape: 'funnel' },  // ❌ shape is not in style
});

// ✅ Correct: shape is an encode channel
chart.options({
  type: 'interval',
  encode: { x: 'stage', y: 'value', shape: 'funnel' },  // ✅
});
```

### Error 3: coordinate syntax error

```javascript
// ❌ Error: coordinate is not an array
chart.options({
  coordinate: [{ type: 'transpose' }],  // ❌ Incorrect syntax
});

// ✅ Correct: coordinate is an object, with transpose placed in the transform array
chart.options({
  coordinate: { transform: [{ type: 'transpose' }] },  // ✅
});
```

### Error 4: pyramid is not reversed

```javascript
// ❌ Error: pyramid places the wide end at the top by default (not a pyramid shape)
chart.options({
  encode: { shape: 'pyramid' },
  // ❌ Missing style.reverse: true
});

// ✅ Correct: add reverse: true so smaller values are at the top
chart.options({
  encode: { shape: 'pyramid' },
  style: { reverse: true },  // ✅ Puts the smallest value at the top (pyramid shape)
});
```

## encode.shape options

| shape value | Effect |
|------------|--------------------------|
| `'funnel'` | Standard funnel shape (default trapezoid) |
| `'pyramid'`| Isosceles triangle (pyramid) |
