import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import { Colors } from '../constants';
import { MainText } from './MyAppText';

const MenuButton = (property) => {
    const { type, link, style, onPress, children, textStyle, ...others } = property;
    return (
        <RectButton
            style={[styles.container, style]}
            onPress={onPress}
            underlayColor={Colors.appGray}
            rippleColor={Colors.appGray}
            {...others}
        >
            <View style={styles.contents} accessible>
                {link ? (
                    <Image source={{ uri: link }} style={styles.profilePicture} />
                ) : (
                    <Image source={getImage(type)} style={styles.image} />
                )}

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
        fontSize: 15,
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
