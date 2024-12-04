import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAmDnzKnMyyPHH--lWn0vM-c83_tHH5PS4",
    authDomain: "cloudsync-auth.firebaseapp.com",
    projectId: "cloudsync-auth",
    storageBucket: "cloudsync-auth.firebasestorage.app",
    messagingSenderId: "916254990302",
    appId: "1:916254990302:web:67a88c52ecff323225074f",
    measurementId: "G-MXHH57D683"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Set up Google provider
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };