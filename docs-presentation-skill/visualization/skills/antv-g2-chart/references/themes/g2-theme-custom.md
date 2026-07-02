---
id: "g2-theme-custom"
title: "G2 Custom Theme Creation (register + create)"
description: |
  G2 v5 supports registering custom themes with register('theme.xxx', themeConfig).
  Custom themes can override color palettes, fonts, and the default styles of each Mark.
  You can also pass an object through the theme field to locally override specific properties of the current theme.
  Built-in themes include classic, classicDark, and academy (see g2-theme-builtin for details).

library: "g2"
version: "5.x"
category: "themes"
tags:
  - "theme"
  - "custom theme"
  - "register"
  - "theme registration"
  - "colors10"
  - "colors20"
  - "color scheme"

related:
  - "g2-theme-builtin"
  - "g2-core-chart-init"

use_cases:
  - "Customize chart themes for corporate branding"
  - "Unify the color style across multiple charts"
  - "Locally override a few default styles"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/theme"
---

## Method 1: Override a theme locally (theme object)

The simplest approach is to pass an object directly through the theme field in options to override selected properties:

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data,
  encode: { x: 'genre', y: 'sold', color: 'genre' },
  theme: {
    // Override the categorical palette.
    colors10: [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
      '#8B5CF6', '#F97316', '#06B6D4', '#84CC16',
      '#EC4899', '#6B7280',
    ],
    // Override the default color.
    defaultColor: '#3B82F6',
  },
});

chart.render();
```

## Method 2: Register a global custom theme

```javascript
import { Chart, register } from '@antv/g2';

// Register a custom theme (extended from the classic theme).
register('theme.brand', {
  // Base colors
  defaultColor: '#e63946',
  defaultStrokeColor: '#1d1d1d',

  // Categorical palettes (10 colors / 20 colors)
  colors10: [
    '#e63946', '#457b9d', '#1d3557', '#a8dadc',
    '#f1faee', '#e9c46a', '#f4a261', '#e76f51',
    '#264653', '#2a9d8f',
  ],
  colors20: [
    '#e63946', '#457b9d', '#1d3557', '#a8dadc',
    '#f1faee', '#e9c46a', '#f4a261', '#e76f51',
    '#264653', '#2a9d8f',
    // Last 10 colors (gradients or variants)
    '#ff6b6b', '#74b9ff', '#55efc4', '#ffeaa7',
    '#dfe6e9', '#fab1a0', '#fd79a8', '#6c5ce7',
    '#00b894', '#00cec9',
  ],
});

// Use the custom theme.
const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',
  data,
  encode: { x: 'genre', y: 'sold', color: 'genre' },
  theme: 'brand',   // Use the registered custom theme name.
});

chart.render();
```

## Theme configuration quick reference

```javascript
// The following are the main configurable properties.
const themeConfig = {
  // -- Base colors ---------------------------------
  defaultColor: '#1890ff',        // Default color (when there is a single series)
  defaultStrokeColor: '#ffffff',  // Default stroke color

  // -- Palettes ------------------------------------
  colors10: [...],   // 10-color categorical palette
  colors20: [...],   // 20-color categorical palette

  // -- Background ----------------------------------
  background: '#ffffff',    // Chart background color

  // -- Font ----------------------------------------
  fontFamily: 'sans-serif',  // Global font

  // -- Default animation durations -----------------
  enter: { duration: 300 },
  update: { duration: 300 },
  exit: { duration: 300 },
};
```

## Dark theme (local override based on classicDark)

```javascript
// Modify based on classicDark.
const chart = new Chart({
  container: 'container',
  theme: 'classicDark',
});

chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value', color: 'type' },
  // Local override: modify the color palette but keep the dark background.
  theme: {
    colors10: ['#60a5fa', '#34d399', '#f87171', '#a78bfa',
               '#fbbf24', '#22d3ee', '#f472b6', '#4ade80',
               '#fb923c', '#e879f9'],
  },
});
```

## Common errors and fixes

### Error: Forgot the 'theme.' prefix in the register theme name
```javascript
// Error: Registration must use the 'theme.xxx' format.
register('brandTheme', { colors10: [...] });    // Error
chart.options({ theme: 'brandTheme' });          // Does not take effect

// Correct: The 'theme.' prefix is required.
register('theme.brandTheme', { colors10: [...] });  // Correct
chart.options({ theme: 'brandTheme' });              // Correct: omit the prefix when using it.
```

### Error: Mixing theme and style
```javascript
// Error: Theme colors are confused with styles for an individual mark.
chart.options({
  type: 'interval',
  style: { colors10: [...] },  // Error: colors10 is not part of style.
});

// Correct: Color themes belong in the theme field.
chart.options({
  type: 'interval',
  theme: { colors10: [...] },  // Correct
  style: { fillOpacity: 0.8 }, // Correct: styles for an individual mark belong in style.
});
```
