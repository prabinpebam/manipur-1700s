---
id: "g2-mark-gantt"
title: "G2 Gantt Chart Mark"
description: |
  Gantt chart Mark. It uses the interval mark with a transpose coordinate system to show project task schedules.
  It is suitable for project management, task scheduling, progress tracking, and similar scenarios.

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "Gantt chart"
  - "gantt"
  - "project management"
  - "progress"

related:
  - "g2-mark-interval-basic"
  - "g2-comp-slider"

use_cases:
  - "Project progress management"
  - "Task scheduling"
  - "Resource management"

anti_patterns:
  - "Not suitable for non-time-dimensional data"
  - "Use a line chart for continuous numeric changes"

difficulty: "beginner"
completeness: "full"
created: "2025-03-26"
updated: "2025-03-26"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/mark/gantt"
---

## Core concepts

A Gantt chart shows the schedule of project tasks:
- Uses the `interval` mark
- Works with the `transpose` coordinate transform
- `y` and `y1` represent the start and end times

**Key elements:**
- Task name: mapped to the horizontal axis
- Start time: mapped to `y`
- End time: mapped to `y1`

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  theme: 'classic',
});

chart.options({
  type: 'interval',
  autoFit: true,
  data: [
    { name: 'Event planning', startTime: 1, endTime: 4 },
    { name: 'Venue planning', startTime: 3, endTime: 13 },
    { name: 'Select vendor', startTime: 5, endTime: 8 },
  ],
  encode: {
    x: 'name',
    y: 'startTime',
    y1: 'endTime',
    color: 'name',
  },
  coordinate: {
    transform: [{ type: 'transpose' }],
  },
});

chart.render();
```

## Common variants

### With project phases

```javascript
chart.options({
  type: 'interval',
  data: [
    { name: 'Requirements analysis', startTime: 1, endTime: 5, phase: 'Planning' },
    { name: 'System design', startTime: 4, endTime: 10, phase: 'Design' },
    { name: 'Frontend development', startTime: 8, endTime: 20, phase: 'Development' },
  ],
  encode: {
    x: 'name',
    y: 'startTime',
    y1: 'endTime',
    color: 'phase',  // Color by phase
  },
  coordinate: { transform: [{ type: 'transpose' }] },
});
```

### With temporal animation

```javascript
chart.options({
  type: 'interval',
  data,
  encode: {
    x: 'name',
    y: 'startTime',
    y1: 'endTime',
    color: 'name',
    enterDuration: (d) => (d.endTime - d.startTime) * 200,
    enterDelay: (d) => d.startTime * 100,
  },
  coordinate: { transform: [{ type: 'transpose' }] },
});
```

### With milestones

```javascript
chart.options({
  type: 'view',
  children: [
    {
      type: 'interval',
      data: tasks,
      encode: { x: 'name', y: 'startTime', y1: 'endTime' },
      coordinate: { transform: [{ type: 'transpose' }] },
    },
    {
      type: 'point',
      data: milestones,
      encode: {
        x: 'name',
        y: 'time',
        shape: 'diamond',
        size: 8,
      },
      coordinate: { transform: [{ type: 'transpose' }] },
    },
  ],
});
```

## Complete type reference

```typescript
interface GanttData {
  name: string;        // Task name
  startTime: number;   // Start time
  endTime: number;     // End time
  phase?: string;      // Project phase
}

interface GanttOptions {
  type: 'interval';
  encode: {
    x: string;         // Task-name field
    y: string;         // Start-time field
    y1: string;        // End-time field
    color?: string;    // Color field
  };
  coordinate: {
    transform: [{ type: 'transpose' }];
  };
}
```

## Gantt chart vs. bar chart

| Feature | Gantt chart | Bar chart |
|------|--------|--------|
| Use case | Task scheduling | Value comparison |
| Data dimension | Time interval | Single value |
| Visual form | Horizontal bars | Vertical columns |

## Common errors and fixes

### Error 1: missing transpose

```javascript
// ❌ Issue: default orientation is vertical
coordinate: {}

// ✅ Correct: add transpose
coordinate: { transform: [{ type: 'transpose' }] }
```

### Error 2: missing y1 encoding

```javascript
// ❌ Issue: only a start time
encode: { x: 'name', y: 'startTime' }

// ✅ Correct: add an end time
encode: { x: 'name', y: 'startTime', y1: 'endTime' }
```

### Error 3: too many tasks

```javascript
// ⚠️ Note: recommended task count is no more than 20
// Too many tasks make the chart crowded
```
