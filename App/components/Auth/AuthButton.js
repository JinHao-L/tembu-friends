import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

import { Colors, MAIN_FONT } from 'constant';

const AuthButton = (property) => {
    const { style, onPress, loading, children, ...others } = property;
    return (
        <Button
            buttonStyle={[styles.container, style]}
            disabled={loading}
            loading={loading}
            loadingProps={{ size: 'small', color: Colors.appGreen }}
            title={children}
            titleStyle={styles.text}
            onPress={onPress}
            {...others}
            testID={'AuthButton'}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 5,
        paddingHorizontal: 5,
        paddingVertical: 7,
        backgroundColor: Colors.appGreen,
    },
    text: {
        fontFamily: MAIN_FONT,
        fontSize: 15,
        fontWeight: '600',
        color: Colors.appWhite,
        textAlign: 'center',
    },
});

export default AuthButton;
