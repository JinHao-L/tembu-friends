import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import { Colors } from '../constants';
import { MainText } from './MyAppText';

const MenuButton = (property) => {
    const { style, onPress, children, ...others } = property;
    return (
        <RectButton
            {...others}
            style={[styles.container, style]}
            onPress={onPress}
            underlayColor={Colors.menuButtonUnderlay}
        >
            <View accessible>
                <MainText style={styles.text}> {children} </MainText>
            </View>
        </RectButton>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.menuButton,
        borderRadius: 5,
        paddingHorizontal: 5,
        paddingVertical: 7,
        marginBottom: 8,
    },
    text: {
        fontSize: 17,
        color: Colors.menuButtonText,
        textAlign: 'center',
    },
});

export default MenuButton;
