---
id: "g2-mark-image"
title: "G2 Image Mark"
description: |
  The image mark renders images at specified positions in a chart. It can be used for icon scatter plots, where icons replace points,
  icon annotations on maps, labels with images, and similar scenarios.
  Bind image URLs through the src channel, determine positions with the x/y channels, and control size with the size channel.

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "image"
  - "icon"
  - "image scatter plot"

related:
  - "g2-mark-point-scatter"
  - "g2-mark-text"

use_cases:
  - "Use brand logos or icons instead of scatter points in an icon scatter plot"
  - "Insert explanatory images at specific coordinate positions"
  - "Add icon annotations to maps"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/point/#image"
---

## Minimal runnable example (icon scatter plot)

```javascript
import { Chart } from '@antv/g2';

const data = [
  { country: 'China',   gdp: 17.7, icon: 'https://example.com/flags/cn.png' },
  { country: 'United States', gdp: 25.5, icon: 'https://example.com/flags/us.png' },
  { country: 'Japan',   gdp: 4.2,  icon: 'https://example.com/flags/jp.png' },
  { country: 'Germany', gdp: 4.1,  icon: 'https://example.com/flags/de.png' },
];

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'image',
  data,
  encode: {
    x: 'country',  // x position (categorical axis)
    y: 'gdp',      // y position (numeric axis)
    src: 'icon',   // Image URL field
    size: 40,      // Image size (px), fixed value or field name
  },
});

chart.render();
```

## image + point overlay (icon + data point)

```javascript
chart.options({
  type: 'view',
  data,
  children: [
    {
      type: 'image',
      encode: { x: 'x', y: 'y', src: 'icon', size: 32 },
    },
    {
      type: 'text',
      encode: { x: 'x', y: 'y', text: 'label' },
      style: { textAnchor: 'middle', dy: 20, fontSize: 12 },
    },
  ],
});
```

## Configuration options

```javascript
chart.options({
  type: 'image',
  data,
  encode: {
    x: 'xField',       // x coordinate
    y: 'yField',       // y coordinate
    src: 'imageUrl',   // Image URL field (or fixed URL string)
    size: 'sizeField', // Image size (px), either a field name or fixed numeric value
  },
  style: {
    preserveAspectRatio: 'xMidYMid meet',  // Image scaling strategy (SVG standard)
  },
});
```

## Common errors and fixes

### Error 1: The src channel contains the image data itself, not a URL
```javascript
// Error: src should be a URL field name, not base64 or a blob.
chart.options({
  encode: { src: btoa(imageData) },  // Cannot pass a base64 string directly; a complete data: URL is required.
});

// Correct: pass a URL field name, and store complete URLs in the data.
chart.options({
  encode: { src: 'iconUrl' },  // The iconUrl field in the data has the 'https://...' format.
});
```

### Error 2: size is not set, so the image may be too large or too small by default
```javascript
// size is not set, so the image may be too large and cover other elements.
chart.options({
  type: 'image',
  encode: { x: 'x', y: 'y', src: 'icon' },  // No size
});

// Set an appropriate size explicitly.
chart.options({
  encode: { x: 'x', y: 'y', src: 'icon', size: 36 },
});
```