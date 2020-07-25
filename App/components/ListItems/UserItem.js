import React from 'react';
import { StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';

import { Colors, MAIN_FONT } from 'constant';

const UserItem = ({ name, profileImg, onPress, style, textStyle, rightElement = undefined }) => {
    return (
        <ListItem
            containerStyle={[styles.outerContainer, style]}
            leftAvatar={{
                rounded: true,
                size: 50,
                source: profileImg
                    ? { uri: profileImg }
                    : require('assets/images/default/profile.png'),
            }}
            title={name}
            titleStyle={[styles.text, textStyle]}
            rightElement={rightElement}
            onPress={onPress}
            testID={'UserItem'}
        />
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
