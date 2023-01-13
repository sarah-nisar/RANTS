// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrq2EpT_hNieQbs1GIgSkGXqGF-Fa7UQI",
  authDomain: "centenary-1ac4e.firebaseapp.com",
  databaseURL: "https://centenary-1ac4e-default-rtdb.firebaseio.com",
  projectId: "centenary-1ac4e",
  storageBucket: "centenary-1ac4e.appspot.com",
  messagingSenderId: "647205891121",
  appId: "1:647205891121:web:c19e6ed4340db83af5f910",
  measurementId: "G-ZNZ83R972Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);