---
id: "x6-core-node"
title: "X6 Node Configuration and Customization"
description: |
  Creating X6 nodes, built-in shapes, style configuration, and custom node registration.
  Includes built-in nodes such as rect/circle/polygon/html and custom extension approaches.

library: "x6"
version: "3.x"
category: "core"
subcategory: "node"
tags:
  - "node"
  - "shape"
  - "rect"
  - "circle"
  - "ellipse"
  - "polygon"
  - "html"
  - "custom node"
  - "register node"
  - "register"
  - "attrs"
  - "label"
  - "diamond"

related:
  - "x6-core-graph-init"
  - "x6-core-ports"
  - "x6-core-edge"

use_cases:
  - "Add rectangular, circular, and elliptical nodes"
  - "Create diamond decision nodes"
  - "Register custom shapes"
  - "Create HTML rich-text nodes"
  - "Set node styles and labels"
  - "Dynamically modify node attributes"

anti_patterns:
  - "Do not use CSS property names; use SVG attributes"
  - "Do not omit x/y coordinates"

difficulty: "beginner"
completeness: "full"
---

## Adding Nodes

```javascript
const node = graph.addNode({
  shape: 'rect',          // Shape type
  x: 100,                 // Top-left X coordinate
  y: 60,                  // Top-left Y coordinate
  width: 120,             // Width
  height: 50,             // Height
  label: 'Hello',         // Label text (shorthand)
  attrs: {                // SVG attributes
    body: {
      fill: '#fff',
      stroke: '#8f8f8f',
      strokeWidth: 1,
      rx: 6,              // Corner radius X
      ry: 6,              // Corner radius Y
    },
    label: {
      text: 'Hello',     // Equivalent to the outer label
      fontSize: 14,
      fill: '#333',
    },
  },
});
```

## Built-in Node Shapes

### rect (Rectangle) - Most Common

```javascript
graph.addNode({
  shape: 'rect',
  x: 40, y: 40,
  width: 100, height: 40,
  label: 'Rect Node',
  attrs: {
    body: { fill: '#fff', stroke: '#8f8f8f', strokeWidth: 1, rx: 6, ry: 6 },
  },
});
```

### circle (Circle)

```javascript
graph.addNode({
  shape: 'circle',
  x: 200, y: 100,
  width: 60, height: 60,   // For circles, width = height = diameter
  label: 'Start',
  attrs: {
    body: { fill: '#f6ffed', stroke: '#52c41a', strokeWidth: 2 },
  },
});
```

### ellipse (Ellipse)

```javascript
graph.addNode({
  shape: 'ellipse',
  x: 100, y: 100,
  width: 120, height: 60,
  label: 'Ellipse',
  attrs: {
    body: { fill: '#e6f7ff', stroke: '#1890ff', strokeWidth: 1 },
  },
});
```

### polygon (Polygon / Diamond)

```javascript
// Diamond (decision node)
Graph.registerNode('diamond', {
  inherit: 'polygon',
  width: 80,
  height: 80,
  attrs: {
    body: {
      refPoints: '0,10 10,0 20,10 10,20',  // Diamond vertices
      fill: '#fff',
      stroke: '#8f8f8f',
      strokeWidth: 1,
    },
  },
}, true);

graph.addNode({ shape: 'diamond', x: 200, y: 100, label: 'Decision?' });
```

### text (Plain Text)

```javascript
graph.addNode({
  shape: 'text',
  x: 100, y: 100,
  attrs: {
    text: { text: 'Annotation', fontSize: 14, fill: '#666' },
  },
});
```

### image (Image Node)

```javascript
graph.addNode({
  shape: 'image',
  x: 100, y: 100,
  width: 60, height: 60,
  imageUrl: 'https://example.com/icon.png',
});
```

## HTML Custom Nodes

```javascript
import { Graph, Shape } from '@antv/x6';

Shape.HTML.register({
  shape: 'custom-html',
  width: 180,
  height: 80,
  effect: ['data'],      // Re-render when data changes
  html(cell) {
    const data = cell.getData() || {};
    const div = document.createElement('div');
    div.style.cssText = 'width:100%;height:100%;border:1px solid #8f8f8f;border-radius:4px;background:#fff;';
    div.innerHTML = `<div style="padding:8px;font-size:12px;">${data.title || 'Node'}</div>`;
    return div;
  },
});

graph.addNode({
  shape: 'custom-html',
  x: 100, y: 100,
  data: { title: 'My HTML Node' },
});
```

## Registering Custom Nodes

```javascript
Graph.registerNode('my-rect', {
  inherit: 'rect',           // Inherit the built-in rect
  width: 120,                // Default width
  height: 50,                // Default height
  attrs: {
    body: { fill: '#e6f7ff', stroke: '#1890ff', strokeWidth: 2, rx: 8, ry: 8 },
    label: { fontSize: 14, fill: '#333' },
  },
  ports: {                   // Default port configuration
    groups: {
      in: { position: 'top', attrs: { circle: { magnet: true, r: 5, stroke: '#1890ff' } } },
      out: { position: 'bottom', attrs: { circle: { magnet: true, r: 5, stroke: '#1890ff' } } },
    },
  },
}, true);  // true means overwrite an existing registration with the same name

graph.addNode({ shape: 'my-rect', x: 100, y: 80, label: 'Custom' });
```

## Dynamically Modifying Nodes

```javascript
// Modify position
node.setPosition(200, 100);

// Modify size
node.setSize(160, 60);

// Modify attributes
node.attr('body/fill', '#e6f7ff');
node.attr('label/text', 'Updated');

// Modify data
node.setData({ status: 'running' });

// Get information
const { x, y } = node.getPosition();
const { width, height } = node.getSize();
const data = node.getData();
```

## Node ID

```javascript
// Specify an ID
graph.addNode({ id: 'node-1', shape: 'rect', x: 40, y: 40, width: 100, height: 40 });

// Get a node by ID
const node = graph.getCellById('node-1');

// If no ID is specified, a UUID is generated automatically
const node2 = graph.addNode({ shape: 'rect', x: 200, y: 40, width: 100, height: 40 });
console.log(node2.id); // Automatically generated UUID
```

## Node zIndex

```javascript
// Set zIndex
graph.addNode({ shape: 'rect', x: 40, y: 40, width: 100, height: 40, zIndex: 10 });

// Adjust dynamically
node.toFront();   // Bring to front
node.toBack();    // Send to back
```

## Common Errors and Fixes

### Error 1: Restricting node drag range

Incorrect example (manually restricting with an event):

```javascript
// ❌ Incorrect approach: manually restrict with the node:move event
graph.on('node:move', ({ node }) => {
  const boundary = { x: 100, y: 100, width: 600, height: 400 };
  const nodeBBox = node.getBBox();
  let x = nodeBBox.x;
  let y = nodeBBox.y;

  if (x < boundary.x) x = boundary.x;
  if (y < boundary.y) y = boundary.y;
  if (x + nodeBBox.width > boundary.x + boundary.width) {
    x = boundary.x + boundary.width - nodeBBox.width;
  }
  if (y + nodeBBox.height > boundary.y + boundary.height) {
    y = boundary.y + boundary.height - nodeBBox.height;
  }

  if (x !== nodeBBox.x || y !== nodeBBox.y) {
    node.position(x, y);
  }
});
```

Correct approach (use the `translating.restrict` configuration):

```javascript
// ✅ Correct approach: use graph configuration
const graph = new Graph({
  container: 'container',
  width: 600,
  height: 400,
  translating: {
    restrict: {
      x: 0,
      y: 0,
      width: 600,
      height: 400,
    },
  },
});
```

### Error 2: Handling node nesting relationships

Incorrect example (using the parent property):

```javascript
// ❌ Incorrect approach: set nesting through the parent field
graph.addNode({
  id: 'child1',
  shape: 'rect',
  label: 'Child 1',
  x: 100,
  y: 160,
  width: 80,
  height: 40,
  parent: 'innerGroup',
});
```

Correct approach (use the `addChild` method):

```javascript
// ✅ Correct approach: use addChild to establish the parent-child relationship
const outerGroup = graph.addNode({ shape: 'rect', x: 40, y: 40, width: 400, height: 240 });
const innerGroup = graph.addNode({ shape: 'rect', x: 80, y: 100, width: 200, height: 140 });
const child1 = graph.addNode({ shape: 'rect', x: 100, y: 160, width: 80, height: 40 });

outerGroup.addChild(innerGroup);
innerGroup.addChild(child1);
```

### Error 3: Edge connection point configuration

Incorrect example (set in graph configuration but does not take effect):

```javascript
// ❌ Incorrect approach: connectionPoint is incomplete
const graph = new Graph({
  container: 'container',
  connecting: {
    connectionPoint: 'boundary', // Only the connection point type is set; edge creation configuration is missing
  },
});
```

Correct approach (complete configuration):

```javascript
// ✅ Correct approach: fully configure connection points and edge creation behavior
const graph = new Graph({
  container: 'container',
  connecting: {
    connectionPoint: 'boundary',
    createEdge() {
      return this.createEdge({
        attrs: { line: { stroke: '#8f8f8f', strokeWidth: 1, targetMarker: 'classic' } },
      });
    },
  },
});
```

### Error 4: Restricting node dragging to the vertical direction

Incorrect example (using complex event handling):

```javascript
// ❌ Incorrect approach: use complex event-handling logic
graph.on('node:mousemove', ({ node }) => {
  const nodeId = node.id;
  const nodeY = node.position().y;
  const nodes = graph.getNodes();
  
  nodes.sort((a, b) => a.position().y - b.position().y);
  
  const currentIndex = nodes.findIndex(n => n.id === nodeId);
  let newIndex = currentIndex;
  
  for (let i = 0; i < nodes.length; i++) {
    if (i !== currentIndex) {
      const otherNode = nodes[i];
      const otherY = otherNode.position().y;
      if (nodeY < otherY && currentIndex > i) {
        newIndex = i;
        break;
      } else if (nodeY > otherY && currentIndex < i) {
        newIndex = i;
      }
    }
  }
  
  if (newIndex !== currentIndex) {
    nodes.splice(currentIndex, 1);
    nodes.splice(newIndex, 0, node);
    
    nodes.forEach((n, index) => {
      n.position(100, 20 + index * 60);
    });
  }
});
```

Correct approach (use `translating.restrict` to restrict the movement direction):

```javascript
// ✅ Correct approach: use translating.restrict to allow only vertical movement
const graph = new Graph({
  container: 'container',
  translating: {
    restrict(cellView) {
      const cell = cellView.cell;
      const bbox = cell.getBBox();
      return { x: 100, y: 0, width: 1, height: 400 };
    },
  },
});
```

### Error 5: Edge connector configuration does not take effect

Incorrect example (edge connector configuration is incorrect):

```javascript
// ❌ Incorrect approach: set in graph configuration but not applied to edges
const graph = new Graph({
  container: 'container',
  connecting: {
    router: 'manhattan',
    connector: {
      name: 'smooth',
    },
  },
});
```

Correct approach (explicitly specify the connector on the edge):

```javascript
// ✅ Correct approach: explicitly specify connector when adding the edge
const edge = graph.addEdge({
  source: node1,
  target: node2,
  connector: 'smooth',
  attrs: {
    line: {
      stroke: '#8f8f8f',
      strokeWidth: 1,
    }
  }
});
```

### Error 6: The node parent property cannot correctly create nesting

Incorrect example (using the parent property to set nesting):

```javascript
// ❌ Incorrect approach: use the parent property directly
graph.addNode({
  id: 'child1',
  shape: 'rect',
  label: 'Child 1',
  x: 100,
  y: 160,
  width: 80,
  height: 40,
  parent: 'innerGroup',
});
```

Correct approach (use the addChild method):

```javascript
// ✅ Correct approach: use addChild to establish the parent-child relationship
const outerGroup = graph.addNode({ shape: 'rect', x: 40, y: 40, width: 400, height: 240 });
const innerGroup = graph.addNode({ shape: 'rect', x: 80, y: 100, width: 200, height: 140 });
const child1 = graph.addNode({ shape: 'rect', x: 100, y: 160, width: 80, height: 40 });

outerGroup.addChild(innerGroup);
innerGroup.addChild(child1);
```

### Error 7: Node drag range restriction is inaccurate

Incorrect example (using complex event handling):

```javascript
// ❌ Incorrect approach: use complex event-handling logic
graph.on('node:mousemove', ({ node }) => {
  const position = node.position();
  const size = node.size();
  
  let newX = position.x;
  let newY = position.y;
  
  if (position.x < 0) newX = 0;
  if (position.y < 0) newY = 0;
  if (position.x + size.width > 600) newX = 600 - size.width;
  if (position.y + size.height > 400) newY = 400 - size.height;
  
  if (newX !== position.x || newY !== position.y) {
    node.position(newX, newY);
  }
});
```

Correct approach (use the `translating.restrict` configuration):

```javascript
// ✅ Correct approach: use translating.restrict configuration
const graph = new Graph({
  container: 'container',
  translating: {
    restrict: {
      x: 0,
      y: 0,
      width: 600,
      height: 400,
    },
  },
});
```

### Error 8: The smooth edge connector is not configured correctly

Incorrect example (edge connector configuration is incorrect):

```javascript
// ❌ Incorrect approach: set in graph configuration but not applied to edges
const graph = new Graph({
  container: 'container',
  connecting: {
    router: 'manhattan',
    connector: {
      name: 'smooth',
    },
  },
});
```

Correct approach (explicitly specify the connector on the edge):

```javascript
// ✅ Correct approach: explicitly specify connector when adding the edge
const edge = graph.addEdge({
  source: node1,
  target: node2,
  connector: 'smooth',
  attrs: {
    line: {
      stroke: '#8f8f8f',
      strokeWidth: 1,
    }
  }
});
```

### Error 9: Calling graph.render() causes an error

Incorrect example (calling the graph.render() method):

```javascript
// ❌ Incorrect approach: call graph.render()
const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
});

graph.render(); // Error: graph.render is not a function
```

Correct approach (no need to call graph.render()):

```javascript
// ✅ Correct approach: no need to call graph.render()
const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
});
```

### Error 10: Declaring `const container` in the code

The `container` variable is automatically injected by the runtime. **Do not** declare it again in the code; otherwise, `Identifier 'container' has already been declared` will be thrown.

```javascript
// ❌ Incorrect approach: redeclare the container variable
const container = document.getElementById('container');
const graph = new Graph({ container });

// ✅ Correct approach: use the string 'container' directly
const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
});
```

### Error 11: Using an unregistered custom edge shape

**⚠️ Key constraint: do not use a custom edge shape name unless it has been registered with `Graph.registerEdge()`.**

The only built-in X6 edge shapes are `'edge'` and `'double-edge'`. If you need a custom edge style, **do not invent a new shape name**; configure the style in `attrs` instead:

```javascript
// ❌ Error: using an unregistered shape name → throws "Edge with name 'xxx' does not exist"
graph.addEdge({
  shape: 'my-custom-edge',  // Not registered; this will throw!
  source: 'node1',
  target: 'node2',
});

// ✅ Correct approach 1: use the built-in 'edge' shape + custom attrs
graph.addEdge({
  shape: 'edge',
  source: 'node1',
  target: 'node2',
  attrs: {
    line: {
      stroke: '#1890ff',
      strokeWidth: 3,
      strokeDasharray: '5 5',
      targetMarker: 'classic',
    },
  },
});

// ✅ Correct approach 2: register first, then use
Graph.registerEdge(
  'my-custom-edge',
  {
    inherit: 'edge',
    attrs: {
      line: { stroke: '#1890ff', strokeWidth: 3, targetMarker: 'classic' },
    },
  },
  true,
);
// Use it only after registration
graph.addEdge({ shape: 'my-custom-edge', source: 'node1', target: 'node2' });
```

**Built-in available edge shapes:** `'edge'`, `'double-edge'`. All other shape names must be registered with `Graph.registerEdge()` first.

### Error 12: Incorrect node data format

Incorrect example (node data format is invalid):

```javascript
// ❌ Incorrect approach: invalid node data format
const data = [
  { shape: 'rect', x: 100, y: 20, width: 200, height: 44, label: 'Item 1' },
  { shape: 'rect', x: 10  shape: 'rect', x: 100, y: 140, width: 200, height: 44, label: 'Item 4' },
  { shape: 'rect', x: 100, y: 184, width: 200, height: 44, label: 'Item 5' },
];
```

Correct approach (node data format is valid):

```javascript
// ✅ Correct approach: valid node data format
const data = [
  { shape: 'rect', x: 100, y: 20, width: 200, height: 44, label: 'Item 1' },
  { shape: 'rect', x: 100, y: 80, width: 200, height: 44, label: 'Item 2' },
  { shape: 'rect', x: 100, y: 140, width: 200, height: 44, label: 'Item 3' },
  { shape: 'rect', x: 100, y: 200, width: 200, height: 44, label: 'Item 4' },
  { shape: 'rect', x: 100, y: 260, width: 200, height: 44, label: 'Item 5' },
];
```

### Error 13: Using nonexistent graph.highlightNode() / graph.highlightCell() methods

**⚠️ X6 does not have `graph.highlightNode()` or `graph.highlightCell()` methods.**

```javascript
// ❌ Error: neither method exists
graph.highlightNode(node);   // TypeError
graph.highlightCell(cell);   // TypeError

// ✅ Correct approach 1: highlight by changing styles through node.attr()
const neighbors = graph.getNeighbors(centerNode);
neighbors.forEach((node) => {
  node.attr('body/fill', '#d9f7be');
  node.attr('body/stroke', '#52c41a');
  node.attr('body/strokeWidth', 2);
});

// ✅ Correct approach 2: highlight with a CSS class (requires a stylesheet)
neighbors.forEach((node) => {
  const view = graph.findViewByCell(node);
  if (view) view.addClass('highlighted');
});
```

### Error 14: Invalid SVG gradient definition syntax

**⚠️ X6 does not have a `graph.defs` property. Do not manually create SVG gradient elements with `document.createElementNS`.**

```javascript
// ❌ Error: graph.defs does not exist, and `graph.svg defs()` is invalid syntax
const gradientId = 'gradient-blue-green';
const defs = graph.defs;  // undefined
// Or
const svgDefs = document.createElementNS('http://www.w3.org/2000/svg', 'defs'); // Do not do this
```

Correct approach (configure the gradient with attrs.fill):

```javascript
// ✅ Correct approach: configure the gradient with attrs.fill
graph.addNode({
  shape: 'rect',
  x: 100,
  y: 60,
  width: 160,
  height: 80,
  label: 'Gradient Node',
  attrs: {
    body: {
      fill: {
        type: 'linearGradient',
        stops: [
          { offset: '0%', color: '#1890ff' },
          { offset: '100%', color: '#52c41a' },
        ],
      },
      stroke: '#8f8f8f',
      strokeWidth: 1,
      rx: 6,
      ry: 6,
    },
    label: {
      fill: '#fff',
      fontSize: 14,
    },
  },
});
```
