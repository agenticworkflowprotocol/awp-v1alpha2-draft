// Open runtime feedback after the v1alpha2 draft: gaps G41 to G61.
// Left: what the draft says today (v1alpha2 at b8a0ee8), right: the proposal from the runtime.
// `check` on the left works as in examples.mjs ('v2', 'v2-invalid' or null).
// The right side is always a proposal and never checked: it is not valid against the schema.

// Compared against the v1alpha3 draft on main (formerly the v1alpha2 draft, b8a0ee8; renamed by decision D20).
export const SPEC_REF = 'baac181';
const SPEC = `https://github.com/agenticworkflowprotocol/agenticworkflowprotocol.org/blob/${SPEC_REF}`;
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

// Assigned numbers; the AEP documents are drafts being written.
const ISOLATION = { label: 'AEP-0023 (draft in progress)' };
const TRIGGERAEP = { label: 'AEP-0024 (draft in progress)' };
const STATE = { label: 'AEP-0025 (draft in progress)' };

export const page = {
  version: 'v1alpha3', // shown in the top bar
  file: 'gaps.html',
  title: 'AWP v1alpha3: Open Runtime Gaps',
  description: 'Open gaps G41 to G61 found by a Kubernetes runtime proof of concept in the AWP v1alpha3 draft (formerly the v1alpha2 draft), classified by where they belong: AWP, an AWP rule enforced by the platform, or the platform only.',
  h1: 'Runtime feedback: open gaps in the v1alpha3 draft',
  lede: 'What a Kubernetes runtime proof of concept and a reference concept still miss in the v1alpha3 draft: {{count}} gaps, each with what the draft says today on the left, a sketch of the proposal on the right, and what happened in the proof of concept.',
  notice: 'These are <strong>proposals from one runtime</strong>, not accepted specification and not part of the draft. The classification, verdicts and targets are agreed between the runtime side and the spec side; the maintainer still decides. AEP-0023 to AEP-0025 are assigned numbers; the AEPs themselves are drafts being written. Everything is compared against the v1alpha3 draft on main (formerly the v1alpha2 draft, <code>b8a0ee8</code>): pull request #16 was merged as v1alpha3 by decision D20, v1alpha2 is now the step iteration draft (D19), and the side-by-side page still uses the old name. Gaps the draft already resolves (G01, G07, G08, G40) are on the <a href="./">side-by-side page</a>. Left snippets marked <span class="verified">valid</span> or <span class="verified">rejected by checker</span> were run through the reference checker; proposals are marked <span class="unchecked">not checked</span>, and their field names are sketches unless the source names them.',
  // Yardstick: where a gap belongs.
  yardstick: [
    { cat: 'A', text: 'Belongs in AWP: what a workflow needs and may do, and what its fields mean, portable across runtimes.' },
    { cat: 'B', text: 'An AWP rule enforced by the platform: the spec says "MUST enforce or reject" in one sentence and names no mechanism, so the platform picks it (NetworkPolicy, Istio, an egress proxy, an operator).' },
    { cat: 'C', text: 'Platform only: an implementation detail, at most an informative note.' },
  ],
  order: [
    'Now, in the current draft: apply AEP-0004 and amend AEP-0019 for its open question 1 (G48, G57). Small, and it unblocks event runs.',
    'AEP-0023 "Step isolation: network and credentials" (G10, G47, G49, G50, G51, G61). G50 and G61 are security holes, so early.',
    'AEP-0024 "Event triggers with CloudEvents" (G42 to G46, G54, G56), using AEP-0004 and AEP-0019; G52 through AEP-0021.',
    'AEP-0025 "State" (G03, G53, G58), once state is wanted in the current draft.',
    'Into existing AEPs: G52 into AEP-0021, G55 into AEP-0012, G59 and G60 into AEP-0008 (after the current draft), G34 earlier, in the current draft.',
    'Fix now: the `triggers[].source` row in AEP-0021 B4 (G54), and state as untrusted input in spec 12 (G58).',
  ],
  // Spec pull requests for the AEPs above, as { label, href }; links follow.
  pullRequests: [],
  decisions: [
    'Scope of the current draft for G44, for G47, G50 and G61, and for state (G03, G53).',
    'Whether G55 waits until after the current draft.',
  ],
  footer: 'Sources: the runtime feedback list of the proof of concept (gaps G41 to G61), the <a href="https://slauger.github.io/ai-agent-operations/awp-abgleich/">concept comparison</a> (German) and the draft in <a href="https://github.com/agenticworkflowprotocol/agenticworkflowprotocol.org/tree/main">agenticworkflowprotocol.org</a>. This page is generated from <a href="https://github.com/agenticworkflowprotocol/awp-v1alpha2-draft">awp-v1alpha2-draft</a>; corrections are welcome as issues or pull requests.',
};

export const chapters = [
  { id: 'events', title: 'Events and triggers', related: [EVENTS, RUN, TRIGGERAEP, EXT], intro: 'Event triggers exist in spec 5.2, but the event itself does not reach the execution, and filters, duplicates, actors and run objects for events are undefined. The proof of concept starts runs from chat mentions, webhooks and MQTT through an event router.' },
  { id: 'isolation', title: 'Step isolation: network and credentials', related: [ISOLATION, PERMISSIONS], intro: 'What `permissions.network` means and how its host list is written, how a platform enforces it, and where model credentials live. Covered by AEP-0023, together with G10.' },
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
    status: 'Open. Equality and AND are the portable floor; richer conditions stay in a runtime trigger object (G52) and may only narrow the filter.',
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
    status: 'Open. The manifest fields are category A; deduplication is category B: the spec states the rule, the platform implements it.',
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
    status: 'Open, raised from should to must. Spec 5.2 gives every event start the actor type `system`, which cannot hold together with an attested person.',
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
    status: 'Open. The other side of G43: at-least-once delivery needs deduplication, at-most-once loses events.',
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
    egress: deny        # default under the security profile?
    allowHosts:
      - api.example.com
workflow:
  - id: fetch
    type: command
    command: ./fetch.sh
# The deployment MAY restrict further. If its ceiling
# is narrower, or the rule cannot be enforced for a
# step type: reject before any execution.` },
    why: 'The proof of concept cannot restrict command-step egress by host name without a proxy and rejects such manifests. Namespaces that deny egress by default do not give what a manifest without `network` claims, so the concept writes `network` into every manifest.',
    status: 'Open. The rule "reject if the platform cannot enforce it" from G51 belongs here.',
    refs: [PERMISSIONS, spec('5.6.2', '562-command-steps')],
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
  allowHosts:
    - api.example.com       # exact host
    - "*.example.org"       # subdomains
    - api.example.com:8443  # optional port
# Whether IP literals and CIDRs are allowed:
# to be decided.` },
    why: 'The proof of concept enforces `allowHosts` with Squid and uses its notation `.example.org` and a CIDR mode. The concept marks both as runtime-specific until the spec defines a syntax.',
    status: 'Open.',
    refs: [PERMISSIONS, CONCEPT],
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
  allowHosts:
    - news.example.com      # public: allowed
    - wiki.internal.example # internal service: allowed
                            # explicitly, if the platform
                            # ceiling (G47) permits it
# Security profile: after DNS resolution, loopback,
# private, link-local and CGNAT destinations are
# denied by default, unless the manifest allows them
# explicitly (address or host, syntax: G49) and the
# platform ceiling permits it.` },
    why: 'The tool proxy of the proof of concept had exactly this hole. It now checks the resolved address at connect time, which covers DNS rebinding by construction.',
    status: 'Open, for the security profile. Not a blanket ban: agents sometimes need internal services, so an explicit allow in the manifest, within the platform ceiling, still works.',
    refs: [PERMISSIONS, spec('12', '12-security-considerations')],
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
# derived from allowHosts, and a network policy
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
    status: 'Open. Informative only; G10 merges in, and the rejection rule belongs to G47.',
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
    status: 'Open, for the security profile. Not AEP-0008: its non-goals exclude credentials.',
    refs: [spec('5.4.3', '543-model-object'), spec('7.9', '79-secrets')],
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
    status: 'Open. Becomes category A if AWP standardizes interaction event types.',
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
    status: 'Open. Together with G03 and G58 in a state AEP.',
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
    why: 'A 0.6B local model in the proof of concept called `complete_step` without arguments or not at all; the failure showed only at run time.',
    status: 'Input to AEP-0008, after the current draft.',
    refs: [CATALOG, spec('5.4.3', '543-model-object')],
  },
];
