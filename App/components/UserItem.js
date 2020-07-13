import React from 'react';
import { View, StyleSheet, Platform, TouchableNativeFeedback } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
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
    rightElement = () => null,
    ...others
}) => {
    return (
        <View style={[styles.outerContainer, outerContainerStyle]}>
            <TouchableNativeFeedback
                style={[styles.container, style]}
                onPress={onPress}
                background={TouchableNativeFeedback.Ripple(Colors.appGray, true)}
                // underlayColor={Colors.appGray}
                // rippleColor={Colors.appGray}
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
                        {subtext ? (
                            <MainText style={[styles.subtext, subtextStyle]}>{subtext}</MainText>
                        ) : null}
                    </View>
                    <View style={styles.rightElementContainer}>{rightElement()}</View>
                </View>
            </TouchableNativeFeedback>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        marginTop: 12,
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
        borderRadius: 15,
    },
    contents: {
        backgroundColor: Colors.appWhite,
        paddingHorizontal: 5,
        paddingVertical: 7,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        flexDirection: 'column',
        alignSelf: 'center',
        flex: 1,
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
        flexWrap: 'wrap',
    },
    rightElementContainer: {
        marginLeft: 'auto',
    },
});

export default UserItem;
