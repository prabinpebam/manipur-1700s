---
id: "g2-comp-timing-keyframe"
title: "G2 timingKeyframe Keyframe Animation Composition"
description: |
  timingKeyframe is a G2 v5 composition type that plays multiple chart views in sequence to create a keyframe animation.
  Each child view renders in order and automatically interpolates transitions between adjacent frames, creating a data storytelling effect.
  See g2-animation-keyframe for detailed configuration and examples.

library: "g2"
version: "5.x"
category: "compositions"
tags:
  - "timingKeyframe"
  - "keyframe animation"
  - "data storytelling"
  - "morphing"
  - "composition"
  - "animation composition"

related:
  - "g2-animation-keyframe"
  - "g2-animation-intro"
  - "g2-core-view-composition"

use_cases:
  - "Morph between chart types, such as column chart to line chart"
  - "Animate how data changes over time"
  - "Tell stories with visualization data"

difficulty: "advanced"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/composition/timing-keyframe"
---

## Core Concepts

`timingKeyframe` is a composition type. Each child is a keyframe view.
The system automatically interpolates data and graphics between adjacent keyframes to create transition animations.

For detailed configuration and examples, see [g2-animation-keyframe](./g2-animation-keyframe.md).

## Minimal Runnable Example

```javascript
import { Chart } from '@antv/g2';

const data = [
  { month: 'Jan', value: 83 },
  { month: 'Feb', value: 60 },
  { month: 'Mar', value: 95 },
];

const chart = new Chart({ container: 'container', width: 640, height: 480 });

chart.options({
  type: 'timingKeyframe',
  duration: 1000,
  iterationCount: 'infinite',
  direction: 'alternate',
  children: [
    {
      type: 'interval',
      data,
      encode: { x: 'month', y: 'value', color: 'month' },
    },
    {
      type: 'line',
      data,
      encode: { x: 'month', y: 'value' },
    },
  ],
});

chart.render();
```

## Configuration Quick Reference

```javascript
chart.options({
  type: 'timingKeyframe',
  duration: 1000,                 // Transition duration between keyframes, in milliseconds.
  iterationCount: 1,              // Number of cycles. Use 'infinite' for endless playback.
  direction: 'normal',            // 'normal' | 'reverse' | 'alternate' | 'reverse-alternate'.
  easing: 'ease-in-out-sine',     // Easing function.
  children: [/* Keyframe views. */],
});
```
