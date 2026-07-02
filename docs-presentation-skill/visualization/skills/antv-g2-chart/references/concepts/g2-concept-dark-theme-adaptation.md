---
id: "g2-concept-dark-theme-adaptation"
title: "G2 Dark Theme and Background Adaptation"
description: |
  Explains how to keep chart components visible in G2 v5 on dark or custom backgrounds,
  including axes, legends, tooltips, and labels. Covers built-in theme switching,
  manual style overrides, viewStyle configuration, and related approaches.

library: "g2"
version: "5.x"
category: "concepts"
tags:
  - "dark theme"
  - "background color"
  - "text contrast"
  - "visibility"
  - "classicDark"
  - "tooltip styles"
  - "axis colors"
  - "legend colors"

related:
  - "g2-comp-axis-config"
  - "g2-comp-legend-config"
  - "g2-comp-tooltip-config"
  - "g2-comp-label-config"
  - "g2-theme-builtin"
  - "g2-theme-custom"

use_cases:
  - "Chart text is not visible on a dark background"
  - "Tooltip text is too close to the background color"
  - "Axis and legend labels are hard to read in a dark container"
  - "Text colors must adapt to a custom background color"

difficulty: "intermediate"
completeness: "full"
created: "2025-06-04"
updated: "2025-06-04"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/theme/overview"
---

## Core Principles

The G2 theme system controls text colors for all components through **color tokens**:

| Token | Light Theme | Dark/classicDark Theme |
|-------|-----------|----------------------|
| `colorBlack` (primary text color) | `#1D2129` | `#fff` |
| `colorWhite` (inverse color) | `#fff` | `#000` |
| `colorStroke` (stroke and auxiliary color) | `#416180` | `#416180` |

After switching to a dark theme, **axis labels, legend text, titles, and labels** automatically use `colorBlack`, which resolves to `#fff`; you do not need to set each component manually.

## Built-in Theme List

| Theme Name | Description | Applicable Scenario |
|---------|------|---------|
| `'light'` | Default light theme | Light backgrounds |
| `'dark'` | Dark theme | Dark backgrounds |
| `'classic'` | Classic theme | Color-design variant based on `light` |
| `'classicDark'` | Classic dark theme | Color-design variant based on `dark`; recommended for dark scenarios |
| `'academy'` | Academic theme | Papers and reports |

## Approach 1: Use a Dark Theme (Recommended)

This is the simplest dark-background adaptation: one configuration line fixes text colors across components.

```javascript
// String shorthand.
chart.options({
  type: 'interval',
  theme: 'classicDark',
  data,
  encode: { x: 'genre', y: 'sold', color: 'genre' },
});

// Object form, which can also configure the background color.
chart.options({
  type: 'interval',
  theme: {
    type: 'classicDark',
    view: { viewFill: '#1a1a1a' },  // Custom view background color.
  },
  data,
  encode: { x: 'genre', y: 'sold', color: 'genre' },
});
```

A dark theme automatically handles:
- Axis labels: `labelFill: '#fff'`, `labelOpacity: 0.45`
- Axis titles: `titleFill: '#fff'`, `titleOpacity: 0.9`
- Legend text: `itemLabelFill: '#fff'`, `itemLabelFillOpacity: 0.9`
- Grid lines: `gridStroke: '#fff'`, `gridStrokeOpacity: 0.25`
- Tooltip: dark background `#1f1f1f` plus light text `#A6A6A6`

## Approach 2: Manually Set Component Text Colors

Use this when you do not want to switch the whole theme, or when only part of the chart needs dark-background adaptation.

### Axes

```javascript
axis: {
  x: {
    labelFill: 'rgba(255,255,255,0.65)',
    titleFill: 'rgba(255,255,255,0.9)',
    gridStroke: '#404040',
    gridLineWidth: 0.5,
  },
  y: {
    labelFill: 'rgba(255,255,255,0.65)',
    titleFill: 'rgba(255,255,255,0.9)',
    gridStroke: '#404040',
    gridLineWidth: 0.5,
  },
}
```

### Legend

```javascript
legend: {
  color: {
    itemLabelFill: 'rgba(255,255,255,0.85)',
    titleFill: 'rgba(255,255,255,0.65)',
  },
}
```

### Tooltip

Tooltip styles are configured through the `css` property of the tooltip interaction:

```javascript
interaction: {
  tooltip: {
    css: {
      '.g2-tooltip': {
        background: '#1f1f1f',
        color: '#fff',
        opacity: '0.95',
      },
      '.g2-tooltip-title': {
        color: '#a6a6a6',
      },
      '.g2-tooltip-list-item-name-label': {
        color: '#a6a6a6',
      },
      '.g2-tooltip-list-item-value': {
        color: '#fff',
      },
    },
  },
}
```

**Complete list of available tooltip CSS selectors**:

| Selector | Purpose |
|--------|------|
| `.g2-tooltip` | Main container: background color, border radius, and shadow |
| `.g2-tooltip-title` | Title text |
| `.g2-tooltip-list` | Data-list container |
| `.g2-tooltip-list-item` | Single data row |
| `.g2-tooltip-list-item-name-label` | Data-item name |
| `.g2-tooltip-list-item-value` | Data-item value |
| `.g2-tooltip-list-item-marker` | Color marker |

### Label

```javascript
labels: [
  {
    text: 'value',
    fill: 'rgba(255,255,255,0.85)',
  },
]
```

## viewStyle Configuration Options

Use `viewStyle` to control the background color of chart regions:

```javascript
chart.options({
  theme: { type: 'classicDark' },
  viewStyle: {
    viewFill: '#1f1f1f',    // Entire view area, including title and legend regions.
    plotFill: '#2a2a2a',    // Plot area where data is drawn.
    mainFill: 'transparent', // Main area.
    contentFill: 'transparent', // Content area.
    plotStroke: '#404040',  // Plot border.
    plotLineWidth: 1,
  },
});
```

You can also configure this through `theme.view`:

```javascript
theme: {
  type: 'classicDark',
  view: {
    viewFill: '#111827',
    plotFill: '#1a1a1a',
  },
}
```

## Complete Dark Theme Example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', height: 400 });

chart.options({
  type: 'view',
  theme: {
    type: 'classicDark',
    view: { viewFill: '#0f0f0f', plotFill: '#1a1a1a' },
  },
  data: [
    { month: 'Jan', value: 120, type: 'Product A' },
    { month: 'Feb', value: 180, type: 'Product A' },
    { month: 'Jan', value: 90, type: 'Product B' },
    { month: 'Feb', value: 150, type: 'Product B' },
  ],
  children: [
    {
      type: 'interval',
      encode: { x: 'month', y: 'value', color: 'type' },
      transform: [{ type: 'dodgeX' }],
      labels: [
        {
          text: 'value',
          position: 'top',
          fill: 'rgba(255,255,255,0.85)',
          transform: [{ type: 'overlapHide' }],
        },
      ],
    },
  ],
  axis: {
    x: { grid: true, gridStroke: '#404040' },
    y: { grid: true, gridStroke: '#404040' },
  },
  legend: {
    color: {
      position: 'top',
      layout: { justifyContent: 'center' },
    },
  },
});

chart.render();
```

## Common Errors and Fixes

### Error 1: Dark container with the default light theme

```javascript
// ❌ Error: the container has a dark background but the default light theme is used.
// Axis labels are dark #1D2129 and become invisible on a dark background.
chart.options({
  type: 'interval',
  data,
  encode: { x: 'x', y: 'y' },
  viewStyle: { viewFill: '#1a1a1a' },
});

// ✅ Correct: use a dark theme.
chart.options({
  type: 'interval',
  data,
  encode: { x: 'x', y: 'y' },
  theme: { type: 'classicDark', view: { viewFill: '#1a1a1a' } },
});
```

### Error 2: Setting text to light gray on a light background

```javascript
// ❌ Error: white background plus light-gray text is difficult to read.
axis: { y: { labelFill: '#ccc' } }

// ✅ Correct: keep text dark on a light background.
axis: { y: { labelFill: '#666' } }
```

### Error 3: Pie chart colors include a color identical to the background

```javascript
// ❌ Error: white background plus a white value in range makes one slice invisible.
scale: { color: { range: ['#1890ff', '#ffffff', '#52c41a'] } }

// ✅ Correct: every color is clearly distinguishable from the background.
scale: { color: { range: ['#1890ff', '#fadb14', '#52c41a'] } }
```
