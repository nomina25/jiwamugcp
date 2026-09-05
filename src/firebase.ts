import { initializeApp } from "firebase/app";
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration loaded safely from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "project-96ff19b9-b12e-4485-a7b.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "project-96ff19b9-b12e-4485-a7b",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "project-96ff19b9-b12e-4485-a7b.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "928897194644",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:928897194644:web:e46a486689137e0d457281"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

const firestoreDbId = import.meta.env.VITE_FIREBASE_DATABASE_ID || "ai-studio-jiwamu-6fbb76eb-bfff-4bab-9e57-53dc857e3ca2";

// Initialize Firestore with custom database ID and persistent local cache for offline resilience
export const db = initializeFirestore(
  app, 
  {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  },
  firestoreDbId
);

export const auth = getAuth(app);
