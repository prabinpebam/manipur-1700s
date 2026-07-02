# Icons

The viewer uses **Google Material Symbols** (Outlined), loaded from the Google Fonts CDN. There is no
local icon set to maintain and **no emoji** anywhere in content or nav (SKILL.md hard rule 10).

## How it's loaded

Each shell host (`shell/index.html`, `demo/index.html`, and a project's content-root `index.html`)
includes the stylesheet in `<head>`:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined">
```

Icons are rendered as ligature spans:

```html
<span class="material-symbols-outlined">description</span>
```

`slate.css` sizes them by context (`font-size`), and `slate.js` injects them for nav items, folder
chevrons, the copy button, and collapsible-section toggles.

## Icons in use

| Where | Material Symbol |
| --- | --- |
| Menu (mobile) | `menu` |
| Search | `search` |
| Theme (light / dark) | `light_mode` / `dark_mode` |
| Expand all / Collapse all | `unfold_more` / `unfold_less` |
| Nav file (default) | `description` |
| Nav folder | `folder` |
| Nav folder chevron | `chevron_right` (rotates) |
| Section collapse toggle | `chevron_right` (rotates) |
| Copy code / copied | `content_copy` / `done` |

## Manifest `icon` key

A manifest entry's optional `icon` is a **Material Symbol name**. It overrides the default file icon
for that nav item:

```jsonc
{ "path": "strategy/vision.html", "title": "Vision", "icon": "flag" }
```

Browse names at <https://fonts.google.com/icons>.

## Offline note

Icons load from the Google Fonts CDN. For fully offline use, self-host the Material Symbols font and
swap the stylesheet `href` (the same pattern as vendoring `marked`/`highlight.js`/DOMPurify under
`shell/vendor/`).
