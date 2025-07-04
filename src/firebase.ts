// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDPRmOBo3oUgotq0Ui3HuAxoL-z00AXd9c",
  authDomain: "data-pulse-main.firebaseapp.com",
  projectId: "data-pulse-main",
  storageBucket: "data-pulse-main.appspot.com",
  messagingSenderId: "1025726254114",
  appId: "1:1025726254114:web:d68c1ca73dae03fe984e7b",
  databaseURL: "https://data-pulse-main-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
auth.languageCode = 'en';
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export default app;