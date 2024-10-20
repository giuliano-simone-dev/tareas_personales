// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7nbAgOpgymldx3TUTo6fOLD8dgIx2X7w",
  authDomain: "tareas-personales-78612.firebaseapp.com",
  projectId: "tareas-personales-78612",
  storageBucket: "tareas-personales-78612.appspot.com",
  messagingSenderId: "1050955250767",
  appId: "1:1050955250767:web:90c590ada637e45e9bfe3a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();