import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

import { Colors } from '../../constants';
import { MAIN_FONT } from '../Commons';

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
                    ? { borderColor: Colors.appGreen, borderWidth: 1 }
                    : {},
            ]}
            title={title}
            loading={loading}
            loadingProps={{ size: 12, marginTop: 2, marginBottom: 1, color: Colors.appGreen }}
            titleStyle={[
                styles.friendButtonText,
                type === 'outline' ? { color: Colors.appGreen } : {},
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
    },
    friendButtonText: {
        fontFamily: MAIN_FONT,
        fontSize: 12,
    },
});

export default GreenButton;
