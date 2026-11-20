// Verifies every snippet marked with `check` (examples.mjs and gaps.mjs) against the reference checker
// of the spec repository. Proposals on the gaps page are not schema-valid and are never checked.
//   node check.mjs <path-to-agenticworkflowprotocol.org-checkout>
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { examples } from './examples.mjs';
import { gaps } from './gaps.mjs';

const specRepo = resolve(process.argv[2] ?? '../agenticWorkflowProtocol.org');
const checker = join(specRepo, 'conformance', 'awp-check.mjs');
const dir = mkdtempSync(join(tmpdir(), 'awp-draft-'));
const EXPECT_VALID = { v1: true, v2: true, 'v1-invalid': false, 'v2-invalid': false };

function isValid(file, profiles) {
  try {
    execFileSync('node', [checker, 'check', '--profiles', profiles, file], { stdio: 'pipe' });
    return true;
  } catch (error) {
    return { output: String(error.stdout) + String(error.stderr) };
  }
}

let failures = 0;
for (const example of [...examples, ...gaps]) {
  for (const side of ['left', 'right']) {
    const { check, code, doc } = example[side];
    if (!check) continue;
    const file = join(dir, `${example.id}-${side}.yaml`);
    writeFileSync(file, doc ?? code);
    const result = isValid(file, example.profiles ?? 'core');
    const expectedRule = example[side].expect;
    const ok = (result === true) === EXPECT_VALID[check] && (!expectedRule || result.output?.includes(expectedRule));
    if (!ok) failures++;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${example.id} ${side} (${check})${ok ? '' : '\n' + (result.output ?? 'unexpectedly valid')}`);
  }
}
const unchecked = gaps.filter((gap) => gap.right.check).map((gap) => gap.id);
if (unchecked.length) { failures++; console.log(`FAIL  proposals must not be marked check: ${unchecked.join(', ')}`); }
console.log(`${gaps.length} gap proposals not checked (not valid against the draft schema)`);
console.log(failures ? `${failures} failed` : 'all checked snippets behave as expected');
process.exit(failures ? 1 : 0);
