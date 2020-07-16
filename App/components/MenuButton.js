import React from 'react';
import { View, StyleSheet, Image, Platform } from 'react-native';
import { BaseButton } from 'react-native-gesture-handler';
import { Avatar, Icon } from 'react-native-elements';

import { Colors } from '../constants';
import { MainText } from './MyAppText';

const MenuButton = (property) => {
    const {
        type,
        avatar,
        avatarPlaceholder,
        style,
        borderStyle,
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
                underlayColor={Colors.appGray2}
                rippleColor={Colors.appGray2}
                {...others}
            >
                <View style={styles.contents}>
                    {avatar || type === 'Profile' ? (
                        <Avatar
                            rounded
                            size={40}
                            title={avatarPlaceholder}
                            source={
                                avatar
                                    ? { uri: avatar }
                                    : require('../assets/images/default/profile.png')
                            }
                            containerStyle={styles.profileContainer}
                        />
                    ) : type === 'Admin' ? (
                        <Icon
                            type={'font-awesome-5'}
                            name={'users-cog'}
                            style={styles.imageContainer}
                            color={Colors.appGreen}
                        />
                    ) : type ? (
                        <Image source={getImage(type)} style={styles.imageContainer} />
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
        case 'Friends':
            return require('../assets/images/menu/FriendsIcon.png');
        case 'Settings':
            return require('../assets/images/menu/SettingsIcon.png');
        case 'QRCode':
            return require('../assets/images/menu/QRcode.png');
        case 'Default':
            return null;
    }
};

const styles = StyleSheet.create({
    outerContainer: {
        marginBottom: 15,
        borderRadius: 11,
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
        borderColor: Colors.appGray2,
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
        marginVertical: 2,
        marginLeft: 4,
        marginRight: 6,
    },
});

export default MenuButton;
