// The spec revision all pages are built and checked against: the branch of spec pull request #26,
// the top of a stack of three pull requests that replace #19, #20 and #23:
//   #24 runtime feedback G41 to G87, decision D21, AEP-0024 and AEP-0025
//   #25 AEP-0023 step isolation (on #24)
//   #26 AEP-0026, AEP-0027 and amendments to existing AEPs (on #25)
// The branch may move; update PREVIEW_REF to its new head, then run check.mjs and build.mjs.
export const PREVIEW_REF = 'b0a79fb';
export const PREVIEW_BRANCH = 'docs/aep-0026-0027-sessions-engine';
export const SPEC_REPO = 'https://github.com/agenticworkflowprotocol/agenticworkflowprotocol.org';
export const PREVIEW = `${SPEC_REPO}/blob/${PREVIEW_BRANCH}`;
