import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBLG22SkUlcKzLFpTUxcRjqi59P5Mza46c",
  authDomain: "futsalpro-767b4.firebaseapp.com",
  projectId: "futsalpro-767b4",
  storageBucket: "futsalpro-767b4.appspot.com",
  messagingSenderId: "1060503026116",
  appId: "1:1060503026116:web:c3a02143c812f573f98c91",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
