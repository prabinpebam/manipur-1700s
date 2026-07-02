---
id: "g2-concept-color-theory"
title: "G2 Color Theory"
description: |
  Three color usage patterns in data visualization: categorical palettes for distinguishing categories,
  sequential color scales for numeric magnitude, and diverging color scales for positive and negative deviation.
  Covers G2 scale.color configuration methods and common color misuse.

library: "g2"
version: "5.x"
category: "concepts"
tags:
  - "color design"
  - "color"
  - "palette"
  - "sequential color scale"
  - "diverging color scale"
  - "categorical palette"
  - "scale.color"

related:
  - "g2-concept-visual-channels"
  - "g2-core-encode-channel"
  - "g2-theme-builtin"

use_cases:
  - "Choose the correct color mode for different data types"
  - "Configure G2 scale.color for accurate color mapping"
  - "Avoid color choices that mislead readers"

difficulty: "intermediate"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
---

## Three Color Usage Patterns

### 1. Categorical Palette

**Purpose**: Distinguish categories in qualitative data. Colors have **no magnitude relationship**.

```javascript
// Scenario: multi-series line chart, using color to distinguish product lines.
chart.options({
  type: 'line',
  data,
  encode: { x: 'month', y: 'sales', color: 'product' },
  // The default color scale is categorical, so no configuration is required.
  // Customize it when needed:
  scale: {
    color: {
      type: 'ordinal',
      range: ['#1890ff', '#52c41a', '#fa8c16', '#f5222d', '#722ed1'],
    },
  },
});
```

**Rules**:
- Use at most **8 colors**; more colors become difficult to distinguish.
- Keep colors at similar brightness so one category does not dominate visually.
- Consider color-blind accessibility; avoid relying only on red and green.

### 2. Sequential Color Scale

**Purpose**: Represent values from low to high, typically from light to dark or through one continuous hue family.

```javascript
// Scenario: color intensity in a heatmap, map, or bubble chart.
chart.options({
  type: 'cell',
  data,
  encode: { x: 'weekday', y: 'hour', color: 'count' },
  scale: {
    color: {
      type: 'sequential',     // Sequential scale.
      palette: 'blues',        // Single hue: white to blue.
      // Common built-in scales: 'blues' | 'greens' | 'oranges' | 'reds' | 'purples'.
      // Multi-hue scales: 'YlOrRd' | 'YlGnBu' | 'BuPu' | 'GnBu'.
    },
  },
});
```

**Rules**:
- Map larger values to darker or more visually intense colors.
- Use a **single-hue** light-to-dark ramp or a perceptually ordered multi-hue gradient.
- Do not use categorical palettes for numeric values; red and green do not imply magnitude.

### 3. Diverging Color Scale

**Purpose**: Represent positive and negative deviation around zero or another baseline.

```javascript
// Scenario: profit/loss heatmap, year-over-year increase/decrease, or difference comparison.
chart.options({
  type: 'cell',
  data,
  encode: { x: 'product', y: 'region', color: 'growth' },
  scale: {
    color: {
      type: 'diverging',      // Diverging scale.
      palette: 'RdBu',        // Red for negative, white for zero, blue for positive.
      // Common options: 'RdBu' | 'RdYlGn' | 'BrBG' | 'PuOr'.
      domain: [-100, 0, 100], // Symmetric range with 0 at the center.
    },
  },
});
```

**Rules**:
- Map the neutral value, such as zero or the average, to **white or light gray**.
- Keep the perceived intensity of both extremes balanced.
- Define a symmetric domain, such as `[-50, 0, 50]`.

## Color Channel and Scale Configuration

```javascript
// Complete G2 color configuration.
scale: {
  color: {
    // Scale type.
    type: 'ordinal',     // Category scale.
    // type: 'sequential', // Continuous ordered scale.
    // type: 'diverging',  // Diverging scale.
    // type: 'threshold',  // Segmented threshold scale.

    // Color range for a categorical palette.
    range: ['#1890ff', '#52c41a', '#fa8c16'],   // Custom color list.

    // Built-in palette name.
    palette: 'tableau10',   // 'tableau10' | 'category10' | 'blues', etc.

    // Domain: category display order.
    domain: ['Product A', 'Product B', 'Product C'],

    // Color for unknown values.
    unknown: '#f0f0f0',
  },
}
```

## Complete Reference for Built-in Palettes

**Important: use only the names listed below.** G2 looks up `palette` values through d3-scale-chromatic. Names not in this list, such as `'blueOrange'`, `'redGreen'`, `'heatmap'`, `'hot'`, or `'jet'`, throw `Unknown palette` at runtime and prevent the chart from rendering. Palette names are case-insensitive; for example, `'blues'` and `'Blues'` both work.

### Categorical Palettes for Ordinal Scales

| Palette Name | Number of Colors | Style |
|-------|--------|------|
| `'tableau10'` | 10 | Classic Tableau-style colors; soft and used by default |
| `'category10'` | 10 | Classic D3 categorical colors |
| `'set2'` | 8 | Soft pastel style |
| `'paired'` | 12 | Paired light and dark colors |
| `'dark2'` | 8 | Dark colors with strong contrast |
| `'set1'` | 9 | High saturation |
| `'set3'` | 12 | Medium saturation |
| `'pastel1'` | 9 | Pastel colors |
| `'pastel2'` | 8 | Pastel colors |
| `'accent'` | 8 | Accent colors |

### Sequential Color Scales for Positive Numeric Values

| Palette Name | Effect |
|-------|------|
| `'blues'` | White to blue |
| `'greens'` | White to green |
| `'reds'` | White to red |
| `'oranges'` | White to orange |
| `'purples'` | White to purple |
| `'greys'` | White to gray |
| `'ylOrRd'` | Yellow to orange to red; common for heatmaps |
| `'ylGnBu'` | Yellow to green to blue; common sequential default |
| `'ylOrBr'` | Yellow to orange to brown |
| `'buGn'` | Blue to green |
| `'buPu'` | Blue to purple |
| `'gnBu'` | Green to blue |
| `'orRd'` | Orange to red |
| `'puBu'` | Purple to blue |
| `'puBuGn'` | Purple to blue to green |
| `'puRd'` | Purple to red |
| `'rdPu'` | Red to purple |
| `'ylGn'` | Yellow to green |
| `'viridis'` | Purple to blue to green to yellow; perceptually uniform, color-blind friendly, and recommended |
| `'plasma'` | Blue-purple to orange-yellow |
| `'magma'` | Black to purple to orange to white |
| `'inferno'` | Black to purple to red to yellow |
| `'cividis'` | Blue to yellow; friendly for all common color-vision deficiencies |
| `'turbo'` | Blue to green to yellow to red; improved rainbow scale |
| `'warm'` | Orange to red to purple; warm colors |
| `'cool'` | Cyan to blue to purple; cool colors |
| `'rainbow'` | Rainbow scale; perceptually uneven and not recommended |
| `'sinebow'` | Smooth rainbow scale |
| `'cubehelixDefault'` | Cubehelix gradient |

### Diverging Color Scales for Positive/Negative Comparisons

| Palette Name | Effect |
|-------|------|
| `'rdBu'` | Red to white to blue; the most common choice for increases/decreases or positive/negative values |
| `'rdYlBu'` | Red to yellow to blue |
| `'rdYlGn'` | Red to yellow to green; useful for year-over-year increase/decrease |
| `'rdGy'` | Red to white to gray |
| `'pRGn'` | Purple to white to green |
| `'piYG'` | Pink to white to yellow-green |
| `'puOr'` | Purple to white to orange |
| `'brBG'` | Brown to white to blue-green |
| `'spectral'` | Red to orange to yellow to green to blue; multi-hue diverging scale |

## Color-Blind-Friendly Palettes

About 8% of men have red-green color-vision deficiency, so avoid using only red and green to distinguish data:

```javascript
// ❌ Not accessible: red and green may be indistinguishable for color-blind users.
scale: { color: { range: ['#ff4d4f', '#52c41a'] } }

// ✅ Accessible: blue and orange are easier to distinguish.
scale: { color: { range: ['#1890ff', '#fa8c16'] } }

// ✅ You can also encode with both color and shape.
chart.options({
  type: 'point',
  encode: {
    color: 'category',
    shape: 'category',   // Also distinguish categories by shape, not color alone.
  },
});
```

## Common Color Mistakes

### Error 1: Using a categorical palette for numeric values in a heatmap

```javascript
// ❌ Categorical colors such as red, blue, and green do not communicate numeric magnitude.
chart.options({
  type: 'cell',
  encode: { color: 'temperature' },
  scale: { color: { type: 'ordinal' } },   // ❌ Numeric values are using a categorical palette.
});

// ✅ Use a sequential color scale for numeric values.
chart.options({
  type: 'cell',
  encode: { color: 'temperature' },
  scale: { color: { type: 'sequential', palette: 'YlOrRd' } },
});
```

### Error 2: Using an asymmetric domain for a diverging color scale

```javascript
// ❌ Asymmetric domain: zero is not at the color midpoint.
scale: {
  color: {
    type: 'diverging',
    palette: 'RdBu',
    domain: [-20, 100],   // ❌ The negative range is small, so zero is shifted left.
  },
}

// ✅ Symmetric domain: zero is centered.
scale: {
  color: {
    type: 'diverging',
    palette: 'RdBu',
    domain: [-100, 0, 100],   // ✅ Explicitly specify three control points.
  },
}
```

### Error 3: Using too many colors

```javascript
// ❌ Twelve colors are difficult for readers to distinguish.
chart.options({
  encode: { color: 'province' },   // 31 provinces.
});

// ✅ Group or merge categories to keep the number of color categories at eight or fewer.
// Strategy: keep the top 7 and group the rest as "Other".
const processedData = aggregateTopN(data, 'province', 7);
```

### Error 4: Putting hex color values in the data and using them as a color field

```javascript
// ❌ Error: hex strings in the data are treated as category keys by the ordinal scale.
// The final colors come from G2's default palette, and the legend shows meaningless strings such as '#1e3a5f'.
const barData = [
  { group: 'Legal sector', value: 85, color: '#1e3a5f' },
  { group: 'Corporate governance experts', value: 78, color: '#2d4a6f' },
];
chart.options({
  type: 'interval',
  data: barData,
  encode: { x: 'group', y: 'value', color: 'color' },
  scale: { color: { type: 'ordinal' } },
});

// ✅ Correct: put hex color values in scale.color.range and point encode.color to a business field.
chart.options({
  type: 'interval',
  data: [
    { group: 'Legal sector', value: 85 },
    { group: 'Corporate governance experts', value: 78 },
  ],
  encode: { x: 'group', y: 'value', color: 'group' },
  scale: {
    color: { type: 'ordinal', domain: ['Legal sector', 'Corporate governance experts'], range: ['#1e3a5f', '#2d4a6f'] },
  },
});
```
