---
id: "x6-pattern-uml"
title: "X6 UML Class Diagram"
description: |
  Best practices for building UML class diagrams with X6: class/interface nodes, attribute and method sections, and relationship edges such as inheritance, implementation, association, and dependency.

library: "x6"
version: "3.x"
category: "patterns"
subcategory: "uml"
tags:
  - "UML"
  - "Class diagram"
  - "class diagram"
  - "Inheritance"
  - "Interface"
  - "Association"

related:
  - "x6-intermediate-custom-node"
  - "x6-core-edge"
  - "x6-core-ports"
  - "x6-intermediate-custom-edge"

use_cases:
  - "Software architecture class diagram"
  - "Class inheritance relationship display"
  - "Interface implementation relationships"
  - "Class attributes and methods display"

difficulty: "advanced"
completeness: "full"
---

## Scenario Characteristics

Core characteristics of UML class diagrams:
- **Sectioned nodes**: Each class node is divided into three parts: class name, attribute list, and method list
- **Relationship edges**: Inheritance (hollow triangle arrow), implementation (dashed line + hollow triangle), association (solid line), dependency (dashed arrow)
- **Visibility markers**: `+` (public), `-` (private), `#` (protected)
- **Port connections**: Edges usually connect to the four sides of nodes

## Register a UML Class Node

Use `Shape.HTML.register()` to register a custom HTML node and implement sectioned rendering:

```javascript
import { Graph, Shape } from '@antv/x6';

Shape.HTML.register({
  shape: 'uml-class',
  effect: ['data'],  // Re-render when data changes
  html(node) {
    const data = node.getData() || {};
    const { className, stereotype, attributes, methods } = data;

    const div = document.createElement('div');
    div.style.cssText = 'width:100%;height:100%;border:2px solid #333;background:#fff;font-family:monospace;font-size:12px;display:flex;flex-direction:column;overflow:hidden;';

    // Class name section
    const header = document.createElement('div');
    header.style.cssText = 'padding:6px 8px;text-align:center;font-weight:bold;border-bottom:1px solid #333;';
    if (stereotype) {
      header.innerHTML = `<div style="font-size:10px;font-style:italic;">\u00AB${stereotype}\u00BB</div>`;
    }
    header.innerHTML += `<div>${className || 'ClassName'}</div>`;
    div.appendChild(header);

    // Attributes section
    const attrSection = document.createElement('div');
    attrSection.style.cssText = 'padding:4px 8px;border-bottom:1px solid #333;min-height:20px;';
    (attributes || []).forEach((attr) => {
      const line = document.createElement('div');
      line.textContent = attr;
      attrSection.appendChild(line);
    });
    div.appendChild(attrSection);

    // Methods section
    const methodSection = document.createElement('div');
    methodSection.style.cssText = 'padding:4px 8px;min-height:20px;';
    (methods || []).forEach((method) => {
      const line = document.createElement('div');
      line.textContent = method;
      methodSection.appendChild(line);
    });
    div.appendChild(methodSection);

    return div;
  },
});
```

## Complete Example: Class Inheritance Relationships

```javascript
import { Graph, Shape } from '@antv/x6';

const graph = new Graph({
  container: 'container',
  width: 900,
  height: 700,
  background: { color: '#fff' },
  grid: { visible: true, size: 10 },
  panning: { enabled: true, modifiers: 'ctrl' },
  mousewheel: { enabled: true, modifiers: 'ctrl' },
  connecting: {
    router: 'orth',
    connector: 'rounded',
  },
});

// Base class Animal
const animal = graph.addNode({
  shape: 'uml-class',
  x: 300,
  y: 50,
  width: 220,
  height: 140,
  data: {
    className: 'Animal',
    stereotype: 'abstract',
    attributes: [
      '# name: String',
      '# age: int',
    ],
    methods: [
      '+ getName(): String',
      '+ setName(name: String): void',
      '+ makeSound(): void {abstract}',
    ],
  },
});

// Subclass Dog
const dog = graph.addNode({
  shape: 'uml-class',
  x: 100,
  y: 300,
  width: 220,
  height: 120,
  data: {
    className: 'Dog',
    attributes: [
      '- breed: String',
    ],
    methods: [
      '+ makeSound(): void',
      '+ fetch(): void',
    ],
  },
});

// Subclass Cat
const cat = graph.addNode({
  shape: 'uml-class',
  x: 450,
  y: 300,
  width: 220,
  height: 120,
  data: {
    className: 'Cat',
    attributes: [
      '- indoor: boolean',
    ],
    methods: [
      '+ makeSound(): void',
      '+ purr(): void',
    ],
  },
});

// Interface
const serializable = graph.addNode({
  shape: 'uml-class',
  x: 600,
  y: 50,
  width: 200,
  height: 100,
  data: {
    className: 'Serializable',
    stereotype: 'interface',
    attributes: [],
    methods: [
      '+ serialize(): String',
      '+ deserialize(s: String): void',
    ],
  },
});

// Inheritance relationship: hollow triangle arrow
graph.addEdge({
  source: dog.id,
  target: animal.id,
  attrs: {
    line: {
      stroke: '#333',
      strokeWidth: 1.5,
      targetMarker: {
        name: 'path',
        d: 'M 0 -8 L 12 0 L 0 8 Z',
        fill: '#fff',
        stroke: '#333',
        strokeWidth: 1.5,
      },
    },
  },
  router: 'orth',
  connector: 'rounded',
});

graph.addEdge({
  source: cat.id,
  target: animal.id,
  attrs: {
    line: {
      stroke: '#333',
      strokeWidth: 1.5,
      targetMarker: {
        name: 'path',
        d: 'M 0 -8 L 12 0 L 0 8 Z',
        fill: '#fff',
        stroke: '#333',
        strokeWidth: 1.5,
      },
    },
  },
  router: 'orth',
  connector: 'rounded',
});

// Implementation relationship: dashed line + hollow triangle arrow
graph.addEdge({
  source: cat.id,
  target: serializable.id,
  attrs: {
    line: {
      stroke: '#333',
      strokeWidth: 1.5,
      strokeDasharray: '8 4',
      targetMarker: {
        name: 'path',
        d: 'M 0 -8 L 12 0 L 0 8 Z',
        fill: '#fff',
        stroke: '#333',
        strokeWidth: 1.5,
      },
    },
  },
  router: 'orth',
  connector: 'rounded',
});
```

## Alternative Using SVG Nodes

If complex HTML rendering is not needed, you can implement a simplified version using pure SVG markup:

```javascript
Graph.registerNode('uml-class-simple', {
  inherit: 'rect',
  width: 200,
  height: 120,
  attrs: {
    body: { fill: '#fff', stroke: '#333', strokeWidth: 2 },
    label: {
      text: 'ClassName',
      fontSize: 14,
      fontWeight: 'bold',
      fill: '#333',
      refY: 16,
      refX: 0.5,
    },
  },
}, true);
```

## UML Relationship Edge Styles

| Relationship Type | Line Style | Arrowhead |
|----------|----------|------|
| Inheritance (Generalization) | Solid line | Hollow triangle |
| Implementation (Realization) | Dashed line `strokeDasharray: '8 4'` | Hollow triangle |
| Association | Solid line | Normal arrow or none |
| Dependency | Dashed line `strokeDasharray: '5 3'` | Open arrow `'classic'` |
| Aggregation | Solid line | Hollow diamond |
| Composition | Solid line | Filled diamond |

### Custom Diamond Arrowheads (Aggregation/Composition)

```javascript
// Hollow diamond (aggregation)
targetMarker: {
  name: 'path',
  d: 'M 0 0 L 8 -5 L 16 0 L 8 5 Z',
  fill: '#fff',
  stroke: '#333',
  strokeWidth: 1.5,
}

// Filled diamond (composition)
targetMarker: {
  name: 'path',
  d: 'M 0 0 L 8 -5 L 16 0 L 8 5 Z',
  fill: '#333',
  stroke: '#333',
  strokeWidth: 1.5,
}
```

## Best Practices

1. **Use HTML nodes for complex sections**: HTML nodes are more flexible when there are many attributes and methods
2. **Orthogonal routing**: `router: 'orth'` keeps edges tidy
3. **Calculate node height dynamically**: `height = headerHeight + attrCount * lineHeight + methodCount * lineHeight`
4. **Inheritance arrowheads point to the parent class**: source is the subclass, target is the parent class
5. **Dashed lines indicate weaker relationships**: use dashed lines for implementation and dependency, and solid lines for inheritance and association
