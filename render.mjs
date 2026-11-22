// Shared rendering helpers of all pages: escaping, inline Markdown, code panes with line diffs, references.
export const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Inline Markdown subset used in the texts: `code` and [links](href). */
export const inline = (text) => escapeHtml(text)
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');

/** Line-based longest common subsequence: marks lines only on the left (removed) or right (added). */
export function diffLines(left, right) {
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
export function pane(side, data, fallbackLabel, marks, unchecked = false) {
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
export function panes(left, right, leftLabel, rightLabel, proposal = false) {
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
export const renderRefs = (refs) => refs.map((r) => (r.href ? `<a href="${r.href}">${escapeHtml(r.label)}</a>` : `<span class="ref-plain">${escapeHtml(r.label)}</span>`)).join('');

export function renderIntro(page, count, legend, overview) {
  return `<section class="intro">
      <h1>${escapeHtml(page.h1)}</h1>
      <p class="lede">${inline(page.lede.replace('{{count}}', String(count)))}</p>
      <p class="notice">${page.notice}</p>
      ${legend}
      ${overview}
    </section>`;
}
