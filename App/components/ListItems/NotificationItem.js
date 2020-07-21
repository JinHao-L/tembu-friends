import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ListItem } from 'react-native-elements';

import { MainText } from '../Commons';
import { Colors } from '../../constants';

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
            title={
                titleSpread ? (
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                        <MainText style={styles.titleText}>{message}</MainText>
                        <MainText style={[styles.dateTimeText]}>
                            {timeDifference(timeCreated)}
                        </MainText>
                    </View>
                ) : (
                    <MainText style={styles.titleText}>
                        {message}{' '}
                        <MainText style={styles.dateTimeText}>
                            {timeDifference(timeCreated)}
                        </MainText>
                    </MainText>
                )
            }
            titleStyle={{ color: Colors.appWhite }}
            underlayColor={Colors.appGray2}
            subtitle={subtitleElement}
            leftAvatar={{
                rounded: true,
                source: avatarImg
                    ? { uri: avatarImg }
                    : require('../../assets/images/default/profile.png'),
                showAccessory: !!accessoryIcon,
                accessory: {
                    name: accessoryIcon,
                    type: 'material-community',
                    underlayColor: Colors.appWhite,
                    color: Colors.appWhite,
                    style: { backgroundColor: Colors.appGreen, borderRadius: 50 },
                },
                size: 50,
                onPress: avatarOnPress,
                overlayContainerStyle: {
                    backgroundColor: Colors.appWhite,
                },
                containerStyle: {
                    alignSelf: 'flex-start',
                },
            }}
            onPress={onPress}
            onLongPress={onLongPress}
        />
    );
}

const styles = StyleSheet.create({
    titleText: {
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
