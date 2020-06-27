import Firebase from '../config/Firebase/firebase';
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
