// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtfkOFtxFjFaysG_AMT0j9Yvk73qMNemM",
  authDomain: "flashcardsaas-e23da.firebaseapp.com",
  projectId: "flashcardsaas-e23da",
  storageBucket: "flashcardsaas-e23da.appspot.com",
  messagingSenderId: "471073933925",
  appId: "1:471073933925:web:b0ab08556127dddd37948c",
  measurementId: "G-BTR91GKSHZ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); 

const db = getFirestore(app); 

export { db };