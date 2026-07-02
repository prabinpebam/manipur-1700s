---
id: "g2-pattern-responsive"
title: "Responsive Adaptation for G2 Charts"
description: |
  Adapt chart width, height, fonts, margins, and other settings across different screen sizes and container sizes.
  Covers autoFit configuration, dynamic adjustment with ResizeObserver, and common mobile adaptation issues.

library: "g2"
version: "5.x"
category: "patterns"
tags:
  - "responsive"
  - "responsive"
  - "adaptive"
  - "autoFit"
  - "resize"
  - "mobile"
  - "container size"

related:
  - "g2-core-chart-init"

use_cases:
  - "Automatically adjust charts as the browser window or container size changes"
  - "Use the same chart component on mobile and desktop"
  - "Embed charts in dynamically sized containers such as dialogs and sidebars"

difficulty: "intermediate"
completeness: "full"
---

## G2 Adaptive Width (autoFit)

```javascript
import { Chart } from '@antv/g2';

// Approach 1: autoFit: true (width automatically fits the container; height is fixed)
const chart = new Chart({
  container: 'container',
  autoFit: true,     // width = container width; height uses the default value
  height: 400,       // fixed height
});

chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value' },
});

chart.render();
```

## Dynamically Respond to Container Changes with ResizeObserver

```javascript
// Approach 2: listen for container size changes and manually resize the chart
const container = document.getElementById('container');
const chart = new Chart({
  container: 'container',
  width: container.clientWidth,
  height: container.clientHeight,
});

chart.options({ type: 'interval', data, encode: { x: 'month', y: 'value' } });
chart.render();

// Listen for container size changes
const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const { width, height } = entry.contentRect;
    chart.changeSize(width, height);
  }
});
resizeObserver.observe(container);

// Clean up when the page unloads
window.addEventListener('unload', () => {
  resizeObserver.disconnect();
  chart.destroy();
});
```

## Window resize Event (Simple Approach)

```javascript
// Approach 3: listen to window resize (with debounce)
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const handleResize = debounce(() => {
  const container = document.getElementById('container');
  chart.changeSize(container.clientWidth, container.clientHeight);
}, 300);

window.addEventListener('resize', handleResize);
```

## Responsive Font/Margin Adaptation for Charts

```javascript
// Dynamically adjust font size and margins based on container width
function getResponsiveConfig(containerWidth) {
  const isMobile = containerWidth < 480;
  const isTablet = containerWidth < 768;

  return {
    fontSize: isMobile ? 10 : isTablet ? 11 : 12,
    tickCount: isMobile ? 4 : isTablet ? 6 : 10,
    labelRotate: isMobile ? Math.PI / 4 : 0,   // Tilt labels on mobile
    marginBottom: isMobile ? 40 : 20,
  };
}

const containerWidth = document.getElementById('container').clientWidth;
const config = getResponsiveConfig(containerWidth);

chart.options({
  type: 'interval',
  data,
  encode: { x: 'month', y: 'value' },
  axis: {
    x: {
      labelFontSize: config.fontSize,
      labelTransform: config.labelRotate ? `rotate(${config.labelRotate}rad)` : undefined,
      tickCount: config.tickCount,
    },
    y: {
      labelFontSize: config.fontSize,
    },
  },
});
```

## Responsive Handling in React/Vue Components

```javascript
// React example (using useEffect and ref)
import { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';

function ResponsiveChart({ data }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = new Chart({
      container,
      autoFit: true,
      height: 400,
    });

    chart.options({ type: 'line', data, encode: { x: 'date', y: 'value' } });
    chart.render();
    chartRef.current = chart;

    const ro = new ResizeObserver(() => {
      chartRef.current?.forceFit();
    });
    ro.observe(container);

    return () => {
      ro.disconnect();
      chartRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    chartRef.current?.changeData(data);
  }, [data]);

  return <div ref={containerRef} style={{ width: '100%', height: 400 }} />;
}
```

## Common Mobile Adaptations

```javascript
const isMobile = window.matchMedia('(max-width: 768px)').matches;

chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value' },
  // Mobile: switch to a horizontal bar chart (category labels are easier to read)
  coordinate: isMobile ? [{ type: 'transpose' }] : undefined,
  // Mobile: reduce the number of ticks
  axis: {
    x: { tickCount: isMobile ? 4 : 8 },
    y: {
      labelFontSize: isMobile ? 10 : 12,
      title: isMobile ? null : 'Value',   // Hide the axis title on mobile to save space
    },
  },
  // Mobile: hide the legend (limited space)
  legend: isMobile ? false : { position: 'top' },
});
```

## Common Mistakes and Fixes

### Mistake 1: initializing a chart when the container has display:none

```javascript
// Problem: when the container is hidden, clientWidth = 0 and the chart size is 0
const chart = new Chart({ container: 'hidden-tab', autoFit: true });

// Fix: initialize after the container is visible, or call changeSize after showing it
container.style.display = 'block';
chart.changeSize(container.clientWidth, container.clientHeight);
```

### Mistake 2: resize fires repeatedly without debouncing, causing performance issues

```javascript
// Incorrect: redraws immediately on every resize (may fire 60 times per second)
window.addEventListener('resize', () => {
  chart.changeSize(window.innerWidth * 0.8, 400);
});

// Correct: debounce handling
window.addEventListener('resize', debounce(() => {
  chart.changeSize(window.innerWidth * 0.8, 400);
}, 300));
```