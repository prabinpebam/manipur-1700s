---
id: "x6-plugin-export"
title: "X6 Export"
description: |
  A complete guide to exporting X6 canvas content as SVG/PNG/JPEG images.
  Covers usage of the Export plugin and the exportSVG, exportPNG, exportJPEG, toSVG, toPNG, and toJPEG APIs.

library: "x6"
version: "3.x"
category: "plugins"
subcategory: "export"
tags:
  - "export"
  - "export"
  - "SVG"
  - "PNG"
  - "JPEG"
  - "image"
  - "screenshot"
  - "download"
  - "toSVG"
  - "toPNG"
  - "exportPNG"
  - "exportSVG"
  - "dataUri"

related:
  - "x 6-core-graph-init"
  - "x6-plugins"

use_cases:
  - "Export the canvas as an SVG file"
  - "Export the canvas as a PNG image"
  - "Export the canvas as a JPEG image"
  - "Get the canvas DataURI for preview"
  - "Control the resolution and background color of exported images"

anti_patterns:
  - "Do not forget to call graph.use(new Export()) to register the plugin first"
  - "Pay attention to CORS issues when exporting content with cross-origin images"
---

# X6 Export

## Registering the Plugin

The Export plugin must be registered before export features can be used:

```javascript
import { Graph, Export } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  background: { color: '#F2F7FA' },
});

// Register the Export plugin
graph.use(new Export());
```

## Exporting as Files with Automatic Download

### exportSVG - Export an SVG File

```javascript
// Basic usage: automatically download a file named "my-graph.svg"
graph.exportSVG('my-graph');

// With options
graph.exportSVG('my-graph', {
  preserveDimensions: true,  // Use the actual graph size for SVG dimensions
  copyStyles: true,          // Copy external styles
  serializeImages: true,     // Convert images to DataURI
});
```

### exportPNG - Export a PNG File

```javascript
// Basic usage
graph.exportPNG('my-graph');

// High-resolution export with 2x resolution
graph.exportPNG('my-graph', {
  ratio: 2,
  backgroundColor: '#ffffff',
  padding: 20,
});
```

### exportJPEG - Export a JPEG File

```javascript
graph.exportJPEG('my-graph', {
  ratio: 2,
  backgroundColor: '#ffffff',
  quality: 0.92,  // Image quality, 0-1
});
```

## Getting a DataURI Without Downloading

When you need image data for preview, upload, or similar scenarios, use the `to*` methods:

### toSVG

```javascript
graph.toSVG((dataUri) => {
  // dataUri is an SVG-format data URI
  console.log(dataUri);
}, {
  preserveDimensions: true,
});
```

### toPNG

```javascript
graph.toPNG((dataUri) => {
  // dataUri is a PNG-format base64 data URI
  // It can be used in an img tag or uploaded
  const img = new Image();
  img.src = dataUri;
  document.body.appendChild(img);
}, {
  ratio: 2,
  backgroundColor: '#ffffff',
  padding: { top: 20, right: 20, bottom: 20, left: 20 },
});
```

### toJPEG

```javascript
graph.toJPEG((dataUri) => {
  console.log(dataUri);
}, {
  quality: 0.85,
  backgroundColor: '#ffffff',
});
```

## Options

### ToSVGOptions

| Option | Type | Default | Description |
|--------|------|--------|------|
| `preserveDimensions` | boolean \| Size | - | SVG dimensions: `true` uses the actual size; you can also pass `{ width, height }` |
| `viewBox` | RectangleLike | - | Custom viewBox |
| `copyStyles` | boolean | `true` | Whether to copy styles from external stylesheets |
| `stylesheet` | string | - | Custom CSS stylesheet |
| `serializeImages` | boolean | `true` | Whether to convert image href values to DataURI |
| `beforeSerialize` | Function | - | Callback for modifying SVG elements before export |

### ToImageOptions, Extending ToSVGOptions

| Option | Type | Default | Description |
|--------|------|--------|------|
| `width` | number | - | Width of the exported image |
| `height` | number | - | Height of the exported image |
| `ratio` | number | 1 | Scaling ratio, usually the device pixel ratio |
| `backgroundColor` | string | - | Background color |
| `padding` | number \| SideOptions | - | Padding |
| `quality` | number | 0.92 | JPEG quality, 0-1 |

## Complete Example

```javascript
import { Graph, Export } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
  background: { color: '#F2F7FA' },
  grid: { visible: true },
});

graph.use(new Export());

// Add nodes and edges
const source = graph.addNode({
  shape: 'rect',
  x: 40,
  y: 40,
  width: 120,
  height: 50,
  label: 'Source',
  attrs: { body: { fill: '#fff', stroke: '#8f8f8f', strokeWidth: 1, rx: 6, ry: 6 } },
});

const target = graph.addNode({
  shape: 'rect',
  x: 300,
  y: 200,
  width: 120,
  height: 50,
  label: 'Target',
  attrs: { body: { fill: '#fff', stroke: '#8f8f8f', strokeWidth: 1, rx: 6, ry: 6 } },
});

graph.addEdge({
  source,
  target,
  router: 'orth',
  connector: 'rounded',
  attrs: { line: { stroke: '#8f8f8f', strokeWidth: 1, targetMarker: 'classic' } },
});

// Export as PNG with 2x resolution
graph.exportPNG('flowchart', {
  ratio: 2,
  backgroundColor: '#ffffff',
  padding: 20,
});
```

## Key Constraints (Required)

**All export methods (toPNG / toSVG / toJPEG / exportPNG / exportSVG / exportJPEG) require the Export plugin to be registered first**; otherwise, `graph.toPNG is not a function` is thrown.

```javascript
// Correct export code template. Include these two lines whenever generating export code.
import { Graph, Export } from '@antv/x6';
const graph = new Graph({ container: 'container' });
graph.use(new Export());  // Must be called before any export method
```

**Do not:**
- Do not call methods such as toPNG/toSVG/exportPNG without registering the Export plugin
- Do not use `graph.use(Export)`; it must be `graph.use(new Export())`
- Do not call export methods before `graph.use(new Export())`

## Common Errors and Fixes

### Incorrect: Calling Export Methods Without Registering the Export Plugin

```javascript
// Incorrect: graph.toPNG is not a function / graph.exportPNG is not a function
import { Graph } from '@antv/x6';
const graph = new Graph({ container: 'container' });
graph.toPNG((dataUri) => { console.log(dataUri); }); // TypeError

// Correct: import and register Export first
import { Graph, Export } from '@antv/x6';
const graph = new Graph({ container: 'container' });
graph.use(new Export());
graph.toPNG((dataUri) => { console.log(dataUri); });
```

### Incorrect: Missing Background Color During Export

```javascript
// Incorrect: the exported image has no background and is transparent
graph.exportPNG('test');

// Correct: specify a background color
graph.exportPNG('test', { backgroundColor: '#ffffff' });
```

### Incorrect: Not Passing a Callback to toPNG/toSVG

```javascript
// Incorrect: direct calls return undefined
const dataUri = graph.toPNG(); // undefined

// Correct: pass a callback to receive the result, or use the async version
graph.toPNG((dataUri) => { console.log(dataUri); });
// Or
const dataUri = await graph.toPNGAsync({ backgroundColor: '#fff' });
```

### Incorrect: Initializing the Canvas with a DOM Container Reference Instead of an ID String

```javascript
// Incorrect: in some environments, this can cause the container to be declared more than once
const container = document.getElementById('container');
const graph = new Graph({ container });

// Recommended: use a string ID
const graph = new Graph({ container: 'container' });
```

### Incorrect: Calling graph.render(), Which Causes an Error

```javascript
// Incorrect: graph.render is not a function
graph.render();

// Correct: X6 Graph instances do not need a manual render() call
// They render automatically after all nodes and edges are added
```

### Incorrect: Not Ensuring the Plugin Is Registered Before Calling Export Methods

```javascript
// Incorrect: even if Export is imported, an error is still thrown if the plugin is not registered
import { Graph, Export } from '@antv/x6';
const graph = new Graph({ container: 'container' });
// Forgot to call graph.use(new Export());
graph.toPNG((dataUri) => { console.log(dataUri); }); // TypeError

// Correct: ensure the plugin is registered
import { Graph, Export } from '@antv/x6';
const graph = new Graph({ container: 'container' });
graph.use(new Export()); // Plugin registration is required
graph.toPNG((dataUri) => { console.log(dataUri); }); // Correct call
```

</skill>
