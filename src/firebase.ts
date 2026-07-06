import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyCb47R2_QsW8p0Xf9r3rf-o-5c_M9J91QM",
  authDomain: "project-96ff19b9-b12e-4485-a7b.firebaseapp.com",
  projectId: "project-96ff19b9-b12e-4485-a7b",
  storageBucket: "project-96ff19b9-b12e-4485-a7b.firebasestorage.app",
  messagingSenderId: "928897194644",
  appId: "1:928897194644:web:e46a486689137e0d457281"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom database ID
export const db = getFirestore(app, "ai-studio-jiwamu-6fbb76eb-bfff-4bab-9e57-53dc857e3ca2");
