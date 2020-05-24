import React, { useState } from 'react';
import 'react-native-gesture-handler';
import { Firebase, FirebaseProvider } from './config/Firebase/';

import RootNavigator from './navigation';

function App() {
    return (
        <FirebaseProvider value={Firebase}>
            <RootNavigator />
        </FirebaseProvider>
    );
}

export default App;
