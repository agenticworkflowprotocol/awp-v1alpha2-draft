// Verifies every snippet marked with `check` (guide.mjs, examples.mjs, gaps.mjs) against the reference
// checker of the spec repository, at the commit each file names in SPEC_REF. All three pin the head of
// the preview branch (spec-ref.mjs), so the checkout must contain that commit. Each commit is exported
// with `git archive` into a temporary directory, so the checkout itself is never changed; its
// node_modules are reused. Proposals are never checked: they are not valid against the draft schema,
// and marking one with `check` is an error.
//   node check.mjs <path-to-agenticworkflowprotocol.org-checkout>
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, realpathSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import * as comparison from './examples.mjs';
import * as feedback from './gaps.mjs';
import * as guide from './guide.mjs';

const specRepo = resolve(process.argv[2] ?? '../agenticWorkflowProtocol.org');
// Real path: the checker only runs as a script when its path matches import.meta.url (macOS /var is a symlink).
const dir = realpathSync(mkdtempSync(join(tmpdir(), 'awp-draft-')));
// 'v1'/'v2' must be valid, '-invalid' must be rejected; 'v2' means the current draft (v1alpha3).
const EXPECT_VALID = { v1: true, v2: true, 'v1-invalid': false, 'v2-invalid': false };

const checkers = new Map();
/** Exports the spec repository at `ref` once and returns the path of its checker. */
function checkerAt(ref) {
  if (checkers.has(ref)) return checkers.get(ref);
  const target = join(dir, `spec-${ref}`);
  mkdirSync(target);
  const archive = execFileSync('git', ['-C', specRepo, 'archive', ref], { maxBuffer: 256 * 1024 * 1024 });
  execFileSync('tar', ['-x', '-C', target], { input: archive });
  symlinkSync(join(specRepo, 'node_modules'), join(target, 'node_modules'));
  const checker = join(target, 'conformance', 'awp-check.mjs');
  checkers.set(ref, checker);
  return checker;
}

function isValid(checker, file, profiles) {
  try {
    execFileSync('node', [checker, 'check', '--profiles', profiles, file], { stdio: 'pipe' });
    return true;
  } catch (error) {
    return { output: String(error.stdout) + String(error.stderr) };
  }
}

/** Every pane of an item: left, right and the extra panes of the guide. */
const panesOf = (item) => [['left', item.left], ['right', item.right], ...(item.extra ?? []).map((p, i) => [`extra${i + 1}`, p])].filter(([, p]) => p);

let failures = 0;
const pages = [
  ['guide', guide.examples, guide.SPEC_REF],
  ['side-by-side', comparison.examples, comparison.SPEC_REF],
  ['gaps', feedback.gaps, feedback.SPEC_REF],
];
for (const [name, items, ref] of pages) {
  const checker = checkerAt(ref);
  console.log(`-- ${name}: checker at ${ref}`);
  for (const item of items) {
    for (const [side, p] of panesOf(item)) {
      if (!p.check) continue;
      const file = join(dir, `${name}-${item.id}-${side}.yaml`);
      writeFileSync(file, p.doc ?? p.code);
      const result = isValid(checker, file, p.profiles ?? item.profiles ?? 'core');
      const ok = (result === true) === EXPECT_VALID[p.check] && (!p.expect || result.output?.includes(p.expect));
      if (!ok) failures++;
      console.log(`${ok ? 'PASS' : 'FAIL'}  ${item.id} ${side} (${p.check})${ok ? '' : '\n' + (result.output ?? 'unexpectedly valid')}`);
    }
  }
}

// Proposals must never be marked `check`: gap proposals and the proposal sides of the other pages.
const proposalChapters = new Set(comparison.chapters.filter((c) => c.proposal).map((c) => c.id));
const marked = [
  ...feedback.gaps.filter((gap) => gap.right.check).map((gap) => gap.id),
  ...comparison.examples.filter((e) => proposalChapters.has(e.chapter) && e.right.check).map((e) => e.id),
  ...guide.examples.flatMap((e) => panesOf(e).filter(([, p]) => p.check && /PR #23|[Pp]lanned|[Pp]roposal/.test(p.label)).map(([side]) => `${e.id} ${side}`)),
];
if (marked.length) { failures++; console.log(`FAIL  proposals must not be marked check: ${marked.join(', ')}`); }
console.log(failures ? `${failures} failed` : 'all checked snippets behave as expected');
process.exit(failures ? 1 : 0);
