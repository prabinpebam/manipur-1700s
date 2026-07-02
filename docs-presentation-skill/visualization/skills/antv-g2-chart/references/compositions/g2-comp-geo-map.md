---
id: "g2-comp-geo-map"
title: "G2 Geographic Maps (geoView / geoPath / d3Projection)"
description: |
  G2 v5 implements geographic visualization through the geoView and geoPath composition types and d3Projection map projections.
  geoView is the geographic view container, and geoPath is the geographic path mark for drawing GeoJSON such as administrative regions.
  G2 supports multiple map projections, including geoMercator and geoNaturalEarth1.
  The data format is a GeoJSON FeatureCollection.

library: "g2"
version: "5.x"
category: "compositions"
tags:
  - "geoView"
  - "geoPath"
  - "map"
  - "GeoJSON"
  - "geographic visualization"
  - "d3Projection"
  - "choropleth"
  - "choropleth map"

related:
  - "g2-comp-geoview"
  - "g2-core-view-composition"

use_cases:
  - "Province or city distribution heat maps, such as choropleth maps"
  - "World map visualization"
  - "Display spatial distributions for geographic data"

difficulty: "advanced"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/geo/geo/#choropleth"
---

## Core Concepts

G2 geographic visualization has three core components:

| Component | Type | Description |
|------|------|------|
| `geoView` | composition | Geographic view container used to configure the projection and viewport |
| `geoPath` | mark (inside `geoView`) | Draws GeoJSON geographic paths |
| `d3Projection` | projection function | Projection functions exported from d3-geo, such as geoMercator |

## Minimal Runnable Example (World Map)

```javascript
import { Chart } from '@antv/g2';

async function renderMap() {
  // Load GeoJSON data.
  const world = await fetch(
    'https://assets.antv.antgroup.com/g2/world.json',
  ).then((res) => res.json());

  const chart = new Chart({ container: 'container', width: 900, height: 500 });

  chart.options({
    type: 'geoView',       // Geographic view container.
    data: {
      type: 'fetch',
      value: 'https://assets.antv.antgroup.com/g2/world.json',
    },
    children: [
      {
        type: 'geoPath',   // Geographic path mark.
        style: {
          fill: '#ccc',
          stroke: '#fff',
          lineWidth: 0.5,
        },
      },
    ],
  });

  chart.render();
}
renderMap();
```

## Choropleth Map

```javascript
import { Chart } from '@antv/g2';

const populationData = [
  { province: 'Guangdong', value: 12601 },
  { province: 'Shandong', value: 10169 },
  // ...
];

const chart = new Chart({ container: 'container', width: 900, height: 600 });

chart.options({
  type: 'geoView',
  children: [
    {
      type: 'geoPath',
      data: {
        type: 'fetch',
        value: 'https://assets.antv.antgroup.com/g2/china.json',
      },
      // Join GeoJSON properties with business data.
      join: {
        data: populationData,
        on: ['properties.name', 'province'],   // GeoJSON property field -> business data field.
      },
      encode: {
        color: 'value',   // Color by the value field.
      },
      style: {
        stroke: '#fff',
        lineWidth: 0.5,
      },
      scale: {
        color: {
          type: 'sequential',
          range: ['#eaf4d3', '#006d2c'],   // Color gradient range.
        },
      },
    },
  ],
});

chart.render();
```

## Custom Map Projection

```javascript
import { Chart } from '@antv/g2';
import { geoMercator, geoNaturalEarth1 } from '@antv/g2';  // d3-geo projections exported from G2.

const chart = new Chart({ container: 'container', width: 900, height: 500 });

chart.options({
  type: 'geoView',
  projection: {
    type: 'mercator',       // Built-in projection name.
    // type: 'naturalEarth1', // Natural Earth projection.
    // type: 'orthographic',  // Orthographic projection.
  },
  children: [
    {
      type: 'geoPath',
      data: { type: 'fetch', value: 'https://assets.antv.antgroup.com/g2/world.json' },
      style: { fill: '#ccc', stroke: '#fff' },
    },
  ],
});

chart.render();
```

## Built-in Projection Types

```javascript
// G2 built-in d3-geo projections are specified with projection.type.
// 'mercator'         - Mercator projection, suitable for local regions.
// 'naturalEarth1'    - Natural Earth projection, suitable for world maps.
// 'orthographic'     - Orthographic projection with a globe-like effect.
// 'equalEarth'       - Equal Earth projection.
// 'albersUsa'        - Albers USA projection.
```

## Common Errors and Fixes

### Error: geoPath is not placed inside geoView
```javascript
// Error: geoPath must be used inside geoView.
chart.options({
  type: 'geoPath',   // Cannot be used directly as a top-level type.
  data: geojson,
});

// Correct: Put geoPath in the children of geoView.
chart.options({
  type: 'geoView',
  children: [
    { type: 'geoPath', data: { type: 'fetch', value: '...' } },
  ],
});
```

### Error: Data is not in GeoJSON format
```javascript
// Error: geoPath requires a GeoJSON FeatureCollection.
chart.options({
  type: 'geoView',
  children: [{
    type: 'geoPath',
    data: [{ province: 'Guangdong', lng: 113, lat: 23 }],  // Ordinary longitude/latitude data is not valid.
  }],
});

// Correct: Use a standard GeoJSON FeatureCollection.
// GeoJSON format: { type: 'FeatureCollection', features: [...] }
chart.options({
  type: 'geoView',
  children: [{
    type: 'geoPath',
    data: { type: 'fetch', value: 'china.geojson' },
  }],
});
```
