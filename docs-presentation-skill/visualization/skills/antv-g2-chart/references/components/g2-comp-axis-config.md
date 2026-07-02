---
id: "g2-comp-axis-config"
title: "G2 Axis Configuration (axis)"
description: |
  A detailed explanation of the axis field configuration in G2 v5 Spec mode, covering axis titles,
  ticks, label formatting, grid lines, axis line styles, and independent configuration for the x and y axes.

library: "g2"
version: "5.x"
category: "components"
tags:
  - "axis"
  - "axis"
  - "axis title"
  - "tick"
  - "label formatting"
  - "grid line"
  - "spec"

related:
  - "g2-core-chart-init"
  - "g2-scale-linear"
  - "g2-scale-time"
  - "g2-scale-band"

use_cases:
  - "Customize axis titles"
  - "Format axis tick labels, such as percentages, currency, and dates"
  - "Control tick count and grid lines"
  - "Hide axes"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/component/axis"
---

## Basic usage

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'revenue' },
  axis: {
    x: { title: 'Month' },
    y: { title: 'Revenue (10k CNY)' },
  },
});

chart.render();
```

---

## Incrementally modifying configuration

If you already have a chart and only want to modify a specific configuration item, such as the label color, use one of the following approaches:

```javascript
// Approach 1: call options again and pass only the configuration to modify
chart.options({
  axis: {
    y: {
      labelFill: 'red',  // Modify only the label color
    },
  },
});
chart.render();  // Re-rendering is required

// Approach 2: modify the complete configuration after defining it
const options = {
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  axis: { x: { title: 'Date' } },
};
chart.options(options);

// Subsequent modification
options.axis = { y: { labelFill: 'red' } };
chart.options(options);
chart.render();
```

---

## Complete configuration reference

### General configuration

| Property | Description | Type | Default |
|------|------|------|--------|
| `position` | Axis position | `'left' \| 'right' \| 'top' \| 'bottom'` | x: `'bottom'`, y: `'left'` |
| `animate` | Whether to enable animation | `boolean` | - |

### Axis title style (title)

| Property | Description | Type | Default |
|------|------|------|--------|
| `title` | Title content | `string \| false` | - |
| `titleSpacing` | Distance from the title to the axis | `number` | `10` |
| `titlePosition` | Position of the title relative to the axis | `'top' \| 'bottom' \| 'left' \| 'right'` | `'lb'` |
| `titleFontSize` | **Title text size** | `number` | - |
| `titleFontWeight` | Title text font weight | `number \| string` | - |
| `titleFontFamily` | Title text font family | `string` | - |
| `titleLineHeight` | Title text line height | `number` | `1` |
| `titleTextAlign` | Horizontal alignment of the title text | `string` | `'start'` |
| `titleTextBaseline` | Vertical baseline of the title text | `string` | `'middle'` |
| `titleFill` | **Title text fill color** | `string` | - |
| `titleFillOpacity` | Title text fill opacity | `number` | `1` |
| `titleStroke` | Title text stroke color | `string` | `transparent` |
| `titleStrokeOpacity` | Title text stroke opacity | `number` | `1` |
| `titleLineWidth` | Title text stroke width | `number` | `0` |
| `titleLineDash` | Title text stroke dash configuration | `number[]` | `[]` |
| `titleOpacity` | Overall title text opacity | `number` | `1` |
| `titleShadowColor` | Title text shadow color | `string` | `transparent` |
| `titleShadowBlur` | Title text shadow blur coefficient | `number` | `0` |
| `titleShadowOffsetX` | Horizontal offset of the title text shadow | `number` | `0` |
| `titleShadowOffsetY` | Vertical offset of the title text shadow | `number` | `0` |
| `titleCursor` | Mouse cursor style for the title text | `string` | `default` |
| `titleDx` | Horizontal offset of the title text | `number` | `0` |
| `titleDy` | Vertical offset of the title text | `number` | `0` |

### Axis line style (line)

| Property | Description | Type | Default |
|------|------|------|--------|
| `line` | Whether to show the axis line | `boolean` | `false` |
| `arrow` | Whether to show an arrow | `boolean` | `true` |
| `lineExtension` | Extension lines on both ends of the axis line | `[number, number]` | - |
| `lineArrow` | Axis line arrow shape | `DisplayObject` | - |
| `lineArrowOffset` | Arrow offset length | `number` | `15` |
| `lineArrowSize` | Arrow size | `number` | - |
| `lineStroke` | **Axis line stroke color** | `string` | - |
| `lineStrokeOpacity` | Axis line stroke opacity | `number` | - |
| `lineLineWidth` | **Axis line stroke width** | `number` | - |
| `lineLineDash` | Axis line stroke dash configuration | `[number, number]` | - |
| `lineOpacity` | Overall axis line opacity | `number` | `1` |
| `lineShadowColor` | Axis line shadow color | `string` | - |
| `lineShadowBlur` | Axis line shadow blur coefficient | `number` | - |
| `lineShadowOffsetX` | Horizontal offset of the axis line shadow | `number` | - |
| `lineShadowOffsetY` | Vertical offset of the axis line shadow | `number` | - |
| `lineCursor` | Mouse cursor style for the axis line | `string` | `default` |

### Tick line style (tick)

| Property | Description | Type | Default |
|------|------|------|--------|
| `tick` | Whether to show ticks | `boolean` | `true` |
| `tickCount` | Recommended number of ticks to generate | `number` | - |
| `tickMethod` | Custom tick generation method | `(start, end, count) => number[]` | - |
| `tickFilter` | Tick line filter | `(datum, index, data) => boolean` | - |
| `tickFormatter` | Tick line formatter | `(datum, index, data, Vector) => DisplayObject` | - |
| `tickDirection` | Tick direction | `'positive' \| 'negative'` | `'positive'` |
| `tickLength` | **Tick line length** | `number` | `15` |
| `tickStroke` | **Tick line stroke color** | `string` | - |
| `tickStrokeOpacity` | Tick line stroke opacity | `number` | - |
| `tickLineWidth` | Tick line stroke width | `number` | - |
| `tickLineDash` | Tick line stroke dash configuration | `[number, number]` | - |
| `tickOpacity` | Overall tick line opacity | `number` | - |
| `tickShadowColor` | Tick line shadow color | `string` | - |
| `tickShadowBlur` | Tick line shadow blur coefficient | `number` | - |
| `tickShadowOffsetX` | Horizontal offset of the tick line shadow | `number` | - |
| `tickShadowOffsetY` | Vertical offset of the tick line shadow | `number` | - |
| `tickCursor` | Mouse cursor style for the tick line | `string` | `default` |

### Tick label style (label)

| Property | Description | Type | Default |
|------|------|------|--------|
| `labelFormatter` | **Label formatting** | `string \| (datum, index, data) => string` | - |
| `labelFilter` | Label filter | `(datum, index, data) => boolean` | - |
| `labelAutoRotate` | Automatically rotate labels when they are too long | `boolean` | - |
| `labelAutoHide` | Automatically hide labels when they are too dense | `boolean` | - |
| `labelSpacing` | Spacing between labels and tick lines | `number` | - |
| `labelFontSize` | **Label text size** | `number` | - |
| `labelFontWeight` | Label text font weight | `number \| string` | - |
| `labelFontFamily` | Label text font family | `string` | - |
| `labelLineHeight` | Label text line height | `number` | - |
| `labelTextAlign` | Horizontal alignment of label text | `string` | - |
| `labelTextBaseline` | Vertical baseline of label text | `string` | - |
| `labelFill` | **Label text fill color** | `string` | - |
| `labelFillOpacity` | Label text fill opacity | `number` | - |
| `labelStroke` | Label text stroke color | `string` | - |
| `labelStrokeOpacity` | Label text stroke opacity | `number` | - |
| `labelLineWidth` | Label text stroke width | `number` | - |
| `labelLineDash` | Label text stroke dash configuration | `number[]` | - |
| `labelOpacity` | Overall label text opacity | `number` | - |
| `labelShadowColor` | Label text shadow color | `string` | - |
| `labelShadowBlur` | Label text shadow blur coefficient | `number` | - |
| `labelShadowOffsetX` | Horizontal offset of the label text shadow | `number` | - |
| `labelShadowOffsetY` | Vertical offset of the label text shadow | `number` | - |
| `labelCursor` | Mouse cursor style for label text | `string` | `default` |
| `labelDx` | Horizontal offset of label text | `number` | - |
| `labelDy` | Vertical offset of label text | `number` | - |

### Tick label style (label, additional options)

| Property | Description | Type | Default |
|------|------|------|--------|
| `labelRender` | Custom label rendering. Supports HTML strings and uses the same form as `labelFormatter` | `string \| (datum, index, array) => string` | - |
| `labelAlign` | Tick value alignment | `'horizontal' \| 'parallel' \| 'perpendicular'` | `'parallel'` |
| `labelDirection` | Position of tick values relative to the axis line | `'positive' \| 'negative'` | `'positive'` |
| `labelAutoEllipsis` | Automatically ellipsize overly long tick values | `boolean` | - |
| `labelAutoWrap` | Automatically wrap tick values | `boolean` | - |

### Grid line style (grid)

| Property | Description | Type | Default |
|------|------|------|--------|
| `grid` | Whether to show grid lines | `boolean` | - |
| `gridAreaFill` | **Grid area fill color**. Supports alternating color arrays or functions | `string \| string[] \| (datum, index, data) => string` | - |
| `gridFilter` | Grid line filter. Return false to hide the grid line | `(datum, index, data) => boolean` | - |
| `gridLength` | Grid line length | `number` | `0` |
| `gridStroke` | **Grid line stroke color** | `string` | - |
| `gridStrokeOpacity` | Grid line stroke opacity | `number` | - |
| `gridLineWidth` | **Grid line stroke width** | `number` | - |
| `gridLineDash` | **Grid line stroke dash configuration** | `[number, number]` | - |
| `gridOpacity` | Overall grid line opacity | `number` | - |
| `gridShadowColor` | Grid line shadow color | `string` | - |
| `gridShadowBlur` | Grid line shadow blur coefficient | `number` | - |
| `gridShadowOffsetX` | Horizontal offset of the grid line shadow | `number` | - |
| `gridShadowOffsetY` | Vertical offset of the grid line shadow | `number` | - |
| `gridCursor` | Mouse cursor style for grid lines | `string` | `default` |

---

## Common configuration examples

### Complete configuration example

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  axis: {
    x: {
      title: 'Date',
      titleFontSize: 14,
      titleFill: '#666',
      tickCount: 6,
      labelFormatter: 'YYYY-MM',
      labelFontSize: 11,
      labelFill: '#888',
      tick: true,
      tickLength: 5,
      line: true,
      grid: true,
      gridLineDash: [4, 4],
    },
    y: {
      title: 'Revenue (10k CNY)',
      labelFormatter: (v) => `¥${v}`,
    },
  },
});
```

### Quick reference for tick-related configuration responsibilities

Tick control has three configuration items with different responsibilities and they must not be mixed up:

| Configuration item | Signature | Responsibility | Usage frequency |
|--------|------|------|---------|
| `labelFormatter` | `(value, index, array) => string` | Tick **text content** | Most common |
| `tickMethod` | `(start, end, tickCount) => number[]` | Tick **numeric positions** | Used occasionally |
| `tickFormatter` | `(datum, index, array, vector) => DisplayObject` | Tick **line graphics** | Rarely used |

> ❌ Common mistake: using `tickFormatter` as `labelFormatter`. `tickFormatter` returns a graphics object, not a string, and using it incorrectly causes labels not to display.

### Common formatting scenarios

```javascript
// Numeric formatting
axis: { y: { labelFormatter: (v) => `${(v / 1000).toFixed(0)}K` } }

// Percentage formatting
axis: { y: { labelFormatter: (v) => `${(v * 100).toFixed(0)}%` } }

// Currency formatting
axis: { y: { labelFormatter: (v) => `¥${v.toLocaleString()}` } }

// Date formatting, where the x-axis uses the Date type
axis: { x: { labelFormatter: 'MM/DD' } }

// Keep two decimal places, pure d3-format without appending text units
axis: { y: { labelFormatter: '.2f' } }         // ✅ Pure d3-format
// axis: { y: { labelFormatter: '.2f CNY' } } // ❌ Invalid! Do not append text after d3-format
```

### Hide axes

```javascript
// Hide an axis completely
axis: { x: false }

// Hide only the title
axis: { y: { title: false } }

// Hide only grid lines
axis: { y: { grid: false } }
```

### Modify axis text colors

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value' },
  axis: {
    x: {
      labelFill: '#8c8c8c',        // Label text color
      labelFontSize: 12,
      titleFill: '#595959',        // Title text color
      titleFontSize: 13,
      titleFontWeight: 'bold',
    },
    y: {
      labelFill: '#8c8c8c',
      titleFill: '#595959',
    },
  },
});
```

### Alternating grid area fills (gridAreaFill)

```javascript
chart.options({
  type: 'line',
  data,
  encode: { x: 'month', y: 'value' },
  axis: {
    y: {
      grid: true,
      gridAreaFill: ['rgba(0,0,0,0.04)', 'transparent'],  // Alternating fills for better readability
      gridLineWidth: 0,   // Hide the grid lines themselves and show only the area color
    },
  },
});

// You can also control it with a function
axis: {
  y: {
    gridAreaFill: (datum, index) => index % 2 === 0 ? 'rgba(0,0,0,0.04)' : '',
  },
}
```

### Axis breaks (breaks): skip data gaps

```javascript
// When a range in the data is far larger than the other values, use an axis break to compress that range
chart.options({
  type: 'interval',
  data: [
    { x: 'A', y: 100 },
    { x: 'B', y: 200 },
    { x: 'C', y: 95000 },  // Outlier that makes the other bars hard to read
    { x: 'D', y: 150 },
  ],
  encode: { x: 'x', y: 'y' },
  axis: {
    y: {
      breaks: [
        {
          start: 500,     // Axis break start
          end: 90000,     // Axis break end; skip this range
          gap: '3%',      // Proportion of the canvas height occupied by the axis break
        },
      ],
    },
  },
});
```

### Dual y-axes

```javascript
// Use a view container and different y scales to implement dual axes
chart.options({
  type: 'view',
  data,
  children: [
    {
      type: 'interval',
      encode: { x: 'month', y: 'revenue' },
      axis: { y: { title: 'Revenue', position: 'left' } },
    },
    {
      type: 'line',
      encode: { x: 'month', y: 'growth' },
      scale: { y: { key: 'right' } },
      axis: { y: { title: 'Growth rate', position: 'right' } },
    },
  ],
});
```

---

## Common mistakes and fixes

### Mistake 1: Writing axis inside encode or scale

```javascript
// ❌ Incorrect: axis is an independent top-level field
chart.options({
  encode: { x: 'month', y: 'value' },
  scale: { x: { title: 'Month' } },   // title does not belong in scale
});

// ✅ Correct: axis is a sibling field of encode and scale
chart.options({
  encode: { x: 'month', y: 'value' },
  axis: { x: { title: 'Month' } },
});
```

### Mistake 2: Incorrect style property names

```javascript
// ❌ Incorrect property name
axis: { x: { fontSize: 12 } }  // Does not exist

// ✅ Correct property names with prefixes
axis: { x: { labelFontSize: 12 } }  // Label font size
axis: { x: { titleFontSize: 14 } }  // Title font size
```

### Mistake 3: Confusing axis titles with chart titles

```javascript
// ❌ Axis title written in title
 title: { title: 'Month' }  // This is the chart title

// ✅ Axis titles belong in axis
axis: { x: { title: 'Month' } }  // This is the x-axis title
```

### Mistake 4: Using tickFormatter to format label text

```javascript
// ❌ Incorrect: tickFormatter returns a DisplayObject (graphics object), not a string
axis: {
  y: {
    tickFormatter: (v) => `${v / 1000}K`,  // ❌ Returning a string to tickFormatter is invalid
  },
}

// ✅ Correct: use labelFormatter to format label text
axis: {
  y: {
    labelFormatter: (v) => `${v / 1000}K`,  // ✅ labelFormatter returns string
  },
}
```

### Mistake 5: Formatting labels inside scale.tickMethod or receiving a scale object

```javascript
// ❌ Incorrect: tickMethod arguments are not a scale object, and the return value is not an object array
scale: {
  y: {
    tickMethod: (scale) => {              // ❌ The argument is not a scale object
      return scale.ticks().map(v => ({    // ❌ scale.ticks() does not exist
        value: v, text: `${v}K`          // ❌ Cannot return objects; only number[] is allowed
      }));
    },
  },
}

// ✅ Correct: the tickMethod signature is (min, max, count) => number[]
// Use labelFormatter separately to format text
scale: {
  y: {
    tickMethod: (min, max, count) => [100, 500, 1000, 5000, 10000],  // ✅ number[]
  },
},
axis: {
  y: {
    labelFormatter: (v) => `${v / 1000}K`,  // ✅ Text formatting belongs in axis
  },
}
```

### Mistake 6: Concatenating units in a d3-format string for labelFormatter

Like `tooltip.items[].valueFormatter`, `labelFormatter` supports either a function or a d3-format string. **d3-format strings only format numbers and cannot append text units afterward**. Strings such as `'.2f CNY'` and `'.0f m'` are invalid.

```javascript
// ❌ Incorrect: appending text units after a d3-format string
axis: {
  y: { labelFormatter: '.2f CNY' },   // ❌ d3-format does not support text concatenation; labels are abnormal
  x: { labelFormatter: '.0f m' },     // ❌ Same as above
}

// ✅ Correct: use a function when you need to append units
axis: {
  y: { labelFormatter: (v) => `${v.toFixed(2)} CNY` },   // ✅ Function; can append any text
  x: { labelFormatter: (v) => `${Math.round(v)} m` },    // ✅ Function
}

// ✅ Pure numeric formatting without units can use d3-format strings
axis: {
  y: { labelFormatter: '.2f' },    // ✅ Keep two decimal places
  x: { labelFormatter: ',.0f' },   // ✅ Thousands-separated integer
  z: { labelFormatter: '.1%' },    // ✅ Percentage
}
```
