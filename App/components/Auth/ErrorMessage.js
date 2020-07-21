import React from 'react';
import { StyleSheet } from 'react-native';

import { MainText } from '../Commons';
import { Colors } from '../../constants';

function ErrorMessage({ error, style }) {
    return <MainText style={[styles.errorText, style]}>{error}</MainText>;
}

const styles = StyleSheet.create({
    errorText: {
        fontSize: 12,
        textAlign: 'left',
        color: Colors.appRed,
        flexWrap: 'wrap',
    },
});

export default ErrorMessage;
