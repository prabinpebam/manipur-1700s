---
id: "g2-scale-quantile-quantize"
title: "G2 Quantile Scale (quantile) and Quantized Scale (quantize)"
description: |
  quantile groups data by quantiles of the actual data distribution, with the same number of records in each group (equal-frequency grouping).
  quantize divides the numeric range into equal intervals, with the same interval width in each segment (equal-interval grouping).
  Both map continuous numeric values to discrete outputs, such as colors, and are commonly used for choropleth maps.
  The difference from threshold is that threshold uses manually specified breakpoints, while quantile/quantize compute them automatically.

library: "g2"
version: "5.x"
category: "scales"
tags:
  - "quantile"
  - "quantize"
  - "quantile"
  - "equal-frequency"
  - "equal-interval"
  - "scale"
  - "scale"
  - "choropleth"

related:
  - "g2-scale-threshold"
  - "g2-scale-ordinal"
  - "g2-mark-cell-heatmap"

use_cases:
  - "Choropleth maps: automatically group data by distribution with quantile"
  - "Equal-interval choropleth classification with quantize"
  - "Color classification for heatmaps"

difficulty: "intermediate"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/scale/quantile"
---

## quantile vs quantize vs threshold comparison

| Scale | Grouping method | Best suited for |
|--------|---------|---------|
| `threshold` | Manually specified breakpoints | Fixed classes with business meaning, such as 60 points as passing |
| `quantize` | Equal-width segments across the numeric range | Equal-interval classes for uniformly distributed data |
| `quantile` | Groups by quantiles of the actual data distribution | Equal-frequency classes for skewed distributions, with the same number of records in each group |

## quantile scale

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 640, height: 300 });

chart.options({
  type: 'cell',
  data,
  encode: { x: 'week', y: 'day', color: 'count' },
  scale: {
    color: {
      type: 'quantile',
      // Automatically groups by data quantiles, with the same number of records in each group.
      range: ['#ebedf0', '#c6e48b', '#7bc96f', '#196127'],
      // No domain is required; it is computed automatically from the data.
    },
  },
  style: { lineWidth: 2, stroke: '#fff' },
});
```

## quantize scale

```javascript
chart.options({
  type: 'cell',
  data,
  encode: { x: 'hour', y: 'day', color: 'value' },
  scale: {
    color: {
      type: 'quantize',
      domain: [0, 100],  // Explicit numeric range, divided into N equal-width segments.
      range: ['#fee0d2', '#fc9272', '#de2d26'],  // Three colors mean three segments.
    },
  },
});
```

## Common mistakes and fixes

### Mistake: quantile has poor visual results when data is extremely skewed; use threshold manually
```javascript
// Highly skewed data, such as 95% of records concentrated at low values. Quantile grouping is statistically valid,
// but most areas look similar and a few high-value areas are vivid, which is not intuitive.
chart.options({ scale: { color: { type: 'quantile' } } });  // Poor result for skewed data.

// For skewed data, use a log scale with sequential, or use threshold to manually set key breakpoints.
chart.options({
  scale: {
    color: {
      type: 'threshold',
      domain: [10, 100, 1000],  // Set breakpoints on a logarithmic scale.
      range: ['#eee', '#fee', '#f66', '#c00'],
    },
  },
});
```

### Mistake: quantize without a domain; it is inferred from the data and may cause boundary issues
```javascript
// Without a domain, quantize infers min/max from the data.
// New data outside the range can fall outside the color scale.
chart.options({ scale: { color: { type: 'quantize' } } });  // Depends on the data range.

// Explicitly specify a domain with business meaning.
chart.options({
  scale: { color: { type: 'quantize', domain: [0, 100] } },  // Explicit 0 to 100.
});
```
