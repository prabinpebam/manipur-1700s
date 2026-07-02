---
name: antv-g2-chart
description: Generate G2 v5 chart code. Use when user asks for G2 charts, bar charts, line charts, pie charts, scatter plots, area charts, or any data visualization with G2 library.
---

# G2 v5 Chart Code Generator

You are an expert in AntV G2 v5 charting library. Generate accurate, runnable code following G2 v5 best practices.

---

## 1. Core Constraints (MUST follow)

1. **`container` is mandatory**: `new Chart({ container: 'container', ... })`
2. **Use Spec Mode ONLY**: `chart.options({ type: 'interval', data, encode: {...} })` (see Forbidden Patterns for the V4 chained API)
3. **Call `chart.options()` only once**: Multiple calls fully overwrite the previous configuration, so only the last call takes effect. Multi-mark overlays must use `type: 'view'` + a `children` array instead of calling `chart.options()` multiple times
4. **`encode` object**: `encode: { x, y }` (V4 `.position('x*y')` is forbidden)
5. **`transform` must be array**: `transform: [{ type: 'stackY' }]`
6. **`labels` is plural**: Use `labels: [{ text: 'field' }]` not `label: {}`
7. **`coordinate` rules**:
   - Specify the coordinate type directly: `coordinate: { type: 'theta' }`, `coordinate: { type: 'polar' }`
   - transpose is a **transform**, not a coordinate system type; it must be written in the `transform` array: `coordinate: { transform: [{ type: 'transpose' }] }`
   - ❌ Forbidden: `coordinate: { type: 'transpose' }`
8. **Range encoding** (Gantt charts, candlestick charts, etc.): `encode: { y: 'start', y1: 'end' }`, do not use `y: ['start', 'end']`
9. **Style principle**: Fully preserve styles mentioned in the user's description (radius, fillOpacity, color, fontSize, etc.); do not add decorative styles the user did not mention (`shadowBlur`, `shadowColor`, `shadowOffsetX/Y`, etc.) on your own
10. **`animate` rule**: Do not add an `animate` configuration unless the user explicitly requests animation (G2 has default animations built in); add it only when the user explicitly describes animation requirements
11. **`scale.color.palette` only accepts valid values**: palette values are looked up through d3-scale-chromatic, and invalid names throw an `Unknown palette` error. **Do not infer or invent nonexistent names** (for example, `'blueOrange'`, `'redGreen'`, `'hot'`, `'jet'`, and `'coolwarm'` are all invalid). Common valid values: sequential scales `'blues'|'greens'|'reds'|'ylOrRd'|'viridis'|'plasma'|'turbo'`; diverging scales `'rdBu'|'rdYlGn'|'spectral'`; when unsure, use a custom `range: ['#startColor', '#endColor']` instead
12. **Do not use `d3.*` in user code**: G2 uses d3 internally, but the `d3` object is not exposed to user-code scope. Calling `d3.sum()` and similar APIs throws `ReferenceError: d3 is not defined`. For aggregation, prefer built-in G2 options (such as `sortX` with `reducer: 'sum'`); if custom logic is unavoidable, use native JS: `d3.sum(arr, d=>d.v)` -> `arr.reduce((s,d)=>s+d.v,0)`; `d3.max(arr, d=>d.v)` -> `Math.max(...arr.map(d=>d.v))`
13. **When the user does not specify colors, do not use white or near-white as graphic fill colors**: `style: { fill: '#fff' }`, `style: { fill: 'white' }`, `style: { fill: '#ffffff' }`, etc. make graphics completely invisible on a white background. When colors are not specified, rely on G2's `encode.color` to automatically assign theme colors, or use colors with clear visual distinction (such as `'#5B8FF9'`). Valid exceptions: label text `fill: '#fff'` (labels inside dark backgrounds) and separator lines `stroke: '#fff'` (white separators in stacked/pack/treemap charts)
14. **`padding` only accepts `number | 'auto'`; array form is forbidden**: `padding: [40, 30, 40, 50]` is invalid in G2 v5 (it is ignored or causes an error). Use `padding: 40` for uniform padding on all sides; use `paddingTop` / `paddingRight` / `paddingBottom` / `paddingLeft` for per-side control. The default `'auto'` already reserves space for axes/legends automatically, so manual configuration is unnecessary in most cases. **Do not set `padding: 0`**: it disables automatic calculation and causes axes/legends to be clipped; if only one direction needs adjustment, set that side individually
15. **Do not set `width` together with `autoFit: true`**: `autoFit` completely ignores `width`; when both appear, `width` is ineffective. With `autoFit: true`, set only `height`; for fixed width and height, remove `autoFit` and use `width` + `height`
16. **When the user does not specify a container**: default `container` to `'container'`; do not create one with `document.createElement('div')`; the code must end with `chart.render();`
17. **Do not store hex color values in data and map them through `encode.color`**: When `encode.color` maps to a field containing hex strings (such as `'#1e3a5f'`), the Ordinal scale treats the hex strings as category keys rather than color values. The final rendered colors come from the G2 default palette instead of the hex values in the data, and the legend displays meaningless hex strings. Correct approach: remove the color field from the data, put hex values in `scale.color.range`, point `encode.color` to a business-meaningful field (such as `'group'`), and pair colors precisely through `scale.color.domain` + `range`. **Exception**: If you must directly use dynamic colors from the data, explicitly configure `scale: { color: { type: 'identity' } }`.
18. **Label visibility and anti-overlap**: Labels with `position: 'inside'` in bar charts **must** add `transform: [{ type: 'contrastReverse' }]`; labels in dense charts (multi-series line charts, scatter plots, grouped bar charts) must add `overlapDodgeY` or `overlapHide`; labels for marks with limited space such as stacked charts, TreeMap, and sunburst charts must add `overflowHide`; **do not use `dx` offsets to position labels**; use `position` to control placement. See [Label Configuration](references/components/g2-comp-label-config.md)
19. **Text contrast on dark backgrounds**: When the container background is dark/black, you **must** use `theme: 'classicDark'` (or `theme: { type: 'classicDark', view: { viewFill: 'colorValue' } }`). G2 automatically switches all component text to light colors. On light backgrounds, **do not** set text to light gray (such as `labelFill: '#ccc'`); in pie chart `scale.color.range`, **do not** include colors identical or similar to the background. See [Dark Theme Adaptation](references/concepts/g2-concept-dark-theme-adaptation.md)

### 1.1 Forbidden Patterns

**Do not use V4 syntax**; you must use V5 Spec mode:


```javascript
// ❌ Forbidden: V4 createView
const view = chart.createView();
view.options({...});

// ❌ Forbidden: V4 chained API calls
chart.interval()
  .data([...])
  .encode('x', 'genre')
  .encode('y', 'sold')
  .style({ radius: 4 });

// ❌ Forbidden: V4 chained encode
chart.line().encode('x', 'date').encode('y', 'value');

// ❌ Forbidden: V4 source
chart.source(data);

// ❌ Forbidden: V4 position
chart.interval().position('genre*sold');

// ✅ Correct: V5 Spec mode
chart.options({
  type: 'interval',
  data: [...],
  encode: { x: 'genre', y: 'sold' },
  style: { radius: 4 },
});
```

**Reason**: V5 uses Spec mode, with a clear structure that is easy to serialize, generate dynamically, and debug.

#### Correct V5 Alternatives to `createView`

In V4, `chart.createView()` was used for "multiple views sharing a container but using different data". In V5, this corresponds to two scenarios:

**Scenario A: Overlay multiple marks in the same coordinate system (most common)**
-> Use `type: 'view'` + a `children` array; do not nest `view` or `children` inside `children`:

```javascript
// ✅ Multi-mark overlay (line + scatter)
chart.options({
  type: 'view',
  data,
  children: [
    { type: 'line',  encode: { x: 'date', y: 'value' } },
    { type: 'point', encode: { x: 'date', y: 'value' } },
  ],
});
```

**Scenario B: Multiple independent coordinate systems arranged side by side or overlaid (such as population pyramids or butterfly charts)**
-> Use `type: 'spaceLayer'` + `children` (each child view has independent data and coordinate system):

```javascript
// ✅ Population pyramid: independent left/right views overlaid, sharing the Y-axis
chart.options({
  type: 'spaceLayer',
  children: [
    {
      type: 'interval',
      data: leftData,                              // Left-side data (negative values or reflected)
      coordinate: { transform: [{ type: 'transpose' }, { type: 'reflectX' }] },
      encode: { x: 'age', y: 'male' },
      axis: { y: { position: 'right' } },
    },
    {
      type: 'interval',
      data: rightData,                             // Right-side data
      coordinate: { transform: [{ type: 'transpose' }] },
      encode: { x: 'age', y: 'female' },
      axis: { y: false },
    },
  ],
});

// ✅ Simpler approach: single view + negative-value technique (data can be in one array)
chart.options({
  type: 'interval',
  data: combinedData,                              // Combined data, using negative values to distinguish direction
  coordinate: { transform: [{ type: 'transpose' }] },
  encode: {
    x: 'age',
    y: (d) => d.sex === 'male' ? -d.population : d.population,
    color: 'sex',
  },
  axis: {
    y: { labelFormatter: (d) => Math.abs(d) },     // Display absolute values
  },
});
```

**Selection principles**:
- The data structures on both sides are the same and only the direction is opposite → **prefer the negative-value technique** (a single `interval`, shortest code)
- The two sides need completely independent coordinate systems/scales → use `spaceLayer`

### 1.2 Hallucinated Mark Types

The following types come from other charting libraries (such as ECharts or Vega), **do not exist in G2**, and will cause runtime errors if used:

| ❌ Wrong Usage | ✅ Correct Replacement |
|------------|-----------|
| `type: 'ruleX'` | `type: 'lineX'` (vertical reference line) |
| `type: 'ruleY'` | `type: 'lineY'` (horizontal reference line) |
| `type: 'regionX'` | `type: 'rangeX'` (X-axis range highlight) |
| `type: 'regionY'` | `type: 'rangeY'` (Y-axis range highlight) |
| `type: 'venn'` | `type: 'path'` + `data.transform: [{ type: 'venn' }]` |

**Complete list of valid G2 mark types** (do not invent other types):
- Basic: `interval`, `line`, `area`, `point`, `rect`, `cell`, `text`, `image`, `path`, `polygon`, `shape`
- Connection: `link`, `connector`, `vector`
- Reference lines/regions: `lineX`, `lineY`, `rangeX`, `rangeY`;`range` (rarely used; only when both x/y need to define a 2D rectangle, and the data's x/y fields must be `[start,end]` arrays)
- Statistics: `box`, `boxplot`, `density`, `heatmap`, `beeswarm`
- Hierarchy/relationship: `treemap`, `pack`, `partition`, `tree`, `sankey`, `chord`
- Special: `wordCloud`, `gauge`, `liquid`
- Requires extension package: `sunburst` (requires `@antv/g2-extension-plot`; see [Sunburst](references/marks/g2-mark-sunburst.md))
---

## 2. Common Mistakes

### ⚠️ Most Frequent Mistake: Do Not Call `chart.options()` Multiple Times

`chart.options()` performs a **full replacement**, not a merge. When called multiple times, **only the last call takes effect** and all previous configuration is lost. **Each chart may call `chart.options()` only once.**

```javascript
// ❌ Wrong: Calling chart.options() multiple times -- each call fully replaces the previous one, so only the last takes effect
chart.options({ type: 'interval', data, encode: { x: 'x', y: 'y' } });  // ❌ Overwritten; not rendered
chart.options({ type: 'line',     data, encode: { x: 'x', y: 'y' } });  // ❌ Overwritten; not rendered
chart.options({ type: 'text',     data, encode: { x: 'x', y: 'y', text: 'label' } });  // Only this one takes effect

// ✅ Correct: Multi-mark overlays must use type: 'view' + children, with a single chart.options() call
chart.options({
  type: 'view',
  data,
  children: [
    { type: 'interval', encode: { x: 'x', y: 'y' } },
    { type: 'line',     encode: { x: 'x', y: 'y' } },
    { type: 'text',     encode: { x: 'x', y: 'y', text: 'label' } },
  ],
});

// ✅ When child marks need different data, specify data separately inside children
chart.options({
  type: 'view',
  data: mainData,
  children: [
    { type: 'interval', encode: { x: 'x', y: 'y' } },
    { type: 'text', data: labelData, encode: { x: 'x', text: 'label' } },
  ],
});
```

Multi-mark composition rules:
- Use only `children`; properties such as `marks` and `layers` are forbidden
- `children` cannot be nested (no `type: 'view'` + `children` inside `children`)
- Use `spaceLayer`/`spaceFlex` for complex multi-coordinate-system compositions

```javascript
// ❌ Wrong: Using marks/layers (forbidden)
chart.options({ type: 'view', data, marks: [...] });   // ❌
chart.options({ type: 'view', data, Layers: [...] });  // ❌

// ❌ Wrong: Nested children (forbidden)
chart.options({ type: 'view', children: [{ type: 'view', children: [...] }] });  // ❌

// ✅ Correct: Use spaceLayer for complex multi-coordinate-system compositions
chart.options({
  type: 'spaceLayer',
  children: [
    { type: 'view', children: [...] },
    { type: 'line', encode: { x: 'x', y: 'y' } },
  ],
});
```

### Other Common Mistakes

```javascript
// ❌ Wrong: padding in array form (CSS shorthand); G2 v5 does not support it and it will be ignored
const chart = new Chart({ container: 'container', padding: [40, 30, 40, 50] });  // ❌

// ✅ Correct: uniform padding on all sides
const chart = new Chart({ container: 'container', padding: 40 });

// ✅ Correct: per-side control
const chart = new Chart({ container: 'container', paddingTop: 40, paddingLeft: 60 });

// ❌ Wrong: missing container
const chart = new Chart({ width: 640, height: 480 });

// ✅ Correct: container required
const chart = new Chart({ container: 'container', width: 640, height: 480 });

// ❌ Wrong: transform as object
chart.options({ transform: { type: 'stackY' } });

// ✅ Correct: transform as array
chart.options({ transform: [{ type: 'stackY' }] });

// ❌ Wrong: label (singular)
chart.options({ label: { text: 'value' } });

// ✅ Correct: labels (plural)
chart.options({ labels: [{ text: 'value' }] });

// ❌ Wrong: labels formatter treats the first parameter as a datum object
// The first formatter parameter is the mapped text value (for example, 85), not the datum
// d.value is undefined on the number 85, resulting in "undefined%"
chart.options({
  labels: [{ text: 'value', formatter: (d) => d.value + '%' }],
});

// ✅ Correct: use a text function to access the datum directly and format it (recommended)
chart.options({
  labels: [{ text: (d) => d.value + '%' }],
});

// ✅ Correct: or use formatter correctly (val is the mapped numeric value)
chart.options({
  labels: [{ text: 'value', formatter: (val) => val + '%' }],
});

// ❌ Wrong: hex color values are stored in data and treated as category keys by the Ordinal scale
// Rendered colors come from the G2 default palette, and the legend displays meaningless strings such as '#1e3a5f'
const barData = [
  { group: 'Legal Sector', value: 85, color: '#1e3a5f' },
  { group: 'Corporate Governance Experts', value: 78, color: '#2d4a6f' },
];
chart.options({
  type: 'interval',
  data: barData,
  encode: { x: 'group', y: 'value', color: 'color' },
  scale: { color: { type: 'ordinal' } },
});

// ✅ Correct: put hex color values in scale.color.range and point encode.color to a business field
chart.options({
  type: 'interval',
  data: [
    { group: 'Legal Sector', value: 85 },
    { group: 'Corporate Governance Experts', value: 78 },
  ],
  encode: { x: 'group', y: 'value', color: 'group' },
  scale: {
    color: {
      type: 'ordinal',
      domain: ['Legal Sector', 'Corporate Governance Experts'],
      range: ['#1e3a5f', '#2d4a6f'],
    },
  },
});

// ✅ Correct (Dynamic Colors): If you must directly use hex colors in data, explicitly specify an identity scale
chart.options({
  type: 'interval',
  data: [
    { group: 'Legal Sector', value: 85, color: '#1e3a5f' },
    { group: 'Corporate Governance Experts', value: 78, color: '#2d4a6f' },
  ],
  encode: { x: 'group', y: 'value', color: 'color' },
  scale: {
    color: { type: 'identity' },
  },
});

// ❌ Wrong: using stroke + lineWidth on an area chart outlines the entire filled area
// The bottom and sides are also stroked; the correct approach is view + children overlaying area + line
chart.options({
  type: 'area',
  data,
  encode: { x: 'date', y: 'value' },
  style: { fill: '#FF5924', fillOpacity: 0.4, stroke: '#FF5924', lineWidth: 2 },
});

// ✅ Correct: view + area (fill) + line (top edge line)
chart.options({
  type: 'view',
  data,
  children: [
    { type: 'area', encode: { x: 'date', y: 'value' }, style: { fill: '#FF5924', fillOpacity: 0.4 } },
    { type: 'line', encode: { x: 'date', y: 'value' }, style: { stroke: '#FF5924', lineWidth: 2 } },
  ],
});

// ❌ Wrong: unnecessary scale type specification
chart.options({ scale: { x: { type: 'linear' }, y: { type: 'linear' } } });

// ✅ Correct: let G2 infer scale type automatically
chart.options({ scale: { y: { domain: [0, 100] } } });
```

<!-- CONSTRAINTS:END -->

---

## 3. Basic Structure

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'interval',           // Mark type
  data: [...],                // Data array
  encode: { x: 'field', y: 'field', color: 'field' },
  transform: [],              // Data transforms
  scale: {},                  // Scale config
  coordinate: {},             // Coordinate system
  style: {},                  // Style config
  labels: [],                 // Data labels
  tooltip: {},                // Tooltip config
  axis: {},                   // Axis config
  legend: {},                 // Legend config
});

chart.render();
```

---

## 4. Core Concepts

Core concepts are the foundation of G2; understanding them is a prerequisite for using G2 correctly.

### 4.1 Chart Initialization

Chart is the core class in G2; every chart starts from a Chart instance.

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',  // Required: DOM container ID or element
  width: 640,              // Optional: width
  height: 480,             // Optional: height
  autoFit: true,           // Optional: adapt to container size
  padding: 'auto',         // Optional: padding
  theme: 'light',          // Optional: theme
});
```

> **Detailed documentation**: [Chart Initialization](references/core/g2-core-chart-init.md)

### 4.2 encode Channel System

encode maps data fields to visual channels and is a core concept in G2.

| Channel | Purpose | Example |
|------|------|------|
| `x` | X-axis position | `encode: { x: 'month' }` |
| `y` | Y-axis position | `encode: { y: 'value' }` |
| `color` | Color | `encode: { color: 'category' }` |
| `size` | Size | `encode: { size: 'population' }` |
| `shape` | Shape | `encode: { shape: 'type' }` |

> **Detailed documentation**: [encode Channel System](references/core/g2-core-encode-channel.md)

### 4.3 View Composition (view + children)

Use the `view` type together with a `children` array to compose multiple marks.

```javascript
chart.options({
  type: 'view',
  data,
  children: [
    { type: 'line', encode: { x: 'date', y: 'value' } },
    { type: 'point', encode: { x: 'date', y: 'value' } },
  ],
});
```

> **Detailed documentation**: [View Composition](references/core/g2-core-view-composition.md)

---

## 5. Concepts Guide

The concepts guide helps choose the right chart type and configuration approach.

### 5.1 Chart Selection

Choose the appropriate chart type based on data characteristics and visualization goals:

| Data Relationship | Recommended Chart | Mark |
|---------|---------|------|
| Comparison | Column chart, bar chart | `interval` |
| Trend | Line chart, area chart | `line`, `area` |
| Proportion | Pie chart, donut chart | `interval` + `theta` |
| Distribution | Histogram, boxplot | `rect`, `boxplot` |
| Correlation | Scatter plot, bubble chart | `point` |
| Hierarchy | Treemap, partition chart, sunburst chart | `treemap`, `partition`, `sunburst` (requires extension package) |

> **Detailed documentation**: [Chart Selection Guide](references/concepts/g2-concept-chart-selection.md)

### 5.2 Visual Channels

Visual channels are mappings from data to visual attributes:

| Channel Type | Suitable Data | Perceptual Accuracy |
|---------|---------|---------|
| Position | Continuous/discrete | Highest |
| Length | Continuous | High |
| Color (hue) | Discrete | Medium |
| Color (brightness) | Continuous | Medium |
| Size | Continuous | Medium-low |
| Shape | Discrete | Low |

> **Detailed documentation**: [Visual Channels](references/concepts/g2-concept-visual-channels.md)

### 5.3 Color Theory

Choose an appropriate color scheme to improve chart readability:

| Scenario | Recommended Approach | Example |
|------|---------|------|
| Categorical data | Discrete palette | `category10`, `category20` |
| Continuous data | Sequential palette | `Blues`, `RdYlBu` |
| Positive/negative comparison | Diverging palette | `RdYlGn` |

> **Detailed documentation**: [Color Theory](references/concepts/g2-concept-color-theory.md)

---

## 6. Marks / Chart Types

Marks are G2's core visualization elements and determine the visual representation of data. Each mark is suitable for specific data types and visualization scenarios.

### 6.1 Bar/Column Chart Series / Interval

Bar/column charts compare categorical values and are among the most commonly used chart types. Basic bar/column charts use the `interval` mark; stacked bar/column charts require the `stackY` transform; grouped bar/column charts use the `dodgeX` transform.

| Type | Mark | Key Configuration |
|------|------|----------|
| Basic bar/column chart | `interval` | - |
| Stacked bar/column chart | `interval` | `transform: [{ type: 'stackY' }]` |
| Grouped bar/column chart | `interval` | `transform: [{ type: 'dodgeX' }]` |
| Percentage bar/column chart | `interval` | `transform: [{ type: 'normalizeY' }]` |
| Horizontal bar chart | `interval` | `coordinate: { transform: [{ type: 'transpose' }] }` |

> **Detailed documentation**: [Basic bar/column chart](references/marks/g2-mark-interval-basic.md) | [Stacked bar/column chart](references/marks/g2-mark-interval-stacked.md) | [Grouped bar/column chart](references/marks/g2-mark-interval-grouped.md) | [Percentage bar/column chart](references/marks/g2-mark-interval-normalized.md)

### 6.2 Line Chart Series / Line

Line charts show trends over time or ordered categories. They support single lines, multi-line comparisons, and different interpolation methods.

| Type | Mark | Key Configuration |
|------|------|----------|
| Basic line chart | `line` | - |
| Multi-series line chart | `line` | `encode: { color: 'category' }` |
| Smooth curve | `line` | `encode: { shape: 'smooth' }` |
| Step line | `line` | `encode: { shape: 'step' }` |

> **Detailed documentation**: [Basic line chart](references/marks/g2-mark-line-basic.md) | [Multi-series line chart](references/marks/g2-mark-line-multi.md) | [LineX/LineY](references/marks/g2-mark-linex-liney.md)

### 6.3 Area Chart Series / Area

Area charts fill the region under a line chart, emphasizing the magnitude of change over time. Stacked area charts show each part's contribution to the whole.

| Type | Mark | Key Configuration |
|------|------|----------|
| Basic area chart | `area` | - |
| Stacked area chart | `area` | `transform: [{ type: 'stackY' }]` |

> **Detailed documentation**: [Basic area chart](references/marks/g2-mark-area-basic.md) | [Stacked area chart](references/marks/g2-mark-area-stacked.md)

### 6.4 Pie/Donut Charts / Arc (Pie/Donut)

Pie charts show the proportional relationship of parts to a whole. They are implemented with the `theta` coordinate system and the `interval` mark.

| Type | Mark | Key Configuration |
|------|------|----------|
| Pie chart | `interval` | `coordinate: { type: 'theta' }` + `stackY` |
| Donut chart | `interval` | `coordinate: { type: 'theta', innerRadius: 0.6 }` |

> **Detailed documentation**: [Pie chart](references/marks/g2-mark-arc-pie.md) | [Donut chart](references/marks/g2-mark-arc-donut.md)

### 6.5 Scatter/Bubble Charts / Point

Scatter plots show the relationship between two numeric variables; bubble charts use point size to show a third dimension.

| Type | Mark | Key Configuration |
|------|------|----------|
| Scatter plot | `point` | `encode: { x, y }` |
| Bubble chart | `point` | `encode: { x, y, size }` |

> **Detailed documentation**: [Scatter plot](references/marks/g2-mark-point-scatter.md) | [Bubble chart](references/marks/g2-mark-point-bubble.md)

### 6.6 Histogram

Histograms show the distribution of continuous numeric data and are implemented with the `rect` mark and the `binX` transform. Unlike bar charts, histogram bars have no gaps, indicating continuous data.

| Type | Mark | Key Configuration |
|------|------|----------|
| Basic histogram | `rect` | `transform: [{ type: 'binX', y: 'count' }]` |
| Multiple distribution comparison | `rect` | `groupBy` Grouping |

> **Detailed documentation**: [Histogram](references/marks/g2-mark-histogram.md)

### 6.7 Rose/Radial Bar Charts / Polar Charts

Charts in polar coordinates represent values through radius or arc length, producing a more visually appealing form.

| Type | Mark | Key Configuration |
|------|------|----------|
| Rose chart | `interval` | `coordinate: { type: 'polar' }` |
| Radial bar chart | `interval` | `coordinate: { type: 'radial' }` |

> **Detailed documentation**: [Rose chart](references/marks/g2-mark-rose.md) | [Radial bar chart](references/marks/g2-mark-radial-bar.md)

### 6.8 Statistical Distribution Charts / Distribution

Charts that show data distribution characteristics, suitable for statistical analysis and exploratory data analysis.

| Type | Mark | Purpose |
|------|------|------|
| Boxplot | `boxplot` | Data distribution statistics |
| Box chart (Box) | `box` | Boxplot with manually specified five-number summary |
| Density plot | `density` | Kernel density estimation curve |
| Violin plot | `density` + `boxplot` | Density distribution + statistical information |
| Distribution curve chart | `line` + `smooth` | Frequency density distribution curve |
| Polygon | `polygon` | Custom polygon area |
| Contour chart | `cell` + sequential color scale | Two-dimensional continuous data distribution (simulated contours) |

> **Detailed documentation**: [Boxplot](references/marks/g2-mark-boxplot.md) | [Box chart (Box)](references/marks/g2-mark-box-boxplot.md) | [Density plot](references/marks/g2-mark-density.md) | [Violin plot](references/marks/g2-mark-violin.md) | [Distribution curve chart](references/marks/g2-mark-distribution-curve.md) | [Contour chart](references/marks/g2-mark-contourline.md) | [Polygon](references/marks/g2-mark-polygon.md)

### 6.9 Relationship Charts / Relation

Charts that show relationships between data, suitable for network analysis and set-relationship display.

| Type | Mark | Purpose |
|------|------|------|
| Sankey diagram | `sankey` | Flow/transfer relationships |
| Chord diagram | `chord` | Matrix flow relationships |
| Venn diagram | `path` + venn data transform | Set intersection relationships (venn is a data transform, not a mark type) |
| Arc diagram | `line` + `point` | Node-link relationships |

> **Detailed documentation**: [Sankey diagram](references/marks/g2-mark-sankey.md) | [Chord diagram](references/marks/g2-mark-chord.md) | [Venn diagram](references/marks/g2-mark-venn.md) | [Arc diagram](references/marks/g2-mark-arc-diagram.md)

### 6.10 Project Management Charts / Project

Charts suitable for project management and progress tracking.

| Type | Mark | Purpose |
|------|------|------|
| Gantt chart | `interval` | Task scheduling |
| Bullet chart | `interval` + `point` | KPI metric display |

> **Detailed documentation**: [Gantt chart](references/marks/g2-mark-gantt.md) | [Bullet chart](references/marks/g2-mark-bullet.md)

### 6.11 Financial Charts / Finance

Professional charts suitable for financial data analysis.

| Type | Mark | Purpose |
|------|------|------|
| Candlestick chart | `link` + `interval` | Four-price stock data |

> **Detailed documentation**: [Candlestick chart](references/marks/g2-mark-k-chart.md)

### 6.12 Multivariate Data Charts / Multivariate

Charts that show multivariate data relationships.

| Type | Mark | Purpose |
|------|------|------|
| Parallel coordinates | `line` | Multivariate data relationship analysis |
| Radar chart | `line` | Multivariate data comparison |

> **Detailed documentation**: [Parallel coordinates](references/marks/g2-mark-parallel.md) | [Radar chart](references/marks/g2-mark-radar.md)

### 6.13 Comparison Charts / Comparison

Charts suitable for data comparison.

| Type | Mark | Purpose |
|------|------|------|
| Bidirectional bar chart | `interval` | Positive/negative data comparison |
| Funnel chart | `interval` + `shape:'funnel'` | Business conversion-rate display |
| Mosaic chart | `interval`/`cell` + transform | Two-dimensional categorical distribution |

> **Detailed documentation**: [Bidirectional bar chart](references/marks/g2-mark-bi-directional-bar.md) | [Funnel chart](references/marks/g2-mark-funnel.md) | [Mosaic chart](references/marks/g2-mark-mosaic.md)

### 6.14 Basic Marks

Basic marks are G2's low-level building blocks; they can be used independently or combined to build complex charts.

| Type | Mark | Purpose |
|------|------|------|
| Rectangle | `rect` | Rectangular region, basis for histograms/heatmaps |
| Text | `text` | Text annotations and labels |
| Image | `image` | Image mark; represents data points with images |
| Path | `path` | Custom path drawing |
| Link | `link` | Line connecting two points |
| Connector | `connector` | Connecting lines between data points |
| Shape | `shape` | Custom shape drawing |
| Vector | `vector` | Vector/arrow mark, wind-field charts, etc. |

> **Detailed documentation**: [rect](references/marks/g2-mark-rect.md) | [text](references/marks/g2-mark-text.md) | [image](references/marks/g2-mark-image.md) | [path](references/marks/g2-mark-path.md) | [link](references/marks/g2-mark-link.md) | [connector](references/marks/g2-mark-connector.md) | [shape](references/marks/g2-mark-shape.md) | [vector](references/marks/g2-mark-vector.md)

### 6.15 Range Marks / Range

Range marks are used to show interval ranges in data.

| Type | Mark | Purpose |
|------|------|------|
| Time period/interval highlight (X direction) | `rangeX` | X-axis interval, `encode: { x: 'start', x1: 'end' }` |
| Numeric range highlight (Y direction) | `rangeY` | Y-axis interval, `encode: { y: 'min', y1: 'max' }` |
| Two-dimensional rectangular region | `range` | x/y fields are `[start,end]` arrays, `encode: { x:'x', y:'y' }`, rarely used |

> **Detailed documentation**: [range/rangeY](references/marks/g2-mark-range-rangey.md) | [rangeX](references/marks/g2-mark-rangex.md)

### 6.16 Distribution and Pack Charts / Distribution & Pack

| Type | Mark | Purpose |
|------|------|------|
| Beeswarm plot | `point` + `pack` | Tightly arrange data points to show distribution |
| Pack chart | `pack` | Circular packing of hierarchical data |

> **Detailed documentation**: [Beeswarm plot](references/marks/g2-mark-beeswarm.md) | [Pack chart](references/marks/g2-mark-pack.md)

### 6.17 Hierarchy Charts / Hierarchy

Charts that show hierarchical data, using area or radius to represent value proportions.

| Type | Mark | Purpose |
|------|------|------|
| Treemap | `treemap` | Hierarchical data proportions |
| Sunburst chart | `sunburst`⚠️ | Multi-level concentric circle display (requires @antv/g2-extension-plot) |
| Partition chart | `partition` | Hierarchical data partition display |
| Tree chart | `tree` | Tree hierarchy structure |

> **Detailed documentation**: [Treemap](references/marks/g2-mark-treemap.md) | [Sunburst chart](references/marks/g2-mark-sunburst.md) | [Partition chart](references/marks/g2-mark-partition.md) | [Tree chart](references/marks/g2-mark-tree.md)

### 6.18 Other Charts / Others

| Type | Mark | Purpose |
|------|------|------|
| Heatmap | `cell` | Two-dimensional matrix data visualization |
| Density heatmap | `heatmap` | Continuous density heatmap |
| Gauge | `gauge` | Metric progress display |
| Word cloud | `wordCloud` | Text frequency visualization |
| Liquid chart | `liquid` | Percentage progress |
| Spiral chart | `line`/`interval` + helix coordinate system | Periodic patterns in large time series |

> **Detailed documentation**: [Heatmap](references/marks/g2-mark-cell-heatmap.md) | [Density heatmap](references/marks/g2-mark-heatmap.md) | [Gauge](references/marks/g2-mark-gauge.md) | [Word cloud](references/marks/g2-mark-wordcloud.md) | [Liquid chart](references/marks/g2-mark-liquid.md) | [Spiral chart](references/marks/g2-mark-spiral.md)

---

## 7. Data / Data Transforms

Data transforms execute during the data loading phase, are configured in `data.transform`, and affect all marks that use that data.

### 7.1 Data Transform Types (configured in `data.transform`)

| Transform | Type | Purpose | Example Scenario |
|------|------|------|---------|
| **fold** | `fold` | Wide table to long table | Multiple data columns to multiple series |
| **filter** | `filter` | Filter data by condition | Filter invalid data |
| **sort** | `sort` | Sort using a callback function | Custom sorting logic |
| **sortBy** | `sortBy` | Sort by field | Sort by field value |
| **map** | `map` | Data mapping transformation | Add calculated fields |
| **join** | `join` | Merge data tables | Join external data |
| **pick** | `pick` | Select specified fields | Reduce fields |
| **rename** | `rename` | Rename fields | Field renaming |
| **slice** | `slice` | Slice data range | Pagination/slicing |
| **ema** | `ema` | Exponential moving average | Time-series smoothing |
| **kde** | `kde` | Kernel density estimation | Density plot/Violin plot |
| **log** | `log` | Print data to the console | Debugging |
| **custom** | `custom` | Custom data processing | Complex transformations |

### 7.2 Data Formats and Patterns

| Type | Purpose |
|------|------|
| Tabular data format | Description of the standard tabular data format accepted by G2 |
| Data transform patterns | Patterns for combining Data Transform and Mark Transform |

> **Detailed documentation**: [filter](references/data/g2-data-filter.md) | [sort](references/data/g2-data-sort.md) | [sortBy](references/data/g2-data-sortby.md) | [fold](references/data/g2-data-fold.md) | [slice](references/data/g2-data-slice.md) | [ema](references/data/g2-data-ema.md) | [kde](references/data/g2-data-kde.md) | [log](references/data/g2-data-log.md) | [fetch](references/data/g2-data-fetch.md) | [Data transform patterns](references/data/g2-data-transform-patterns.md)

### 7.3 Common Mistake: Data Transform in the Wrong Position

```javascript
// ❌ Wrong: fold is a data transform and cannot be placed in mark transform
chart.options({
  type: 'interval',
  data: wideData,
  transform: [{ type: 'fold', fields: ['a', 'b'] }],  // ❌ Wrong!
});

// ✅ Correct: put fold in data.transform
chart.options({
  type: 'interval',
  data: {
    type: 'inline',
    value: wideData,
    transform: [{ type: 'fold', fields: ['a', 'b'] }],  // ✅ Correct
  },
  transform: [{ type: 'stackY' }],  // mark transform
});
```

### 7.4 Composition Example: Wide-Table Data + Stacked Chart

```javascript
// Wide-table data: each month has multiple type columns
const wideData = [
  { year: '2000', 'Type A': 21, 'Type B': 16, 'Type C': 8 },
  { year: '2001', 'Type A': 25, 'Type B': 16, 'Type C': 8 },
  // ...
];

chart.options({
  type: 'interval',
  data: {
    type: 'inline',
    value: wideData,
    transform: [
      // ✅ Data Transform: wide table to long table
      { type: 'fold', fields: ['Type A', 'Type B', 'Type C'], key: 'type', value: 'value' },
    ],
  },
  encode: { x: 'year', y: 'value', color: 'type' },
  transform: [
    // ✅ Mark Transform: stacking
    { type: 'stackY' },
  ],
  coordinate: { type: 'polar' },  // Polar coordinate system
});
```

---

## 8. Transforms / Mark Transforms

Mark transforms execute when visual channels are bound. They are configured in the mark's `transform` array and are used for data aggregation, anti-overlap, and more.

**Configuration position**: the `transform` array, at the same level as `data` and `encode`; **not** inside `data.transform`.

```javascript
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'type' },
  transform: [  // ✅ Mark Transform: same level as data/encode
    { type: 'stackY' },
    { type: 'sortX', by: 'y' },
  ],
});
```

### 8.1 Anti-overlap Transforms / Anti-overlap

| Transform | Type | Purpose |
|------|------|------|
| Stacking | `stackY` | Data stacking, used for stacked charts |
| Grouping | `dodgeX` | Data grouping, used for grouped charts |
| Jitter | `jitter` | Scatter jitter to avoid overlap |
| X-axis jitter | `jitterX` | X-direction jitter |
| Y-axis jitter | `jitterY` | Y-direction jitter |
| Packing | `pack` | Tightly arrange data points |

> **Detailed documentation**: [stackY](references/transforms/g2-transform-stacky.md) | [dodgeX](references/transforms/g2-transform-dodgex.md) | [jitter](references/transforms/g2-transform-jitter.md) | [jitterX](references/transforms/g2-transform-jitterx.md) | [jitterY](references/transforms/g2-transform-jittery.md) | [pack](references/transforms/g2-transform-pack.md)

### 8.2 Aggregation Transforms / Aggregation

| Transform | Type | Purpose |
|------|------|------|
| General grouping | `group` | General grouped aggregation |
| Grouped aggregation | `groupX` / `groupY` | Group by dimension and aggregate |
| Group by color | `groupColor` | Group and aggregate by color |
| Binning | `bin` | Two-dimensional binning |
| X-axis binning | `binX` | X-axis-direction binning |
| Sampling | `sample` | Data sampling |

> **Detailed documentation**: [group](references/transforms/g2-transform-group.md) | [groupX](references/transforms/g2-transform-groupx.md) | [groupY](references/transforms/g2-transform-groupy.md) | [groupColor](references/transforms/g2-transform-groupcolor.md) | [bin](references/transforms/g2-transform-bin.md) | [binX](references/transforms/g2-transform-binx.md) | [sample](references/transforms/g2-transform-sample.md)

### 8.3 Sorting Transforms / Sorting

| Transform | Type | Purpose |
|------|------|------|
| X-axis sorting | `sortX` | Sort by X channel |
| Y-axis sorting | `sortY` | Sort by Y channel |
| Color sorting | `sortColor` | Sort by color channel |

> **Detailed documentation**: [sortX](references/transforms/g2-transform-sortx.md) | [sortY](references/transforms/g2-transform-sorty.md) | [sortColor](references/transforms/g2-transform-sort-color.md)

### 8.4 SelectionTransform / Selection

| Transform | Type | Purpose |
|------|------|------|
| Selection | `select` | Globally select data |
| X-axis selection | `selectX` | Select by X grouping |
| Y-axis selection | `selectY` | Select by Y grouping |

> **Detailed documentation**: [select](references/transforms/g2-transform-select.md) | [selectX](references/transforms/g2-transform-selectx.md) | [selectY](references/transforms/g2-transform-selecty.md)

### 8.5 Other Transforms / Others

| Transform | Type | Purpose |
|------|------|------|
| Normalization | `normalizeY` | Y-axis normalization |
| Difference | `diffY` | Calculate differences |
| Symmetry | `symmetryY` | Y-axis symmetry |
| Flex X | `flexX` | X-axis flexible layout |
| Stack enter | `stackEnter` | Stacking enter animation |

> **Detailed documentation**: [normalizeY](references/transforms/g2-transform-normalizey.md) | [diffY](references/transforms/g2-transform-diffy.md) | [symmetryY](references/transforms/g2-transform-symmetryy.md) | [flexX](references/transforms/g2-transform-flexx.md) | [stackEnter](references/transforms/g2-transform-stack-enter.md)

---

## 9. Interactions

G2 provides rich built-in interactions for data exploration and chart operations.

### 9.1 Selection Interactions / Selection

| Interaction | Type | Purpose |
|------|------|------|
| Element selection | `elementSelect` | Click to select data elements |
| Conditional selection | `elementSelectBy` | Batch-select elements by condition |
| Brush selection | `brush` / `brushX` / `brushY` | Rectangular region selection |
| Two-dimensional brush selection | `brushXY` | Brush both X and Y simultaneously |
| Axis brush selection | `brushAxis` | Axis range selection |
| Legend filtering | `legendFilter` | Click legend to filter data |

> **Detailed documentation**: [elementSelect](references/interactions/g2-interaction-element-select.md) | [elementSelectBy](references/interactions/g2-interaction-element-select-by.md) | [brush](references/interactions/g2-interaction-brush.md) | [brushXY](references/interactions/g2-interaction-brush-xy.md) | [brushAxis](references/interactions/g2-interaction-brush-axis.md) | [legendFilter](references/interactions/g2-interaction-legend-filter.md)

### 9.2 Highlight Interactions / Highlight

| Interaction | Type | Purpose |
|------|------|------|
| Element highlight | `elementHighlight` | Highlight elements on hover |
| Conditional highlight | `elementHighlightBy` | Batch-highlight elements by condition |
| Hover scale | `elementHoverScale` | Enlarge elements on hover |
| Legend highlight | `legendHighlight` | Hover legend to highlight corresponding elements |
| Brush highlight | `brushXHighlight` / `brushYHighlight` | Highlight brushed region |

> **Detailed documentation**: [elementHighlight](references/interactions/g2-interaction-element-highlight.md) | [elementHighlightBy](references/interactions/g2-interaction-element-highlight-by.md) | [elementHoverScale](references/interactions/g2-interaction-element-hover-scale.md) | [legendHighlight](references/interactions/g2-interaction-legend-highlight.md) | [brushXHighlight](references/interactions/g2-interaction-brushx-highlight.md) | [brushYHighlight](references/interactions/g2-interaction-brushy-highlight.md) | [Single-axis Brush Highlight](references/interactions/g2-interaction-brush-x-y-highlight.md)

### 9.3 Filter Interactions / Filter

| Interaction | Type | Purpose |
|------|------|------|
| Slider filtering | `sliderFilter` | Use a slider to filter data ranges |
| Scrollbar filtering | `scrollbarFilter` | Use a scrollbar to filter data |
| Brush filtering | `brushFilter` | Filter data in brushed region |
| X-axis brush filtering | `brushXFilter` | X-axis-direction brush filtering |
| Y-axis brush filtering | `brushYFilter` | Y-axis-direction brush filtering |
| Adaptive filtering | `adaptiveFilter` | Adaptive data filtering |

> **Detailed documentation**: [sliderFilter](references/interactions/g2-interaction-slider-filter.md) | [scrollbarFilter](references/interactions/g2-interaction-scrollbar-filter.md) | [brushFilter](references/interactions/g2-interaction-brush-filter.md) | [brushXFilter](references/interactions/g2-interaction-brushx-filter.md) | [brushYFilter](references/interactions/g2-interaction-brushy-filter.md) | [adaptiveFilter](references/interactions/g2-interaction-adaptive-filter.md)

### 9.4 Other Interactions / Others

| Interaction | Type | Purpose |
|------|------|------|
| Tooltip | `tooltip` | Show data details on hover |
| Poptip | `poptip` | Concise bubble tip |
| Drilldown | `drilldown` | Drill down into hierarchical data |
| Treemap drilldown | `treemapDrilldown` | TreemapHierarchyDrilldown |
| Zoom | `fisheye` | Fisheye magnifier effect |
| Wheel slider | `sliderWheel` | Control slider with mouse wheel |
| Drag move | `elementPointMove` | Drag data points to move them |
| Chart index | `chartIndex` | Linked index line across multiple charts |

> **Detailed documentation**: [tooltip](references/interactions/g2-interaction-tooltip.md) | [poptip](references/interactions/g2-interaction-poptip.md) | [drilldown](references/interactions/g2-interaction-drilldown.md) | [treemapDrilldown](references/interactions/g2-interaction-treemap-drilldown.md) | [fisheye](references/interactions/g2-interaction-fisheye.md) | [sliderWheel](references/interactions/g2-interaction-slider-wheel.md) | [elementPointMove](references/interactions/g2-interaction-element-point-move.md) | [chartIndex](references/interactions/g2-interaction-chart-index.md)

---

## 10. Components

Components are auxiliary chart elements, such as axes, legends, tooltips, and more.

### 10.1 Axis

Axes display data dimensions and support rich style configuration.

> **Detailed documentation**: [Axis Configuration](references/components/g2-comp-axis-config.md) | [Radar Chart Axis](references/components/g2-comp-axis-radar.md)

### 10.2 Legend

Legends show data categories or continuous numeric mappings, supporting categorical legends and continuous legends (color bands).

| Type | Purpose |
|------|------|
| Categorical legend | Explanation of color mapping for discrete categorical data |
| Continuous legend | Explanation of color/size mapping for continuous values (color band) |

> **Detailed documentation**: [Legend Configuration](references/components/g2-comp-legend-config.md) | [Categorical legend](references/components/g2-comp-legend-category.md) | [Continuous legend](references/components/g2-comp-legend-continuous.md)

### 10.3 Tooltip / Tooltip

Tooltip displays data details on hover and supports custom templates and formatting.

> **Detailed documentation**: [Tooltip Configuration](references/components/g2-comp-tooltip-config.md)

### 10.4 Other Components / Others

| Component | Purpose |
|------|------|
| Title | Chart title |
| Label | Data labels |
| Scrollbar | Scroll through data |
| Slider | Data range selection |
| Annotation | Data annotations and guide lines |

> **Detailed documentation**: [Title](references/components/g2-comp-title.md) | [Label](references/components/g2-comp-label-config.md) | [Scrollbar](references/components/g2-comp-scrollbar.md) | [Slider](references/components/g2-comp-slider.md) | [Annotation](references/components/g2-comp-annotation.md)

---

## 11. Scales

Scales map data values to visual channels, such as position, color, size, and more.

### 11.1 ⚠️ Default Behavior (do not over-specify type)

**G2 automatically infers scale types based on data types. Do not manually specify type except in special cases:**

| Data Type | Automatically Inferred Scale | Example |
|---------|-----------------|------|
| Numeric field | `linear` | `{ value: 100 }` → linear |
| Categorical field | `band` | `{ category: 'A' }` → band |
| Date object | `time` | `{ date: new Date() }` → time |

```javascript
// ❌ Wrong: unnecessary type specification may cause rendering issues
chart.options({
  scale: {
    x: { type: 'linear' },  // ❌ Numeric fields default to linear
    y: { type: 'linear' },  // ❌ No need to specify
  },
});

// ✅ Correct: let G2 infer automatically and configure domain/range only when needed
chart.options({
  scale: {
    y: { domain: [0, 100] },  // ✅ Configure only required properties
    color: { range: ['#1890ff', '#52c41a'] },
  },
});
```

**Special cases that require manually specifying type:**

| Scenario | type | Description |
|------|------|------|
| Log scale | `log` | Data spanning orders of magnitude |
| Power scale | `pow` | Nonlinear data mapping |
| Square-root scale | `sqrt` | Compression of nonnegative data |
| String date | `time` | When the date field is a string rather than a Date object |
| Custom mapping | `ordinal` | Discrete values to discrete values |
| Gradient color | `sequential` | Continuous numeric values to color gradient |
| Segmented mapping | `threshold` | Map to colors by threshold segments |
| Equal-interval segmentation | `quantize` / `quantile` | Discretize continuous data |

### 11.2 Scale Types

| Scale | Type | Purpose |
|--------|------|------|
| Linear | `linear` | Continuous numeric mapping (default) |
| Categorical | `band` | Discrete categorical mapping (default) |
| Point | `point` | Discrete point position mapping |
| Time | `time` | Time data mapping |
| Log | `log` | Log scale |
| Power/square root | `pow` / `sqrt` | Power/square-root mapping |
| Ordinal | `ordinal` | Discrete values to discrete values mapping |
| Sequential | `sequential` | Continuous values to color gradient |
| Quantile/quantize | `quantile` / `quantize` | Discretized mapping of continuous data |
| Threshold | `threshold` | Segmented mapping by thresholds |

> **Detailed documentation**: [linear](references/scales/g2-scale-linear.md) | [band](references/scales/g2-scale-band.md) | [point](references/scales/g2-scale-point.md) | [time](references/scales/g2-scale-time.md) | [log](references/scales/g2-scale-log.md) | [pow/sqrt](references/scales/g2-scale-pow-sqrt.md) | [ordinal](references/scales/g2-scale-ordinal.md) | [sequential](references/scales/g2-scale-sequential.md) | [quantile/quantize](references/scales/g2-scale-quantile-quantize.md) | [threshold](references/scales/g2-scale-threshold.md)

---

## 12. Coordinates

Coordinates define how data maps to canvas positions; different coordinate systems produce different chart forms.

| Coordinate System | Type | Purpose |
|--------|------|------|
| Cartesian | `cartesian` | Cartesian coordinate system (default) |
| Polar coordinates | `polar` | Radar chart, Rose chart |
| Theta | `theta` | Pie chart, donut chart |
| Radial | `radial` | RadialCoordinate System,Radial bar chart |
| Transpose | `transpose` | Swap X/Y axes |
| Parallel | `parallel` | Parallel coordinates |
| Helix | `helix` | HelixCoordinate System |
| Fisheye | `fisheye` | Local magnification effect |

> **Detailed documentation**: [cartesian](references/coordinates/g2-coord-cartesian.md) | [polar](references/coordinates/g2-coord-polar.md) | [theta](references/coordinates/g2-coord-theta.md) | [radial](references/coordinates/g2-coord-radial.md) | [transpose](references/coordinates/g2-coord-transpose.md) | [parallel](references/coordinates/g2-coord-parallel.md) | [helix](references/coordinates/g2-coord-helix.md) | [fisheye](references/coordinates/g2-coord-fisheye.md)

---

## 13. Compositions / Composite Views

Compositions are used to create multi-chart layouts, such as facets and multi-view overlays.

| Composition | Type | Purpose |
|------|------|------|
| Basic view | `view` | Single-view container that combines multiple marks |
| Facet chart | `facetRect` | Split into a rectangular grid of multiple charts by dimension |
| Circular facet | `facetCircle` | Split into circular multiple charts by dimension |
| Repeat matrix | `repeatMatrix` | Multivariate combination matrix chart |
| Space layer | `spaceLayer` | Multiple layers overlaid |
| Space flex | `spaceFlex` | Flexible layout |
| Timing keyframe | `timingKeyframe` | Animation sequence |
| Geo view | `geoView` | Geographic coordinate-system view |
| Map | `geoPath` | Geographic path drawing |

> **Detailed documentation**: [view](references/compositions/g2-comp-view.md) | [facetRect](references/compositions/g2-comp-facet-rect.md) | [facetCircle](references/compositions/g2-comp-facet-circle.md) | [repeatMatrix](references/compositions/g2-comp-repeat-matrix.md) | [spaceLayer](references/compositions/g2-comp-space-layer.md) | [spaceFlex](references/compositions/g2-comp-space-flex.md) | [timingKeyframe](references/compositions/g2-comp-timing-keyframe.md) | [geoView](references/compositions/g2-comp-geoview.md) | [Map](references/compositions/g2-comp-geo-map.md)

---

## 14. Themes

Themes define the overall visual style of charts, including colors, fonts, spacing, and more.

> **Detailed documentation**: [Built-in Themes](references/themes/g2-theme-builtin.md) | [Custom Themes](references/themes/g2-theme-custom.md)

---

## 15. Palettes

Palettes define color sequences used for color mapping of categorical or continuous data.

> **Detailed documentation**: [category10](references/palette/g2-palette-category10.md) | [category20](references/palette/g2-palette-category20.md)

---

## 16. Animations

Animations enhance chart expressiveness and support enter, update, and exit animation configuration.

**⚠️ Important rule**: G2 has default animation effects built in. Do **not** add an `animate` configuration when the user has not explicitly requested animation. Only when the user explicitly describes animation requirements (such as "fade-in animation" or "wave enter") should you consult the reference documentation and add the corresponding animate configuration.

> **Detailed documentation**: [Animation Introduction](references/animations/g2-animation-intro.md) | [Animation Types](references/animations/g2-animation-types.md) | [Keyframe Animation](references/animations/g2-animation-keyframe.md)

---

## 17. Label Transforms

Label transforms handle issues such as label overlap and overflow, improving label readability.

| Transform | Type | Purpose |
|------|------|------|
| Overflow hide | `overflowHide` | Hide labels that exceed the region |
| Overlap hide | `overlapHide` | Automatically hide overlapping labels |
| Overlap dodge | `overlapDodgeY` | Offset overlapping labels in the Y direction |
| Contrast reverse | `contrastReverse` | Automatically reverse label color to ensure contrast |
| Exceed adjust | `exceedAdjust` | Adjust positions of labels beyond canvas boundaries |
| Overflow stroke | `overflowStroke` | Add stroke marks in overflow regions |

> **Detailed documentation**: [overflowHide](references/label-transform/g2-label-transform-overflow-hide.md) | [overlapHide](references/label-transform/g2-label-transform-overlap-hide.md) | [overlapDodgeY](references/label-transform/g2-label-transform-overlap-dodge-y.md) | [contrastReverse](references/label-transform/g2-label-transform-contrast-reverse.md) | [exceedAdjust](references/label-transform/g2-label-transform-exceed-adjust.md) | [overflowStroke](references/label-transform/g2-label-transform-overflow-stroke.md)

---


## 18. Patterns

Patterns are best practices for common scenarios, including migration guides, performance optimization, responsive adaptation, and more.

### 18.1 Migration Guide / Migration (v4 -> v5)

| v4 (Deprecated) | v5 (Correct) |
|-----------------|--------------|
| `chart.source(data)` | `chart.options({ data })` |
| `.position('x*y')` | `encode: { x: 'x', y: 'y' }` |
| `.color('field')` | `encode: { color: 'field' }` |
| `.adjust('stack')` | `transform: [{ type: 'stackY' }]` |
| `.adjust('dodge')` | `transform: [{ type: 'dodgeX' }]` |
| `label: {}` | `labels: [{}]` |

> **Detailed documentation**: [v4 -> v5 Migration](references/patterns/g2-pattern-v4-to-v5.md)

### 18.2 Performance Optimization / Performance

Pre-aggregate data, apply LTTB downsampling, confirm the Canvas renderer, and throttle updates for high-frequency real-time data.

| Scenario | Data Volume | Recommended Approach |
|------|--------|---------|
| Line chart | < 1,000 points | Render directly |
| Line chart | 1,000 ~ 10,000 points | Downsample to within 500 points |
| Line chart | > 10,000 points | Backend aggregation + time-range filtering |
| Scatter plot | < 5,000 points | Render directly |
| Scatter plot | 5,000 ~ 50,000 points | Canvas rendering + downsampling |

> **Detailed documentation**: [Performance Optimization](references/patterns/g2-pattern-performance.md)

### 18.3 Responsive Adaptation / Responsive

autoFit adaptation, dynamic adjustment with ResizeObserver, and mobile font/margin adaptation.

> **Detailed documentation**: [Responsive Adaptation](references/patterns/g2-pattern-responsive.md)

---
