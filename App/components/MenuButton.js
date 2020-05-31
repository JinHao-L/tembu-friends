import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import { Colors } from '../constants';
import { MainText } from './MyAppText';

const MenuButton = (property) => {
    const { img, style, onPress, children, textStyle, ...others } = property;
    return (
        <RectButton
            {...others}
            style={[styles.container, style]}
            onPress={onPress}
            underlayColor={Colors.menuButtonUnderlay}
        >
            <View style={styles.contents} accessible>
                <Image
                    source={getImage(img)}
                    style={img === 'Profile' ? styles.profilePicture : styles.image}
                />
                <View style={styles.textContainer}>
                    <MainText style={[styles.text, textStyle]}> {children} </MainText>
                </View>
            </View>
        </RectButton>
    );
};

const getImage = (img) => {
    switch (img) {
        case 'Friends':
            return require('../assets/images/FriendsIcon.png');
        case 'Settings':
            return require('../assets/images/SettingsIcon.png');
        case 'Profile':
            return require('../assets/images/Profile.png');
        default:
            return require('../assets/images/robot-prod.png');
    }
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.appWhite,
        height: 60,
        borderRadius: 5,
        paddingHorizontal: 5,
        paddingVertical: 7,
        marginBottom: 8,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    contents: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    textContainer: {
        justifyContent: 'center',
    },
    text: {
        fontSize: 18,
        color: Colors.appBlack,
        textAlign: 'left',
        textAlignVertical: 'center',
    },
    image: {
        height: 40,
        width: 40,
        resizeMode: 'contain',
        margin: 10,
    },
    profilePicture: {
        height: 50,
        width: 50,
        resizeMode: 'cover',
        borderRadius: 25,
        margin: 5,
    },
});

export default MenuButton;
