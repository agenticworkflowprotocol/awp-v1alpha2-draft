// Open runtime feedback on the v1alpha3 draft: gaps G41 to G87.
// Left: what the draft says today (v1alpha3 on main), right: the proposal from the runtime.
// `check` on the left works as in examples.mjs ('v2', 'v2-invalid' or null).
// The right side is always a proposal and never checked: it is not valid against the schema.

import { PREVIEW, PREVIEW_REF } from './spec-ref.mjs';

// Compared against the v1alpha3 draft (formerly the v1alpha2 draft, b8a0ee8; renamed by decision D20),
// on the branch of spec pull request #26, the top of the stack #24, #25, #26 that replaces #19, #20 and #23 (spec-ref.mjs).
export const SPEC_REF = PREVIEW_REF;
const SPEC = PREVIEW;
const aep = (n, slug) => ({ label: `AEP-${n}`, href: `${SPEC}/aep/${n}-${slug}.md` });
const spec = (section, anchor) => ({ label: `Spec ${section}`, href: `${SPEC}/spec/v1alpha3/README.md#${anchor}` });

const V3 = 'awp.agenticworkflowprotocol.org/v1alpha3';
const CONCEPT = { label: 'Concept comparison (German)', href: 'https://slauger.github.io/ai-agent-operations/awp-abgleich/' };

const EVENTS = aep('0004', 'event-references');
const CATALOG = aep('0008', 'model-provider-catalog');
const TOOLSTEPS = aep('0012', 'tool-steps');
const RUN = aep('0019', 'workflow-run-and-status');
const EXT = aep('0021', 'extension-model');
const TRIGGERS = spec('5.2', '52-triggers');
const PERMISSIONS = spec('7.5', '75-tool-governance-permissions');

/** Minimal valid workflow around a fragment of `spec`, for the checker. */
const workflow = (name, fragment) => `apiVersion: ${V3}
kind: Workflow
metadata:
  name: ${name}
spec:
  version: 0.1.0
  owner:
    team: music-fans
${fragment}
  agents:
    - id: assistant
      model:
        provider: ollama
        name: qwen3`;

// Draft AEPs on the branches of spec pull requests #24 to #26 (not merged).
const ISOLATION = { label: 'AEP-0023 (PR #25)', href: `${PREVIEW}/aep/0023-step-isolation.md` };
const TRIGGERAEP = { label: 'AEP-0024 (PR #24)', href: `${PREVIEW}/aep/0024-event-triggers.md` };
const STATE = { label: 'AEP-0025 (PR #24)', href: `${PREVIEW}/aep/0025-state.md` };
const pr26 = (n, slug) => ({ label: `AEP-${n} (PR #26)`, href: `${PREVIEW}/aep/${n}-${slug}.md` });
const SESSIONS = pr26('0026', 'interactive-execution');
const ENGINE = pr26('0027', 'agent-engine');
const ARGS = pr26('0002', 'tool-argument-constraints');
const PROMPTS = pr26('0005', 'prompt-kind');
const MCP = pr26('0007', 'mcp-connection-catalog');
const AUDIT = pr26('0009', 'audit-payload-levels');
const CLARIFY = pr26('0013', 'runtime-clarifications');
const HUMAN = aep('0017', 'human-input');
const FEEDBACK10 = { label: 'runtime-feedback.md section 10 (PR #24)', href: `${PREVIEW}/docs/runtime-feedback.md#10-from-interactive-sessions-and-a-coding-agent-engine` };
const SECRETS = spec('7.9', '79-secrets');
const TOOLSRC = spec('5.5', '55-tools-and-action-identifiers');
const AGENTKIND = spec('6', '6-kind-agent');

export const page = {
  version: 'v1alpha3', // shown in the top bar
  file: 'gaps.html',
  title: 'AWP v1alpha3: Open Runtime Gaps',
  description: 'Open gaps G41 to G87 found by a Kubernetes runtime proof of concept and its extension to interactive coding agent sessions in the AWP v1alpha3 draft (formerly the v1alpha2 draft), classified by where they belong: AWP, an AWP rule enforced by the platform, or the platform only.',
  h1: 'Runtime feedback: open gaps in the v1alpha3 draft',
  lede: 'What a Kubernetes runtime proof of concept, its extension to a platform with interactive coding agent sessions, and a reference concept still miss in the v1alpha3 draft: {{count}} gaps, each with what the draft says today on the left, a sketch of the proposal on the right, and what happened in the proof of concept.',
  notice: 'These are <strong>proposals from one runtime</strong>, not accepted specification and not part of the draft. The classification, verdicts and targets are agreed between the runtime side and the spec side; the maintainer still decides. The AEPs are written and open for review in three stacked spec pull requests (not merged) that replace #19, #20 and #23: #24 (this feedback list, AEP-0024, AEP-0025), #25 (AEP-0023) and #26 (the concepts AEP-0026 interactive execution and AEP-0027 agent engine, numbers to be confirmed, and amendments to AEP-0002, 0005, 0007, 0009 and 0013). Many details of the new concepts are open questions there rather than rules; <a href="index.html#inflow">the guide</a> summarises what they add. Everything is compared against the v1alpha3 draft (formerly the v1alpha2 draft, <code>b8a0ee8</code>) as previewed on the spec branch <code>docs/aep-0026-0027-sessions-engine</code>: main plus pull requests #24 to #26, not merged text. Pull request #16 was merged as v1alpha3 by decision D20, v1alpha2 is now the step iteration draft (D19). Gaps the draft already resolves (G01, G07, G08, G40) are on the <a href="compare.html">side-by-side page</a>. Left snippets marked <span class="verified">valid</span> or <span class="verified">rejected by checker</span> were run through the reference checker; proposals are marked <span class="unchecked">not checked</span>, and their field names are sketches unless the source names them.',
  // Yardstick: where a gap belongs.
  yardstick: [
    { cat: 'A', text: 'Belongs in AWP: what a workflow needs and may do, and what its fields mean, portable across runtimes.' },
    { cat: 'B', text: 'An AWP rule enforced by the platform: the spec says "MUST enforce or reject" in one sentence and names no mechanism, so the platform picks it (NetworkPolicy, Istio, an egress proxy, an operator).' },
    { cat: 'C', text: 'Platform only: an implementation detail, at most an informative note.' },
  ],
  order: [
    'Now, in the current draft: apply AEP-0004 and amend AEP-0019 for its open question 1 (G48, G57). Small, and it unblocks event runs.',
    'AEP-0023 "Step isolation: network, credentials and approvals" (G10, G47, G49, G50, G51, G61, and since PR #25 G64, G67, G68, G69). G50, G61 and G64 are security holes, so early.',
    'AEP-0024 "Event triggers with CloudEvents" (G42 to G46, G54, G56), using AEP-0004 and AEP-0019; G52 through AEP-0021.',
    'AEP-0025 "State" (G03, G53, G58), once state is wanted in the current draft.',
    'Into existing AEPs: G52 into AEP-0021, G55 into AEP-0012, G59 and G60 into AEP-0008 (after the current draft), G34 earlier, in the current draft.',
    'AEP-0026 "Interactive execution" (G62, G63, G73, G82) and AEP-0027 "Agent engine" (G65, G81): small concepts in PR #26, numbers to be confirmed; G66, G83 to G87 are open questions there.',
    'Amendments in PR #26 to existing AEPs: G71 and G72 into AEP-0007, G74 into AEP-0002, G75 into AEP-0005, G76 into AEP-0009, G78 into AEP-0013. G70 and G77 are open questions.',
    'Fix now: the `triggers[].source` row in AEP-0021 B4 (G54), and state as untrusted input in spec 12 (G58).',
  ],
  // Spec pull requests for the AEPs above, as { label, href }.
  pullRequests: [
    { label: '#24 (draft): runtime feedback G41 to G87, related work (D21), AEP-0024, AEP-0025', href: 'https://github.com/agenticworkflowprotocol/agenticworkflowprotocol.org/pull/24' },
    { label: '#25 (draft, on #24): AEP-0023 step isolation', href: 'https://github.com/agenticworkflowprotocol/agenticworkflowprotocol.org/pull/25' },
    { label: '#26 (draft, on #25): AEP-0026 and AEP-0027 as concepts, amendments to AEP-0002, 0005, 0007, 0009, 0013; #19, #20 and #23 are superseded', href: 'https://github.com/agenticworkflowprotocol/agenticworkflowprotocol.org/pull/26' },
  ],
  decisions: [
    'Scope of the current draft for G44, for G47, G50 and G61, and for state (G03, G53).',
    'Whether G55 waits until after the current draft.',
    'The numbers AEP-0026 and AEP-0027, and whether G64, G67, G68 and G69 extend AEP-0023 (question 10 of the runtime feedback).',
    'Which platform objects become AWP kinds: `AgentSession` new, `Prompt` and `McpCatalog` as proposed, tenants, sandbox profiles and bindings left to the runtime (question 11).',
  ],
  footer: 'Sources: the runtime feedback list of the proof of concept (gaps G41 to G87), the <a href="https://slauger.github.io/ai-agent-operations/awp-abgleich/">concept comparison</a> (German) and the draft in <a href="https://github.com/agenticworkflowprotocol/agenticworkflowprotocol.org/tree/main">agenticworkflowprotocol.org</a>. This page is generated from <a href="https://github.com/agenticworkflowprotocol/awp-v1alpha2-draft">awp-v1alpha2-draft</a>; corrections are welcome as issues or pull requests.',
};

export const chapters = [
  { id: 'events', title: 'Events and triggers', related: [EVENTS, RUN, TRIGGERAEP, EXT], intro: 'Event triggers exist in spec 5.2, but the event itself does not reach the execution, and filters, duplicates, actors and run objects for events are undefined. The proof of concept starts runs from chat mentions, webhooks and MQTT through an event router.' },
  { id: 'isolation', title: 'Step isolation: network, credentials and approvals', related: [ISOLATION, PERMISSIONS], intro: 'What `permissions.network` means and how its host list is written, how a platform enforces it, where model credentials live, and since PR #25 who approves, which isolation class a step needs, and that ceilings reject. Covered by AEP-0023, together with G10. The common question: does something live inside or outside the execution environment?' },
  { id: 'sessions', title: 'Interactive execution', related: [SESSIONS, AGENTKIND, HUMAN], intro: 'People use agents interactively: a session with a coding agent, prompts over hours, confirmation of single tool calls, pause and resume. The draft knows only workflow runs. Found when the proof of concept became a platform with a browser console; covered by the small concept AEP-0026, with many details as open questions.' },
  { id: 'engine', title: 'Agent engine and workspace', related: [ENGINE, STATE], intro: 'A coding agent brings its own tool loop, file editing, shell and subagents. The draft assumes the runtime runs the loop. The proof of concept runs workflow agent steps and sessions with a coding agent as engine; covered by the small concept AEP-0027; outputs, push and repositories from events are open questions.' },
  { id: 'tools', title: 'Tool sources, MCP and audit', related: [MCP, ARGS, PROMPTS, AUDIT, CLARIFY, SECRETS], intro: 'What an MCP gateway outside the sandbox had to decide that the draft leaves open: server prompts and resources, tools added later, command allow lists, reusable prompts, where audit events come from, data sent to tool servers, budgets during streaming and secrets supplied at start. Mostly amendments to existing AEPs in PR #26; some are open questions.' },
  { id: 'state', title: 'Conversation, state and identity', related: [TRIGGERAEP, STATE, TOOLSTEPS], intro: 'Context that outlives one message or one execution: reply targets, chat threads, state shared between workflows, and the identity a workflow uses towards other systems.' },
  { id: 'models', title: 'Models: input to AEP-0008', related: [CATALOG], intro: 'AEP-0008 (Review) defines a `ModelCatalog` kind for prices, regions and limits. It names v1alpha3 as its target, written before D20; that now means after the current draft. G59 and G60 are offered as input to it, not as changes to the current draft.' },
];

export const gaps = [
  // ---------------------------------------------------------------- events and triggers
  {
    id: 'G41', chapter: 'events', cat: 'A', verdict: 'must, decided (D7)', target: 'apply AEP-0004 in the current draft', title: 'Event data cannot reach the execution',
    problem: 'An event trigger starts an execution, but nothing in the run can read the event: section 3.9 knows only `inputs`, `steps` and `execution`. A chat message that starts a run cannot pass its text, author or thread to the agent.',
    left: { check: 'v2-invalid', expect: 'schema.pattern', label: 'v1alpha3 draft: rejected (no event root in 3.9)', code: `triggers:
  - type: event
    source: chat.example.com
    eventType: message.mention
workflow:
  - id: answer
    agent: assistant
    task: "Answer: \${{ event.data.message }}"`, doc: workflow('chat-answer', `  triggers:
    - type: event
      source: chat.example.com
      eventType: message.mention
  workflow:
    - id: answer
      agent: assistant
      task: "Answer: \${{ event.data.message }}"`) },
    right: { label: 'Proposal: apply AEP-0004; the run carries the event', code: `triggers:
  - type: event
    source: chat.example.com
    eventType: message.mention
    classification: internal
    dataSchema:
      type: object
      required: [message]
      properties:
        message: { type: string, maxLength: 4000 }
workflow:
  - id: answer
    agent: assistant
    task: "Answer: \${{ event.data.message }}"
# No mapping to inputs (D7). The run object carries
# the event (spec.event, G48 and G57).` },
    why: 'Chat mentions, webhook payloads and MQTT messages started executions in the proof of concept. With no event context, it maps event fields to workflow inputs, which hides that the value comes from an external sender.',
    status: 'Decided by D7: events are not mapped to inputs. AEP-0004 (Review) replaces the input mapping but is not applied to the spec yet. The proof of concept still maps to inputs (concept E22).',
    refs: [EVENTS, spec('3.9', '39-expressions'), TRIGGERS, CONCEPT],
  },
  {
    id: 'G42', chapter: 'events', cat: 'A', verdict: 'must', target: 'new AEP-0024 event triggers, the current draft (equality plus AND as the portable floor)', title: 'Filter semantics are undefined',
    problem: '`filter` is a map of string. The draft does not say which fields the keys name (event attributes or payload paths), whether values match by equality, or how several entries combine.',
    left: { check: 'v2', label: 'v1alpha3 draft (spec 5.2)', code: `triggers:
  - type: event
    source: git.example.com
    eventType: pull_request.opened
    filter:
      repository: example-org/web-shop`, doc: workflow('pr-review', `  triggers:
    - type: event
      source: git.example.com
      eventType: pull_request.opened
      filter:
        repository: example-org/web-shop
  workflow:
    - id: review
      agent: assistant
      task: Review the pull request.`) },
    right: { code: `triggers:
  - type: event
    source: git.example.com
    eventType: pull_request.opened
    filter:
      # keys: CloudEvents attribute names or data.<path>
      # values: equality; all entries must match (AND)
      data.repository: example-org/web-shop
# Richer conditions (for example CEL) stay in a
# runtime trigger object (G52) and may only narrow
# this filter.` },
    why: 'The concept filters chat events with the key `data.user`. Because its meaning is open, the manifest filter is only descriptive there and the event router does the real filtering.',
    status: 'Drafted in AEP-0024 (PR #24). Equality and AND are the portable floor; richer conditions stay in a runtime trigger object (G52) and may only narrow the filter.',
    refs: [TRIGGERS, EXT],
  },
  {
    id: 'G43', chapter: 'events', cat: 'A+B', verdict: 'must', target: 'AEP-0024: `concurrencyPolicy` and a rate limit on event triggers (A); MUST deduplicate by source and id within a stated window (B)', title: 'No duplicate handling and no concurrency for events',
    problem: 'Webhook retries and at-least-once routers deliver the same event twice, and each delivery can start an execution; at-most-once routers lose events instead (G56). `concurrencyPolicy` exists only for schedule triggers.',
    left: { check: null, lang: 'text', label: 'Spec 5.2 (v1alpha3 draft)', code: `concurrencyPolicy only considers executions
started by the same trigger entry of the same
workflow (kind, metadata.namespace,
metadata.name), regardless of their version.
Manual and event-triggered executions are not
considered.

(Nothing on duplicate events.)` },
    right: { code: `triggers:
  - type: event
    source: mqtt.example.com
    eventType: sensor.alert
    concurrencyPolicy: forbid   # A: as for schedule
    # A: plus a rate limit (shape not sketched)
# B: the runtime MUST deduplicate by CloudEvents
# source + id within a window it states.` },
    why: 'The proof of concept rejected a real duplicate as `DuplicateEvent`. Concurrency control for event-triggered runs is still missing there.',
    status: 'Drafted in AEP-0024 (PR #24), deduplication per workflow. The manifest fields are category A; deduplication is category B: the spec states the rule, the platform implements it.',
    refs: [TRIGGERS, CONCEPT],
  },
  {
    id: 'G44', chapter: 'events', cat: 'A', verdict: 'must (raised from should)', target: 'AEP-0024, plus amending spec 5.2 and 10.3', title: 'Who started an event-triggered execution',
    problem: 'The draft takes the actor from an authenticated source. For an event that is the bridge that delivered it, not the person who wrote the message. This is a governance hole: `initiatorCannotApprove` and `actorCannotApproveOwnAction` (spec 7.6) depend on the initiator, and with actor type `system` a person who started a run through chat could approve their own request.',
    left: { check: null, lang: 'text', label: 'Spec 5.2 and 10.8 (v1alpha3 draft)', code: `5.2: An execution started by schedule or event
has the actor type system; an execution started
by manual has the actor type human.

10.8: The runtime MUST take this identity from an
authenticated source [...], never from a field
the client wrote.

7.6: initiatorCannotApprove: The actor who started
the execution MUST NOT approve any request in it.` },
    right: { code: `# workflow.started, data (sketch)
trigger:
  type: event
  index: 0
  source: chat-bridge   # authenticated transport identity
  actor:                # optional, attested by the source
    type: human
    id: slauger
# Policies may require an attested actor, and
# separation of duties (7.6) can refer to the
# person instead of system.` },
    why: 'The trust chain in the proof of concept is only the broker ACLs: only the bridge may publish, and the event carries no signature. The bridge attests "message from slauger", but the run records the actor `system`.',
    status: 'Drafted in AEP-0024 (PR #24), raised from should to must; the attribute that carries the attested actor is open question 4. Spec 5.2 gives every event start the actor type `system`, which cannot hold together with an attested person.',
    refs: [TRIGGERS, spec('10.8', '108-kind-workflowrun'), RUN],
  },
  {
    id: 'G48', chapter: 'events', cat: 'A', verdict: 'into spec, merged with G57', target: 'AEP-0019 open question 1, the current draft: `spec.event` plus an origin (ingress or replay)', title: 'Event runs created by an event router',
    problem: 'A client-created `WorkflowRun` is a manual start, and runtime-created runs record the trigger only in status. A router such as Argo Events or Tekton Triggers that creates runs for event triggers fits neither role.',
    left: { check: 'v2', label: 'v1alpha3 draft: valid, but a manual start', code: `apiVersion: ${V3}
kind: WorkflowRun
metadata:
  generateName: chat-answer-
  namespace: agents
spec:
  workflowRef:
    name: chat-answer
  inputs:
    question: What plays in Leipzig this week?` },
    right: { code: `apiVersion: ${V3}
kind: WorkflowRun
metadata:
  generateName: chat-answer-
  namespace: agents
spec:
  workflowRef:
    name: chat-answer
  origin: ingress      # authenticated, configured identity
  event:
    source: chat.example.com
    type: message.mention
    data:
      message: What plays in Leipzig this week?
# Validated against dataSchema. The runtime records
# the ingress identity and rejects event fields from
# any other creator. Shape of origin not decided.` },
    why: 'In the proof of concept an Argo Events sensor creates runs with `spec.trigger.type: event`, which is non-conforming; the runtime therefore keeps its own run kind instead of the AWP `WorkflowRun`.',
    status: 'Open, merged with G57 as AEP-0019 open question 1. The runtime also plans to create event runs itself from a generated trigger object (G52); the ingress origin stays relevant for routers outside the runtime.',
    refs: [spec('10.8', '108-kind-workflowrun'), RUN, CONCEPT],
  },
  {
    id: 'G52', chapter: 'events', cat: 'B', verdict: 'concept', target: 'extension of AEP-0021 B6', title: 'Runtime trigger objects',
    problem: 'AEP-0021 B6 attaches runtime bindings to a workflow, but not objects for event routing, CEL filters or rate limits. A hand-written Argo Events sensor has no reference to the workflow and no status.',
    left: { check: null, label: 'AEP-0021 B6 (concept): bindings only', code: `apiVersion: runtime.example.com/v1
kind: WorkflowBinding
metadata:
  name: chat-answer
  namespace: agents
  labels:
    awp.agenticworkflowprotocol.org/binding: "true"
spec:
  targetRefs:
    - group: awp.agenticworkflowprotocol.org
      kind: Workflow
      name: chat-answer
  runnerImage: registry.example.com/runner@sha256:...` },
    right: { code: `apiVersion: runtime.example.com/v1
kind: EventTrigger          # runtime-specific kind
metadata:
  name: chat-answer
  namespace: agents
spec:
  targetRefs:
    - group: awp.agenticworkflowprotocol.org
      kind: Workflow
      name: chat-answer
      sectionName: "0"      # index of the trigger entry
  # routing, CEL filter, rate limit: runtime-specific,
  # may only narrow the manifest trigger
status:
  conditions:
    - type: Accepted
      status: "True"` },
    why: 'The proof of concept routes events with an Argo Events sensor written by hand. Nothing ties it to the trigger entry it serves, and it reports no status.',
    status: 'Concept. The object stays implementation-specific; the attachment rules (`targetRefs` with the trigger index, may only narrow, `Accepted`) are AWP rules.',
    refs: [EXT],
  },
  {
    id: 'G54', chapter: 'events', cat: 'A', verdict: 'into spec', target: 'AEP-0004 and AEP-0024; remove the row from AEP-0021 B4', title: 'What triggers[].source means',
    problem: 'In CloudEvents, `source` is the context in which an event happened (a URI reference). AEP-0021 B4 treats `triggers[].source` as the name of an event source, with a domain prefix for implementation values.',
    left: { check: null, lang: 'text', label: 'Spec 5.2 and AEP-0021 B4', code: `5.2: The mapping of source and eventType to
concrete event sources is implementation-defined.

    source: git.example.com

B4: triggers[].source (event): names listed by
AWP; implementation value:

    source: events.example.com/github` },
    right: { label: 'Agreed: the CloudEvents source attribute', code: `triggers:
  - type: event
    # the CloudEvents source attribute of the event
    source: https://git.example.com/example-org/web-shop
    eventType: pull_request.opened
# Which adapter receives the event is runtime
# configuration, in the trigger object (G52).
# AEP-0021 B4: remove the triggers[].source row.` },
    why: 'The proof of concept used `source` as the name of its event source adapter, while the events it receives carry a CloudEvents `source` of their own. Both readings are plausible from the draft.',
    status: 'Contradiction confirmed in AEP-0021: B4 lists `triggers[].source` as a domain-prefixed name, while events carry a CloudEvents `source`. Agreed: `source` is the CloudEvents attribute, and the row leaves B4.',
    refs: [TRIGGERS, EVENTS, EXT],
  },
  {
    id: 'G56', chapter: 'events', cat: 'B', verdict: 'minor', target: 'AEP-0021 B1 conformance statement', title: 'Delivery guarantee per event source',
    problem: 'Whether an event can be lost or arrives more than once depends on the event source and the router in between. A router can silently weaken the guarantee.',
    left: { check: null, label: 'Spec 11.3 (v1alpha3 draft)', code: `implementation:
  name: example-runtime
  version: 0.4.0
conformance:
  awp: v1alpha3
  profiles:
    - core
  limitations:
    - "audit: integrity mode signed is not supported"` },
    right: { code: `implementation:
  name: example-runtime
  version: 0.4.0
conformance:
  awp: v1alpha3
  profiles:
    - core
  limitations:
    - "audit: integrity mode signed is not supported"
  eventSources:             # field names illustrative
    - source: mqtt.example.com
      delivery: atLeastOnce # or atMostOnce` },
    why: 'The Argo Events MQTT event source used by the proof of concept subscribes with QoS 0, which silently downgrades delivery to at most once.',
    status: 'Drafted in AEP-0024 (PR #24), conformance statement. The other side of G43: at-least-once delivery needs deduplication, at-most-once loses events.',
    refs: [spec('11.3', '113-conformance-statement')],
  },
  {
    id: 'G57', chapter: 'events', cat: 'A', verdict: 'into spec, merged with G48', target: 'AEP-0019 open question 1', title: 'Testing event-only workflows',
    problem: 'A workflow that reads `event.*` cannot be run conformingly without a real event: AEP-0004 makes `event.*` fail outside event runs, and a client-created run is always manual.',
    left: { check: null, lang: 'text', label: 'AEP-0004 and spec 10.8', code: `AEP-0004: A reference to event.* in an execution
that was not started by an event trigger is an
evaluation error (the step fails with reason
missingEvent).

10.8: A WorkflowRun created by a client is a
manual start.` },
    right: { code: `apiVersion: ${V3}
kind: WorkflowRun
metadata:
  generateName: chat-answer-test-
  namespace: agents
spec:
  workflowRef:
    name: chat-answer
  origin: replay    # marked as test; actor = creator
  event:
    type: message.mention
    data:
      message: What plays in Leipzig this week?
# Same spec.event as G48, validated against
# dataSchema.` },
    why: 'Found while writing the reference concept: an event-only workflow such as the chat workflow cannot be started with a sample event in a conforming way.',
    status: 'Open, merged with G48: the same `spec.event`, with the origin replay.',
    refs: [EVENTS, RUN],
  },

  // ---------------------------------------------------------------- step isolation
  {
    id: 'G47', chapter: 'isolation', cat: 'B', verdict: 'must', target: 'new AEP-0023 step isolation, the current draft', title: 'Manifest requirement versus deployment ceiling',
    problem: 'Operators restrict egress outside the manifest (NetworkPolicy, egress proxy, firewall). The draft does not say how `permissions.network` relates to such limits, or what happens when a runtime cannot enforce a rule. Without a `network` block, a manifest claims full egress.',
    left: { check: 'v2', label: 'v1alpha3 draft: valid, egress defaults to allow', code: `permissions:
  default: deny
  tools:
    shell.execute:
      allow: true
workflow:
  - id: fetch
    type: command
    command: ./fetch.sh
# no permissions.network: egress is allow (7.5.1)`, doc: workflow('fetch', `  permissions:
    default: deny
    tools:
      shell.execute:
        allow: true
  workflow:
    - id: fetch
      type: command
      command: ./fetch.sh`) },
    right: { code: `permissions:
  default: deny
  tools:
    shell.execute:
      allow: true
  network:              # a requirement the runtime enforces
    egress: deny        # default under security (AEP-0023)
    allowTo:
      - host: api.example.com
        ports: [{port: 443}]
workflow:
  - id: fetch
    type: command
    command: ./fetch.sh
# AEP-0023 7.5.9/7.5.10: a rule the runtime cannot
# enforce for a step type, or a destination above the
# platform ceiling -> reject before any execution.` },
    why: 'The proof of concept cannot restrict command-step egress by host name without a proxy and rejects such manifests. Namespaces that deny egress by default do not give what a manifest without `network` claims, so the concept writes `network` into every manifest.',
    status: 'Drafted in AEP-0023 (PR #25): enforce or reject (7.5.9), ceilings reject (7.5.10), `egress: deny` by default under security when `permissions` exist.',
    refs: [ISOLATION, PERMISSIONS, spec('5.6.2', '562-command-steps')],
  },
  {
    id: 'G49', chapter: 'isolation', cat: 'A', verdict: 'into spec', target: 'AEP-0023', title: 'allowHosts has no syntax',
    problem: '`allowHosts` is a list of "host names". Subdomain wildcards, ports, IP literals and CIDRs are not defined, so an allowlist cannot be carried from one runtime to another.',
    left: { check: 'v2', label: 'v1alpha3 draft: all valid, meaning open', code: `network:
  egress: deny
  allowHosts:
    - api.example.com
    - .example.org          # suffix match?
    - 10.0.0.0/8            # CIDR?
    - api.example.com:8443  # port?`, doc: workflow('fetch', `  permissions:
    network:
      egress: deny
      allowHosts:
        - api.example.com
        - .example.org
        - 10.0.0.0/8
        - api.example.com:8443
  workflow:
    - id: fetch
      agent: assistant
      task: Fetch the venue programs.`) },
    right: { code: `network:
  egress: deny
  allowTo:                  # AEP-0023 7.5.8, replaces allowHosts
    - host: api.example.com # exact host
      ports:
        - port: 8443
    - host: "*.example.org" # subdomains, not example.org
    - cidr: 10.0.0.0/8      # ranges; a single address is /32
      ports:
        - port: 8000
          endPort: 8080
# Objects as in network policy egress rules: no port
# in a string, so IPv6 with ports is unambiguous.` },
    why: 'The proof of concept enforces `allowHosts` with Squid and uses its notation `.example.org` and a CIDR mode. The concept marks both as runtime-specific until the spec defines a syntax.',
    status: 'Drafted in AEP-0023 (PR #25), revised after review from a string syntax to `allowTo` objects.',
    refs: [ISOLATION, PERMISSIONS, CONCEPT],
  },
  {
    id: 'G50', chapter: 'isolation', cat: 'B', verdict: 'must (security profile)', target: 'AEP-0023: private destinations denied by default after resolution, unless allowed explicitly', title: 'Allowed hosts that resolve to private addresses',
    problem: 'An allowed host name can resolve to loopback, private, link-local (cloud metadata) or CGNAT addresses. That opens server-side request forgery and DNS rebinding through an allowlist that looks harmless.',
    left: { check: 'v2', label: 'v1alpha3 draft today', code: `network:
  egress: deny
  allowHosts:
    - news.example.com
# If news.example.com resolves to 169.254.169.254,
# nothing in the draft forbids the connection.`, doc: workflow('news', `  permissions:
    network:
      egress: deny
      allowHosts:
        - news.example.com
  workflow:
    - id: read
      agent: assistant
      task: Summarize the news.`) },
    right: { code: `network:
  egress: deny
  allowTo:
    - host: news.example.com  # public; if it resolves to an
                              # internal address: denied
    - cidr: 10.20.0.0/16      # internal service: only a cidr
                              # entry opens it, and only if
                              # the platform ceiling allows it
# Security profile (AEP-0023 7.5.9): loopback, private,
# link-local and shared addresses are denied unless a
# cidr entry contains them; a host entry never does.
# The check applies to the address actually connected
# to. Normalising IPv4-mapped IPv6, NAT64 and 6to4 is
# informative implementer guidance.` },
    why: 'The tool proxy of the proof of concept had exactly this hole. It now checks the resolved address at connect time, which covers DNS rebinding by construction.',
    status: 'Drafted in AEP-0023 (PR #25). Not a blanket ban: a `cidr` entry within the platform ceiling opens an internal service. Open question 2 there: a `host` entry marked as internal for services addressed by name.',
    refs: [ISOLATION, PERMISSIONS, spec('12', '12-security-considerations')],
  },
  {
    id: 'G51', chapter: 'isolation', cat: 'C', verdict: 'informative', target: 'AEP-0023 informative section; G10 merges in', title: 'How network rules are enforced for command steps',
    problem: 'The draft requires runtimes to apply `permissions.network` to command steps but gives no guidance how. Kubernetes NetworkPolicy matches addresses, not host names (G10).',
    left: { check: null, lang: 'text', label: 'Spec 5.6.2 (v1alpha3 draft)', code: `Implementations MUST execute command steps in an
isolated environment (for example a container or
sandbox) and MUST apply permissions.network and
permissions.filesystem to it.

(No guidance on host-based rules.)` },
    right: { code: `# Informative: one conforming enforcement.
# A per-workload egress proxy with an allowlist
# derived from allowTo host entries, and a network policy
# that allows only that proxy:
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: fetch-egress
spec:
  podSelector:
    matchLabels:
      app: fetch-step
  policyTypes: [Egress]
  egress:
    - to:
        - podSelector:
            matchLabels:
              app: egress-proxy
# A runtime that cannot enforce a rule rejects
# the workflow.` },
    why: 'The proof of concept runs an egress proxy per agent workload, fed from `allowHosts`, and a NetworkPolicy that only allows that proxy. Without the proxy it rejects host-based rules for command steps (G47).',
    status: 'Informative implementer guidance in AEP-0023 (PR #25); G10 merges in, the rejection rule is 7.5.9.',
    refs: [spec('5.6.2', '562-command-steps'), PERMISSIONS],
  },

  {
    id: 'G61', chapter: 'isolation', cat: 'B', verdict: 'must (security profile)', target: 'AEP-0023 or spec 9, the current draft (not AEP-0008)', title: 'Where model credentials live',
    problem: 'The draft does not say where model credentials live. A runtime may hand the provider key to the agent step, where any command or injected instruction can read it.',
    left: { check: null, lang: 'text', label: 'Spec 5.4.3 and 7.9 (v1alpha3 draft)', code: `5.4.3: Provider identifiers are opaque strings;
their mapping to endpoints is
implementation-defined.

7.9: Runtimes MUST NOT pass secret values to
models [...].

(Nothing on whether the step environment may
hold the provider key.)` },
    right: { lang: 'text', code: `Security profile (proposed):

- Model credentials MUST NOT be visible in the
  step environment.
- The runtime calls the provider itself, or
- a proxy authenticates the step with a
  short-lived, execution-bound credential.` },
    why: 'The proof of concept enforces budgets in a model proxy. Whether the key stays there or reaches the step is not covered by the draft, and the proof of concept already found a provider key leak through a model `baseURL` in its binding.',
    status: 'Drafted in AEP-0023 (PR #25), together with tool server credentials (G69); the proxy design is informative implementer guidance. Not AEP-0008: its non-goals exclude credentials.',
    refs: [ISOLATION, spec('5.4.3', '543-model-object'), spec('7.9', '79-secrets')],
  },

  // ---------------------------------------------------------------- conversation, state, identity
  {
    id: 'G45', chapter: 'state', cat: 'C', verdict: 'informative', target: 'AEP-0024 informative section', title: 'No reply path',
    problem: 'A run started by a chat message should answer in the same thread. The manifest has no way to refer to where the event came from.',
    left: { check: null, lang: 'text', label: 'AEP-0004 (Review, not applied)', code: `event.source, event.type, event.id, event.time:
metadata of the event that started the execution;
event.data and event.data.<path>: the event
payload.

(No reply target or correlation data.)` },
    right: { code: `workflow:
  - id: reply
    type: command
    command: ./post-reply.sh
    env:
      THREAD: "\${{ event.data.thread }}"
# Correlation data in the event context; delivery
# stays with steps. Optionally a standard replyTo
# attribute (CloudEvents extension).` },
    why: 'The proof of concept delivers chat answers with a command step, which needs the thread of the triggering message from the event data.',
    status: 'Drafted in AEP-0024 (PR #24) as informative text. Becomes category A if AWP standardizes interaction event types.',
    refs: [EVENTS, CONCEPT],
  },
  {
    id: 'G46', chapter: 'state', cat: 'C now, A later', verdict: 'informative in the current draft', target: 'AEP-0024 informative; a standard shape after the current draft', title: 'Conversation context for event-triggered runs',
    problem: 'A reply in a thread (chat, ticket, mail) starts a run that sees only the triggering message. Follow-up questions lose the conversation.',
    left: { check: null, lang: 'text', label: 'AEP-0004 (Review, not applied)', code: `event.data is an untrusted external input. Its
classification enters the data classification of
every operation in a step that references it.

(event.data is the payload of one event; there is
no shape for earlier messages.)` },
    right: { code: `# event.data, attached by the source adapter (sketch)
message: And on Saturday?
thread:
  truncated: true            # capped, truncation flagged
  messages:
    - author: slauger
      bot: false
      time: "2026-11-20T09:12:00Z"
      text: What plays in Leipzig this week?
# Untrusted and classified like the rest of
# event.data. Participants are personal data.` },
    why: 'In the proof of concept the chat bridge attaches the earlier messages of the thread to the event. Every source with conversations needs the same, so a common shape keeps workflows independent of the source.',
    status: 'Informative in the current draft. Normative only: thread context belongs to `event.data`, is untrusted and classified, and contains personal data. A standard shape later, after the current draft.',
    refs: [EVENTS, CONCEPT],
  },
  {
    id: 'G53', chapter: 'state', cat: 'A', verdict: 'into spec', target: 'new AEP-0025 state, with G03 and G58', title: 'State shared by two workflows',
    problem: 'Two workflows of one owner share state: a daily run writes what it reported, a chat run reads and writes preferences. AWP has no state at all (G03), let alone shared state.',
    left: { check: 'v2', label: 'v1alpha3 draft: valid, state invisible', code: `permissions:
  filesystem:
    read: [/state]
    write: [/state]
# The volume behind /state comes from the runtime
# binding. AWP sees neither its class nor its
# retention, nor that another workflow writes it.`, doc: workflow('daily-scout', `  permissions:
    filesystem:
      read: [/state]
      write: [/state]
  workflow:
    - id: scout
      agent: assistant
      task: Find new concerts.`) },
    right: { code: `# workflow daily-scout
spec:
  state:
    - name: music-taste
      access: readWrite
---
# workflow chat-answer
spec:
  state:
    - name: music-taste
      access: readWrite   # or read
# The state resource itself (G03): name,
# classification, retention. Rules for concurrent
# writers; the strictest classification applies to
# every reader. Shape illustrative.` },
    why: 'Derived from the scenario, no conflict observed: the concert scout and the chat workflow of the proof of concept would share already reported concerts and taste preferences.',
    status: 'Drafted in AEP-0025 (PR #24), with G03 and G58; shared stores need equal retention and size.',
    refs: [spec('7.5', '75-tool-governance-permissions'), CONCEPT],
  },
  {
    id: 'G55', chapter: 'state', cat: 'A + C', verdict: 'into spec', target: 'AEP-0012, likely after the current draft', title: 'The external identity a step acts as',
    problem: 'A workflow that posts as its own bot account acts under an external identity. The manifest shows only a secret, and governance sees `shell.execute` (G06).',
    left: { check: 'v2', label: 'v1alpha3 draft today', code: `secrets:
  - name: BOT_TOKEN
    source: secret-manager
    scope: [command]
workflow:
  - id: notify
    type: command
    command: ./post.sh
# Governance sees shell.execute; the message goes
# out as the bot account behind BOT_TOKEN.`, doc: workflow('notify', `  secrets:
    - name: BOT_TOKEN
      source: secret-manager
      scope: [command]
  workflow:
    - id: notify
      type: command
      command: ./post.sh`) },
    right: { code: `workflow:
  - id: notify
    type: tool              # AEP-0012 (Draft)
    agent: notifier
    tool:
      server: chat
      name: post_message
    args:
      text: "\${{ steps.curate.outputs.summary }}"
    # plus the external identity the step acts as,
    # for audit events and policies (shape open)` },
    why: 'The notify step of the proof of concept sends a Telegram message as its own bot account (G06). Audit events show a shell command, not the account that spoke.',
    status: 'Open. The declaration of the identity is category A; the token or bot account behind it is platform (C).',
    refs: [TOOLSTEPS, spec('7.9', '79-secrets')],
  },
  {
    id: 'G58', chapter: 'state', cat: 'B, later A', verdict: 'editorial now', target: 'spec 12 now; origin marking later in AEP-0025 (G11)', title: 'State as untrusted input',
    problem: 'What one execution writes into state, the next reads as data. A chat message or a web page can become a persistent instruction (memory poisoning).',
    left: { check: null, lang: 'text', label: 'Spec 12 (v1alpha3 draft)', code: `Prompt injection. Tool results and remote agent
messages are untrusted input.

(State is not listed; there is no state.)` },
    right: { code: `spec:
  state:
    - name: music-taste
      access: readWrite
      # origin marking as proposed in G11
      # (outputs[].trust: external), applied to state:
      # state is untrusted input by default` },
    why: 'Seen in the chat workflow of the proof of concept: what a chat message put into state reached later runs as data.',
    status: 'Editorial now: add state to the untrusted inputs in spec 12. Origin marking (G11) comes later with the state AEP.',
    refs: [spec('12', '12-security-considerations'), CONCEPT],
  },

  // ---------------------------------------------------------------- models
  {
    id: 'G59', chapter: 'models', cat: 'A', verdict: 'into spec', target: 'AEP-0008, after the current draft; with G34, which could come earlier, in the current draft', title: 'Catalog limits are binding',
    problem: 'AEP-0008 treats `contextTokens` and `maxOutputTokens` as informative. A runtime may ask for more output tokens than the model allows, and the provider rejects the request.',
    left: { check: null, label: 'AEP-0008 (Review, targets v1alpha3)', code: `providers:
  - id: on-prem
    region: on-premise
    models:
      - name: example-local
        price: { inputPerMTok: 0, outputPerMTok: 0 }
        maxOutputTokens: 8192   # informative limit` },
    right: { code: `providers:
  - id: on-prem
    region: on-premise
    models:
      - name: example-local
        price: { inputPerMTok: 0, outputPerMTok: 0 }  # known cost
        maxOutputTokens: 8192   # binding
# The runtime caps requested output tokens at
# maxOutputTokens and rejects a workflow whose
# budget or settings cannot fit.` },
    why: 'A vLLM server rejected every request of the proof of concept until the runtime capped output tokens at the model limit. Its provider profiles confirm the split of AEP-0008: prices and limits in the catalog, endpoint, protocol and credentials in runtime configuration. Price 0 for local models counts as known (G35).',
    status: 'Input to AEP-0008, after the current draft. G34 (`model.parameters.maxOutputTokens`) could come earlier, in the current draft.',
    refs: [CATALOG, CONCEPT],
  },
  {
    id: 'G60', chapter: 'models', cat: 'A', verdict: 'minor', target: 'AEP-0008, after the current draft', title: 'Model capabilities',
    problem: 'An agent step needs a model that can call tools (`complete_step` and declared tools). Very small models call tools without arguments or not at all, and that shows only at run time.',
    left: { check: null, label: 'AEP-0008 (Review, targets v1alpha3)', code: `models:
  - name: example-tiny
    price: { inputPerMTok: 0, outputPerMTok: 0 }
    contextTokens: 32768
# No way to say whether the model supports tool calls.` },
    right: { code: `models:
  - name: example-tiny
    price: { inputPerMTok: 0, outputPerMTok: 0 }
    contextTokens: 32768
    toolUse: false          # optional capability flags
    structuredOutput: false
# A runtime rejects an agent with tools on a model
# without tool support, before the execution starts.` },
    why: 'A 0.6B local model in the proof of concept called `complete_step` without arguments or not at all; the failure showed only at run time. Since PR #24 also evidence from a coding agent engine: it needs context size, output limit and input types (image, document) from the catalog, otherwise it does not compact the context or rejects input.',
    status: 'Input to AEP-0008, after the current draft.',
    refs: [CATALOG, spec('5.4.3', '543-model-object')],
  },
  // ---------------------------------------------------------------- isolation (PR #25 additions)
  {
    id: 'G64', chapter: 'isolation', cat: 'B', verdict: 'must (security profile)', target: 'AEP-0023, credentials and approvals outside the execution environment (PR #25)', title: 'Approval authority inside the execution environment',
    problem: 'Confirmations and approvals are only worth something if the step cannot give them itself. The draft does not say where the component that asks for and records a decision runs.',
    left: { check: null, lang: 'text', label: 'Spec 7.6 and 7.8 (v1alpha3 draft)', code: `7.6: approvers are identities of people;
an agent can never approve.

7.8: separation of duties between the
initiator and the approver.

(Nothing on where the decision is taken,
or whether the step can reach it.)` },
    right: { lang: 'text', code: `AEP-0023 (proposed, security profile):

- Approvals and confirmations are decided
  OUTSIDE the execution environment, from an
  authenticated identity, over a channel the
  environment cannot reach; nothing that
  carries a decision is readable inside.
- What LEAVES the environment is enforced
  outside: model calls, tool server calls,
  network, pushes, approvals.
- What stays inside (local commands, file
  changes) is bounded by the isolation
  class; the engine's own permission system
  is an additional check, not enforcement.` },
    why: 'Shown in the proof of concept: the coding agent and its commands shared a user ID, a command read the agent server password from the process environment, and a process in the sandbox sent a prompt in autonomous mode and answered every permission request itself. The attack failed only after the decision moved to a separate container with its own process namespace and signed grants; the same command through the console asked once and ran after "allow once".',
    status: 'Drafted in AEP-0023 (PR #25). Open questions 4 and 5 there: its own AEP, since it also applies to approval steps without a sandbox; separation of duties against the authenticated identity. The decision component is informative implementer guidance.',
    refs: [ISOLATION, spec('7.6', '76-human-approval'), FEEDBACK10],
  },
  {
    id: 'G67', chapter: 'isolation', cat: 'A + B', verdict: 'should', target: 'AEP-0023, `agents[].isolation` (PR #25)', title: 'The manifest cannot require an isolation class',
    problem: 'An agent that runs commands on untrusted repositories needs more than a container (a user-space kernel or a virtual machine). The manifest cannot ask for it; the choice sits in a runtime binding that reviewers do not see.',
    left: { check: null, lang: 'text', label: 'Spec 5.6.2 (v1alpha3 draft)', code: `Command steps run in an isolated
environment.

(No field on an agent or step to require
a minimum isolation; how isolated is
implementation-defined.)` },
    right: { code: `agents:
  - id: reviewer
    isolation: sandbox   # process < container < sandbox < vm
    model:
      provider: example-provider
      name: example-model
# A minimum: a runtime runs it with at least this
# class or rejects the manifest; a stronger class is
# no deviation. Which mechanism provides "sandbox"
# (gVisor, ...) is platform configuration.` },
    why: 'The proof of concept keeps the runtime class in a sandbox profile referenced from its binding, outside the reviewed manifest. The mapping is implemented; only `container` is deployed, so no stronger class is shown.',
    status: 'Drafted in AEP-0023 (PR #25). Open question 3 there: four classes, and whether `sandbox` should be defined by a property instead of an example.',
    refs: [ISOLATION, FEEDBACK10],
  },
  {
    id: 'G68', chapter: 'isolation', cat: 'B', verdict: 'should', target: 'AEP-0023, section 7.5.10 (PR #25)', title: 'Do ceilings reject or cap?',
    problem: 'AEP-0023 defines a network ceiling but not the rule for other ceilings. A platform limits models, tool servers, autonomy, isolation and cost per tenant; whether a manifest that asks for more is rejected or silently reduced is undefined.',
    left: { check: null, lang: 'text', label: 'AEP-0023 as first drafted (PR #19)', code: `7.5.6: effective network = manifest
intersected with the platform ceiling;
reject if the manifest needs more.

(Models, tool servers, autonomy,
isolation and budgets: not covered.)` },
    right: { lang: 'text', code: `AEP-0023 7.5.10 (proposed):

A ceiling never changes a manifest.
- Anything above a ceiling (model, tool
  server, destination, autonomy, isolation
  the platform cannot provide, budget)
  -> reject before start, ceilingExceeded.
- Under a budget ceiling the manifest MUST
  declare the limit; missing -> reject.
- A stronger isolation class than required
  is no deviation.
- Spec 5.7 "MAY enforce stricter limits"
  becomes "MUST reject".` },
    why: 'Partly shown in the proof of concept: models, hosts and MCP servers outside the tenant ceiling make the agent invalid in that tenant. A cost limit above the ceiling is still lowered to it, unlike the revised proposal: silent changes make the run differ from the reviewed manifest.',
    status: 'Drafted in AEP-0023 (PR #25), revised after review: reject everything, budgets included. Open question 1 there: how authors see ceilings before they apply.',
    refs: [ISOLATION, FEEDBACK10],
  },
  {
    id: 'G69', chapter: 'isolation', cat: 'B', verdict: 'should (security profile)', target: 'AEP-0023, credentials outside the execution environment (PR #25)', title: 'MCP credentials reach the agent',
    problem: '`auth.secretRef` of an MCP server hands the credential to the MCP client. When the client is a coding agent inside the sandbox, the agent and every command it runs can read the credential.',
    left: { check: null, lang: 'text', label: 'Spec 5.5.1 and 7.9 (v1alpha3 draft)', code: `mcpServers:
  - name: code-scanner
    auth:
      secretRef: scanner-token
# 7.9: the secret's scope may name the server;
# the runtime gives it to whatever talks to
# the server, possibly the step itself.` },
    right: { lang: 'text', code: `AEP-0023 (proposed, security profile):

- Model and tool server credentials MUST NOT
  be visible to a step (environment, files,
  arguments).
- auth of an MCP server MAY be satisfied by
  the runtime instead of a manifest secret.

Implementer guidance (informative): a gateway
outside the step adds the credential,
authenticates the step with a short-lived
ticket and enforces tool permissions.` },
    why: 'Shown in the proof of concept: a static analysis server over MCP is reachable only through the MCP gateway of the runtime (network policy); the gateway accepts a session ticket or a step ticket, adds the credential, hides uncatalogued tools, counts calls against the budget and audits arguments and results.',
    status: 'Drafted in AEP-0023 (PR #25); the gateway design is informative implementer guidance.',
    refs: [ISOLATION, TOOLSRC, SECRETS],
  },
  // ---------------------------------------------------------------- interactive execution
  {
    id: 'G62', chapter: 'sessions', cat: 'A', verdict: 'must', target: 'new AEP-0026, a small concept (PR #26, number to be confirmed)', title: 'No interactive execution form',
    problem: 'A session has no task and no outputs: a person sends prompts for hours, the session pauses when idle, resumes, and ends when the person stops it. Its lifecycle, budget scope and audit events are undefined; spec 6 only allows a single agent as a workflow with one step.',
    left: { check: null, lang: 'text', label: 'Spec 6 (v1alpha3 draft)', code: `An Agent manifest cannot be executed on
its own. Runtimes MAY offer a way to run a
single agent; they MUST then treat it as a
workflow with one agent step and the
agent's budget and permissions.` },
    right: { code: `apiVersion: awp.agenticworkflowprotocol.org/v1alpha3
kind: AgentSession              # sibling of WorkflowRun
metadata:
  generateName: security-review-
spec:
  agentRef:
    name: security-reviewer     # needs spec.sessions on the Agent
  autonomy: ask
  toolSources: [code-scanner]
  initialPrompt: Review the repository for injection flaws.
status:
  phase: waiting                # a confirmation is pending
  autonomy: ask
# One session is one execution: permissions, the
# budget (summed across pauses) and audit apply.` },
    why: 'Shown in the proof of concept: its own session object, treated as one execution for permissions, budget and audit; pause on idle, resume, stop; runtime events for created, ready, idle, resumed and "waiting for a person".',
    status: 'Drafted as the concept AEP-0026 (PR #26). Open questions there: events (8), time limits (9), naming (7).',
    refs: [SESSIONS, AGENTKIND, FEEDBACK10],
  },
  {
    id: 'G63', chapter: 'sessions', cat: 'A', verdict: 'must', target: 'AEP-0026: autonomy levels and `maxAutonomy`; `confirm` per action is open question 1', title: 'Only allow or deny, no "ask"',
    problem: 'In a session a person confirms single tool calls and switches between read-only, confirm-each-call and autonomous. The draft has neither a confirmation effect, nor a way for the author to forbid autonomy, nor audit events for confirmations and mode changes.',
    left: { check: null, lang: 'text', label: 'Spec 7.5.1 (v1alpha3 draft)', code: `permissions:
  tools:
    git.push:
      allow: true     # allow: true or false only
# Approvals (7.6) are steps with approvers;
# human input (5.8) is information, not a
# decision.` },
    right: { code: `# Agent manifest (AEP-0026, proposed)
spec:
  sessions:
    maxAutonomy: ask          # readOnly | ask | auto
  permissions:
    default: deny
    tools:
      code-scanner.scan:
        allow: true
# readOnly: changing actions denied, others ask
# ask: every allowed action asks
# auto: allowed actions run without asking
# Selecting auto here is rejected (above maxAutonomy).
# Open question: confirm: always | never per action.` },
    why: 'Shown in the proof of concept: modes plan, ask and auto, switched in the console only by people who may control the session, each change audited; confirmations once, for the session, or refuse. The binding, not the author, decides whether auto exists; `confirm` per action and the author ceiling are not built.',
    status: 'Drafted in AEP-0026 (PR #26). Open questions 1 and 2 there: `confirm` per action and a grant for the rest of the session.',
    refs: [SESSIONS, PERMISSIONS],
  },
  {
    id: 'G73', chapter: 'sessions', cat: 'A', verdict: 'should', target: 'spec 5.5, AEP-0026 `toolSources`', title: 'Tool sources per execution',
    problem: 'Every execution of an agent gets all of its tool sources. A person cannot enable only some of them for one session (reach the code host, not the ticket system) without a second reviewed manifest.',
    left: { check: null, lang: 'text', label: 'Spec 5.5 (v1alpha3 draft)', code: `tools: the tool sources of the agent,
fixed in the manifest. Every execution
gets every source.` },
    right: { code: `kind: AgentSession
spec:
  agentRef: { name: assistant }
  toolSources: [code-host]   # by server or name; absent: all
# Never more than the agent declares. Calls to a
# source that is not enabled are refused.` },
    why: 'Shown in the proof of concept: a session selects a subset of the agent MCP servers; the MCP gateway refuses the others; a name that is no tool source is ignored and reported; a change on a running session needs a restart and is reported as a condition.',
    status: 'Drafted in AEP-0026 (PR #26).',
    refs: [SESSIONS, TOOLSRC],
  },
  {
    id: 'G82', chapter: 'sessions', cat: 'A', verdict: 'should', target: 'AEP-0026 `sessions.models`, spec 7.4', title: 'One model per agent',
    problem: 'An agent has exactly one model. Sessions pick a small model for questions and a large one for refactoring, from alternatives that the agent and the platform allow.',
    left: { check: null, lang: 'text', label: 'Spec 5.4.3 (v1alpha3 draft)', code: `model: one model object per agent.` },
    right: { code: `spec:
  model: { provider: example-provider, name: example-model }
  sessions:
    models:
      - { provider: example-provider, name: example-model-large }
# AgentSession.spec.model picks model or one of
# sessions.models; anything else is rejected, and so
# is a model outside the platform ceiling.` },
    why: 'Implemented in the proof of concept: model alternatives per binding and tenant, a model per session.',
    status: 'Drafted in AEP-0026 (PR #26).',
    refs: [SESSIONS, spec('7.4', '74-model-governance')],
  },
  {
    id: 'G84', chapter: 'sessions', cat: 'A', verdict: 'should', target: 'AEP-0026 open question 4 (PR #26)', title: 'Questions of the agent during a session',
    problem: 'A coding agent asks the person questions while it works. Who may answer in a session, and what happens without a person, is undefined.',
    left: { check: null, lang: 'text', label: 'Spec 5.8.2 (v1alpha3 draft)', code: `humanInput on an agent: answerers,
timeout, onTimeout, maxRequests.
(Written for workflow steps.)` },
    right: { lang: 'text', code: `AEP-0026 open question 4:
Human input requires answerers; in a session
the person is there. Does the question tool
exist without humanInput?

Proposal sketch: requests go to the
identities that may control the session; an
answer is never a confirmation or approval.` },
    why: 'Implemented in the proof of concept: question cards with choices and free text, each answer audited; `humanInput` on session agents is rejected; MCP elicitation is declined at the gateway.',
    status: 'Open question 4 of AEP-0026 (PR #26). An amendment to AEP-0017 was drafted and dropped when the concepts were cut down.',
    refs: [SESSIONS, HUMAN, spec('5.8', '58-human-input')],
  },
  {
    id: 'G85', chapter: 'sessions', cat: 'A', verdict: 'should', target: 'open question 5 of AEP-0026; AEP-0009', title: 'History after a session ends',
    problem: 'After a session ends, the engine is gone. What is kept of history, decisions and diff, for how long, and who may read it is undefined.',
    left: { check: null, lang: 'text', label: 'Spec 10.2 (v1alpha3 draft)', code: `audit.payload: metadata or full;
one retention for everything.` },
    right: { lang: 'text', code: `Open (AEP-0026 question 5, AEP-0009):
what is kept (history, workspace, diff), for
how long, who may read it.

Proposal sketch: history is content under
contentRetention; read access for those who
could control the session and auditors.` },
    why: 'In progress in the proof of concept: an archive of the transcript; people asked to see stopped sessions.',
    status: 'Open question 5 of AEP-0026 and open point in AEP-0009 (PR #26).',
    refs: [AUDIT, SESSIONS],
  },
  {
    id: 'G86', chapter: 'sessions', cat: 'A', verdict: 'should', target: 'AEP-0024 with G44 and G48', title: 'Actor of a session started by an event',
    problem: 'An event could start a session with an initial prompt. Who created it and who may control it: the bridge that sent the event, or the person who wrote the message?',
    left: { check: null, lang: 'text', label: 'Spec 5.2 (v1alpha3 draft)', code: `Event starts have the actor type system.` },
    right: { lang: 'text', code: `As G44: the attested person is the creator
and may control the session; the bridge is
recorded as the authenticated source.` },
    why: 'Concept only in the proof of concept; not built.',
    status: 'Evidence paragraph in AEP-0024 (PR #24); open question 6 of AEP-0026 (PR #26).',
    refs: [TRIGGERAEP, SESSIONS],
  },
  // ---------------------------------------------------------------- agent engine
  {
    id: 'G65', chapter: 'engine', cat: 'A', verdict: 'must', target: 'new AEP-0027, a small concept (PR #26, number to be confirmed)', title: 'No field for the engine of an agent',
    problem: 'A coding agent brings its own tool loop. No field says which engine runs an agent, what it receives and produces, how permissions map to it, or whether its subagents share permissions and budget. A runtime without the engine would run a different loop and still report success.',
    left: { check: null, lang: 'text', label: 'v1alpha3 draft: only an extension field', code: `agents:
  - id: scanner
    extensions:
      x-example-engine:       # runtime-specific;
        type: coding-agent    # ignored elsewhere
        repositories: [...]` },
    right: { code: `agents:
  - id: scanner
    engine:                   # AEP-0027, profile engine
      type: example.com/coding-agent   # unknown -> reject
      workspace:
        repositories:
          - url: https://git.example.com/app.git   # fixed
            ref: main
            path: repo
# Permissions, budget and audit stay in force;
# unattended: allow or deny only; subagents share
# budget and permissions. Open: push, outputs,
# repositories from events, runtimeProfile.` },
    why: 'Shown in the proof of concept: a security scan workflow ran its review step with a coding agent as engine, started by hand and by a CloudEvent; the engine called a static analysis server through the MCP gateway with a step ticket, and the calls counted against the run budget.',
    status: 'Drafted as the concept AEP-0027 (PR #26). Open questions there: push (3), registry (4), failure semantics (6), runtime profile (7). Until applied: `extensionRef` under AEP-0021 B3.',
    refs: [ENGINE, EXT],
  },
  {
    id: 'G66', chapter: 'engine', cat: 'A', verdict: 'should', target: 'AEP-0027 open questions 1 and 2, with AEP-0003 and AEP-0018', title: 'Engine steps are dead ends',
    problem: 'The engine produces only a summary and a diff, so a step cannot declare `critical` and `high` for a following condition. Its repositories are fixed, so an event cannot say which repository to scan.',
    left: { check: null, lang: 'text', label: 'Proof of concept today', code: `outputs: [summary, diff] only.
A step declaring critical or high is
rejected. Repositories fixed in the
extension.` },
    right: { code: `# Open questions of AEP-0027, sketch:
engine:
  type: example.com/coding-agent
  workspace:
    repositories:
      - url: \${{ event.data.repository }}  # needs a clone
        ref: \${{ event.data.ref }}         # credential bound
outputs:                                     # to a host pattern
  - name: critical
    type: integer       # filled by complete_step (AEP-0018)
  - name: high
    type: integer       # typed (AEP-0003)` },
    why: 'Shown in the proof of concept: validation rejects outputs `report`, `critical` and `high` of the scan step; the scanned repository is fixed.',
    status: 'Open questions 1 and 2 of AEP-0027 (PR #26): outputs through AEP-0018, and repositories from events, which would need a clone credential bound to a host so that a sender cannot redirect it.',
    refs: [ENGINE, aep('0003', 'typed-handoffs'), aep('0018', 'step-outputs')],
  },
  {
    id: 'G81', chapter: 'engine', cat: 'A', verdict: 'must', target: 'AEP-0027 `trustRepositoryConfig`, spec 12', title: 'Repository content as instructions',
    problem: 'Repositories bring agent instruction files, skills, custom commands and tool manager configuration that sets environment variables. A coding agent loads them by default, so a pull request can change what the agent does and run code at start.',
    left: { check: null, lang: 'text', label: 'Spec 12 (v1alpha3 draft)', code: `Tool results, web content and state are
untrusted input.

(Configuration loaded from the workspace
is not mentioned.)` },
    right: { code: `engine:
  type: example.com/coding-agent
  workspace:
    trustRepositoryConfig: []   # default: none
    # allowed kinds: instructions, skills,
    # commands, toolchain; loaded kinds are
    # untrusted input and grant nothing` },
    why: 'Implemented in the proof of concept: project configuration and external skills of the coding agent are disabled for sessions and engine steps.',
    status: 'Drafted in AEP-0027 (PR #26).',
    refs: [ENGINE, spec('12', '12-security-considerations')],
  },
  {
    id: 'G83', chapter: 'engine', cat: 'A + B', verdict: 'should', target: 'AEP-0027, with G12', title: 'Workspace repositories and their credentials',
    problem: 'A session or engine step clones several repositories, some private. If the clone credential stays in the workspace or the environment, the engine and every command can read it. Extends G12 (where command code comes from).',
    left: { check: null, lang: 'text', label: 'v1alpha3 draft', code: `(No workspace field; where code comes from
is implementation-defined, G12.)` },
    right: { lang: 'text', code: `AEP-0027 (proposed):
- engine.workspace.repositories with a fixed
  url, ref, path; the start commit is
  recorded.
- Clone credentials are workflow secrets;
  under security they are not visible to
  the engine.
- Push: open question 3.` },
    why: 'Implemented in the proof of concept: clone credentials per repository, deleted after the session is ready, push through the console. Private repositories are not shown on the test installation.',
    status: 'Drafted in AEP-0027 (PR #26); push is open question 3 there.',
    refs: [ENGINE, SECRETS],
  },
  {
    id: 'G87', chapter: 'engine', cat: 'A', verdict: 'should', target: 'AEP-0025', title: 'Shared workspace of several steps',
    problem: 'Steps that plan, implement and review the same change need one workspace, as Tekton workspaces provide. Each engine step gets its own empty directory today.',
    left: { check: null, lang: 'text', label: 'v1alpha3 draft', code: `(No shared workspace between steps.)` },
    right: { lang: 'text', code: `A declared store with an access mode per
step (AEP-0025), and the trust boundary in
spec 12: a later step reads what an earlier
agent wrote.` },
    why: 'Concept: asked for during the proof of concept; not built.',
    status: 'Evidence paragraph in AEP-0025 (PR #24).',
    refs: [STATE],
  },
  // ---------------------------------------------------------------- tool sources, MCP and audit
  {
    id: 'G70', chapter: 'tools', cat: 'A', verdict: 'should', target: 'AEP-0007 open question 6 (PR #26)', title: 'Resolving MCP servers from runtime configuration',
    problem: 'Spec 5.5.1 lets a runtime resolve a server from its own configuration, but not in which order, whether a declaration may be partial, or whether the runtime may substitute a different server of the same name.',
    left: { check: null, lang: 'text', label: 'Spec 5.5.1 (v1alpha3 draft)', code: `A runtime MAY resolve servers that the
manifest does not declare from its own
configuration.` },
    right: { lang: 'text', code: `AEP-0007 open question 6, sketch:
order: declaration, binding, catalog;
a declaration and the resolved server
(transport, URL, catalog digest) MUST NOT
contradict -> reject, never substitute;
a platform ceiling MAY restrict servers.` },
    why: 'Implemented in the proof of concept (integration tests): resolution by name against a cluster-wide catalog, name mapping in the binding, tenant ceiling.',
    status: 'Open question 6 of AEP-0007 (PR #26); the ceiling for servers is AEP-0023 7.5.10.',
    refs: [MCP, TOOLSRC],
  },
  {
    id: 'G71', chapter: 'tools', cat: 'A', verdict: 'should', target: 'AEP-0007 rule 11 (PR #26)', title: 'Tools a server adds after the review',
    problem: '`server.*` also allows tools that the server adds after the manifest was reviewed. In an unattended step nobody sees them run, so a read-only use case grows into write access when the server ships a delete tool.',
    left: { check: null, lang: 'text', label: 'Spec 5.5.3 (v1alpha3 draft)', code: `permissions:
  tools:
    code-host.*:
      allow: true   # every tool, also future ones` },
    right: { lang: 'text', code: `AEP-0007 (proposed):
- unattended executions SHOULD list tools
  explicitly (rule 11);
- <server>.* grants only catalogued tools
  (rule 3: uncatalogued tools are not
  exposed);
- tool annotations are not authority.` },
    why: 'Shown in the proof of concept: the catalog entry of a static analysis server leaves out two of its tools; the MCP gateway neither lists them nor lets them be called.',
    status: 'Amendment in AEP-0007 (PR #26).',
    refs: [MCP, PERMISSIONS],
  },
  {
    id: 'G72', chapter: 'tools', cat: 'A', verdict: 'should', target: 'AEP-0007 rules 7, 9, 10 (PR #26); answers its open question 3', title: 'MCP prompts, resources and server requests',
    problem: 'MCP servers also offer prompts and resources, and may send sampling, roots and elicitation requests. The draft restricts only tools. A coding agent shows every server prompt as a command, so content of the server operator reaches the model without any manifest rule.',
    left: { check: null, lang: 'text', label: 'Spec 5.5.2 and 5.8.2 (v1alpha3 draft)', code: `tools: a tool source may restrict tools.
Elicitation is declined without
humanInput.
(Prompts, resources, sampling, roots:
not covered.)` },
    right: { code: `mcpServers:
  - name: code-scanner
    catalog:
      tools:
        scan: { access: read }
      prompts:                       # default: none
        security-check: {}
      resources:                     # default: none
        - uriTemplate: rules://{ruleset}
# prompts/get = code-scanner.prompts.get (a tool named
# prompts.get or resources.read is rejected); prompt
# content is untrusted input. Sampling and roots are
# always declined (opt-in: open question 5).` },
    why: 'Shown in the proof of concept: the catalog allows one prompt and the rule resources of a static analysis server; the gateway filters the list operations, refuses everything else, and answers sampling, roots and elicitation itself.',
    status: 'Amendment in AEP-0007 (PR #26).',
    refs: [MCP],
  },
  {
    id: 'G74', chapter: 'tools', cat: 'A', verdict: 'should', target: 'AEP-0002, new section 7.5.7 (PR #26)', title: 'Resource scope of shell commands',
    problem: 'Spec 7.5.2 asks runtimes to document how they derive the resource of a call, but names no format for `shell.execute`. A command line chains, substitutes and nests commands, so `echo *` could also run `echo a; id`.',
    left: { check: 'v2', label: 'v1alpha3 draft (valid, meaning undefined)', code: `apiVersion: awp.agenticworkflowprotocol.org/v1alpha3
kind: Workflow
metadata:
  name: shell-scope
spec:
  version: 0.1.0
  owner:
    team: music-fans
  permissions:
    default: deny
    tools:
      shell.execute:
        allow: true
        resources: ["git *", "ls *", "echo *"]
  agents:
    - id: assistant
      model:
        provider: ollama
        name: qwen3
  workflow:
    - id: run
      agent: assistant
      task: List the repository.` },
    right: { lang: 'text', code: `AEP-0002 7.5.7 (proposed):
- resources of a line = its simple commands
- every simple command must match a pattern
- lines that cannot be split ($(...), subshells,
  compound commands, leading assignments) are
  denied
- actionGroups entries {action, resources}
  map commands to well-known actions, so
  rules on git.push apply to "git push":
    git.push:
      - action: shell.execute
        resources: ["git push*"]
- an allow list does not restrict what an
  allowed program runs (make, npm test)

echo hello        -> allowed
git --version     -> allowed
echo a; id        -> denied (id)
echo $(id)        -> denied (substitution)
curl https://...  -> denied` },
    why: 'Shown in the proof of concept with exactly these patterns: `echo` and `git --version` ran; `curl`, `echo a; id` and `echo $(id)` were refused by a component outside the sandbox, and the model saw the reason.',
    status: 'Amendment in AEP-0002 (PR #26).',
    refs: [ARGS, PERMISSIONS],
  },
  {
    id: 'G75', chapter: 'tools', cat: 'A', verdict: 'minor', target: 'AEP-0005 amendment (PR #26)', title: 'Reusable prompts outside workflow steps',
    problem: 'People repeat the same requests (a security review, writing tests). The draft knows tasks only as workflow steps and agents only with standing instructions.',
    left: { check: null, lang: 'text', label: 'v1alpha3 draft', code: `task: on a workflow step
instructions / promptRef: on an agent
(No prompt a person starts in a session.)` },
    right: { code: `apiVersion: awp.agenticworkflowprotocol.org/v1alpha3
kind: Prompt
metadata:
  name: security-review
spec:
  version: 1.0.0
  role: user                    # offered as a session task
  template: Review {{ scope }} for injection flaws.
  variables:
    - name: scope
      type: string
# Plain user input: runs with the session's
# permissions, budget and level, grants nothing.
# Open: title, fitting agents, suggested level.` },
    why: 'Implemented in the proof of concept: a namespaced prompt library offered to sessions as commands of the coding agent, tenant entries override platform entries; no versions or digests yet.',
    status: 'Amendment in AEP-0005 (PR #26); library fields are open there.',
    refs: [PROMPTS],
  },
  {
    id: 'G76', chapter: 'tools', cat: 'A + B', verdict: 'should', target: 'AEP-0009 rule 5 (PR #26)', title: 'Where audit events come from',
    problem: 'What an agent did can be recorded by the engine (inside, the agent can influence it), by the user interface (it sees only what the engine reports) or by a gateway outside that holds the credentials. The draft does not say which source counts.',
    left: { check: null, lang: 'text', label: 'Spec 10.3 and 10.4 (v1alpha3 draft)', code: `Which audit events exist and what they
contain. (Not who produces them.)` },
    right: { lang: 'text', code: `AEP-0009 rule 5 (proposed):
- every event carries origin: runtime or
  executionEnvironment;
- under security, events about what leaves
  the execution environment (model calls,
  tool server calls, approvals and
  confirmations) MUST have origin runtime;
- the outcome of an action inside (a shell
  command) keeps origin executionEnvironment;
- document which events cannot be verified.` },
    why: 'Shown in the proof of concept: conversations recorded at the model gateway with a hash chain per conversation, tool calls at the MCP gateway, egress at the tenant proxy; events of the coding agent joined by tool call id; all visible in the audit tab of the console.',
    status: 'Amendment in AEP-0009 (PR #26).',
    refs: [AUDIT],
  },
  {
    id: 'G77', chapter: 'tools', cat: 'A + C', verdict: 'should', target: 'open (5.5, 7.2); open point in AEP-0009', title: 'Data sent to tool servers',
    problem: 'A scan tool receives source code as an argument. Nothing says which data classes may go to which tool server (inside the cluster or external), and the tool server own egress is outside `permissions.network`.',
    left: { check: null, lang: 'text', label: 'AEP-0007 (catalog) and spec 7.2', code: `catalog tool entry: classification =
highest data class the tool may receive.
(Only per tool; nothing about who operates
the server or where its traffic goes.)` },
    right: { lang: 'text', code: `Sketch:
- allowed data classes per tool source,
  with the operator of the source;
- passed content logged with its own
  retention (open in AEP-0009);
- the server's own egress limited by the
  runtime and stated in the conformance
  statement (informative).` },
    why: 'Shown in the proof of concept: a security review sends the scanned file to a static analysis server; the arguments are in the audit, and the server reaches the internet only through its own proxy with an allow list for the rule registry.',
    status: 'Open; named as an open point in AEP-0009 (PR #26).',
    refs: [AUDIT, MCP, spec('7.2', '72-data-classification')],
  },
  {
    id: 'G78', chapter: 'tools', cat: 'B', verdict: 'should', target: 'AEP-0013 item 1 (PR #26)', title: 'Budgets during streaming',
    problem: 'Providers report usage only at the end of a streamed call. A runtime that stops at the limit has to estimate, so an execution can end slightly above `maxCostUsd`. The draft does not say whether that is allowed.',
    left: { check: null, lang: 'text', label: 'Spec 5.7 (v1alpha3 draft)', code: `The runtime MUST check limits before each
model invocation and each action.` },
    right: { lang: 'text', code: `AEP-0013 (proposed):
- estimates during a stream are allowed;
- the stream may be ended when the estimate
  reaches the remaining budget;
- charge the best known usage, mark it as an
  estimate;
- budgets are hard limits the last allowed
  call may exceed by what it used before the
  runtime could stop it.` },
    why: 'Implemented in the proof of concept: the model gateway estimates output tokens from the streamed text and ends the stream with an error event; the overshoot is not measured.',
    status: 'Amendment in AEP-0013 (PR #26).',
    refs: [CLARIFY, spec('5.7', '57-budgets-and-resources')],
  },
  {
    id: 'G79', chapter: 'tools', cat: 'A', verdict: 'should', target: 'spec 7.9, with G05 and G36', title: 'Secrets brought by a person at start',
    problem: 'In a session a person brings a credential of their own (a personal token, an API key for a test system) that no reviewer could list in the manifest. The draft can neither allow nor restrict this.',
    left: { check: null, lang: 'text', label: 'Spec 7.9 (v1alpha3 draft)', code: `secrets: declared in the manifest, bound
by the runtime. Values never reach models,
audit or logs.` },
    right: { lang: 'text', code: `Sketch:
secretsPolicy:
  allowRuntimeSecrets: true
  allowedSources: [...]
Secrets supplied at start fall under the
same MUSTs as declared ones.` },
    why: 'Shown in the proof of concept: a session adds usable secrets of its namespace as environment variables if template and tenant allow it; the model gateway replaces the value, so `token=$TOKEN` reaches the model as a placeholder.',
    status: 'Open, no AEP yet.',
    refs: [SECRETS],
  },
  {
    id: 'G80', chapter: 'tools', cat: 'A', verdict: 'minor', target: 'spec 7.9', title: 'Secret scope in a standalone Agent',
    problem: 'A secret scope lists MCP server names, agent ids or `command`. A standalone `Agent` has no agent id, and inside a workflow its id can differ from its name.',
    left: { check: null, lang: 'text', label: 'Spec 7.9 (v1alpha3 draft)', code: `scope: MCP server names, agent ids or
command.` },
    right: { lang: 'text', code: `scope: [self]   # the declaring agent,
                # wherever it is used
(or: metadata.name is the agent id)` },
    why: 'Implemented in the proof of concept: `metadata.name` is used as the id for sessions.',
    status: 'Open, no AEP yet.',
    refs: [SECRETS, AGENTKIND],
  },
];
