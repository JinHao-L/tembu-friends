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
import PushNotifications from '../PushNotification';

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
    // Authentication
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
    getUsers: (uidList) => {
        if (uidList && uidList.length >= 1) {
            const getUsersCall = firebase.functions().httpsCallable('getUsers');

            return getUsersCall(uidList)
                .then((result) => result.data)
                .catch((error) => {
                    const code = error.code;
                    const message = error.message;
                    const details = error.details;
                    console.log('Get Users Call Error', code, message, details);
                    throw 'User List error';
                });
        } else {
            return Promise.resolve([]);
        }
    },
    getAllUsers: () => {
        const getAllUsersCall = firebase.functions().httpsCallable('getAllUsers');

        return getAllUsersCall()
            .then((result) => result.data)
            .catch((error) => {
                const code = error.code;
                const message = error.message;
                const details = error.details;
                console.log('Get All Users Call Error', code, message, details);
                throw 'All Users Error';
            });
    },

    // Users
    createProfile: (userData) => {
        const createProfileCall = firebase.functions().httpsCallable('createProfile');
        return createProfileCall(userData);
    },
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
                    return null;
                } else {
                    console.log('Document data available');
                    return doc.data();
                }
            })
            .catch((err) => {
                console.log('Error getting User', err);
                return null;
            });
    },
    updateUserData: async (uid, data) => {
        let userData = firebase.firestore().collection('users').doc(`${uid}`);
        let hasUpdates = false;
        const updates = {};
        if (data.profileImg) {
            hasUpdates = true;
            updates.photoURL = data.profileImg;
        }
        if (data.displayName) {
            hasUpdates = true;
            updates.displayName = data.displayName;
        }
        return userData.update(data).then(() => {
            if (hasUpdates) {
                return Firebase.getCurrentUser()
                    .updateProfile(updates)
                    .then(() => console.log('Update Auth Profile'));
            } else {
                return Promise.resolve();
            }
        });
    },
    getUserCollection: () => {
        return firebase.firestore().collection('users');
    },

    // Courses
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

    // Posts
    createPost: (post, notificationDetails) => {
        const createPostFn = firebase.functions().httpsCallable('createPost');
        return createPostFn(post)
            .then(() => {
                if (
                    notificationDetails?.expoPushToken &&
                    !notificationDetails?.pushPermissions?.disablePostNotifications
                ) {
                    const displayName = Firebase.getCurrentUser().displayName;
                    const { expoPushToken } = notificationDetails;
                    return PushNotifications.sendPostNotification(displayName, expoPushToken);
                }
            })
            .catch((error) => {
                const code = error.code;
                const message = error.message;
                const details = error.details;
                console.log('Create Post Call Error', code, message, details);
                throw 'Create Post error';
            });
    },
    getPostCollection: (uid) => {
        return firebase.firestore().collection(`posts/${uid}/userPosts`);
    },
    deletePost: (uid, postId) => {
        return firebase.firestore().collection(`posts/${uid}/userPosts`).doc(`${postId}`).delete();
    },
    reportPost: (uid, postId, writtenTo, reportedBy) => {
        const reportRef = firebase.firestore().collection(`reports`).doc('posts');

        const postRef = firebase.firestore().collection(`posts/${uid}/userPosts`).doc(postId);

        const toAdd = { uid, postId, writtenTo, reportedBy };

        return reportRef
            .update({
                report: firebase.firestore.FieldValue.arrayUnion(toAdd),
            })
            .then(() => postRef.update('reported', true));
    },
    getPost: (uid, postId) => {
        return firebase
            .firestore()
            .collection(`posts/${uid}/userPosts`)
            .doc(`${postId}`)
            .get()
            .then((doc) => {
                if (!doc.exists) {
                    console.log('Post does not exist!');
                    return null;
                } else {
                    console.log('Post data available');
                    return doc.data();
                }
            })
            .catch((err) => {
                console.log('Error getting post document', err);
                return null;
            });
    },

    // Friends
    getFriendListRef: (uid) => {
        return firebase.firestore().collection('friends').where(`friendship.${uid}`, '==', true);
    },
    sendFriendRequest: (
        uid,
        targetNotificationDetails = { expoPushToken: null, pushPermissions: null },
        yourNotificationDetails = { expoPushToken: null, pushPermissions: null }
    ) => {
        const friendRequestFn = firebase.functions().httpsCallable('friendRequest');
        const { expoPushToken, pushPermissions } = yourNotificationDetails;
        let request;
        if (expoPushToken && !pushPermissions?.disableFriendNotification) {
            request = { uid: uid, expoPushToken: expoPushToken };
        } else {
            request = { uid: uid };
        }

        return friendRequestFn(request)
            .then(() => {
                if (
                    targetNotificationDetails.expoPushToken &&
                    !targetNotificationDetails.pushPermissions?.disableFriendNotification
                ) {
                    const displayName = Firebase.getCurrentUser().displayName;
                    return PushNotifications.sendFriendRequestNotification(
                        displayName,
                        targetNotificationDetails.expoPushToken
                    );
                }
            })
            .catch((error) => {
                const code = error.code;
                const message = error.message;
                const details = error.details;
                console.log('Friend Request Call Error', code, message, details);
                throw 'Friend Request error';
            });
    },
    acceptFriendRequest: (friendshipID, notificationDetails) => {
        return firebase
            .firestore()
            .collection('friends')
            .doc(`${friendshipID}`)
            .update('status', 'friends')
            .then(() => {
                if (
                    notificationDetails?.expoPushToken &&
                    !notificationDetails.pushPermissions?.disableFriendNotification
                ) {
                    const displayName = Firebase.getCurrentUser().displayName;
                    const { expoPushToken } = notificationDetails;
                    return PushNotifications.sendAcceptFriendNotification(
                        displayName,
                        expoPushToken
                    );
                }
            });
    },
    deleteFriend: (friendshipID) => {
        return firebase.firestore().collection('friends').doc(`${friendshipID}`).delete();
    },
    markFriendRequestAsSeen: (friendshipID) => {
        return firebase
            .firestore()
            .collection('friends')
            .doc(`${friendshipID}`)
            .update('seen', true);
    },

    // Notifications
    getUserNotifications: (uid) => {
        return firebase.firestore().collection(`notifications/${uid}/notification`);
    },
    updateNotification: (uid, notificationId, updates) => {
        const notificationRef = firebase
            .firestore()
            .collection(`notifications/${uid}/notification`)
            .doc(`${notificationId}`);
        return notificationRef.update(updates);
    },
    deleteNotification: (uid, notificationId) => {
        const notificationRef = firebase
            .firestore()
            .collection(`notifications/${uid}/notification`)
            .doc(`${notificationId}`);
        return notificationRef.delete();
    },

    // Reports
    getPostReport: () => {
        const reportRef = firebase.firestore().collection(`reports`).doc('posts');

        return reportRef.get().then((doc) => {
            return doc.data().report;
        });
    },
    cancelReport: (report) => {
        const { uid, postId } = report;
        const reportRef = firebase.firestore().collection(`reports`).doc('posts');
        const postRef = firebase.firestore().collection(`posts/${uid}/userPosts`).doc(postId);

        return reportRef
            .update({
                report: firebase.firestore.FieldValue.arrayRemove(report),
            })
            .then(() => postRef.update('reported', false));
    },
    deleteReportedPost: (report) => {
        const { uid, postId } = report;
        const reportRef = firebase.firestore().collection(`reports`).doc('posts');
        const postRef = firebase.firestore().collection(`posts/${uid}/userPosts`).doc(postId);

        return reportRef
            .update({
                report: firebase.firestore.FieldValue.arrayRemove(report),
            })
            .then(() => postRef.delete());
    },

    // Storage
    getStorageRef: () => {
        return firebase.storage().ref();
    },
};

export default Firebase;
