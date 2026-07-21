/**
 * ⚠️ RUNTIME IS PINNED TO NODE 20 — DO NOT BUMP TO 22 WITHOUT READING THIS.
 *
 * Both functions below are Cloud Functions **1st gen** (`gcfv1`), and GCF Gen1
 * does not support `nodejs22`. Setting `engines.node` to 22 in package.json
 * passes every local check — tsc, jest, even trigger-metadata inspection — and
 * then fails at deploy with:
 *
 *     Runtime 'nodejs22' is not supported on GCF Gen1
 *
 * That exact mistake broke the first production deploy on 2026-07-21.
 *
 * What pins us to Gen1: `ensureEntitlementDoc` is an `auth.user().onCreate`
 * trigger, and auth triggers exist ONLY in Gen1. There is no Gen2 equivalent —
 * the nearest thing is an Identity Platform blocking function
 * (`beforeUserCreated`), which has different semantics and its own quotas.
 *
 * This matters on a deadline: **nodejs20 is decommissioned 2026-10-30**, after
 * which these functions cannot be deployed at all. Migrating off Gen1 is
 * therefore required work, not optional cleanup. The onWorkoutCompleted
 * Firestore trigger ports cleanly to Gen2 (`onDocumentWritten`); the auth
 * trigger is the one that needs a real design decision.
 */
export { onWorkoutCompleted } from './metrics';
export { ensureEntitlementDoc } from './auth';
