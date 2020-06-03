import React from 'react';
import 'react-native-gesture-handler';
import { Firebase, FirebaseProvider } from './config/Firebase/';
import { Provider } from 'react-redux';
import { store } from './redux';

import RootNavigator from './navigation';

function App() {
    return (
        <FirebaseProvider value={Firebase}>
            <Provider store={store}>
                <RootNavigator />
            </Provider>
        </FirebaseProvider>
    );
}

export default App;
