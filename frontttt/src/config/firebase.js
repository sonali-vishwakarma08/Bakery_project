import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoo1ze4V56CvJ61rHVU2Vp06fq8pVthug",
  authDomain: "bakery-19857.firebaseapp.com",
  projectId: "bakery-19857",
  storageBucket: "bakery-19857.firebasestorage.app",
  messagingSenderId: "952699473780",
  appId: "1:952699473780:web:962d284fff515c38a06621",
  measurementId: "G-HVR4QFXNFQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Cloud Messaging
let messaging = null;

try {
  messaging = getMessaging(app);
} catch (error) {
  console.warn("Firebase Messaging not available:", error.message);
}

export { app, analytics, messaging, getToken, onMessage };
