---
id: "g2-comp-title"
title: "G2 Chart Title Configuration"
description: |
  In G2 v5, the top-level title field adds a title and subtitle to a chart.
  It supports customizing title text, font style, alignment, and spacing from the plot area.
  The title field can be configured in the Chart constructor or in options.

library: "g2"
version: "5.x"
category: "components"
tags:
  - "title"
  - "chart title"
  - "subtitle"
  - "title style"

related:
  - "g2-core-chart-init"
  - "g2-comp-axis-config"
  - "g2-comp-legend-config"

use_cases:
  - "Add a main title and subtitle to a chart"
  - "Customize title font, color, and size"
  - "Control title alignment (left, center, right)"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/component/title"
---

## Basic usage

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value' },
  title: {
    title: 'Monthly Sales',        // Main title
    subtitle: 'Unit: 10k CNY',     // Subtitle
  },
});

chart.render();
```

## Complete configuration options

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value' },
  title: {
    // -- Text content ----------------------------
    title: 'Monthly Sales Trend Analysis',        // Main title text
    subtitle: 'Data source: 2024 annual report',  // Subtitle text (optional)

    // -- Alignment -------------------------------
    align: 'left',    // 'left' (default) | 'center' | 'right'

    // -- Spacing ---------------------------------
    spacing: 4,       // Spacing between the main title and subtitle; default is 2

    // -- Main title style ------------------------
    titleFontSize: 16,
    titleFontWeight: 'bold',
    titleFill: '#1d1d1d',
    titleSpacing: 8,     // Spacing between the title and the chart content area

    // -- Subtitle style --------------------------
    subtitleFontSize: 12,
    subtitleFill: '#8c8c8c',
    subtitleFontWeight: 'normal',
  },
});
```

## Centered title

```javascript
chart.options({
  title: {
    title: 'Quarterly Comparison Report',
    subtitle: 'Q1-Q4 quarterly sales data',
    align: 'center',          // Center alignment
    titleFontSize: 18,
    titleFontWeight: 600,
    subtitleFontSize: 13,
    subtitleFill: '#999',
  },
});
```

## Configure in the constructor

```javascript
// title can also be configured in the Chart constructor options
const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
  title: {
    title: 'Sales Trend',
    align: 'center',
  },
});
```

## Common mistakes and fixes

### Mistake: Writing title as a string instead of an object
```javascript
// Incorrect: the title field must be a configuration object and cannot be written directly as a string
chart.options({
  title: 'Monthly Sales',   // Strings are not supported
});

// Correct: the title field is an object, and the main title text is in title.title
chart.options({
  title: {
    title: 'Monthly Sales',   // Correct usage
  },
});
```

### Mistake: Confusing the chart title with axis titles
```javascript
// Incorrect: writing the overall chart title inside axis
chart.options({
  axis: { x: { title: 'Monthly Sales' } },  // This is the X-axis title, not the chart title
});

// Correct: use the top-level title field for the chart title
chart.options({
  title: { title: 'Monthly Sales' },     // Chart title
  axis: { x: { title: 'Month' } },       // X-axis title
});
```
