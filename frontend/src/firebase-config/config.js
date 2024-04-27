import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth"
import { getDatabase } from "firebase/database";
import {getFirestore} from 'firebase/firestore'
import { getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAvWM6J1n0YJq9jRCzL4E2zPZsn-KVTIgE",
  authDomain: "vc-project-ff865.firebaseapp.com",
  projectId: "vc-project-ff865",
  storageBucket: "vc-project-ff865.appspot.com",
  messagingSenderId: "778431210314",
  appId: "1:778431210314:web:a1a04ab65eb827b9e0d7b3",
  measurementId: "G-YZ5302W60R"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider(app);
export const db = getFirestore(app)
export const database = getDatabase(app);
export const storage = getStorage(app)
export default app;
