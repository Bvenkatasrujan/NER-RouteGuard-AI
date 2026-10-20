import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, browserLocalPersistence } from 'firebase/auth';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyBLzjGHxSehAFwDE7pKrkzlUsPwqdh_thw",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "ner-routeguard-ai.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "ner-routeguard-ai",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "ner-routeguard-ai.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "864439315232",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:864439315232:web:9d41127222cbcca1ecc545",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-SYXMLSQLD8"
};

// Initialize Firebase App only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = (() => {
  try {
    // @ts-ignore
    const { getReactNativePersistence } = require('firebase/auth');
    if (getReactNativePersistence && Platform.OS !== 'web') {
      return initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    }
    return initializeAuth(app, {
      persistence: browserLocalPersistence,
    });
  } catch {
    return getAuth(app);
  }
})();

export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
