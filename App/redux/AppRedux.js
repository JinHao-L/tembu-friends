import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import Firebase from '../helper/Firebase/firebase';

//
// Initial State
//

const initialState = {
    userData: {},
    friends: {},
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
            return { ...state, friends: { ...state.friends, ...action.value } };
        case 'removeFriend':
            let newFriendList = Object.keys(state.friends).reduce((r, e) => {
                if (e !== action.value) {
                    r[e] = state.friends[e];
                }
                return r;
            }, {});
            return { ...state, friends: newFriendList };
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
