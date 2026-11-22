// Renders the three pages into docs/ (served by GitHub Pages):
//   docs/index.html    guide: how v1alpha3 fits together (guide.mjs), the recommended start
//   docs/compare.html  side-by-side comparison of v1alpha1 and the draft (examples.mjs)
//   docs/gaps.html     open runtime gaps G41 to G61 (gaps.mjs)
// index.html used to be the comparison; its old anchors are forwarded to compare.html.
//   node build.mjs
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import * as comparison from './examples.mjs';
import * as feedback from './gaps.mjs';
import * as guide from './guide.mjs';
import { renderGuide } from './render-guide.mjs';
import { escapeHtml, inline, panes, renderIntro, renderRefs } from './render.mjs';

// ------------------------------------------------------------------ page 1: side by side

/** Kind of a chapter: in the draft, a concept, or a proposal of a pull request or a planned one. */
const chapterKind = (chapter) => (chapter.proposal === 'planned' ? 'planned' : chapter.proposal ? 'proposal' : chapter.concept ? 'concept' : 'draft');
const CHAPTER_CHIP = {
  draft: '<span class="chip">Draft</span>',
  concept: '<span class="chip chip-concept">Concept</span>',
  proposal: '<span class="chip chip-concept">Proposal: PR #19</span>',
  planned: '<span class="chip chip-planned">Planned</span>',
};
const paneLabels = (chapter) => ({
  draft: ['v1alpha1', 'v1alpha3 draft'],
  concept: ['v1alpha3 draft', 'AEP-0021 proposal'],
  proposal: ['v1alpha3 draft', `${chapter.aep.label.replace(' (PR #19)', '')} proposal (PR #19)`],
  planned: ['v1alpha3 draft', 'Planned (sketch)'],
})[chapterKind(chapter)];

function renderComparison({ chapters, examples, page }) {
  const inChapter = (chapter) => examples.filter((e) => e.chapter === chapter.id);

  const renderExample = (example, chapter, number) => `<article class="example" id="${example.id}">
  <header class="example-head">
    <span class="example-number">${number}</span>
    <h3>${inline(example.title)}</h3>
  </header>
  ${panes(example.left, example.right, ...paneLabels(chapter), Boolean(chapter.proposal))}
  <div class="explain">
    <div><h4>What changes</h4><p>${inline(example.what)}</p></div>
    <div><h4>Why</h4><p>${inline(example.why)}</p></div>
  </div>
  <footer class="refs">${renderRefs(example.refs)}</footer>
</article>`;

  const renderChapter = (chapter, startNumber) => {
    const body = inChapter(chapter).map((e, i) => renderExample(e, chapter, startNumber + i)).join('\n');
    const status = CHAPTER_CHIP[chapterKind(chapter)];
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
        <li><span class="swatch swatch-add"></span>new or moved in the new form, or added by a proposal</li>
      </ul>`;
  const overview = `<ol class="overview">${chapters.map((chapter) => {
    const count = inChapter(chapter).length;
    return `<li><a href="#${chapter.id}"><span class="ov-title">${inline(chapter.title)}</span><span class="ov-meta">${escapeHtml(chapter.aep.label)} · ${count} ${count === 1 ? 'example' : 'examples'}${chapterKind(chapter) === 'draft' ? '' : ` · ${chapterKind(chapter)}`}</span></a></li>`;
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
    <p class="chapter-intro">AEP-0023 to AEP-0025 are assigned numbers; the AEP drafts are open for review in the spec pull request below.</p>
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
  { label: 'Guide', href: './', module: guide, render: (m) => renderGuide(m, { decisions: feedback.page.decisions }) },
  { label: 'Side by side', href: 'compare.html', module: comparison, render: renderComparison },
  { label: 'Open gaps', href: 'gaps.html', module: feedback, render: renderGaps },
];


// Anchors of the old index.html (the comparison) are forwarded to compare.html; the guide must not reuse them.
const legacyAnchors = ['top', ...comparison.chapters.map((c) => c.id), ...comparison.examples.map((e) => e.id), 'try'];

const template = readFileSync(new URL('./template.html', import.meta.url), 'utf8');
mkdirSync(new URL('./docs/', import.meta.url), { recursive: true });

for (const current of PAGES) {
  const { page } = current.module;
  const { nav, intro, body, summary } = current.render(current.module);
  const pagenav = `<nav class="pagenav" aria-label="Pages">${PAGES.map((p) => `<a href="${p.href}"${p === current ? ' aria-current="page"' : ''}>${p.label}</a>`).join('')}</nav>`;
  const tocpages = `<ul class="toc-pages">${PAGES.map((p) => `<li><a href="${p.href}"${p === current ? ' aria-current="page"' : ''}>${p.label}</a></li>`).join('')}</ul>`;
  let head = '';
  if (current.module === guide) {
    const clash = legacyAnchors.filter((id) => id !== 'top' && new RegExp(`id="${id}"`).test(body + intro));
    if (clash.length) throw new Error(`guide reuses anchors of the old index.html: ${clash.join(', ')}`);
    head = `<script>(function () { var ids = ${JSON.stringify(legacyAnchors.filter((id) => id !== 'top'))}; var h = decodeURIComponent(location.hash.slice(1)); if (h && ids.indexOf(h) >= 0) location.replace('compare.html#' + h); })();</script>`;
  }
  // Replacement functions, so that "$" sequences in the content are taken literally.
  const html = template
    .replace('{{title}}', () => escapeHtml(page.title))
    .replace('{{head}}', () => head)
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
