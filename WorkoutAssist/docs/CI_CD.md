# CI/CD — automated deploy on merge to main

_Added 2026-07-21._

## What happens now

`.github/workflows/ci.yml` (at the **git root**, `MonaFitXP/`, not inside `WorkoutAssist/`)
runs four jobs:

| Job | Trigger | What it does |
|---|---|---|
| `app` | every push + PR | `tsc --noEmit`, `jest` |
| `functions` | every push + PR | `tsc` build, `jest` |
| `rules` | every push + PR | Firestore rules suite against the emulator (JDK 21) |
| `deploy` | **push to `main` only** | rules + indexes + functions + hosting → `workoutassist-6e273` |

`deploy` declares `needs: [app, functions, rules]`, so **production is unreachable
unless all three are green**. It is also gated on `github.event_name == 'push'`, so a
PR from a fork can never deploy.

## One-time setup (you must do this — it needs console access)

### 1. Create a deploy service account

In [Google Cloud Console → IAM → Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts?project=workoutassist-6e273),
create `github-deployer@workoutassist-6e273.iam.gserviceaccount.com`.

**Do not grant Owner or Editor.** Grant exactly these roles:

- `Firebase Hosting Admin` — hosting deploys
- `Cloud Datastore Owner` — Firestore rules + indexes
- `Cloud Functions Admin` — functions deploy
- `Service Account User` — lets it act as the functions runtime SA
- `Firebase Rules Admin` — rules compilation/release
- `Artifact Registry Writer` — functions build artifacts (Gen1 still uses it)

Least privilege matters here: this key can otherwise read every user's Firestore
data, and it lives in a third party (GitHub).

The `Authenticate` step succeeding proves only that the key parsed — it validates no
role. Permission problems surface in the deploy step.

### Enable the required APIs as an owner, once

A functions deploy makes the CLI verify the project is on Blaze, which needs
`cloudbilling.googleapis.com`. On 2026-07-21 the deploy failed with:

```
Error: Permissions denied enabling cloudbilling.googleapis.com.
```

The deploy service account deliberately **cannot enable APIs** — that would need
`roles/serviceusage.serviceUsageAdmin`, which lets it turn on any API in the project.
Enable it once by hand instead, as a project owner:

<https://console.cloud.google.com/apis/library/cloudbilling.googleapis.com?project=workoutassist-6e273>

`cloudfunctions`, `cloudbuild`, `artifactregistry` and `firebaseextensions` were
already enabled and confirmed in the same log — `cloudbilling` was the only gap.
After enabling it, the Node 22 deploy went straight through (verified 2026-07-22).

If a later run fails reading (rather than enabling) billing, add
`roles/serviceusage.serviceUsageConsumer` to the deploy account. Add roles one at a
time and re-run; never grant Editor or Owner to close a permission error.

### 2. Add the key as a GitHub secret

Create a JSON key for that account, then in the GitHub repo:
**Settings → Secrets and variables → Actions → New repository secret**

- Name: `FIREBASE_SERVICE_ACCOUNT`
- Value: the entire JSON file contents, pasted as-is

The workflow fails fast with a clear error if this is missing.

### 3. Protect `main`

**Settings → Branches → Add rule** for `main`:

- ✅ Require a pull request before merging
- ✅ Require status checks to pass → select `app`, `functions`, `rules`
- ✅ Do not allow bypassing the above settings

Without this, a direct `git push main` deploys straight to production. The `needs:`
gate protects against *failing* tests, not against *skipping* the PR.

## Best practices worth adopting

**Work on branches, merge via PR.** The current branch `feature/workout_upgrade` is
the right pattern. Every merge to `main` is now a production release — treat it that way.

**A deploy is not atomic.** `firebase deploy` applies rules, functions and hosting
sequentially, and a failure partway leaves production mixed. The order is chosen
internally by firebase-tools — it is **not** controlled by the order of the `--only`
flags, so do not assume a particular sequence when reasoning about a partial failure.
Read the Actions log to see how far it actually got; never assume a red run changed
nothing.

This is not hypothetical: the failed 2026-07-21 deploy applied Firestore indexes and
rules, then died at the billing check before functions and hosting. Production ran
new rules against an old client for a day — survivable only because the rules change
was backward-compatible. Keep each merge to `main` small enough that a partial apply
is easy to reason about.

**Rollback:**
- Hosting — Firebase Console → Hosting → previous release → "Rollback" (instant).
- Functions/rules — revert the commit on `main` and let the pipeline redeploy.
  There is no console rollback for these.

**Cost.** GitHub Actions is unlimited on public repos and 2,000 min/month free on
private ones. These jobs run ~5–8 min total per push. If the repo is private, feature
branches pushing frequently could approach the cap — narrow the `push:` trigger to
`[main]` and rely on `pull_request` if that happens. Still $0 either way.

**Hardening upgrade (do when convenient, not urgent):** replace the JSON key with
[Workload Identity Federation](https://github.com/google-github-actions/auth#workload-identity-federation),
which lets GitHub mint short-lived tokens and removes the long-lived key entirely.
Also free. The current setup is standard practice; WIF is better practice.

## Runtime note — Node 22

All four jobs pin Node 22, matching `functions/engines.node`. **If you change the
Functions runtime, change the workflow in the same commit** — CI silently testing on
a different runtime than production is exactly the kind of gap that ships bugs.

Both functions are Cloud Functions **1st gen** (the auth trigger pins the project to
1st gen — see `functions/src/index.ts`), and 1st gen runs `nodejs22` fine: verified
2026-07-22 via `firebase functions:list`, both live on nodejs22.

An earlier version of this file claimed Gen1 could not run Node 22 and that the deploy
failed for that reason. That was wrong — the deploy failed at the `cloudbilling` check
(above), never at the runtime. Corrected here so nobody re-pins to 20 on bad advice.
