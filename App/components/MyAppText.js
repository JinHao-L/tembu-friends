import * as React from 'react';
import { Text } from 'react-native';

export function LogoText({ style, ...props }) {
    return <Text {...props} style={[style, { fontFamily: 'Futura-Medium-BT' }]} />;
}

export function MainText({ style, ...props }) {
    return <Text {...props} style={[style, { fontFamily: 'Montserrat-SemiBold' }]} />;
}
