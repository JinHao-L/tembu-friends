import * as React from 'react';
import { Text } from 'react-native';

export function LogoText({ style, ...props }) {
    return <Text {...props} style={[{ fontFamily: 'Futura-Medium-BT', fontSize: 12 }, style]} />;
}

export function MainText({ style, ...props }) {
    return <Text {...props} style={[{ fontFamily: 'Montserrat-SemiBold', fontSize: 13 }, style]} />;
}
