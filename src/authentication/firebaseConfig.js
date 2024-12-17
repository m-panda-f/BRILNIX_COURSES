// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLU0zWm3Vx3ClJsbub2lEn0imzclElYNY",
  authDomain: "brilnix-9b1d5.firebaseapp.com",
  databaseURL: "https://brilnix-9b1d5-default-rtdb.firebaseio.com",
  projectId: "brilnix-9b1d5",
  storageBucket: "brilnix-9b1d5.appspot.com",
  messagingSenderId: "1040552503123",
  appId: "1:1040552503123:web:5be81367475c641033a3a6",
  measurementId: "G-JW79VHSLWZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth };
// Export Firestore database
export { db };