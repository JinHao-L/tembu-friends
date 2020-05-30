import * as firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from './firebaseConfig';
import { YellowBox } from 'react-native';

// Initialise Firebase
firebase.initializeApp(firebaseConfig);

YellowBox.ignoreWarnings(['Setting a timer']);

const Firebase = {
    signInWithEmail: (email, password) => {
        return firebase.auth().signInWithEmailAndPassword(email, password);
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
    sendPasswordReset: (email) => {
        return firebase.auth().sendPasswordResetEmail(email);
    },
    getCurrentUser: () => {
        return firebase.auth().currentUser;
    },
    createCredential: (email, password) => {
        return firebase.auth.EmailAuthProvider.credential(email, password);
    },

    // firestore
    createNewUser: (userData) => {
        return firebase.firestore().collection('users').doc(`${userData.uid}`).set(userData);
    },
    getUserData: (uid) => {
        let userData = firebase.firestore().collection('users').doc(`${uid}`);
        return userData
            .get()
            .then((doc) => {
                if (!doc.exists) {
                    console.log('No such document!');
                } else {
                    console.log('Document data available');
                    return doc.data();
                }
            })
            .catch((err) => {
                console.log('Error getting document', err);
            });
    },
    deleteUser: (uid) => {
        return firebase.firestore().collection('users').doc(`${uid}`).delete();
    },
    getTempData: () => {
        return firebase
            .firestore()
            .collection('template')
            .doc('sample')
            .get()
            .then((doc) => {
                if (!doc.exists) {
                    console.log('No such document!');
                } else {
                    console.log('Document data available');
                    return doc.data();
                }
            })
            .catch((err) => {
                console.log('Error getting document', err);
            });
    },
};

export default Firebase;
