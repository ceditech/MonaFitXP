import { initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
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

export { firebaseApp, auth, db };
