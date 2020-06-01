import * as React from 'react';
import { Text } from 'react-native';

export const MAIN_FONT = 'Montserrat-SemiBold';

export function LogoText({ style, ...props }) {
    return <Text {...props} style={[{ fontFamily: 'Futura-Medium-BT', fontSize: 13 }, style]} />;
}

export function MainText({ style, ...props }) {
    return <Text {...props} style={[{ fontFamily: MAIN_FONT, fontSize: 13 }, style]} />;
}
