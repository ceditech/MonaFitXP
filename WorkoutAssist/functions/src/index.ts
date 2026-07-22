/**
 * Runtime: Node 22. Both functions are Cloud Functions 1st gen (v1 API).
 *
 * VERIFIED, not assumed: on 2026-07-22 `firebase functions:list` reported both
 * functions as Version v1, Runtime nodejs22, deployed and live. So 1st-gen
 * functions run Node 22 with the current firebase-tools — the deploy is the
 * proof.
 *
 * History, because it was mis-told once: the first two production deploys both
 * failed at the SAME wall — enabling `cloudbilling.googleapis.com`, a functions
 * precondition that runs before the runtime is ever validated. The first of
 * those was on Node 22, and its failure was wrongly blamed on the runtime
 * ("Gen1 doesn't support nodejs22") from web research, without the log. Once
 * billing was enabled by a project owner, the Node 22 deploy went straight
 * through. The runtime was never the blocker.
 *
 * Still true and worth knowing: `ensureEntitlementDoc` is an
 * `auth.user().onCreate` trigger, which exists ONLY in 1st gen — there is no
 * 2nd-gen equivalent (the nearest is an Identity Platform blocking function,
 * different semantics). That pins the project to 1st gen, but 1st gen on
 * Node 22 is a supported, working configuration, so this is a fact about the
 * architecture, not a deadline.
 */
export { onWorkoutCompleted } from './metrics';
export { ensureEntitlementDoc } from './auth';
export { deleteAccount, exportMyData } from './account';
