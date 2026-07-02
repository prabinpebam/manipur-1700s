---
id: "g2-mark-interval-basic"
title: "G2 Basic Bar Chart (Interval Mark)"
description: |
  Create a basic bar chart with the Interval Mark. The Interval Mark is the core mark type in G2
  for drawing column charts, bar charts, and histograms.
  This article uses Spec mode (chart.options({})) and maps the x/y/color channels through encode.

library: "g2"
version: "5.x"
category: "marks"
subcategory: "interval"
tags:
  - "column chart"
  - "bar chart"
  - "categorical data"
  - "comparison"
  - "Interval"
  - "bar"
  - "spec"
  - "options"

related:
  - "g2-mark-interval-grouped"
  - "g2-mark-interval-stacked"
  - "g2-mark-interval-normalized"
  - "g2-core-chart-init"
  - "g2-core-encode-channel"
  - "g2-scale-band"

use_cases:
  - "Compare values across categories"
  - "Show metrics such as completion amounts or sales for each item"
  - "Display ranking data"
  - "Compare metric values across multiple dimensions"

anti_patterns:
  - "Not suitable for showing trends in continuous numeric values; use Line or Area Mark instead"
  - "Readability is poor when there are more than 20 categories; consider pagination or filtering"
  - "Not suitable for showing part-to-whole relationships; use a stacked bar chart or pie chart instead"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/bar/basic"
---

## Core concepts

Interval Mark maps data to rectangular intervals:
- In Cartesian coordinates: columns (vertical) or bars (horizontal)
- In polar coordinates: sectors (pie charts) or rose charts
- In radial coordinates: radial bar charts

**Key encode channels:**
- `x`: categorical axis, usually mapped to a categorical field, automatically using Band Scale
- `y`: numeric axis, mapped to a numeric field, using Linear Scale
- `y1`: interval endpoint, used to represent interval ranges such as Gantt charts
- `color`: color for visual differentiation

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
});

chart.options({
  type: 'interval',
  data: [
    { genre: 'Sports',   sold: 275 },
    { genre: 'Strategy', sold: 115 },
    { genre: 'Action',   sold: 120 },
    { genre: 'Shooter',  sold: 350 },
    { genre: 'Other',    sold: 150 },
  ],
  encode: {
    x: 'genre',
    y: 'sold',
    color: 'genre',
  },
});

chart.render();
```

## Common variants

### Horizontal bar chart (transposed coordinate system)

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'genre', y: 'sold', color: 'genre' },
  coordinate: { transform: [{ type: 'transpose' }] },   // Key: transpose the coordinate system
});
```

### Bar chart with data labels

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'genre', y: 'sold' },
  labels: [
    {
      text: 'sold',            // Which field value to display
      position: 'outside',     // 'inside' | 'outside' | 'top-left' | 'top-right'
      style: { fontSize: 12, fill: '#333' },
    },
  ],
});
```

### Rounded bar chart

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'genre', y: 'sold' },
  style: {
    radius: 4,               // Uniform corner radius
    // Or set corners individually:
    // radiusTopLeft: 4,
    // radiusTopRight: 4,
  },
});
```

### Custom colors

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'genre', y: 'sold', color: 'genre' },
  scale: {
    color: {
      range: ['#1890ff', '#2fc25b', '#facc14', '#223273', '#8543e0'],
    },
  },
});
```

### With tooltip configuration

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'genre', y: 'sold' },
  tooltip: {
    title: 'genre',
    items: [{ field: 'sold', name: 'Sales' }],
  },
});
```

### Start the Y axis from a specified value

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'genre', y: 'sold' },
  scale: {
    y: { domain: [50, 400] },  // Manually set the y-axis range
  },
});
```

### Custom axis titles

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'genre', y: 'sold' },
  axis: {
    x: { title: 'Game genre' },
    y: { title: 'Sales (10,000 copies)' },
  },
});
```

### Radial bar chart

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'genre', y: 'sold' },
  coordinate: { type: 'radial', innerRadius: 0.2 },  // Radial coordinate system
});
```

### Bar chart with interactions

```javascript
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'genre', y: 'sold' },
  interaction: {
    elementHighlight: true,  // Element highlight interaction
  },
});
```

## Complete Spec structure quick reference

```javascript
chart.options({
  // Mark type
  type: 'interval',

  // Data
  data: [...],

  // Channel mapping
  encode: {
    x: 'genre',           // x-axis field
    y: 'sold',            // y-axis field
    y1: 'endValue',       // Interval endpoint field, such as in Gantt charts
    color: 'genre',       // Color field
    shape: 'rect',        // Shape: 'rect' | 'hollow'
  },

  // Scales
  scale: {
    y: { domain: [0, 500] },
    color: { range: ['#f00', '#00f'] },
  },

  // Coordinate transforms
  coordinate: { 
    type: 'radial', 
    innerRadius: 0.2,
    transform: [{ type: 'transpose' }] 
  },

  // Style
  style: {
    radius: 4,
    fillOpacity: 0.9,
  },

  // Data labels (note the plural labels)
  labels: [
    {
      text: 'sold',
      position: 'outside', // 'inside' | 'outside' | 'top-left' | 'top-right'
    }
  ],

  // Tooltip
  tooltip: { title: 'genre', items: [{ field: 'sold' }] },

  // Axes
  axis: {
    x: { title: 'Game genre' },
    y: { title: 'Sales' },
  },

  // Legend
  legend: {
    color: { position: 'right' }
  },

  // Interaction
  interaction: {
    elementHighlight: true
  }
});
```

## Complete type reference

```typescript
// Spec type passed to chart.options() (interval section)
interface IntervalSpec {
  type: 'interval';
  data?: DataOption;
  encode?: {
    x?: string | ((d: any) => any);
    y?: string | ((d: any) => any);
    y1?: string | ((d: any) => any); // Interval endpoint channel
    color?: string | ((d: any) => any);
    shape?: 'rect' | 'hollow' | 'funnel' | 'pyramid' | string;
    size?: string | number | ((d: any) => any);
    series?: string;
  };
  transform?: Array<{ type: string; [key: string]: any }>;
  scale?: {
    x?: ScaleOption;
    y?: ScaleOption;
    color?: ScaleOption;
  };
  coordinate?: { 
    type?: 'polar' | 'cartesian' | 'radial';
    innerRadius?: number;
    outerRadius?: number;
    startAngle?: number;
    endAngle?: number;
    transform?: Array<{ type: string; [key: string]: any }>;
  };
  style?: {
    radius?: number;
    radiusTopLeft?: number;
    radiusTopRight?: number;
    radiusBottomLeft?: number;
    radiusBottomRight?: number;
    fill?: string;
    fillOpacity?: number;
    stroke?: string;
    lineWidth?: number;
  };
  labels?: LabelOption[];
  tooltip?: TooltipOption;
  axis?: { x?: AxisOption; y?: AxisOption };
  legend?: { color?: LegendOption };
  interaction?: { 
    elementHighlight?: boolean | { background?: boolean; region?: boolean }; 
  };
}
```

## Common errors and fixes

### Error 1: Using the V4 chain API (see the Forbidden Patterns in the core constraints for details)
```javascript
// chart.interval().encode('x', 'genre');
// chart.options({ type: 'interval', data, encode: { x: 'genre', y: 'sold' } });
```

### Error 2: Missing the container parameter
```javascript
// Error
const chart = new Chart({ width: 640, height: 480 });

// Correct
const chart = new Chart({ container: 'container', width: 640, height: 480 });
```

### Error 3: Confusing encode and style
```javascript
// Error: style does not accept data field names.
chart.options({ type: 'interval',  [...], style: { color: 'genre' } });

// Correct: use encode for data mapping and style for fixed styling.
chart.options({
  type: 'interval',
  data: [...],
  encode: { color: 'genre' },   // Data-driven
  style: { fill: '#1890ff' },   // Use style only for fixed colors
});
```

### Error 4: Writing labels as label (singular)
```javascript
// Error: in Spec mode, the label field is labels (plural).
chart.options({ type: 'interval',  data: [...], label: { text: 'sold' } });

// Correct
chart.options({ type: 'interval', data: [...], labels: [{ text: 'sold' }] });
```

### Error 5: Handling negative values on the y axis
```javascript
// Potential issue: bars for negative values may exceed the plotting area.
chart.options({ type: 'interval',  dataWithNegatives, encode: { y: 'value' } });

// Correct: explicitly include the negative value range through scale.y.domain.
chart.options({
  type: 'interval',
  data: dataWithNegatives,
  encode: { x: 'genre', y: 'value' },
  scale: { y: { domain: [-100, 300] } },
});
```

### Error 6: Incorrect use of the radial coordinate system
```javascript
// Error: x/y mappings are reversed in the radial coordinate system.
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'value', y: 'genre' },  // Should be x: genre, y: value
  coordinate: { type: 'radial' }
});

// Correct: in radial coordinates, x corresponds to the angular direction and y to the radial direction.
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'genre', y: 'value' },
  coordinate: { type: 'radial' }
});
```

### Error 7: Multiple marks require view+children (see core constraint #3 for details)
```javascript
// Multiple chart.options() calls mean only the last one takes effect.
// Use chart.options({ type: 'view', children: [{ type: 'interval', ... }, { type: 'image', ... }] });
```

### Error 8: Incorrect encoding fields for the image mark
```javascript
// Error: the image mark uses x/y to map the image URL.
chart.options({
  type: 'image',
  data: [{ url: 'https://example.com/image.png' }],
  encode: { x: () => 0, y: () => 0, src: 'url' }  // Do not use x/y to position the image this way.
});

// Correct: the image mark uses the src field to map the image URL, with style controlling size and position.
chart.options({
  type: 'image',
  data: [{ url: 'https://example.com/image.png' }],
  encode: { src: 'url' },
  style: {
    x: '50%',   // Position relative to the container
    y: '50%',
    width: 80,
    height: 80
  }
});
```

### Error 9: Interaction configuration is in the wrong place
```javascript
// Error: the interaction configuration is placed outside the mark-level interaction object.
chart.options({
  type: 'interval',
  data: [...],
  encode: {...},
  elementHighlight: true  // Wrong location
});

// Correct: interaction configuration should be placed in the interaction object.
chart.options({
  type: 'interval',
  data: [...],
  encode: {...},
  interaction: {
    elementHighlight: true
  }
});
```

### Error 10: Interval charts do not use the y1 channel correctly
```javascript
// Error: the interval start and end are both mapped to the y channel.
chart.options({
  type: 'interval',
  data: [{ start: 1, end: 5 }],
  encode: { x: 'name', y: ['start', 'end'] }  // Incorrect approach
});

// Correct: map the start and end to the y and y1 channels respectively.
chart.options({
  type: 'interval',
  data: [{ start: 1, end: 5 }],
  encode: { x: 'name', y: 'start', y1: 'end' }
});
```

### Error 11: Incorrect axis label formatting configuration
```javascript
// Error: axis.labelFormatter does not exist in this form.
chart.options({
  type: 'interval',
  data: [...],
  axis: {
    x: {
      labelFormatter: (task, item) => {
        const datum = item.data;
        return `${datum.stage}\n${task}`;
      }
    }
  }
});

// Correct: use the proper label configuration.
chart.options({
  type: 'interval',
  data: [...],
  axis: {
    x: {
      labelTransform: 'rotate(30)',
      labelAutoWrap: true
    }
  }
});
```