import React from 'react';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';

import { Firebase, FirebaseProvider } from './helper/Firebase/';
import { store } from './redux';
import RootNav from './navigation';

console.ignoredYellowBox = ['Setting a timer'];
function App() {
    return (
        <FirebaseProvider value={Firebase}>
            <Provider store={store}>
                <RootNav />
            </Provider>
        </FirebaseProvider>
    );
}

export default App;
