# Firebase App Check

_Added 2026-07-23._

App Check attests that requests to Firestore, Functions, and Storage come from
your genuine app, not a script hitting the public endpoints. The backend has been
publicly reachable since launch, so this is the main abuse defense.

## Current state (what the code does)

- `app/src/firebase/appCheck.ts` initializes App Check with reCAPTCHA v3 **on web
  only**, and only once a site key is set. Wired into `firebase.ts`.
- It is a **no-op until you add the key** (`recaptchaV3SiteKey` in
  `firebaseConfig.ts` is empty), so nothing changes until you deploy the steps
  below. Any init failure is swallowed — App Check can never break app startup.
- **Native does nothing** — see the limitation section. This is deliberate.

Nothing is enforced yet. Adding the key turns on **token issuance** (monitor
mode); enforcement is a separate console switch you flip later.

## ⚠️ The native limitation — read before enforcing

This app uses the Firebase **JS SDK** on every platform, and the JS SDK's only
App Check provider is reCAPTCHA, which needs a browser DOM. On React Native there
is **no native provider** without adopting `@react-native-firebase/app-check`
(Play Integrity on Android, App Attest on iOS) — a separate migration this
project hasn't done.

So: **web requests carry an App Check token; native (Android/iOS) requests do
not.** If you enable *enforcement* now, the native app is locked out of Firestore
and Functions. Do not enforce until native App Check exists. Web-only monitoring
and, later, web-only enforcement are safe.

## One-time setup (owner, console access needed)

### 1. Register the web app + create a reCAPTCHA v3 key

Firebase Console → your project → **App Check** → Apps → the **Web** app →
register with the **reCAPTCHA v3** provider. Firebase walks you through creating
the reCAPTCHA v3 site key (free — not reCAPTCHA Enterprise, which is paid).

Paste the **site key** into `recaptchaV3SiteKey` in
`app/src/firebase/firebaseConfig.ts`. It is a public key, safe to commit — same
as the rest of that file.

### 2. Add a debug token for local development

`initAppCheck` sets `FIREBASE_APPCHECK_DEBUG_TOKEN = true` in dev, so on first
`npx expo start --web` the console prints a debug token. Copy it into
Console → App Check → Apps → (web app) → **Manage debug tokens**. Without this,
localhost can't get tokens once enforcement is on.

### 3. Deploy, then WATCH — do not enforce yet

Merge so the key ships. In Console → App Check → **APIs**, each service
(Firestore, Cloud Functions) shows a **verified vs. unverified** request split.
Leave everything **unenforced** and watch for a few days of real traffic:

- Web traffic should climb toward ~100% verified.
- **Native traffic will show as unverified** — expected, per the limitation.

### 4. Enforce, carefully, web-first

Only after web is reliably verified, and only if you've accepted that native is
either covered (via `@react-native-firebase`) or not in play, enable enforcement
per service. Enforcement is reversible, but a wrong flip is a live outage — do it
during low traffic and watch the error rate.

## Cost

$0. reCAPTCHA v3 and Play Integrity are free. App Check itself is free.

## When you close the native gap

Add `@react-native-firebase/app-check`, initialize it in `firebase.native.ts`
(Play Integrity / App Attest providers), confirm native traffic turns verified in
the console, THEN enforcement can be turned on for all platforms. Until then this
is a web-only defense — still worth having, since web is the most exposed surface.
