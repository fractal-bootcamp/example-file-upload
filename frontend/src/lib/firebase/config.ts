// Import the functions you need from the SDKs you need
import {
  deleteApp,
  FirebaseApp,
  getApp,
  getApps,
  initializeApp,
} from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: process.env.VITE_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.VITE_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.VITE_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let firebaseApp: FirebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
  void deleteApp(firebaseApp);
  firebaseApp = initializeApp(firebaseConfig);
}
export const auth = getAuth(firebaseApp);
