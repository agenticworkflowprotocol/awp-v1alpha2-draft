// Verifies every snippet marked with `check` (examples.mjs and gaps.mjs) against the reference checker
// of the spec repository, at the commit each file names in SPEC_REF:
//   examples.mjs  b8a0ee8  (the draft the side-by-side page was written against)
//   gaps.mjs      baac181  (main: the v1alpha3 draft, formerly the v1alpha2 draft)
// Each commit is exported with `git archive` into a temporary directory, so the checkout itself is
// never changed; its node_modules are reused. Proposals on the gaps page are never checked.
//   node check.mjs <path-to-agenticworkflowprotocol.org-checkout>
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, realpathSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import * as comparison from './examples.mjs';
import * as feedback from './gaps.mjs';

const specRepo = resolve(process.argv[2] ?? '../agenticWorkflowProtocol.org');
// Real path: the checker only runs as a script when its path matches import.meta.url (macOS /var is a symlink).
const dir = realpathSync(mkdtempSync(join(tmpdir(), 'awp-draft-')));
// 'v1'/'v2' must be valid, '-invalid' must be rejected; on the gaps page 'v2' means the current draft.
const EXPECT_VALID = { v1: true, v2: true, 'v1-invalid': false, 'v2-invalid': false };

/** Exports the spec repository at `ref` and returns the path of its checker. */
function checkerAt(ref) {
  const target = join(dir, `spec-${ref}`);
  mkdirSync(target);
  const archive = execFileSync('git', ['-C', specRepo, 'archive', ref], { maxBuffer: 256 * 1024 * 1024 });
  execFileSync('tar', ['-x', '-C', target], { input: archive });
  symlinkSync(join(specRepo, 'node_modules'), join(target, 'node_modules'));
  return join(target, 'conformance', 'awp-check.mjs');
}

function isValid(checker, file, profiles) {
  try {
    execFileSync('node', [checker, 'check', '--profiles', profiles, file], { stdio: 'pipe' });
    return true;
  } catch (error) {
    return { output: String(error.stdout) + String(error.stderr) };
  }
}

let failures = 0;
for (const [items, ref] of [[comparison.examples, comparison.SPEC_REF], [feedback.gaps, feedback.SPEC_REF]]) {
  const checker = checkerAt(ref);
  console.log(`-- checker at ${ref}`);
  for (const example of items) {
    for (const side of ['left', 'right']) {
      const { check, code, doc } = example[side];
      if (!check) continue;
      const file = join(dir, `${example.id}-${side}.yaml`);
      writeFileSync(file, doc ?? code);
      const result = isValid(checker, file, example.profiles ?? 'core');
      const expectedRule = example[side].expect;
      const ok = (result === true) === EXPECT_VALID[check] && (!expectedRule || result.output?.includes(expectedRule));
      if (!ok) failures++;
      console.log(`${ok ? 'PASS' : 'FAIL'}  ${example.id} ${side} (${check})${ok ? '' : '\n' + (result.output ?? 'unexpectedly valid')}`);
    }
  }
}
const marked = feedback.gaps.filter((gap) => gap.right.check).map((gap) => gap.id);
if (marked.length) { failures++; console.log(`FAIL  proposals must not be marked check: ${marked.join(', ')}`); }
console.log(`${feedback.gaps.length} gap proposals not checked (not valid against the draft schema)`);
console.log(failures ? `${failures} failed` : 'all checked snippets behave as expected');
process.exit(failures ? 1 : 0);
