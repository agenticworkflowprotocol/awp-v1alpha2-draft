# AWP v1alpha3, explained

One site for the [Agentic Workflow Protocol](https://agenticworkflowprotocol.org) as it now stands:
the `v1alpha3` draft, what the open spec pull requests propose on top, what is still open, and how
to adopt it. The repository keeps its old name `awp-v1alpha2-draft`.

**Website:** https://agenticworkflowprotocol.github.io/awp-v1alpha2-draft/

The site shows the **open spec pull requests #24 to #26, not merged text**. They form a stack that
replaces #19, #20 and #23, and every spec and AEP link and every check uses the top of it, branch
[`docs/aep-0026-0027-sessions-engine`](https://github.com/agenticworkflowprotocol/agenticworkflowprotocol.org/tree/docs/aep-0026-0027-sessions-engine):

- [#24](https://github.com/agenticworkflowprotocol/agenticworkflowprotocol.org/pull/24): runtime feedback G41 to G87, related work (D21), AEP-0024 event triggers, AEP-0025 state;
- [#25](https://github.com/agenticworkflowprotocol/agenticworkflowprotocol.org/pull/25): AEP-0023 step isolation (network destinations, ceilings, credentials and approvals outside the execution environment);
- [#26](https://github.com/agenticworkflowprotocol/agenticworkflowprotocol.org/pull/26): AEP-0026 interactive execution and AEP-0027 agent engine as concepts, amendments to AEP-0002, 0005, 0007, 0009 and 0013.

Everything is a draft under review.

## Pages

| Page | File | Content |
| --- | --- | --- |
| [Guide](https://agenticworkflowprotocol.github.io/awp-v1alpha2-draft/) (start here) | `docs/index.html` from `guide.mjs` | How it fits together: a resource map, the lifecycle from manifest to finished run with the status of each step (in v1alpha3, PR #23, planned, platform only), seven worked examples (the last two: an interactive session and a coding agent engine), what flowed in from PRs #24 to #26, what is still open, AWP next to related work, how a Kubernetes runtime can map it (informative), and checklists for authors and runtime implementers. |
| [Side by side](https://agenticworkflowprotocol.github.io/awp-v1alpha2-draft/compare.html) | `docs/compare.html` from `examples.mjs` | v1alpha1 on the left and v1alpha3 on the right, then v1alpha3 next to the proposals of PRs #24 to #26 (AEP-0023 to AEP-0027 and the amendments to existing AEPs), the planned AEP-0004 pull request and the AEP-0021 concept; each with what changes and why. |
| [Open gaps](https://agenticworkflowprotocol.github.io/awp-v1alpha2-draft/gaps.html) | `docs/gaps.html` from `gaps.mjs` | The runtime gaps G41 to G87, classified as A (belongs in AWP), B (an AWP rule enforced by the platform) or C (platform only), with a verdict, a target AEP, the draft text, a proposal sketch and the evidence from a proof of concept. Proposals from one runtime, not accepted specification. |

`docs/index.html` used to be the side-by-side page. Links to its old anchors (for example
`index.html#pinning`) are forwarded to `compare.html`.

## Example as a Helm chart

[`charts/concert-scout`](charts/concert-scout) packages a complete workflow of the draft (written as
`v1alpha2`, before the rename to `v1alpha3`) and the CustomResourceDefinitions, published as an OCI
artifact:

```sh
helm install scout oci://ghcr.io/agenticworkflowprotocol/charts/concert-scout -n music --create-namespace
```

## Build

```sh
node check.mjs ../agenticworkflowprotocol.org   # run marked snippets through the reference checker
node build.mjs                                  # render docs/index.html, docs/compare.html, docs/gaps.html
```

- `spec-ref.mjs`: the spec revision all three pages are checked and linked against, the head of
  `docs/aep-0026-0027-sessions-engine` (`b0a79fb`). The branch may move; then update `PREVIEW_REF` there (one line)
  and run both commands again. The spec checkout passed to `check.mjs` must contain that commit
  (`git fetch origin docs/aep-0026-0027-sessions-engine`).
- `guide.mjs`, `examples.mjs`, `gaps.mjs`: the content of the three pages.
- `check.mjs`: snippets marked `check` must be valid (or rejected, for error cases) with the
  reference checker at `SPEC_REF`. The commit is exported with `git archive`; the checkout is not
  changed. Proposals (PRs #24 to #26, the planned AEP-0004 pull request, gap proposals) are never checked,
  and marking one is an error.
- `build.mjs`, `render.mjs`, `render-guide.mjs`, `template.html`: static pages without
  dependencies and without external scripts or styles, one shared template, served by GitHub Pages
  from `docs/`. The pages also work when opened from disk.

## License

Apache-2.0, see [LICENSE](LICENSE).
