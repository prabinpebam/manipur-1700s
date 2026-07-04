# Markdown parity

This page is authored in **Markdown** to show that prose renders exactly as before, while gaining the
same viewer affordances (TOC, deep links, copy buttons, collapsible sections) as HTML pages.

> [!NOTE]
> This blockquote uses GitHub-style alert syntax. Slate transforms it into a callout component.

## Callout mapping

Markdown blockquotes that start with an alert marker become styled callouts:

> [!TIP]
> Prefer Markdown for prose-heavy pages and HTML for layout-heavy ones.

> [!WARNING]
> Content must be a body fragment - no `<head>` or `<script>`.

> [!DANGER]
> Never hand-write CSS in content; compose from the component vocabulary.

## Prose, lists, and code

Ordinary Markdown works unchanged:

- Bullet lists
- **Bold** and *italic* text
- `inline code`

```js
// Fenced code blocks get syntax highlighting + a copy button
function greet(name) {
  return `Hello, ${name}`;
}
```

## A table

| Feature | Markdown | HTML |
| --- | --- | --- |
| Prose | Ideal | Verbose |
| Layout | Limited | Ideal |
| Components | Via mapping | Direct |

## Task list

- [x] Render Markdown
- [x] Map callouts
- [ ] Author your own content

## Links

An [internal link to the gallery](components.html) resolves to a hash route. An
[external link](https://example.com) opens in a new tab.
