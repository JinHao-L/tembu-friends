import React from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';

import { Colors, MAIN_FONT } from 'constant';

const UserItem = ({ name, profileImg, onPress, style, textStyle, rightElement = undefined }) => {
    return (
        <ListItem
            containerStyle={[styles.outerContainer, style]}
            onPress={onPress}
            testID={'UserItem'}
        >
            <Avatar
                rounded={true}
                size={50}
                source={
                    profileImg ? { uri: profileImg } : require('assets/images/default/profile.png')
                }
            />
            <ListItem.Content style={{ alignContent: 'center' }}>
                <ListItem.Title style={[styles.text, textStyle]}>{name}</ListItem.Title>
            </ListItem.Content>
            {rightElement}
        </ListItem>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        borderBottomWidth: 3,
        borderColor: Colors.appGray2,
        paddingVertical: 8,
    },
    text: {
        fontFamily: MAIN_FONT,
        fontSize: 15,
        color: Colors.appBlack,
    },
    rightElementContainer: {
        marginLeft: 'auto',
    },
});

export default UserItem;
