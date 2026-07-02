---
id: "g2-theme-builtin"
title: "G2 Built-in Theme Configuration"
description: |
  G2 v5 includes three built-in themes: classic, classicDark, and academy.
  You can switch themes globally through the theme field or the theme parameter in the Chart constructor, and you can also override style variables locally.

library: "g2"
version: "5.x"
category: "themes"
tags:
  - "theme"
  - "theme"
  - "dark"
  - "dark theme"
  - "classicDark"
  - "spec"

related:
  - "g2-core-chart-init"
  - "g2-mark-interval-basic"

use_cases:
  - "Switch the overall color style of a chart"
  - "Adapt to dark mode"
  - "Unify the visual style of multiple charts"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/theme"
---

## Built-in theme list

| Theme name | Description |
|--------|------|
| `'classic'` | Default theme (blue palette with a white background) |
| `'classicDark'` | Dark theme (dark background with bright colors) |
| `'academy'` | Academic-style theme (gray tones, suitable for papers and reports) |

## Basic usage (switching themes)

```javascript
import { Chart } from '@antv/g2';

// Method 1: Specify it in the constructor.
const chart = new Chart({
  container: 'container',
  width: 640,
  height: 480,
  theme: 'classicDark',    // Dark theme
});

chart.options({
  type: 'interval',
  data: [
    { genre: 'Sports',   sold: 275 },
    { genre: 'Strategy', sold: 115 },
    { genre: 'Action',   sold: 120 },
  ],
  encode: { x: 'genre', y: 'sold', color: 'genre' },
});

chart.render();
```

```javascript
// Method 2: Specify it in options.
const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data,
  encode: { x: 'genre', y: 'sold', color: 'genre' },
  theme: 'academy',        // Academic theme
});

chart.render();
```

## Dark theme example

```javascript
const chart = new Chart({
  container: 'container',
  width: 700,
  height: 400,
  theme: 'classicDark',
});

chart.options({
  type: 'view',
  data,
  encode: { x: 'month', y: 'value' },
  children: [
    {
      type: 'area',
      style: { fillOpacity: 0.3 },
    },
    {
      type: 'line',
      style: { lineWidth: 2 },
    },
  ],
});

chart.render();
```

## Switch themes at runtime

```javascript
const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({ type: 'interval', data, encode: { x: 'x', y: 'y' } });
chart.render();

// Switch to the dark theme (requires re-rendering).
chart.theme('classicDark');
chart.render();
```

## Override theme variables locally

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'genre', y: 'sold' },
  theme: {
    defaultColor: '#ff6b35',         // Default color (color of the first series)
    defaultStrokeColor: '#333',      // Default border color
    // Override the palette.
    colors10: [
      '#ff6b35', '#f7c59f', '#efefd0', '#004e89', '#1a936f',
      '#88d498', '#c6dabf', '#eaf4d3', '#7b2d8b', '#ff3a5c',
    ],
  },
});
```

## Custom theme registration

```javascript
import { Chart, register } from '@antv/g2';

// Register a custom theme.
register('theme.myTheme', {
  defaultColor: '#e63946',
  background: '#f8f9fa',
  colors10: ['#e63946', '#457b9d', '#1d3557', '#a8dadc', '#f1faee'],
  // ... Other variables
});

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data,
  encode: { x: 'genre', y: 'sold', color: 'genre' },
  theme: 'myTheme',   // Use the custom theme.
});

chart.render();
```

## Common errors and fixes

### Error: theme receives a non-string/non-object value
```javascript
// Error: The theme value does not exist.
chart.options({ theme: 'dark' });   // 'dark' is not a built-in theme name.

// Correct: Use a built-in theme name.
chart.options({ theme: 'classicDark' });   // Dark theme
chart.options({ theme: 'classic' });       // Default theme
chart.options({ theme: 'academy' });       // Academic theme
```

### Error: Forgot to re-render after switching themes
```javascript
// Error: The chart was not re-rendered after switching themes.
chart.theme('classicDark');
// The chart does not change!

// Correct: Call render() after switching.
chart.theme('classicDark');
chart.render();
```
