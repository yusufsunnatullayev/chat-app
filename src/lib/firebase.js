import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-c70ff.firebaseapp.com",
  projectId: "reactchat-c70ff",
  storageBucket: "reactchat-c70ff.firebasestorage.app",
  messagingSenderId: "424300593579",
  appId: "1:424300593579:web:04d1d68c2ded560ea7d2ee",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
