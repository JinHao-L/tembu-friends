import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

import { MAIN_FONT, Colors } from 'constant';

function GreenButton({
    type = 'solid',
    title,
    onPress,
    loading = false,
    containerStyle,
    minWidth,
}) {
    return (
        <Button
            containerStyle={[styles.friendButtonContainer, containerStyle]}
            buttonStyle={[
                styles.friendButton,
                minWidth ? { minWidth: minWidth } : {},
                type === 'solid'
                    ? { backgroundColor: Colors.appGreen }
                    : type === 'outline'
                    ? { backgroundColor: Colors.appWhite }
                    : {},
                minWidth ? { minWidth: minWidth } : {},
            ]}
            title={title}
            loading={loading}
            loadingProps={{
                size: 12,
                marginTop: 2,
                marginBottom: 1,
                color: type === 'solid' ? Colors.appWhite : Colors.appGreen,
            }}
            titleStyle={[
                styles.friendButtonText,
                type === 'outline' ? { color: Colors.appGreen } : { color: Colors.appWhite },
            ]}
            type={type}
            onPress={onPress}
        />
    );
}

const styles = StyleSheet.create({
    friendButtonContainer: {
        borderRadius: 20,
    },
    friendButton: {
        paddingVertical: 2,
        minWidth: 86,
        borderRadius: 20,
        paddingHorizontal: 0,
        alignItems: 'center',
        borderColor: Colors.appGreen,
        borderWidth: 1,
    },
    friendButtonText: {
        fontFamily: MAIN_FONT,
        fontSize: 12,
    },
});

export default GreenButton;
