import React from 'react';
import { LogBox } from 'react-native';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';

import { Firebase, FirebaseProvider } from './helper/Firebase/';
import store from './redux/AppRedux';
import RootNav from './navigation';

LogBox.ignoreLogs(['Setting a timer']);
function App() {
    return (
        <Provider store={store}>
            <FirebaseProvider value={Firebase}>
                <RootNav />
            </FirebaseProvider>
        </Provider>
    );
}

export default App;
