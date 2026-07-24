interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
}

export const firebaseConfig: FirebaseConfig = {
    apiKey: "AIzaSyBjsOh5AyPE7CBlhX4J14S6pIZ_rKhgcOo",
    authDomain: "workoutassist-6e273.firebaseapp.com",
    projectId: "workoutassist-6e273",
    storageBucket: "workoutassist-6e273.firebasestorage.app",
    messagingSenderId: "240590572665",
    appId: "1:240590572665:web:d9ff0db114bf095507d8a8",
    measurementId: "G-NX4W2PEQXD"
};

/**
 * App Check reCAPTCHA v3 site key (web only). This is a PUBLIC key — safe to
 * commit, same as the config above; the secret half lives in the Firebase
 * console. Empty until the owner registers the web app for App Check and pastes
 * the key here — while empty, App Check initialization is skipped and the app
 * runs unchanged. See docs/APP_CHECK.md.
 */
export const recaptchaV3SiteKey = "6LcPkGItAAAAAFwDdsv9gLDQ3-ki4ZkPpaIL1lVF";
