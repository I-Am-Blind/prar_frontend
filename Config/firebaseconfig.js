
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBrLWPAoQbmqB9E8WgP-3iYWN3Jnu-TfVk",
  authDomain: "prar-fe0ad.firebaseapp.com",
  databaseURL: "https://prar-fe0ad-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "prar-fe0ad",
  storageBucket: "prar-fe0ad.appspot.com",
  messagingSenderId: "517687866268",
  appId: "1:517687866268:web:ede3570258fb5f1f5ace59"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
export { db };