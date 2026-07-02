/* ============================================================
   Slate — Runtime (slate.js)
   ------------------------------------------------------------
   Portable documentation viewer. Renders Markdown and HTML content
   through one pipeline (sanitize -> transform -> enhance), with
   client-side nav, TOC, search, theming, and config-driven branding.

   Depends on (loaded by index.html): marked, highlight.js, DOMPurify.
   Spec: ../../specs/  ·  Content root & paths: spec §02 REQ-AR-10..12
   ============================================================ */
(function () {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const state = {
    currentPath: null,
    docs: new Map(),          // rawPath -> { title, content, order, group, icon, badge, hidden, type, text }
    orderedPaths: [],         // navigable pages in reading order (for pager)
    fileTree: null,
    searchIndex: [],
    config: {},
    contentRoot: '',
    projectName: 'Docs',
    landing: null,
    sidebarOpen: false,
    scrollSpyCleanup: null,
    searchSel: -1,
    themePref: 'auto',
  };

  /* ==========================================================
     PATH HELPERS
     ========================================================== */
  function resolvePath(basePath, relativePath) {
    if (!relativePath || /^https?:\/\//.test(relativePath) || relativePath.startsWith('data:')) return relativePath;
    const baseDir = basePath.includes('/') ? basePath.substring(0, basePath.lastIndexOf('/') + 1) : '';
    const parts = (baseDir + relativePath).split('/');
    const out = [];
    for (const p of parts) { if (p === '..') out.pop(); else if (p !== '.' && p !== '') out.push(p); }
    return out.join('/');
  }
  // Prepend contentRoot for actual fetches / asset URLs (hash routes stay raw).
  function joinRoot(path) {
    if (!state.contentRoot || /^https?:\/\//.test(path) || path.startsWith('data:')) return path;
    const r = state.contentRoot.replace(/\/+$/, '');
    return r ? r + '/' + path.replace(/^\/+/, '') : path;
  }
  function humanize(str) {
    return str.replace(/[-_]/g, ' ').replace(/\.(md|html?)$/i, '').replace(/\b\w/g, c => c.toUpperCase());
  }
  function extractTitle(content, path) {
    const md = content.match(/^#\s+(.+)$/m);
    if (md) return md[1].replace(/\*\*/g, '').replace(/`/g, '').trim();
    const h1 = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (h1) return h1[1].replace(/<[^>]+>/g, '').trim();
    return humanize(path.split('/').pop());
  }
  function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
  function escRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function modClick(e) { return e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1; }

  /* ==========================================================
     CONFIG  (REQ-CF-*)
     ========================================================== */
  async function loadConfig() {
    let cfg = {};
    try { const r = await fetch('slate.config.json'); if (r.ok) cfg = await r.json(); } catch (_) {}
    state.pendingConfig = cfg;                       // merged with manifest header in discovery
    return cfg;
  }
  function applyConfig(cfg) {
    state.config = cfg || {};
    state.contentRoot = state.config.contentRoot || '';
    state.projectName = state.config.projectName || state.projectName;
    state.landing = state.config.landing || null;
    // Branding
    const logoText = $('#logo-text'); if (logoText && state.config.projectName) logoText.textContent = state.config.projectName;
    if (state.config.logo) {
      const mark = $('#logo-mark');
      if (mark) { mark.src = joinRoot(state.config.logo); mark.style.display = ''; }
    }
    if (state.config.brandColor) applyBrandColor(state.config.brandColor);
    if (state.config.displayFont) document.documentElement.style.setProperty('--font-family-display', state.config.displayFont);
    if (state.config.density) document.documentElement.setAttribute('data-density', state.config.density);
  }
  function applyBrandColor(hex) {
    const root = document.documentElement.style;
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    const shade = `color-mix(in srgb, ${hex} 85%, ${dark ? 'white' : 'black'})`;
    root.setProperty('--color-brand-bg', hex);
    root.setProperty('--color-brand-fg-1', hex);
    root.setProperty('--color-brand-stroke', hex);
    root.setProperty('--color-brand-bg-hover', shade);
    root.setProperty('--color-brand-fg-2', shade);
  }

  /* ==========================================================
     THEME  (REQ-CF-04, REQ-AP-04)
     ========================================================== */
  function resolveTheme(pref) {
    if (pref === 'light' || pref === 'dark') return pref;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function initTheme() {
    const def = (state.pendingConfig && state.pendingConfig.defaultTheme) || 'auto';
    applyTheme(localStorage.getItem('slate-theme-pref') || def, false);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if ((localStorage.getItem('slate-theme-pref') || def) === 'auto') applyTheme('auto', false);
    });
  }
  function applyTheme(pref, persist = true) {
    state.themePref = pref;
    if (persist) localStorage.setItem('slate-theme-pref', pref);
    const actual = resolveTheme(pref);
    document.documentElement.setAttribute('data-theme', actual);
    const light = $('#hljs-light'), darkS = $('#hljs-dark');
    if (light) light.disabled = (actual === 'dark');
    if (darkS) darkS.disabled = (actual === 'light');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', actual === 'dark' ? '#292929' : '#ffffff');
    updateThemeButton(pref);
    if (state.config && state.config.brandColor) applyBrandColor(state.config.brandColor);
    if (window.hljs) $$('#document pre code[data-highlighted]').forEach(el => { el.removeAttribute('data-highlighted'); hljs.highlightElement(el); });
  }
  function updateThemeButton(pref) {
    const btn = $('.theme-toggle'); if (!btn) return;
    const icon = pref === 'light' ? 'light_mode' : pref === 'dark' ? 'dark_mode' : 'brightness_auto';
    const label = 'Theme: ' + pref + ' \u2014 click to change';
    btn.innerHTML = `<span class="material-symbols-outlined" aria-hidden="true">${icon}</span>`;
    btn.setAttribute('aria-label', label); btn.title = label;
  }
  function toggleTheme() {
    const order = ['light', 'dark', 'auto'];
    applyTheme(order[(order.indexOf(state.themePref) + 1) % order.length], true);
  }

  /* ==========================================================
     DISCOVERY  (REQ-AR-05/07/09)
     ========================================================== */
  async function discover() {
    try {
      const resp = await fetch(joinRoot('docs-manifest.json'));
      if (resp.ok) { await loadFromManifest(await resp.json()); return true; }
    } catch (_) {}
    return await crawl();
  }
  async function loadFromManifest(manifest) {
    // Normalize v1 (array) and v2 (object) -> entries + optional config header (REQ-MF-01)
    let entries = [], headerCfg = {};
    if (Array.isArray(manifest)) entries = manifest;
    else if (manifest && typeof manifest === 'object') { entries = manifest.entries || []; headerCfg = manifest.config || {}; }
    // Precedence: standalone config wins over manifest header (REQ-CF-05)
    applyConfig(Object.assign({}, headerCfg, state.pendingConfig || {}));

    await Promise.all(entries.map(async (entry, idx) => {
      const type = entry.type || 'page';
      if (type !== 'page') {
        state.docs.set(entry.path || ('__' + type + '_' + idx), {
          title: entry.title || '', order: entry.order != null ? entry.order : idx,
          group: entry.group, type, content: '', hidden: !!entry.hidden,
        });
        return;
      }
      try {
        const r = await fetch(joinRoot(entry.path));
        if (!r.ok) return;
        const content = await r.text();
        state.docs.set(entry.path, {
          title: entry.title || extractTitle(content, entry.path),
          content, order: entry.order != null ? entry.order : idx,
          group: entry.group, icon: entry.icon, badge: entry.badge,
          hidden: !!entry.hidden, type,
        });
      } catch (_) {}
    }));
    return true;
  }
  function extractLinks(content, basePath) {
    const links = new Set();
    const re = /\[[^\]]*\]\(([^)]+\.(?:md|html?)(?:#[^)]*)?)\)/g;
    let m;
    while ((m = re.exec(content)) !== null) {
      const href = m[1].split('#')[0];
      if (href && !/^https?:/.test(href)) links.add(resolvePath(basePath, href));
    }
    return links;
  }
  async function crawl() {
    const seeds = ['README.md', 'readme.md', 'index.md', 'index.html'];
    const queue = [...seeds], visited = new Set();
    applyConfig(state.pendingConfig || {});
    while (queue.length) {
      const batch = [];
      while (queue.length && batch.length < 8) { const p = queue.shift(); if (!visited.has(p)) { visited.add(p); batch.push(p); } }
      if (!batch.length) break;
      await Promise.all(batch.map(async (path) => {
        try {
          const r = await fetch(joinRoot(path)); if (!r.ok) return;
          const content = await r.text();
          state.docs.set(path, { title: extractTitle(content, path), content, type: 'page' });
          for (const l of extractLinks(content, path)) if (!visited.has(l)) queue.push(l);
        } catch (_) {}
      }));
    }
    return state.docs.size > 0;
  }

  /* ==========================================================
     RENDER + SANITIZE  (REQ-CM-01/03, REQ-SEC-*)
     ========================================================== */
  const SANITIZE_TRUSTED = {
    ADD_TAGS: ['figure', 'figcaption', 'section', 'article', 'aside', 'header', 'footer', 'dl', 'dt', 'dd'],
    ADD_ATTR: ['class', 'data-cols', 'role', 'aria-label', 'aria-hidden', 'colspan', 'rowspan', 'target', 'rel'],
    ALLOW_DATA_ATTR: true,
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'link', 'meta'],
    FORBID_ATTR: ['style'],
    ALLOW_UNKNOWN_PROTOCOLS: false,
  };
  function renderToHtml(path, content) {
    const isHtml = /\.html?$/i.test(path);
    let html = isHtml ? content : (window.marked ? marked.parse(content) : content);
    if (window.DOMPurify) html = DOMPurify.sanitize(html, SANITIZE_TRUSTED);
    return html;
  }

  /* ==========================================================
     PIPELINE  (REQ-CM-02/07)  order is normative
     ========================================================== */
  function postProcess(container, basePath) {
    transformCallouts(container);          // REQ-CM-11
    // Links
    container.querySelectorAll('a').forEach(a => {
      const href = a.getAttribute('href'); if (!href) return;
      if (/^https?:\/\//.test(href)) { a.target = '_blank'; a.rel = 'noopener noreferrer'; return; }
      const m = href.match(/^(.+\.(?:md|html?))(#.*)?$/i);
      if (m) {
        const resolved = resolvePath(basePath, m[1]); const anchor = m[2] || '';
        a.setAttribute('href', '#' + resolved + anchor);
        a.addEventListener('click', (e) => {
          e.preventDefault(); navigateTo(resolved);
          if (anchor) { const id = decodeURIComponent(anchor.slice(1)); requestAnimationFrame(() => { const el = document.getElementById(id); if (el) { expandToTarget(el); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }); }
        });
      }
    });
    // Images (resolve against contentRoot for display)
    container.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('src');
      if (src && !/^https?:/.test(src) && !src.startsWith('data:')) img.src = joinRoot(resolvePath(basePath, src));
    });
    // Heading IDs + permalink anchors
    container.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(h => {
      if (!h.id) h.id = h.textContent.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
      if (h.tagName !== 'H1' && !h.querySelector('.heading-anchor')) {
        const a = document.createElement('a');
        a.className = 'heading-anchor'; a.href = '#' + state.currentPath + '#' + h.id; a.textContent = '#';
        a.setAttribute('aria-hidden', 'true'); a.tabIndex = -1;
        a.addEventListener('click', (e) => { e.preventDefault(); expandToTarget(h); h.scrollIntoView({ behavior: 'smooth', block: 'start' }); window.location.hash = state.currentPath + '#' + h.id; });
        h.appendChild(a);
      }
    });
    // Code copy buttons
    container.querySelectorAll('pre').forEach(pre => {
      const btn = document.createElement('button');
      btn.className = 'copy-btn'; btn.title = 'Copy code'; btn.setAttribute('aria-label', 'Copy code to clipboard'); btn.innerHTML = COPY_SVG;
      btn.addEventListener('click', () => { const code = pre.querySelector('code'); if (!code) return; navigator.clipboard.writeText(code.textContent).then(() => { btn.innerHTML = CHECK_SVG; setTimeout(() => { btn.innerHTML = COPY_SVG; }, 1600); }); });
      pre.appendChild(btn);
    });
    makeSectionsCollapsible(container);
    enhanceFigures(container);
    if (window.hljs) container.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
  }

  function transformCallouts(container) {
    container.querySelectorAll(':scope > blockquote, blockquote').forEach(bq => {
      const first = bq.querySelector('p'); if (!first) return;
      const m = first.textContent.match(/^\s*\[!(NOTE|TIP|INFO|WARNING|DANGER)\]\s*(.*)$/i);
      if (!m) return;
      const type = m[1].toLowerCase(), rest = m[2].trim();
      const div = document.createElement('div');
      div.className = 'slate-callout slate-callout--' + type; div.setAttribute('role', 'note');
      const titleMap = { note: 'Note', tip: 'Tip', info: 'Info', warning: 'Warning', danger: 'Careful' };
      const title = document.createElement('p'); title.className = 'slate-callout__title'; title.textContent = rest || titleMap[type];
      div.appendChild(title);
      // Move remaining nodes (drop the marker paragraph)
      const nodes = Array.from(bq.childNodes); let removedFirst = false;
      nodes.forEach(n => { if (!removedFirst && n === first) { removedFirst = true; return; } div.appendChild(n); });
      bq.replaceWith(div);
    });
  }

  function makeSectionsCollapsible(container) {
    ['H2', 'H3'].forEach(tag => {
      const level = Number(tag.charAt(1));
      $$(tag, container).forEach(heading => {
        if (heading.closest('[class*="slate-"]')) return;   // skip component-internal headings
        const section = document.createElement('section'); section.className = 'doc-section';
        const body = document.createElement('div'); body.className = 'doc-section-body';
        let sib = heading.nextSibling;
        while (sib) {
          const next = sib.nextSibling;
          if (sib.nodeType === 1 && /^H[1-6]$/.test(sib.tagName) && Number(sib.tagName.charAt(1)) <= level) break;
          body.appendChild(sib); sib = next;
        }
        heading.parentNode.insertBefore(section, heading); section.appendChild(heading); section.appendChild(body);
        addCollapseToggle(heading, section);
      });
    });
  }
  function addCollapseToggle(heading, section) {
    const t = document.createElement('button');
    t.className = 'collapse-toggle'; t.title = 'Collapse section'; t.setAttribute('aria-label', 'Collapse section'); t.setAttribute('aria-expanded', 'true'); t.innerHTML = CHEVRON_SVG;
    t.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); const c = section.classList.toggle('collapsed'); t.setAttribute('aria-expanded', String(!c)); t.title = c ? 'Expand section' : 'Collapse section'; });
    heading.prepend(t);
  }
  function expandToTarget(el) {
    if (!el) return; let s = el.closest('.doc-section');
    while (s) { if (s.classList.contains('collapsed')) { const tg = s.querySelector(':scope > h2 > .collapse-toggle, :scope > h3 > .collapse-toggle'); if (tg) tg.click(); else s.classList.remove('collapsed'); } s = s.parentElement ? s.parentElement.closest('.doc-section') : null; }
  }
  function enhanceFigures(container) {
    container.querySelectorAll('.slate-figure img').forEach(img => {
      img.addEventListener('click', () => {
        const box = document.createElement('div'); box.className = 'slate-lightbox';
        const big = document.createElement('img'); big.src = img.src; big.alt = img.alt || '';
        box.appendChild(big); box.addEventListener('click', () => box.remove());
        document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { box.remove(); document.removeEventListener('keydown', esc); } });
        document.body.appendChild(box);
      });
    });
  }

  /* ==========================================================
     NAVIGATION  (REQ-UX-03..07)
     ========================================================== */
  function buildFileTree() {
    const root = { name: '', children: new Map(), files: [] };
    for (const [path, doc] of state.docs) {
      if (doc.hidden) continue;
      if (doc.type && doc.type !== 'page') continue;
      const parts = path.split('/'); let node = root;
      for (let i = 0; i < parts.length - 1; i++) { if (!node.children.has(parts[i])) node.children.set(parts[i], { name: parts[i], children: new Map(), files: [] }); node = node.children.get(parts[i]); }
      node.files.push({ path, title: doc.title, filename: parts[parts.length - 1], order: doc.order != null ? doc.order : Infinity, icon: doc.icon, badge: doc.badge });
    }
    state.fileTree = root;
    // Ordered navigable pages (for pager)
    state.orderedPaths = [...state.docs.entries()]
      .filter(([, d]) => !d.hidden && (!d.type || d.type === 'page'))
      .sort((a, b) => (a[1].order ?? Infinity) - (b[1].order ?? Infinity) || String(a[1].title).localeCompare(String(b[1].title)))
      .map(([p]) => p);
  }
  function folderMinOrder(folder) {
    let min = Infinity; for (const f of folder.files) min = Math.min(min, f.order ?? Infinity);
    for (const [, c] of folder.children) min = Math.min(min, folderMinOrder(c)); return min;
  }
  function renderNav() {
    const nav = $('.nav-tree'); nav.innerHTML = ''; const tree = state.fileTree;
    const rootFiles = [...tree.files].sort((a, b) => { if (a.filename.toLowerCase() === 'readme.md') return -1; if (b.filename.toLowerCase() === 'readme.md') return 1; return (a.order ?? Infinity) - (b.order ?? Infinity) || a.title.localeCompare(b.title); });
    rootFiles.forEach(f => nav.appendChild(makeNavItem(f)));
    [...tree.children.entries()].sort((a, b) => folderMinOrder(a[1]) - folderMinOrder(b[1]) || a[0].localeCompare(b[0])).forEach(([n, f]) => nav.appendChild(makeNavFolder(n, f)));
  }
  function makeNavItem(file) {
    const a = document.createElement('a');
    a.className = 'nav-item'; a.href = '#' + file.path; a.dataset.path = file.path; a.title = file.title;
    a.innerHTML = `<span class="material-symbols-outlined nav-icon" aria-hidden="true">${esc(file.icon || 'description')}</span><span class="nav-item-text">${esc(file.title)}</span>${file.badge ? `<span class="nav-badge">${esc(file.badge)}</span>` : ''}`;
    a.addEventListener('click', (e) => { if (modClick(e)) return; e.preventDefault(); navigateTo(file.path); });
    return a;
  }
  function makeNavFolder(name, folder) {
    const group = document.createElement('div'); group.className = 'nav-folder expanded';
    const header = document.createElement('button'); header.className = 'nav-folder-header';
    header.innerHTML = `<span class="material-symbols-outlined nav-chevron" aria-hidden="true">chevron_right</span><span class="material-symbols-outlined nav-folder-icon" aria-hidden="true">folder</span><span class="nav-folder-text">${esc(humanize(name))}</span>`;
    header.addEventListener('click', () => group.classList.toggle('expanded'));
    const content = document.createElement('div'); content.className = 'nav-folder-content';
    [...folder.files].sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity) || a.title.localeCompare(b.title)).forEach(f => content.appendChild(makeNavItem(f)));
    [...folder.children.entries()].sort((a, b) => folderMinOrder(a[1]) - folderMinOrder(b[1]) || a[0].localeCompare(b[0])).forEach(([n, f]) => content.appendChild(makeNavFolder(n, f)));
    group.appendChild(header); group.appendChild(content); return group;
  }
  function setAllFolders(expanded) { $$('.nav-folder').forEach(f => f.classList.toggle('expanded', expanded)); }

  /* ==========================================================
     BREADCRUMBS + PAGER  (REQ-UX-20/21)
     ========================================================== */
  function renderBreadcrumbs(path) {
    const parts = path.split('/'); const crumbs = [];
    crumbs.push('<a href="#' + (state.landing || 'README.md') + '">Home</a>');
    for (let i = 0; i < parts.length - 1; i++) crumbs.push('<span>' + esc(humanize(parts[i])) + '</span>');
    crumbs.push('<span>' + esc(state.docs.get(path)?.title || humanize(parts[parts.length - 1])) + '</span>');
    return '<nav class="breadcrumbs" aria-label="Breadcrumb">' + crumbs.join('<span class="sep">/</span>') + '</nav>';
  }
  function renderPager(path) {
    const i = state.orderedPaths.indexOf(path); if (i < 0) return '';
    const prev = i > 0 ? state.orderedPaths[i - 1] : null;
    const next = i < state.orderedPaths.length - 1 ? state.orderedPaths[i + 1] : null;
    if (!prev && !next) return '';
    const link = (p, dir, cls) => p ? `<a class="${cls}" href="#${esc(p)}" data-path="${esc(p)}"><span class="pager-dir">${dir}</span><span class="pager-title">${esc(state.docs.get(p).title)}</span></a>` : '<span class="pager-spacer"></span>';
    return `<div class="pager">${link(prev, 'Previous', 'pager-prev')}${link(next, 'Next', 'pager-next')}</div>`;
  }

  /* ==========================================================
     NAVIGATE / RENDER A PAGE
     ========================================================== */
  function navigateTo(path) {
    const entry = state.docs.get(path); if (!entry) return;
    state.currentPath = path;
    const hash = window.location.hash.slice(1);
    if (hash.split('#')[0] !== path) window.location.hash = path;

    const article = $('#document');
    article.innerHTML = renderBreadcrumbs(path) + '<div class="page-body"></div>';
    const body = article.querySelector('.page-body');
    body.innerHTML = renderToHtml(path, entry.content);
    postProcess(body, path);
    // Pager appended after body
    article.insertAdjacentHTML('beforeend', renderPager(path));
    article.querySelectorAll('.pager a').forEach(a => a.addEventListener('click', (e) => { e.preventDefault(); navigateTo(a.dataset.path); }));

    $$('.nav-item').forEach(it => it.classList.toggle('active', it.dataset.path === path));
    document.title = `${entry.title} - ${state.projectName}`;
    buildToc(body);
    $('#content').scrollTop = 0;
    if (state.sidebarOpen) toggleSidebar();

    const ai = window.location.hash.indexOf('#', 1);
    if (ai > 0) { const anchor = decodeURIComponent(window.location.hash.slice(ai + 1)); requestAnimationFrame(() => { const el = document.getElementById(anchor); if (el) { expandToTarget(el); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }); }
  }

  /* ==========================================================
     TABLE OF CONTENTS + SCROLLSPY  (REQ-UX-08/09)
     ========================================================== */
  function headingText(h) {
    const c = h.cloneNode(true);
    c.querySelectorAll('.collapse-toggle, .heading-anchor').forEach(n => n.remove());
    return c.textContent.trim();
  }
  function buildToc(container) {
    const tocEl = $('#toc'); const tocNav = tocEl.querySelector('.toc-nav'); tocNav.innerHTML = '';
    if (state.scrollSpyCleanup) { state.scrollSpyCleanup(); state.scrollSpyCleanup = null; }
    const article = $('#document'); const oldMobile = article.querySelector('.toc-mobile'); if (oldMobile) oldMobile.remove();
    const headings = $$('h2, h3', container).filter(h => !h.closest('[class*="slate-"]'));
    if (!headings.length) { tocEl.classList.add('hidden'); return; }
    tocEl.classList.remove('hidden');

    const mobile = document.createElement('details'); mobile.className = 'toc-mobile';
    mobile.innerHTML = '<summary>On this page<span class="material-symbols-outlined" aria-hidden="true">expand_more</span></summary>';
    const mList = document.createElement('div'); mList.className = 'toc-mobile__list'; mobile.appendChild(mList);

    const items = [];
    headings.forEach(h => {
      const cls = 'toc-item' + (h.tagName === 'H3' ? ' toc-item--nested' : '');
      const label = headingText(h); const href = '#' + state.currentPath + '#' + h.id;
      const go = (e) => { if (modClick(e)) return; e.preventDefault(); expandToTarget(h); h.scrollIntoView({ behavior: 'smooth', block: 'start' }); window.location.hash = href; if (mobile.open) mobile.open = false; };
      const item = document.createElement('a'); item.className = cls; item.textContent = label; item.href = href; item.addEventListener('click', go); tocNav.appendChild(item); items.push(item);
      const mItem = document.createElement('a'); mItem.className = cls; mItem.textContent = label; mItem.href = href; mItem.addEventListener('click', go); mList.appendChild(mItem);
    });
    if (container.parentElement) container.parentElement.insertBefore(mobile, container);

    const contentEl = $('#content'); const visible = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) visible.add(en.target); else visible.delete(en.target); });
      let idx = -1;
      for (let i = 0; i < headings.length; i++) { if (visible.has(headings[i])) { idx = i; break; } }
      if (idx === -1) for (let i = 0; i < headings.length; i++) { if (headings[i].getBoundingClientRect().top < 120) idx = i; }
      items.forEach((it, i) => it.classList.toggle('active', i === idx));
    }, { root: contentEl, rootMargin: '-64px 0px -70% 0px', threshold: 0 });
    headings.forEach(h => io.observe(h));
    state.scrollSpyCleanup = () => io.disconnect();
  }

  /* ==========================================================
     SEARCH  (REQ-UX-10..13, D-SEARCH-1)
     Index RENDERED text via a one-time offscreen render pass.
     ========================================================== */
  function buildSearchIndex() {
    state.searchIndex = [];
    const scratch = document.createElement('div'); scratch.style.display = 'none'; document.body.appendChild(scratch);
    for (const [path, doc] of state.docs) {
      if (doc.type && doc.type !== 'page') continue;
      scratch.innerHTML = renderToHtml(path, doc.content || '');
      const text = (scratch.textContent || '').replace(/\s+/g, ' ').trim();
      doc.text = text;
      state.searchIndex.push({ path, title: doc.title, text });
    }
    scratch.remove();
  }
  function runSearch(query) {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase(); const results = [];
    for (const e of state.searchIndex) {
      const tl = e.title.toLowerCase(), cl = e.text.toLowerCase();
      const tm = tl.includes(q); const ci = cl.indexOf(q);
      if (tm || ci >= 0) {
        let snippet = '';
        if (ci >= 0) { const s = Math.max(0, ci - 50), en = Math.min(e.text.length, ci + query.length + 80); snippet = (s > 0 ? '…' : '') + e.text.substring(s, en).trim() + (en < e.text.length ? '…' : ''); }
        results.push({ path: e.path, title: e.title, snippet, score: tm ? 2 : 1 });
      }
    }
    return results.sort((a, b) => b.score - a.score).slice(0, 10);
  }
  function showSearchResults(results) {
    const c = $('.search-results'); state.searchSel = -1;
    const input = $('.search-input'); input.removeAttribute('aria-activedescendant');
    if (!results.length) { c.innerHTML = '<div class="search-empty">No results found</div>'; c.classList.add('visible'); return; }
    const q = input.value;
    c.innerHTML = results.map((r, i) => `<a id="sr-${i}" href="#${esc(r.path)}" class="search-result" data-path="${esc(r.path)}" role="option"><div class="search-result-title">${highlight(esc(r.title), q)}</div>${r.snippet ? `<div class="search-result-snippet">${highlight(esc(r.snippet), q)}</div>` : ''}</a>`).join('');
    c.classList.add('visible');
    $$('.search-result', c).forEach(el => el.addEventListener('click', (e) => { if (modClick(e)) return; e.preventDefault(); const query = input.value.trim(); navigateTo(el.dataset.path); closeSearch(); if (query) requestAnimationFrame(() => scrollToMatch(query)); }));
  }
  function searchResultEls() { return $$('.search-result', $('.search-results')); }
  function setSearchSel(i) {
    const els = searchResultEls(); if (!els.length) return;
    state.searchSel = (i + els.length) % els.length;
    els.forEach((el, idx) => el.classList.toggle('active', idx === state.searchSel));
    const active = els[state.searchSel]; active.scrollIntoView({ block: 'nearest' });
    $('.search-input').setAttribute('aria-activedescendant', active.id);
  }
  function highlight(text, query) { if (!query) return text; return text.replace(new RegExp('(' + escRegex(query) + ')', 'gi'), '<mark>$1</mark>'); }
  function closeSearch() { $('.search-results').classList.remove('visible'); $('.search-input').value = ''; $('.search-input').blur(); }
  function scrollToMatch(query) {
    const article = $('#document'); const q = query.toLowerCase();
    $$('.search-highlight', article).forEach(el => el.replaceWith(...el.childNodes));
    const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT, { acceptNode(n) { return n.parentElement && n.parentElement.closest('.material-symbols-outlined, .collapse-toggle, .heading-anchor, .copy-btn') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; } }); let node;
    while ((node = walker.nextNode())) {
      const idx = node.textContent.toLowerCase().indexOf(q);
      if (idx >= 0) {
        if (node.parentElement) expandToTarget(node.parentElement);
        const range = document.createRange(); range.setStart(node, idx); range.setEnd(node, idx + query.length);
        const mark = document.createElement('mark'); mark.className = 'search-highlight';
        try { range.surroundContents(mark); } catch (_) { return; }
        mark.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => mark.classList.add('search-highlight-fade'), 800);
        setTimeout(() => { if (mark.parentNode) mark.replaceWith(...mark.childNodes); }, 3000);
        return;
      }
    }
  }

  /* ==========================================================
     SIDEBAR (mobile)
     ========================================================== */
  function toggleSidebar() { state.sidebarOpen = !state.sidebarOpen; $('#sidebar').classList.toggle('open', state.sidebarOpen); $('#overlay').classList.toggle('visible', state.sidebarOpen); }

  /* ==========================================================
     SVG ICONS
     ========================================================== */
  const CHEVRON_SVG = '<span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>';
  const COPY_SVG = '<span class="material-symbols-outlined" aria-hidden="true">content_copy</span>';
  const CHECK_SVG = '<span class="material-symbols-outlined" aria-hidden="true">done</span>';

  /* ==========================================================
     EVENTS + ROUTER
     ========================================================== */
  function initBackToTop() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top'; btn.type = 'button'; btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">arrow_upward</span>';
    document.body.appendChild(btn);
    const contentEl = $('#content');
    btn.addEventListener('click', () => contentEl.scrollTo({ top: 0, behavior: 'smooth' }));
    let ticking = false;
    contentEl.addEventListener('scroll', () => { if (ticking) return; ticking = true; requestAnimationFrame(() => { btn.classList.toggle('visible', contentEl.scrollTop > 400); ticking = false; }); });
  }

  function bindEvents() {
    $('.theme-toggle').addEventListener('click', toggleTheme);
    $('.menu-toggle').addEventListener('click', toggleSidebar);
    $('#overlay').addEventListener('click', toggleSidebar);
    $('.logo').addEventListener('click', (e) => { e.preventDefault(); navigateTo(state.landing || firstPath()); });
    const expandBtn = $('#expand-all-btn'), collapseBtn = $('#collapse-all-btn');
    if (expandBtn) expandBtn.addEventListener('click', () => setAllFolders(true));
    if (collapseBtn) collapseBtn.addEventListener('click', () => setAllFolders(false));
    const input = $('.search-input');
    input.addEventListener('input', () => { const q = input.value.trim(); if (q.length < 2) { $('.search-results').classList.remove('visible'); return; } showSearchResults(runSearch(q)); });
    input.addEventListener('focus', () => { const q = input.value.trim(); if (q.length >= 2) showSearchResults(runSearch(q)); });
    input.addEventListener('keydown', (e) => {
      const rc = $('.search-results'); if (!rc.classList.contains('visible')) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); setSearchSel(state.searchSel + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setSearchSel(state.searchSel - 1); }
      else if (e.key === 'Enter') { const els = searchResultEls(); const el = els[state.searchSel] || els[0]; if (el) { e.preventDefault(); el.click(); } }
    });
    const skip = $('.skip-link'); if (skip) skip.addEventListener('click', (e) => { e.preventDefault(); const m = $('#content'); if (m) { m.setAttribute('tabindex', '-1'); m.focus(); } });
    document.addEventListener('click', (e) => { const a = e.target.closest && e.target.closest('a[href^="#"]'); if (a && (e.metaKey || e.ctrlKey || e.shiftKey)) e.stopPropagation(); }, true);
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); input.focus(); }
      if (e.key === 'Escape') closeSearch();
    });
    document.addEventListener('click', (e) => { if (!e.target.closest('.search-container')) $('.search-results').classList.remove('visible'); });
    window.addEventListener('hashchange', onRoute);
  }
  function firstPath() { return state.orderedPaths[0] || [...state.docs.keys()][0]; }
  function onRoute() {
    const hash = window.location.hash.slice(1); if (!hash) { navigateTo(state.landing || firstPath()); return; }
    const path = hash.split('#')[0];
    if (path !== state.currentPath && state.docs.has(path)) navigateTo(path);
    else if (path === state.currentPath) { const ai = hash.indexOf('#'); if (ai > 0) { const el = document.getElementById(decodeURIComponent(hash.slice(ai + 1))); if (el) { expandToTarget(el); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } } }
  }

  function showNotice() {
    $('#document').innerHTML = `<div class="notice"><h2>Local server required</h2><p>This viewer loads content with <code>fetch()</code>, which browsers block on <code>file://</code>. Serve the folder over HTTP, e.g.:</p><pre><code>python -m http.server 8080</code></pre><p>then open <code>http://localhost:8080/</code>.</p></div>`;
  }

  /* ==========================================================
     BOOTSTRAP
     ========================================================== */
  async function main() {
    await loadConfig();
    initTheme();
    bindEvents();
    initBackToTop();
    const ok = await discover();
    if (!ok) { if (location.protocol === 'file:') showNotice(); else $('#document').innerHTML = '<div class="empty-state"><h2>No content found</h2><p>Add a docs-manifest.json or a README.md.</p></div>'; return; }
    buildFileTree();
    renderNav();
    buildSearchIndex();
    onRoute();
    if (!state.currentPath) navigateTo(state.landing || firstPath());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', main);
  else main();
})();

