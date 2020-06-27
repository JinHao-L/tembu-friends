import React from 'react';
import { View, StyleSheet, Image, Platform } from 'react-native';
import { Avatar, Icon } from 'react-native-elements';
import { BaseButton } from 'react-native-gesture-handler';
import { Colors } from '../constants';
import { MainText } from './MyAppText';

const UserItem = ({
    name,
    profileImg,
    subtext,
    onPress,
    style,
    outerContainerStyle,
    textStyle,
    subtextStyle,
    chevron,
    ...others
}) => {
    return (
        <View style={[styles.outerContainer, outerContainerStyle]}>
            <BaseButton
                style={[styles.container, style]}
                onPress={onPress}
                underlayColor={Colors.appGray}
                rippleColor={Colors.appGray}
                {...others}
            >
                <View style={styles.contents}>
                    <Avatar
                        rounded
                        size={40}
                        title={name[0]}
                        source={
                            profileImg
                                ? { uri: profileImg }
                                : require('../assets/images/default/profile.png')
                        }
                        containerStyle={styles.profileContainer}
                    />

                    <View style={styles.textContainer}>
                        <MainText style={[styles.text, textStyle]}>{name}</MainText>
                        {subtext && (
                            <MainText style={[styles.subtext, subtextStyle]}>{subtext}</MainText>
                        )}
                    </View>
                </View>
            </BaseButton>
        </View>
    );
};

const chevronDefaultProps = {
    type: Platform.OS === 'ios' ? 'ionicon' : 'material',
    color: Colors.appGray,
    name: Platform.OS === 'ios' ? 'ios-arrow-forward' : 'keyboard-arrow-right',
    size: 16,
};

const styles = StyleSheet.create({
    outerContainer: {
        marginBottom: 12,
        borderRadius: 16,
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
    },
    container: {
        backgroundColor: Colors.appWhite,
        paddingHorizontal: 5,
        paddingVertical: 7,
        alignItems: 'flex-start',
        justifyContent: 'center',
        borderRadius: 15,
    },
    contents: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    textContainer: {
        justifyContent: 'center',
        flexDirection: 'column',
        alignSelf: 'center',
    },
    text: {
        fontSize: 18,
        color: Colors.appGreen,
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
    subtext: {
        fontSize: 13,
        color: Colors.appBlack,
    },
});

export default UserItem;
