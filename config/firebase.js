// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDa4_cUmrR60k82VypxJ_US-F7FEiItCL4",
  authDomain: "restaurant-app-da7bc.firebaseapp.com",
  projectId: "restaurant-app-da7bc",
  storageBucket: "restaurant-app-da7bc.appspot.com",
  messagingSenderId: "598136487640",
  appId: "1:598136487640:web:f77577fdc1710db8c1a1ad",
  measurementId: "G-6D4DHL06Z0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app)
const db = getFirestore(app)
export {auth, db}