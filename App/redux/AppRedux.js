import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

//
// Initial State
//

const initialState = {
    userData: {},
};

//
// Reducer
//

const userDataReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'setUserData':
            return { ...state, userData: action.value };
        case 'updateUserProfile':
            return { ...state, userData: { ...state.userData, ...action.value } };
        default:
            return state;
    }
};

//
// Store
//

const store = createStore(userDataReducer, applyMiddleware(thunkMiddleware));
export default store;
