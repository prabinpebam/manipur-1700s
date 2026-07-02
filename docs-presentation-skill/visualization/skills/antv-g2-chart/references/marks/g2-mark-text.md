---
id: "g2-mark-text"
title: "G2 Text Annotation (text mark)"
description: |
  G2 v5 includes a built-in text mark for drawing custom text annotations in charts.
  The encode.x and encode.y channels determine position, while encode.text or style.text provides the displayed content.
  Text marks are often overlaid with other marks to create data labels, threshold annotations, chart titles, and explanatory callouts.

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "text annotation"
  - "text"
  - "label"
  - "note"
  - "annotation"
  - "spec"

related:
  - "g2-mark-line-basic"
  - "g2-mark-interval-basic"
  - "g2-core-view-composition"
  - "g2-comp-annotation"

use_cases:
  - "display value labels above bars"
  - "annotate special events or thresholds in a chart"
  - "add a custom chart title or explanatory text"
  - "highlight a data point with descriptive text"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/annotation/annotation/#text"
---

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 600,
  height: 400,
});

const data = [
  { month: 'January', value: 120 },
  { month: 'February', value: 180 },
  { month: 'March', value: 150 },
  { month: 'April', value: 210 },
  { month: 'May', value: 170 },
];

chart.options({
  type: 'view',
  data,
  children: [
    {
      type: 'interval',
      encode: { x: 'month', y: 'value' },
    },
    {
      type: 'text',
      encode: {
        x: 'month',
        y: 'value',
        text: 'value', // Use this data field as the displayed text.
      },
      style: {
        textAlign: 'center',
        dy: -8, // Move the label upward.
        fontSize: 12,
        fill: '#333',
      },
    },
  ],
});

chart.render();
```

## Fixed-position text annotation (not bound to data)

```javascript
// Add a fixed-position text label, such as a threshold note.
chart.options({
  type: 'view',
  data,
  children: [
    {
      type: 'line',
      encode: { x: 'month', y: 'value' },
    },
    {
      // Fixed-position text that uses a single data item.
      type: 'text',
      [{ x: 'March', y: 200, label: 'Target Line' }],
      encode: { x: 'x', y: 'y', text: 'label' },
      style: {
        fill: '#ff4d4f',
        fontSize: 12,
        fontWeight: 'bold',
        dx: 5,
      },
    },
  ],
});
```

## Annotating a horizontal threshold line with lineY

```javascript
// Compose lineY and text to annotate a threshold line.
chart.options({
  type: 'view',
  data,
  children: [
    {
      type: 'interval',
      encode: { x: 'month', y: 'value' },
      style: { fill: '#1890ff' },
    },
    {
      // Horizontal threshold line.
      type: 'lineY',
      data: [{ y: 160 }],
      encode: { y: 'y' },
      style: { stroke: '#ff4d4f', lineDash: [4, 4], lineWidth: 1.5 },
    },
    {
      // Threshold annotation text.
      type: 'text',
      [{ month: 'May', value: 160, label: 'Target 160' }],
      encode: { x: 'month', y: 'value', text: 'label' },
      style: {
        fill: '#ff4d4f',
        fontSize: 12,
        textAlign: 'right',
        dy: -6,
      },
    },
  ],
});
```

## Complete configuration options

```javascript
chart.options({
  type: 'text',
  data,
  encode: {
    x: 'xField', // X position field.
    y: 'yField', // Y position field.
    text: 'textField', // Field that provides the displayed text.
    color: 'series', // Optional color grouping field.
  },
  style: {
    // Text style.
    fontSize: 12,
    fontWeight: 'normal',
    fill: '#333',
    textAlign: 'center', // 'left' | 'center' | 'right'
    textBaseline: 'bottom', // 'top' | 'middle' | 'bottom'

    // Position offsets.
    dx: 0, // Horizontal offset in pixels.
    dy: -8, // Vertical offset in pixels; negative values move upward.

    // Optional background frame.
    background: true,
    backgroundFill: 'rgba(255,255,255,0.8)',
    backgroundPadding: [2, 4],
    backgroundRadius: 3,

    // Rotation.
    rotate: 0, // Rotation angle in degrees.
  },
});
```

## Scatter plot data-point labels

```javascript
const scatterData = [
  { x: 10, y: 80, name: 'Product A' },
  { x: 20, y: 60, name: 'Product B' },
  { x: 35, y: 90, name: 'Product C' },
  { x: 50, y: 40, name: 'Product D' },
  { x: 65, y: 75, name: 'Product E' },
];

chart.options({
  type: 'view',
  data: scatterData,
  children: [
    {
      type: 'point',
      encode: { x: 'x', y: 'y' },
      style: { r: 6, fill: '#1890ff' },
    },
    {
      type: 'text',
      encode: { x: 'x', y: 'y', text: 'name' },
      style: {
        dy: -12,
        textAlign: 'center',
        fontSize: 11,
        fill: '#666',
      },
    },
  ],
});
```

## Common errors and fixes

### Error 1: Using a standalone text mark without data

```javascript
// ❌ Error: the text mark needs data, or it must inherit data from a parent view.
chart.options({
  type: 'text',
  // Missing data, and no parent view provides it.
  encode: { x: 'month', y: 'value', text: 'label' },
});

// ✅ Correct approach: provide data in the parent view.
chart.options({
  type: 'view',
  data, // Child marks automatically inherit data from the view.
  children: [
    { type: 'interval', encode: { x: 'month', y: 'value' } },
    { type: 'text', encode: { x: 'month', y: 'value', text: 'value' } },
  ],
});

// ✅ Correct approach 2: give the text mark its own data for fixed annotations.
chart.options({
  type: 'text',
  data: [{ x: 'March', y: 200, label: 'Special Annotation' }],
  encode: { x: 'x', y: 'y', text: 'label' },
});
```

### Error 2: Writing encode.text as a literal string instead of a field name

```javascript
// ❌ Error: encode.text should be a data-field name, not literal display text.
chart.options({
  type: 'text',
  encode: {
    x: 'month',
    y: 'value',
    text: 'Fixed Text', // ❌ Interpreted as a field named 'Fixed Text', which is missing from the data.
  },
});

// ✅ Correct: use style.text or a transform function for fixed text.
chart.options({
  type: 'text',
  encode: { x: 'month', y: 'value' },
  style: {
    text: (d) => `${d.value}`, // Return the display text from a function.
    textAlign: 'center',
    dy: -8,
  },
});

// Or use a function in encode.text.
chart.options({
  type: 'text',
  encode: {
    x: 'month',
    y: 'value',
    text: (d) => d.value, // encode.text can be a function.
  },
});
```

### Error 3: Forgetting to overlay text and interval marks in a shared view

```javascript
// ❌ Error: two independent charts cannot overlay their marks.
const chart1 = new Chart({ container: 'c1' });
chart1.options({ type: 'interval', data, encode: { x: 'month', y: 'value' } });

const chart2 = new Chart({ container: 'c2' });
chart2.options({ type: 'text', data, encode: { x: 'month', y: 'value', text: 'value' } });

// ✅ Correct: use view children to overlay the marks.
chart.options({
  type: 'view',
  data,
  children: [
    { type: 'interval', encode: { x: 'month', y: 'value' } },
    {
      type: 'text',
      encode: { x: 'month', y: 'value', text: 'value' },
      style: { textAlign: 'center', dy: -8 },
    },
  ],
});
```
