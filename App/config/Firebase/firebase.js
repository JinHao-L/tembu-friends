import * as firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from './firebaseConfig';

// Initialise Firebase
firebase.initializeApp(firebaseConfig);

const Firebase = {
    signInWithEmail: (email, password) => {
        firebase.auth().signInWithEmailAndPassword(email, password);
    },
    signUpWithEmail: (email, password) => {
        return firebase.auth().createUserWithEmailAndPassword(email, password);
    },
    signOut: () => {
        return firebase.auth().signOut();
    },
    checkUserAuth: (user) => {
        return firebase.auth().onAuthStateChanged(user);
    },
    passwordReset: (email) => {
        return firebase.auth().sendPasswordResetEmail(email);
    },
    // firestore
    createNewUser: (userData) => {
        return firebase.firestore().collection('users').doc(`${userData.uid}`).set(userData);
    },
};

export default Firebase;
