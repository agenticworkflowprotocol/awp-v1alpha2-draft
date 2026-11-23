// Side-by-side examples: v1alpha1 (left) and the v1alpha3 draft (right), plus chapters for the
// proposals of spec pull requests #24 to #26 (which supersede #19, #20 and #23) and the planned AEP-0004 pull
// request (v1alpha3 left, proposal right).
// The draft chapters were first written at b8a0ee8, when the draft of pull request #16 was called
// v1alpha2; it was merged as v1alpha3 (decision D20). Everything is checked and linked at the
// preview branch (spec-ref.mjs).
// `check` says how build.mjs verifies a snippet with the reference checker of the spec repository:
//   'v1' / 'v2'           must be valid
//   'v1-invalid' / 'v2-invalid'  must be rejected (the left or right side shows an error case)
//   null                  not an AWP manifest (shell output, audit events, concept syntax)

import { PREVIEW, PREVIEW_REF } from './spec-ref.mjs';

// Commit of the spec repository the snippets are checked against (check.mjs): the preview branch.
export const SPEC_REF = PREVIEW_REF;
const SPEC = PREVIEW;
export const aep = (n, slug) => ({ label: `AEP-${n}`, href: `${SPEC}/aep/${n}-${slug}.md` });
export const spec = (section, anchor) => ({ label: `Spec ${section}`, href: `${SPEC}/spec/v1alpha3/README.md#${anchor}` });

const KRM = aep('0015', 'kubernetes-resource-model');
const SCHED = aep('0016', 'schedule-semantics');
const INPUT = aep('0017', 'human-input');
const OUTPUTS = aep('0018', 'step-outputs');
const RUN = aep('0019', 'workflow-run-and-status');
const PIN = aep('0020', 'execution-pinning');
const EXT = aep('0021', 'extension-model');
const ITER = aep('0022', 'step-iteration');
const ISOLATION = { label: 'AEP-0023 (PR #25)', href: `${SPEC}/aep/0023-step-isolation.md` };
const TRIGGERS = { label: 'AEP-0024 (PR #24)', href: `${SPEC}/aep/0024-event-triggers.md` };
const STATE = { label: 'AEP-0025 (PR #24)', href: `${SPEC}/aep/0025-state.md` };
const SESSION = { label: 'AEP-0026 (PR #26)', href: `${SPEC}/aep/0026-interactive-execution.md` };
const ENGINE = { label: 'AEP-0027 (PR #26)', href: `${SPEC}/aep/0027-agent-engine.md` };
const MCP = { label: 'AEP-0007 (PR #26)', href: `${SPEC}/aep/0007-mcp-connection-catalog.md` };
const CONSTRAINTS = { label: 'AEP-0002 (PR #26)', href: `${SPEC}/aep/0002-tool-argument-constraints.md` };
const PROMPT = { label: 'AEP-0005 (PR #26)', href: `${SPEC}/aep/0005-prompt-kind.md` };
const AUDIT = { label: 'AEP-0009 (PR #26)', href: `${SPEC}/aep/0009-audit-payload-levels.md` };
const AMEND = { label: 'Amendments (PR #26)', href: `${SPEC}/CHANGELOG.md` };
const EVENTS = { label: 'AEP-0004 (planned)', href: `${SPEC}/aep/0004-event-references.md` };

export const chapters = [
  { id: 'model', title: 'Document model', aep: KRM, intro: 'Every manifest becomes a valid Kubernetes resource and stays usable without Kubernetes. Most of this is a mechanical move, done by `awp-check.mjs migrate`.' },
  { id: 'schedule', title: 'Schedules', aep: SCHED, intro: 'What happens when a tick arrives while the previous execution still runs, and when ticks are missed.' },
  { id: 'input', title: 'Human input', aep: INPUT, intro: 'A workflow or an agent can ask a named person for an answer. Answers are never approvals.' },
  { id: 'outputs', title: 'Step outputs', aep: OUTPUTS, intro: 'How a step actually produces the values of its declared outputs, the largest portability gap found by the runtime proof of concept.' },
  { id: 'run', title: 'WorkflowRun and status', aep: RUN, intro: 'A new kind for one execution, and a status shape that existing Kubernetes tools understand.' },
  { id: 'pinning', title: 'Execution pinning', aep: PIN, intro: 'An execution keeps the manifests it started with, even when GitOps changes them halfway.' },
  { id: 'iteration', title: 'Step iteration', aep: ITER, intro: 'A bounded fan-out over a list known when the step becomes ready: accepted for `v1alpha2` (D19) and part of v1alpha3 as section 5.6.5, combined with the step output interface.' },
  { id: 'isolation', title: 'Step isolation (proposal)', aep: ISOLATION, proposal: 'pr23', intro: 'Proposed in spec pull request #25, not applied to the schema: structured destinations (`allowTo`), enforce or reject, internal destinations only through a `cidr` entry, ceilings that reject, credentials and approvals outside the execution environment, a minimum isolation class. Left is v1alpha3 today, right the proposal.' },
  { id: 'event-triggers', title: 'Event triggers with CloudEvents (proposal)', aep: TRIGGERS, proposal: 'pr23', intro: 'Proposed in spec pull request #24: CloudEvents as the event model, equality filters, duplicates, concurrency, rate limits and the actor behind an event. Left is v1alpha3 today, right the proposal.' },
  { id: 'state', title: 'State across executions (proposal)', aep: STATE, proposal: 'pr23', intro: 'Proposed in spec pull request #24: stores that survive executions, declared in the manifest with classification, retention and access mode. Left is v1alpha3 today, right the proposal.' },
  { id: 'sessions', title: 'Interactive execution (proposal)', aep: SESSION, proposal: 'pr23', intro: 'New in PR #26, a concept, number to be confirmed: people use agents interactively for hours, confirm tool calls and switch between read-only and autonomous work. AEP-0026 adds the kind `AgentSession`, an opt-in on `Agent` and three autonomy levels with a ceiling set by the author; finer points are open questions. Left is v1alpha3 today, right the proposal.' },
  { id: 'engine', title: 'Agent engine (proposal)', aep: ENGINE, proposal: 'pr23', intro: 'New in PR #26, a concept, number to be confirmed: an agent step run by an existing coding agent with its own tool loop. AEP-0027 adds `agents[].engine`, keeps AWP permissions, budgets and audit in force, and keeps repository configuration off by default; outputs, push and repositories from events are open questions. Left is v1alpha3 today, right the proposal.' },
  { id: 'amendments', title: 'Amendments to existing AEPs (proposal)', aep: AMEND, proposal: 'pr23', intro: 'PRs #24 and #26 also amend AEPs that are already in Review or Draft, from what the proof of concept had to build itself: MCP prompts and resources (AEP-0007), shell resources and command mapping (AEP-0002), prompts as session tasks (AEP-0005), the origin of audit events (AEP-0009), bindings for agents (AEP-0021). Left is the AEP or v1alpha3 before, right the amendment.' },
  { id: 'event-data', title: 'Event data in the run (planned)', aep: EVENTS, proposal: 'planned', intro: 'Planned, no draft text yet: a pull request that applies AEP-0004 to v1alpha3 and amends open question 1 of AEP-0019 (G41, G48, G57). The right side is a sketch of the intended result.' },
  { id: 'extensions', title: 'Extension model (concept)', aep: EXT, concept: true, intro: 'A proposal, not applied to the schema: replace `x-` fields with the extension model of the Kubernetes Gateway API. Left is the draft (now v1alpha3), right the proposal.' },
];

// Page frame for docs/compare.html (title, intro, the Helm chart section after the chapters, footer).
export const page = {
  version: 'v1alpha3', // shown in the top bar
  file: 'compare.html',
  title: 'AWP: v1alpha1, v1alpha3 and the Proposals Side by Side',
  description: 'What changes from AWP v1alpha1 to the v1alpha3 draft, and what the open spec pull requests propose on top: side-by-side examples with the reason for each change.',
  h1: 'From v1alpha1 to v1alpha3, and what is proposed next',
  lede: '{{count}} examples of what changes in the Agentic Workflow Protocol, each with the old form on the left, the new form on the right, and the reason for the change: first what is in the v1alpha3 draft, then what pull requests #24 to #26 propose and what is planned.',
  notice: 'New to AWP? Start with <a href="index.html">how it fits together</a>. <strong>What is shown.</strong> The draft chapters compare <code>v1alpha1</code> with the <code>v1alpha3</code> draft: the Kubernetes resource model of pull request #16, merged as <code>v1alpha3</code> by decision D20 on top of <code>v1alpha2</code> (<code>v1alpha1</code> plus step iteration, D19). They were first written when that draft was called <code>v1alpha2</code>. The <strong>proposal</strong> chapters put <code>v1alpha3</code> today next to what spec pull requests #24 to #26 propose (AEP-0023 to AEP-0027 and amendments to existing AEPs), the <strong>planned</strong> chapter next to a sketch of the AEP-0004 pull request that has no text yet, and the <strong>concept</strong> chapter next to AEP-0021. Everything is a <strong>Draft</strong> under review; nothing is accepted except step iteration. All links and checks use the spec branch <code>docs/aep-0026-0027-sessions-engine</code>, the top of the stack #24, #25, #26 (they supersede #19, #20 and #23; not merged text). Snippets marked <span class="verified">valid</span> or <span class="verified">rejected by checker</span> were run through the reference checker there; proposals are marked <span class="unchecked">not checked</span>.',
  navExtra: '<li class="nav-chapter"><a href="#try">Try it: Helm chart</a></li>',
  after: `    <section class="chapter" id="try">
      <header class="chapter-head">
        <p class="eyebrow"><span class="chip">Example</span><a href="https://github.com/agenticworkflowprotocol/awp-v1alpha2-draft/tree/main/charts/concert-scout">charts/concert-scout</a></p>
        <h2>Try it: a complete workflow as a Helm chart</h2>
        <p class="chapter-intro">A full workflow of the draft (written as <code>v1alpha2</code>, now <code>v1alpha3</code>) that checks venue programs for new concerts, rates them against a music taste (Metalcore, Metal, Hardcore and related genres by default) and sends a summary. The chart shows OCI registries as one way to transport AWP manifests and ships the CustomResourceDefinitions. It contains no runtime: without one, the objects are stored and nothing runs.</p>
      </header>
      <figure class="pane pane-right">
        <figcaption><span class="pane-label">Install from the OCI registry</span></figcaption>
        <pre><code><span>helm install scout oci://ghcr.io/agenticworkflowprotocol/charts/concert-scout \\</span><span>  --namespace music --create-namespace \\</span><span>  --set taste.region.home=Leipzig</span><span> </span><span class="tok-cmd">$ kubectl get workflows,policies,workflowruns -n music</span><span>NAME                                            VERSION   OWNER        VALID   READY</span><span>workflow.awp.agenticworkflowprotocol.org/scout  0.1.0     music-fans</span></code></pre>
      </figure>
      <div class="explain">
        <div><h4>What it shows</h4><p>Command steps with outputs in <code>$AWP_OUTPUTS</code>, agent steps that end with <code>complete_step</code>, a schedule with <code>concurrencyPolicy</code>, an included <code>Policy</code>, budgets, and an optional <code>WorkflowRun</code> per release.</p></div>
        <div><h4>Why Helm</h4><p>Helm labels and the release namespace are not covered by the AWP digest, so packaging does not change the identity of the workflow. The VALID and READY columns stay empty until a runtime reports status.</p></div>
      </div>
    </section>
`,
  footer: `Source of every example: the AEPs, the specification draft and the conformance suite in
      <a href="https://github.com/agenticworkflowprotocol/agenticworkflowprotocol.org/tree/docs/aep-0026-0027-sessions-engine">agenticworkflowprotocol.org</a>, branch <code>docs/aep-0026-0027-sessions-engine</code>.
      This page is generated from <a href="https://github.com/agenticworkflowprotocol/awp-v1alpha2-draft">awp-v1alpha2-draft</a>; corrections are welcome as issues or pull requests.`,
};

const V1 = 'awp.agenticworkflowprotocol.org/v1alpha1';
const V2 = 'awp.agenticworkflowprotocol.org/v1alpha3'; // the draft (v1alpha2 at b8a0ee8, v1alpha3 since D20)

export const examples = [
  // ---------------------------------------------------------------- document model
  {
    id: 'minimal', chapter: 'model', title: 'A minimal workflow',
    left: { check: 'v1', code: `apiVersion: ${V1}
kind: Workflow
metadata:
  name: hello
  version: 0.1.0
  owner:
    team: platform-team
spec:
  agents:
    - id: assistant
      model:
        provider: ollama
        name: qwen3
  workflow:
    - id: greet
      agent: assistant
      task: Say hello.` },
    right: { check: 'v2', code: `apiVersion: ${V2}
kind: Workflow
metadata:
  name: hello
spec:
  version: 0.1.0
  owner:
    team: platform-team
  agents:
    - id: assistant
      model:
        provider: ollama
        name: qwen3
  workflow:
    - id: greet
      agent: assistant
      task: Say hello.` },
    what: '`version` and `owner` move from `metadata` into `spec`. Nothing else changes.',
    why: 'In Kubernetes, `metadata` is `ObjectMeta`. The API server drops every field it does not know, so a stored v1alpha1 workflow would lose its version and owner, and its digest would no longer verify.',
    refs: [KRM, spec('4.1', '41-metadata')],
  },
  {
    id: 'governance-fields', chapter: 'model', profiles: 'core,governance', title: 'Governance fields live in spec',
    left: { check: 'v1', code: `apiVersion: ${V1}
kind: Workflow
metadata:
  name: invoice-processing
  version: 1.2.0
  description: Extract, check and book invoices.
  owner:
    team: finance-automation
  classification: confidential
  purpose: Accounts payable processing
  risk:
    level: high
spec:
  agents:
    - id: extractor
      model:
        provider: ollama
        name: qwen3
  workflow:
    - id: extract
      agent: extractor
      task: Extract the invoice fields.` },
    right: { check: 'v2', code: `apiVersion: ${V2}
kind: Workflow
metadata:
  name: invoice-processing
spec:
  version: 1.2.0
  description: Extract, check and book invoices.
  owner:
    team: finance-automation
  classification: confidential
  purpose: Accounts payable processing
  risk:
    level: high
  agents:
    - id: extractor
      model:
        provider: ollama
        name: qwen3
  workflow:
    - id: extract
      agent: extractor
      task: Extract the invoice fields.` },
    what: '`description`, `classification`, `purpose`, `risk`, `integrity`, `signature` and `provenance` move to `spec` as well, with unchanged meaning.',
    why: 'They are governed content: covered by the digest, reviewed and signed. Labels and annotations would have been the only other place in `metadata`, and governance must never depend on labels.',
    refs: [KRM, spec('4.2', '42-common-spec-fields')],
  },
  {
    id: 'owner', chapter: 'model', title: 'Owner is always an object',
    left: { check: null, code: `metadata:
  name: hello
  version: 0.1.0
  owner: platform-team`, partial: true },
    right: { check: null, code: `spec:
  version: 0.1.0
  owner:
    team: platform-team` },
    what: 'The string shorthand for `owner` is gone. `owner` always has `team` (and optionally `contact`).',
    why: 'A CustomResourceDefinition needs a structural schema: one type per field. "String or object" cannot be expressed. The migration tool expands the shorthand.',
    refs: [KRM],
  },
  {
    id: 'policy-conditions', chapter: 'model', profiles: 'core,governance', title: 'Policy conditions have one form',
    left: { check: 'v1', code: `apiVersion: ${V1}
kind: Policy
metadata:
  name: production-guard
  version: 1.0.0
  owner:
    team: governance-team
spec:
  rules:
    - id: no-prod-deploys-by-agents
      effect: deny
      when:
        action: production.deploy
        actor.type: agent
        risk.level:
          gte: high` },
    right: { check: 'v2', code: `apiVersion: ${V2}
kind: Policy
metadata:
  name: production-guard
spec:
  version: 1.0.0
  owner:
    team: governance-team
  rules:
    - id: no-prod-deploys-by-agents
      effect: deny
      when:
        action:
          equals: production.deploy
        actor.type:
          equals: agent
        risk.level:
          gte: high` },
    what: 'The plain-value shorthand for `equals` is removed. Every attribute maps to an operator object.',
    why: 'Same reason as `owner`: a value that is either a string or an object is not a structural schema.',
    refs: [KRM, spec('8.3', '83-conditions')],
  },
  {
    id: 'agent', chapter: 'model', title: 'Agent manifests',
    left: { check: 'v1', code: `apiVersion: ${V1}
kind: Agent
metadata:
  name: invoice-extractor
  version: 1.0.0
  owner:
    team: finance-automation
  classification: confidential
spec:
  model:
    provider: ollama
    name: qwen3
  instructions: |
    Extract invoice number, date,
    supplier and total.` },
    right: { check: 'v2', code: `apiVersion: ${V2}
kind: Agent
metadata:
  name: invoice-extractor
spec:
  version: 1.0.0
  owner:
    team: finance-automation
  classification: confidential
  model:
    provider: ollama
    name: qwen3
  instructions: |
    Extract invoice number, date,
    supplier and total.` },
    what: 'The same move applies to every kind: `Workflow`, `Agent` and `Policy`.',
    why: 'One rule for all kinds keeps the migration mechanical and the CRDs uniform.',
    refs: [KRM],
  },
  {
    id: 'store-fields', chapter: 'model', title: 'Objects read back from a cluster',
    left: { check: 'v1-invalid', code: `apiVersion: ${V1}
kind: Workflow
metadata:
  name: hello
  version: 0.1.0
  owner:
    team: platform-team
  uid: 2f1c7a52-6a0e-4d55-9b1e-0c2f4b9a7d11
  resourceVersion: "4711"
  generation: 3
spec:
  agents:
    - id: assistant
      model:
        provider: ollama
        name: qwen3
  workflow:
    - id: greet
      agent: assistant
      task: Say hello.`, label: 'v1alpha1: rejected (unknown fields)', expect: 'schema.additionalProperties' },
    right: { check: 'v2', code: `apiVersion: ${V2}
kind: Workflow
metadata:
  name: hello
  namespace: team-a
  uid: 2f1c7a52-6a0e-4d55-9b1e-0c2f4b9a7d11
  resourceVersion: "4711"
  generation: 3
  managedFields:
    - manager: example-controller
      operation: Apply
spec:
  version: 0.1.0
  owner:
    team: platform-team
  agents:
    - id: assistant
      model:
        provider: ollama
        name: qwen3
  workflow:
    - id: greet
      agent: assistant
      task: Say hello.` },
    what: 'Fields that an object store fills in (`uid`, `resourceVersion`, `generation`, `managedFields`, ...) are accepted and ignored.',
    why: 'Every object read back from a Kubernetes API server carries them. A validator that rejected them could not check what is actually stored in a cluster.',
    refs: [KRM, spec('4.1', '41-metadata')],
  },
  {
    id: 'digest', chapter: 'model', title: 'The digest survives deployment',
    left: { check: null, lang: 'text', code: `v1alpha1 digest input:
  the whole document without integrity,
  signature and provenance

  metadata.name          covered
  metadata.version       covered
  metadata.owner         covered
  metadata.labels        covered
  metadata.namespace     (not defined)

Kustomize adds a label
  -> digest changes
  -> signature no longer verifies` },
    right: { check: 'v2', code: `apiVersion: ${V2}
kind: Workflow
metadata:
  name: hello
  namespace: team-b        # not covered
  labels:
    tier: gold             # not covered
  annotations:
    note: deployed by a tool
spec:
  version: 0.1.0
  owner:
    team: platform-team
  agents:
    - id: assistant
      model:
        provider: ollama
        name: qwen3
  workflow:
    - id: greet
      agent: assistant
      task: Say hello.
  integrity:
    digest: sha256:467f53622bc33e24ae28edac84e6507bd891f00812fe71729f40e28095ac3742` },
    what: 'The digest covers `apiVersion`, `kind`, `metadata.name` and `spec` (without `integrity`, `signature`, `provenance`). Namespace, labels, annotations, store fields and `status` are not covered.',
    why: 'Deployment tools (Argo CD, Flux, Kustomize, Helm) change namespace, labels and annotations. A reviewed and signed manifest must keep its digest through that. This case is in the conformance suite and verifies.',
    refs: [KRM, spec('9.1', '91-manifest-digest')],
  },
  {
    id: 'status', chapter: 'model', title: 'status is reserved for runtimes',
    left: { check: 'v1-invalid', code: `apiVersion: ${V1}
kind: Workflow
metadata:
  name: hello
  version: 0.1.0
  owner:
    team: platform-team
spec:
  agents:
    - id: assistant
      model:
        provider: ollama
        name: qwen3
  workflow:
    - id: greet
      agent: assistant
      task: Say hello.
status:
  ready: true`, label: 'v1alpha1: rejected (unknown top-level field)', expect: 'schema.additionalProperties' },
    right: { check: 'v2', code: `apiVersion: ${V2}
kind: Workflow
metadata:
  name: hello
spec:
  version: 0.1.0
  owner:
    team: platform-team
  agents:
    - id: assistant
      model:
        provider: ollama
        name: qwen3
  workflow:
    - id: greet
      agent: assistant
      task: Say hello.
status:
  observedGeneration: 3
  digest: sha256:467f53622bc33e24ae28edac84e6507bd891f00812fe71729f40e28095ac3742
  conditions:
    - type: Valid
      status: "True"
      reason: Validated
      message: ""
      lastTransitionTime: 2026-11-19T08:00:00Z
    - type: Ready
      status: "True"
      reason: Ready
      message: ""
      lastTransitionTime: 2026-11-19T08:00:00Z` },
    what: 'A manifest may carry `status`. Validators ignore it, the digest does not cover it, and runtimes never derive governance decisions from a status they did not write.',
    why: 'The runtime reports there whether it accepted the manifest. `kubectl get` and `kubectl wait --for=condition=Valid` read it directly.',
    refs: [KRM, RUN, spec('3.11', '311-status')],
  },
  {
    id: 'kubernetes', chapter: 'model', title: 'Storing a workflow in Kubernetes',
    left: { check: null, code: `# Workaround every operator had to invent
apiVersion: v1
kind: ConfigMap
metadata:
  name: hello-workflow
  labels:
    runtime.example.com/kind: awp-workflow
data:
  workflow.yaml: |
    apiVersion: ${V1}
    kind: Workflow
    metadata:
      name: hello
      version: 0.1.0
    ...`, label: 'v1alpha1: wrapped in a ConfigMap' },
    right: { check: null, lang: 'text', code: `$ kubectl apply -f schema/crd/
$ kubectl apply --validate=strict -f hello.yaml
workflow.awp.agenticworkflowprotocol.org/hello created

$ kubectl get workflows
NAME    VERSION   OWNER           VALID   READY   AGE
hello   0.1.0     platform-team   True    True    2m

$ kubectl wait --for=condition=Ready workflow/hello
workflow.awp.agenticworkflowprotocol.org/hello condition met`, label: 'v1alpha3: a native custom resource' },
    what: 'The repository publishes CustomResourceDefinitions generated from the JSON Schema (`schema/crd/`), with printer columns and a status subresource.',
    why: 'With a wrapper, the AWP document is invisible to RBAC, `kubectl`, GitOps health checks and owner references, and every runtime wraps differently. The output on the right was checked on a local k3s cluster.',
    refs: [KRM, spec('3.10', '310-object-stores-and-kubernetes')],
  },
  {
    id: 'extensions-interim', chapter: 'model', title: 'x- fields move into extensions',
    left: { check: 'v1', code: `apiVersion: ${V1}
kind: Workflow
metadata:
  name: hello
  version: 0.1.0
  owner:
    team: platform-team
spec:
  agents:
    - id: assistant
      model:
        provider: ollama
        name: qwen3
  workflow:
    - id: greet
      agent: assistant
      task: Say hello.
      x-example-reviewChecklist: security-v2` },
    right: { check: 'v2', code: `apiVersion: ${V2}
kind: Workflow
metadata:
  name: hello
spec:
  version: 0.1.0
  owner:
    team: platform-team
  agents:
    - id: assistant
      model:
        provider: ollama
        name: qwen3
  workflow:
    - id: greet
      agent: assistant
      task: Say hello.
      extensions:
        x-example-reviewChecklist: security-v2` },
    what: '`x-` keys are only allowed inside an `extensions` object.',
    why: 'A structural schema cannot have free keys next to defined fields. This is an interim step: the last chapter proposes to remove `x-` fields altogether.',
    refs: [KRM, spec('3.3', '33-unknown-fields-and-extensions')],
  },

  // ---------------------------------------------------------------- schedules
  {
    id: 'concurrency', chapter: 'schedule', title: 'Overlapping ticks',
    left: { check: null, code: `triggers:
  - type: schedule
    cron: "*/30 * * * *"
    timezone: Europe/Berlin

# The previous execution still runs
# when the next tick arrives:
# start a second one? skip? undefined.`, partial: true },
    right: { check: null, code: `triggers:
  - type: schedule
    cron: "*/30 * * * *"
    timezone: Europe/Berlin
    concurrencyPolicy: forbid   # default
    startingDeadline: 15m` },
    what: '`concurrencyPolicy` is `allow`, `forbid` (default) or `replace`, as in Kubernetes CronJobs. `startingDeadline` allows one late start after missed ticks.',
    why: 'Overlapping agent executions cost money and can act twice on the same data. The safe default is to skip the tick.',
    refs: [SCHED, spec('5.2', '52-triggers')],
  },
  {
    id: 'trigger-skipped', chapter: 'schedule', title: 'Skipped ticks are audited',
    left: { check: null, lang: 'text', code: `(no event)

A tick that did not start an execution
left no trace in the audit log.` },
    right: { check: null, code: `type: trigger.skipped
time: "2026-11-19T06:30:00Z"
workflow:
  name: nightly-triage
  version: 1.2.0
actor:
  type: system
  id: scheduler
data:
  trigger:
    index: 1
    type: schedule
  scheduledAt: "2026-11-19T06:30:00Z"
  reason: concurrencyForbidden` },
    what: 'Every tick without an execution emits `trigger.skipped` with the reason (`concurrencyForbidden`, `missed`, `startingDeadlineExceeded`). Missed ticks are not replayed in a burst after an outage.',
    why: 'An auditor must be able to see why a scheduled job did not run.',
    refs: [SCHED, spec('10.4', '104-event-types')],
  },

  // ---------------------------------------------------------------- human input
  {
    id: 'input-step', chapter: 'input', title: 'Asking a person during a workflow',
    left: { check: null, code: `# Only approvals exist: yes or no.
- id: confirm-targets
  type: approval
  approval:
    approvers:
      - role: release-manager
    timeout: 4h
  dependsOn: [analyze]

# Which environment? How many hosts?
# There is no way to ask.`, partial: true },
    right: { check: null, code: `- id: ask-targets
  type: input
  dependsOn: [analyze]
  input:
    message: Where should the fix be rolled out?
    answerers:
      - role: release-manager
    timeout: 4h
    answerSchema:
      type: object
      properties:
        environment:
          type: string
          enum: [staging, production]
        maxHosts:
          type: integer
          minimum: 1
      required: [environment]
    onTimeout: useDefault
    default:
      environment: staging
- id: apply
  agent: worker
  task: >-
    Roll out to
    \${{ steps.ask-targets.outputs.answer }}.
  dependsOn: [ask-targets]` },
    what: 'A new step type `input` asks named answerers for free text or a structured answer (a subset of the MCP elicitation schema), with timeout and fallback.',
    why: 'Workflows misused approvals to collect information. An answer is not an approval: it never counts as one, so a free-text reply cannot bypass a governance gate.',
    refs: [INPUT, spec('5.8', '58-human-input')],
  },
  {
    id: 'agent-input', chapter: 'input', title: 'An agent asks a question',
    left: { check: null, code: `agents:
  - id: worker
    model:
      provider: ollama
      name: qwen3

# The agent cannot ask anybody.
# It guesses or fails.`, partial: true },
    right: { check: null, code: `agents:
  - id: worker
    model:
      provider: ollama
      name: qwen3
    humanInput:
      answerers:
        - role: maintainer
      timeout: 30m
      onTimeout: return
      maxRequests: 3` },
    what: 'An agent with `humanInput` may ask the listed answerers while it works, at most `maxRequests` times. The request and the answer are audited (`input.requested`, `input.provided`).',
    why: 'Agents meet ambiguous situations. Asking a named person is safer than guessing, and the limits keep it from turning into a chat.',
    refs: [INPUT, spec('5.8', '58-human-input')],
  },

  // ---------------------------------------------------------------- outputs
  {
    id: 'command-outputs', chapter: 'outputs', title: 'Outputs of a command step',
    left: { check: null, code: `- id: diff
  type: command
  image: registry.example.com/tools/diff@sha256:...
  command: ./diff.sh
  outputs:
    - name: new
    - name: count

# How does ./diff.sh set "new" and "count"?
# Each runtime invented its own convention.`, partial: true },
    right: { check: null, code: `- id: diff
  type: command
  image: registry.example.com/tools/diff@sha256:...
  command: >-
    ./diff.sh > "$AWP_OUTPUTS/new" &&
    wc -l < "$AWP_OUTPUTS/new" > "$AWP_OUTPUTS/count"
  outputs:
    - name: new
    - name: count` },
    what: 'The runtime creates an empty directory per attempt and passes it in `AWP_OUTPUTS`. One file per declared output. At least 256 KiB per output and 1 MiB per step are accepted; outputs of failed attempts are discarded.',
    why: 'Without a rule, an image written for one runtime produces no outputs on another. This was the largest gap reported by the runtime proof of concept (G01).',
    refs: [OUTPUTS, spec('5.6.4', '564-step-outputs')],
  },
  {
    id: 'agent-outputs', chapter: 'outputs', title: 'Outputs of an agent step',
    left: { check: null, lang: 'text', code: `task: |
  Rate the concerts.
  At the very end, print a line
  RELEVANT=<json array>
  and nothing after it.

-> works until the model adds a sentence
   after the line, or wraps it in markdown.` },
    right: { check: null, lang: 'text', code: `task: Rate the concerts.
outputs:
  - name: relevant
    description: JSON array of relevant concerts.

The agent ends the step with the built-in tool:

complete_step({
  "relevant": "[{\\"venue\\": \\"...\\"}]"
})` },
    what: 'Agent steps end with a built-in tool `complete_step` that has one parameter per declared output. An agent step with outputs that never completes fails with `notCompleted`.',
    why: 'Parsing the last message depends on the model following a format. A tool call is structured and checked by the runtime. `complete_step` is not an action, so it cannot bypass permissions.',
    refs: [OUTPUTS, spec('5.6.4', '564-step-outputs')],
  },
  {
    id: 'reserved-env', chapter: 'outputs', title: 'Reserved environment variables',
    left: { check: 'v1', code: `apiVersion: ${V1}
kind: Workflow
metadata:
  name: hello
  version: 0.1.0
  owner:
    team: platform-team
spec:
  workflow:
    - id: build
      type: command
      image: registry.example.com/build@sha256:0f1e2d3c4b5a69788796a5b4c3d2e1f00f1e2d3c4b5a69788796a5b4c3d2e1f0
      command: make
      env:
        AWP_OUTPUTS: /tmp/out
  agents: []` },
    right: { check: 'v2-invalid', lang: 'text', code: `$ node conformance/awp-check.mjs check build.yaml
build.yaml: invalid
  step.reserved-env  /spec/workflow/0/env/AWP_OUTPUTS
  environment variables starting with AWP_ are
  reserved for the runtime (section 5.6.4)

The runtime sets:
  AWP_OUTPUTS       directory for output files
  AWP_EXECUTION_ID  execution identifier
  AWP_STEP_ID       step id
  AWP_ATTEMPT       attempt number`, expect: 'step.reserved-env', doc: `apiVersion: ${V2}
kind: Workflow
metadata:
  name: hello
spec:
  version: 0.1.0
  owner:
    team: platform-team
  workflow:
    - id: build
      type: command
      image: registry.example.com/build@sha256:0f1e2d3c4b5a69788796a5b4c3d2e1f00f1e2d3c4b5a69788796a5b4c3d2e1f0
      command: make
      env:
        AWP_OUTPUTS: /tmp/out
  agents: []` },
    what: 'The prefix `AWP_` belongs to the runtime; a manifest must not set such variables.',
    why: 'Otherwise a manifest could redirect where outputs are read from, or fake the execution identity a step sees.',
    refs: [OUTPUTS],
  },

  // ---------------------------------------------------------------- WorkflowRun
  {
    id: 'start-run', chapter: 'run', title: 'Starting an execution',
    left: { check: null, lang: 'text', code: `Every runtime has its own way:

$ runtime-a run hello --input repo=web-shop

$ curl -X POST https://runtime-b.example.com/api/v1/executions \\
    -d '{"workflow": "hello", "inputs": {...}}'

apiVersion: runtime-c.example.com/v1
kind: HelloRun
...` },
    right: { check: 'v2', code: `apiVersion: ${V2}
kind: WorkflowRun
metadata:
  generateName: vulnerability-fixer-
  namespace: security
spec:
  workflowRef:
    name: vulnerability-fixer
    version: 0.1.0
  inputs:
    cve: CVE-2026-12345
    repository: example-org/web-shop
  environment: staging` },
    what: 'A new kind `WorkflowRun`: creating one starts one execution, as a `manual` trigger with all its rules. `spec.cancel: true` or deleting it cancels.',
    why: 'Tools (CLIs, dashboards, pipelines, GitOps) can start and watch executions on any runtime. The actor is never read from the object; it comes from an authenticated source.',
    refs: [RUN, spec('10.8', '108-kind-workflowrun')],
  },
  {
    id: 'run-status', chapter: 'run', title: 'Watching an execution',
    left: { check: null, lang: 'text', code: `Only the audit event stream, in a
runtime-specific store:

workflow.started   ...
step.started       analyze
step.completed     analyze
step.started       apply
...

No object that says "running, step 2 of 3".` },
    right: { check: 'v2', code: `apiVersion: ${V2}
kind: WorkflowRun
metadata:
  name: vulnerability-fixer-7k2xq
  namespace: security
spec:
  workflowRef:
    name: vulnerability-fixer
status:
  executionId: awp-exec-01JD6Q8Z5K3M4N5P6Q7R8S9T0V
  phase: running
  actor:
    type: human
    id: alice@example.com
  workflow:
    name: vulnerability-fixer
    version: 0.1.0
    digest: sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  startedAt: 2026-11-19T08:00:00Z
  steps:
    - id: investigate
      status: succeeded
      attempts: 1
    - id: fix
      status: running
      attempts: 1
  conditions:
    - type: Accepted
      status: "True"
      reason: Validated
      message: ""
      lastTransitionTime: 2026-11-19T08:00:00Z` },
    what: 'The runtime reports phase, pinned workflow, per-step status, usage and the conditions `Accepted` and `Succeeded`. No secret values and no output content.',
    why: 'Audit events remain the record; status is the current view for people and tools.',
    refs: [RUN, spec('10.8', '108-kind-workflowrun')],
  },
  {
    id: 'kubectl', chapter: 'run', title: 'kubectl shows validity and progress',
    left: { check: null, lang: 'text', code: `$ kubectl get configmaps -l runtime.example.com/kind=awp-workflow
NAME              DATA   AGE
hello-workflow    1      3d

(valid? which version? nobody knows
 without asking the runtime)` },
    right: { check: null, lang: 'text', code: `$ kubectl get workflows
NAME                  VERSION   OWNER           VALID   READY   AGE
vulnerability-fixer   0.1.0     security-team   True    True    3d

$ kubectl get workflowruns
NAME                        WORKFLOW              PHASE     STARTED   AGE
vulnerability-fixer-7k2xq   vulnerability-fixer   running   5m        5m` },
    what: 'The generated CRDs have printer columns for version, owner, the `Valid` and `Ready` conditions and the run phase.',
    why: 'Printer columns come from the CRDs, and the CRDs come from this repository. A runtime cannot add them on its own.',
    refs: [RUN],
  },

  // ---------------------------------------------------------------- pinning
  {
    id: 'pinning', chapter: 'pinning', title: 'A GitOps sync during an execution',
    left: { check: null, lang: 'text', code: `08:00  execution starts with nightly-triage 1.2.0
08:05  waits for approval of step "deploy"
09:10  Argo CD syncs 1.3.0:
         step "notify" removed,
         policy tightened
09:30  approval arrives

Which version runs now? Undefined.
The audit log says 1.2.0.` },
    right: { check: null, lang: 'text', code: `08:00  execution starts, pins
         workflow  nightly-triage 1.2.0  sha256:5c4b...
         agents    triage-agent    1.0.3  sha256:91aa...
         policies  prod-guard      2.1.0  sha256:07fe...
08:05  waits for approval of step "deploy"
09:10  Argo CD syncs 1.3.0
09:30  approval arrives -> continues with 1.2.0
       (or the runtime cancels: reason manifestChanged)
10:00  next tick starts 1.3.0` },
    what: 'An execution uses exactly the workflow, agent and policy versions it resolved at start, until it ends. Mixing is never allowed; a runtime may cancel instead.',
    why: 'An approver approves the step of the version that runs, and the audit trail names exactly that version.',
    refs: [PIN, spec('10.1', '101-execution-identity')],
  },
  {
    id: 'started-digest', chapter: 'pinning', title: 'The digest is required at start',
    left: { check: null, code: `type: workflow.started
executionId: awp-exec-01JABC7Q4M2W9X0Y1Z2A3B4C5D
workflow:
  name: vulnerability-fixer
  version: 0.1.0
  # digest: only "if known"
actor:
  type: human
  id: user:alice@example.com
environment: development` },
    right: { check: null, code: `type: workflow.started
executionId: awp-exec-01JABC7Q4M2W9X0Y1Z2A3B4C5D
workflow:
  name: vulnerability-fixer
  version: 0.1.0
  digest: sha256:5c4b3a29180716f5e4d3c2b1a0f9e8d7c6b5a49382716f5e4d3c2b1a0f9e8d7c
actor:
  type: human
  id: user:alice@example.com
environment: development` },
    what: '`workflow.digest` is REQUIRED in `workflow.started`.',
    why: 'Name and version can be reused by mistake; the digest identifies the exact content that ran.',
    refs: [PIN, spec('10.3', '103-event-envelope')],
  },
  {
    id: 'assert-version', chapter: 'pinning', title: 'Run exactly the reviewed version',
    left: { check: null, lang: 'text', code: `(not possible)

A pipeline that reviewed version 0.1.0
cannot make sure that 0.1.0 runs:
a sync may have applied 0.2.0 in between.` },
    right: { check: 'v2', code: `apiVersion: ${V2}
kind: WorkflowRun
metadata:
  name: fixer-reviewed-run
  namespace: security
spec:
  workflowRef:
    name: vulnerability-fixer
    version: 0.1.0
    digest: sha256:5c4b3a29180716f5e4d3c2b1a0f9e8d7c6b5a49382716f5e4d3c2b1a0f9e8d7c` },
    what: '`workflowRef.version` and `workflowRef.digest` are assertions. If the current workflow differs, the run is rejected (`versionMismatch`, `digestMismatch`).',
    why: 'A run never selects old versions, so the object store needs no history; the assertion only guarantees that what was reviewed is what runs.',
    refs: [PIN, RUN],
  },

  {
    id: 'image-pinning', chapter: 'pinning', title: 'Images: tags in the manifest, digests in the record',
    left: { check: null, code: `- id: fetch
  type: command
  image: registry.example.com/tools:1.4
  command: fetch

# Which image ran? Whatever :1.4 pointed to
# at that moment. A retry an hour later may
# pull a different one. Under the security
# profile a digest is required, which is hard
# to maintain in Helm charts.`, partial: true },
    right: { check: null, lang: 'text', code: `manifest:   image: registry.example.com/tools:1.4

execution start: runtime resolves the tag
  registry.example.com/tools:1.4
    -> sha256:9c1e...  (image index: amd64, arm64, s390x)

every step and retry of this execution uses sha256:9c1e...

reproducibility record:
  images:
    - reference: registry.example.com/tools:1.4
      digest: sha256:9c1e...

security profile: tools:1.4@sha256:9c1e... (index digest)` },
    what: 'Tags stay allowed outside the security profile. The runtime resolves every image to a digest when an execution starts, pins it like the manifests and records it. For multi-platform images the digest is that of the image index, which works on every architecture. A runtime that cannot run images rejects a command step with `image`.',
    why: 'Every execution is traceable without forcing authors and packaging tools to maintain digests. Organisations that need the reviewed image to be the executed one choose the security profile.',
    refs: [PIN, spec('9.4', '94-dependencies')],
  },

  // ---------------------------------------------------------------- extension model (concept)
  {
    id: 'extension-step', chapter: 'extensions', title: 'A vendor-specific step',
    left: { check: 'v2', code: `apiVersion: ${V2}
kind: Workflow
metadata:
  name: web-shop-release
spec:
  version: 1.0.0
  owner:
    team: platform-team
  workflow:
    - id: deploy
      agent: deployer
      task: Deploy the canary.
      extensions:
        x-example-canary:
          weight: 10
  agents:
    - id: deployer
      model:
        provider: ollama
        name: qwen3`, label: 'v1alpha3 draft' },
    right: { check: null, code: `workflow:
  - id: deploy
    type: extension
    extensionRef:
      group: runtime.example.com
      kind: CanaryDeployment
      name: web-shop-canary
    dependsOn: [test]
---
apiVersion: runtime.example.com/v1
kind: CanaryDeployment
metadata:
  name: web-shop-canary
spec:
  weight: 10`, label: 'AEP-0021 proposal' },
    what: 'Closed step types plus `type: extension` with an `extensionRef` to an object validated by its own CRD. A runtime that does not know the kind refuses the workflow (`ResolvedRefs=False`); an extension step is never skipped. It is an action under permissions, policies and approvals.',
    why: 'A runtime that ignores an `x-` field runs the manifest with fewer restrictions. That is why AEP-0011 (`requiredExtensions`) was needed. A typed reference fails closed by construction. Same pattern as Gateway API `ExtensionRef` and Tekton `CustomRun`.',
    refs: [EXT],
  },
  {
    id: 'policy-attachment', chapter: 'extensions', title: 'Policies attached by the platform team',
    left: { check: null, code: `# in the workflow, written by its author
spec:
  policies:
    include:
      - name: no-production-autonomy
        version: 1.0.0

# The platform team cannot enforce a policy
# on a workflow whose author left it out.`, label: 'v1alpha3 draft' },
    right: { check: null, code: `apiVersion: ${V2}
kind: Policy
metadata:
  name: no-production-autonomy
  namespace: payments
spec:
  version: 1.0.0
  owner:
    team: platform-governance
  targetRefs:
    - group: awp.agenticworkflowprotocol.org
      kind: Workflow
      name: invoice-processing
  rules:
    - id: deploy-needs-release-manager
      effect: requireApproval
      when:
        action:
          equals: production.deploy
status:
  ancestors:
    - ancestorRef:
        kind: Workflow
        name: invoice-processing
      conditions:
        - type: Accepted
          status: "True"`, label: 'AEP-0021 proposal' },
    what: '`Policy` gets `targetRefs` to workflows (or single steps via `sectionName`) in the same namespace. `include` stays for author-chosen policies.',
    why: 'Policy attachment as in the Gateway API (GEP-713). AWP policies only restrict, so all attached policies simply apply together; no conflict rules are needed.',
    refs: [EXT],
  },
  {
    id: 'binding', chapter: 'extensions', title: 'Runtime configuration stays out of the manifest',
    left: { check: null, code: `spec:
  workflow:
    - id: collect
      type: command
      command: ./collect.sh
      extensions:
        x-example-runnerImage: registry.example.com/runner:1.4
        x-example-nodeSelector:
          pool: agents
  extensions:
    x-example-modelBaseURL: https://llm.internal.example.com`, label: 'v1alpha3 draft' },
    right: { check: null, code: `apiVersion: runtime.example.com/v1
kind: WorkflowBinding
metadata:
  name: venue-watch
  namespace: agents
  labels:
    awp.agenticworkflowprotocol.org/binding: "true"
spec:
  targetRefs:
    - group: awp.agenticworkflowprotocol.org
      kind: Workflow
      name: venue-watch
  runnerImage: registry.example.com/runner@sha256:...
  nodeSelector:
    pool: agents
  models:
    baseURL: https://llm.internal.example.com
status:
  conditions:
    - type: Accepted
      status: "True"`, label: 'AEP-0021 proposal' },
    what: 'Placement, images, model endpoints and secret mapping live in a runtime-specific binding object that attaches with `targetRefs`. One accepted binding per workflow and runtime; the oldest wins, others get `Conflicted`.',
    why: 'The manifest stays portable and its digest unchanged. Fields that decide where credentials, data or network traffic go must be limited by the operator (an allow list), not by the binding author: the proof of concept found a provider key leak through `baseURL`.',
    refs: [EXT],
  },
  {
    id: 'domain-values', chapter: 'extensions', title: 'Vendor values carry a domain',
    left: { check: null, code: `agents:
  - id: assistant
    model:
      provider: gateway        # whose gateway?
      name: qwen3

secrets:
  - name: TOKEN
    source: vault-ha           # collides with
                               # another runtime's name`, label: 'v1alpha3 draft' },
    right: { check: null, code: `agents:
  - id: assistant
    model:
      provider: models.example.com/gateway
      name: qwen3

secrets:
  - name: TOKEN
    source: secrets.example.com/vault-ha`, label: 'AEP-0021 proposal' },
    what: 'Bare values belong to AWP; implementation values use a DNS prefix and are Implementation-specific. Applies to model providers, secret sources, event sources, audit event types and condition types.',
    why: 'Domain names are unique without a registry, so the extension prefix list (D12) is no longer needed. Same rule as the Gateway API and Kubernetes condition types.',
    refs: [EXT],
  },
  {
    id: 'strict', chapter: 'extensions', title: 'Typos are caught at apply time',
    left: { check: null, lang: 'text', code: `# typo: "permisions" instead of "permissions"
$ kubectl apply --validate=strict -f fixer.yaml
workflow.awp.agenticworkflowprotocol.org/fixer created

$ kubectl get workflow fixer
NAME    VERSION   OWNER           VALID   READY
fixer   0.1.0     security-team   False   False

(CRDs keep unknown fields so that the runtime can
 fail closed; the error shows up only in status,
 and Argo CD reports "Synced")`, label: 'v1alpha3 draft' },
    right: { check: null, lang: 'text', code: `$ kubectl apply --validate=strict -f fixer.yaml
Error from server (BadRequest): error when creating
"fixer.yaml": Workflow in version "v1alpha3" cannot be
handled as a Workflow: strict decoding error:
unknown field "spec.permisions"

(CRDs prune unknown fields and express the
 conditional rules as CEL; the runtime still
 validates every manifest fully)`, label: 'AEP-0021 proposal' },
    what: 'The CRDs drop `x-kubernetes-preserve-unknown-fields`, prune unknown fields and get CEL rules (`x-kubernetes-validations`). No admission webhook is needed.',
    why: 'Fixes G09. The Gateway API removed its webhook in favour of CEL. CRD validation is feedback, not a security boundary (GEP-922), so runtimes keep validating.',
    refs: [EXT],
  },
  // ---------------------------------------------------------------- iteration
  {
    id: 'foreach', chapter: 'iteration', title: 'One step per item of a list',
    left: { check: 'v1', code: `apiVersion: ${V1}
kind: Workflow
metadata:
  name: image-scan
  version: 0.1.0
  owner:
    team: security-team
spec:
  agents:
    - id: scanner
      model:
        provider: example-provider
        name: example-model
  workflow:
    # one step per image, written out by hand
    - id: scan-web
      agent: scanner
      task: Scan registry.example.com/web:1.4.
    - id: scan-api
      agent: scanner
      task: Scan registry.example.com/api:2.0.` },
    right: { check: 'v2', code: `apiVersion: ${V2}
kind: Workflow
metadata:
  name: image-scan
spec:
  version: 0.1.0
  owner:
    team: security-team
  inputs:
    - name: images
      type: array
      default:
        - registry.example.com/web:1.4
        - registry.example.com/api:2.0
  budget:
    resources:
      maxConcurrency: 2
  agents:
    - id: scanner
      model:
        provider: example-provider
        name: example-model
  workflow:
    - id: scan
      agent: scanner
      task: "Scan \${{ forEach.item }}."
      forEach:
        items: "\${{ inputs.images }}"
        maxItems: 20
        concurrency: 2
      outputs:
        - name: report` },
    what: '`forEach` runs the step once per item, at most `maxItems` items and `concurrency` at a time; each running item run counts against `budget.resources.maxConcurrency` (default 1). Each item run produces its own outputs through `$AWP_OUTPUTS` or `complete_step`; the step output is a JSON list in item order.',
    why: 'The number of item runs never depends on what an item run produces, so budgets and reviews stay bounded. A list longer than `maxItems` fails the step instead of being truncated.',
    refs: [ITER, spec('5.6.5', '565-iteration')],
  },

  // ---------------------------------------------------------------- AEP-0023 (PR #25)
  {
    id: 'allow-hosts', chapter: 'isolation', title: 'One syntax for allowed hosts',
    left: { check: 'v2', code: `apiVersion: ${V2}
kind: Workflow
metadata:
  name: support-triage
spec:
  version: 0.1.0
  owner:
    team: support
  classification: internal
  permissions:
    network:
      egress: deny
      allowHosts:
        - api.example.com
        - cdn.example.com
  agents:
    - id: triage
      model:
        provider: example-provider
        name: example-model
  workflow:
    - id: run
      agent: triage
      task: Triage new tickets.` },
    right: { code: `apiVersion: ${V2}
kind: Workflow
metadata:
  name: support-triage
spec:
  version: 0.1.0
  owner:
    team: support
  classification: internal
  permissions:
    network:
      egress: deny
      allowTo:                      # replaces allowHosts
        - host: api.example.com
          ports:
            - port: 443
        - host: "*.cdn.example.com"   # subdomain wildcard
        - cidr: 2001:db8::1/128       # IPv6 address with a port:
          ports:                      # no ambiguity
            - port: 8443
        - cidr: 10.20.0.0/16          # internal ticket system
  agents:
    - id: triage
      model:
        provider: example-provider
        name: example-model
  workflow:
    - id: run
      agent: triage
      task: Triage new tickets.` },
    what: '`allowTo` replaces `allowHosts`. An entry is an object with exactly one of `host` (a name or `*.domain`) and `cidr` (a range; a single address is `/32` or `/128`), and optional `ports` with `port`, `endPort` and `protocol`. The fields follow the egress rules of Kubernetes network policies, so a `cidr` entry becomes an `ipBlock`.',
    why: 'The string forms were undefined (G49), and a port appended to an IPv6 address is ambiguous (`2001:db8::1:443`). Objects remove both problems and translate field by field into a network policy or a proxy allow list.',
    refs: [ISOLATION, spec('7.5', '75-tool-governance-permissions')],
  },
  {
    id: 'egress-default', chapter: 'isolation', profiles: 'core,security', title: 'Egress is denied by default under security',
    left: { check: 'v2', code: `apiVersion: ${V2}
kind: Workflow
metadata:
  name: support-triage
spec:
  version: 0.1.0
  owner:
    team: support
  classification: internal
  permissions:
    default: deny
    tools:
      shell.execute:
        allow: true
  agents:
    - id: triage
      model:
        provider: example-provider
        name: example-model
  workflow:
    - id: run
      agent: triage
      task: Triage new tickets.
# under security: egress is allow (the default)` },
    right: { code: `apiVersion: ${V2}
kind: Workflow
metadata:
  name: support-triage
spec:
  version: 0.1.0
  owner:
    team: support
  classification: internal
  permissions:
    default: deny
    tools:
      shell.execute:
        allow: true
    network:                  # without this block:
      egress: deny            # deny under security
      allowTo:
        - host: api.example.com
  agents:
    - id: triage
      model:
        provider: example-provider
        name: example-model
  workflow:
    - id: run
      agent: triage
      task: Triage new tickets.` },
    what: 'Under the `security` profile, a manifest with `permissions` but without `network.egress` gets `deny`. Outside it, the default stays `allow`.',
    why: 'Deny-by-default deployments and the intent of the security profile conflict with `egress: allow` as the default (G47). Authors add `egress: allow` or `allowTo` where a step needs the network.',
    refs: [ISOLATION],
  },
  {
    id: 'ceiling', chapter: 'isolation', title: 'Enforce or reject against the platform ceiling',
    left: { check: null, lang: 'text', code: `# v1alpha3: permissions.network applies to
# command steps (5.6.2), but nothing says what
# happens when the platform allows less, or when
# the runtime cannot restrict egress by host name.
#
# A runtime may run the step anyway, with weaker
# restrictions than the reviewed manifest says.`, label: 'v1alpha3 draft' },
    right: { check: null, lang: 'text', code: `# a ceiling never adjusts a manifest: it rejects
$ awp run support-triage
rejected before any step ran: ceilingExceeded
  permissions.network.allowTo[1] (cidr 10.20.0.0/16)
  is not allowed by the platform ceiling
# (message format is a sketch; the AEP requires a
#  reason that names the rule and the step type)`, label: 'AEP-0023 proposal' },
    what: 'A runtime enforces the network rules for every step type or rejects the manifest; it never runs a step with weaker rules. A platform ceiling (per namespace, tenant or installation) never adjusts a manifest: a destination it does not allow rejects the manifest before any step runs.',
    why: 'An author could not tell whether a reviewed manifest will run, and a runtime could silently ignore the rules (G10, G47, G51). Under `security`, internal destinations (loopback, private, link-local, shared address space) are reachable only through a `cidr` entry that the ceiling also allows, never through a `host` entry (G50).',
    refs: [ISOLATION],
  },
  {
    id: 'model-credentials', chapter: 'isolation', title: 'Model credentials stay out of steps',
    left: { check: null, lang: 'text', code: `# v1alpha3 says nothing about provider keys.
# A runtime may hand them to the agent step:
$ env   # inside an agent step
PROVIDER_API_KEY=<the provider key>
# readable by any command or injected instruction`, label: 'v1alpha3 draft' },
    right: { check: null, lang: 'text', code: `# security profile: no provider key in the step
# (environment, files, arguments). The runtime calls
# the provider itself, or a proxy authenticates the
# step with a short-lived credential bound to one
# execution or attempt.
$ env   # inside an agent step
<no provider key>`, label: 'AEP-0023 proposal' },
    what: 'Model credentials are runtime configuration. Under `security` they MUST NOT be visible to steps; outside it, a runtime that exposes them says so in its conformance statement.',
    why: 'A key inside the step can be exfiltrated by any command or prompt injection (G61). A proof of concept keeps keys only at the runtime and gives each attempt a short-lived credential.',
    refs: [ISOLATION, spec('7.9', '79-secrets')],
  },

  // ---------------------------------------------------------------- AEP-0024 (PR #24)
  {
    id: 'event-filter', chapter: 'event-triggers', title: 'Filters match CloudEvents attributes',
    left: { check: 'v2', code: `apiVersion: ${V2}
kind: Workflow
metadata:
  name: support-chat
spec:
  version: 0.1.0
  owner:
    team: support
  classification: internal
  triggers:
    - type: event
      source: chat.example.com
      eventType: com.example.chat.message.posted
      filter:
        mentions: support-bot     # matched how?
  agents:
    - id: triage
      model:
        provider: example-provider
        name: example-model
  workflow:
    - id: answer
      agent: triage
      task: Answer the support question.` },
    right: { code: `apiVersion: ${V2}
kind: Workflow
metadata:
  name: support-chat
spec:
  version: 0.1.0
  owner:
    team: support
  classification: internal
  triggers:
    - type: event
      source: chat.example.com    # CloudEvents source
      eventType: com.example.chat.message.posted
      filter:                     # equality, all match
        subject: support          # an attribute
        data.mentions: support-bot
  agents:
    - id: triage
      model:
        provider: example-provider
        name: example-model
  workflow:
    - id: answer
      agent: triage
      task: Answer the support question.` },
    what: 'An event is a CloudEvent 1.0. `source` is matched against the CloudEvents `source` (the producer, not an adapter), `eventType` against `type`. Filter keys are attribute names or `data.<path>`; values match by equality with the string form; all entries must match, and a missing attribute does not match.',
    why: 'Today the filter is a map of strings with no rule which fields it matches or how (G42, G54). Richer conditions may live in runtime trigger objects, which may only narrow the manifest trigger.',
    refs: [TRIGGERS, spec('5.2', '52-triggers')],
  },
  {
    id: 'event-dedup', chapter: 'event-triggers', title: 'Duplicates, concurrency and rate',
    left: { check: 'v2-invalid', expect: 'schema.not', label: 'v1alpha3 draft: rejected (concurrencyPolicy is schedule-only)', code: `apiVersion: ${V2}
kind: Workflow
metadata:
  name: support-chat
spec:
  version: 0.1.0
  owner:
    team: support
  classification: internal
  triggers:
    - type: event
      source: chat.example.com
      eventType: com.example.chat.message.posted
      concurrencyPolicy: allow
  agents:
    - id: triage
      model:
        provider: example-provider
        name: example-model
  workflow:
    - id: answer
      agent: triage
      task: Answer the support question.` },
    right: { code: `apiVersion: ${V2}
kind: Workflow
metadata:
  name: support-chat
spec:
  version: 0.1.0
  owner:
    team: support
  classification: internal
  triggers:
    - type: event
      source: chat.example.com
      eventType: com.example.chat.message.posted
      concurrencyPolicy: allow    # default for events
      rateLimit:
        maxExecutions: 20
        period: 1h
      # dedup by source and id: runtime duty, no field
  agents:
    - id: triage
      model:
        provider: example-provider
        name: example-model
  workflow:
    - id: answer
      agent: triage
      task: Answer the support question.` },
    what: 'The runtime never starts a second execution for the same `source` and `id` within a window of at least 24 hours (`trigger.skipped`, reason `duplicate`). Event triggers get `concurrencyPolicy` (default `allow`) and `rateLimit` with `maxExecutions` per `period` (reason `rateLimited`).',
    why: 'Brokers and webhooks redeliver; the proof of concept saw a second run for the same event (G43). Today `concurrencyPolicy` exists only for schedules, so the schema rejects it on an event trigger.',
    refs: [TRIGGERS],
  },
  {
    id: 'event-actor', chapter: 'event-triggers', title: 'The person behind an event',
    left: { check: null, code: `# workflow.started of an event-triggered run
type: workflow.started
executionId: awp-exec-01JD3Q7Y2M8K4N6P0R5S7T9V1W
actor:
  type: system
  id: chat-bridge
data:
  trigger:
    type: event
    index: 0`, label: 'v1alpha3 draft' },
    right: { code: `type: workflow.started
executionId: awp-exec-01JD3Q7Y2M8K4N6P0R5S7T9V1W
actor:
  type: system
  id: chat-bridge            # authenticated source
data:
  trigger:
    type: event
    index: 0
  attestedActor:             # only from a source
    type: human              # trusted to attest people
    id: kim@example.com`, label: 'AEP-0024 proposal' },
    what: 'The actor stays `system` with the authenticated identity of the source. If a source the runtime trusts attests a person, it is recorded as `attestedActor`, and `initiatorCannotApprove` and `actorCannotApproveOwnAction` treat that person as the initiator. A policy can require an attested actor (`trigger.attested`).',
    why: 'With `system` as the only actor, a person could start a run by message and approve its own request (G44, a must). Conversation context in `event.data` is untrusted input and personal data.',
    refs: [TRIGGERS, spec('7.8', '78-separation-of-duties'), spec('10.3', '103-event-envelope')],
  },

  // ---------------------------------------------------------------- AEP-0025 (PR #24)
  {
    id: 'state-declared', chapter: 'state', title: 'State is declared in the manifest',
    left: { check: 'v2', code: `apiVersion: ${V2}
kind: Workflow
metadata:
  name: daily-digest
spec:
  version: 0.1.0
  owner:
    team: support
  classification: internal
  triggers:
    - type: schedule
      cron: "0 6 * * *"
  agents:
    - id: triage
      model:
        provider: example-provider
        name: example-model
  workflow:
    - id: diff
      type: command
      image: registry.example.com/tools:1.0.0
      command: python3 /opt/diff.py
# remembers seen items in a runtime volume,
# invisible in the manifest` },
    right: { code: `apiVersion: ${V2}
kind: Workflow
metadata:
  name: daily-digest
spec:
  version: 0.1.0
  owner:
    team: support
  classification: internal
  triggers:
    - type: schedule
      cron: "0 6 * * *"
  state:
    - name: seen-items
      retention: 180d
      maxSize: 64Mi
    - name: preferences
      access: read
  agents:
    - id: triage
      model:
        provider: example-provider
        name: example-model
  workflow:
    - id: diff
      type: command
      image: registry.example.com/tools:1.0.0
      command: python3 /opt/diff.py "$AWP_STATE_DIR/seen-items"` },
    what: '`spec.state` lists stores with `name`, `access` (`read` or `readWrite`), `classification`, `retention` and `maxSize`. Command steps see them as `$AWP_STATE_DIR/<name>`, agent steps only through granted tools. Undeclared stores are never exposed; writes are atomic.',
    why: 'Today state lives in a runtime volume that reviewers cannot see, without data class or retention (G03).',
    refs: [STATE],
  },
  {
    id: 'state-shared', chapter: 'state', title: 'Two workflows of one owner share a store',
    left: { check: 'v2', code: `apiVersion: ${V2}
kind: Workflow
metadata:
  name: chat-assistant
spec:
  version: 0.1.0
  owner:
    team: support
  classification: internal
  triggers:
    - type: manual
  agents:
    - id: triage
      model:
        provider: example-provider
        name: example-model
  workflow:
    - id: answer
      agent: triage
      task: Answer and remember preferences.
# cannot see what daily-digest stored` },
    right: { code: `apiVersion: ${V2}
kind: Workflow
metadata:
  name: chat-assistant
spec:
  version: 0.1.0
  owner:
    team: support
  classification: internal
  triggers:
    - type: manual
  state:                    # same owner and namespace
    - name: preferences     # as daily-digest: shared
      access: readWrite
    - name: seen-items
      access: read
  agents:
    - id: triage
      model:
        provider: example-provider
        name: example-model
  workflow:
    - id: answer
      agent: triage
      task: Answer and remember preferences.` },
    what: 'Workflows with the same `spec.owner` in the same namespace that declare a store of the same name share it; the strictest classification applies to every reader; a store of another owner can never be reached. Content read from state is untrusted input (spec 12).',
    why: 'A daily run writes what it found and a chat run reads it and writes preferences (G53); a message stored by one run must not become an instruction for the next (G58).',
    refs: [STATE, spec('12', '12-security-considerations')],
  },

  // ---------------------------------------------------------------- AEP-0004 (planned)
  {
    id: 'event-root', chapter: 'event-data', title: 'Event data under its own root',
    left: { check: 'v2-invalid', expect: 'schema.pattern', label: 'v1alpha3 draft: rejected (no event root in 3.9)', code: `apiVersion: ${V2}
kind: Workflow
metadata:
  name: support-chat
spec:
  version: 0.1.0
  owner:
    team: support
  classification: internal
  triggers:
    - type: event
      source: chat.example.com
      eventType: com.example.chat.message.posted
  agents:
    - id: triage
      model:
        provider: example-provider
        name: example-model
  workflow:
    - id: answer
      agent: triage
      task: "Answer: \${{ event.data.message }}"` },
    right: { code: `apiVersion: ${V2}
kind: Workflow
metadata:
  name: support-chat
spec:
  version: 0.1.0
  owner:
    team: support
  classification: internal
  triggers:
    - type: event
      source: chat.example.com
      eventType: com.example.chat.message.posted
      classification: internal
      dataSchema:
        type: object
        required: [message]
        properties:
          message: { type: string, maxLength: 4000 }
  agents:
    - id: triage
      model:
        provider: example-provider
        name: example-model
  workflow:
    - id: answer
      agent: triage
      task: "Answer: \${{ event.data.message }}"
# no mapping to inputs (D7)`, label: 'Planned: AEP-0004 applied (sketch)' },
    what: '`${{ event.id }}`, `event.source`, `event.type`, `event.time` and `event.data.<path>` become a reference root. `dataSchema` is validated before the run starts, and `classification` enters every operation that reads the data. A workflow without an event trigger may not use `event.*`.',
    why: 'D7 decided an own root instead of mapping events to inputs, which hides that a value comes from an external sender (G41). AEP-0004 is in Review for `v1alpha2` and not applied to v1alpha3 yet.',
    refs: [EVENTS, spec('3.9', '39-expressions')],
  },
  {
    id: 'event-replay', chapter: 'event-data', title: 'A run that carries its event',
    left: { check: 'v2', code: `apiVersion: ${V2}
kind: WorkflowRun
metadata:
  generateName: support-chat-
spec:
  workflowRef:
    name: support-chat
# A client-created run is always a manual start
# (10.8): it cannot carry an event, so an
# event-only workflow cannot be tested.` },
    right: { code: `apiVersion: ${V2}
kind: WorkflowRun
metadata:
  generateName: support-chat-replay-
spec:
  workflowRef:
    name: support-chat
  event:                  # set by a trusted ingress,
    origin: replay        # or supplied for a test
    source: chat.example.com
    type: com.example.chat.message.posted
    id: msg-4711
    data:
      message: My order has not arrived.`, label: 'Planned: AEP-0019 amendment (sketch)' },
    what: 'The run object carries the event: `origin: ingress` when a trusted router creates it, `origin: replay` for a test or replay, where the actor is the creator and the data is validated against `dataSchema`. Field names are a sketch of the planned amendment.',
    why: 'Event runs created by an external router fit neither role of spec 10.8 (G48), and event-only workflows cannot be tested conformingly (G57). This is open question 1 of AEP-0019.',
    refs: [{ label: 'AEP-0019', href: `${SPEC}/aep/0019-workflow-run-and-status.md` }, EVENTS, spec('10.8', '108-kind-workflowrun')],
  },
  // ---------------------------------------------------------------- AEP-0023 additions (PR #25)
  {
    id: 'isolation-class', chapter: 'isolation', title: 'An agent can require stronger isolation than a container',
    left: { check: 'v2', code: `apiVersion: ${V2}
kind: Agent
metadata:
  name: repo-fixer
spec:
  version: 0.1.0
  owner:
    team: appsec
  classification: internal
  model:
    provider: example-provider
    name: example-model
  instructions: Fix the failing tests in the repository.
  permissions:
    default: deny
    tools:
      shell.execute:
        allow: true
# Where the commands run (container, gVisor, a VM)
# is decided in a runtime binding that reviewers
# never see.` },
    right: { code: `apiVersion: ${V2}
kind: Agent
metadata:
  name: repo-fixer
spec:
  version: 0.1.0
  owner:
    team: appsec
  classification: internal
  isolation: sandbox        # process < container < sandbox < vm
  model:
    provider: example-provider
    name: example-model
  instructions: Fix the failing tests in the repository.
  permissions:
    default: deny
    tools:
      shell.execute:
        allow: true
# A runtime with containers only rejects this agent
# before any step runs. Which mechanism provides
# "sandbox" (gVisor, Kata) is platform configuration.` },
    what: '`isolation` is a minimum. The runtime runs the agent with at least that class or rejects the manifest; a platform ceiling may require a higher minimum, and the stricter one applies. The conformance statement lists which classes a runtime provides and by which mechanism.',
    why: 'An agent that runs `make` or a test runner on an untrusted repository executes whatever the repository contains; a command allow list does not stop that. In the proof of concept the runtime class sat in a sandbox profile of the binding, invisible in the reviewed manifest (G67).',
    refs: [ISOLATION, spec('5.4', '54-agents')],
  },
  {
    id: 'tool-credentials', chapter: 'isolation', profiles: 'core,mcp', title: 'Tool server credentials stay out of steps',
    left: { check: 'v2', profiles: 'core,mcp', code: `apiVersion: ${V2}
kind: Workflow
metadata:
  name: code-scan
spec:
  version: 0.1.0
  owner:
    team: appsec
  classification: internal
  secrets:
    - name: SCANNER_TOKEN
      source: kubernetes
      scope: [scanner]
  mcpServers:
    - name: scanner
      transport: streamable-http
      url: https://mcp.example.com/scanner
      auth:
        secretRef: SCANNER_TOKEN
  agents:
    - id: reviewer
      model:
        provider: example-provider
        name: example-model
      tools:
        - type: mcp
          server: scanner
          tools: [scan]
  workflow:
    - id: scan
      agent: reviewer
      task: Scan the repository.` },
    right: { code: `apiVersion: ${V2}
kind: Workflow
metadata:
  name: code-scan
spec:
  version: 0.1.0
  owner:
    team: appsec
  classification: internal
  mcpServers:
    - name: scanner             # resolved by the runtime;
      transport: streamable-http  # no auth.secretRef needed
      url: https://mcp.example.com/scanner
  agents:
    - id: reviewer
      model:
        provider: example-provider
        name: example-model
      tools:
        - type: mcp
          server: scanner
          tools: [scan]
  workflow:
    - id: scan
      agent: reviewer
      task: Scan the repository.
# Under security: the step reaches "scanner" through a
# component outside the step that adds the credential,
# authenticates the step with a ticket for this attempt
# and enforces the tool permissions.` },
    what: 'The same rule as for model credentials: under the `security` profile a tool server credential MUST NOT be visible to the step. `auth` may be satisfied by the runtime, and the component that holds the credential also enforces which tools are listed and called.',
    why: 'When the MCP client is a coding agent inside the step, `auth.secretRef` hands the token to the agent and every command it runs (G69). The proof of concept routes MCP through a gateway with a session or step ticket; shown with a static analysis server.',
    refs: [ISOLATION, spec('5.5.1', '551-mcp-servers'), spec('7.9', '79-secrets')],
  },
  {
    id: 'approval-authority', chapter: 'isolation', title: 'Who may approve: outside the execution environment',
    left: { check: null, lang: 'text', label: 'Spec 7.6 (v1alpha3 draft)', code: `Approvals gate actions or steps; approvers
are people matched by role or user.

(Nothing says where the component runs that
asks for and records an approval.)` },
    right: { lang: 'text', code: `AEP-0023 (proposed), under security:

- Approvals and confirmations are decided
  OUTSIDE the execution environment, from an
  authenticated identity, over a channel the
  environment cannot reach.
- Nothing that carries a decision is readable
  or writable inside.
- What leaves the environment (model calls,
  tool servers, network, push, decisions) is
  enforced outside. What stays inside (local
  commands, files) is bounded by the isolation
  class; an engine's own permission system is
  only an extra check.` },
    what: 'Applies to approvals and to confirmations of single actions in interactive sessions (AEP-0026). The rule is limited to what crosses the boundary of the execution environment, because only that can be enforced from outside; how to build the deciding component is implementer guidance.',
    why: 'Shown in the proof of concept: the coding agent and its commands ran under one user ID; a command read the agent\'s local server password from `/proc`, sent a prompt in autonomous mode and answered every permission request itself. It failed only after decisions moved to a separate container with signed grants; through the console the same command asked once and ran after "allow once" (G64).',
    refs: [ISOLATION, spec('7.6', '76-human-approval'), spec('7.8', '78-separation-of-duties')],
  },
  {
    id: 'ceilings', chapter: 'isolation', title: 'Ceilings reject, budgets cap',
    left: { check: null, lang: 'text', label: 'AEP-0023 in #19', code: `7.5.6: the effective network is the
intersection of the manifest and the ceiling;
reject if the ceiling is narrower.

(Silent on ceilings for models, tool servers,
autonomy, isolation and cost.)` },
    right: { lang: 'text', code: `AEP-0023 section 7.5.7 (proposed):

Platform ceiling (tenant)    Manifest asks     Result
models: [small, large]       model: huge       rejected
mcpServers: [scanner]        server: tickets   rejected
autonomy up to ask           auto              rejected*
platform offers container    isolation: vm     rejected
platform requires sandbox    isolation:        runs in sandbox
                               container       (minimum met)
maxCostUsd: 5                maxCostUsd: 20    rejected
maxCostUsd: 5                (none)            rejected

* autonomy is a level the person picks
  (AEP-0026); above the agent's maxAutonomy or
  the ceiling it is rejected.` },
    what: 'One rule: a ceiling never changes a manifest. Anything above it is rejected with `ceilingExceeded`, budgets included, and under a budget ceiling the manifest must declare the limit. A stronger isolation class than required is no deviation. Spec 5.7 ("runtimes MAY enforce stricter limits") is amended accordingly.',
    why: 'The proof of concept rejected models, hosts and MCP servers outside the tenant ceiling but capped cost, so a run could differ from the reviewed manifest (G68). Rejecting keeps the reviewed manifest the truth.',
    refs: [ISOLATION],
  },

  // ---------------------------------------------------------------- AEP-0026 (PR #26)
  {
    id: 'session-opt-in', chapter: 'sessions', title: 'An agent opts in to interactive use',
    left: { check: 'v2', code: `apiVersion: ${V2}
kind: Agent
metadata:
  name: security-reviewer
spec:
  version: 0.3.0
  owner:
    team: appsec
  classification: internal
  model:
    provider: example-provider
    name: example-model
  permissions:
    default: deny
    tools:
      shell.execute:
        allow: true
# Spec 6: "Runtimes MAY offer a way to run a single
# agent; they MUST then treat it as a workflow with
# one agent step." No way to say whether the agent
# may be used interactively, or how autonomously.` },
    right: { code: `apiVersion: ${V2}
kind: Agent
metadata:
  name: security-reviewer
spec:
  version: 0.3.0
  owner:
    team: appsec
  classification: internal
  model:
    provider: example-provider
    name: example-model
  sessions:                  # absent: no AgentSession
    maxAutonomy: ask         # readOnly | ask | auto
    models:                  # alternatives a session may pick
      - provider: example-provider
        name: example-model-large
  permissions:
    default: deny
    tools:
      shell.execute:
        allow: true` },
    what: 'Interactive use needs the author\'s opt-in. A level above `maxAutonomy` (or above the platform ceiling) is rejected; `models` lists the only alternatives to `model`. Time limits for idle sessions are an open question.',
    why: 'In the proof of concept the binding, not the manifest, decided whether autonomous mode existed for an agent, so a platform could grant autonomy the author never intended (G62, G63, G82).',
    refs: [SESSION, spec('6', '6-kind-agent')],
  },
  {
    id: 'session-object', chapter: 'sessions', title: 'AgentSession next to WorkflowRun',
    left: { check: null, label: 'Workaround today: a one-step workflow', code: `apiVersion: ${V2}
kind: WorkflowRun
metadata:
  generateName: security-review-
  namespace: team-a
spec:
  workflowRef:
    name: security-reviewer-as-workflow
  inputs:
    prompt: Review the repository for injection flaws.
# A run has one task and ends. No further prompts,
# no pause, no confirmation of single calls, no
# autonomy level, no choice of model or tool sources.` },
    right: { code: `apiVersion: ${V2}
kind: AgentSession
metadata:
  generateName: security-review-
  namespace: team-a
spec:
  agentRef:
    name: security-reviewer
    version: 0.3.0
  autonomy: ask                # above maxAutonomy: rejected
  model:                       # model or one of sessions.models
    provider: example-provider
    name: example-model-large
  toolSources: [code-scanner]  # narrow, never widen
  initialPrompt: Review the repository for injection flaws.
status:
  phase: waiting               # a confirmation is pending
  autonomy: ask
  usage: {costUsd: "0.54", modelCalls: 9}` },
    what: 'One interactive execution of an `Agent`, one execution id for its whole life. The creator controls it; others only if the runtime documents it. Permissions, the budget (summed across pauses) and audit apply to the whole session. Status never contains prompts, answers or tool arguments. Events, history and governance without a workflow are open questions.',
    why: 'A session has no task and no outputs, runs for hours, pauses when idle and resumes. The proof of concept built its own session object; another runtime would build a different one (G62). Spec fields under other names ran on the test installation with real models.',
    refs: [SESSION, spec('10.8', '108-kind-workflowrun')],
  },
  {
    id: 'autonomy', chapter: 'sessions', title: 'Three autonomy levels, and what is still open',
    left: { check: null, lang: 'text', label: 'v1alpha3 draft', code: `Permissions: allow or deny.

Human involvement: approval steps and policies
with requireApproval (7.6), humanInput (5.8).

Nothing for "ask before each call" or
"run on your own" during interactive work.` },
    right: { lang: 'text', code: `AEP-0026 (proposed):

readOnly  changing actions denied,
          other allowed actions ask first
ask       every allowed action asks first
auto      allowed actions run without asking

Permissions decide first: no level allows a
denied action. Confirmations come from an
authenticated person, decided outside the
execution environment (AEP-0023).

Open questions:
- confirm: always | never per permission entry
  ("a push always asks")
- a grant for the rest of the session
- governance (audit, dataPolicy) without a
  workflow` },
    what: 'Three levels and the rule that permissions decide first are the proposal; everything finer is deliberately an open question until a second runtime has experience with it.',
    why: 'The proof of concept has modes `plan`, `ask` and `auto` and confirms calls through a console (G63). Per-action confirmation and session-wide grants raised new questions in review, so they stay open instead of becoming rules.',
    refs: [SESSION, spec('7.5', '75-tool-governance-permissions')],
  },


  // ---------------------------------------------------------------- AEP-0027 (PR #26)
  {
    id: 'engine-field', chapter: 'engine', title: 'A coding agent as the engine of an agent step',
    left: { check: 'v2', code: `apiVersion: ${V2}
kind: Workflow
metadata:
  name: security-scan
spec:
  version: 0.1.0
  owner:
    team: appsec
  classification: internal
  agents:
    - id: scanner
      model:
        provider: example-provider
        name: example-model
      extensions:
        x-example-engine:
          type: opencode
          repositories:
            - url: https://git.example.com/app.git
  workflow:
    - id: scan
      agent: scanner
      task: Scan the repository and report the findings.
# A runtime that ignores the extension runs its own
# loop with other tools and still reports success.` },
    right: { code: `apiVersion: ${V2}
kind: Workflow
metadata:
  name: security-scan
spec:
  version: 0.1.0
  owner:
    team: appsec
  classification: internal
  agents:
    - id: scanner
      isolation: sandbox
      engine:
        type: example.com/coding-agent   # unknown type: reject
        workspace:
          repositories:
            - url: https://git.example.com/app.git
              ref: main
              path: app
          trustRepositoryConfig: []   # default: no AGENTS.md,
                                      # skills, commands, toolchain env
      model:
        provider: example-provider
        name: example-model
  workflow:
    - id: scan
      agent: scanner
      task: Scan the repository and report the findings.` },
    what: 'Permissions, budgets and audit stay in force; subagents share budget and permissions; model calls are metered outside the engine. What leaves the sandbox is enforced outside, what stays inside is bounded by the isolation class. Clone credentials stay out of the engine. Repository configuration (instruction files, skills, commands, tool manager environment) is not loaded unless listed.',
    why: 'Coding agents bring their own tool loop, and the proof of concept used an extension field for it (G65). Repositories bring instructions and code that run at start, before any permission applies (G81). The engine ran a scan workflow on the test installation, started by hand and by a CloudEvent.',
    refs: [ENGINE, spec('5.4', '54-agents'), spec('12', '12-security-considerations')],
  },
  {
    id: 'engine-outputs', chapter: 'engine', title: 'Open question: engine steps with typed outputs and repositories from events',
    left: { check: null, label: 'Proof of concept today', code: `workflow:
  - id: scan
    agent: scanner             # engine step
    task: Scan and report.
    outputs:
      - name: summary          # only summary and diff
      - name: critical         # rejected by validation:
                               # the engine cannot fill it
# repositories are fixed in the manifest, so a push
# event cannot say which repository to scan.` },
    right: { label: 'Sketch for open questions 1 and 2 of AEP-0027', code: `triggers:
  - type: event
    eventType: com.example.security-scan.requested
agents:
  - id: scanner
    engine:
      type: opencode
      workspace:
        repositories:
          - url: \${{ event.data.repository }}   # AEP-0004
            ref: \${{ event.data.ref }}
workflow:
  - id: scan
    agent: scanner
    task: Scan and report. Do not change files.
    outputs:
      - name: summary
      - name: critical
        type: integer          # AEP-0003, filled through
      - name: high             # complete_step (AEP-0018)
        type: integer
  - id: escalate
    if: \${{ steps.scan.outputs.critical > 0 }}   # AEP-0001
    dependsOn: [scan]
    agent: notifier
    task: Open a ticket.` },
    what: 'Not a rule yet: AEP-0027 keeps repositories fixed and leaves outputs open. The sketch shows what answering both open questions would allow. A repository URL from an event needs a clone credential bound to a host or URL pattern, otherwise a sender can redirect it.',
    why: 'In the proof of concept a step with `critical` and `high` was rejected and the repository was fixed, so the following step could not branch on findings (G66).',
    refs: [ENGINE, aep('0018', 'step-outputs'), aep('0003', 'typed-handoffs'), aep('0001', 'conditional-steps')],
  },

  // ---------------------------------------------------------------- amendments (PR #26)
  {
    id: 'mcp-prompts', chapter: 'amendments', title: 'MCP prompts and resources: allow lists, default none',
    left: { check: null, label: 'AEP-0007 on main', code: `catalog:
  tools:
    scan:
      access: read
      definitionDigest: sha256:3f1c...
  resources:                 # only if listed: then
    - uriTemplate: rules://{id}  # other URIs are denied;
                             # without the list?
# Open question 3: should a catalog list server
# prompts? Sampling and roots requests of a server
# are not covered.` },
    right: { code: `catalog:
  tools:
    scan:
      access: read
      definitionDigest: sha256:3f1c...
  resources:                 # absent: no resource readable
    - uriTemplate: rules://{id}
      classification: public
  prompts:                   # absent: no prompt offered
    security-check:
      definitionDigest: sha256:9a07...
# rule 9: prompts/list filtered, prompts/get of
#   anything else denied; prompt content is untrusted
# rule 7: resources.read and prompts.get are
#   reserved tool names
# rule 10: sampling and roots always declined,
#   elicitation declined without humanInput` },
    what: 'Prompts and resources are allow lists with default none; the runtime filters the list operations and refuses everything else. A server prompt is untrusted content of the server operator, not a `Prompt` manifest. Sampling and roots requests are declined until someone needs them (open question). The resolution order of servers is an open question too.',
    why: 'A coding agent shows every server prompt as a command, and a server can ask the client for model calls (sampling) or local paths (roots). The proof of concept filters all of this at its MCP gateway; shown with a server whose two extra tools are neither listed nor callable (G70 to G72).',
    refs: [MCP],
  },
  {
    id: 'shell-resources', chapter: 'amendments', title: 'What a resource of shell.execute is',
    left: { check: 'v2', code: `apiVersion: ${V2}
kind: Agent
metadata:
  name: repo-helper
spec:
  version: 0.1.0
  owner:
    team: appsec
  model:
    provider: example-provider
    name: example-model
  permissions:
    default: deny
    tools:
      shell.execute:
        allow: true
        resources: ["git *", "ls *", "echo *"]
# 7.5.2: "The runtime MUST document how it derives
# the target resource of a call." For a shell line?` },
    right: { lang: 'text', code: `AEP-0002 section 7.5.7 (proposed), same manifest:

echo hello              allowed  (echo *)
git --version           allowed  (git *)
ls -la | wc -l          denied   (wc not listed)
echo a; id              denied   (id not listed)
echo $(id)              denied   (substitution:
                                  cannot be split)
FOO=1 git status        denied   (leading assignment)
curl https://x.example  denied

Each simple command must match; lines that cannot
be split are denied. An allow list does not limit
what an allowed program runs (make, npm test).

Rules on well-known actions apply to shell
commands only through a mapping:

actionGroups:
  git.push:
    - action: shell.execute
      resources: ["git push*"]` },
    what: 'The resources of a command line are its simple commands; every one must match a glob entry. Substitutions, subshells, compound commands and leading assignments are denied. An `actionGroups` entry `{action, resources}` maps shell commands to a well-known action, so that rules on `git.push` also apply to `git push` in a shell.',
    why: 'Shown in the proof of concept with exactly this list: `echo` and `git --version` ran, `curl`, `echo a; id` and `echo $(id)` were refused with a reason the model sees (G74).',
    refs: [CONSTRAINTS, spec('7.5', '75-tool-governance-permissions')],
  },
  {
    id: 'prompt-task', chapter: 'amendments', title: 'A Prompt as a task of a session',
    left: { check: null, label: 'AEP-0005 on main', code: `apiVersion: ${V2}
kind: Prompt
metadata:
  name: extraction-instructions
spec:
  version: 1.0.0
  role: system
  template: Extract {{ fields }} from the document.
# Only for promptRef of instructions; nothing for a
# library of requests people start in a session.` },
    right: { code: `apiVersion: ${V2}
kind: Prompt
metadata:
  name: security-review
spec:
  version: 1.0.0
  role: user                 # offered as a task in a session
  variables:
    - name: focus
      type: string
  template: Review the repository for {{ focus }}.
    Report findings with severity and file.
# Library fields (title, which agents it fits, a
# suggested level) are an open question.` },
    what: 'A `Prompt` with `role: user` can be offered as a reusable task of an interactive execution. It is plain user input: it runs with the permissions, budget and level of the session and grants nothing.',
    why: 'People repeat the same requests (a security review, writing tests). The proof of concept offers a prompt library as commands of the coding agent, with tenant entries overriding platform entries (G75).',
    refs: [PROMPT],
  },
  {
    id: 'audit-origin', chapter: 'amendments', title: 'Where an audit event comes from',
    left: { check: null, lang: 'json', label: 'Event envelope (spec 10.3)', code: `{
  "type": "tool.called",
  "executionId": "awp-exec-01JD8Z...",
  "actor": {"type": "agent", "id": "reviewer"},
  "data": {"tool": "scanner.scan"}
}
// Recorded by the engine inside the sandbox, the
// UI, or a gateway outside? The event cannot say.` },
    right: { lang: 'json', code: `{
  "type": "tool.called",
  "executionId": "awp-exec-01JD8Z...",
  "actor": {"type": "agent", "id": "reviewer"},
  "origin": "runtime",
  "data": {
    "tool": "scanner.scan",
    "argumentsSize": 4211,
    "argumentsDigest": "sha256:7c2e..."
  }
}
// Under security, events about what leaves the
// execution environment (model calls, tool server
// calls, confirmations) come from outside it
// (origin runtime). The outcome of a shell command
// can only be reported from inside.` },
    what: 'Every event carries `origin` (`runtime` or `executionEnvironment`). Events about what crosses the boundary must come from outside; the runtime documents which events it cannot verify. Rules for tool arguments and session history are open questions.',
    why: 'The agent can influence what an engine inside the sandbox records. The proof of concept audits at its model and MCP gateways, with a hash chain per conversation, and joins the engine\'s events by tool call id. A scan tool received the whole source file as argument (G76, G77).',
    refs: [AUDIT, spec('10.3', '103-event-envelope')],
  },
  {
    id: 'agent-binding', chapter: 'amendments', title: 'Bindings for agents, and which objects stay with the runtime',
    left: { check: null, label: 'AEP-0021 B6 on main', code: `apiVersion: runtime.example.com/v1
kind: WorkflowBinding
spec:
  targetRefs:
    - group: awp.agenticworkflowprotocol.org
      kind: Workflow
      name: invoice-processing
  runnerImage: registry.example.com/runner@sha256:...
# Only workflows; an agent used on its own (a
# session) has nothing to bind to.` },
    right: { code: `apiVersion: runtime.example.com/v1
kind: AgentBinding
spec:
  targetRefs:
    - group: awp.agenticworkflowprotocol.org
      kind: Agent
      name: security-reviewer
  sandboxProfile: gvisor-small   # maps isolation: sandbox
  modelEndpoints: [eu-gateway]   # governance-relevant: operator
                                 # constraints apply (B6)
# Stays implementation-specific: bindings, tenants,
# sandbox profiles, gateways.
# Becomes or stays AWP: AgentSession (AEP-0026),
# WorkflowRun, Prompt, McpCatalog, ModelCatalog.` },
    what: 'A binding may target a `Workflow` or an `Agent`. For an agent inside a workflow, the workflow\'s binding applies. The rule for kinds from runtime feedback section 10: an object becomes an AWP kind if a reviewer governs it and it must mean the same on every runtime; it stays with the runtime if it says how a platform realises something.',
    why: 'The proof of concept needed nine custom resources; three map to AWP kinds, two split between an AWP catalog and runtime configuration, and four stay its own (question 11 of the runtime feedback).',
    refs: [EXT, { label: 'runtime-feedback.md section 10 (PR #24)', href: `${SPEC}/docs/runtime-feedback.md#10-from-interactive-sessions-and-a-coding-agent-engine` }],
  },
];
