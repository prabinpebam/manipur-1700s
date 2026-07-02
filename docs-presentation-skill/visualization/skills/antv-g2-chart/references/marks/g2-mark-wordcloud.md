---
id: "g2-mark-wordcloud"
title: "G2 Word Cloud (wordCloud)"
description: |
  The wordCloud mark arranges words into a cloud by frequency or weight, with higher-frequency words displayed in larger fonts.
  Data should include a text field and a weight field.
  G2's built-in word-cloud layout algorithm automatically resolves word overlap.

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "word cloud"
  - "wordCloud"
  - "text visualization"
  - "word frequency"

related:
  - "g2-mark-text"
  - "g2-core-chart-init"

use_cases:
  - "show word-frequency distribution in text data"
  - "visualize keywords in user comments"
  - "display topic popularity"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/general/other/#word-cloud"
---

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const data = [
  { word: 'Data Visualization', count: 120 },
  { word: 'Charts', count: 85 },
  { word: 'Interaction', count: 70 },
  { word: 'JavaScript', count: 95 },
  { word: 'Frontend', count: 110 },
  { word: 'AntV', count: 65 },
  { word: 'G2', count: 100 },
  { word: 'Analytics', count: 78 },
  { word: 'Users', count: 55 },
  { word: 'Experience', count: 60 },
];

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'wordCloud',
  data,
  encode: {
    text: 'word', // Word field to display.
    color: 'word', // Assign a different color to each word.
    fontSize: { // Map font size from a field to a range.
      field: 'count',
      range: [12, 60], // Minimum and maximum font sizes.
    },
  },
  layout: {
    spiral: 'archimedean', // Spiral shape: 'archimedean' or 'rectangular'.
    padding: 2, // Spacing between words.
  },
  style: {
    fontFamily: 'Impact, sans-serif',
    fontWeight: 'bold',
  },
});

chart.render();
```

## Word cloud with rotation

```javascript
chart.options({
  type: 'wordCloud',
  data,
  encode: {
    text: 'word',
    color: 'count',
    rotate: {
      // Randomly rotate some words vertically.
      callback: () => (Math.random() > 0.7 ? 90 : 0),
    },
    fontSize: { field: 'count', range: [14, 56] },
  },
  scale: {
    color: { type: 'sequential', palette: 'blues' },
  },
  layout: { padding: 4 },
});
```

## Fixed word-color grouping

```javascript
chart.options({
  type: 'wordCloud',
  data: wordsWithCategory,
  encode: {
    text: 'word',
    color: 'category', // Color by category.
    fontSize: { field: 'count', range: [16, 50] },
  },
  scale: {
    color: { type: 'ordinal', palette: 'set2' },
  },
});
```

## Common errors and fixes

### Error 1: Data has no weight field, so all words use the same size
```javascript
// ❌ Without fontSize encoding, all words have the same size.
chart.options({
  type: 'wordCloud',
  data: [{ word: 'A' }, { word: 'B' }], // ❌ No value field.
  encode: { text: 'word' },
});

// ✅ Provide a weight field and map it to fontSize.
chart.options({
  encode: {
    text: 'word',
    fontSize: { field: 'count', range: [14, 60] }, // ✅
  },
});
```

### Error 2: A small container prevents all words from being displayed
```javascript
// ❌ In a small container, the word-cloud layout may be unable to place every word.
const chart = new Chart({ container: 'container', width: 300, height: 200 }); // ❌ Too small.

// ✅ Recommended minimum size is 400×300, or 600×400 and above for many words.
const chart = new Chart({ container: 'container', width: 640, height: 480 }); // ✅
```

### Error 3: Too many words with an overly large font-size range
```javascript
// ❌ With 100+ words and a maximum font size of 80 px, large words may be dropped.
encode: { fontSize: { field: 'count', range: [20, 80] } } // ❌ Range is too large.

// ✅ Reduce the font-size range when there are many words.
encode: { fontSize: { field: 'count', range: [10, 40] } } // ✅
```
