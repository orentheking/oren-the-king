// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDTmW_TY93NewHaZ2wbe22MTpkoQEToPvQ",
  authDomain: "orentheking-3edbb.firebaseapp.com",
  projectId: "orentheking-3edbb",
  storageBucket: "orentheking-3edbb.firebasestorage.app",
  messagingSenderId: "821518036472",
  appId: "1:821518036472:web:0bf6c19a5c51a98459ba0d",
  measurementId: "G-GXJ6C6Y5NN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore database
export const db = getFirestore(app);
