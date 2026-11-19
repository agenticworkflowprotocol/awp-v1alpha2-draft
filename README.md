# AWP v1alpha2 draft, side by side

What changes from AWP `v1alpha1` to the `v1alpha2` draft of the
[Agentic Workflow Protocol](https://agenticworkflowprotocol.org): 28 examples, each with the old
form on the left, the new form on the right, what changes and why.

**Website:** https://agenticworkflowprotocol.github.io/awp-v1alpha2-draft/

The draft itself lives in
[agenticworkflowprotocol.org](https://github.com/agenticworkflowprotocol/agenticworkflowprotocol.org)
(AEPs 0015 to 0021, `spec/v1alpha2`, the conformance suite). Everything shown here is a draft
under review; the extension model chapter is a concept that is not applied to the schema.

## Example as a Helm chart

[`charts/concert-scout`](charts/concert-scout) packages a complete `v1alpha2` workflow and the
CustomResourceDefinitions, published as an OCI artifact:

```sh
helm install scout oci://ghcr.io/agenticworkflowprotocol/charts/concert-scout -n music --create-namespace
```

## Build

```sh
node check.mjs ../agenticworkflowprotocol.org   # run marked snippets through the reference checker
node build.mjs                                  # render docs/index.html
```

- `examples.mjs`: chapters and examples (the only file to edit for content).
- `check.mjs`: snippets with `check` must be valid (or rejected, for error cases) with the
  reference checker of a checkout of the specification repository.
- `build.mjs`, `template.html`: static page without dependencies, served by GitHub Pages from
  `docs/`.

## License

Apache-2.0, see [LICENSE](LICENSE).
