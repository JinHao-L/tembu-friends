import Firebase from '../helper/Firebase/firebase';
//
// Action Creators
//

const setUserData = (data) => {
    return {
        type: 'setUserData',
        value: data,
    };
};

export const fetchUserData = () => {
    return function (dispatch) {
        Firebase.getMyData()
            .then((value) => {
                let actionSetUserData = setUserData(value);
                dispatch(actionSetUserData);
            })
            .catch((error) => {
                console.log('Failed to fetch user data', error);
            });
    };
};

const updateUserProfile = (changes) => {
    return {
        type: 'updateUserProfile',
        value: changes,
    };
};

export const updateProfile = (uid, changes) => {
    return function (dispatch) {
        Firebase.updateUserData(uid, changes)
            .then(() => {
                let actionUpdateUserProfile = updateUserProfile(changes);
                dispatch(actionUpdateUserProfile);
            })
            .catch((error) => {
                console.log('Failed to update user profile', error);
            });
    };
};

const updateFriendList = (friends) => {
    return {
        type: 'updateFriendList',
        value: friends,
    };
};

const removeFriend = (friendUID) => {
    return {
        type: 'removeFriend',
        value: friendUID,
    };
};

const attachSubscriber = (unsubscribe) => {
    return {
        type: 'attachSubscriber',
        value: unsubscribe,
    };
};

export const listenFriendList = (uid) => {
    return function (dispatch) {
        const unsubscribe = Firebase.getFriendListRef(uid).onSnapshot(
            (querySnapshot) => {
                querySnapshot.docChanges().forEach((change) => {
                    if (change.type === 'removed') {
                        const data = change.doc.data();
                        let otherUid = data.requested_uid;
                        if (otherUid === uid) {
                            otherUid = data.initiator_uid;
                        }
                        let actionRemoveFriend = removeFriend(otherUid);
                        dispatch(actionRemoveFriend);
                    } else {
                        const data = change.doc.data();
                        let friends = {};
                        if (data.requested_uid === uid && data.status === 'friends') {
                            friends = {
                                [data.initiator_uid]: {
                                    status: 'friends',
                                    id: data.friendship_id,
                                },
                            };
                        } else if (data.requested_uid === uid && data.status === 'pending') {
                            friends = {
                                [data.initiator_uid]: {
                                    status: 'respond',
                                    id: data.friendship_id,
                                    time_requested: data.time_requested,
                                    seen: data.seen,
                                    expoPushToken: data.expoPushToken,
                                },
                            };
                        } else if (data.status === 'friends') {
                            friends = {
                                [data.requested_uid]: {
                                    status: 'friends',
                                    id: data.friendship_id,
                                },
                            };
                        } else if (data.status === 'pending') {
                            friends = {
                                [data.requested_uid]: {
                                    status: 'requested',
                                    id: data.friendship_id,
                                },
                            };
                        }
                        let actionUpdateFriendList = updateFriendList(friends);
                        dispatch(actionUpdateFriendList);
                    }
                });
            },
            (error) => {
                console.log('Failed to get friends update', error);
            }
        );
        let actionAttachSubscriber = attachSubscriber(unsubscribe);
        dispatch(actionAttachSubscriber);
    };
};

const resetState = () => {
    return {
        type: 'resetState',
        value: undefined,
    };
};

export const clearCache = () => {
    return function (dispatch) {
        let actionResetState = resetState();
        dispatch(actionResetState);
    };
};
