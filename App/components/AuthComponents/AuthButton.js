import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Colors } from '../../constants';
import { MainText } from '../MyAppText';

const AuthButton = (property) => {
    const { style, onPress, loading, children, ...others } = property;
    return (
        <TouchableOpacity
            {...others}
            style={[
                styles.container,
                { backgroundColor: loading ? Colors.appGray : Colors.appGreen },
                style,
            ]}
            onPress={onPress}
        >
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
        borderRadius: 5,
        paddingHorizontal: 5,
        paddingVertical: 7,
    },
    text: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.appWhite,
        textAlign: 'center',
    },
});

export default AuthButton;
