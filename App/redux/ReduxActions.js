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

const setProfilePicture = (uri) => {
    return {
        type: 'setProfilePicture',
        value: uri,
    };
};

export const updateProfilePicture = (uid, uri) => {
    return function (dispatch) {
        console.log(uri);
        Firebase.updateUserData(uid, {
            profilePicture: uri,
        })
            .then(() => {
                let actionSetProfilePicture = setProfilePicture(uri);
                dispatch(actionSetProfilePicture);
            })
            .catch((err) => {
                console.log(err);
            });
    };
};
