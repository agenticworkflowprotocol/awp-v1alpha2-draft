// Guide page (docs/index.html): how AWP v1alpha3 fits together, what the open spec pull requests add,
// what is still open, and how to adopt it.
// Worked examples use the panes of the other pages. `check` works as in examples.mjs:
//   'v2'          must be valid against v1alpha3 at SPEC_REF ('v2' means the current draft, as on the gaps page)
//   'v2-invalid'  must be rejected, with `expect` as the diagnostic code
//   absent        a proposal (pull request #23) or a planned change; never checked
// `profiles` on an example or a pane selects the profiles the checker supports (default core).

import { PREVIEW, PREVIEW_BRANCH, PREVIEW_REF, SPEC_REPO as REPO } from './spec-ref.mjs';

// The branch of spec pull request #23: the v1alpha3 draft on main (D20) plus the former pull
// requests #20 and #19 and the feedback from interactive sessions (spec-ref.mjs).
export const SPEC_REF = PREVIEW_REF;
const MAIN = PREVIEW;
const PR23 = `${REPO}/pull/23`;
const PR23_BRANCH = PREVIEW;

const spec = (section, anchor) => ({ label: `Spec ${section}`, href: `${MAIN}/spec/v1alpha3/README.md#${anchor}` });
const aep = (n, slug) => ({ label: `AEP-${n}`, href: `${MAIN}/aep/${n}-${slug}.md` });
const aep23 = (n, slug) => ({ label: `AEP-${n} (PR #23)`, href: `${PREVIEW}/aep/${n}-${slug}.md` });

const ISOLATION = aep23('0023', 'step-isolation');
const TRIGGERS = aep23('0024', 'event-triggers');
const STATE = aep23('0025', 'state');
const EVENTS = aep('0004', 'event-references');
const RUNAEP = aep('0019', 'workflow-run-and-status');
const SESSION = aep23('0026', 'interactive-execution');
const ENGINE = aep23('0027', 'agent-engine');
const FEEDBACK = { label: 'runtime-feedback.md (PR #23)', href: `${PR23_BRANCH}/docs/runtime-feedback.md` };
const CHECKER = { label: 'Reference checker', href: `${MAIN}/conformance/README.md` };

const V3 = 'awp.agenticworkflowprotocol.org/v1alpha3';
const DIGEST = 'sha256:162c964d9ab8c11b0b2014a92860d99384acfa28652e515cafa7d554e1c2e497';

// Status of a piece of AWP, used by the lifecycle, the tables and the badges.
export const STATUS = {
  v3: { label: 'in v1alpha3', cls: 'st-v3', title: 'In the v1alpha3 draft on main (Draft, not accepted)' },
  pr23: { label: 'PR #23', cls: 'st-pr', title: 'Proposed in spec pull request #23 (draft, not merged)' },
  planned: { label: 'planned', cls: 'st-planned', title: 'Planned pull request: apply AEP-0004 and amend AEP-0019 (not started, no draft text)' },
  platform: { label: 'platform only', cls: 'st-platform', title: 'Not AWP: how a runtime or platform does it is its own choice' },
};

export const page = {
  version: 'v1alpha3',
  file: 'index.html',
  title: 'AWP v1alpha3: How It Fits Together',
  description: 'Getting started with the Agentic Workflow Protocol v1alpha3 draft: the resources and how they relate, the lifecycle from manifest to finished run, worked examples, what the open spec pull requests add, what is still open, and how to adopt it.',
  h1: 'AWP v1alpha3: how it fits together',
  lede: 'The Agentic Workflow Protocol describes what an agentic workflow does, what it may do and how it is governed and audited. This page explains the current draft for readers who did not follow the discussion: which manifests you write, how they relate, what happens from applying a manifest to a finished run, what the open spec pull request #23 adds, and how to start as a workflow author or as a runtime implementer.',
  notice: '<strong>This site shows the open spec pull request #23, not merged text.</strong> Every spec and AEP link goes to the branch <a href="' + REPO + '/tree/' + PREVIEW_BRANCH + '"><code>' + PREVIEW_BRANCH + '</code></a> at <code>' + PREVIEW_REF + '</code>: main of the specification repository with pull request <a href="' + PR23 + '">#23</a> on top, as the spec will look once it is merged. #23 combines the former pull requests #20 (related work, D21) and #19 (runtime feedback G41 to G61, AEP-0023 to AEP-0025) and adds what a platform with interactive coding agent sessions found: G62 to G87, extensions of AEP-0023, two new AEPs (0026 interactive execution, 0027 agent engine) and amendments to existing AEPs. <strong>Status.</strong> <code>v1alpha3</code> is the current draft on main of the specification repository (decision D20: pull request #16 was merged as <code>v1alpha3</code>; <code>v1alpha2</code> is the step iteration draft of D19). Nothing in it is accepted except step iteration. Pull request #23 is an open draft, and its AEPs are Draft and not applied to the v1alpha3 text; a third pull request for event data (AEP-0004) is planned and has no text yet. Every piece below carries its status: <span class="st st-v3">in v1alpha3</span> <span class="st st-pr">PR #23</span> <span class="st st-planned">planned</span> <span class="st st-platform">platform only</span>. Manifests marked <span class="verified">valid</span> or <span class="verified">rejected by checker</span> were run through the reference checker at <code>' + SPEC_REF + '</code> (the schema is the same as on main); proposals are marked <span class="unchecked">not checked</span>.',
  footer: `Sources: the <a href="${MAIN}/spec/v1alpha3/README.md">v1alpha3 specification</a>, the <a href="${MAIN}/docs/decisions.md">decision log</a> and the AEPs on the branch <code>${PREVIEW_BRANCH}</code> (main plus pull request <a href="${PR23}">#23</a>), in <a href="${REPO}">agenticworkflowprotocol.org</a>. This page is generated from <a href="https://github.com/agenticworkflowprotocol/awp-v1alpha2-draft">awp-v1alpha2-draft</a>; corrections are welcome as issues or pull requests.`,
};

// ------------------------------------------------------------------ start here

export const start = [
  { title: 'Author', text: 'Write a `Workflow` (and optionally `Agent` and `Policy` manifests), validate it with the reference checker, pick the profiles. Read [the examples](#examples) and [the author checklist](#adopt).' },
  { title: 'Runtime implementer', text: 'Read [the lifecycle](#lifecycle) with its MUST rules, [what a Kubernetes runtime can map it to](#k8s-mapping) and [the implementer checklist](#adopt-runtime).' },
  { title: 'Reviewer', text: 'Read [what flowed in](#inflow) from pull request #23 and [what is still open](#open); details per gap are on the [gaps page](gaps.html).' },
];

// ------------------------------------------------------------------ resource map

// Nodes of the resource map. `cls`: kind (an AWP kind), proposal, platform, external, output.
// Coordinates per layout: wide (desktop) and tall (phone). The reference field sits in the target box,
// so edges need no labels.
export const resourceMap = {
  title: 'AWP v1alpha3 resources and their references',
  desc: 'A WorkflowRun references a Workflow; proposed in pull request 23, an AgentSession runs an Agent interactively. A Workflow references Agent and Policy manifests, MCP servers and remote agents, secrets by name and, proposed in pull request 23, state stores. Bindings of a runtime target a Workflow. Triggers create runs; runs emit audit events.',
  nodes: [
    { id: 'events', cls: 'platform', title: 'Trigger fires', sub: ['schedule tick, event,', 'or a person (manual)'] },
    { id: 'binding', cls: 'platform', title: 'Binding', sub: ['runtime-specific kind:', 'placement, images'] },
    { id: 'run', cls: 'kind', title: 'WorkflowRun', sub: ['one execution;', 'status by the runtime'] },
    { id: 'workflow', cls: 'kind', title: 'Workflow', sub: ['triggers, inputs,', 'agents, steps, budget,', 'permissions, secrets,', 'approval, policies'] },
    { id: 'audit', cls: 'output', title: 'Audit events', sub: ['workflow.*, tool.*,', 'approval.*, record'] },
    { id: 'agent', cls: 'kind', title: 'Agent', sub: ['via agents[].ref', '(name, version, digest)'] },
    { id: 'policy', cls: 'kind', title: 'Policy', sub: ['via policies.include', 'deny, requireApproval'] },
    { id: 'tools', cls: 'external', title: 'MCP servers, A2A', sub: ['via mcpServers, tools', 'and protocol: a2a'] },
    { id: 'secrets', cls: 'platform', title: 'Secret store', sub: ['via secrets[] by name;', 'no values in manifests'] },
    { id: 'state', cls: 'proposal', title: 'State store', sub: ['via spec.state', 'proposed: AEP-0025'] },
    { id: 'session', cls: 'proposal', title: 'AgentSession', sub: ['interactive execution', 'of an Agent; AEP-0026'] },
  ],
  edges: [
    { from: 'events', to: 'run' },
    { from: 'binding', to: 'workflow', cls: 'platform' },
    { from: 'run', to: 'workflow' },
    { from: 'run', to: 'audit' },
    { from: 'workflow', to: 'agent' },
    { from: 'workflow', to: 'policy' },
    { from: 'workflow', to: 'tools' },
    { from: 'workflow', to: 'secrets' },
    { from: 'workflow', to: 'state', cls: 'proposal' },
    { from: 'session', to: 'agent', cls: 'proposal' },
  ],
  layouts: {
    wide: {
      width: 1010, height: 560,
      at: {
        events: [30, 30, 220, 64], binding: [390, 30, 220, 64],
        run: [30, 220, 220, 72], workflow: [390, 196, 220, 120],
        audit: [30, 440, 220, 64], state: [390, 440, 220, 64],
        agent: [750, 50, 220, 64], policy: [750, 160, 220, 64], tools: [750, 270, 220, 64], secrets: [750, 380, 220, 64],
        session: [750, 476, 220, 64],
      },
      via: { 'session-agent': [[990, 508], [990, 82]] },
    },
    tall: {
      width: 380, height: 760,
      at: {
        events: [10, 10, 170, 64], binding: [200, 10, 170, 64],
        run: [10, 124, 170, 72], workflow: [200, 110, 170, 112],
        audit: [10, 246, 170, 64], session: [10, 340, 170, 72],
        agent: [210, 270, 160, 64], policy: [210, 364, 160, 64], tools: [210, 458, 160, 64], secrets: [210, 552, 160, 64], state: [210, 646, 160, 64],
      },
      // Edges from the workflow run along a bus left of the right column.
      via: {
        'workflow-agent': [[190, 222], [190, 302]], 'workflow-policy': [[190, 222], [190, 396]], 'workflow-tools': [[190, 222], [190, 490]],
        'workflow-secrets': [[190, 222], [190, 584]], 'workflow-state': [[190, 222], [190, 678]],
        'session-agent': [[195, 376], [195, 302]],
      },
    },
  },
};

export const legend = [
  { cls: 'kind', text: 'AWP kind in v1alpha3' },
  { cls: 'proposal', text: 'proposed (PR #23)' },
  { cls: 'platform', text: 'platform or runtime, not AWP' },
  { cls: 'external', text: 'external system, other protocol' },
  { cls: 'output', text: 'what an execution leaves behind' },
];

// Kind table: kind, who writes it, what it references, who reads it.
export const kinds = [
  { kind: '`Workflow`', status: 'v3', writer: 'The workflow author; the team in `spec.owner` is accountable.', refs: '`Agent` (`agents[].ref` with exact `version`, optional `digest`), `Policy` (`policies.include`), secrets by name, MCP servers, remote agents, container images.', reader: 'The runtime: validates, pins and executes it. Reviewers: the manifest is the reviewed unit (digest, signature).' },
  { kind: '`Agent`', status: 'v3', writer: 'An agent author or a platform team, published separately.', refs: 'Model, tools, MCP servers, secrets (which the workflow must also declare), `promptRef`.', reader: 'The runtime, when a workflow references it. Never executed on its own.' },
  { kind: '`Policy`', status: 'v3', writer: 'A governance or platform team.', refs: 'Nothing; rules on actions, data class, destination, model, actor. Only `deny` and `requireApproval`: policies restrict, permissions grant.', reader: 'The runtime decision algorithm (spec 8.4), under the governance profile.' },
  { kind: '`WorkflowRun`', status: 'v3', writer: 'A client for a manual start, or the runtime itself for schedule and event triggers.', refs: 'One `Workflow` by `name` in the same namespace; `version` and `digest` are assertions, not selectors.', reader: 'The runtime starts at most one execution from it and writes `status`; people and tools read the status.' },
  { kind: '`spec.state` (a field)', status: 'pr23', writer: 'The workflow author.', refs: 'Named stores, shared by workflows of the same owner in the same namespace.', reader: 'The runtime, which exposes only declared stores. AEP-0025 proposes `spec.state`; its own kind is the alternative under review.' },
  { kind: '`AgentSession`', status: 'pr23', writer: 'A person, through a console or `kubectl create`, for interactive use of an agent.', refs: 'One `Agent` by `name` (only if the agent opts in with `sessions`); a model and tool sources selected from what the agent allows.', reader: 'The runtime: one execution with pause and resume; autonomy capped by the agent\'s `maxAutonomy` and the platform ceiling. AEP-0026.' },
  { kind: 'Conformance statement', status: 'v3', writer: 'The runtime implementer (not a manifest).', refs: 'Profiles, limitations, limits, `executionObjects`.', reader: 'Operators and authors who choose a runtime.' },
  { kind: 'Binding, trigger object, tenant, sandbox profile', status: 'platform', writer: 'The operator, in a kind of the runtime.', refs: 'A `Workflow` or an `Agent` (`targetRefs` in the AEP-0021 concept); a sandbox profile is what `agents[].isolation` (AEP-0023) maps to.', reader: 'The runtime only. Placement, images, volumes, model endpoints, secret mapping.' },
];

export const notKinds = 'Not kinds: triggers, permissions and secrets are fields of a `Workflow` (secret values live in a store the runtime resolves); profiles are what a runtime claims in its conformance statement. `Prompt`, `Playbook` and `ModelCatalog` are proposed kinds (AEP-0005, AEP-0006, AEP-0008), not in v1alpha3.';

// ------------------------------------------------------------------ lifecycle

// Each step: what happens, with one entry per status. Text uses `code` and [links](#anchor).
export const lifecycle = [
  {
    title: 'Write the manifests',
    items: [
      { status: 'v3', text: 'A manifest has `apiVersion`, `kind`, `metadata` (name, labels) and `spec`; governance fields (`version`, `owner`, `classification`, `risk`) live in `spec`. Extension fields go into `extensions` objects with `x-` keys. `status` is reserved for the runtime.' },
    ],
    refs: [spec('3.2', '32-top-level-structure'), spec('4', '4-metadata-and-common-spec-fields')],
  },
  {
    title: 'Validate before you apply',
    items: [
      { status: 'v3', text: 'The reference checker validates YAML restrictions, the JSON Schema and the semantic rules for the profiles you name. Unknown fields and fields of a profile the runtime does not support are errors, not warnings (fail closed).' },
    ],
    refs: [spec('3.3', '33-unknown-fields-and-extensions'), CHECKER],
  },
  {
    title: 'Apply and admit',
    items: [
      { status: 'v3', text: 'The manifest goes into any object store: files, Git, a database, or a Kubernetes API server (one CRD per kind, `kubectl apply --validate=strict`). A runtime MUST validate every manifest it reads before acting on it and never changes `spec`. It reports the condition `Valid` and, once references are resolved, policies loaded and triggers registered, `Ready`.' },
      { status: 'platform', text: 'Validation on write (an admission webhook), the binding that places the workflow, and how triggers are registered.' },
    ],
    refs: [spec('3.10', '310-object-stores-and-kubernetes'), spec('3.11', '311-status')],
  },
  {
    title: 'A trigger fires',
    items: [
      { status: 'v3', text: '`manual`: a client creates a `WorkflowRun`; the actor is the authenticated creator, never a field. `schedule`: each tick starts at most one execution; `concurrencyPolicy` (default `forbid`) and `startingDeadline` decide about overlaps and missed ticks, and every tick that starts nothing emits `trigger.skipped`. `event`: `source`, `eventType` and a `filter` map; the runtime MUST verify the event source. The event data itself cannot reach the steps.' },
      { status: 'pr23', text: 'AEP-0024: events are CloudEvents 1.0; `filter` keys are attribute names or `data.<path>`, matched by equality, all must match; no second execution for the same `source` and `id` within at least 24 hours; `concurrencyPolicy` (default `allow`) and `rateLimit` on event triggers; the authenticated source is the actor, and a person attested by a trusted source becomes `attestedActor`.' },
      { status: 'planned', text: 'AEP-0004: event data under its own root `${{ event.* }}` with `dataSchema` and `classification`, never mapped to inputs (D7). Amendment of AEP-0019 open question 1: the run object carries the event, set by a trusted ingress or supplied for a test or replay (G48, G57).' },
    ],
    refs: [spec('5.2', '52-triggers'), spec('10.8', '108-kind-workflowrun'), TRIGGERS, EVENTS],
  },
  {
    title: 'Admit the execution',
    items: [
      { status: 'v3', text: 'Before anything runs: inputs are validated (a schedule uses defaults), every model is checked against `modelPolicy`, the environment must be allowed, and a `critical` risk level needs an approval of the execution itself. A run that cannot start gets `phase: rejected` and emits no `workflow.started`.' },
      { status: 'pr23', text: 'AEP-0023: if the platform ceiling does not allow a destination the manifest needs, or the runtime cannot enforce a network rule for a step type, the runtime rejects before any step runs.' },
    ],
    refs: [spec('5.3', '53-inputs'), spec('7.4', '74-model-governance'), spec('7.10', '710-environments'), ISOLATION],
  },
  {
    title: 'Pin what runs',
    items: [
      { status: 'v3', text: 'At start the runtime resolves the workflow, every referenced `Agent` and every applicable `Policy`, computes the digest and keeps exactly these versions until the end, also across retries and waits. Image tags are resolved to the digest of the image index; an image that cannot be resolved fails the execution before any step. `workflow.started` carries the digest. A GitOps sync during the run changes nothing.' },
    ],
    refs: [spec('10.1', '101-execution-identity'), aep('0020', 'execution-pinning')],
  },
  {
    title: 'Run the steps, isolated',
    items: [
      { status: 'v3', text: 'Steps form a graph through `dependsOn`; ready steps run up to `maxConcurrency` (default 1), `forEach` fans out over a bounded list. Command steps run in an isolated environment with `permissions.network` and `permissions.filesystem` applied; `command` is never expression-enabled, values come through `env`. Every action goes through the decision: permissions, then deny rules, then approval. Budgets are checked before every model call and action.' },
      { status: 'pr23', text: 'AEP-0023: one host syntax for `allowHosts` (name, `*.domain`, address, CIDR, optional port); effective network = manifest intersected with the platform ceiling; enforce or reject; under `security` `egress` defaults to `deny` and internal addresses are denied after resolution unless manifest and ceiling both allow them; model credentials are never visible to steps.' },
      { status: 'pr23', text: 'AEP-0023: tool server credentials stay outside the step like model keys; an agent can require a minimum `isolation` (`container`, `sandbox`, `vm`), met or rejected. AEP-0027: an agent step can run with a coding agent as `engine`; refused calls fail the step, subagents share budget and permissions, workspace configuration is off by default.' },
      { status: 'platform', text: 'The mechanism: an egress proxy, network policies, a sandbox, a model proxy, an MCP gateway.' },
    ],
    refs: [spec('5.6', '56-workflow-steps'), spec('7.5', '75-tool-governance-permissions'), spec('8.4', '84-decision-combination'), ISOLATION, ENGINE],
  },
  {
    title: 'Produce outputs',
    items: [
      { status: 'v3', text: 'A command step writes one file per declared output into `$AWP_OUTPUTS`; an agent step ends with `complete_step`. Every runtime accepts at least 256 KiB per output and 1 MiB per step and never truncates. Outputs of failed attempts are discarded. Each output is recorded as `artifact.created` with its digest.' },
    ],
    refs: [spec('5.6.4', '564-step-outputs'), aep('0018', 'step-outputs')],
  },
  {
    title: 'Ask people: input and approval',
    items: [
      { status: 'v3', text: 'Input steps and agents with `humanInput` ask named people and wait (`waitingForInput`, profile `interaction`). Approvals gate actions or steps (`waitingForApproval`, profile `governance`); only an authenticated human can approve, an answer is never an approval, and `separationOfDuties` keeps the initiator from approving.' },
      { status: 'pr23', text: 'AEP-0024: in a run started by an event, the attested person counts as the initiator, so the rule binds the person who wrote the message, not only the bridge.' },
      { status: 'pr23', text: 'AEP-0023 7.6.1: approvals and confirmations are decided outside the execution environment, from an authenticated person; nothing that carries a decision is readable inside. AEP-0026: in an interactive session the person confirms single actions (`allowOnce`, `allowForSession`, `refuse`); a confirmation is not an approval.' },
    ],
    refs: [spec('5.8', '58-human-input'), spec('7.6', '76-human-approval'), spec('7.8', '78-separation-of-duties'), TRIGGERS, SESSION],
  },
  {
    title: 'Keep state for the next run',
    items: [
      { status: 'pr23', text: 'AEP-0025: declared stores with classification, retention and access mode, shared only within one owner; atomic writes; command steps see `$AWP_STATE_DIR/<name>`. Spec 12: content kept between executions is untrusted input. Today state exists only invisibly in the runtime.' },
    ],
    refs: [STATE],
  },
  {
    title: 'Finish, report, audit',
    items: [
      { status: 'v3', text: 'The run ends `succeeded`, `failed` or `cancelled`; `WorkflowRun.status` shows phase, steps, usage and the conditions `Accepted` and `Succeeded`, never output values or secrets. Audit events (`workflow.*`, `tool.*`, `policy.*`, `approval.*`, `input.*`, `artifact.*`) are the record; under the audit profile they form a hash chain, and a reproducibility record lists everything the run depended on.' },
    ],
    refs: [spec('10.4', '104-event-types'), spec('10.7', '107-reproducibility-record'), spec('10.8', '108-kind-workflowrun')],
  },
];

// ------------------------------------------------------------------ worked examples

const scoutA = `apiVersion: ${V3}
kind: Workflow
metadata:
  name: concert-scout
spec:
  version: 0.1.0
  description: Checks venue programs every morning and reports new concerts.
  owner:
    team: music-fans
  classification: internal
  triggers:
    - type: manual
    - type: schedule
      cron: "0 7 * * *"
      timezone: Europe/Berlin
      concurrencyPolicy: forbid
      startingDeadline: 30m
  inputs:
    - name: venues
      type: array
      default:
        - https://venue.example.org/program
  budget:
    maxCostUsd: 0.5
    maxDuration: 30m
  agents:
    - id: curator
      model:
        provider: example-provider
        name: example-model
      instructions: Rate concerts against the taste in the task. End with complete_step.
  secrets:
    - name: WEBHOOK_URL
      source: secret-manager
      scope:
        - command
  permissions:
    default: deny
    tools:
      shell.execute:
        allow: true
  workflow:
    - id: fetch
      type: command
      image: registry.example.com/concert-scout/tools:1.4
      command: fetch-programs > "$AWP_OUTPUTS/events"
      env:
        VENUES: "\${{ inputs.venues }}"
      timeout: 5m
      retries: 1
      outputs:
        - name: events
          description: JSON array of concerts with artist, date and venue.
    - id: rate
      agent: curator
      task: "Keep the Metalcore and Hardcore concerts: \${{ steps.fetch.outputs.events }}"
      dependsOn:
        - fetch
      outputs:
        - name: digest
          description: Plain-text summary, one concert per line.
    - id: notify
      type: command
      image: registry.example.com/concert-scout/tools:1.4
      command: send-digest
      env:
        DIGEST: "\${{ steps.rate.outputs.digest }}"
      dependsOn:
        - rate`;

const scoutB = scoutA
  .replaceAll('tools:1.4', `tools:1.4@${DIGEST}`)
  .replace(`      shell.execute:
        allow: true
`, `      shell.execute:
        allow: true
    network:
      egress: deny
      allowHosts:
        - venue.example.org
        - hooks.example.net
`);

const scoutB19 = scoutB.replace(`      allowHosts:
        - venue.example.org
        - hooks.example.net
`, `      allowHosts:                 # syntax of AEP-0023 7.5.5
        - venue.example.org
        - "*.cdn.example.org:443"   # subdomain wildcard with port
        - hooks.example.net
        - 10.20.0.15              # internal ticket API: allowed only if
                                  # the platform ceiling allows it too
`);

const chatC = `apiVersion: ${V3}
kind: Workflow
metadata:
  name: concert-chat
spec:
  version: 0.1.0
  owner:
    team: music-fans
  classification: internal
  triggers:
    - type: event
      source: chat.example.com
      eventType: com.example.chat.message.posted
      filter:
        channel: concerts
  agents:
    - id: helper
      model:
        provider: example-provider
        name: example-model
      instructions: Answer questions about upcoming concerts in one short message.
  workflow:
    - id: answer
      agent: helper
      task: Answer the latest question in the concerts channel.
      outputs:
        - name: reply`;

const chatC19 = `apiVersion: ${V3}
kind: Workflow
metadata:
  name: concert-chat
spec:
  version: 0.2.0
  owner:
    team: music-fans
  classification: internal
  triggers:
    - type: event
      source: chat.example.com      # CloudEvents source: the producer
      eventType: com.example.chat.message.posted
      filter:                       # equality, all entries must match
        data.channel: concerts
        data.mentions: concert-scout
      concurrencyPolicy: allow      # PR #23: default for events
      rateLimit:                    # PR #23
        maxExecutions: 20
        period: 1h
      classification: internal     # planned: AEP-0004
      dataSchema:                   # planned: AEP-0004
        type: object
        required: [message, thread]
        properties:
          message: { type: string, maxLength: 4000 }
          thread: { type: string, maxLength: 64 }
  agents:
    - id: helper
      model:
        provider: example-provider
        name: example-model
      instructions: Answer questions about upcoming concerts in one short message.
  workflow:
    - id: answer
      agent: helper
      task: "Answer this message: \${{ event.data.message }}"  # planned
      outputs:
        - name: reply`;

const replayC = `apiVersion: ${V3}
kind: WorkflowRun
metadata:
  generateName: concert-chat-replay-
spec:
  workflowRef:
    name: concert-chat
  event:                    # planned: AEP-0019 amendment (G48, G57)
    origin: replay          # ingress: set by a trusted router
    source: chat.example.com
    type: com.example.chat.message.posted
    id: msg-4711
    data:
      channel: concerts
      mentions: concert-scout
      message: Any metalcore shows near Leipzig this month?
      thread: t-1234`;

const scoutD = `apiVersion: ${V3}
kind: Workflow
metadata:
  name: concert-scout
spec:
  version: 0.2.0
  owner:
    team: music-fans
  classification: internal
  triggers:
    - type: schedule
      cron: "0 7 * * *"
      timezone: Europe/Berlin
  agents:
    - id: curator
      model:
        provider: example-provider
        name: example-model
  workflow:
    - id: fetch
      type: command
      image: registry.example.com/concert-scout/tools:1.4
      command: fetch-programs > "$AWP_OUTPUTS/events"
      outputs:
        - name: events
    - id: diff
      type: command
      image: registry.example.com/concert-scout/tools:1.4
      command: only-new > "$AWP_OUTPUTS/new"
      env:
        EVENTS: "\${{ steps.fetch.outputs.events }}"
      dependsOn:
        - fetch
      outputs:
        - name: new
    - id: rate
      agent: curator
      task: "Rate these new concerts: \${{ steps.diff.outputs.new }}"
      dependsOn:
        - diff`;

const scoutD19 = scoutD
  .replace('  version: 0.2.0\n', '  version: 0.3.0\n')
  .replace(`  agents:
    - id: curator`, `  state:                          # PR #23: AEP-0025
    - name: seen-concerts
      retention: 180d
      maxSize: 64Mi
    - name: preferences
      access: read
  agents:
    - id: curator`)
  .replace('command: only-new > "$AWP_OUTPUTS/new"', 'command: only-new --seen "$AWP_STATE_DIR/seen-concerts" > "$AWP_OUTPUTS/new"');

const chatD19 = `apiVersion: ${V3}
kind: Workflow
metadata:
  name: concert-chat
spec:
  version: 0.3.0
  owner:
    team: music-fans                # same owner and namespace: shared
  classification: internal
  state:                            # PR #23: AEP-0025
    - name: preferences             # "no more jazz, please"
      access: readWrite
    - name: seen-concerts
      access: read
  # ... triggers, agents and steps as in example 3`;

const newsletterE = `apiVersion: ${V3}
kind: Workflow
metadata:
  name: concert-newsletter
spec:
  version: 0.1.0
  owner:
    team: music-fans
  classification: internal
  triggers:
    - type: manual
  approval:
    approvers:
      - role: newsletter-editor
    separationOfDuties:
      enabled: true
      rules:
        - initiatorCannotApprove: true
  agents:
    - id: writer
      model:
        provider: example-provider
        name: example-model
  permissions:
    default: deny
    tools:
      shell.execute:
        allow: true
  workflow:
    - id: draft
      agent: writer
      task: Write this week's concert newsletter from the venue programs.
      outputs:
        - name: text
    - id: review
      type: approval
      dependsOn:
        - draft
      approval:
        approvers:
          - role: newsletter-editor
        timeout: 24h
        message: "Send this newsletter? \${{ steps.draft.outputs.text }}"
    - id: send
      type: command
      image: registry.example.com/newsletter/send:2.0
      command: send-newsletter
      env:
        TEXT: "\${{ steps.draft.outputs.text }}"
      dependsOn:
        - review`;

const newsletterE19 = newsletterE
  .replace('  version: 0.1.0\n', '  version: 0.2.0\n')
  .replace(`  triggers:
    - type: manual
`, `  triggers:
    - type: event                   # "@newsletter send this week's issue"
      source: chat.example.com
      eventType: com.example.chat.message.posted
      filter:
        data.channel: newsletter
`)
  .replace('        - initiatorCannotApprove: true\n', '        - initiatorCannotApprove: true   # PR #23: binds the\n                                         # attested actor\n');

const policyE19 = `apiVersion: ${V3}
kind: Policy
metadata:
  name: chat-runs-need-a-person
spec:
  version: 0.1.0
  owner:
    team: music-fans
  rules:
    - id: require-attested-actor
      when:
        trigger.attested:           # PR #23: condition of AEP-0024,
          equals: "false"           # the operator shape is a sketch
      effect: deny`;

const run = `apiVersion: ${V3}
kind: WorkflowRun
metadata:
  generateName: concert-scout-
spec:
  workflowRef:
    name: concert-scout
    version: 0.1.0
  inputs:
    venues:
      - https://club.example.org/events`;

export const examples = [
  {
    id: 'ex-scheduled', title: 'A scheduled agent workflow with outputs',
    intro: 'Every morning a command step fetches venue programs, an agent keeps the concerts that match a taste, and a second command step sends the digest. This is plain v1alpha3 under the `core` profile.',
    left: { check: 'v2', label: 'v1alpha3: Workflow', code: scoutA },
    right: { check: 'v2', label: 'v1alpha3: a manual start as WorkflowRun', code: run },
    what: 'The schedule uses the input default (a schedule supplies no inputs); `forbid` skips a tick while the previous run still runs. The command writes its output as a file into `$AWP_OUTPUTS`, the agent ends with `complete_step`, and values reach the second command through `env`, never through the command text. The `WorkflowRun` on the right is a manual start: its creator is the actor, and `version` is an assertion that fails the request if the workflow has moved on.',
    why: 'Each line maps to one rule a runtime MUST enforce: tick handling (5.2), outputs (5.6.4), no expressions in `command` (5.6.2), `default: deny` with one explicit allow (7.5), budget checked before every model call (5.7), image tags resolved and pinned at start (10.1).',
    refs: [spec('5.2', '52-triggers'), spec('5.6.4', '564-step-outputs'), spec('10.8', '108-kind-workflowrun')],
  },
  {
    id: 'ex-network', title: 'The same workflow under the security profile', profiles: 'core,security',
    intro: 'The same workflow, reviewed for the `security` profile: images pinned by digest and outbound network limited to the venue site and the webhook. The right side shows what AEP-0023 adds.',
    left: { check: 'v2', label: 'v1alpha3 (core, security)', code: scoutB },
    right: { label: 'PR #23: AEP-0023 host syntax and internal destinations', code: scoutB19 },
    extra: [
      { check: 'v2-invalid', expect: 'security.image-not-pinned', label: 'Example 1 under security: rejected', lang: 'text', doc: scoutA, code: `$ node conformance/awp-check.mjs check --profiles core,security concert-scout.yaml
concert-scout.yaml:45:14 error security.image-not-pinned /spec/workflow/0/image
concert-scout.yaml:64:14 error security.image-not-pinned /spec/workflow/2/image
invalid` },
    ],
    what: 'v1alpha3 already has `egress: deny` with `allowHosts` and requires digests under `security`; a tag is rejected (bottom). AEP-0023 defines the entry forms, makes the effective network the intersection of the manifest and a platform ceiling, requires the runtime to enforce it or reject the run before any step, denies loopback, private, link-local and CGNAT addresses after resolution unless both manifest and ceiling allow them, and keeps model credentials out of every step.',
    why: 'Without a syntax the same list means different things on different runtimes; without enforce-or-reject a runtime may silently ignore `allowHosts` for command steps (G10, G51); an allowed host that resolves to a metadata address is an SSRF hole (G50). Under `security`, AEP-0023 also changes the default of `egress` to `deny`.',
    refs: [spec('7.5', '75-tool-governance-permissions'), spec('9.4', '94-dependencies'), ISOLATION],
  },
  {
    id: 'ex-event', title: 'An event-triggered workflow',
    intro: 'A chat message in the concerts channel starts a run that answers it. v1alpha3 can start the run but not pass the message; PR #23 defines the event model, the planned AEP-0004 pull request makes the data reachable.',
    left: { check: 'v2', label: 'v1alpha3: event trigger', code: chatC },
    right: { label: 'PR #23 (AEP-0024) and planned (AEP-0004)', code: chatC19 },
    extra: [
      { label: 'Planned: a replay run that carries its event (field names are a sketch)', code: replayC },
    ],
    what: 'AEP-0024: the event is a CloudEvent, `source` names its producer, `filter` matches attributes or `data.<path>` by equality, a second event with the same `source` and `id` within at least 24 hours starts nothing (`trigger.skipped`, reason `duplicate`, no manifest field), and `rateLimit` and `concurrencyPolicy` bound the load. The planned pull request adds `${{ event.data.* }}`, `dataSchema` and `classification` (AEP-0004) and lets the run object carry the event, from a trusted ingress or as a test or replay (bottom).',
    why: 'Without event data, runtimes map payloads to inputs, which hides that a value comes from an external sender (D7 rejects that). Brokers and webhooks redeliver, so duplicates are real; the reviewed filter stays the upper bound, and runtime filters may only narrow it. Conversation context is untrusted input.',
    refs: [spec('5.2', '52-triggers'), TRIGGERS, EVENTS, RUNAEP],
  },
  {
    id: 'ex-state', title: 'State between runs',
    intro: 'The scout should report each concert once. Today that memory is a file on a volume the runtime provides, invisible in the manifest. AEP-0025 declares it.',
    left: { check: 'v2', label: 'v1alpha3: state is not visible', code: scoutD },
    right: { label: 'PR #23: AEP-0025 declared stores', code: scoutD19 },
    extra: [
      { label: 'PR #23: a second workflow of the same owner shares the stores', code: chatD19 },
    ],
    what: 'Each store has a name, an access mode, a classification (default: the workflow\'s) and a retention. Command steps find it at `$AWP_STATE_DIR/<name>`; agent steps only through granted tools. Workflows of the same owner in the same namespace share a store of the same name, the strictest classification applies to every reader, writes are atomic, and the runtime states whether concurrent writers are serialised.',
    why: 'Reviewers cannot see that a workflow keeps data, which class it has or how long it is kept (G03, G53). Content written by one run is read by the next: PR #23 also changes spec 12, so state is untrusted input and a stored chat message cannot become a standing instruction (G58).',
    refs: [STATE, { label: 'Spec 12 (PR #23)', href: `${PR23_BRANCH}/spec/v1alpha3/README.md#12-security-considerations` }],
  },
  {
    id: 'ex-approval', title: 'Human approval and the initiator rule', profiles: 'core,governance',
    intro: 'A newsletter is drafted by an agent and sent only after an editor approves it, and the person who started the run cannot approve it. Approval belongs to the `governance` profile.',
    left: { check: 'v2', label: 'v1alpha3 (core, governance)', code: newsletterE },
    right: { label: 'PR #23: started by a chat message', code: newsletterE19 },
    extra: [
      { label: 'PR #23: a policy that requires an attested person', code: policyE19 },
      { check: 'v2-invalid', expect: 'profile.unsupported', profiles: 'core', label: 'Left side on a core-only runtime: rejected', lang: 'text', doc: newsletterE, code: `$ node conformance/awp-check.mjs check --profiles core concert-newsletter.yaml
concert-newsletter.yaml:13:5 error profile.unsupported /spec/approval
concert-newsletter.yaml:35:7 error profile.unsupported /spec/workflow/1
invalid` },
    ],
    what: 'The approval step pauses the run in `waitingForApproval` until an authenticated editor approves; an agent can never approve, and an answer to an input request never counts as one. `initiatorCannotApprove` rejects an approval by whoever created the `WorkflowRun`. With PR #23, a run started by a chat message has the bridge as actor and the attested author as `attestedActor`, and the rule binds that author; a policy can refuse event runs without an attested person.',
    why: 'In v1alpha3 every event start has the actor type `system`, so a person could start a run by message and approve its request (G44, raised to must). A runtime without the governance profile must reject the manifest instead of running it without approvals (bottom).',
    refs: [spec('7.6', '76-human-approval'), spec('7.8', '78-separation-of-duties'), spec('3.3', '33-unknown-fields-and-extensions'), TRIGGERS],
  },
];

// ------------------------------------------------------------------ what flowed in

export const inflow = [
  { pr: 23, change: 'Runtime feedback G41 to G61 (event triggers, the concept review, models) with target AEP and evidence; questions 8 and 9 recorded as decided on 2026-11-22. The file already exists on main with G01 to G40.', file: FEEDBACK, gaps: 'G41 to G61' },
  { pr: 23, change: 'AEP-0023 step isolation: `allowHosts` syntax, platform ceiling intersected with the manifest, enforce or reject, internal destinations after resolution, `egress: deny` default and model credentials outside steps under `security`.', file: ISOLATION, gaps: 'G10, G47, G49, G50, G51, G61' },
  { pr: 23, change: 'AEP-0024 event triggers with CloudEvents: equality filters on attributes and `data.<path>`, dedup by `source` and `id`, `concurrencyPolicy`, `rateLimit`, attested actor bound by the approval rules, conversation context as untrusted data, delivery guarantee in the conformance statement.', file: TRIGGERS, gaps: 'G42 to G46, G54, G56' },
  { pr: 23, change: 'AEP-0025 state: declared stores with classification, retention and access mode, sharing within one owner, atomic writes, state as untrusted input.', file: STATE, gaps: 'G03, G53, G58' },
  { pr: 23, change: 'AEP-0021 B4: `triggers[].source` is no domain-prefixed value space but the CloudEvents `source` of the producer.', file: { label: 'AEP-0021 (PR #23)', href: `${PR23_BRANCH}/aep/0021-extension-model.md` }, gaps: 'G52, G54' },
  { pr: 23, change: 'Spec 12: content kept between executions (state) is untrusted input. The only change to the v1alpha3 text in this pull request.', file: { label: 'Spec 12 (PR #23)', href: `${PR23_BRANCH}/spec/v1alpha3/README.md#12-security-considerations` }, gaps: 'G58' },
  { pr: 23, change: 'Prior art under D21: agent-sandbox in AEP-0023, the `listen` task of the Open Workflow Specification in AEP-0024. AEP index rows 0023 to 0025, changelog.', file: { label: 'spec/README.md (PR #23)', href: `${PR23_BRANCH}/spec/README.md` }, gaps: '-' },
  { pr: 23, change: 'Decision D21 (refines D17): open specifications and vendor-neutral foundation or SIG projects may be named as prior art, never as dependencies; runtimes, products and vendors stay unnamed outside the implementations list.', file: { label: 'decisions.md (PR #23)', href: `${PR23_BRANCH}/docs/decisions.md#d21-open-specifications-and-foundation-projects-may-be-named-as-prior-art` }, gaps: '-' },
  { pr: 23, change: 'Spec 1.2 related work: the Open Workflow Specification describes control flow, AWP what an agent may do plus governance and audit; agent-sandbox is one platform-side isolation mechanism. Same paragraph in the README.', file: { label: 'Spec 1.2 (PR #23)', href: `${PR23_BRANCH}/spec/v1alpha3/README.md#12-relationship-to-other-protocols` }, gaps: '-' },
  { pr: 23, change: 'AEP-0022 prior art: the `for` task of the Open Workflow Specification (`in`, `each`, `at`, `while`) as the closest counterpart of `forEach`.', file: { label: 'AEP-0022 (PR #23)', href: `${PR23_BRANCH}/aep/0022-step-iteration.md` }, gaps: '-' },
  { pr: 23, change: 'Runtime feedback section 10: G62 to G87 from a platform with interactive coding agent sessions, a coding agent as engine of workflow steps, model and MCP gateways outside the sandbox, tenants and gateway audit. With a proposal which platform objects become AWP kinds (extends K).', file: FEEDBACK, gaps: 'G62 to G87' },
  { pr: 23, change: 'AEP-0023 extended by the cases that share its reason: tool server credentials outside steps, approval authority outside the execution environment (new 7.6.1), a minimum `isolation` class on agents, one rule for ceilings (permissions, models, tool servers, autonomy and isolation reject; budgets cap).', file: ISOLATION, gaps: 'G64, G67, G68, G69' },
  { pr: 23, change: 'New AEP-0026 interactive execution: kind `AgentSession`, `sessions` opt-in on `Agent` with `maxAutonomy`, autonomy levels `readOnly`, `ask`, `auto`, `confirm` per permission entry, narrowing of tool sources and model, lifecycle, budget across pauses, session events. Number to be confirmed.', file: SESSION, gaps: 'G62, G63, G73, G82, G85' },
  { pr: 23, change: 'New AEP-0027 agent engine: `agents[].engine` with workspace repositories from inputs or events, workspace configuration off by default, declared outputs filled by the engine, subagents share budget and permissions. Number to be confirmed.', file: ENGINE, gaps: 'G65, G66, G81, G83' },
  { pr: 23, change: 'Amendments: AEP-0007 server prompts and resources as allow lists with default none, server requests answered by the runtime, resolution order; AEP-0002 resource scope of `shell.execute`; AEP-0005 prompts as session tasks; AEP-0009 origin of events, tool arguments and session history as content; AEP-0013 budgets during streaming; AEP-0017 agent requests in sessions; AEP-0021 B6 bindings for `Agent`.', file: { label: 'CHANGELOG.md (PR #23)', href: `${PR23_BRANCH}/CHANGELOG.md` }, gaps: 'G70 to G78, G84' },
  { pr: 'planned', change: 'Apply AEP-0004 to v1alpha3: `${{ event.* }}` as its own root with `dataSchema` and `classification`, no mapping to inputs (D7). Amend AEP-0019 open question 1: the run object carries the event (`spec.event` with `origin: ingress` or `replay`).', file: EVENTS, gaps: 'G41, G48, G57' },
];

export const inflowNote = 'PR #23 supersedes #19 and #20: their commits are included unchanged, rebased on main, so D21 and the prior-art notes that cite it now land together. None of the AEPs (0023 to 0027, and the amendments) is applied to the v1alpha3 text yet: they are Draft AEPs next to it, and the schema and the checker do not know their fields. Details per change with examples: the [side-by-side page](compare.html#isolation).';

// ------------------------------------------------------------------ still open

// Open after pull request #23 and the planned AEP-0004 pull request (runtime-feedback.md, status overview on PR #23).
export const open = [
  { title: 'Decisions for the maintainer in PR #23', text: 'Confirm the numbers AEP-0026 and AEP-0027 (question 10 of the runtime feedback); approval authority, isolation class, ceilings and tool server credentials as part of AEP-0023 rather than an own AEP (question 10); which platform objects become AWP kinds: `AgentSession` new, `Prompt` and `McpCatalog` as proposed, tenants, sandbox profiles and bindings left to the runtime (question 11).' },
  { title: 'Drafted, but not applied or accepted', text: 'AEP-0023 to AEP-0027 are Draft. AEP-0026 open: `confirm` for workflow runs, a `readOnly` action group, retention of session history (G85), sessions started by events (G86). AEP-0027 open: a registry of engine names, whether `tools` must list everything an engine offers. AEP-0023 to AEP-0025 are Draft. They change nothing in v1alpha3 until they are applied to the text, the schema and the conformance suite, and none can become Accepted without an external reviewer (D16). Their open questions: whether authors can see the platform ceiling and whether MCP over `streamable-http` falls under the network rules (0023); the 24 hour dedup window, `attestedActor` for manual starts (0024); `spec.state` as proposed or its own kind as the alternative under review, the sharing boundary, a state tool for agent steps (0025).' },
  { title: 'Covered by an existing AEP that is not applied', text: 'G02 (typed outputs, AEP-0003 and AEP-0014), G04 (conditional steps, AEP-0001), G06 and G55 (tool steps and the identity a step acts as, AEP-0012), G22 (array item schemas, AEP-0014), G52 (runtime trigger objects, AEP-0021 B6), G59 and G60 (catalog limits and capabilities, AEP-0008, after the current draft).' },
  { title: 'Open, no AEP yet', text: 'G05 (secret scopes per step, a must), G09 (unknown fields pass strict apply), G11 (origin marking of untrusted outputs), G12 (where command code comes from), G13 (`finally` steps), G16 to G21, G24 to G39 (mostly clarifications: defaults, retries, budget units, model parameters, runtime neutrality) and K (a Kubernetes mapping, normative or informative). From section 10: G77 (data flow to tool sources), G79 and G80 (secrets supplied at start, secret scope of a standalone agent).' },
];

export const openNote = 'G23 (fan-out) is resolved: `forEach`, AEP-0022 (accepted, D19), spec v1alpha3 5.6.5.';

// ------------------------------------------------------------------ related work

export const related = {
  verified: 'Descriptions of the two projects were checked on 2026-11-22 against their own repositories: the README and `dsl-reference.md` of open-workflow-specification/specification (release v1.1.0) and the README of kubernetes-sigs/agent-sandbox (release v1.0.12).',
  rows: [
    {
      name: 'AWP', href: `${MAIN}/spec/v1alpha3/README.md`,
      what: 'What a workflow of agents does, what each agent and step may do (models, tools, permissions, network, secrets, budgets), how it is governed (classification, approvals, policies) and what it leaves behind (audit, reproducibility).',
      layer: 'Agent permissions and governance', overlap: '-', relation: '-',
    },
    {
      name: 'Open Workflow Specification', href: 'https://github.com/open-workflow-specification/specification',
      what: 'A DSL for the control flow of workflows: tasks `call`, `do`, `emit`, `for`, `fork`, `listen`, `raise`, `run`, `set`, `switch`, `try`, `wait`, with runtime expressions, CloudEvents, schedules by cron or event, retries and timeouts. A CNCF project; spec 1.2 in PR #23 calls it formerly Serverless Workflow, and its own README still links the CNCF Serverless Working Group.',
      layer: 'Control flow',
      overlap: 'Iteration (`for` with `in`, `each`, `at`, `while` against `forEach`), event triggers (`listen` filters with `with` on attributes and `data`, regular and runtime expressions, `correlate`), schedules, running containers and scripts (`run`).',
      relation: 'Prior art under D21. AEP-0022 names `for`, AEP-0024 names `listen` and keeps its CloudEvents attribute names but restricts the manifest filter to equality. No dependency; AWP aligns wording where both cover the same ground.',
    },
    {
      name: 'agent-sandbox', href: 'https://github.com/kubernetes-sigs/agent-sandbox',
      what: 'A Kubernetes API and controller (SIG Apps) for isolated, stateful, singleton workloads: `Sandbox` (one pod with stable identity, persistent storage, lifecycle with scheduled deletion, pause and resume) and the extensions `SandboxTemplate`, `SandboxClaim` and `SandboxWarmPool`. It delegates isolation to sandbox runtimes such as gVisor or Kata Containers through `RuntimeClass`.',
      layer: 'Platform isolation',
      overlap: 'Where a step runs. Spec 5.6.2 requires an isolated environment for command steps; AEP-0023 says what the effective network and credential isolation must be.',
      relation: 'Prior art under D21 in AEP-0023: one platform-side way to run steps in a sandbox and keep warm pools. Never required for conformance; AWP states what must be isolated, not how.',
    },
  ],
};

// ------------------------------------------------------------------ Kubernetes mapping (informative)

export const kubernetes = {
  intro: 'Informative, not specification: one possible implementation, from the experience of a proof-of-concept Kubernetes runtime. Another runtime may map the same rules differently; AWP only fixes the rules on the right.',
  diagram: {
    title: 'One way a Kubernetes runtime maps AWP',
    desc: 'A chat bridge publishes CloudEvents to a broker; an event router creates a run object; the operator validates, pins and creates one Job per step; steps reach models through a model proxy with a per-attempt ticket, tools through a tool proxy with SSRF checks, and the internet through an egress proxy behind a default-deny network policy.',
    nodes: [
      { id: 'source', cls: 'external', title: 'Chat, webhook', sub: ['bridge publishes', 'CloudEvents'] },
      { id: 'broker', cls: 'platform', title: 'Broker (MQTT)', sub: ['topic access control', 'attests the sender'] },
      { id: 'router', cls: 'platform', title: 'Event router', sub: ['one filter per workflow,', 'no model in routing'] },
      { id: 'run', cls: 'kind', title: 'Run object', sub: ['WorkflowRun; only the', 'runtime sets the trigger'] },
      { id: 'operator', cls: 'platform', title: 'Operator', sub: ['validates, pins, holds', 'model keys, dedups'] },
      { id: 'job', cls: 'platform', title: 'Job per step', sub: ['or a Sandbox; runner', 'not dumpable'] },
      { id: 'model', cls: 'platform', title: 'Model proxy', sub: ['ticket, budget,', 'provider profile'] },
      { id: 'tool', cls: 'platform', title: 'Tool proxy', sub: ['resolved address', 'checked (SSRF)'] },
      { id: 'egress', cls: 'platform', title: 'Egress proxy', sub: ['allowlist per agent,', 'default-deny policy'] },
    ],
    edges: [
      { from: 'source', to: 'broker' }, { from: 'broker', to: 'router' }, { from: 'router', to: 'run' },
      { from: 'run', to: 'operator' }, { from: 'operator', to: 'job' },
      { from: 'job', to: 'model' }, { from: 'job', to: 'tool' }, { from: 'job', to: 'egress' },
    ],
    layouts: {
      wide: {
        width: 1000, height: 300,
        at: {
          source: [20, 20, 220, 64], broker: [270, 20, 220, 64], router: [520, 20, 220, 64], run: [770, 20, 210, 64],
          operator: [770, 130, 210, 64], job: [520, 130, 220, 64],
          model: [270, 226, 220, 64], tool: [520, 226, 220, 64], egress: [770, 226, 210, 64],
        },
      },
      tall: {
        width: 380, height: 620,
        at: {
          source: [10, 10, 170, 64], broker: [10, 104, 170, 64], router: [10, 198, 170, 64], run: [10, 292, 170, 64],
          operator: [200, 292, 170, 64], job: [200, 386, 170, 64],
          model: [10, 400, 170, 60], tool: [10, 476, 170, 60], egress: [10, 552, 170, 60],
        },
        via: { 'job-model': [[190, 430]], 'job-tool': [[190, 440], [190, 506]], 'job-egress': [[190, 440], [190, 582]] },
      },
    },
  },
  // Piece, what a Kubernetes runtime does, the AWP rule it enforces, the status of that rule.
  rows: [
    { piece: 'Binding object', does: 'A kind of the runtime connects a `Workflow` to a namespace: placement, runner image, volumes, secret mapping. The manifest itself needs no runtime field.', rule: 'Placement is implementation-defined; bindings with `targetRefs` are the AEP-0021 B6 concept.', status: 'platform' },
    { piece: 'Validation on read', does: 'The operator validates every object it reads and writes `Valid` and `Ready`; an admission check on write is optional.', rule: 'Spec 3.10 and 3.11: validate before acting, fail closed, never change `spec`.', status: 'v3' },
    { piece: 'One run object per execution', does: 'A `WorkflowRun` per execution, created by a client (manual) or by the runtime (schedule, event).', rule: 'Spec 10.8: at most one execution per run, actor from an authenticated source.', status: 'v3' },
    { piece: 'Admission rule on runs', does: 'Only the runtime may set trigger type and filter on a run; a client cannot claim to be an event.', rule: 'Spec 10.8 (client runs are manual); the trusted ingress of the planned AEP-0019 amendment (G48).', status: 'planned' },
    { piece: 'One Job (or Sandbox) per step', does: 'Each step runs in its own pod; the runner process is not dumpable, so the step ticket cannot be read through `/proc`.', rule: 'Spec 5.6.2: command steps in an isolated environment; AEP-0023: credentials not visible to steps.', status: 'pr23' },
    { piece: 'Per-attempt ticket, model proxy', does: 'Model keys live only in the operator namespace. A step gets a short-lived ticket per attempt; the model proxy checks the ticket, the budget and a provider profile per model API protocol (local models allowed) and calls the provider.', rule: 'AEP-0023 change to 7.9 (G61); budgets checked before each model call (5.7); `modelPolicy` (7.4).', status: 'pr23' },
    { piece: 'Tool proxy with SSRF checks', does: 'Checks the address actually connected to, at connection time, which covers redirects and DNS changes.', rule: 'AEP-0023 7.5.6: internal destinations denied after resolution unless manifest and ceiling allow them (G50).', status: 'pr23' },
    { piece: 'Egress proxy, default-deny policy', does: 'A forward proxy per agent with a domain allowlist derived from `allowHosts`, plus a default-deny NetworkPolicy that lets the pod reach only that proxy. NetworkPolicy needs a network plugin that enforces it; some local development clusters do not.', rule: 'AEP-0023: effective network = manifest intersected with the ceiling (the namespace policy is the ceiling); enforce or reject, so on a cluster that does not enforce NetworkPolicy the runtime must reject.', status: 'pr23' },
    { piece: 'Broker and event router', does: 'A chat bridge publishes each message as a CloudEvent to an MQTT broker; an event router with one filter object per workflow creates runs. No model takes part in routing, so a message cannot redirect it by prompt. The router subscribes with QoS 0 and keeps ids only briefly, so the operator deduplicates itself.', rule: 'AEP-0024: router filters may only narrow the manifest filter; dedup by `source` and `id`; `concurrencyPolicy`, `rateLimit`; delivery guarantee per source in the conformance statement (G56).', status: 'pr23' },
    { piece: 'Attested author', does: 'The bridge is the only identity allowed to publish on the topic and reads the author from the chat system: attestation through transport authorisation, not end to end.', rule: 'AEP-0024: `attestedActor` only from sources configured as trusted; approval rules treat it as the initiator (G44).', status: 'pr23' },
    { piece: 'Decision proxy next to the coding agent', does: 'In interactive sessions every tool call goes to a separate container with its own process namespace, which decides by mode, permissions and command allow list and asks the person through the console; grants are signed. The coding agent\'s own permission system is not trusted: a command of the same user ID read its server password and answered its own requests.', rule: 'AEP-0023 7.6.1 (approval authority outside the execution environment), AEP-0026 (autonomy and `confirm`).', status: 'pr23' },
    { piece: 'MCP gateway with tickets', does: 'MCP servers are reachable only through a gateway of the operator (network policy). It accepts a session or step ticket, adds the server credential, filters tools, prompts and resources to the catalog, answers sampling and roots itself and audits every call.', rule: 'AEP-0023 (tool server credentials outside steps), AEP-0007 rules 3, 7, 9 to 12.', status: 'pr23' },
    { piece: 'Tenant ceilings and sandbox profiles', does: 'A tenant object limits models, hosts, MCP servers, modes and cost; a sandbox profile maps an isolation class to a runtime class. Both stay kinds of the runtime.', rule: 'AEP-0023 7.5.7 (ceilings reject, budgets cap) and `agents[].isolation`.', status: 'pr23' },
    { piece: 'Sanitized chat replies', does: 'A step posts the reply in the originating thread after sanitizing it (no mentions or markup the model was not meant to send).', rule: 'No AWP rule yet: delivery of replies is the job of a step (AEP-0024); the identity a step posts as is open (G55, AEP-0012).', status: 'platform' },
  ],
  // What the runtime creates, and when, for the worked examples.
  timeline: [
    { example: 'ex-scheduled', apply: 'Stores the `Workflow`, validates it (`Valid`), finds its binding, registers the schedule (`Ready`).', start: 'At 07:00 creates a run object with the trigger in `status`; skips the tick with `trigger.skipped` while the previous run is active (`forbid`). Resolves the image tag to a digest.', steps: 'Job `fetch`, then Job `rate` (model proxy with a ticket for this attempt), then Job `notify` with the webhook secret.' },
    { example: 'ex-network', apply: 'Rejects the manifest if a pinned image is missing a digest or if the network plugin does not enforce NetworkPolicy.', start: 'Derives the proxy allowlist from `allowHosts` and checks it against the namespace ceiling; rejects the run before any Job if the ceiling is narrower.', steps: 'Each Job reaches only its egress proxy; tool calls go through the tool proxy, which refuses addresses outside the ceiling.' },
    { example: 'ex-event', apply: 'Generates a filter object for the router from `spec.triggers`.', start: 'Router matches the CloudEvent and creates the run; the operator drops a second event with the same `source` and `id`.', steps: 'Job `answer` reads the message (once AEP-0004 is applied); a reply step posts the sanitized answer into the thread.' },
    { example: 'ex-state', apply: 'Today: one volume per workflow from the binding, mounted at `/awp/state`, invisible in the manifest.', start: 'With AEP-0025: mounts only the declared stores, read-only where `access: read`.', steps: 'Job `diff` reads and writes `seen-concerts`; writes are atomic.' },
    { example: 'ex-approval', apply: 'Rejects the manifest on a runtime without the governance profile.', start: 'Records the creator of the run (manual) or the bridge and the attested author (event).', steps: 'After `draft`, the run waits in `waitingForApproval`; an approval by the initiator is rejected and recorded; then Job `send`.' },
  ],
};

// ------------------------------------------------------------------ adopt

export const profiles = [
  { name: 'core', when: 'Always. Parse and validate, the step graph, budgets, permissions, secrets, digest, pinning, `WorkflowRun` if executions are objects.' },
  { name: 'governance', when: '`approval`, approval steps, `policies`, `dataPolicy`, `modelPolicy`, `environments`, `risk.level` high or critical; `classification` becomes required.' },
  { name: 'audit', when: '`spec.audit`: event envelope, all event types, hash chain, decision and reproducibility records.' },
  { name: 'security', when: '`signature`, images pinned by digest, isolation, network and filesystem limits, redaction.' },
  { name: 'mcp, a2a', when: 'MCP servers and tool sources; remote agents.' },
  { name: 'interaction', when: 'Input steps and agents with `humanInput`.' },
];

export const authorChecklist = [
  'Start from [example 1](#ex-scheduled): `apiVersion: awp.agenticworkflowprotocol.org/v1alpha3`, a DNS-1123 `metadata.name`, `spec.version` (SemVer), `spec.owner.team`, and `spec.classification` if you target the governance profile.',
  'Declare `triggers` (without them only manual starts are possible); give inputs defaults if a schedule starts the workflow.',
  'Pass values to commands through `env`, never in `command`. Write outputs to `$AWP_OUTPUTS/<name>` or let the agent end with `complete_step`.',
  'Use `permissions` with `default: deny` and explicit allows; limit `network` with `egress: deny` and `allowHosts`; declare secrets by name with the smallest `scope`, never as values.',
  'Pin images by digest if the workflow must run under the `security` profile; outside it, tags are resolved and pinned at start.',
  'Choose the profiles from the table and validate: in a checkout of the spec repository run `npm ci`, then `node conformance/awp-check.mjs check --profiles core,governance my.workflow.yaml`. `node conformance/awp-check.mjs migrate old.yaml` converts v1alpha1 and v1alpha2 manifests.',
  'On Kubernetes, install the CRDs from `schema/crd/` and apply with `kubectl apply --validate=strict`; read `Valid` and `Ready` in `kubectl get workflows`. The [Helm chart](compare.html#try) packages a complete example.',
  'Do not rely on proposals yet: `${{ event.* }}`, `spec.state`, `rateLimit` and the new `allowHosts` forms are not in v1alpha3 and the checker rejects or ignores their meaning.',
];

export const runtimeChecklist = [
  'Pick the profiles you can meet completely and publish a conformance statement (spec 11.3): `limitations`, `limits`, `executionObjects`. A profile with one unmet MUST cannot be claimed.',
  'Reject, never run partially: an unsupported `apiVersion` or `kind`, unknown fields, `x-` keys outside `extensions`, fields of profiles you do not support, literal credentials, invalid inputs, models outside `modelPolicy`, digest mismatches, images that cannot be resolved, `image` steps if you cannot run containers.',
  'Enforce at run time: the decision algorithm for every action (8.4), budgets before every model call and action, isolated command steps with `network` and `filesystem` applied, no expressions in `command`, the output rules (no symlinks, minimum sizes, no truncation, failed attempts discarded), pinning, approvals only by authenticated humans, the actor of a run from an authenticated source, no secret values to models, logs or audit.',
  'Prepare for PR #23: decide confirmations and approvals outside the execution environment, keep tool server credentials in a gateway, honour a required `isolation` class or reject; enforce the effective network or reject before the first step, check resolved addresses, keep model keys out of steps, deduplicate events by `source` and `id` for at least 24 hours, write state atomically, treat state and conversation context as untrusted input.',
  'Test your validator with the conformance suite: `npm test` in the spec repository runs every case, and `conformance/v1alpha3/index.json` lists expected accept or reject, code and path for your own validator. A runtime test suite is planned; until then conformance statements are self-declarations.',
  'Report gaps the way `docs/runtime-feedback.md` does: one entry per gap with severity, the proposal and the evidence from your runtime, as an issue or an AEP in the spec repository (D18). The spec repository names no runtime (D17); the implementations list shows projects that published a conformance statement.',
];
