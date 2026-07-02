---
id: "g2-comp-slider"
title: "G2 Slider"
description: |
  slider lets users adjust the chart's displayed data range by dragging the handles at both ends.
  It is commonly used for time-range filtering in time-series charts and can be configured for the x-axis (sliderX) or y-axis (sliderY) direction.
  It supports initial values (values) and linked interaction (sliderFilter interaction).

library: "g2"
version: "5.x"
category: "components"
tags:
  - "slider"
  - "overview axis"
  - "sliderX"
  - "sliderY"
  - "time filtering"
  - "range selection"
  - "component"

related:
  - "g2-comp-scrollbar"
  - "g2-interaction-slider-filter"
  - "g2-scale-time"

use_cases:
  - "Interactive time-range filtering for time-series charts"
  - "Dynamically adjust and inspect numeric ranges"
  - "Explore subsets of large datasets"

anti_patterns:
  - "Overview axes are rarely used with categorical axes"
  - "An overview axis is unnecessary for small datasets"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/component/slider"
---

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const data = Array.from({ length: 200 }, (_, i) => ({
  date: new Date(2020, 0, i + 1).toISOString().split('T')[0],
  value: Math.sin(i / 30) * 50 + 100 + Math.random() * 20,
}));

const chart = new Chart({ container: 'container', width: 800, height: 400 });

chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  slider: {
    x: true,   // Enable the X-axis slider (shows the full range by default)
  },
});

chart.render();
```

---

## Incrementally modifying configuration

If you already have a chart and only want to modify a specific option (such as the handle color), you can use one of the following methods:

```javascript
// Method 1: Call options again and pass only the configuration to change
chart.options({
  slider: {
    x: {
      handleIconFill: 'red',  // Only change the handle icon fill color
    },
  },
});
chart.render();  // Re-rendering is required

// Method 2: After defining the full configuration, modify it before render
const options = {
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  slider: { x: true },
};
chart.options(options);

// Subsequent modification
options.slider = { x: { handleIconFill: 'red' } };
chart.options(options);
chart.render();
```

---

## Complete configuration reference

### Basic configuration

| Property | Description | Type | Default |
|------|------|------|--------|
| `values` | Initial selected range, within the 0-1 interval | `[number, number]` | `[0, 1]` |
| `slidable` | Whether dragging the selection and handles is allowed | `boolean` | `true` |
| `brushable` | Whether brushing is enabled | `boolean` | `true` |
| `labelFormatter` | Formatter for the handle labels while dragging | `(value) => string` | - |
| `showHandle` | Whether to show drag handles | `boolean` | `true` |
| `showLabel` | Whether to show drag-handle text | `boolean` | `true` |
| `showLabelOnInteraction` | Show handle text only while adjusting handles or brushing | `boolean` | `false` |
| `autoFitLabel` | Whether to automatically adjust drag-handle text positions | `boolean` | `true` |
| `padding` | Slider padding | `number \| number[]` | - |

### Selection style

| Property | Description | Type | Default |
|------|------|------|--------|
| `selectionFill` | Selection fill color | `string` | `#1783FF` |
| `selectionFillOpacity` | Selection fill opacity | `number` | `0.15` |
| `selectionStroke` | Selection stroke | `string` | - |
| `selectionStrokeOpacity` | Selection stroke opacity | `number` | - |
| `selectionLineWidth` | Selection stroke width | `number` | - |
| `selectionLineDash` | Selection dashed-line configuration | `[number, number]` | - |
| `selectionOpacity` | Overall selection opacity | `number` | - |
| `selectionShadowColor` | Selection shadow color | `string` | - |
| `selectionShadowBlur` | Selection shadow blur factor | `number` | - |
| `selectionShadowOffsetX` | Horizontal shadow offset | `number` | - |
| `selectionShadowOffsetY` | Vertical shadow offset | `number` | - |
| `selectionCursor` | Mouse cursor style for the selection | `string` | `default` |

### Track style

| Property | Description | Type | Default |
|------|------|------|--------|
| `trackLength` | Track length | `number` | - |
| `trackSize` | Track size | `number` | `16` |
| `trackFill` | Track fill color | `string` | `#416180` |
| `trackFillOpacity` | Track fill opacity | `number` | `1` |
| `trackStroke` | Track stroke | `string` | - |
| `trackStrokeOpacity` | Track stroke opacity | `number` | - |
| `trackLineWidth` | Track stroke width | `number` | - |
| `trackLineDash` | Track stroke dashed-line configuration | `[number, number]` | - |
| `trackOpacity` | Overall track opacity | `number` | - |
| `trackShadowColor` | Track shadow color | `string` | - |
| `trackShadowBlur` | Track shadow blur factor | `number` | - |
| `trackShadowOffsetX` | Horizontal shadow offset | `number` | - |
| `trackShadowOffsetY` | Vertical shadow offset | `number` | - |
| `trackCursor` | Mouse cursor style for the track | `string` | `default` |

### Handle icon style

| Property | Description | Type | Default |
|------|------|------|--------|
| `handleIconSize` | Handle icon size | `number` | `10` |
| `handleIconRadius` | Handle icon corner radius | `number` | `2` |
| `handleIconShape` | Handle icon shape | `string \| (type) => DisplayObject` | - |
| `handleIconFill` | **Handle icon fill color** | `string` | `#f7f7f7` |
| `handleIconFillOpacity` | Handle icon fill opacity | `number` | `1` |
| `handleIconStroke` | Handle icon stroke | `string` | `#1D2129` |
| `handleIconStrokeOpacity` | Handle icon stroke opacity | `number` | `0.25` |
| `handleIconLineWidth` | Handle icon stroke width | `number` | `1` |
| `handleIconLineDash` | Handle icon stroke dashed-line configuration | `[number, number]` | - |
| `handleIconOpacity` | Overall handle icon opacity | `number` | - |
| `handleIconShadowColor` | Handle icon shadow color | `string` | - |
| `handleIconShadowBlur` | Handle icon shadow blur factor | `number` | - |
| `handleIconShadowOffsetX` | Horizontal shadow offset | `number` | - |
| `handleIconShadowOffsetY` | Vertical shadow offset | `number` | - |
| `handleIconCursor` | Mouse cursor style for the handle icon | `string` | `default` |

### Handle label style

| Property | Description | Type | Default |
|------|------|------|--------|
| `handleLabelFontSize` | Label text size | `number` | `12` |
| `handleLabelFontFamily` | Label text font family | `string` | - |
| `handleLabelFontWeight` | Label font weight | `number` | `normal` |
| `handleLabelLineHeight` | Label text line height | `number` | - |
| `handleLabelTextAlign` | Label horizontal alignment | `string` | `start` |
| `handleLabelTextBaseline` | Label vertical baseline | `string` | `bottom` |
| `handleLabelFill` | Label text fill color | `string` | `#1D2129` |
| `handleLabelFillOpacity` | Label text fill opacity | `number` | `0.45` |
| `handleLabelStroke` | Label text stroke | `string` | - |
| `handleLabelStrokeOpacity` | Label text stroke opacity | `number` | - |
| `handleLabelLineWidth` | Label text stroke width | `number` | - |
| `handleLabelLineDash` | Label text stroke dashed-line configuration | `[number, number]` | - |
| `handleLabelOpacity` | Overall label opacity | `number` | - |
| `handleLabelShadowColor` | Label shadow color | `string` | - |
| `handleLabelShadowBlur` | Label shadow blur factor | `number` | - |
| `handleLabelShadowOffsetX` | Horizontal shadow offset | `number` | - |
| `handleLabelShadowOffsetY` | Vertical shadow offset | `number` | - |
| `handleLabelCursor` | Mouse cursor style for the label | `string` | `default` |
| `handleLabelDx` | Label horizontal offset | `number` | `0` |
| `handleLabelDy` | Label vertical offset | `number` | `0` |

### Sparkline style

| Property | Description | Type | Default |
|------|------|------|--------|
| `sparklineType` | Sparkline type | `'line' \| 'column'` | `'line'` |
| `sparklineIsStack` | Whether to stack | `boolean` | `false` |
| `sparklineRange` | Value range | `[number, number]` | - |
| `sparklineColor` | Color | `string \| string[]` | - |
| `sparklineSmooth` | Smooth curve | `boolean` | `false` |
| `sparklineLineStroke` | Line color | `string` | - |
| `sparklineLineStrokeOpacity` | Line opacity | `number` | - |
| `sparklineLineLineDash` | Line dashed-line configuration | `[number, number]` | - |
| `sparklineAreaFill` | Filled-area color | `string` | - |
| `sparklineAreaFillOpacity` | Filled-area opacity | `number` | - |
| `sparklineColumnFill` | Histogram bar color | `string` | - |
| `sparklineColumnFillOpacity` | Histogram bar opacity | `number` | - |
| `sparklineIsGroup` | Whether to show groups | `boolean` | `false` |
| `sparklineSpacing` | Grouped histogram spacing | `number` | `0` |

---

## Common configuration examples

### Set the initial display range

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  slider: {
    x: {
      values: [0.5, 1.0],  // Initially show the last 50% of the data
    },
  },
});
```

### Change the handle icon to red

```javascript
chart.options({
  slider: {
    x: {
      handleIconFill: 'red',
      handleIconStroke: 'darkred',
      handleIconSize: 12,
    },
  },
});
```

### Customize the handle icon shape

```javascript
import { Circle } from '@antv/g';

chart.options({
  slider: {
    x: {
      handleIconShape: (type) => {
        // type is 'start' or 'end', representing the left and right handles respectively
        return new Circle({
          style: {
            r: 8,
            fill: type === 'start' ? '#FF6B9D' : '#00D9FF',
            stroke: '#fff',
            lineWidth: 2,
          },
        });
      },
      handleIconSize: 16,
    },
  },
});
```

### Complete style configuration

```javascript
chart.options({
  slider: {
    x: {
      values: [0.3, 0.7],
      // Selection style
      selectionFill: '#1890ff',
      selectionFillOpacity: 0.2,
      // Track style
      trackFill: '#f0f0f0',
      trackSize: 20,
      // Handle icon style
      handleIconFill: '#fff',
      handleIconStroke: '#1890ff',
      handleIconSize: 14,
      handleIconRadius: 4,
      // Handle label style
      handleLabelFill: '#333',
      handleLabelFontSize: 12,
    },
  },
});
```

---

## Common mistakes and fixes

### Mistake 1: values outside the [0, 1] range

```javascript
// values must be within the [0, 1] interval
chart.options({ slider: { x: { values: [50, 100] } } });

// values are data proportions (0-1)
chart.options({ slider: { x: { values: [0.5, 1.0] } } });
```

### Mistake 2: Incorrect style property names

```javascript
// Incorrect property name
slider: { x: { handleFill: 'red' } }  // Does not exist

// Correct property name (with prefix)
slider: { x: { handleIconFill: 'red' } }  // Correct
```

### Mistake 3: Confusing slider with scrollbar

```javascript
// slider: handles on both ends can be dragged independently, so the viewport size is variable
slider: { x: { values: [0.3, 0.7] } }

// scrollbar: fixed viewport size; only the whole viewport can slide
scrollbar: { x: { ratio: 0.4 } }
```
