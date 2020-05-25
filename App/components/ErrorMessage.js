import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { MainText } from './MyAppText';
import { Colors } from '../constants/index';

function ErrorMessage({ error }) {
    return (
        <View style={styles.container}>
            <MainText style={styles.errorText}>{error}</MainText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 15,
    },
    errorText: {
        fontSize: 12,
        textAlign: 'center',
        color: Colors.errorText,
        flexWrap: 'wrap',
    },
});

export default ErrorMessage;
