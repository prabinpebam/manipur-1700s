---
id: "g2-mark-venn"
title: "G2 Venn Diagram Mark"
description: |
  A Venn diagram in G2 is created by combining the path mark with the venn transform.
  It visualizes set intersections, unions, and overlap relationships.
  Common scenarios include user-segment analysis, product feature comparison, and skill-overlap analysis.

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "Venn diagram"
  - "venn"
  - "set relationships"
  - "intersection"

related:
  - "g2-mark-chord"
  - "g2-mark-sankey"

use_cases:
  - "user-group overlap analysis"
  - "product feature comparison"
  - "skill overlap analysis"

anti_patterns:
  - "For more than four sets, use another chart type."
  - "Not suitable when value differences are too large."

difficulty: "intermediate"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/mark/venn"
---

## Core concepts

A Venn diagram shows intersection relationships among sets:
- Use the `path` mark.
- Combine it with the `venn` data transform.
- Use overlap regions to show intersections.

**Data format:**
- `sets`: array of set names
- `size`: set size
- `label`: display label

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

chart.options({
  type: 'path',
  data: {
    type: 'inline',
    value: [
      { sets: ['WeChat'], size: 1200, label: 'WeChat' },
      { sets: ['Weibo'], size: 800, label: 'Weibo' },
      { sets: ['WeChat', 'Weibo'], size: 300, label: 'Overlap' },
    ],
    transform: [{ type: 'venn' }],
  },
  encode: {
    d: 'path',
    color: 'key',
  },
  labels: [
    { position: 'inside', text: (d) => d.label || '' },
  ],
  style: {
    opacity: (d) => (d.sets.length > 1 ? 0.3 : 0.7),
  },
});

chart.render();
```

## Common variants

### Three-set Venn diagram

```javascript
chart.options({
  type: 'path',
  data: {
    type: 'inline',
    value: [
      { sets: ['Frontend'], size: 12, label: 'Frontend' },
      { sets: ['Backend'], size: 15, label: 'Backend' },
      { sets: ['Design'], size: 8, label: 'Design' },
      { sets: ['Frontend', 'Backend'], size: 5, label: 'Full Stack' },
      { sets: ['Frontend', 'Design'], size: 3 },
      { sets: ['Backend', 'Design'], size: 2 },
      { sets: ['Frontend', 'Backend', 'Design'], size: 1 },
    ],
    transform: [{ type: 'venn' }],
  },
  encode: { d: 'path', color: 'key' },
});
```

### Hollow Venn diagram

```javascript
chart.options({
  type: 'path',
  data: {
    type: 'inline',
    value: [...],
    transform: [{ type: 'venn' }],
  },
  encode: {
    d: 'path',
    color: 'key',
    shape: 'hollow', // Hollow style.
  },
  style: {
    lineWidth: 3,
  },
});
```

### With interaction

```javascript
chart.options({
  type: 'path',
  data: { type: 'inline', value: [...], transform: [{ type: 'venn' }] },
  encode: { d: 'path', color: 'key' },
  state: {
    inactive: { opacity: 0.2 },
    active: { opacity: 0.9 },
  },
  interactions: [{ type: 'elementHighlight' }],
});
```

## Full type reference

```typescript
interface VennData {
  sets: string[]; // Array of set names.
  size: number; // Set size.
  label?: string; // Display label.
}

interface VennOptions {
  type: 'path';
  data: {
    type: 'inline';
    value: VennData[];
    transform: [{ type: 'venn' }];
  };
  encode: {
    d: 'path';
    color: 'key';
  };
}
```

## Venn diagram vs. other charts

| Scenario | Recommended chart |
|------|----------|
| Set intersection relationships | Venn diagram |
| Hierarchical data | Sunburst chart |
| Flow relationships | Sankey diagram |

## Common errors and fixes

### Error 1: Missing the venn transform

```javascript
// ❌ Problem: missing the venn transform.
data: { type: 'inline', value: [...] }

// ✅ Correct: add the venn transform.
data: { type: 'inline', value: [...], transform: [{ type: 'venn' }] }
```

### Error 2: Too many sets

```javascript
// ⚠️ Note: the recommended number of sets is four or fewer.
// Five or more sets can make the visualization hard to read.
```

### Error 3: Incorrect encode mapping

```javascript
// ❌ Problem: using x/y encodings.
encode: { x: 'sets', y: 'size' }

// ✅ Correct: use d to encode the path.
encode: { d: 'path', color: 'key' }
```
