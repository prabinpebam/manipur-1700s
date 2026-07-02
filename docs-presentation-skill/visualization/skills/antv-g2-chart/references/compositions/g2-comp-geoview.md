---
id: "g2-comp-geoview"
title: "G2 Geographic View (geoView)"
description: |
  geoView draws map visualizations in G2 using D3 geographic projections.
  It supports multiple projection methods, including mercator, equalEarth, and orthographic.
  Data must be in GeoJSON format, and geographic shapes are rendered with the geoPath mark.

library: "g2"
version: "5.x"
category: "compositions"
tags:
  - "geoView"
  - "map"
  - "geography"
  - "GeoJSON"
  - "choropleth"
  - "geographic projection"
  - "composition"

related:
  - "g2-mark-cell-heatmap"
  - "g2-scale-threshold"

use_cases:
  - "Color a world map as a choropleth map"
  - "Display country or province data on a map"
  - "Visualize geospatial data"

difficulty: "advanced"
completeness: "full"
created: "2025-03-24"
updated: "2025-03-24"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/examples/geo/geo/#choropleth"
---

## Minimal Runnable Example (World Map)

```javascript
import { Chart } from '@antv/g2';

// Load world.geo.json data in advance.
fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
  .then(res => res.json())
  .then(world => {
    // Convert TopoJSON to GeoJSON. This requires topojson-client.
    const countries = topojson.feature(world, world.objects.countries);

    const chart = new Chart({ container: 'container', width: 900, height: 500 });

    chart.options({
      type: 'geoView',
      coordinate: {
        type: 'projection',
        projection: 'equalEarth',   // Projection method.
      },
      children: [
        {
          type: 'geoPath',
          data: countries,
          encode: { color: 'id' },   // Color by country id.
          style: {
            stroke: '#fff',
            lineWidth: 0.5,
            fillOpacity: 0.85,
          },
        },
      ],
    });

    chart.render();
  });
```

## Data-Linked Coloring (Choropleth)

```javascript
// Join GeoJSON with a data table by name to implement data-driven coloring.
const gdpData = {
  CN: 17.7, US: 25.5, JP: 4.2, DE: 4.1,
  // ...
};

chart.options({
  type: 'geoView',
  coordinate: { type: 'projection', projection: 'mercator' },
  children: [
    {
      type: 'geoPath',
      data: geoJsonFeatures,
      encode: {
        color: (d) => gdpData[d.properties.iso_a2] || 0,  // Join GDP data.
      },
      scale: {
        color: {
          type: 'sequential',
          palette: 'blues',
          unknown: '#eee',   // Color for countries without data.
        },
      },
      tooltip: {
        items: [
          { field: 'properties.name', name: 'Country' },
          { callback: (d) => gdpData[d.properties.iso_a2], name: 'GDP (trillion USD)' },
        ],
      },
    },
  ],
});
```

## Supported Projection Methods

```javascript
// Common projections.
coordinate: { type: 'projection', projection: 'mercator' }       // Mercator, the standard projection for web maps.
coordinate: { type: 'projection', projection: 'equalEarth' }     // Equal Earth projection.
coordinate: { type: 'projection', projection: 'orthographic' }   // Orthographic projection with a globe-like appearance.
coordinate: { type: 'projection', projection: 'naturalEarth1' }  // Natural Earth projection.
coordinate: { type: 'projection', projection: 'albersUsa' }      // Albers USA projection.
```

## Common Errors and Fixes

### Error: Data is not in GeoJSON format because statistical data is passed directly
```javascript
// geoPath marks require GeoJSON Feature or FeatureCollection data.
chart.options({
  children: [{
    type: 'geoPath',
    data: [{ country: 'China', gdp: 17.7 }],  // This is not GeoJSON.
  }],
});

// GeoJSON format is required.
chart.options({
  children: [{
    type: 'geoPath',
    data: { type: 'FeatureCollection', features: [...] },
  }],
});
```
