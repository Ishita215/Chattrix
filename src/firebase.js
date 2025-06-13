

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCEPGh09LwPUBXSqbW8Z2zs1DfV1T0Llek",
  authDomain: "chattrix-7055c.firebaseapp.com",
  projectId: "chattrix-7055c",
  storageBucket: "chattrix-7055c.appspot.com",
  messagingSenderId: "75006838484",
  appId: "1:75006838484:web:5f50e57e7403630fb0dd41"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
