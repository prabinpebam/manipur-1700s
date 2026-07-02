---
id: "x6-core-filter"
title: "X6 SVG Filters"
description: |
  X6 built-in SVG filters: outline stroke, highlight glow, blur, dropShadow shadow, grayScale grayscale, sepia, saturate, hueRotate hue rotation, invert, brightness, and contrast.

library: "x6"
version: "3.x"
category: "core"
subcategory: "filter"
tags:
  - "filter"
  - "filters"
  - "shadow"
  - "blur"
  - "highlight"
  - "outline"
  - "drop-shadow"
  - "blur"
  - "grayScale"
  - "SVG filter"

related:
  - "x6-core-node"
  - "x6-core-edge"
  - "x6-core-highlighter"

use_cases:
  - "Add shadow effects to nodes"
  - "Highlight node outlines"
  - "Apply blur effects to nodes"
  - "Show grayscale or disabled node states"
  - "Highlight on mouse hover"

difficulty: "intermediate"
completeness: "full"
---

## Basic Usage

Use built-in filters through the `filter` attribute in a node or edge `attrs` configuration:

```javascript
graph.addNode({
  x: 100,
  y: 100,
  width: 120,
  height: 60,
  attrs: {
    body: {
      fill: '#fff',
      stroke: '#5F95FF',
      filter: {
        name: 'dropShadow',
        args: { dx: 2, dy: 2, blur: 3, color: 'rgba(0,0,0,0.2)' },
      },
    },
  },
});
```

## Built-in Filter List

### dropShadow (shadow)

Adds a drop shadow to an element:

```javascript
attrs: {
  body: {
    filter: {
      name: 'dropShadow',
      args: {
        dx: 2,        // Horizontal offset, default 0
        dy: 2,        // Vertical offset, default 0
        blur: 4,      // Blur radius, default 4
        color: 'black',  // Shadow color, default 'black'
        opacity: 0.3, // Shadow opacity, default 1
      },
    },
  },
}
```

### outline (outer stroke)

Adds a stroke around the outside of an element without affecting the element itself:

```javascript
attrs: {
  body: {
    filter: {
      name: 'outline',
      args: {
        color: 'blue',   // Stroke color, default 'blue'
        width: 2,        // Stroke width, default 1
        margin: 3,       // Spacing between the stroke and the element, default 2
        opacity: 1,      // Stroke opacity, default 1
      },
    },
  },
}
```

### highlight (highlight glow)

Adds a glow effect around an element:

```javascript
attrs: {
  body: {
    filter: {
      name: 'highlight',
      args: {
        color: 'red',    // Highlight color, default 'red'
        width: 2,        // Highlight expansion width, default 1
        blur: 5,         // Blur radius, default 0
        opacity: 0.8,    // Highlight opacity, default 1
      },
    },
  },
}
```

### blur (Gaussian blur)

```javascript
attrs: {
  body: {
    filter: {
      name: 'blur',
      args: {
        x: 3,  // Horizontal blur amount, default 2
        y: 3,  // Vertical blur amount (optional, defaults to the same as x)
      },
    },
  },
}
```

### grayScale (grayscale)

```javascript
attrs: {
  body: {
    filter: {
      name: 'grayScale',
      args: {
        amount: 1,  // Grayscale amount, 0-1; 1 is fully grayscale
      },
    },
  },
}
```

### sepia (sepia/retro)

```javascript
attrs: {
  body: {
    filter: {
      name: 'sepia',
      args: {
        amount: 1,  // 0-1
      },
    },
  },
}
```

### saturate (saturation)

```javascript
attrs: {
  body: {
    filter: {
      name: 'saturate',
      args: {
        amount: 0.5,  // < 1 decreases saturation; > 1 increases saturation
      },
    },
  },
}
```

### hueRotate (hue rotation)

```javascript
attrs: {
  body: {
    filter: {
      name: 'hueRotate',
      args: {
        angle: 90,  // Rotation angle (degrees)
      },
    },
  },
}
```

### invert (invert colors)

```javascript
attrs: {
  body: {
    filter: {
      name: 'invert',
      args: {
        amount: 1,  // 0-1; 1 is fully inverted
      },
    },
  },
}
```

### brightness (brightness)

```javascript
attrs: {
  body: {
    filter: {
      name: 'brightness',
      args: {
        amount: 1.5,  // < 1 darkens; > 1 brightens
      },
    },
  },
}
```

### contrast (contrast)

```javascript
attrs: {
  body: {
    filter: {
      name: 'contrast',
      args: {
        amount: 2,  // < 1 decreases contrast; > 1 increases contrast
      },
    },
  },
}
```

## Dynamically Add or Remove Filters

```javascript
const node = graph.addNode({
  x: 100, y: 100, width: 120, height: 60,
  attrs: { body: { fill: '#EFF4FF', stroke: '#5F95FF' } },
});

// Add a shadow on mouse hover
graph.on('node:mouseenter', ({ node }) => {
  node.attr('body/filter', {
    name: 'dropShadow',
    args: { dx: 0, dy: 4, blur: 8, color: 'rgba(0,0,0,0.15)' },
  });
});

// Remove the filter when the mouse leaves
graph.on('node:mouseleave', ({ node }) => {
  node.attr('body/filter', null);
});
```

## Disabled State Example

Use a grayscale filter to represent a node as "disabled":

```javascript
function setNodeDisabled(node, disabled) {
  if (disabled) {
    node.attr('body/filter', { name: 'grayScale', args: { amount: 1 } });
    node.attr('body/opacity', 0.6);
  } else {
    node.attr('body/filter', null);
    node.attr('body/opacity', 1);
  }
}
```

## Common Mistakes

### Do not write `filter` directly as a CSS filter string

```javascript
// Incorrect: CSS filter string syntax is not supported
attrs: {
  body: {
    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',  // Incorrect
  },
}
```

```javascript
// Correct: use X6 object syntax
attrs: {
  body: {
    filter: {
      name: 'dropShadow',
      args: { dx: 2, dy: 2, blur: 4, color: 'rgba(0,0,0,0.3)' },
    },  // Correct
  },
}
```

### Incorrect filter name spelling

```javascript
// Incorrect: names are spelled incorrectly
filter: { name: 'drop-shadow', args: {...} }  // Incorrect; should be 'dropShadow'
filter: { name: 'grayscale', args: {...} }    // Incorrect; should be 'grayScale'
filter: { name: 'hue-rotate', args: {...} }   // Incorrect; should be 'hueRotate'
```

Correct filter names (camelCase): `dropShadow`, `grayScale`, `hueRotate`
