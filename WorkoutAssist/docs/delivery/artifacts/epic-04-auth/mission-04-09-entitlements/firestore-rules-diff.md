# Firestore Security Rules Diff

```diff
-      // Entitlements: Owner Read, Server-Only Write (No Client Write)
+      // Entitlements: Owner Read (get only), Server-Only Write
       match /entitlements/{docId} {
-        allow read: if isOwner(uid);
+        allow get: if isOwner(uid);
+        allow list: if false;
         allow write: if false; // Server-side function only
       }
```

**Reasoning**:
- Owners can fetch their own plan details (`get`).
- Collections are not enumerable (`list: false`) to prevent metadata leakage.
- Client-side writes are blocked (`write: false`) as entitlements are managed by the server (Admin SDK/Cloud Functions).
