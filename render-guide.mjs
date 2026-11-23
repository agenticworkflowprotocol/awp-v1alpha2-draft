// Renders the guide page (guide.mjs): diagrams as inline SVG in two layouts, tables that stack on
// phones, the lifecycle, worked examples with code panes, and the checklists.
import { escapeHtml, inline, pane, panes, renderIntro, renderRefs } from './render.mjs';

// ------------------------------------------------------------------ status badges

const badge = (STATUS, key) => {
  const s = STATUS[key];
  return `<span class="st ${s.cls}" title="${escapeHtml(s.title)}">${escapeHtml(s.label)}</span>`;
};

// ------------------------------------------------------------------ diagrams

const LINE = 16;

/** Point where the line from the centre of `box` towards `target` leaves the box. */
function boundary([x, y, w, h], [tx, ty]) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const dx = tx - cx;
  const dy = ty - cy;
  if (dx === 0 && dy === 0) return [cx, cy];
  const scale = Math.min(dx ? (w / 2) / Math.abs(dx) : Infinity, dy ? (h / 2) / Math.abs(dy) : Infinity);
  return [cx + dx * scale, cy + dy * scale];
}

const centre = ([x, y, w, h]) => [x + w / 2, y + h / 2];
const round = (n) => Math.round(n * 10) / 10;

function renderNode(node, [x, y, w, h]) {
  const lines = node.sub.map((line, i) => `<text class="dg-sub" x="${x + 12}" y="${y + 24 + LINE * (i + 1)}">${escapeHtml(line)}</text>`).join('');
  return `<g><rect class="dg-node dg-${node.cls}" x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/><text class="dg-title" x="${x + 12}" y="${y + 22}">${escapeHtml(node.title)}</text>${lines}</g>`;
}

function renderEdge(edge, layout, uid) {
  const from = layout.at[edge.from];
  const to = layout.at[edge.to];
  const via = layout.via?.[`${edge.from}-${edge.to}`] ?? [];
  const start = boundary(from, via[0] ?? centre(to));
  const end = boundary(to, via[via.length - 1] ?? centre(from));
  const points = [start, ...via, end].map(([px, py]) => `${round(px)},${round(py)}`).join(' ');
  const cls = edge.cls ?? 'plain';
  return `<polyline class="dg-edge dg-edge-${cls}" points="${points}" marker-end="url(#${uid}-${cls})"/>`;
}

/** One diagram in one layout. `uid` keeps marker ids unique on the page. */
function renderSvg(diagram, name, uid) {
  const layout = diagram.layouts[name];
  const markers = ['plain', 'proposal', 'platform'].map((cls) => `<marker id="${uid}-${cls}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrow dg-arrow-${cls}" d="M0,0L10,5L0,10z"/></marker>`).join('');
  const edges = diagram.edges.map((e) => renderEdge(e, layout, uid)).join('');
  const nodes = diagram.nodes.map((n) => renderNode(n, layout.at[n.id])).join('');
  return `<svg class="dg-${name}" viewBox="0 0 ${layout.width} ${layout.height}" role="img" aria-labelledby="${uid}-t ${uid}-d"><title id="${uid}-t">${escapeHtml(diagram.title)}</title><desc id="${uid}-d">${escapeHtml(diagram.desc)}</desc><defs>${markers}</defs>${edges}${nodes}</svg>`;
}

const renderDiagram = (diagram, id) => `<figure class="diagram">${renderSvg(diagram, 'wide', `${id}-w`)}${renderSvg(diagram, 'tall', `${id}-t`)}</figure>`;

// ------------------------------------------------------------------ tables and lists

/** A table that becomes one card per row on narrow screens; cells are already HTML. */
function table(cls, headers, rows) {
  const head = headers.map((h) => `<th scope="col">${escapeHtml(h)}</th>`).join('');
  const body = rows.map((row) => `<tr>${row.map((cell, i) => `<td data-label="${escapeHtml(headers[i])}">${cell}</td>`).join('')}</tr>`).join('\n');
  return `<div class="table-wrap stack-wrap"><table class="guide-table stack ${cls}"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

const section = (id, title, intro, body, eyebrow = '') => `<section class="chapter" id="${id}">
  <header class="chapter-head">
    ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}
    <h2>${inline(title)}</h2>
    ${intro ? `<p class="chapter-intro">${intro}</p>` : ''}
  </header>
  ${body}
</section>`;

const checklist = (items) => `<ol class="checklist">${items.map((item) => `<li>${inline(item)}</li>`).join('')}</ol>`;

// ------------------------------------------------------------------ sections

function renderMap(g) {
  const legend = `<ul class="dg-legend">${g.legend.map((l) => `<li><span class="dg-swatch dg-${l.cls}"></span>${escapeHtml(l.text)}</li>`).join('')}</ul>`;
  const rows = g.kinds.map((k) => [inline(k.kind), inline(k.writer), inline(k.refs), inline(k.reader), badge(g.STATUS, k.status)]);
  return section('map', 'Resource map', 'Four kinds are manifests in v1alpha3: three that authors write and one execution object. Everything else is a field of a manifest, an external system or the runtime\'s own business.',
    `${renderDiagram(g.resourceMap, 'map')}${legend}
  ${table('kinds-table', ['Kind', 'Who writes it', 'What it references', 'Who reads it', 'Status'], rows)}
  <p class="note">${inline(g.notKinds)}</p>`);
}

function renderLifecycle(g) {
  const steps = g.lifecycle.map((step, i) => `<li class="tl-step" id="lc-${i + 1}">
    <h3><span class="tl-number">${i + 1}</span>${inline(step.title)}</h3>
    <ul class="tl-items">${step.items.map((item) => `<li>${badge(g.STATUS, item.status)}<p>${inline(item.text)}</p></li>`).join('')}</ul>
    <footer class="refs">${renderRefs(step.refs)}</footer>
  </li>`).join('\n');
  return section('lifecycle', 'Lifecycle: from a manifest to a finished run', 'What happens when, and who decides. Each line says whether it is in v1alpha3, proposed in PR #23, planned with the AEP-0004 pull request, or left to the platform.', `<ol class="timeline">${steps}</ol>`);
}

/** Statuses an example touches, read from its panes. */
function exampleStatuses(example) {
  const all = [example.left, example.right, ...(example.extra ?? [])];
  const found = new Set();
  for (const p of all) {
    if (p.check) found.add('v3');
    if (!p.check && /PR #23/.test(p.label)) found.add('pr23');
    if (!p.check && /[Pp]lanned/.test(p.label + p.code)) found.add('planned');
  }
  return [...found];
}

function renderExample(g, example, number) {
  const independent = Boolean(example.right.check);
  const main = independent
    ? `<div class="panes">${pane('left', example.left, '', new Set())}${pane('right', example.right, '', new Set())}</div>`
    : panes(example.left, example.right, '', '', true);
  const extra = (example.extra ?? []).map((p) => `<div class="panes panes-one">${pane(p.check ? 'left' : 'right', p, '', new Set(), !p.check)}</div>`).join('');
  return `<article class="example" id="${example.id}">
  <header class="example-head guide-example-head">
    <span class="example-number">${number}</span>
    <h3>${inline(example.title)}</h3>
    <span class="st-row">${exampleStatuses(example).map((s) => badge(g.STATUS, s)).join('')}</span>
  </header>
  <p class="problem">${inline(example.intro)}</p>
  ${main}
  ${extra}
  <div class="explain">
    <div><h4>What it shows</h4><p>${inline(example.what)}</p></div>
    <div><h4>Why</h4><p>${inline(example.why)}</p></div>
  </div>
  <footer class="refs">${renderRefs(example.refs)}</footer>
</article>`;
}

function renderExamples(g) {
  const body = g.examples.map((e, i) => renderExample(g, e, i + 1)).join('\n');
  return section('examples', 'Worked examples', `Five small manifests in one neutral domain (a concert scout), each building on the one before. Left panes are v1alpha3 and were run through the reference checker at <code>${g.SPEC_REF}</code>; right panes mark what a proposal adds and are not checked.`, body);
}

function renderInflow(g) {
  const pr = (n) => (n === 'planned' ? badge(g.STATUS, 'planned') : `<a href="https://github.com/agenticworkflowprotocol/agenticworkflowprotocol.org/pull/${n}">#${n}</a>`);
  const rows = g.inflow.map((r) => [pr(r.pr), inline(r.change), renderRefs([r.file]), escapeHtml(r.gaps)]);
  return section('inflow', 'What flowed in from pull request #23', 'Pull request #23 is a draft and not merged; it supersedes #19 and #20. The AEP-0004 pull request is planned and has no text yet.',
    `${table('inflow-table', ['PR', 'Change', 'File', 'Gaps'], rows)}<p class="note">${inline(g.inflowNote)}</p>`);
}

function renderOpen(g, decisions) {
  const cards = g.open.map((o) => `<div class="card"><h3>${inline(o.title)}</h3><p>${inline(o.text)}</p></div>`).join('');
  const decide = `<div class="card card-decisions"><h3>Open maintainer decisions</h3><ul>${decisions.map((d) => `<li>${inline(d)}</li>`).join('')}</ul></div>`;
  return section('open', 'Still open', 'What remains after pull request #23 and the planned AEP-0004 pull request. Each gap G41 to G87 with the draft text, a proposal sketch and the evidence is on the <a href="gaps.html">gaps page</a>; G01 to G40 are in <a href="https://github.com/agenticworkflowprotocol/agenticworkflowprotocol.org/blob/docs/v1alpha3-runtime-feedback/docs/runtime-feedback.md">runtime-feedback.md</a>.',
    `<div class="cards">${decide}${cards}</div><p class="note">${inline(g.openNote)}</p>`);
}

function renderRelated(g) {
  const rows = g.related.rows.map((r) => [`<a href="${r.href}">${escapeHtml(r.name)}</a>`, inline(r.what), inline(r.layer), inline(r.overlap), inline(r.relation)]);
  return section('related', 'AWP and related work', 'Spec 1.2 in PR #23 names two projects AWP takes ideas from. Decision D21 allows naming open specifications and foundation or SIG projects as prior art, never as dependencies.',
    `${table('related-table', ['Project', 'What it describes', 'Layer', 'Overlap with AWP', 'How AWP relates'], rows)}<p class="note">${inline(g.related.verified)}</p>`);
}

function renderKubernetes(g) {
  const k = g.kubernetes;
  const rows = k.rows.map((r) => [inline(r.piece), inline(r.does), inline(r.rule), badge(g.STATUS, r.status)]);
  const byId = Object.fromEntries(g.examples.map((e, i) => [e.id, `${i + 1}. ${e.title}`]));
  const timeline = k.timeline.map((t) => [`<a href="#${t.example}">${escapeHtml(byId[t.example])}</a>`, inline(t.apply), inline(t.start), inline(t.steps)]);
  return section('k8s-mapping', 'How a Kubernetes runtime can map it', k.intro,
    `${renderDiagram(k.diagram, 'k8s')}
  ${table('k8s-table', ['Piece', 'What a Kubernetes runtime does', 'AWP rule it enforces', 'Rule status'], rows)}
  <h3 class="sub-head" id="k8s-examples">What it creates for the worked examples, and when</h3>
  ${table('k8s-timeline', ['Example', 'When the manifest is applied', 'When a run starts', 'Per step'], timeline)}`,
    '<span class="chip chip-concept">Informative</span>');
}

function renderAdopt(g) {
  const profiles = table('profile-table', ['Profile', 'Needed when the manifest uses'], g.profiles.map((p) => [`<code>${escapeHtml(p.name)}</code>`, inline(p.when)]));
  return section('adopt', 'Adopt it', 'Two short checklists. Profiles decide which fields a runtime must understand; a manifest that uses a field of a profile the runtime does not claim is rejected, never run without it.',
    `<div class="adopt">
    <div><h3 id="adopt-author">As a workflow author</h3>${checklist(g.authorChecklist)}</div>
    <div><h3 id="adopt-runtime">As a runtime implementer</h3>${checklist(g.runtimeChecklist)}</div>
  </div>
  <h3 class="sub-head" id="adopt-profiles">Which profile</h3>
  ${profiles}`);
}

// ------------------------------------------------------------------ page

const NAV = [
  ['map', 'Resource map'], ['lifecycle', 'Lifecycle'], ['examples', 'Worked examples'], ['inflow', 'What flowed in'],
  ['open', 'Still open'], ['related', 'AWP and related work'], ['k8s-mapping', 'Kubernetes mapping'], ['adopt', 'Adopt it'],
];

export function renderGuide(g, { decisions }) {
  const nav = NAV.map(([id, title]) => {
    const items = id === 'examples'
      ? `<ol>${g.examples.map((e, i) => `<li><a href="#${e.id}"><span class="nav-number">${i + 1}</span>${inline(e.title)}</a></li>`).join('')}</ol>`
      : id === 'adopt'
        ? `<ol><li><a href="#adopt-author">As a workflow author</a></li><li><a href="#adopt-runtime">As a runtime implementer</a></li><li><a href="#adopt-profiles">Which profile</a></li></ol>`
        : '';
    return `<li class="nav-chapter"><a href="#${id}">${escapeHtml(title)}</a>${items}</li>`;
  }).join('');
  const start = `<div class="start">${g.start.map((s) => `<div class="start-card"><h2>${escapeHtml(s.title)}</h2><p>${inline(s.text)}</p></div>`).join('')}</div>`;
  const body = [renderMap(g), renderLifecycle(g), renderExamples(g), renderInflow(g), renderOpen(g, decisions), renderRelated(g), renderKubernetes(g), renderAdopt(g)].join('\n');
  return { nav, intro: renderIntro(g.page, 0, start, ''), body, summary: `${g.examples.length} worked examples, ${g.lifecycle.length} lifecycle steps` };
}
