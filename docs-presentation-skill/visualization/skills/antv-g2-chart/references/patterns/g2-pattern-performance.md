---
id: "g2-pattern-performance"
title: "G2 Performance Optimization for Large Data Volumes"
description: |
  Performance optimization strategies for handling large data volumes in G2: data pre-aggregation, LTTB downsampling,
  Canvas renderer verification, throttled updates for high-frequency real-time data, and more.
  Provides reference data-volume thresholds for each scenario and concrete optimization approaches.

library: "g2"
version: "5.x"
category: "patterns"
tags:
  - "performance optimization"
  - "performance"
  - "large data"
  - "Canvas"
  - "downsampling"
  - "aggregation"

related:
  - "g2-core-chart-init"
  - "g2-data-transform-patterns"

use_cases:
  - "Optimize charts when the data volume exceeds tens of thousands of records"
  - "High-frequency update scenarios for real-time data streams"

difficulty: "advanced"
completeness: "full"
---

## Data Volume Threshold Reference

| Scenario | Data volume | Recommended approach |
|------|--------|---------|
| Line chart | < 1,000 points | Render directly |
| Line chart | 1,000 to 10,000 points | Downsample to fewer than 500 points |
| Line chart | > 10,000 points | Backend aggregation + time-range filtering |
| Scatter plot | < 5,000 points | Render directly |
| Scatter plot | 5,000 to 50,000 points | Enable Canvas rendering + downsampling |

## Data Pre-Aggregation (Most Important Optimization)

```javascript
// 100,000 daily-granularity records -> aggregate into 365 monthly-granularity records
function aggregateTimeSeries(data, dateKey, valueKey, granularity = 'month') {
  const getGroupKey = (dateStr) => {
    const d = new Date(dateStr);
    if (granularity === 'month') {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }
    if (granularity === 'quarter') {
      return `${d.getFullYear()}-Q${Math.ceil((d.getMonth() + 1) / 3)}`;
    }
    return d.getFullYear().toString();
  };

  const groups = {};
  data.forEach(d => {
    const key = getGroupKey(d[dateKey]);
    if (!groups[key]) groups[key] = { date: key, sum: 0, count: 0, min: Infinity, max: -Infinity };
    groups[key].sum += d[valueKey];
    groups[key].count += 1;
    groups[key].min = Math.min(groups[key].min, d[valueKey]);
    groups[key].max = Math.max(groups[key].max, d[valueKey]);
  });

  return Object.values(groups)
    .map(g => ({ date: g.date, value: g.sum / g.count, min: g.min, max: g.max }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

chart.options({
  data: aggregateTimeSeries(rawData, 'timestamp', 'value'),
  type: 'line',
  encode: { x: 'date', y: 'value' },
});
```

## Line Chart Downsampling (LTTB Algorithm)

```javascript
// Largest Triangle Three Buckets (LTTB) downsampling
// Preserve the N most visually important points while maintaining the line shape
function lttb(data, threshold) {
  const dataLength = data.length;
  if (threshold >= dataLength || threshold === 0) return data;

  const sampled = [];
  let sampledIndex = 0;
  const bucketSize = (dataLength - 2) / (threshold - 2);
  let a = 0;
  sampled[sampledIndex++] = data[a];

  for (let i = 0; i < threshold - 2; i++) {
    const rangeStart = Math.floor((i + 1) * bucketSize) + 1;
    const rangeEnd = Math.min(Math.floor((i + 2) * bucketSize) + 1, dataLength);

    let avgX = 0, avgY = 0;
    const avgRangeStart = Math.floor((i + 1) * bucketSize) + 1;
    const avgRangeEnd = Math.min(Math.floor((i + 2) * bucketSize) + 1, dataLength);
    for (let j = avgRangeStart; j < avgRangeEnd; j++) {
      avgX += data[j].x;
      avgY += data[j].y;
    }
    avgX /= (avgRangeEnd - avgRangeStart);
    avgY /= (avgRangeEnd - avgRangeStart);

    let maxArea = -1;
    let nextA = rangeStart;
    const pointAX = data[a].x;
    const pointAY = data[a].y;
    for (let j = rangeStart; j < rangeEnd; j++) {
      const area = Math.abs(
        (pointAX - avgX) * (data[j].y - pointAY) -
        (pointAX - data[j].x) * (avgY - pointAY)
      );
      if (area > maxArea) { maxArea = area; nextA = j; }
    }
    sampled[sampledIndex++] = data[nextA];
    a = nextA;
  }
  sampled[sampledIndex++] = data[dataLength - 1];
  return sampled;
}

// Downsample 10,000 points to 500 points
const sampledData = lttb(rawData, 500);
chart.options({  sampledData, type: 'line', encode: { x: 'x', y: 'y' } });
```

## Confirm Canvas Renderer Usage

```javascript
// G2 uses Canvas rendering by default, which is much faster than SVG
// For large data volumes, confirm it has not been switched to SVG
const chart = new Chart({
  container: 'container',
  renderer: 'canvas',   // Default; 5-10x faster than SVG for large data volumes
  width: 800,
  height: 400,
});
```

## Optimizing High-Frequency Real-Time Data Updates

```javascript
// Throttle with requestAnimationFrame (update at most once per frame)
let pendingData = null;
let rafId = null;

function updateChart(newData) {
  pendingData = newData;

  if (!rafId) {
    rafId = requestAnimationFrame(() => {
      if (pendingData) {
        chart.changeData(pendingData);
        pendingData = null;
      }
      rafId = null;
    });
  }
}

// Simulate a real-time data stream (new data every 100 ms)
setInterval(() => {
  const newPoint = { time: Date.now(), value: Math.random() * 100 };
  updateChart([...currentData.slice(-500), newPoint]);  // Keep only the most recent 500 points
}, 100);
```

## Common Mistakes and Fixes

```javascript
// Incorrect: passing 100,000 rows directly to G2 freezes the page
chart.options({ data: tenThousandRows });

// Correct: aggregate/downsample to a reasonable amount (< 1000 points) first
chart.options({ data: aggregateTimeSeries(tenThousandRows, 'date', 'value') });
```