
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBYCi7j7eTGyr-PwIoAB4DrquEl8wJmvPs",
  authDomain: "authentication-afa75.firebaseapp.com",
  projectId: "authentication-afa75",
  storageBucket: "authentication-afa75.firebasestorage.app",
  messagingSenderId: "980440222804",
  appId: "1:980440222804:web:5c0ee08a7dca77113af1c1"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;