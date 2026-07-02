---
id: "x6-pattern-lineage"
title: "X6 Lineage Diagram (Lineage/Data Lineage)"
description: |
  Best practices for building data lineage diagrams with X6: multiple input and output ports, hierarchical layout, table- and field-level lineage relationships, collapse/expand, and more.

library: "x6"
version: "3.x"
category: "patterns"
subcategory: "lineage"
tags:
  - "Lineage diagram"
  - "lineage"
  - "data lineage"
  - "Data lineage"
  - "Table relationships"
  - "Field-level lineage"
  - "DAG"

related:
  - "x6-pattern-dag"
  - "x6-core-ports"
  - "x6-core-edge"
  - "x 6-intermediate-custom-node"
  - "x6-intermediate-layout"

use_cases:
  - "Table-level data warehouse lineage"
  - "Field-level lineage tracing"
  - "ETL data flow"
  - "Data asset lineage relationships"

difficulty: "advanced"
completeness: "full"
---

## Scenario Characteristics

Core characteristics of data lineage diagrams:
- **Table nodes**: Each node represents a table/dataset and displays a field list inside
- **Field-level edges**: Edges precisely connect source-table fields to target-table fields (port to port)
- **Left-to-right layout**: Data flows from upstream to downstream, usually using an LR (Left-to-Right) layout
- **Multiple ports**: Each node has multiple input/output ports (corresponding to fields)
- **Orthogonal routing**: Edges use orthogonal routing to avoid crossings

## Register a Custom Table Node

```javascript
const { Graph } = X6;

// Register a lineage table node
Graph.registerNode('lineage-table', {
  inherit: 'rect',
  width: 220,
  height: 60,
  attrs: {
    body: {
      fill: '#fff',
      stroke: '#d9d9d9',
      strokeWidth: 1,
      rx: 4,
      ry: 4,
    },
    label: {
      fontSize: 14,
      fontWeight: 'bold',
      fill: '#333',
      refY: 14,
      refX: 0.5,
    },
  },
  ports: {
    groups: {
      in: {
        position: 'left',
        label: { position: 'inside' },
        attrs: {
          circle: { r: 4, magnet: true, stroke: '#31d0c6', fill: '#fff', strokeWidth: 1.5 },
        },
      },
      out: {
        position: 'right',
        label: { position: 'inside' },
        attrs: {
          circle: { r: 4, magnet: true, stroke: '#ff6347', fill: '#fff', strokeWidth: 1.5 },
        },
      },
    },
  },
}, true);
```

## Complete Example: Three-table Lineage Relationship

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>X6 Data Lineage Diagram Example</title>
  <style>
    #container {
      width: 1000px;
      height: 600px;
      border: 1px solid #d9d9d9;
    }
  </style>
</head>
<body>
  <div id="container"></div>
  <script src="https://unpkg.com/@antv/x6/dist/x6.js"></script>
  <script>
    const { Graph } = X6;

    const graph = new Graph({
      container: document.getElementById('container'),
      width: 1000,
      height: 600,
      background: { color: '#F2F7FA' },
      grid: { visible: true, size: 10 },
      panning: { enabled: true, modifiers: 'ctrl' },
      mousewheel: { enabled: true, modifiers: 'ctrl' },
      connecting: {
        allowBlank: false,
        router: 'orth',
        connector: 'rounded',
      },
    });

    // Source table
    const sourceTable = graph.addNode({
      shape: 'rect',
      x: 50,
      y: 100,
      width: 200,
      height: 130,
      label: 'user_orders',
      attrs: {
        body: { fill: '#fff', stroke: '#5F95FF', strokeWidth: 1.5, rx: 6, ry: 6 },
        label: { fontSize: 14, fontWeight: 'bold', fill: '#333', refY: 16, refX: 0.5 },
      },
      ports: {
        groups: {
          out: {
            position: 'right',
            attrs: { circle: { r: 4, magnet: true, stroke: '#5F95FF', fill: '#EFF4FF' } },
          },
        },
        items: [
          { id: 'user_id', group: 'out', attrs: { text: { text: 'user_id' } } },
          { id: 'order_id', group: 'out', attrs: { text: { text: 'order_id' } } },
          { id: 'amount', group: 'out', attrs: { text: { text: 'amount' } } },
          { id: 'order_date', group: 'out', attrs: { text: { text: 'order_date' } } },
        ],
      },
    });

    // Intermediate ETL node
    const etlNode = graph.addNode({
      shape: 'rect',
      x: 380,
      y: 130,
      width: 200,
      height: 100,
      label: 'agg_user_stats',
      attrs: {
        body: { fill: '#fff', stroke: '#73d13d', strokeWidth: 1.5, rx: 6, ry: 6 },
        label: { fontSize: 14, fontWeight: 'bold', fill: '#333', refY: 16, refX: 0.5 },
      },
      ports: {
        groups: {
          in: {
            position: 'left',
            attrs: { circle: { r: 4, magnet: true, stroke: '#73d13d', fill: '#f6ffed' } },
          },
          out: {
            position: 'right',
            attrs: { circle: { r: 4, magnet: true, stroke: '#73d13d', fill: '#f6ffed' } },
          },
        },
        items: [
          { id: 'in_user_id', group: 'in', attrs: { text: { text: 'user_id' } } },
          { id: 'in_amount', group: 'in', attrs: { text: { text: 'amount' } } },
          { id: 'out_user_id', group: 'out', attrs: { text: { text: 'user_id' } } },
          { id: 'out_total', group: 'out', attrs: { text: { text: 'total_amount' } } },
        ],
      },
    });

    // Target table
    const targetTable = graph.addNode({
      shape: 'rect',
      x: 700,
      y: 150,
      width: 200,
      height: 80,
      label: 'report_summary',
      attrs: {
        body: { fill: '#fff', stroke: '#ff7a45', strokeWidth: 1.5, rx: 6, ry: 6 },
        label: { fontSize: 14, fontWeight: 'bold', fill: '#333', refY: 16, refX: 0.5 },
      },
      ports: {
        groups: {
          in: {
            position: 'left',
            attrs: { circle: { r: 4, magnet: true, stroke: '#ff7a45', fill: '#fff7e6' } },
          },
        },
        items: [
          { id: 'in_uid', group: 'in', attrs: { text: { text: 'user_id' } } },
          { id: 'in_total', group: 'in', attrs: { text: { text: 'total' } } },
        ],
      },
    });

    // Field-level edges
    graph.addEdge({
      source: { cell: sourceTable.id, port: 'user_id' },
      target: { cell: etlNode.id, port: 'in_user_id' },
      attrs: { line: { stroke: '#5F95FF', strokeWidth: 1.5 } },
      router: 'orth',
      connector: 'rounded',
    });

    graph.addEdge({
      source: { cell: sourceTable.id, port: 'amount' },
      target: { cell: etlNode.id, port: 'in_amount' },
      attrs: { line: { stroke: '#5F95FF', strokeWidth: 1.5 } },
      router: 'orth',
      connector: 'rounded',
    });

    graph.addEdge({
      source: { cell: etlNode.id, port: 'out_user_id' },
      target: { cell: targetTable.id, port: 'in_uid' },
      attrs: { line: { stroke: '#73d13d', strokeWidth: 1.5 } },
      router: 'orth',
      connector: 'rounded',
    });

    graph.addEdge({
      source: { cell: etlNode.id, port: 'out_total' },
      target: { cell: targetTable.id, port: 'in_total' },
      attrs: { line: { stroke: '#73d13d', strokeWidth: 1.5 } },
      router: 'orth',
      connector: 'rounded',
    });
  </script>
</body>
</html>
```

## Highlight Lineage Paths

When a field is clicked, highlight its complete upstream and downstream path:

```javascript
graph.on('node:port:click', ({ node, port }) => {
  // Reset styles for all edges
  graph.getEdges().forEach((edge) => {
    edge.attr('line/stroke', '#d9d9d9');
    edge.attr('line/strokeWidth', 1);
  });

  // Highlight edges related to this port
  const relatedEdges = graph.getEdges().filter((edge) => {
    const source = edge.getSource();
    const target = edge.getTarget();
    return (source.cell === node.id && source.port === port) ||
           (target.cell === node.id && target.port === port);
  });

  relatedEdges.forEach((edge) => {
    edge.attr('line/stroke', '#1890ff');
    edge.attr('line/strokeWidth', 3);
  });
});
```

## Layout Recommendations

Use the dagre algorithm from `@antv/layout` to implement automatic LR layout:

```html
<script src="https://unpkg.com/@antv/layout@latest/dist/layout.min.js"></script>
<script>
  const { DagreLayout } = Layout;

  const dagreLayout = new DagreLayout({
    type: 'dagre',
    rankdir: 'LR',
    nodesep: 40,
    ranksep: 100,
  });

  const layoutData = dagreLayout.layout({
    nodes: graph.getNodes().map((n) => ({
      id: n.id,
      size: { width: n.getSize().width, height: n.getSize().height },
    })),
    edges: graph.getEdges().map((e) => ({
      source: e.getSourceCellId(),
      target: e.getTargetCellId(),
    })),
  });

  layoutData.nodes.forEach((n) => {
    const node = graph.getCellById(n.id);
    if (node) node.setPosition(n.x, n.y);
  });
</script>
```

## Best Practices

1. **Use field names as port IDs**: Makes lineage tracing logic easier
2. **Orthogonal routing + rounded connector**: `router: 'orth'`, `connector: 'rounded'`
3. **Color by layer**: Use different colors for source, intermediate, and target tables
4. **Calculate node height dynamically**: Set `height = 40 + fields.length * 24` dynamically based on the number of fields
5. **Enable virtual rendering for large-scale scenarios**: Configure `virtual: true` when there are more than 200 nodes

## Common Errors and Fixes

### Error 1: Using an unregistered node type

**Incorrect code:**
```javascript
const node = graph.addNode({
  shape: 'dag-node', // Incorrect: unregistered node type
  label: 'Source Table',
});
```

**Error message:**
```
Node with name 'dag-node' does not exist.
```

**Fix:**
Before using a custom node, you must register the node type. Use `Graph.registerNode` to register custom nodes:

```javascript
Graph.registerNode('lineage-node', {
  inherit: 'rect',
  width: 130,
  height: 40,
  attrs: {
    body: { fill: '#fff', stroke: '#d9d9d9', strokeWidth: 1, rx: 4, ry: 4 },
    label: { fontSize: 12 },
  },
  ports: {
    groups: {
      in: { position: 'left', attrs: { circle: { r: 4, magnet: true, stroke: '#8f8f8f', fill: '#fff' } } },
      out: { position: 'right', attrs: { circle: { r: 4, magnet: true, stroke: '#8f8f8f', fill: '#fff' } } },
    },
  },
}, true);

const node = graph.addNode({
  shape: 'lineage-node', // Correct: registered node type
  label: 'Source Table',
});
```

### Error 2: Using the wrong layout API

**Incorrect code:**
```javascript
import { DagreLayout } from '@antv/x6';
const layout = new DagreLayout({...});
const model = layout.layout(graph.toJSON());
graph.fromJSON(model);
```

**Error message:**
```
TypeError: layout.layout is not a function
```

**Fix:**
Import `DagreLayout` from `@antv/layout` and use the correct layout approach:

```javascript
import { DagreLayout } from '@antv/layout';

const dagreLayout = new DagreLayout({
  type: 'dagre',
  rankdir: 'LR',
  align: 'UL',
  ranksep: 80,
  nodesep: 30,
});

const layoutData = dagreLayout.layout({
  nodes: graph.getNodes().map((n) => ({
    id: n.id,
    size: { width: n.getSize().width, height: n.getSize().height },
  })),
  edges: graph.getEdges().map((e) => ({
    source: e.getSourceCellId(),
    target: e.getTargetCellId(),
  })),
});

layoutData.nodes.forEach((n) => {
  const node = graph.getCellById(n.id);
  if (node) node.setPosition(n.x, n.y);
});
```

### Error 3: Using ES Module import syntax in a browser environment

**Incorrect code:**
```javascript
import { Graph } from '@antv/x6'
import { DagreLayout } from '@antv/layout'
```

**Error message:**
```
Cannot use import statement outside a module
```

**Fix:**
In a browser environment, use `<script>` tags to include X6 and the layout library, or use a bundler such as Webpack or Vite to handle module dependencies. If using script tags, ensure the import order is correct and access APIs through global variables:

```html
<script src="https://unpkg.com/@antv/x6/dist/x6.js"></script>
<script src="https://unpkg.com/@antv/layout@latest/dist/layout.min.js"></script>
<script>
  const { Graph } = X6;
  const { DagreLayout } = Layout;

  Graph.registerNode('lineage-node', {
    inherit: 'rect',
    width: 130,
    height: 40,
    attrs: {
      body: { fill: '#fff', stroke: '#d9d9d9', strokeWidth: 1, rx: 4, ry: 4 },
      label: { fontSize: 12 },
    },
    ports: {
      groups: {
        in: { position: 'left', attrs: { circle: { r: 4, magnet: true, stroke: '#8f8f8f', fill: '#fff' } } },
        out: { position: 'right', attrs: { circle: { r: 4, magnet: true, stroke: '#8f8f8f', fill: '#fff' } } },
      },
    },
  }, true);

  const graph = new Graph({
    container: document.getElementById('container'),
    width: 800,
    height: 450,
    background: { color: '#F2F7FA' },
    panning: true,
    mousewheel: { enabled: true, modifiers: 'ctrl' },
  });

  // Add nodes and edges...
</script>
```

### Error 4: Module system not correctly configured in a browser environment

**Incorrect code:**
```html
<script type="text/javascript">
  import { Graph } from '@antv/x6';
</script>
```

**Error message:**
```
Cannot use import statement outside a module
```

**Fix:**
To use ES Module syntax in the browser, mark the script as `type="module"` and use the ESM version provided by the CDN:

```html
<script type="module">
  import { Graph } from 'https://unpkg.com/@antv/x6?module';
  import { DagreLayout } from 'https://unpkg.com/@antv/layout?module';

  const graph = new Graph({
    container: document.getElementById('container'),
    width: 800,
    height: 450,
    background: { color: '#F2F7FA' },
  });

  // Add nodes and edges...
</script>
```

Alternatively, include the library using the traditional IIFE build:

```html
<script src="https://unpkg.com/@antv/x6/dist/x6.js"></script>
<script>
  const { Graph } = X6;

  const graph = new Graph({
    container: document.getElementById('container'),
    width: 800,
    height: 450,
    background: { color: '#F2F7FA' },
  });

  // Add nodes and edges...
</script>
```

### Error 5: Container element not specified correctly

**Incorrect code:**
```javascript
const graph = new Graph({
  container, // Incorrect: container variable is undefined
  width: 800,
  height: 450,
});
```

**Error message:**
```
Uncaught TypeError: Cannot read property 'appendChild' of undefined
```

**Fix:**
Ensure `container` is a DOM element or a valid selector string:

```javascript
const graph = new Graph({
  container: document.getElementById('container'), // Correct: get the DOM element
  width: 800,
  height: 450,
});
```

Or:

```javascript
const graph = new Graph({
  container: 'container', // Correct: use a selector string
  width: 800,
  height: 450,
});
```

### Error 6: Using the wrong port reference format

**Incorrect code:**
```javascript
graph.addEdge({
  source: { cell: sourceTable, port: 'out1' }, // Incorrect: sourceTable is a Node instance, not an ID
  target: { cell: etl1, port: 'in1' },
});
```

**Error message:**
```
Invalid source or target cell reference
```

**Fix:**
When creating edges, `source.cell` and `target.cell` should be node ID strings, not node objects themselves:

```javascript
graph.addEdge({
  source: { cell: sourceTable.id, port: 'out1' }, // Correct: use the node ID
  target: { cell: etl1.id, port: 'in1' },
});
```

Or save node IDs when adding nodes:

```javascript
const sourceTableId = graph.addNode({...}).id;
const etl1Id = graph.addNode({...}).id;

graph.addEdge({
  source: { cell: sourceTableId, port: 'out1' },
  target: { cell: etl1Id, port: 'in1' },
});
```