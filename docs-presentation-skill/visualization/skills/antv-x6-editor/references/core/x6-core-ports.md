---
id: "x6-core-ports"
title: "X6 Ports Configuration"
description: |
  Defining, grouping, positioning, styling, and dynamically showing or hiding X6 ports.
  Ports are connection anchors on nodes and are used in scenarios such as DAGs and flowcharts.

library: "x6"
version: "3.x"
category: "core"
subcategory: "ports"
tags:
  - "ports"
  - "port"
  - "magnet"
  - "anchor"
  - "connection"
  - "position"
  - "group"
  - "dynamic ports"
  - "DAG"

related:
  - "x6-core-node"
  - "x6-core-edge"
  - "x6-core-graph-init"

use_cases:
  - "Add ports to nodes"
  - "Configure port groups and positions"
  - "Create input and output ports for DAG nodes"
  - "Dynamically add or remove ports"
  - "Show ports on mouse hover"

anti_patterns:
  - "Do not omit magnet: true; otherwise ports cannot create connections"
  - "Do not duplicate attrs already defined by the group in items"
  - "When Graph.registerNode has declared ports.items, do not pass ports.items with the same id to addNode; this triggers Duplicitied port id"
  - "The id added with node.addPort must not duplicate an id already present in ports.items from registerNode/addNode"

difficulty: "intermediate"
completeness: "full"
---

## Basic Port Configuration

```javascript
graph.addNode({
  shape: 'rect',
  x: 100, y: 60,
  width: 120, height: 50,
  label: 'DAG Node',
  ports: {
    groups: {
      in: {
        position: 'left',
        attrs: {
          circle: { magnet: true, r: 5, stroke: '#1890ff', fill: '#fff' },
        },
      },
      out: {
        position: 'right',
        attrs: {
          circle: { magnet: true, r: 5, stroke: '#1890ff', fill: '#fff' },
        },
      },
    },
    items: [
      { id: 'in1', group: 'in' },
      { id: 'out1', group: 'out' },
    ],
  },
});
```

## Port Positions

| position | Description |
|----------|-------------|
| `'top'` | Centered on the top |
| `'bottom'` | Centered on the bottom |
| `'left'` | Centered on the left |
| `'right'` | Centered on the right |

Multiple ports in the same group are automatically distributed evenly:

```javascript
ports: {
  groups: {
    in: { position: 'top' },
    out: { position: 'bottom' },
  },
  items: [
    { id: 'in1', group: 'in' },
    { id: 'in2', group: 'in' },   // Two top ports are distributed evenly
    { id: 'out1', group: 'out' },
  ],
}
```

## Connecting Through Ports

```javascript
// Connect an edge to specified ports
graph.addEdge({
  source: { cell: node1, port: 'out1' },
  target: { cell: node2, port: 'in1' },
  attrs: { line: { stroke: '#1890ff', strokeWidth: 1, targetMarker: 'classic' } },
});

// Node IDs can also be used
graph.addEdge({
  source: { cell: 'node-1', port: 'out1' },
  target: { cell: 'node-2', port: 'in1' },
});
```

## DAG Node Registration (Common Pattern)

```javascript
Graph.registerNode('dag-node', {
  inherit: 'rect',
  width: 140,
  height: 50,
  attrs: {
    body: { stroke: '#8f8f8f', strokeWidth: 1, fill: '#fff', rx: 6, ry: 6 },
  },
  ports: {
    groups: {
      in: {
        position: 'left',
        attrs: { circle: { magnet: true, r: 5, stroke: '#1890ff', fill: '#fff' } },
      },
      out: {
        position: 'right',
        attrs: { circle: { magnet: true, r: 5, stroke: '#1890ff', fill: '#fff' } },
      },
    },
  },
}, true);

// When using it, only specify items
graph.addNode({
  shape: 'dag-node',
  x: 100, y: 60,
  label: 'ETL Task',
  ports: { items: [{ id: 'in1', group: 'in' }, { id: 'out1', group: 'out' }] },
});
```

## Dynamic Port Operations

```javascript
// Add a port
node.addPort({ id: 'new-port', group: 'out' });

// Remove a port
node.removePort('port-id');

// Get all ports
const ports = node.getPorts();

// Check whether a port exists
const hasPort = node.hasPort('port-id');
```

## Show Ports on Mouse Hover

```javascript
const graph = new Graph({
  container: 'container',
});

// Hide ports by default
graph.addNode({
  shape: 'rect',
  x: 100, y: 60,
  width: 120, height: 50,
  ports: {
    groups: {
      in: {
        position: 'left',
        attrs: {
          circle: {
            magnet: true, r: 5, stroke: '#1890ff', fill: '#fff',
            style: { visibility: 'hidden' },
          },
        },
      },
      out: {
        position: 'right',
        attrs: {
          circle: {
            magnet: true, r: 5, stroke: '#1890ff', fill: '#fff',
            style: { visibility: 'hidden' },
          },
        },
      },
    },
    items: [{ id: 'in1', group: 'in' }, { id: 'out1', group: 'out' }],
  },
});

// Show on mouse enter
graph.on('node:mouseenter', ({ node }) => {
  node.getPorts().forEach((port) => {
    node.portProp(port.id, 'attrs/circle/style/visibility', 'visible');
  });
});

// Hide on mouse leave
graph.on('node:mouseleave', ({ node }) => {
  node.getPorts().forEach((port) => {
    node.portProp(port.id, 'attrs/circle/style/visibility', 'hidden');
  });
});
```

## Customizing Port Styles

```javascript
ports: {
  groups: {
    in: {
      position: 'top',
      attrs: {
        circle: {
          magnet: true,
          r: 6,
          stroke: '#52c41a',
          fill: '#f6ffed',
          strokeWidth: 2,
        },
      },
      label: {
        position: 'top',  // Label position
      },
    },
  },
  items: [
    { id: 'in1', group: 'in', attrs: { text: { text: 'input' } } },
  ],
}
```

## Connection Validation

Use the `connecting` configuration to restrict port connection rules:

```javascript
const graph = new Graph({
  container: 'container',
  connecting: {
    allowBlank: false,
    allowNode: false,        // Only allow connections to ports
    allowLoop: false,        // Disallow self-loops
    validateConnection({ sourcePort, targetPort, sourceCell, targetCell }) {
      // Do not allow output ports to connect to output ports
      if (sourcePort && sourcePort.startsWith('out') && targetPort && targetPort.startsWith('out')) {
        return false;
      }
      // Do not allow connecting to itself
      if (sourceCell === targetCell) return false;
      return true;
    },
  },
});
```

## Common Errors and Fixes

### Error 1: Ports are not grouped correctly, so connections cannot be created

**Incorrect example:**
```javascript
// Error: groups are not defined; group is used directly
graph.addNode({
  shape: 'rect',
  x: 100, y: 60,
  width: 120, height: 50,
  ports: {
    items: [
      { id: 'port1', group: 'top' },  // group is not defined
      { id: 'port2', group: 'bottom' },
    ],
  },
});
```

**Fix:**
```javascript
// Correct: define groups first, then reference them in items
graph.addNode({
  shape: 'rect',
  x: 100, y: 60,
  width: 120, height: 50,
  ports: {
    groups: {
      top: {
        position: 'top',
        attrs: { circle: { magnet: true, r: 5, stroke: '#1890ff', fill: '#fff' } },
      },
      bottom: {
        position: 'bottom',
        attrs: { circle: { magnet: true, r: 5, stroke: '#1890ff', fill: '#fff' } },
      },
    },
    items: [
      { id: 'port1', group: 'top' },
      { id: 'port2', group: 'bottom' },
    ],
  },
});
```

### Error 2: Port does not set magnet, so it cannot create connections

**Incorrect example:**
```javascript
// Error: missing magnet: true
ports: {
  groups: {
    in: {
      position: 'left',
      attrs: { circle: { r: 5, stroke: '#1890ff', fill: '#fff' } }, // Missing magnet
    },
  },
  items: [{ id: 'in1', group: 'in' }],
}
```

**Fix:**
```javascript
// Correct: set magnet: true
ports: {
  groups: {
    in: {
      position: 'left',
      attrs: { circle: { magnet: true, r: 5, stroke: '#1890ff', fill: '#fff' } },
    },
  },
  items: [{ id: 'in1', group: 'in' }],
}
```

### Error 3: Incorrect port style settings cause abnormal display

**Incorrect example:**
```javascript
// Error: duplicate attrs already defined by the group in items
ports: {
  groups: {
    in: {
      position: 'left',
      attrs: { circle: { magnet: true, r: 5, stroke: '#1890ff', fill: '#fff' } },
    },
  },
  items: [
    { id: 'in1', group: 'in', attrs: { circle: { r: 10 } } }, // Duplicates circle settings
  ],
}
```

**Fix:**
```javascript
// Correct: avoid duplicating attrs already defined by the group in items
ports: {
  groups: {
    in: {
      position: 'left',
      attrs: { circle: { magnet: true, r: 5, stroke: '#1890ff', fill: '#fff' } },
    },
  },
  items: [
    { id: 'in1', group: 'in' },
  ],
}
```

### Error 4: The node is not referenced correctly when creating an edge, causing connection failure

**Incorrect example:**
```javascript
// Error: source and target should be node instances or node ID strings
const edge = graph.addEdge({
  source: 'source',
  target: 'target',
  attrs: {
    line: {
      stroke: '#5F95FF',
      strokeWidth: 2,
      targetMarker: {
        name: 'classic',
        size: 8,
      },
    },
  },
})
```

**Fix:**
```javascript
// Correct: ensure source and target are valid node references
const sourceNode = graph.addNode({
  id: 'source',
  shape: 'rect',
  label: 'hello',
  x: 40,
  y: 100,
  width: 100,
  height: 40,
})

const targetNode = graph.addNode({
  id: 'target',
  shape: 'rect',
  label: 'world',
  x: 340,
  y: 100,
  width: 100,
  height: 40,
})

const edge = graph.addEdge({
  source: sourceNode, // Or 'source'
  target: targetNode, // Or 'target'
  attrs: {
    line: {
      stroke: '#5F95FF',
      strokeWidth: 2,
      targetMarker: {
        name: 'classic',
        size: 8,
      },
    },
  },
})
```

### Error 5: Required selector definition is missing from port configuration

**Incorrect example:**
```javascript
// Error: portMarkup uses an undefined selector
ports: {
  groups: {
    in: {
      position: 'left',
      attrs: { portBody: { magnet: true, r: 5, stroke: '#1890ff', fill: '#fff' } },
    },
  },
  items: [{ id: 'in1', group: 'in' }],
}
```

**Fix:**
```javascript
// Correct: define the selector name in portMarkup
ports: {
  groups: {
    in: {
      position: 'left',
      attrs: { portBody: { magnet: true, r: 5, stroke: '#1890ff', fill: '#fff' } },
    },
  },
  items: [{ id: 'in1', group: 'in' }],
  portMarkup: [
    {
      tagName: 'circle',
      selector: 'portBody', // Matches the key in attrs
    },
  ],
}
```

### Error 6: Using an undeclared group name causes ports not to display

**Incorrect example:**
```javascript
// Error: items use a group name that is not defined in groups
graph.addNode({
  shape: 'rect',
  x: 100,
  y: 60,
  width: 120,
  height: 50,
  ports: {
    groups: {
      in: {
        position: 'left',
        attrs: { circle: { magnet: true, r: 5, stroke: '#1890ff', fill: '#fff' } },
      },
    },
    items: [
      { id: 'port1', group: 'top' }, // group 'top' is not defined
    ],
  },
});
```

**Fix:**
```javascript
// Correct: ensure group names used in items are defined in groups
graph.addNode({
  shape: 'rect',
  x: 100,
  y: 60,
  width: 120,
  height: 50,
  ports: {
    groups: {
      in: {
        position: 'left',
        attrs: { circle: { magnet: true, r: 5, stroke: '#1890ff', fill: '#fff' } },
      },
      top: {
        position: 'top',
        attrs: { circle: { magnet: true, r: 5, stroke: '#1890ff', fill: '#fff' } },
      },
    },
    items: [
      { id: 'port1', group: 'top' },
    ],
  },
});
```

### Error 7: Invalid container reference causes rendering failure

**Incorrect example:**
```javascript
// Error: container variable is undefined or null
const graph = new Graph({
  container: container, // ❌ container is not declared; use the string 'container'
});
```

**Fix:**
```javascript
// Correct: use the string 'container' (the runtime injects it; declaring const container is forbidden)
const graph = new Graph({
  container: 'container',
  width: 800,
  height: 600,
});
```

### Error 8: Incorrect API usage when dynamically modifying edge attributes

**Incorrect example:**
```javascript
// Error: incorrect parameter format when using edge.attr() and edge.prop() to modify edge attributes
setTimeout(() => {
  edge.attr('line/stroke', '#ff4d4f')
  edge.attr('line/strokeWidth', 2)
  edge.prop('vertices', [{ x: 200, y: 200 }])
}, 2000)
```

**Fix:**
```javascript
// Correct: use the proper API call format
edge.attr('line/stroke', '#1890ff');
edge.prop('vertices', [{ x: 200, y: 50 }]);
```

### Error 9: Incorrect configuration when creating a canvas that supports dragging connections from ports

**Incorrect example:**
```javascript
// Error: connecting configuration is incomplete or incorrect
const graph = new Graph({
  container: 'container',
  connecting: {
    snap: true,
    allowBlank: true,
    allowLoop: false,
    highlight: true,
    connector: 'rounded',
    connectionPoint: 'anchor',
    router: {
      name: 'manhattan',
      args: {
        padding: 1,
      },
    },
    createEdge() {
      return new Shape.Edge({
        attrs: {
          line: {
            stroke: '#5F95FF',
            strokeWidth: 2,
            targetMarker: {
              name: 'classic',
              size: 8,
            },
          },
        },
        zIndex: 0,
      })
    },
  },
})
```

**Fix:**
```javascript
// Correct: use a complete connecting configuration
const graph = new Graph({
  container: 'container',
  background: { color: '#F2F7FA' },
  connecting: {
    allowBlank: true,
    allowMulti: true,
    allowLoop: true,
    allowNode: true,
    allowEdge: false,
    allowPort: true,
    createEdge() {
      return this.createEdge({
        attrs: {
          line: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
          },
        },
      });
    },
  },
});
```

## ⚠️ `registerNode` + `addNode` Port Merge Behavior (Must Read)

In X6 3.x, `new Cell(metadata)` executes `ObjectExt.merge({}, defaults, metadata)`, recursively merging the ports registered during `registerNode` with the ports passed to `addNode`. Meanwhile, `node.addPort` / `node.addPorts` use simple concatenation: `[...current.items, ...new]`. Neither path deduplicates ids. As soon as a duplicate id appears, X6 immediately throws `Error: Duplicitied port id.`, and the entire canvas cannot render.

### ❌ Counterexample (Typical Duplicitied port id)

```javascript
// in1 is declared during registration
Graph.registerNode('my-node', {
  inherit: 'rect',
  width: 120, height: 60,
  ports: {
    groups: { in: { position: 'left', attrs: { circle: { magnet: true, r: 4 } } } },
    items: [{ id: 'in1', group: 'in' }],
  },
});

// addNode repeats in1 → arrays merge by index, equivalent to items: [{ id: 'in1' }, { id: 'in1' }] → error
graph.addNode({
  shape: 'my-node', x: 100, y: 100,
  ports: { items: [{ id: 'in1', group: 'in' }] },
});
// → Error: Duplicitied port id.
```

### ✅ Correct Approaches (Choose One of Three)

**1. Declare only groups during registration, and pass all items in addNode:**
```javascript
Graph.registerNode('my-node', {
  inherit: 'rect',
  width: 120, height: 60,
  ports: {
    groups: { in: { position: 'left', attrs: { circle: { magnet: true, r: 4 } } } },
    // Do not write items here; leave them to addNode
  },
});
graph.addNode({ shape: 'my-node', x: 100, y: 100,
  ports: { items: [{ id: 'in1', group: 'in' }] } });
```

**2. Fully declare items during registration, and do not pass ports to addNode:**
```javascript
Graph.registerNode('my-node', {
  inherit: 'rect',
  width: 120, height: 60,
  ports: {
    groups: { in: { position: 'left', attrs: { circle: { magnet: true, r: 4 } } } },
    items: [{ id: 'in1', group: 'in' }],
  },
});
graph.addNode({ shape: 'my-node', x: 100, y: 100 }); // Reuse the ports from the registry directly
```

**3. Declare some ports during registration, and append runtime ports with `node.addPort` using unique ids:**
```javascript
const node = graph.addNode({ shape: 'my-node', x: 100, y: 100 }); // Already has in1
node.addPort({ id: 'in2', group: 'in' }); // ✅ New id
node.addPort({ id: 'in1', group: 'in' }); // ❌ Duplicitied port id
```

> Troubleshooting tip: when you see `Duplicitied port id.`, first grep for the same port id. The usual cause is that the registry already declared it and addNode passed it again.
