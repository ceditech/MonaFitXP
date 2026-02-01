import { initializeApp } from "firebase/app";
// @ts-ignore -- getReactNativePersistence is available in RN bundle but not in default types
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseConfig } from "./firebaseConfig";

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
const db = getFirestore(firebaseApp);

export { firebaseApp, auth, db };
