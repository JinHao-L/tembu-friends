import React, { createContext } from 'react';

const FirebaseContext = createContext(null);

export const FirebaseProvider = FirebaseContext.Provider;

const FirebaseConsumer = FirebaseContext.Consumer;

export const withFirebase = (Component) => (props) => (
    <FirebaseConsumer>{(state) => <Component {...props} firebase={state} />}</FirebaseConsumer>
);
