---
id: "g2-animation-keyframe"
title: "G2 Keyframe Animation (timingKeyframe)"
description: |
  timingKeyframe is a G2 v5 composition type that plays multiple chart views in sequence,
  creating data storytelling effects.
  Each child view is a "keyframe". The system automatically interpolates transitions between frames and supports morphing animations.

library: "g2"
version: "5.x"
category: "animations"
tags:
  - "timingKeyframe"
  - "keyframe"
  - "data story"
  - "keyframe"
  - "morphing"
  - "animation"
  - "composition"

related:
  - "g2-animation-intro"
  - "g2-core-view-composition"

use_cases:
  - "Demonstrate how data changes from one chart type to another (bar chart to line chart)"
  - "Show how data evolves over time"
  - "Data journalism and visual storytelling"

difficulty: "advanced"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/composition/timing-keyframe"
---

## Minimal Runnable Example (Bar Chart to Line Chart)

```javascript
import { Chart } from '@antv/g2';

const data = [
  { month: 'Jan', value: 83 },
  { month: 'Feb', value: 60 },
  { month: 'Mar', value: 95 },
  { month: 'Apr', value: 72 },
  { month: 'May', value: 110 },
];

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'timingKeyframe',   // Keyframe composition type
  duration: 1000,           // Transition duration per frame (milliseconds)
  iterationCount: 2,        // Number of loops ('infinite' means infinite looping)
  direction: 'alternate',   // 'normal' | 'reverse' | 'alternate' | 'reverse-alternate'
  easing: 'ease-in-out-sine',
  children: [
    // Keyframe 1: bar chart
    {
      type: 'interval',
      data,
      encode: { x: 'month', y: 'value', color: 'month' },
      axis: { y: { title: 'Monthly Sales' } },
    },
    // Keyframe 2: line chart (automatic interpolation animation between the two)
    {
      type: 'line',
      data,
      encode: { x: 'month', y: 'value' },
      style: { lineWidth: 3 },
    },
  ],
});

chart.render();
```

## Multiple Keyframes (Data Update Animation)

```javascript
chart.options({
  type: 'timingKeyframe',
  duration: 800,
  iterationCount: 'infinite',
  direction: 'alternate',
  children: [
    // Keyframe 1: 2022 data
    {
      type: 'interval',
       data2022,
      encode: { x: 'city', y: 'gdp', color: 'city' },
      title: '2022 GDP',
    },
    // Keyframe 2: 2023 data (same fields, automatic morphing transition)
    {
      type: 'interval',
      data: data2023,
      encode: { x: 'city', y: 'gdp', color: 'city' },
      title: '2023 GDP',
    },
  ],
});
```

## Configuration Options

```javascript
chart.options({
  type: 'timingKeyframe',
  duration: 1000,                  // Transition duration between keyframes (milliseconds), default 1000
  iterationCount: 1,               // Number of loops, default 1; 'infinite' means infinite looping
  direction: 'normal',             // Playback direction:
                                   //   'normal' - forward
                                   //   'reverse' - reverse
                                   //   'alternate' - alternate forward and reverse
                                   //   'reverse-alternate' - alternate reverse and forward
  easing: 'ease-in-out-sine',     // Easing function, default 'ease-in-out-sine'
  children: [/* Configurations for each keyframe view */],
});
```

## Common Mistakes and Fixes

### Mistake 1: inconsistent encode field names across children frames, preventing morphing
```javascript
// Incorrect: field names are inconsistent, so correspondences cannot be recognized and morphing is lost
children: [
  { type: 'interval', encode: { x: 'month', y: 'sales' } },   // sales
  { type: 'line',     encode: { x: 'month', y: 'revenue' } }, // revenue: different name
]

// Correct: matching field names are required for smooth morphing
children: [
  { type: 'interval', encode: { x: 'month', y: 'value' } },
  { type: 'line',     encode: { x: 'month', y: 'value' } },  // Same field name
]
```

### Mistake 2: writing iterationCount as a numeric string
```javascript
// Incorrect: use the string 'infinite', not a number
chart.options({ iterationCount: Infinity });  // Incorrect

// Correct
chart.options({ iterationCount: 'infinite' });  // Correct
chart.options({ iterationCount: 3 });           // Correct, or use a concrete number
```