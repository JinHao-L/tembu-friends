import React from 'react';
import { Image } from 'react-native';

function AppLogo() {
    return (
        <Image
            source={require('../assets/images/logo.png')}
            style={{
                width: 100,
                height: 80,
                resizeMode: 'contain',
            }}
        />
    );
}

export default AppLogo;
