import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase , ref , push , onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCtJGYO_cY8H-MV3EQT6RzImKjrO44NRrc",
  authDomain: "expense-tracker-a26f7.firebaseapp.com",
  databaseURL: "https://expense-tracker-a26f7-default-rtdb.firebaseio.com",
  projectId: "expense-tracker-a26f7",
  storageBucket: "expense-tracker-a26f7.appspot.com",
  messagingSenderId: "456111776855",
  appId: "1:456111776855:web:ba208106cda6a52da1af12"
};

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const database = getDatabase(app);
  export {onValue,ref,push,database, auth , createUserWithEmailAndPassword , updateProfile, onAuthStateChanged, signOut ,signInWithEmailAndPassword};

