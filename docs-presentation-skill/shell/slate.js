/* ============================================================
   Slate - Runtime (slate.js)
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
          status: entry.status, updated: entry.updated,
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
    processVersionHistory(container);
    enhanceGallery(container);
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
  /* ==========================================================
     IMAGE VIEWER  (gallery lightbox with filmstrip + caption)
     ========================================================== */
  // Every content image becomes zoomable. Clicking one opens a fullscreen
  // viewer whose gallery is all images on the page (in DOM order), so the
  // filmstrip can jump to any of them. Caption sits at the bottom over a scrim
  // for contrast and starts collapsed so it never occludes the image.
  function enhanceGallery(container) {
    const imgs = Array.from(container.querySelectorAll('img')).filter(img => !img.closest('.slate-viewer'));
    if (!imgs.length) return;
    imgs.forEach((img, i) => {
      img.classList.add('slate-zoomable');
      img.addEventListener('click', () => openViewer(imgs, i));
    });
  }

  // ---- Version history (REQ-CM-14) ----
  // A hidden .slate-history block authored at the bottom of a section renders as
  // a "Version history" pill; clicking it opens a modal timeline. Iteration
  // context is preserved without cluttering the document inline.
  //   <div class="slate-history" data-history-title="Section name">
  //     <div class="slate-history__entry" data-when="2026-07-04 10:40">
  //       <p class="slate-history__summary">Short summary</p>
  //       <p>Longer context…</p>
  //     </div>
  //   </div>
  function formatHistoryWhen(raw) {
    if (!raw) return '';
    const d = new Date(String(raw).replace(' ', 'T'));
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
  function openHistoryModal(title, entries) {
    const overlay = document.createElement('div');
    overlay.className = 'slate-history-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    const dialog = document.createElement('div');
    dialog.className = 'slate-history-dialog';
    const head = document.createElement('div'); head.className = 'slate-history-dialog__head';
    const h = document.createElement('p'); h.className = 'slate-history-dialog__title'; h.textContent = title || 'Version history';
    const close = document.createElement('button'); close.type = 'button'; close.className = 'slate-history-dialog__close';
    close.setAttribute('aria-label', 'Close version history');
    close.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">close</span>';
    head.appendChild(h); head.appendChild(close);
    const body = document.createElement('div'); body.className = 'slate-history-dialog__body';
    entries.forEach(e => {
      const item = document.createElement('div'); item.className = 'slate-history-item';
      const when = document.createElement('p'); when.className = 'slate-history-item__when'; when.textContent = formatHistoryWhen(e.when);
      item.appendChild(when);
      if (e.summary) { const s = document.createElement('p'); s.className = 'slate-history-item__summary'; s.textContent = e.summary; item.appendChild(s); }
      if (e.body) { const b = document.createElement('div'); b.className = 'slate-history-item__body'; b.innerHTML = e.body; item.appendChild(b); }
      body.appendChild(item);
    });
    dialog.appendChild(head); dialog.appendChild(body); overlay.appendChild(dialog);
    function dismiss() {
      if (overlay.dataset.closing) return;
      overlay.dataset.closing = '1';
      overlay.classList.remove('is-open');
      document.removeEventListener('keydown', onKey);
      let done = false;
      const finish = () => {
        if (done) return; done = true;
        overlay.remove();
        document.documentElement.classList.remove('slate-history-open');
      };
      overlay.addEventListener('transitionend', ev => { if (ev.target === overlay && ev.propertyName === 'opacity') finish(); });
      setTimeout(finish, 260);
    }
    function onKey(ev) { if (ev.key === 'Escape') dismiss(); }
    close.addEventListener('click', dismiss);
    overlay.addEventListener('click', ev => { if (ev.target === overlay) dismiss(); });
    document.addEventListener('keydown', onKey);
    document.documentElement.classList.add('slate-history-open');
    document.body.appendChild(overlay);
    requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('is-open')));
    close.focus();
  }
  function processVersionHistory(container) {
    container.querySelectorAll('.slate-history:not([data-history-ready])').forEach(block => {
      block.setAttribute('data-history-ready', '1');
      const title = block.getAttribute('data-history-title') || 'Version history';
      const entries = [];
      block.querySelectorAll('.slate-history__entry').forEach(el => {
        const summaryEl = el.querySelector('.slate-history__summary');
        const clone = el.cloneNode(true);
        const sClone = clone.querySelector('.slate-history__summary'); if (sClone) sClone.remove();
        entries.push({ when: el.getAttribute('data-when') || '', summary: summaryEl ? summaryEl.textContent.trim() : '', body: clone.innerHTML.trim() });
      });
      if (!entries.length) return;
      entries.sort((a, b) => String(b.when).localeCompare(String(a.when)));
      const pill = document.createElement('button');
      pill.type = 'button'; pill.className = 'slate-history-pill';
      pill.setAttribute('aria-label', title + ' - ' + entries.length + ' revision' + (entries.length === 1 ? '' : 's'));
      pill.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">history</span><span>Version history</span><span class="slate-history-pill__count">' + entries.length + '</span>';
      pill.addEventListener('click', () => openHistoryModal(title, entries));
      block.parentNode.insertBefore(pill, block.nextSibling);
    });
  }

  function figcaptionFor(img) {
    const fig = img.closest('figure, .slate-figure');
    return fig ? fig.querySelector('figcaption') : null;
  }

  let viewer = null;
  function ensureViewer() {
    if (viewer) return viewer;
    const el = document.createElement('div');
    el.className = 'slate-viewer'; el.hidden = true;
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Image viewer');
    el.innerHTML =
      '<div class="slate-viewer__stage">' +
        '<button class="slate-viewer__close" type="button" aria-label="Close image viewer"><span class="material-symbols-outlined" aria-hidden="true">close</span></button>' +
        '<button class="slate-viewer__nav slate-viewer__nav--prev" type="button" aria-label="Previous image"><span class="material-symbols-outlined" aria-hidden="true">chevron_left</span></button>' +
        '<button class="slate-viewer__nav slate-viewer__nav--next" type="button" aria-label="Next image"><span class="material-symbols-outlined" aria-hidden="true">chevron_right</span></button>' +
        '<img class="slate-viewer__img" alt="">' +
        '<figure class="slate-viewer__caption" data-collapsed="true">' +
          '<button class="slate-viewer__caption-toggle" type="button" aria-expanded="false" aria-label="Expand caption">' +
            '<figcaption class="slate-viewer__caption-text"></figcaption>' +
            '<span class="slate-viewer__caption-chevron material-symbols-outlined" aria-hidden="true">keyboard_arrow_up</span>' +
          '</button>' +
        '</figure>' +
      '</div>' +
      '<div class="slate-viewer__filmstrip" aria-label="Image thumbnails"></div>';
    document.body.appendChild(el);

    const v = {
      el,
      stage: el.querySelector('.slate-viewer__stage'),
      img: el.querySelector('.slate-viewer__img'),
      caption: el.querySelector('.slate-viewer__caption'),
      captionToggle: el.querySelector('.slate-viewer__caption-toggle'),
      captionText: el.querySelector('.slate-viewer__caption-text'),
      prev: el.querySelector('.slate-viewer__nav--prev'),
      next: el.querySelector('.slate-viewer__nav--next'),
      filmstrip: el.querySelector('.slate-viewer__filmstrip'),
      items: [], index: 0, lastFocus: null, touchX: null, keyHandler: null,
    };

    el.querySelector('.slate-viewer__close').addEventListener('click', closeViewer);
    v.prev.addEventListener('click', () => showImage(v.index - 1));
    v.next.addEventListener('click', () => showImage(v.index + 1));
    v.captionToggle.addEventListener('click', () => {
      const collapsed = v.caption.getAttribute('data-collapsed') !== 'false';
      v.caption.setAttribute('data-collapsed', collapsed ? 'false' : 'true');
      v.captionToggle.setAttribute('aria-expanded', String(collapsed));
      v.captionToggle.setAttribute('aria-label', collapsed ? 'Collapse caption' : 'Expand caption');
    });
    // Click the dark backdrop (stage padding) to close; clicks on the image or
    // controls do not close.
    v.stage.addEventListener('click', (e) => { if (e.target === v.stage) closeViewer(); });
    // Touch swipe to move between images.
    v.stage.addEventListener('touchstart', (e) => { v.touchX = e.changedTouches[0].clientX; }, { passive: true });
    v.stage.addEventListener('touchend', (e) => {
      if (v.touchX == null) return;
      const dx = e.changedTouches[0].clientX - v.touchX; v.touchX = null;
      if (Math.abs(dx) > 45) showImage(v.index + (dx < 0 ? 1 : -1));
    }, { passive: true });

    viewer = v; return v;
  }

  function openViewer(imgs, index) {
    const v = ensureViewer();
    v.items = imgs; v.lastFocus = document.activeElement;
    v.el.classList.toggle('is-single', imgs.length < 2);
    // Build the filmstrip for this page.
    v.filmstrip.innerHTML = '';
    imgs.forEach((img, i) => {
      const b = document.createElement('button');
      b.className = 'slate-viewer__thumb'; b.type = 'button'; b.setAttribute('aria-label', 'View image ' + (i + 1));
      const t = document.createElement('img'); t.src = img.currentSrc || img.src; t.alt = ''; t.loading = 'lazy';
      b.appendChild(t); b.addEventListener('click', () => showImage(i));
      v.filmstrip.appendChild(b);
    });
    v.el.hidden = false;
    document.documentElement.classList.add('slate-viewer-open');
    // Start collapsed each time the viewer opens.
    v.caption.setAttribute('data-collapsed', 'true');
    v.captionToggle.setAttribute('aria-expanded', 'false');
    v.captionToggle.setAttribute('aria-label', 'Expand caption');
    v.keyHandler = (e) => {
      if (e.key === 'Escape') closeViewer();
      else if (e.key === 'ArrowLeft') showImage(v.index - 1);
      else if (e.key === 'ArrowRight') showImage(v.index + 1);
    };
    document.addEventListener('keydown', v.keyHandler);
    showImage(index);
    v.el.querySelector('.slate-viewer__close').focus();
  }

  function showImage(index) {
    const v = viewer; if (!v) return;
    const n = v.items.length; if (!n) return;
    v.index = Math.max(0, Math.min(index, n - 1));
    const img = v.items[v.index];
    v.img.src = img.currentSrc || img.src; v.img.alt = img.alt || '';
    // Caption: prefer a figcaption, fall back to alt text; hide if neither.
    const cap = figcaptionFor(img);
    v.captionText.textContent = '';
    let hasCaption = false;
    if (cap && cap.textContent.trim()) {
      Array.from(cap.cloneNode(true).childNodes).forEach(node => v.captionText.appendChild(node));
      hasCaption = true;
    } else if (img.alt && img.alt.trim()) {
      v.captionText.textContent = img.alt.trim(); hasCaption = true;
    }
    v.caption.hidden = !hasCaption;
    // Nav availability.
    v.prev.disabled = v.index === 0;
    v.next.disabled = v.index === n - 1;
    // Filmstrip active state + keep the active thumb in view.
    const thumbs = v.filmstrip.children;
    for (let i = 0; i < thumbs.length; i++) thumbs[i].classList.toggle('is-active', i === v.index);
    const active = thumbs[v.index];
    if (active) {
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      active.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  function closeViewer() {
    const v = viewer; if (!v || v.el.hidden) return;
    v.el.hidden = true;
    document.documentElement.classList.remove('slate-viewer-open');
    if (v.keyHandler) { document.removeEventListener('keydown', v.keyHandler); v.keyHandler = null; }
    v.img.src = '';
    if (v.lastFocus && v.lastFocus.focus) v.lastFocus.focus();
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
      node.files.push({ path, title: doc.title, filename: parts[parts.length - 1], order: doc.order != null ? doc.order : Infinity, icon: doc.icon, badge: doc.badge, status: doc.status, updated: doc.updated });
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
    const indicator = file.status
      ? `<span class="nav-status" data-status="${esc(String(file.status).toLowerCase())}" title="${esc(navMetaTitle(file))}" aria-label="${esc(statusLabel(file.status))}"></span>`
      : (file.badge ? `<span class="nav-badge">${esc(file.badge)}</span>` : '');
    a.innerHTML = `<span class="material-symbols-outlined nav-icon" aria-hidden="true">${esc(file.icon || 'description')}</span><span class="nav-item-text">${esc(file.title)}</span>${indicator}`;
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
     STATUS + LAST-UPDATED METADATA
     ========================================================== */
  const STATUS_LABELS = { stub: 'Stub', planned: 'Planned', draft: 'Draft', wip: 'In progress', review: 'In review', pending: 'Pending', deciding: 'Deciding', stable: 'Stable', published: 'Published', done: 'Done' };
  function statusLabel(s) { if (!s) return ''; const k = String(s).toLowerCase(); return STATUS_LABELS[k] || (String(s).charAt(0).toUpperCase() + String(s).slice(1)); }
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function absDate(d) { return d ? d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear() : ''; }
  function relativeTime(iso) {
    if (!iso) return '';
    const then = new Date(iso); if (isNaN(then.getTime())) return '';
    const secs = Math.floor((Date.now() - then.getTime()) / 1000);
    if (secs < 0) return 'just now';
    if (secs < 45) return 'just now';
    const mins = Math.floor(secs / 60);
    if (mins < 1) return 'just now';
    if (mins === 1) return 'a minute ago';
    if (mins < 60) return mins + ' minutes ago';
    const hrs = Math.floor(mins / 60);
    if (hrs === 1) return 'an hour ago';
    if (hrs < 24) return hrs + ' hours ago';
    const days = Math.floor(hrs / 24);
    if (days === 1) return 'yesterday';
    if (days < 7) return days + ' days ago';
    if (days < 11) return 'a week ago';
    if (days < 28) return Math.round(days / 7) + ' weeks ago';
    const months = Math.round(days / 30);
    if (days < 45) return 'a month ago';
    if (days < 335) return months + ' months ago';
    return absDate(then); // older than ~11 months -> absolute day month year
  }
  function navMetaTitle(file) {
    const bits = [];
    if (file.status) bits.push(statusLabel(file.status));
    if (file.updated) { const rel = relativeTime(file.updated); if (rel) bits.push('updated ' + rel); }
    return bits.join(' \u00b7 ');
  }
  function renderPageMeta(path, entry) {
    const doc = state.docs.get(path) || entry || {};
    const status = doc.status, updated = doc.updated;
    if (!status && !updated) return '';
    const parts = [];
    if (status) parts.push(`<span class="slate-pagemeta__status" data-status="${esc(String(status).toLowerCase())}">${esc(statusLabel(status))}</span>`);
    if (updated) { const rel = relativeTime(updated); if (rel) parts.push(`<span class="slate-pagemeta__updated" title="${esc(absDate(new Date(updated)))}">Updated ${esc(rel)}</span>`); }
    if (!parts.length) return '';
    return `<div class="slate-pagemeta">${parts.join('<span class="slate-pagemeta__sep" aria-hidden="true">\u00b7</span>')}</div>`;
  }

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
  const FADE_MS = 180;
  function navigateTo(path) {
    const entry = state.docs.get(path); if (!entry) return;
    const prevPath = state.currentPath;
    // Update route state synchronously so the hashchange router stays a no-op
    // and the URL stays correct even while the visual swap is deferred.
    state.currentPath = path;
    const hash = window.location.hash.slice(1);
    if (hash.split('#')[0] !== path) window.location.hash = path;

    const article = $('#document');
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // First paint, re-selecting the same page, or reduced-motion: swap at once.
    if (!prevPath || prevPath === path || reduced) { article.classList.remove('is-fading'); renderPage(path, entry); return; }
    // Cross-page: fade the current content out, swap it while invisible, then
    // fade the new content in. The scroll reset happens during the invisible
    // window, so there is no visible scroll animation and no jump.
    clearTimeout(state.fadeTimer);
    article.classList.add('is-fading');
    state.fadeTimer = setTimeout(() => {
      renderPage(path, entry);
      // Paint the hidden state with the new content, then release for fade-in.
      requestAnimationFrame(() => requestAnimationFrame(() => article.classList.remove('is-fading')));
    }, FADE_MS);
  }

  function renderPage(path, entry) {
    const article = $('#document');
    article.innerHTML = renderBreadcrumbs(path) + renderPageMeta(path, entry) + '<div class="page-body"></div>';
    const body = article.querySelector('.page-body');
    // Parse in an inert document (DOMParser docs do not load subresources) so
    // images are not fetched with their raw, pre-rewrite src; postProcess fixes
    // the paths before the nodes are attached, so each asset is fetched once.
    const parsed = new DOMParser().parseFromString(renderToHtml(path, entry.content), 'text/html');
    postProcess(parsed.body, path);
    while (parsed.body.firstChild) body.appendChild(parsed.body.firstChild);
    // Pager appended after body
    article.insertAdjacentHTML('beforeend', renderPager(path));
    article.querySelectorAll('.pager a').forEach(a => a.addEventListener('click', (e) => { e.preventDefault(); navigateTo(a.dataset.path); }));

    $$('.nav-item').forEach(it => it.classList.toggle('active', it.dataset.path === path));
    document.title = `${entry.title} - ${state.projectName}`;
    buildToc(body);
    // Reset scroll instantly (not smoothly) - the fade covers the change, so an
    // animated scroll here would read as "same page, just scrolled".
    $('#content').scrollTo({ top: 0, behavior: 'instant' }); window.scrollTo({ top: 0, behavior: 'instant' });
    if (state.sidebarOpen) toggleSidebar();

    const ai = window.location.hash.indexOf('#', 1);
    if (ai > 0) { const anchor = decodeURIComponent(window.location.hash.slice(ai + 1)); requestAnimationFrame(() => { const el = document.getElementById(anchor); if (el) { expandToTarget(el); el.scrollIntoView({ behavior: 'instant', block: 'start' }); } }); }
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
    }, { root: null, rootMargin: '-64px 0px -70% 0px', threshold: 0 });
    headings.forEach(h => io.observe(h));
    state.scrollSpyCleanup = () => io.disconnect();
  }

  /* ==========================================================
     SEARCH  (REQ-UX-10..13, D-SEARCH-1)
     Index RENDERED text via a one-time offscreen render pass.
     ========================================================== */
  function buildSearchIndex() {
    state.searchIndex = [];
    for (const [path, doc] of state.docs) {
      if (doc.type && doc.type !== 'page') continue;
      // Parse inert (DOMParser docs never fetch images/subresources) so building
      // the index does not trigger asset requests for every page at startup.
      const parsed = new DOMParser().parseFromString(renderToHtml(path, doc.content || ''), 'text/html');
      const text = (parsed.body.textContent || '').replace(/\s+/g, ' ').trim();
      doc.text = text;
      state.searchIndex.push({ path, title: doc.title, text });
    }
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
    const getTop = () => Math.max(contentEl.scrollTop || 0, window.scrollY || document.documentElement.scrollTop || 0);
    btn.addEventListener('click', () => { contentEl.scrollTo({ top: 0, behavior: 'smooth' }); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    let ticking = false;
    const onScroll = () => { if (ticking) return; ticking = true; requestAnimationFrame(() => { btn.classList.toggle('visible', getTop() > 400); ticking = false; }); };
    contentEl.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
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

