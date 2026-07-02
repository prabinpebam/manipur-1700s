---
id: "g2-comp-scrollbar"
title: "G2 Scrollbar"
description: |
  The scrollbar component lets users scroll through data that exceeds the canvas bounds, which is useful when there are too many data items to browse at once.
  The scrollbar can be configured for the x-axis (scrollbarX) or y-axis (scrollbarY) direction.
  Unlike slider, scrollbar scrolls a fixed-size viewport, while slider supports resizing the viewport.

library: "g2"
version: "5.x"
category: "components"
tags:
  - "scrollbar"
  - "data browsing"
  - "scrollbarX"
  - "scrollbarY"
  - "component"

related:
  - "g2-comp-slider"
  - "g2-interaction-scrollbar-filter"

use_cases:
  - "Scroll horizontally when there are too many categories (> 20 categories)"
  - "Scroll through long time-series data"
  - "Keep a fixed viewport size while scrolling through all data"

anti_patterns:
  - "A scrollbar is unnecessary when the dataset is small"
  - "Use slider when the viewport size needs to be adjustable"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/component/scrollbar"
---

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

// 50 category items
const data = Array.from({ length: 50 }, (_, i) => ({
  category: `Category ${i + 1}`,
  value: Math.random() * 100,
}));

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  scrollbar: {
    x: true,   // Enable the X-axis scrollbar
  },
  legend: false,
});

chart.render();
```

---

## Incrementally modifying configuration

If you already have a chart and only want to modify a specific option (such as the thumb color), you can use one of the following methods:

```javascript
// Method 1: Call options again and pass only the configuration to change
chart.options({
  scrollbar: {
    x: {
      thumbFill: 'red',  // Only change the thumb fill color
    },
  },
});
chart.render();  // Re-rendering is required

// Method 2: Modify the full configuration after defining it
const options = {
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value' },
  scrollbar: { x: true },
};
chart.options(options);

// Subsequent modification
options.scrollbar = { x: { thumbFill: 'red' } };
chart.options(options);
chart.render();
```

---

## Complete configuration reference

### Basic configuration

| Property | Description | Type | Default |
|------|------|------|--------|
| `ratio` | Scrollbar ratio: the proportion of total data shown on one page | `number` | `0.5` |
| `value` | Initial scrollbar position (0-1); horizontal defaults to 0, vertical defaults to 1 | `number` | - |
| `slidable` | Whether dragging is allowed | `boolean` | `true` |
| `position` | Scrollbar position relative to the chart | `string` | `'bottom'` |
| `isRound` | Whether the scrollbar style uses rounded corners | `boolean` | `true` |

### Thumb style

| Property | Description | Type | Default |
|------|------|------|--------|
| `thumbFill` | **Thumb fill color** | `string` | `#000` |
| `thumbFillOpacity` | Thumb fill opacity | `number` | `0.15` |
| `thumbStroke` | Thumb stroke color | `string` | - |
| `thumbLineWidth` | Thumb stroke width | `number` | - |
| `thumbStrokeOpacity` | Thumb stroke opacity | `number` | - |
| `thumbLineDash` | Thumb dashed-line configuration | `[number, number]` | - |
| `thumbOpacity` | Overall thumb opacity | `number` | - |
| `thumbShadowColor` | Thumb shadow color | `string` | - |
| `thumbShadowBlur` | Thumb shadow blur factor | `number` | - |
| `thumbShadowOffsetX` | Horizontal shadow offset | `number` | - |
| `thumbShadowOffsetY` | Vertical shadow offset | `number` | - |
| `thumbCursor` | Mouse cursor style for the thumb | `string` | `default` |

### Track style

| Property | Description | Type | Default |
|------|------|------|--------|
| `trackSize` | Track width | `number` | `10` |
| `trackLength` | Track length | `number` | - |
| `trackFill` | Track fill color | `string` | - |
| `trackFillOpacity` | Track fill opacity | `number` | `0` |
| `trackStroke` | Track stroke color | `string` | - |
| `trackLineWidth` | Track stroke width | `number` | - |
| `trackStrokeOpacity` | Track stroke opacity | `number` | - |
| `trackLineDash` | Track dashed-line configuration | `[number, number]` | - |
| `trackOpacity` | Overall track opacity | `number` | - |
| `trackShadowColor` | Track shadow color | `string` | - |
| `trackShadowBlur` | Track shadow blur factor | `number` | - |
| `trackShadowOffsetX` | Horizontal shadow offset | `number` | - |
| `trackShadowOffsetY` | Vertical shadow offset | `number` | - |
| `trackCursor` | Mouse cursor style for the track | `string` | `default` |

---

## Common configuration examples

### Configure scrollbar style and initial position

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'date', y: 'value' },
  scrollbar: {
    x: {
      ratio: 0.2,      // Ratio of the viewport to all data
      value: 0,        // Initial scroll position (0 = leftmost, 1 = rightmost)
      // Track style
      trackSize: 14,
      trackFill: '#f0f0f0',
      trackFillOpacity: 1,
      // Thumb style
      thumbFill: '#5B8FF9',
      thumbFillOpacity: 0.5,
    },
  },
});
```

### Change the thumb color to red

```javascript
chart.options({
  scrollbar: {
    x: {
      thumbFill: 'red',
      thumbFillOpacity: 0.3,
      thumbStroke: 'darkred',
      thumbLineWidth: 1,
    },
  },
});
```

### Y-axis scrollbar

```javascript
chart.options({
  type: 'interval',
  data: manyRowsData,
  encode: { x: 'value', y: 'category' },
  coordinate: { transform: [{ type: 'transpose' }] },
  scrollbar: {
    y: {
      ratio: 0.3,   // Show only 30% of the data at a time
      value: 0.5,   // Start from the middle
    },
  },
});
```

### Configure X and Y scrollbars together

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'letter', y: 'frequency' },
  scrollbar: {
    x: {
      ratio: 0.2,
      trackSize: 14,
      trackFill: '#000',
      trackFillOpacity: 1,
    },
    y: {
      ratio: 0.5,
      trackSize: 12,
      value: 0.1,
      trackFill: '#000',
      trackFillOpacity: 1,
    },
  },
});
```

---

## Common mistakes and fixes

### Mistake 1: Incorrect style property names

```javascript
// Incorrect property name
scrollbar: { x: { fill: 'red' } }  // Does not exist

// Correct property names (with prefixes)
scrollbar: { x: { thumbFill: 'red' } }  // Change the thumb color
scrollbar: { x: { trackFill: '#f0f0f0' } }  // Change the track color
```

### Mistake 2: Confusing scrollbar with slider

```javascript
// scrollbar: fixed viewport size; can move but cannot zoom
scrollbar: { x: { ratio: 0.2 } }  // Always shows 20% of the data

// slider: the handles on both ends can be dragged to adjust the display range
slider: { x: { values: [0, 0.2] } }  // Can be dragged to any range
```

### Mistake 3: Using a scrollbar when there is not much data

```javascript
// Only 10 categories; no scrollbar is needed
chart.options({ scrollbar: { x: true } });  // Redundant

// Usually consider this only for > 20 categories or long time-series data
// For small datasets, consider adjusting chart.width or rotating axis labels instead
```

### Mistake 4: Putting scrollbar inside style

```javascript
// Incorrect: style properties are written directly in the option, not inside a style object
scrollbar: { x: { style: { thumbFill: 'red' } } }

// Correct: style properties are written directly in the option
scrollbar: { x: { thumbFill: 'red' } }
```
