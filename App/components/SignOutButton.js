import { TouchableOpacity, StyleSheet } from 'react-native';
import firebase from 'firebase';
import React from 'react';

export default function SignOutButton(props) {
    const { style } = props;
    return (
        <TouchableOpacity
            {...props}
            style={[style, styles.signOutButton]}
            onPress={async () => {
                await firebase.auth().signOut();
            }}
        />
    );
}

const styles = StyleSheet.create({
    signOutButton: {
        borderRadius: 30,
        marginTop: 10,
        marginBottom: 10,
        width: 160,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#481380',
    },
});
