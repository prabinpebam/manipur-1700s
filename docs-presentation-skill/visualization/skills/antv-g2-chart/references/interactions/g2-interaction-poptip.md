---
id: "g2-interaction-poptip"
title: "G2 text overflow poptip"
description: |
  The poptip interaction automatically shows a bubble tooltip with the full text
  when text in a text element is truncated because it overflows its container.
  It is suitable for cases such as overly long axis labels or incomplete annotation text, without requiring a custom tooltip.

library: "g2"
version: "5.x"
category: "interactions"
tags:
  - "poptip"
  - "text tip"
  - "overflow"
  - "bubble"
  - "truncation"
  - "interaction"

related:
  - "g2-comp-tooltip-config"
  - "g2-comp-axis-config"

use_cases:
  - "Show the full text when an X-axis category label is too long and gets truncated"
  - "Show a hover tip when text annotations inside a chart are too long"
  - "Handle text overflow automatically without manually configuring tooltip"

difficulty: "beginner"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/interaction/poptip"
---

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

// Data with very long axis labels
const data = [
  { category: 'Artificial Intelligence and Machine Learning Algorithms', value: 85 },
  { category: 'Cloud Computing Infrastructure Services', value: 72 },
  { category: 'Big Data Analytics and Visualization Platform', value: 68 },
  { category: 'Blockchain and Decentralized Applications', value: 45 },
  { category: 'Internet of Things Device Management System', value: 60 },
];

const chart = new Chart({ container: 'container', width: 640, height: 400 });

chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  axis: {
    x: {
      labelFormatter: (v) => v.length > 6 ? v.slice(0, 6) + '...' : v,  // Truncated display
    },
  },
  interaction: {
    poptip: true,   // After enabling it, hovering over a truncated label automatically shows the full text
  },
});

chart.render();
```

## Custom poptip styles

```javascript
chart.options({
  interaction: {
    poptip: {
      offsetX: 8,   // Horizontal bubble offset (px), default 8
      offsetY: 8,   // Vertical bubble offset (px), default 8
      // Bubble styles (CSS properties)
      tip: {
        backgroundColor: 'rgba(0,0,0,0.75)',
        color: '#fff',
        fontSize: '12px',
        padding: '4px 8px',
        borderRadius: '4px',
      },
    },
  },
});
```

## Common mistakes and fixes

### Mistake: poptip does not appear when text does not overflow; this is expected behavior
```javascript
// ℹ️  poptip is triggered only when text truly overflows (is truncated); non-overflowing text does not show it
// If all labels are fully displayed, no tip appears on hover
// This is by design, not a bug

// If you need to show tips for all elements, use tooltip instead
chart.options({
  tooltip: {
    items: [{ channel: 'x' }],   // Show the full X-axis value
  },
});
```
