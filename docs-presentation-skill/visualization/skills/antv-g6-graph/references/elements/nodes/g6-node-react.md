---
id: "g6-node-react"
title: "G6 React/Vue Custom Node (react-node / vue-node)"
description: |
  Use @antv/g6-extension-react to define node content with React components.
  Supports UI libraries such as Ant Design and is suitable for complex node scenarios that include interaction logic, form inputs, and more.
  Node data is passed through component callbacks, and state response plus two-way communication with the graph instance are supported.

library: "g6"
version: "5.x"
category: "elements"
subcategory: "nodes"
tags:
  - "react-node"
  - "vue-node"
  - "React node"
  - "custom node"
  - "rich text node"
  - "g6-extension-react"

related:
  - "g6-node-html"
  - "g6-core-custom-element"

difficulty: "advanced"
completeness: "full"
created: "2026-04-16"
updated: "2026-04-16"
---

## Choosing an approach

| Approach | Recommended scenarios |
|------|---------|
| Built-in nodes (circle/rect, etc.) | Simple geometric graph shapes that require high performance (>2000 nodes) |
| HTML node (html) | Lightweight rich text without React/Vue dependencies |
| React node (react-node) | Integration with UI libraries such as Ant Design, including interaction logic |
| Vue node (vue-node) | Vue projects, integration with Element Plus, and similar use cases |

---

## React node

### Install dependencies

```bash
npm install @antv/g6-extension-react
# Vue projects: npm install @antv/g6-extension-vue
```

### Basic example

```jsx
import { ExtensionCategory, Graph, register } from '@antv/g6';
import { ReactNode } from '@antv/g6-extension-react';

// 1. register React node type
register(ExtensionCategory.NODE, 'react-node', ReactNode);

// 2. Define a React component
const MyNode = ({ data }) => (
  <div style={{
    width: '100%',
    height: '100%',
    background: '#fff',
    border: '1px solid #1783FF',
    borderRadius: 6,
    padding: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    {data.data.label}
  </div>
);

// 3. Use it in Graph
const graph = new Graph({
  container: 'container',
  data: {
    nodes: [
      { id: 'n1', style: { x: 100, y: 200 }, data: { label: 'Service A' } },
      { id: 'n2', style: { x: 400, y: 200 }, data: { label: 'Service B' } },
    ],
    edges: [{ source: 'n1', target: 'n2' }],
  },
  node: {
    type: 'react-node',
    style: {
      size: [120, 50],              // size must be specified
      component: (data) => <MyNode data={data} />,
    },
  },
  behaviors: ['drag-element', 'zoom-canvas', 'drag-canvas'],
});

graph.render();
```

> **Important:** React nodes must specify width and height through `style.size` (`[width, height]` or a single numeric value); otherwise the node size is 0.

### Responding to built-in interaction states

The `states` field in node data reflects the current built-in states (from behaviors such as `hover-activate` and `click-select`):

```jsx
register(ExtensionCategory.NODE, 'react-node', ReactNode);

const StatefulNode = ({ data }) => {
  const isActive = data.states?.includes('active');
  const isSelected = data.states?.includes('selected');

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: isSelected ? '#fff7e6' : '#fff',
      border: `2px solid ${isActive ? '#1783FF' : '#ddd'}`,
      borderRadius: 6,
      padding: 8,
      boxShadow: isActive ? '0 0 8px rgba(24,144,255,0.6)' : 'none',
      transform: `scale(${isActive ? 1.05 : 1})`,
      transition: 'all 0.2s',
    }}>
      {data.data.label}
    </div>
  );
};

const graph = new Graph({
  node: {
    type: 'react-node',
    style: {
      size: [140, 60],
      component: (data) => <StatefulNode data={data} />,
    },
  },
  behaviors: ['hover-activate', 'click-select', 'drag-element'],
});
```

### Two-way communication between node and graph instance

Inject the `graph` instance into the node component to allow operations inside the node to trigger graph updates:

```jsx
register(ExtensionCategory.NODE, 'react-node', ReactNode);

const ActionNode = ({ data, graph }) => {
  const handleToggle = () => {
    graph.updateNodeData([{
      id: data.id,
      data: { expanded: !data.data.expanded },
    }]);
    graph.draw();
  };

  return (
    <div style={{ width: '100%', height: '100%', padding: 10, background: '#fff', border: '1px solid #d9d9d9', borderRadius: 8 }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{data.data.name}</div>
      {data.data.expanded && (
        <div style={{ fontSize: 12, color: '#666' }}>{data.data.detail}</div>
      )}
      <button onClick={handleToggle} style={{ marginTop: 6, fontSize: 12 }}>
        {data.data.expanded ? 'Collapse' : 'Expand'}
      </button>
    </div>
  );
};

const graph = new Graph({
  container: 'container',
  data: {
    nodes: [
      {
        id: 'n1',
        style: { x: 100, y: 100 },
        data: { name: 'Server', detail: 'IP: 192.168.1.1 / status: running', expanded: false },
      },
    ],
    edges: [],
  },
  node: {
    type: 'react-node',
    style: {
      size: (datum) => datum.data.expanded ? [200, 120] : [200, 60],
      component: (data) => <ActionNode data={data} graph={graph} />,
    },
  },
  behaviors: ['drag-element', 'zoom-canvas', 'drag-canvas'],
});

graph.render();
```

### Integrating Ant Design components

```jsx
import { Badge, Card, Tag } from 'antd';
import { DatabaseFilled } from '@ant-design/icons';
import { ExtensionCategory, Graph, register } from '@antv/g6';
import { ReactNode } from '@antv/g6-extension-react';

register(ExtensionCategory.NODE, 'react-node', ReactNode);

const ServerNode = ({ data }) => {
  const { status, type } = data.data;
  return (
    <Card
      size="small"
      style={{ width: '100%', height: '100%', borderRadius: 8 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span><DatabaseFilled /> {data.id}</span>
        <Badge status={status} />
      </div>
      <Tag color={type === 'primary' ? 'blue' : 'default'}>{type}</Tag>
    </Card>
  );
};

const graph = new Graph({
  node: {
    type: 'react-node',
    style: {
      size: [200, 80],
      component: (data) => <ServerNode data={data} />,
    },
  },
});
```

---

## Vue node

```javascript
// Install: npm install @antv/g6-extension-vue
import { ExtensionCategory, Graph, register } from '@antv/g6';
import { VueNode } from '@antv/g6-extension-vue';
import { defineComponent } from 'vue';

register(ExtensionCategory.NODE, 'vue-node', VueNode);

const MyVueNode = defineComponent({
  props: ['data'],
  template: `
    <div style="width:100%;height:100%;background:#fff;border:1px solid #1783FF;border-radius:6px;padding:8px;text-align:center">
      {{ data.data.label }}
    </div>
  `,
});

const graph = new Graph({
  node: {
    type: 'vue-node',
    style: {
      size: [120, 50],
      component: (data) => h(MyVueNode, { data }),
    },
  },
});
```

---

## Notes

1. **Specify size:** React/Vue nodes must explicitly set `style.size`, either as a static value or a callback function.
2. **Update size when nodes expand/collapse:** If node size changes after expansion, use a callback such as `size: (datum) => datum.data.expanded ? [w2, h2] : [w1, h1]`.
3. **Performance limit:** React nodes have relatively high rendering cost and are not suitable for more than 500 nodes; use built-in nodes beyond that scale.
4. **Stop event bubbling:** If click events inside React components should not trigger G6 events, call `e.stopPropagation()`.
5. **Clean up on destroy:** Call `graph.destroy()` when the component unmounts to prevent memory leaks.