---
id: "g2-comp-annotation"
title: "G2 Annotations (Annotation)"
description: |
  In G2 v5, annotations are implemented by overlaying additional marks (text, line, image, and others)
  on top of charts. Common annotations include text annotations, reference lines, and reference areas.
  This document uses the Spec-mode view + children approach to compose annotations.

library: "g2"
version: "5.x"
category: "components"
tags:
  - "annotation"
  - "annotation"
  - "reference line"
  - "reference line"
  - "text annotation"
  - "lineX"
  - "lineY"
  - "spec"

related:
  - "g2-core-view-composition"
  - "g2-comp-axis-config"

use_cases:
  - "Add average lines and target lines to charts"
  - "Annotate special data points, such as maximum and minimum values"
  - "Add background colors for reference ranges"

difficulty: "intermediate"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/extra-topics/annotation"
---

## Horizontal reference line (lineY)

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'view',
  data,
  children: [
    // Main chart: line chart
    {
      type: 'line',
      encode: { x: 'month', y: 'value' },
    },
    // Annotation: horizontal reference line at y = 60
    {
      type: 'lineY',
      data: [60],
      style: {
        stroke: '#f5222d',
        strokeDasharray: '4 4',
        lineWidth: 1.5,
      },
      labels: [
        {
          text: 'Target: 60',
          position: 'right',
          style: { fill: '#f5222d', fontSize: 11 },
        },
      ],
    },
  ],
});

chart.render();
```

## Vertical reference line (lineX)

```javascript
// Mark a special point in time
{
  type: 'lineX',
  data: [new Date('2024-03-01')],
  style: { stroke: '#722ed1', strokeDasharray: '4 4', lineWidth: 1.5 },
  labels: [
    { text: 'Release', position: 'top', style: { fill: '#722ed1' } },
  ],
}
```

## Annotate the maximum value point

```javascript
chart.options({
  type: 'view',
  data,
  children: [
    { type: 'line', encode: { x: 'month', y: 'value' } },
    {
      // Use point + text to annotate the maximum value
      type: 'point',
      data,
      encode: { x: 'month', y: 'value' },
      transform: [{ type: 'select', channel: 'y', selector: 'max' }],  // Select only the maximum-value point
      style: { fill: '#f5222d', r: 5 },
      labels: [
        {
          text: (d) => `Maximum\n${d.value}`,
          position: 'top',
          style: { fill: '#f5222d', fontSize: 11 },
        },
      ],
    },
  ],
});
```

## Reference range (rangeX)

```javascript
// Highlight an x-value range, such as a normal range
{
  type: 'rangeX',
  data: [{ x: 'June', x1: 'July' }],
  encode: { x: 'x', x1: 'x1' },
  style: {
    fill: '#52c41a',
    fillOpacity: 0.08,
  },
  labels: [
    {
      text: 'Normal range',
      position: 'top-right',
      style: { fill: '#52c41a', fontSize: 11 },
    },
  ],
}
```

## Reference range (rangeY)

```javascript
// Highlight a y-value range, such as a normal range
{
  type: 'rangeY',
  data: [{ y: 50, y1: 80 }],
  encode: { y: 'y', y1: 'y1' },
  style: {
    fill: '#52c41a',
    fillOpacity: 0.08,
  },
  labels: [
    {
      text: 'Normal range',
      position: 'right',
      style: { fill: '#52c41a', fontSize: 11 },
    },
  ],
}
```

## Text annotation (text mark)

```javascript
// Add text at specified coordinates
{
  type: 'text',
  data: [{ x: 'Mar', y: 91, label: 'Peak' }],
  encode: { x: 'x', y: 'y', text: 'label' },
  style: {
    textAlign: 'center',
    textBaseline: 'bottom',
    fill: '#1890ff',
    fontSize: 12,
    dy: -6,
  },
}
```

## Image annotation (image mark)

```javascript
// Add an image annotation at the center of the chart
{
  type: 'image',
  data: [{
    src: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    x: '50%',
    y: '50%'
  }],
  encode: { 
    x: 'x', 
    y: 'y', 
    src: 'src' 
  },
  style: {
    width: 80,
    height: 80,
    textAlign: 'center',
    textBaseline: 'middle'
  }
}
```

## Common mistakes and fixes

### Mistake: Overlaying annotations directly in a non-view container
```javascript
// ❌ Incorrect: multiple chart.options() calls overwrite each other
chart.options({ type: 'line', ... });
chart.options({ type: 'lineY', ... });  // Overwrites the line chart!

// ✅ Correct: use type: 'view' + the children array to overlay marks
chart.options({
  type: 'view',
  data,
  children: [
    { type: 'line', ... },
    { type: 'lineY', ... },
  ],
});
```

### Mistake: Image annotation position and encoding are not configured correctly
```javascript
// ❌ Incorrect: using functions to return fixed coordinates without binding to data channels
{
  type: 'image',
  data: [{ url: 'https://example.com/image.png' }],
  encode: {
    x: () => 0, // Fixed at the center
    y: () => 0  // Fixed at the center
  },
  style: {
    img: (d) => d.url,
    width: 80,
    height: 80
  }
}

// ✅ Correct: use relative percentage coordinates and map the src channel correctly
{
  type: 'image',
  data: [{
    src: 'https://example.com/image.png',
    x: '50%',
    y: '50%'
  }],
  encode: { 
    x: 'x', 
    y: 'y', 
    src: 'src' 
  },
  style: {
    width: 80,
    height: 80
  }
}
```
