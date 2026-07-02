---
id: "g2-data-fetch"
title: "G2 Fetch Remote Data Loading"
description: |
  The Fetch data connector retrieves data from remote endpoints and supports parsing formats such as JSON and CSV.
  Enable it by setting data.type to 'fetch' so the data source can be dynamic.

library: "g2"
version: "5.x"
category: "data"
tags:
  - "fetch"
  - "remote data"
  - "JSON"
  - "CSV"
  - "data connector"
  - "connector"

related:
  - "g2-data-filter"
  - "g2-data-fold"

use_cases:
  - "Fetch dynamic data from an API"
  - "Load remote CSV files"
  - "Display monitoring data on large screens"

difficulty: "beginner"
completeness: "full"
created: "2025-03-27"
updated: "2025-03-27"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/data/fetch"
---

## Core concepts

**Fetch is a data connector, not a data transform**

- Enable it by setting `data.type: 'fetch'`
- Supports automatic parsing of JSON and CSV formats
- Remote URLs cannot include authentication configuration

## Minimal runnable example

```javascript
import { Chart } from '@antv/g2';

const chart = new Chart({ container: 'container', width: 700, height: 400 });

chart.options({
  type: 'point',
   {
    type: 'fetch',
    value: 'https://gw.alipayobjects.com/os/antvdemo/assets/data/scatter.json',
  },
  encode: {
    x: 'weight',
    y: 'height',
    color: 'gender',
  },
});

chart.render();
```

## Configuration options

| Property  | Description                                                             | Type              | Default                                      |
| --------- | ----------------------------------------------------------------------- | ----------------- | -------------------------------------------- |
| value     | Network URL requested by fetch                                          | `string`          | -                                            |
| format    | Data format of the remote file; determines how it is parsed             | `'json' \| 'csv'` | By default, inferred from the suffix after the final `.` in value |
| delimiter | Delimiter used when parsing a CSV file                                  | `string`          | `,`                                          |
| autoType  | Whether to automatically infer column data types when parsing a CSV file | `boolean`         | `true`                                       |
| transform | Transform operations applied to the loaded data                         | `DataTransform[]` | `[]`                                         |

## Loading a CSV file

```javascript
chart.options({
  type: 'line',
   {
    type: 'fetch',
    value: 'https://example.com/data.csv',
    format: 'csv',           // Specify the format
    delimiter: ',',          // Delimiter
    autoType: true,          // Automatically infer types
    transform: [
      { type: 'filter', callback: (d) => d.value > 0 },
    ],
  },
  encode: { x: 'date', y: 'value' },
});
```

## Using with transform

```javascript
chart.options({
  type: 'interval',
   {
    type: 'fetch',
    value: 'https://example.com/sales.json',
    transform: [
      { type: 'filter', callback: (d) => d.year === 2024 },
      { type: 'sortBy', fields: [['amount', false]] },
      { type: 'slice', end: 10 },
    ],
  },
  encode: { x: 'product', y: 'amount' },
});
```

## Common errors and fixes

### Error 1: The remote URL requires authentication

```javascript
// Incorrect: G2 fetch does not support authentication
data: {
  type: 'fetch',
  value: 'https://api.example.com/private-data',  // Requires a token
}

// Correct: use a public API or proxy it on the server
 {
  type: 'fetch',
  value: 'https://public-api.example.com/data',  // No authentication required
}
```

### Error 2: format does not match the file format

```javascript
// Incorrect: format does not match the actual format
data: {
  type: 'fetch',
  value: 'https://example.com/data.json',
  format: 'csv',  // The actual format is JSON
}

// Correct: let G2 infer the format automatically or specify the correct format
 {
  type: 'fetch',
  value: 'https://example.com/data.json',
  // By default, format is inferred as 'json' from the suffix
}

// Or specify it explicitly
 {
  type: 'fetch',
  value: 'https://example.com/api/data',  // No suffix
  format: 'json',  // Explicitly specified
}
```

### Error 3: CORS issues

```javascript
// Incorrect: the cross-origin request is blocked
// The browser console will show a CORS error

// Solutions:
// 1. Configure CORS headers on the server
// 2. Use same-origin requests
// 3. Use a proxy server
```
