# concert-scout

An example AWP `v1alpha2` workflow as a Helm chart. It shows Helm and OCI registries as one way to
transport AWP manifests: the chart renders a `Workflow`, a `Policy` it includes and optionally a
`WorkflowRun`, and ships the AWP CustomResourceDefinitions in `crds/`.

The workflow checks venue programs every morning, extracts the concerts with a small model, keeps
the new ones, rates them with a larger model against a music taste (by default Metalcore, Metal,
Hardcore and related genres within a region) and sends a short summary to a webhook.

```sh
helm install scout oci://ghcr.io/agenticworkflowprotocol/charts/concert-scout \
  --namespace music --create-namespace \
  --set taste.region.home=Leipzig \
  --set-json 'taste.genres=["Doom","Stoner Rock"]'

kubectl get workflows,policies,workflowruns -n music
```

The chart contains no runtime. An AWP runtime in the cluster validates and runs the workflow;
without one, the objects are stored and nothing happens. The venue URLs, the webhook and the
image of the command steps are placeholders.

## Values

| Value | Purpose |
| --- | --- |
| `workflow.*` | name (default: release name), version, owner, classification, schedule |
| `taste.*` | genres, weaker genres, artists, region and language; rendered into the curator's instructions |
| `sources` | venue programs (`name`, `url`, `kind`: `html`, `json-ld`, `json`) |
| `models.collector`, `models.curator` | model provider and name of the two agents |
| `notification.*` | webhook URL and the secret that holds its token |
| `image` | image of the command steps; a tag is enough, the runtime pins the digest at start (add a digest for the security profile) |
| `budget.*` | cost, duration and token limits of an execution |
| `policy.*` | the included Policy: allowed model providers |
| `run.enabled` | create a `WorkflowRun` per release revision, which starts one execution |

## Notes on AWP and Helm

- AWP expressions (`${{ inputs.sources }}`) collide with Helm's template syntax; the chart emits
  them through the helper `concert-scout.expr`.
- Helm labels and the release namespace are not covered by the AWP digest (spec 9.1), so they do not
  change the identity of the workflow.
- Images can stay tags: the runtime resolves them to digests when an execution starts, so the
  chart needs no digest maintenance. Only the security profile requires digests.
- Rendered manifests pass the AWP reference checker (with a digest in `image` also under the
  security profile), and an object read back from a cluster validates as well.
