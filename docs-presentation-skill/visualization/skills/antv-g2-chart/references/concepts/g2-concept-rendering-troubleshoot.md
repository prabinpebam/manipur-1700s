---
id: "g2-concept-rendering-troubleshoot"
title: "G2 Chart Rendering Troubleshooting Checklist"
description: |
  A troubleshooting guide for G2 v5 charts that do not display or are partially missing.
  Covers missing chart.render(), multiple chart.options() overrides, encode field-name mismatches,
  nonexistent mark types, custom HTML styles that do not take effect, and other common issues and fixes.

library: "g2"
version: "5.x"
category: "concepts"
tags:
  - "rendering failure"
  - "chart not displayed"
  - "troubleshooting"
  - "troubleshoot"
  - "debug"
  - "render"
  - "encode"
  - "field"

related:
  - "g2-core-chart-init"
  - "g2-core-view-composition"
  - "g2-comp-label-config"

use_cases:
  - "The chart did not render successfully"
  - "Part of a chart is not displayed"
  - "Metric-card or custom HTML styles do not take effect"
  - "The chart area is blank"
  - "A mark silently fails to render"

difficulty: "beginner"
completeness: "full"
created: "2025-06-04"
updated: "2025-06-04"
author: "antv-team"
---

## Quick Troubleshooting Checklist

When a chart is not displayed, check the following items in order:

| # | Check Item | Common Symptom |
|---|--------|---------|
| 1 | Missing `chart.render()` | The chart is completely blank |
| 2 | Multiple calls to `chart.options()` | Only the mark from the final call is displayed |
| 3 | `encode` field names do not match data | The mark silently fails to render |
| 4 | Using a nonexistent mark type | Runtime error or blank chart |
| 5 | `data` is not an array | The mark is silently skipped |
| 6 | Nested `view` inside `children` | The child view does not render |
| 7 | Fill color matches the background color | The graphic exists but is invisible |
| 8 | innerHTML/render style does not take effect | Custom HTML displays incorrectly |

---

## 1. Missing `chart.render()`

If `chart.render()` is not called at the end of the code, the chart will not be displayed.

```javascript
// ❌ Error: render is not called.
const chart = new Chart({ container: 'container' });
chart.options({ type: 'interval', data, encode: { x: 'x', y: 'y' } });
// The chart is blank.

// ✅ Correct: call render.
const chart = new Chart({ container: 'container' });
chart.options({ type: 'interval', data, encode: { x: 'x', y: 'y' } });
chart.render();
```

## 2. Multiple calls to `chart.options()` cause overwrite

`chart.options()` performs a **full replacement**. If it is called multiple times, only the final call takes effect.

```javascript
// ❌ Error: the first options call is completely overwritten by the second, so the column chart does not render.
chart.options({ type: 'interval', data, encode: { x: 'x', y: 'y' } });
chart.options({ type: 'line', data, encode: { x: 'x', y: 'y' } });
chart.render(); // Only the line chart is shown.

// ✅ Correct: use view + children to overlay multiple marks.
chart.options({
  type: 'view',
  data,
  children: [
    { type: 'interval', encode: { x: 'x', y: 'y' } },
    { type: 'line', encode: { x: 'x', y: 'y' } },
  ],
});
chart.render();
```

## 3. `encode` field names do not match data

G2 extracts columns with `data.map(d => d[fieldName])`. If a field name does not match, the result is an array of `undefined` values. This usually **does not throw an error**, but the mark does not render or becomes invisible.

```javascript
// ❌ Error: the data uses 'Name' and 'Score', but encode uses lowercase 'name' and 'score'.
const data = [
  { Name: 'Alex', Score: 80 },
  { Name: 'Blair', Score: 95 },
];
chart.options({
  type: 'interval',
  data,
  encode: { x: 'name', y: 'score' },  // ❌ Field-name case does not match.
});

// ✅ Correct: field names match exactly.
chart.options({
  type: 'interval',
  data,
  encode: { x: 'Name', y: 'Score' },
});
```

**Troubleshooting method**: print the keys of `data[0]` and compare them one by one with the field names referenced in `encode`.

## 4. Using a nonexistent mark type

G2 v5 supports a fixed set of mark types. Using a nonexistent type may throw an error or fail silently.

```javascript
// ❌ Error: 'bar' is not a G2 mark type.
chart.options({ type: 'bar', data, encode: { x: 'x', y: 'y' } });

// ✅ Correct: use 'interval' for a column chart and coordinate transpose for a horizontal column chart.
chart.options({
  type: 'interval',
  data,
  encode: { x: 'x', y: 'y' },
  coordinate: { transform: [{ type: 'transpose' }] },
});

// ❌ Error: 'radar' is not a G2 mark type.
chart.options({ type: 'radar', data, encode: { x: 'item', y: 'score' } });

// ✅ Correct: create a radar chart with polar coordinates plus area/line marks.
chart.options({
  type: 'view',
  data,
  coordinate: { type: 'polar' },
  children: [
    { type: 'area', encode: { x: 'item', y: 'score' }, style: { fillOpacity: 0.2 } },
    { type: 'line', encode: { x: 'item', y: 'score' }, style: { lineWidth: 2 } },
  ],
});
```

## 5. `data` is not an array

G2 internally checks `Array.isArray(data)`. If `data` is not an array, the mark returns `null` and is silently skipped.

```javascript
// ❌ Error: data is an object, not an array.
chart.options({ type: 'interval', data: { x: 'a', y: 1 }, encode: { x: 'x', y: 'y' } });

// ✅ Correct: data must be an array.
chart.options({ type: 'interval', data: [{ x: 'a', y: 1 }], encode: { x: 'x', y: 'y' } });
```

## 6. Nested `view` inside `children`

Do not place `type: 'view'` with its own `children` inside another `children` array.

```javascript
// ❌ Error: nested view inside children.
chart.options({
  type: 'view',
  children: [
    { type: 'view', children: [{ type: 'interval', ... }] },  // ❌
  ],
});

// ✅ Correct: child items should be marks directly; use spaceLayer for complex layouts.
chart.options({
  type: 'view',
  children: [
    { type: 'interval', encode: { x: 'x', y: 'y' } },
    { type: 'line', encode: { x: 'x', y: 'y' } },
  ],
});
```

## 7. Fill color matches the background color

The graphic may exist but be invisible, commonly because a white background is paired with a white fill or a dark background is paired with a dark fill.

```javascript
// ❌ Error: white background plus white fill makes the graphic invisible.
chart.options({
  type: 'interval',
  data,
  encode: { x: 'x', y: 'y' },
  style: { fill: '#fff' },
});

// ✅ Correct: use a distinct color or rely on G2's default color design.
chart.options({
  type: 'interval',
  data,
  encode: { x: 'x', y: 'y', color: 'category' },
});
```

## 8. innerHTML/render custom HTML styles do not take effect

### Problem: metric-card or custom HTML element styles appear ineffective

**Reason 1**: External CSS classes may be isolated by the container, so the style does not take effect.

```javascript
// ❌ Error: depends on an external class.
innerHTML: (d) => `<div class="card">${d.value}</div>`,

// ✅ Correct: use inline style.
innerHTML: (d) => `<div style="padding: 12px 16px; background: #f0f5ff; border-radius: 8px; font-size: 14px; font-weight: bold; color: #333;">${d.value}</div>`,
```

**Reason 2**: `fill` and `color` are easy to confuse. In innerHTML/render mode:
- `fill` controls the background color, which can default to black.
- `color` controls the text color.

```javascript
// ❌ Error: a black background covers the content.
labels: [{
  innerHTML: (d) => `<div style="padding: 4px;">${d.value}</div>`,
  style: { color: '#333' },  // Missing fill setting; the background may be black.
}]

// ✅ Correct: explicitly set fill to transparent or white.
labels: [{
  innerHTML: (d) => `<div style="padding: 4px;">${d.value}</div>`,
  style: { fill: 'rgba(0,0,0,0)', color: '#333' },
}]
```

**Reason 3**: The card has no explicit size and is compressed by its parent container.

```javascript
// ✅ Ensure the card has explicit width, height behavior, and padding.
innerHTML: (d) => `
  <div style="
    width: 120px;
    padding: 12px 16px;
    background: #f0f5ff;
    border: 1px solid #d6e4ff;
    border-radius: 8px;
    text-align: center;
  ">
    <div style="font-size: 24px; font-weight: bold; color: #1890ff;">${d.value}</div>
    <div style="font-size: 12px; color: #666; margin-top: 4px;">${d.label}</div>
  </div>
`,
```

## 9. A child mark inside `children` is not displayed

When `data` is declared at the `type: 'view'` level but a child mark references a field that does not exist in the view data, that child mark silently fails to render.

```javascript
// ❌ Error: the text mark references the field 'annotation', which does not exist in the view data.
chart.options({
  type: 'view',
  data: [{ x: 'Jan', y: 100 }, { x: 'Feb', y: 200 }],
  children: [
    { type: 'interval', encode: { x: 'x', y: 'y' } },
    { type: 'text', encode: { x: 'x', y: 'y', text: 'annotation' } }, // ❌ Field does not exist.
  ],
});

// ✅ Correct: declare separate data for a child mark when it needs a different field.
chart.options({
  type: 'view',
  data: mainData,
  children: [
    { type: 'interval', encode: { x: 'x', y: 'y' } },
    {
      type: 'text',
      data: annotationData,  // Separate data source.
      encode: { x: 'x', y: 'y', text: 'annotation' },
    },
  ],
});
```
