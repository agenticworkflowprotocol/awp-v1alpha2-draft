// Renders both pages into docs/ (served by GitHub Pages):
//   docs/index.html  side-by-side comparison (examples.mjs)
//   docs/gaps.html   open runtime feedback after v1alpha2 (gaps.mjs)
//   node build.mjs
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import * as comparison from './examples.mjs';
import * as feedback from './gaps.mjs';

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Inline Markdown subset used in the texts: `code`. */
const inline = (text) => escapeHtml(text).replace(/`([^`]+)`/g, '<code>$1</code>');

/** Line-based longest common subsequence: marks lines only on the left (removed) or right (added). */
function diffLines(left, right) {
  const n = left.length;
  const m = right.length;
  const table = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      table[i][j] = left[i] === right[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }
  const removed = new Set();
  const added = new Set();
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (left[i] === right[j]) { i++; j++; } else if (table[i + 1][j] >= table[i][j + 1]) removed.add(i++); else added.add(j++);
  }
  while (i < n) removed.add(i++);
  while (j < m) added.add(j++);
  return { removed, added };
}

/** Light YAML highlighting: comments, keys, list markers. Plain text is left alone. */
function highlight(line, lang) {
  if (lang === 'text') {
    return /^\s*(\$|#)/.test(line) ? `<span class="tok-cmd">${escapeHtml(line)}</span>` : escapeHtml(line);
  }
  const comment = line.match(/^(.*?)(\s#.*|^#.*)$/);
  const body = comment ? comment[1] : line;
  const rest = comment ? `<span class="tok-comment">${escapeHtml(comment[2])}</span>` : '';
  const key = body.match(/^(\s*)(- )?([A-Za-z0-9_.\-/$"]+)(:)(\s.*|$)/);
  if (!key) return escapeHtml(body) + rest;
  const [, indent, dash = '', name, colon, value] = key;
  return `${indent}${dash ? '<span class="tok-dash">- </span>' : ''}<span class="tok-key">${escapeHtml(name)}</span>${colon}<span class="tok-value">${escapeHtml(value)}</span>${rest}`;
}

function renderCode(code, lang, marks, markClass) {
  const lines = code.split('\n');
  return lines.map((line, index) => {
    const cls = marks.has(index) ? ` class="${markClass}"` : '';
    return `<span${cls}>${highlight(line, lang) || ' '}</span>`;
  }).join('');
}

/** One code pane. `unchecked` marks proposals that are deliberately not run through the checker. */
function pane(side, data, fallbackLabel, marks, unchecked = false) {
  const lang = data.lang ?? 'yaml';
  const label = data.label ?? fallbackLabel;
  const markClass = side === 'left' ? 'line-del' : 'line-add';
  const badge = data.check
    ? `<span class="verified" title="Checked with the reference checker">${data.check.endsWith('invalid') ? 'rejected by checker' : 'valid'}</span>`
    : unchecked ? '<span class="unchecked" title="A proposal, not valid against the draft schema">not checked</span>' : '';
  return `<figure class="pane pane-${side}">
  <figcaption><span class="pane-label">${inline(label)}</span>${badge}</figcaption>
  <pre><code>${renderCode(data.code, lang, marks, markClass)}</code></pre>
</figure>`;
}

/**
 * Both panes; differences are highlighted only when both sides show the same kind of content.
 * Proposals (`proposal`) mark only what they add: the left side is the draft, not something removed.
 */
function panes(left, right, leftLabel, rightLabel, proposal = false) {
  const comparable = (left.lang ?? 'yaml') === (right.lang ?? 'yaml');
  const { removed, added } = comparable
    ? diffLines(left.code.split('\n'), right.code.split('\n'))
    : { removed: new Set(), added: new Set() };
  return `<div class="panes">
    ${pane('left', left, leftLabel, proposal ? new Set() : removed)}
    ${pane('right', right, rightLabel, added, proposal)}
  </div>`;
}

/** Reference chips; entries without `href` (proposed AEPs without a document) are plain text. */
const renderRefs = (refs) => refs.map((r) => (r.href ? `<a href="${r.href}">${escapeHtml(r.label)}</a>` : `<span class="ref-plain">${escapeHtml(r.label)}</span>`)).join('');

function renderIntro(page, count, legend, overview) {
  return `<section class="intro">
      <h1>${escapeHtml(page.h1)}</h1>
      <p class="lede">${inline(page.lede.replace('{{count}}', String(count)))}</p>
      <p class="notice">${page.notice}</p>
      ${legend}
      ${overview}
    </section>`;
}

// ------------------------------------------------------------------ page 1: side by side

function renderComparison({ chapters, examples, page }) {
  const inChapter = (chapter) => examples.filter((e) => e.chapter === chapter.id);

  const renderExample = (example, chapter, number) => `<article class="example" id="${example.id}">
  <header class="example-head">
    <span class="example-number">${number}</span>
    <h3>${inline(example.title)}</h3>
  </header>
  ${panes(example.left, example.right,
    chapter.concept ? 'v1alpha2 draft' : 'v1alpha1',
    chapter.concept ? 'AEP-0021 proposal' : 'v1alpha2 draft')}
  <div class="explain">
    <div><h4>What changes</h4><p>${inline(example.what)}</p></div>
    <div><h4>Why</h4><p>${inline(example.why)}</p></div>
  </div>
  <footer class="refs">${renderRefs(example.refs)}</footer>
</article>`;

  const renderChapter = (chapter, startNumber) => {
    const body = inChapter(chapter).map((e, i) => renderExample(e, chapter, startNumber + i)).join('\n');
    const status = chapter.concept ? '<span class="chip chip-concept">Concept</span>' : '<span class="chip">Draft</span>';
    return `<section class="chapter" id="${chapter.id}">
  <header class="chapter-head">
    <p class="eyebrow">${status}<a href="${chapter.aep.href}">${escapeHtml(chapter.aep.label)}</a></p>
    <h2>${inline(chapter.title)}</h2>
    <p class="chapter-intro">${inline(chapter.intro)}</p>
  </header>
  ${body}
</section>`;
  };

  let number = 1;
  const nav = chapters.map((chapter) => {
    const items = inChapter(chapter)
      .map((e) => `<li><a href="#${e.id}"><span class="nav-number">${number++}</span>${inline(e.title)}</a></li>`).join('');
    return `<li class="nav-chapter"><a href="#${chapter.id}">${inline(chapter.title)}</a><ol>${items}</ol></li>`;
  }).join('') + (page.navExtra ?? '');

  const legend = `<ul class="legend">
        <li><span class="swatch swatch-del"></span>only in the old form</li>
        <li><span class="swatch swatch-add"></span>new or moved in the new form</li>
      </ul>`;
  const overview = `<ol class="overview">${chapters.map((chapter) => {
    const count = inChapter(chapter).length;
    return `<li><a href="#${chapter.id}"><span class="ov-title">${inline(chapter.title)}</span><span class="ov-meta">${escapeHtml(chapter.aep.label)} · ${count} ${count === 1 ? 'example' : 'examples'}${chapter.concept ? ' · concept' : ''}</span></a></li>`;
  }).join('')}</ol>`;

  let next = 1;
  const body = chapters.map((chapter) => {
    const html = renderChapter(chapter, next);
    next += inChapter(chapter).length;
    return html;
  }).join('\n');

  return { nav, intro: renderIntro(page, examples.length, legend, overview), body, summary: `${examples.length} examples in ${chapters.length} chapters` };
}

// ------------------------------------------------------------------ page 2: open gaps

/** Category of a gap: A, B, C, or mixed (for example "A+B", "C now, A later"). */
const catClass = (cat) => ({ A: 'cat-a', B: 'cat-b', C: 'cat-c' })[cat] ?? 'cat-mixed';
const catBadge = (cat) => `<span class="cat ${catClass(cat)}" title="Category ${escapeHtml(cat)}">${escapeHtml(cat)}</span>`;

function renderGaps({ chapters, gaps, page }) {
  const inChapter = (chapter) => gaps.filter((g) => g.chapter === chapter.id);
  const anchor = (gap) => gap.id.toLowerCase();

  const renderGap = (gap) => `<article class="example gap" id="${anchor(gap)}">
  <header class="example-head">
    <span class="gap-id">${gap.id}</span>
    <h3>${inline(gap.title)}</h3>
    ${catBadge(gap.cat)}
  </header>
  <dl class="verdict"><div><dt>Verdict</dt><dd>${inline(gap.verdict)}</dd></div><div><dt>Target</dt><dd>${inline(gap.target)}</dd></div></dl>
  <p class="problem">${inline(gap.problem)}</p>
  ${panes(gap.left, gap.right, 'v1alpha3 draft today', 'Proposal', true)}
  <div class="explain">
    <div><h4>Why: in the proof of concept</h4><p>${inline(gap.why)}</p></div>
    <div><h4>Status against the draft</h4><p>${inline(gap.status)}</p></div>
  </div>
  <footer class="refs">${renderRefs(gap.refs)}</footer>
</article>`;

  const renderChapter = (chapter) => `<section class="chapter" id="${chapter.id}">
  <header class="chapter-head">
    <p class="eyebrow"><span class="chip chip-concept">Proposal</span>${renderRefs(chapter.related)}</p>
    <h2>${inline(chapter.title)}</h2>
    <p class="chapter-intro">${inline(chapter.intro)}</p>
  </header>
  ${inChapter(chapter).map(renderGap).join('\n')}
</section>`;

  const order = `<section class="chapter" id="order">
  <header class="chapter-head">
    <p class="eyebrow"><span class="chip chip-concept">Proposal</span></p>
    <h2>Proposed order</h2>
    <p class="chapter-intro">AEP-0023 to AEP-0025 are assigned numbers; the AEP documents are drafts being written.</p>
  </header>
  <ol class="order">${page.order.map((item) => `<li>${inline(item)}</li>`).join('')}</ol>
  <p class="pull-requests" id="pull-requests"><strong>Spec pull requests:</strong> ${page.pullRequests.length
    ? page.pullRequests.map((pr) => `<a href="${pr.href}">${escapeHtml(pr.label)}</a>`).join(', ')
    : 'links follow once the drafts are opened.'}</p>
</section>`;

  const nav = '<li class="nav-chapter"><a href="#order">Proposed order</a></li>' + chapters.map((chapter) => {
    const items = inChapter(chapter)
      .map((g) => `<li><a href="#${anchor(g)}"><span class="nav-number">${g.id}</span>${inline(g.title)}</a></li>`).join('');
    return `<li class="nav-chapter"><a href="#${chapter.id}">${inline(chapter.title)}</a><ol>${items}</ol></li>`;
  }).join('');

  const rows = chapters.map((chapter) => `<tbody>
        <tr class="gap-table-chapter"><th colspan="5" scope="colgroup"><a href="#${chapter.id}">${inline(chapter.title)}</a></th></tr>
        ${inChapter(chapter).map((g) => `<tr><td><a href="#${anchor(g)}">${g.id}</a></td><td>${catBadge(g.cat)}</td><td>${inline(g.title)}</td><td>${inline(g.verdict)}</td><td>${inline(g.target)}</td></tr>`).join('\n        ')}
      </tbody>`).join('\n      ');
  const table = `<div class="table-wrap"><table class="gap-table">
      <thead><tr><th scope="col">Gap</th><th scope="col">Cat.</th><th scope="col">Problem</th><th scope="col">Verdict</th><th scope="col">Target</th></tr></thead>
      ${rows}
    </table></div>`;

  // Yardstick, counts per category and the open decisions, above the table.
  const yardstick = `<ul class="yardstick">${page.yardstick.map((y) => `<li>${catBadge(y.cat)}<span>${inline(y.text)}</span></li>`).join('')}</ul>`;
  const count = (cls) => gaps.filter((g) => catClass(g.cat) === cls).length;
  const summary = `<div class="summary">
        <p class="counts"><span>${catBadge('A')} ${count('cat-a')}</span><span>${catBadge('B')} ${count('cat-b')}</span><span>${catBadge('C')} ${count('cat-c')}</span><span>${catBadge('mixed')} ${count('cat-mixed')}</span></p>
        <div class="decisions"><h4>Decisions for the maintainer</h4><ul>${page.decisions.map((d) => `<li>${inline(d)}</li>`).join('')}</ul></div>
      </div>`;

  return {
    nav,
    intro: renderIntro(page, gaps.length, yardstick, `${summary}
      <ul class="legend"><li><span class="swatch swatch-add"></span>added by the proposal</li></ul>
      ${table}`),
    body: order + '\n' + chapters.map(renderChapter).join('\n'),
    summary: `${gaps.length} gaps in ${chapters.length} chapters`,
  };
}

// ------------------------------------------------------------------ output

const PAGES = [
  { label: 'Side by side', href: './', module: comparison, render: renderComparison },
  { label: 'Open gaps', href: 'gaps.html', module: feedback, render: renderGaps },
];

const template = readFileSync(new URL('./template.html', import.meta.url), 'utf8');
mkdirSync(new URL('./docs/', import.meta.url), { recursive: true });

for (const current of PAGES) {
  const { page } = current.module;
  const { nav, intro, body, summary } = current.render(current.module);
  const pagenav = `<nav class="pagenav" aria-label="Pages">${PAGES.map((p) => `<a href="${p.href}"${p === current ? ' aria-current="page"' : ''}>${p.label}</a>`).join('')}</nav>`;
  const tocpages = `<ul class="toc-pages">${PAGES.map((p) => `<li><a href="${p.href}"${p === current ? ' aria-current="page"' : ''}>${p.label}</a></li>`).join('')}</ul>`;
  // Replacement functions, so that "$" sequences in the content are taken literally.
  const html = template
    .replace('{{title}}', () => escapeHtml(page.title))
    .replace('{{version}}', () => page.version)
    .replace('{{description}}', () => escapeHtml(page.description))
    .replace('{{pagenav}}', () => pagenav)
    .replace('{{tocpages}}', () => tocpages)
    .replace('{{nav}}', () => nav)
    .replace('{{intro}}', () => intro)
    .replace('{{chapters}}', () => body)
    .replace('{{after}}', () => page.after ?? '')
    .replace('{{footer}}', () => page.footer);
  writeFileSync(new URL(`./docs/${page.file}`, import.meta.url), html);
  console.log(`docs/${page.file}: ${summary}`);
}
