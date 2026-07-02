---
id: "g2-comp-legend-config"
title: "G2 Legend Configuration (legend)"
description: |
  Detailed explanation of the legend field configuration in G2 v5 Spec mode,
  covering legend position, layout, title, color legends, filtering interactions, hiding legends, and more.

library: "g2"
version: "5.x"
category: "components"
tags:
  - "legend"
  - "legend"
  - "position"
  - "filtering"
  - "color legend"
  - "spec"

related:
  - "g2-core-chart-init"
  - "g2-interaction-legend-filter"
  - "g2-comp-axis-config"
  - "g2-comp-legend-category"
  - "g2-comp-legend-continuous"

use_cases:
  - "adjust legend position and layout"
  - "customize legend title and style"
  - "hide unnecessary legends"
  - "configure continuous color legends (ribbons)"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/component/legend"
---

## Basic Usage

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  legend: {
    color: {               // Legend corresponding to the encode.color channel
      position: 'bottom',  // 'top' (default) | 'bottom' | 'left' | 'right'
    },
  },
});

chart.render();
```

---

## Incrementally Modifying Configuration

If a chart already exists and you only want to modify a specific option (such as legend position), use one of the following approaches:

```javascript
// Approach 1: call options again and pass only the configuration to modify
chart.options({
  legend: {
    color: {
      position: 'right',  // Modify only the position
    },
  },
});
chart.render();  // Requires re-rendering

// Approach 2: modify after applying the complete configuration
const options = {
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value', color: 'type' },
  legend: { color: { position: 'top' } },
};
chart.options(options);

// Subsequent modification
options.legend = { color: { position: 'bottom' } };
chart.options(options);
chart.render();
```

---

## Complete Configuration Reference

### Common Configuration (Category Legends & Continuous Legends)

| Property | Description | Type | Default |
|------|------|------|--------|
| `position` | Legend position | `'top' \| 'right' \| 'left' \| 'bottom'` | `'top'` |
| `orientation` | Legend orientation | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `layout` | Flex layout configuration | `{ justifyContent, alignItems, flexDirection }` | - |
| `size` | Legend container size | `number` | - |
| `length` | Legend container length | `number` | - |
| `crossPadding` | Distance from the legend to the chart area | `number` | `12` |
| `order` | Layout order | `number` | `1` |
| `title` | Legend title | `string \| string[]` | - |

### Category Legend Configuration

| Property | Description | Type | Default |
|------|------|------|--------|
| `cols` | Number of legend items displayed per row | `number` | - |
| `colPadding` | Horizontal spacing between legend items | `number` | `12` |
| `rowPadding` | Vertical spacing between legend items | `number` | `8` |
| `maxRows` | Maximum number of legend rows | `number` | `3` |
| `maxCols` | Maximum number of legend columns | `number` | `3` |
| `itemWidth` | Legend item width | `number` | - |
| `itemSpan` | Space allocation for a legend item icon, label, and value | `number \| number[]` | `[1, 1, 1]` |
| `itemSpacing` | Internal spacing of legend items | `number \| number[]` | `[8, 8, 4]` |
| `focus` | Whether to enable legend focus | `boolean` | `false` |
| `focusMarkerSize` | Legend focus icon size | `number` | `12` |
| `defaultSelect` | Default selected legend items | `string[]` | - |

### Legend Item Icon Styles (itemMarker)

| Property | Description | Type | Default |
|------|------|------|--------|
| `itemMarker` | Legend item icon | `string \| (datum, index, data) => string` | - |
| `itemMarkerSize` | Icon size | `number` | `8` |
| `itemMarkerFill` | **Icon fill color** | `string` | - |
| `itemMarkerFillOpacity` | Icon fill opacity | `number` | - |
| `itemMarkerStroke` | Icon stroke | `string` | - |
| `itemMarkerStrokeOpacity` | Icon stroke opacity | `number` | - |
| `itemMarkerLineWidth` | Icon stroke width | `number` | - |
| `itemMarkerRadius` | Icon corner radius | `number` | - |

### Legend Item Label Styles (itemLabel)

| Property | Description | Type | Default |
|------|------|------|--------|
| `itemLabelFill` | **Label text fill color** | `string` | `#333` |
| `itemLabelFillOpacity` | Label text fill opacity | `number` | - |
| `itemLabelFontSize` | Label text size | `number` | `12` |
| `itemLabelFontFamily` | Label text font | `string` | - |
| `itemLabelFontWeight` | Label font weight | `number \| string` | - |
| `itemLabelTextAlign` | Label horizontal alignment | `string` | - |
| `itemLabelTextBaseline` | Label vertical baseline | `string` | - |
| `itemLabelStroke` | Label text stroke | `string` | - |
| `itemLabelLineWidth` | Label text stroke width | `number` | - |
| `itemLabelDx` | Label horizontal offset | `number` | - |
| `itemLabelDy` | Label vertical offset | `number` | - |

### Legend Item Value Styles (itemValue)

An additional "value" column can be displayed on the right side of legend items (through `formatter` or a data field), which is useful for quantities, percentages, and other auxiliary information.

| Property | Description | Type | Default |
|------|------|------|--------|
| `itemValueFill` | Value text fill color | `string` | `#1D2129` |
| `itemValueFillOpacity` | Value text fill opacity | `number` | `0.65` |
| `itemValueFontSize` | Value text size | `number` | `12` |
| `itemValueFontFamily` | Value text font | `string` | - |
| `itemValueFontWeight` | Value text font weight | `number \| string` | - |
| `itemValueStroke` | Value text stroke | `string` | - |
| `itemValueLineWidth` | Value text stroke width | `number` | - |

### Legend Item Background Styles (itemBackground)

| Property | Description | Type | Default |
|------|------|------|--------|
| `itemBackgroundFill` | Legend item background fill color | `string` | - |
| `itemBackgroundFillOpacity` | Legend item background fill opacity | `number` | - |
| `itemBackgroundStroke` | Legend item background stroke | `string` | - |
| `itemBackgroundStrokeOpacity` | Legend item background stroke opacity | `number` | - |
| `itemBackgroundLineWidth` | Legend item background stroke width | `number` | - |
| `itemBackgroundRadius` | Legend item background corner radius | `number` | - |

### Legend Title Styles (title)

| Property | Description | Type | Default |
|------|------|------|--------|
| `titleFill` | **Title fill color** | `string` | `#666` |
| `titleFillOpacity` | Title fill opacity | `number` | - |
| `titleFontSize` | Title font size | `number` | `12` |
| `titleFontFamily` | Title font | `string` | - |
| `titleFontWeight` | Title font weight | `number \| string` | - |
| `titleStroke` | Title stroke | `string` | - |
| `titleLineWidth` | Title stroke width | `number` | - |
| `titleSpacing` | Spacing between title and legend items | `number` | - |

### Continuous Legend Configuration

| Property | Description | Type | Default |
|------|------|------|--------|
| `color` | Ribbon colors | `string[]` | - |
| `block` | Whether to display by interval | `boolean` | `false` |
| `type` | Continuous legend type | `'size' \| 'color'` | `'color'` |

---

## Common Configuration Examples

### Hiding Legends

```javascript
// Hide the legend for a specific channel
legend: { color: false }

// Hide all legends (not commonly used)
legend: false
```

### Changing Legend Position and Layout

```javascript
chart.options({
  legend: {
    color: {
      position: 'bottom',
      layout: {
        justifyContent: 'center',  // Horizontally centered
        alignItems: 'center',      // Vertically centered
      },
    },
  },
});
```

### Changing Legend Item Icon Color

```javascript
chart.options({
  legend: {
    color: {
      itemMarkerFill: 'red',       // Icon fill color
      itemMarkerSize: 10,          // Icon size
      itemMarkerStroke: 'darkred', // Icon stroke
    },
  },
});
```

### Changing Legend Label Color

```javascript
chart.options({
  legend: {
    color: {
      itemLabelFill: '#333',
      itemLabelFontSize: 14,
      itemLabelFontWeight: 'bold',
    },
  },
});
```

### Changing Legend Title Style

```javascript
chart.options({
  legend: {
    color: {
      title: 'Product Type',
      titleFill: '#1D2129',
      titleFontSize: 14,
      titleFontWeight: 'bold',
      titleSpacing: 12,
    },
  },
});
```

### Placing a Pie Chart Legend at the Bottom Center

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'theta', outerRadius: 0.8 },
  legend: {
    color: {
      position: 'bottom',
      layout: { justifyContent: 'center' },
    },
  },
});
```

### Continuous Color Legend (Ribbon)

When the `color` channel maps continuous numeric values, the legend automatically becomes a ribbon.

```javascript
chart.options({
  type: 'cell',
  data,
  encode: { x: 'x', y: 'y', color: 'value' },  // value is a continuous numeric value
  scale: { color: { palette: 'Blues' } },
  legend: {
    color: {
      position: 'right',
      length: 200,
      labelFormatter: (v) => Number(v).toFixed(0),  // Note: v may be a string, so convert it to a number first
    },
  },
});
```

> **More continuous legend configuration**: [Detailed continuous legend documentation](g2-comp-legend-continuous.md) covers advanced usage such as threshold legends, size-channel legends, and custom ribbons.

---

## Common Errors and Fixes

### Error 1: Writing legend as an Array

```javascript
// ❌ Error: legend is an object, not an array
chart.options({ legend: [{ color: { position: 'bottom' } }] });

// ✅ Correct
chart.options({ legend: { color: { position: 'bottom' } } });
```

### Error 2: legend.color Does Not Match encode.color

```javascript
// ❌ Error: encode has no color channel, so configuring legend.color has no effect
chart.options({
  encode: { x: 'month', y: 'value' },  // No color
  legend: { color: { position: 'bottom' } },
});

// ✅ Correct: legend.color is effective only when encode.color is mapped
chart.options({
  encode: { x: 'month', y: 'value', color: 'type' },
  legend: { color: { position: 'bottom' } },
});
```

### Error 3: Incorrect Style Property Name

```javascript
// ❌ Incorrect property name
legend: { color: { markerFill: 'red' } }  // Does not exist

// ✅ Correct property name (with prefix)
legend: { color: { itemMarkerFill: 'red' } }  // Correct
```

### Error 4: Confusing Legend Titles with Chart Titles

```javascript
// ❌ Legend title written under axis
axis: { x: { title: 'Product Type' } }  // This is the X-axis title

// ✅ Legend title belongs under legend
legend: { color: { title: 'Product Type' } }  // This is the legend title
```

---

## Layout Conflicts Between Legends and Labels

### Outside Pie Chart Labels + Top Legend Overlap

When a pie chart uses labels with `position: 'outside'` or `'spider'`, labels are distributed around the pie chart on all sides. If the legend uses the default `position: 'top'`, the top labels and the legend will overlap.

```javascript
// ❌ Error: spider labels + default top legend -> space conflict at the top
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'theta' },
  labels: [{ text: 'type', position: 'spider' }],
  // legend defaults to 'top', overlapping the top spider labels
});

// ✅ Option 1: move legend to bottom (recommended)
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'theta' },
  labels: [{ text: 'type', position: 'spider' }],
  legend: {
    color: {
      position: 'bottom',
      layout: { justifyContent: 'center' },
    },
  },
});

// ✅ Option 2: increase paddingTop to reserve space
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'type' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'theta' },
  labels: [{ text: 'type', position: 'spider' }],
  paddingTop: 60,
});
```

**Scope**: all non-Cartesian charts that use labels with `position: 'outside'` / `'spider'` / `'surround'` (pie charts, donut charts, and rose charts).