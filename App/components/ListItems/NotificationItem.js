import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';

import { MainText } from '../Commons';
import { Colors } from 'constant';

const timeDifference = (timestamp) => {
    if (timestamp) {
        const dateTime = timestamp.toDate();
        const current = new Date();
        const diff = Math.abs(current.getTime() - dateTime.getTime()) / 1000;

        const months = diff / (60 * 60 * 24 * 7 * 4);
        if (months >= 1) {
            return Math.abs(Math.round(months)) + 'm';
        }

        const weeks = months * 4;
        if (weeks >= 1) {
            return Math.abs(Math.round(weeks)) + 'w';
        }

        const days = weeks * 7;
        if (days >= 1) {
            return Math.abs(Math.round(days)) + 'd';
        }

        const hours = days * 24;
        if (hours >= 1) {
            return Math.abs(Math.round(hours)) + 'h';
        }

        const min = hours * 60;
        return Math.abs(Math.round(min)) + 'm';
    } else {
        return null;
    }
};

function NotificationItem({
    titleSpread = false,
    message,
    seen,
    timeCreated,
    accessoryIcon,
    avatarImg,
    avatarOnPress = undefined,
    onPress = () => null,
    onLongPress = undefined,
    subtitleElement = undefined,
}) {
    return (
        <ListItem
            containerStyle={seen ? styles.notificationItemSeen : styles.notificationItem}
            underlayColor={Colors.appGray2}
            onPress={onPress}
            onLongPress={onLongPress}
            testID={'listitem'}
        >
            <Avatar
                rounded
                size={50}
                source={
                    avatarImg ? { uri: avatarImg } : require('assets/images/default/profile.png')
                }
                onPress={avatarOnPress}
                overlayContainerStyle={{ backgroundColor: Colors.appWhite }}
                containerStyle={{ alignSelf: 'flex-start' }}
            >
                {accessoryIcon && (
                    <Avatar.Accessory
                        name={accessoryIcon}
                        type={'material-community'}
                        underlayColor={Colors.appWhite}
                        color={Colors.appWhite}
                        style={{ backgroundColor: Colors.appGreen, borderRadius: 50 }}
                    />
                )}
            </Avatar>
            <ListItem.Content style={{ alignContent: 'center', flexDirection: 'row' }}>
                <ListItem.Title style={{ color: Colors.appWhite }}>
                    {titleSpread ? (
                        <MainText style={styles.titleText}>
                            {message}
                            <MainText style={[styles.dateTimeText]}>
                                {timeDifference(timeCreated)}
                            </MainText>
                        </MainText>
                    ) : (
                        <MainText style={styles.titleText}>
                            {message}{' '}
                            <MainText style={styles.dateTimeText}>
                                {timeDifference(timeCreated)}
                            </MainText>
                        </MainText>
                    )}
                </ListItem.Title>
                <ListItem.Subtitle>{subtitleElement}</ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    );
}

const styles = StyleSheet.create({
    titleText: {
        color: Colors.appBlack,
        fontSize: 14,
        fontWeight: '600',
    },
    dateTimeText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.appGray5,
        marginLeft: 'auto',
    },
    notificationIconContainer: {
        marginRight: 12,
    },
    notificationItemSeen: {
        backgroundColor: Colors.appWhite,
        paddingVertical: 15,
    },
    notificationItem: {
        backgroundColor: 'rgba(52, 192, 128, 0.25)',
        paddingVertical: 15,
    },
});

export default NotificationItem;
