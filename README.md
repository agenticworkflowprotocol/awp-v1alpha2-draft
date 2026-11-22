# AWP v1alpha2 draft, side by side

What changes from AWP `v1alpha1` to the `v1alpha2` draft of the
[Agentic Workflow Protocol](https://agenticworkflowprotocol.org): 29 examples, each with the old
form on the left, the new form on the right, what changes and why.

**Website:** https://agenticworkflowprotocol.github.io/awp-v1alpha2-draft/

The draft itself lives in
[agenticworkflowprotocol.org](https://github.com/agenticworkflowprotocol/agenticworkflowprotocol.org)
(AEPs 0015 to 0021, `spec/v1alpha2`, the conformance suite). Everything shown here is a draft
under review; the extension model chapter is a concept that is not applied to the schema.

## Open runtime gaps

**Second page:** https://agenticworkflowprotocol.github.io/awp-v1alpha2-draft/gaps.html

The gaps G41 to G61 that a Kubernetes runtime proof of concept and a reference concept still find
in the draft, classified as A (belongs in AWP), B (an AWP rule enforced by the platform) or C
(platform only), with a verdict, a target AEP and a proposed order. Each gap shows what the draft
says today, a sketch of the proposal and what happened in the proof of concept. Source: the
runtime feedback list of the proof of concept and the
[concept comparison](https://slauger.github.io/ai-agent-operations/awp-abgleich/) (German). These
are proposals from one runtime, not accepted specification.

The draft compared on this page is now called `v1alpha3` (decision D20: pull request #16 was merged
as `v1alpha3`, and `v1alpha2` is the step iteration draft of D19). The side-by-side page and the
repository name still use the old name `v1alpha2`.

## Example as a Helm chart

[`charts/concert-scout`](charts/concert-scout) packages a complete `v1alpha2` workflow and the
CustomResourceDefinitions, published as an OCI artifact:

```sh
helm install scout oci://ghcr.io/agenticworkflowprotocol/charts/concert-scout -n music --create-namespace
```

## Build

```sh
node check.mjs ../agenticworkflowprotocol.org   # run marked snippets through the reference checker
node build.mjs                                  # render docs/index.html and docs/gaps.html
```

- `examples.mjs`: chapters and examples of the side-by-side page.
- `gaps.mjs`: chapters and gaps of the second page. Proposals are never checked; they are not
  valid against the draft schema.
- `check.mjs`: snippets with `check` in both files must be valid (or rejected, for error cases)
  with the reference checker of the specification repository, at the commit each file names in
  `SPEC_REF` (`b8a0ee8` for the side-by-side page, `baac181` on main for the gaps page). The commits
  are exported with `git archive`; the checkout is not changed.
- `build.mjs`, `template.html`: static pages without dependencies, one shared template, served by
  GitHub Pages from `docs/`.

## License

Apache-2.0, see [LICENSE](LICENSE).
