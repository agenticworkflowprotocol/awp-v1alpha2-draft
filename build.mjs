// Renders the side-by-side comparison into docs/index.html (served by GitHub Pages).
//   node build.mjs
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { chapters, examples } from './examples.mjs';

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

function pane(side, example, chapter, marks) {
  const data = example[side];
  const lang = data.lang ?? 'yaml';
  const fallback = side === 'left'
    ? (chapter.concept ? 'v1alpha2 draft' : 'v1alpha1')
    : (chapter.concept ? 'AEP-0021 proposal' : 'v1alpha2 draft');
  const label = data.label ?? fallback;
  const markClass = side === 'left' ? 'line-del' : 'line-add';
  const badge = data.check
    ? `<span class="verified" title="Checked with the reference checker">${data.check.endsWith('invalid') ? 'rejected by checker' : 'valid'}</span>`
    : '';
  return `<figure class="pane pane-${side}">
  <figcaption><span class="pane-label">${inline(label)}</span>${badge}</figcaption>
  <pre><code>${renderCode(data.code, lang, marks, markClass)}</code></pre>
</figure>`;
}

function renderExample(example, chapter, number) {
  // Highlight differences only when both sides show the same kind of content.
  const comparable = (example.left.lang ?? 'yaml') === (example.right.lang ?? 'yaml');
  const { removed, added } = comparable
    ? diffLines(example.left.code.split('\n'), example.right.code.split('\n'))
    : { removed: new Set(), added: new Set() };
  const refs = example.refs.map((r) => `<a href="${r.href}">${escapeHtml(r.label)}</a>`).join('');
  return `<article class="example" id="${example.id}">
  <header class="example-head">
    <span class="example-number">${number}</span>
    <h3>${inline(example.title)}</h3>
  </header>
  <div class="panes">
    ${pane('left', example, chapter, removed)}
    ${pane('right', example, chapter, added)}
  </div>
  <div class="explain">
    <div><h4>What changes</h4><p>${inline(example.what)}</p></div>
    <div><h4>Why</h4><p>${inline(example.why)}</p></div>
  </div>
  <footer class="refs">${refs}</footer>
</article>`;
}

function renderChapter(chapter, startNumber) {
  const items = examples.filter((e) => e.chapter === chapter.id);
  const body = items.map((e, i) => renderExample(e, chapter, startNumber + i)).join('\n');
  const status = chapter.concept ? '<span class="chip chip-concept">Concept</span>' : '<span class="chip">Draft</span>';
  return `<section class="chapter" id="${chapter.id}">
  <header class="chapter-head">
    <p class="eyebrow">${status}<a href="${chapter.aep.href}">${escapeHtml(chapter.aep.label)}</a></p>
    <h2>${inline(chapter.title)}</h2>
    <p class="chapter-intro">${inline(chapter.intro)}</p>
  </header>
  ${body}
</section>`;
}

function renderNav() {
  let number = 1;
  return chapters.map((chapter) => {
    const items = examples.filter((e) => e.chapter === chapter.id)
      .map((e) => `<li><a href="#${e.id}"><span class="nav-number">${number++}</span>${inline(e.title)}</a></li>`).join('');
    return `<li class="nav-chapter"><a href="#${chapter.id}">${inline(chapter.title)}</a><ol>${items}</ol></li>`;
  }).join('') + '<li class="nav-chapter"><a href="#try">Try it: Helm chart</a></li>';
}

function renderOverview() {
  return chapters.map((chapter) => {
    const count = examples.filter((e) => e.chapter === chapter.id).length;
    return `<li><a href="#${chapter.id}"><span class="ov-title">${inline(chapter.title)}</span><span class="ov-meta">${escapeHtml(chapter.aep.label)} · ${count} ${count === 1 ? 'example' : 'examples'}${chapter.concept ? ' · concept' : ''}</span></a></li>`;
  }).join('');
}

let next = 1;
const body = chapters.map((chapter) => {
  const html = renderChapter(chapter, next);
  next += examples.filter((e) => e.chapter === chapter.id).length;
  return html;
}).join('\n');

const template = readFileSync(new URL('./template.html', import.meta.url), 'utf8');
const html = template
  .replace('{{nav}}', renderNav())
  .replace('{{overview}}', renderOverview())
  .replace('{{count}}', String(examples.length))
  .replace('{{chapters}}', body);

mkdirSync(new URL('./docs/', import.meta.url), { recursive: true });
writeFileSync(new URL('./docs/index.html', import.meta.url), html);
console.log(`docs/index.html: ${examples.length} examples in ${chapters.length} chapters`);
