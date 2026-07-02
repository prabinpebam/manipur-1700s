---
id: "g2-scale-sequential"
title: "G2 Sequential Scale (sequential)"
description: |
  The sequential scale maps continuous numeric values to color gradients.
  It is designed specifically for color channels and is commonly used with palette (built-in color schemes) or custom color interpolation functions.
  It is suitable for heatmaps, map coloring, and continuous numeric color encoding.
  Difference from linear: sequential is optimized for color output, while linear supports arbitrary numeric output.
  Constraint: use it only when the field mapped by encode.color is continuous, that is, numeric.
  Do not use sequential for categorical fields (strings/enums) or discrete fields (ordinal/band).
  Otherwise, it produces incorrect color gradients; use an ordinal scale instead.

library: "g2"
version: "5.x"
category: "scales"
tags:
  - "sequential"
  - "sequential scale"
  - "color gradient"
  - "continuous color"
  - "palette"
  - "scale"

related:
  - "g2-scale-linear"
  - "g2-scale-quantile-quantize"
  - "g2-scale-threshold"
  - "g2-mark-cell-heatmap"

use_cases:
  - "Heatmap color gradients from low values to high values"
  - "Map coloring by numeric value (choropleth)"
  - "Scatter plot bubble colors that vary by numeric value"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/scale/sequential"
---

## Usage constraints

**sequential applies only when the `encode.color` field is continuous, that is, numeric.**

| Field type | Example | Can use sequential? |
|--------|------|------------------|
| Continuous numeric (quantitative) | `temp_max`, `sales`, `score` | Yes |
| Categorical (categorical / ordinal) | `city`, `category`, `name` | No; use `ordinal` |
| Discrete (band / point) | Discrete coordinate-axis fields | No; use `ordinal` |

Using sequential with categorical or discrete fields maps all data to the two ends of the gradient, producing very poor color differentiation.

## Minimal runnable example (heatmap)

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'cell',
  data: {
    type: 'fetch',
    value: 'https://assets.antv.antgroup.com/g2/seattle-weather.json',
  },
  encode: {
    x: (d) => new Date(d.date).getUTCDate(),
    y: (d) => new Date(d.date).getUTCMonth(),
    color: 'temp_max',
  },
  transform: [{ type: 'group', color: 'max' }],
  scale: {
    color: {
      type: 'sequential',
      palette: 'gnBu',   // Built-in palette: from light blue to dark blue.
    },
  },
  style: { inset: 0.5 },
});

chart.render();
```

## Complete list of valid palettes

G2 looks up `palette` values through d3-scale-chromatic. **Only the following names are valid** (case-insensitive). Names outside this list, such as `'blueOrange'`, `'redGreen'`, and `'heatmap'`, cause the runtime error `Unknown palette`.

### Single-hue sequential gradients (suitable for sequential and positive-valued data)

| Palette name | Effect |
|------------|------|
| `'blues'` | White to blue |
| `'greens'` | White to green |
| `'reds'` | White to red |
| `'oranges'` | White to orange |
| `'purples'` | White to purple |
| `'greys'` | White to gray |
| `'orRd'` | Orange to red |
| `'buGn'` | Blue to green |
| `'buPu'` | Blue to purple |
| `'gnBu'` | Green to blue |
| `'puBu'` | Purple to blue |
| `'puBuGn'` | Purple to blue to green |
| `'puRd'` | Purple to red |
| `'rdPu'` | Red to purple |
| `'ylGn'` | Yellow to green |
| `'ylGnBu'` | Yellow to green to blue (sequential default) |
| `'ylOrBr'` | Yellow to orange to brown |
| `'ylOrRd'` | Yellow to orange to red |

### Perceptually uniform multi-color gradients (recommended for sequential and color-blind accessibility)

| Palette name | Effect |
|------------|------|
| `'viridis'` | Purple to blue to green to yellow (perceptually uniform and color-blind friendly) |
| `'plasma'` | Blue-purple to orange-yellow |
| `'magma'` | Black to purple to orange to white |
| `'inferno'` | Black to purple to red to yellow |
| `'cividis'` | Blue to yellow (friendly for all types of color blindness) |
| `'turbo'` | Blue to green to yellow to red (improved rainbow) |
| `'rainbow'` | Rainbow (not recommended; perceptually uneven) |
| `'sinebow'` | Smooth rainbow |
| `'warm'` | Warm colors (orange to red to purple) |
| `'cool'` | Cool colors (cyan to blue to purple) |
| `'cubehelixDefault'` | Spiral gradient (black to white) |

### Diverging color scales (suitable for diverging and positive/negative value comparison)

| Palette name | Effect |
|------------|------|
| `'rdBu'` | Red to white to blue (most common) |
| `'rdYlBu'` | Red to yellow to blue |
| `'rdYlGn'` | Red to yellow to green (gain/loss heatmap) |
| `'rdGy'` | Red to white to gray |
| `'pRGn'` | Purple to white to green |
| `'piYG'` | Pink to white to yellow-green |
| `'puOr'` | Purple to white to orange |
| `'brBG'` | Brown to white to blue-green |
| `'spectral'` | Red to orange to yellow to green to blue (multi-color diverging) |

```javascript
// Valid examples.
scale: { color: { type: 'sequential', palette: 'blues' } }
scale: { color: { type: 'sequential', palette: 'viridis' } }
scale: { color: { type: 'sequential', palette: 'ylOrRd' } }
scale: { color: { type: 'diverging',  palette: 'rdBu' } }
scale: { color: { type: 'diverging',  palette: 'rdYlGn' } }

// Invalid examples. These palettes do not exist and will report an Unknown palette error.
scale: { color: { type: 'sequential', palette: 'blueOrange' } }  // Does not exist.
scale: { color: { type: 'sequential', palette: 'redGreen' } }    // Does not exist.
scale: { color: { type: 'sequential', palette: 'heatmap' } }     // Does not exist.
scale: { color: { type: 'sequential', palette: 'rainbow2' } }    // Does not exist.
scale: { color: { type: 'sequential', palette: 'blue-orange' } } // Does not exist.
```

## Custom color range

```javascript
// Use range to specify start and end colors, interpolating between the two ends.
chart.options({
  scale: {
    color: {
      type: 'sequential',
      range: ['#ebedf0', '#196127'],  // From light gray to dark green, in the style of GitHub contribution charts.
    },
  },
});

// Use domain to control the mapping range.
chart.options({
  scale: {
    color: {
      type: 'sequential',
      palette: 'blues',
      domain: [0, 100],   // Explicitly specify the numeric range.
    },
  },
});
```

## sequential vs other color scales

```javascript
// sequential: continuous color gradient (continuous numeric values to continuous colors).
scale: { color: { type: 'sequential', palette: 'blues' } }

// quantile: automatic quantile grouping (continuous numeric values to discrete colors, equal-frequency groups).
scale: { color: { type: 'quantile', range: ['#eee', '#aaa', '#666', '#000'] } }

// quantize: equal-width segments (continuous numeric values to discrete colors, equal-interval groups).
scale: { color: { type: 'quantize', domain: [0, 100], range: ['#fee', '#f99', '#f00'] } }

// threshold: manual breakpoint classification (continuous numeric values to discrete colors, custom breakpoints).
scale: { color: { type: 'threshold', domain: [25, 75], range: ['#0f0', '#ff0', '#f00'] } }
```

## Common mistakes and fixes

### Mistake: using a palette name that does not exist

G2 palette values come from d3-scale-chromatic. A nonexistent name throws `Error: Unknown palette: XxxXxx` at runtime and prevents the chart from rendering.

```javascript
// These names look reasonable, but they do not exist in G2.
scale: { color: { type: 'sequential', palette: 'blueOrange' } }   // Error: Unknown palette.
scale: { color: { type: 'sequential', palette: 'blueGreen' } }    // Use 'buGn' or 'gnBu'.
scale: { color: { type: 'sequential', palette: 'redBlue' } }      // Use 'rdBu' (diverging).
scale: { color: { type: 'diverging',  palette: 'greenRed' } }     // Use 'rdYlGn' (note the order).
scale: { color: { type: 'sequential', palette: 'hot' } }          // Does not exist; use 'ylOrRd' instead.
scale: { color: { type: 'sequential', palette: 'jet' } }          // Does not exist; use 'turbo' instead.
scale: { color: { type: 'sequential', palette: 'coolwarm' } }     // Use 'rdBu' (diverging).

// When unsure, choose from these reliable names.
// Single-hue sequential: 'blues' | 'greens' | 'reds' | 'oranges' | 'purples' | 'ylOrRd' | 'ylGnBu'
// Perceptually uniform: 'viridis' | 'plasma' | 'magma' | 'inferno' | 'cividis' | 'turbo'
// Diverging: 'rdBu' | 'rdYlGn' | 'rdYlBu' | 'pRGn' | 'brBG' | 'spectral'
```

### Mistake: using sequential for categorical data
```javascript
// sequential is only suitable for continuous numeric values; categorical data should use ordinal.
chart.options({
  encode: { color: 'city' },   // city is a categorical field.
  scale: { color: { type: 'sequential' } },  // Produces an odd gradient.
});

// Use ordinal for categorical data.
chart.options({
  encode: { color: 'city' },
  scale: { color: { type: 'ordinal', range: ['#5B8FF9', '#61DDAA', '#FFD666'] } },
});
```

### Mistake: missing transform causes abnormal data aggregation

When using a `cell` chart, if the raw data contains multiple records with the same `(x, y)` coordinates, you must use `transform` to aggregate them. Otherwise, color mapping may be inaccurate, and chart rendering can even fail.

```javascript
// temp_max values at identical coordinates are not aggregated.
chart.options({
  type: 'cell',
  data: weatherData,
  encode: {
    x: (d) => new Date(d.date).getUTCDate(),
    y: (d) => new Date(d.date).getUTCMonth(),
    color: 'temp_max',
  },
  scale: { color: { type: 'sequential', palette: 'gnBu' } },
});

// Use a group transform to aggregate data at identical coordinates.
chart.options({
  type: 'cell',
  data: weatherData,
  encode: {
    x: (d) => new Date(d.date).getUTCDate(),
    y: (d) => new Date(d.date).getUTCMonth(),
    color: 'temp_max',
  },
  transform: [{ type: 'group', color: 'max' }],  // Take the maximum temp_max value for each cell.
  scale: { color: { type: 'sequential', palette: 'gnBu' } },
});
```
