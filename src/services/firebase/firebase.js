import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAo3Tf9n3jmxUF7J0pjMzsR5lzgCW8GQIw",
  authDomain: "dossiers-verts.firebaseapp.com",
  databaseURL: "https://dossiers-verts-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "dossiers-verts",
  storageBucket: "dossiers-verts.firebasestorage.app",
  messagingSenderId: "1033509366184",
  appId: "1:1033509366184:web:2654d512d205875452159d"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
