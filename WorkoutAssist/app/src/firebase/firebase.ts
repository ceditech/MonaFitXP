import { initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { firebaseConfig } from "./firebaseConfig";

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(firebaseApp);

// Set persistence for web (browser local storage)
// This will persist auth state across page refreshes
setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error("Failed to set auth persistence:", error);
});

// Initialize Firestore
const db = getFirestore(firebaseApp);

// Callable Cloud Functions (deleteAccount, exportMyData). Region must match the
// deployed functions (us-central1) or callables resolve to the wrong host.
const functions = getFunctions(firebaseApp, "us-central1");

export { firebaseApp, auth, db, functions };
