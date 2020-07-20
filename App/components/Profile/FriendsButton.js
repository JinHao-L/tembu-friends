import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

import { Colors } from '../../constants';
import { MAIN_FONT } from '../MyAppText';

function FriendsButton({ type = 'solid', title, onPress, loading }) {
    return (
        <Button
            containerStyle={styles.friendButtonContainer}
            buttonStyle={[
                styles.friendButton,
                type === 'solid'
                    ? { backgroundColor: Colors.appGreen }
                    : { borderColor: Colors.appGreen, borderWidth: 1 },
            ]}
            title={title}
            loading={loading}
            loadingProps={{ size: 12 }}
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
        marginRight: 20,
        borderRadius: 20,
        marginBottom: 5,
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

export default FriendsButton;
