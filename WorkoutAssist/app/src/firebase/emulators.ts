import { connectAuthEmulator } from "firebase/auth";
import { connectFirestoreEmulator } from "firebase/firestore";
import { auth, db } from "./firebase";

export function connectToEmulators() {
    // Use 10.0.2.2 for Android emulator to access host localhost
    // Use localhost for iOS simulator
    const EMULATOR_HOST = "10.0.2.2";

    if (__DEV__) {
        console.log("Connecting to Firebase Emulators...");
        try {
            connectAuthEmulator(auth, `http://${EMULATOR_HOST}:9099`);
            connectFirestoreEmulator(db, EMULATOR_HOST, 8080);
            console.log("Connected to Firebase Emulators");
        } catch (error) {
            console.error("Error connecting to Firebase Emulators:", error);
        }
    }
}
