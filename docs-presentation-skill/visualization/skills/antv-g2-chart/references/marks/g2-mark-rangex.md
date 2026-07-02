---
id: "g2-mark-rangex"
title: "G2 RangeX and RangeY Range Annotations"
description: |
  rangeX draws a labeled region along the x-axis, commonly used to annotate important time intervals, events, or threshold ranges.
  rangeY draws a horizontal labeled region along the y-axis, commonly used to annotate value bands such as target ranges or warning zones.
  These marks are often combined with line charts to add background range annotations.

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "rangeX"
  - "rangeY"
  - "range"
  - "annotation"
  - "highlight region"
  - "reference region"
  - "time interval"

related:
  - "g2-comp-annotation"
  - "g2-mark-line-basic"
  - "g2-comp-view"

use_cases:
  - "Highlight special time intervals in a time-series chart, such as events or holidays"
  - "Annotate a normal value range, such as a green safe zone"
  - "Emphasize a meaningful data range with a label"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/annotation/range/"
---

## Minimal runnable example (time-interval highlight)

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 800, height: 400 });

chart.options({
  type: 'view',
  children: [
  // Main line chart
  {
  type: 'line',
  [
  { date: '2024-01', value: 100 },
  { date: '2024-02', value: 120 },
  { date: '2024-03', value: 150 },
  { date: '2024-04', value: 130 },
  { date: '2024-05', value: 160 },
  ],
  encode: { x: 'date', y: 'value' },
  style: { lineWidth: 2 },
  },
  // Highlighted region
  {
  type: 'rangeX',
  [
  { x: '2024-02', x1: '2024-03', label: 'Campaign period' },
  ],
  encode: { x: 'x', x1: 'x1' },
  style: { fill: '#FF6B35', fillOpacity: 0.15 },
  labels: [{ text: 'label', position: 'top', style: { fontSize: 11 } }],
  },
  ],
});

chart.render();
```

## Time-interval annotation (line chart + historical event background)

Use Date objects and array fields to annotate time intervals:

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

// Population data
const populationData = [
  { year: '1875', population: 1309 },
  { year: '1890', population: 1558 },
  { year: '1910', population: 4512 },
  { year: '1925', population: 8180 },
  { year: '1933', population: 15915 },
  { year: '1939', population: 24824 },
  { year: '1946', population: 28275 },
  { year: '1950', population: 29189 },
  { year: '1964', population: 29881 },
  { year: '1971', population: 26007 },
];

chart.options({
  type: 'view',
  autoFit: true,
  children: [
  // Background range annotations for historical periods
  {
  type: 'rangeX',
  [
  { year: [new Date('1933'), new Date('1945')], event: 'Nazi rule' },
  { year: [new Date('1948'), new Date('1989')], event: 'East Germany period' },
  ],
  encode: { x: 'year', color: 'event' },
  scale: {
  color: {
  independent: true, // Use an independent color scale so each range can have a distinct color.
  range: ['#FAAD14', '#30BF78'],
  },
  },
  style: { fillOpacity: 0.75 },
  tooltip: false,
  },
  // Line chart
  {
  type: 'line',
  data: populationData,
  encode: {
  x: (d) => new Date(d.year),
  y: 'population',
  },
  style: { stroke: '#333', lineWidth: 2 },
  },
  // Data points
  {
  type: 'point',
  data: populationData,
  encode: {
  x: (d) => new Date(d.year),
  y: 'population',
  },
  style: { fill: '#333', r: 3 },
  },
  ],
});

chart.render();
```

## Data format notes

rangeX supports the following data formats:

### Format 1: independent fields (x, x1)

```javascript
  [
  { x: '2024-01', x1: '2024-03', label: 'Q1' },
  { x: '2024-04', x1: '2024-06', label: 'Q2' },
],
encode: { x: 'x', x1: 'x1' },
```

### Format 2: array field

```javascript
data: [
  { year: [new Date('1933'), new Date('1945')], event: 'Event A' },
  { year: [new Date('1948'), new Date('1989')], event: 'Event B' },
],
encode: { x: 'year' }, // The array is interpreted as [start, end].
```

## RangeY (horizontal reference range)

```javascript
chart.options({
  type: 'view',
  children: [
  {
  type: 'line',
  data,
  encode: { x: 'date', y: 'temperature' },
  },
  // Annotate the normal temperature range (18-26°C).
  {
  type: 'rangeY',
  [{ y: 18, y1: 26, label: 'Comfort range' }],
  encode: { y: 'y', y1: 'y1' },
  style: { fill: '#52c41a', fillOpacity: 0.1 },
  labels: [{ text: 'label', position: 'right', style: { fill: '#52c41a' } }],
  },
  ],
});
```

## Configuration options

| Property | Description | Type |
|------|------|------|
| `encode.x` | Field for the range start point | `string \| (d) => value` |
| `encode.x1` | Field for the range end point | `string \| (d) => value` |
| `encode.color` | Color field used to distinguish ranges | `string` |
| `style.fill` | Fill color | `string` |
| `style.fillOpacity` | Fill opacity | `number` (0-1) |
| `scale.color.independent` | Whether to use an independent color scale | `boolean` |

## Common errors and fixes

### Error 1: encoding x/x1 as an array instead of independent fields

```javascript
// ❌ Error: rangeX expects separate x and x1 fields, not an array in encode.x.
chart.options({
  type: 'rangeX',
  encode: { x: ['start', 'end'] }, // ❌ Not supported
});

// ✅ Correct: map the start and end fields separately with x and x1.
chart.options({
  type: 'rangeX',
  [{ start: '2024-01', end: '2024-03' }],
  encode: {
  x: 'start', // ✅ Start-point field
  x1: 'end', // ✅ End-point field
  },
});
```

### Error 2: inconsistent time formats prevent the range from aligning with the main chart

```javascript
// ❌ Error: the line chart uses Date objects, but rangeX uses strings, so the scales do not align.
children: [
  { type: 'line', encode: { x: (d) => new Date(d.year) } },
  { type: 'rangeX', encode: { x: 'year' } }, // ❌ Inconsistent format
]

// ✅ Correct: use Date objects consistently.
children: [
  { type: 'line', encode: { x: (d) => new Date(d.year) } },
  { type: 'rangeX', encode: { x: 'year' }, data: [
  { year: [new Date('1933'), new Date('1945')] } // ✅ Use Date values
  ]},
]
```

### Error 3: multiple ranges share similar colors

```javascript
// ❌ Problem: multiple ranges may use a continuous color scale by default, making colors hard to distinguish.
{
  type: 'rangeX',
  data: [
  { year: [start1, end1], event: 'Event A' },
  { year: [start2, end2], event: 'Event B' },
  ],
  encode: { x: 'year', color: 'event' },
}

// ✅ Correct: use independent: true so each range gets an independent color.
{
  type: 'rangeX',
  data: [
  { year: [start1, end1], event: 'Event A' },
  { year: [start2, end2], event: 'Event B' },
  ],
  encode: { x: 'year', color: 'event' },
  scale: {
  color: {
  independent: true, // ✅ Independent color scale
  range: ['#FAAD14', '#30BF78'],
  },
  },
}
```

### Error 4: placing rangeX after the line chart may obscure the line

```javascript
// ❌ Error: rangeX is rendered later and may cover the line.
children: [
  { type: 'line', ... },
  { type: 'rangeX', ... }, // ❌ May obscure the line
]

// ✅ Correct: place rangeX first so it renders as a background layer.
children: [
  { type: 'rangeX', ... }, // ✅ Render first as the background
  { type: 'line', ... },
]
```
