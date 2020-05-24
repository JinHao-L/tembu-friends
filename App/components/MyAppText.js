import * as React from 'react';
import { Text } from 'react-native';

export const textStyles = {
    fontFamily: 'futura-md',
    fontWeight: 'normal',
    fontSize: 16,
};
export function MonoText({ style, ...props }) {
    return <Text {...props} style={[style, { fontFamily: 'space-mono' }]} />;
}

export function MainText({ style, ...props }) {
    return <Text {...props} style={[textStyles, style]} />;
}
