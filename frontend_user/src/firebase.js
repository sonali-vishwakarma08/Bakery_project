import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyApomzj_JOfvf_QRaENW_z1ATb7SaQ4GNA",
  authDomain: "the-velvet-delights.firebaseapp.com",
  projectId: "the-velvet-delights",
  storageBucket: "the-velvet-delights.firebasestorage.app",
  messagingSenderId: "937887362868",
  appId: "1:937887362868:web:ab4dc582bb0ebf4ed4ff61",
  measurementId: "G-BTJ6K71XCP"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);