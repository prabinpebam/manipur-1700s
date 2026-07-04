---
id: "g2-comp-label-config"
title: "G2 Data Label Configuration (labels)"
description: |
  Detailed explanation of the labels field in G2 v5 Spec mode, covering label text, positioning, formatting,
  selectors (showing only some labels), label transforms, background boxes, connector lines, and style customization.
  Note: Spec mode uses labels (plural).

library: "g2"
version: "5.x"
category: "components"
tags:
  - "labels"
  - "label"
  - "data labels"
  - "text labels"
  - "position"
  - "formatter"
  - "transform"
  - "spec"

related:
  - "g2-mark-interval-basic"
  - "g2-mark-line-basic"
  - "g2-comp-annotation"

use_cases:
  - "show values above bars"
  - "show series names at the end of lines"
  - "show percentages inside or outside pie slices"
  - "resolve label overlap"
  - "optimize contrast between label colors and marks"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-05-31"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/component/label"
---

## Basic Usage

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data,
  encode: { x: 'genre', y: 'sold' },
  labels: [
    {
      text: 'sold',          // Which field value to display (field-name string or function)
      position: 'outside',   // Label position
    },
  ],
});

chart.render();
```

## Common Positions

### Cartesian Coordinate Systems (interval / point / line / cell, etc.)

Nine positions are supported: `top`, `left`, `right`, `bottom`, `top-left`, `top-right`, `bottom-left`, `bottom-right`, and `inside`.

| position value   | Applicable Mark | Effect                   |
| ---------------- | --------- | ------------------------ |
| `'top'`          | interval  | top of the bar (close to the top edge)     |
| `'right'`        | interval  | right side of the bar                 |
| `'left'`         | interval  | left side of the bar                 |
| `'bottom'`       | interval  | bottom of the bar                 |
| `'inside'`       | interval  | center inside the bar             |
| `'top-left'`     | interval  | top-left corner of the bar               |
| `'top-right'`    | interval  | top-right corner of the bar               |
| `'bottom-left'`  | interval  | bottom-left corner of the bar               |
| `'bottom-right'` | interval  | bottom-right corner of the bar               |
| `'top'`          | point     | above the point                 |
| `'right'`        | line      | right side of the end of the line             |

### Non-Cartesian Coordinate Systems (arc / pie charts / donut charts)

Two basic positions, `outside` and `inside`, are supported, as well as special positions:

| position     | Usage                                            |
| ------------ | ------------------------------------------------ |
| `'outside'`  | leader line outside the slice                                     |
| `'inside'`   | inside the slice                                         |
| `'spider'`   | align labels along both ends of the coordinate-axis edge; suitable for polar coordinates (pie/donut charts) |
| `'surround'` | arrange labels in a ring around the coordinate system; suitable for rose charts             |
| `'area'`     | show area-chart labels in the center of the area region with a certain rotation angle |

## Formatting Label Text

```javascript
labels: [
  {
    // Recommended: use a text function to access the full data row datum
    text: (d) => `${d.sold.toLocaleString()}  ten thousand`,

    // Or a string field name (automatically uses the value of that field)
    // text: 'sold',
  },
],
```

## formatter Usage (Only Formats the Resolved Text)

The first argument received by `formatter` is the value already mapped by `text` (not the full datum), which is suitable for simple numeric formatting:

```javascript
labels: [
  {
    text: 'yield_rate',              // First map the value of the yield_rate field
    formatter: (val) => `${val}%`,   // val is the value of yield_rate, not the datum object
  },
],
```

Full signature:`formatter(text, datum, index, data) => string`

## Complete label Configuration Options

```javascript
labels: [
  {
    text: (d) => d.value.toFixed(1),  // Label text (using a function to access datum directly is recommended)
    position: 'outside',               // Position

    // ── Style (can be configured directly on label or nested under style) ──
    fill: '#333',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 20,
    dy: -4,                          // Y-direction offset (px)
    dx: 0,                           // X-direction offset

    // ── Selector (show only some labels) ──────────────
    selector: 'last',                  // 'first' | 'last' | (labels) => filteredLabels
    // Filter (show labels only for data that meets the condition)
    filter: (d) => d.value > 50,

    // ── Label transforms (optimize label display) ──────────────
    transform: [{ type: 'overlapDodgeY' }],

    // ── Connector lines (commonly used for pie chart spider/surround positions) ──
    connectorDistance: 5,
    connectorStroke: '#aaa',
    connectorLineWidth: 1,

    // ── Background box ───────────────────────────────
    background: true,
    backgroundFill: '#fff',
    backgroundRadius: 4,
    backgroundPadding: [8, 12],
  },
],
```

## selector

`selector` selects the labels to keep displayed and supports three approaches:

```javascript
labels: [
  {
    text: 'Symbol',
    selector: 'first',              // Approach 1: built-in 'first' / 'last'
    style: { fill: 'blue' },
  },
  {
    text: 'Symbol',
    selector: 'last',               // Last one
    style: { fill: 'red' },
  },
  {
    text: 'Symbol',
    selector: (labels) => {         // Approach 2: custom function whose argument is the full label array
      // labels contains bounds coordinates and other information that can be used for filtering
      return labels.filter(({ bounds }) => {
        const [x, y] = bounds[0];
        return x > 200 && x < 300 && y > 200 && y < 350;
      });
    },
    style: { fill: '#ac1ce6' },
  },
],
```
Supported values for `selector`:
- `'first'` - Keep the first label
- `'last'` - Keep the last label
- `(labels) => filteredLabels` - Custom selector function that receives the full label information array and can filter based on coordinates and other information

## Label Transforms (transform)

When labels are not displayed as expected (for example, overlap, low color contrast, or overflow), use **Label Transform** to optimize their display.

### How to Configure transform

Label transforms support two configuration levels:

**Approach 1: configure a single label in the labels array (recommended)**

```javascript
labels: [
  {
    text: 'value',
    transform: [{ type: 'overlapDodgeY' }],
  },
],
```

**Approach 2: configure globally at the view level with labelTransform**

Declare label transforms with `labelTransform` at the `view` level to apply them to all labels in that view:

```javascript
chart.options({
  type: 'view',
  labelTransform: [{ type: 'overlapHide' }, { type: 'contrastReverse' }],
});
```

### Label Transform Types

| type            | Description                                                |
| --------------- | ---------------------------------------------------------- |
| overlapDodgeY   | Adjust colliding labels in the y direction to prevent overlap             |
| contrastReverse | When label color has low contrast against the mark background, choose the best contrasting color from the specified palette |
| overflowStroke  | When labels overflow their marks, choose the best contrasting color from the specified palette for stroking    |
| overflowHide    | Hide labels when they cannot fit on the mark                      |
| overlapHide     | Hide colliding labels; by default, keep the previous one and hide the next one      |
| exceedAdjust    | Automatically detect and correct label overflow, shifting labels in the opposite direction when they exceed the specified area    |

### overlapDodgeY - Prevent Overlap (y-direction adjustment)

Adjust colliding labels in the y direction; suitable for label-dense scenarios such as line charts.

```javascript
labels: [
  {
    text: 'price',
    transform: [{ type: 'overlapDodgeY' }],
  },
],
```

| Property       | Description                                     | Type     | Default |
| ------------- | ---------------------------------------- | -------- | ------ |
| maxIterations | Maximum number of position-adjustment iterations                   | _number_ | `10`   |
| padding       | Expected spacing between labels after adjustment                 | _number_ | `1`    |
| maxError      | Maximum error (the difference between actual spacing and the expected padding)| _number_ | `0.1`  |

### contrastReverse - Contrast Reversal

When the label color has low contrast against the mark background, automatically choose the color with the best contrast from a specified palette. This is suitable when colors and labels are similar in multicolor bar charts.

```javascript
labels: [
  {
    text: 'genre',
    transform: [{ type: 'contrastReverse' }],
  },
],
```

| Property   | Description                                                   | Type     | Default             |
| --------- | ------------------------------------------------------ | -------- | ------------------ |
| threshold | Color-contrast threshold between label and background; contrast improvement is recommended only after the threshold is exceeded  | _number_ | `4.5`              |
| palette   | Candidate color palette for the contrast-improvement algorithm                          | _string[]_ | `['#000', '#fff']` |

Can also be used together with `overflowStroke`:

```javascript
labels: [
  {
    text: 'frequency',
    transform: [
      { type: 'contrastReverse' },
      { type: 'overflowStroke' },
    ],
  },
],
```

### overflowStroke - Overflow Stroke

Similar to white subtitles on a black background, this selects the color with the best contrast against the label color from a specified palette for stroking, improving readability when labels overflow their marks.

```javascript
labels: [
  {
    text: 'frequency',
    transform: [{ type: 'overflowStroke' }],
  },
],
```

| Property   | Description                         | Type       | Default             |
| --------- | ---------------------------- | ---------- | ------------------ |
| threshold | Overflow threshold; larger values make the stroke less likely to be triggered | _number_   | `2`                |
| palette   | Candidate color palette for the stroke            | _string[]_ | `['#000', '#fff']` |

### overflowHide - Hide Overflow

Hide labels when they cannot fit on the mark. This is suitable for scenarios where every small mark maps to a `label`, causing unclear overlap (such as sunburst charts and treemaps).

> **Difference from overlapDodgeY**: `overflowHide` targets overflow between a label and a mark; `overlapDodgeY` targets overlap among multiple labels.

```javascript
labels: [
  {
    text: 'name',
    transform: [{ type: 'overflowHide' }],
  },
],
```

### overlapHide - Hide Collisions

Hide colliding labels; by default, keep the previous one and hide the next one. Unlike `overlapDodgeY`, `overlapHide` hides labels directly instead of moving them.

```javascript
labels: [
  {
    text: 'price',
    transform: [{ type: 'overlapHide' }],
  },
],
```

### exceedAdjust - Overflow Adjustment

Automatically detect and correct label overflow, shifting labels in the opposite direction when they exceed the specified area.

```javascript
labels: [
  {
    text: 'tooltip',
    transform: [{ type: 'exceedAdjust' }],  // Detects view bounds by default
  },
],
```

```javascript
// With complete configuration
labels: [
  {
    text: 'tooltip',
    transform: [{
      type: 'exceedAdjust',
      bounds: 'main',     // Detect main-area bounds
      offsetX: 15,        // Additional X-axis offset
      offsetY: 10,        // Additional Y-axis offset
    }],
  },
],
```

| Property | Description                                                              | Type               | Default  |
| ------- | ----------------------------------------------------------------- | ------------------ | ------- |
| bounds  | Specifies the region type for boundary detection (supported since `5.3.4`). `'view'` is the entire view area; `'main'` is the main area | `'view' \| 'main'` | `'view'` |
| offsetX | Additional X-axis offset when automatic position adjustment is triggered (rightward from the left boundary, leftward from the right boundary)  | _number_           | `0`     |
| offsetY | Additional Y-axis offset when automatic position adjustment is triggered (downward from the top boundary, upward from the bottom boundary)  | _number_           | `0`     |

## Label Background Box (background)

Labels can configure background-box styles using the `background${style}` format. For example, `backgroundFill` represents the background-box fill color. Set `background: true` to enable it.

```javascript
labels: [
  {
    text: 'value',
    background: true,
    backgroundFill: '#fff',
    backgroundRadius: 4,
    backgroundPadding: [10, 10, 10, 10],
    backgroundOpacity: 0.8,
    backgroundStroke: '#000',
    backgroundLineWidth: 1,
  },
],
```

### Background Box Configuration Options

| Parameter                    | Description               | Type              | Default |
| ----------------------- | ------------------ | ----------------- | ------ |
| backgroundFill          | background-box fill color       | _string_          | -      |
| backgroundFillOpacity   | background-box fill opacity   | _number_          | -      |
| backgroundStroke        | background-box stroke         | _string_          | -      |
| backgroundStrokeOpacity | background-box stroke opacity   | _number_          | -      |
| backgroundLineWidth     | background-box stroke width     | _number_          | -      |
| backgroundLineDash      | background-box stroke dash configuration | _[number,number]_ | -      |
| backgroundOpacity       | overall background-box opacity   | _number_          | -      |
| backgroundShadowColor   | background-box shadow color     | _string_          | -      |
| backgroundShadowBlur    | background-box shadow blur coefficient | _number_          | -      |
| backgroundShadowOffsetX | background-box horizontal shadow offset | _number_          | -      |
| backgroundShadowOffsetY | background-box vertical shadow offset | _number_          | -      |
| backgroundCursor        | mouse cursor style           | _string_          | `default` |
| backgroundRadius        | background-box corner radius     | _number_          | -      |
| backgroundPadding       | background-box padding       | _number[]_        | -      |

## Recommended Label Transform Combinations

Best transform combinations for different scenarios to avoid label visibility issues:

### Bar Chart inside Labels (multicolor bars)

When labels in a multicolor bar chart are placed inside bars, use `contrastReverse` to automatically adapt to the background color, together with `overflowHide` to hide labels that do not fit:

```javascript
labels: [
  {
    text: 'value',
    position: 'inside',
    transform: [{ type: 'contrastReverse' }, { type: 'overflowHide' }],
  },
]
```

### End Labels for Line Charts (dense series)

End labels in multi-series line charts can easily overlap. Use `overlapDodgeY` to avoid collisions automatically in the Y direction and `exceedAdjust` to prevent boundary overflow:

```javascript
labels: [
  {
    text: 'type',
    selector: 'last',
    position: 'right',
    transform: [{ type: 'overlapDodgeY' }, { type: 'exceedAdjust' }],
  },
]
```

### Outside Pie Chart Labels

Labels at the `spider` or `outside` positions in pie charts may overlap. Use `overlapHide` to hide colliding labels:

```javascript
labels: [
  {
    text: (d) => `${d.name}: ${d.value}%`,
    position: 'spider',
    transform: [{ type: 'overlapHide' }],
  },
]
```

### Stacked Charts / TreeMaps / Sunburst Charts

For marks with limited space, use `overflowHide` to hide labels that do not fit and `contrastReverse` to ensure readability:

```javascript
labels: [
  {
    text: 'name',
    position: 'inside',
    transform: [{ type: 'contrastReverse' }, { type: 'overflowHide' }],
  },
]
```

### General Safe Combination (suitable for most scenarios)

When you are unsure which transform to use, the following combination covers the most common label issues:

```javascript
labels: [
  {
    text: 'field',
    transform: [{ type: 'overlapHide' }, { type: 'exceedAdjust' }],
  },
]
```

## Custom HTML Labels with innerHTML / render

Besides `text` field mapping, you can use `innerHTML` or `render` to render custom HTML content.

```javascript
labels: [
  {
    // Custom innerHTML, returning a string or HTMLElement
    innerHTML: ({ genre, sold }) =>
      `<div style="padding:0 4px;border-radius:10px;background:#f5f5f5;border:2px solid #5ea9e6;font-size:11px;">${genre}:${sold}</div>`,
    dx: 10,
    dy: 50,
    style: { fill: 'rgba(0,0,0,0)', color: '#333' },
  },
],
```

> **Note**: When `innerHTML` and `text` are configured together, `text` becomes ineffective. `render` uses the same data type as `innerHTML`, with slightly different arguments:
> ```ts
> type RenderFunc = (text: string, datum: object, index: number, { channel: Record<string, Channel> }) => String | HTMLElement;
> ```

## Complete Connector Line Styles (connector)

In non-Cartesian coordinate systems such as pie and donut charts, connector-line elements are displayed when using `position: 'spider'` or `'surround'`. Connector styles use the `connector${style}` format.

```javascript
labels: [
  {
    text: 'id',
    position: 'spider',
    connectorDistance: 5,           // Spacing between text and connector line
    connectorStroke: '#0649f2',     // connector line color
    connectorLineWidth: 1,          // connector line width
    connectorLineDash: [3, 4],      // dash configuration
    connectorOpacity: 0.8,          // opacity
  },
],
```

| Parameter                   | Description                    | Type              | Default    |
| ---------------------- | ----------------------- | ----------------- | --------- |
| connectorStroke        | connector line color              | _string_          | -         |
| connectorStrokeOpacity | connector line opacity            | _number_          | -         |
| connectorLineWidth     | connector line stroke width          | _number_          | -         |
| connectorLineDash      | connector line dash configuration          | _[number,number]_ | -         |
| connectorOpacity       | overall connector line opacity        | _number_          | -         |
| connectorShadowColor   | connector line shadow color          | _string_          | -         |
| connectorShadowBlur    | connector line shadow blur coefficient      | _number_          | -         |
| connectorShadowOffsetX | connector line horizontal shadow offset      | _number_          | -         |
| connectorShadowOffsetY | connector line vertical shadow offset      | _number_          | -         |
| connectorCursor        | mouse cursor style                | _string_          | `default` |
| connectorDistance      | distance between connector line and text        | _number_          | -         |

## Line End Labels

```javascript
// Show the series name only at the last point of each line
chart.options({
  type: 'line',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  labels: [
    {
      text: 'type',         // Show the series name
      selector: 'last',     // Show only at the last data point
      position: 'right',
      style: { fontSize: 11 },
    },
  ],
});
```

## Center Labels in Stacked Bars

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  labels: [
    {
      text: (d) => d.value >= 30 ? d.value : '',  // Do not show when the value is too small
      position: 'inside',
      style: { fill: 'white', fontSize: 11 },
    },
  ],
});
```

## Common Errors and Fixes

### Error: Writing label (singular) in Spec mode
```javascript
// ❌ Error: the chain API is .label(), but Spec mode uses labels (plural and an array)
chart.options({ label: { text: 'value' } });

// ✅ Correct: use the labels array in Spec
chart.options({ labels: [{ text: 'value' }] });
```

### Error: Passing a Numeric Constant to text
```javascript
// ❌ Error: text is numeric 0, so all labels show '0'
chart.options({ labels: [{ text: 0 }] });

// ✅ Correct: text should be a field-name string or a function
chart.options({ labels: [{ text: 'value' }] });
chart.options({ labels: [{ text: (d) => d.value.toFixed(1) }] });
```

### Error: Treating the First formatter Argument as datum
```javascript
// ❌ Error: the first formatter argument is the mapped text value, not datum
labels: [{
  text: 'yield_rate',
  formatter: (d) => `${d.yield_rate}%`,  // d is a number, so d.yield_rate is undefined
}]

// ✅ Option 1: use a text function to access datum directly (recommended)
labels: [{
  text: (d) => `${d.yield_rate}%`,
}]

// ✅ Option 2: correct formatter usage (argument is the resolved text)
labels: [{
  text: 'yield_rate',
  formatter: (val) => `${val}%`,  // val is the value of yield_rate
}]
```
