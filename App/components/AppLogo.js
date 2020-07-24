import React from 'react';
import { Image } from 'react-native';

function AppLogo({ style }) {
    return (
        <Image source={require('assets/images/logo.png')} style={style} resizeMode={'contain'} />
    );
}

export default AppLogo;
