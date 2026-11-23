// The spec revision the guide, the comparison and the gaps page are built and checked against: the
// branch of spec pull request #23 (main plus the former pull requests #20 and #19, rebased, plus
// G62 to G87, AEP-0026, AEP-0027 and amendments to existing AEPs). The branch may move; update
// PREVIEW_REF to its new head, then run check.mjs and build.mjs.
export const PREVIEW_REF = 'f0ec709';
export const PREVIEW_BRANCH = 'docs/v1alpha3-runtime-feedback';
export const SPEC_REPO = 'https://github.com/agenticworkflowprotocol/agenticworkflowprotocol.org';
export const PREVIEW = `${SPEC_REPO}/blob/${PREVIEW_BRANCH}`;
