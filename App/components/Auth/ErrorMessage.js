import React from 'react';
import { View, StyleSheet } from 'react-native';

import { MainText } from '../MyAppText';
import { Colors } from '../../constants';

function ErrorMessage({ error, style }) {
    return (
        <View style={styles.container}>
            <MainText style={[styles.errorText, style]}>{error}</MainText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // marginHorizontal: 15,
    },
    errorText: {
        fontSize: 12,
        textAlign: 'left',
        color: Colors.appRed,
        flexWrap: 'wrap',
    },
});

export default ErrorMessage;
