---
id: "g2-mark-sunburst"
title: "G2 Sunburst Chart (sunburst)"
description: |
  The sunburst mark uses concentric rings in polar coordinates to visualize multilevel hierarchical data. It is provided by the @antv/g2-extension-plot extension.
  Radial depth represents hierarchy level, while arc length or angle represents value magnitude.
  Note: sunburst and partition are separate marks: sunburst uses a radial ring layout and requires the extension, while partition uses a rectangular icicle layout in Cartesian coordinates and is part of G2 core.

library: "g2"
version: "5.x"
category: "marks"
tags:
  - "sunburst chart"
  - "sunburst"
  - "hierarchy"
  - "multilevel"
  - "hierarchical data"
  - "polar coordinates"
  - "g2-extension-plot"

related:
  - "g2-mark-partition"
  - "g2-mark-treemap"
  - "g2-mark-arc-pie"

use_cases:
  - "visualize organizational structures"
  - "analyze item hierarchies"
  - "show hierarchical budget allocation proportions"

anti_patterns:
  - "For hierarchies deeper than four levels, consider a treemap or partition chart."
  - "Do not create a sunburst by adding polar coordinates to type: 'partition'; use type: 'sunburst' directly."
  - "Do not pass data as an array; sunburst data should be a { value: treeRoot } object."

difficulty: "intermediate"
completeness: "full"
created: "2025-03-26"
updated: "2025-04-27"
author: "antv-team"
source_url: "https://g2.antv.antgroup.com/manual/core/mark/sunburst"
---

## Partition vs. sunburst comparison

| Feature | sunburst (sunburst chart) | partition (rectangular partition) |
|------|-------------------|----------------------|
| Source | `@antv/g2-extension-plot`; requires `extend` | `@antv/g2` core; no extension required |
| Coordinate system | Polar coordinates (concentric circles) | Cartesian coordinates |
| Visual form | Concentric rings | Rectangular icicle layout |
| Data format | `{ value: treeRoot }` or fetch | Array `[treeRoot]` or fetch |
| Callback path | `d.path` is a **string**, such as `'A / B / C'` | `d.path` is an **array**, such as `['A', 'B', 'C']` |

## Import the extension (required)

```javascript
import { plotlib } from '@antv/g2-extension-plot';
import { Runtime, corelib, extend } from '@antv/g2';

const Chart = extend(Runtime, { ...corelib(), ...plotlib() });
```

## Minimal runnable example

```javascript
import { plotlib } from '@antv/g2-extension-plot';
import { Runtime, corelib, extend } from '@antv/g2';

const Chart = extend(Runtime, { ...corelib(), ...plotlib() });

const chart = new Chart({ container: 'container', autoFit: true });

chart.options({
  type: 'sunburst',
  data: {
    type: 'fetch',
    value: 'https://gw.alipayobjects.com/os/antvdemo/assets/data/sunburst.json',
  },
  encode: { value: 'sum' },
  labels: [
    {
      text: 'name',
      transform: [{ type: 'overflowHide' }],
    },
  ],
});

chart.render();
```

## Data format notes

`sunburst` data must be a `{ value: treeRoot }` object that contains one tree, not an array:

```javascript
// ✅ Correct: inline data with a single tree-root object.
chart.options({
  type: 'sunburst',
  data: {
    value: {
      name: 'root',
      children: [
        { name: 'Group 1', children: [{ name: 'Group 1-1', sum: 100 }] },
        { name: 'Group 2', sum: 200 },
      ],
    },
  },
  encode: { value: 'sum' },
});

// ✅ Correct: remote fetch.
chart.options({
  type: 'sunburst',
  data: { type: 'fetch', value: 'https://example.com/tree.json' },
  encode: { value: 'sum' },
});

// ❌ Error: do not pass an array directly; that is the partition syntax.
chart.options({
  type: 'sunburst',
  data: [{ name: 'root', children: [...] }], // ❌ Does not work.
});
```

## Callback data

After sunburst data is flattened, the callback parameter `d` has this shape:

```javascript
{
  name: 'Group 1-1', // Node name.
  value: 100, // Node value, usually the subtree total.
  depth: 2, // Hierarchy depth; the root node starts at 1.
  path: 'Group 1 / Group 1-1', // The path is a string separated by " / ".
  'ancestor-node': 'Group 1', // Name of the first node in the layer.
  x: [x0, x1],
  y: [y0, y1],
}
```

**Note**: `path` is a **string** separated by ` / `, unlike the array path used by partition.

## Encode coloring strategies

After flattening, sunburst records include built-in fields such as `name`, `depth`, `path`, and `ancestor-node`, so these fields can be referenced by string. Custom fields from the original data are not always present on the flattened record; use callbacks when you need to derive color from the path or other computed data.

```javascript
// ✅ Default coloring: by ancestor-node, so the same group shares a color.
encode: { value: 'sum' } // color defaults to 'ancestor-node'.

// ✅ Color by the built-in name field.
encode: { value: 'sum', color: 'name' }

// ✅ Color by the first two path levels with a callback.
encode: {
  value: 'sum',
  color: (d) => {
    const parts = d.path.split(' / ');
    return [parts[0], parts[1]].join('/');
  },
}

// ✅ Color by hierarchy depth.
encode: { value: 'sum', color: (d) => d.depth }
```

## Polar coordinate customization

```javascript
// Adjust the inner and outer radius.
chart.options({
  type: 'sunburst',
  data: { value: treeData },
  encode: { value: 'sum' },
  coordinate: {
    type: 'polar',
    innerRadius: 0.3, // Default is 0.2.
    outerRadius: 0.9,
  },
});

// To use Cartesian coordinates, use partition instead for a rectangular layout.
coordinate: { type: 'cartesian' }
```

## Drill-down interaction

```javascript
chart.options({
  type: 'sunburst',
  data: { value: treeData },
  encode: { value: 'sum' },
  interaction: {
    drillDown: {
      breadCrumb: {
        rootText: 'All',
        style: { fontSize: '14px', fill: '#333' },
        active: { fill: 'red' },
      },
      isFixedColor: true, // Keep colors stable after drill-down.
    },
  },
});
```

## Common errors and fixes

### Error 1: The extension library is not imported
```javascript
// ❌ Error: using Chart from '@antv/g2' directly does not register sunburst.
import { Chart } from '@antv/g2';
chart.options({ type: 'sunburst', ... }); // ❌ Unknown mark type: sunburst.

// ✅ Correct: register plotlib through extend.
import { plotlib } from '@antv/g2-extension-plot';
import { Runtime, corelib, extend } from '@antv/g2';
const Chart = extend(Runtime, { ...corelib(), ...plotlib() });
```

### Error 2: Data uses the partition array format
```javascript
// ❌ Error: sunburst data is not an array.
chart.options({
  type: 'sunburst',
  data: [{ name: 'root', children: [...] }],
});

// ✅ Correct: use a { value: root } object.
chart.options({
  type: 'sunburst',
  data: { value: { name: 'root', children: [...] } },
});
```

### Error 3: Treating the path as an array
```javascript
// ❌ Error: sunburst path is a string; this returns the second character, not the second path level.
color: (d) => d.path[1]

// ✅ Correct: split the path first.
color: (d) => d.path.split(' / ')[1]
```
