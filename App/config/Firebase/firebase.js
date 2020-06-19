import * as firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
import {
    API_KEY,
    AUTH_DOMAIN,
    DATABASE_URL,
    PROJECT_ID,
    MESSAGE_SENDER_ID,
    APP_ID,
    MEASUREMENT_ID,
} from 'react-native-dotenv';

const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    databaseURL: DATABASE_URL,
    projectId: PROJECT_ID,
    storageBucket: 'tembu-friends.appspot.com',
    messagingSenderId: MESSAGE_SENDER_ID,
    appId: APP_ID,
    measurementId: MEASUREMENT_ID,
};

// Initialise Firebase
firebase.initializeApp(firebaseConfig);

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
    getMyData: () => {
        const uid = firebase.auth().currentUser.uid;
        return Firebase.getUserData(uid);
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
    updateUserData: (uid, data) => {
        let userData = firebase.firestore().collection('users').doc(`${uid}`);
        return userData.update(data);
    },
    getCourses: () => {
        let data = firebase.firestore().collection('shared').doc('faculty');

        return data
            .get()
            .then((doc) => {
                if (!doc.exists) {
                    console.log('Courses does not exist!');
                } else {
                    console.log('Courses data available');
                    return doc.data();
                }
            })
            .catch((err) => {
                console.log('Error getting courses document', err);
            });
    },
    updateModulesInfo: (data) => {
        let ref = firebase.firestore().collection('shared').doc('mods');
        return ref.delete();
    },

    // Storage
    getStorageRef: () => {
        return firebase.storage().ref();
    },
};

export default Firebase;
