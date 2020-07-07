import * as firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
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
    checkUserAuth: (userObserver) => {
        return firebase.auth().onAuthStateChanged(userObserver);
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
                    console.log('No such user data!', uid);
                } else {
                    console.log('Document data available');
                    return doc.data();
                }
            })
            .catch((err) => {
                console.log('Error getting document', err);
                return undefined;
            });
    },
    updateUserData: (uid, data) => {
        let userData = firebase.firestore().collection('users').doc(`${uid}`);
        let hasUpdates = false;
        const updates = {};
        if (data.profileImg || data.displayName) {
            if (data.profileImg) {
                updates.profileImg = data.profileImg;
            }
            if (data.displayName) {
                updates.displayName = data.displayName;
            }
        }
        return userData.update(data).then(() => {
            if (hasUpdates) {
                return firebase.auth().currentUser.updateProfile(updates);
            } else {
                return Promise.resolve();
            }
        });
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

    getPostCollection: (uid) => {
        return firebase.firestore().collection(`posts/${uid}/userPosts`);
    },
    getUserCollection: () => {
        return firebase.firestore().collection('users');
    },
    deletePost: (uid, postId) => {
        return firebase.firestore().collection(`posts/${uid}/userPosts`).doc(`${postId}`).delete();
    },

    // Storage
    getStorageRef: () => {
        return firebase.storage().ref();
    },

    // functions
    createPost: firebase.functions().httpsCallable('createPost'),
    createProfile: firebase.functions().httpsCallable('createProfile'),
};

export default Firebase;
