---
id: "g2-concept-chart-selection"
title: "G2 Chart Type Selection Guide"
description: |
  Choose the right chart type based on data characteristics and analytical goals.
  Covers six common scenarios: comparison, trend, part-to-whole, distribution,
  correlation, and relationships, with corresponding G2 implementations and
  guidance to avoid common chart-selection mistakes.

library: "g2"
version: "5.x"
category: "concepts"
tags:
  - "chart selection"
  - "chart types"
  - "visualization design"
  - "column chart"
  - "line chart"
  - "pie chart"
  - "scatterplot"
  - "decision making"

related:
  - "g2-concept-visual-channels"
  - "g2-mark-interval-basic"
  - "g2-mark-line-basic"
  - "g2-mark-arc-pie"
  - "g2-mark-point-scatter"

use_cases:
  - "Choose the correct chart type for a user requirement"
  - "Avoid using pie charts or line charts in unsuitable scenarios"
  - "Understand when to use G2 charts versus G6 graph analysis"

difficulty: "beginner"
completeness: "full"
created: "2024-01-01"
updated: "2025-03-01"
author: "antv-team"
---

## Core Decision Tree

```
What are your data and analytical goal?

├── Compare values across categories -> column chart / bar chart
├── Show change over time -> line chart / area chart
├── Show parts of a whole -> pie chart / donut chart / stacked column chart
├── Show correlation between two variables -> scatterplot / bubble chart
├── Show the distribution of data -> histogram / boxplot / violin plot
└── Show relationships between nodes -> G6 graph (force/dagre/tree layout)
```

## Scenario 1: Comparison

**Goal**: Compare values across categories or time points.

| Data Characteristics | Recommended Chart | G2 Implementation |
|---------|---------|---------|
| Up to 10 categories with readable vertical labels | **column chart** | `type: 'interval'` |
| Long category names or many categories | **bar chart** (horizontal) | `type: 'interval'` + `coordinate: { transform: [{ type: 'transpose' }] }` |
| Multiple series compared side by side | **grouped column chart** | `transform: [{ type: 'dodgeX' }]` |
| Show how subcategories contribute to totals | **stacked column chart** | `transform: [{ type: 'stackY' }]` |

```javascript
// Column chart: the most common chart for comparisons.
chart.options({
  type: 'interval',
  data,
  encode: { x: 'category', y: 'value', color: 'category' },
  transform: [{ type: 'sortX', by: 'y', reverse: true }],  // Sort by value in descending order.
});
```

## Scenario 2: Trend

**Goal**: Show how values change over time or another ordered sequence.

| Data Characteristics | Recommended Chart | G2 Implementation |
|---------|---------|---------|
| One metric over time | **line chart** | `type: 'line'` |
| Multiple metrics or series over time | **multi-series line chart** | `type: 'line'` + `encode.color: 'series'` |
| Emphasize area or cumulative quantity | **area chart** | `type: 'area'` |
| Show increases and decreases over time | **stacked area chart** | `type: 'area'` + `transform: [{ type: 'stackY' }]` |

```javascript
// Multi-series line chart.
chart.options({
  type: 'line',
  data,
  encode: { x: 'date', y: 'value', color: 'series' },
  labels: [{ text: 'series', selector: 'last', position: 'right' }],
});
```

## Scenario 3: Part-to-Whole

**Goal**: Show each part's proportion of a whole.

| Data Characteristics | Recommended Chart | G2 Implementation | Note |
|---------|---------|---------|------|
| Up to 5 categories, with emphasis on proportions | **pie chart** | `interval` + `theta` coordinate | Hard to distinguish when there are many categories |
| Need a blank center | **donut chart** | pie chart + `innerRadius` | The total can be displayed in the center |
| Many categories, with emphasis on rank | **100% stacked column chart** | `stackY` + `normalizeY` | |
| Hierarchical part-to-whole data | **sunburst chart** | Use a `sunburst` plugin when available | |

```javascript
// Pie chart for five or fewer categories.
chart.options({
  type: 'interval',
  data,
  encode: { y: 'value', color: 'category' },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'theta', outerRadius: 0.85 },
  labels: [{
    text: (d) => `${d.category}\n${d.pct}%`,
    position: 'outside',
    connector: true,
  }],
});
```

## Scenario 4: Correlation

**Goal**: Explore relationships between two or more variables.

| Data Characteristics | Recommended Chart | G2 Implementation |
|---------|---------|---------|
| Two quantitative variables | **scatterplot** | `type: 'point'` |
| Two quantitative variables plus a third quantitative dimension | **bubble chart** | `point` + `encode.size` |
| Multivariate matrix | **heatmap** | `type: 'cell'` |
| Distribution plus correlation | **scatterplot + trend line** | `view` + `point` + `line` |

```javascript
// Bubble chart.
// Color mapping table: scale.color.range and fill use the same values.
const COLOR_MAP = { 'Asia': '#fb7678', 'Europe': '#81e7ee', 'Americas': '#5B8FF9' };

chart.options({
  type: 'point',
  data,
  encode: {
    x: 'income',
    y: 'happiness',
    size: 'population',  // Third quantitative dimension.
    color: 'region',
    shape: 'point',
  },
  scale: {
    size: { type: 'sqrt', range: [4, 40] },    // Square-root scale with an appropriate bubble-size range.
    color: { range: Object.values(COLOR_MAP) },
  },
  style: {
    fillOpacity: 0.85,
    lineWidth: 0,
    // Radial gradient from a white center to the mapped edge color to simulate a 3D sphere.
    // Read the color from COLOR_MAP[datum.region] and keep it consistent with scale.color.range.
    fill: (datum) => {
      const color = COLOR_MAP[datum.region];
      return `radial-gradient(circle at 35% 35%, rgb(255,255,255) 0%, ${color} 100%)`;
    },
    shadowBlur: 10,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffsetY: 5,
  },
  legend: { size: false },
});
```

## Scenario 5: Distribution

**Goal**: Understand the distribution pattern of a dataset.

| Data Characteristics | Recommended Chart | G2 Implementation |
|---------|---------|---------|
| Single-variable distribution | **histogram** | `type: 'interval'` + `transform: [{ type: 'binX' }]` |
| Distribution comparison across groups | **boxplot** | `type: 'boxplot'` |
| Show median and quartiles | **boxplot** | `type: 'boxplot'` |

```javascript
// Histogram.
chart.options({
  type: 'interval',
  data,
  encode: { x: 'value', y: 'count' },
  transform: [{ type: 'binX', y: 'count' }],
});
```

## Scenario 6: Relationship Network

**Goal**: Show connections, hierarchy, or flow between entities.

| Data Characteristics | Recommended Library | G6 Layout |
|---------|--------|---------|
| Non-hierarchical network relationships | **G6** | `force` (force-directed) |
| Directed flows or dependencies | **G6** | `dagre` (directed acyclic graph) |
| Single-root tree hierarchy | **G6** | `compactBox` (tree) |
| Peer-to-peer circular relationships | **G6** | `circular` (circular) |

```javascript
// G6 knowledge graph with a force-directed layout.
const graph = new Graph({
  layout: { type: 'force', preventOverlap: true },
  data: { nodes, edges },
});
await graph.render();
```

## Quick Selection Mnemonic

```
Use columns for comparison and lines for trends.
Use pies for part-to-whole, scatterplots for correlation,
histograms for distributions, trees for hierarchies,
G6 for networks, and compositions for complex layouts.
```

## Common Mistakes

### Error 1: Using a line chart for unordered categorical data

```javascript
// ❌ Misuse: city names have no inherent order, so a line chart creates a misleading trend.
chart.options({
  type: 'line',
  data: [{ city: 'Beijing', gdp: 3.6 }, { city: 'Shanghai', gdp: 4.3 }],
  encode: { x: 'city', y: 'gdp' },   // ❌ city is an unordered category, not a time series.
});

// ✅ Correct: use a column chart for category comparisons.
chart.options({
  type: 'interval',
  encode: { x: 'city', y: 'gdp' },
});
```

### Error 2: Using a pie chart for eight or more categories

```javascript
// ❌ Misuse: a pie chart with 10 categories is hard to read.
chart.options({
  type: 'interval',
  coordinate: { type: 'theta' },
  // If there are 10 countries or regions, the slices are difficult to compare.
});

// ✅ Correct: use a sorted bar chart for more than five categories.
chart.options({
  type: 'interval',
  encode: { x: 'country', y: 'value' },
  coordinate: { transform: [{ type: 'transpose' }] },
  transform: [{ type: 'sortX', by: 'y', reverse: true }],
});
```
