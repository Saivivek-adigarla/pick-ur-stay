import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCGBUztorSDg16C8Nl-ZkvAIffnYayikRc",
  authDomain: "pickurstayhotels-2cfed.firebaseapp.com",
  databaseURL: "https://pickurstayhotels-2cfed-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pickurstayhotels-2cfed",
  storageBucket: "pickurstayhotels-2cfed.firebasestorage.app",
  messagingSenderId: "627342987551",
  appId: "1:627342987551:web:0ad25ee65fc5212a35202a",
  measurementId: "G-WPB4BPN9NC",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const rtdb = getDatabase(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export default app;
