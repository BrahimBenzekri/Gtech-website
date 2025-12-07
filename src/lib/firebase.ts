import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: 'AIzaSyBNTsU43KSNKwjGG6527clrqSIKz_9Tab4',
    authDomain: 'g-tech-admin.firebaseapp.com',
    projectId: 'g-tech-admin',
    storageBucket: 'g-tech-admin.firebasestorage.app',
    messagingSenderId: '773132638586',
    appId: '1:773132638586:web:402fb2974ee12d3659dec3',
    measurementId: 'G-FRK0QZBVYZ'
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
