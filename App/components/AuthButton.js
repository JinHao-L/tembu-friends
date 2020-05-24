import React from 'react';
import { TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../constants';
import { MainText } from './MyAppText';

const AuthButton = (property) => {
    const { style, onPress, loading, children, ...others } = property;
    return (
        <TouchableOpacity {...others} style={[styles.container, style]} onPress={onPress}>
            {loading ? (
                <View>
                    <ActivityIndicator size="small" color="white" />
                </View>
            ) : (
                <MainText style={styles.text}> {children} </MainText>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.button,
        borderRadius: 5,
        paddingHorizontal: 5,
        paddingVertical: 7,
    },
    text: {
        fontSize: 14,
        color: 'white',
        textAlign: 'center',
    },
});

export default AuthButton;
