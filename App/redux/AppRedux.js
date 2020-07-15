import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import Firebase from '../helper/Firebase/firebase';

//
// Initial State
//

const initialState = {
    userData: {},
    friends: {},
    respondList: [],
    friendSubscriber: () => {},
};

//
// Reducer
//

const dataReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'setUserData':
            return { ...state, userData: action.value };
        case 'updateUserProfile':
            return { ...state, userData: { ...state.userData, ...action.value } };
        case 'updateFriendList':
            const newFriendState = { ...state.friends, ...action.value };
            let respondList = [];
            Object.entries(newFriendState).forEach((value) => {
                if (value[1].status === 'respond') {
                    respondList.push({
                        ...value[1],
                        uid: value[0],
                    });
                }
            });
            return {
                ...state,
                friends: { ...state.friends, ...action.value },
                respondList: respondList,
            };
        case 'removeFriend':
            const newFriendList = Object.keys(state.friends).reduce((r, e) => {
                if (e !== action.value) {
                    r[e] = state.friends[e];
                }
                return r;
            }, {});
            const updatedRespondList = state.respondList.filter(
                (value) => value.uid !== action.value
            );
            return { ...state, friends: newFriendList, respondList: updatedRespondList };
        case 'attachSubscriber':
            return { ...state, friendSubscriber: action.value };
        case 'resetState':
            return { ...state, ...initialState };
        default:
            return state;
    }
};

//
// Store
//

const store = createStore(dataReducer, applyMiddleware(thunkMiddleware));
export default store;
