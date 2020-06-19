import React from 'react';
import { View, StyleSheet, Image, Platform } from 'react-native';
import { BaseButton } from 'react-native-gesture-handler';
import { Avatar } from 'react-native-elements';

import { Colors } from '../constants';
import { MainText } from './MyAppText';

const MenuButton = (property) => {
    const {
        type,
        avatar,
        avatarPlaceholder,
        style,
        borderStyle,
        backgroundColor,
        onPress,
        children,
        textStyle,
        ...others
    } = property;
    return (
        <View style={[styles.outerContainer, borderStyle]}>
            <BaseButton
                style={[styles.container, style]}
                onPress={onPress}
                underlayColor={Colors.appGray}
                rippleColor={Colors.appGray}
                {...others}
            >
                <View style={styles.contents}>
                    {avatar ? (
                        <Avatar
                            rounded
                            title={avatarPlaceholder}
                            source={{ uri: avatar }}
                            containerStyle={styles.profileContainer}
                        />
                    ) : type ? (
                        <Image
                            source={getImage(type)}
                            style={
                                type === 'Profile' ? styles.profileContainer : styles.imageContainer
                            }
                        />
                    ) : null}
                    <View style={styles.textContainer}>
                        <MainText style={[styles.text, textStyle]}>{children}</MainText>
                    </View>
                </View>
            </BaseButton>
        </View>
    );
};

const getImage = (img) => {
    switch (img) {
        case 'Profile':
            return require('../assets/images/DefaultProfile.png');
        case 'Friends':
            return require('../assets/images/FriendsIcon.png');
        case 'Settings':
            return require('../assets/images/SettingsIcon.png');
        case 'QRCode':
            return require('../assets/images/QRcode.png');
        case 'Default':
            return require('../assets/images/robot-prod.png');
    }
};

const styles = StyleSheet.create({
    outerContainer: {
        marginBottom: 12,
        borderRadius: 10,
        ...Platform.select({
            ios: {
                shadowColor: Colors.appBlack,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
            },
            android: {
                elevation: 5,
            },
        }),
        height: 50,
        margin: 1,
        borderWidth: 1,
        borderColor: Colors.appGray,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.appWhite,
        paddingHorizontal: 5,
        paddingVertical: 7,
        alignItems: 'flex-start',
        justifyContent: 'center',
        borderRadius: 10,
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
    imageContainer: {
        height: 30,
        width: 30,
        resizeMode: 'contain',
        marginVertical: 5,
        marginLeft: 8,
        marginRight: 10,
    },
    profileContainer: {
        height: 40,
        width: 40,
        marginVertical: 2,
        marginLeft: 4,
        marginRight: 6,
    },
});

export default MenuButton;
