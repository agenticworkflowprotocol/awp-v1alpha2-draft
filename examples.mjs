// Side-by-side examples: v1alpha1 (left) and the v1alpha3 draft (right), plus chapters for the
// proposals of spec pull request #19 and the planned AEP-0004 pull request (v1alpha3 left, proposal right).
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
const ISOLATION = { label: 'AEP-0023 (PR #19)', href: `${SPEC}/aep/0023-step-isolation.md` };
const TRIGGERS = { label: 'AEP-0024 (PR #19)', href: `${SPEC}/aep/0024-event-triggers.md` };
const STATE = { label: 'AEP-0025 (PR #19)', href: `${SPEC}/aep/0025-state.md` };
const EVENTS = { label: 'AEP-0004 (planned)', href: `${SPEC}/aep/0004-event-references.md` };

export const chapters = [
  { id: 'model', title: 'Document model', aep: KRM, intro: 'Every manifest becomes a valid Kubernetes resource and stays usable without Kubernetes. Most of this is a mechanical move, done by `awp-check.mjs migrate`.' },
  { id: 'schedule', title: 'Schedules', aep: SCHED, intro: 'What happens when a tick arrives while the previous execution still runs, and when ticks are missed.' },
  { id: 'input', title: 'Human input', aep: INPUT, intro: 'A workflow or an agent can ask a named person for an answer. Answers are never approvals.' },
  { id: 'outputs', title: 'Step outputs', aep: OUTPUTS, intro: 'How a step actually produces the values of its declared outputs, the largest portability gap found by the runtime proof of concept.' },
  { id: 'run', title: 'WorkflowRun and status', aep: RUN, intro: 'A new kind for one execution, and a status shape that existing Kubernetes tools understand.' },
  { id: 'pinning', title: 'Execution pinning', aep: PIN, intro: 'An execution keeps the manifests it started with, even when GitOps changes them halfway.' },
  { id: 'iteration', title: 'Step iteration', aep: ITER, intro: 'A bounded fan-out over a list known when the step becomes ready: accepted for `v1alpha2` (D19) and part of v1alpha3 as section 5.6.5, combined with the step output interface.' },
  { id: 'isolation', title: 'Step isolation (proposal)', aep: ISOLATION, proposal: 'pr19', intro: 'Proposed in spec pull request #19, not applied to the schema: a host syntax for `allowHosts`, the platform ceiling, enforce or reject, internal destinations and model credentials. Left is v1alpha3 today, right the proposal.' },
  { id: 'event-triggers', title: 'Event triggers with CloudEvents (proposal)', aep: TRIGGERS, proposal: 'pr19', intro: 'Proposed in spec pull request #19: CloudEvents as the event model, equality filters, duplicates, concurrency, rate limits and the actor behind an event. Left is v1alpha3 today, right the proposal.' },
  { id: 'state', title: 'State across executions (proposal)', aep: STATE, proposal: 'pr19', intro: 'Proposed in spec pull request #19: stores that survive executions, declared in the manifest with classification, retention and access mode. Left is v1alpha3 today, right the proposal.' },
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
  lede: '{{count}} examples of what changes in the Agentic Workflow Protocol, each with the old form on the left, the new form on the right, and the reason for the change: first what is in the v1alpha3 draft, then what pull request #19 proposes and what is planned.',
  notice: 'New to AWP? Start with <a href="index.html">how it fits together</a>. <strong>What is shown.</strong> The draft chapters compare <code>v1alpha1</code> with the <code>v1alpha3</code> draft: the Kubernetes resource model of pull request #16, merged as <code>v1alpha3</code> by decision D20 on top of <code>v1alpha2</code> (<code>v1alpha1</code> plus step iteration, D19). They were first written when that draft was called <code>v1alpha2</code>. The <strong>proposal</strong> chapters put <code>v1alpha3</code> today next to what spec pull request #19 proposes (AEP-0023 to AEP-0025), the <strong>planned</strong> chapter next to a sketch of the AEP-0004 pull request that has no text yet, and the <strong>concept</strong> chapter next to AEP-0021. Everything is a <strong>Draft</strong> under review; nothing is accepted except step iteration. All links and checks use the spec branch <code>preview/pr19-pr20</code> (main plus the open pull requests #20 and #19, not merged text). Snippets marked <span class="verified">valid</span> or <span class="verified">rejected by checker</span> were run through the reference checker there; proposals are marked <span class="unchecked">not checked</span>.',
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
      <a href="https://github.com/agenticworkflowprotocol/agenticworkflowprotocol.org/tree/preview/pr19-pr20">agenticworkflowprotocol.org</a>, branch <code>preview/pr19-pr20</code>.
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

  // ---------------------------------------------------------------- AEP-0023 (PR #19)
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
      allowHosts:
        - api.example.com
        - "*.cdn.example.com:443"   # subdomain wildcard, port
        - 10.20.0.0/16              # internal ticket system
  agents:
    - id: triage
      model:
        provider: example-provider
        name: example-model
  workflow:
    - id: run
      agent: triage
      task: Triage new tickets.` },
    what: 'An entry is a host name, a subdomain wildcard `*.domain` (not the domain itself), an address or a CIDR, each with an optional `:port`. A bare `*` or a `*` in another label is invalid. Names are matched before resolution, addresses after.',
    why: 'Today the forms are undefined (G49), so the same list means different things in different runtimes and cannot be translated into a proxy or network policy.',
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
      allowHosts:
        - api.example.com
  agents:
    - id: triage
      model:
        provider: example-provider
        name: example-model
  workflow:
    - id: run
      agent: triage
      task: Triage new tickets.` },
    what: 'Under the `security` profile, a manifest without `network.egress` gets `deny`. Outside it, the default stays `allow`.',
    why: 'Deny-by-default deployments and the intent of the security profile conflict with `egress: allow` as the default (G47). Authors add `egress: allow` or `allowHosts` where a step needs the network.',
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
    right: { check: null, lang: 'text', code: `# effective network = every permissions.network
#                     intersected with the ceiling
$ awp run support-triage
rejected before any step ran:
  permissions.network.allowHosts[2] (10.20.0.15)
  is not allowed by the platform ceiling
  for step type command
# (message format is a sketch; the AEP requires a
#  reason that names the rule and the step type)`, label: 'AEP-0023 proposal' },
    what: 'A platform may set a ceiling (per namespace, tenant or installation). The effective network of a step is the intersection of the manifest and the ceiling. If the runtime cannot enforce a rule for a step type, or the ceiling forbids a destination the manifest needs, it rejects before any step runs, and never runs with weaker rules.',
    why: 'An author cannot tell whether a reviewed manifest will run, and a runtime could silently ignore `allowHosts` (G10, G47, G51). Internal destinations (loopback, private, link-local, CGNAT) are denied after resolution under `security` unless manifest and ceiling both allow them (G50).',
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

  // ---------------------------------------------------------------- AEP-0024 (PR #19)
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

  // ---------------------------------------------------------------- AEP-0025 (PR #19)
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
];
