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
            .catch((err) => {
                console.log(err);
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
            .catch((err) => {
                console.log(err);
            });
    };
};
